import { test, expect } from '@playwright/test';

declare global {
  interface Window { submissions: number; finishSignIn: () => void }
}

test('valida el formulario y no simula una sesión autenticada', async ({ page }) => {
  await page.goto('/iniciar-sesion');
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  await expect(page.locator('#email')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#email')).toBeFocused();
  await expect(page.locator('#email-error')).toContainText('Ingresa tu correo');
  await page.getByLabel('Correo electrónico', { exact: true }).fill('cliente@example.com');
  await page.getByLabel('Contraseña', { exact: true }).fill('contraseña-de-prueba');
  await page.getByRole('button', { name: 'Mostrar contraseña' }).click();
  await expect(page.getByLabel('Contraseña', { exact: true })).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Ocultar contraseña' }).click();
  await expect(page.getByLabel('Contraseña', { exact: true })).toHaveAttribute('type', 'password');
  await page.getByRole('checkbox').uncheck();
  await expect(page.getByRole('checkbox')).not.toBeChecked();
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Correo o contraseña incorrectos');
  expect(await page.evaluate(() => localStorage.getItem('lys-session-v1'))).toBeNull();
  await page.getByRole('button', { name: 'Continuar con Google' }).click();
  await expect(page.getByRole('status')).toContainText('Google');
});

test('menú móvil y diálogos funcionan con teclado y restauran el foco', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/iniciar-sesion');
  const toggle = page.getByRole('button', { name: /Abrir menú|Cerrar menú/ });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: 'Nosotros', exact: true }).click();
  await expect(page).toHaveURL(/nosotros$/);
  await expect(page.getByRole('heading', { level: 1, name:'Más que una pollería, somos tradición' })).toBeVisible();
  await page.goBack();
  const recovery = page.getByRole('button', { name: '¿Olvidaste tu contraseña?' });
  await recovery.click();
  await expect(page.getByRole('heading', { name: 'Recuperar contraseña' })).toBeVisible();
  await page.getByRole('button', { name: 'Entendido' }).click();
  await expect(recovery).toBeFocused();
  await page.getByRole('button', { name: 'Crear cuenta' }).click();
  await expect(page.getByRole('heading', { name: 'Crea tu cuenta', exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/registro$/);
});

for (const outcome of ['success', 'error'] as const) {
  test(`muestra carga real, evita doble envío y comunica ${outcome}`, async ({ page }) => {
    await page.route('**/src/services/authService.ts*', (route) => route.fulfill({
      contentType: 'application/javascript',
      body: `export const authService = { signIn: async () => { window.submissions = (window.submissions || 0) + 1; await new Promise(r => { window.finishSignIn = r; }); ${outcome === 'success' ? 'return {ok:true};' : 'throw new Error("offline");'} }, signInWithGoogle: async () => ({ok:false, reason:'unavailable', message:'Google estará disponible pronto.'}) };`,
    }));
    await page.goto('/iniciar-sesion');
    await page.getByLabel('Correo electrónico', { exact: true }).fill('cliente@example.com');
    await page.getByLabel('Contraseña', { exact: true }).fill('contraseña-de-prueba');
    await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Iniciando sesión…' })).toBeDisabled();
    await expect(page.locator('.spinner')).toBeVisible();
    await expect(page.locator('#email')).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Continuar con Google' })).toBeDisabled();
    await page.evaluate(() => (window as Window & { finishSignIn: () => void }).finishSignIn());
    await expect(page.getByRole(outcome === 'success' ? 'status' : 'alert')).toContainText(outcome === 'success' ? 'Sesión iniciada correctamente' : 'Inténtalo nuevamente');
    expect(await page.evaluate(() => (window as Window & { submissions: number }).submissions)).toBe(1);
    await expect(page.locator('#email')).toBeEnabled();
  });
}

test('teclado, campos inválidos y reduced motion conservan la usabilidad', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({width:320, height:568});
  await page.goto('/iniciar-sesion');
  await page.getByLabel('Correo electrónico', {exact:true}).fill('correo-inválido');
  await page.getByRole('button', {name:'Iniciar sesión', exact:true}).click();
  await expect(page.locator('#email-error')).toContainText('correo válido');
  await page.getByLabel('Correo electrónico', {exact:true}).fill('cliente@example.com');
  await page.getByLabel('Contraseña', {exact:true}).fill('clave');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', {name:'Mostrar contraseña'})).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.locator('#password')).toHaveAttribute('type','text');
  expect(await page.locator('.sign-in-card').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await expect(page.locator('#email')).toHaveAttribute('aria-invalid','false');
});
