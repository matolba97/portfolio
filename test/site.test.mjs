import assert from 'node:assert/strict';
import { mkdtemp, readFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { projects } from '../src/content.mjs';
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
  assert.match(en, /href="\.\.\/ar\/projects\/">العربية/);
});

test('emits eight real pages where every local link, fragment and asset resolves', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'mt-portfolio-test-'));
  try {
    const urls = await build(dir, origin);
    assert.equal(urls.length, 8);
    for (const url of urls) {
      const page = await readFile(join(dir, new URL(url).pathname.slice('/alternate-base/'.length), 'index.html'), 'utf8');
      for (const [, href] of page.matchAll(/(?:href|src)="([^"]+)"/g)) {
        const target = new URL(href, url);
        if (target.origin !== new URL(origin).origin) continue;
        assert.ok(target.pathname.startsWith('/alternate-base/'));
        if (target.pathname === new URL(origin).pathname) {
          // Vite emits the story homepage separately from the project pages.
          assert.match(target.search, /^\?lang=(en|ar)$/);
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

