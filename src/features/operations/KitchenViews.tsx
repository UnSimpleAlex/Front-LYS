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
  Bars,
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
  const hourly = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 12}h`,
    value: orders.filter((o) => new Date(o.created).getHours() === i + 12)
      .length,
  }));
  return (
    <>
      <Stats
        entries={[
          {
            label:
              section === "historial"
                ? "Pedidos registrados"
                : "Pedidos pendientes",
            value:
              section === "historial"
                ? orders.length
                : orders.filter((o) => o.status === "Recibido").length,
            icon: "receipt",
          },
          {
            label: "En preparación",
            value: orders.filter((o) => o.status === "En preparación").length,
            icon: "grill",
            tone: "gold",
          },
          {
            label: "Tiempo promedio",
            value: `${average} min`,
            icon: "clock",
            tone: "gold",
          },
          {
            label: "Pedidos a tiempo",
            value: `${completed.length ? Math.round((completed.filter((o) => (Date.parse(o.ready!) - Date.parse(o.accepted!)) / 60000 <= state.settings.target).length / completed.length) * 100) : 0}%`,
            icon: "check",
            tone: "green",
          },
        ]}
      />
      {section === "" ? (
        <div className="ops-kanban">
          {["Recibido", "En preparación", "Listo", "Entregado"].map(
            (status) => (
              <Panel
                key={status}
                title={`${status === "Recibido" ? "Nuevos" : status === "Listo" ? "Listos para entregar" : status === "Entregado" ? "Completados" : status} (${orders.filter((o) => o.status === status).length})`}
              >
                {orders.filter((o) => o.status === status).length ? (
                  orders
                    .filter((o) => o.status === status)
                    .map((order) => (
                      <OrderCard
                        compact
                        key={order.id}
                        order={order}
                        onDetail={setDetail}
                        onStatus={
                          status === "Recibido" || status === "En preparación"
                            ? advance
                            : undefined
                        }
                      />
                    ))
                ) : (
                  <Empty />
                )}
                {status === "Entregado" && (
                  <button
                    className="ops-outline"
                    onClick={() => navigate("/cocina/historial")}
                  >
                    Ver historial completo
                  </button>
                )}
              </Panel>
            ),
          )}
        </div>
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
                    <p>{order.items[0]?.product.name}</p>
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
                Descargar historial
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
              <table>
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
                      <td>{o.items[0]?.product.name}</td>
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
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!filtered.length && <Empty />}
          </Panel>
          <Panel title="Rendimiento de hoy">
            <Bars values={hourly} />
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
          <div className="ops-two-main">
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
                  Ver pedido
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
              <table>
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
                        <td>{o.items[0]?.product.name}</td>
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
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
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
