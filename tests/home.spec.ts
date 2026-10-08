import { test, expect } from '@playwright/test';

const sizes = [[320, 568], [360, 800], [375, 812], [390, 844], [412, 915], [430, 932], [480, 900], [768, 1024], [1024, 768], [1280, 800], [1366, 768], [1440, 900], [1920, 1080]];
test('descripciones seleccionables y banners sin colisiones en resoluciones intermedias', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 540, 650, 651, 768, 912, 1024, 1100, 1101, 1280, 1440, 1920, 2560]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Sabor peruano');
    await page.evaluate(() => document.fonts.ready);
    for (const index of [1, 2, 3]) {
      await page.getByRole('button', { name: `Ver diapositiva ${index}` }).click();
      await expect(page.getByRole('heading', { level: 1 })).toContainText(['Sabor peruano', 'Comparte el fuego', 'Sabores peruanos'][index - 1]);
      const geometry = await page.evaluate(() => {
        const p = document.querySelector('.home-hero-copy p')!;
        const actions = document.querySelector('.home-hero-actions')!;
        const title = document.querySelector('.home-hero-copy h1')!;
        return { gap: actions.getBoundingClientRect().top - p.getBoundingClientRect().bottom, above: p.getBoundingClientRect().top - title.getBoundingClientRect().bottom, lines: p.getBoundingClientRect().height / parseFloat(getComputedStyle(p).lineHeight), pointer: getComputedStyle(p).pointerEvents, overflow: document.documentElement.scrollWidth > innerWidth };
      });
      expect(geometry.gap, `${width}px, banner ${index}`).toBeGreaterThanOrEqual(4);
      expect(Math.abs(geometry.gap - geometry.above), `${width}px, descripción centrada`).toBeLessThan(1);
      if (index >= 2 && width <= 1100) expect(geometry.lines).toBeCloseTo(3, 1);
      expect(geometry.pointer).toBe('auto');
      expect(geometry.overflow).toBe(false);
      if (index === 2 && width <= 650) await expect(page.locator('.slide-hero-compartir img')).toHaveJSProperty('currentSrc', 'http://127.0.0.1:5173/images/home/hero-compartir-mobile.webp');
      if (index === 2 && width > 650 && width <= 1100) await expect(page.locator('.slide-hero-compartir img')).toHaveJSProperty('currentSrc', 'http://127.0.0.1:5173/images/home/hero-compartir-tablet.webp');
      if (index === 3 && width <= 650) await expect(page.locator('.slide-hero-tradicion img')).toHaveJSProperty('currentSrc', 'http://127.0.0.1:5173/images/home/hero-tradicion-mobile.webp');
    }
  }
  await page.locator('.home-hero-copy p span').first().dblclick({ position: { x: 30, y: 10 } });
  expect(await page.evaluate(() => window.getSelection()?.toString().length)).toBeGreaterThan(0);
});
test('los tres banners mantienen altura de título y posición de acciones en móvil, tablet y PC', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Sabor peruano');
    const hero = page.locator('.home-hero');
    const first = await hero.boundingBox();
    const firstTitle = await page.locator('.home-hero-title').boundingBox();
    const firstButton = await page.locator('.home-hero-actions button').first().boundingBox();
    await page.getByRole('button', { name: 'Ver diapositiva 2' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Comparte el fuego');
    const second = await hero.boundingBox();
    expect(second!.height).toBe(first!.height);
    const secondTitle = await page.locator('.home-hero-title').boundingBox();
    expect(secondTitle!.height).toBeCloseTo(firstTitle!.height, 0);
    const secondButton = await page.locator('.home-hero-actions button').first().boundingBox();
    expect(secondButton!.y).toBe(firstButton!.y);
    expect(secondButton!.x).toBe(firstButton!.x);
    await page.getByRole('button', { name: 'Ver diapositiva 3' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Sabores peruanos');
    const third = await hero.boundingBox();
    expect(third!.height).toBe(first!.height);
    const thirdTitle = await page.locator('.home-hero-title').boundingBox();
    expect(Math.abs(thirdTitle!.height * 383 / 520 - firstTitle!.height * 480 / 519)).toBeLessThan(1);
    const thirdButton = await page.locator('.home-hero-actions button').first().boundingBox();
    expect(thirdButton!.y).toBe(firstButton!.y);
    expect(thirdButton!.x).toBe(firstButton!.x);
    await expect(page.getByRole('button', { name: 'Ver nuestro menú', exact: true })).toBeVisible();
  }
});
test('membresía muestra tres rangos y abre el registro', async ({ page }) => {
  await page.goto('/');
  const membership = page.getByRole('region', { name: 'Volver tiene su recompensa' });
  await expect(page.getByRole('button', { name: 'Descargar en App Store' })).toHaveCount(0);
  await expect(membership.locator('.pass-rank strong')).toHaveText(['Chispa', 'Brasa', 'Fuego']);
  await membership.getByRole('button', { name: 'Quiero ser parte' }).click();
  await expect(page).toHaveURL(/\/registro$/);
  await page.goBack();
  await expect(membership).toBeVisible();
});
for (const [width, height] of sizes) {
  test(`inicio ${width} × ${height}: composición, imágenes y navegación`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Sabor peruano');
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.home-footer').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
    await page.evaluate(() => window.scrollTo(0, 0));
    const geometry = await page.evaluate(() => {
      const hero = document.querySelector('.home-hero')!.getBoundingClientRect();
      const copy = document.querySelector('.home-hero-copy')!.getBoundingClientRect();
      const clippedArrows = [...document.querySelectorAll('.specialty-card')].some(card => card.querySelector('.round-arrow')!.getBoundingClientRect().bottom > card.getBoundingClientRect().bottom);
      const promotions = [...document.querySelectorAll('.promotion-card')];
      const promotionHeights = promotions.map(card => card.getBoundingClientRect().height);
      const clippedPromotions = promotions.some(card => card.querySelector('.promotion-copy')!.getBoundingClientRect().bottom > card.getBoundingClientRect().bottom);
      const order = document.querySelector('.home-hero-actions button')!;
      const text = [...order.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent?.includes('Pedir ahora'))!;
      const range = document.createRange(); range.selectNodeContents(text);
      return { overflow: document.documentElement.scrollWidth > innerWidth, hero: hero.width, copyRight: copy.right, images: [...document.images].every(image => image.naturalWidth > 0), clippedArrows, promotionHeights, clippedPromotions, orderLines: range.getClientRects().length };
    });
    expect(geometry.overflow).toBe(false);
    expect(geometry.copyRight).toBeLessThanOrEqual(width);
    expect(geometry.images).toBe(true);
    expect(geometry.clippedArrows).toBe(false);
    expect(Math.max(...geometry.promotionHeights) - Math.min(...geometry.promotionHeights)).toBeLessThan(1);
    expect(geometry.clippedPromotions).toBe(false);
    expect(geometry.orderLines).toBe(1);
    expect(errors).toEqual([]);
    await expect(page.getByRole('navigation', { name: 'Navegación principal' })).toBeVisible({ visible: width > 1100 });
    await page.screenshot({ path: testInfo.outputPath(`inicio-${width}.png`), fullPage: true });
  });
}
test('carrusel cambia con flechas, indicadores y teclado', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Diapositiva siguiente' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Comparte el fuego');
  await page.getByRole('button', { name: 'Ver diapositiva 3' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Sabores peruanos');
  await page.getByRole('region', { name: 'Sabores de nuestra cocina' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Sabor peruano');
});
test('inicio conserva login, registro y retorno con el historial', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Iniciar sesión', exact: true }).first().click();
  await expect(page).toHaveURL(/\/iniciar-sesion$/);
  await page.getByRole('button', { name: 'Crear cuenta', exact: true }).click();
  await expect(page).toHaveURL(/\/registro$/);
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Inicia sesión', exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Sabor peruano');
});
test('menú móvil y acciones pendientes tienen respuesta accesible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Abrir menú' });
  await menu.click();
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: 'Promociones', exact: true }).click();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: 'Ver toda la carta' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
test('gesto móvil y reducción de movimiento conservan el carrusel', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const hero = page.getByRole('region', { name: 'Sabores de nuestra cocina' });
  await hero.evaluate(element => {
    element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [new Touch({ identifier: 1, target: element, clientX: 250, clientY: 200 })] }));
    element.dispatchEvent(new TouchEvent('touchend', { bubbles: true, changedTouches: [new Touch({ identifier: 1, target: element, clientX: 100, clientY: 200 })] }));
  });
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Comparte el fuego');
  await page.getByRole('button', { name: 'Ver diapositiva 1' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Sabor peruano');
});
