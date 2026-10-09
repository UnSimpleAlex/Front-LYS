import { test, expect } from '@playwright/test';

const viewports = [
  [240, 480], [280, 568],
  [320, 568], [360, 800], [375, 812], [390, 844], [412, 915], [430, 932], [480, 900],
  [600, 960], [768, 1024], [820, 1180], [912, 1368], [1024, 768], [1080, 1920], [1280, 800], [1366, 768], [1440, 900], [1672, 941], [1920, 1080],
];

for (const [width, height] of viewports) {
  test(`pantalla ${width} × ${height}: assets, composición y overflow`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setViewportSize({ width, height });
    await page.goto('/iniciar-sesion');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
    await page.evaluate(() => Promise.all(document.getAnimations().map(animation => animation.finished)));
    await expect(page.getByRole('heading', { name: 'Inicia sesión', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continuar con Google' })).toBeVisible();
    const geometry = await page.evaluate(() => {
      const card = document.querySelector('.sign-in-card')!.getBoundingClientRect();
      const welcome = document.querySelector('.welcome')!.getBoundingClientRect();
      const caption = document.querySelector('.welcome p')!.getBoundingClientRect();
      const lettering = document.querySelector('.welcome-lettering')!.getBoundingClientRect();
      const lines = [...document.querySelectorAll('.welcome p span')].map(span => {
        const range = document.createRange(); range.selectNodeContents(span);
        return [...range.getClientRects()].map(rect => ({left:rect.left, right:rect.right, top:rect.top, bottom:rect.bottom}));
      });
      return {
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        caption: {left:caption.left, right:caption.right},
        lettering: {left:lettering.left, right:lettering.right, bottom:lettering.bottom},
        lines,
        card: { x: card.x, y: card.y, width: card.width, bottom: card.bottom },
        welcome: { x: welcome.x, y: welcome.y, right: welcome.right, bottom: welcome.bottom },
        imagesReady: [...document.images].every((image) => image.complete && image.naturalWidth > 0),
        documentHeight: document.documentElement.scrollHeight,
        pageBottom: document.querySelector('.sign-in-page')!.getBoundingClientRect().bottom,
        inputHeight: document.querySelector('.input-field')!.getBoundingClientRect().height,
        toggleWidth: document.querySelector('.password-toggle')!.getBoundingClientRect().width,
        fontsReady: document.fonts.check('16px "DM Sans"') && document.fonts.check('24px "Caveat"'),
      };
    });
    expect(geometry.overflow).toBe(false);
    expect(geometry.caption.left).toBeGreaterThanOrEqual(0);
    expect(geometry.caption.right).toBeLessThanOrEqual(geometry.welcome.right + 1);
    for (const line of geometry.lines) {
      expect(line).toHaveLength(1);
      expect(line[0].left).toBeGreaterThanOrEqual(geometry.lettering.left);
      expect(line[0].right).toBeLessThanOrEqual(geometry.lettering.right);
    }
    expect(Math.abs(geometry.lines[0][0].left - geometry.lines[1][0].left)).toBeLessThanOrEqual(1);
    expect(geometry.lines[0][0].top).toBeGreaterThanOrEqual(geometry.lettering.bottom);
    expect(geometry.imagesReady).toBe(true);
    expect(geometry.fontsReady).toBe(true);
    expect(geometry.inputHeight).toBeGreaterThanOrEqual(44);
    expect(geometry.toggleWidth).toBeGreaterThanOrEqual(44);
    expect(geometry.card.bottom).toBeLessThanOrEqual(geometry.documentHeight);
    expect(Math.abs(geometry.pageBottom - geometry.documentHeight)).toBeLessThanOrEqual(1);
    if (width >= 1280) expect(geometry.documentHeight).toBeLessThanOrEqual(height + 1);
    if (width <= 900 || width === 912 || width === 1080) expect(geometry.card.y).toBeGreaterThanOrEqual(geometry.welcome.bottom - 1);
    else expect(geometry.card.x).toBeGreaterThanOrEqual(geometry.welcome.right);
    expect(errors).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`screen-${width}.png`), fullPage: true });
    await testInfo.attach('geometría', { body: JSON.stringify(geometry, null, 2), contentType: 'application/json' });
  });
}

test('navegación de PC visible con el espacio equivalente a zoom de 200% a 500%', async ({ browser }) => {
  for (const width of [683, 455, 342, 273]) {
    const context = await browser.newContext({ baseURL: 'http://127.0.0.1:5173', screen: { width: 1366, height: 768 }, viewport: { width, height: 600 } });
    const page = await context.newPage();
    await page.goto('/iniciar-sesion');
    const navigation = page.getByRole('navigation', { name: 'Navegación principal', exact: true });
    await expect(navigation).toBeVisible();
    await expect(navigation.getByRole('button', { name: 'Inicio', exact: true })).toBeInViewport();
    const contact = navigation.getByRole('button', { name: 'Contacto', exact: true });
    await contact.focus();
    await expect(contact).toBeInViewport();
    await contact.click();
    await expect(page).toHaveURL(/contacto$/);
    await expect(page.locator('.contact-page')).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect(page.getByRole('banner')).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await context.close();
  }
});

test('móvil y tablet conservan la cabecera compacta con menú', async ({ page }) => {
  for (const width of [390, 820, 1024]) {
    await page.setViewportSize({ width, height: 1180 });
    await page.goto('/iniciar-sesion');
    await expect(page.getByRole('navigation', { name: 'Navegación principal', exact: true })).not.toBeVisible();
    const menu = page.getByRole('button', { name: 'Abrir menú' });
    await menu.click();
    await expect(page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: 'Contacto' })).toBeVisible();
    const height = await page.getByRole('banner').evaluate(el => el.getBoundingClientRect().height);
    expect(height).toBeLessThanOrEqual(64);
  }
});
