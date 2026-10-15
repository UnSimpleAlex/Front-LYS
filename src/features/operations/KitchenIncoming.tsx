import { useState } from "react";
import { Icon } from "./OperationsVisuals";
import { Empty, Panel } from "./OperationsUI";
import { minutes, type Order, type Status } from "./operationsStore";
import { KitchenChannel, KitchenSummary } from "./KitchenReferenceUI";
import { kitchenSearch, kitchenUrgent } from "./kitchenHelpers";

export function KitchenIncoming({
  orders,
  target,
  onDetail,
  onStatus,
}: {
  orders: Order[];
  target: number;
  onDetail: (order: Order) => void;
  onStatus: (id: string, status: Status) => void;
}) {
  const [channel, setChannel] = useState("Todos");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recientes");
  const [filters, setFilters] = useState(false);
  const [status, setStatus] = useState("Todos");
  const active = orders.filter(
    (order) => !["Entregado", "Cancelado", "En camino"].includes(order.status),
  );
  const urgent = active.filter((order) => kitchenUrgent(order, target));
  const matches = active
    .filter(
      (order) =>
        (channel === "Todos" ||
          (channel === "Urgentes"
            ? kitchenUrgent(order, target)
            : order.channel === channel)) &&
        (status === "Todos" || order.status === status) &&
        kitchenSearch(order, search),
    )
    .sort((a, b) =>
      sort === "recientes"
        ? b.created.localeCompare(a.created)
        : a.created.localeCompare(b.created),
    );
  return (
    <div className="kr-incoming-layout">
      <div className="kr-incoming-main">
        <div className="kr-toolbar">
          <div className="kr-tabs">
            {["Todos", "Urgentes", "Delivery", "Salón", "Recojo"].map(
              (value) => (
                <button
                  type="button"
                  key={value}
                  aria-pressed={value === channel}
                  className={value === channel ? "selected" : ""}
                  onClick={() => setChannel(value)}
                >
                  <Icon
                    name={
                      value === "Todos"
                        ? "list"
                        : value === "Urgentes"
                          ? "flame"
                          : value === "Delivery"
                            ? "scooter"
                            : value === "Salón"
                              ? "table"
                              : "bag"
                    }
                  />
                  {value} (
                  {value === "Todos"
                    ? active.length
                    : value === "Urgentes"
                      ? urgent.length
                      : active.filter((order) => order.channel === value)
                          .length}
                  )
                </button>
              ),
            )}
          </div>
          <select
            aria-label="Orden de pedidos entrantes"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="recientes">Más recientes</option>
            <option value="antiguos">Más antiguos</option>
          </select>
          <label className="kr-search">
            <Icon name="search" />
            <input
              aria-label="Buscar pedidos entrantes"
              placeholder="Buscar por cliente, pedido o dirección..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <button
            className="ops-outline"
            aria-expanded={filters}
            aria-controls="kr-incoming-filters"
            onClick={() => setFilters(!filters)}
          >
            <Icon name="filter" />
            Filtros
          </button>
        </div>
        {filters && (
          <div id="kr-incoming-filters" className="kr-toolbar">
            <select
              aria-label="Estado de pedidos entrantes"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {["Todos", "Recibido", "En preparación", "Listo"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
            <button
              className="ops-outline"
              onClick={() => {
                setChannel("Todos");
                setStatus("Todos");
                setSearch("");
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
        <div className="kr-incoming-grid">
          {matches.map((order) => (
            <article className="kr-incoming-card" key={order.id}>
              <img
                className="kr-dish"
                src={order.items[0]?.product.image}
                alt={order.items[0]?.product.name || "Pedido"}
              />
              <div className="kr-incoming-copy">
                <header>
                  <strong>#{order.id}</strong>
                  <span>Hace {minutes(order.created)} min</span>
                </header>
                <div className="kr-tags">
                  {kitchenUrgent(order, target) && (
                    <span className="kr-urgent">
                      <Icon name="flame" />
                      Urgente
                    </span>
                  )}
                  {!kitchenUrgent(order, target) && (
                    <span className="kr-status green">
                      <Icon name="check" />
                      Normal
                    </span>
                  )}
                  <KitchenChannel order={order} />
                  {order.table && (
                    <span className="kr-table">Mesa {order.table}</span>
                  )}
                </div>
                <p className="kr-customer">
                  <Icon name="user" />
                  <strong>{order.customer}</strong>
                </p>
                <p className="kr-address">
                  <Icon name={order.channel === "Recojo" ? "store" : "pin"} />
                  {order.channel === "Recojo"
                    ? "Retira en restaurante"
                    : order.address ||
                      (order.table
                        ? `Atención en mesa ${order.table}`
                        : "Sin dirección registrada")}
                </p>
                <p className="kr-products">
                  <Icon name="cutlery" />
                  <span>
                    {order.items
                      .map((item) => `${item.count} ${item.product.name}`)
                      .join(" + ")}
                  </span>
                </p>
              </div>
              <footer>
                <div className="kr-elapsed">
                  <Icon name="clock" />
                  <span>
                    <strong>
                      {minutes(order.accepted || order.created)} min
                    </strong>
                    <small>Tiempo transcurrido</small>
                  </span>
                </div>
                <div>
                  <Icon name="clock" />
                  <span>
                    <strong>{target} min</strong>
                    <small>Tiempo estimado</small>
                  </span>
                </div>
                <button className="ops-outline" onClick={() => onDetail(order)}>
                  Ver detalle
                </button>
                {order.status !== "Listo" && (
                  <button
                    className="ops-primary"
                    onClick={() =>
                      onStatus(
                        order.id,
                        order.status === "Recibido"
                          ? "En preparación"
                          : "Listo",
                      )
                    }
                  >
                    {order.status === "Recibido"
                      ? "Aceptar pedido"
                      : "Marcar listo"}
                  </button>
                )}
              </footer>
            </article>
          ))}
        </div>
        {!matches.length && (
          <Empty>No hay pedidos para los filtros seleccionados.</Empty>
        )}
      </div>
      <aside className="kr-incoming-sidebar">
        <Panel title="Prioridad de atención">
          <KitchenSummary
            entries={[
              {
                label: "Pedidos urgentes",
                hint: "Atender primero",
                value: urgent.length,
                icon: "bell",
                tone: "red",
              },
              {
                label: "Mayor tiempo de espera",
                hint: `Más de ${target} minutos`,
                value: active.filter((order) => minutes(order.created) > target)
                  .length,
                icon: "clock",
                tone: "orange",
              },
              {
                label: "Pedidos delivery",
                hint: "En preparación",
                value: active.filter((order) => order.channel === "Delivery")
                  .length,
                icon: "scooter",
                tone: "blue",
              },
              {
                label: "Pedidos en salón",
                hint: "Atención en mesas",
                value: active.filter((order) => order.channel === "Salón")
                  .length,
                icon: "table",
                tone: "gold",
              },
              {
                label: "Pedidos de recojo",
                hint: "Para entregar",
                value: active.filter((order) => order.channel === "Recojo")
                  .length,
                icon: "bag",
                tone: "purple",
              },
            ]}
          />
        </Panel>
        <Panel
          title="Pedidos urgentes"
          action={
            <button className="kr-link" onClick={() => setChannel("Urgentes")}>
              Ver todos
            </button>
          }
        >
          {urgent.slice(0, 3).map((order) => (
            <button
              className="kr-priority"
              key={order.id}
              onClick={() => onDetail(order)}
            >
              <img src={order.items[0]?.product.image} alt="" />
              <span>
                <strong>#{order.id}</strong>
                <small>{order.customer}</small>
              </span>
              <span>
                Hace {minutes(order.created)} min
                <small className="kr-urgent">Urgente</small>
              </span>
            </button>
          ))}
          {!urgent.length && <Empty>No hay pedidos urgentes.</Empty>}
        </Panel>
        <Panel title="Resumen operativo">
          <KitchenSummary
            entries={[
              {
                label: "Pedidos registrados",
                value: orders.length,
                icon: "receipt",
              },
              {
                label: "En preparación",
                value: active.filter(
                  (order) => order.status === "En preparación",
                ).length,
                icon: "clock",
              },
              {
                label: "Completados",
                value: orders.filter((order) => order.status === "Entregado")
                  .length,
                icon: "check",
                tone: "green",
              },
              {
                label: "Cancelados",
                value: orders.filter((order) => order.status === "Cancelado")
                  .length,
                icon: "close",
                tone: "red",
              },
            ]}
          />
        </Panel>
      </aside>
    </div>
  );
}
