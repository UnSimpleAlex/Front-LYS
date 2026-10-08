import { useEffect, useRef, useState } from 'react';
import { Icon, type IconName } from '../../components/Icon';
import { categories } from './catalog';

const tabs = [{ id: 'todos', name: 'Todos', icon: 'grid' }, ...categories];

export function CartaCategories({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const track = useRef<HTMLElement>(null);
  const [edges, setEdges] = useState({ overflow: false, left: false, right: false });
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => setEdges({ overflow: element.scrollWidth > element.clientWidth + 2, left: element.scrollLeft > 2, right: element.scrollLeft + element.clientWidth < element.scrollWidth - 2 });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener('scroll', update, { passive: true });
    update();
    return () => { observer.disconnect(); element.removeEventListener('scroll', update); };
  }, []);
  function scroll(direction: number) {
    const element = track.current;
    if (element) element.scrollBy({ left: direction * element.clientWidth * .75, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  return <div className="carta-category-navigation" data-overflow={edges.overflow}>
    <button type="button" className="category-scroll category-scroll-left" aria-label="Ver categorías anteriores" aria-controls="carta-categories" disabled={!edges.left} onClick={() => scroll(-1)}><Icon name="chevron" /></button>
    <nav ref={track} id="carta-categories" className="carta-categories" aria-label="Categorías de la carta">{tabs.map(tab => <button type="button" key={tab.id} aria-pressed={value === tab.id} onClick={() => onChange(tab.id)}>
      <Icon name={tab.icon as IconName} /><img className="category-image" src={`/images/carta/categories/${tab.id === 'todos' ? 'pollo' : tab.id}.webp`} alt="" width="80" height="64" /><span>{tab.name}</span>
    </button>)}</nav>
    <button type="button" className="category-scroll category-scroll-right" aria-label="Ver siguientes categorías" aria-controls="carta-categories" disabled={!edges.right} onClick={() => scroll(1)}><Icon name="chevron" /></button>
  </div>;
}
