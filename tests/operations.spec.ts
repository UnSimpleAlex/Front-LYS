import { test, expect, type Page } from "@playwright/test";
async function setup(page: Page) {
  await page.goto("/iniciar-sesion");
  await page.getByRole("button", { name: "Accesos de prueba por rol" }).click();
  await page
    .getByRole("button", { name: "Preparar cuentas de prueba" })
    .click();
  await expect(page.getByText("Demo2026!", { exact: true })).toBeVisible();
}
async function login(page: Page, role: string) {
  await page.goto("/iniciar-sesion");
  await page.evaluate(async () => {
    const auth = (await import(
      String("/src/services/localAuth.ts")
    )) as typeof import("../src/services/localAuth");
    auth.logoutLocal();
  });
  await page.goto("/iniciar-sesion");
  await page
    .getByLabel("Correo electrónico", { exact: true })
    .fill(role + "@demo.local");
  await page.getByLabel("Contraseña", { exact: true }).fill("Demo2026!");
  await page
    .getByRole("button", { name: "Iniciar sesión", exact: true })
    .click();
  await expect(page).toHaveURL(new RegExp("/" + role + "$"));
}
test("pedido compartido: salón → cocina → entrega → caja → comprobante y permisos", async ({
  page,
}) => {
  await setup(page);
  await login(page, "mesera");
  await page
    .getByRole("button", { name: "Nuevo pedido", exact: true })
    .first()
    .click();
  await page
    .locator(".ops-product-grid article")
    .first()
    .getByRole("button", { name: "+ Agregar" })
    .click();
  await page
    .getByRole("button", { name: "Enviar a cocina", exact: true })
    .click();
  await expect(page.locator(".ops-table-wrap")).toContainText("Recibido");
  await expect(page.locator(".ops-table-wrap tbody tr")).toHaveCount(1);
  const id = await page
    .locator(".ops-table-wrap tbody tr")
    .first()
    .locator("td")
    .nth(1)
    .textContent();
  expect(id).toBeTruthy();
  await page.goto("/administrador/productos");
  await expect(
    page.getByRole("heading", { name: "Acceso restringido" }),
  ).toBeVisible();
  await login(page, "cocina");
  await page.getByRole("button", { name: "Aceptar pedido" }).click();
  await expect(page.locator(".ops-kanban")).toContainText("En preparación");
  await page.getByRole("button", { name: "Marcar listo" }).click();
  await login(page, "mesera");
  await page.getByRole("button", { name: "Pedidos", exact: true }).click();
  await page.getByRole("button", { name: "Entregar", exact: true }).click();
  await expect(page.locator(".ops-table-wrap")).toContainText("Entregado");
  await login(page, "caja");
  await page.getByRole("button", { name: "Abrir caja", exact: true }).click();
  await page.getByLabel("He verificado el efectivo disponible.").check();
  await page.getByRole("button", { name: "Abrir caja", exact: true }).click();
  await page.getByRole("button", { name: "Cobros", exact: true }).click();
  await page.getByLabel("Monto recibido").fill("100");
  await page
    .getByRole("button", { name: "Procesar pago", exact: true })
    .click();
  await expect(
    page
      .getByRole("heading", { name: "Pedidos pendientes de cobro" })
      .locator("xpath=ancestor::section[1]"),
  ).toContainText("No hay pedidos pendientes");
  await expect(
    page
      .getByRole("heading", { name: "Pagos recientes" })
      .locator("xpath=ancestor::section[1]"),
  ).toContainText("Pagado");
  await page
    .getByRole("button", { name: "Emitir comprobante", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Emitir comprobante", exact: true })
    .click();
  await expect(page.locator(".ops-table-wrap")).toContainText("B001-000001");
  await page.reload();
  await expect(page.locator(".ops-table-wrap")).toContainText("B001-000001");
  await page.evaluate(async () => {
    const ops = (await import(
      String("/src/features/operations/operationsStore.ts")
    )) as typeof import("../src/features/operations/operationsStore");
    const order = ops.getOperations().orders[0];
    let blocked = false;
    try {
      ops.processPayment(order.id, "Efectivo", 100);
    } catch {
      blocked = true;
    }
    if (!blocked) throw new Error("Cobro duplicado permitido");
    const shift = ops.getOperations().shifts.find((s) => !s.closed)!;
    const expected = ops.expectedCash(shift);
    ops.closeShift(expected, "Prueba");
    try {
      ops.processPayment(order.id, "Efectivo", 100);
      throw new Error("Pago sin caja abierta");
    } catch (error) {
      if ((error as Error).message === "Pago sin caja abierta") throw error;
    }
  });
});
test("registro real local, contraseña y sesión persisten sin elevar roles", async ({
  page,
}) => {
  await page.goto("/iniciar-sesion");
  await expect(page.locator(".login-link")).toHaveText("Iniciar Session");
  await page.evaluate(async () => {
    const auth = (await import(
      String("/src/services/localAuth.ts")
    )) as typeof import("../src/services/localAuth");
    await auth.createLocalUser({
      name: "Cliente prueba",
      email: "cliente@test.local",
      phone: "987654321",
      password: "Prueba2026!",
      role: "administrador",
    });
    await auth.loginLocal("cliente@test.local", "Prueba2026!");
  });
  await page.goto("/mi-cuenta");
  await expect(page.locator(".account-demo-banner")).toContainText(
    "Cliente prueba",
  );
  await page.reload();
  await expect(page.locator(".account-demo-banner")).toContainText(
    "Cliente prueba",
  );
  await page.evaluate(async () => {
    const auth = (await import(
      String("/src/services/localAuth.ts")
    )) as typeof import("../src/services/localAuth");
    if (auth.currentUser()?.role !== "cliente")
      throw new Error("Elevación de rol");
    await auth.changeLocalPassword("Prueba2026!", "Nueva2026!");
    auth.logoutLocal();
    let blocked = false;
    try {
      await auth.loginLocal("cliente@test.local", "Prueba2026!");
    } catch {
      blocked = true;
    }
    if (!blocked) throw new Error("Contraseña anterior válida");
    await auth.loginLocal("cliente@test.local", "Nueva2026!");
  });
});
const routes = [
  "/cocina",
  "/cocina/pedidos",
  "/cocina/historial",
  "/cocina/tiempos",
  "/mesera",
  "/mesera/mesas",
  "/mesera/nuevo-pedido",
  "/mesera/pedidos",
  "/mesera/cierre-mesa",
  "/caja",
  "/caja/cobros",
  "/caja/comprobantes",
  "/caja/apertura",
  "/caja/cierre",
  "/caja/historial",
  "/administrador",
  "/administrador/productos",
  "/administrador/promociones",
  "/administrador/clientes",
  "/administrador/usuarios",
  "/administrador/inventario",
  "/administrador/configuracion",
  "/administrador/pedidos",
  "/administrador/reportes",
];
for (const width of [240, 390, 768, 1024, 1280, 1366, 1440, 1920])
  test(`24 pantallas operativas responsive a ${width}px`, async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 1080 });
    await setup(page);
    await login(page, "administrador");
    await page
      .getByRole("button", { name: "Cargar pedidos de ejemplo" })
      .click();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator(".ops-page-heading h1")).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        )
        .toBeTruthy();
      expect(
        await page
          .locator(".ops-root img")
          .evaluateAll((images) =>
            images
              .filter(
                (i) =>
                  i instanceof HTMLImageElement &&
                  i.complete &&
                  !i.naturalWidth,
              )
              .map((i) => i.getAttribute("src")),
          ),
      ).toEqual([]);
      expect(
        await page
          .locator(".ops-table-wrap")
          .evaluateAll((tables) =>
            tables
              .filter((table) => table.scrollWidth > table.clientWidth + 1)
              .map((table) =>
                table.closest("section")?.getAttribute("data-panel"),
              ),
          ),
      ).toEqual([]);
      expect(
        await page.locator(".ops-table-wrap button").evaluateAll((buttons) =>
          buttons
            .filter((button) => {
              const rect = button.getBoundingClientRect();
              const panel = button
                .closest(".ops-table-wrap")!
                .getBoundingClientRect();
              return (
                rect.width &&
                (rect.left < panel.left - 1 || rect.right > panel.right + 1)
              );
            })
            .map(
              (button) =>
                button.textContent || button.getAttribute("aria-label"),
            ),
        ),
      ).toEqual([]);
      if ([390, 768, 1366, 1920].includes(width))
        await page.screenshot({
          path: `test-results/ops-${route.replaceAll("/", "-")}-${width}.png`,
          fullPage: true,
        });
    }
    expect(errors).toEqual([]);
  });

test("administración vincula catálogo, cupones, stock y caja entre pestañas", async ({
  page,
  context,
}) => {
  await setup(page);
  await login(page, "administrador");
  const second = await context.newPage();
  await second.goto("/carta");
  await page.evaluate(async () => {
    const ops = (await import(
      String("/src/features/operations/operationsStore.ts")
    )) as typeof import("../src/features/operations/operationsStore");
    const product = ops.getOperations().products[0];
    ops.saveProduct({
      ...product,
      name: "Pollo especial conectado",
      price: 37,
      stock: 3,
    });
    ops.saveOffer({
      id: "prueba",
      name: "Oferta conectada",
      type: "Combo",
      productId: product.id,
      percent: 10,
      code: "",
      start: "2020-01-01",
      end: "2099-12-31",
      active: true,
      used: 0,
      limit: 100,
    });
  });
  await expect(
    second.getByText("Pollo especial conectado", { exact: true }).first(),
  ).toBeVisible();
  await page.evaluate(async () => {
    const ops = (await import(
      String("/src/features/operations/operationsStore.ts")
    )) as typeof import("../src/features/operations/operationsStore");
    const auth = (await import(
      String("/src/services/localAuth.ts")
    )) as typeof import("../src/services/localAuth");
    const product = ops.getOperations().products[0];
    const order = {
      customerId: auth.currentUser()!.id,
      customer: "Prueba",
      phone: "987654321",
      email: "prueba@test.local",
      address: "Dirección de prueba",
      channel: "Salón" as const,
      table: 1,
      items: [{ product, count: 1 }],
      notes: "",
      discount: 0,
      shipping: 0,
      method: "Yape",
    };
    const id = ops.createOrder(order);
    let blocked = false;
    try {
      ops.createOrder({
        ...order,
        items: [
          { product, count: 2 },
          { product, count: 1 },
        ],
      });
    } catch {
      blocked = true;
    }
    if (!blocked) throw new Error("Stock agregado inválido aceptado");
    ops.changeStatus(id, "Cancelado");
    if (
      ops.getOperations().products.find((p) => p.id === product.id)!.stock !== 3
    )
      throw new Error("No se restauró stock");
    const digital = ops.createOrder(order);
    ops.openShift(100, "Prueba");
    ops.processPayment(digital, "Yape", 37);
    const shift = ops.getOperations().shifts.find((s) => !s.closed)!;
    if (ops.expectedCash(shift) !== 100)
      throw new Error("Pago digital contado como efectivo");
    const draft = ops.createOrder({ ...order, draft: true });
    ops.saveProduct({ ...product, stock: 0 });
    blocked = false;
    try {
      ops.sendDraft(draft);
    } catch {
      blocked = true;
    }
    if (!blocked) throw new Error("Borrador enviado sin stock");
    await auth.loginLocal("mesera@demo.local", "Demo2026!");
    blocked = false;
    try {
      ops.saveSettings(ops.getOperations().settings);
    } catch {
      blocked = true;
    }
    if (!blocked) throw new Error("Salón editó configuración");
  });
  await expect(second.locator(".login-link")).toContainText("Demo Salón");
});

test("inventario muestra el formulario al editar o crear y guarda el insumo", async ({
  page,
}) => {
  await setup(page);
  await login(page, "administrador");
  await page.goto("/administrador/inventario");
  await expect(
    page.getByRole("heading", { name: "Nuevo / Editar insumo" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Nuevo insumo" }).click();
  const form = page.locator('section[data-panel="Nuevo / Editar insumo"]');
  await form.getByLabel("Nombre", { exact: true }).fill("Aceite de prueba");
  await form.getByLabel("Categoría", { exact: true }).fill("Aceites");
  await form.getByLabel("Unidad", { exact: true }).fill("litros");
  await form.getByLabel("Stock actual", { exact: true }).fill("15");
  await form.getByLabel("Stock mínimo", { exact: true }).fill("20");
  await form.getByLabel("Costo unitario (S/)", { exact: true }).fill("10");
  await form.getByRole("button", { name: "Guardar insumo" }).click();
  await expect(form).toHaveCount(0);
  const row = page.locator("tbody tr").filter({ hasText: "Aceite de prueba" });
  await expect(row).toContainText("Stock bajo");
  await row.getByRole("button", { name: "Editar", exact: true }).click();
  await expect(form.getByLabel("Nombre", { exact: true })).toHaveValue(
    "Aceite de prueba",
  );
  await form.getByRole("button", { name: "Cerrar formulario" }).click();
  await expect(form).toHaveCount(0);
});

test("navbar compacto y menú completo en móvil, tablet y PC", async ({
  page,
}) => {
  await setup(page);
  await login(page, "administrador");
  for (const width of [240, 390, 768, 1024, 1280, 1366, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/administrador/productos");
    await expect(page.locator("h1")).toHaveText("Gestión de productos");
    expect(
      await page
        .locator(".ops-header")
        .evaluate((header) => header.getBoundingClientRect().height),
    ).toBeLessThanOrEqual(82);
    const toggle = page.getByRole("button", { name: "Abrir menú del panel" });
    if (await toggle.isVisible()) await toggle.click();
    const navigation = page.getByRole("navigation", {
      name: "Navegación Administración",
    });
    await expect(navigation.getByRole("button")).toHaveCount(9);
    expect(
      await navigation.getByRole("button").evaluateAll((buttons) =>
        buttons
          .filter((button) => {
            const rect = button.getBoundingClientRect();
            return !rect.width || rect.left < 0 || rect.right > innerWidth;
          })
          .map((button) => button.textContent),
      ),
    ).toEqual([]);
    await navigation
      .getByRole("button", { name: "Inventario", exact: true })
      .click();
    await expect(page).toHaveURL(/administrador\/inventario$/);
    if (await page.locator(".ops-menu").isVisible())
      await expect(page.locator(".ops-header nav")).toBeHidden();
  }
});
