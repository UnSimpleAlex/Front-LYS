import { lazy, Suspense } from 'react';
import { Icon } from '../components/Icon';
import { PageHero, InformationNavigation, ContactDetails, SocialLinks } from '../features/information/InformationShared';
import { business } from '../features/information/business';
const BusinessMap = lazy(() => import('../features/information/BusinessMap').then(module => ({ default: module.BusinessMap })));
export function LocationsPage({ onAction }: { onAction: (action: string) => void }) {
  return <><main id="contenido" className="information-page locations-page"><div className="info-container"><PageHero eyebrow="Nuestro local" title="Visítanos en" accent="Carabayllo" description="Disfruta de nuestro delicioso pollo a la leña y parrillas en un ambiente familiar." /><section className="locations-layout"><figure className="local-photo"><img src="/images/information/local-concept.webp" width="1536" height="1024" alt="Ilustración conceptual de una fachada de Leñas y Sabores" /><figcaption>Ilustración referencial del local</figcaption></figure><div className="info-card local-information"><div className="info-section-title"><Icon name="pin" /><div><p className="info-eyebrow">Nuestra ubicación</p><h2>Carabayllo, Lima</h2></div></div><Suspense fallback={<p>Cargando mapa…</p>}><BusinessMap /></Suspense><p className="local-address"><strong>{business.address}</strong><br />{business.reference}</p><ContactDetails /><SocialLinks onAction={onAction} /></div></section></div></main><InformationNavigation active="Locales" onAction={onAction} /></>;
}
