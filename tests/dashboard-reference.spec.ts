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

test("aside: tipografía uniforme y tamaño consistente entre Dashboard y Productos", async ({ page }) => {
  await page.setViewportSize({ width: 1672, height: 941 });
  await page.goto("/iniciar-sesion");
  await page.getByLabel("Correo electrónico", { exact: true }).fill("administrador@demo.local");
  await page.getByLabel("Contraseña", { exact: true }).fill("Demo2026!");
  await page.getByRole("button", { name: "Iniciar sesión", exact: true }).click();
  await expect(page).toHaveURL(/administrador$/);

  const dashBtn = page.locator("#ops-navigation button").filter({ hasText: "Dashboard" });
  const prodBtn = page.locator("#ops-navigation button").filter({ hasText: "Productos" });
  const promoBtn = page.locator("#ops-navigation button").filter({ hasText: "Promociones" });

  const dashFontSizeOnDash = await dashBtn.evaluate(el => window.getComputedStyle(el).fontSize);
  const prodFontSizeOnDash = await prodBtn.evaluate(el => window.getComputedStyle(el).fontSize);
  const promoFontSizeOnDash = await promoBtn.evaluate(el => window.getComputedStyle(el).fontSize);

  expect(dashFontSizeOnDash).toBe("15px");
  expect(prodFontSizeOnDash).toBe("15px");
  expect(promoFontSizeOnDash).toBe("15px");

  await prodBtn.click();
  await expect(page).toHaveURL(/administrador\/productos$/);

  const dashFontSizeOnProd = await dashBtn.evaluate(el => window.getComputedStyle(el).fontSize);
  const prodFontSizeOnProd = await prodBtn.evaluate(el => window.getComputedStyle(el).fontSize);

  expect(dashFontSizeOnProd).toBe("15px");
  expect(prodFontSizeOnProd).toBe("15px");
});

test("aside: el avatar de perfil de administrador es un círculo perfecto en PC", async ({ page }) => {
  await page.setViewportSize({ width: 1672, height: 941 });
  await page.goto("/iniciar-sesion");
  await page.getByLabel("Correo electrónico", { exact: true }).fill("administrador@demo.local");
  await page.getByLabel("Contraseña", { exact: true }).fill("Demo2026!");
  await page.getByRole("button", { name: "Iniciar sesión", exact: true }).click();
  await expect(page).toHaveURL(/administrador$/);

  const avatar = page.locator(".ops-side-avatar");
  await expect(avatar).toBeVisible();
  const box = await avatar.boundingBox();
  expect(box).not.toBeNull();
  if (box) {
    expect(box.width).toBeCloseTo(40, 1);
    expect(box.height).toBeCloseTo(40, 1);
    expect(Math.abs(box.width - box.height)).toBeLessThan(1);
  }
});

