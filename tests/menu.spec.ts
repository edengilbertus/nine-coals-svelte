import { expect, test } from '@playwright/test';

test('home reproduces the fire story and coal-bed destinations', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Nine Coals, an open-fire grill in Johannesburg' })).toBeVisible();
  await expect(page.locator('.hero').getByRole('link', { name: 'See the menu' })).toHaveAttribute('href', '/menu');
  await expect(page.locator('.hero').getByRole('link', { name: 'Book a table' })).toHaveAttribute('href', '/reservations');
  for (const time of ['15:00', '16:30', '17:30', '19:00', '23:30']) await expect(page.locator('.day-stack').getByText(time, { exact: true })).toBeAttached();
  await expect(page.locator('.bed-rows a')).toHaveCount(9);
  await expect(page.locator('.bed-rows a').first()).toHaveAttribute('href', '/menu#roar');
});

test('the whole menu exposes all dishes and working category anchors', async ({ page }) => {
  await page.goto('/menu');
  await expect(page.locator('.menu-item')).toHaveCount(17);
  await expect(page.locator('#roar .menu-item').first()).toContainText('R 890');
  await page.getByRole('navigation', { name: 'Coal beds' }).getByRole('link', { name: 'Ember', exact: true }).click();
  await expect(page).toHaveURL(/#ember$/);
  await expect(page.locator('#ember').getByRole('heading', { name: 'Ember', exact: true })).toBeInViewport();
});

test('carousel arrows, keyboard and fast inputs keep the selected dish coherent', async ({ page }) => {
  await page.goto('/menu');
  const carousel = page.getByRole('region', { name: "Menu: tonight's signatures" });
  await carousel.getByRole('button', { name: 'Next dish', exact: true }).click();
  await expect(carousel.getByTestId('dish-title')).toHaveText('Lamb chops');
  await expect(carousel.getByTestId('dish-price')).toHaveText('R 265');
  await carousel.getByRole('button', { name: 'Next dish', exact: true }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(carousel.getByTestId('dish-title')).toHaveText('Tomahawk');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(carousel.getByTestId('dish-title')).toHaveText('Fire chicken');
  await expect(carousel.getByTestId('dish-price')).toHaveText('R 245');
  await expect(carousel.locator('.dish-stage img')).toHaveAttribute('src', '/cutouts/chicken-grill.webp');
  await carousel.getByRole('button', { name: 'Add to order', exact: true }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('nine-coals-basket') ?? '[]'))).toEqual([{ dishId: 'fire-chicken', quantity: 1 }]);
});

test('carousel supports a horizontal swipe without losing its add action', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/menu');
  await expect(page.getByRole('button', { name: 'Next dish', exact: true })).toBeEnabled();
  const stage = page.locator('.dish-stage');
  await stage.dispatchEvent('pointerdown', { pointerId: 1, clientX: 280, clientY: 360, pointerType: 'touch' });
  await stage.dispatchEvent('pointerup', { pointerId: 1, clientX: 100, clientY: 360, pointerType: 'touch' });
  await expect(page.getByTestId('dish-title')).toHaveText('Lamb chops');
});
