import assert from 'node:assert/strict';
import { mkdtemp, readFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { projects } from '../src/content.mjs';
import { credentials } from '../src/credentials.mjs';
import { build, render } from '../scripts/build.mjs';

const origin = 'https://example.test/alternate-base/';

test('gives each project a unique report and equivalent translated content', () => {
  assert.equal(new Set(projects.map(project => project.demo)).size, projects.length);
  assert.equal(new Set(projects.map(project => project.slug)).size, projects.length);
  for (const project of projects) {
    const token = new URL(project.demo).searchParams.get('r');
    assert.match(JSON.parse(Buffer.from(token, 'base64url').toString()).k, /^[a-f0-9-]{36}$/);
    assert.deepEqual(Object.keys(project.en), Object.keys(project.ar));
    assert.ok(Object.values(project.ar).every(Boolean));
  }
});

test('renders language links, focusable navigation, and locale metadata', () => {
  const ar = render('ar', projects[1], origin);
  assert.match(ar, /<html lang="ar" dir="rtl">/);
  assert.match(ar, /href="\.\.\/\.\.\/\.\.\/work\/hospital-operations\/"/);
  assert.match(ar, /hreflang="en" href="https:\/\/example.test\/alternate-base\/work\/hospital-operations\/"/);
  assert.match(ar, /href="#main"/);
  assert.match(ar, /<main id="main"/);
  assert.match(ar, /يدرس|دراسة|الزيارة|الزيارات/);
  const en = render('en', undefined, origin);
  assert.match(en, /<html lang="en" dir="ltr">/);
  assert.match(en, /href="\.\.\/ar\/projects\/" hreflang="ar">AR/i);
  assert.match(en, /href="\.\.\/\?lang=en#story">Story/);
  assert.match(en, /href="\.\.\/about\/">About/);
  assert.match(en, /href="#contact">Contact/);
  assert.match(en, /aria-current="location">Projects/);
});

test('renders independent About pages with all career details and a separate Contact destination', () => {
  const en = render('en', undefined, origin, true);
  const ar = render('ar', undefined, origin, true);
  for (const html of [en, ar]) {
    const positions = ['Data Analyst', 'Call Center MIS', 'Account Manager'].map(title =>
      html.indexOf(title, html.indexOf('class="career-timeline"')));
    assert.ok(positions.every((position, index) => position >= 0 && (!index || position > positions[index - 1])));
    for (const value of ['Contact Insurance Brokerage', 'Contact Financial Holding', 'Altibbi', '2023–2025', '2021–2022', 'Python', 'SQL', 'PostgreSQL', 'Power BI', 'DAX', 'Excel']) {
      assert.ok(html.includes(value), value);
    }
    assert.match(html, /href="(?:\.\.\/)+(?:ar\/)?projects\/#contact"/);
    assert.doesNotMatch(html, /id="contact"/);
  }
  assert.match(en, /June 2025–Present/);
  assert.match(ar, /يونيو 2025–الآن/);
});

test('renders six featured credentials and an initially closed archive of 25 unique entries in both locales', () => {
  const featuredIds = [
    'data-analyst-associate', 'sql-associate', 'ibm-data-analyst',
    'power-bi-365', 'sql-intermediate-hackerrank', 'foundations-of-generative-ai',
  ];
  const chronological = credentials.toSorted((a, b) => b.issuedAt.localeCompare(a.issuedAt));
  assert.equal(credentials.length, 25);
  assert.equal(new Set(credentials.map(item => item.id)).size, 25);
  for (const lang of ['en', 'ar']) {
    const html = render(lang, undefined, origin, true);
    const featured = html.split('<ul class="featured-credentials"')[1].split('</ul>')[0];
    const archive = html.split('<details class="credential-archive">')[1].split('</details>')[0];
    const rows = [...archive.matchAll(/data-credential="([^"]+)"[^>]*>([\s\S]*?)<\/li>/g)];
    assert.deepEqual([...featured.matchAll(/data-credential="([^"]+)"/g)].map(([, id]) => id), featuredIds);
    assert.deepEqual(rows.map(([, id]) => id), chronological.map(item => item.id));
    assert.deepEqual([...archive.matchAll(/<h3 id="credential-year-(\d{4})"/g)].map(([, year]) => year), ['2026', '2025', '2024']);
    assert.ok(archive.includes(lang === 'ar' ? 'عرض جميع الشهادات (25)' : 'View All 25 Certifications'));
    rows.forEach(([, , row], index) => {
      const item = chronological[index];
      assert.ok(row.includes(`datetime="${item.issuedAt}"`), item.id);
      if (item.credentialId) assert.ok(row.includes(`<bdi dir="ltr">${item.credentialId}</bdi>`), item.id);
      if (item.verificationUrl) {
        assert.ok(row.includes(`href="${item.verificationUrl}" target="_blank" rel="noopener noreferrer"`), item.id);
      } else {
        assert.doesNotMatch(row, /class="credential-actions"/, item.id);
      }
    });
  }
});

test('renders compact project previews and exposes the takeaway and original screenshot on each case study', async () => {
  for (const lang of ['en', 'ar']) {
    const gallery = render(lang, undefined, origin);
    const previews = [...gallery.matchAll(/src="([^"]+-preview\.png)" width="(\d+)" height="(\d+)"/g)];
    assert.equal(previews.length, projects.length);
    for (const [index, project] of projects.entries()) {
      const html = render(lang, project, origin);
      assert.ok(html.indexOf('class="case-takeaway"') < html.indexOf('class="case-figure"'));
      assert.ok(html.includes(`<bdi>${project.stat}</bdi>`));
      assert.match(html, /href="(?:\.\.\/)+(?:ar\/)?projects\/#contact"/);
      assert.ok(html.includes(`href="${lang === 'ar' ? '../../../' : '../../'}assets/${project.image}.png"`));
      assert.ok(html.includes(project[lang].image));
      const [, , width, height] = previews[index];
      const preview = await readFile(`public/assets/${project.image}-preview.png`);
      const original = await stat(`public/assets/${project.image}.png`);
      assert.equal(preview.readUInt32BE(16), Number(width));
      assert.equal(preview.readUInt32BE(20), Number(height));
      assert.ok(preview.length < original.size / 2);
    }
  }
});

test('emits ten real pages where every local link, fragment and asset resolves', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'mt-portfolio-test-'));
  try {
    const urls = await build(dir, origin);
    assert.equal(urls.length, 10);
    for (const url of urls) {
      const page = await readFile(join(dir, new URL(url).pathname.slice('/alternate-base/'.length), 'index.html'), 'utf8');
      for (const [, href] of page.matchAll(/(?:href|src)="([^"]+)"/g)) {
        const target = new URL(href, url);
        if (target.origin !== new URL(origin).origin) continue;
        assert.ok(target.pathname.startsWith('/alternate-base/'));
        if (target.pathname === new URL(origin).pathname) {
          // Vite emits the story homepage separately from the project pages.
          assert.match(target.search, /^\?lang=(en|ar)$/);
          assert.match(target.hash, /^(?:#story|#contact)?$/);
          continue;
        }
        const path = resolve(dir, target.pathname.slice('/alternate-base/'.length));
        const info = await stat(path);
        if (info.isDirectory()) {
          const targetPage = await readFile(join(path, 'index.html'), 'utf8');
          if (target.hash) assert.ok(targetPage.includes('id="' + target.hash.slice(1) + '"'));
        }
      }
    }
    assert.ok((await readFile(join(dir, 'sitemap.xml'), 'utf8')).includes(urls.at(-1)));
    assert.ok((await stat(join(dir, 'assets', 'hr.png'))).size > 0);
  } finally {
    // The temporary test directory contains only generated files.
    const { readdir, rmdir, unlink } = await import('node:fs/promises');
    async function clearGenerated(folder) {
      for (const file of await readdir(folder, { withFileTypes: true })) {
        const path = join(folder, file.name);
        if (file.isDirectory()) await clearGenerated(path);
        else await unlink(path);
      }
      await rmdir(folder);
    }
    await clearGenerated(dir);
  }
});

