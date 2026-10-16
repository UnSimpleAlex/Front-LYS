import { expect, test, type Locator, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

test.use({ timezoneId: "America/Lima" });
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
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
async function csv(page: Page, button: Locator, name?: string) {
  const pending = page.waitForEvent("download");
  await button.click();
  const file = await pending;
  if (name) expect(file.suggestedFilename()).toBe(name + ".csv");
  expect(await file.failure()).toBeNull();
  const text = await readFile((await file.path())!, "utf8");
  expect(text.startsWith("\ufeff")).toBeTruthy();
  return text.slice(1).trim().split("\r\n");
}
const exporter = (page: Page) => page.getByRole("button", { name: /Exportar/ }).filter({ visible: true }).first();
for (const [route, name] of [
  ["administrador/productos", "productos"], ["administrador/promociones", "promociones"],
  ["administrador/clientes", "clientes"], ["administrador/usuarios", "usuarios"],
  ["administrador/pedidos", "pedidos"], ["administrador/reportes", "reporte"],
  ["administrador/inventario", "inventario"], ["caja/historial", "pagos"],
  ["caja/comprobantes", "comprobantes"], ["cocina/historial", "historial-cocina"],
  ["caja/cierre", "resumen-caja"],
]) test(`descarga real de ${route}`, async ({ page }) => {
  await page.goto("/" + route);
  expect((await csv(page, exporter(page), name)).length).toBeGreaterThan(1);
});

test("inventario: filtros, selección múltiple y exportación", async ({ page }) => {
  await page.goto("/administrador/inventario");
  await page.getByLabel("Categoría de insumos").selectOption("Verduras");
  let rows = await csv(page, exporter(page));
  expect(rows).toHaveLength(2); expect(rows[1]).toContain('"Verduras"');
  await page.getByLabel("Categoría de insumos").selectOption("Todas");
  await page.getByLabel("Seleccionar insumo Pollo entero", { exact: true }).check();
  rows = await csv(page, exporter(page));
  expect(rows).toHaveLength(2); expect(rows[1]).toContain("Pollo entero");
  await page.getByLabel("Seleccionar todos los insumos").check();
  await expect(page.getByLabel("Seleccionar insumo Papas nativas", { exact: true })).toBeChecked();
  await page.getByLabel("Seleccionar todos los insumos").uncheck();
  await expect(page.getByLabel("Seleccionar insumo Pollo entero", { exact: true })).not.toBeChecked();
  await page.getByLabel("Buscar insumos", { exact: true }).fill("Carnes");
  expect(await csv(page, exporter(page))).toHaveLength(2);
  await page.getByLabel("Buscar insumos", { exact: true }).fill("sin coincidencias");
  await expect(page.getByText("No hay insumos que coincidan con los filtros.")).toBeVisible();
});

test("proveedores: crear, buscar, exportar y conservar tras recarga", async ({ page }) => {
  await page.goto("/administrador/inventario");
  await page.getByLabel("Estado de insumos").selectOption("Proveedores");
  await page.getByRole("button", { name: "Nuevo proveedor", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Nombre", { exact: true }).fill("Proveedor funcional");
  await dialog.getByLabel("Teléfono", { exact: true }).fill("999888777");
  await dialog.getByLabel("Correo", { exact: true }).fill("proveedor@example.com");
  await dialog.getByRole("button", { name: "Guardar proveedor" }).click();
  await expect(dialog).toHaveCount(0);
  await page.getByLabel("Buscar insumos", { exact: true }).fill("proveedor@example.com");
  const rows = await csv(page, exporter(page), "proveedores");
  expect(rows).toHaveLength(2); expect(rows[1]).toContain("Proveedor funcional");
  await page.reload(); await page.getByLabel("Estado de insumos").selectOption("Proveedores");
  await expect(page.locator('[data-panel="Proveedores"]')).toContainText("Proveedor funcional");
});

test("pagos: filtro exportado, vacío y fecha local cercana a medianoche", async ({ page }) => {
  await page.goto("/caja/historial");
  await page.getByLabel("Filtrar resultados").selectOption("Yape");
  const rows = await csv(page, exporter(page));
  expect(rows.length).toBeGreaterThan(1);
  expect(rows.slice(1).every(row => row.includes('"Yape"'))).toBeTruthy();
  await page.getByLabel("Estado del pago").selectOption("Anulado");
  expect(await csv(page, exporter(page))).toHaveLength(1);
  await expect(page.getByText("No hay pagos que coincidan con los filtros.")).toBeVisible();
  await page.evaluate(async () => {
    const ops = await import(String("/src/features/operations/operationsStore.ts")) as typeof import("../src/features/operations/operationsStore");
    const state = structuredClone(ops.getOperations());
    state.payments.forEach((p, i) => { p.date = i === 0 ? "2026-10-16T02:00:00Z" : "2026-10-17T14:00:00Z"; });
    localStorage.setItem("lys-operations-v1", JSON.stringify(state));
  });
  await page.reload();
  await page.getByLabel("Pagos desde").fill("2026-10-15");
  await page.getByLabel("Pagos hasta").fill("2026-10-15");
  expect(await csv(page, exporter(page))).toHaveLength(2);
});

test("comprobantes: búsqueda y CSV contienen los mismos clientes", async ({ page }) => {
  await page.goto("/caja/comprobantes");
  const customer = (await page.locator(".ops-responsive-table tbody tr").first().locator("td").nth(3).innerText()).trim();
  await page.getByLabel("Buscar número o cliente").fill(customer);
  expect((await csv(page, exporter(page))).slice(1).every(row => row.includes(customer))).toBeTruthy();
  await page.getByLabel("Buscar número o cliente").fill("sin comprobantes");
  expect(await csv(page, exporter(page))).toHaveLength(1);
  await expect(page.getByText("No hay comprobantes que coincidan con los filtros.")).toBeVisible();
});

test("productos: exportar seleccionados y aplicar categoría", async ({ page }) => {
  await page.goto("/administrador/productos");
  await page.getByLabel("Seleccionar Pollo entero", { exact: true }).check();
  expect(await csv(page, exporter(page))).toHaveLength(2);
  await page.getByLabel("Categoría de productos").selectOption("bebidas");
  await page.getByRole("button", { name: "Filtrar", exact: true }).click();
  expect((await csv(page, exporter(page))).slice(1).every(row => row.includes('"Bebidas"'))).toBeTruthy();
});

test("salón: buscar Mesa 5 y alternar plano/lista", async ({ page }) => {
  await page.goto("/mesera/mesas");
  await page.getByLabel("Buscar mesa").fill(" Mesa 5 ");
  await expect(page.locator(".ops-table-seat")).toHaveCount(1);
  await expect(page.locator(".ops-table-seat")).toHaveAttribute("aria-label", /^Mesa 5,/);
  await page.getByRole("button", { name: "Vista de lista", exact: true }).click();
  await expect(page.locator(".ops-floor")).toHaveClass(/list/);
  await page.getByRole("button", { name: "Vista de plano", exact: true }).click();
  await expect(page.locator(".ops-floor")).not.toHaveClass(/list/);
});

test("delivery: pestañas por estado y transiciones persistentes", async ({ page }) => {
  await page.goto("/delivery");
  const card = page.locator(".ops-delivery-card").first();
  const id = await card.locator(".ops-delivery-id").innerText();
  await expect(page.locator(".ops-delivery-card").getByRole("button", { name: "Marcar como entregado", exact: true })).toHaveCount(0);
  await card.getByRole("button", { name: "Iniciar entrega", exact: true }).click();
  await expect(page.getByRole("button", { name: /^En camino/ })).toHaveAttribute("aria-pressed", "true");
  await page.locator(".ops-delivery-card").filter({ hasText: id }).getByRole("button", { name: "Marcar como entregado", exact: true }).click();
  await expect(page.getByRole("button", { name: /^Entregados/ })).toHaveAttribute("aria-pressed", "true");
  await page.reload(); await page.getByRole("button", { name: /^Entregados/ }).click();
  await expect(page.locator(".ops-delivery-card").filter({ hasText: id })).toContainText("Entregado");
});

test("CSV conserva comillas, fórmulas como texto y números negativos", async ({ page }) => {
  const pending = page.waitForEvent("download");
  await page.evaluate(async () => {
    const files = await import(String("/src/features/operations/operationsFiles.ts")) as typeof import("../src/features/operations/operationsFiles");
    files.downloadCsv("casos", ["Texto", "Importe"], [['  =SUM(1;2)', -3.5], ['-10% "oferta"', 2]]);
  });
  const text = await readFile((await (await pending).path())!, "utf8");
  expect(text).toContain('"\'  =SUM(1;2)";"-3.5"');
  expect(text).toContain('"\'-10% ""oferta""";"2"');
});

test("caja: tipo de comprobante, RUC inválido, emisión e impresión", async ({ page }) => {
  await page.goto("/caja/apertura");
  await page.getByLabel("Fondo inicial (S/)").fill("100");
  await page.getByLabel("He verificado el efectivo disponible.").check();
  await page.getByRole("button", { name: "Abrir caja", exact: true }).click();
  await expect(page).toHaveURL(/caja$/);
  await page.goto("/caja/cobros");
  await page.getByRole("combobox", { name: "Tipo de comprobante", exact: true }).selectOption("Factura");
  await page.getByRole("button", { name: "Yape", exact: true }).click();
  await page.getByRole("button", { name: "Procesar pago", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Factura", exact: true })).toHaveAttribute("aria-pressed", "true");
  await dialog.getByLabel("RUC (11 dígitos)", { exact: true }).fill("123");
  await dialog.getByRole("button", { name: "Emitir comprobante", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("11 dígitos");
  await dialog.getByLabel("RUC (11 dígitos)", { exact: true }).fill("20123456789");
  await dialog.getByRole("button", { name: "Emitir comprobante", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await page.goto("/caja/comprobantes");
  await page.getByLabel("Filtrar tipo de comprobante").selectOption("Factura");
  await expect(page.locator(".ops-responsive-table tbody tr")).toHaveCount(1);
  const popupEvent = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Imprimir", exact: true }).click();
  const popup = await popupEvent;
  await expect(popup).toHaveTitle(/^F001/);
  await expect(popup.locator("body")).toContainText("20123456789");
  await popup.close(); await page.reload();
  await page.getByLabel("Filtrar tipo de comprobante").selectOption("Factura");
  await expect(page.locator(".ops-responsive-table tbody tr")).toHaveCount(1);
});

test("configuración: cancelar, guardar y métodos activos en caja", async ({ page }) => {
  await page.goto("/administrador/configuracion");
  const name = page.getByLabel("Nombre del negocio", { exact: true });
  const original = await name.inputValue();
  await name.fill("Cambio descartado"); await page.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(name).toHaveValue(original);
  await name.fill("Restaurante funcional");
  await page.getByRole("button", { name: "Pagos", exact: true }).click();
  await page.getByRole("button", { name: "Activar Efectivo", exact: true }).click();
  await page.getByRole("button", { name: "Guardar cambios", exact: true }).click();
  await page.reload(); await expect(name).toHaveValue("Restaurante funcional");
  await page.goto("/caja/cobros");
  await expect(page.getByRole("button", { name: "Efectivo", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Yape", exact: true })).toHaveClass(/active/);
});

test("usuarios: crear, editar y desactivar con persistencia", async ({ page }) => {
  await page.goto("/administrador/usuarios");
  await page.getByRole("button", { name: "Nuevo usuario", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Nombre completo").fill("Persona funcional");
  await dialog.getByLabel("Correo electrónico", { exact: true }).fill("persona@example.com");
  await dialog.getByLabel("Contraseña inicial").fill("Demo2026!");
  await dialog.getByRole("combobox", { name: "Rol", exact: true }).selectOption("cocina");
  await dialog.getByRole("button", { name: "Crear cuenta", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await page.getByRole("button", { name: "Editar Persona funcional", exact: true }).click();
  await dialog.getByLabel("Nombre completo").fill("Persona editada");
  await dialog.getByRole("button", { name: "Guardar cambios", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await page.getByRole("button", { name: "Desactivar usuario Persona editada", exact: true }).click();
  await page.reload(); await page.getByLabel("Buscar nombre, correo o teléfono").fill("persona@example.com");
  await expect(page.locator(".ops-responsive-table tbody tr")).toHaveCount(1);
  await expect(page.locator(".ops-responsive-table tbody tr")).toContainText("Inactivo");
});

test("inventario: elegir insumo y validar entrada o salida", async ({ page }) => {
  await page.goto("/administrador/inventario");
  await page.getByRole("button", { name: "Registrar movimiento", exact: true }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Insumo del movimiento").selectOption({ label: "Papas nativas · 35 kg" });
  await dialog.getByLabel("Entrada (+) o salida (−)").fill("-10000");
  await dialog.getByRole("button", { name: "Guardar movimiento" }).click();
  await expect(dialog.getByRole("alert")).toContainText("Movimiento inválido");
  await dialog.getByLabel("Entrada (+) o salida (−)").fill("5");
  await dialog.getByRole("button", { name: "Guardar movimiento" }).click();
  await expect(dialog).toHaveCount(0);
  await page.reload(); await page.getByLabel("Buscar insumos").fill("Papas nativas");
  expect((await csv(page, exporter(page)))[1]).toContain('"40"');
});

test("promociones: crear, duplicar, editar, desactivar y exportar", async ({ page }) => {
  await page.goto("/administrador/promociones");
  await page.getByRole("button", { name: "Nueva promoción", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Nombre", { exact: true }).fill("Promo funcional");
  await dialog.getByRole("combobox", { name: "Tipo", exact: true }).selectOption("Cupón");
  await dialog.getByLabel("Código de cupón").fill("FUNC15");
  await dialog.getByRole("button", { name: "Guardar promoción", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await page.getByLabel("Buscar promociones").fill("Promo funcional");
  await page.getByRole("button", { name: "Duplicar Promo funcional", exact: true }).click();
  await expect(page.locator(".ops-responsive-table tbody tr")).toHaveCount(2);
  await page.getByRole("button", { name: "Editar Promo funcional (copia)", exact: true }).click();
  await dialog.getByLabel("Código de cupón").fill("FUNC-COPIA");
  await dialog.getByRole("button", { name: "Guardar promoción", exact: true }).click();
  await page.getByRole("button", { name: "Activar Promo funcional", exact: true }).click();
  await expect(page.getByRole("button", { name: "Activar Promo funcional", exact: true })).toHaveAttribute("aria-pressed", "false");
  await page.reload(); await page.getByLabel("Buscar promociones").fill("Promo funcional");
  const rows = await csv(page, exporter(page));
  expect(rows).toHaveLength(3);
  expect(rows.slice(1).every(row => row.includes('"Inactiva"'))).toBeTruthy();
});

test("pedidos: buscar desde otra página reinicia paginación y selección", async ({ page }) => {
  await page.goto("/administrador/pedidos");
  await page.getByRole("button", { name: "Página siguiente", exact: true }).click();
  await page.getByRole("button", { name: "Página siguiente", exact: true }).click();
  await page.locator(".ops-responsive-table tbody tr").first().getByRole("checkbox").check();
  await page.getByLabel("Buscar número o cliente", { exact: true }).fill("COCINA-DEMO-001");
  await expect(page.locator(".ops-responsive-table tbody tr")).toHaveCount(1);
  await expect(page.locator('.ops-pagination [aria-current="page"]')).toHaveText("1");
  await expect(page.getByRole("button", { name: "Página anterior", exact: true })).toBeDisabled();
  const rows = await csv(page, exporter(page));
  expect(rows).toHaveLength(2); expect(rows[1]).toContain("COCINA-DEMO-001");
});
