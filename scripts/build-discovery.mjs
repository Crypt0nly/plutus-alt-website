import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { load } from 'cheerio';
import { ORIGIN, contentRoutes, renderContentPage, enrichPage, htmlPath, markdownPath, pageMarkdown } from './lib/discovery.mjs';

const dist = 'dist';
const builtData = load(readFileSync(join(dist, 'data/index.html'), 'utf8'));
const assets = builtData('head > script[src], head > link[rel="stylesheet"], head > link[rel="modulepreload"]').toArray().map((node) => builtData.html(node)).join('\n');
const write = (path, content) => { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, content); };
for (const page of contentRoutes) write(join(dist, htmlPath(page.path)), renderContentPage(page, assets));

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(join(dir, entry.name)) : entry.name.endsWith('.html') ? [join(dir, entry.name)] : []);
const pages = [];
for (const file of walk(dist).sort()) {
  const html = enrichPage(readFileSync(file, 'utf8'));
  writeFileSync(file, html);
  const $ = load(html);
  const url = $('link[rel="canonical"]').attr('href');
  const path = new URL(url).pathname;
  write(join(dist, markdownPath(path).slice(1)), pageMarkdown(html));
  pages.push({ url, path, lang: $('html').attr('lang'), title: $('title').text(), description: $('meta[name="description"]').attr('content'), alternates: $('link[rel="alternate"][hreflang]').toArray().map((node) => ({ lang: $(node).attr('hreflang'), href: $(node).attr('href') })), markdown: markdownPath(path) });
}
const xml = (text) => text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]));
write(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${pages.map((page) => `  <url>\n    <loc>${xml(page.url)}</loc>\n${page.alternates.map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${xml(alt.href)}" />`).join('\n')}\n  </url>`).join('\n')}\n</urlset>\n`);
const llms = ['# Ocur', '', '> Ocur is the AI operating system for companies: work across connected tools, shared company memory, live ledgers and approval controls.', '', 'This index links to public product and policy pages. Markdown copies are generated from the same HTML at build time. Current prices and plan conditions are on the homepage.'];
const readingOrder = ['/', ...contentRoutes.filter((page) => page.lang === 'en').map((page) => page.path), '/data', '/privacy', '/terms', '/impressum', '/be-ai'];
const priority = (page) => readingOrder.indexOf(page.path === '/de' ? '/' : page.path.replace(/^\/de\//, '/'));
for (const lang of ['en', 'de']) {
  llms.push('', `## ${lang === 'en' ? 'English' : 'Deutsch'}`, '');
  for (const page of pages.filter((page) => page.lang === lang).sort((a, b) => priority(a) - priority(b))) llms.push(`- [${page.title}](${page.url}): ${page.description} [Markdown](${ORIGIN}${page.markdown})`);
}
llms.push('', '## Full text', '', `- [Full public site text](${ORIGIN}/llms-full.txt): all indexed pages, generated from their HTML.`, '');
write(join(dist, 'llms.txt'), llms.join('\n'));
write(join(dist, 'llms-full.txt'), `# Ocur — public site content\n\n${pages.map((page) => `---\n\nSource: ${page.url}\nLanguage: ${page.lang}\n\n${readFileSync(join(dist, page.markdown.slice(1)), 'utf8')}`).join('\n')}`);
console.log(`✓ ${contentRoutes.length} product pages, ${pages.length} sitemap URLs and Markdown copies; llms.txt + llms-full.txt generated`);
