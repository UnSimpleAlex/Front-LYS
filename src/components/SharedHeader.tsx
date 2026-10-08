import { useState } from 'react';
import { Header } from './Header';
import { useCarta } from '../features/carta/useCarta';
import { CartaCart } from '../features/carta/CartaDialogs';

export function SharedHeader({ onSection, activeSection, onSearch }: { onSection: (section: string) => void; activeSection: string; onSearch: (query: string) => void }) {
  const cart = useCarta();
  const [cartOpen, setCartOpen] = useState(false);
  return <>
    <Header activeSection={activeSection} onSection={section => section === 'Pedir ahora' ? setCartOpen(true) : onSection(section)} carta={{ query: cart.query, onSearch, count: cart.count, onCart: () => setCartOpen(true), searchHref: '/carta#carta-search' }} />
    <CartaCart open={cartOpen} items={cart.cartItems} total={cart.total} onClose={() => setCartOpen(false)} onQuantity={cart.quantity} />
  </>;
}
