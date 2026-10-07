import { useState } from 'react';
import { Icon } from '../../components/Icon';
import '../../styles/membership.css';

const ranks = [
  { name: 'Chispa', key: 'chispa', phrase: 'Aquí empieza tu historia.', description: 'El primer paso de una tradición que crece contigo.' },
  { name: 'Brasa', key: 'brasa', phrase: 'Ya eres de la casa.', description: 'Cada nuevo pedido aviva tu lugar en el círculo.' },
  { name: 'Fuego', key: 'fuego', phrase: 'Llevas el sabor por dentro.', description: 'El rango para quienes hacen de volver toda una tradición.' },
];

export function HomeMembership({ onAction }: { onAction: (section: string) => void }) {
  const [selected, setSelected] = useState(1);
  const rank = ranks[selected];
  return <section className="home-membership" aria-labelledby="membership-title">
    <div className="home-container membership-inner">
      <div className="membership-copy">
        <h2 id="membership-title">Círculo de la Brasa<span className="home-script">Volver tiene su recompensa.</span></h2>
        <p>Tus pedidos cuentan una historia. Afíliate, sube de rango y haz que cada visita encienda algo más.</p>
        <button className="home-button membership-join" type="button" onClick={() => onAction('Afiliarme')}>Quiero ser parte <Icon name="arrow" /><span className="order-glare" aria-hidden="true" /></button>
        <span className="membership-coming">Membresía próximamente. Empieza creando tu cuenta.</span>
      </div>
      <div className="membership-showcase">
        <div className={`membership-pass pass-${rank.key}`} aria-label={`Vista de la credencial del rango ${rank.name}`}>
          <img src="/images/logo.webp" alt="Leñas y Sabores" width="2048" height="682" loading="lazy" />
          <span className="pass-circle" aria-hidden="true"><Icon name="flame" /></span>
          <div className="pass-rank"><span>CÍRCULO DE LA BRASA</span><strong>{rank.name}</strong></div>
          <div className="pass-bottom"><span>EL SABOR NOS UNE</span><span>LEÑAS & SABORES</span></div>
        </div>
        <span className="membership-signature home-script">Tu lugar está en nuestra mesa.</span>
      </div>
      <div className="membership-journey">
        <div className="membership-steps" role="group" aria-label="Explora los rangos de la membresía">
          {ranks.map((item, index) => <button key={item.key} type="button" aria-pressed={selected === index} aria-controls="membership-rank-detail" onClick={() => setSelected(index)}><span className="rank-number">0{index + 1}</span><span>{item.name}</span><Icon name={index === 2 ? 'star' : 'flame'} /></button>)}
        </div>
        <div id="membership-rank-detail" className="membership-rank-detail" aria-live="polite"><strong>{rank.phrase}</strong><p>{rank.description}</p></div>
        <p className="membership-explainer">Más pedidos, más cerca del siguiente rango.<br /><span>Conoce un adelanto de tu próxima membresía.</span></p>
      </div>
    </div>
  </section>;
}
