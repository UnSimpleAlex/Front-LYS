import { test, expect } from '@playwright/test';

for (const width of [240, 390, 768, 1366, 1920]) {
  test(`navbar uniforme en todas las paginas a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    let baseline: unknown;
    for (const route of ['/carta', '/', '/promociones', '/iniciar-sesion', '/registro']) {
      await page.goto(route);
      await expect(page.locator('.site-header .brand img')).toBeVisible();
      await expect(page.locator('.route-loading')).toHaveCount(0);
      const header = await page.locator('.site-header').evaluate(element => {
        const style = getComputedStyle(element);
        const brand = element.querySelector('.brand')!.getBoundingClientRect();
        return { height: element.getBoundingClientRect().height, background: style.backgroundColor, brandWidth: brand.width, brandHeight: brand.height, navFont: getComputedStyle(element.querySelector('.nav-link')!).fontSize };
      });
      baseline ??= header;
      expect(header).toEqual(baseline);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
      await expect(page.locator('.carta-cart-toggle')).toBeVisible();
      if (route.includes('sesion') || route === '/registro') await expect(page.locator('.nav-link.active')).toHaveCount(0);
    }
  });
}

test('busqueda y carrito disponibles desde inicio y login', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Buscar productos', exact: true }).fill('anticuchos');
  await expect(page).toHaveURL(/carta\?buscar=anticuchos/);
  await expect(page.locator('.product-card')).not.toHaveCount(0);
  await page.locator('.product-add').first().click();
  await page.goto('/iniciar-sesion');
  await page.locator('.carta-cart-toggle').click();
  await expect(page.getByRole('dialog', { name: 'Tu pedido' })).toBeVisible();
  await expect(page.locator('.cart-empty')).toHaveCount(0);
});
