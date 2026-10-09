import { readUpload } from "./imageUpload";
import { useState } from "react";
import { categories } from "../carta/catalog";
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
  saveProduct,
  deleteProduct,
  saveOffer,
  saveSupply,
  deleteSupply,
  moveSupply,
  saveSupplier,
  money,
  type MenuProduct,
  type Offer,
  type Supply,
  type Supplier,
} from "./operationsStore";
import { Panel, Stats, Badge, Tabs, Empty } from "./OperationsUI";
const blankProduct = (): MenuProduct => ({
  id: crypto.randomUUID(),
  name: "",
  description: "",
  category: "pollo",
  price: 0,
  stock: 0,
  active: true,
  image: "/images/logo.webp",
  size: "Personal",
  popular: 0,
  isNew: false,
  promo: false,
});
export function ProductManager({
  notify,
}: {
  notify: (task: () => void) => void;
}) {
  const data = useOperations();
  const [product, setProduct] = useState(blankProduct);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const rows = data.products.filter(
    (p) =>
      (category === "Todos" || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <Stats
        entries={[
          { label: "Total productos", value: data.products.length },
          {
            label: "Activos",
            value: data.products.filter((p) => p.active).length,
            tone: "green",
          },
          {
            label: "Inactivos",
            value: data.products.filter((p) => !p.active).length,
          },
          { label: "Categorías", value: categories.length, tone: "gold" },
        ]}
      />
      <div className="ops-with-sidebar">
        <Panel
          title="Lista de productos"
          action={
            <button
              className="ops-primary"
              onClick={() => setProduct(blankProduct())}
            >
              ＋ Nuevo producto
            </button>
          }
        >
          <div className="ops-toolbar">
            <input
              placeholder="Buscar producto…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option>Todos</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="ops-table-wrap">
            <table>
              <thead>
                <tr>
                  {[
                    "Producto",
                    "Categoría",
                    "Precio",
                    "Stock",
                    "Disponibilidad",
                    "Estado",
                    "Acciones",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice((page - 1) * 6, page * 6).map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="ops-product-cell">
                        <img src={p.image} alt="" />
                        <div>
                          <strong>{p.name}</strong>
                          <small>{p.description}</small>
                        </div>
                      </div>
                    </td>
                    <td>{categories.find((c) => c.id === p.category)?.name}</td>
                    <td>{money(p.price)}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button
                        className={`ops-switch ${p.active ? "on" : ""}`}
                        aria-label={`Disponibilidad de ${p.name}`}
                        aria-pressed={p.active}
                        onClick={() =>
                          notify(() => saveProduct({ ...p, active: !p.active }))
                        }
                      />
                    </td>
                    <td>
                      <Badge value={p.active ? "Activo" : "Inactivo"} />
                    </td>
                    <td>
                      <div className="ops-actions">
                        <button onClick={() => setProduct({ ...p })}>
                          Editar
                        </button>
                        <button
                          onClick={() => notify(() => deleteProduct(p.id))}
                        >
                          Desactivar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="ops-pagination">
            <span>{rows.length} productos</span>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Anterior
            </button>
            <span>{page}</span>
            <button
              disabled={page * 6 >= rows.length}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </button>
          </div>
        </Panel>
        <Panel
          title={
            data.products.some((p) => p.id === product.id)
              ? "Editar producto"
              : "Nuevo producto"
          }
        >
          <form
            className="ops-form"
            onSubmit={(e) => {
              e.preventDefault();
              notify(() => {
                saveProduct(product);
                setProduct(blankProduct());
              });
            }}
          >
            <label>
              Nombre del producto
              <input
                required
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
              />
            </label>
            <label>
              Descripción
              <textarea
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
              />
            </label>
            <label>
              Categoría
              <select
                value={product.category}
                onChange={(e) =>
                  setProduct({ ...product, category: e.target.value })
                }
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Precio (S/)
              <input
                required
                min="0.01"
                step="0.01"
                type="number"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Imagen del producto
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file)
                    void readUpload(file)
                      .then((image) => {
                        setProduct({ ...product, image });
                        setError("");
                      })
                      .catch((err) => setError(err.message));
                }}
              />
            </label>
            <img
              className="ops-upload-preview"
              src={product.image}
              alt="Vista previa del producto"
            />
            {error && <p role="alert">{error}</p>}
            <label>
              Stock
              <input
                type="number"
                min="0"
                required
                value={product.stock}
                onChange={(e) =>
                  setProduct({ ...product, stock: Number(e.target.value) })
                }
              />
            </label>
            <label className="ops-check">
              <input
                type="checkbox"
                checked={product.active}
                onChange={(e) =>
                  setProduct({ ...product, active: e.target.checked })
                }
              />
              Producto disponible
            </label>
            <button className="ops-primary">Guardar producto</button>
          </form>
        </Panel>
      </div>
    </>
  );
}
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
            <button onClick={() => setOffer(blankOffer())}>
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
            <input
              placeholder="Buscar promociones…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="ops-table-wrap">
            <table>
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
                          <button onClick={() => setOffer({ ...o })}>
                            Editar
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
                            Duplicar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {!data.offers.length && (
              <Empty>Crea una promoción para mostrarla en la carta.</Empty>
            )}
          </div>
        </Panel>
        <Panel title="Crear / Editar promoción">
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
            <button className="ops-primary">Guardar promoción</button>
          </form>
        </Panel>
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
    setEditing(u);
    setName(u.name);
    setEmail(u.email);
    setPhone(u.phone);
    setRole(u.role);
  };
  const reset = () => {
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
            <button className="ops-primary" onClick={reset}>
              ＋ Nueva cuenta
            </button>
          }
        >
          <div className="ops-toolbar">
            <input
              placeholder="Buscar nombre, correo o teléfono…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {!clients && (
              <select
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
            <table>
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
                        <strong>{u.name}</strong>
                        <small>{u.phone}</small>
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
                          <button onClick={() => setView(u)}>Ver</button>
                          <button onClick={() => select(u)}>Editar</button>
                          <button
                            onClick={() =>
                              notify(() =>
                                editLocalUser(u.id, { active: false }),
                              )
                            }
                          >
                            Desactivar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
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
          <Panel title={editing ? "Editar cuenta" : "Nueva cuenta"}>
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
          </Panel>
          {view && (
            <Panel
              title={`Historial de ${view.name}`}
              action={<button onClick={() => setView(null)}>Cerrar</button>}
            >
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
            </Panel>
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
  const [movement, setMovement] = useState("");
  const [quantity, setQuantity] = useState(1);
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
          <Panel title="Proveedores">
            {data.suppliers.map((p) => (
              <p key={p.id}>
                {p.name} · {p.phone} · {p.email}
                <button onClick={() => setProvider(p)}>Editar</button>
              </p>
            ))}
          </Panel>
          <Panel title="Nuevo proveedor">
            <form
              className="ops-form"
              onSubmit={(e) => {
                e.preventDefault();
                notify(() => {
                  saveSupplier(provider);
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
              <button className="ops-primary">Guardar proveedor</button>
            </form>
          </Panel>
        </div>
      ) : (
        <div className="ops-with-sidebar">
          <Panel
            title={tab === "Alertas" ? "Alertas de stock" : "Insumos"}
            action={
              <button onClick={() => setSupply(blankSupply())}>
                ＋ Nuevo insumo
              </button>
            }
          >
            <input
              className="ops-search"
              placeholder="Buscar insumos…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="ops-table-wrap">
              <table>
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
                          <strong>{s.name}</strong>
                          <small>{s.category}</small>
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
                            <button onClick={() => setSupply({ ...s })}>
                              Editar
                            </button>
                            <button onClick={() => setMovement(s.id)}>
                              Registrar movimiento
                            </button>
                            <button
                              onClick={() => notify(() => deleteSupply(s.id))}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {movement && (
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
                <button className="ops-primary">Guardar movimiento</button>
              </form>
            )}
          </Panel>
          <div>
            <Panel title="Nuevo / Editar insumo">
              <form
                className="ops-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  notify(() => {
                    saveSupply(supply);
                    setSupply(blankSupply());
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
                <button className="ops-primary">Guardar insumo</button>
              </form>
            </Panel>
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
