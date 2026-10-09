import { useState } from 'react';
import { Icon } from '../../components/Icon';
import { updateAccount, useAccount } from './accountStore';
import { paymentNames, type PaymentMethod } from '../checkout/useCheckout';
const methods: { id: PaymentMethod; image?: string }[] = [{ id: 'card' }, { id: 'yape', image: '/images/checkout/yape.webp' }, { id: 'plin', image: '/images/checkout/plin.webp' }, { id: 'cash' }];
export function AccountPayments() {
  const account = useAccount();
  const [selected, setSelected] = useState(account.preferredPayment);
  const [saved, setSaved] = useState(false);
  return <section className="info-card account-payment"><h2>Tu método preferido</h2><p>Selecciona cómo prefieres pagar. Podrás cambiarlo en cada pedido.</p><fieldset><legend>Método de pago</legend><div className="account-payment-options">{methods.map(method => <label key={method.id} className={selected === method.id ? 'selected' : ''}><input type="radio" name="payment" value={method.id} checked={selected === method.id} onChange={() => { setSelected(method.id); setSaved(false); }} />{method.image ? <img src={method.image} alt="" /> : <Icon name={method.id === 'card' ? 'card' : 'cash'} />}<strong>{paymentNames[method.id]}</strong></label>)}</div></fieldset><div className="account-payment-safety"><Icon name="shield" /><p>Esta vista guarda únicamente tu preferencia en la pestaña. No solicita ni almacena números de tarjeta, CVV o códigos de pago.</p></div><button type="button" className="primary-button" disabled={!selected} onClick={() => { updateAccount({ preferredPayment: selected }); setSaved(true); }}>Guardar preferencia</button>{saved && <p role="status" className="account-success">Preferencia guardada para tus pedidos de demostración.</p>}</section>;
}
