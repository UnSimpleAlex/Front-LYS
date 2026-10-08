import { useEffect, useMemo, useState } from 'react';
import { normalize, products } from './catalog';
import { cartProducts, useCartStore } from './cartStore';

export type Sort = 'popular' | 'price' | 'new' | 'promo';
function readSaved<T>(key: string, fallback: T, validate: (value: unknown) => value is T): T {
  try { const value: unknown = JSON.parse(localStorage.getItem(key) || 'null'); return validate(value) ? value : fallback; } catch { return fallback; }
}
const ids = new Set(cartProducts.map(product => product.id));
const validFavorites = (value: unknown): value is string[] => Array.isArray(value) && value.every(id => typeof id === 'string' && ids.has(id));

export function useCarta() {
  const [category, setCategory] = useState(new URLSearchParams(location.search).get('categoria') || 'todos');
  const [query, setQuery] = useState(new URLSearchParams(location.search).get('buscar') || '');
  const [size, setSize] = useState('todos');
  const [sort, setSort] = useState<Sort>('popular');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [limit, setLimit] = useState(12);
  const { cart, setCart, clearCart, remove } = useCartStore();
  const [favorites, setFavorites] = useState<string[]>(() => readSaved('lys-carta-favorites', [], validFavorites));
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => { try { localStorage.setItem('lys-carta-favorites', JSON.stringify(favorites)); } catch { /* Los favoritos siguen disponibles durante la sesión. */ } }, [favorites]);
  const filtered = useMemo(() => products.filter(product =>
    (category === 'todos' || product.category === category) && (size === 'todos' || product.size === size) &&
    (!favoritesOnly || favorites.includes(product.id)) && (sort !== 'promo' || product.promo) &&
    normalize(`${product.name} ${product.description}`).includes(normalize(query)))
    .sort((a, b) => sort === 'price' ? a.price - b.price : sort === 'new' ? Number(b.isNew) - Number(a.isNew) || b.popular - a.popular : b.popular - a.popular), [category, size, favoritesOnly, favorites, sort, query]);
  function filter<T>(setter: (value: T) => void, value: T) { setter(value); setLimit(12); }
  function add(id: string, count = 1) {
    if (!ids.has(id) || !Number.isInteger(count) || count < 1 || count > 99) return;
    setCart(previous => ({ ...previous, [id]: Math.min(99, (previous[id] || 0) + count) }));
    setAnnouncement(`${cartProducts.find(product => product.id === id)?.name} agregado a tu pedido`);
  }
  function quantity(id: string, delta: number) { setCart(previous => { const next = { ...previous }; const count = (next[id] || 0) + delta; if (count <= 0) delete next[id]; else next[id] = Math.min(99, count); return next; }); }
  function favorite(id: string) { setFavorites(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id]); }
  function reset() { setCategory('todos'); setQuery(''); setSize('todos'); setSort('popular'); setFavoritesOnly(false); setLimit(12); }
  const cartItems = cartProducts.filter(product => cart[product.id]).map(product => ({ product, count: cart[product.id] }));
  const count = cartItems.reduce((sum, item) => sum + item.count, 0);
  const total = cartItems.reduce((sum, item) => sum + item.count * item.product.price, 0);
  return { category, query, size, sort, favoritesOnly, favorites, filtered, visible: filtered.slice(0, limit), cartItems, count, total, announcement, add, quantity, favorite, reset, clearCart, remove,
    setCategory: (value: string) => filter(setCategory, value), setQuery: (value: string) => filter(setQuery, value), setSize: (value: string) => filter(setSize, value), setSort: (value: Sort) => filter(setSort, value),
    setFavoritesOnly: (value: boolean) => filter(setFavoritesOnly, value), more: () => setLimit(previous => previous + 12) };
}
