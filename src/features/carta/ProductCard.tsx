import { Icon } from '../../components/Icon';
import { soles, type Product } from './catalog';

export function ProductCard({ product, favorite, onFavorite, onAdd, onDetail }: { product: Product; favorite: boolean; onFavorite: () => void; onAdd: () => void; onDetail: () => void }) {
  return <article className="product-card">
    <div className={`product-photo${product.category === 'bebidas' ? ' product-photo-beverage' : ''}`}><button type="button" className="product-open" onClick={onDetail} aria-label={`Ver ${product.name}`}><img src={product.image} alt={product.description} width="640" height="400" loading="lazy" decoding="async" /></button>
      <button type="button" className="product-favorite" aria-label={`${favorite ? 'Quitar' : 'Guardar'} ${product.name} ${favorite ? 'de' : 'en'} favoritos`} aria-pressed={favorite} onClick={onFavorite}><Icon name="heart" /></button>
    </div>
    <div className="product-info"><button className="product-name" type="button" onClick={onDetail}><h3>{product.name}</h3></button><p>{product.description}</p><strong>{soles(product.price)}</strong>
      <button type="button" className="product-add" aria-label={`Agregar ${product.name}`} onClick={onAdd}><Icon name="cart" /><span>Agregar</span><span className="product-plus" aria-hidden="true">+</span></button>
    </div>
  </article>;
}
