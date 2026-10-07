import { useState, useRef, useEffect } from 'react';
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
  const easing = [.22, 1, .36, 1] as const;
  useEffect(() => {
    const size = window.innerWidth * window.devicePixelRatio > 1080 ? '2172' : '1080';
    const sources = [window.matchMedia('(max-width: 650px)').matches ? 'hero-mobile' : `hero-${size}`, `hero-compartir-${size}`, 'parrillas-1080', 'title', 'title-compartir'];
    sources.forEach(source => {
      const image = new Image();
      image.src = `/images/home/${source}.webp`;
      void image.decode().catch(() => {});
    });
  }, []);
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
    <svg className="sr-only" aria-hidden="true" focusable="false">
      <defs>
        <filter id="sharing-title-red" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.844 0 0 0 0  0 0.5 0 0 0  0 0 0 0 0  0 0 0 1 0" />
        </filter>
      </defs>
    </svg>
    {/* .999 conserva el fondo saliente durante el fundido sin que Motion lo retire inmediatamente. */}
    <AnimatePresence initial={false}>
      <motion.picture key={slide.image} className={`home-hero-picture slide-${slide.image}`} initial={{ opacity: 0, zIndex: 2 }} animate={{ opacity: 1, zIndex: 2 }} exit={{ opacity: .999, zIndex: 1 }} transition={{ duration: reduce ? 0 : .6, ease: easing }}>
        {current === 0 && <source media="(max-width: 650px)" srcSet="/images/home/hero-mobile.webp" />}
        <img src={`/images/home/${slide.image}-${current < 2 ? '2172' : '1080'}.webp`} srcSet={current < 2 ? `/images/home/${slide.image}-1080.webp 1080w, /images/home/${slide.image}-2172.webp 2172w` : undefined} sizes="100vw" alt={slide.alt} width={current < 2 ? 2172 : 1080} height={current === 0 ? 724 : current === 1 ? 543 : 432} fetchPriority="high" />
      </motion.picture>
    </AnimatePresence>
    <div className="home-hero-inner home-container">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={current} className="home-hero-copy" initial={{ opacity: 0, y: reduce ? 0 : 12 }} animate={{ opacity: 1, y: 0, transition: { duration: reduce ? 0 : .45, ease: easing } }} exit={{ opacity: 0, y: reduce ? 0 : -4, transition: { duration: reduce ? 0 : .15 } }}>
          <h1>{current < 2 ? <><span className="sr-only">{slide.first} {slide.second}</span><img className="home-hero-title" src={current === 0 ? '/images/home/title.webp' : '/images/home/title-compartir.webp'} alt="" width="1400" height={current === 0 ? 519 : 468} /></> : <><span>{slide.first}</span><span className="home-brush-accent">{slide.second}</span></>}</h1>
          <p>{slide.description}</p>
        </motion.div>
      </AnimatePresence>
      <motion.div key={`actions-${current}`} className="home-hero-actions" initial={{ opacity: 0, y: reduce ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : .4, delay: reduce ? 0 : .16, ease: easing }}>
        <motion.button type="button" className="home-button" whileHover={{ scale: 1.015 }} whileTap={{ scale: .98 }} onClick={() => onAction('Pedir ahora')}><span className="order-glare" aria-hidden="true" /><Icon name="truck" />Pedir ahora<Icon name="arrow" /></motion.button>
        <motion.button type="button" className="home-button home-button-outline" whileHover={{ scale: 1.015 }} whileTap={{ scale: .98 }} onClick={() => onAction('Carta')}><Icon name="cutlery" />{current === 1 ? 'Descubre combos' : 'Ver carta'}</motion.button>
      </motion.div>
    </div>
    <button className="carousel-arrow previous" type="button" aria-label="Diapositiva anterior" onClick={() => move(-1)}><Icon name="arrow" /></button>
    <button className="carousel-arrow next" type="button" aria-label="Diapositiva siguiente" onClick={() => move(1)}><Icon name="arrow" /></button>
    <div className="carousel-dots" aria-label="Elegir diapositiva">{slides.map((item, index) => <button type="button" key={item.image} aria-label={`Ver diapositiva ${index + 1}`} aria-pressed={current === index} onClick={() => setCurrent(index)}><span /></button>)}</div>
    <p className="sr-only" role="status" aria-live="polite">Diapositiva {current + 1} de {slides.length}: {slide.first} {slide.second}</p>
  </section>;
}
