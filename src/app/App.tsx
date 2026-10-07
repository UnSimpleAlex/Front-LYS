import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { NoticeDialog, type Notice } from '../components/NoticeDialog';
import { SignInPage } from '../pages/SignInPage';
import { AuthLayout } from '../components/AuthLayout';
import { RegisterCard } from '../features/auth/RegisterCard';

export function App() {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [registration, setRegistration] = useState(window.location.pathname === '/registro');
  useEffect(() => {
    const updateRoute = () => setRegistration(window.location.pathname === '/registro');
    window.addEventListener('popstate', updateRoute);
    return () => window.removeEventListener('popstate', updateRoute);
  }, []);
  function navigate(toRegistration: boolean) {
    window.history.pushState(null, '', toRegistration ? '/registro' : '/');
    setRegistration(toRegistration);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  useEffect(() => { document.title = registration ? 'Registrarse | Leñas y Sabores' : 'Iniciar sesión | Leñas y Sabores'; }, [registration]);

  function openHelp(action: 'register' | 'recover') {
    if (action === 'register') navigate(true);
    else setNotice({ title: 'Recuperar contraseña', message: 'La recuperación de tu cuenta estará disponible pronto.' });
  }

  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <Header onSection={(section) => setNotice({ title: section, message: section === 'Pedir ahora' ? 'Pronto podrás hacer tu pedido desde aquí.' : `La sección ${section.toLowerCase()} estará disponible pronto.` })} />
    {registration ? <AuthLayout registration><RegisterCard onLogin={() => navigate(false)} onLegal={kind => setNotice({ title: kind === 'terms' ? 'Términos y Condiciones' : 'Política de Privacidad', message: 'El documento oficial estará disponible antes de habilitar la creación de cuentas.' })} /></AuthLayout> : <SignInPage onHelp={openHelp} />}
    <NoticeDialog notice={notice} onClose={() => setNotice(null)} />
  </>;
}
