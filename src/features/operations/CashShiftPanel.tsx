import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import { currentUser } from "../../services/localAuth";
import { OperationsPageActions } from "./operationsPageContext";
import {
  useOperations,
  money,
  expectedCash,
  openShift,
  closeShift,
} from "./operationsStore";
import { Icon, PaymentMark } from "./OperationsVisuals";
import { Stats, Badge } from "./OperationsUI";
import { downloadCsv } from "./operationsFiles";

const denominations = [
  [200, "200"],
  [100, "100"],
  [50, "50"],
  [20, "20"],
  [10, "10"],
  [5, "coin-5-soles"],
  [2, "coin-2-soles"],
  [1, "coin-1-sol"],
  [0.5, "coin-50-centimos"],
  [0.2, "coin-20-centimos"],
  [0.1, "coin-10-centimos"],
] as const;
export function CashShiftPanel({
  closing,
  notify,
  navigate,
}: {
  closing: boolean;
  notify: (task: () => void) => void;
  navigate: (path: string) => void;
}) {
  const data = useOperations();
  const host = useContext(OperationsPageActions);
  const shift = data.shifts.find((s) => !s.closed);
  const [amount, setAmount] = useState("300");
  const [counts, setCounts] = useState<number[]>(denominations.map(() => 0));
  const [notes, setNotes] = useState("");
  const [verified, setVerified] = useState(false);
  const sum =
    counts.reduce(
      (total, count, i) =>
        total + Math.round(denominations[i][0] * 100) * count,
      0,
    ) / 100;
  const payments = data.payments.filter(
    (p) => p.shiftId === shift?.id && !p.refunded,
  );
  const cash = payments
    .filter((p) => p.method === "Efectivo")
    .reduce((s, p) => s + p.amount, 0);
  const expected = shift ? expectedCash(shift) : 0;
  const difference = Number(amount) - expected;
  const day = new Date().toLocaleDateString("es-PE");
  const cashier = shift?.user || currentUser()?.name || "Sin identificar";
  const exportSummary = () =>
    downloadCsv(
      "resumen-caja",
      ["Concepto", "Monto"],
      [
        ["Fondo inicial", shift?.initial || 0],
        ["Ingresos en efectivo", cash],
        ["Retiros", shift?.withdrawals || 0],
        ["Efectivo esperado", expected],
        ["Efectivo contado", amount],
        ["Diferencia", difference],
      ],
    );
  return (
    <div className={`anchor-shift ${closing ? "is-closing" : "is-opening"}`}>
      {host &&
        createPortal(
          <div className="ops-header-date-pill">
            <Icon name="calendar" />
            {day}
          </div>,
          host,
        )}
      <div className="anchor-shift-meta">
        {!closing && (
          <div>
            <Icon name="cash" />
            <span>
              Estado de caja
              <strong>{shift ? "Caja abierta" : "Caja cerrada"}</strong>
            </span>
            <Badge value={shift ? "Abierta" : "Cerrada"} />
          </div>
        )}
        <div>
          <Icon name="clock" />
          <span>
            Turno<strong>{data.settings.hours}</strong>
          </span>
        </div>
        <div>
          <Icon name="user" />
          <span>
            Cajera<strong>{cashier}</strong>
          </span>
        </div>
        <div>
          <Icon name="calendar" />
          <span>
            Fecha<strong>{day}</strong>
          </span>
        </div>
      </div>
      {closing && (
        <Stats
          entries={[
            {
              label: "Fondo inicial",
              value: money(shift?.initial || 0),
              icon: "cash",
              tone: "blue",
            },
            {
              label: "Ingresos en efectivo",
              value: money(cash),
              icon: "arrow",
              tone: "green",
            },
            {
              label: "Egresos en efectivo",
              value: money(shift?.withdrawals || 0),
              icon: "arrow",
              tone: "red",
            },
            {
              label: "Efectivo esperado",
              value: money(expected),
              icon: "coins",
              tone: "gold",
            },
          ]}
        />
      )}
      <form
        className="anchor-shift-form"
        onSubmit={(e) => {
          e.preventDefault();
          notify(() => {
            if (!closing && !verified)
              throw new Error("Verifica el efectivo disponible.");
            if (!closing && sum > 0 && Math.abs(sum - Number(amount)) > 0.001)
              throw new Error(
                "El desglose debe coincidir con el monto ingresado.",
              );
            if (closing) closeShift(Number(amount), notes);
            else openShift(Number(amount), notes);
            navigate("/caja");
          });
        }}
      >
        {closing ? (
          <div className="anchor-closing-grid">
            <section>
              <h2>Conteo de efectivo</h2>
              <div className="anchor-fields-two">
                <label>
                  Efectivo contado
                  <input
                    aria-label="Efectivo contado (S/)"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </label>
                <div className="anchor-difference">
                  <span>Diferencia</span>
                  <strong>{money(difference)}</strong>
                  <Badge
                    value={
                      Math.abs(difference) < 0.001 ? "Cuadrado" : "Diferencia"
                    }
                  />
                </div>
              </div>
            </section>
            <section>
              <h2>Resumen por método de pago</h2>
              {data.settings.methods.map((method) => (
                <div className="anchor-method-total" key={method}>
                  <PaymentMark name={method} />
                  <span>{method}</span>
                  <strong>
                    {money(
                      payments
                        .filter((p) => p.method === method)
                        .reduce((sum, p) => sum + p.amount, 0),
                    )}
                  </strong>
                </div>
              ))}
              <div className="anchor-method-total total">
                <span>Total de ventas</span>
                <strong>
                  {money(payments.reduce((sum, p) => sum + p.amount, 0))}
                </strong>
              </div>
            </section>
            <section>
              <h2>Detalle de movimientos en efectivo</h2>
              <table className="anchor-cash-movements">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {shift && (
                    <tr>
                      <td>
                        {new Date(shift.opened).toLocaleTimeString("es-PE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>
                        <Badge value="Apertura" />
                      </td>
                      <td>Fondo inicial de caja</td>
                      <td>{money(shift.initial)}</td>
                    </tr>
                  )}
                  {payments
                    .filter((p) => p.method === "Efectivo")
                    .map((p) => (
                      <tr key={p.id}>
                        <td>
                          {new Date(p.date).toLocaleTimeString("es-PE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td>
                          <Badge value="Ingreso" />
                        </td>
                        <td>Pedido #{p.orderId}</td>
                        <td>{money(p.amount)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </section>
            <section>
              <label>
                Observaciones (opcional)
                <textarea
                  maxLength={300}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Sin observaciones. Caja cuadrada."
                />
              </label>
              <small>{notes.length}/300</small>
            </section>
          </div>
        ) : (
          <section>
            <h2>Fondo inicial en efectivo</h2>
            <p>
              Ingresa la cantidad de billetes y monedas que conforman el fondo
              inicial de la caja.
            </p>
            <div className="anchor-denominations">
              <div className="anchor-denomination-head">
                <span>Denominación</span>
                <span>Cantidad</span>
                <span>Subtotal</span>
              </div>
              {denominations.map(([value, image], i) => (
                <div className="anchor-denomination" key={image}>
                  <span>
                    <img
                      className="ops-banknote"
                      src={`/images/operations/currency/${image}.webp`}
                      alt=""
                    />
                    {value >= 1
                      ? `S/ ${value}`
                      : `${Math.round(value * 100)} céntimos`}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    aria-label={`Cantidad de denominación ${value}`}
                    value={counts[i]}
                    onChange={(e) => {
                      const next = counts.map((n, j) =>
                        j === i ? Number(e.target.value) : n,
                      );
                      setCounts(next);
                    }}
                  />
                  <strong>{money(counts[i] * value)}</strong>
                </div>
              ))}
            </div>
            <label className="anchor-opening-total">
              Total fondo inicial
              <input
                aria-label="Fondo inicial (S/)"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </label>
            <div className="ops-cash-total anchor-calculated-total">
              <span>Total calculado</span>
              <strong>{money(sum)}</strong>
              {sum > 0 && (
                <Badge
                  value={
                    Math.abs(sum - Number(amount)) < 0.001
                      ? "Coincide"
                      : "Revisar monto"
                  }
                />
              )}
            </div>
            <label>
              Observaciones (opcional)
              <textarea
                maxLength={300}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Notas adicionales sobre el fondo inicial de la caja…"
              />
            </label>
            <label className="ops-check">
              <input
                type="checkbox"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
              />
              He verificado el efectivo disponible.
            </label>
          </section>
        )}
        <footer>
          {closing ? (
            <button
              type="button"
              className="ops-outline"
              onClick={exportSummary}
            >
              <Icon name="download" />
              Exportar resumen
            </button>
          ) : (
            <button
              type="button"
              className="ops-outline"
              onClick={() => navigate("/caja")}
            >
              Cancelar
            </button>
          )}
          <button className="ops-primary" disabled={closing ? !shift : !!shift}>
            <Icon name={closing ? "lock" : "cash"} />
            {closing ? "Cerrar caja" : "Abrir caja"}
          </button>
        </footer>
      </form>
    </div>
  );
}
