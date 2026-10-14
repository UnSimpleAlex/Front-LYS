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
const linePaths: Partial<Record<IconName, string[]>> = {
  chef: ["M7 16v-5a4 4 0 1 1 1-7 5 5 0 0 1 8 0 4 4 0 1 1 1 7v5Z", "M7 16h10v5H7Z"],
  bell: ["M5 17h14l-2-3V9a5 5 0 0 0-10 0v5Z", "M10 21h4M12 2v2"],
  chart: ["M4 20V12h3v8ZM11 20V8h3v12ZM18 20V3h3v17Z"],
  serve: ["M3 17a9 9 0 0 1 18 0ZM2 21h20M12 8V4M10 4h4"],
  bank: ["M3 9 12 3l9 6ZM3 21h18M5 12v6M10 12v6M15 12v6M20 12v6"],

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
  if (linePaths[name])
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
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
