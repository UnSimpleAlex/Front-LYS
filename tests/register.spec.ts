import { test, expect, type Page } from '@playwright/test';

declare global {
  interface Window { registrationPhone: string }
}

async function fillRegistration(page: Page) {
  await page.getByLabel('Nombres y apellidos', { exact: true }).fill('María-José O’Connor');
  await page.getByLabel('Correo electrónico', { exact: true }).fill('cliente@example.com');
  await page.getByLabel('Celular', { exact: true }).fill('+51 999 888 777');
  await page.getByLabel('Contraseña', { exact: true }).fill('contraseña-de-prueba');
  await page.getByLabel('Confirmar contraseña', { exact: true }).fill('contraseña-de-prueba');
  await page.getByRole('checkbox').check();
}

test('registro valida campos, coincidencia, términos y navegación sin simular cuentas', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Regístrate', exact: true }).click();
  await expect(page).toHaveURL(/\/registro$/);
  await page.getByRole('button', { name: 'Crear cuenta', exact: true }).click();
  await expect(page.locator('#register-name')).toBeFocused();
  await expect(page.locator('#register-name-error')).toContainText('Ingresa tus nombres');
  await fillRegistration(page);
  await page.getByLabel('Nombres y apellidos', { exact: true }).fill('123');
  await page.getByLabel('Correo electrónico', { exact: true }).fill('correo-inválido');
  await page.getByLabel('Celular', { exact: true }).fill('abc');
  await page.getByLabel('Contraseña', { exact: true }).fill('');
  await page.getByRole('button', { name: 'Crear cuenta', exact: true }).click();
  for (const field of ['name', 'email', 'phone', 'password']) await expect(page.locator(`#register-${field}`)).toHaveAttribute('aria-invalid', 'true');
  await fillRegistration(page);
  await page.getByLabel('Confirmar contraseña', { exact: true }).fill('otra');
  await page.getByRole('button', { name: 'Crear cuenta', exact: true }).click();
  await expect(page.locator('#register-confirmation-error')).toContainText('no coinciden');
  await page.getByLabel('Confirmar contraseña', { exact: true }).fill('contraseña-de-prueba');
  await expect(page.locator('#register-confirmation-help')).toContainText('coinciden');
  await page.getByRole('button', { name: 'Mostrar confirmar contraseña' }).click();
  await expect(page.locator('#register-confirmation')).toHaveAttribute('type', 'text');
  await page.getByRole('checkbox').uncheck();
  await page.getByRole('button', { name: 'Crear cuenta', exact: true }).click();
  await expect(page.getByRole('checkbox')).toBeFocused();
  await expect(page.locator('#terms-error')).toContainText('Acepta');
  await page.getByRole('button', { name: 'Términos y Condiciones', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Crear cuenta', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Tus datos no se han enviado');
  await page.getByRole('button', { name: 'Continuar con Google' }).click();
  await expect(page.getByRole('status')).toContainText('Google');
  expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Crea tu cuenta', exact: true })).toBeVisible();
});

for (const outcome of ['success', 'error'] as const) {
  test(`registro carga, evita doble envío y comunica ${outcome}`, async ({ page }) => {
    await page.route('**/src/services/registrationService.ts*', route => route.fulfill({ contentType: 'application/javascript', body: `export const registrationService={register:async(values)=>{window.registrationPhone=values.phone;window.submissions=(window.submissions||0)+1;await new Promise(r=>window.finishSignIn=r);${outcome === 'success' ? 'return {ok:true};' : 'throw new Error("offline");'}},registerWithGoogle:async()=>({ok:false,message:'pendiente'})};` }));
    await page.goto('/registro'); await fillRegistration(page);
    if (outcome === 'success') {
      await page.getByLabel('Prefijo telefónico').selectOption('+57');
      await page.getByLabel('Celular', { exact: true }).fill('999 888 777');
    }
    await page.getByRole('button', { name: 'Crear cuenta', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Creando cuenta…' })).toBeDisabled();
    await expect(page.locator('#register-name')).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Continuar con Google' })).toBeDisabled();
    await page.locator('form').evaluate(form => { form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); });
    await page.evaluate(() => window.finishSignIn());
    await expect(page.getByRole(outcome === 'success' ? 'status' : 'alert')).toContainText(outcome === 'success' ? 'Cuenta creada correctamente' : 'Inténtalo nuevamente');
    expect(await page.evaluate(() => window.submissions)).toBe(1);
    expect(await page.evaluate(() => window.registrationPhone)).toBe(outcome === 'success' ? '+57 999 888 777' : '+51 999 888 777');
  });
}

const sizes = [[320,568],[360,640],[360,800],[375,667],[390,844],[412,915],[430,932],[480,900],[600,960],[768,1024],[820,1180],[1024,768],[1280,800],[1366,768],[1440,900],[1920,1080]];
for (const [width, height] of sizes) {
  test(`registro responsive ${width}×${height}`, async ({ page }, testInfo) => {
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height }); await page.goto('/registro');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
    await expect(page.getByRole('heading', { name: 'Crea tu cuenta', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Crear cuenta', exact: true }).scrollIntoViewIfNeeded();
    await expect(page.getByRole('button', { name: 'Crear cuenta', exact: true })).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await page.locator('.register-card').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
    expect(errors).toEqual([]);
    await page.evaluate(() => scrollTo(0,0));
    await page.screenshot({ path: testInfo.outputPath(`register-${width}.png`), fullPage: true });
  });
}
