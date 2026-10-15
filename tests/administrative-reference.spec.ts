import { expect, test, type Page } from "@playwright/test";

async function admin(page: Page) {
  await page.goto("/iniciar-sesion");
  await page.getByRole("button", { name: "Accesos de prueba por rol" }).click();
  await page
    .getByRole("button", { name: "Preparar cuentas de prueba" })
    .click();
  await expect(page.getByText("Demo2026!", {exact:true})).toBeVisible();
  await page
    .getByLabel("Correo electrónico", { exact: true })
    .fill("administrador@demo.local");
  await page.getByLabel("Contraseña", { exact: true }).fill("Demo2026!");
  await page
    .getByRole("button", { name: "Iniciar sesión", exact: true })
    .click();
  await expect(page).toHaveURL(/administrador$/);
}

async function preview(page: Page) {
  await page.locator(".ops-side-account").click();
  await page
    .getByRole("button", { name: "Cargar datos de demostración", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
}

test("PC mantiene siete productos visibles y acciones compactas de salón", async ({ page }) => {
  await page.setViewportSize({ width: 1672, height: 941 });
  await admin(page);
  await preview(page);
  await page.goto("/administrador/productos");
  await expect(page.locator(".ops-product-list tbody tr")).toHaveCount(7);
  await page.evaluate(() => document.fonts.ready);
  expect(await page.locator(".ops-product-list tbody tr").last().evaluate(row => row.getBoundingClientRect().bottom)).toBeLessThanOrEqual(941);
  expect(await page.locator(".ops-product-actions > button").evaluateAll(buttons => buttons.every(button => button.getBoundingClientRect().height <= 44))).toBeTruthy();
  await page.goto("/mesera/pedidos");
  await expect(page.locator("tbody tr").first()).toBeVisible();
  expect(await page.locator("tbody tr").evaluateAll(rows => rows.every(row => row.getBoundingClientRect().height <= 100))).toBeTruthy();
  expect(await page.locator(".ops-product-summary > div").evaluateAll(cells => cells.every(cell => cell.getBoundingClientRect().width >= 120))).toBeTruthy();
});

test("indicadores sin cifras inventadas, paginación y edición del pedido existente", async ({
  page,
}) => {
  await admin(page);
  await expect(
    page
      .locator(".ops-stat")
      .filter({ hasText: "Ventas de hoy" })
      .locator("strong"),
  ).toHaveText("S/ 0.00");
  await page.goto("/administrador/reportes");
  await expect(
    page
      .locator(".ops-stat")
      .filter({ hasText: "Ventas totales" })
      .locator("strong"),
  ).toHaveText("S/ 0.00");
  await preview(page);
  await page.goto("/administrador/pedidos");
  const first = await page.locator("tbody tr").first().innerText();
  await page
    .getByRole("button", { name: "Página siguiente", exact: true })
    .click();
  expect(await page.locator("tbody tr").first().innerText()).not.toBe(first);
  await page.getByLabel("Fecha desde", { exact: true }).fill("2099-01-01");
  await expect(page.locator("tbody tr")).toHaveCount(0);
  await page.getByLabel("Fecha desde", { exact: true }).fill("");
  await page.getByRole("button", { name: "Filtrar", exact: true }).click();
  const enabledEdit = page.locator(".btn-edit:not(:disabled)").first();
  const id = (await enabledEdit.getAttribute("aria-label"))!.replace(
    "Editar pedido #",
    "",
  );
  await enabledEdit.click();
  await page
    .getByRole("dialog")
    .getByLabel("Notas para cocina")
    .fill("Cambio de prueba conservando el pedido");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Guardar pedido" })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.reload();
  const saved = await page.evaluate(
    (orderId) =>
      JSON.parse(localStorage.getItem("lys-operations-v1")!).orders.find(
        (o: { id: string }) => o.id === orderId,
      ),
    id,
  );
  expect(saved.notes).toBe("Cambio de prueba conservando el pedido");
});

test("delivery conserva estados y caja usa el importe exacto con céntimos", async ({
  page,
}) => {
  await admin(page);
  await preview(page);
  await page.goto("/delivery");
  await expect(page.locator(".ops-delivery-card").first()).toBeVisible();
  await expect(page.locator(".ops-delivery-map iframe")).toHaveCount(0);
  const card = page
    .locator(".ops-delivery-card")
    .filter({
      has: page.getByRole("button", { name: "Iniciar entrega", exact: true }),
    })
    .first();
  const id = (await card.locator(".ops-delivery-id").innerText()).slice(1);
  await card
    .getByRole("button", { name: "Iniciar entrega", exact: true })
    .click();
  const started = page
    .locator(".ops-delivery-card")
    .filter({ hasText: `#${id}` });
  await expect(started).toContainText("En camino");
  await started
    .getByRole("button", { name: "Marcar como entregado", exact: true })
    .click();
  await page.getByRole("button", { name: /^Completadas/ }).click();
  await expect(
    page.locator(".ops-delivery-card").filter({ hasText: `#${id}` }),
  ).toContainText("Entregado");
  await page.goto("/caja/cobros");
  const exact = page.getByRole("button", { name: /^Exacto \(S\// });
  const amount = (await exact.innerText())
    .match(/S\/ ([\d,.]+)/)![1]
    .replaceAll(",", "");
  await exact.click();
  await expect(page.getByLabel("Monto recibido", { exact: true })).toHaveValue(
    String(Number(amount)),
  );
});
