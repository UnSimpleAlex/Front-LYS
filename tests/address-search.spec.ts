import { test, expect, type Page } from '@playwright/test';
const fixtures = { features: [
  { properties: { name: 'Avenida Universitaria', city: 'Los Olivos', countrycode: 'PE' }, geometry: { coordinates: [-77.071, -11.962] } },
  { properties: { name: 'Avenida Universitaria', city: 'Los Olivos', countrycode: 'PE' }, geometry: { coordinates: [-77.072, -11.963] } },
  { properties: { name: 'Calle Universidad', city: 'Los Olivos', countrycode: 'PE' }, geometry: { coordinates: [-77.075, -11.965] } },
  { properties: { name: 'Calle inválida', countrycode: 'PE' }, geometry: { coordinates: [300, 200] } },
  { properties: { name: 'Otra ciudad', countrycode: 'CL' }, geometry: { coordinates: [-77, -12] } },
] };
test.beforeEach(async ({ page }) => {
  await page.route('https://tile.openstreetmap.org/**', route => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#e9eee7"/></svg>' }));
  await page.route('https://photon.komoot.io/**', route => route.fulfill({ json: fixtures }));
});
async function open(page: Page) {
  await page.addInitScript(() => localStorage.setItem('lys-carta-cart', JSON.stringify({ 'pollo-01': 1 })));
  await page.goto('/carrito'); await page.getByRole('button', { name: 'Continuar compra' }).click();
  await page.getByRole('combobox', { name: 'Distrito *', exact: true }).selectOption('Los Olivos');
}
test('sugerencias deduplicadas, búsqueda por distrito y selección con teclado enfocan mapa', async ({ page }) => {
  const requests: string[] = []; page.on('request', request => { if (request.url().includes('photon.komoot.io')) requests.push(request.url()); });
  await open(page);
  const street = page.getByRole('combobox', { name: 'Dirección de entrega *' });
  await street.fill('Un'); await street.press('Escape'); expect(requests).toHaveLength(0);
  await street.fill('Universitaria');
  await expect(page.getByRole('option', { name: /Avenida Universitaria/ })).toBeVisible();
  await expect(page.getByRole('listbox').getByRole('option')).toHaveCount(2);
  expect(new URL(requests[0]).searchParams.get('q')).toBe('Universitaria, Los Olivos, Lima');
  await street.press('ArrowDown'); await street.press('Enter');
  await expect(street).toHaveValue('Avenida Universitaria');
  await expect(street).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.delivery-map-selection')).toContainText('-11.962000, -77.071000');
  await page.getByRole('combobox', { name: 'Distrito *', exact: true }).selectOption('Comas');
  await expect(page.locator('.delivery-map-pin')).toHaveCount(0);
});
test('fallo de búsqueda permite completar manualmente y otro distrito', async ({ page }) => {
  await page.route('https://photon.komoot.io/**', route => route.abort());
  await open(page);
  await page.getByRole('combobox', { name: 'Distrito *', exact: true }).selectOption('__other');
  await page.getByLabel('Distrito (otra zona)', { exact: false }).fill('Cercado de Lima');
  const street = page.getByRole('combobox', { name: 'Dirección de entrega *' });
  await street.fill('Calle de prueba 123');
  await expect(page.getByText('No pudimos buscar.', { exact: false })).toBeVisible();
  await street.press('Escape'); await expect(street).toHaveValue('Calle de prueba 123');
});
test('respuestas antiguas no sustituyen una búsqueda más reciente', async ({ page }) => {
  await page.route('https://photon.komoot.io/**', async route => {
    if (new URL(route.request().url()).searchParams.get('q')?.startsWith('Primera')) await new Promise(resolve => setTimeout(resolve, 1400));
    await route.fulfill({ json: fixtures });
  });
  await open(page); const street = page.getByRole('combobox', { name: 'Dirección de entrega *' });
  const request = page.waitForRequest(url => url.url().includes('q=Primera'));
  await street.fill('Primera'); await request; await street.fill('Universitaria');
  await expect(page.getByRole('option', { name: /Avenida Universitaria/ })).toBeVisible();
  await page.getByRole('option', { name: /Avenida Universitaria/ }).click();
  await expect(street).toHaveValue('Avenida Universitaria'); await expect(page.getByRole('listbox')).toHaveCount(0);
});
for (const width of [390, 768, 1440]) test(`sugerencias responsive a ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 950 }); await open(page);
  await page.getByRole('combobox', { name: 'Dirección de entrega *' }).fill('Universitaria');
  await expect(page.getByRole('option', { name: /Avenida Universitaria/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
  await page.locator('.checkout-field-grid').first().screenshot({ path: info.outputPath(`sugerencias-${width}.png`) });
});
