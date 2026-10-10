import type { SVGProps } from "react";
import {
  Icon as BaseIcon,
  type IconName as BaseIconName,
} from "../../components/Icon";
import type { Order } from "./operationsStore";
export type IconName =
  | BaseIconName
  | "chef"
  | "bell"
  | "chart"
  | "box"
  | "settings"
  | "calendar"
  | "scooter"
  | "serve"
  | "bank"
  | "coins"
  | "plus"
  | "save"
  | "edit"
  | "copy"
  | "download"
  | "print"
  | "send"
  | "power"
  | "trophy"
  | "filter"
  | "list"
  | "clipboard"
  | "bag";
const filled: Partial<Record<IconName, string>> = {
  chef: "M7 17V11C1 12 0 4 6 4c1-5 10-5 12 0 6 0 5 8-1 7v6ZM7 19h10v3H7Z",
  bell: "M5 16V9c0-4 2-6 5-7h4c3 1 5 3 5 7v7l3 3H2ZM9 21h6c0 4-6 4-6 0",
  chart: "M3 13h4v9H3ZM10 7h4v15h-4ZM17 2h4v20h-4Z",
  home: "M1 11 12 1l11 10h-4v11h-5v-8h-4v8H5V11Z",
  serve: "M2 18h20v3H2ZM3 16c0-6 4-10 8-10V4h2v2c5 0 8 4 8 10Z",
  user: "M12 1a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM2 23v-4c0-9 20-9 20 0v4Z",
  users:
    "M9 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM18 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM1 22v-5c0-7 16-7 16 0v5ZM18 22v-5c0-2-1-4-2-5 7-2 9 3 7 10Z",
  table: "M3 3h18l2 7H1ZM3 12h3L5 23H2ZM18 12h3l1 11h-3ZM7 12h10v2H7Z",
  receipt: "M3 1h12v7h7v15H3ZM17 1l5 5h-5Z",
  grid: "M2 2h8v8H2ZM14 2h8v8h-8ZM2 14h8v8H2ZM14 14h8v8h-8Z",
  bank: "M1 8 12 1l11 7ZM2 10h3v9H2ZM8 10h3v9H8ZM14 10h3v9h-3ZM20 10h3v9h-3ZM1 21h22v3H1Z",
};
const linePaths: Partial<Record<IconName, string[]>> = {
  bag: ["M4 7h16l1 15H3Z", "M8 8V5a4 4 0 0 1 8 0v3"],
  box: [
    "m2 7 10-5 10 5-10 5Z",
    "M2 7v11l10 5 10-5V7",
    "M12 12v11",
    "m7 4 10 5",
  ],
  settings: [
    "m9 2-1 3-3 1-3-1-1 5 3 2v3l-2 2 3 4 3-1 3 2 1 2 5-1v-3l3-2 3 1 1-5-3-2v-3l2-2-3-4-3 1-3-2Z",
    "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  ],
  calendar: [
    "M3 5h18v17H3Z",
    "M3 10h18",
    "M7 2v5",
    "M17 2v5",
    "M7 14h2m3 0h2m3 0h1M7 18h2m3 0h2",
  ],
  scooter: [
    "M8 18H5a4 4 0 1 1 0-8h3l3 8h5l-3-12h5",
    "M18 14a4 4 0 1 0 0 8 4 4 0 0 0 0-8",
    "M4 6h7",
    "M13 3h5",
    "m8 10 7-3",
  ],
  coins: [
    "M3 6c0-5 18-5 18 0s-18 5-18 0Z",
    "M3 6v4c0 5 18 5 18 0V6",
    "M3 10v5c0 5 18 5 18 0v-5",
    "M3 15v5c0 5 18 5 18 0v-5",
  ],
  plus: ["M12 3v18", "M3 12h18"],
  save: ["M3 2h15l4 4v16H3Z", "M7 2v7h10V2", "M7 22v-9h10v9"],
  edit: ["m4 16 12-12 4 4-12 12-5 1Z", "m14 6 4 4"],
  copy: ["M8 7h13v15H8Z", "M16 7V2H3v15h5"],
  download: ["M12 2v14", "m6 10 6 6 6-6", "M3 16v6h18v-6"],
  print: ["M6 8V2h12v6", "M6 18H2V8h20v10h-4", "M6 14h12v8H6Z", "M17 11h2"],
  send: ["M2 3 23 12 2 21l4-9Z", "M6 12h17"],
  power: ["M12 1v11", "M6 4a10 10 0 1 0 12 0"],
  trophy: [
    "M6 2h12v7c0 10-12 10-12 0Z",
    "M6 4H2v4c0 5 4 5 5 5",
    "M18 4h4v4c0 5-4 5-5 5",
    "M12 16v6",
    "M7 23h10",
  ],
  filter: ["M2 3h20l-8 9v9l-4-2v-7Z"],
  list: ["M8 5h14M8 12h14M8 19h14", "M2 5h2M2 12h2M2 19h2"],
  clipboard: ["M8 3H4v19h16V3h-4", "M8 1h8v5H8Z", "M8 10h8M8 15h8"],
};
export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  if (filled[name])
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        {...props}
      >
        <path d={filled[name]} />
        {name === "receipt" && (
          <path
            d="M7 11h10M7 15h10M7 19h6"
            stroke="var(--ops-icon-cutout,white)"
            strokeWidth="1.5"
          />
        )}
      </svg>
    );
  if (linePaths[name])
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {linePaths[name]!.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
    );
  return <BaseIcon name={name as BaseIconName} {...props} />;
}
export function ProductSummary({ order }: { order: Order }) {
  const first = order.items[0];
  if (!first) return null;
  return (
    <div className="ops-product-summary">
      <img src={first.product.image} alt="" loading="lazy" />
      <div>
        <strong>
          {first.count} {first.product.name}
        </strong>
        <small>
          {order.items.length > 1
            ? `+ ${order.items.length - 1} productos`
            : first.product.description}
        </small>
      </div>
    </div>
  );
}
export function UserSummary({
  name,
  detail,
}: {
  name: string;
  detail?: string;
}) {
  return (
    <div className="ops-person">
      <span className="ops-avatar">
        <Icon name="user" />
      </span>
      <div>
        <strong>{name}</strong>
        {detail && <small>{detail}</small>}
      </div>
    </div>
  );
}
export function PaymentMark({ name }: { name: string }) {
  return name === "Yape" || name === "Plin" ? (
    <img
      className="ops-wallet-mark"
      src={`/images/checkout/${name.toLowerCase()}.webp`}
      alt=""
    />
  ) : (
    <Icon
      name={
        name === "Efectivo"
          ? "cash"
          : name === "Transferencia"
            ? "bank"
            : "card"
      }
    />
  );
}

export function IngredientPhoto({ name }: { name: string }) {
  const kind = /pollo/i.test(name)
    ? "chicken"
    : /papa/i.test(name)
      ? "potatoes"
      : /carbón|carbon/i.test(name)
        ? "charcoal"
        : /bbq|salsa/i.test(name)
          ? "sauce"
          : null;
  return kind ? (
    <span className={`ops-ingredient-photo ${kind}`} aria-hidden="true" />
  ) : /inca/i.test(name) ? (
    <img
      className="ops-supply-photo"
      src="/images/carta/products/bebidas-01.webp"
      alt=""
    />
  ) : (
    <span className="ops-supply-placeholder">
      <Icon name="box" />
    </span>
  );
}
export function SupplySummary({
  name,
  detail,
}: {
  name: string;
  detail?: string;
}) {
  return (
    <div className="ops-supply-summary">
      <IngredientPhoto name={name} />
      <div>
        <strong>{name}</strong>
        {detail && <small>{detail}</small>}
      </div>
    </div>
  );
}
