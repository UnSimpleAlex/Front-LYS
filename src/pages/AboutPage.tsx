import { Icon } from '../components/Icon';
import { InformationNavigation } from '../features/information/InformationShared';
const milestones = [
  { title: 'El inicio en Carabayllo', description: 'Todo comenzó en nuestro barrio, con un gran sueño familiar.', image: 'story-origin' },
  { title: 'La receta familiar', description: 'Sabores que pasan de generación en generación.', image: 'story-recipe' },
  { title: 'Un punto de encuentro del barrio', description: 'Donde las familias y amigos siempre se reúnen.', image: 'story-family' },
  { title: 'Hoy seguimos creciendo', description: 'Con la misma pasión, llevando nuestro sabor cada vez más lejos.', image: 'story-carabayllo' },
];
export function AboutPage({ onAction }: { onAction: (action: string) => void }) {
  return <><main id="contenido" className="information-page about-page">
    <section className="about-brand-hero info-container" aria-labelledby="about-brand-title">
      <div className="about-brand-copy"><p className="info-eyebrow">Nuestra historia</p>
        <h1 id="about-brand-title">Más que una pollería,<span>somos tradición</span></h1>
        <p>En Leñas y Sabores nacimos con una pasión: compartir el auténtico sabor del pollo a la leña y nuestras parrillas, en un ambiente cálido, familiar y con el mejor servicio.</p>
        <p>Cada plato que servimos refleja nuestro compromiso con la calidad, la buena comida y las reuniones que unen a las personas.</p>
        <button className="primary-button" type="button" onClick={() => { const history = document.getElementById('historia-nosotros'); history?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); history?.focus({ preventScroll: true }); }}><Icon name="flame" />Conoce nuestra historia<Icon name="arrow" /></button>
      </div>
      <img className="about-brand-image" src="/images/information/about-restaurant-hero.webp" width="1536" height="1024" alt="Composición ilustrada de pollo a la leña con papas y cremas frente a un restaurante" fetchPriority="high" />
    </section>
    <section className="about-history"><div className="info-container">
      <ol className="about-timeline" id="historia-nosotros" tabIndex={-1} aria-label="Nuestra historia">{milestones.map((item, index) => <li key={item.title}><div className="about-milestone-image"><img src={`/images/information/${item.image}.webp`} width="600" height="600" alt="" loading="lazy" /><span>{index + 1}</span></div><div><h3>{item.title}</h3><p>{item.description}</p></div></li>)}</ol>
    </div></section>
    <section className="about-essence"><div className="info-container"><p className="info-eyebrow">Nuestra esencia</p><h2>Lo que nos guía <span>cada día</span></h2><p>Nuestra misión, visión y valores reflejan el compromiso con Carabayllo, nuestras familias y el auténtico sabor a la brasa.</p>
      <div className="about-values"><article className="info-card"><span className="info-icon-circle"><Icon name="target" /></span><div><h3>Misión</h3><p>Brindar una experiencia gastronómica cálida, con auténtico sabor a la brasa, ingredientes de calidad y un servicio cercano para cada familia.</p></div></article><article className="info-card"><span className="info-icon-circle"><Icon name="eye" /></span><div><h3>Visión</h3><p>Ser una pollería referente en Carabayllo y Lima Norte, reconocida por su sabor, calidad y cercanía.</p></div></article><article className="info-card"><span className="info-icon-circle"><Icon name="heart" /></span><div><h3>Valores</h3><ul>{['Calidad', 'Compromiso', 'Trabajo en equipo', 'Pasión por servir'].map(value => <li key={value}><Icon name="check" />{value}</li>)}</ul></div></article></div>
    </div></section>
  </main><InformationNavigation active="Nosotros" onAction={onAction} /></>;
}
