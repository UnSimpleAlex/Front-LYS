import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";

test.beforeEach(async ({ page }) => {
  await page.goto("/iniciar-sesion");
  await page.getByRole("button", { name: "Accesos de prueba por rol" }).click();
  await page.getByRole("button", { name: "Preparar cuentas de prueba" }).click();
  await expect(page.getByText("Demo2026!", { exact: true })).toBeVisible();
  await page.getByLabel("Correo electrónico", { exact: true }).fill("administrador@demo.local");
  await page.getByLabel("Contraseña", { exact: true }).fill("Demo2026!");
  await page.getByRole("button", { name: "Iniciar sesión", exact: true }).click();
  await expect(page).toHaveURL(/administrador$/);
  await page.locator(".ops-side-account").click();
  await page.getByRole("button", { name: "Cargar datos de demostración", exact: true }).click();
});

for (const [route, name] of [
  ["productos", "Nuevo producto"], ["promociones", "Nueva promoción"],
  ["usuarios", "Nuevo usuario"], ["clientes", "Nuevo cliente"], ["inventario", "Nuevo insumo"],
]) test(`ventana de ${route}: teclado y pantallas bajas`, async ({ page }) => {
  await page.goto(`/administrador/${route}`);
  await page.getByRole("button", { name, exact: true }).click();
  const dialog = page.getByRole("dialog").last();
  await expect(dialog).toBeVisible();
  await mkdir(".impeccable/review/audit-estados", { recursive: true });
  for (const [width, height] of [[280, 568], [390, 500], [844, 390], [768, 1024], [1366, 591], [1920, 1080]]) {
    await page.setViewportSize({ width, height });
    expect(await dialog.evaluate(el => {
      const r = el.getBoundingClientRect();
      return r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1 && el.scrollWidth <= el.clientWidth + 1;
    }), `${route}@${width}x${height}`).toBeTruthy();
    await dialog.getByRole("button", { name: "Cerrar ventana", exact: true }).focus();
    for (let i = 0; i < 8; i++) await page.keyboard.press("Tab");
    expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBeTruthy();
    if (width === 390 || width === 1366) await page.screenshot({ path: `.impeccable/review/audit-estados/${route}-${width}.png` });
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("button", { name, exact: true })).toBeFocused();
});

test("vacío, contenido largo, menú móvil y escala de texto", async ({ page }) => {
  await page.goto("/administrador/productos");
  await page.getByPlaceholder("Buscar por nombre o SKU").fill("sin coincidencias de auditoría");
  await expect(page.getByText("No se encontraron productos. Prueba con otros filtros.")).toBeVisible();
  await page.getByRole("button", { name: "Nuevo producto", exact: true }).click();
  await page.getByLabel("Nombre del producto", { exact: true }).fill("Producto con nombre extenso para revisar legibilidad y validación ".repeat(4));
  await page.setViewportSize({ width: 390, height: 600 });
  await page.getByRole("button", { name: "Vista previa", exact: true }).click();
  const preview = page.getByRole("dialog").last();
  await expect(preview).toBeVisible();
  expect(await preview.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBeTruthy();
  await page.keyboard.press("Escape");
  await page.getByLabel("Nombre del producto", { exact: true }).fill("");
  await page.getByRole("button", { name: "Guardar producto", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await page.getByLabel("Nombre del producto", { exact: true }).evaluate(el => (el as HTMLInputElement).validity.valueMissing)).toBeTruthy();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Abrir menú del panel", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.goto("/cocina");
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
  await page.evaluate(() => { document.documentElement.style.fontSize = ""; document.body.style.zoom = "1.25"; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
});


test("tabla desplazable con teclado y título de página", async ({ page }) => {
  await page.goto("/administrador");
  await expect(page).toHaveTitle("Dashboard general | Leñas y Sabores");
  await page.setViewportSize({ width: 390, height: 600 });
  const region = page.locator(".reference-dashboard > .ops-panel .ops-table-wrap[data-scrollable]");
  await expect(region).toHaveAttribute("role", "region");
  await region.focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => region.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
});

test.describe("interacción táctil", () => {
  test.use({ hasTouch: true });
  test("acciones de clientes y usuarios con área táctil suficiente", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const route of ["clientes", "usuarios"]) {
      await page.goto(`/administrador/${route}`);
      await expect(page.locator(".ops-page-heading h1")).toBeVisible();
      const actions = page.locator(".ops-table-actions > button");
      expect(await actions.count()).toBeGreaterThan(0);
      for (const button of await actions.all()) {
        const box = await button.boundingBox();
        expect(box && box.width >= 44 && box.height >= 44).toBeTruthy();
      }
    }
  });
});
