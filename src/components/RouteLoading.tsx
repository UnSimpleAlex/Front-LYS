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
      <div className="loading-embers" aria-hidden="true">
        <div className="loading-orbit" />
        <div className="loading-coal"><svg viewBox="0 0 64 80" focusable="false"><path d="M34 3C40 22 21 27 27 43C30 36 37 34 38 24C53 37 60 48 56 61C52 75 40 79 30 77C13 77 6 65 8 52C10 41 20 34 17 24C28 31 29 19 34 3Z" /><path className="loading-flame-core" d="M32 45C34 54 25 56 26 64C27 73 40 74 42 64C44 56 37 53 37 48C36 53 32 55 32 45Z" /></svg></div>
        <i /><i /><i />
      </div>
      <p className="loading-title">Encendiendo el sabor<span aria-hidden="true">…</span></p>
      <p className="loading-caption">La tradición está por servirse</p>
      <div className="loading-rhythm" aria-hidden="true"><span /><span /><span /></div>
    </div>}
  </div>;
}
