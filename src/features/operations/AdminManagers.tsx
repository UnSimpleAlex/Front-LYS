import { OperationsDialog } from "./OperationsDialog";
import { OperationsTable } from "./OperationsTable";
import { SupplySummary, Icon, UserSummary } from "./OperationsVisuals";
import { useState } from "react";
import {
  createLocalUser,
  editLocalUser,
  readUsers,
  roleNames,
  useSession,
  type Role,
  type LocalUser,
} from "../../services/localAuth";
import {
  useOperations,
  saveOffer,
  saveSupply,
  deleteSupply,
  moveSupply,
  saveSupplier,
  money,
  type Offer,
  type Supply,
  type Supplier,
} from "./operationsStore";
import { Panel, Stats, Badge, Tabs, Empty } from "./OperationsUI";
export { ProductManager } from "./ProductManager";
const blankOffer = (): Offer => ({
  id: crypto.randomUUID(),
  name: "",
  type: "Combo",
  productId: "",
  percent: 10,
  code: "",
  start: new Date().toISOString().slice(0, 10),
  end: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  active: true,
  used: 0,
  limit: 100,
});
export function PromotionManager({
  notify,
}: {
  notify: (task: () => void) => void;
}) {
  const data = useOperations();
  const [offer, setOffer] = useState(blankOffer);
  const [editorOpen, setEditorOpen] = useState(false);
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  return (
    <>
      <Stats
        entries={[
          {
            label: "Promociones activas",
            value: data.offers.filter((o) => o.active).length,
          },
          {
            label: "Cupones usados",
            value: data.offers.reduce((s, o) => s + o.used, 0),
            tone: "gold",
          },
          { label: "Promociones creadas", value: data.offers.length },
        ]}
      />
      <div className="ops-with-sidebar">
        <Panel
          title="Promociones"
          action={
            <button onClick={() => {setOffer(blankOffer());setEditorOpen(true);}}>
              ＋ Nueva promoción
            </button>
          }
        >
          <div className="ops-toolbar">
            <Tabs
              options={["Todos", "Combo", "Descuento", "Cupón"]}
              value={filter}
              onChange={setFilter}
            />
            <input aria-label="Buscar promociones"
              placeholder="Buscar promociones…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="ops-table-wrap">
            <OperationsTable>
              <thead>
                <tr>
                  <th>Promoción</th>
                  <th>Tipo</th>
                  <th>Vigencia</th>
                  <th>Uso / Límite</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.offers
                  .filter(
                    (o) =>
                      (filter === "Todos" || o.type === filter) &&
                      o.name.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((o) => (
                    <tr key={o.id}>
                      <td>
                        <div className="ops-promotion-photo">
                          <img
                            src={
                              data.products.find((p) => p.id === o.productId)
                                ?.image || "/images/promotions/familiar.webp"
                            }
                            alt=""
                          />
                          <span>-{o.percent}%</span>
                        </div>
                        <strong>{o.name}</strong>
                        <small>
                          {o.percent}% ·{" "}
                          {o.code ||
                            data.products.find((p) => p.id === o.productId)
                              ?.name}
                        </small>
                      </td>
                      <td>
                        <Badge value={o.type} />
                      </td>
                      <td>
                        {o.start}
                        <br />
                        {o.end}
                      </td>
                      <td>
                        {o.used} / {o.limit}
                      </td>
                      <td>
                        <button
                          className={`ops-switch ${o.active ? "on" : ""}`}
                          aria-label={`Activar ${o.name}`}
                          aria-pressed={o.active}
                          onClick={() =>
                            notify(() => saveOffer({ ...o, active: !o.active }))
                          }
                        />
                      </td>
                      <td>
                        <div className="ops-actions">
                          <button onClick={() => {setOffer({ ...o });setEditorOpen(true);}}>
                            <Icon name="edit" /> Editar
                          </button>
                          <button
                            onClick={() =>
                              notify(() =>
                                saveOffer({
                                  ...o,
                                  id: crypto.randomUUID(),
                                  name: o.name + " (copia)",
                                  code: "",
                                  used: 0,
                                  active: false,
                                }),
                              )
                            }
                          >
                            <Icon name="copy" /> Duplicar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </OperationsTable>
            {!data.offers.length && (
              <Empty>Crea una promoción para mostrarla en la carta.</Empty>
            )}
          </div>
        </Panel>
        {editorOpen && <OperationsDialog onClose={() => setEditorOpen(false)} title="Crear / Editar promoción">
          <form
            className="ops-form"
            onSubmit={(e) => {
              e.preventDefault();
              notify(() => {
                if (offer.type === "Cupón" && !offer.code.trim())
                  throw new Error("Ingresa un código de cupón.");
                if (offer.type !== "Cupón" && !offer.productId)
                  throw new Error("Selecciona un producto.");
                saveOffer(offer);
                setOffer(blankOffer());
                setEditorOpen(false);
              });
            }}
          >
            <label>
              Nombre
              <input
                required
                value={offer.name}
                onChange={(e) => setOffer({ ...offer, name: e.target.value })}
              />
            </label>
            <label>
              Tipo
              <select
                value={offer.type}
                onChange={(e) => setOffer({ ...offer, type: e.target.value })}
              >
                {["Combo", "Descuento", "Cupón"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label>
              Producto aplicable
              <select
                value={offer.productId}
                onChange={(e) =>
                  setOffer({ ...offer, productId: e.target.value })
                }
              >
                <option value="">Todos (solo cupón)</option>
                {data.products
                  .filter((p) => p.active)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Descuento (%)
              <input
                type="number"
                min="0"
                max="100"
                required
                value={offer.percent}
                onChange={(e) =>
                  setOffer({ ...offer, percent: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Fecha de inicio
              <input
                type="date"
                required
                value={offer.start}
                onChange={(e) => setOffer({ ...offer, start: e.target.value })}
              />
            </label>
            <label>
              Fecha de fin
              <input
                type="date"
                required
                value={offer.end}
                onChange={(e) => setOffer({ ...offer, end: e.target.value })}
              />
            </label>
            <label>
              Código de cupón
              <input
                value={offer.code}
                onChange={(e) =>
                  setOffer({ ...offer, code: e.target.value.toUpperCase() })
                }
              />
            </label>
            <label>
              Límite de usos
              <input
                type="number"
                min="1"
                value={offer.limit}
                onChange={(e) =>
                  setOffer({ ...offer, limit: Number(e.target.value) })
                }
              />
            </label>
            <label className="ops-check">
              <input
                type="checkbox"
                checked={offer.active}
                onChange={(e) =>
                  setOffer({ ...offer, active: e.target.checked })
                }
              />
              Promoción activa
            </label>
            <button className="ops-primary">
              <Icon name="save" /> Guardar promoción
            </button>
          </form>
        </OperationsDialog>}
      </div>
    </>
  );
}
export function UserManager({
  clients = false,
  notify,
}: {
  clients?: boolean;
  notify: (task: () => void) => void;
}) {
  useSession();
  const data = useOperations();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [editing, setEditing] = useState<LocalUser | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [view, setView] = useState<LocalUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>(clients ? "cliente" : "mesera");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const users = readUsers().filter((u) =>
    clients ? u.role === "cliente" : u.role !== "cliente",
  );
  const select = (u: LocalUser) => {
    setEditorOpen(true);
    setEditing(u);
    setName(u.name);
    setEmail(u.email);
    setPhone(u.phone);
    setRole(u.role);
  };
  const reset = () => {
    setEditorOpen(false);
    setEditing(null);
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
  };
  return (
    <>
      <Stats
        entries={[
          {
            label: clients ? "Clientes registrados" : "Usuarios activos",
            value: users.filter((u) => u.active).length,
          },
          {
            label: clients ? "Clientes frecuentes" : "Administradores",
            value: users.filter((u) =>
              clients
                ? data.orders.filter((o) => o.customerId === u.id).length > 5
                : u.role === "administrador",
            ).length,
            tone: "gold",
          },
          { label: "Cuentas creadas", value: users.length },
        ]}
      />
      <div className="ops-with-sidebar">
        <Panel
          title={clients ? "Gestión de clientes" : "Usuarios del equipo"}
          action={
            <button className="ops-primary" onClick={() => {reset();setEditorOpen(true);}}>
              ＋ Nueva cuenta
            </button>
          }
        >
          <div className="ops-toolbar">
            <input aria-label="Buscar nombre, correo o teléfono"
              placeholder="Buscar nombre, correo o teléfono…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {!clients && (
              <select aria-label="Filtrar resultados"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option>Todos</option>
                {Object.entries(roleNames)
                  .filter(([r]) => r !== "cliente")
                  .map(([r, n]) => (
                    <option key={r} value={r}>
                      {n}
                    </option>
                  ))}
              </select>
            )}
          </div>
          <div className="ops-table-wrap">
            <OperationsTable>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>{clients ? "Pedidos / Gasto" : "Rol"}</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(
                    (u) =>
                      (filter === "Todos" || u.role === filter) &&
                      `${u.name} ${u.email} ${u.phone}`
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                  )
                  .map((u) => (
                    <tr key={u.id}>
                      <td>
                        <UserSummary name={u.name} detail={u.phone} />
                      </td>
                      <td>{u.email}</td>
                      <td>
                        {clients ? (
                          `${data.orders.filter((o) => o.customerId === u.id).length} / ${money(data.orders.filter((o) => o.customerId === u.id && o.paid).reduce((s, o) => s + o.items.reduce((s, l) => s + l.count * l.product.price, 0), 0))}`
                        ) : (
                          <Badge value={roleNames[u.role]} />
                        )}
                      </td>
                      <td>
                        <button
                          className={`ops-switch ${u.active ? "on" : ""}`}
                          aria-label={`Estado de ${u.name}`}
                          aria-pressed={u.active}
                          onClick={() =>
                            notify(() =>
                              editLocalUser(u.id, { active: !u.active }),
                            )
                          }
                        />
                      </td>
                      <td>
                        <div className="ops-actions">
                          <button onClick={() => setView(u)}>
                            <Icon name="eye" /> Ver
                          </button>
                          <button onClick={() => select(u)}>
                            <Icon name="edit" /> Editar
                          </button>
                          <button
                            onClick={() =>
                              notify(() =>
                                editLocalUser(u.id, { active: false }),
                              )
                            }
                          >
                            <Icon name="trash" /> Desactivar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </OperationsTable>
            {!users.length && <Empty />}
          </div>
        </Panel>
        <div>
          {!clients && (
            <Panel title="Roles y permisos">
              {Object.entries(roleNames)
                .filter(([r]) => r !== "cliente")
                .map(([r, n]) => (
                  <p key={r}>
                    <strong>{n}</strong>
                    <small>
                      {r === "administrador"
                        ? "Acceso completo"
                        : r === "mesera"
                          ? "Gestiona mesas y pedidos de salón"
                          : r === "cocina"
                            ? "Acepta y prepara pedidos"
                            : r === "caja"
                              ? "Registra cobros y comprobantes"
                              : "Gestiona entregas de delivery"}
                    </small>
                  </p>
                ))}
            </Panel>
          )}
          {editorOpen && <OperationsDialog onClose={() => setEditorOpen(false)} title={editing ? "Editar cuenta" : "Nueva cuenta"}>
            <form
              className="ops-form"
              onSubmit={(e) => {
                e.preventDefault();
                setError("");
                if (editing)
                  notify(() => {
                    editLocalUser(editing.id, { name, email, phone, role });
                    reset();
                  });
                else
                  void createLocalUser(
                    { name, email, phone, role, password },
                    true,
                  )
                    .then(reset)
                    .catch((err) => setError(err.message));
              }}
            >
              <label>
                Nombre completo
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label>
                Correo electrónico
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                Teléfono
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              {!clients && (
                <label>
                  Rol
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                  >
                    {Object.entries(roleNames)
                      .filter(([r]) => r !== "cliente")
                      .map(([r, n]) => (
                        <option key={r} value={r}>
                          {n}
                        </option>
                      ))}
                  </select>
                </label>
              )}
              {!editing && (
                <label>
                  Contraseña inicial
                  <input
                    required
                    minLength={8}
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
              )}
              {error && <p role="alert">{error}</p>}
              <button className="ops-primary">
                {editing ? "Guardar cambios" : "Crear cuenta"}
              </button>
            </form>
          </OperationsDialog>}
          {view && (
            <OperationsDialog title={`Historial de ${view.name}`} onClose={() => setView(null)}>
              <p>
                {view.email} · {view.phone}
              </p>
              {data.orders
                .filter((o) => o.customerId === view.id)
                .map((o) => (
                  <p key={o.id}>
                    #{o.id} · <Badge value={o.status} />
                  </p>
                ))}
              {!data.orders.some((o) => o.customerId === view.id) && (
                <Empty>Sin pedidos.</Empty>
              )}
            </OperationsDialog>
          )}
        </div>
      </div>
    </>
  );
}
const blankSupply = (): Supply => ({
  id: crypto.randomUUID(),
  name: "",
  category: "Carnes",
  stock: 0,
  min: 0,
  unit: "unidades",
  cost: 0,
});
export function InventoryManager({
  notify,
}: {
  notify: (task: () => void) => void;
}) {
  const data = useOperations();
  const [tab, setTab] = useState("Insumos");
  const [search, setSearch] = useState("");
  const [supply, setSupply] = useState(blankSupply);
  const [editingSupply, setEditingSupply] = useState(false);
  const [movement, setMovement] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [providerOpen, setProviderOpen] = useState(false);
  const [provider, setProvider] = useState<Supplier>({
    id: crypto.randomUUID(),
    name: "",
    phone: "",
    email: "",
  });
  return (
    <>
      <Tabs
        options={["Insumos", "Stock", "Alertas", "Proveedores"]}
        value={tab}
        onChange={setTab}
      />
      <Stats
        entries={[
          {
            label: "Valor del inventario",
            value: money(
              data.supplies.reduce((s, i) => s + i.stock * i.cost, 0),
            ),
            tone: "gold",
          },
          {
            label: "Stock bajo",
            value: data.supplies.filter((s) => s.stock < s.min).length,
          },
          { label: "Insumos activos", value: data.supplies.length },
          { label: "Proveedores", value: data.suppliers.length },
        ]}
      />
      {tab === "Proveedores" ? (
        <div className="ops-split">
          <Panel title="Proveedores" action={<button className="ops-primary" onClick={() => {setProvider({id:crypto.randomUUID(),name:"",phone:"",email:""});setProviderOpen(true);}}><Icon name="plus" />Nuevo proveedor</button>}>
            {data.suppliers.map((p) => (
              <p key={p.id}>
                {p.name} · {p.phone} · {p.email}
                <button onClick={() => {setProvider(p);setProviderOpen(true);}}>
                  <Icon name="edit" /> Editar
                </button>
              </p>
            ))}
          </Panel>
          {providerOpen && <OperationsDialog title="Proveedor" onClose={() => setProviderOpen(false)}>
            <form
              className="ops-form"
              onSubmit={(e) => {
                e.preventDefault();
                notify(() => {
                  saveSupplier(provider);
                  setProviderOpen(false);
                  setProvider({
                    id: crypto.randomUUID(),
                    name: "",
                    phone: "",
                    email: "",
                  });
                });
              }}
            >
              <label>
                Nombre
                <input
                  required
                  value={provider.name}
                  onChange={(e) =>
                    setProvider({ ...provider, name: e.target.value })
                  }
                />
              </label>
              <label>
                Teléfono
                <input
                  value={provider.phone}
                  onChange={(e) =>
                    setProvider({ ...provider, phone: e.target.value })
                  }
                />
              </label>
              <label>
                Correo
                <input
                  type="email"
                  value={provider.email}
                  onChange={(e) =>
                    setProvider({ ...provider, email: e.target.value })
                  }
                />
              </label>
              <button className="ops-primary">
                <Icon name="save" /> Guardar proveedor
              </button>
            </form>
          </OperationsDialog>}
        </div>
      ) : (
        <div className="ops-with-sidebar">
          <Panel
            title={tab === "Alertas" ? "Alertas de stock" : "Insumos"}
            action={
              <button
                onClick={() => {
                  setSupply(blankSupply());
                  setEditingSupply(true);
                }}
              >
                ＋ Nuevo insumo
              </button>
            }
          >
            <input aria-label="Buscar insumos"
              className="ops-search"
              placeholder="Buscar insumos…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="ops-table-wrap">
              <OperationsTable>
                <thead>
                  <tr>
                    {[
                      "Insumo",
                      "Stock actual",
                      "Unidad",
                      "Stock mínimo",
                      "Estado",
                      "Acciones",
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.supplies
                    .filter(
                      (s) =>
                        (tab !== "Alertas" || s.stock < s.min) &&
                        s.name.toLowerCase().includes(search.toLowerCase()),
                    )
                    .map((s) => (
                      <tr key={s.id}>
                        <td>
                          <SupplySummary name={s.name} detail={s.category} />
                        </td>
                        <td>{s.stock}</td>
                        <td>{s.unit}</td>
                        <td>{s.min}</td>
                        <td>
                          <Badge
                            value={s.stock < s.min ? "Stock bajo" : "En stock"}
                          />
                        </td>
                        <td>
                          <div className="ops-actions">
                            <button
                              onClick={() => {
                                setSupply({ ...s });
                                setEditingSupply(true);
                              }}
                            >
                              <Icon name="edit" /> Editar
                            </button>
                            <button onClick={() => setMovement(s.id)}>
                              <Icon name="plus" /> Registrar movimiento
                            </button>
                            <button
                              onClick={() => notify(() => deleteSupply(s.id))}
                            >
                              <Icon name="trash" /> Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </OperationsTable>
            </div>
            {movement && (
              <OperationsDialog title="Registrar movimiento" onClose={() => setMovement("")}>
              <form
                className="ops-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  notify(() => {
                    moveSupply(movement, quantity, "Movimiento manual");
                    setMovement("");
                  });
                }}
              >
                <label>
                  Entrada (+) o salida (−)
                  <input
                    type="number"
                    step="0.01"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </label>
                <button className="ops-primary">
                  <Icon name="save" /> Guardar movimiento
                </button>
              </form></OperationsDialog>
            )}
          </Panel>
          <div>
            <Panel title="Alertas de stock">
              {data.supplies
                .filter((s) => s.stock < s.min)
                .map((s) => (
                  <button
                    className="ops-stock-alert"
                    key={s.id}
                    onClick={() => {
                      setSupply({ ...s });
                      setEditingSupply(true);
                    }}
                  >
                    <SupplySummary
                      name={s.name}
                      detail={`Stock actual: ${s.stock} ${s.unit} | Mín: ${s.min}`}
                    />
                    <Badge value="Stock bajo" />
                    <Icon name="chevron" />
                  </button>
                ))}
              {!data.supplies.some((s) => s.stock < s.min) && (
                <Empty>Todos los insumos tienen stock suficiente.</Empty>
              )}
            </Panel>
            {editingSupply && (
              <OperationsDialog title="Editar insumo" onClose={() => setEditingSupply(false)}>
                <form
                  className="ops-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    notify(() => {
                      saveSupply(supply);
                      setSupply(blankSupply());
                      setEditingSupply(false);
                    });
                  }}
                >
                  {(["name", "category", "unit"] as const).map((field) => (
                    <label key={field}>
                      {field === "name"
                        ? "Nombre"
                        : field === "category"
                          ? "Categoría"
                          : "Unidad"}
                      <input
                        required
                        value={supply[field]}
                        onChange={(e) =>
                          setSupply({ ...supply, [field]: e.target.value })
                        }
                      />
                    </label>
                  ))}
                  {(["stock", "min", "cost"] as const).map((field) => (
                    <label key={field}>
                      {field === "stock"
                        ? "Stock actual"
                        : field === "min"
                          ? "Stock mínimo"
                          : "Costo unitario (S/)"}
                      <input
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        value={supply[field]}
                        onChange={(e) =>
                          setSupply({
                            ...supply,
                            [field]: Number(e.target.value),
                          })
                        }
                      />
                    </label>
                  ))}
                  <button className="ops-primary">
                    <Icon name="save" /> Guardar insumo
                  </button>
                </form>
              </OperationsDialog>
            )}
            <Panel title="Últimos movimientos">
              {data.movements.slice(0, 6).map((m) => (
                <p key={m.id}>
                  <Badge value={m.amount > 0 ? "Entrada" : "Salida"} /> {m.name}{" "}
                  · {m.amount > 0 ? "+" : ""}
                  {m.amount}
                </p>
              ))}
              {!data.movements.length && <Empty />}
            </Panel>
          </div>
        </div>
      )}
    </>
  );
}
