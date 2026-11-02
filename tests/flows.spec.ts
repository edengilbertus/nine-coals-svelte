import { expect, test } from '@playwright/test';

test('an empty order sends the visitor back to the menu', async ({ page }) => {
  await page.goto('/order');
  await expect(page.getByRole('heading', { name: 'Your order' })).toBeVisible();
  await expect(page.getByText('Nothing on the grill yet.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Choose from the menu' })).toHaveAttribute('href', '/menu');
});

test('pickup basket persists, updates, validates and confirms without a POST', async ({ page }) => {
  const posts: string[] = [];
  page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
  await page.goto('/menu');
  await page.getByRole('button', { name: 'Add Tomahawk', exact: true }).click();
  await page.goto('/order');
  await expect(page.getByTestId('cart-total')).toHaveText('R 890');
  await page.getByRole('button', { name: 'Increase Tomahawk' }).click();
  await expect(page.getByTestId('cart-total')).toHaveText(/R\s*1[\s,]?780/);
  await page.reload();
  await expect(page.getByTestId('cart-total')).toHaveText(/R\s*1[\s,]?780/);
  await page.getByRole('button', { name: 'Decrease Tomahawk' }).click();
  await page.getByRole('button', { name: 'Place demo order' }).click();
  await expect(page.getByRole('alert')).toContainText(/name/i);
  await page.getByLabel('Your name').fill('Test guest');
  await page.getByLabel('Mobile number').fill('+27 82 123 4567');
  await page.getByLabel('Pickup time').selectOption('18:00');
  await page.getByRole('button', { name: 'Place demo order' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Demo only' })).toContainText('18:00');
  expect(posts).toEqual([]);
});

test('booking preserves steps and validates details before local confirmation', async ({ page }) => {
  const posts: string[] = [];
  page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
  await page.goto('/reservations');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText(/day/i);
  await page.locator('.date-choice').first().click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('button', { name: 'One more guest' }).click();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.locator('.date-choice').first()).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByTestId('guest-count')).toHaveText('3');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('button', { name: '17:30', exact: true }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByLabel('Your name').fill('Test guest');
  await page.getByLabel('Mobile number').fill('abc');
  await page.getByRole('button', { name: 'Book demo table' }).click();
  await expect(page.getByRole('alert')).toContainText(/mobile/i);
  await page.getByLabel('Mobile number').fill('+27 82 123 4567');
  await page.getByRole('button', { name: 'Book demo table' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Demo only' })).toContainText('3 guests');
  await page.getByRole('button', { name: 'Start another booking' }).click();
  await expect(page.getByRole('heading', { name: 'Which day?' })).toBeVisible();
  expect(posts).toEqual([]);
});

test('storage denial still permits a usable in-memory basket', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(Storage.prototype, 'getItem', { value() { throw new DOMException('Storage blocked', 'SecurityError'); } }); });
  await page.goto('/menu');
  await page.getByRole('button', { name: 'Add Tomahawk', exact: true }).click();
  await page.locator('header a[href="/order"]').click();
  await expect(page.getByTestId('cart-total')).toHaveText('R 890');
  await expect(page.getByText(/cannot be saved on this device/)).toBeVisible();
  await page.getByRole('button', { name: 'Remove Tomahawk' }).click();
  await expect(page.getByText('Nothing on the grill yet.')).toBeVisible();
});

test('contact message validation and confirmation stay local', async ({ page }) => {
  const posts: string[] = [];
  page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Send demo message' }).click();
  await expect(page.getByRole('alert')).toContainText(/email/i);
  await page.getByLabel('Email', { exact: true }).fill('guest@example.com');
  await page.getByLabel('Message', { exact: true }).fill('A demonstration message.');
  await page.getByRole('button', { name: 'Send demo message' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Demo only' })).toContainText(/not sent/i);
  expect(posts).toEqual([]);
});
