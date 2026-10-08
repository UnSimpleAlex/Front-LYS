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
  const easing = [.25, .1, .25, 1] as const;
  useEffect(() => {
    const size = window.innerWidth * window.devicePixelRatio > 1080 ? '2172' : '1080';
    const mobile = window.matchMedia('(max-width: 650px)').matches;
    const tablet = window.matchMedia('(max-width: 1100px)').matches;
    const sources = [mobile ? 'hero-mobile' : `hero-${size}`, mobile ? 'hero-compartir-mobile' : tablet ? 'hero-compartir-tablet' : `hero-compartir-${size}`, 'parrillas-1080', 'title', 'title-compartir'];
    sources.forEach(source => {
      const image = new Image();
      image.src = `/images/home/${source}.webp`;
      void image.decode().catch(() => {});
    });
  }, []);
  function move(delta: number) { setCurrent(index => (index + delta + slides.length) % slides.length); }
  function select(index: number) { setCurrent(index); }
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
    <AnimatePresence initial={false}>
      <motion.picture key={slide.image} className={`home-hero-picture slide-${slide.image}`} initial={{ opacity: 0, scale: reduce ? 1 : 1.025, zIndex: 2 }} animate={{ opacity: 1, scale: 1, zIndex: 2 }} exit={{ opacity: .999, scale: 1, zIndex: 1 }} transition={{ duration: reduce ? 0 : .85, ease: easing }}>
        {current === 0 && <source media="(max-width: 650px)" srcSet="/images/home/hero-mobile.webp" />}
        {current === 1 && <source media="(max-width: 650px)" srcSet="/images/home/hero-compartir-mobile.webp" />}
        {current === 1 && <source media="(max-width: 1100px)" srcSet="/images/home/hero-compartir-tablet.webp" />}
        <img src={`/images/home/${slide.image}-${current < 2 ? '2172' : '1080'}.webp`} srcSet={current < 2 ? `/images/home/${slide.image}-1080.webp 1080w, /images/home/${slide.image}-2172.webp 2172w` : undefined} sizes="100vw" alt={slide.alt} width={current < 2 ? 2172 : 1080} height={current < 2 ? 724 : 432} fetchPriority="high" />
      </motion.picture>
    </AnimatePresence>
    <div className="home-hero-inner home-container">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={current} className="home-hero-copy" initial={{ opacity: 0, y: reduce ? 0 : 5 }} animate={{ opacity: 1, y: 0, transition: { duration: reduce ? 0 : .5, ease: easing } }} exit={{ opacity: 0, y: 0, transition: { duration: reduce ? 0 : .18 } }}>
          <h1>{current < 2 ? <><span className="sr-only">{slide.first} {slide.second}</span><img className="home-hero-title" src={current === 0 ? '/images/home/title.webp' : '/images/home/title-compartir.webp'} alt="" width="1400" height={current === 0 ? 519 : 468} /></> : <><span>{slide.first}</span><span className="home-brush-accent">{slide.second}</span></>}</h1>
          <p>{current === 0 ? <><span className="hero-description-line">Auténtico pollo a la brasa, con el sabor de nuestra tierra</span>{' '}<span className="hero-description-line">y la tradición de siempre.</span></> : current === 1 ? <><span className="hero-description-line">Crujiente por fuera, jugoso por dentro</span>{' '}<span className="hero-description-line">y listo para disfrutar en cada momento.</span></> : slide.description}</p>
        </motion.div>
      </AnimatePresence>
      <div className="home-hero-actions">
        <motion.button type="button" className="home-button" whileHover={{ scale: 1.015 }} whileTap={{ scale: .98 }} onClick={() => onAction('Pedir ahora')}><span className="order-glare" aria-hidden="true" /><Icon name="truck" />Pedir ahora<Icon name="arrow" /></motion.button>
        <motion.button type="button" className="home-button home-button-outline" whileHover={{ scale: 1.015 }} whileTap={{ scale: .98 }} onClick={() => onAction('Carta')}><Icon name="cutlery" />{current === 1 ? 'Descubre combos' : 'Ver carta'}</motion.button>
      </div>
    </div>
    <button className="carousel-arrow previous" type="button" aria-label="Diapositiva anterior" onClick={() => move(-1)}><Icon name="arrow" /></button>
    <button className="carousel-arrow next" type="button" aria-label="Diapositiva siguiente" onClick={() => move(1)}><Icon name="arrow" /></button>
    <div className="carousel-dots" aria-label="Elegir diapositiva">{slides.map((item, index) => <button type="button" key={item.image} aria-label={`Ver diapositiva ${index + 1}`} aria-pressed={current === index} onClick={() => select(index)}><span /></button>)}</div>
    <p className="sr-only" role="status" aria-live="polite">Diapositiva {current + 1} de {slides.length}: {slide.first} {slide.second}</p>
  </section>;
}
