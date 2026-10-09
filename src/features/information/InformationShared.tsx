import { BottomNavigation } from '../../components/BottomNavigation';
import { Icon } from '../../components/Icon';
import { business } from './business';
import '../../styles/carta.css';
import '../../styles/information.css';
export function PageHero({ eyebrow, title, accent, description }: { eyebrow: string; title: string; accent?: string; description: string }) {
  return <header className="info-hero"><div><p className="info-eyebrow">{eyebrow}</p><h1>{title} {accent && <span>{accent}</span>}</h1><p className="info-intro">{description}</p><span className="info-brush" aria-hidden="true" /></div></header>;
}
export function InformationNavigation({ active, onAction }: { active: string; onAction: (action: string) => void }) {
  return <BottomNavigation active={active} onAction={onAction} />;
}
export function ContactDetails() {
  return <div className="info-contact-grid"><a className="info-card info-contact-item" href="tel:+51947540597"><Icon name="phone" /><div><small>Teléfono / WhatsApp</small><strong>+51 {business.phone}</strong><p>Conversemos sobre tu pedido.</p></div></a><a className="info-card info-contact-item" href={`mailto:${business.email}`}><Icon name="mail" /><div><small>Correo electrónico</small><strong>{business.email}</strong><p>Será un gusto atenderte.</p></div></a><div className="info-card info-contact-item"><Icon name="pin" /><div><small>Dirección</small><strong>{business.address}</strong><p>{business.reference} · {business.district}</p></div></div><div className="info-card info-contact-item"><Icon name="clock" /><div><small>Horario de atención</small><strong>{business.hours}</strong><p>Te esperamos en Carabayllo.</p></div></div></div>;
}
export function WhatsAppCard() { return <a className="info-whatsapp" href={business.whatsapp} target="_blank" rel="noopener noreferrer"><span className="info-whatsapp-icon"><Icon name="phone" /></span><span>Escríbenos por<strong>WhatsApp</strong><small>Haz tu consulta o coordina tu pedido.</small></span><Icon name="arrow" /></a>; }
