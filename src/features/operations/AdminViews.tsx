import {
  SupplySummary,
  Icon,
  UserSummary,
  PaymentMark,
} from "./OperationsVisuals";
import { dateText, downloadCsv, printLocal } from "./operationsFiles";
import { readUpload } from "./imageUpload";
import { useEffect, useState } from "react";
import {
  useOperations,
  money,
  orderTotal,
  statuses,
  paymentMethods,
  changeStatus,
  saveSettings,
  seedExampleOrders,
  type Order,
} from "./operationsStore";
import {
  Panel,
  Stats,
  Tabs,
  Badge,
  Empty,
  Bars,
  LineChart,
  Donut,
  OrderDetail,
} from "./OperationsUI";
import {
  ProductManager,
  PromotionManager,
  UserManager,
  InventoryManager,
} from "./AdminManagers";
import { currentUser, changeLocalPassword } from "../../services/localAuth";
export function AdminViews({
  section,
  notify,
  navigate,
}: {
  section: string;
  notify: (task: () => void) => void;
  navigate: (path: string) => void;
}) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);
  const data = useOperations();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [status, setStatus] = useState("Todos");
  const [selected, setSelected] = useState("");
  const [detail, setDetail] = useState<Order | null>(null);
  const [settings, setSettings] = useState({ ...data.settings });
  const [tab, setTab] = useState("Métodos de pago");
  const [error, setError] = useState("");
  const [previous, setPrevious] = useState("");
  const [next, setNext] = useState("");
  const [period, setPeriod] = useState("30");
  const orders = data.orders.filter((o) => !o.draft);
  const activePayments = data.payments.filter((p) => !p.refunded);
  const sales = activePayments.reduce((s, p) => s + p.amount, 0);
  const clients = new Set(orders.map((o) => o.customerId));
  const methods = paymentMethods.map((label) => ({
    label,
    value: activePayments
      .filter((p) => p.method === label)
      .reduce((s, p) => s + p.amount, 0),
  }));
  const today = new Date().toLocaleDateString();
  const daily = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(now - (6 - i) * 86400000);
    return {
      label: day.toLocaleDateString("es-PE", {
        day: "numeric",
        month: "short",
      }),
      value: activePayments
        .filter(
          (p) =>
            new Date(p.date).toLocaleDateString() === day.toLocaleDateString(),
        )
        .reduce((s, p) => s + p.amount, 0),
    };
  });
  const best = data.products
    .map((p) => ({
      label: p.name,
      image: p.image,
      value: orders
        .filter((o) => o.status !== "Cancelado")
        .flatMap((o) => o.items)
        .filter((l) => l.product.id === p.id)
        .reduce((s, l) => s + l.count, 0),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  const exportOrders = () =>
    downloadCsv(
      "pedidos",
      ["Pedido", "Fecha", "Cliente", "Canal", "Total", "Estado", "Pagado"],
      orders.map((o) => [
        o.id,
        dateText(o.created),
        o.customer,
        o.channel,
        orderTotal(o),
        o.status,
        o.paid,
      ]),
    );
  const order = data.orders.find((o) => o.id === selected) || orders[0];
  const filtered = orders.filter(
    (o) =>
      (filter === "Todos" ||
        o.channel === filter ||
        (filter === "Cancelados" && o.status === "Cancelado")) &&
      (status === "Todos" || o.status === status) &&
      `${o.id} ${o.customer}`.toLowerCase().includes(search.toLowerCase()),
  );
  const table = (
    <div className="ops-table-wrap">
      <table>
        <thead>
          <tr>
            {[
              "Pedido",
              "Fecha y hora",
              "Cliente",
              "Origen",
              "Productos",
              "Total",
              "Pago",
              "Estado",
              "Acciones",
            ].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.slice(0, 30).map((o) => (
            <tr key={o.id} className={o.id === order?.id ? "selected-row" : ""}>
              <td>#{o.id}</td>
              <td>{dateText(o.created)}</td>
              <td>
                <UserSummary name={o.customer} />
              </td>
              <td>{o.table ? `Mesa ${o.table}` : o.channel}</td>
              <td>
                <div className="ops-product-cell">
                  <img src={o.items[0]?.product.image} alt="" />
                  <span>
                    {o.items[0]?.product.name}
                    <small>{o.items.length} productos</small>
                  </span>
                </div>
              </td>
              <td>{money(orderTotal(o))}</td>
              <td>
                <Badge value={o.paid ? "Pagado" : "Pendiente"} />
              </td>
              <td>
                <Badge value={o.status} />
              </td>
              <td>
                <button
                  onClick={() => {
                    setSelected(o.id);
                    setDetail(o);
                  }}
                >
                  <Icon name="eye" /> Ver detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!filtered.length && <Empty />}
    </div>
  );
  if (section === "productos") return <ProductManager notify={notify} />;
  if (section === "promociones") return <PromotionManager notify={notify} />;
  if (section === "usuarios" || section === "clientes")
    return <UserManager clients={section === "clientes"} notify={notify} />;
  if (section === "inventario") return <InventoryManager notify={notify} />;
  if (section === "configuracion")
    return (
      <div className="ops-settings">
        <Tabs
          options={[
            "Datos del negocio",
            "Métodos de pago",
            "Impuestos",
            "Usuarios",
            "Seguridad",
          ]}
          value={tab}
          onChange={setTab}
        />
        <div>
          <Panel
            title={tab}
            action={
              <div className="ops-actions">
                <button onClick={() => setSettings({ ...data.settings })}>
                  Cancelar
                </button>
                <button
                  className="ops-primary"
                  onClick={() => notify(() => saveSettings(settings))}
                >
                  <Icon name="save" /> Guardar cambios
                </button>
              </div>
            }
          >
            {tab === "Datos del negocio" ? (
              <div className="ops-form">
                {(["name", "address", "phone", "email", "hours"] as const).map(
                  (k) => (
                    <label key={k}>
                      {
                        {
                          name: "Nombre del negocio",
                          address: "Dirección",
                          phone: "Teléfono",
                          email: "Correo",
                          hours: "Horario",
                        }[k]
                      }
                      <input
                        value={settings[k]}
                        onChange={(e) =>
                          setSettings({ ...settings, [k]: e.target.value })
                        }
                      />
                    </label>
                  ),
                )}
                <label className="ops-check">
                  <input
                    type="checkbox"
                    checked={settings.open}
                    onChange={(e) =>
                      setSettings({ ...settings, open: e.target.checked })
                    }
                  />
                  Local abierto
                </label>
                <label>
                  Meta de preparación (minutos)
                  <input
                    type="number"
                    min="1"
                    value={settings.target}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        target: Number(e.target.value),
                      })
                    }
                  />
                </label>
              </div>
            ) : tab === "Métodos de pago" ? (
              <div className="ops-method-grid">
                {paymentMethods.map((m) => (
                  <article key={m}>
                    <header>
                      <h3 className="ops-method-label">
                        <PaymentMark name={m} />
                        {m}
                      </h3>
                      <button
                        className={`ops-switch ${settings.methods.includes(m) ? "on" : ""}`}
                        aria-label={`Activar ${m}`}
                        aria-pressed={settings.methods.includes(m)}
                        onClick={() =>
                          setSettings({
                            ...settings,
                            methods: settings.methods.includes(m)
                              ? settings.methods.filter((v) => v !== m)
                              : [...settings.methods, m],
                          })
                        }
                      />
                    </header>
                    <p>
                      {m === "Efectivo"
                        ? "Pago en efectivo en tienda o contra entrega."
                        : m === "Tarjeta"
                          ? "Visa, Mastercard, American Express y más."
                          : m === "Transferencia"
                            ? "Transferencias desde cualquier banco."
                            : `Pago rápido y seguro con ${m}.`}
                    </p>
                    {(m === "Yape" || m === "Plin") && (
                      <>
                        <label>
                          Cambiar QR
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file)
                                void readUpload(file)
                                  .then((image) =>
                                    setSettings({
                                      ...settings,
                                      [m === "Yape" ? "yapeQr" : "plinQr"]:
                                        image,
                                    }),
                                  )
                                  .catch((err) => setError(err.message));
                            }}
                          />
                        </label>
                        {settings[m === "Yape" ? "yapeQr" : "plinQr"] ? (
                          <img
                            className="ops-qr"
                            src={settings[m === "Yape" ? "yapeQr" : "plinQr"]}
                            alt={`QR configurado para ${m}`}
                          />
                        ) : (
                          <div className="ops-qr-placeholder">
                            <img
                              className="ops-qr"
                              src={`/images/checkout/qr-${m.toLowerCase()}-demo.svg`}
                              alt="QR de muestra"
                            />
                            <small>
                              QR de muestra · configura el de tu negocio
                            </small>
                          </div>
                        )}
                      </>
                    )}
                    {m === "Transferencia" && (
                      <label>
                        Cuenta del negocio
                        <input
                          value={settings.bank}
                          onChange={(e) =>
                            setSettings({ ...settings, bank: e.target.value })
                          }
                        />
                      </label>
                    )}
                  </article>
                ))}
              </div>
            ) : tab === "Impuestos" ? (
              <div className="ops-form">
                <label>
                  Porcentaje de impuesto informativo
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.tax}
                    onChange={(e) =>
                      setSettings({ ...settings, tax: Number(e.target.value) })
                    }
                  />
                </label>
                <p>
                  Los precios publicados son finales. El porcentaje se muestra
                  como desglose, sin sumarlo de nuevo al total. Los comprobantes
                  locales no tienen valor tributario.
                </p>
              </div>
            ) : tab === "Usuarios" ? (
              <button
                className="ops-primary"
                onClick={() => navigate("/administrador/usuarios")}
              >
                Gestionar usuarios y permisos
              </button>
            ) : (
              <form
                className="ops-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  void changeLocalPassword(previous, next)
                    .then(() => {
                      setPrevious("");
                      setNext("");
                      setError("Contraseña actualizada.");
                    })
                    .catch((err) => setError(err.message));
                }}
              >
                <p>Cuenta: {currentUser()?.email}</p>
                <label>
                  Contraseña actual
                  <input
                    required
                    type="password"
                    autoComplete="current-password"
                    value={previous}
                    onChange={(e) => setPrevious(e.target.value)}
                  />
                </label>
                <label>
                  Nueva contraseña
                  <input
                    required
                    type="password"
                    minLength={8}
                    autoComplete="new-password"
                    value={next}
                    onChange={(e) => setNext(e.target.value)}
                  />
                </label>
                <button className="ops-primary">Cambiar contraseña</button>
              </form>
            )}
            {error && <p role="status">{error}</p>}
          </Panel>
        </div>
      </div>
    );
  if (section === "pedidos")
    return (
      <>
        <Stats
          entries={[
            { label: "Total de pedidos", value: orders.length },
            {
              label: "Pendientes",
              value: orders.filter((o) => o.status === "Recibido").length,
              tone: "gold",
            },
            {
              label: "En preparación",
              value: orders.filter((o) => o.status === "En preparación").length,
              tone: "gold",
            },
          ]}
        />
        <div className="ops-with-sidebar">
          <Panel
            title="Gestión de pedidos"
            action={
              <button
                className="ops-primary"
                onClick={() => navigate("/mesera/nuevo-pedido")}
              >
                ＋ Nuevo pedido
              </button>
            }
          >
            <Tabs
              options={["Todos", "Salón", "Delivery", "Recojo", "Cancelados"]}
              value={filter}
              onChange={setFilter}
            />
            <div className="ops-toolbar">
              <input
                placeholder="Buscar número o cliente…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {["Todos", ...statuses].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <button onClick={exportOrders}>
                <Icon name="download" /> Exportar
              </button>
            </div>
            {table}
          </Panel>
          <Panel
            title={
              order ? `Detalle del pedido #${order.id}` : "Detalle del pedido"
            }
          >
            {order ? (
              <>
                <h3>{order.customer}</h3>
                <p>
                  {order.phone} · {order.email}
                </p>
                <Badge value={order.status} />
                <p>{order.address || `Mesa ${order.table || "—"}`}</p>
                <div className="ops-detail-lines">
                  {order.items.map((l) => (
                    <div key={l.product.id}>
                      <img src={l.product.image} alt="" />
                      <span>
                        {l.count} {l.product.name}
                      </span>
                      <strong>{money(l.product.price * l.count)}</strong>
                    </div>
                  ))}
                </div>
                <div className="ops-total">
                  Total<strong>{money(orderTotal(order))}</strong>
                </div>
                <h3>Historial del pedido</h3>
                <ol>
                  {order.history.map((h, i) => (
                    <li key={i}>
                      {h.status}
                      <small>{dateText(h.date)}</small>
                    </li>
                  ))}
                </ol>
                {!["Entregado", "Cancelado"].includes(order.status) && (
                  <div className="ops-actions">
                    <button
                      className="ops-primary"
                      onClick={() =>
                        notify(() =>
                          changeStatus(
                            order.id,
                            order.status === "Recibido"
                              ? "En preparación"
                              : order.status === "En preparación"
                                ? "Listo"
                                : order.status === "Listo" &&
                                    order.channel === "Delivery"
                                  ? "En camino"
                                  : "Entregado",
                          ),
                        )
                      }
                    >
                      <Icon name="sort" /> Avanzar estado
                    </button>
                    <button
                      onClick={() =>
                        notify(() => changeStatus(order.id, "Cancelado"))
                      }
                    >
                      <Icon name="close" /> Cancelar pedido
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Empty />
            )}
          </Panel>
        </div>
        {detail && (
          <OrderDetail
            order={data.orders.find((o) => o.id === detail.id) || detail}
            onClose={() => setDetail(null)}
          />
        )}
      </>
    );
  if (section === "reportes") {
    const reportOrders = orders.filter(
      (o) => Date.parse(o.created) >= now - Number(period) * 86400000,
    );
    const reportSales = activePayments
      .filter((p) => Date.parse(p.date) >= now - Number(period) * 86400000)
      .reduce((s, p) => s + p.amount, 0);
    const reportPayments = activePayments.filter(
      (p) => Date.parse(p.date) >= now - Number(period) * 86400000,
    );
    const reportMethods = paymentMethods.map((label) => ({
      label,
      value: reportPayments
        .filter((p) => p.method === label)
        .reduce((sum, p) => sum + p.amount, 0),
    }));
    const reportBest = data.products
      .map((product) => ({
        label: product.name,
        value: reportOrders
          .filter((o) => o.status !== "Cancelado")
          .flatMap((o) => o.items)
          .filter((line) => line.product.id === product.id)
          .reduce((sum, line) => sum + line.count, 0),
        image: product.image,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    const reportDaily = Array.from({ length: Number(period) }, (_, i) => {
      const date = new Date(now - (Number(period) - 1 - i) * 86400000);
      return {
        label: date.toLocaleDateString("es-PE", {
          day: "numeric",
          month: "short",
        }),
        value: reportPayments
          .filter(
            (p) =>
              new Date(p.date).toLocaleDateString() ===
              date.toLocaleDateString(),
          )
          .reduce((sum, p) => sum + p.amount, 0),
      };
    });
    return (
      <>
        <div className="ops-toolbar">
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            {["7", "30", "90"].map((n) => (
              <option key={n} value={n}>
                Últimos {n} días
              </option>
            ))}
          </select>
          <button
            className="ops-primary"
            onClick={() =>
              notify(() =>
                printLocal("Reportes y analítica", [
                  `Últimos ${period} días`,
                  `Ventas: ${money(reportSales)}`,
                  `Pedidos: ${reportOrders.length}`,
                  ...reportOrders.map(
                    (o) =>
                      `${o.id} · ${o.customer} · ${money(orderTotal(o))} · ${o.status}`,
                  ),
                ]),
              )
            }
          >
            <Icon name="download" /> Exportar PDF / Imprimir
          </button>
          <button
            onClick={() =>
              downloadCsv(
                "reporte",
                ["Pedido", "Fecha", "Cliente", "Total", "Estado"],
                reportOrders.map((o) => [
                  o.id,
                  dateText(o.created),
                  o.customer,
                  orderTotal(o),
                  o.status,
                ]),
              )
            }
          >
            <Icon name="download" /> Exportar Excel (CSV)
          </button>
        </div>
        <Stats
          entries={[
            { label: "Ventas totales", value: money(reportSales) },
            { label: "Pedidos", value: reportOrders.length, tone: "gold" },
            {
              label: "Ticket promedio",
              value: money(
                reportOrders.length ? reportSales / reportOrders.length : 0,
              ),
            },
            {
              label: "Tasa de entrega",
              value: `${Math.round((reportOrders.filter((o) => o.status === "Entregado").length / Math.max(1, reportOrders.length)) * 100)}%`,
              tone: "green",
            },
          ]}
        />
        <div className="ops-four">
          <Panel title="Ventas por día">
            <LineChart values={reportDaily} />
          </Panel>
          <Panel title="Productos más vendidos">
            <Bars values={reportBest} />
          </Panel>
          <Panel title="Métodos de pago">
            <Donut values={reportMethods} />
          </Panel>
          <Panel title="Rendimiento de cocina">
            <Bars
              values={statuses.map((label) => ({
                label,
                value: reportOrders.filter((o) => o.status === label).length,
              }))}
            />
          </Panel>
        </div>
        <div className="ops-split">
          <Panel title="Clientes frecuentes">
            <Bars
              values={Array.from(clients)
                .map((id) => ({
                  label:
                    orders.find((o) => o.customerId === id)?.customer ||
                    "Cliente",
                  value: reportOrders.filter((o) => o.customerId === id).length,
                }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 5)}
            />
          </Panel>
          <Panel title="Resumen por canal">
            <Bars
              values={["Salón", "Delivery", "Recojo"].map((label) => ({
                label,
                value: reportOrders
                  .filter((o) => o.channel === label)
                  .reduce((s, o) => s + orderTotal(o), 0),
              }))}
            />
          </Panel>
        </div>
      </>
    );
  }
  return (
    <>
      <Stats
        entries={[
          {
            label: "Ventas de hoy",
            value: money(
              activePayments
                .filter((p) => new Date(p.date).toLocaleDateString() === today)
                .reduce((s, p) => s + p.amount, 0),
            ),
          },
          { label: "Pedidos", value: orders.length, tone: "gold" },
          {
            label: "Ticket promedio",
            value: money(orders.length ? sales / orders.length : 0),
            tone: "blue",
          },
          { label: "Clientes", value: clients.size, tone: "green" },
        ]}
      />
      <div className="ops-four">
        <Panel
          title="Ventas últimos 7 días"
          action={
            <button onClick={() => navigate("/administrador/reportes")}>
              <Icon name="eye" /> Ver detalle →
            </button>
          }
        >
          <LineChart values={daily} />
        </Panel>
        <Panel title="Productos más vendidos">
          <Bars values={best} />
        </Panel>
        <Panel title="Métodos de pago">
          <Donut values={methods} />
        </Panel>
        <Panel
          title="Stock bajo"
          action={
            <button onClick={() => navigate("/administrador/inventario")}>
              Ver inventario →
            </button>
          }
        >
          {data.supplies
            .filter((s) => s.stock < s.min)
            .map((s) => (
              <p key={s.id}>
                <SupplySummary
                  name={s.name}
                  detail={`${s.stock} ${s.unit} · Stock mínimo: ${s.min}`}
                />
              </p>
            ))}
        </Panel>
      </div>
      <Panel
        title="Pedidos recientes"
        action={
          <div className="ops-actions">
            <button onClick={exportOrders}>
              <Icon name="download" /> Exportar
            </button>
            <button onClick={() => notify(seedExampleOrders)}>
              Cargar pedidos de ejemplo
            </button>
            <button
              className="ops-primary"
              onClick={() => navigate("/administrador/productos")}
            >
              ＋ Nuevo producto
            </button>
          </div>
        }
      >
        {table}
      </Panel>
    </>
  );
}
