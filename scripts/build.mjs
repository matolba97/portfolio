import { cp, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { copy, profile, projects } from '../src/content.mjs';
import { illustration, motif } from '../src/illustration.mjs';

const languages = ['en', 'ar'];
const icon = '<span class="arrow" aria-hidden="true">→</span>';
const external = '<span aria-hidden="true">↗</span>';
const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escape = (text) => String(text).replace(/[&<>"']/g, char => entities[char]);
const route = (lang, slug = '') => (lang === 'ar' ? 'ar/' : '') + (slug ? 'work/' + slug + '/' : '');
const languageLink = (lang, slug) => lang === 'ar' ? route('en', slug) + '?lang=en' : route('ar', slug);
const rootPath = (page) => '../'.repeat(page.split('/').filter(Boolean).length) || './';
const link = (href, title, style = '', marker = '') => `<a class="${style}" href="${escape(href)}">${escape(title)}${marker}</a>`;

function footer(lang, root) {
  const t = copy[lang];
  return `<footer class="footer" id="contact"><div class="wrap footer-grid">
    <div><p class="kicker">${t.contact}</p><h2>${t.contactTitle}</h2><p>${t.contactBody}</p></div>
    <div class="contact-links">
      ${link('mailto:' + profile.email, t.email, 'button light', external)}
      ${link(profile.linkedin, 'LinkedIn', 'button ghost', external)}
      ${link(profile.github, 'GitHub', 'button ghost', external)}
    </div>
    <div class="footer-bottom"><span>${profile[lang]} · ${t.role}</span>${link(root + route(lang), t.home, 'text-link', icon)}</div>
  </div></footer>`;
}

function screenshot(project, lang, root, loading = 'lazy') {
  return `<img class="report-image" src="${root}assets/${project.image}.png" alt="${escape(project[lang].image)}" loading="${loading}" decoding="async">`;
}

function work(lang, root) {
  const t = copy[lang];
  return `<section id="work" class="wrap section work"><div class="section-head"><p class="kicker">${t.selected}</p><h2>${t.workTitle}</h2></div>
    ${projects.map(project => {
      const p = project[lang];
      const href = root + route(lang, project.slug);
      return `<article class="project ${project.color}" data-reveal>
        <a class="project-preview" href="${href}" aria-label="${escape(p.title)}">${screenshot(project, lang, root)}</a>
        <div class="project-copy"><p class="kicker">${p.category}</p><h3><bdi>${p.title}</bdi></h3><p class="question">${p.question}</p>
        <ul class="tags" aria-label="${t.toolkit}">${project.tools.map(tool => `<li><bdi>${tool}</bdi></li>`).join('')}</ul>
        <div class="links">${link(href, t.caseStudy, 'text-link', icon)}${link(project.demo, t.demo, 'text-link', external)}</div></div>
      </article>`;
    }).join('')}</section>`;
}

function home(lang, root) {
  const t = copy[lang];
  return `<main id="main" tabindex="-1">
    <section class="wrap hero">
      <div class="hero-copy"><p class="kicker hero-role"><span></span>${t.role}</p>
        <h1>${t.headline[0]} <em>${t.headline[1]}</em></h1><p class="intro">${t.intro}</p>
        <div class="links">${link('#work', t.browse, 'button primary', icon)}${link('#process', t.process, 'text-link', icon)}</div></div>
      ${illustration(t.illustration)}
    </section>
    <section class="process" id="process"><div class="wrap section">
      <div class="section-head"><p class="kicker">${t.process}</p><h2>${t.processTitle}</h2></div>
      <ol class="steps">${t.steps.map(([title, body], i) => `<li data-reveal>${motif(i)}<h3>${title}</h3><p>${body}</p></li>`).join('')}</ol>
    </div></section>
    ${work(lang, root)}
    <section class="about" id="about"><div class="wrap section about-grid">
      <div><p class="kicker">${t.about}</p><h2>${t.aboutTitle}</h2><p class="about-body">${t.aboutBody}</p><p class="location">${t.location}</p></div>
      <div class="toolkit"><h3>${t.toolkit}</h3><dl>${t.toolkitGroups.map(([label, tools]) => `<div><dt>${label}</dt><dd dir="ltr">${tools}</dd></div>`).join('')}</dl></div>
    </div></section>
  </main>`;
}

function caseStudy(lang, root, project) {
  const t = copy[lang];
  const p = project[lang];
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  const section = (key, href) => `<section><h2>${t[key]}</h2><p>${p[key]}</p>${href ? link(href, key === 'data' ? t.source : t.evidence, 'text-link', external) : ''}</section>`;
  return `<main id="main" tabindex="-1" class="wrap case">
    <div class="case-lead">${link(root + route(lang) + '#work', t.all, 'text-link back', icon)}
      <p class="kicker">${p.category}</p><h1><bdi>${p.title}</bdi></h1><p class="intro">${p.question}</p>
      <div class="links">${link(project.demo, t.demo, 'button primary', external)}${link(project.repo, t.repo, 'text-link', external)}</div>
    </div>
    <figure class="case-figure ${project.color}">${screenshot(project, lang, root, 'eager')}<figcaption>${t.capture}</figcaption></figure>
    <div class="case-grid">
      <div class="case-body">
        ${section('context')}${section('data', project.source)}${section('method')}
        <section class="finding"><p class="kicker">${t.finding}</p><div class="stat"><bdi>${project.stat}</bdi></div><h2>${p.stat}</h2><p>${p.finding}</p>${link(project.evidence, t.evidence, 'text-link', external)}</section>
        ${section('implication')}${section('limit')}
      </div>
      <aside class="case-aside"><h2>${t.toolkit}</h2><ul class="tags">${project.tools.map(tool => `<li><bdi>${tool}</bdi></li>`).join('')}</ul></aside>
    </div>
    <a class="next-case" href="${root + route(lang, next.slug)}"><span><span class="kicker">${t.next}</span><strong><bdi>${next[lang].title}</bdi></strong></span>${icon}</a>
  </main>`;
}

export function render(lang, project, origin) {
  const t = copy[lang];
  const slug = project?.slug;
  const page = route(lang, slug);
  const root = rootPath(page);
  const title = project ? project[lang].title + ' | ' + profile[lang] : profile[lang] + ' | ' + t.role;
  const description = project ? project[lang].question : t.description;
  const alternate = lang === 'en' ? 'ar' : 'en';
  const url = new URL(page, origin).href;
  const person = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: profile[lang], jobTitle: t.role, url, sameAs: [profile.github, profile.linkedin] }).replaceAll('<', '\\u003c');
  const socialImage = new URL('assets/social.png', origin).href;
  return `<!doctype html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escape(title)}</title><meta name="description" content="${escape(description)}"><meta name="theme-color" content="#f6f3e9">
  <link rel="canonical" href="${escape(url)}">
  ${languages.map(locale => `<link rel="alternate" hreflang="${locale}" href="${new URL(route(locale, slug), origin).href}">`).join('')}
  <meta property="og:type" content="${project ? 'article' : 'website'}"><meta property="og:locale" content="${lang === 'ar' ? 'ar_EG' : 'en_US'}">
  <meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${escape(url)}"><meta property="og:image" content="${socialImage}"><meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${root}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${root}assets/site.css">
  ${project ? '' : `<script type="application/ld+json">${person}</script>`}
  <script src="${root}assets/site.js" defer></script>
</head>
<body${project ? '' : ' data-home'}>
  ${link('#main', t.skip, 'skip')}
  <header class="mast"><div class="wrap mast-inner">
    <a class="brand" href="${root + route(lang)}"><img src="${root}assets/favicon.svg" width="39" height="39" alt=""><span>${profile[lang]}</span></a>
    <nav aria-label="${t.home}"><a href="${root + route(lang)}#work">${t.work}</a><a href="${root + route(lang)}#about">${t.about}</a><a href="#contact">${t.contact}</a></nav>
    <a class="language" data-language lang="${alternate}" hreflang="${alternate}" aria-label="${alternate === 'ar' ? 'العربية' : 'English'}" href="${root + languageLink(lang, slug)}">${alternate === 'ar' ? 'العربية' : 'EN'}</a>
  </div></header>
  ${project ? caseStudy(lang, root, project) : home(lang, root)}
  ${footer(lang, root)}
</body>
</html>`;
}

export async function build(output = 'dist', origin = 'https://matolba97.github.io/portfolio/') {
  if (!origin.endsWith('/')) origin += '/';
  await mkdir(output, { recursive: true });
  await cp('public', output, { recursive: true });
  const urls = [];
  for (const lang of languages) {
    for (const project of [undefined, ...projects]) {
      const page = route(lang, project?.slug);
      const destination = join(output, page, 'index.html');
      await mkdir(dirname(destination), { recursive: true });
      await writeFile(destination, render(lang, project, origin));
      urls.push(new URL(page, origin).href);
    }
  }
  await writeFile(join(output, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls.map(url => '<url><loc>' + escape(url) + '</loc></url>').join('') + '</urlset>\n');
  await writeFile(join(output, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + new URL('sitemap.xml', origin).href + '\n');
  await writeFile(join(output, '.nojekyll'), '');
  return urls;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const urls = await build('dist', process.env.PORTFOLIO_ORIGIN || undefined);
  console.log('Generated ' + urls.length + ' localized pages.');
}

