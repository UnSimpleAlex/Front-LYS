import { lazy, Suspense, useState } from 'react';
import { Icon } from '../components/Icon';
import { SocialIcon } from '../components/SocialIcon';
import { business } from '../features/information/business';
import { InformationNavigation } from '../features/information/InformationShared';
import '../styles/contact-reference.css';
const BusinessMap = lazy(() => import('../features/information/BusinessMap').then(module => ({ default: module.BusinessMap })));

function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a9 9 0 0 1-13.4 8L3 21l1.5-4.6A9 9 0 1 1 21 11.5Z"/><path d="m8 7 1 3-1 1c1 2 2 3 4 4l1-1 3 1c0 3-3 3-6 1s-5-6-4-8l2-1Z"/></svg>;
}
export function ContactPage({ onAction }: { onAction: (action: string) => void }) {
  const [message, setMessage] = useState('');
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState('');
  const maps = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(`${business.name}, ${business.address}, ${business.reference}, ${business.district}`);
  const channels = [
    { icon: 'phone' as const, title: 'Teléfono / WhatsApp', text: `+51 ${business.phone}`, detail: 'Atención rápida para tus pedidos', href: business.whatsapp },
    { icon: 'mail' as const, title: 'Correo electrónico', text: business.email, detail: 'Te respondemos lo antes posible', href: `mailto:${business.email}` },
    { icon: 'clock' as const, title: 'Horario de atención', text: business.hours, detail: 'Todos los días', href: '#contact-location' },
    { icon: 'pin' as const, title: 'Nuestra ubicación', text: business.address, detail: `${business.reference}\n${business.district}`, href: maps },
  ];
  return <>
    <main id="contenido" className="information-page contact-page contact-reference">
      <header className="contact-banner">
        <div className="contact-banner-inner">
          <div><p>CONTACTO</p><h1>Conecta <span>con nosotros</span></h1></div>
        </div>
      </header>
      <div className="info-container contact-reference-grid">
        <section className="contact-reference-card contact-channels" aria-labelledby="contact-channels-title">
          <h2 id="contact-channels-title">Canales de <em>contacto</em></h2>
          <p>Elige el medio que más te convenga. Estamos listos para atenderte.</p>
          <div className="contact-channel-list">{channels.map(channel => <a key={channel.icon} className="contact-channel" href={channel.href} target={channel.href.startsWith('https') ? '_blank' : undefined} rel={channel.href.startsWith('https') ? 'noopener noreferrer' : undefined}>
            <span className="contact-red-icon"><Icon name={channel.icon}/></span><div><h3>{channel.title}</h3><strong>{channel.text}</strong><p>{channel.detail}</p></div><Icon name="chevron"/>
          </a>)}</div>
        </section>
        <section className="contact-reference-card contact-message" aria-labelledby="contact-message-title">
          <h2 id="contact-message-title">Envíanos un <em>mensaje</em></h2>
          <p>Completa el formulario y te responderemos a la brevedad. También puedes usar nuestros otros canales de contacto.</p>
          <form onChange={() => setReady(false)} onSubmit={event => {
            event.preventDefault(); const data = new FormData(event.currentTarget);
            setDraft(`${data.get('subject')}\n\n${message}\n\n${data.get('name')}\nTeléfono: ${data.get('phone')}\nCorreo: ${data.get('email')}`); setReady(true);
          }}>
            <div className="contact-fields">
              <label><span className="sr-only">Nombre completo *</span><Icon name="user"/><input name="name" autoComplete="name" required minLength={3} maxLength={100} placeholder="Nombre completo *"/></label>
              <label><span className="sr-only">Correo electrónico *</span><Icon name="mail"/><input name="email" type="email" autoComplete="email" required maxLength={120} placeholder="Correo electrónico *"/></label>
              <label><span className="sr-only">Teléfono *</span><Icon name="phone"/><input name="phone" type="tel" autoComplete="tel" required pattern="[+0-9 ()-]{7,20}" maxLength={20} placeholder="Teléfono *"/></label>
              <label><span className="sr-only">Asunto *</span><Icon name="receipt"/><select name="subject" required defaultValue=""><option value="" disabled>Asunto *</option>{['Consulta sobre un pedido', 'Eventos y reservas', 'Sugerencia', 'Otro'].map(subject => <option key={subject}>{subject}</option>)}</select></label>
            </div>
            <label className="contact-message-field"><span className="sr-only">Mensaje *</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M21 11a9 9 0 0 1-12 9l-6 2 2-6A9 9 0 1 1 21 11Z"/><path d="M8 11h1m2 0h1m2 0h1"/></svg><textarea required minLength={10} maxLength={500} rows={5} value={message} onChange={event => setMessage(event.target.value)} placeholder="Escribe tu mensaje aquí… *"/><span className="contact-message-counter">{message.length}/500</span></label>
            <button type="submit" className="contact-send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="m2 10 20-8-8 20-4-8-8-4Zm8 4L22 2"/></svg>Enviar mensaje <Icon name="arrow"/></button>
            <p className="contact-privacy"><Icon name="lock"/>Tu información se usará para responder tu consulta. Elige correo o WhatsApp para confirmar el envío.</p>
            {ready && <div className="info-prepared" role="status"><strong>Tu mensaje está listo para enviar.</strong><p>Elige una opción y confirma el envío en tu aplicación.</p><a className="info-button" href={`mailto:${business.email}?subject=${encodeURIComponent('Consulta Leñas y Sabores')}&body=${encodeURIComponent(draft)}`}>Abrir correo <Icon name="mail"/></a><a className="info-button" href={`${business.whatsapp}?text=${encodeURIComponent(draft)}`} target="_blank" rel="noopener noreferrer">Abrir WhatsApp <WhatsAppIcon/></a><button type="button" className="contact-edit" onClick={() => setReady(false)}>Editar mensaje</button></div>}
          </form>
        </section>
        <div className="contact-reference-side">
          <section id="contact-location" className="contact-reference-card contact-location" aria-labelledby="contact-location-title">
            <h2 id="contact-location-title">Nuestra <em>ubicación</em></h2><p>Visítanos y disfruta de la mejor experiencia en pollos y parrillas.</p>
            <Suspense fallback={<p>Cargando mapa…</p>}><BusinessMap/></Suspense>
            <a className="contact-maps-link" href={maps} target="_blank" rel="noopener noreferrer"><Icon name="pin"/>Ver en Google Maps <Icon name="arrow"/></a>
          </section>
          <section className="contact-reference-card contact-quick" aria-labelledby="contact-quick-title">
            <h2 id="contact-quick-title">Contacto <em>rápido</em></h2><p>También puedes comunicarte con nosotros directamente:</p>
            <div className="contact-quick-links">
              <a href={business.whatsapp} target="_blank" rel="noopener noreferrer"><span className="contact-quick-whatsapp"><WhatsAppIcon/></span><strong>WhatsApp</strong><small>Chat directo</small></a>
              <a href="tel:+51947540597"><span><Icon name="phone"/></span><strong>Llamar</strong><small>{business.phone}</small></a>
              <a href={`mailto:${business.email}`}><span><Icon name="mail"/></span><strong>Correo</strong><small>Enviar email</small></a>
              <button type="button" onClick={() => onAction('Instagram')}><span className="contact-quick-instagram"><SocialIcon name="Instagram"/></span><strong>Instagram</strong><small>Síguenos</small></button>
            </div>
          </section>
        </div>
      </div>
    </main>
    <InformationNavigation active="Contacto" onAction={onAction}/>
  </>;
}
