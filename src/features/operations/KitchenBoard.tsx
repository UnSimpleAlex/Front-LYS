import { useState } from "react";
import { currentUser } from "../../services/localAuth";
import { Icon, type IconName } from "./OperationsVisuals";
import { Empty } from "./OperationsUI";
import { minutes, type Order, type Status } from "./operationsStore";

const stages: {
  status: Status;
  title: string;
  caption: string;
  icon: IconName;
}[] = [
  {
    status: "Recibido",
    title: "Nuevos",
    caption: "Pedidos por confirmar",
    icon: "receipt",
  },
  {
    status: "En preparación",
    title: "En preparación",
    caption: "Pedidos en cocina",
    icon: "chef",
  },
  {
    status: "Listo",
    title: "Listos para entregar",
    caption: "Pedidos listos en pase",
    icon: "serve",
  },
  {
    status: "Entregado",
    title: "Completados",
    caption: "Pedidos entregados",
    icon: "check",
  },
];
const channels: { value: string; label: string; icon: IconName }[] = [
  { value: "Todos", label: "Todos", icon: "list" },
  { value: "Urgentes", label: "Urgentes", icon: "flame" },
  { value: "Delivery", label: "Delivery", icon: "scooter" },
  { value: "Salón", label: "Mesa", icon: "cutlery" },
  { value: "Recojo", label: "Recojo", icon: "bag" },
];

export function KitchenBoard({
  orders,
  target,
  onDetail,
  onStatus,
  navigate,
}: {
  orders: Order[];
  target: number;
  onDetail: (order: Order) => void;
  onStatus: (id: string, status: Status) => void;
  navigate: (path: string) => void;
}) {
  const [channel, setChannel] = useState("Todos");
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [oldestFirst, setOldestFirst] = useState(true);
  const visible = orders.filter((order) => order.status !== "Cancelado");
  const urgent = (order: Order) =>
    !["Entregado", "En camino"].includes(order.status) &&
    minutes(order.accepted || order.created) > target;
  const matchesChannel = (order: Order, value: string) =>
    value === "Todos" ||
    (value === "Urgentes" ? urgent(order) : order.channel === value);
  const filtered = visible
    .filter(
      (order) =>
        matchesChannel(order, channel) &&
        (statusFilter === "Todos" || order.status === statusFilter) &&
        `${order.id} ${order.customer} ${order.table ? `Mesa ${order.table}` : ""} ${order.items.map((item) => item.product.name).join(" ")}`
          .toLowerCase()
          .includes(search.toLowerCase().trim()),
    )
    .sort((a, b) =>
      oldestFirst
        ? a.created.localeCompare(b.created)
        : b.created.localeCompare(a.created),
    );
  const canDeliver = currentUser()?.role === "administrador";
  return (
    <div className="kitchen-board">
      <div className="kitchen-toolbar">
        <div className="kitchen-tabs" aria-label="Filtrar pedidos por origen">
          {channels.map((tab) => (
            <button
              key={tab.value}
              type="button"
              aria-pressed={channel === tab.value}
              className={channel === tab.value ? "selected" : ""}
              onClick={() => setChannel(tab.value)}
            >
              <Icon name={tab.icon} />
              <span>
                {tab.label} (
                {
                  visible.filter((order) => matchesChannel(order, tab.value))
                    .length
                }
                )
              </span>
            </button>
          ))}
        </div>
        <label className="kitchen-search">
          <Icon name="search" />
          <input
            aria-label="Buscar pedidos de cocina"
            placeholder="Buscar por número de pedido, cliente o producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <button
          className="ops-outline kitchen-filter-toggle"
          type="button"
          aria-expanded={filtersOpen}
          aria-controls="kitchen-filters"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <Icon name="filter" /> Filtros <Icon name="chevron" />
        </button>
      </div>
      {filtersOpen && (
        <div id="kitchen-filters" className="kitchen-filters">
          <label>
            Estado
            <select
              aria-label="Estado de pedidos de cocina"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>Todos</option>
              {[...stages.map((stage) => stage.status), "En camino"].map(
                (status) => (
                  <option key={status}>{status}</option>
                ),
              )}
            </select>
          </label>
          <label>
            Orden
            <select
              aria-label="Orden de pedidos de cocina"
              value={oldestFirst ? "antiguos" : "recientes"}
              onChange={(e) => setOldestFirst(e.target.value === "antiguos")}
            >
              <option value="antiguos">Más antiguos primero</option>
              <option value="recientes">Más recientes primero</option>
            </select>
          </label>
          <button
            type="button"
            className="ops-outline"
            onClick={() => {
              setChannel("Todos");
              setSearch("");
              setStatusFilter("Todos");
              setOldestFirst(true);
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}
      <div className="ops-kanban kitchen-columns">
        {stages.map((stage) => {
          const column = filtered.filter(
            (order) =>
              order.status === stage.status ||
              (stage.status === "Listo" && order.status === "En camino"),
          );
          return (
            <section
              key={stage.status}
              className="kitchen-column"
              data-stage={stage.status}
              aria-label={stage.title}
            >
              <header className="kitchen-column-heading">
                <Icon name={stage.icon} />
                <div>
                  <h2>{stage.title}</h2>
                  <p>{stage.caption}</p>
                </div>
                <span className="kitchen-count">{column.length}</span>
              </header>
              {(stage.status === "Entregado"
                ? [...column]
                    .sort((a, b) =>
                      (b.delivered || b.created).localeCompare(
                        a.delivered || a.created,
                      ),
                    )
                    .slice(0, 3)
                : column
              ).map((order) => (
                <KitchenTicket
                  key={order.id}
                  order={order}
                  urgent={urgent(order)}
                  onDetail={onDetail}
                  onStatus={onStatus}
                  canDeliver={canDeliver}
                />
              ))}
              {!column.length && <Empty>No hay pedidos en este estado.</Empty>}
              {stage.status === "Entregado" && (
                <button
                  type="button"
                  className="ops-outline kitchen-history"
                  onClick={() => navigate("/cocina/historial")}
                >
                  <Icon name="clock" /> Ver historial completo
                </button>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function KitchenTicket({
  order,
  urgent,
  onDetail,
  onStatus,
  canDeliver,
}: {
  order: Order;
  urgent: boolean;
  onDetail: (order: Order) => void;
  onStatus: (id: string, status: Status) => void;
  canDeliver: boolean;
}) {
  const delivered = order.status === "Entregado";
  const preparing = order.status === "En preparación";
  const ready = order.status === "Listo" || order.status === "En camino";
  const elapsed = (start: string, end: string) =>
    Math.max(0, Math.round((Date.parse(end) - Date.parse(start)) / 60000));
  const pieces = order.items.reduce((sum, item) => sum + item.count, 0);
  return (
    <article className="kitchen-ticket" data-status={order.status}>
      <header>
        <button
          type="button"
          className="kitchen-ticket-id"
          onClick={() => onDetail(order)}
          aria-label={`Ver pedido ${order.id}`}
        >
          #{order.id}
        </button>
        {urgent && (
          <span className="kitchen-urgent">
            <Icon name="flame" /> URGENTE
          </span>
        )}
        <span className="kitchen-age">Hace {minutes(order.created)} min</span>
      </header>
      <div className="kitchen-ticket-body">
        {order.items[0] && (
          <img
            src={order.items[0].product.image}
            alt={order.items[0].product.name}
            loading="lazy"
          />
        )}
        <div className="kitchen-ticket-copy">
          <div className="kitchen-channel">
            <Icon
              name={
                order.channel === "Delivery"
                  ? "scooter"
                  : order.channel === "Salón"
                    ? "cutlery"
                    : "bag"
              }
            />
            {order.table ? `Mesa ${order.table}` : order.channel}
          </div>
          {order.customer && (
            <div className="kitchen-customer">
              <Icon name="user" />
              {order.customer}
            </div>
          )}
          {!delivered && (
            <ul>
              {order.items.map((item, index) => (
                <li key={`${item.product.id}-${index}`}>
                  {item.count} {item.product.name}
                </li>
              ))}
            </ul>
          )}
          {delivered && (
            <div className="kitchen-delivered">
              <Icon name="check" />
              Entregado en{" "}
              {elapsed(order.created, order.delivered || order.created)} min
            </div>
          )}
        </div>
      </div>
      {order.notes && !delivered && (
        <p className="kitchen-note">{order.notes}</p>
      )}
      {!delivered && (
        <span className="kitchen-pieces">
          <Icon name="cutlery" />
          {pieces} {pieces === 1 ? "plato" : "platos"}
        </span>
      )}
      {preparing && (
        <>
          <ol className="kitchen-progress" aria-label="Progreso del pedido">
            {["Confirmado", "En cocina", "Por entregar", "Entregado"].map(
              (label, index) => (
                <li
                  key={label}
                  className={index < 2 ? "done" : ""}
                  aria-current={index === 1 ? "step" : undefined}
                >
                  {label}
                </li>
              ),
            )}
          </ol>
          <div className="kitchen-timer">
            <Icon name="clock" />
            <strong>{minutes(order.accepted || order.created)} min</strong>
            <span>en preparación</span>
          </div>
        </>
      )}
      {ready && (
        <div className="kitchen-ready">
          <Icon name="clock" />
          {order.status === "En camino"
            ? "Pedido en reparto"
            : `Listo desde hace ${minutes(order.ready || order.created)} min`}
        </div>
      )}
      {!delivered && (
        <div className="kitchen-ticket-actions">
          {order.status === "Recibido" ? (
            <>
              <button
                type="button"
                className="ops-primary"
                aria-label="Aceptar pedido"
                onClick={() => onStatus(order.id, "En preparación")}
              >
                <span aria-hidden="true">▶</span> Confirmar pedido
              </button>
              <button
                type="button"
                className="ops-outline"
                onClick={() => onDetail(order)}
              >
                Ver detalle
              </button>
            </>
          ) : preparing ? (
            <button
              type="button"
              className="ops-outline"
              aria-label="Marcar listo"
              onClick={() => onStatus(order.id, "Listo")}
            >
              <Icon name="check" />
              Marcar como listo
            </button>
          ) : canDeliver ? (
            <button
              type="button"
              className="ops-primary"
              onClick={() => onStatus(order.id, "Entregado")}
            >
              <Icon name="send" />
              Marcar como entregado
            </button>
          ) : (
            <button
              type="button"
              className="ops-primary"
              onClick={() => onDetail(order)}
            >
              <Icon name="eye" />
              Ver detalle de entrega
            </button>
          )}
        </div>
      )}
    </article>
  );
}
