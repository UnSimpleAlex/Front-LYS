import { useSyncExternalStore } from "react";
import seed from "../carta/catalog.json";
import type { Product } from "../carta/catalog";
import { currentUser, type Role } from "../../services/localAuth";
export type MenuProduct = Product & { active?: boolean; stock?: number };
export type Status =
  | "Recibido"
  | "En preparación"
  | "Listo"
  | "En camino"
  | "Entregado"
  | "Cancelado";
export type Channel = "Salón" | "Delivery" | "Recojo";
export type Line = { product: Product; count: number };
export type Order = {
  id: string;
  customerId: string;
  customer: string;
  phone: string;
  email: string;
  address: string;
  channel: Channel;
  table: number | null;
  items: Line[];
  notes: string;
  status: Status;
  created: string;
  accepted?: string;
  ready?: string;
  delivered?: string;
  discount: number;
  shipping: number;
  method: string;
  couponCode?: string;
  paid: boolean;
  history: { status: string; date: string }[];
  draft?: boolean;
};
export type TableState = {
  id: number;
  zone: string;
  seats: number;
  status: "Libre" | "Ocupada" | "Reservada" | "Solicita cuenta";
  notes: string;
};
export type Payment = {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  received: number;
  change: number;
  date: string;
  refunded: boolean;
  shiftId: string;
};
export type Voucher = {
  id: string;
  orderId: string;
  type: string;
  customer: string;
  document: string;
  date: string;
  total: number;
};
export type Shift = {
  id: string;
  user: string;
  opened: string;
  closed?: string;
  initial: number;
  counted?: number;
  notes: string;
  withdrawals: number;
  difference?: number;
};
export type Supply = {
  id: string;
  name: string;
  category: string;
  stock: number;
  min: number;
  unit: string;
  cost: number;
};
export type Offer = {
  id: string;
  name: string;
  type: string;
  productId: string;
  percent: number;
  code: string;
  start: string;
  end: string;
  active: boolean;
  used: number;
  limit: number;
};
export type Movement = {
  id: string;
  supplyId: string;
  name: string;
  amount: number;
  date: string;
  note: string;
};
export type Supplier = {
  id: string;
  name: string;
  phone: string;
  email: string;
};
export type Settings = {
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  open: boolean;
  tax: number;
  methods: string[];
  target: number;
  yapeQr: string;
  plinQr: string;
  bank: string;
};
export type OperationsState = {
  products: MenuProduct[];
  orders: Order[];
  tables: TableState[];
  payments: Payment[];
  vouchers: Voucher[];
  shifts: Shift[];
  supplies: Supply[];
  movements: Movement[];
  offers: Offer[];
  suppliers: Supplier[];
  settings: Settings;
};
const key = "lys-operations-v1";
const listeners = new Set<() => void>();
export const statuses: Status[] = [
  "Recibido",
  "En preparación",
  "Listo",
  "En camino",
  "Entregado",
  "Cancelado",
];
export const paymentMethods = [
  "Efectivo",
  "Yape",
  "Plin",
  "Tarjeta",
  "Transferencia",
];
const initial = (): OperationsState => ({
  products: seed.products.map((product) => ({
    ...product,
    stock: 30,
    active: true,
  })),
  orders: [],
  tables: Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    zone:
      index < 8 ? "Salón principal" : index < 10 ? "Terraza" : "Zona parrilla",
    seats: 4,
    status: "Libre",
    notes: "",
  })),
  payments: [],
  vouchers: [],
  shifts: [],
  movements: [],
  offers: [],
  suppliers: [],
  supplies: [
    {
      id: "pollo",
      name: "Pollo entero",
      category: "Carnes",
      stock: 120,
      min: 30,
      unit: "unidades",
      cost: 12,
    },
    {
      id: "papas",
      name: "Papas nativas",
      category: "Verduras",
      stock: 25,
      min: 50,
      unit: "kg",
      cost: 4,
    },
    {
      id: "carbon",
      name: "Carbón vegetal",
      category: "Combustibles",
      stock: 10,
      min: 20,
      unit: "bolsas",
      cost: 15,
    },
    {
      id: "salsa",
      name: "Salsa BBQ",
      category: "Salsas",
      stock: 18,
      min: 10,
      unit: "unidades",
      cost: 8,
    },
  ],
  settings: {
    name: "Leñas y Sabores",
    address:
      "C. Turístico Los Palomares Mz. D Lt. 5, frente a la Planta Eléctrica San Benito, Carabayllo",
    phone: "947 540 597",
    email: "ventas@lenasysabores.store",
    hours: "12 m. – 11 p. m.",
    open: true,
    tax: 0,
    methods: [...paymentMethods],
    target: 20,
    yapeQr: "",
    plinQr: "",
    bank: "",
  },
});
function read(): OperationsState {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    const fallback = initial();
    if (
      !value ||
      !Array.isArray(value.orders) ||
      !Array.isArray(value.products)
    )
      return fallback;
    return {
      ...fallback,
      ...value,
      settings: { ...fallback.settings, ...value.settings },
    };
  } catch {
    return initial();
  }
}
let state = read();
export const getOperations = () => state;
export function subscribeOperations(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function publish(next: OperationsState) {
  localStorage.setItem(key, JSON.stringify(next));
  state = next;
  listeners.forEach((listener) => listener());
  window.dispatchEvent(new Event("lys-operations"));
}
window.addEventListener("storage", (event) => {
  if (event.key === key || event.key === null) {
    state = read();
    listeners.forEach((listener) => listener());
  }
});
export function useOperations() {
  return useSyncExternalStore((listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, getOperations);
}
function requireRole(roles: Role[]) {
  if (!roles.includes(currentUser()?.role as Role))
    throw new Error("Tu rol no tiene permiso para esta acción.");
}
export const money = (value: number) => `S/ ${value.toFixed(2)}`;
export const orderTotal = (order: Order) =>
  Math.max(
    0,
    Math.round(
      (order.items.reduce(
        (sum, line) => sum + line.product.price * line.count,
        0,
      ) +
        order.shipping -
        order.discount) *
        100,
    ) / 100,
  );
export const minutes = (date: string) =>
  Math.max(0, Math.floor((Date.now() - Date.parse(date)) / 60000));
function quantityFor(items: Line[], productId: string) {
  return items
    .filter(
      (line) =>
        line.product.id === productId ||
        state.offers.some(
          (offer) =>
            "offer-" + offer.id === line.product.id &&
            offer.productId === productId,
        ),
    )
    .reduce((total, line) => total + line.count, 0);
}
function validateAvailability(items: Line[]) {
  if (
    items.some(
      (line) =>
        !Number.isInteger(line.count) || line.count < 1 || line.count > 99,
    )
  )
    throw new Error("Revisa las cantidades.");
  for (const product of state.products) {
    const quantity = quantityFor(items, product.id);
    if (quantity && (!product.active || (product.stock ?? 0) < quantity))
      throw new Error("Sin disponibilidad de " + product.name + ".");
  }
}
export function createOrder(
  input: Omit<Order, "id" | "created" | "history" | "status" | "paid"> & {
    id?: string;
    created?: string;
  },
) {
  const actor = currentUser();
  if (!actor) throw new Error("Inicia sesión para registrar el pedido.");
  requireRole(["cliente", "mesera", "administrador"]);
  if (
    actor.role === "cliente" &&
    (input.channel === "Salón" || input.customerId !== actor.id)
  )
    throw new Error("No puedes crear pedidos de salón.");
  if (
    !input.items.length ||
    input.items.some(
      (line) =>
        !Number.isInteger(line.count) ||
        line.count < 1 ||
        line.count > 99 ||
        !Number.isFinite(line.product.price),
    )
  )
    throw new Error("Agrega productos válidos.");
  for (const line of input.items) {
    if (line.product.id.startsWith("offer-")) {
      const offer = state.offers.find(
        (o) => "offer-" + o.id === line.product.id,
      );
      const date = new Date().toISOString().slice(0, 10);
      if (
        !offer ||
        !offer.active ||
        offer.start > date ||
        offer.end < date ||
        offer.used >= offer.limit
      )
        throw new Error("La promoción ya no está disponible.");
    }
  }
  validateAvailability(input.items);
  if (actor.role === "cliente") {
    const date = new Date().toISOString().slice(0, 10);
    const coupon = input.couponCode
      ? state.offers.find(
          (o) =>
            o.type === "Cupón" &&
            o.code === input.couponCode &&
            o.active &&
            o.start <= date &&
            o.end >= date &&
            o.used < o.limit,
        )
      : undefined;
    if (input.couponCode && !coupon)
      throw new Error("El cupón ya no está disponible.");
    const expected = coupon
      ? Math.round(
          input.items
            .filter(
              (l) => !coupon.productId || l.product.id === coupon.productId,
            )
            .reduce((sum, l) => sum + l.product.price * l.count, 0) *
            coupon.percent,
        ) / 100
      : 0;
    if (Math.abs(input.discount - expected) > 0.01)
      throw new Error("Revisa el descuento del pedido.");
  }
  if (
    input.channel === "Salón" &&
    !state.tables.some((t) => t.id === input.table)
  )
    throw new Error("Selecciona una mesa válida.");
  if (input.channel !== "Salón" && !state.settings.open)
    throw new Error("El local está cerrado.");
  if (
    !Number.isFinite(input.discount) ||
    input.discount < 0 ||
    input.discount >
      input.items.reduce(
        (sum, line) => sum + line.product.price * line.count,
        0,
      )
  )
    throw new Error("Descuento inválido.");
  const now = input.created || new Date().toISOString();
  const id = input.id || `LYS-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const order: Order = {
    ...input,
    id,
    created: now,
    status: "Recibido",
    paid: false,
    history: [{ status: input.draft ? "Borrador" : "Recibido", date: now }],
  };
  if (state.orders.some((item) => item.id === id)) return id;
  publish({
    ...state,
    offers: state.offers.map((o) =>
      input.items.some((l) => l.product.id === "offer-" + o.id) ||
      (o.code === input.couponCode && !!input.couponCode)
        ? { ...o, used: o.used + 1 }
        : o,
    ),
    orders: [order, ...state.orders],
    tables: state.tables.map((table) =>
      table.id === input.table ? { ...table, status: "Ocupada" } : table,
    ),
    products: input.draft
      ? state.products
      : state.products.map((product) => ({
          ...product,
          stock: (product.stock ?? 30) - quantityFor(input.items, product.id),
        })),
  });
  return id;
}
export function changeStatus(id: string, status: Status) {
  const actor = currentUser();
  requireRole(["cocina", "mesera", "caja", "delivery", "administrador"]);
  const order = state.orders.find((item) => item.id === id);
  if (!order || order.draft) throw new Error("Pedido inexistente.");
  const transitions: Record<Status, Status[]> = {
    Recibido: ["En preparación", "Cancelado"],
    "En preparación": ["Listo", "Cancelado"],
    Listo:
      order.channel === "Delivery"
        ? ["En camino", "Entregado", "Cancelado"]
        : ["Entregado", "Cancelado"],
    "En camino": ["Entregado", "Cancelado"],
    Entregado: [],
    Cancelado: [],
  };
  if (!transitions[order.status].includes(status))
    throw new Error("Ese cambio de estado no es válido.");
  if (actor?.role === "cocina" && !["En preparación", "Listo"].includes(status))
    throw new Error("Cocina acepta y prepara pedidos.");
  if (
    actor?.role === "mesera" &&
    (!["Entregado", "Cancelado"].includes(status) || order.channel !== "Salón")
  )
    throw new Error("Salón solo gestiona sus mesas.");
  if (
    actor?.role === "delivery" &&
    (!["En camino", "Entregado"].includes(status) ||
      order.channel !== "Delivery")
  )
    throw new Error("Delivery solo gestiona entregas.");
  if (status === "Cancelado" && order.paid)
    throw new Error("Reembolsa el pago antes de cancelar.");
  if (actor?.role === "caja" && status !== "Cancelado")
    throw new Error("Caja solo puede cancelar pedidos impagos.");
  const now = new Date().toISOString();
  publish({
    ...state,
    orders: state.orders.map((item) =>
      item.id === id
        ? {
            ...item,
            status,
            ...(status === "En preparación"
              ? { accepted: now }
              : status === "Listo"
                ? { ready: now }
                : status === "Entregado"
                  ? { delivered: now }
                  : {}),
            history: [...item.history, { status, date: now }],
          }
        : item,
    ),
    products:
      status === "Cancelado"
        ? state.products.map((product) => ({
            ...product,
            stock: (product.stock ?? 0) + quantityFor(order.items, product.id),
          }))
        : state.products,
  });
}
export function sendDraft(id: string) {
  requireRole(["mesera", "administrador"]);
  const order = state.orders.find((item) => item.id === id && item.draft);
  if (!order) throw new Error("Borrador inexistente.");
  validateAvailability(order.items);
  publish({
    ...state,
    orders: state.orders.map((item) =>
      item.id === id
        ? {
            ...item,
            draft: false,
            history: [
              ...item.history,
              { status: "Recibido", date: new Date().toISOString() },
            ],
          }
        : item,
    ),
    products: state.products.map((product) => ({
      ...product,
      stock: (product.stock ?? 0) - quantityFor(order.items, product.id),
    })),
  });
}
export function updateTable(id: number, change: Partial<TableState>) {
  requireRole(["mesera", "administrador"]);
  if (
    change.status === "Reservada" &&
    state.tables.find((t) => t.id === id)?.status !== "Libre"
  )
    throw new Error("Solo puedes reservar mesas libres.");
  if (
    change.status === "Libre" &&
    state.orders.some(
      (order) =>
        order.table === id && !order.paid && order.status !== "Cancelado",
    )
  )
    throw new Error("Primero cobra o cancela los pedidos de la mesa.");
  publish({
    ...state,
    tables: state.tables.map((table) =>
      table.id === id ? { ...table, ...change, id } : table,
    ),
  });
}
export function editOrder(
  id: string,
  items: Line[],
  discount: number,
  notes: string,
) {
  requireRole(["mesera", "administrador"]);
  const order = state.orders.find((item) => item.id === id);
  if (
    !order ||
    order.paid ||
    !items.length ||
    discount < 0 ||
    discount >
      items.reduce((sum, line) => sum + line.product.price * line.count, 0)
  )
    throw new Error("Revisa el pedido y el descuento.");
  if (order.status !== "Recibido" && !order.draft)
    throw new Error(
      "El pedido ya está en preparación. Agrega un nuevo pedido a la mesa.",
    );
  const stock = state.products.map((product) => ({
    ...product,
    stock:
      (product.stock ?? 0) +
      (order.draft
        ? 0
        : order.items
            .filter((line) => line.product.id === product.id)
            .reduce((sum, line) => sum + line.count, 0) -
          items
            .filter((line) => line.product.id === product.id)
            .reduce((sum, line) => sum + line.count, 0)),
  }));
  if (stock.some((product) => (product.stock ?? 0) < 0))
    throw new Error("Stock insuficiente.");
  publish({
    ...state,
    products: stock,
    orders: state.orders.map((item) =>
      item.id === id ? { ...item, items, discount, notes } : item,
    ),
  });
}
export function openShift(initialAmount: number, notes: string) {
  requireRole(["caja", "administrador"]);
  if (state.shifts.some((shift) => !shift.closed))
    throw new Error("Ya hay una caja abierta.");
  if (!Number.isFinite(initialAmount) || initialAmount < 0)
    throw new Error("Monto inválido.");
  publish({
    ...state,
    shifts: [
      {
        id: crypto.randomUUID(),
        user: currentUser()!.name,
        opened: new Date().toISOString(),
        initial: initialAmount,
        notes,
        withdrawals: 0,
      },
      ...state.shifts,
    ],
  });
}
export const expectedCash = (shift: Shift) =>
  shift.initial +
  state.payments
    .filter(
      (p) => p.shiftId === shift.id && p.method === "Efectivo" && !p.refunded,
    )
    .reduce((sum, p) => sum + p.amount, 0) -
  shift.withdrawals;
export function closeShift(counted: number, notes: string) {
  requireRole(["caja", "administrador"]);
  const shift = state.shifts.find((s) => !s.closed);
  if (!shift || !Number.isFinite(counted) || counted < 0)
    throw new Error("Revisa caja y monto contado.");
  publish({
    ...state,
    shifts: state.shifts.map((s) =>
      s.id === shift.id
        ? {
            ...s,
            closed: new Date().toISOString(),
            counted,
            notes,
            difference: Math.round((counted - expectedCash(shift)) * 100) / 100,
          }
        : s,
    ),
  });
}
export function processPayment(
  orderId: string,
  method: string,
  received: number,
) {
  requireRole(["caja", "administrador"]);
  const order = state.orders.find((o) => o.id === orderId);
  const shift = state.shifts.find((s) => !s.closed);
  if (!shift) throw new Error("Abre la caja antes de registrar cobros.");
  if (!order || order.paid || order.draft || order.status === "Cancelado")
    throw new Error("Este pedido no puede cobrarse.");
  const amount = orderTotal(order);
  if (
    !state.settings.methods.includes(method) ||
    !Number.isFinite(received) ||
    (method === "Efectivo" && received < amount)
  )
    throw new Error("Revisa el método y el monto recibido.");
  const payment: Payment = {
    id: crypto.randomUUID(),
    orderId,
    amount,
    method,
    received: method === "Efectivo" ? received : amount,
    change:
      method === "Efectivo" ? Math.round((received - amount) * 100) / 100 : 0,
    date: new Date().toISOString(),
    refunded: false,
    shiftId: shift.id,
  };
  publish({
    ...state,
    payments: [payment, ...state.payments],
    orders: state.orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            paid: true,
            method,
            history: [...o.history, { status: "Pagado", date: payment.date }],
          }
        : o,
    ),
  });
  return payment;
}
export function refundPayment(id: string) {
  requireRole(["caja", "administrador"]);
  const payment = state.payments.find((p) => p.id === id);
  if (
    !payment ||
    payment.refunded ||
    !state.shifts.some((s) => s.id === payment.shiftId && !s.closed)
  )
    throw new Error("Solo puedes reembolsar un pago del turno abierto.");
  publish({
    ...state,
    payments: state.payments.map((p) =>
      p.id === id ? { ...p, refunded: true } : p,
    ),
    orders: state.orders.map((o) =>
      o.id === payment.orderId
        ? {
            ...o,
            paid: false,
            history: [
              ...o.history,
              { status: "Reembolsado", date: new Date().toISOString() },
            ],
          }
        : o,
    ),
  });
}
export function issueVoucher(
  orderId: string,
  type: string,
  customer: string,
  document: string,
) {
  requireRole(["caja", "administrador"]);
  const order = state.orders.find((o) => o.id === orderId);
  if (!order?.paid) throw new Error("Primero registra el pago.");
  if (state.vouchers.some((v) => v.orderId === orderId))
    throw new Error("El pedido ya tiene comprobante.");
  if (type === "Factura" && !/^\d{11}$/.test(document))
    throw new Error("La factura requiere RUC de 11 dígitos.");
  const voucher: Voucher = {
    id: `${type === "Factura" ? "F001" : type === "Boleta" ? "B001" : "NV01"}-${String(state.vouchers.length + 1).padStart(6, "0")}`,
    orderId,
    type,
    customer: customer || order.customer,
    document,
    date: new Date().toISOString(),
    total: orderTotal(order),
  };
  publish({ ...state, vouchers: [voucher, ...state.vouchers] });
  return voucher;
}
export function saveProduct(product: MenuProduct) {
  requireRole(["administrador"]);
  if (
    !product.name.trim() ||
    product.price <= 0 ||
    !Number.isFinite(product.price) ||
    (product.stock ?? 0) < 0
  )
    throw new Error("Revisa nombre, precio y stock.");
  publish({
    ...state,
    products: state.products.some((p) => p.id === product.id)
      ? state.products.map((p) => (p.id === product.id ? product : p))
      : [...state.products, product],
  });
}
export function deleteProduct(id: string) {
  requireRole(["administrador"]);
  publish({
    ...state,
    products: state.products.map((p) =>
      p.id === id ? { ...p, active: false } : p,
    ),
  });
}
export function saveSupply(supply: Supply) {
  requireRole(["administrador"]);
  if (
    !supply.name.trim() ||
    [supply.stock, supply.min, supply.cost].some(
      (n) => !Number.isFinite(n) || n < 0,
    )
  )
    throw new Error("Revisa los datos del insumo.");
  publish({
    ...state,
    supplies: [...state.supplies.filter((s) => s.id !== supply.id), supply],
  });
}
export function deleteSupply(id: string) {
  requireRole(["administrador"]);
  publish({ ...state, supplies: state.supplies.filter((s) => s.id !== id) });
}
export function moveSupply(id: string, amount: number, note: string) {
  requireRole(["administrador"]);
  const supply = state.supplies.find((s) => s.id === id);
  if (
    !supply ||
    !Number.isFinite(amount) ||
    amount === 0 ||
    supply.stock + amount < 0
  )
    throw new Error("Movimiento inválido.");
  publish({
    ...state,
    supplies: state.supplies.map((s) =>
      s.id === id ? { ...s, stock: s.stock + amount } : s,
    ),
    movements: [
      {
        id: crypto.randomUUID(),
        supplyId: id,
        name: supply.name,
        amount,
        note,
        date: new Date().toISOString(),
      },
      ...state.movements,
    ],
  });
}
export function saveOffer(offer: Offer) {
  requireRole(["administrador"]);
  if (
    !offer.name.trim() ||
    offer.percent < 0 ||
    offer.percent > 100 ||
    offer.end < offer.start ||
    offer.limit < 1
  )
    throw new Error("Revisa los datos de la promoción.");
  publish({
    ...state,
    offers: [...state.offers.filter((o) => o.id !== offer.id), offer],
  });
}
export function saveSupplier(supplier: Supplier) {
  requireRole(["administrador"]);
  if (!supplier.name.trim()) throw new Error("Ingresa el proveedor.");
  publish({
    ...state,
    suppliers: [
      ...state.suppliers.filter((s) => s.id !== supplier.id),
      supplier,
    ],
  });
}
export function saveSettings(settings: Settings) {
  requireRole(["administrador"]);
  if (
    settings.target < 1 ||
    settings.tax < 0 ||
    settings.tax > 100 ||
    !settings.name.trim()
  )
    throw new Error("Revisa la configuración.");
  publish({ ...state, settings });
}
export function seedKitchenPreview() {
  requireRole(["administrador", "cocina"]);
  if (state.orders.some((order) => order.customerId === "kitchen-preview"))
    throw new Error("La muestra de cocina ya está cargada.");
  const now = Date.now();
  const names = [
    "Carlos Mendoza",
    "Ana Torres",
    "Luis García",
    "María López",
    "Juan Pérez",
    "Lucía Sánchez",
    "Andrés Vega",
    "Sofía Morales",
  ];
  const stages: Status[] = [
    "Recibido",
    "Recibido",
    "Recibido",
    "Recibido",
    "Recibido",
    "En preparación",
    "En preparación",
    "En preparación",
    "Listo",
    "Listo",
    "En camino",
    ...Array<Status>(10).fill("Entregado"),
    "Cancelado",
    "Cancelado",
  ];
  const foods = state.products.filter((product) =>
    ["pollo", "combos", "parrillas"].includes(product.category),
  );
  const timestamp = (ago: number) => new Date(now - ago * 60000).toISOString();
  const orders: Order[] = stages.map((status, index) => {
    const channel: Channel = ["Delivery", "Salón", "Recojo"][
      index % 3
    ] as Channel;
    const preparation = [11, 17, 22, 28][index % 4];
    const age =
      index < 5
        ? [8, 12, 15, 5, 18][index]
        : index < 8
          ? [12, 16, 65][index - 5]
          : index < 11
            ? 30 + index
            : 60 + (index - 11) * 22;
    const created = timestamp(age);
    const accepted = timestamp(Math.max(0, age - 1));
    const ready = new Date(
      Date.parse(accepted) + preparation * 60000,
    ).toISOString();
    const product =
      foods[index % Math.max(1, foods.length)] ||
      state.products[index % state.products.length];
    const items: Line[] = [{ product, count: 1 }];
    const side = state.products.find(
      (item) => item.id === "acompanamientos-01",
    );
    const drink = state.products.find((item) => item.id === "bebidas-01");
    if (side) items.push({ product: side, count: 1 });
    if (drink && index % 2 === 0) items.push({ product: drink, count: 1 });
    const prepared = ["Listo", "En camino", "Entregado"].includes(status);
    return {
      id: `COCINA-DEMO-${String(index + 1).padStart(3, "0")}`,
      customerId: "kitchen-preview",
      customer: names[index % names.length],
      phone: "",
      email: "",
      address:
        channel === "Delivery"
          ? [
              "Av. Primavera 123, Santiago de Surco",
              "Calle Los Robles 456, Miraflores",
              "Av. Javier Prado 1234, Lima",
            ][index % 3]
          : "",
      channel,
      table: channel === "Salón" ? (index % 12) + 1 : null,
      items,
      notes:
        index === 0 || index === 3
          ? "Urgente · pedido de demostración"
          : "Datos de demostración",
      status,
      created,
      ...(status !== "Recibido" && status !== "Cancelado" ? { accepted } : {}),
      ...(prepared ? { ready } : {}),
      ...(status === "Entregado"
        ? { delivered: new Date(Date.parse(ready) + 4 * 60000).toISOString() }
        : {}),
      discount: 0,
      shipping: channel === "Delivery" ? 7 : 0,
      method: "Efectivo",
      paid: false,
      history: [
        { status: "Recibido", date: created },
        ...(status !== "Recibido" && status !== "Cancelado"
          ? [{ status: "En preparación", date: accepted }]
          : []),
        ...(prepared ? [{ status: "Listo", date: ready }] : []),
        ...(status === "Entregado" ||
        status === "En camino" ||
        status === "Cancelado"
          ? [{ status, date: timestamp(Math.max(0, age - preparation - 5)) }]
          : []),
      ],
    };
  });
  publish({ ...state, orders: [...orders, ...state.orders] });
}

export function seedExampleOrders() {
  requireRole(["administrador"]);
  if (state.orders.some((o) => o.customerId === "example"))
    throw new Error("Ya se cargaron pedidos de ejemplo.");
  const now = Date.now();
  const stages: Status[] = [
    "Recibido",
    "Recibido",
    "Recibido",
    "En preparación",
    "En preparación",
    "En preparación",
    "Listo",
    "Listo",
    "Entregado",
    "Entregado",
    "Entregado",
    "Entregado",
    "Entregado",
    "Entregado",
  ];
  const orders: Order[] = stages.map((status, i) => {
    const product = state.products[i % state.products.length];
    const created = new Date(
      now - (i < 6 ? i + 2 : i + 25) * 60000,
    ).toISOString();
    return {
      id: `EJEMPLO-${1052 + i}`,
      customerId: "example",
      customer: "Cliente de ejemplo",
      phone: "",
      email: "",
      address: "Dirección de ejemplo",
      channel: i % 2 ? "Salón" : "Delivery",
      table: i % 2 ? (i % 12) + 1 : null,
      items: [
        { product, count: 1 },
        {
          product: state.products.find((p) => p.id === "acompanamientos-01")!,
          count: 1,
        },
        {
          product: state.products.find((p) => p.id === "bebidas-01")!,
          count: 1,
        },
      ],
      notes: i === 2 ? "Sin cebolla, por favor" : "",
      status,
      created,
      discount: 0,
      shipping: i % 2 ? 0 : 7,
      method: "Efectivo",
      paid: false,
      history: [{ status, date: created }],
      ...(status !== "Recibido" ? { accepted: created } : {}),
      ...(status === "Listo" || status === "Entregado"
        ? { ready: new Date(Date.parse(created) + 18 * 60000).toISOString() }
        : {}),
      ...(status === "Entregado"
        ? {
            delivered: new Date(Date.parse(created) + 20 * 60000).toISOString(),
          }
        : {}),
    };
  });
  publish({
    ...state,
    orders: [...orders, ...state.orders],
    tables: state.tables.map((t) =>
      orders.some((o) => o.table === t.id) ? { ...t, status: "Ocupada" } : t,
    ),
  });
}

window.addEventListener("lys-operations", () => {
  state = read();
  listeners.forEach((listener) => listener());
});
