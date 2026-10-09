import {
  Icon,
  ProductSummary,
  UserSummary,
  PaymentMark,
} from "./OperationsVisuals";
import { dateText, downloadCsv, printLocal } from "./operationsFiles";
import { useState } from "react";
import {
  useOperations,
  money,
  orderTotal,
  paymentMethods,
  processPayment,
  openShift,
  closeShift,
  expectedCash,
  issueVoucher,
  refundPayment,
  type Order,
} from "./operationsStore";
import {
  Panel,
  Stats,
  Tabs,
  Badge,
  Empty,
  Donut,
  OrderDetail,
} from "./OperationsUI";
export function CashViews({
  section,
  notify,
  navigate,
}: {
  section: string;
  notify: (task: () => void) => void;
  navigate: (path: string) => void;
}) {
  const [bills, setBills] = useState([0, 0, 0, 0, 0, 0]);
  const denomination = [200, 100, 50, 20, 10, 1];
  const billTotal = bills.reduce(
    (sum, count, i) => sum + count * denomination[i],
    0,
  );
  const data = useOperations();
  const [selected, setSelected] = useState("");
  const [pendingLimit, setPendingLimit] = useState(8);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [method, setMethod] = useState("Efectivo");
  const [received, setReceived] = useState("");
  const [amount, setAmount] = useState("300");
  const [notes, setNotes] = useState("");
  const [verified, setVerified] = useState(false);
  const [voucherType, setVoucherType] = useState("Boleta");
  const [document, setDocument] = useState("");
  const [customer, setCustomer] = useState("");
  const [detail, setDetail] = useState<Order | null>(null);
  const shift = data.shifts.find((s) => !s.closed);
  const payments = data.payments.filter((p) => !p.refunded);
  const pending = data.orders.filter(
    (o) => !o.paid && !o.draft && o.status !== "Cancelado",
  );
  const order = data.orders.find((o) => o.id === selected) || pending[0];
  const paidOrder =
    data.orders.find((o) => o.id === selected && o.paid) ||
    data.orders.find(
      (o) => o.paid && !data.vouchers.some((v) => v.orderId === o.id),
    );
  const total = payments.reduce((s, p) => s + p.amount, 0);
  const methods = paymentMethods.map((label) => ({
    label,
    value: payments
      .filter((p) => p.method === label)
      .reduce((s, p) => s + p.amount, 0),
  }));
  const exportPayments = () =>
    downloadCsv(
      "pagos",
      ["Fecha", "Pedido", "Método", "Monto", "Vuelto", "Estado"],
      data.payments.map((p) => [
        dateText(p.date),
        p.orderId,
        p.method,
        p.amount,
        p.change,
        p.refunded ? "Reembolsado" : "Pagado",
      ]),
    );
  const printOrder = (o: Order) =>
    printLocal(
      `Cuenta ${o.id}`,
      o.items
        .map(
          (l) =>
            `${l.count} ${l.product.name}: ${money(l.count * l.product.price)}`,
        )
        .concat(`Total: ${money(orderTotal(o))}`),
    );
  const transactions = (
    <div className="ops-table-wrap">
      <table>
        <thead>
          <tr>
            {[
              "Fecha y hora",
              "Pedido",
              "Cliente",
              "Método",
              "Monto",
              "Vuelto",
              "Estado",
              "Acciones",
            ].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.payments
            .filter(
              (p) =>
                (filter === "Todos" || p.method === filter) &&
                `${p.orderId} ${data.orders.find((o) => o.id === p.orderId)?.customer}`
                  .toLowerCase()
                  .includes(search.toLowerCase()),
            )
            .map((p) => {
              const o = data.orders.find((o) => o.id === p.orderId);
              return (
                <tr key={p.id}>
                  <td>{dateText(p.date)}</td>
                  <td>#{p.orderId}</td>
                  <td>{o?.customer}</td>
                  <td>
                    <span className="ops-method-label">
                      <PaymentMark name={p.method} />
                      {p.method}
                    </span>
                  </td>
                  <td>{money(p.amount)}</td>
                  <td>{money(p.change)}</td>
                  <td>
                    <Badge value={p.refunded ? "Reembolsado" : "Pagado"} />
                  </td>
                  <td>
                    <div className="ops-actions">
                      <button onClick={() => o && setDetail(o)}>
                        <Icon name="eye" /> Ver detalle
                      </button>
                      <button onClick={() => notify(() => o && printOrder(o))}>
                        <Icon name="print" /> Imprimir
                      </button>
                      {!p.refunded && shift?.id === p.shiftId && (
                        <button
                          onClick={() => notify(() => refundPayment(p.id))}
                        >
                          <Icon name="arrow" /> Reembolsar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {!data.payments.length && <Empty>No hay pagos registrados.</Empty>}
    </div>
  );
  let content;
  if (section === "apertura" || section === "cierre")
    content = (
      <div className="ops-split">
        <Panel
          title={
            section === "apertura"
              ? "Registrar fondo inicial"
              : "Resumen de movimientos"
          }
        >
          <div className="ops-steps">
            <span>Apertura</span>
            <span>Operación</span>
            <span>Cierre</span>
          </div>
          {section === "cierre" && (
            <Stats
              entries={[
                { label: "Fondo inicial", value: money(shift?.initial || 0) },
                {
                  label: "Ventas en efectivo",
                  value: money(
                    payments
                      .filter(
                        (p) =>
                          p.shiftId === shift?.id && p.method === "Efectivo",
                      )
                      .reduce((s, p) => s + p.amount, 0),
                  ),
                },
                {
                  label: "Saldo esperado",
                  value: money(shift ? expectedCash(shift) : 0),
                },
              ]}
            />
          )}
          <form
            className="ops-form"
            onSubmit={(e) => {
              e.preventDefault();
              notify(() => {
                if (
                  billTotal > 0 &&
                  Math.abs(billTotal - Number(amount)) > 0.001
                )
                  throw new Error(
                    "El desglose debe coincidir con el monto ingresado.",
                  );
                if (section === "apertura") {
                  if (!verified)
                    throw new Error("Verifica el efectivo disponible.");
                  openShift(Number(amount), notes);
                } else closeShift(Number(amount), notes);
                navigate("/caja");
              });
            }}
          >
            <label>
              {section === "apertura"
                ? "Fondo inicial (S/)"
                : "Efectivo contado (S/)"}
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
            <div>
              <h3>Desglose de efectivo (opcional)</h3>
              <div className="ops-bills">
                {denomination.map((value, i) => (
                  <label key={value}>
                    {i === 5 ? "Monedas (soles)" : "Billetes S/ " + value}
                    <span className="ops-banknote">S/ {value}</span>
                    <input
                      aria-label={"Cantidad de denominación " + value}
                      type="number"
                      min="0"
                      step={i === 5 ? "0.01" : "1"}
                      value={bills[i]}
                      onChange={(e) =>
                        setBills(
                          bills.map((count, index) =>
                            index === i ? Number(e.target.value) : count,
                          ),
                        )
                      }
                    />
                  </label>
                ))}
              </div>
              <p>
                Total calculado: <strong>{money(billTotal)}</strong>
              </p>
            </div>
            <label>
              Observaciones
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={300}
              />
            </label>
            {section === "apertura" ? (
              <label className="ops-check">
                <input
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                />
                He verificado el efectivo disponible.
              </label>
            ) : (
              <strong>
                Diferencia:{" "}
                {money(Number(amount) - (shift ? expectedCash(shift) : 0))}
              </strong>
            )}
            <button
              className="ops-primary"
              disabled={section === "apertura" ? !!shift : !shift}
            >
              {section === "apertura" ? "Abrir caja" : "Cerrar caja"}
            </button>
          </form>
        </Panel>
        <Panel title="Resumen del turno">
          <p>Cajera: {shift?.user || "Tu cuenta"}</p>
          <p>Local: {data.settings.name}</p>
          <p>Horario: {data.settings.hours}</p>
          <Badge value={shift ? "Caja abierta" : "Caja cerrada"} />
          <p>
            Los pagos digitales se registran por separado del efectivo físico.
          </p>
          <h3>Turnos anteriores</h3>
          {data.shifts
            .filter((s) => s.closed)
            .map((s) => (
              <p key={s.id}>
                {dateText(s.opened)} · Fondo {money(s.initial)} · Diferencia{" "}
                {money(s.difference || 0)}
              </p>
            ))}
        </Panel>
      </div>
    );
  else if (section === "cobros")
    content = (
      <>
        <div className="ops-split">
          <Panel title="Pedidos pendientes de cobro">
            <input
              className="ops-search"
              placeholder="Buscar pedido, cliente o mesa…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Tabs
              options={["Todos", "Salón", "Delivery", "Recojo"]}
              value={filter}
              onChange={setFilter}
            />
            <div className="ops-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Mesa / Origen</th>
                    <th>Cliente</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {pending
                    .filter(
                      (o) =>
                        (filter === "Todos" || o.channel === filter) &&
                        `${o.id} ${o.customer} ${o.table || ""}`
                          .toLowerCase()
                          .includes(search.toLowerCase()),
                    )
                    .slice(0, pendingLimit)
                    .map((o) => (
                      <tr
                        key={o.id}
                        className={o.id === order?.id ? "selected-row" : ""}
                      >
                        <td>#{o.id}</td>
                        <td>{o.table ? `Mesa ${o.table}` : o.channel}</td>
                        <td>
                          <UserSummary name={o.customer} />
                        </td>
                        <td>
                          <ProductSummary order={o} />
                        </td>
                        <td>{money(orderTotal(o))}</td>
                        <td>
                          <button
                            className="ops-primary"
                            onClick={() => {
                              setSelected(o.id);
                              setReceived("");
                            }}
                          >
                            <Icon name="card" /> Cobrar
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {pending.length > pendingLimit && (
                <button
                  className="ops-outline"
                  onClick={() => setPendingLimit(pendingLimit + 8)}
                >
                  <Icon name="plus" /> Ver más pedidos
                </button>
              )}
              {!pending.length && (
                <Empty>No hay pedidos pendientes de cobro.</Empty>
              )}
            </div>
          </Panel>
          <Panel title="Procesar pago">
            {order ? (
              <>
                <h3>
                  Pedido #{order.id} · {order.customer}
                </h3>
                <div className="ops-payment-process">
                  <div className="ops-payment-summary">
                    <h3>Resumen del pedido</h3>
                    <div className="ops-detail-lines">
                      {order.items.map((l) => (
                        <div key={l.product.id}>
                          <span>
                            {l.count} {l.product.name}
                          </span>
                          <strong>{money(l.product.price * l.count)}</strong>
                        </div>
                      ))}
                    </div>
                    <div className="ops-total">
                      Total a cobrar <strong>{money(orderTotal(order))}</strong>
                    </div>
                  </div>
                  <div className="ops-payment-controls">
                    <h3>Método de pago</h3>
                    <Tabs
                      options={data.settings.methods}
                      value={method}
                      onChange={setMethod}
                    />
                    <form
                      className="ops-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        notify(() => {
                          processPayment(
                            order.id,
                            method,
                            method === "Efectivo"
                              ? Number(received)
                              : orderTotal(order),
                          );
                          setSelected(order.id);
                          setReceived("");
                        });
                      }}
                    >
                      {method === "Efectivo" && (
                        <>
                          <label>
                            Monto recibido
                            <input
                              required
                              min={orderTotal(order)}
                              type="number"
                              step="0.01"
                              value={received}
                              onChange={(e) => setReceived(e.target.value)}
                            />
                          </label>
                          <strong>
                            Vuelto:{" "}
                            {money(
                              Math.max(0, Number(received) - orderTotal(order)),
                            )}
                          </strong>
                        </>
                      )}
                      <button className="ops-primary">
                        <Icon name="check" /> Procesar pago
                      </button>
                    </form>
                  </div>
                </div>
                {!shift && (
                  <button
                    className="ops-outline"
                    onClick={() => navigate("/caja/apertura")}
                  >
                    Abrir caja para cobrar
                  </button>
                )}
              </>
            ) : (
              <Empty>Selecciona un pedido pendiente.</Empty>
            )}
            <button
              className="ops-outline"
              onClick={() => navigate("/caja/comprobantes")}
            >
              <Icon name="receipt" /> Emitir comprobante
            </button>
          </Panel>
        </div>
        <Panel
          title="Pagos recientes"
          action={
            <button onClick={() => navigate("/caja/historial")}>
              <Icon name="arrow" /> Ver todos →
            </button>
          }
        >
          {transactions}
        </Panel>
      </>
    );
  else if (section === "comprobantes")
    content = (
      <>
        <Stats
          entries={[
            { label: "Emitidos", value: data.vouchers.length },
            {
              label: "Boletas",
              value: data.vouchers.filter((v) => v.type === "Boleta").length,
            },
            {
              label: "Facturas",
              value: data.vouchers.filter((v) => v.type === "Factura").length,
            },
            {
              label: "Notas de venta",
              value: data.vouchers.filter((v) => v.type === "Nota de venta")
                .length,
            },
          ]}
        />
        <div className="ops-split">
          <Panel
            title="Listado de comprobantes"
            action={
              <button
                onClick={() =>
                  downloadCsv(
                    "comprobantes",
                    ["Número", "Pedido", "Cliente", "Tipo", "Fecha", "Monto"],
                    data.vouchers.map((v) => [
                      v.id,
                      v.orderId,
                      v.customer,
                      v.type,
                      dateText(v.date),
                      v.total,
                    ]),
                  )
                }
              >
                <Icon name="download" /> Exportar Excel (CSV)
              </button>
            }
          >
            <input
              className="ops-search"
              placeholder="Buscar número o cliente…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="ops-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Serie y número</th>
                    <th>Cliente</th>
                    <th>Tipo</th>
                    <th>Fecha</th>
                    <th>Monto</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.vouchers
                    .filter((v) =>
                      `${v.id} ${v.customer}`
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                    )
                    .map((v) => (
                      <tr key={v.id}>
                        <td>{v.id}</td>
                        <td>{v.customer}</td>
                        <td>
                          <Badge value={v.type} />
                        </td>
                        <td>{dateText(v.date)}</td>
                        <td>{money(v.total)}</td>
                        <td>
                          <button
                            onClick={() =>
                              notify(() =>
                                printLocal(v.id, [
                                  v.type,
                                  v.customer,
                                  v.document,
                                  `Pedido ${v.orderId}`,
                                  money(v.total),
                                ]),
                              )
                            }
                          >
                            <Icon name="print" /> Ver / Imprimir PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {!data.vouchers.length && <Empty />}
            </div>
          </Panel>
          <Panel title="Emitir comprobante">
            <form
              className="ops-form"
              onSubmit={(e) => {
                e.preventDefault();
                notify(() => {
                  if (!paidOrder)
                    throw new Error("Selecciona un pedido pagado.");
                  issueVoucher(paidOrder.id, voucherType, customer, document);
                  setSelected("");
                  setCustomer("");
                  setDocument("");
                });
              }}
            >
              <label>
                Pedido pagado
                <select
                  value={paidOrder?.id || ""}
                  onChange={(e) => setSelected(e.target.value)}
                >
                  <option value="">Selecciona un pedido</option>
                  {data.orders
                    .filter(
                      (o) =>
                        o.paid &&
                        !data.vouchers.some((v) => v.orderId === o.id),
                    )
                    .map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.id} · {o.customer}
                      </option>
                    ))}
                </select>
              </label>
              <Tabs
                options={["Boleta", "Factura", "Nota de venta"]}
                value={voucherType}
                onChange={setVoucherType}
              />
              <label>
                Nombre / Razón social
                <input
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  placeholder={paidOrder?.customer}
                />
              </label>
              <label>
                {voucherType === "Factura"
                  ? "RUC (11 dígitos)"
                  : "Documento (opcional)"}
                <input
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  required={voucherType === "Factura"}
                />
              </label>
              <div className="ops-total">
                Total
                <strong>{money(paidOrder ? orderTotal(paidOrder) : 0)}</strong>
              </div>
              <p>Comprobante de simulación local, sin valor tributario.</p>
              <button className="ops-primary">
                <Icon name="receipt" /> Emitir comprobante
              </button>
            </form>
          </Panel>
        </div>
      </>
    );
  else if (section === "historial")
    content = (
      <>
        <Stats
          entries={[
            { label: "Pagos registrados", value: data.payments.length },
            { label: "Total cobrado", value: money(total) },
            {
              label: "Reembolsos",
              value: data.payments.filter((p) => p.refunded).length,
            },
            {
              label: "Turnos cerrados",
              value: data.shifts.filter((s) => s.closed).length,
            },
          ]}
        />
        <div className="ops-with-sidebar">
          <Panel
            title="Historial de pagos"
            action={
              <button onClick={exportPayments}>
                <Icon name="download" /> Exportar Excel (CSV)
              </button>
            }
          >
            <div className="ops-toolbar">
              <input
                placeholder="Buscar pedido o cliente…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {["Todos", ...paymentMethods].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            {transactions}
          </Panel>
          <Panel title="Resumen por método">
            <Donut values={methods} />
          </Panel>
        </div>
      </>
    );
  else
    content = (
      <>
        <Stats
          entries={[
            { label: "Cobrado", value: money(total), tone: "green" },
            {
              label: "Pendientes de cobro",
              value: pending.length,
              tone: "gold",
            },
            { label: "Efectivo", value: money(methods[0].value), tone: "red" },
            {
              label: "Pagos digitales",
              value: money(total - methods[0].value),
              tone: "blue",
            },
          ]}
        />
        <div className="ops-three">
          <Panel
            title="Cobros recientes"
            action={
              <button onClick={() => navigate("/caja/cobros")}>
                <Icon name="arrow" /> Ver todos →
              </button>
            }
          >
            {transactions}
          </Panel>
          <Panel title="Ventas por método de pago">
            <Donut values={methods} />
          </Panel>
          <Panel title="Resumen de caja">
            <p>
              Saldo de apertura <strong>{money(shift?.initial || 0)}</strong>
            </p>
            <p>
              Ventas en efectivo{" "}
              <strong>
                {money(
                  payments
                    .filter(
                      (p) => p.shiftId === shift?.id && p.method === "Efectivo",
                    )
                    .reduce((s, p) => s + p.amount, 0),
                )}
              </strong>
            </p>
            <div className="ops-total">
              Saldo físico esperado
              <strong>{money(shift ? expectedCash(shift) : 0)}</strong>
            </div>
            <button
              className="ops-primary"
              onClick={() =>
                navigate(shift ? "/caja/cierre" : "/caja/apertura")
              }
            >
              {shift ? "Ver detalle / Cerrar caja" : "Abrir caja"}
            </button>
          </Panel>
        </div>
        <Panel
          title="Últimas transacciones"
          action={
            <button onClick={exportPayments}>
              <Icon name="download" /> Exportar
            </button>
          }
        >
          {transactions}
        </Panel>
      </>
    );
  return (
    <>
      {content}
      {detail && (
        <OrderDetail
          order={data.orders.find((o) => o.id === detail.id) || detail}
          onClose={() => setDetail(null)}
        />
      )}
    </>
  );
}
