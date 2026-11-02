import { expect, test } from '@playwright/test';

test('every signature and every menu add button works, including clearing the basket', async ({ page }) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/menu', { waitUntil: 'networkidle' });
  const carousel = page.getByRole('region', { name: "Menu: tonight's signatures" });
  for (const [name, price] of [['Tomahawk', 'R 890'], ['Lamb chops', 'R 265'], ['Rack of lamb', 'R 395'], ['Fire chicken', 'R 245'], ['Line fish', 'R 265'], ['Boerewors', 'R 145'], ['Fire bread', 'R 55'], ['Peppers', 'R 95'], ['Mielies', 'R 75'], ['Ash potato', 'R 65'], ['Chocolate tart', 'R 105']]) {
    await expect(carousel.getByTestId('dish-title')).toHaveText(name);
    await expect(carousel.getByTestId('dish-price')).toHaveText(price);
    await carousel.getByRole('button', { name: 'Add to order', exact: true }).click();
    await carousel.getByRole('button', { name: 'Next dish', exact: true }).click();
  }
  await carousel.locator('.dish-peek.next').click();
  await expect(carousel.getByTestId('dish-title')).toHaveText('Lamb chops');
  await carousel.locator('.dish-peek.previous').click();
  await expect(carousel.getByTestId('dish-title')).toHaveText('Tomahawk');
  await page.getByRole('button', { name: 'Dismiss notification' }).click();
  await expect(page.getByRole('link', { name: 'View order' })).not.toBeVisible();
  await page.locator('header a[href="/order"]').click();
  await expect(page.getByTestId('cart-total')).toHaveText(/R\s*2[\s,]?600/);
  await page.getByRole('button', { name: 'Clear order' }).click();
  await page.getByRole('link', { name: 'Choose from the menu' }).click();
  await expect(page).toHaveURL(/\/menu$/);
  await expect(page.getByRole('heading', { name: 'The whole menu, bed by bed' })).toBeVisible();
  for (const button of await page.locator('.menu-item button').all()) await button.click();
  await page.getByRole('link', { name: 'View order' }).click();
  await expect(page.getByTestId('cart-total')).toHaveText(/R\s*3[\s,]?770/);
});

test('booking date expansion, guest bounds and completed-step navigation work', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/reservations', { waitUntil: 'networkidle' });
  await expect(page.locator('.date-choice')).toHaveCount(14);
  await page.getByRole('button', { name: 'Show more dates' }).click();
  expect(await page.locator('.date-choice').count()).toBeGreaterThan(14);
  await page.getByRole('button', { name: 'Show fewer dates' }).click();
  await expect(page.locator('.date-choice')).toHaveCount(14);
  await page.locator('.date-choice').first().click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  for (let i = 0; i < 6; i++) await page.getByRole('button', { name: 'One more guest' }).click();
  await expect(page.getByTestId('guest-count')).toHaveText('8');
  await expect(page.getByRole('button', { name: 'One more guest' })).toBeDisabled();
  for (let i = 0; i < 7; i++) await page.getByRole('button', { name: 'One fewer guest' }).click();
  await expect(page.getByTestId('guest-count')).toHaveText('1');
  await expect(page.getByRole('button', { name: 'One fewer guest' })).toBeDisabled();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  for (const time of ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00']) {
    await page.getByRole('button', { name: time, exact: true }).click();
    await expect(page.getByRole('button', { name: time, exact: true })).toHaveAttribute('aria-pressed', 'true');
  }
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('button', { name: 'Step 1: Day', exact: true }).click();
  await expect(page.locator('.date-choice').first()).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Step 4: Details', exact: true }).click();
  await expect(page.locator('.booking-summary')).toContainText(/1 guest · .*21:00/);
});

test('each photo-list image opens its corresponding photograph and closes by button', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/gallery', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Rotate gallery left' }).click();
  await page.getByRole('button', { name: 'Show photo list' }).click();
  for (const button of await page.locator('.photo-list button').all()) {
    const label = (await button.getAttribute('aria-label'))!.replace('Open photo: ', '');
    await button.click();
    await expect(page.getByRole('dialog').locator('img')).toHaveAttribute('alt', label);
    await page.getByRole('button', { name: 'Previous photograph' }).click();
    await page.getByRole('button', { name: 'Next photograph' }).click();
    await page.getByRole('button', { name: 'Close photograph' }).click();
    await expect(button).toBeFocused();
  }
  await page.getByRole('button', { name: 'Hide photo list' }).click();
  await expect(page.locator('.photo-list')).not.toBeVisible();
});

test('footer routes and browser back/forward all reach real pages', async ({ page }) => {
  test.setTimeout(60000);
  await page.route('**://*.tile.openstreetmap.org/**', request => request.abort());
  await page.goto('/', { waitUntil: 'networkidle' });
  for (const route of ['/menu', '/order', '/reservations', '/events', '/story', '/gallery', '/contact', '/credits']) {
    await page.locator(`footer a[href="${route}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
  }
  await page.goBack(); await expect(page).toHaveURL(/\/contact$/);
  await page.goForward(); await expect(page).toHaveURL(/\/credits$/);
  await page.locator('footer').getByRole('button', { name: 'Privacy' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('map zoom, location popup and local message reset have real actions', async ({ page }) => {
  const tiles: string[] = [];
  await page.route('**://*.tile.openstreetmap.org/**', route => { tiles.push(route.request().url()); return route.abort(); });
  await page.goto('/contact', { waitUntil: 'networkidle' });
  await page.locator('.leaflet-control-zoom-in').click();
  await expect.poll(() => tiles.some(url => /\/16\//.test(url))).toBe(true);
  await page.locator('.leaflet-control-zoom-out').click();
  await page.locator('path.leaflet-interactive').click();
  await expect(page.getByText('Nine Coals design prototype. Not a verified business location.')).toBeVisible();
  await page.locator('.leaflet-popup-close-button').click();
  await page.getByLabel('Email', { exact: true }).fill('guest@example.com');
  await page.getByLabel('Message', { exact: true }).fill('A local demonstration.');
  await page.getByRole('button', { name: 'Send demo message' }).click();
  await page.getByRole('button', { name: 'Write another demo' }).click();
  await expect(page.getByLabel('Email', { exact: true })).toHaveValue('');
  await expect(page.getByLabel('Message', { exact: true })).toHaveValue('');
});
