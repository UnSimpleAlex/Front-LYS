import { useState } from 'react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { EmberTrail } from '../components/EmberTrail';
import { Icon } from '../components/Icon';
import { useCarta } from '../features/carta/useCarta';
import { CartaCart } from '../features/carta/CartaDialogs';
import { normalize } from '../features/carta/catalog';
import { promotions, promotionCategories } from '../features/promotions/catalog';
import { PromotionCard } from '../features/promotions/PromotionCard';
import '../styles/carta.css';
import '../styles/promotions.css';

export function PromotionsPage({ onAction }: { onAction: (section: string) => void }) {
  const cart = useCarta();
  const [cartOpen, setCartOpen] = useState(false);
  const [category, setCategory] = useState('todas');
  const filtered = promotions.filter(promotion => (category === 'todas' || promotion.filters.includes(category)) && normalize(`${promotion.name} ${promotion.description}`).includes(normalize(cart.query)));
  function action(section: string) {
    if (section === 'Pedir ahora') setCartOpen(true);
    else if (section === 'Promociones') window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    else onAction(section);
  }
  return <>
    <Header onSection={action} activeSection="Promociones" theme="promotions" carta={{ query: cart.query, onSearch: cart.setQuery, count: cart.count, onCart: () => setCartOpen(true) }} />
    <main className="promotions-page" id="contenido"><EmberTrail />
      <section className="promotions-hero" aria-labelledby="promotions-title"><picture className="promotions-hero-background"><source media="(max-width: 650px)" srcSet="/images/promotions/hero-mobile.webp" /><img src="/images/promotions/hero-desktop.webp" alt="Pollo a la brasa y papas en una edición de Halloween" width="1920" height="360" fetchPriority="high" /></picture>
        <div className="promotions-hero-copy"><h1 id="promotions-title"><span className="sr-only">Promociones que dan susto</span><img src="/images/promotions/title.webp" alt="" width="1200" height="420" /></h1><p>Sabores de temporada, por tiempo limitado</p></div>
        <p className="promotions-hero-note">El buen<br />pollo <span>también<br />da miedo…</span><br />de lo rico<br />que es</p>
      </section>
      <div className="promotions-container"><label className="carta-mobile-search" id="carta-search"><Icon name="search" /><input type="search" aria-label="Buscar promociones" placeholder="Buscar promociones…" value={cart.query} onChange={event => cart.setQuery(event.target.value)} /></label>
        <div className="promo-offer-filters" role="group" aria-label="Categorías de promociones">{promotionCategories.map(item => <button key={item.id} type="button" aria-pressed={category === item.id} onClick={() => setCategory(item.id)}><Icon name={item.icon} />{item.label}</button>)}</div>
        <section aria-label="Ofertas de temporada"><p className="sr-only" role="status">{filtered.length} promociones disponibles</p>{filtered.length ? <div className="promo-offer-grid">{filtered.map(promotion => <PromotionCard key={promotion.id} promotion={promotion} onAdd={cart.add} />)}</div> : <div className="carta-no-results"><Icon name="search" /><h2>No encontramos esa promoción</h2><p>Prueba otro nombre o cambia la categoría.</p><button type="button" onClick={() => { cart.setQuery(''); setCategory('todas'); }}>Ver todas las promociones</button></div>}</section>
      </div>
    </main>
    <BottomNavigation active="Promociones" onAction={action} />
    <p className="sr-only" role="status">{cart.announcement}</p>
    <CartaCart open={cartOpen} items={cart.cartItems} total={cart.total} onClose={() => setCartOpen(false)} onQuantity={cart.quantity} />
  </>;
}
