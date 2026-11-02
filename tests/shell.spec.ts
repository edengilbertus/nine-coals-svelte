import { expect, test } from '@playwright/test';

test('shared navigation reaches every public destination', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Nine Coals, home' })).toHaveAttribute('href', '/');
  for (const [name, href] of [
    ['Menu', '/menu'], ['Story', '/story'], ['Gallery', '/gallery'],
    ['Events', '/events'], ['Find us', '/contact']
  ]) {
    await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name, exact: true })).toHaveAttribute('href', href);
  }
  await expect(page.locator('header').getByRole('link', { name: 'Order', exact: true })).toHaveAttribute('href', '/order');
  await expect(page.locator('header').getByRole('link', { name: 'Book a table' })).toHaveAttribute('href', '/reservations');
});

test('mobile navigation closes with Escape and restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Open menu', includeHidden: true });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: 'Gallery' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('missing routes provide a way back home', async ({ page }) => {
  await page.goto('/this-page-does-not-exist');
  await expect(page.getByRole('heading', { name: /not found/i })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to the fire' })).toHaveAttribute('href', '/');
});
