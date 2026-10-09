import { Icon } from '../components/Icon';
import '../styles/about-principles.css';
import { InformationNavigation } from '../features/information/InformationShared';

export function AboutPage({ onAction }: { onAction: (action: string) => void }) {
  return <><main id="contenido" className="information-page about-page">
    <section className="about-brand-hero info-container" aria-labelledby="about-brand-title">
      <div className="about-brand-copy"><p className="info-eyebrow">Nuestra historia</p>
        <h1 id="about-brand-title">Más que una pollería,<span>somos tradición</span></h1>
        <p>En Leñas y Sabores nacimos con una pasión: compartir el auténtico sabor del pollo a la leña y nuestras parrillas, en un ambiente cálido, familiar y con el mejor servicio.</p>
        <p>Cada plato que servimos refleja nuestro compromiso con la calidad, la buena comida y las reuniones que unen a las personas.</p>
      </div>
      <img className="about-brand-image" src="/images/information/about-restaurant-selected.png" width="1774" height="887" alt="Pollo a la leña con papas y cremas frente al interior de Leñas y Sabores" fetchPriority="high" />
    </section>
    <section className="about-principles" aria-labelledby="about-principles-title">
      <div className="info-container">
        <div className="about-principles-divider" aria-hidden="true"><Icon name="flame" /></div>
        <h2 id="about-principles-title">Misión, Visión y <span>Valores</span></h2>
        <div className="about-principles-grid">
          <article className="about-principle-card">
            <span className="about-principle-icon"><Icon name="target" /></span>
            <h3>Misión</h3><p>Brindar sabor, calidad<br />y calidez en cada visita.</p>
            <div className="about-principle-decoration" aria-hidden="true"><svg viewBox="0 0 180 45" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m5 40 38-19 15 5L89 4l31 23 13-6 42 19M58 26l31-22-7 16 9-6 10 13M24 36l22-8 8 4m69 0 11-6 22 10" /></svg></div>
          </article>
          <article className="about-principle-card">
            <span className="about-principle-icon"><Icon name="eye" /></span>
            <h3>Visión</h3><p>Ser la pollería favorita<br />de las familias de la región.</p>
            <div className="about-principle-decoration about-principles-divider" aria-hidden="true"><Icon name="flame" /></div>
          </article>
          <article className="about-principle-card">
            <span className="about-principle-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d="M3 8 7 3h10l4 5-9 14ZM3 8h18M7 3l5 19 5-19M7 8l5-5 5 5" /></svg></span>
            <h3>Valores</h3><ul className="about-principle-values"><li>Calidad</li><li>Cercanía</li><li>Honestidad</li><li>Pasión</li></ul>
            <div className="about-principle-decoration about-principles-divider about-principle-cutlery" aria-hidden="true"><Icon name="cutlery" /></div>
          </article>
        </div>
      </div>
    </section>
  </main><InformationNavigation active="Nosotros" onAction={onAction} /></>;
}
