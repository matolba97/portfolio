import { expect, test } from '@playwright/test';

test('keyboard navigation reaches a project and switches to its equivalent Arabic page', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.getByRole('link', { name: 'Read case study' }).first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Workforce Intelligence');
  await page.getByRole('link', { name: 'العربية' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page).toHaveURL(/\/ar\/work\/workforce-intelligence\/$/);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('تحليل القوى العاملة');
  await expect(page.getByRole('link', { name: 'افتح Power BI' })).toHaveAttribute('href', /app\.powerbi\.com/);
  await page.goto('/');
  await expect(page).toHaveURL(/\/ar\/$/);
  await page.getByRole('link', { name: 'English' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
});

test.describe('touch and reduced motion', () => {
  test.use({ viewport: { width: 320, height: 568 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });

  test('has no horizontal overflow and keeps links usable in both languages', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
    await expect(page.locator('.art-chart')).toHaveCSS('animation-name', 'none');
    for (const [width, height] of [[320, 568], [393, 851], [740, 360], [768, 1024], [1440, 900]]) {
      await page.setViewportSize({ width, height });
      expect(await page.locator('html').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    }
    await page.setViewportSize({ width: 320, height: 568 });
    await page.getByRole('link', { name: 'العربية' }).tap();
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    expect(await page.locator('html').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.getByRole('link', { name: 'اقرأ دراسة الحالة' }).last().tap();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Maven Fuzzy Factory');
    await expect(page.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', /linkedin\.com\/in\//);
  });
});
