import { Icon, ProductSummary } from "./OperationsVisuals";
import { dateText, printLocal } from "./operationsFiles";
import { useState } from "react";
import { currentUser } from "../../services/localAuth";
import { categories } from "../carta/catalog";
import {
  createOrder,
  editOrder,
  money,
  orderTotal,
  updateTable,
  useOperations,
  changeStatus,
  sendDraft,
  type Line,
  type Order,
} from "./operationsStore";
import {
  Badge,
  Empty,
  OrderDetail,
  Panel,
  Stats,
  Tabs,
  Bars,
} from "./OperationsUI";
export function TableMap({
  selected,
  onSelect,
  zone = "Todas",
  query = "",
  filter = "Todos",
  list = false,
}: {
  selected: number;
  onSelect: (id: number) => void;
  zone?: string;
  query?: string;
  filter?: string;
  list?: boolean;
}) {
  const state = useOperations();
  return (
    <div
      className={`ops-floor ${list ? "list" : ""}`}
      aria-label="Plano de mesas"
    >
      {state.tables
        .filter(
          (t) =>
            (zone === "Todas" || t.zone === zone) &&
            (!query ||
              `m${t.id}`.includes(query.toLowerCase()) ||
              `${t.id}` === query) &&
            (filter === "Todos" || t.status === filter),
        )
        .map((t) => (
          <button
            key={t.id}
            className={`ops-table-seat ${selected === t.id ? "selected" : ""}`}
            aria-pressed={selected === t.id}
            onClick={() => onSelect(t.id)}
          >
            <i className="ops-chair-left" aria-hidden="true" />
            <i className="ops-chair-right" aria-hidden="true" />
            <strong>M{t.id}</strong>
            <Badge value={t.status} />
            <small>{t.seats} personas</small>
          </button>
        ))}
    </div>
  );
}
export function NewOrder({
  notify,
  navigate,
}: {
  notify: (task: () => void) => void;
  navigate: (path: string) => void;
}) {
  const state = useOperations();
  const [table, setTable] = useState(
    Number(new URLSearchParams(location.search).get("mesa")) || 1,
  );
  const [category, setCategory] = useState("todos");
  const [search, setSearch] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [notes, setNotes] = useState("");
  const [customer, setCustomer] = useState("");
  const [tab, setTab] = useState("Productos");
  const change = (id: string, delta: number) =>
    setLines((old) =>
      old
        .map((l) =>
          l.product.id === id
            ? { ...l, count: Math.min(99, l.count + delta) }
            : l,
        )
        .filter((l) => l.count > 0),
    );
  const submit = (draft: boolean) =>
    notify(() => {
      createOrder({
        customerId: currentUser()!.id,
        customer: customer || `Mesa ${table}`,
        phone: "",
        email: "",
        address: "",
        channel: "Salón",
        table,
        items: lines,
        notes,
        discount: 0,
        shipping: 0,
        method: "",
        draft,
      });
      setLines([]);
      navigate("/mesera/pedidos");
    });
  return (
    <>
      <div className="ops-table-strip">
        {state.tables.map((t) => (
          <button
            key={t.id}
            className={table === t.id ? "selected" : ""}
            onClick={() => setTable(t.id)}
          >
            <strong>M{t.id}</strong>
            <Badge value={t.status} />
          </button>
        ))}
      </div>
      <div className="ops-two-main">
        <Panel title="Elige del menú">
          <div className="ops-toolbar">
            <Tabs
              options={["todos", ...categories.map((c) => c.id)]}
              value={category}
              onChange={setCategory}
            />
            <input
              aria-label="Buscar productos del pedido"
              placeholder="Buscar productos…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="ops-product-grid">
            {state.products
              .filter(
                (p) =>
                  p.active &&
                  (p.stock ?? 0) > 0 &&
                  (category === "todos" || p.category === category) &&
                  p.name.toLowerCase().includes(search.toLowerCase()),
              )
              .map((p) => (
                <article key={p.id}>
                  <img src={p.image} alt={p.name} />
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <div>
                    <strong>{money(p.price)}</strong>
                    <button
                      className="ops-primary"
                      onClick={() =>
                        setLines((old) =>
                          old.some((l) => l.product.id === p.id)
                            ? old.map((l) =>
                                l.product.id === p.id
                                  ? { ...l, count: Math.min(99, l.count + 1) }
                                  : l,
                              )
                            : [...old, { product: p, count: 1 }],
                        )
                      }
                    >
                      + Agregar
                    </button>
                  </div>
                </article>
              ))}
          </div>
        </Panel>
        <Panel title={`Pedido de Mesa ${table}`}>
          <Tabs
            options={["Productos", "Cliente", "Notas"]}
            value={tab}
            onChange={setTab}
          />
          {tab === "Cliente" ? (
            <label>
              Nombre del cliente (opcional)
              <input
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
              />
            </label>
          ) : tab === "Notas" ? (
            <label>
              Notas para cocina
              <textarea
                value={notes}
                maxLength={500}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
          ) : (
            <>
              {lines.map((l) => (
                <div className="ops-cart-line" key={l.product.id}>
                  <div className="ops-quantity">
                    <button
                      aria-label={`Quitar uno ${l.product.name}`}
                      onClick={() => change(l.product.id, -1)}
                    >
                      −
                    </button>
                    <span>{l.count}</span>
                    <button
                      aria-label={`Agregar uno ${l.product.name}`}
                      onClick={() => change(l.product.id, 1)}
                    >
                      +
                    </button>
                  </div>
                  <span>{l.product.name}</span>
                  <strong>{money(l.count * l.product.price)}</strong>
                  <button
                    aria-label={`Eliminar ${l.product.name}`}
                    onClick={() =>
                      setLines((old) =>
                        old.filter((line) => line.product.id !== l.product.id),
                      )
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
              {!lines.length && <Empty>Agrega productos al pedido.</Empty>}
              <label>
                Notas para cocina
                <textarea
                  value={notes}
                  maxLength={500}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </label>
            </>
          )}
          <h3 className="ops-total">
            Total{" "}
            <strong>
              {money(
                lines.reduce((sum, l) => sum + l.product.price * l.count, 0),
              )}
            </strong>
          </h3>
          <div className="ops-card-actions">
            <button
              className="ops-outline"
              disabled={!lines.length}
              onClick={() => submit(true)}
            >
              <Icon name="save" /> Guardar como pendiente
            </button>
            <button
              className="ops-primary"
              disabled={!lines.length}
              onClick={() => submit(false)}
            >
              <Icon name="send" /> Enviar a cocina
            </button>
          </div>
        </Panel>
      </div>
    </>
  );
}
export function WaiterViews({
  section,
  notify,
  navigate,
}: {
  section: string;
  notify: (task: () => void) => void;
  navigate: (path: string) => void;
}) {
  const state = useOperations();
  const [selected, setSelected] = useState(1);
  const [zone, setZone] = useState("Salón principal");
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [list, setList] = useState(false);
  const [tab, setTab] = useState("Pedido actual");
  const [detail, setDetail] = useState<Order | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const orders = state.orders.filter((o) => o.channel === "Salón");
  const table = state.tables.find((t) => t.id === selected)!;
  const active = orders.filter(
    (o) => o.table === selected && !o.paid && o.status !== "Cancelado",
  );
  const stats: Parameters<typeof Stats>[0]["entries"] = [
    {
      label: "Mesas disponibles",
      value: state.tables.filter((t) => t.status === "Libre").length,
      icon: "table" as const,
      tone: "green",
    },
    {
      label: "Mesas ocupadas",
      value: state.tables.filter((t) => t.status === "Ocupada").length,
      icon: "users" as const,
    },
    {
      label: section === "mesas" ? "Mesas reservadas" : "Pedidos pendientes",
      value:
        section === "mesas"
          ? state.tables.filter((t) => t.status === "Reservada").length
          : orders.filter((o) => o.status === "Recibido").length,
      icon: "receipt" as const,
      tone: "gold",
    },
    {
      label: section === "mesas" ? "Solicita cuenta" : "Listos para entregar",
      value:
        section === "mesas"
          ? state.tables.filter((t) => t.status === "Solicita cuenta").length
          : orders.filter((o) => o.status === "Listo").length,
      icon: "check" as const,
      tone: "blue",
    },
  ];
  if (section === "")
    stats.push({
      label: "Ventas del turno",
      value: money(
        state.payments
          .filter(
            (p) =>
              !p.refunded &&
              state.shifts.some(
                (shift) => shift.id === p.shiftId && !shift.closed,
              ) &&
              orders.some((o) => o.id === p.orderId),
          )
          .reduce((sum, p) => sum + p.amount, 0),
      ),
      icon: "cash",
      tone: "gold",
    });
  if (section === "nuevo-pedido")
    return <NewOrder notify={notify} navigate={navigate} />;
  const tableDetail = (
    <Panel title={`Mesa ${selected}`}>
      <Badge value={table.status} />
      <p>{table.seats} personas</p>
      <Tabs
        options={["Pedido actual", "Historial", "Notas"]}
        value={tab}
        onChange={setTab}
      />
      {tab === "Notas" ? (
        <>
          <label>
            Notas de la mesa
            <textarea
              value={note ?? table.notes}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
          <button
            className="ops-primary"
            onClick={() =>
              notify(() =>
                updateTable(selected, { notes: note ?? table.notes }),
              )
            }
          >
            <Icon name="save" /> Guardar notas
          </button>
        </>
      ) : tab === "Historial" ? (
        orders
          .filter((o) => o.table === selected)
          .map((o) => (
            <button
              className="ops-priority"
              key={o.id}
              onClick={() => setDetail(o)}
            >
              #{o.id} · {o.status} · {money(orderTotal(o))}
            </button>
          ))
      ) : (
        <>
          {active.map((o) => (
            <div key={o.id}>
              <h3>
                #{o.id} <Badge value={o.status} />
              </h3>
              {o.items.map((l) => (
                <p key={l.product.id}>
                  {l.count} {l.product.name}{" "}
                  <strong>{money(l.product.price * l.count)}</strong>
                </p>
              ))}
              {o.status === "Listo" && (
                <button
                  className="ops-primary"
                  onClick={() => notify(() => changeStatus(o.id, "Entregado"))}
                >
                  <Icon name="serve" /> Entregar pedido
                </button>
              )}
            </div>
          ))}
          {!active.length && <Empty>La mesa no tiene consumo pendiente.</Empty>}
          <h3 className="ops-total">
            Total{" "}
            <strong>
              {money(active.reduce((sum, o) => sum + orderTotal(o), 0))}
            </strong>
          </h3>
        </>
      )}
      <div className="ops-stack-actions">
        <button
          className="ops-primary"
          onClick={() => navigate(`/mesera/nuevo-pedido?mesa=${selected}`)}
        >
          <Icon name="plus" /> Agregar pedido
        </button>
        <button
          className="ops-blue"
          disabled={!active.length}
          onClick={() =>
            notify(() => updateTable(selected, { status: "Solicita cuenta" }))
          }
        >
          <Icon name="receipt" /> Solicitar cuenta
        </button>
        <button
          className="ops-green"
          onClick={() =>
            notify(() => updateTable(selected, { status: "Libre" }))
          }
        >
          <Icon name="table" /> Liberar mesa
        </button>
        <button
          className="ops-outline"
          onClick={() =>
            notify(() =>
              updateTable(selected, {
                status: table.status === "Reservada" ? "Libre" : "Reservada",
              }),
            )
          }
        >
          {table.status === "Reservada" ? "Cancelar reserva" : "Reservar mesa"}
        </button>
      </div>
    </Panel>
  );
  return (
    <>
      <Stats entries={stats} />
      {section === "" ? (
        <div className="ops-equal-cols">
          <Panel title="Mapa del salón">
            <TableMap
              selected={selected}
              onSelect={(id) => {
                setSelected(id);
                setNote(null);
              }}
            />
          </Panel>
          <Panel
            title="Pedidos recientes"
            action={
              <button
                className="ops-outline"
                onClick={() => navigate("/mesera/pedidos")}
              >
                <Icon name="arrow" /> Ver todos
              </button>
            }
          >
            <div className="ops-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Mesa</th>
                    <th>Productos</th>
                    <th>Hora</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id}>
                      <td>M{o.table}</td>
                      <td>
                        <ProductSummary order={o} />
                      </td>
                      <td>
                        <time dateTime={o.created} title={dateText(o.created)}>
                          {new Date(o.created).toLocaleTimeString("es-PE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                      </td>
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
              </table>
            </div>
            {!orders.length && <Empty />}
            <button
              className="ops-primary"
              onClick={() => navigate("/mesera/nuevo-pedido")}
            >
              <Icon name="plus" /> Nuevo pedido
            </button>
          </Panel>
        </div>
      ) : section === "mesas" ? (
        <>
          <div className="ops-toolbar">
            <Tabs
              options={["Salón principal", "Terraza", "Zona parrilla"]}
              value={zone}
              onChange={setZone}
            />
            <input
              aria-label="Buscar mesa"
              placeholder="Buscar mesa (ej. M5)…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              aria-label="Estado de mesas"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {[
                "Todos",
                "Libre",
                "Ocupada",
                "Reservada",
                "Solicita cuenta",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button className="ops-outline" onClick={() => setList(!list)}>
              {list ? "Vista de plano" : "Vista de lista"}
            </button>
          </div>
          <div className="ops-two-main">
            <TableMap
              selected={selected}
              onSelect={(id) => {
                setSelected(id);
                setNote(null);
              }}
              zone={zone}
              query={search}
              filter={filter}
              list={list}
            />
            {tableDetail}
          </div>
        </>
      ) : section === "cierre-mesa" ? (
        <div className="ops-three-cols">
          <Panel title="Mesas en atención">
            {state.tables.map((t) => (
              <button
                className={`ops-priority ${selected === t.id ? "selected" : ""}`}
                key={t.id}
                onClick={() => setSelected(t.id)}
              >
                <strong>Mesa {t.id}</strong> <Badge value={t.status} />
              </button>
            ))}
          </Panel>
          <Panel title={`Consumo de la mesa ${selected}`}>
            {active.map((o) => (
              <div key={o.id}>
                <h3>
                  #{o.id} <Badge value={o.status} />
                </h3>
                {o.items.map((line) => (
                  <div className="ops-cart-line" key={line.product.id}>
                    <img
                      className="ops-consumption-photo"
                      src={line.product.image}
                      alt=""
                    />
                    <span>{line.product.name}</span>
                    <strong>{money(line.product.price * line.count)}</strong>
                    {o.status === "Recibido" && (
                      <div className="ops-quantity">
                        <button
                          onClick={() =>
                            notify(() =>
                              editOrder(
                                o.id,
                                o.items
                                  .map((l) =>
                                    l.product.id === line.product.id
                                      ? { ...l, count: l.count - 1 }
                                      : l,
                                  )
                                  .filter((l) => l.count > 0),
                                o.discount,
                                o.notes,
                              ),
                            )
                          }
                        >
                          −
                        </button>
                        <span>{line.count}</span>
                        <button
                          onClick={() =>
                            notify(() =>
                              editOrder(
                                o.id,
                                o.items.map((l) =>
                                  l.product.id === line.product.id
                                    ? { ...l, count: l.count + 1 }
                                    : l,
                                ),
                                o.discount,
                                o.notes,
                              ),
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
            {!active.length && <Empty />}
            <label>
              Nota de cierre
              <textarea
                value={note ?? table.notes}
                onChange={(e) => setNote(e.target.value)}
              />
            </label>
          </Panel>
          <Panel title="Resumen de cuenta">
            <h3 className="ops-total">
              Total a pagar{" "}
              <strong>
                {money(active.reduce((sum, o) => sum + orderTotal(o), 0))}
              </strong>
            </h3>
            <div className="ops-stack-actions">
              <button
                className="ops-primary"
                disabled={!active.length}
                onClick={() =>
                  notify(() =>
                    updateTable(selected, {
                      status: "Solicita cuenta",
                      notes: note ?? table.notes,
                    }),
                  )
                }
              >
                <Icon name="receipt" /> Solicitar cuenta
              </button>
              <button
                className="ops-outline"
                onClick={() =>
                  notify(() =>
                    printLocal(
                      `Cuenta Mesa ${selected}`,
                      active.flatMap((o) =>
                        o.items.map(
                          (l) =>
                            `${l.count} ${l.product.name} ${money(l.product.price * l.count)}`,
                        ),
                      ),
                    ),
                  )
                }
              >
                <Icon name="print" /> Imprimir cuenta
              </button>
              <button
                className="ops-outline"
                onClick={() =>
                  navigate(`/mesera/nuevo-pedido?mesa=${selected}`)
                }
              >
                <Icon name="plus" /> Agregar producto
              </button>
              <button
                className="ops-green"
                onClick={() =>
                  notify(() => updateTable(selected, { status: "Libre" }))
                }
              >
                <Icon name="table" /> Liberar mesa
              </button>
            </div>
          </Panel>
        </div>
      ) : (
        <>
          <div className="ops-toolbar">
            <Tabs
              options={[
                "Todos",
                "Recibido",
                "En preparación",
                "Listo",
                "Entregado",
                "Borradores",
              ]}
              value={filter}
              onChange={setFilter}
            />
            <input
              aria-label="Buscar pedidos de salón"
              placeholder="Buscar mesa, producto o pedido…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="ops-primary"
              onClick={() => navigate("/mesera/nuevo-pedido")}
            >
              <Icon name="plus" /> Nuevo pedido
            </button>
          </div>
          <div className="ops-two-main">
            <Panel title="Pedidos de salón">
              <div className="ops-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Mesa</th>
                      <th>N° pedido</th>
                      <th>Productos</th>
                      <th>Hora</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter(
                        (o) =>
                          (filter === "Todos" ||
                            (filter === "Borradores"
                              ? o.draft
                              : o.status === filter && !o.draft)) &&
                          `${o.id} ${o.table} ${o.items.map((l) => l.product.name).join(" ")}`
                            .toLowerCase()
                            .includes(search.toLowerCase()),
                      )
                      .map((o) => (
                        <tr key={o.id}>
                          <td>{o.table}</td>
                          <td>#{o.id}</td>
                          <td>
                            <ProductSummary order={o} />
                          </td>
                          <td>
                            <time
                              dateTime={o.created}
                              title={dateText(o.created)}
                            >
                              {new Date(o.created).toLocaleTimeString("es-PE", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </time>
                          </td>
                          <td>{money(orderTotal(o))}</td>
                          <td>
                            <Badge value={o.draft ? "Borrador" : o.status} />
                          </td>
                          <td>
                            <div className="ops-stack-actions">
                              <button
                                className="ops-outline"
                                onClick={() => setDetail(o)}
                              >
                                <Icon name="eye" /> Ver detalle
                              </button>
                              {o.draft ? (
                                <button
                                  className="ops-primary"
                                  onClick={() => notify(() => sendDraft(o.id))}
                                >
                                  <Icon name="send" /> Enviar a cocina
                                </button>
                              ) : o.status === "Listo" ? (
                                <button
                                  className="ops-green"
                                  onClick={() =>
                                    notify(() =>
                                      changeStatus(o.id, "Entregado"),
                                    )
                                  }
                                >
                                  <Icon name="serve" /> Entregar
                                </button>
                              ) : null}
                              <button
                                className="ops-outline"
                                onClick={() =>
                                  navigate(
                                    `/mesera/nuevo-pedido?mesa=${o.table}`,
                                  )
                                }
                              >
                                <Icon name="plus" /> Agregar producto
                              </button>
                              <button
                                className="ops-outline"
                                onClick={() =>
                                  notify(() =>
                                    updateTable(o.table!, {
                                      status: "Solicita cuenta",
                                    }),
                                  )
                                }
                              >
                                <Icon name="receipt" /> Solicitar cuenta
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!orders.length && <Empty />}
            </Panel>
            <div>
              <Panel title="Pedidos por estado">
                <Bars
                  values={[
                    "Recibido",
                    "En preparación",
                    "Listo",
                    "Entregado",
                  ].map((label) => ({
                    label,
                    value: orders.filter((o) => o.status === label).length,
                  }))}
                />
              </Panel>
              <aside className="ops-service-banner">
                <strong>
                  Buen servicio,
                  <br />
                  grandes momentos
                </strong>
                <p>Leñas y Sabores</p>
              </aside>
            </div>
          </div>
        </>
      )}
      {section === "" && (
        <Panel title="Tareas del turno">
          <div className="ops-three">
            <button onClick={() => navigate("/mesera/cierre-mesa")}>
              <strong>Solicitar cuentas</strong>
              <span>
                {
                  state.tables.filter((t) => t.status === "Solicita cuenta")
                    .length
                }{" "}
                mesas esperan el cobro
              </span>
            </button>
            <button onClick={() => navigate("/mesera/pedidos")}>
              <strong>Entregar pedidos</strong>
              <span>
                {orders.filter((o) => o.status === "Listo").length} listos para
                servir
              </span>
            </button>
            <button onClick={() => navigate("/mesera/mesas")}>
              <strong>Liberar mesas</strong>
              <span>
                {
                  state.tables.filter(
                    (t) =>
                      t.status !== "Libre" &&
                      orders.some((o) => o.table === t.id) &&
                      !orders.some(
                        (o) =>
                          o.table === t.id &&
                          !o.paid &&
                          o.status !== "Cancelado",
                      ),
                  ).length
                }{" "}
                mesas con todos sus pedidos cobrados
              </span>
            </button>
          </div>
        </Panel>
      )}
      {detail && (
        <OrderDetail
          order={state.orders.find((o) => o.id === detail.id) || detail}
          onClose={() => setDetail(null)}
        />
      )}
    </>
  );
}
