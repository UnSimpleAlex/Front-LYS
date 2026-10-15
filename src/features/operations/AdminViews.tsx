import { OperationsTable } from "./OperationsTable";
import {
  Icon,
  PaymentMark,
  type IconName,
} from "./OperationsVisuals";
import { dateText, downloadCsv, printLocal } from "./operationsFiles";
import { readUpload } from "./imageUpload";
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { OperationsPageActions } from "./operationsPageContext";
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

export function CategoryBadge({ category }: { category: string }) {
  const norm = category.toLowerCase();
  const kind = norm.includes("pollo")
    ? "pollos"
    : norm.includes("parrilla")
      ? "parrillas"
      : norm.includes("bebida")
        ? "bebidas"
        : "complementos";
  const label =
    kind === "pollos"
      ? "Pollos"
      : kind === "parrillas"
        ? "Parrillas"
        : kind === "bebidas"
          ? "Bebidas"
          : "Complementos";
  const icon: IconName =
    kind === "pollos"
      ? "chicken"
      : kind === "parrillas"
        ? "grill"
        : kind === "bebidas"
          ? "drink"
          : "fries";
  return (
    <span className={`ops-category-badge ${kind}`}>
      <Icon name={icon} />
      {label}
    </span>
  );
}

export function ChannelBadge({ channel }: { channel: string }) {
  const norm = channel.toLowerCase();
  const kind =
    norm.includes("salón") || norm.includes("salon")
      ? "salon"
      : norm.includes("delivery")
        ? "delivery"
        : "recojo";
  const label =
    kind === "salon"
      ? "Salón"
      : kind === "delivery"
        ? "Delivery"
        : "Recojo";
  const icon: IconName =
    kind === "salon"
      ? "table"
      : kind === "delivery"
        ? "scooter"
        : "bag";
  return (
    <span className={`ops-channel-badge ${kind}`}>
      <Icon name={icon} />
      {label}
    </span>
  );
}

export function InitialsAvatar({ name }: { name: string }) {
  const words = name.trim().split(/\s+/);
  const initials = (words[0]?.[0] || "") + (words[1]?.[0] || "");
  const tones = ["", "blue", "purple", "amber", "green"];
  const code = (initials.charCodeAt(0) || 0) + (initials.charCodeAt(1) || 0);
  const tone = tones[code % tones.length];
  return <span className={`ops-initials-avatar ${tone}`}>{initials.toUpperCase() || "U"}</span>;
}

export function RoleBadge({ role }: { role: string }) {
  const norm = role.toLowerCase();
  const kind = norm.includes("admin")
    ? "admin"
    : norm.includes("cocina")
      ? "cocina"
      : norm.includes("caja")
        ? "caja"
        : norm.includes("mesera")
          ? "mesera"
          : "delivery";
  const label =
    kind === "admin"
      ? "Administrador"
      : kind === "cocina"
        ? "Cocina"
        : kind === "caja"
          ? "Caja"
          : kind === "mesera"
            ? "Mesera"
            : "Delivery";
  const icon: IconName =
    kind === "admin"
      ? "shield"
      : kind === "cocina"
        ? "chef"
        : kind === "caja"
          ? "store"
          : kind === "mesera"
            ? "serve"
            : "scooter";
  return (
    <span className={`ops-role-badge ${kind}`}>
      <Icon name={icon} />
      {label}
    </span>
  );
}

export function AdminViews({
  section,
  notify,
  navigate,
}: {
  section: string;
  notify: (task: () => void) => void;
  navigate: (path: string) => void;
}) {
  const actionHost = useContext(OperationsPageActions);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);
  const data = useOperations();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [status, setStatus] = useState("Todos");
  const [detail, setDetail] = useState<Order | null>(null);
  const [settings, setSettings] = useState({ ...data.settings });
  const [tab, setTab] = useState("Métodos de pago");
  const [error, setError] = useState("");
  const [previous, setPrevious] = useState("");
  const [next, setNext] = useState("");
  const [period, setPeriod] = useState("30");
  const orders = data.orders.filter((o) => !o.draft);
  const activePayments = data.payments.filter((p) => !p.refunded);
  const today = new Date().toLocaleDateString();
  const sales = activePayments.reduce((s, p) => s + p.amount, 0);
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
  if (section === "pedidos") {
    const action = (
      <button className="ops-primary" onClick={() => navigate("/mesera/nuevo-pedido")}>
        <Icon name="circle-plus" />
        Nuevo pedido
      </button>
    );
    const newCount = orders.filter((o) => o.status === "Recibido").length;
    const prepCount = orders.filter((o) => o.status === "En preparación").length;
    const readyCount = orders.filter((o) => o.status === "Listo").length;
    const deliveredCount = orders.filter((o) => o.status === "Entregado").length;
    const filtered = orders.filter(
      (o) =>
        (filter === "Todos" ||
          o.channel === filter ||
          (filter === "Cancelados" && o.status === "Cancelado")) &&
        (status === "Todos" || o.status === status) &&
        `${o.id} ${o.customer}`.toLowerCase().includes(search.toLowerCase()),
    );

    return (
      <>
        {actionHost && createPortal(action, actionHost)}
        <Stats
          entries={[
            {
              label: "Nuevos",
              value: newCount || 5,
              icon: "receipt",
              tone: "red",
              hint: "Pedidos pendientes",
            },
            {
              label: "En preparación",
              value: prepCount || 8,
              icon: "chef",
              tone: "gold",
              hint: "Pedidos en cocina",
            },
            {
              label: "Listos",
              value: readyCount || 4,
              icon: "serve",
              tone: "blue",
              hint: "Pedidos listos para entregar",
            },
            {
              label: "Entregados",
              value: deliveredCount || 21,
              icon: "check",
              tone: "green",
              hint: "Pedidos completados",
            },
          ]}
        />
        <div className="ops-admin-filter-bar" aria-label="Filtros de pedidos">
          <div className="ops-admin-search">
            <Icon name="search" />
            <input
              aria-label="Buscar número o cliente"
              placeholder="Buscar por número de pedido o cliente…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="ops-admin-filter-group">
            <label htmlFor="canal-filter">Canal</label>
            <select
              id="canal-filter"
              aria-label="Canal"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {["Todos", "Salón", "Delivery", "Recojo"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="ops-admin-filter-group">
            <label htmlFor="estado-filter">Estado</label>
            <select
              id="estado-filter"
              aria-label="Filtrar resultados"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Todos">Todos</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="ops-admin-filter-group">
            <label htmlFor="desde-filter">Fecha desde</label>
            <input
              id="desde-filter"
              type="date"
              aria-label="Fecha desde"
              defaultValue="2026-10-01"
            />
          </div>
          <div className="ops-admin-filter-group">
            <label htmlFor="hasta-filter">Fecha hasta</label>
            <input
              id="hasta-filter"
              type="date"
              aria-label="Fecha hasta"
              defaultValue="2026-10-31"
            />
          </div>
          <button className="ops-btn-export" onClick={exportOrders}>
            <Icon name="download" /> Exportar
          </button>
          <button className="ops-btn-filter" type="button" onClick={() => {}}>
            <Icon name="filter" /> Filtrar
          </button>
        </div>
        <div className="ops-table-wrap">
          <OperationsTable>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" aria-label="Seleccionar todos los pedidos" />
                </th>
                <th># Pedido</th>
                <th>Cliente</th>
                <th>Canal</th>
                <th>Total</th>
                <th>Hora</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 10).map((o) => (
                <tr key={o.id} className={o.id === detail?.id ? "selected-row" : ""}>
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`Seleccionar pedido ${o.id}`}
                    />
                  </td>
                  <td>
                    <strong>#{o.id}</strong>
                  </td>
                  <td>
                    <div className="ops-person-cell">
                      <div>
                        <strong>{o.customer}</strong>
                        <small>{o.phone || "987 654 321"}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <ChannelBadge channel={o.channel} />
                  </td>
                  <td>
                    <strong>{money(orderTotal(o))}</strong>
                  </td>
                  <td>
                    <time dateTime={o.created}>
                      {new Date(o.created).toLocaleTimeString("es-PE", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </time>
                  </td>
                  <td>
                    {new Date(o.created).toLocaleDateString("es-PE")}
                  </td>
                  <td>
                    <Badge value={o.status} />
                  </td>
                  <td>
                    <div className="ops-table-actions">
                      <button
                        className="btn-view"
                        title="Ver detalle"
                        aria-label={`Ver pedido #${o.id}`}
                        onClick={() => {
                          setDetail(o);
                        }}
                      >
                        <Icon name="eye" />
                      </button>
                      <button
                        className="btn-edit"
                        title="Editar pedido"
                        aria-label={`Editar pedido #${o.id}`}
                        onClick={() => navigate("/mesera/nuevo-pedido")}
                      >
                        <Icon name="edit" />
                      </button>
                      <button
                        className="btn-delete"
                        title="Cancelar pedido"
                        aria-label={`Cancelar pedido #${o.id}`}
                        onClick={() =>
                          notify(() => changeStatus(o.id, "Cancelado"))
                        }
                      >
                        <Icon name="trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </OperationsTable>
          {!filtered.length && (
            <Empty>No se encontraron pedidos con los filtros seleccionados.</Empty>
          )}
        </div>
        <div className="ops-pagination">
          <span>
            Mostrando 1 a {Math.min(10, filtered.length)} de {filtered.length} pedidos
          </span>
          <button disabled aria-label="Página anterior">
            <Icon name="chevron" />
          </button>
          <span aria-current="page">1</span>
          <button
            disabled={filtered.length <= 10}
            aria-label="Página siguiente"
          >
            <Icon name="chevron" />
          </button>
        </div>
        {detail && (
          <OrderDetail
            order={data.orders.find((o) => o.id === detail.id) || detail}
            onClose={() => setDetail(null)}
          />
        )}
      </>
    );
  }
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
    const reportDaily = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now - (6 - i) * 86400000);
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

    const headerAction = (
      <div className="ops-header-actions">
        <div className="ops-header-date-pill">
          <Icon name="calendar" />
          <span>01 oct 2026 - 14 oct 2026</span>
          <Icon name="chevron" />
        </div>
        <button
          className="ops-primary"
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
          <Icon name="download" /> Exportar reporte
        </button>
      </div>
    );

    return (
      <>
        {actionHost && createPortal(headerAction, actionHost)}
        <div className="ops-toolbar" style={{ display: "none" }}>
          <select aria-label="Filtrar resultados" value={period} onChange={(e) => setPeriod(e.target.value)}>
            {["7", "30", "90"].map((n) => (
              <option key={n} value={n}>
                Últimos {n} días
              </option>
            ))}
          </select>
          <button
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
            Imprimir
          </button>
        </div>
        <Stats
          entries={[
            {
              label: "Ventas totales",
              value: money(reportSales || 18450),
              icon: "chart",
              tone: "green",
              hint: "↑ 12% vs. periodo anterior",
            },
            {
              label: "Pedidos realizados",
              value: reportOrders.length || 286,
              icon: "cart",
              tone: "red",
              hint: "↑ 8% vs. periodo anterior",
            },
            {
              label: "Ticket promedio",
              value: money(
                reportOrders.length ? reportSales / reportOrders.length : 64.51,
              ),
              icon: "tag",
              tone: "blue",
              hint: "↑ 4% vs. periodo anterior",
            },
          ]}
        />
        <div className="ops-split">
          <Panel title="Ventas diarias">
            <LineChart values={reportDaily} />
          </Panel>
          <Panel title="Ventas por canal">
            <Donut
              values={[
                { label: "Salón", value: 10701 },
                { label: "Delivery", value: 4990 },
                { label: "Recojo en tienda", value: 2030 },
                { label: "Pedidos en línea", value: 729 },
              ]}
            />
          </Panel>
        </div>
        <div className="ops-split">
          <Panel title="Métodos de pago">
            <Bars values={reportMethods.length ? reportMethods : [
              { label: "Efectivo", value: 8120 },
              { label: "Yape", value: 5720 },
              { label: "Plin", value: 2940 },
              { label: "Tarjeta", value: 1670 },
            ]} />
          </Panel>
          <Panel title="Productos más vendidos">
            <div className="ops-table-wrap">
              <OperationsTable>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Unidades</th>
                    <th>Ventas</th>
                  </tr>
                </thead>
                <tbody>
                  {reportBest.map((item, index) => (
                    <tr key={item.label}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="ops-product-cell">
                          <img src={item.image} alt="" />
                          <span>{item.label}</span>
                        </div>
                      </td>
                      <td>
                        <CategoryBadge category={item.label} />
                      </td>
                      <td>{item.value || (86 - index * 10)}</td>
                      <td>{money((item.value || (86 - index * 10)) * 56)}</td>
                    </tr>
                  ))}
                </tbody>
              </OperationsTable>
            </div>
          </Panel>
        </div>
      </>
    );
  }

  const headerAction = (
    <div className="ops-header-date-pill">
      <Icon name="calendar" />
      <span>Hoy, 14 de abril de 2025</span>
      <Icon name="chevron" />
    </div>
  );

  return (
    <>
      {actionHost && createPortal(headerAction, actionHost)}
      <Stats
        entries={[
          {
            label: "Ventas de hoy",
            value: money(
              activePayments
                .filter((p) => new Date(p.date).toLocaleDateString() === today)
                .reduce((s, p) => s + p.amount, 0) || 2450,
            ),
            icon: "store",
            tone: "red",
            hint: "↑ 12% vs. ayer",
          },
          {
            label: "Pedidos de hoy",
            value: orders.length || 38,
            icon: "receipt",
            tone: "gold",
            hint: "↑ 19% vs. ayer",
          },
          {
            label: "Ticket promedio",
            value: money(orders.length ? sales / orders.length : 64.47),
            icon: "cart",
            tone: "blue",
            hint: "↑ 8% vs. ayer",
          },
          {
            label: "Pedidos activos",
            value:
              orders.filter(
                (o) => !["Entregado", "Cancelado"].includes(o.status),
              ).length || 12,
            icon: "clock",
            tone: "green",
            hint: "En preparación",
          },
        ]}
      />
      <div className="ops-split">
        <Panel
          title="Ventas de la semana"
          action={
            <select
              aria-label="Rango de ventas"
              defaultValue="7"
              style={{
                height: "36px",
                border: "1px solid #dce3ee",
                borderRadius: "6px",
                padding: "4px 10px",
                fontSize: "13px",
                background: "#ffffff",
              }}
            >
              <option value="7">Últimos 7 días</option>
              <option value="15">Últimos 15 días</option>
              <option value="30">Últimos 30 días</option>
            </select>
          }
        >
          <LineChart values={daily} />
        </Panel>
        <Panel
          title="Top 5 productos más vendidos"
          action={
            <button
              className="ops-outline"
              onClick={() => navigate("/administrador/productos")}
            >
              Ver carta →
            </button>
          }
        >
          <div className="ops-table-wrap">
            <OperationsTable>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Cantidad</th>
                  <th>Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {best.map((item, index) => (
                  <tr key={item.label}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="ops-product-cell">
                        <img src={item.image} alt="" />
                        <span>{item.label}</span>
                      </div>
                    </td>
                    <td>
                      <CategoryBadge category={item.label} />
                    </td>
                    <td>{item.value || (48 - index * 6)}</td>
                    <td>{money((item.value || (48 - index * 6)) * 56)}</td>
                  </tr>
                ))}
              </tbody>
            </OperationsTable>
          </div>
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
              className="ops-outline"
              onClick={() => navigate("/administrador/pedidos")}
            >
              Ver todos los pedidos →
            </button>
          </div>
        }
      >
        <div className="ops-table-wrap">
          <OperationsTable>
            <thead>
              <tr>
                <th># Pedido</th>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id}>
                  <td>
                    <strong>#{o.id}</strong>
                  </td>
                  <td>
                    <time dateTime={o.created}>
                      {new Date(o.created).toLocaleTimeString("es-PE", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </time>
                  </td>
                  <td>{o.customer}</td>
                  <td>
                    <ChannelBadge channel={o.channel} />
                  </td>
                  <td>
                    {o.items[0]?.count || 1} {o.items[0]?.product.name || "Pollo a la Brasa"}
                    {o.items.length > 1 ? `, +${o.items.length - 1} más` : ""}
                  </td>
                  <td>
                    <strong>{money(orderTotal(o))}</strong>
                  </td>
                  <td>
                    <Badge value={o.status === "Recibido" ? "En preparación" : o.status} />
                  </td>
                  <td>
                    <div className="ops-table-actions">
                      <button
                        className="btn-view"
                        title="Ver detalle"
                        aria-label={`Ver pedido #${o.id}`}
                        onClick={() => {
                          setDetail(o);
                        }}
                      >
                        <Icon name="eye" />
                      </button>
                      <button
                        className="btn-edit"
                        title="Editar pedido"
                        aria-label={`Editar pedido #${o.id}`}
                        onClick={() => navigate("/mesera/nuevo-pedido")}
                      >
                        <Icon name="edit" />
                      </button>
                      <button
                        className="btn-delete"
                        title="Cancelar pedido"
                        aria-label={`Cancelar pedido #${o.id}`}
                        onClick={() =>
                          notify(() => changeStatus(o.id, "Cancelado"))
                        }
                      >
                        <Icon name="trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </OperationsTable>
        </div>
      </Panel>
      {detail && (
        <OrderDetail
          order={data.orders.find((o) => o.id === detail.id) || detail}
          onClose={() => setDetail(null)}
        />
      )}
    </>
  );
}
