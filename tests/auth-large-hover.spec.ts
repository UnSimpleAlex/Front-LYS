import { test, expect } from '@playwright/test';

for (const [width, height] of [[1920,1080],[2560,1440],[3440,1440],[3840,2160]]) {
  for (const route of ['/iniciar-sesion','/registro']) {
    test(`${route} mantiene una composición legible en ${width}×${height}`, async ({page}, testInfo) => {
      await page.setViewportSize({width,height});
      await page.goto(route);
      await expect(page.locator('.sign-in-card')).toBeVisible();
      await page.evaluate(()=>document.fonts.ready);
      await page.evaluate(()=>Promise.all(document.getAnimations().map(animation=>animation.finished)));
      const geometry = await page.evaluate(()=>{
        const card = document.querySelector('.sign-in-card')!.getBoundingClientRect();
        const photo = document.querySelector('.hero-background')!.getBoundingClientRect();
        const lettering = document.querySelector('.welcome-lettering')!.getBoundingClientRect();
        return {card:{left:card.left,right:card.right,top:card.top,bottom:card.bottom,width:card.width},photoWidth:photo.width,letteringRight:lettering.right,overflow:document.documentElement.scrollWidth>innerWidth};
      });
      expect(geometry.overflow).toBe(false);
      expect(geometry.card.width).toBeGreaterThanOrEqual(520);
      expect(geometry.card.width).toBeLessThanOrEqual(580);
      expect(geometry.card.left).toBeGreaterThan(geometry.letteringRight);
      expect(geometry.card.top).toBeGreaterThan(120);
      expect(geometry.card.bottom).toBeLessThanOrEqual(height);
      expect(geometry.photoWidth).toBeLessThanOrEqual(1920);
      await page.screenshot({path:testInfo.outputPath(`auth-${width}.png`)});
    });
  }
}

test('las tarjetas de inicio responden al mouse y al foco sin alterar sus acciones', async ({page}, testInfo)=>{
  await page.goto('/');
  for (const selector of ['.specialty-card','.promotion-card']) {
    const card=page.locator(selector).first();
    await card.scrollIntoViewIfNeeded();
    const initial=await card.boundingBox();
    await card.hover();
    await expect.poll(()=>card.evaluate(element=>new DOMMatrix(getComputedStyle(element).transform).m42)).toBeLessThanOrEqual(-6);
    await expect.poll(()=>card.locator('img').evaluate(image=>new DOMMatrix(getComputedStyle(image).transform).a)).toBeGreaterThan(1.04);
    expect(await card.evaluate(element=>getComputedStyle(element).boxShadow)).not.toBe('none');
    expect((await card.boundingBox())!.y).toBeLessThan(initial!.y-5);
    await page.screenshot({path:testInfo.outputPath(selector.slice(1)+'-hover.png')});
    await page.mouse.move(0,0);
    await card.focus();
    await expect.poll(()=>card.evaluate(element=>getComputedStyle(element).outlineStyle)).toBe('solid');
  }
});

test('reducir movimiento conserva el énfasis de hover sin zoom ni desplazamiento', async ({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  const card=page.locator('.specialty-card').first();
  await card.hover();
  await expect.poll(()=>card.evaluate(element=>new DOMMatrix(getComputedStyle(element).transform).m42)).toBe(0);
  expect(await card.locator('img').evaluate(image=>getComputedStyle(image).transform)).toBe('none');
  expect(await card.evaluate(element=>getComputedStyle(element).boxShadow)).not.toBe('none');
});
