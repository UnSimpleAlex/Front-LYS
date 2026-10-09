import { clientSession } from './localSession';
import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => { await clientSession(page); await page.route('https://photon.komoot.io/**', route => route.fulfill({ json: { features: [] } }));
  await page.route('https://tile.openstreetmap.org/**', route => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#e8eee7"/></svg>' }));
});

async function seed(page: Page) {
  await page.addInitScript(() => { if (!localStorage.getItem('checkout-seeded')) { localStorage.setItem('lys-carta-cart', JSON.stringify({ 'pollo-01': 1, 'acompanamientos-01': 1, 'bebidas-01': 1 })); localStorage.setItem('checkout-seeded', '1'); } });
  await page.goto('/carrito');
  await expect(page.locator('.cart-product-list li')).toHaveCount(3);
}
async function delivery(page: Page, pickup = false) {
  await page.getByRole('button', { name: 'Continuar compra' }).click();
  await expect(page).toHaveURL(/checkout\/entrega$/);
  if (pickup) await page.getByRole('radio', { name: /Recojo en local/ }).check();
  else {
    await page.getByLabel('Dirección de entrega', { exact: false }).fill('Av. Los Pinos 123');
    await page.getByRole('combobox', { name: 'Distrito *', exact: true }).selectOption('Comas');
    await page.getByRole('textbox', { name: 'Referencia *', exact: true }).fill('Frente al parque');
  }
  await page.getByLabel('Nombre completo', { exact: false }).fill('Cliente de prueba');
  await page.getByLabel('Celular', { exact: false }).fill('987654321');
  await page.getByLabel('Correo electrónico', { exact: false }).fill('prueba@example.com');
  await page.getByRole('button', { name: 'Continuar al pago' }).click();
  await expect(page).toHaveURL(/checkout\/pago$/);
}
async function payment(page: Page, method: string) {
  await page.getByRole('radio', { name: new RegExp(method) }).check();
  if (method === 'Tarjeta') {
    await page.getByLabel('Nombre del titular', { exact: false }).fill('Cliente prueba');
    await page.getByLabel('Número de tarjeta', { exact: false }).fill('4111111111111111');
    await page.getByLabel('Fecha de vencimiento', { exact: false }).fill('12/30');
    await page.getByLabel('CVV', { exact: false }).fill('123');
    await page.getByLabel('Documento del titular', { exact: false }).fill('12345678');
  } else if (method === 'Efectivo') await page.getByLabel('Pagaré con monto exacto').check();
  else {
    await page.getByLabel(`Número de ${method} del cliente`, { exact: false }).fill('987654321');
    await page.getByLabel('Código de aprobación de prueba', { exact: false }).fill('123456');
    await expect(page.locator('.checkout-wallet')).toContainText('no realizar pagos');
  }
  await page.getByRole('button', { name: 'Revisar pedido' }).click();
  await expect(page).toHaveURL(/checkout\/confirmacion$/);
}
for (const method of ['Tarjeta', 'Yape', 'Plin', 'Efectivo']) {
  test(`flujo completo con ${method}, recibo y carrito vacío sin guardar datos de pago`, async ({ page }) => {
    await seed(page);
    await delivery(page, method === 'Efectivo');
    await payment(page, method);
    await expect(page.locator('.checkout-review-grid')).toContainText('Cliente de prueba');
    const total = await page.locator('.checkout-total strong').textContent();
    await page.getByRole('button', { name: 'Confirmar pedido', exact: true }).click();
    await expect(page).toHaveURL(/pedido-confirmado$/);
    await expect(page.getByRole('heading', { name: '¡Pedido confirmado!' })).toBeVisible();
    await expect(page.locator('.checkout-total strong')).toHaveText(total!);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('lys-carta-cart')!))).toEqual({});
    const receipt = await page.evaluate(() => localStorage.getItem('lys-demo-order-'+localStorage.getItem('lys-session-v1')));
    expect(receipt).not.toContain('4111111111111111'); expect(receipt).not.toContain('123456');
    await page.reload();
    await expect(page.getByRole('heading', { name: '¡Pedido confirmado!' })).toBeVisible();
    await page.getByRole('button', { name: 'Ver mi pedido' }).click();
    await expect(page.getByRole('heading', { name: 'Tu pedido de demostración' })).toBeVisible();
  });
}
test('cantidades, cupón, nueva dirección, edición y restricciones de formulario', async ({ page }) => {
  await seed(page);
  const first = page.locator('.cart-product-list li').first();
  await first.getByRole('button', { name: /Agregar una unidad/ }).click();
  await expect(first.locator('output')).toHaveText('2');
  await page.getByLabel('¿Tienes un cupón de descuento?').fill('BRASA10');
  await page.getByRole('button', { name: 'Aplicar' }).click();
  await expect(page.locator('.checkout-coupon')).toContainText('10%');
  await page.getByRole('button', { name: 'Continuar compra' }).click();
  await page.getByRole('button', { name: 'Continuar al pago' }).click();
  await expect(page).toHaveURL(/entrega$/);
  await page.getByRole('button', { name: /Agregar nueva dirección/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Agregar dirección' });
  await dialog.getByLabel('Nombre de la dirección').fill('Casa');
  await dialog.getByLabel('Calle y número').fill('Av. Los Pinos 123');
  await dialog.getByLabel('Distrito', { exact: false }).selectOption('Comas');
  await dialog.getByRole('button', { name: 'Guardar dirección' }).click();
  await expect(dialog).not.toBeVisible();
  await page.getByRole('textbox', { name: 'Referencia *', exact: true }).fill('Frente al parque');
  await page.getByLabel('Nombre completo', { exact: false }).fill('Cliente de prueba');
  await page.getByLabel('Celular', { exact: false }).fill('987654321');
  await page.getByLabel('Correo electrónico', { exact: false }).fill('prueba@example.com');
  await page.getByRole('button', { name: 'Continuar al pago' }).click();
  await page.getByRole('button', { name: 'Revisar pedido' }).click();
  await expect(page).toHaveURL(/pago$/);
  await payment(page, 'Efectivo');
  await page.getByRole('button', { name: 'Editar', exact: true }).click();
  await expect(page.getByLabel('Dirección de entrega', { exact: false })).toHaveValue('Av. Los Pinos 123');
  await page.getByRole('button', { name: 'Continuar al pago' }).click();
  await page.getByRole('button', { name: 'Editar carrito' }).click();
  await page.getByRole('button', { name: 'Vaciar carrito' }).click();
  await expect(page.getByRole('heading', { name: 'Tu carrito está esperando algo rico' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continuar compra' })).toBeDisabled();
});
for (const width of [240, 390, 768, 1024, 1920]) {
  test(`carrito y todos los pasos responsive a ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await seed(page);
    async function check(name: string) {
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
      await expect.poll(() => page.locator('main img').evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
      if ([390, 768, 1920].includes(width)) await page.screenshot({ path: info.outputPath(`${name}-${width}.png`), fullPage: true });
    }
    await check('carrito');
    await page.getByRole('button', { name: 'Continuar compra' }).click(); await check('entrega');
    await page.getByLabel('Dirección de entrega', { exact: false }).fill('Av. Los Pinos 123');
    await page.getByRole('combobox', { name: 'Distrito *', exact: true }).selectOption('Comas');
    await page.getByRole('textbox', { name: 'Referencia *', exact: true }).fill('Frente al parque');
    await page.getByLabel('Nombre completo', { exact: false }).fill('Cliente de prueba');
    await page.getByLabel('Celular', { exact: false }).fill('987654321');
    await page.getByLabel('Correo electrónico', { exact: false }).fill('prueba@example.com');
    await page.getByRole('button', { name: 'Continuar al pago' }).click(); await check('tarjeta');
    for (const method of ['Yape', 'Plin', 'Efectivo']) { await page.getByRole('radio', { name: new RegExp(method) }).check(); await check(method); }
    await payment(page, 'Efectivo'); await check('confirmacion');
    await page.getByRole('button', { name: 'Confirmar pedido', exact: true }).click(); await check('confirmado');
    expect(errors).toEqual([]);
  });
}

test('historial de mi cuenta conserva dos pedidos realizados desde checkout', async ({ page }) => {
  await seed(page);
  for (let index = 0; index < 2; index++) {
    await delivery(page, true);
    await payment(page, 'Efectivo');
    await page.getByRole('button', { name: 'Confirmar pedido', exact: true }).click();
    await expect(page).toHaveURL(/pedido-confirmado$/);
    await page.goto('/mi-cuenta/pedidos');
    await expect(page.locator('.account-order')).toHaveCount(index + 1);
    await page.getByRole('button', { name: 'Ver detalle', exact: true }).first().click();
    await expect(page.getByRole('dialog')).toContainText('Pedido vinculado');
    await page.getByRole('dialog').getByRole('button', { name: 'Cerrar', exact: true }).click();
    if (index === 0) await page.getByRole('button', { name: 'Volver a pedir', exact: true }).first().click();
  }
  await page.reload();
  await expect(page.locator('.account-order')).toHaveCount(2);
});
