import { currentUser, editLocalUser } from '../../services/localAuth';
import { useSyncExternalStore } from 'react';
import { validPoint, type DeliveryPoint } from '../checkout/location';
export type AccountProfile = { name: string; email: string; phone: string; documentType: string; document: string; birthday: string; gender: string; notes: string };
export type AccountAddress = { id: string; label: string; street: string; district: string; reference: string; primary: boolean; point: DeliveryPoint | null };
export type AccountState = { profile: AccountProfile; addresses: AccountAddress[]; preferredPayment: string; preferences: Record<string, boolean>; readNotifications: string[] };
const key = () => 'lys-account-' + (currentUser()?.id || 'guest');
const emptyProfile: AccountProfile = { name: '', email: '', phone: '', documentType: 'DNI', document: '', birthday: '', gender: '', notes: '' };
const initial = (): AccountState => ({ profile: { ...emptyProfile, name: currentUser()?.name || '', email: currentUser()?.email || '', phone: (currentUser()?.phone || '').replace(/^\+51/,'') }, addresses: [], preferredPayment: '', preferences: { orders: true, promotions: false, favorites: false, account: true }, readNotifications: [] });
function read(): AccountState {
  const fallback = initial();
  try {
    const value = JSON.parse(localStorage.getItem(key()) || 'null');
    if (!value || typeof value !== 'object') return fallback;
    for (const field of Object.keys(emptyProfile) as (keyof AccountProfile)[]) if (typeof value.profile?.[field] === 'string') fallback.profile[field] = value.profile[field].slice(0, 500);
    if (Array.isArray(value.addresses)) fallback.addresses = value.addresses.slice(0, 20).flatMap((address: AccountAddress) => address && ['id', 'label', 'street', 'district', 'reference'].every(field => typeof address[field as keyof AccountAddress] === 'string') ? [{ id: address.id.slice(0, 100), label: address.label.slice(0, 40), street: address.street.slice(0, 160), district: address.district.slice(0, 80), reference: address.reference.slice(0, 200), primary: address.primary === true, point: validPoint(address.point) ? address.point : null }] : []);
    if (['card', 'yape', 'plin', 'cash'].includes(value.preferredPayment)) fallback.preferredPayment = value.preferredPayment;
    for (const field of Object.keys(fallback.preferences)) if (typeof value.preferences?.[field] === 'boolean') fallback.preferences[field] = value.preferences[field];
    if (Array.isArray(value.readNotifications)) fallback.readNotifications = value.readNotifications.filter((id: unknown) => typeof id === 'string').slice(0, 100);
    return fallback;
  } catch { return fallback; }
}
let state: AccountState | undefined;
const listeners = new Set<() => void>();
export const getAccount = () => { state ??= read(); return state; };
export function updateAccount(change: Partial<AccountState>) {
  if(change.profile && currentUser()) editLocalUser(currentUser()!.id,{name:change.profile.name,email:change.profile.email,phone:change.profile.phone});
  state = { ...getAccount(), ...change };
  try { localStorage.setItem(key(), JSON.stringify(state)); } catch { /* La vista permanece disponible sin almacenamiento. */ }
  listeners.forEach(listener => listener());
}
export function resetAccount() { state = initial(); try { localStorage.removeItem(key()); } catch { /* No hay persistencia disponible. */ } listeners.forEach(listener => listener()); }
export function useAccount() { return useSyncExternalStore(listener => { listeners.add(listener); return () => listeners.delete(listener); }, getAccount); }

window.addEventListener('lys-auth',()=>{state=undefined;listeners.forEach(listener=>listener());});
window.addEventListener('storage',()=>{state=undefined;listeners.forEach(listener=>listener());});
