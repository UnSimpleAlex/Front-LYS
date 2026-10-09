import { lazy, Suspense, useState } from 'react';
import { Icon, type IconName } from '../components/Icon';
import { PageHero, InformationFooter } from '../features/information/InformationShared';
import { useCarta } from '../features/carta/useCarta';
import { cartProducts } from '../features/carta/cartStore';
import { ProductCard } from '../features/carta/ProductCard';
import { ProductDetail } from '../features/carta/CartaDialogs';
import type { Product } from '../features/carta/catalog';
import { AccountDashboard } from '../features/account/AccountDashboard';
import { OrderList } from '../features/account/OrderList';
import { AccountEmpty, AccountPromo, AccountDialog } from '../features/account/AccountShared';
import '../styles/account.css';
const AccountAddresses = lazy(() => import('../features/account/AccountAddresses').then(module => ({ default: module.AccountAddresses })));
const AccountProfileForm = lazy(() => import('../features/account/AccountProfileForm').then(module => ({ default: module.AccountProfileForm })));
const AccountPayments = lazy(() => import('../features/account/AccountPayments').then(module => ({ default: module.AccountPayments })));
const AccountNotifications = lazy(() => import('../features/account/AccountNotifications').then(module => ({ default: module.AccountNotifications })));
const sections: { slug: string; label: string; title: string; accent: string; description: string; icon: IconName }[] = [
  { slug: '', label: 'Inicio', title: 'Mi', accent: 'cuenta', description: 'Gestiona tu información, pedidos y preferencias.', icon: 'home' },
  { slug: 'pedidos', label: 'Mis pedidos', title: 'Mis', accent: 'pedidos', description: 'Revisa tus pedidos y vuelve a pedir tus favoritos.', icon: 'receipt' },
  { slug: 'direcciones', label: 'Mis direcciones', title: 'Mis', accent: 'direcciones', description: 'Administra tus direcciones de entrega para preparar pedidos más rápidos.', icon: 'pin' },
  { slug: 'datos', label: 'Mis datos', title: 'Mis', accent: 'datos', description: 'Mantén tu información actualizada para una mejor experiencia.', icon: 'user' },
  { slug: 'metodos-pago', label: 'Métodos de pago', title: 'Métodos de', accent: 'pago', description: 'Elige cómo prefieres pagar tus próximos pedidos.', icon: 'card' },
  { slug: 'notificaciones', label: 'Notificaciones', title: 'Tus', accent: 'notificaciones', description: 'Entérate del estado de tus pedidos, promociones y novedades.', icon: 'mail' },
  { slug: 'favoritos', label: 'Favoritos', title: 'Mis', accent: 'favoritos', description: 'Los productos que más te gustan, listos para tu próximo pedido.', icon: 'heart' },
];
export function AccountPage({ route, onNavigate, onAction }: { route: string; onNavigate: (path: string) => void; onAction: (action: string) => void }) {
  const section = sections.find(item => route === `/mi-cuenta${item.slug ? `/${item.slug}` : ''}`) || sections[0];
  const carta = useCarta();
  const [detail, setDetail] = useState<Product | null>(null);
  const [leaving, setLeaving] = useState(false);
  const favorites = cartProducts.filter(product => carta.favorites.includes(product.id));
  return <><main id="contenido" className="information-page account-page"><div className="info-container"><nav className="account-breadcrumb" aria-label="Ruta actual"><button type="button" onClick={() => onNavigate('/')}>Inicio</button><span>›</span><button type="button" onClick={() => onNavigate('/mi-cuenta')}>Mi cuenta</button>{section.slug && <><span>›</span><span>{section.label}</span></>}</nav><div className="account-layout"><aside className="account-sidebar"><nav className="info-card" aria-label="Secciones de mi cuenta">{sections.map(item => <button type="button" key={item.slug} aria-current={section.slug === item.slug ? 'page' : undefined} onClick={() => onNavigate(`/mi-cuenta${item.slug ? `/${item.slug}` : ''}`)}><Icon name={item.icon} />{item.label}</button>)}<button type="button" className="account-exit" onClick={() => setLeaving(true)}><Icon name="arrow" />Salir de la vista</button></nav><AccountPromo onAction={onAction} /></aside><div className="account-content"><PageHero eyebrow={section.slug ? section.label : 'Tu espacio'} title={section.title} accent={section.accent} description={section.description} /><div className="account-demo-banner"><Icon name="shield" /><p><strong>Vista de demostración</strong> · Tus datos se guardan solo en esta pestaña. El acceso a cuentas está pendiente de conexión.</p><a href="/iniciar-sesion">Iniciar sesión</a></div><Suspense fallback={<p role="status">Cargando sección…</p>}>{section.slug === '' ? <AccountDashboard favorites={favorites.length} onNavigate={onNavigate} /> : section.slug === 'pedidos' ? <OrderList onNavigate={onNavigate} /> : section.slug === 'direcciones' ? <AccountAddresses /> : section.slug === 'datos' ? <AccountProfileForm onNavigate={onNavigate} /> : section.slug === 'metodos-pago' ? <AccountPayments /> : section.slug === 'notificaciones' ? <AccountNotifications onNavigate={onNavigate} /> : favorites.length ? <div className="account-favorites">{favorites.map(product => <ProductCard key={product.id} product={product} favorite onFavorite={() => carta.favorite(product.id)} onAdd={() => carta.add(product.id)} onDetail={() => setDetail(product)} />)}</div> : <AccountEmpty title="Aquí van tus favoritos" description="Toca el corazón de un producto de la carta para guardarlo y encontrarlo aquí." action="Explorar la carta" onAction={() => onNavigate('/carta')} />}</Suspense>{section.slug && <AccountPromo onAction={onAction} />}</div></div></div><div className="sr-only" role="status">{carta.announcement}</div></main><InformationFooter active="Mi cuenta" onAction={onAction} /><ProductDetail product={detail} onClose={() => setDetail(null)} onAdd={carta.add} />{leaving && <AccountDialog title="Salir de Mi cuenta" onClose={() => setLeaving(false)}><p>Estás usando una vista de demostración, sin una sesión autenticada. Tus datos permanecen en esta pestaña hasta que los restablezcas o la cierres.</p><button type="button" className="primary-button" onClick={() => { setLeaving(false); onNavigate('/'); }}>Volver al inicio</button></AccountDialog>}</>;
}
