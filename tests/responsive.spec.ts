import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = ['/', '/menu', '/story', '/gallery', '/events', '/contact', '/reservations', '/order', '/credits'];

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`all routes reflow at ${width}px without overflow or page exceptions`, async ({ page }) => {
    test.setTimeout(150000);
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.route('**://*.tile.openstreetmap.org/**', route => route.abort());
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const route of routes) {
      const response = await page.goto(route, { waitUntil: 'networkidle' });
      expect(response?.status(), route).toBe(200);
      await expect(page.locator('.menu-toggle')).toBeEnabled({ timeout: 15000 });
      if (route === '/gallery') await expect(page.locator('.dome-viewport')).toHaveAttribute('data-ready', 'true', { timeout: 15000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
      expect(await page.evaluate(() => [...document.images].filter(image => new URL(image.src).origin === location.origin && image.complete && image.naturalWidth === 0).map(image => image.src)), route).toEqual([]);
      await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
      await expect(page.locator('footer').getByRole('button', { name: 'Cookies' })).toBeInViewport();
    }
    expect(errors).toEqual([]);
  });
}

for (const route of routes) {
  test(`WCAG automated checks: ${route}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.route('**://*.tile.openstreetmap.org/**', request => request.abort());
    await page.goto(route, { waitUntil: 'networkidle' });
    await expect(page.locator('.menu-toggle')).toBeEnabled({ timeout: 15000 });
    if (route === '/gallery') await expect(page.locator('.dome-viewport')).toHaveAttribute('data-ready', 'true', { timeout: 15000 });
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations.map(violation => ({ id: violation.id, nodes: violation.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) }))).toEqual([]);
  });
}

test('200% root text scaling keeps headings and controls within a phone layout', async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of ['/', '/menu', '/story', '/reservations', '/order']) {
    await page.goto(route, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    await page.evaluate(async () => { void document.body.offsetWidth; await document.fonts.ready; });
    const overflow = await page.locator('h1,h2,h3').evaluateAll(headings => headings.filter(heading => !heading.closest('.sr-only') && heading.getAttribute('aria-hidden') !== 'true' && heading.getBoundingClientRect().width > 0 && heading.scrollWidth > heading.clientWidth + 2).map(heading => heading.textContent));
    expect(overflow, route).toEqual([]);
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) console.log('Text-scale overflow', route, await page.evaluate(() => [...document.querySelectorAll('main *')].filter(element => element.getBoundingClientRect().right > innerWidth + 1).map(element => ({ tag: element.tagName, text: element.textContent?.slice(0, 30), width: element.getBoundingClientRect().width })).slice(0, 12)));
    await expect.poll(() => page.evaluate(() => ({ documentWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth })), { message: route }).toEqual({ documentWidth: 390, viewportWidth: 390 });
  }
});

test('reduced motion removes scroll choreography and survives rapid navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('.hero-word').first()).toHaveCSS('transform', 'none');
  await expect(page.locator('.day-card').first()).toHaveCSS('position', 'relative');
  for (let i = 0; i < 3; i++) {
    await page.locator('header a[href="/menu"]').click();
    await page.getByRole('button', { name: 'Next dish', exact: true }).click();
    await page.locator('header a[href="/"]').click();
    await expect(page.locator('.hero')).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('keyboard users can rotate, open and close a dome photo', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/gallery', { waitUntil: 'networkidle' });
  await expect(page.locator('.dome-viewport')).toHaveAttribute('data-ready', 'true', { timeout: 15000 });
  const initial = await page.locator('.dome-tile[tabindex="0"]').getAttribute('data-tile');
  await page.locator('.dome-tile[tabindex="0"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.dome-tile[tabindex="0"]')).not.toHaveAttribute('data-tile', initial!);
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('.dome-tile[tabindex="0"]')).toBeFocused();
});

test('all prototype information dialogs open by keyboard and restore focus', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  for (const name of ['Privacy', 'Terms', 'Cookies']) {
    const opener = page.locator('footer').getByRole('button', { name });
    await opener.focus(); await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog').getByRole('heading', { name })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(opener).toBeFocused();
  }
});

test('the header home link meets the 44px touch target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'networkidle' });
  const target = page.getByRole('link', { name: 'Nine Coals, home' });
  await expect(target).toBeVisible();
  const box = (await target.boundingBox())!;
  expect(box.height).toBeGreaterThanOrEqual(44);
});

test('reservation dates refresh and clear a stale choice at Johannesburg midnight', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-11-02T21:59:30Z') });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/reservations', { waitUntil: 'networkidle' });
  const firstChoice = page.locator('.date-choice').first();
  await expect(firstChoice).toHaveText('Tue 03 Nov');
  await firstChoice.click();
  await expect(firstChoice).toHaveAttribute('aria-pressed', 'true');
  await page.clock.fastForward(61000);
  await expect(page.getByRole('alert')).toContainText(/no longer available/i);
  await expect(page.locator('.date-choice').first()).toHaveText('Wed 04 Nov');
  await expect(page.locator('.date-choice').first()).not.toHaveAttribute('aria-pressed', 'true');
});
