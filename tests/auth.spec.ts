import { test, expect } from '@playwright/test';

test('valida el formulario y no simula una sesión autenticada', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  await expect(page.locator('#email:invalid')).toHaveCount(1);
  await page.getByLabel('Correo electrónico', { exact: true }).fill('cliente@example.com');
  await page.getByLabel('Contraseña', { exact: true }).fill('contraseña-de-prueba');
  await page.getByRole('button', { name: 'Mostrar contraseña' }).click();
  await expect(page.getByLabel('Contraseña', { exact: true })).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Ocultar contraseña' }).click();
  await expect(page.getByLabel('Contraseña', { exact: true })).toHaveAttribute('type', 'password');
  await page.getByRole('checkbox').uncheck();
  await expect(page.getByRole('checkbox')).not.toBeChecked();
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('estará disponible pronto');
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
  await page.getByRole('button', { name: 'Continuar con Google' }).click();
  await expect(page.getByRole('status')).toContainText('Google');
});

test('menú móvil y diálogos funcionan con teclado y restauran el foco', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: /Abrir menú|Cerrar menú/ });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: 'Carta', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  const recovery = page.getByRole('button', { name: '¿Olvidaste tu contraseña?' });
  await recovery.click();
  await expect(page.getByRole('heading', { name: 'Recuperar contraseña' })).toBeVisible();
  await page.getByRole('button', { name: 'Entendido' }).click();
  await expect(recovery).toBeFocused();
  await page.getByRole('button', { name: 'Regístrate' }).click();
  await expect(page.getByRole('heading', { name: 'Crea tu cuenta' })).toBeVisible();
});
