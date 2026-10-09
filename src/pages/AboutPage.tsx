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
  </main><InformationNavigation active="Nosotros" onAction={onAction} /></>;
}
