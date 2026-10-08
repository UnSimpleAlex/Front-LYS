import { useState } from 'react';
import { Header } from '../components/Header';
import { Icon, type IconName } from '../components/Icon';
import { HomeFooter } from '../features/home/HomeFooter';
import { categories, type Product } from '../features/carta/catalog';
import { useCarta, type Sort } from '../features/carta/useCarta';
import { ProductCard } from '../features/carta/ProductCard';
import { CartaCart, ProductDetail } from '../features/carta/CartaDialogs';
import '../styles/carta.css';

const sorting: { id: Sort; name: string; icon: IconName }[] = [{ id: 'popular', name: 'Más populares', icon: 'flame' }, { id: 'price', name: 'Precio', icon: 'sort' }, { id: 'new', name: 'Nuevos', icon: 'star' }, { id: 'promo', name: 'Promo', icon: 'tag' }];
export function CartaPage({ onAction }: { onAction: (section: string) => void }) {
  const carta = useCarta();
  const [cartOpen, setCartOpen] = useState(false);
  const [detail, setDetail] = useState<Product | null>(null);
  const tabs = [{ id: 'todos', name: 'Todos', icon: 'grid' }, ...categories];
  function action(section: string) { if (section === 'Pedir ahora') setCartOpen(true); else if (section === 'Carta') window.scrollTo({ top: 0, behavior: 'smooth' }); else onAction(section); }
  return <>
    <Header onSection={action} carta={{ query: carta.query, onSearch: carta.setQuery, count: carta.count, onCart: () => setCartOpen(true) }} />
    <main id="contenido" className="carta-page">
      <section className="carta-hero" aria-labelledby="carta-title"><picture><source media="(max-width: 650px)" srcSet="/images/carta/hero-mobile.webp" /><img src="/images/carta/hero-desktop.webp" alt="Pollo a la brasa con papas fritas y cremas de la casa" width="2172" height="724" fetchPriority="high" /></picture>
        <div className="carta-hero-copy"><h1 id="carta-title"><span className="sr-only">Nuestra carta</span><picture><source media="(max-width: 650px)" srcSet="/images/carta/title-mobile.webp" /><img src="/images/carta/title-desktop.webp" alt="" width="1400" height="470" /></picture></h1><p><span className="carta-tagline-desktop">Sabor peruano en cada bocado</span><span className="carta-tagline-mobile">Sabor peruano</span></p><span className="carta-ornament" aria-hidden="true">— ◇ —</span></div>
      </section>
      <div className="carta-container">
        <label className="carta-mobile-search" id="carta-search"><Icon name="search" /><input type="search" aria-label="Buscar en la carta" placeholder="¿Qué se te antoja hoy?" value={carta.query} onChange={event => carta.setQuery(event.target.value)} /></label>
        <div className="carta-toolbar"><nav className="carta-categories" aria-label="Categorías de la carta">{tabs.map(tab => <button type="button" key={tab.id} aria-pressed={carta.category === tab.id} onClick={() => carta.setCategory(tab.id)}>
          <Icon name={tab.icon as IconName} /><img className="category-image" src={`/images/carta/categories/${tab.id === 'todos' ? 'pollo' : tab.id}.webp`} alt="" width="80" height="64" /><span>{tab.name}</span>
        </button>)}</nav><label className="carta-sort-select">Ordenar por:<select aria-label="Ordenar productos" value={carta.sort} onChange={event => carta.setSort(event.target.value as Sort)}>{sorting.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}</select></label></div>
        <div className="carta-mobile-sorting" aria-label="Ordenar productos">{sorting.map(option => <button key={option.id} type="button" aria-pressed={carta.sort === option.id} onClick={() => carta.setSort(option.id)}><Icon name={option.icon} />{option.name}</button>)}</div>
        <section className="carta-results" aria-labelledby="carta-results-title"><div className="carta-results-heading"><h2 id="carta-results-title">{carta.category === 'todos' ? 'Nuestros platos' : categories.find(category => category.id === carta.category)?.name || 'Nuestros platos'}</h2><div className="carta-size-filters" aria-label="Tamaño de porción">{[['todos', 'Todos los tamaños'], ['individual', 'Individual'], ['compartir', 'Para compartir'], ['familiar', 'Familiar']].map(([id, label]) => <button type="button" key={id} aria-pressed={carta.size === id} onClick={() => carta.setSize(id)}>{label}</button>)}</div></div>
          <div className="carta-result-meta"><p role="status">{carta.filtered.length} {carta.filtered.length === 1 ? 'producto' : 'productos'}{carta.query && ` para “${carta.query}”`}</p><button type="button" className="carta-favorites-filter" aria-pressed={carta.favoritesOnly} onClick={() => carta.setFavoritesOnly(!carta.favoritesOnly)}><Icon name="heart" />Mis favoritos</button></div>
          {carta.filtered.length ? <><div className="carta-product-grid">{carta.visible.map(product => <ProductCard key={product.id} product={product} favorite={carta.favorites.includes(product.id)} onFavorite={() => carta.favorite(product.id)} onAdd={() => carta.add(product.id)} onDetail={() => setDetail(product)} />)}</div>{carta.visible.length < carta.filtered.length && <button type="button" className="carta-load-more" onClick={carta.more}>Ver más productos <Icon name="arrow" /></button>}</> : <div className="carta-no-results"><Icon name="search" /><h3>No encontramos ese antojo</h3><p>Prueba con otro nombre o cambia los filtros.</p><button type="button" onClick={carta.reset}>Ver toda la carta</button></div>}
        </section>
      </div>
      <HomeFooter onAction={onAction} />
    </main>
    <nav className="carta-bottom-nav" aria-label="Navegación inferior">{[{ name: 'Inicio', icon: 'home' }, { name: 'Carta', icon: 'cutlery' }, { name: 'Promociones', icon: 'tag' }, { name: 'Locales', icon: 'pin' }].map(item => <button key={item.name} type="button" aria-current={item.name === 'Carta' ? 'page' : undefined} onClick={() => action(item.name)}><Icon name={item.icon as IconName} /><span>{item.name}</span></button>)}<a href="/iniciar-sesion"><Icon name="user" /><span>Mi cuenta</span></a></nav>
    <p className="sr-only" role="status">{carta.announcement}</p>
    <ProductDetail product={detail} onClose={() => setDetail(null)} onAdd={carta.add} /><CartaCart open={cartOpen} items={carta.cartItems} total={carta.total} onClose={() => setCartOpen(false)} onQuantity={carta.quantity} />
  </>;
}
