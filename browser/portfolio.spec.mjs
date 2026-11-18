import { expect, test } from '@playwright/test';

test('opens the original story, switches languages, and reaches a project', async ({ page }) => {
  await page.goto('/');
  const current = page.locator('[data-scene]');
  await expect(current).toHaveAttribute('data-scene', 'problem');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('link', { name: 'المشاريع' })).toHaveAttribute('href', './ar/projects/');
  await page.getByRole('button', { name: 'التبديل إلى الإنجليزية' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(current).toHaveAttribute('data-scene', 'problem');
  await page.getByRole('button', { name: 'Next slide' }).press('ArrowRight');
  await expect(current).toHaveAttribute('data-scene', 'insight');
  await page.getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.getByRole('link', { name: 'Read case study' }).first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Workforce Intelligence');
  await page.getByRole('link', { name: 'العربية' }).click();
  await expect(page).toHaveURL(/\/ar\/work\/workforce-intelligence\/$/);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('تحليل القوى العاملة');
  await expect(page.getByRole('link', { name: 'افتح Power BI' })).toHaveAttribute('href', /app\.powerbi\.com/);
  await page.getByRole('link', { name: 'كل المشاريع' }).click();
  await expect(page).toHaveURL(/\/ar\/projects\/$/);
});

test('keeps former public contact, about, and work links usable', async ({ page }) => {
  await page.goto('/?lang=en#contact');
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', 'hello');
  await expect(page.getByRole('link', { name: /Connect with me on LinkedIn/ })).toHaveAttribute('href', /linkedin\.com\/in\//);
  await page.goto('/?lang=ar#about');
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', 'responsibilities');
  await page.goto('/?lang=en#work');
  await expect(page).toHaveURL(/\/projects\/$/);
});

test.describe('small screen', () => {
  test.use({ viewport: { width: 320, height: 568 }, hasTouch: true, isMobile: true });

  test('supports reduced motion and opens Arabic projects with one tap', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('.presentation')).toHaveAttribute('data-reduced-motion', 'true');
    for (const [width, height] of [[320, 568], [393, 851], [740, 360], [768, 1024], [1440, 900]]) {
      await page.setViewportSize({ width, height });
      expect(await page.locator('html').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    }
    await page.setViewportSize({ width: 320, height: 568 });
    await page.getByRole('link', { name: 'المشاريع' }).tap();
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page).toHaveURL(/\/ar\/projects\/$/);
    expect(await page.locator('html').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.getByRole('link', { name: 'اقرأ دراسة الحالة' }).last().tap();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Maven Fuzzy Factory');
  });
});

