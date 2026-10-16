import { expect, test, type Locator, type Page } from "@playwright/test";
import { readFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import type { CellValue, Buffer as ExcelBuffer } from "exceljs";
const ExcelJS = createRequire(import.meta.url)("exceljs/dist/exceljs.min.js") as typeof import("exceljs");

test.use({ timezoneId: "America/Lima" });
test.beforeEach(async ({ page }) => {
  await page.goto("/iniciar-sesion");
  await page.getByLabel("Correo electrónico", { exact: true }).fill("administrador@demo.local");
  await page.getByLabel("Contraseña", { exact: true }).fill("Demo2026!");
  await page.getByRole("button", { name: "Iniciar sesión", exact: true }).click();
  await expect(page).toHaveURL(/administrador$/);
  await page.locator(".ops-side-account").click();
  await page.getByRole("button", { name: "Cargar datos de demostración", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
async function excelRows(page: Page, button: Locator, name?: string) {
  const pending = page.waitForEvent("download");
  await button.click();
  const file = await pending;
  if (name) expect(file.suggestedFilename()).toBe(name + ".xlsx");
  expect(await file.failure()).toBeNull();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await readFile((await file.path())!) as unknown as ExcelBuffer);
  const sheet = workbook.worksheets[0];
  const table = sheet.getTable("DatosExportados");
  expect(table).toBeTruthy();
  expect(sheet.views[0]).toMatchObject({ state: "frozen", ySplit: 8 });
  if (name) {
    await mkdir("test-results/excel", { recursive: true });
    await file.saveAs(`test-results/excel/${name}.xlsx`);
  }
  const output: string[] = [];
  sheet.eachRow(row => {
    if (row.number < 8 || (row.number > 8 && typeof row.getCell(1).value !== "number")) return;
    const values = (row.values as CellValue[]).slice(2).map(value => {
      const raw = value && typeof value === "object" && "formula" in value ? value.result : value;
      return `"${String(raw ?? "").replaceAll('"', '""')}"`;
    });
    output.push(values.join(";"));
  });
  return output;
}
const exporter = (page: Page) => page.getByRole("button", { name: /Exportar/ }).filter({ visible: true }).first();
test("mesas: solicitud de cuenta legible en tarjeta compacta", async ({ page }) => {
  await page.goto("/mesera/mesas");
  await page.evaluate(async () => {
    const store = await import(String("/src/features/operations/operationsStore.ts")) as typeof import("../src/features/operations/operationsStore");
    store.updateTable(2, { status: "Solicita cuenta" });
  });
  const badge = page.locator('.ops-table-seat[data-status="Solicita cuenta"] .ops-badge');
  for (const width of [280, 390, 768, 1024, 1366, 1920]) {
    await page.setViewportSize({ width, height: 941 });
    await expect(badge).toHaveText("Solicita cuenta");
    expect(await badge.evaluate(element => {
      const text = element.querySelector("span")!;
      const bounds = element.getBoundingClientRect();
      const label = text.getBoundingClientRect();
      return label.top >= bounds.top && label.bottom <= bounds.bottom + 1 && text.scrollHeight <= text.clientHeight + 1;
    }), `Texto completo a ${width}px`).toBeTruthy();
  }
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.screenshot({ path: "test-results/table-request-readable.png" });
});
test("nuevo pedido: precio y agregar completos dentro del producto", async ({ page }) => {
  await page.goto("/mesera/nuevo-pedido");
  for (const width of [280, 390, 768, 1024, 1280, 1366, 1672, 1920]) {
    await page.setViewportSize({ width, height: 941 });
    const clipped = await page.locator(".ops-product-grid article").evaluateAll(cards => cards.flatMap(card => {
      const bounds = card.getBoundingClientRect();
      return [...card.querySelectorAll("strong,button")].filter(control => {
        const rect = control.getBoundingClientRect();
        return rect.left < bounds.left - 1 || rect.right > bounds.right + 1 || rect.bottom > bounds.bottom + 1;
      }).map(control => control.textContent);
    }));
    expect(clipped, `Recortes a ${width}px`).toEqual([]);
    if (width === 1366) await page.screenshot({ path: "test-results/product-price-complete.png" });
  }
  const product = page.locator(".ops-product-grid article").first();
  const name = await product.locator("h3").innerText();
  await product.getByRole("button", { name: /^Agregar/ }).click();
  await expect(page.locator(".anchor-cart-product").filter({ hasText: name })).toBeVisible();
});
test("caja: verificar efectivo, apertura, conteo de cierre y persistencia", async ({ page }) => {
  await page.goto("/caja/apertura");
  await page.getByRole("button", { name: "Abrir caja", exact: true }).click();
  await expect(page.locator("#cash-opening-verification")).toContainText("Marca la casilla");
  await expect(page).toHaveURL(/caja\/apertura$/);
  await expect(page.getByText("Observaciones (opcional)")).toHaveCount(0);
  await expect(page.getByLabel("Fondo inicial (S/)")).toHaveCount(0);
  await page.setViewportSize({ width: 1366, height: 768 });
  expect(await page.locator(".cash-opening-scroll").evaluate(el => el.scrollHeight > el.clientHeight)).toBeTruthy();
  const counter = page.locator(".cash-opening-stepper").first();
  await page.locator(".cash-opening-scroll").focus();
  await expect(page.locator(".cash-opening-scroll")).toHaveCSS("outline-color", "rgb(237, 0, 23)");
  await expect(counter.locator("input")).toHaveCSS("border-radius", "0px");
  const countBottom = await page.locator(".cash-opening-count").evaluate(el => el.getBoundingClientRect().bottom);
  const actionsBottom = await page.locator(".anchor-shift-form footer").evaluate(el => el.getBoundingClientRect().bottom);
  expect(Math.abs(countBottom - actionsBottom)).toBeLessThan(2);
  await page.getByLabel("Cantidad de denominación 0.1", { exact: true }).fill("1");
  await page.getByLabel("Cantidad de denominación 0.1", { exact: true }).fill("0");
  await page.getByRole("button", { name: "Agregar S/ 200", exact: true }).click();
  await page.getByLabel("Cantidad de denominación 100", { exact: true }).fill("1");
  await expect(page.locator(".cash-opening-highlight strong")).toHaveText("S/ 300.00");
  await page.getByLabel("He verificado el efectivo disponible.").check();
  await page.getByRole("button", { name: "Abrir caja", exact: true }).click();
  await expect(page).toHaveURL(/caja$/);
  await page.reload();
  await page.goto("/caja/apertura");
  await expect(page.getByRole("button", { name: "Abrir caja", exact: true })).toBeDisabled();
  await expect(page.locator(".anchor-shift-meta")).toContainText("Caja abierta");
  await page.goto("/caja/cierre");
  await page.getByRole("button", { name: "Usar fondo inicial" }).click();
  await expect(page.getByLabel("Efectivo contado (S/)")).toHaveValue("300");
  await expect(page.locator(".cash-closing-differences > div").last()).toContainText("S/ 0.00");
  await page.getByRole("button", { name: "Agregar S/ 5", exact: true }).click();
  await expect(page.getByLabel("Efectivo contado (S/)")).toHaveValue("305");
  await expect(page.locator(".cash-closing-differences > div").last()).toContainText("S/ 5.00");
  const lines = await excelRows(page, exporter(page), "resumen-caja");
  expect(lines.join("\n")).toContain('"Efectivo contado";"305"');
  await page.getByRole("button", { name: "Cerrar caja", exact: true }).click();
  await expect(page).toHaveURL(/caja$/);
  await page.reload();
  await page.goto("/caja/cierre");
  await expect(page.getByRole("button", { name: "Cerrar caja", exact: true })).toBeDisabled();
  await page.goto("/caja/apertura");
  await expect(page.getByRole("button", { name: "Abrir caja", exact: true })).toBeEnabled();
});
for (const [route, name] of [
  ["administrador/productos", "productos"], ["administrador/promociones", "promociones"],
  ["administrador/clientes", "clientes"], ["administrador/usuarios", "usuarios"],
  ["administrador/pedidos", "pedidos"], ["administrador/reportes", "reporte"],
  ["administrador/inventario", "inventario"], ["caja/historial", "pagos"],
  ["caja/comprobantes", "comprobantes"], ["cocina/historial", "historial-cocina"],
  ["caja/cierre", "resumen-caja"],
]) test(`descarga real de ${route}`, async ({ page }) => {
  await page.goto("/" + route);
  expect((await excelRows(page, exporter(page), name)).length).toBeGreaterThan(1);
});

test("inventario: filtros, selección múltiple y exportación", async ({ page }) => {
  await page.goto("/administrador/inventario");
  await page.getByLabel("Categoría de insumos").selectOption("Verduras");
  let rows = await excelRows(page, exporter(page));
  expect(rows).toHaveLength(2); expect(rows[1]).toContain('"Verduras"');
  await page.getByLabel("Categoría de insumos").selectOption("Todas");
  await page.getByLabel("Seleccionar insumo Pollo entero", { exact: true }).check();
  rows = await excelRows(page, exporter(page));
  expect(rows).toHaveLength(2); expect(rows[1]).toContain("Pollo entero");
  await page.getByLabel("Seleccionar todos los insumos").check();
  await expect(page.getByLabel("Seleccionar insumo Papas nativas", { exact: true })).toBeChecked();
  await page.getByLabel("Seleccionar todos los insumos").uncheck();
  await expect(page.getByLabel("Seleccionar insumo Pollo entero", { exact: true })).not.toBeChecked();
  await page.getByLabel("Buscar insumos", { exact: true }).fill("Carnes");
  expect(await excelRows(page, exporter(page))).toHaveLength(2);
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
  const rows = await excelRows(page, exporter(page), "proveedores");
  expect(rows).toHaveLength(2); expect(rows[1]).toContain("Proveedor funcional");
  await page.reload(); await page.getByLabel("Estado de insumos").selectOption("Proveedores");
  await expect(page.locator('[data-panel="Proveedores"]')).toContainText("Proveedor funcional");
});

test("pagos: filtro exportado, vacío y fecha local cercana a medianoche", async ({ page }) => {
  await page.goto("/caja/historial");
  await page.getByLabel("Filtrar resultados").selectOption("Yape");
  const rows = await excelRows(page, exporter(page));
  expect(rows.length).toBeGreaterThan(1);
  expect(rows.slice(1).every(row => row.includes('"Yape"'))).toBeTruthy();
  await page.getByLabel("Estado del pago").selectOption("Anulado");
  expect(await excelRows(page, exporter(page))).toHaveLength(1);
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
  expect(await excelRows(page, exporter(page))).toHaveLength(2);
});

test("comprobantes: búsqueda y Excel contienen los mismos clientes", async ({ page }) => {
  await page.goto("/caja/comprobantes");
  const customer = (await page.locator(".ops-responsive-table tbody tr").first().locator("td").nth(3).innerText()).trim();
  await page.getByLabel("Buscar número o cliente").fill(customer);
  expect((await excelRows(page, exporter(page))).slice(1).every(row => row.includes(customer))).toBeTruthy();
  await page.getByLabel("Buscar número o cliente").fill("sin comprobantes");
  expect(await excelRows(page, exporter(page))).toHaveLength(1);
  await expect(page.getByText("No hay comprobantes que coincidan con los filtros.")).toBeVisible();
});

test("productos: exportar seleccionados y aplicar categoría", async ({ page }) => {
  await page.goto("/administrador/productos");
  await page.getByLabel("Seleccionar Pollo entero", { exact: true }).check();
  expect(await excelRows(page, exporter(page))).toHaveLength(2);
  await page.getByLabel("Categoría de productos").selectOption("bebidas");
  await expect(page.getByText("0 seleccionados", { exact: true })).toBeVisible();
  expect((await excelRows(page, exporter(page))).slice(1).every(row => row.includes('"Bebidas"'))).toBeTruthy();
  await page.getByLabel("Disponibilidad", { exact: true }).selectOption("Inactivos");
  await expect(page.locator("tbody tr")).toHaveCount(0);
  await page.getByRole("button", { name: "Eliminar filtros", exact: true }).click();
  await expect(page.getByLabel("Categoría de productos")).toHaveValue("Todas");
  await expect(page.getByLabel("Disponibilidad", { exact: true })).toHaveValue("Todas");
  await expect(page.locator("tbody tr")).toHaveCount(7);
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

test("Excel conserva comillas, fórmulas como texto y números negativos", async ({ page }) => {
  const pending = page.waitForEvent("download");
  await page.evaluate(async () => {
    const files = await import(String("/src/features/operations/operationsFiles.ts")) as typeof import("../src/features/operations/operationsFiles");
    files.downloadExcel("casos", ["Texto", "Importe", "Fecha"], [['  =SUM(1;2)', -3.5, new Date("2026-10-16T00:30:00-05:00")], ['-10% "oferta"', 2, "16/10/26, 12:30 a. m."]]);
  });
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await readFile((await (await pending).path())!) as unknown as ExcelBuffer);
  const sheet = workbook.worksheets[0];
  expect(sheet.getCell("B9").value).toBe("  =SUM(1;2)");
  expect(sheet.getCell("B10").value).toBe('-10% "oferta"');
  expect(sheet.getCell("C9").value).toBe(-3.5);
  expect(sheet.getCell("B9").type).toBe(ExcelJS.ValueType.String);
  expect((sheet.getCell("D9").value as Date).toISOString()).toBe("2026-10-16T00:30:00.000Z");
  expect((sheet.getCell("D10").value as Date).toISOString()).toBe("2026-10-16T00:30:00.000Z");
});

test("caja: tipo de comprobante, RUC inválido, emisión e impresión", async ({ page }) => {
  await page.goto("/caja/apertura");
  await page.getByLabel("Cantidad de denominación 100", { exact: true }).fill("1");
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
  await expect(popup).toHaveURL(/^blob:/);
  expect(await page.evaluate(async url => {
    const response = await fetch(url);
    return (await response.text()).slice(0, 5);
  }, popup.url())).toBe("%PDF-");
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
  await expect(page.getByRole("button", { name: "Estado de Persona editada", exact: true })).toHaveAttribute("aria-pressed", "false");
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
  expect((await excelRows(page, exporter(page)))[1]).toContain('"40"');
});

test("promociones: crear, editar, desactivar, exportar y eliminar", async ({ page }) => {
  await page.goto("/administrador/promociones");
  await page.getByRole("button", { name: "Nueva promoción", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Nombre", { exact: true }).fill("Promo funcional");
  await dialog.getByRole("combobox", { name: "Tipo", exact: true }).selectOption("Cupón");
  await dialog.getByLabel("Código de cupón").fill("FUNC15");
  await dialog.getByRole("button", { name: "Guardar promoción", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await page.getByLabel("Buscar promociones").fill("Promo funcional");
  await page.getByRole("button", { name: "Editar Promo funcional", exact: true }).click();
  await dialog.getByLabel("Código de cupón").fill("FUNC-COPIA");
  await dialog.getByRole("button", { name: "Guardar promoción", exact: true }).click();
  await page.getByRole("button", { name: "Activar Promo funcional", exact: true }).click();
  await expect(page.getByRole("button", { name: "Activar Promo funcional", exact: true })).toHaveAttribute("aria-pressed", "false");
  await page.reload(); await page.getByLabel("Buscar promociones").fill("Promo funcional");
  const rows = await excelRows(page, exporter(page));
  expect(rows).toHaveLength(2);
  expect(rows[1]).toContain('"Inactiva"');
  await page.getByRole("button", { name: "Eliminar Promo funcional", exact: true }).click();
  await dialog.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(page.locator(".ops-responsive-table tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: "Eliminar Promo funcional", exact: true }).click();
  await dialog.getByRole("button", { name: "Eliminar promoción", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText(/Cambios guardados/);
  await expect(page.getByRole("status")).toHaveCount(0, { timeout: 6500 });
  await page.reload(); await page.getByLabel("Buscar promociones").fill("Promo funcional");
  await expect(page.locator(".ops-responsive-table tbody tr")).toHaveCount(0);
});

test("promociones: cambiar estado conserva el orden de las filas tras recargar", async ({ page }) => {
  await page.goto("/administrador/promociones");
  await page.getByRole("button", { name: "Nueva promoción", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Nombre", { exact: true }).fill("Segunda promoción");
  await dialog.getByRole("combobox", { name: "Tipo", exact: true }).selectOption("Cupón");
  await dialog.getByLabel("Código de cupón").fill("ORDEN10");
  await dialog.getByRole("button", { name: "Guardar promoción", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  const rows = page.locator(".ops-responsive-table tbody tr");
  const names = rows.locator("td:nth-child(2) strong");
  const originalOrder = await names.allTextContents();
  expect(originalOrder.length).toBeGreaterThan(1);
  const toggle = rows.first().getByRole("button", { name: /^Activar / });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  expect(await names.allTextContents()).toEqual(originalOrder);
  await page.reload();
  await expect(names).toHaveCount(originalOrder.length);
  expect(await names.allTextContents()).toEqual(originalOrder);
  await rows.first().getByRole("button", { name: /^Activar / }).click();
  expect(await names.allTextContents()).toEqual(originalOrder);
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
  const rows = await excelRows(page, exporter(page));
  expect(rows).toHaveLength(2); expect(rows[1]).toContain("COCINA-DEMO-001");
});

test("pagos: tarjetas uniformes, interruptores y carga de QR", async ({ page }) => {
  await page.goto("/administrador/configuracion");
  await page.getByRole("button", { name: "Pagos", exact: true }).click();
  const cards = page.locator(".ops-method-grid article");
  await expect(cards).toHaveCount(5);
  await page.locator('input[type="file"]').first().setInputFiles("public/images/checkout/yape.webp");
  await expect(page.getByAltText("QR configurado para Yape")).toHaveAttribute("src", /^data:image/);
  for (const width of [280,390,768,1366,1920]) {
    await page.setViewportSize({width,height:900});
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    const heights = await cards.evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().height));
    expect(Math.max(...heights)-Math.min(...heights)).toBeLessThanOrEqual(1);
    await page.screenshot({path:`test-results/settings-payments-${width}.png`,fullPage:true});
  }
  await page.getByRole("button", { name: "Guardar cambios", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "Pagos", exact: true }).click();
  await expect(page.getByAltText("QR configurado para Yape")).toHaveAttribute("src", /^data:image/);
});

test("cuenta: administrador puede regresar a Administración desde cocina", async ({ page }) => {
  await page.goto("/cocina");
  await page.locator(".ops-side-account").click();
  await page.getByRole("button", { name: "Administración Gestión general del negocio", exact: true }).click();
  await expect(page).toHaveURL(/\/administrador$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

for (const [route,label] of [
  ["administrador/promociones","Buscar promociones"],
  ["administrador/usuarios","Buscar nombre, correo o teléfono"],
  ["administrador/inventario","Buscar insumos"],
  ["cocina/pedidos","Buscar pedidos entrantes"],
  ["cocina/historial","Buscar historial"],
  ["delivery","Buscar entrega"],
  ["mesera/mesas","Buscar mesa"],
  ["mesera/pedidos","Buscar pedidos de salón"],
] as const) test(`restablecer filtros automáticos en ${route}`, async ({page}) => {
  await page.goto('/'+route);
  const search=page.getByLabel(label,{exact:true});
  await search.fill("SIN-COINCIDENCIAS-123");
  await expect(search).toHaveValue("SIN-COINCIDENCIAS-123");
  const reset=page.getByRole("button",{name:"Eliminar filtros",exact:true});
  await expect(reset).toHaveCSS("color","rgb(255, 255, 255)");
  await reset.click();
  await expect(search).toHaveValue("");
});
