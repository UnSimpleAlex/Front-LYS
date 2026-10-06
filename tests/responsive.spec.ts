import { test, expect } from '@playwright/test';

const viewports = [
  [360, 800], [390, 844], [430, 932], [768, 1024], [1024, 768],
  [1080, 1920], [1280, 800], [1440, 900], [1672, 941], [1920, 1080],
];

for (const [width, height] of viewports) {
  test(`pantalla ${width} × ${height}: assets, composición y overflow`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continuar con Google' })).toBeVisible();
    const geometry = await page.evaluate(() => {
      const card = document.querySelector('.sign-in-card')!.getBoundingClientRect();
      const welcome = document.querySelector('.welcome')!.getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        card: { x: card.x, y: card.y, width: card.width, bottom: card.bottom },
        welcome: { x: welcome.x, y: welcome.y, right: welcome.right, bottom: welcome.bottom },
        imagesReady: [...document.images].every((image) => image.complete && image.naturalWidth > 0),
        fontsReady: document.fonts.check('16px "DM Sans"'),
      };
    });
    expect(geometry.overflow).toBe(false);
    expect(geometry.imagesReady).toBe(true);
    expect(geometry.fontsReady).toBe(true);
    if (width <= 900 || width === 1080) expect(geometry.card.y).toBeGreaterThanOrEqual(geometry.welcome.bottom - 1);
    else expect(geometry.card.x).toBeGreaterThanOrEqual(geometry.welcome.right);
    expect(errors).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`screen-${width}.png`), fullPage: true });
    await testInfo.attach('geometría', { body: JSON.stringify(geometry, null, 2), contentType: 'application/json' });
  });
}
