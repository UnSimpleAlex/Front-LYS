import { currentUser } from "../../services/localAuth";
import { OperationsDialog } from "./OperationsDialog";
import { OperationsTable } from "./OperationsTable";
import {
  Icon,
  PaymentMark,
} from "./OperationsVisuals";
import { dateText, downloadCsv, printLocal } from "./operationsFiles";
import { useState, useContext } from "react";
import { createPortal } from "react-dom";
import { OperationsPageActions } from "./operationsPageContext";
import { ChannelBadge, InitialsAvatar } from "./AdminViews";
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
  const denominations = [
    { value: 200, image: "200", label: "Billetes S/ 200" },
    { value: 100, image: "100", label: "Billetes S/ 100" },
    { value: 50, image: "50", label: "Billetes S/ 50" },
    { value: 20, image: "20", label: "Billetes S/ 20" },
    { value: 10, image: "10", label: "Billetes S/ 10" },
    { value: 5, image: "coin-5-soles", label: "Monedas S/ 5" },
    { value: 2, image: "coin-2-soles", label: "Monedas S/ 2" },
    { value: 1, image: "coin-1-sol", label: "Monedas S/ 1" },
    { value: 0.5, image: "coin-50-centimos", label: "Monedas 50 céntimos" },
    { value: 0.2, image: "coin-20-centimos", label: "Monedas 20 céntimos" },
    { value: 0.1, image: "coin-10-centimos", label: "Monedas 10 céntimos" },
  ];
  const [bills, setBills] = useState<number[]>(Array(denominations.length).fill(0));
  // Sum integer céntimos so decimal coin values do not accumulate rounding errors.
  const billTotal = bills.reduce(
    (sum, count, i) => sum + count * Math.round(denominations[i].value * 100),
    0,
  ) / 100;
  const today = new Date();
  const dateLabel = today.toLocaleDateString("es-PE", {day:"numeric",month:"long",year:"numeric"});
  const cashier = currentUser()?.name || "Sin identificar";
  const data = useOperations();
  const actionHost = useContext(OperationsPageActions);
  const [selected, setSelected] = useState(() => new URLSearchParams(location.search).get("pedido") || "");
  const [voucherOpen, setVoucherOpen] = useState(false);
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
      <OperationsTable>
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
      </OperationsTable>
      {!data.payments.length && <Empty>No hay pagos registrados.</Empty>}
    </div>
  );
  let content;
  if (section === "apertura" || section === "cierre")
    content = (
      <>
        {actionHost &&
          createPortal(
            <div className="ops-header-actions">
              <div className="ops-header-date-pill">
                <Icon name="calendar" />
                <span>{dateLabel}</span>
              </div>
            </div>,
            actionHost,
          )}
        <Stats
          entries={[
            {
              label: "Estado de caja",
              value: shift ? "Abierta" : "Cerrada",
              tone: shift ? "green" : "red",
              hint: shift ? "En curso" : "Listo para operar",
            },
            {
              label: "Fecha",
              value: today.toLocaleDateString("es-PE"),
              tone: "blue",
              hint: "Hoy",
            },
            {
              label: "Cajera",
              value: shift?.user || cashier,
              tone: "gray",
              hint: "Usuario en sesión",
            },
            {
              label: "Turno",
              value: data.settings.hours || "Tarde",
              tone: "gold",
              hint: "Horario activo",
            },
          ]}
        />
        <div className="ops-split">
          <Panel
            title={
              section === "apertura"
                ? "Registrar fondo inicial"
                : "Resumen de movimientos"
            }
          >
            <div className="ops-steps">
              {["Apertura", "Operación", "Cierre"].map((step, index) => (
                <span
                  key={step}
                  className={
                    index === (section === "apertura" ? 0 : 2)
                      ? "current"
                      : section === "cierre"
                        ? "complete"
                        : ""
                  }
                  aria-current={
                    index === (section === "apertura" ? 0 : 2)
                      ? "step"
                      : undefined
                  }
                >
                  <b>
                    {section === "cierre" && index < 2 ? (
                      <Icon name="check" />
                    ) : (
                      index + 1
                    )}
                  </b>
                  {step}
                </span>
              ))}
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
                  {label:"Ventas digitales",value:money(payments.filter(p=>p.shiftId===shift?.id && p.method!=="Efectivo").reduce((sum,p)=>sum+p.amount,0))},
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
                {[
                  { title: "Billetes", from: 0, to: 5 },
                  { title: "Monedas", from: 5, to: denominations.length },
                ].map((group) => (
                  <section
                    className="ops-currency-group"
                    key={group.title}
                    aria-label={group.title}
                  >
                    <h4>{group.title}</h4>
                    <div className="ops-denomination-head" aria-hidden="true"><span>Denominación</span><span>Cantidad</span><span>Subtotal</span></div>
                    <div className="ops-bills">
                      {denominations
                        .slice(group.from, group.to)
                        .map((item, offset) => {
                          const index = group.from + offset;
                          return (
                            <label key={item.image}>
                              <span className="ops-denomination-name">{item.label}</span>
                              <img
                                className="ops-banknote"
                                src={`/images/operations/currency/${item.image}.webp`}
                                alt=""
                              />
                              <input
                                aria-label={
                                  "Cantidad de denominación " + item.value
                                }
                                type="number"
                                min="0"
                                step="1"
                                value={bills[index]}
                                onChange={(e) =>
                                  setBills(
                                    bills.map((count, i) =>
                                      i === index
                                        ? Number(e.target.value)
                                        : count,
                                    ),
                                  )
                                }
                              />
                              <strong className="ops-denomination-subtotal">{money(bills[index]*item.value)}</strong>
                            </label>
                          );
                        })}
                    </div>
                  </section>
                ))}
                <div className="ops-total ops-cash-total">
                  <span>
                    <Icon name="cash" /> Total calculado
                  </span>
                  <strong>{money(billTotal)}</strong>
                  {billTotal > 0 && (
                    <Badge
                      value={
                        Math.abs(billTotal - Number(amount)) < 0.001
                          ? "Coincide"
                          : "Revisar monto"
                      }
                    />
                  )}
                </div>
                <small>
                  Ingresa la cantidad de piezas de cada billete y moneda.
                </small>
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
                <Icon name={section === "apertura" ? "cash" : "power"} />
                {section === "apertura" ? "Abrir caja" : "Cerrar caja"}
              </button>
            </form>
          </Panel>
          <Panel title="Resumen del turno">
            <dl className="ops-shift-summary">
              <div>
                <dt>
                  <Icon name="user" /> Cajera
                </dt>
                <dd>{shift?.user || cashier}</dd>
              </div>
              <div>
                <dt>
                  <Icon name="store" /> Local
                </dt>
                <dd>{data.settings.name}</dd>
              </div>
              <div>
                <dt>
                  <Icon name="clock" /> Horario
                </dt>
                <dd>{data.settings.hours}</dd>
              </div>
            </dl>
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
      </>
    );
  else if (section === "cobros")
    content = (
      <>
        {actionHost &&
          createPortal(
            <div className="ops-header-actions">
              <div className="ops-header-date-pill">
                <Icon name="calendar" />
                <span>{dateLabel}</span>
              </div>
              <button
                className="ops-outline"
                onClick={() => navigate("/caja/comprobantes")}
              >
                <Icon name="receipt" /> Emitir comprobante
              </button>
            </div>,
            actionHost,
          )}
        <div className="ops-pos-split">
          <Panel title="Pedidos pendientes de cobro">
            <div
              className="ops-admin-filter-bar"
              style={{ margin: "0 0 16px" }}
            >
              <div className="ops-admin-search">
                <Icon name="search" />
                <input
                  aria-label="Buscar pedido, cliente o mesa"
                  placeholder="Buscar por mesa o número de pedido…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Tabs
                options={["Todos", "Salón", "Delivery", "Recojo"]}
                value={filter}
                onChange={setFilter}
              />
            </div>
            {pending.length === 0 ? (
              <Empty>No hay pedidos pendientes de cobro.</Empty>
            ) : (
              <div className="ops-pending-card-list">
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
                    <div
                      key={o.id}
                      className={`ops-pending-order-item ${o.id === order?.id ? "selected" : ""}`}
                      onClick={() => {
                        setSelected(o.id);
                        setReceived("");
                      }}
                    >
                      <div className="ops-pending-order-info">
                        <div className="ops-pending-order-top">
                          <ChannelBadge channel={o.table ? "Salón" : o.channel} />
                          {o.table && <strong>Mesa {o.table}</strong>}
                          <small style={{ color: "#64748b" }}>#{o.id}</small>
                        </div>
                        <div style={{ fontSize: "12.5px", color: "#64748b" }}>
                          {o.customer} · {o.items.length} productos
                        </div>
                      </div>
                      <div className="ops-pending-order-amount">
                        <strong>{money(orderTotal(o))}</strong>
                        <button
                          className="ops-primary"
                          style={{
                            padding: "6px 14px",
                            fontSize: "12.5px",
                            marginTop: "4px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(o.id);
                            setReceived("");
                          }}
                        >
                          Cobrar
                        </button>
                      </div>
                    </div>
                  ))}
                {pending.length > pendingLimit && (
                  <button
                    className="ops-outline"
                    onClick={() => setPendingLimit(pendingLimit + 8)}
                    style={{ marginTop: "8px" }}
                  >
                    <Icon name="plus" /> Ver más pedidos
                  </button>
                )}
              </div>
            )}
          </Panel>

          <div className="ops-pos-checkout">
            {order && !order.paid ? (
              <>
                <div className="ops-pos-checkout-header">
                  <div>
                    <h3>{order.table ? `Mesa ${order.table}` : order.channel}</h3>
                    <small style={{ color: "#64748b" }}>
                      Pedido #{order.id} · {order.customer}
                    </small>
                  </div>
                  <span
                    className="ops-pill-badge active"
                    style={{ background: "#fef3c7", color: "#92400e" }}
                  >
                    <Icon name="clock" /> Pendiente de cobro
                  </span>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <h4
                    style={{
                      margin: "0 0 10px",
                      fontSize: "14px",
                      color: "#475569",
                    }}
                  >
                    Detalle del pedido
                  </h4>
                  <div className="ops-pos-order-lines">
                    {order.items.map((item) => (
                      <div key={item.product.id} className="ops-pos-line-item">
                        <span>
                          {item.count} × {item.product.name}
                        </span>
                        <strong>
                          {money(item.product.price * item.count)}
                        </strong>
                      </div>
                    ))}
                  </div>
                  <div className="ops-pos-total-row">
                    <span>Total del pedido</span>
                    <strong>{money(orderTotal(order))}</strong>
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <h4
                    style={{
                      margin: "0 0 10px",
                      fontSize: "14px",
                      color: "#475569",
                    }}
                  >
                    Método de pago
                  </h4>
                  <div className="ops-method-selector-grid">
                    {data.settings.methods.map((m) => (
                      <button
                        key={m}
                        type="button"
                        className={`ops-method-button ${method === m ? "active" : ""}`}
                        onClick={() => setMethod(m)}
                      >
                        <PaymentMark name={m} />
                        <span>{m}</span>
                      </button>
                    ))}
                  </div>
                </div>

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
                      setSelected("");
                      setReceived("");
                    });
                  }}
                >
                  {method === "Efectivo" && (
                    <>
                      <div className="ops-cash-presets">
                        <button
                          type="button"
                          className="ops-cash-preset-btn"
                          onClick={() =>
                            setReceived(String(orderTotal(order)))
                          }
                        >
                          Exacto ({money(orderTotal(order))})
                        </button>
                        <button
                          type="button"
                          className="ops-cash-preset-btn"
                          onClick={() => setReceived("50")}
                        >
                          S/ 50
                        </button>
                        <button
                          type="button"
                          className="ops-cash-preset-btn"
                          onClick={() => setReceived("100")}
                        >
                          S/ 100
                        </button>
                        <button
                          type="button"
                          className="ops-cash-preset-btn"
                          onClick={() => setReceived("200")}
                        >
                          S/ 200
                        </button>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "12px",
                          alignItems: "end",
                        }}
                      >
                        <label style={{ margin: 0 }}>
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
                        <div
                          style={{
                            padding: "10px 14px",
                            borderRadius: "8px",
                            background: "#ecfdf5",
                            border: "1px solid #a7f3d0",
                            color: "#065f46",
                            fontSize: "14px",
                            fontWeight: "600",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span>Vuelto:</span>
                          <strong style={{ fontSize: "16px" }}>
                            {money(
                              Math.max(0, Number(received) - orderTotal(order)),
                            )}
                          </strong>
                        </div>
                      </div>
                    </>
                  )}

                  <div style={{ marginTop: "16px" }}>
                    <label>
                      Tipo de comprobante
                      <select
                        value={voucherType}
                        onChange={(e) => setVoucherType(e.target.value)}
                      >
                        <option value="Boleta">Boleta</option>
                        <option value="Factura">Factura</option>
                        <option value="Nota de venta">Nota de venta</option>
                      </select>
                    </label>
                  </div>

                  <button
                    className="ops-primary"
                    aria-label="Procesar pago"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      padding: "14px",
                      fontSize: "15px",
                      fontWeight: 700,
                      marginTop: "16px",
                    }}
                  >
                    <Icon name="check" /> Procesar pago
                  </button>
                </form>
              </>
            ) : (
              <Empty>Selecciona un pedido pendiente para cobrar.</Empty>
            )}
          </div>
        </div>

        <Panel
          title="Pagos recientes"
          action={
            <button onClick={() => navigate("/caja/historial")}>
              <Icon name="arrow" /> Ver todos
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
        {actionHost &&
          createPortal(
            <div className="ops-header-actions">
              <div className="ops-header-date-pill">
                <Icon name="calendar" />
                <span>{dateLabel}</span>
              </div>
              <button
                className="ops-primary"
                onClick={() => setVoucherOpen(true)}
              >
                <Icon name="plus" /> Emitir comprobante
              </button>
            </div>,
            actionHost,
          )}
        <Stats
          entries={[
            {
              label: "Emitidos hoy",
              value: data.vouchers.length,
              tone: "red",
              hint: "Total del día",
            },
            {
              label: "Boletas",
              value: data.vouchers.filter((v) => v.type === "Boleta").length,
              tone: "blue",
              hint: "Consumidor final",
            },
            {
              label: "Facturas",
              value: data.vouchers.filter((v) => v.type === "Factura").length,
              tone: "gold",
              hint: "Empresas con RUC",
            },
            {
              label: "Notas de venta",
              value: data.vouchers.filter((v) => v.type === "Nota de venta")
                .length,
              tone: "gray",
              hint: "Control interno",
            },
          ]}
        />
        <Panel
          title="Listado de comprobantes"
          action={
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="ops-outline"
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
                <Icon name="download" /> Exportar
              </button>

            </div>
          }
        >
          <div
            className="ops-admin-filter-bar"
            style={{ margin: "0 0 16px" }}
          >
            <div className="ops-admin-search">
              <Icon name="search" />
              <input
                aria-label="Buscar número o cliente"
                placeholder="Buscar por número o cliente…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Tabs
              options={["Todos", "Boleta", "Factura", "Nota de venta"]}
              value={filter}
              onChange={setFilter}
            />
          </div>
          <div className="ops-table-wrap">
            <OperationsTable>
              <thead>
                <tr>
                  <th>N° Comprobante</th>
                  <th>Fecha y hora</th>
                  <th>Tipo</th>
                  <th>Cliente</th>
                  <th>N° de pedido</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.vouchers
                  .filter(
                    (v) =>
                      (filter === "Todos" || v.type === filter) &&
                      `${v.id} ${v.customer}`
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                  )
                  .map((v) => (
                    <tr key={v.id}>
                      <td>
                        <strong>{v.id}</strong>
                      </td>
                      <td>{dateText(v.date)}</td>
                      <td>
                        <span
                          className={`ops-voucher-badge ${
                            v.type === "Boleta"
                              ? "boleta"
                              : v.type === "Factura"
                                ? "factura"
                                : "nota"
                          }`}
                        >
                          <Icon name="receipt" /> {v.type}
                        </span>
                      </td>
                      <td>
                        <div className="ops-person-cell">
                          <InitialsAvatar name={v.customer} />
                          <strong>{v.customer}</strong>
                        </div>
                      </td>
                      <td>#{v.orderId}</td>
                      <td>
                        <strong style={{ color: "#0f172a" }}>
                          {money(v.total)}
                        </strong>
                      </td>
                      <td>
                        <span className="ops-pill-badge active">
                          <span className="ops-status-dot green" /> Emitido
                        </span>
                      </td>
                      <td>
                        <div className="ops-actions">
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
                            title="Ver / Imprimir comprobante"
                          >
                            <Icon name="print" /> Imprimir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </OperationsTable>
            {!data.vouchers.length && (
              <Empty>No hay comprobantes emitidos.</Empty>
            )}
          </div>
        </Panel>
        {voucherOpen && (
          <OperationsDialog
            title="Emitir comprobante"
            onClose={() => setVoucherOpen(false)}
          >
            <form
              className="ops-form"
              onSubmit={(e) => {
                e.preventDefault();
                notify(() => {
                  if (!paidOrder)
                    throw new Error("Selecciona un pedido pagado.");
                  issueVoucher(paidOrder.id, voucherType, customer, document);
                  setSelected("");
                  setVoucherOpen(false);
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
                        {o.id} · {o.customer} ({money(orderTotal(o))})
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
          </OperationsDialog>
        )}
      </>
    );
  else if (section === "historial")
    content = (
      <>
        {actionHost &&
          createPortal(
            <div className="ops-header-actions">
              <div className="ops-header-date-pill">
                <Icon name="calendar" />
                <span>{dateLabel}</span>
              </div>
              <button className="ops-outline" onClick={exportPayments}>
                <Icon name="download" /> Exportar Excel (CSV)
              </button>
            </div>,
            actionHost,
          )}
        <Stats
          entries={[
            {
              label: "Total cobrado",
              value: money(total),
              tone: "green",
              hint: "Cobrado en el turno",
            },
            {
              label: "Operaciones",
              value: data.payments.length,
              tone: "blue",
              hint: "Pagos registrados",
            },
            {
              label: "Anulaciones",
              value: data.payments.filter((p) => p.refunded).length,
              tone: "red",
              hint: "Reembolsos aprobados",
            },
            {
              label: "Turnos cerrados",
              value: data.shifts.filter((s) => s.closed).length,
              tone: "gray",
              hint: "Histórico de turnos",
            },
          ]}
        />
        <div className="ops-with-sidebar">
          <Panel
            title="Historial de pagos"
            action={
              <button className="ops-outline" onClick={exportPayments}>
                <Icon name="download" /> Exportar
              </button>
            }
          >
            <div
              className="ops-admin-filter-bar"
              style={{ margin: "0 0 16px" }}
            >
              <div className="ops-admin-search">
                <Icon name="search" />
                <input
                  aria-label="Buscar pedido o cliente"
                  placeholder="Buscar pedido, cliente o comprobante…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                aria-label="Filtrar resultados"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #dce3ee",
                  fontSize: "13px",
                  background: "#fff",
                }}
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
        {actionHost &&
          createPortal(
            <div className="ops-header-actions">
              <div className="ops-header-date-pill">
                <Icon name="calendar" />
                <span>{dateLabel}</span>
              </div>
              <button
                className="ops-primary"
                onClick={() => navigate("/caja/cobros")}
              >
                <Icon name="card" /> Ir a cobros
              </button>
            </div>,
            actionHost,
          )}
        <Stats
          entries={[
            {
              label: "Caja abierta",
              value: shift ? "En curso" : "Cerrada",
              tone: shift ? "green" : "red",
              hint: `Turno: ${data.settings.hours}`,
            },
            {
              label: "Recaudado",
              value: money(total),
              tone: "green",
              hint: "Total de cobros",
            },
            {
              label: "Cobros",
              value: data.vouchers.length || data.payments.length,
              tone: "blue",
              hint: "Comprobantes emitidos",
            },
            {
              label: "Pendientes",
              value: pending.length,
              tone: "gold",
              hint: "Pagos por cobrar",
            },
            {
              label: "Fondo inicial",
              value: money(shift?.initial || 0),
              tone: "gray",
              hint: "Monto de apertura",
            },
          ]}
        />
        <div className="ops-split">
          <Panel
            title="Pagos pendientes"
            action={
              <button onClick={() => navigate("/caja/cobros")}>
                <Icon name="arrow" /> Ver todos ({pending.length})
              </button>
            }
          >
            <div className="ops-table-wrap">
              <OperationsTable>
                <thead>
                  <tr>
                    <th>Origen</th>
                    <th>Referencia</th>
                    <th>Cliente</th>
                    <th>Monto</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.slice(0, 5).map((o) => (
                    <tr key={o.id}>
                      <td>
                        <ChannelBadge channel={o.table ? "Salón" : o.channel} />
                      </td>
                      <td>
                        <strong>{o.table ? `Mesa ${o.table}` : `#${o.id}`}</strong>
                      </td>
                      <td>{o.customer}</td>
                      <td>
                        <strong style={{ color: "#dc2626" }}>
                          {money(orderTotal(o))}
                        </strong>
                      </td>
                      <td>
                        <button
                          className="ops-primary"
                          style={{ padding: "4px 10px", fontSize: "12px" }}
                          onClick={() => {
                            setSelected(o.id);
                            navigate(`/caja/cobros?pedido=${encodeURIComponent(o.id)}`);
                          }}
                        >
                          Cobrar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </OperationsTable>
              {!pending.length && (
                <Empty>No hay pedidos pendientes de cobro.</Empty>
              )}
            </div>
          </Panel>

          <Panel title="Desglose de recaudación">
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {methods.map((m) => {
                const pct =
                  total > 0 ? ((m.value / total) * 100).toFixed(1) : "0.0";
                return (
                  <div
                    key={m.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <PaymentMark name={m.label} />
                      <strong>{m.label}</strong>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <strong style={{ fontSize: "14px", color: "#0f172a" }}>
                        {money(m.value)}
                      </strong>
                      <small
                        style={{
                          display: "block",
                          color: "#64748b",
                          fontSize: "11px",
                        }}
                      >
                        {pct}%
                      </small>
                    </div>
                  </div>
                );
              })}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "8px",
                  borderTop: "2px solid #e2e8f0",
                }}
              >
                <strong>Total recaudado</strong>
                <strong style={{ color: "#dc2626", fontSize: "16px" }}>
                  {money(total)}
                </strong>
              </div>
            </div>
          </Panel>
        </div>

        <Panel
          title="Últimos movimientos"
          action={
            <button onClick={() => navigate("/caja/historial")}>
              <Icon name="arrow" /> Ver historial completo
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
