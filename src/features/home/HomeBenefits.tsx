import { Icon } from '../../components/Icon';
import { appBenefits, serviceBenefits, type Benefit } from './homeContent';

function BenefitItem({ item }: { item: Benefit }) {
  return <div className="home-benefit"><Icon name={item.icon} /><div><h3>{item.title}</h3><p>{item.description}</p></div></div>;
}
export function ServiceBenefits() {
  return <section className="service-benefits" aria-label="Servicios"><div className="home-container">{serviceBenefits.map(item => <BenefitItem key={item.title} item={item} />)}</div></section>;
}
export function HomeApp({ onAction }: { onAction: (section: string) => void }) {
  return <section className="home-app" aria-labelledby="app-title"><div className="home-container home-app-inner">
    <div className="app-phone-scene" aria-hidden="true"><div className="app-phone"><div className="phone-notch" /><img className="phone-logo" src="/images/logo.webp" alt="" width="2048" height="682" /><span>Pedir ahora ↗</span><img className="phone-food" src="/images/home/familiar-640.webp" alt="" width="640" height="274" loading="lazy" /></div></div>
    <div className="app-heading"><h2 id="app-title">Tu sabor favorito,<span className="home-script">ahora más cerca</span></h2><p>Descarga nuestra app y vive una experiencia más sabrosa</p></div>
    <div className="app-details"><div className="app-benefits">{appBenefits.map(item => <BenefitItem item={item} key={item.title} />)}</div><div className="store-badges"><button type="button" className="store-badge" onClick={() => onAction('App Store')} aria-label="Descargar en App Store"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15 1c0 3-2 5-4 5 0-3 2-5 4-5Zm4 7c-5-4-6 0-9-1C4 4 1 11 4 18c2 5 4 6 7 4 3-2 4 3 7-1l3-5c-5-2-5-6-2-8Z" /></svg><span><small>Descárgalo en</small>App Store</span></button><button type="button" className="store-badge" onClick={() => onAction('Google Play')} aria-label="Descargar en Google Play"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#00d6ff" d="M2 1v22l11-11Z"/><path fill="#00ef81" d="m2 1 15 9-4 2Z"/><path fill="#ffcf00" d="m17 10 4 2-4 2-4-2Z"/><path fill="#ff404e" d="m2 23 15-9-4-2Z"/></svg><span><small>DISPONIBLE EN</small>Google Play</span></button></div></div>
    <p className="app-pocket home-script">¡Más sabor<br />en tu bolsillo!</p>
  </div></section>;
}
