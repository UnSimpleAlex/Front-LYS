import { HomeHero } from '../features/home/HomeHero';
import { HomeCatalog } from '../features/home/HomeCatalog';
import { HomeApp, ServiceBenefits } from '../features/home/HomeBenefits';
import { HomeFooter } from '../features/home/HomeFooter';

export function HomePage({ onAction }: { onAction: (section: string) => void }) {
  return <main id="contenido" className="home-page"><HomeHero onAction={onAction} /><ServiceBenefits /><HomeCatalog onAction={onAction} /><HomeApp onAction={onAction} /><HomeFooter onAction={onAction} /></main>;
}
