import { useEffect, useRef, useState } from 'react';
import { getAccount } from '../account/accountStore';
import { savedReceipt, saveReceipt } from './receiptStorage';
import type { DeliveryPoint } from './location';
import type { Product } from '../carta/catalog';

export type PaymentMethod = 'card' | 'yape' | 'plin' | 'cash';
export type DeliveryDraft = { mode: 'delivery' | 'pickup'; address: string; district: string; label: string; reference: string; instructions: string; name: string; phone: string; email: string; store: string; location?: DeliveryPoint | null };
export type CartItem = { product: Product; count: number };
export type Receipt = { code: string; date: string; items: CartItem[]; delivery: DeliveryDraft; method: PaymentMethod; subtotal: number; shipping: number; discount: number; total: number };
export const paymentNames: Record<PaymentMethod, string> = { card: 'Tarjeta de crédito/débito', yape: 'Yape', plin: 'Plin', cash: 'Efectivo al recibir' };
const emptyDelivery: DeliveryDraft = { mode: 'delivery', address: '', district: '', label: 'Casa', reference: '', instructions: '', name: '', phone: '', email: '', store: 'Local principal' };
export function useCheckout(items: CartItem[]) {
  const [delivery, setDelivery] = useState<DeliveryDraft>(() => { const account = getAccount(); const address = account.addresses.find(item => item.primary) || account.addresses[0]; return { ...emptyDelivery, name: account.profile.name, phone: account.profile.phone, email: account.profile.email, instructions: account.profile.notes, ...(address ? { address: address.street, district: address.district, label: address.label, reference: address.reference, location: address.point } : {}) }; });
  const [method, setMethod] = useState<PaymentMethod>(() => (getAccount().preferredPayment || 'card') as PaymentMethod);
  const [paymentReady, setPaymentReady] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');
  const [receipt, setReceipt] = useState<Receipt | null>(savedReceipt);
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  useEffect(() => { if (!items.length) submitting.current = false; }, [items.length]);
  const subtotalCents = items.reduce((sum, item) => sum + Math.round(item.product.price * 100) * item.count, 0);
  const shippingCents = items.length && delivery.mode === 'delivery' ? 700 : 0;
  const discountCents = couponApplied ? Math.round(subtotalCents * .1) : 0;
  const totals = { subtotal: subtotalCents / 100, shipping: shippingCents / 100, discount: discountCents / 100, total: (subtotalCents + shippingCents - discountCents) / 100 };
  const deliveryReady = delivery.name.trim().length >= 3 && /^9\d{8}$/.test(delivery.phone) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(delivery.email) && (delivery.mode === 'pickup' || (delivery.address.trim().length >= 5 && delivery.district.trim().length >= 2 && delivery.reference.trim().length >= 3));
  function applyCoupon() {
    const accepted = coupon.trim().toUpperCase() === 'BRASA10';
    setCouponApplied(accepted);
    setCouponMessage(accepted ? 'Cupón de demostración aplicado: 10% de descuento.' : 'El código no es válido. Puedes probar BRASA10 en esta demostración.');
  }
  function selectPayment(value: PaymentMethod) { setMethod(value); setPaymentReady(false); }
  function finish(clearCart: () => void) {
    if (submitting.current || busy || !items.length || !deliveryReady || !paymentReady) return false;
    submitting.current = true;
    setBusy(true);
    const order: Receipt = { code: `LYS-DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, date: new Date().toISOString(), items: items.map(item => ({ ...item })), delivery: { ...delivery }, method, ...totals };
    setReceipt(order);
    saveReceipt(order);
    clearCart(); setBusy(false); return true;
  }
  return { delivery, setDelivery, method, selectPayment, paymentReady, setPaymentReady, deliveryReady, coupon, setCoupon, couponApplied, couponMessage, applyCoupon, receipt, busy, finish, ...totals };
}
export type Checkout = ReturnType<typeof useCheckout>;
