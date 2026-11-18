import { execFileSync } from 'node:child_process';
import { cp, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { copy, profile, projects } from '../src/content.mjs';
import { careerCopy, credentials, roles, tools } from '../src/career.mjs';
import { PortfolioHeader } from '../story/src/portfolio-header.mjs';

const requireStory = createRequire(new URL('../story/package.json', import.meta.url));
const { createElement } = requireStory('react');
const { renderToStaticMarkup } = requireStory('react-dom/server');

const languages = ['en', 'ar'];
const icon = '<span class="arrow" aria-hidden="true">→</span>';
const external = '<span aria-hidden="true">↗</span>';
const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escape = (text) => String(text).replace(/[&<>"']/g, char => entities[char]);
const route = (lang, slug = '') => (lang === 'ar' ? 'ar/' : '') + (slug ? 'work/' + slug + '/' : 'projects/');
const aboutRoute = (lang) => (lang === 'ar' ? 'ar/' : '') + 'about/';
const storyPath = (root, lang) => root + '?lang=' + lang;
const rootPath = (page) => '../'.repeat(page.split('/').filter(Boolean).length) || './';
const link = (href, title, style = '', marker = '') => `<a class="${style}" href="${escape(href)}">${escape(title)}${marker}</a>`;
const imageSizes = {
  hr: { original: [1920, 984], preview: [760, 390] },
  hospital: { original: [2602, 1334], preview: [760, 390] },
  commerce: { original: [3034, 1624], preview: [760, 407] },
};

function footer(lang, root) {
  const t = copy[lang];
  return `<footer class="footer" id="contact"><div class="wrap footer-grid">
    <div><p class="kicker">${t.contact}</p><h2>${t.contactTitle}</h2><p>${t.contactBody}</p></div>
    <div class="contact-links">
      ${link('mailto:' + profile.email, t.email, 'button light', external)}
      ${link(profile.linkedin, 'LinkedIn', 'button ghost', external)}
      ${link(profile.github, 'GitHub', 'button ghost', external)}
    </div>
    <div class="footer-bottom"><span>${profile[lang]} · ${t.role}</span>${link(storyPath(root, lang), t.home, 'text-link', icon)}</div>
  </div></footer>`;
}

function screenshot(project, root, variant, alt) {
  const [width, height] = imageSizes[project.image][variant];
  const preview = variant === 'preview';
  const filename = `${project.image}${preview ? '-preview' : ''}.png`;
  return `<img class="report-image" src="${root}assets/${filename}" width="${width}" height="${height}" alt="${escape(alt)}" loading="${preview ? 'lazy' : 'eager'}" decoding="async">`;
}

function work(lang, root) {
  const t = copy[lang];
  return `<main id="main" tabindex="-1" class="wrap section work"><div class="section-head"><h1>${t.projectsLink}</h1></div>
    ${projects.map(project => {
      const p = project[lang];
      const href = root + route(lang, project.slug);
      return `<article class="project">
        <div class="project-copy"><h2><bdi>${p.title}</bdi></h2><p class="project-category">${p.category}</p><p class="question">${p.question}</p>
        <ul class="tags" aria-label="${t.toolkit}">${project.tools.map(tool => `<li><bdi lang="en">${tool}</bdi></li>`).join('')}</ul>
        <div class="links">${link(href, t.caseStudy, 'text-link', icon)}${link(project.demo, t.demo, 'text-link', external)}</div></div>
        <a class="project-preview" href="${href}" aria-label="${escape(p.title)}">${screenshot(project, root, 'preview', p.image)}</a>
      </article>`;
    }).join('')}</main>`;
}

function about(lang) {
  const t = careerCopy[lang];
  return `<main id="main" tabindex="-1" class="wrap section career">
    <header class="career-lead"><h1>${t.heading}</h1><p class="intro">${t.intro}</p></header>
    <section class="career-experience" aria-labelledby="career-timeline">
      <h2 id="career-timeline">${t.experience}</h2>
      <ol class="career-timeline">
        ${roles.map(role => `<li>
          <p class="career-date"><bdi>${role.dates[lang]}</bdi></p>
          <div><h3>${lang === 'ar' ? `${role.titleAr} <span class="career-original-title"><bdi lang="en">${role.title}</bdi></span>` : role.title}</h3>
          <p><bdi lang="en">${role.company}</bdi>${role.place ? `<span class="career-place"> · ${role.place[lang]}</span>` : ''}</p></div>
        </li>`).join('')}
      </ol>
    </section>
    <div class="career-details">
      <section><h2>${t.toolkit}</h2><ul class="tags">${tools.map(tool => `<li><bdi lang="en">${tool}</bdi></li>`).join('')}</ul></section>
      <section><h2>${t.credentials}</h2><ul class="career-credentials">${credentials.map(credential => `<li><bdi lang="en">${credential.title}</bdi><time datetime="${credential.year}">${credential.year}</time></li>`).join('')}</ul></section>
    </div>
  </main>`;
}

function caseStudy(lang, root, project) {
  const t = copy[lang];
  const p = project[lang];
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  const section = (key, href) => `<section><h2>${t[key]}</h2><p>${p[key]}</p>${href ? link(href, key === 'data' ? t.source : t.evidence, 'text-link', external) : ''}</section>`;
  return `<main id="main" tabindex="-1" class="wrap case">
    <div class="case-lead">${link(root + route(lang), t.all, 'text-link back', icon)}
      <h1><bdi>${p.title}</bdi></h1><p class="project-category">${p.category}</p><p class="intro">${p.question}</p>
      <p class="case-takeaway"><strong><bdi>${project.stat}</bdi></strong> ${p.stat}</p>
      <div class="links">${link(project.demo, t.demo, 'button primary', external)}${link(project.repo, t.repo, 'text-link', external)}</div>
    </div>
    <figure class="case-figure">${screenshot(project, root, 'original', '')}<figcaption>
      <span>${escape(p.image)}</span>${link(`${root}assets/${project.image}.png`, t.fullImage, 'text-link')}
    </figcaption></figure>
    <div class="case-grid">
      <div class="case-body">
        ${section('context')}${section('data', project.source)}${section('method')}
        <section class="finding"><h2>${t.finding}</h2><p>${p.finding}</p>${link(project.evidence, t.evidence, 'text-link', external)}</section>
        ${section('implication')}${section('limit')}
      </div>
      <aside class="case-aside"><h2>${t.toolkit}</h2><ul class="tags">${project.tools.map(tool => `<li><bdi>${tool}</bdi></li>`).join('')}</ul></aside>
    </div>
    <a class="next-case" href="${root + route(lang, next.slug)}"><span><span class="kicker">${t.next}</span><strong><bdi>${next[lang].title}</bdi></strong></span>${icon}</a>
  </main>`;
}

export function render(lang, project, origin, isAbout = false) {
  const t = copy[lang];
  const slug = project?.slug;
  const page = isAbout ? aboutRoute(lang) : route(lang, slug);
  const root = rootPath(page);
  const title = (isAbout ? t.about : project ? project[lang].title : t.projectsLink) + ' | ' + profile[lang];
  const description = isAbout ? careerCopy[lang].intro : project ? project[lang].question : t.description;
  const url = new URL(page, origin).href;
  const socialImage = new URL(project ? 'assets/' + project.image + '.png' : 'social-card.png', origin).href;
  const header = renderToStaticMarkup(createElement(PortfolioHeader, {
    language: lang,
    links: {
      story: storyPath(root, lang) + '#story',
      projects: root + route(lang),
      about: root + aboutRoute(lang),
      contact: isAbout || project ? root + route(lang) + '#contact' : '#contact',
    },
    active: isAbout ? 'about' : 'projects',
    languageLinks: Object.fromEntries(languages.map(locale => [locale, root + (isAbout ? aboutRoute(locale) : route(locale, slug))])),
  }));
  return `<!doctype html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escape(title)}</title><meta name="description" content="${escape(description)}"><meta name="theme-color" content="#f6f4ed">
  <link rel="canonical" href="${escape(url)}">
  ${languages.map(locale => `<link rel="alternate" hreflang="${locale}" href="${new URL(isAbout ? aboutRoute(locale) : route(locale, slug), origin).href}">`).join('')}
  <meta property="og:type" content="${project ? 'article' : 'website'}"><meta property="og:locale" content="${lang === 'ar' ? 'ar_EG' : 'en_US'}">
  <meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${escape(url)}"><meta property="og:image" content="${socialImage}"><meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${root}favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${root}assets/header.css"><link rel="stylesheet" href="${root}assets/site.css">
</head>
<body>
  ${link('#main', t.skip, 'skip')}
  ${header}
  ${isAbout ? about(lang) : project ? caseStudy(lang, root, project) : work(lang, root)}
  ${isAbout ? '' : footer(lang, root)}
</body>
</html>`;
}

const defaultOrigin = 'https://matolba97.github.io/portfolio/';

export async function build(output = 'dist', origin = defaultOrigin) {
  if (!origin.endsWith('/')) origin += '/';
  await mkdir(output, { recursive: true });
  await cp('public', output, { recursive: true });
  await cp('story/public/favicon.svg', join(output, 'favicon.svg'));
  await cp('story/src/portfolio-header.css', join(output, 'assets', 'header.css'));
  const urls = [];
  for (const lang of languages) {
    for (const project of [undefined, ...projects]) {
      const page = route(lang, project?.slug);
      const destination = join(output, page, 'index.html');
      await mkdir(dirname(destination), { recursive: true });
      await writeFile(destination, render(lang, project, origin));
      urls.push(new URL(page, origin).href);
    }
    const page = aboutRoute(lang);
    const destination = join(output, page, 'index.html');
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, render(lang, undefined, origin, true));
    urls.push(new URL(page, origin).href);
  }
  await writeFile(join(output, 'ar', 'index.html'), '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=../?lang=ar"><title>قصة محلل البيانات</title></head><body><a href="../?lang=ar">قصة محلل البيانات</a></body></html>');
  const sitemap = [origin, ...urls];
  await writeFile(join(output, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + sitemap.map(url => '<url><loc>' + escape(url) + '</loc></url>').join('') + '</urlset>\n');
  await writeFile(join(output, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + new URL('sitemap.xml', origin).href + '\n');
  await writeFile(join(output, '.nojekyll'), '');
  return urls;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const output = resolve('dist');
  const origin = new URL(process.env.PORTFOLIO_ORIGIN || defaultOrigin);
  if (!origin.pathname.endsWith('/')) origin.pathname += '/';
  execFileSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--outDir', output], {
    cwd: 'story',
    stdio: 'inherit',
    env: { ...process.env, VITE_PORTFOLIO_ORIGIN: origin.href },
  });
  const urls = await build(output, origin.href);
  const fonts = {
    'manrope.woff2': '@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2',
    'noto-arabic.woff2': '@fontsource-variable/noto-sans-arabic/files/noto-sans-arabic-arabic-wght-normal.woff2',
    'noto-arabic-latin.woff2': '@fontsource-variable/noto-sans-arabic/files/noto-sans-arabic-latin-wght-normal.woff2',
  };
  for (const [name, source] of Object.entries(fonts)) {
    await cp(join('story', 'node_modules', source), join(output, 'assets', name));
  }
  console.log('Built the five-scene story and ' + urls.length + ' localized portfolio pages.');
}

