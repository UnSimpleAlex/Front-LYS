import { expect, test } from "@playwright/test";

test("dashboard: métricas, encabezados y acceso a pedidos en PC y móvil", async ({ page }) => {
  await page.goto("/iniciar-sesion");
  await page.getByLabel("Correo electrónico", { exact: true }).fill("administrador@demo.local");
  await page.getByLabel("Contraseña", { exact: true }).fill("Demo2026!");
  await page.getByRole("button", { name: "Iniciar sesión", exact: true }).click();
  await expect(page).toHaveURL(/administrador$/);
  await page.locator(".ops-side-account").click();
  await page.getByRole("button", { name: "Cargar datos de demostración", exact: true }).click();
  await page.getByRole("button", { name: "Cerrar mensaje", exact: true }).click();
  for (const [width, height] of [[1672, 941], [768, 1024], [390, 844]]) {
    await page.setViewportSize({ width, height });
    await expect(page.getByRole("heading", { name: "Dashboard general", exact: true })).toBeVisible();
    const recent = page.locator('[data-panel="Pedidos recientes"]');
    await expect(recent.getByRole("columnheader", { name: "Cliente", exact: true })).toBeVisible();
    await expect(recent.getByRole("columnheader", { name: "Acciones", exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    await page.screenshot({ path: `.impeccable/review/anchor-correction/dashboard-final-${width}.png`, fullPage: true });
  }
  await page.locator('[data-panel="Pedidos recientes"] > header button').click();
  await expect(page).toHaveURL(/administrador\/pedidos$/);
});
