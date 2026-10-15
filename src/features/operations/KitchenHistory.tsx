import { useState } from "react";
import { OperationsTable } from "./OperationsTable";
import { Icon } from "./OperationsVisuals";
import { Empty, Panel } from "./OperationsUI";
import { downloadCsv } from "./operationsFiles";
import type { Order } from "./operationsStore";
import {
  KitchenChannel,
  KitchenChart,
  KitchenSummary,
} from "./KitchenReferenceUI";
import {
  kitchenDay,
  kitchenDuration,
  kitchenSearch,
  kitchenTime,
} from "./kitchenHelpers";

export function KitchenHistory({
  orders,
  onDetail,
}: {
  orders: Order[];
  onDetail: (order: Order) => void;
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [channel, setChannel] = useState("Todos");
  const [search, setSearch] = useState("");
  const history = orders.filter((order) =>
    ["Entregado", "Cancelado"].includes(order.status),
  );
  const filtered = history
    .filter(
      (order) =>
        (!from || kitchenDay(order.created) >= from) &&
        (!to || kitchenDay(order.created) <= to) &&
        (channel === "Todos" ||
          order.channel === channel ||
          order.status === channel) &&
        kitchenSearch(order, search),
    )
    .sort((a, b) => b.created.localeCompare(a.created));
  const today = orders.filter(
    (order) =>
      kitchenDay(order.created) === kitchenDay(new Date().toISOString()),
  );
  const complete = today.filter((order) => order.ready && order.accepted);
  const hourly = Array.from({ length: 15 }, (_, index) => ({
    label: `${index + 8}h`,
    value: today.filter(
      (order) => new Date(order.created).getHours() === index + 8,
    ).length,
  }));
  const average = Math.round(
    complete.reduce((sum, order) => sum + kitchenDuration(order), 0) /
      Math.max(1, complete.length),
  );
  const peak = hourly.reduce(
    (best, value) => (value.value > best.value ? value : best),
    hourly[0],
  );
  return (
    <div className="kr-history-layout">
      <Panel
        title="Historial de pedidos"
        action={
          <button
            className="ops-outline kr-export"
            onClick={() =>
              downloadCsv(
                "historial-cocina",
                [
                  "Pedido",
                  "Tipo",
                  "Cliente",
                  "Productos",
                  "Ingreso",
                  "Listo",
                  "Estado",
                ],
                filtered.map((order) => [
                  order.id,
                  order.channel,
                  order.customer,
                  order.items
                    .map((item) => `${item.count} ${item.product.name}`)
                    .join(" + "),
                  order.created,
                  order.ready || "",
                  order.status,
                ]),
              )
            }
          >
            <Icon name="download" />
            Exportar historial
          </button>
        }
      >
        <div className="kr-toolbar kr-history-filters">
          <label>
            Desde
            <input
              aria-label="Desde fecha del historial"
              type="date"
              value={from}
              max={to || undefined}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label>
            Hasta
            <input
              aria-label="Hasta fecha del historial"
              type="date"
              value={to}
              min={from || undefined}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
          <select
            aria-label="Tipo o estado del historial"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          >
            {[
              "Todos",
              "Delivery",
              "Salón",
              "Recojo",
              "Entregado",
              "Cancelado",
            ].map((value) => (
              <option key={value} value={value}>
                {value === "Todos" ? "Todos los tipos" : value}
              </option>
            ))}
          </select>
          <label className="kr-search">
            <Icon name="search" />
            <input
              aria-label="Buscar historial"
              placeholder="Buscar por número de pedido, cliente o producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>
        <div className="ops-table-wrap">
          <OperationsTable>
            <thead>
              <tr>
                {[
                  "Pedido",
                  "Tipo",
                  "Cliente / Mesa",
                  "Productos",
                  "Hora ingreso",
                  "Hora listo",
                  "Estado",
                  "Acciones",
                ].map((label) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>#{order.id}</strong>
                  </td>
                  <td>
                    <KitchenChannel order={order} />
                  </td>
                  <td>
                    {order.table ? `Mesa ${order.table}` : order.customer}
                    <small>{order.address || "—"}</small>
                  </td>
                  <td>
                    {order.items
                      .map((item) => `${item.count} ${item.product.name}`)
                      .join(", ")}
                  </td>
                  <td>{kitchenTime(order.created)}</td>
                  <td>{kitchenTime(order.ready)}</td>
                  <td>
                    <span
                      className={`kr-status ${order.status === "Entregado" ? "green" : "gray"}`}
                    >
                      <Icon
                        name={order.status === "Entregado" ? "check" : "close"}
                      />
                      {order.status === "Entregado"
                        ? "Completado"
                        : "Cancelado"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="ops-outline"
                      onClick={() => onDetail(order)}
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </OperationsTable>
        </div>
        {!filtered.length && (
          <Empty>No hay pedidos para este rango y filtros.</Empty>
        )}
      </Panel>
      <aside>
        <Panel title="Rendimiento de hoy">
          <KitchenChart values={hourly} label="Pedidos por hora de hoy" />
          <p>
            Total de productos preparados:{" "}
            <strong>
              {complete.reduce(
                (sum, order) =>
                  sum +
                  order.items.reduce((total, item) => total + item.count, 0),
                0,
              )}
            </strong>
          </p>
        </Panel>
        <Panel title="Resumen operativo">
          <KitchenSummary
            entries={[
              {
                label: "Pedidos completados hoy",
                value: today.filter((order) => order.status === "Entregado")
                  .length,
                icon: "check",
                tone: "green",
              },
              {
                label: "Pedidos cancelados",
                value: today.filter((order) => order.status === "Cancelado")
                  .length,
                icon: "close",
              },
              {
                label: "Tiempo promedio de preparación",
                value: `${average} min`,
                icon: "clock",
                tone: "orange",
              },
              {
                label: "Hora pico",
                value: peak.value ? peak.label : "—",
                icon: "chart",
                tone: "red",
              },
            ]}
          />
        </Panel>
      </aside>
    </div>
  );
}
