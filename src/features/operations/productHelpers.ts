import type { MenuProduct } from "./operationsStore";

export const productSku = (product: MenuProduct) => product.sku?.trim() || (product.id.length <= 16 ? product.id.toUpperCase() : `PRD-${product.id.slice(0,8).toUpperCase()}`);
