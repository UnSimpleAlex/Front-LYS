import { useState } from 'react';
import { Icon } from '../components/Icon';
import { InformationNavigation } from '../features/information/InformationShared';
import { business } from '../features/information/business';
import '../styles/locations-reference.css';

const photos = [
  { src: '/images/information/local-selected-exterior.png', alt: 'Vista exterior referencial de Leñas y Sabores' },
  { src: '/images/information/local-selected-dining.png', alt: 'Vista interior referencial del salón y las parrillas' },
  { src: '/images/information/local-selected-window.png', alt: 'Vista interior referencial de las mesas junto a las ventanas' },
];
const googleMaps = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(`${business.name}, ${business.address}, ${business.reference}, ${business.district}`);

export function LocationsPage({ onAction }: { onAction: (action: string) => void }) {
  const [selected, setSelected] = useState(0);
  const move = (direction: number) => setSelected(current => (current + direction + photos.length) % photos.length);

  return <>
    <main id="contenido" className="information-page locations-page">
      <div className="info-container">
        <header className="local-visit-heading">
          <h1>Nuestro <span>local</span></h1>
          <p>Disfruta de nuestro auténtico sabor en un ambiente acogedor.</p>
        </header>
        <section className="local-visit-layout" aria-label="Conoce nuestro local">
          <div className="local-gallery" role="region" aria-roledescription="carrusel" aria-label="Imágenes del local" onKeyDown={event => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault();
              move(event.key === 'ArrowLeft' ? -1 : 1);
            }
          }}>
            <div className="local-gallery-frame">
              <img src={photos[selected].src} alt={photos[selected].alt} width="1672" height="941" />
              <button className="local-gallery-arrow local-gallery-previous" aria-label="Imagen anterior" onClick={() => move(-1)}><Icon name="chevron" /></button>
              <button className="local-gallery-arrow local-gallery-next" aria-label="Imagen siguiente" onClick={() => move(1)}><Icon name="chevron" /></button>
            </div>
            <div className="local-gallery-dots" aria-label="Seleccionar imagen">
              {photos.map((photo, index) => <button key={photo.src} aria-label={`Ver imagen ${index + 1}`} aria-current={selected === index ? 'true' : undefined} onClick={() => setSelected(index)}><span /></button>)}
            </div>
            <p className="local-gallery-caption" aria-live="polite">Imagen {selected + 1} de 3 · Ilustraciones referenciales del local</p>
          </div>
          <aside className="local-visit-panel" aria-label="Información para visitarnos">
            <div className="local-visit-detail"><span className="local-visit-icon"><Icon name="pin" /></span><div><h2>Nuestra ubicación</h2><p>{business.address}<br />{business.reference}<br />{business.district}</p></div></div>
            <div className="local-visit-detail"><span className="local-visit-icon"><Icon name="clock" /></span><div><h2>Horario de atención</h2><p>{business.hours}</p></div></div>
            <div className="local-visit-detail"><span className="local-visit-icon"><Icon name="phone" /></span><div><h2>Contáctanos</h2><a href="tel:+51947540597">+51 {business.phone}</a></div></div>
            <a className="local-maps-button" href={googleMaps} target="_blank" rel="noopener noreferrer"><Icon name="pin" /><span>Ver en Google Maps</span><Icon name="arrow" /></a>
          </aside>
        </section>
      </div>
    </main>
    <InformationNavigation active="Locales" onAction={onAction} />
  </>;
}
