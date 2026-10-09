import { test, expect, type Page } from '@playwright/test';

const tile = '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#e9eee7"/><path d="M0 64h256M0 192h256M64 0v256M192 0v256" stroke="white" stroke-width="16"/></svg>';
async function openDelivery(page: Page) {
  await page.addInitScript(() => localStorage.setItem('lys-carta-cart', JSON.stringify({ 'pollo-01': 1 })));
  await page.goto('/carrito');
  await page.getByRole('button', { name: 'Continuar compra' }).click();
  await expect(page.getByRole('region', { name: 'Mapa para seleccionar la ubicación de entrega' })).toBeVisible();
}
test.beforeEach(async ({ page }) => { await page.route('https://tile.openstreetmap.org/**', route => route.fulfill({ contentType: 'image/svg+xml', body: tile })); });

test('selección manual, arrastre, teclado, edición y recibo conservan las coordenadas', async ({ page }) => {
  await openDelivery(page);
  await page.getByLabel('Dirección de entrega', { exact: false }).fill('Av. de prueba 123');
  await page.getByRole('textbox', { name: 'Distrito *', exact: true }).fill('Lima');
  await page.getByRole('textbox', { name: 'Referencia *', exact: true }).fill('Frente al parque');
  await page.getByLabel('Nombre completo', { exact: false }).fill('Cliente prueba');
  await page.getByLabel('Celular', { exact: false }).fill('987654321');
  await page.getByLabel('Correo electrónico', { exact: false }).fill('prueba@example.com');
  const map = page.getByRole('region', { name: 'Mapa para seleccionar la ubicación de entrega' });
  await map.click({ position: { x: 120, y: 130 } });
  const selection = page.locator('.delivery-map-selection');
  await expect(selection).toContainText('Punto seleccionado:');
  const original = await selection.textContent();
  const marker = page.getByTitle('Punto de entrega: arrastra para ajustar', { exact: true });
  const box = await marker.boundingBox();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + 15);
  await page.mouse.down(); await page.mouse.move(box!.x + 100, box!.y + 40, { steps: 8 }); await page.mouse.up();
  await expect(selection).not.toHaveText(original!);
  await page.getByRole('button', { name: 'Quitar ubicación' }).click();
  await expect(marker).toHaveCount(0);
  await map.focus(); await page.keyboard.press('ArrowRight');
  await page.getByRole('button', { name: 'Marcar el centro del mapa' }).click();
  await expect(marker).toBeVisible();
  const selected = await selection.textContent();
  await page.getByRole('button', { name: 'Continuar al pago' }).click();
  await page.getByRole('button', { name: 'Volver', exact: false }).click();
  await expect(selection).toHaveText(selected!);
  await page.getByRole('button', { name: 'Continuar al pago' }).click();
  await page.getByRole('radio', { name: /Efectivo/ }).check();
  await page.getByLabel('Pagaré con monto exacto').check();
  await page.getByRole('button', { name: 'Revisar pedido' }).click();
  const link = page.getByRole('link', { name: 'Ver ubicación en el mapa' });
  await expect(link).toHaveAttribute('href', /https:\/\/www.openstreetmap.org\/\?mlat=/);
  const href = await link.getAttribute('href');
  await page.getByRole('button', { name: 'Confirmar pedido', exact: true }).click();
  await expect(link).toHaveAttribute('href', href!);
  await page.reload(); await expect(link).toHaveAttribute('href', href!);
});

test('ubicación actual solo se usa al pulsar el botón y permite ajustar el punto', async ({ page, context }) => {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: -12.119, longitude: -76.991, accuracy: 25 });
  await openDelivery(page);
  await expect(page.locator('.delivery-map-pin')).toHaveCount(0);
  await page.getByRole('button', { name: 'Usar mi ubicación', exact: true }).click();
  await expect(page.locator('.delivery-map-selection')).toHaveText('Punto seleccionado: -12.119000, -76.991000');
  await expect(page.locator('.delivery-map-message')).toContainText('25 m');
  await expect(page.locator('.leaflet-tile').first()).toHaveAttribute('src', /\/18\//);
  await page.getByRole('button', { name: 'Marcar el centro del mapa' }).click();
  await expect(page.locator('.delivery-map-selection')).toHaveText('Punto seleccionado: -12.119000, -76.991000');
  await page.getByRole('button', { name: 'Quitar ubicación' }).click();
  await expect(page.locator('.delivery-map-pin')).toHaveCount(0);
});

test('permiso denegado conserva la selección manual y cambiar calle descarta el punto anterior', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'geolocation', { value: { getCurrentPosition: (_success: unknown, error: (value: { code: number }) => void) => error({ code: 1 }) } }));
  await openDelivery(page);
  await page.getByRole('button', { name: 'Usar mi ubicación', exact: true }).click();
  await expect(page.locator('.delivery-map-message')).toContainText('No se autorizó');
  await expect(page.getByRole('button', { name: 'Usar mi ubicación', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Marcar el centro del mapa' }).click();
  await expect(page.locator('.delivery-map-pin')).toBeVisible();
  await page.getByLabel('Dirección de entrega', { exact: false }).fill('Otra calle 123');
  await expect(page.locator('.delivery-map-pin')).toHaveCount(0);
});

test('seleccionar manualmente descarta una respuesta de ubicación pendiente', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'geolocation', { value: { getCurrentPosition: (success: (position: unknown) => void) => { Object.assign(window, { finishLocation: () => success({ coords: { latitude: -12.119, longitude: -76.991, accuracy: 25 } }) }); } } }));
  await openDelivery(page);
  await page.getByRole('button', { name: 'Usar mi ubicación', exact: true }).click();
  await page.getByRole('button', { name: 'Marcar el centro del mapa' }).click();
  const selected = await page.locator('.delivery-map-selection').textContent();
  await page.evaluate(() => (window as unknown as { finishLocation: () => void }).finishLocation());
  await expect(page.locator('.delivery-map-selection')).toHaveText(selected!);
  await expect(page.getByRole('button', { name: 'Usar mi ubicación', exact: true })).toBeEnabled();
});

test('fallo del proveedor permite reintentar sin bloquear el formulario', async ({ page }) => {
  await page.route('https://tile.openstreetmap.org/**', route => route.abort());
  await openDelivery(page);
  await expect(page.locator('.delivery-map-message')).toContainText('No pudimos cargar parte del mapa');
  await page.unroute('https://tile.openstreetmap.org/**');
  await page.route('https://tile.openstreetmap.org/**', route => route.fulfill({ contentType: 'image/svg+xml', body: tile }));
  await page.getByRole('button', { name: 'Reintentar', exact: true }).click();
  await expect(page.getByText('No pudimos cargar parte del mapa', { exact: false })).toHaveCount(0);
});

for (const width of [240, 390, 768, 1920]) test(`mapa responsive y atribución visible a ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 900 });
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await openDelivery(page);
  await page.locator('.delivery-map-picker').scrollIntoViewIfNeeded();
  await expect(page.locator('.leaflet-control-attribution')).toContainText('OpenStreetMap');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
  await page.getByRole('button', { name: 'Marcar el centro del mapa' }).click();
  await expect(page.locator('.delivery-map-pin')).toBeVisible();
  if (width !== 240) await page.screenshot({ path: info.outputPath(`map-${width}.png`), fullPage: true });
  expect(errors).toEqual([]);
});
