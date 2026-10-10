import { clientSession } from './localSession';
import { test, expect } from '@playwright/test';
const routes = ['/nosotros', '/locales', '/contacto', '/mi-cuenta', '/mi-cuenta/pedidos', '/mi-cuenta/direcciones', '/mi-cuenta/datos', '/mi-cuenta/metodos-pago', '/mi-cuenta/notificaciones', '/mi-cuenta/favoritos'];
test.beforeEach(async ({ page }) => {
  await clientSession(page);
  await page.route('https://tile.openstreetmap.org/**', route => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#e8eee7"/></svg>' }));
  await page.route('https://photon.komoot.io/**', route => route.fulfill({ json: { features: [] } }));
});
for (const width of [240, 280, 320, 390, 768, 1024, 1440, 1920]) {
  test(`secciones sin desbordamientos a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 960 });
    await page.addInitScript(() => { localStorage.setItem('lys-carta-favorites-'+localStorage.getItem('lys-session-v1'), JSON.stringify(['pollo-01','parrillas-01'])); localStorage.setItem('lys-account-'+localStorage.getItem('lys-session-v1'), JSON.stringify({ profile: { name: 'Cliente Prueba', email: 'prueba@example.com', phone: '987654321' }, addresses: [{ id: 'test-address', label: 'Casa', street: 'Av. Los Pinos 123', district: 'Carabayllo', reference: 'Frente al parque', primary: true, point: null }], preferredPayment: 'yape' })); });
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator('main h1')).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      if (route === '/mi-cuenta/pedidos') await page.getByLabel('Ver pedidos de ejemplo').check();
      if (route === '/mi-cuenta/notificaciones') await page.getByLabel('Ver notificaciones de ejemplo').check();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
      expect(await page.locator('img').evaluateAll(images => images.filter(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth === 0).map(image => image.getAttribute('src')))).toEqual([]);
      if ([390, 768, 1440].includes(width)) await page.screenshot({ path: `test-results/information-${route.replaceAll('/', '-')}-${width}.png`, fullPage: true });
    }
    expect(errors).toEqual([]);
  });
}
test('contacto prepara enlaces reales sin enviar mensajes automáticamente', async ({ page }) => {
  await page.goto('/contacto');
  await expect(page.getByRole('link', { name: /Llamar/ })).toHaveAttribute('href', 'tel:+51947540597');
  await expect(page.getByRole('link', { name: /WhatsApp/ }).first()).toHaveAttribute('href', 'https://wa.me/51947540597');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.locator('.info-prepared')).toHaveCount(0);
  await page.getByLabel('Nombre completo').fill('Cliente de prueba');
  await page.getByLabel('Correo electrónico').fill('prueba@example.com');
  await page.getByLabel('Teléfono *').fill('987654321');
  await page.getByLabel('Asunto *').selectOption('Eventos y reservas');
  await page.getByLabel('Mensaje *').fill('Quisiera consultar una reserva familiar.');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.locator('.info-prepared')).toContainText('Tu mensaje está listo');
  const href = await page.getByRole('link', { name: 'Abrir correo' }).getAttribute('href');
  expect(decodeURIComponent(href!)).toContain('Quisiera consultar una reserva familiar.');
  await expect(page.getByRole('link', { name: 'Abrir WhatsApp' })).toHaveAttribute('href', /51947540597\?text=/);
});
test('perfil, dirección y preferencia de pago se reutilizan en checkout y persisten en la pestaña', async ({ page }) => {
  await page.goto('/mi-cuenta/datos');
  await page.getByLabel('Nombres completos').fill('Cliente Prueba');
  await page.getByLabel('Correo electrónico').fill('prueba@example.com');
  await page.getByLabel('Teléfono *').fill('987654321');
  await page.getByRole('button', { name: 'Guardar cambios' }).click();
  await expect(page.locator('.account-success')).toContainText('Datos guardados');
  await page.goto('/mi-cuenta/direcciones');
  await page.getByRole('button', { name: /Agregar dirección/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Calle y número').fill('Av. Los Pinos 123');
  await dialog.getByLabel('Referencia').fill('Frente al parque');
  await dialog.getByRole('button', { name: 'Marcar el centro del mapa' }).click();
  await dialog.getByRole('button', { name: 'Guardar dirección' }).click();
  await expect(page.locator('.account-address')).toContainText('Av. Los Pinos 123');
  await page.reload();
  await expect(page.locator('.account-address')).toContainText('Dirección principal');
  await page.goto('/mi-cuenta/metodos-pago');
  await page.getByRole('radio', { name: 'Yape' }).check();
  await page.getByRole('button', { name: 'Guardar preferencia' }).click();
  await page.evaluate(() => localStorage.setItem('lys-carta-cart', JSON.stringify({ 'pollo-01': 1 })));
  await page.goto('/carrito');
  await page.getByRole('button', { name: 'Continuar compra' }).click();
  await page.getByRole('button', { name: '2. Dirección y entrega', exact: true }).click();
  await expect(page.getByLabel('Nombre completo')).toHaveValue('Cliente Prueba');
  await expect(page.getByLabel('Dirección de entrega')).toHaveValue('Av. Los Pinos 123');
  await page.getByRole('button', { name: 'Continuar al pago' }).click();
  await expect(page.getByRole('radio', { name: /Yape/ })).toBeChecked();
  expect(await page.evaluate(() => localStorage.getItem('lys-account-demo'))).toBeNull();
});
test('direcciones se editan y eliminan con confirmación', async ({ page }) => {
  await page.goto('/mi-cuenta/direcciones');
  await page.getByRole('button', { name: /Agregar dirección/ }).click();
  await page.getByRole('dialog').getByLabel('Calle y número').fill('Av. Los Pinos 123');
  await page.getByRole('dialog').getByLabel('Referencia').fill('Frente al parque');
  await page.getByRole('dialog').getByRole('button', { name: 'Guardar dirección' }).click();
  await page.getByRole('button', { name: 'Editar', exact: true }).click();
  await page.getByRole('dialog').getByLabel('Calle y número').fill('Av. Los Pinos 456');
  await page.getByRole('dialog').getByRole('button', { name: 'Guardar dirección' }).click();
  await expect(page.locator('.account-address')).toContainText('456');
  await page.getByRole('button', { name: 'Eliminar', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Conservar dirección' }).click();
  await expect(page.locator('.account-address')).toHaveCount(1);
  await page.getByRole('button', { name: 'Eliminar', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Eliminar dirección' }).click();
  await expect(page.locator('.account-address')).toHaveCount(0);
});
test('pedidos de ejemplo, filtros, detalle y volver a pedir', async ({ page }) => {
  await page.goto('/mi-cuenta/pedidos');
  await page.getByLabel('Ver pedidos de ejemplo').check();
  await expect(page.locator('.account-order')).toHaveCount(4);
  await page.getByRole('button', { name: 'Entregado', exact: true }).click();
  await expect(page.locator('.account-order')).toHaveCount(2);
  await page.getByRole('button', { name: 'Ver detalle', exact: true }).first().click();
  await expect(page.getByRole('dialog')).toContainText('Pedido de ejemplo');
  await page.getByRole('dialog').getByRole('button', { name: 'Volver a pedir' }).click();
  await expect(page).toHaveURL(/carrito$/);
  await expect(page.locator('.cart-product-list li')).toHaveCount(1);
});
test('favoritos comparten catálogo y carrito, sin inventar favoritos guardados', async ({ page }) => {
  await page.goto('/mi-cuenta/favoritos');
  await expect(page.getByRole('heading', { name: 'Aquí van tus favoritos' })).toBeVisible();
  await page.evaluate(() => localStorage.setItem('lys-carta-favorites-' + localStorage.getItem('lys-session-v1'), JSON.stringify(['pollo-01', 'parrillas-01'])));
  await page.reload();
  await expect(page.locator('.account-favorites .product-card')).toHaveCount(2);
  await page.locator('.product-add').first().click();
  await expect(page.getByRole('status')).toContainText('agregado');
  await page.locator('.product-favorite').first().click();
  await expect(page.locator('.account-favorites .product-card')).toHaveCount(1);
});
test('preferencias y notificaciones leídas funcionan y persisten', async ({ page }) => {
  await page.goto('/mi-cuenta/notificaciones');
  const promos = page.getByRole('switch', { name: 'Promociones y ofertas' });
  await expect(promos).toHaveAttribute('aria-checked', 'false');
  await promos.click();
  await page.reload();
  await expect(promos).toHaveAttribute('aria-checked', 'true');
  await page.getByLabel('Ver notificaciones de ejemplo').check();
  await page.getByRole('button', { name: 'Marcar todas como leídas' }).click();
  await expect(page.locator('.notification-dot:not(.read)')).toHaveCount(0);
});

test('locales permite recorrer la galería y abrir la dirección real', async ({ page }) => {
  await page.goto('/locales');
  const photo = page.locator('.local-gallery-frame img');
  await expect(photo).toHaveAttribute('src', /local-selected-exterior/);
  await page.getByRole('button', { name: 'Imagen anterior', exact: true }).click();
  await expect(photo).toHaveAttribute('src', /local-selected-window/);
  await page.getByRole('button', { name: 'Imagen siguiente', exact: true }).click();
  await expect(photo).toHaveAttribute('src', /local-selected-exterior/);
  await page.getByRole('button', { name: 'Imagen siguiente', exact: true }).press('ArrowRight');
  await expect(photo).toHaveAttribute('src', /local-selected-dining/);
  await page.getByRole('button', { name: 'Ver imagen 3', exact: true }).click();
  await expect(photo).toHaveAttribute('src', /local-selected-window/);
  await expect(page.getByRole('button', { name: 'Ver imagen 3', exact: true })).toHaveAttribute('aria-current', 'true');
  const maps = new URL((await page.getByRole('link', { name: 'Ver en Google Maps' }).getAttribute('href'))!);
  expect(maps.hostname).toBe('www.google.com');
  expect(maps.searchParams.get('query')).toContain('Los Palomares Mz. D Lt. 5');
  await expect(page.locator('.local-visit-panel')).toContainText('947 540 597');
});

for (const [width, height] of [[1366, 591], [1250, 650], [1440, 900], [1920, 1080], [2560, 1440]]) {
  test(`contacto ocupa la pantalla de PC a ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/contacto');
    await expect(page.getByRole('button', { name: 'Enviar mensaje' })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const fits = () => page.evaluate(() => {
      const root = document.documentElement;
      const controls = [...document.querySelectorAll('.contact-channel, .contact-send, .contact-maps-link, .contact-quick-links a, .contact-quick-links button')];
      return root.scrollHeight <= innerHeight + 1 && root.scrollWidth <= innerWidth + 1 && controls.every(control => {
        const rect = control.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= innerHeight;
      });
    });
    await expect.poll(fits).toBeTruthy();
    await expect(page.getByText('¿Tienes alguna consulta,')).toHaveCount(0);
    await page.getByLabel('Nombre completo').fill('Cliente de prueba');
    await page.getByLabel('Correo electrónico').fill('prueba@example.com');
    await page.getByLabel('Teléfono *').fill('987654321');
    await page.getByLabel('Asunto *').selectOption('Eventos y reservas');
    await page.getByLabel('Mensaje *').fill('Quisiera consultar una reserva familiar.');
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();
    await expect(page.getByRole('link', { name: 'Abrir correo' })).toBeInViewport();
    await expect(page.getByRole('link', { name: 'Abrir WhatsApp' })).toBeInViewport();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollHeight <= innerHeight + 1)).toBeTruthy();
    await page.getByRole('button', { name: 'Editar mensaje' }).click();
    await expect(page.getByLabel('Mensaje *')).toHaveValue('Quisiera consultar una reserva familiar.');
  });
}
