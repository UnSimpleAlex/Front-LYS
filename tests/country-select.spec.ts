import { test, expect } from '@playwright/test';

for (const width of [390, 1366]) {
  test(`selector de países: búsqueda, teclado y cierre a ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 768 });
    await page.goto('/registro');
    await page.evaluate(() => document.fonts.ready);
    const trigger = page.getByRole('button', { name: /País y prefijo del celular/ });
    await trigger.click();
    await expect(page.getByLabel('Buscar país')).toBeFocused();
    await expect(page.getByRole('option')).toHaveCount(21);
    await expect(page.getByRole('option', { name: /Estados Unidos/ })).toHaveCount(0);
    await page.screenshot({ path: testInfo.outputPath(`countries-${width}.png`) });
    await page.getByLabel('Buscar país').fill('colom');
    await expect(page.getByRole('option')).toHaveCount(1);
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('option', { name: 'Colombia +57', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAccessibleName('País y prefijo del celular: Colombia +57');
    await expect(trigger).toBeFocused();
    await expect(trigger.locator('.phone-country')).toBeVisible();
    await trigger.press('ArrowDown');
    await page.getByLabel('Buscar país').fill('zzzz');
    await expect(page.getByRole('status')).toHaveText('No encontramos ese país.');
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await trigger.click();
    await page.getByRole('link', { name: 'Leñas y Sabores, inicio' }).focus();
    await expect(page.getByRole('listbox')).toHaveCount(0);
    await trigger.click();
    await page.locator('.site-header').click({ position: { x: 5, y: 5 } });
    await expect(page.getByRole('listbox')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
