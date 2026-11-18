import { expect, test } from '@playwright/test';

const progress = (page) => page.locator('[data-active-chapter]');
const expectChapter = (page, chapter) => expect(progress(page)).toHaveAttribute('data-active-chapter', String(chapter));

test('opens the complete certification archive by keyboard in English and Arabic', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/about/');
  const section = page.locator('.certifications');
  const archive = section.locator('details');
  const summary = archive.locator('summary');
  const viewports = [[320, 420], [375, 667], [393, 851], [768, 1024], [1440, 900]];
  async function checkViewports() {
    for (const [width, height] of viewports) {
      await page.setViewportSize({ width, height });
      expect(await page.locator('html').evaluate(element => element.scrollWidth)).toBeLessThanOrEqual(width);
      expect((await summary.boundingBox()).height).toBeGreaterThanOrEqual(44);
    }
  }
  await expect(section.getByRole('heading', { name: 'Certifications & Continuous Learning' })).toBeVisible();
  await expect(section.locator('.featured-credentials > li')).toHaveCount(6);
  await expect(archive.locator('li').first()).toBeHidden();
  await expect(summary).toHaveText('View All 25 Certifications', { useInnerText: true });
  await section.screenshot({
    path: testInfo.outputPath('certifications-desktop-en.png'),
    style: '.story-header { position: static }',
  });
  await summary.focus();
  await expect(summary).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(archive.locator('li').first()).toBeVisible();
  await expect(archive.locator('li')).toHaveCount(25);
  await expect(summary).toHaveText('Show Less', { useInnerText: true });
  await checkViewports();
  const badge = section.getByRole('img', { name: 'Official DataCamp Data Analyst Associate badge' });
  await badge.scrollIntoViewIfNeeded();
  await expect.poll(() => badge.evaluate(image => image.naturalWidth)).toBe(196);
  await expect(section.getByRole('link', { name: 'View Credential Data Analyst Associate', exact: true }).first()).toHaveAttribute('target', '_blank');
  await summary.press('Space');
  await expect(archive.locator('li').last()).toBeHidden();

  await page.getByRole('link', { name: 'Switch to Arabic' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(section.getByRole('heading', { name: 'الشهادات والتعلّم المستمر' })).toBeVisible();
  await expect(summary).toHaveText('عرض جميع الشهادات (25)', { useInnerText: true });
  await summary.click();
  await expect(archive.getByText('Basic Data Descriptors, Statistical Distributions, and Application to Business Decisions')).toBeVisible();
  await checkViewports();
  await page.setViewportSize({ width: 393, height: 851 });
  await summary.evaluate(element => element.scrollIntoView({ block: 'start' }));
  await page.screenshot({ path: testInfo.outputPath('certifications-archive-mobile-ar.png') });
  await summary.click();
  await section.screenshot({
    path: testInfo.outputPath('certifications-featured-mobile-ar.png'),
    style: '.story-header { position: static }',
  });
});

test('uses desktop wheel, fine scroll deltas, and native keyboard scrolling', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/?lang=en');
  await expect(page.locator('[data-scene]')).toHaveCount(5);
  await expectChapter(page, 1);
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Story' })).toHaveAttribute('aria-current', 'location');

  const header = page.locator('.story-header');
  await expect(header).toHaveCSS('position', 'sticky');
  await page.mouse.move(630, 370);
  await page.mouse.wheel(0, 620);
  await expectChapter(page, 2);
  expect(Math.abs((await header.boundingBox()).y)).toBeLessThan(2);
  const illustration = page.locator('#insight .scene-svg');
  const firstVisit = await illustration.elementHandle();

  await page.mouse.wheel(0, -620);
  await expectChapter(page, 1);
  await page.keyboard.press('PageDown');
  await expectChapter(page, 2);
  expect(await firstVisit.evaluate(svg => svg.isConnected)).toBe(true);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).toHaveCSS('scroll-snap-type', 'none');
  for (let step = 0; step < 24 && await progress(page).getAttribute('data-active-chapter') === '2'; step++) {
    const previousScroll = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 55);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(previousScroll);
  }
  await expectChapter(page, 3);
  await page.keyboard.press('Home');
  await expectChapter(page, 1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.screenshot({ path: testInfo.outputPath('story-desktop.png') });
});

test('keeps localized links, direct URLs, and back and forward navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=ar#insight');
  await expectChapter(page, 2);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('link', { name: 'المشاريع' })).toHaveAttribute('href', './ar/projects/');
  await page.locator('.language-control button').filter({ hasText: 'EN' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expectChapter(page, 2);

  const nav = page.getByRole('navigation');
  await nav.getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.getByRole('heading', { name: 'Career timeline' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page');

  await nav.getByRole('link', { name: 'Contact' }).click();
  await expect(page).toHaveURL(/\/projects\/#contact$/);
  await expect(page.locator('#contact').getByRole('link', { name: 'Email' })).toHaveAttribute('href', /^mailto:/);
  await page.goBack();
  await expect(page).toHaveURL(/\/about\/$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/projects\/#contact$/);
  await nav.getByRole('link', { name: 'Story' }).click();
  await expectChapter(page, 1);

  await nav.getByRole('link', { name: 'Projects' }).click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await expect(page.locator('html')).toHaveCSS('scroll-snap-type', 'none');
  await nav.getByRole('link', { name: 'Contact' }).click();
  await expect(page).toHaveURL(/\/projects\/#contact$/);
  await page.getByRole('link', { name: 'Read case study' }).first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Workforce Intelligence');
  await expect(page.locator('html')).toHaveCSS('scroll-snap-type', 'none');
  await page.getByRole('link', { name: 'Switch to Arabic' }).click();
  await expect(page).toHaveURL(/\/ar\/work\/workforce-intelligence\/$/);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('تحليل القوى العاملة');
  await expect(page.getByRole('link', { name: 'افتح Power BI' })).toHaveAttribute('href', /app\.powerbi\.com/);
  await page.goto('/?lang=en#work');
  await expect(page).toHaveURL(/\/projects\/$/);
  await page.goto('/?lang=ar#about');
  await expect(page).toHaveURL(/\/ar\/about\/$/);
  await nav.locator('a[href$="#contact"]').click();
  await expect(page).toHaveURL(/\/ar\/projects\/#contact$/);
});

test('keeps the Story readable and keyboard-accessible and shows case-study evidence early on a phone', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=ar');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await expect(page.locator('#story .supporting-copy')).toHaveCSS('font-size', '15px');
  await expect(page.locator('#story .scene-note')).toHaveCSS('font-size', '12px');
  for (const target of await page.locator('.story-links a, .language-control button').all()) {
    const bounds = await target.boundingBox();
    expect(bounds.width).toBeGreaterThanOrEqual(44);
    expect(bounds.height).toBeGreaterThanOrEqual(44);
  }
  expect(await page.locator('html').evaluate(element => element.scrollWidth)).toBeLessThanOrEqual(320);
  await page.screenshot({ path: testInfo.outputPath('story-readable-ar.png') });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/work/workforce-intelligence/');
  await expect(page.locator('.case-takeaway')).toContainText('+123');
  expect((await page.locator('.case-takeaway').boundingBox()).y).toBeLessThan((await page.locator('.case-figure').boundingBox()).y);
  await expect(page.locator('.case-figure figcaption')).toContainText('headcount');
  await page.screenshot({ path: testInfo.outputPath('case-readable-en.png') });
  await page.getByRole('link', { name: 'Open full-size screenshot' }).click();
  await expect(page).toHaveURL(/\/assets\/hr\.png$/);
});

test.describe('touch and short viewports', () => {
  test.use({ viewport: { width: 393, height: 851 }, hasTouch: true, isMobile: true });

  test('scrolls vertically by touch with reduced motion and keeps content reachable', async ({ page, context }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/?lang=ar');
    await expect(page.locator('.presentation')).toHaveAttribute('data-reduced-motion', 'true');
    await expect(page.locator('html')).toHaveCSS('scroll-snap-type', 'none');
    await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');

    const client = await context.newCDPSession(page);
    async function swipe(start, end) {
      await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: start }] });
      for (let step = 1; step <= 12; step++) {
        await client.send('Input.dispatchTouchEvent', {
          type: 'touchMove',
          touchPoints: [{ x: 190, y: start + (end - start) * step / 12 }],
        });
      }
      await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    }
    await swipe(780, 135);
    await expectChapter(page, 2);
    await swipe(135, 780);
    await expectChapter(page, 1);
    await client.detach();

    for (const [width, height] of [[320, 568], [740, 360], [768, 1024]]) {
      await page.setViewportSize({ width, height });
      expect(await page.locator('html').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    }
    await page.setViewportSize({ width: 320, height: 420 });
    await page.goto('/#responsibilities');
    await expectChapter(page, 4);
    await expect(page.locator('.responsibility-list li')).toHaveCount(4);
    await page.locator('.responsibility-list li').last().evaluate(item => item.scrollIntoView({ block: 'center' }));
    const lastItem = await page.locator('.responsibility-list li').last().boundingBox();
    const progressBar = await page.locator('.story-progress').boundingBox();
    expect(lastItem.y + lastItem.height).toBeLessThanOrEqual(progressBar.y + 1);
    await page.screenshot({ path: testInfo.outputPath('story-short-arabic.png') });
    await page.getByRole('link', { name: 'المشاريع' }).tap();
    await expect(page).toHaveURL(/\/ar\/projects\/$/);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });
});
