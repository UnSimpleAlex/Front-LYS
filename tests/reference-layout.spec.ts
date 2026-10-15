import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const routes = [
  "administrador",
  "administrador/productos",
  "administrador/promociones",
  "administrador/clientes",
  "administrador/usuarios",
  "administrador/pedidos",
  "administrador/reportes",
  "administrador/inventario",
  "administrador/configuracion",
  "cocina",
  "cocina/pedidos",
  "cocina/historial",
  "cocina/tiempos",
  "mesera",
  "mesera/mesas",
  "mesera/nuevo-pedido",
  "mesera/pedidos",
  "mesera/cierre-mesa",
  "caja",
  "caja/cobros",
  "caja/comprobantes",
  "caja/apertura",
  "caja/cierre",
  "caja/historial",
  "delivery",
];
test("referencias: geometría y capturas de las 25 páginas internas", async ({
  page,
}) => {
  test.setTimeout(240000);
  await page.goto("/iniciar-sesion");
  await page.getByRole("button", { name: "Accesos de prueba por rol" }).click();
  await page
    .getByRole("button", { name: "Preparar cuentas de prueba" })
    .click();
  await expect(page.getByText("Demo2026!", { exact: true })).toBeVisible();
  await page
    .getByLabel("Correo electrónico", { exact: true })
    .fill("administrador@demo.local");
  await page.getByLabel("Contraseña", { exact: true }).fill("Demo2026!");
  await page
    .getByRole("button", { name: "Iniciar sesión", exact: true })
    .click();
  await expect(page).toHaveURL(/administrador$/);
  await page.setViewportSize({ width: 1672, height: 941 });
  await page.locator(".ops-side-account").click();
  await page
    .getByRole("button", { name: "Cargar datos de demostración", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await mkdir(".impeccable/review/anchor-correction", { recursive: true });
  for (const [width, height] of [
    [1672, 941],
    [1366, 591],
    [768, 1024],
    [390, 844],
    [240, 900],
  ]) {
    await page.setViewportSize({ width, height });
    for (const route of routes) {
      await page.goto("/" + route);
      await expect(page.locator(".ops-page-heading h1")).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${route}@${width}: ancho`,
      ).toBeTruthy();
      if (route === "administrador" && width === 1366) {
        expect(
          await page
            .locator(".ops-stat")
            .evaluateAll((cards) =>
              cards.every((card) => card.getBoundingClientRect().height <= 110),
            ),
        ).toBeTruthy();
        expect(
          await page
            .locator(".ops-sidebar .ops-side-navigation button")
            .evaluateAll((buttons) =>
              buttons.every(
                (button) => button.getBoundingClientRect().height <= 44,
              ),
            ),
        ).toBeTruthy();
      }
      if (route === "administrador/productos" && width === 1672) {
        expect(
          await page
            .locator(".ops-sidebar")
            .evaluate((sidebar) => sidebar.getBoundingClientRect().width),
        ).toBe(295);
        expect(
          await page
            .locator(".ops-product-list tbody tr")
            .last()
            .evaluate((row) => row.getBoundingClientRect().bottom),
        ).toBeLessThanOrEqual(height);
      }
      if (route === "administrador/configuracion")
        await expect(page.locator(".anchor-settings-tabs button")).toHaveCount(
          4,
        );
      if (route === "administrador/inventario")
        await expect(page.locator(".ops-stat")).toHaveCount(3);
      await page.screenshot({
        path: `.impeccable/review/anchor-correction/${route.replaceAll("/", "-")}-${width}.png`,
        fullPage: true,
      });
    }
  }
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/administrador/configuracion");
  const tableCount = page.getByLabel("Número de mesas en el local", {
    exact: true,
  });
  const originalCount = Number(await tableCount.inputValue());
  await tableCount.fill("1");
  await page
    .getByRole("button", { name: "Guardar cambios", exact: true })
    .click();
  await expect(page.getByRole('alert')).toContainText("Libera y cobra las mesas antes de reducir su cantidad.");
  await page.reload();
  await expect(tableCount).toHaveValue(String(originalCount));
  await tableCount.fill(String(originalCount + 1));
  await page
    .getByRole("button", { name: "Guardar cambios", exact: true })
    .click();
  await page.reload();
  await expect(tableCount).toHaveValue(String(originalCount + 1));
  await page.goto("/mesera/mesas");
  await expect(page.locator(".ops-floor .ops-table-seat")).toHaveCount(
    originalCount + 1,
  );
});
