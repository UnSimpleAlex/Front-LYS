import { test, expect } from '@playwright/test';

test('promociones filtra, busca y agrega la cantidad al carrito compartido', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/promociones');
  await expect(page.getByRole('heading', { name: 'Promociones que dan susto' })).toBeVisible();
  await expect(page.locator('.promo-offer-card')).toHaveCount(3);
  await page.getByRole('button', { name: 'Bebidas', exact: true }).click();
  await expect(page.locator('.promo-offer-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'Todas', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Buscar productos' }).fill('familiar');
  await expect(page.locator('.promo-offer-card')).toHaveCount(1);
  const card = page.locator('.promo-offer-card');
  await card.getByRole('button', { name: 'Aumentar cantidad de Combo Familiar del Terror' }).click();
  await expect(card.getByLabel('Cantidad', { exact: true })).toHaveText('2');
  await card.getByRole('button', { name: 'Agregar Combo Familiar del Terror' }).click();
  await page.getByRole('button', { name: 'Ver pedido, 2 productos' }).click();
  await expect(page.getByRole('dialog')).toContainText('S/ 139.80');
  await page.getByRole('button', { name: 'Cerrar pedido' }).click();
  await page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('button', { name: 'Carta', exact: true }).click();
  await expect(page).toHaveURL(/\/carta$/);
  await page.getByRole('button', { name: 'Ver pedido, 2 productos' }).click();
  await expect(page.getByRole('dialog')).toContainText('Combo Familiar del Terror');
  await page.reload();
  await page.getByRole('button', { name: 'Ver pedido, 2 productos' }).click();
  await expect(page.getByRole('dialog')).toContainText('S/ 139.80');
});

test('búsqueda vacía y restauración de promociones', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/promociones');
  await page.getByRole('searchbox', { name: 'Buscar productos' }).fill('no-existe');
  await expect(page.getByRole('heading', { name: 'No encontramos esa promoción' })).toBeVisible();
  await page.getByRole('button', { name: 'Ver todas las promociones' }).click();
  await expect(page.locator('.promo-offer-card')).toHaveCount(3);
});

for (const width of [240, 320, 360, 390, 430, 600, 768, 1024, 1280, 1440, 1920, 2560]) {
  test(`promociones responsive a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/promociones');
    await expect(page.locator('.promo-offer-card')).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const img of await page.locator('main img').all()) { await img.scrollIntoViewIfNeeded(); await expect.poll(() => img.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0); }
    if (width <= 650) {
      const nav = page.getByRole('navigation', { name: 'Navegación inferior' });
      await expect(nav).toBeVisible();
      await expect(nav.getByRole('button', { name: 'Promociones' })).toHaveAttribute('aria-current', 'page');
      await nav.getByRole('button', { name: 'Carta', exact: true }).click();
      await expect(page.getByRole('heading', { name: 'Nuestra carta', exact: true })).toBeVisible();
    }
  });
}

test('brasas visibles al mouse y desactivadas con movimiento reducido', async ({ page }) => {
  await page.goto('/promociones');
  const canvas = page.locator('.ember-trail');
  await expect(canvas).toBeVisible();
  await expect.poll(() => canvas.evaluate(el => (el as HTMLCanvasElement).width)).toBeGreaterThan(0);
  const hasPixels = () => canvas.evaluate(el => { const c = el as HTMLCanvasElement; return c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data.some((v, i) => i % 4 === 3 && v > 0); });
  await page.mouse.move(100, 450);
  await page.mouse.move(200, 450, { steps: 8 });
  await expect.poll(hasPixels).toBe(true);
  await expect.poll(hasPixels).toBe(false);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.mouse.move(300, 450, { steps: 8 });
  expect(await hasPixels()).toBe(false);
});
