import { useEffect, useState } from 'react';
import '../styles/loading.css';

export function RouteLoading() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 180);
    return () => window.clearTimeout(timer);
  }, []);

  return <div className="route-loading" id="contenido">
    {visible && <div className="loading-scene" role="status" aria-live="polite">
      <img className="loading-brand" src="/images/logo.webp" alt="Leñas y Sabores" width="2048" height="682" />
      <div className="loading-rotisserie" aria-hidden="true">
        <div className="loading-steam"><i /><i /><i /></div>
        <div className="loading-spit" />
        <img className="loading-chicken" src="/images/loading/chicken.webp" alt="" width="900" height="507" />
        <div className="loading-roast-shadow" />
        <svg className="loading-turn-arrow arrow-left" viewBox="0 0 100 60" focusable="false"><path d="M95 5C55 7 26 22 12 49L10 37M12 49L25 44" /></svg>
        <svg className="loading-turn-arrow arrow-right" viewBox="0 0 100 60" focusable="false"><path d="M5 55C45 53 74 38 88 11L90 23M88 11L75 16" /></svg>
      </div>
      <div className="loading-dots" aria-hidden="true"><span /><span /><span /></div>
      <p className="loading-title">Preparando tu experiencia<span aria-hidden="true">…</span></p>
      <div className="loading-ornament" aria-hidden="true"><span /><i /><span /></div>
    </div>}
  </div>;
}
