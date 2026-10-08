import type { Product } from '../carta/catalog';
import type { IconName } from '../../components/Icon';

export type Promotion = Product & { originalPrice: number; badge: string; badgeIcon: IconName; badgeTone: 'orange' | 'red'; filters: string[] };
export const promotionCategories: { id: string; label: string; icon: IconName }[] = [
  { id: 'todas', label: 'Todas', icon: 'grid' }, { id: 'combos', label: 'Combos', icon: 'chicken' },
  { id: 'familiares', label: 'Familiares', icon: 'users' }, { id: 'individuales', label: 'Individuales', icon: 'user' },
  { id: 'bebidas', label: 'Bebidas', icon: 'drink' }, { id: 'acompanamientos', label: 'Acompañamientos', icon: 'fries' },
];
// Datos de presentación de temporada; la disponibilidad definitiva se validará al conectar pedidos.
export const promotions: Promotion[] = [
  { id: 'promo-terror-familiar', category: 'promociones', name: 'Combo Familiar del Terror', description: '1 pollo a la brasa + papas grandes + ensalada familiar + 1 Coca-Cola de 1.5 L + salsas de la casa', price: 69.90, originalPrice: 89.90, size: 'familiar', popular: 3, isNew: false, promo: true, image: '/images/promotions/familiar.webp', badge: 'EDICIÓN HALLOWEEN', badgeIcon: 'pumpkin', badgeTone: 'orange', filters: ['combos', 'familiares', 'bebidas', 'acompanamientos'] },
  { id: 'promo-parrilla-embrujada', category: 'promociones', name: 'Combo Parrilla Embrujada', description: '1/2 pollo a la brasa + anticuchos + chorizo + papas grandes + ensalada + salsas de la casa', price: 54.90, originalPrice: 69.90, size: 'compartir', popular: 2, isNew: false, promo: true, image: '/images/promotions/parrilla.webp', badge: 'LA MÁS PEDIDA', badgeIcon: 'flame', badgeTone: 'red', filters: ['combos', 'familiares', 'acompanamientos'] },
  { id: 'promo-terror-duo', category: 'promociones', name: 'Terror Dúo', description: '2 cuartos de pollo a la brasa + papas medianas + ensalada + 2 Coca-Cola personales + salsas de la casa', price: 39.90, originalPrice: 52.90, size: 'compartir', popular: 1, isNew: false, promo: true, image: '/images/promotions/duo.webp', badge: 'SOLO POR TEMPORADA', badgeIcon: 'clock', badgeTone: 'orange', filters: ['combos', 'individuales', 'bebidas', 'acompanamientos'] },
];
