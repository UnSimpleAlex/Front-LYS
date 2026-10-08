import { test, expect } from '@playwright/test';

for (const width of [390, 768, 1672]) {
  test(`carga de marca responsive y finaliza sin retrasar la página a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    let release!: () => void;
    const pending = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/src/pages/CartaPage.tsx*', async route => { await pending; await route.continue(); });
    await page.goto('/carta', { waitUntil: 'domcontentloaded' });
    const loader = page.getByRole('status').filter({ hasText: 'Preparando tu experiencia' });
    await expect(loader).toBeVisible();
    await expect(loader.getByRole('img', { name: 'Leñas y Sabores' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const chicken = page.locator('.loading-chicken');
    const turn = await chicken.evaluate(el => getComputedStyle(el).transform);
    await expect.poll(() => chicken.evaluate(el => getComputedStyle(el).transform)).not.toBe(turn);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('.loading-chicken')).toHaveCSS('animation-name', 'none');
    release();
    await expect(page.getByRole('heading', { name: 'Nuestra carta', exact: true })).toBeVisible();
    await expect(loader).toHaveCount(0);
  });
}

for (const entry of [
  { path: '/', module: '**/src/pages/HomePage.tsx*', content: '.home-hero' },
  { path: '/registro', module: '**/src/features/auth/RegisterCard.tsx*', content: '.register-card' },
]) {
  test(`carga compartida entrega ${entry.path}`, async ({ page }) => {
    let release!: () => void;
    const pending = new Promise<void>(resolve => { release = resolve; });
    await page.route(entry.module, async route => { await pending; await route.continue(); });
    await page.goto(entry.path, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('status').filter({ hasText: 'Preparando tu experiencia' })).toBeVisible();
    release();
    if (entry.path === '/registro') await expect(page.getByRole('heading', { name: 'Crea tu cuenta', exact: true })).toBeVisible();
    else await expect(page.locator(entry.content)).toBeVisible();
    await expect(page.locator('.route-loading')).toHaveCount(0);
  });
}

test('vista previa local mantiene la carga y permite volver a Carta', async ({ page }) => {
  await page.goto('/carta?preview=carga');
  await expect(page.getByRole('status').filter({ hasText: 'Preparando tu experiencia' })).toBeVisible();
  await expect(page.locator('.product-card')).toHaveCount(0);
  await page.getByRole('link', { name: 'Volver a la página' }).click();
  await expect(page.getByRole('heading', { name: 'Nuestra carta', exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/carta$/);
});

test('pollo conserva volumen durante todo el ciclo de movimiento', async ({ page }) => {
  await page.goto('/carta?preview=carga');
  const chicken = page.locator('.loading-chicken');
  await expect(chicken).toBeVisible();
  const heights = await chicken.evaluate(el => {
    const animation = el.getAnimations()[0];
    animation.pause();
    return [0, 900, 1800, 2700].map(time => {
      animation.currentTime = time;
      return el.getBoundingClientRect().height;
    });
  });
  expect(Math.min(...heights) / Math.max(...heights)).toBeGreaterThan(.9);
});
