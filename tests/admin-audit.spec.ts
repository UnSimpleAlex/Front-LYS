import { expect, test } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const routes = ["administrador", "administrador/productos", "administrador/promociones", "administrador/clientes", "administrador/usuarios", "administrador/pedidos", "administrador/reportes", "administrador/inventario", "administrador/configuracion", "cocina", "cocina/pedidos", "cocina/historial", "cocina/tiempos", "mesera", "mesera/mesas", "mesera/nuevo-pedido", "mesera/pedidos", "mesera/cierre-mesa", "caja", "caja/cobros", "caja/comprobantes", "caja/apertura", "caja/cierre", "caja/historial", "delivery"];
const widths = [...new Set([
  ...Array.from({ length: 179 }, (_, i) => 280 + i * 20),
  ...[320, 340, 360, 390, 430, 540, 600, 768, 900, 1024, 1100, 1280, 1366, 1440, 1500, 1672, 1920, 2560].flatMap(w => [w - 1, w, w + 1]),
])].filter(w => w >= 280 && w <= 3840).sort((a, b) => a - b);
const directory = ".impeccable/review/audit-integral";

for (const route of routes) test(`auditoría de ${route}: barrido 280–3840`, async ({ page }) => {
  test.setTimeout(240000);
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto("/iniciar-sesion");
  await page.getByLabel("Correo electrónico", { exact: true }).fill("administrador@demo.local");
  await page.getByLabel("Contraseña", { exact: true }).fill("Demo2026!");
  await page.getByRole("button", { name: "Iniciar sesión", exact: true }).click();
  await expect(page).toHaveURL(/administrador$/);
  await page.locator(".ops-side-account").click();
  await page.getByRole("button", { name: "Cargar datos de demostración", exact: true }).click();
  await page.goto("/" + route);
  await expect(page.locator(".ops-page-heading h1")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await mkdir(directory, { recursive: true });
  const failures: unknown[] = [];
  for (const width of widths) {
    const height = width < 600 ? 568 : width < 1100 ? 768 : 1080;
    await page.setViewportSize({ width, height });
    const overflow = await page.evaluate(() => {
      const width = document.documentElement.clientWidth;
      if (document.documentElement.scrollWidth <= width + 1) return [];
      return [...document.querySelectorAll<HTMLElement>(".ops-root *")].filter(el => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.right > width + 1 && getComputedStyle(el).position !== "fixed";
      }).slice(0, 8).map(el => ({ tag: el.tagName, class: el.className, text: el.textContent?.trim().slice(0, 60), right: Math.round(el.getBoundingClientRect().right) }));
    });
    if (overflow.length) failures.push({ width, height, overflow });
  }
  const samples = [];
  for (const [width, height] of [[390, 844], [768, 1024], [1366, 591]]) {
    await page.setViewportSize({ width, height });
    const findings = await page.evaluate(() => {
      const visible = (el: Element) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none"; };
      const controls = [...document.querySelectorAll<HTMLElement>(".ops-root button, .ops-root input:not([type=hidden]), .ops-root select, .ops-root textarea")].filter(visible);
      return {
        unnamedButtons: controls.filter(el => el.tagName === "BUTTON" && !el.textContent?.trim() && !el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby") && !el.getAttribute("title")).map(el => el.outerHTML.slice(0, 160)),
        unnamedFields: controls.filter(el => el.matches("input,select,textarea") && !el.closest("label") && !el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby") && !(el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`))).map(el => el.outerHTML.slice(0, 160)),
        tinyControls: controls.filter(el => el.tagName === "BUTTON" && !el.hasAttribute("disabled") && Math.min(el.offsetWidth, el.offsetHeight) < 24).map(el => ({ class: el.className, text: el.textContent?.trim().slice(0, 30), w: el.offsetWidth, h: el.offsetHeight })),
        tinyText: [...document.querySelectorAll<HTMLElement>(".ops-root td, .ops-root th, .ops-root label, .ops-root small, .ops-root button")].filter(el => visible(el) && el.textContent?.trim() && parseFloat(getComputedStyle(el).fontSize) > 0 && parseFloat(getComputedStyle(el).fontSize) < 11).map(el => ({ class: el.className, text: el.textContent?.trim().slice(0, 35), size: getComputedStyle(el).fontSize })).slice(0, 30),
        brokenImages: [...document.querySelectorAll<HTMLImageElement>(".ops-root img")].filter(el => el.complete && !el.naturalWidth).map(el => el.src),
      };
    });
    samples.push({ width, height, findings });
    await page.screenshot({ path: `${directory}/${route.replaceAll("/", "-")}-${width}.png`, fullPage: true });
  }
  await writeFile(`${directory}/${route.replaceAll("/", "-")}.json`, JSON.stringify({ route, widths: widths.length, configurations: widths.map(width => ({ width, height: width < 600 ? 568 : width < 1100 ? 768 : 1080 })), failures, samples, errors }, null, 2));
  for (const key of ["unnamedButtons", "unnamedFields", "tinyControls", "tinyText", "brokenImages"] as const) {
    expect(samples.flatMap<unknown>(sample => sample.findings[key]), `${route}: ${key}`).toEqual([]);
  }
  expect(errors, route + ": errores de ejecución").toEqual([]);
  expect(failures, route + ": desbordamientos").toEqual([]);
});
