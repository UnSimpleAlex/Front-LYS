import { useState } from 'react';
import { Header } from '../components/Header';
import { NoticeDialog, type Notice } from '../components/NoticeDialog';
import { SignInPage } from '../pages/SignInPage';

export function App() {
  const [notice, setNotice] = useState<Notice | null>(null);

  function openHelp(action: 'register' | 'recover') {
    setNotice(action === 'register'
      ? { title: 'Crea tu cuenta', message: 'Pronto podrás registrarte y disfrutar del sabor de casa.' }
      : { title: 'Recuperar contraseña', message: 'La recuperación de tu cuenta estará disponible pronto.' });
  }

  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <Header onSection={(section) => setNotice({ title: section, message: section === 'Pedir ahora' ? 'Pronto podrás hacer tu pedido desde aquí.' : `La sección ${section.toLowerCase()} estará disponible pronto.` })} />
    <SignInPage onHelp={openHelp} />
    <NoticeDialog notice={notice} onClose={() => setNotice(null)} />
  </>;
}
