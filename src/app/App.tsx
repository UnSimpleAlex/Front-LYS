import { lazy, Suspense, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { RouteLoading } from '../components/RouteLoading';
import { Header } from '../components/Header';
import { NoticeDialog, type Notice } from '../components/NoticeDialog';
import { SignInPage } from '../pages/SignInPage';
import { AuthLayout } from '../components/AuthLayout';
const HomePage = lazy(() => import('../pages/HomePage').then(module => ({ default: module.HomePage })));
const CartaPage = lazy(() => import('../pages/CartaPage').then(module => ({ default: module.CartaPage })));
const PromotionsPage = lazy(() => import('../pages/PromotionsPage').then(module => ({ default: module.PromotionsPage })));
const RegisterCard = lazy(() => import('../features/auth/RegisterCard').then(module => ({ default: module.RegisterCard })));

export function App() {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [route, setRoute] = useState(window.location.pathname);
  const registration = route === '/registro';
  const home = route === '/';
  const carta = route === '/carta';
  const promotions = route === '/promociones';
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('preview') === 'carga') { url.searchParams.delete('preview'); window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`); }
  }, []);
  useEffect(() => {
    const updateRoute = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', updateRoute);
    return () => window.removeEventListener('popstate', updateRoute);
  }, []);
  function navigate(toRegistration: boolean) {
    window.history.pushState(null, '', toRegistration ? '/registro' : '/iniciar-sesion');
    setRoute(toRegistration ? '/registro' : '/iniciar-sesion');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  useEffect(() => { document.title = home ? 'Leñas y Sabores | Sabor peruano en cada brasa' : carta ? 'Nuestra carta | Leñas y Sabores' : promotions ? 'Promociones | Leñas y Sabores' : registration ? 'Registrarse | Leñas y Sabores' : 'Iniciar sesión | Leñas y Sabores'; }, [registration, home, carta, promotions]);

  function openHelp(action: 'register' | 'recover') {
    if (action === 'register') navigate(true);
    else setNotice({ title: 'Recuperar contraseña', message: 'La recuperación de tu cuenta estará disponible pronto.' });
  }

  function onSection(section: string) {
    const cartaTargets: Record<string, string> = { Carta: '', 'Pollo a la brasa': 'pollo', Parrillas: 'parrillas', Combos: 'combos', 'Bebidas y acompañamientos': 'bebidas', 'Descubre combos': 'combos', 'Ver nuestro menú': '' };
    if (section in cartaTargets) { window.history.pushState(null, '', `/carta${cartaTargets[section] ? `?categoria=${cartaTargets[section]}` : ''}`); setRoute('/carta'); window.scrollTo({ top: 0, behavior: 'instant' }); return; }
    if (section === 'Promociones' || section === 'Todas las promociones') { window.history.pushState(null, '', '/promociones'); setRoute('/promociones'); window.scrollTo({ top: 0, behavior: 'instant' }); return; }
    if (section === 'Afiliarme') { navigate(true); return; }
    const targets: Record<string, string> = { Inicio: 'contenido', Contacto: 'contacto' };
    if (home && targets[section]) {
      document.getElementById(targets[section])?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      return;
    }
    if (section === 'Inicio') { window.history.pushState(null, '', '/'); setRoute('/'); window.scrollTo({ top: 0, behavior: 'instant' }); return; }
    const message = section === 'Pedir ahora' ? 'Pronto podrás hacer tu pedido desde aquí.' : `La sección ${section.toLowerCase()} estará disponible pronto.`;
    setNotice({ title: section, message });
  }
  return <MotionConfig reducedMotion="user">
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    {!carta && !promotions && <Header onSection={onSection} home={home} />}
    <Suspense fallback={<RouteLoading />}>{carta ? <CartaPage onAction={onSection} /> : promotions ? <PromotionsPage onAction={onSection} /> : home ? <HomePage onAction={onSection} /> : registration ? <AuthLayout registration><RegisterCard onLogin={() => navigate(false)} onLegal={kind => setNotice({ title: kind === 'terms' ? 'Términos y Condiciones' : 'Política de Privacidad', message: 'El documento oficial estará disponible antes de habilitar la creación de cuentas.' })} /></AuthLayout> : <SignInPage onHelp={openHelp} />}</Suspense>
    <NoticeDialog notice={notice} onClose={() => setNotice(null)} />
  </MotionConfig>;
}
