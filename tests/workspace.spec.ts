import { test, expect } from '@playwright/test';

test('muestra conectada, ventanas accesibles y navegación lateral por roles', async ({page}) => {
  test.setTimeout(120000);
  await page.goto('/iniciar-sesion');
  await page.getByLabel('Correo electrónico',{exact:true}).fill('administrador@demo.local');
  await page.getByLabel('Contraseña',{exact:true}).fill('Demo2026!');
  await page.getByRole('button',{name:'Iniciar sesión',exact:true}).click();
  await page.setViewportSize({width:1440,height:1000});
  await page.locator('.ops-side-account').click();
  await page.getByRole('button',{name:'Cargar datos de demostración',exact:true}).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const snapshot = await page.evaluate(() => JSON.parse(localStorage.getItem('lys-operations-v1')!));
  expect(snapshot.orders).toHaveLength(23);
  expect(snapshot.orders.every((o:{status:string;channel:string;table:number|null}) => o.status !== 'En camino' || (o.channel === 'Delivery' && o.table === null))).toBeTruthy();
  expect(snapshot.payments).toHaveLength(7);
  expect(snapshot.vouchers).toHaveLength(5);
  expect(snapshot.suppliers).toHaveLength(2);
  expect(snapshot.tables.some((t:{status:string}) => t.status === 'Ocupada')).toBeTruthy();
  await page.goto('/administrador/clientes');
  await expect(page.locator('tbody tr')).toHaveCount(8);
  const firstClient=page.locator('tbody tr').first();
  await firstClient.getByRole('button',{name:/^Ver /}).click();
  await expect(page.getByRole('dialog')).toContainText('COCINA-DEMO-');
  await page.getByRole('dialog').press('Escape');
  await page.goto('/administrador');
  await page.reload();
  await expect(page.locator('.ops-stats')).not.toContainText('Ventas de hoyS/ 0.00');
  await page.goto('/administrador/productos');
  const create = page.getByRole('button',{name:'Nuevo producto'});
  await create.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByLabel('Nombre del producto').fill('Producto de prueba modal');
  await dialog.getByLabel('Precio', {exact:false}).fill('25');
  await dialog.getByRole('button',{name:'Guardar producto'}).click();
  await expect(dialog).toHaveCount(0);
  await page.getByLabel('Buscar producto',{exact:true}).fill('Producto de prueba modal');
  await expect(page.locator('tbody')).toContainText('Producto de prueba modal');
  await page.getByTitle('Editar Producto de prueba modal').click();
  await expect(dialog.getByLabel('Nombre del producto')).toHaveValue('Producto de prueba modal');
  await dialog.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByTitle('Editar Producto de prueba modal')).toBeFocused();
  await page.getByLabel('Buscar producto',{exact:true}).fill('');
  await page.screenshot({path:'test-results/workspace-products-desktop.png',fullPage:true});
  for (const [route,name] of [['/mesera','salon'],['/cocina','cocina'],['/caja','caja'],['/delivery','delivery'],['/administrador/inventario','inventory']]) {
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    await expect.poll(() => page.locator('.ops-badge > span').evaluateAll(nodes => nodes.every(node => node.scrollWidth <= node.clientWidth + 1))).toBeTruthy();
    if(name === 'salon') {
      expect(await page.locator('[data-panel="Pedidos recientes"] time').evaluateAll(nodes => nodes.every(node => node.getBoundingClientRect().height <= 20))).toBeTruthy();
      expect(await page.locator('[data-panel="Pedidos recientes"] td button').evaluateAll(nodes => nodes.every(node => node.getBoundingClientRect().height <= 38))).toBeTruthy();
    }
    await page.screenshot({path:`test-results/workspace-${name}-desktop.png`,fullPage:true});
  }
  await page.goto('/mesera/mesas');
  await page.locator('.ops-table-seat').first().click();
  await page.getByRole('button',{name:'Ver mesa',exact:true}).click();
  await expect(dialog).toBeVisible();
  await dialog.press('Escape');
  await page.goto('/administrador/productos');
  for (const width of [240,335,390,768,1024,1440,2560]) {
    await page.setViewportSize({width,height:900});
    if(width === 335) await page.screenshot({path:'test-results/workspace-products-335.png',fullPage:true});
    await create.click();
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBeTruthy();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    if ([390,768,1440].includes(width)) await page.screenshot({path:`test-results/workspace-product-modal-${width}.png`,fullPage:false});
    await dialog.press('Escape');
  }
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Abrir menú del panel'}).click();
  await dialog.getByRole('button',{name:'Inventario',exact:true}).click();
  await expect(page).toHaveURL(/inventario$/);
  await expect(dialog).toHaveCount(0);
  await page.screenshot({path:'test-results/workspace-inventory-mobile.png',fullPage:true});
});
