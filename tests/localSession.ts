import type { Page } from "@playwright/test";
/** Cuenta real de prueba, creada mediante el mismo servicio utilizado por el formulario. */
export async function clientSession(page: Page) {
  await page.goto("/iniciar-sesion");
  await page.evaluate(async () => {
    const auth = (await import(
      String("/src/services/localAuth.ts")
    )) as typeof import("../src/services/localAuth");
    await auth.prepareDemoAccess();
    await auth.loginLocal("administrador@demo.local", "Demo2026!");
    const ops = (await import(
      String("/src/features/operations/operationsStore.ts")
    )) as typeof import("../src/features/operations/operationsStore");
    ops.saveOffer({
      id: "test-coupon",
      name: "Cupón de prueba",
      type: "Cupón",
      productId: "",
      percent: 10,
      code: "BRASA10",
      start: "2020-01-01",
      end: "2099-12-31",
      active: true,
      used: 0,
      limit: 100,
    });
    auth.logoutLocal();
    await auth.createLocalUser({
      name: "Cliente Prueba",
      email: "prueba@example.com",
      phone: "987654321",
      password: "Prueba2026!",
    });
    await auth.loginLocal("prueba@example.com", "Prueba2026!");
  });
}
