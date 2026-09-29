// Check the shipped output, not just source config: a readable source page
// is no help to a crawler if the build drops it, its links, or its assets.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { load } from 'cheerio';
import { ORIGIN, contentRoutes, htmlPath, markdownPath } from './lib/discovery.mjs';

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(join(dir, entry.name)) : entry.name.endsWith('.html') ? [join(dir, entry.name)] : []);
const pages = new Map();
for (const file of walk('dist')) {
  const html = readFileSync(file, 'utf8');
  const $ = load(html);
  const canonical = $('link[rel="canonical"]');
  assert.equal(canonical.length, 1, `${file}: exactly one canonical URL`);
  const url = new URL(canonical.attr('href'));
  assert.equal(url.origin, ORIGIN, `${file}: production domain`);
  assert.ok(url.pathname === '/' || !url.pathname.endsWith('/'), `${file}: no trailing slash`);
  assert.equal(url.search + url.hash, '', `${file}: canonical has no query or fragment`);
  assert.equal(file.replaceAll('\\', '/'), `dist/${htmlPath(url.pathname)}`, `${file}: canonical matches the emitted path`);
  assert.ok(!pages.has(url.href), `${file}: canonical is unique`);
  assert.ok($('title').text().trim() && $('meta[name="description"]').attr('content')?.trim(), `${file}: title and description`);
  assert.equal($('main h1').length, 1, `${file}: one visible main heading`);
  assert.ok($('main').text().trim().length > 200, `${file}: content is shipped as HTML`);
  assert.ok(!/\{\{[^}]+\}\}/.test(html), `${file}: no unfilled build tokens`);
  const robots = $('meta[name="robots"], meta[name="googlebot"]').toArray().map((node) => $(node).attr('content')).join(' ');
  assert.ok(!/noindex|nosnippet|nofollow/i.test(robots), `${file}: no indexing or snippet opt-out`);

  const graphs = $('script[type="application/ld+json"]').toArray().flatMap((node) => {
    const value = JSON.parse($(node).text());
    return value['@graph'] || [value];
  });
  for (const type of ['Organization', 'WebSite', 'SoftwareApplication', 'WebPage']) assert.equal(graphs.filter((node) => node['@type'] === type).length, 1, `${file}: one ${type}`);
  const webpage = graphs.find((node) => node['@type'] === 'WebPage');
  assert.equal(webpage.url, url.href, `${file}: schema URL matches canonical`);
  assert.equal(webpage.inLanguage, $('html').attr('lang'), `${file}: schema language matches HTML`);
  assert.equal($('meta[property="og:url"]').attr('content'), url.href, `${file}: social URL matches canonical`);
  for (const language of ['en', 'de']) {
    const alternate = $(`link[hreflang="${language}"]`).attr('href');
    if (!alternate) continue;
    assert.equal($('.g-nav > .g-lang').length, 1, `${file}: one static desktop switch`);
    assert.equal($(`.g-nav > .g-lang a[lang="${language}"]`).attr('href'), new URL(alternate).pathname, `${file}: real language link`);
  }
  if ($('#g-menu').length) assert.equal($('#g-menu .g-lang').length, 1, `${file}: one static mobile switch`);
  const md = `dist${markdownPath(url.pathname)}`;
  assert.ok(existsSync(md), `${file}: Markdown copy`);
  assert.ok(readFileSync(md, 'utf8').includes(url.href), `${file}: Markdown source attribution`);
  pages.set(url.href, { $, file, lang: $('html').attr('lang') });
}

for (const [url, { $, file, lang }] of pages) {
  for (const node of $('link[rel="alternate"][hreflang]').toArray()) {
    const alternate = $(node).attr('href');
    const target = pages.get(alternate);
    assert.ok(target, `${file}: alternate ${alternate} was built`);
    const targetLanguage = $(node).attr('hreflang');
    if (targetLanguage !== 'x-default') assert.equal(target.lang, targetLanguage, `${file}: alternate language`);
    assert.equal(target.$(`link[hreflang="${lang}"]`).attr('href'), url, `${file}: reciprocal alternate`);
  }
  for (const node of $('a[href], script[src], link[rel="stylesheet"][href], link[rel="modulepreload"][href], img[src]').toArray()) {
    const attr = $(node).attr('href') || $(node).attr('src');
    const destination = new URL(attr, url);
    if (destination.origin !== ORIGIN) continue;
    const path = destination.pathname;
    if (pages.has(ORIGIN + path)) {
      if (destination.hash) {
        const id = decodeURIComponent(destination.hash.slice(1));
        assert.ok(pages.get(ORIGIN + path).$.root().find('[id]').toArray().some((element) => pages.get(ORIGIN + path).$(element).attr('id') === id), `${file}: anchor ${attr} exists`);
      }
    } else {
      assert.ok(existsSync(join('dist', path.slice(1))), `${file}: internal link or asset ${attr} exists`);
    }
  }
}

const sitemap = load(readFileSync('dist/sitemap.xml', 'utf8'), { xmlMode: true });
const sitemapUrls = sitemap('url > loc').toArray().map((node) => sitemap(node).text());
assert.deepEqual([...sitemapUrls].sort(), [...pages.keys()].sort(), 'Sitemap includes every HTML page exactly once');
for (const node of sitemap('url').toArray()) {
  const url = sitemap(node).find('loc').text();
  const $ = pages.get(url).$;
  for (const alternate of sitemap(node).find('xhtml\\:link').toArray()) {
    assert.equal(sitemap(alternate).attr('href'), $(`link[hreflang="${sitemap(alternate).attr('hreflang')}"]`).attr('href'), 'Sitemap and HTML alternates agree');
  }
}
for (const page of contentRoutes) assert.ok(pages.has(ORIGIN + page.path), `${page.path}: product page was generated`);
const index = readFileSync('dist/llms.txt', 'utf8');
const full = readFileSync('dist/llms-full.txt', 'utf8');
for (const url of pages.keys()) {
  assert.ok(index.includes(`](${url})`), `${url}: llms index link`);
  assert.ok(full.includes(`Source: ${url}`), `${url}: full text copy`);
}
const robots = readFileSync('dist/robots.txt', 'utf8').replace(/\r\n/g, '\n');
for (const agent of ['*', 'OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot', 'Googlebot', 'bingbot']) assert.ok(robots.includes(`User-agent: ${agent}\n`), `${agent}: public crawl policy`);
assert.ok(!/^Disallow:\s*\/$/m.test(robots), 'Public crawling is allowed');
assert.ok(robots.includes('Sitemap: ' + ORIGIN + '/sitemap.xml'), 'Robots points to the generated sitemap');

const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
assert.equal(vercel.trailingSlash, false, 'Canonical URL style is enforced at the edge');
const www = vercel.redirects.find((rule) => rule.has?.some((condition) => condition.type === 'host'));
assert.ok(www.permanent && www.destination === ORIGIN + '/:path*', 'www has a permanent path-preserving redirect');
const host = new RegExp(`^(?:${www.has.find((condition) => condition.type === 'host').value})$`);
assert.ok(host.test('www.ocur.ai') && !host.test('ocur.ai') && !host.test('preview.vercel.app'), 'Domain redirect cannot loop or affect previews');
for (const rule of vercel.redirects.filter((rule) => rule.destination.startsWith('/'))) {
  assert.ok(pages.has(ORIGIN + rule.destination), `Redirect target ${rule.destination} is a canonical page`);
}
for (const rule of vercel.headers) {
  if (rule.headers.some((header) => header.key.toLowerCase() === 'x-robots-tag' && /noindex/i.test(header.value))) assert.ok(['/leads/api/:path*', '/be-ai/api/:path*'].includes(rule.source), 'noindex is limited to API responses');
}
console.log(`✓ discovery checks: ${pages.size} HTML pages, sitemap, reciprocal languages, schemas, static navigation, internal links/assets, Markdown, crawler rules and redirects`);
