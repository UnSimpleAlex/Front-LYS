import { useState, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Icon } from '../../components/Icon';

const slides = [
  { first: 'Sabor peruano', second: 'en cada brasa', description: 'Auténtico pollo a la brasa, con el sabor de nuestra tierra y la tradición de siempre.', image: 'hero', alt: 'Pollo a la brasa con papas, ensalada, cremas e Inca Kola' },
  { first: 'Comparte el fuego', second: 'de nuestra cocina', description: 'Crujiente por fuera, jugoso por dentro y listo para disfrutar en cada momento.', image: 'hero-compartir', alt: 'Parrilla para compartir con papas, ensalada, cremas e Inca Kola' },
  { first: 'Sabor a la leña', second: 'en cada parrilla', description: 'Carnes con el auténtico sabor a la leña.', image: 'parrillas', alt: 'Parrilla con papas doradas y tomates' },
];
export function HomeHero({ onAction }: { onAction: (section: string) => void }) {
  const [current, setCurrent] = useState(0);
  const startX = useRef<number | null>(null);
  const reduce = useReducedMotion();
  const slide = slides[current];
  function move(delta: number) { setCurrent(index => (index + delta + slides.length) % slides.length); }
  return <section className={`home-hero${current === 1 ? ' home-hero-sharing' : ''}`} aria-roledescription="carrusel" aria-label="Sabores de nuestra cocina" onKeyDown={event => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowRight') move(1);
    if (event.key === 'ArrowLeft') move(-1);
  }} tabIndex={0} onTouchStart={event => { startX.current = event.touches[0].clientX; }} onTouchEnd={event => {
    if (startX.current === null) return;
    const distance = event.changedTouches[0].clientX - startX.current;
    if (Math.abs(distance) > 50) move(distance < 0 ? 1 : -1);
    startX.current = null;
  }}>
    <AnimatePresence initial={false}>
      <motion.picture key={slide.image} className={`home-hero-picture slide-${slide.image}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : .35 }}>
        {current === 0 && <source media="(max-width: 650px)" srcSet="/images/home/hero-mobile.webp" />}
        <img src={`/images/home/${slide.image}-${current < 2 ? '2172' : '1080'}.webp`} srcSet={current < 2 ? `/images/home/${slide.image}-1080.webp 1080w, /images/home/${slide.image}-2172.webp 2172w` : undefined} sizes="100vw" alt={slide.alt} width={current < 2 ? 2172 : 1080} height={current < 2 ? 724 : 432} fetchPriority="high" />
      </motion.picture>
    </AnimatePresence>
    <div className="home-hero-inner home-container">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={current} className="home-hero-copy" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: reduce ? 0 : .2 }}>
          <h1>{current === 0 ? <><span className="sr-only">Sabor peruano en cada brasa</span><img className="home-hero-title" src="/images/home/title.webp" alt="" width="1400" height="519" /></> : <><span>{slide.first}</span><span className="home-brush-accent">{slide.second}</span></>}</h1>
          <p>{slide.description}</p>
        </motion.div>
      </AnimatePresence>
      <div className="home-hero-actions">
        <motion.button type="button" className="home-button" whileHover={{ scale: 1.015 }} whileTap={{ scale: .98 }} onClick={() => onAction('Pedir ahora')}><span className="order-glare" aria-hidden="true" /><Icon name="truck" />Pedir ahora<Icon name="arrow" /></motion.button>
        <motion.button type="button" className="home-button home-button-outline" whileHover={{ scale: 1.015 }} whileTap={{ scale: .98 }} onClick={() => onAction('Carta')}><Icon name="cutlery" />{current === 1 ? 'Descubre combos' : 'Ver carta'}</motion.button>
      </div>
    </div>
    <button className="carousel-arrow previous" type="button" aria-label="Diapositiva anterior" onClick={() => move(-1)}><Icon name="arrow" /></button>
    <button className="carousel-arrow next" type="button" aria-label="Diapositiva siguiente" onClick={() => move(1)}><Icon name="arrow" /></button>
    <div className="carousel-dots" aria-label="Elegir diapositiva">{slides.map((item, index) => <button type="button" key={item.image} aria-label={`Ver diapositiva ${index + 1}`} aria-pressed={current === index} onClick={() => setCurrent(index)}><span /></button>)}</div>
    <p className="sr-only" role="status" aria-live="polite">Diapositiva {current + 1} de {slides.length}: {slide.first} {slide.second}</p>
  </section>;
}
