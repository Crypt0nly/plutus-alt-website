import { readFileSync } from 'node:fs';
import { load } from 'cheerio';
import { contentPages } from '../../content/pages.js';

export const ORIGIN = 'https://ocur.ai';
const sourceHome = load(readFileSync(new URL('../../index.html', import.meta.url), 'utf8'));
const identity = JSON.parse(sourceHome('script[type="application/ld+json"]').first().text())['@graph'];
export const contentRoutes = contentPages.flatMap((page) => ['en', 'de'].map((lang) => ({
  ...page[lang], lang, path: `${lang === 'de' ? '/de' : ''}${page.path}`, sibling: page.path,
})));

const escape = (text) => String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const homePath = (lang) => lang === 'de' ? '/de' : '/';
export const canonicalPath = (path) => path === '/' ? '/' : path.replace(/\/+$/, '');
export const canonicalUrl = (path) => ORIGIN + canonicalPath(path);
export const htmlPath = (path) => path === '/' ? 'index.html' : `${canonicalPath(path).slice(1)}/index.html`;
export const markdownPath = (path) => path === '/' ? '/index.md' : `${canonicalPath(path)}.md`;

export function languageLinks(en, de, lang) {
  return `<div class="g-lang" role="group" aria-label="${lang === 'de' ? 'Sprache' : 'Language'}">${[['en', en], ['de', de]].map(([code, url]) =>
    `<a href="${escape(new URL(url, ORIGIN).pathname)}" lang="${code}" hreflang="${code}"${code === lang ? ' class="on" aria-current="true"' : ''}>${code.toUpperCase()}</a>`).join('')}</div>`;
}

function resourceLinks(lang) {
  return contentRoutes.filter((page) => page.lang === lang).map((page) => `<a href="${page.path}">${escape(page.label)}</a>`).join('');
}

export function enrichPage(html) {
  const $ = load(html);
  const lang = $('html').attr('lang') === 'de' ? 'de' : 'en';
  const canonical = $('link[rel="canonical"]').attr('href');
  if (!canonical) throw new Error('Every public page needs a canonical URL');
  const url = canonicalUrl(new URL(canonical).pathname);

  // Normalize internal URLs alongside Vercel's trailingSlash:false setting.
  $('a[href], link[href], meta[property="og:url"]').each((_, element) => {
    const attr = element.tagName === 'meta' ? 'content' : 'href';
    const value = $(element).attr(attr);
    if (!value || !(value.startsWith('/') || value.startsWith(ORIGIN))) return;
    const parsed = new URL(value, ORIGIN);
    if (parsed.origin !== ORIGIN) return;
    parsed.pathname = canonicalPath(parsed.pathname);
    $(element).attr(attr, value.startsWith(ORIGIN) ? parsed.href : parsed.pathname + parsed.search + parsed.hash);
  });
  if (!$('meta[name="robots"]').length) {
    $('head').append('<meta name="robots" content="index, follow, max-image-preview:large" />');
  }

  const en = $('link[rel="alternate"][hreflang="en"]').attr('href');
  const de = $('link[rel="alternate"][hreflang="de"]').attr('href');
  const nav = $('.g-nav');
  if (en && de && nav.length) {
    nav.children('.g-lang').remove();
    nav.find('.g-btn-sm').first().before(languageLinks(en, de, lang));
    const mobile = $('#g-menu .g-menu-foot');
    mobile.children('.g-lang').remove();
    mobile.append(languageLinks(en, de, lang));
  }

  const title = $('title').text();
  const description = $('meta[name="description"]').attr('content');
  const app = structuredClone(identity.find((node) => node['@type'] === 'SoftwareApplication'));
  app.inLanguage = ['en', 'de'];
  if (lang === 'de') app.description = 'Ocur ist das KI-Betriebssystem für Unternehmen. Es beantwortet E-Mails und Anrufe, arbeitet in verbundenen Tools und führt Zusagen, Geld, Pipeline und Lagerbestand als lebende Register — auf Anfrage oder im Autopilot.';
  const website = { '@type': 'WebSite', '@id': `${ORIGIN}/#website`, url: `${ORIGIN}/`, name: 'Ocur', alternateName: ['OcurAI', 'Ocur AI'], inLanguage: ['en', 'de'], publisher: { '@id': `${ORIGIN}/#organization` } };
  const webpage = { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description, inLanguage: lang, isPartOf: { '@id': website['@id'] }, about: { '@id': app['@id'] }, publisher: website.publisher };
  if (new URL(url).pathname === homePath(lang)) webpage.mainEntity = { '@id': app['@id'] };
  const graph = [structuredClone(identity.find((node) => node['@type'] === 'Organization')), website, app, webpage];
  const route = contentRoutes.find((page) => canonicalUrl(page.path) === url);
  if (route) {
    const breadcrumbs = { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumbs`, itemListElement: [
      { '@type': 'ListItem', position: 1, name: lang === 'de' ? 'Startseite' : 'Home', item: canonicalUrl(homePath(lang)) },
      { '@type': 'ListItem', position: 2, name: route.label, item: url },
    ] };
    graph.push(breadcrumbs);
    webpage.breadcrumb = { '@id': breadcrumbs['@id'] };
  }
  // Replace the existing identity graph, preserving unrelated structured data.
  $('script[type="application/ld+json"]').each((_, element) => {
    const value = JSON.parse($(element).text());
    if ($(element).attr('data-discovery-schema') || value['@graph']?.some((node) => node['@id'] === app['@id'])) $(element).remove();
  });
  $('head').append(`<script type="application/ld+json" data-discovery-schema>${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`);

  // These are useful navigation for visitors as well as links for crawlers.
  $('.d-resource-links').remove();
  $('.g-foot').append(`<nav class="d-resource-links" aria-label="${lang === 'de' ? 'Produkt und Anwendungsfälle' : 'Product and use cases'}">${resourceLinks(lang)}</nav>`);
  $('.d-resources').remove();
  if (new URL(url).pathname === homePath(lang)) {
    const cards = contentRoutes.filter((page) => page.lang === lang).map((page) => `<a class="d-card lg" href="${page.path}"><h3>${escape(page.label)}</h3><p>${escape(page.description)}</p><span>${lang === 'de' ? 'Mehr erfahren' : 'Explore the workflow'} →</span></a>`).join('');
    $('.g-final').before(`<section class="d-resources" aria-labelledby="d-resources-title"><div class="g-wrap"><h2 id="d-resources-title">${lang === 'de' ? 'Ein genauerer Blick auf die Arbeit.' : 'A closer look at the work.'}</h2><p>${lang === 'de' ? 'Wie Ocur arbeitet, was du verbinden kannst und wie du mit einer konkreten Aufgabe beginnst.' : 'How Ocur works, what you can connect, and how to start with a specific job.'}</p><div class="d-grid">${cards}</div></div></section>`);
  }
  return $.html();
}

export function renderContentPage(page, assetTags = '<script type="module" src="/src/legal.js"></script>') {
  const { lang, path, sibling, title, description, heading, intro, sections } = page;
  const de = lang === 'de';
  const home = homePath(lang);
  const locale = de ? 'de_DE' : 'en_US';
  // Same theme, layout, scripts and brand as the existing reading pages.
  return enrichPage(`<!doctype html><html lang="${lang}"><head>
    <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#060608" /><meta name="application-name" content="Ocur" />
    <title>${escape(title)}</title><meta name="description" content="${escape(description)}" />
    <link rel="canonical" href="${canonicalUrl(path)}" />
    <link rel="alternate" hreflang="en" href="${canonicalUrl(sibling)}" />
    <link rel="alternate" hreflang="de" href="${canonicalUrl('/de' + sibling)}" />
    <link rel="alternate" hreflang="x-default" href="${canonicalUrl(sibling)}" />
    <meta property="og:type" content="website" /><meta property="og:site_name" content="Ocur" />
    <meta property="og:title" content="${escape(title)}" /><meta property="og:description" content="${escape(description)}" />
    <meta property="og:url" content="${canonicalUrl(path)}" /><meta property="og:locale" content="${locale}" />
    <meta property="og:locale:alternate" content="${de ? 'en_US' : 'de_DE'}" />
    <meta property="og:image" content="${ORIGIN}/og${de ? '-de' : ''}.jpg?v=2" />
    <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:site" content="@ocur_ai" />
    <meta name="twitter:title" content="${escape(title)}" /><meta name="twitter:description" content="${escape(description)}" />
    <meta name="twitter:image" content="${ORIGIN}/og${de ? '-de' : ''}.jpg?v=2" />
    <link rel="icon" href="/favicon.ico" sizes="48x48" /><link rel="icon" href="/logo.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
    <script>try{var t=localStorage.getItem('ocur-theme');document.documentElement.dataset.theme=t==='light'||t==='dark'?t:matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}</script>
    ${assetTags}
  </head><body class="g d-page"><div class="g-grain" aria-hidden="true"></div>
    <header class="g-nav lg glare" id="g-nav"><a class="g-brand" href="${home}"><img src="/logo.svg" alt="" /> Ocur</a>
      <nav class="g-links" aria-label="${de ? 'Hauptnavigation' : 'Primary'}"><a href="${home}">${de ? 'Startseite' : 'Home'}</a><a href="${de ? '/de' : ''}/product">${de ? 'Produkt' : 'Product'}</a><a href="${de ? '/de' : ''}/integrations">${de ? 'Integrationen' : 'Integrations'}</a><a href="${home}#pricing">${de ? 'Preise' : 'Pricing'}</a></nav>
      <a class="g-btn g-btn-sm" href="https://app.ocur.ai/?auth=sign-up">${de ? 'Kostenlos starten' : 'Start free'}</a>
    </header>
    <main class="l-page"><div class="l-glow" aria-hidden="true"></div><div class="g-wrap">
      <nav class="d-breadcrumb" aria-label="${de ? 'Seitenpfad' : 'Breadcrumb'}"><a href="${home}">${de ? 'Startseite' : 'Home'}</a> / <span aria-current="page">${escape(page.label)}</span></nav>
      <div class="l-head"><p class="l-eyebrow">${escape(page.label)}</p><h1 class="l-h1">${escape(heading)}</h1><p class="l-lede">${escape(intro)}</p></div>
      <div class="l-layout"><nav class="l-toc lg" aria-label="${de ? 'Inhalt' : 'Contents'}"><h2>${de ? 'Inhalt' : 'Contents'}</h2><ol>${sections.map(([label], index) => `<li><a href="#section-${index + 1}">${escape(label)}</a></li>`).join('')}</ol></nav>
      <article class="l-prose">${sections.map(([label, body], index) => `<section id="section-${index + 1}"><h2>${escape(label)}</h2>${body}</section>`).join('')}
      <div class="d-cta lg"><h2>${de ? 'Mit einer Aufgabe beginnen.' : 'Start with one job.'}</h2><p>${de ? 'Der kostenlose Tarif ist für Einzelpersonen ohne Bewerbung und ohne Kreditkarte zugänglich. Geplante Arbeit und Telefonfunktionen benötigen einen passenden kostenpflichtigen Tarif.' : 'The free solo plan is open without an application or credit card. Scheduled work and phone features need a suitable paid plan.'}</p><a class="g-btn" href="https://app.ocur.ai/?auth=sign-up">${de ? 'Kostenlos starten' : 'Start free'}</a></div></article></div>
      <footer class="g-foot"><span>Ocur © 2026 · OcurAI, Inc.</span><nav class="g-foot-links" aria-label="${de ? 'Weiterführende Links' : 'Footer links'}"><a href="${de ? '/de' : ''}/privacy">${de ? 'Datenschutz' : 'Privacy Policy'}</a><a href="${de ? '/de' : ''}/terms">${de ? 'AGB' : 'Terms of Service'}</a><a href="${de ? '/de' : ''}/data">${de ? 'Wohin deine Daten gehen' : 'Where your data goes'}</a>${de ? '<a href="/de/impressum">Impressum</a>' : ''}</nav></footer>
    </div></main>
  </body></html>`);
}

export function pageMarkdown(html) {
  const $ = load(html);
  const url = $('link[rel="canonical"]').attr('href');
  const main = $('main').clone();
  main.find('script, style, svg, form, nav, footer, button, .d-resources, .g-glow, .l-glow').remove();
  const inline = (node) => {
    if (node.type === 'text') return node.data.replace(/\s+/g, ' ');
    const value = (node.children || []).map(inline).join('');
    const tag = node.tagName;
    if (/^h[1-6]$/.test(tag || '')) return `\n\n${'#'.repeat(Number(tag[1]))} ${value.trim()}\n\n`;
    if (tag === 'a' && node.attribs.href) return `[${value.trim()}](${new URL(node.attribs.href, url).href})`;
    if (tag === 'br') return '\n';
    if (tag === 'li') return `\n- ${value.trim()}\n`;
    if (tag === 'strong' || tag === 'b') return `**${value.trim()}**`;
    if (['p', 'section', 'div', 'details', 'ul', 'ol', 'article', 'tr'].includes(tag)) return `\n\n${value.trim()}\n\n`;
    return value;
  };
  return `<!-- Source: ${url} -->\n\n${main.toArray().map(inline).join('').replace(/\n[ \t]+/g, '\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}
