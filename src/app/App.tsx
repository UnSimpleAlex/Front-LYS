import { lazy, Suspense, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Header } from '../components/Header';
import { NoticeDialog, type Notice } from '../components/NoticeDialog';
import { SignInPage } from '../pages/SignInPage';
import { AuthLayout } from '../components/AuthLayout';
const HomePage = lazy(() => import('../pages/HomePage').then(module => ({ default: module.HomePage })));
const RegisterCard = lazy(() => import('../features/auth/RegisterCard').then(module => ({ default: module.RegisterCard })));

export function App() {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [route, setRoute] = useState(window.location.pathname);
  const registration = route === '/registro';
  const home = route === '/';
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
  useEffect(() => { document.title = home ? 'Leñas y Sabores | Sabor peruano en cada brasa' : registration ? 'Registrarse | Leñas y Sabores' : 'Iniciar sesión | Leñas y Sabores'; }, [registration, home]);

  function openHelp(action: 'register' | 'recover') {
    if (action === 'register') navigate(true);
    else setNotice({ title: 'Recuperar contraseña', message: 'La recuperación de tu cuenta estará disponible pronto.' });
  }

  function onSection(section: string) {
    if (section === 'Afiliarme') { navigate(true); return; }
    const targets: Record<string, string> = { Inicio: 'contenido', Promociones: 'promociones', Contacto: 'contacto' };
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
    <Header onSection={onSection} home={home} />
    <Suspense fallback={<p className="route-loading" role="status">Cargando…</p>}>{home ? <HomePage onAction={onSection} /> : registration ? <AuthLayout registration><RegisterCard onLogin={() => navigate(false)} onLegal={kind => setNotice({ title: kind === 'terms' ? 'Términos y Condiciones' : 'Política de Privacidad', message: 'El documento oficial estará disponible antes de habilitar la creación de cuentas.' })} /></AuthLayout> : <SignInPage onHelp={openHelp} />}</Suspense>
    <NoticeDialog notice={notice} onClose={() => setNotice(null)} />
  </MotionConfig>;
}
