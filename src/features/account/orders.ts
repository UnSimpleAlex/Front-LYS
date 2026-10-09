import { cartProducts } from '../carta/cartStore';
import type { Receipt } from '../checkout/useCheckout';
import { savedReceipt, receiptHistory } from '../checkout/receiptStorage';
export type AccountOrder = Receipt & { status: 'Registrado' | 'En preparación' | 'Entregado' | 'Cancelado'; example?: boolean };
const statuses: AccountOrder['status'][] = ['Entregado', 'En preparación', 'Cancelado', 'Entregado'];
export function exampleOrders(): AccountOrder[] {
  return statuses.map((status, index) => {
    const product = cartProducts[index * 3];
    return { code: `EJEMPLO-${String(4 - index).padStart(4, '0')}`, date: new Date(2026, 9, 4 - index * 3, 19, 30).toISOString(), items: [{ product, count: 1 }], delivery: { mode: 'delivery', address: 'Dirección de ejemplo', district: 'Carabayllo', label: 'Casa', reference: 'Referencia de ejemplo', instructions: '', name: 'Cliente de ejemplo', phone: '', email: '', store: 'Local principal' }, method: ['card', 'yape', 'cash', 'plin'][index] as Receipt['method'], subtotal: product.price, shipping: 7, discount: 0, total: product.price + 7, status, example: true };
  });
}
export function accountOrders(): AccountOrder[] {
  const receipt = savedReceipt();
  const found = receiptHistory();
  if (receipt && !found.some(order => order.code === receipt.code)) found.unshift(receipt);
  return found.map(order => ({ ...order, status: 'Registrado' }));
}
