import { products, type Product } from '../carta/catalog';
import type { IconName } from '../../components/Icon';

export type Promotion = Product & { originalPrice: number; badge: string; badgeIcon: IconName; badgeTone: 'orange' | 'red'; filters: string[] };
export const promotionCategories: { id: string; label: string; icon: IconName }[] = [
  { id: 'todas', label: 'Todas', icon: 'grid' }, { id: 'combos', label: 'Combos', icon: 'chicken' },
  { id: 'familiares', label: 'Familiares', icon: 'users' }, { id: 'individuales', label: 'Individuales', icon: 'user' },
  { id: 'bebidas', label: 'Bebidas', icon: 'drink' }, { id: 'acompanamientos', label: 'Acompañamientos', icon: 'fries' },
];
// Datos de presentación de temporada; la disponibilidad definitiva se validará al conectar pedidos.
const featuredPromotions: Promotion[] = [
  { id: 'promo-terror-familiar', category: 'promociones', name: 'Combo Familiar del Terror', description: '1 pollo a la brasa + papas grandes + ensalada familiar + 1 Coca-Cola de 1.5 L + salsas de la casa', price: 69.90, originalPrice: 89.90, size: 'familiar', popular: 3, isNew: false, promo: true, image: '/images/promotions/familiar.webp', badge: 'EDICIÓN HALLOWEEN', badgeIcon: 'pumpkin', badgeTone: 'orange', filters: ['combos', 'familiares'] },
  { id: 'promo-parrilla-embrujada', category: 'promociones', name: 'Combo Parrilla Embrujada', description: '1/2 pollo a la brasa + anticuchos + chorizo + papas grandes + ensalada + salsas de la casa', price: 54.90, originalPrice: 69.90, size: 'compartir', popular: 2, isNew: false, promo: true, image: '/images/promotions/parrilla.webp', badge: 'LA MÁS PEDIDA', badgeIcon: 'flame', badgeTone: 'red', filters: ['combos', 'familiares'] },
  { id: 'promo-terror-duo', category: 'promociones', name: 'Terror Dúo', description: '2 cuartos de pollo a la brasa + papas medianas + ensalada + 2 Coca-Cola personales + salsas de la casa', price: 39.90, originalPrice: 52.90, size: 'compartir', popular: 1, isNew: false, promo: true, image: '/images/promotions/duo.webp', badge: 'SOLO POR TEMPORADA', badgeIcon: 'clock', badgeTone: 'orange', filters: ['combos'] },
];

function seasonalOffer(sourceId: string, name: string, price: number, originalPrice: number, filters: string[]): Promotion {
  const product = products.find(item => item.id === sourceId);
  if (!product) throw new Error(`Producto de promoción inexistente: ${sourceId}`);
  return { ...product, id: `promo-${sourceId}`, category: 'promociones', name, price, originalPrice, filters, promo: true, badge: 'PRECIO DE TEMPORADA', badgeIcon: 'clock', badgeTone: 'orange' };
}

export const promotions: Promotion[] = [
  ...featuredPromotions,
  seasonalOffer('combos-08', 'Doble Brasa de Medianoche', 109.90, 129.90, ['combos', 'familiares']),
  seasonalOffer('combos-12', 'Banquete de la Noche', 79.90, 94.90, ['combos', 'familiares']),
  seasonalOffer('combos-04', 'Combo Brasa y Chaufa Encantado', 24.90, 29.90, ['combos']),
  seasonalOffer('pollo-02', 'Cuarto de Brasa del Terror', 16.90, 18.90, ['individuales']),
  seasonalOffer('pollo-06', 'Pechuga Hechizada', 21.90, 25.90, ['individuales']),
  seasonalOffer('pollo-04', 'Alitas BBQ Embrujadas', 22.90, 26.90, ['individuales']),
  seasonalOffer('bebidas-02', 'Inca Kola para Compartir', 9.90, 12.90, ['bebidas']),
  seasonalOffer('bebidas-04', 'Coca-Cola de Temporada', 9.90, 12.90, ['bebidas']),
  seasonalOffer('bebidas-06', 'Chicha Morada de Medianoche', 10.90, 14.90, ['bebidas']),
  seasonalOffer('acompanamientos-04', 'Papas para la Noche', 11.90, 15.90, ['acompanamientos']),
  seasonalOffer('acompanamientos-12', 'Wantanes Encantados (12u)', 17.90, 21.90, ['acompanamientos']),
  seasonalOffer('acompanamientos-11', 'Salchipapas del Terror', 23.90, 29.90, ['acompanamientos']),
];
