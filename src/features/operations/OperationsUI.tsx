import { dateText } from "./operationsFiles";
import type { ReactNode } from "react";
import { Icon, type IconName } from "../../components/Icon";
import { AccountDialog } from "../account/AccountShared";
import {
  money,
  minutes,
  orderTotal,
  type Order,
  type Status,
} from "./operationsStore";

export function Panel({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="ops-panel">
      <header>
        <h2>{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}
export function Stats({
  entries,
}: {
  entries: {
    label: string;
    value: string | number;
    icon?: IconName;
    tone?: string;
    hint?: string;
  }[];
}) {
  return (
    <div className="ops-stats">
      {entries.map((item) => (
        <div className={`ops-stat ${item.tone || ""}`} key={item.label}>
          <span className="ops-stat-icon">
            <Icon name={item.icon || "receipt"} />
          </span>
          <div>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
            {item.hint && <small>{item.hint}</small>}
          </div>
        </div>
      ))}
    </div>
  );
}
export function Badge({ value }: { value: string }) {
  return (
    <span
      className={`ops-badge ${["Entregado", "Pagado", "Libre", "Activo", "En stock", "Emitido"].includes(value) ? "green" : ["En preparación", "Reservada", "Por vencer"].includes(value) ? "gold" : ["Listo", "En camino", "Solicita cuenta"].includes(value) ? "blue" : ["Cancelado", "Inactivo"].includes(value) ? "gray" : "red"}`}
    >
      {value}
    </span>
  );
}
export function Empty({ children }: { children?: ReactNode }) {
  return (
    <p className="ops-empty">
      {children || "No hay registros para los filtros seleccionados."}
    </p>
  );
}
export function Tabs({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="ops-tabs">
      {options.map((option) => (
        <button
          type="button"
          key={option}
          className={value === option ? "selected" : ""}
          aria-pressed={value === option}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
export function OrderCard({
  order,
  onDetail,
  onStatus,
  compact = false,
}: {
  order: Order;
  onDetail: (order: Order) => void;
  onStatus?: (id: string, status: Status) => void;
  compact?: boolean;
}) {
  const next =
    order.status === "Recibido"
      ? "En preparación"
      : order.status === "En preparación"
        ? "Listo"
        : order.status === "Listo" && order.channel === "Delivery"
          ? "En camino"
          : "Entregado";
  return (
    <article className={`ops-order-card ${compact ? "compact" : ""}`}>
      <header>
        <strong>#{order.id}</strong>
        <Badge value={order.table ? `Mesa ${order.table}` : order.channel} />
      </header>
      <div className="ops-order-time">
        <span>{dateText(order.created)}</span>
        <strong>{minutes(order.accepted || order.created)} min</strong>
      </div>
      <div className="ops-order-products">
        <img src={order.items[0]?.product.image} alt="" />
        <div>
          {order.items.slice(0, 4).map((line) => (
            <p key={line.product.id}>
              {line.count} {line.product.name}
            </p>
          ))}
        </div>
      </div>
      {order.notes && <p className="ops-order-note">{order.notes}</p>}
      <div className="ops-card-actions">
        {onStatus && !["Entregado", "Cancelado"].includes(order.status) && (
          <button
            className="ops-primary"
            onClick={() => onStatus(order.id, next)}
          >
            {order.status === "Recibido"
              ? "Aceptar pedido"
              : order.status === "En preparación"
                ? "Marcar listo"
                : order.status === "Listo" && order.channel === "Delivery"
                  ? "Iniciar entrega"
                  : "Marcar entregado"}
          </button>
        )}
        <button className="ops-outline" onClick={() => onDetail(order)}>
          Ver detalle
        </button>
      </div>
    </article>
  );
}
export function OrderDetail({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  return (
    <AccountDialog title={`Pedido #${order.id}`} onClose={onClose}>
      <Badge value={order.status} />
      <p>
        {order.customer} · {order.table ? `Mesa ${order.table}` : order.channel}
      </p>
      {order.address && <p>{order.address}</p>}
      <div className="ops-detail-lines">
        {order.items.map((line) => (
          <div key={line.product.id}>
            <img src={line.product.image} alt="" />
            <span>
              {line.count} {line.product.name}
            </span>
            <strong>{money(line.product.price * line.count)}</strong>
          </div>
        ))}
      </div>
      <p>{order.notes || "Sin observaciones"}</p>
      <h3>Total: {money(orderTotal(order))}</h3>
      <h3>Historial del pedido</h3>
      <ol>
        {order.history.map((event, index) => (
          <li key={index}>
            {event.status} · {dateText(event.date)}
          </li>
        ))}
      </ol>
    </AccountDialog>
  );
}
export function Bars({
  values,
}: {
  values: { label: string; value: number }[];
}) {
  const maximum = Math.max(1, ...values.map((v) => v.value));
  return (
    <div className="ops-bars">
      {values.map((item) => (
        <div key={item.label}>
          <span>{item.label}</span>
          <div>
            <i style={{ width: `${(item.value / maximum) * 100}%` }} />
          </div>
          <strong>{item.value.toFixed(0)}</strong>
        </div>
      ))}
    </div>
  );
}
export function LineChart({
  values,
}: {
  values: { label: string; value: number }[];
}) {
  const max = Math.max(1, ...values.map((v) => v.value));
  const points = values
    .map(
      (v, i) =>
        `${25 + (i * 550) / Math.max(1, values.length - 1)},${180 - (v.value / max) * 150}`,
    )
    .join(" ");
  return (
    <div className="ops-chart">
      <svg
        viewBox="0 0 600 220"
        role="img"
        aria-label="Evolución de resultados"
      >
        <path d="M25 20V180H575" fill="none" stroke="#d9dfe8" />
        {[30, 80, 130].map((y) => (
          <path key={y} d={`M25 ${y}H575`} stroke="#eef0f5" />
        ))}
        <polygon points={`25,180 ${points} 575,180`} fill="#ff000011" />
        <polyline
          points={points}
          fill="none"
          stroke="#eb0017"
          strokeWidth="3"
        />
        {values.map((v, i) => (
          <g key={v.label}>
            <circle
              cx={25 + (i * 550) / Math.max(1, values.length - 1)}
              cy={180 - (v.value / max) * 150}
              r="4"
              fill="#eb0017"
            />
            <text
              x={25 + (i * 550) / Math.max(1, values.length - 1)}
              y="207"
              textAnchor="middle"
              fontSize="11"
              fill="#63718c"
            >
              {values.length <= 10 ||
              i % Math.ceil(values.length / 8) === 0 ||
              i === values.length - 1
                ? v.label
                : ""}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
export function Donut({
  values,
}: {
  values: { label: string; value: number }[];
}) {
  const total = values.reduce((sum, v) => sum + v.value, 0);
  const colors = ["#ed0017", "#803bc2", "#0da9db", "#d89b25", "#23528b"];
  return (
    <div className="ops-donut-layout">
      <div
        className="ops-donut"
        style={{
          background: `conic-gradient(${
            values
              .map((v, i) => {
                const start =
                  (values.slice(0, i).reduce((s, x) => s + x.value, 0) /
                    Math.max(1, total)) *
                  100;
                const end = start + (v.value / Math.max(1, total)) * 100;
                return `${colors[i % colors.length]} ${start}% ${end}%`;
              })
              .join(",") || "#eee 0% 100%"
          })`,
        }}
      >
        <div>
          <strong>{money(total)}</strong>
          <small>Total vendido</small>
        </div>
      </div>
      <div>
        {values.map((v, i) => (
          <p key={v.label}>
            <span style={{ color: colors[i % colors.length] }}>●</span>{" "}
            {v.label} <strong>{money(v.value)}</strong>
          </p>
        ))}
      </div>
    </div>
  );
}
