import { useRef } from 'react';
import { Icon } from '../../components/Icon';
import { soles, type Product } from './catalog';
import { FavoriteButton } from './FavoriteButton';

export function ProductCard({ product, favorite, count, onFavorite, onAdd, onQuantity, onDetail }: { product: Product; favorite: boolean; count: number; onFavorite: () => void; onAdd: () => void; onQuantity: (delta: number) => void; onDetail: () => void }) {
  const addButton = useRef<HTMLButtonElement>(null);
  return <article className="product-card">
    <div className={`product-photo${product.category === 'bebidas' ? ' product-photo-beverage' : ''}`}><button type="button" className="product-open" onClick={onDetail} aria-label={`Ver ${product.name}`}>
      {product.category === 'bebidas' && <img className="beverage-backdrop" src={product.image} alt="" aria-hidden="true" width="640" height="480" loading="lazy" decoding="async" />}
      <img className="product-image" src={product.image} alt={product.description} width="640" height="480" loading="lazy" decoding="async" /></button>
      <FavoriteButton selected={favorite} productName={product.name} onToggle={onFavorite} />
    </div>
    <div className="product-info"><button className="product-name" type="button" onClick={onDetail}><h3>{product.name}</h3></button><p>{product.description}</p><div className="product-purchase"><strong>{soles(product.price)}</strong>
      <div className={`product-cart-control${count ? ' has-quantity' : ''}`} role="group" aria-label={`Cantidad de ${product.name}`}>
        <button type="button" className="product-decrease" hidden={!count} aria-label={`Reducir cantidad de ${product.name}`} onClick={() => { if (count === 1) addButton.current?.focus(); onQuantity(-1); }}><Icon name="minus" /></button>
        <output hidden={!count} aria-live="polite" aria-label={`Unidades de ${product.name}`}>{count}</output>
        <button ref={addButton} type="button" className="product-add" disabled={count >= 99} aria-label={`${count ? 'Aumentar cantidad de' : 'Agregar'} ${product.name}`} onClick={onAdd}><Icon name={count ? 'plus' : 'cart'} /><span>{count ? '' : 'Agregar'}</span><span className="product-plus" aria-hidden="true">+</span></button>
      </div>
    </div></div>
  </article>;
}
