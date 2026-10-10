import { KitchenBoard } from "./KitchenBoard";
import { OperationsTable } from "./OperationsTable";
import { Icon, ProductSummary } from "./OperationsVisuals";
import { dateText, downloadCsv } from "./operationsFiles";
import { useState } from "react";
import {
  changeStatus,
  getOperations,
  minutes,
  statuses,
  useOperations,
  type Order,
  type Status,
} from "./operationsStore";
import {
  ColumnChart,
  Badge,
  Empty,
  LineChart,
  OrderCard,
  OrderDetail,
  Panel,
  Stats,
  Tabs,
} from "./OperationsUI";
export function KitchenViews({
  section,
  notify,
  navigate,
}: {
  section: string;
  notify: (task: () => void) => void;
  navigate: (path: string) => void;
}) {
  const state = useOperations();
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [detail, setDetail] = useState<Order | null>(null);
  const orders = state.orders.filter((o) => !o.draft);
  const current = orders.filter(
    (o) => !["Entregado", "Cancelado"].includes(o.status),
  );
  const completed = orders.filter((o) => o.ready && o.accepted);
  const average = completed.length
    ? Math.round(
        completed.reduce(
          (sum, o) =>
            sum + (Date.parse(o.ready!) - Date.parse(o.accepted!)) / 60000,
          0,
        ) / completed.length,
      )
    : 0;
  const filtered = orders.filter(
    (o) =>
      (filter === "Todos" || o.channel === filter || o.status === filter) &&
      (!search ||
        `${o.id} ${o.customer} ${o.table || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())) &&
      (!date || o.created.slice(0, 10) === date),
  );
  const late = current.filter(
    (o) => minutes(o.accepted || o.created) > state.settings.target,
  );
  const advance = (id: string, status: Status) =>
    notify(() => changeStatus(id, status));
  const categoryTimes = ["Pollos", "Combos", "Parrillas", "Delivery"].map(
    (label) => {
      const matches = completed.filter((o) =>
        label === "Delivery"
          ? o.channel === "Delivery"
          : o.items.some(
              (l) =>
                l.product.category ===
                (label === "Pollos" ? "pollo" : label.toLowerCase()),
            ),
      );
      return {
        label,
        value:
          matches.reduce(
            (s, o) =>
              s + (Date.parse(o.ready!) - Date.parse(o.accepted!)) / 60000,
            0,
          ) / Math.max(1, matches.length),
      };
    },
  );
  const firstHour = Math.min(
    8,
    ...orders.map((o) => new Date(o.created).getHours()),
  );
  const lastHour = Math.max(
    22,
    ...orders.map((o) => new Date(o.created).getHours()),
  );
  const hourly = Array.from({ length: lastHour - firstHour + 1 }, (_, i) => ({
    label: `${i + firstHour}h`,
    value: orders.filter(
      (o) => new Date(o.created).getHours() === i + firstHour,
    ).length,
  }));
  return (
    <>
      <Stats
        entries={
          section === "pedidos"
            ? [
                {
                  label: "Nuevos",
                  value: orders.filter((o) => o.status === "Recibido").length,
                  icon: "receipt",
                  hint: "Pendientes de aceptación",
                },
                {
                  label: "Delivery",
                  value: current.filter((o) => o.channel === "Delivery").length,
                  icon: "scooter",
                  hint: "Pedidos entrantes",
                },
                {
                  label: "Mesas",
                  value: current.filter((o) => o.channel === "Salón").length,
                  icon: "table",
                  tone: "gold",
                  hint: "Pedidos en salón",
                },
                {
                  label: "Tiempo de espera",
                  value: `${Math.round(current.reduce((s, o) => s + minutes(o.created), 0) / Math.max(1, current.length))} min`,
                  icon: "clock",
                  tone: "gold",
                  hint: "Promedio actual",
                },
              ]
            : section === "historial"
              ? [
                  {
                    label: "Pedidos registrados",
                    value: orders.length,
                    icon: "receipt",
                    hint: "Total procesados",
                  },
                  {
                    label: "Completados",
                    value: orders.filter((o) => o.status === "Entregado")
                      .length,
                    icon: "check",
                    tone: "green",
                    hint: "Entregados al cliente",
                  },
                  {
                    label: "Cancelados",
                    value: orders.filter((o) => o.status === "Cancelado")
                      .length,
                    icon: "close",
                    tone: "gray",
                    hint: "No se prepararon",
                  },
                  {
                    label: "Tiempo promedio",
                    value: `${average} min`,
                    icon: "clock",
                    tone: "gold",
                    hint: "Desde aceptación a listo",
                  },
                ]
              : section === "tiempos"
                ? [
                    {
                      label: "Tiempo promedio",
                      value: `${average} min`,
                      icon: "clock",
                      tone: "gold",
                      hint: "Desde inicio del turno",
                    },
                    {
                      label: "Pedidos fuera de tiempo",
                      value: late.length,
                      icon: "bell",
                      hint: "Requieren atención",
                    },
                    {
                      label: "Eficiencia de cocina",
                      value: `${completed.length ? Math.round((completed.filter((o) => (Date.parse(o.ready!) - Date.parse(o.accepted!)) / 60000 <= state.settings.target).length / completed.length) * 100) : 0}%`,
                      icon: "check",
                      tone: "green",
                      hint: "Pedidos a tiempo",
                    },
                    {
                      label: "Mejor tiempo",
                      value: `${completed.length ? Math.round(Math.min(...completed.map((o) => (Date.parse(o.ready!) - Date.parse(o.accepted!)) / 60000))) : 0} min`,
                      icon: "trophy",
                      tone: "gold",
                      hint: "Pedidos completados",
                    },
                  ]
                : [
                    {
                      label: "Pedidos pendientes",
                      value: orders.filter((o) => o.status === "Recibido")
                        .length,
                      icon: "receipt",
                      hint: "Esperando confirmación o preparación",
                    },
                    {
                      label: "En preparación",
                      value: orders.filter((o) => o.status === "En preparación")
                        .length,
                      icon: "chef",
                      tone: "gold",
                      hint: "Cocinándose actualmente",
                    },
                    {
                      label: "Tiempo promedio",
                      value: `${average} min`,
                      icon: "clock",
                      tone: "gray",
                      hint: "Desde aceptación a listo",
                    },
                    {
                      label: "Pedidos a tiempo",
                      value: `${completed.length ? Math.round((completed.filter((o) => (Date.parse(o.ready!) - Date.parse(o.accepted!)) / 60000 <= state.settings.target).length / completed.length) * 100) : 0}%`,
                      icon: "chart",
                      tone: "green",
                      hint: "Pedidos preparados dentro de la meta",
                    },
                  ]
        }
      />
      {section === "" ? (
        <KitchenBoard orders={orders} target={state.settings.target} onDetail={setDetail} onStatus={advance} navigate={navigate} />
      ) : section === "pedidos" ? (
        <>
          <div className="ops-toolbar">
            <Tabs
              options={["Todos", "Delivery", "Salón", "Recojo"]}
              value={filter}
              onChange={setFilter}
            />
            <button
              className="ops-outline"
              onClick={() => setSearch(search === "antiguos" ? "" : "antiguos")}
            >
              {search === "antiguos" ? "Más recientes" : "Más antiguos"}
            </button>
          </div>
          <div className="ops-two-main">
            <div className="ops-order-grid">
              {current
                .filter((o) => filter === "Todos" || o.channel === filter)
                .sort((a, b) =>
                  search === "antiguos"
                    ? a.created.localeCompare(b.created)
                    : b.created.localeCompare(a.created),
                )
                .map((order) => (
                  <OrderCard
                    target={state.settings.target}
                    key={order.id}
                    order={order}
                    onDetail={setDetail}
                    onStatus={
                      order.status === "Recibido" ||
                      order.status === "En preparación"
                        ? advance
                        : undefined
                    }
                  />
                ))}
              {!current.length && <Empty>No hay pedidos entrantes.</Empty>}
            </div>
            <Panel title="Prioridad de atención">
              {[...current]
                .sort((a, b) => a.created.localeCompare(b.created))
                .slice(0, 5)
                .map((order) => (
                  <button
                    className="ops-priority"
                    key={order.id}
                    onClick={() => setDetail(order)}
                  >
                    <strong>#{order.id}</strong>
                    <Badge value={order.channel} />
                    <ProductSummary order={order} />
                    <span>{minutes(order.created)} min</span>
                  </button>
                ))}
            </Panel>
          </div>
        </>
      ) : section === "historial" ? (
        <div className="ops-two-main">
          <Panel
            title="Historial de pedidos"
            action={
              <button
                className="ops-outline"
                onClick={() =>
                  downloadCsv(
                    "historial-cocina",
                    ["Pedido", "Origen", "Cliente", "Estado", "Fecha"],
                    filtered.map((o) => [
                      o.id,
                      o.channel,
                      o.customer,
                      o.status,
                      o.created,
                    ]),
                  )
                }
              >
                <Icon name="download" /> Descargar historial
              </button>
            }
          >
            <div className="ops-toolbar">
              <input
                aria-label="Fecha del historial"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <select
                aria-label="Estado del historial"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {["Todos", ...statuses].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <input
                placeholder="Buscar por número de pedido…"
                aria-label="Buscar historial"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="ops-table-wrap">
              <OperationsTable>
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Tipo</th>
                    <th>Mesa / Cliente</th>
                    <th>Productos</th>
                    <th>Hora ingreso</th>
                    <th>Hora listo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>
                        <Badge value={o.channel} />
                      </td>
                      <td>{o.table ? `Mesa ${o.table}` : o.customer}</td>
                      <td>
                        <ProductSummary order={o} />
                      </td>
                      <td>{dateText(o.created)}</td>
                      <td>{o.ready ? dateText(o.ready) : "Pendiente"}</td>
                      <td>
                        <Badge value={o.status} />
                      </td>
                      <td>
                        <button
                          className="ops-outline"
                          onClick={() => setDetail(o)}
                        >
                          <Icon name="eye" /> Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </OperationsTable>
            </div>
            {!filtered.length && <Empty />}
          </Panel>
          <Panel title="Rendimiento de hoy">
            <ColumnChart values={hourly} />
            <p>
              Total de productos preparados:{" "}
              {completed.reduce(
                (sum, o) => sum + o.items.reduce((s, l) => s + l.count, 0),
                0,
              )}
            </p>
          </Panel>
        </div>
      ) : (
        <>
          <div className="ops-time-overview">
            <Panel title="Tiempo promedio por hora">
              <LineChart
                values={hourly.map((h) => ({
                  ...h,
                  value:
                    completed
                      .filter(
                        (o) => `${new Date(o.created).getHours()}h` === h.label,
                      )
                      .reduce(
                        (sum, o) =>
                          sum +
                          (Date.parse(o.ready!) - Date.parse(o.accepted!)) /
                            60000,
                        0,
                      ) /
                    Math.max(
                      1,
                      completed.filter(
                        (o) => `${new Date(o.created).getHours()}h` === h.label,
                      ).length,
                    ),
                }))}
              />
            </Panel>
            <Panel title="Preparación por categoría">
              <ColumnChart values={categoryTimes} />
            </Panel>
            <Panel title="Alertas de cocina">
              {late.map((o) => (
                <button
                  className="ops-priority"
                  key={o.id}
                  onClick={() => setDetail(o)}
                >
                  <strong>
                    +{minutes(o.accepted || o.created) - state.settings.target}{" "}
                    min de retraso
                  </strong>
                  <p>
                    #{o.id} · {o.items[0]?.product.name}
                  </p>
                  <Icon name="arrow" /> Ver pedido
                </button>
              ))}
              {!late.length && (
                <Empty>Todos los pedidos están dentro de la meta.</Empty>
              )}
            </Panel>
          </div>
          <Panel title="Pedidos en curso">
            <Tabs
              options={["Todos", "Delivery", "Salón", "Recojo"]}
              value={filter}
              onChange={setFilter}
            />
            <div className="ops-table-wrap">
              <OperationsTable>
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Producto</th>
                    <th>Hora inicio</th>
                    <th>Tiempo transcurrido</th>
                    <th>Tiempo estimado</th>
                    <th>Progreso</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {current
                    .filter((o) => filter === "Todos" || o.channel === filter)
                    .map((o) => (
                      <tr key={o.id}>
                        <td>#{o.id}</td>
                        <td>
                          <ProductSummary order={o} />
                        </td>
                        <td>{dateText(o.accepted || o.created)}</td>
                        <td>{minutes(o.accepted || o.created)} min</td>
                        <td>{state.settings.target} min</td>
                        <td>
                          <progress
                            max={state.settings.target}
                            value={minutes(o.accepted || o.created)}
                          />
                        </td>
                        <td>
                          <Badge
                            value={
                              minutes(o.accepted || o.created) >
                              state.settings.target
                                ? "Retrasado"
                                : "A tiempo"
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="ops-outline"
                            onClick={() => setDetail(o)}
                          >
                            <Icon name="eye" /> Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </OperationsTable>
            </div>
          </Panel>
        </>
      )}
      {detail && (
        <OrderDetail
          order={
            getOperations().orders.find((o) => o.id === detail.id) || detail
          }
          onClose={() => setDetail(null)}
        />
      )}
    </>
  );
}
