import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE });
const context = await browser.newContext({ reducedMotion: 'reduce', deviceScaleFactor: 1 });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const results = [];
await mkdir('docs/screenshots', { recursive: true });
for (const width of [1440, 390]) {
  await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
  for (const route of ['', 'menu', 'story', 'gallery', 'events', 'contact', 'reservations', 'order', 'credits']) {
    const response = await page.goto(`${process.env.BASE_URL ?? 'http://127.0.0.1:5179'}/${route}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => !document.querySelector('.menu-toggle')?.hasAttribute('disabled'));
    if (route === 'gallery') await page.waitForFunction(() => document.querySelector('.dome-viewport')?.getAttribute('data-ready') === 'true');
    await page.locator('img').evaluateAll(images => Promise.all(images.filter(image => { const rect = image.getBoundingClientRect(); return rect.bottom > 0 && rect.top < innerHeight && image.complete; }).map(image => image.decode().catch(() => {}))));
    const file = `docs/screenshots/${route || 'home'}-${width}.png`;
    await page.screenshot({ path: file });
    results.push({ route: `/${route}`, width, status: response.status(), file, ...await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, brokenImages: [...document.images].filter(image => image.complete && !image.naturalWidth).map(image => image.src) })) });
  }
}
await writeFile('docs/screenshots/results.json', JSON.stringify({ results, errors }, null, 2));
console.log(JSON.stringify({ captures: results.length, failures: results.filter(result => result.status !== 200 || result.overflow || result.brokenImages.length), errors, output: 'docs/screenshots/' }, null, 2));
await browser.close();
if (errors.length || results.some(result => result.status !== 200 || result.overflow || result.brokenImages.length)) process.exitCode = 1;
