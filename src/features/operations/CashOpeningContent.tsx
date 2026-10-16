import { Icon } from "./OperationsVisuals";
import { money } from "./operationsStore";
import { CashDenominations } from "./CashDenominationCounter";

type Props = {
  denominations: readonly (readonly [number, string])[];
  counts: number[];
  sum: number;
  amount: string;
  notes: string;
  verified: boolean;
  verificationError: boolean;
  onCount: (index: number, value: number) => void;
  onAmount: (value: string) => void;
  onCalculate: () => void;
  onNotes: (value: string) => void;
  onVerified: (value: boolean) => void;
};

export function CashOpeningContent(props: Props) {
  const { denominations, counts, sum, amount, notes, verified } = props;
  const bills = counts.reduce((total, count, i) => total + (denominations[i][0] >= 10 ? count : 0), 0);
  const coins = counts.reduce((total, count, i) => total + (denominations[i][0] < 10 ? count : 0), 0);
  return <>
    <section className="cash-opening-count">
      <div className="cash-opening-section-heading">
        <h2><Icon name="cash" />Fondo inicial en efectivo</h2>
        <button type="button" className="ops-outline" onClick={props.onCalculate}><Icon name="coins" />Calcular automáticamente</button>
      </div>
      <p>Ingresa la cantidad de billetes y monedas que conforman el fondo inicial de la caja.</p>
      <CashDenominations counts={counts} onCount={props.onCount} />
    </section>
    <aside className="cash-opening-summary">
      <section>
        <h2><Icon name="coins" />Resumen del fondo inicial</h2>
        <div className="cash-opening-highlight"><Icon name="cash" /><div><span>Total en efectivo</span><strong>{money(Number(amount))}</strong></div></div>
        <dl><div><dt>Total de billetes</dt><dd>{bills}</dd></div><div><dt>Total de monedas</dt><dd>{coins}</dd></div><div><dt>Valor total contado</dt><dd>{money(sum)}</dd></div></dl>
        <label className="cash-opening-manual">Total fondo inicial
          <input aria-label="Fondo inicial (S/)" type="number" min="0" step="0.01" value={amount} required onChange={e => props.onAmount(e.target.value)} />
        </label>
        {sum > 0 && Math.abs(sum - Number(amount)) > 0.001 && <p role="alert" className="cash-opening-error">El desglose debe coincidir con el fondo inicial.</p>}
      </section>
      <section className="cash-opening-guidance">
        <h2><Icon name="info" />Indicaciones</h2>
        <ul><li>Verifica y cuenta el dinero físico antes de registrarlo.</li><li>Ingresa la cantidad exacta de cada denominación.</li><li>El fondo inicial será el saldo de inicio para registrar los movimientos del turno.</li><li>Una vez confirmada la apertura, podrás realizar cobros y emitir comprobantes.</li></ul>
        <label>Observaciones (opcional)<textarea maxLength={300} value={notes} onChange={e => props.onNotes(e.target.value)} placeholder="Notas sobre el fondo inicial…" /></label>
        <label className="ops-check"><input type="checkbox" checked={verified} aria-describedby="cash-opening-verification" aria-invalid={props.verificationError || undefined} onChange={e => props.onVerified(e.target.checked)} />He verificado el efectivo disponible.</label>
        <p id="cash-opening-verification" className={props.verificationError ? "cash-opening-error" : "cash-opening-help"} role={props.verificationError ? "alert" : undefined}>{props.verificationError ? "Marca la casilla para confirmar el efectivo y abrir caja." : "Confirma la verificación del efectivo antes de abrir caja."}</p>
      </section>
    </aside>
  </>;
}
