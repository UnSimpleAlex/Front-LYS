import { test, expect, type Page } from "@playwright/test";
const sections = [
  "",
  "pedidos",
  "direcciones",
  "datos",
  "metodos-pago",
  "notificaciones",
  "favoritos",
  "cerrar-sesion",
];
async function login(page: Page) {
  await page.goto("/iniciar-sesion");
  await expect(
    page.getByRole("button", { name: "Accesos de prueba por rol" }),
  ).toHaveCount(0);
  await page
    .getByLabel("Correo electrónico", { exact: true })
    .fill("cliente@demo.local");
  await page.getByLabel("Contraseña", { exact: true }).fill("Demo2026!");
  await page
    .getByRole("button", { name: "Iniciar sesión", exact: true })
    .click();
  await expect(page).toHaveURL(/\/mi-cuenta$/);
}
async function seed(page: Page) {
  await page.evaluate(async () => {
    const auth = (await import(
      String("/src/services/localAuth.ts")
    )) as typeof import("../src/services/localAuth");
    const account = (await import(
      String("/src/features/account/accountStore.ts")
    )) as typeof import("../src/features/account/accountStore");
    const ops = (await import(
      String("/src/features/operations/operationsStore.ts")
    )) as typeof import("../src/features/operations/operationsStore");
    const current = auth.currentUser()!;
    account.updateAccount({
      profile: {
        ...account.getAccount().profile,
        name: "Ana Torres",
        phone: "987654321",
      },
      addresses: [
        {
          id: "home",
          label: "Casa",
          street: "Av. Los Olivos 245",
          district: "Los Olivos",
          reference: "Frente al parque",
          primary: true,
          point: { lat: -11.99, lng: -77.07 },
        },
        {
          id: "work",
          label: "Trabajo",
          street: "Av. Universitaria 1820",
          district: "Lima",
          reference: "Oficina 302",
          primary: false,
          point: null,
        },
      ],
      cards: [
        {
          id: "visa",
          brand: "Visa",
          holder: "Ana Torres",
          last4: "4242",
          expiry: "08/28",
          primary: true,
        },
      ],
    });
    const state = ops.getOperations();
    localStorage.setItem(
      "lys-carta-favorites-" + current.id,
      JSON.stringify([
        "pollo-01",
        "combos-01",
        "parrillas-01",
        "pollo-04",
        "parrillas-02",
        "pollo-03",
      ]),
    );
    localStorage.setItem(
      "lys-operations-v1",
      JSON.stringify({
        ...state,
        orders: ["En preparación", "Entregado", "Cancelado"].map(
          (status, i) => ({
            id: "LYS-104" + (8 - i),
            customerId: current.id,
            customer: current.name,
            email: current.email,
            phone: current.phone,
            address: "Av. Los Olivos 245",
            channel: "Delivery",
            table: null,
            items: [{ product: state.products[i * 12], count: 1 }],
            notes: "",
            status,
            created: new Date(Date.now() - i * 86400000).toISOString(),
            discount: 0,
            shipping: 0,
            method: "Yape",
            paid: false,
            history: [],
          }),
        ),
      }),
    );
  });
  await page.reload();
}
test("credenciales directas y navbar con el primer nombre, también en cuentas antiguas", async ({
  page,
}) => {
  await login(page);
  await expect(page.locator(".login-link")).toHaveText("Ana");
  await page.evaluate(async () => {
    const a = (await import(
      String("/src/services/localAuth.ts")
    )) as typeof import("../src/services/localAuth");
    a.editLocalUser(a.currentUser()!.id, { name: "Demo Alexander Huamani" });
  });
  await expect(page.locator(".login-link")).toHaveText("Alexander");
  await page.reload();
  await expect(page.locator(".login-link")).toHaveText("Alexander");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".login-link")).toBeVisible();
  await page.getByRole("button", { name: "Abrir menú", exact: true }).click();
  await expect(page.locator(".mobile-nav")).toContainText("Alexander");
});
test("Mi cuenta: referencias PC y móvil, selector y confirmación de salida", async ({
  page,
}) => {
  await login(page);
  await seed(page);
  for (const width of [1672, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 941 });
    for (const [i, section] of sections.entries()) {
      await page.goto("/mi-cuenta" + (section ? "/" + section : ""));
      await expect(page.locator("main h1")).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: `test-results/cuenta-${width}-${i + 1}.png`,
        fullPage: true,
      });
    }
    if (width === 390) {
      await page.getByLabel("Sección de mi cuenta").selectOption("datos");
      await expect(page).toHaveURL(/\/datos$/);
    }
  }
  await page.getByLabel("Sección de mi cuenta").selectOption("cerrar-sesion");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await page.locator(".account-logout-page button").click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Cerrar sesión", exact: true })
    .click();
  await expect(page).toHaveURL(/iniciar-sesion$/);
});
test("barrido de las ocho secciones entre 280 y 3840 px", async ({ page }) => {
  test.setTimeout(240000);
  await login(page);
  await seed(page);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const widths = [
    ...new Set([
      ...Array.from({ length: 179 }, (_, i) => 280 + i * 20),
      359,
      360,
      599,
      600,
      601,
      899,
      900,
      901,
      1249,
      1250,
      1251,
      1672,
    ]),
  ].sort((a, b) => a - b);
  for (const section of sections) {
    await page.goto("/mi-cuenta" + (section ? "/" + section : ""));
    await expect(page.locator("main h1")).toBeVisible();
    for (const width of widths) {
      await page.setViewportSize({ width, height: width < 700 ? 844 : 941 });
      await expect
        .poll(
          () =>
            page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth + 1,
            ),
          {
            message: `Desborde en ${section || "inicio"} a ${width}px`,
            timeout: 2000,
          },
        )
        .toBeTruthy();
    }
  }
  expect(errors).toEqual([]);
});
test("editar perfil, cancelar cambios y guardar foto sin alterar otros datos", async ({
  page,
}) => {
  await login(page);
  await seed(page);
  await page.goto("/mi-cuenta/datos");
  await page.getByLabel("Nombre", { exact: true }).fill("Alexander");
  await page
    .getByRole("button", { name: "Guardar cambios", exact: true })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "Datos guardados" }),
  ).toContainText("Datos guardados");
  await expect(page.locator(".login-link")).toHaveText("Alexander");
  await page.getByLabel("Nombre", { exact: true }).fill("Otro");
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(page.getByLabel("Nombre", { exact: true })).toHaveValue(
    "Alexander",
  );
  await page.getByLabel("Foto de perfil", { exact: true }).setInputFiles({
    name: "avatar.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await expect(page.locator(".account-photo-controls img")).toBeVisible();
  await page
    .getByRole("button", { name: "Guardar cambios", exact: true })
    .click();
  await page.reload();
  await expect(page.locator(".account-photo-controls img")).toBeVisible();
  await expect(page.getByLabel("Apellidos")).toHaveValue("Torres");
});
test("tarjetas guardan solo referencias y permiten cambiar la predeterminada y eliminar", async ({
  page,
}) => {
  await login(page);
  await seed(page);
  await page.goto("/mi-cuenta/metodos-pago");
  await page
    .getByRole("button", { name: "+ Agregar tarjeta", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Marca").selectOption("Mastercard");
  await dialog.getByLabel("Últimos cuatro dígitos").fill("5555");
  await dialog.getByLabel("Vencimiento (MM/AA)", { exact: true }).fill("09/29");
  await dialog
    .getByRole("button", { name: "Guardar tarjeta", exact: true })
    .click();
  const card = page.locator(".account-saved-card").filter({ hasText: "5555" });
  await card.getByRole("button", { name: "Establecer predeterminada" }).click();
  await page.reload();
  await expect(card).toContainText("Predeterminada");
  expect(
    await page.evaluate(() => {
      const value = JSON.parse(
        localStorage.getItem(
          "lys-account-" + localStorage.getItem("lys-session-v1"),
        )!,
      );
      return Object.keys(value.cards[0]);
    }),
  ).toEqual(["id", "brand", "last4", "holder", "expiry", "primary"]);
  await card.getByRole("button", { name: "Eliminar", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Cancelar", exact: true })
    .click();
  await expect(card).toHaveCount(1);
  await card.getByRole("button", { name: "Eliminar", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Eliminar", exact: true })
    .click();
  await expect(card).toHaveCount(0);
});
test("búsqueda de pedidos, seguimiento, favoritos y avisos leídos", async ({
  page,
}) => {
  await login(page);
  await seed(page);
  await page.goto("/mi-cuenta/pedidos");
  await page.getByLabel("Buscar por número de pedido").fill("1048");
  await expect(page.locator(".account-order")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Seguir pedido", exact: true })
    .click();
  await expect(
    page.getByRole("dialog").locator("[aria-current=step]"),
  ).toContainText("Preparando");
  await page.getByRole("button", { name: "Cerrar", exact: true }).click();
  await page.goto("/mi-cuenta/favoritos");
  await expect(page.locator(".account-product")).toHaveCount(6);
  await page.locator(".account-heart").first().click();
  await expect(page.locator(".account-product")).toHaveCount(5);
  await page.reload();
  await expect(page.locator(".account-product")).toHaveCount(5);
  await page.goto("/mi-cuenta/notificaciones");
  await expect(page.locator(".notification-dot:not(.read)")).toHaveCount(3);
  await page.getByRole("button", { name: "Marcar todas como leídas" }).click();
  await page.reload();
  await expect(page.locator(".notification-dot:not(.read)")).toHaveCount(0);
});

test("diálogos en pantallas bajas, teclado y regreso desde páginas públicas", async ({
  page,
}) => {
  await login(page);
  await seed(page);
  for (const [width, height] of [
    [280, 480],
    [390, 700],
    [844, 390],
    [1366, 591],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("/mi-cuenta/metodos-pago");
    await page
      .getByRole("button", { name: "+ Agregar tarjeta", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    expect(
      await dialog.evaluate((e) => {
        const r = e.getBoundingClientRect();
        return (
          r.left >= 0 && r.right <= innerWidth + 1 && r.height <= innerHeight
        );
      }),
    ).toBeTruthy();
    await dialog
      .getByRole("button", { name: "Guardar tarjeta", exact: true })
      .scrollIntoViewIfNeeded();
    await expect(
      dialog.getByRole("button", { name: "Guardar tarjeta", exact: true }),
    ).toBeInViewport();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "+ Agregar tarjeta", exact: true }),
    ).toBeFocused();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/nosotros");
  await page.getByRole("button", { name: "Abrir menú", exact: true }).click();
  await page
    .locator(".mobile-nav")
    .getByRole("link", { name: "Ana", exact: true })
    .click();
  await expect(page).toHaveURL(/mi-cuenta$/);
  await expect(page.getByLabel("Sección de mi cuenta")).toBeVisible();
  await expect(page.locator(".account-stats")).toHaveCSS(
    "grid-template-columns",
    /\d.*\d/,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBeTruthy();
});
