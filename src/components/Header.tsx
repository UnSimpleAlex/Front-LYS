import { useEffect, useState } from 'react';
import { Icon } from './Icon';

const sections = ['Inicio', 'Carta', 'Promociones', 'Nosotros', 'Locales', 'Contacto'];

export function Header({ onSection }: { onSection: (section: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  function navigate(section: string) {
    setMenuOpen(false);
    if (section === 'Inicio') window.scrollTo({ top: 0, behavior: 'instant' });
    else onSection(section);
  }

  return <header className="site-header">
    <a className="brand" href="/" aria-label="Leñas y Sabores, inicio">
      <img src="/images/logo.webp" alt="Leñas y Sabores — Pollos & Parrillas" width="2048" height="682" />
    </a>
    <nav className="desktop-nav" aria-label="Navegación principal">
      {sections.map((section) => <button key={section} type="button" className={section === 'Inicio' ? 'nav-link active' : 'nav-link'} aria-current={section === 'Inicio' ? 'page' : undefined} onClick={() => navigate(section)}>{section}</button>)}
    </nav>
    <div className="header-actions">
      <a className="login-link" href="#iniciar-sesion"><Icon name="user" />Iniciar sesión</a>
      <span className="header-divider" aria-hidden="true" />
      <button type="button" className="order-button" onClick={() => onSection('Pedir ahora')}>Pedir ahora</button>
      <button type="button" className="menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} /></button>
    </div>
    <nav id="mobile-navigation" className="mobile-nav" aria-label="Navegación móvil" hidden={!menuOpen}>
      {sections.map((section) => <button type="button" key={section} onClick={() => navigate(section)}>{section}</button>)}
      <a href="#iniciar-sesion" onClick={() => setMenuOpen(false)}>Iniciar sesión</a>
    </nav>
  </header>;
}
