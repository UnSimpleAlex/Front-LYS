import { useState } from 'react';
import { Icon } from '../../components/Icon';
import { soles, type Product } from './catalog';

export function ProductCard({ product, favorite, onFavorite, onAdd, onDetail }: { product: Product; favorite: boolean; onFavorite: () => void; onAdd: () => void; onDetail: () => void }) {
  const [feedback, setFeedback] = useState<'save' | 'remove' | null>(null);
  function toggleFavorite() { setFeedback(favorite ? 'remove' : 'save'); onFavorite(); }
  return <article className="product-card">
    <div className={`product-photo${product.category === 'bebidas' ? ' product-photo-beverage' : ''}`}><button type="button" className="product-open" onClick={onDetail} aria-label={`Ver ${product.name}`}>
      {product.category === 'bebidas' && <img className="beverage-backdrop" src={product.image} alt="" aria-hidden="true" width="640" height="480" loading="lazy" decoding="async" />}
      <img className="product-image" src={product.image} alt={product.description} width="640" height="480" loading="lazy" decoding="async" /></button>
      <button type="button" className="product-favorite" data-feedback={feedback || undefined} aria-label={`${favorite ? 'Quitar' : 'Guardar'} ${product.name} ${favorite ? 'de' : 'en'} favoritos`} aria-pressed={favorite} onClick={toggleFavorite} onAnimationEnd={event => { if (event.animationName === 'favorite-heartbeat' || event.animationName === 'favorite-release') setFeedback(null); }}><span className="favorite-symbol"><Icon name="heart" /></span></button>
    </div>
    <div className="product-info"><button className="product-name" type="button" onClick={onDetail}><h3>{product.name}</h3></button><p>{product.description}</p><div className="product-purchase"><strong>{soles(product.price)}</strong>
      <button type="button" className="product-add" aria-label={`Agregar ${product.name}`} onClick={onAdd}><Icon name="cart" /><span>Agregar</span><span className="product-plus" aria-hidden="true">+</span></button>
    </div></div>
  </article>;
}
