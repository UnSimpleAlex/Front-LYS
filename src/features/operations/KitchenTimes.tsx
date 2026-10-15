import { useState } from "react";
import { OperationsTable } from "./OperationsTable";
import { Icon, ProductSummary } from "./OperationsVisuals";
import { Empty, Panel } from "./OperationsUI";
import { minutes, type Order } from "./operationsStore";
import { KitchenChannel, KitchenChart } from "./KitchenReferenceUI";
import {
  kitchenDay,
  kitchenDuration,
  kitchenSearch,
  kitchenTime,
} from "./kitchenHelpers";

export function KitchenTimes({
  orders,
  target,
  onDetail,
}: {
  orders: Order[];
  target: number;
  onDetail: (order: Order) => void;
}) {
  const [channel, setChannel] = useState("Todos");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("Hoy");
  const [allAlerts, setAllAlerts] = useState(false);
  const complete = orders.filter(
    (order) =>
      order.ready &&
      order.accepted &&
      (period === "Todos" ||
        kitchenDay(order.created) === kitchenDay(new Date().toISOString())),
  );
  const active = orders.filter((order) =>
    ["Recibido", "En preparación", "Listo"].includes(order.status),
  );
  const late = active.filter(
    (order) =>
      order.status !== "Listo" &&
      minutes(order.accepted || order.created) > target,
  );
  const ready = active.filter((order) => order.status === "Listo");
  const alerts = [...late, ...ready];
  const filtered = active.filter(
    (order) =>
      (channel === "Todos" || order.channel === channel) &&
      kitchenSearch(order, search),
  );
  const hourly = Array.from({ length: 15 }, (_, index) => {
    const group = complete.filter(
      (order) => new Date(order.created).getHours() === index + 8,
    );
    return {
      label: `${index + 8}h`,
      value:
        group.reduce((sum, order) => sum + kitchenDuration(order), 0) /
        Math.max(1, group.length),
    };
  }).filter((point) => point.value > 0);
  const categories = ["Pollos", "Combos", "Parrillas", "Delivery"].map(
    (label) => {
      const group = complete.filter((order) =>
        label === "Delivery"
          ? order.channel === "Delivery"
          : order.items.some(
              (item) =>
                item.product.category ===
                (label === "Pollos" ? "pollo" : label.toLowerCase()),
            ),
      );
      return {
        label,
        value:
          group.reduce((sum, order) => sum + kitchenDuration(order), 0) /
          Math.max(1, group.length),
      };
    },
  );
  return (
    <div className="kr-times-layout">
      <div className="kr-time-panels">
        <Panel
          title="Tiempo promedio por hora"
          action={
            <select
              aria-label="Periodo de los gráficos"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option>Hoy</option>
              <option>Todos</option>
            </select>
          }
        >
          <KitchenChart
            values={hourly}
            line
            unit="min"
            label="Tiempo promedio de preparación por hora"
          />
        </Panel>
        <Panel title="Preparación por categoría">
          <KitchenChart
            values={categories}
            unit="min"
            label="Minutos promedio por categoría"
          />
        </Panel>
        <Panel
          title="Alertas de cocina"
          action={
            <button
              className="ops-outline"
              onClick={() => setAllAlerts(!allAlerts)}
            >
              {allAlerts ? "Ver menos" : "Ver todas"}
              <Icon name="arrow" />
            </button>
          }
        >
          {(allAlerts ? alerts : alerts.slice(0, 3)).map((order) => (
            <button
              className={`kr-alert ${order.status === "Listo" ? "blue" : minutes(order.accepted || order.created) > target * 1.5 ? "red" : "orange"}`}
              key={order.id}
              onClick={() => onDetail(order)}
            >
              <Icon name={order.status === "Listo" ? "serve" : "bell"} />
              <span>
                <strong>
                  {order.status === "Listo"
                    ? `Pedido #${order.id} listo para entrega`
                    : order.table
                      ? `Mesa ${order.table} supera tiempo estimado`
                      : `Pedido #${order.id} retrasado`}
                </strong>
                <small>
                  {order.status === "Listo"
                    ? "Tiempo de preparación completado"
                    : `${minutes(order.accepted || order.created)} min transcurridos (est. ${target} min)`}
                </small>
              </span>
              <b>
                {order.status === "Listo"
                  ? `${minutes(order.ready || order.created)} min`
                  : `+${minutes(order.accepted || order.created) - target} min`}
              </b>
            </button>
          ))}
          {!alerts.length && (
            <Empty>Todos los pedidos están dentro de la meta.</Empty>
          )}
        </Panel>
      </div>
      <Panel
        title="Pedidos en curso"
        action={
          <label className="kr-search">
            <Icon name="search" />
            <input
              aria-label="Buscar pedidos en curso"
              placeholder="Buscar pedido o producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        }
      >
        <div className="kr-tabs">
          {["Todos", "Delivery", "Salón", "Recojo"].map((value) => (
            <button
              key={value}
              aria-pressed={channel === value}
              className={channel === value ? "selected" : ""}
              onClick={() => setChannel(value)}
            >
              <Icon
                name={
                  value === "Todos"
                    ? "list"
                    : value === "Delivery"
                      ? "scooter"
                      : value === "Salón"
                        ? "table"
                        : "bag"
                }
              />
              {value} (
              {
                active.filter(
                  (order) => value === "Todos" || order.channel === value,
                ).length
              }
              )
            </button>
          ))}
        </div>
        <div className="ops-table-wrap">
          <OperationsTable>
            <thead>
              <tr>
                {[
                  "Pedido",
                  "Producto",
                  "Hora inicio",
                  "Tiempo transcurrido",
                  "Tiempo estimado",
                  "Progreso",
                  "Estado",
                  "Acciones",
                ].map((label) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const elapsed = minutes(order.accepted || order.created);
                const ratio = Math.min(
                  100,
                  Math.round((elapsed / Math.max(1, target)) * 100),
                );
                const tone =
                  elapsed > target ? "red" : ratio >= 80 ? "orange" : "green";
                return (
                  <tr key={order.id}>
                    <td>
                      <strong>#{order.id}</strong>
                      <KitchenChannel order={order} />
                    </td>
                    <td>
                      <ProductSummary order={order} />
                    </td>
                    <td>{kitchenTime(order.accepted || order.created)}</td>
                    <td className={tone === "red" ? "kr-late" : ""}>
                      {elapsed} min
                    </td>
                    <td>{target} min</td>
                    <td>
                      <div className={`kr-progress ${tone}`}>
                        <progress
                          aria-label={`Progreso de ${order.id}`}
                          max="100"
                          value={order.status === "Listo" ? 100 : ratio}
                        />
                        <span>{order.status === "Listo" ? 100 : ratio}%</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`kr-status ${order.status === "Listo" ? "blue" : tone}`}
                      >
                        {order.status === "Listo"
                          ? "Listo"
                          : tone === "red"
                            ? "Retrasado"
                            : tone === "orange"
                              ? "Por vencer"
                              : "En tiempo"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="ops-outline"
                        aria-label={`Ver pedido ${order.id}`}
                        onClick={() => onDetail(order)}
                      >
                        <Icon name="eye" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </OperationsTable>
        </div>
        {!filtered.length && <Empty>No hay pedidos para estos filtros.</Empty>}
      </Panel>
    </div>
  );
}
