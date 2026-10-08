import { test, expect } from '@playwright/test';
import catalog from '../src/features/carta/catalog.json' with { type: 'json' };
const { categories, products } = catalog;

test('carta tiene doce productos por categoría con imágenes y descripciones distintas', async ({ page, request }) => {
  expect(products).toHaveLength(96);
  expect(new Set(products.map(product => product.image)).size).toBe(96);
  const assetPaths = [...products.map(product => product.image), ...categories.map(category => `/images/carta/categories/${category.id}.webp`), ...['hero-desktop', 'hero-mobile', 'title-desktop', 'title-mobile'].map(name => `/images/carta/${name}.webp`)];
  for (const path of assetPaths) {
    const response = await request.get(path);
    expect(response.ok(), path).toBe(true);
    expect(response.headers()['content-type'], path).toContain('image/webp');
  }
  await page.goto('/carta');
  await expect(page.getByRole('heading', { name: 'Nuestra carta', exact: true })).toBeVisible();
  for (const category of categories) {
    expect(products.filter(product => product.category === category.id)).toHaveLength(12);
    await page.getByRole('navigation', { name: 'Categorías de la carta' }).getByRole('button', { name: category.name, exact: true }).click();
    await expect(page.locator('.product-card')).toHaveCount(12);
    await expect(page.locator('.carta-result-meta')).toContainText('12 productos');
  }
});
test('búsqueda, porción, orden de precio y estado vacío', async ({ page }) => {
  await page.setViewportSize({ width: 1672, height: 1000 });
  await page.goto('/carta');
  await page.getByRole('searchbox', { name: 'Buscar productos', exact: true }).fill('anticuchos');
  await expect(page.locator('.product-card')).toHaveCount(2);
  await page.getByRole('searchbox', { name: 'Buscar productos', exact: true }).fill('');
  await page.getByRole('navigation', { name: 'Categorías de la carta' }).getByRole('button', { name: 'Pollo a la brasa', exact: true }).click();
  await page.getByRole('button', { name: 'Familiar', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'Todos los tamaños' }).click();
  await page.getByRole('combobox', { name: 'Ordenar productos' }).click();
  await page.getByRole('option', { name: 'Precio', exact: true }).click();
  await expect(page.locator('.product-card').first()).toContainText('1/8 de pollo');
  await page.getByRole('searchbox', { name: 'Buscar productos', exact: true }).fill('postre inexistente');
  await expect(page.getByRole('heading', { name: 'No encontramos ese antojo' })).toBeVisible();
  await page.getByRole('button', { name: 'Ver toda la carta', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(12);
});
test('categorías se recorren con flechas y ordenar permite teclado y cierre', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto('/carta');
  const previous = page.getByRole('button', { name: 'Ver categorías anteriores' });
  const next = page.getByRole('button', { name: 'Ver siguientes categorías' });
  await expect(previous).toBeDisabled();
  await next.click();
  await expect(previous).toBeEnabled();
  const categories = page.getByRole('navigation', { name: 'Categorías de la carta' });
  await expect(categories.getByRole('button', { name: 'Salsas', exact: true })).toBeInViewport();
  await previous.click();
  await expect(previous).toBeDisabled();
  const sort = page.getByRole('combobox', { name: 'Ordenar productos' });
  await sort.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('listbox')).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(sort).toContainText('Precio');
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await sort.click();
  await page.keyboard.press('Escape');
  await expect(sort).toBeFocused();
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await sort.click();
  await page.getByRole('heading', { name: 'Nuestros platos', exact: true }).click();
  await expect(page.getByRole('listbox')).toHaveCount(0);
});
test('favoritos, detalle y carrito conservan selección después de recargar', async ({ page }) => {
  await page.goto('/carta');
  await page.getByRole('button', { name: 'Guardar Pollo entero en favoritos', exact: true }).click();
  await page.getByRole('button', { name: 'Mis favoritos', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Ver Pollo entero', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('Un pollo a la brasa entero');
  await page.getByRole('button', { name: 'Agregar a mi pedido' }).click();
  await page.getByRole('button', { name: 'Aumentar cantidad de Pollo entero', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Ver pedido, 2 productos', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('S/ 125.80');
  await page.getByRole('button', { name: 'Quitar una unidad de Pollo entero' }).click();
  await expect(page.getByRole('dialog')).toContainText('S/ 62.90');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Mis favoritos', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(1);
});
for (const width of [390, 1672]) {
  test(`cantidad dentro de la tarjeta sincroniza carrito y persiste a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/carta');
    const card = page.locator('.product-card').first();
    await card.getByRole('button', { name: 'Agregar Pollo entero', exact: true }).click();
    await expect(card.getByRole('button', { name: 'Aumentar cantidad de Pollo entero' })).toBeFocused();
    await card.getByRole('button', { name: 'Aumentar cantidad de Pollo entero' }).click();
    await expect(card.locator('output')).toHaveText('2');
    await page.getByRole('button', { name: 'Ver pedido, 2 productos', exact: true }).click();
    await page.getByRole('button', { name: 'Quitar una unidad de Pollo entero' }).click();
    await page.keyboard.press('Escape');
    await expect(card.locator('output')).toHaveText('1');
    await page.reload();
    await expect(card.locator('output')).toHaveText('1');
    await card.getByRole('button', { name: 'Reducir cantidad de Pollo entero' }).click();
    await expect(card.getByRole('button', { name: 'Agregar Pollo entero', exact: true })).toBeFocused();
    await expect(card.locator('output')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Ver pedido, 0 productos', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.evaluate(() => localStorage.setItem('lys-carta-cart', JSON.stringify({ 'pollo-01': 98 })));
    await page.reload();
    await card.getByRole('button', { name: 'Aumentar cantidad de Pollo entero' }).click();
    await expect(card.locator('output')).toHaveText('99');
    await expect(card.getByRole('button', { name: 'Aumentar cantidad de Pollo entero' })).toBeDisabled();
    await card.getByRole('button', { name: 'Reducir cantidad de Pollo entero' }).click();
    await expect(card.locator('output')).toHaveText('98');
  });
}
for (const width of [240, 320, 360, 390, 430, 650, 768, 1024, 1280, 1440, 1672, 1920, 2560]) {
  test(`carta responsive a ${width}px sin desbordes ni imágenes rotas`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/carta');
    await expect(page.locator('.product-card')).toHaveCount(12);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const positions = await page.locator('.product-card').evaluateAll(cards => cards.map(card => {
      const cardBox = card.getBoundingClientRect();
      const price = card.querySelector('.product-info strong')!.getBoundingClientRect();
      const add = card.querySelector('.product-add')!.getBoundingClientRect();
      return { row: Math.round(cardBox.top), price: price.top + price.height / 2, add: add.top + add.height / 2 };
    }));
    for (const row of new Set(positions.map(position => position.row))) {
      const items = positions.filter(position => position.row === row);
      expect(Math.max(...items.map(item => item.price)) - Math.min(...items.map(item => item.price))).toBeLessThan(1);
      expect(Math.max(...items.map(item => item.add)) - Math.min(...items.map(item => item.add))).toBeLessThan(1);
      if (width > 650) for (const item of items) expect(Math.abs(item.price - item.add)).toBeLessThan(1);
    }
    await page.locator('.product-card').last().scrollIntoViewIfNeeded();
    await expect.poll(() => page.locator('.product-card img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
    if (width <= 650) {
      await expect(page.getByRole('navigation', { name: 'Navegación inferior' })).toBeVisible();
      await page.getByRole('link', { name: 'Buscar en la carta', exact: true }).click();
      await page.getByRole('searchbox', { name: 'Buscar en la carta', exact: true }).fill('pollo entero');
      await expect(page.locator('.product-card').first()).toContainText('Pollo entero');
    }
    expect(errors).toEqual([]);
  });
}
