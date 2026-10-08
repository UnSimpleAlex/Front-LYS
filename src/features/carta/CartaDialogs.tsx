import { useEffect, useRef } from 'react';
import { Icon } from '../../components/Icon';
import { soles, type Product } from './catalog';

export function ProductDetail({ product, onClose, onAdd }: { product: Product | null; onClose: () => void; onAdd: (id: string) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (product) ref.current?.showModal(); else ref.current?.close(); }, [product]);
  return <dialog ref={ref} className="carta-dialog product-detail" aria-labelledby="product-detail-title" onClose={onClose}>
    <button type="button" className="dialog-close" aria-label="Cerrar detalle" onClick={onClose}><Icon name="close" /></button>
    {product && <><img src={product.image} alt={product.description} width="640" height="400" /><div><h2 id="product-detail-title">{product.name}</h2><p>{product.description}</p><strong>{soles(product.price)}</strong><button type="button" className="primary-button" onClick={() => { onAdd(product.id); onClose(); }}><Icon name="cart" />Agregar a mi pedido</button></div></>}
  </dialog>;
}
export function CartaCart({ open, items, total, onClose, onQuantity }: { open: boolean; items: { product: Product; count: number }[]; total: number; onClose: () => void; onQuantity: (id: string, delta: number) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (open) ref.current?.showModal(); else ref.current?.close(); }, [open]);
  return <dialog ref={ref} className="carta-dialog carta-cart" aria-labelledby="cart-title" onClose={onClose}>
    <button type="button" className="dialog-close" aria-label="Cerrar pedido" onClick={onClose}><Icon name="close" /></button><h2 id="cart-title">Tu pedido</h2>
    {items.length ? <><ul>{items.map(({ product, count }) => <li key={product.id}><img src={product.image} alt="" width="80" height="60" /><div><h3>{product.name}</h3><p>{soles(product.price * count)}</p><div className="cart-quantity"><button type="button" aria-label={`Quitar una unidad de ${product.name}`} onClick={() => onQuantity(product.id, -1)}>−</button><span>{count}</span><button type="button" aria-label={`Agregar una unidad de ${product.name}`} disabled={count === 99} onClick={() => onQuantity(product.id, 1)}>+</button></div></div></li>)}</ul><div className="cart-total"><span>Total</span><strong>{soles(total)}</strong></div><p className="cart-note">Tu selección queda guardada. La confirmación de pedidos estará disponible próximamente.</p></> : <div className="cart-empty"><Icon name="cart" /><p>Tu pedido está esperando algo rico.</p></div>}
    <button type="button" className="primary-button" onClick={onClose}>Seguir viendo la carta</button>
  </dialog>;
}
