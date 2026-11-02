import { expect, test } from '@playwright/test';

test('story, events and credits reproduce the source content and destinations', async ({ page }) => {
  await page.goto('/story');
  await expect(page.getByRole('heading', { name: 'ONE FIRE.' })).toBeVisible();
  await expect(page.getByText('Thabo Mokoena', { exact: true })).toBeVisible();
  await expect(page.locator('.story-photos img')).toHaveCount(3);
  await page.goto('/events');
  await expect(page.getByRole('heading', { name: 'Around the fire' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Reserve a seat' })).toHaveCount(4);
  for (const link of await page.getByRole('link', { name: 'Reserve a seat' }).all()) await expect(link).toHaveAttribute('href', '/reservations');
  await page.goto('/credits');
  await expect(page.getByRole('heading', { name: 'Photo credits' })).toBeVisible();
  await expect(page.getByText(/Dmitry Makeev/)).toBeVisible();
  await expect(page.locator('.credits-list a')).toHaveCount(32);
});

test('gallery rotation, drag, photo list and modal work without losing focus', async ({ page }) => {
  await page.goto('/gallery');
  const dome = page.locator('.dome-viewport');
  await page.getByRole('button', { name: 'Rotate gallery right' }).click();
  await expect.poll(() => dome.getAttribute('data-yaw')).not.toBe('0');
  const before = await dome.getAttribute('data-yaw');
  await dome.dispatchEvent('pointerdown', { pointerId: 1, clientX: 180, clientY: 300, buttons: 1 });
  await dome.dispatchEvent('pointermove', { pointerId: 1, clientX: 300, clientY: 300, buttons: 1 });
  await dome.dispatchEvent('pointerup', { pointerId: 1, clientX: 300, clientY: 300, buttons: 0 });
  await expect.poll(() => dome.getAttribute('data-yaw')).not.toBe(before);
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('button', { name: 'Show photo list' }).click();
  const opener = page.locator('.photo-list button').first();
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'Photograph viewer' });
  await expect(dialog).toBeVisible();
  const original = await dialog.locator('img').getAttribute('src');
  await dialog.getByRole('button', { name: 'Next photograph' }).click();
  await expect(dialog.locator('img')).not.toHaveAttribute('src', original!);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test('contact keeps real link targets and usable directions when map tiles fail', async ({ page }) => {
  await page.route('**://*.tile.openstreetmap.org/**', route => route.abort());
  await page.goto('/contact');
  await expect(page.getByRole('link', { name: 'Directions', exact: true })).toHaveAttribute('href', 'https://www.google.com/maps/dir/?api=1&destination=-26.2044,28.0593');
  await expect(page.getByRole('link', { name: 'Call +27 11 555 0139' })).toHaveAttribute('href', 'tel:+27115550139');
  await expect(page.getByText(/map tiles could not be loaded|map is unavailable/)).toBeVisible();
  await page.getByRole('button', { name: 'Retry map' }).click();
  await expect(page.getByRole('link', { name: 'Directions', exact: true })).toBeVisible();
});

test('failed food images have a readable fallback instead of a broken picture', async ({ page }) => {
  await page.route('**/cutouts/tomahawk-skillet.webp', route => route.abort());
  await page.goto('/');
  await expect(page.locator('.hero-dish .image-fallback')).toContainText('Photograph unavailable');
});

test('releasing a gallery press outside the dome does not leave it rotating on hover', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/gallery', { waitUntil: 'networkidle' });
  const dome = page.locator('.dome-viewport');
  await expect(dome).toHaveAttribute('data-ready', 'true', { timeout: 15000 });
  const box = (await dome.boundingBox())!;
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  await page.mouse.move(centerX, centerY);
  await page.mouse.down();
  await page.mouse.move(centerX, 20);
  await page.mouse.up();
  const releasedYaw = await dome.getAttribute('data-yaw');
  await page.mouse.move(centerX - 60, centerY);
  await expect(dome).toHaveAttribute('data-yaw', releasedYaw!);
  expect(errors).toEqual([]);
});
