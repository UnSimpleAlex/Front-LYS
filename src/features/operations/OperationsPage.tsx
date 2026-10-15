import { DeliveryViews } from "./DeliveryViews";
import { OperationsDialog } from "./OperationsDialog";
import { OperationsPageActions } from "./operationsPageContext";
import { useEffect, useState } from "react";
import { Icon, type IconName } from "./OperationsVisuals";
import {
  logoutLocal,
  roleNames,
  useSession,
  type Role,
} from "../../services/localAuth";
import { KitchenViews } from "./KitchenViews";
import { WaiterViews } from "./WaiterViews";
import { CashViews } from "./CashViews";
import { AdminViews } from "./AdminViews";
import { useOperations } from "./operationsStore";
import { loadWorkspacePreview } from "./workspacePreview";
import { Empty } from "./OperationsUI";
import "../../styles/operations.css";
import "../../styles/operations-fidelity.css";
import "../../styles/operations-fidelity-layout.css";
import "../../styles/operations-fidelity-responsive.css";
import "../../styles/operations-adaptive.css";
import "../../styles/kitchen-board.css";
import "../../styles/kitchen-reference.css";
import "../../styles/operations-workspace.css";
import "../../styles/operations-products.css";
import "../../styles/operations-admin-panels.css";
import "../../styles/operations-reference.css";
const menus: Record<string, [string, string, IconName][]> = {
  cocina: [
    ["", "Panel de cocina", "chef"],
    ["pedidos", "Pedidos entrantes", "receipt"],
    ["historial", "Historial", "clock"],
    ["tiempos", "Control de tiempos", "chart"],
  ],
  mesera: [
    ["", "Dashboard", "home"],
    ["mesas", "Mesas", "table"],
    ["nuevo-pedido", "Nuevo pedido", "plus"],
    ["pedidos", "Pedidos", "receipt"],
    ["cierre-mesa", "Cierre de mesa", "card"],
  ],
  caja: [
    ["", "Dashboard caja", "chart"],
    ["cobros", "Cobros", "card"],
    ["comprobantes", "Comprobantes", "receipt"],
    ["apertura", "Apertura de caja", "cash"],
    ["cierre", "Cierre de caja", "power"],
    ["historial", "Historial", "clock"],
  ],
  administrador: [
    ["", "Dashboard", "home"],
    ["pedidos", "Pedidos", "receipt"],
    ["productos", "Productos", "box"],
    ["inventario", "Inventario", "box"],
    ["promociones", "Promociones", "tag"],
    ["clientes", "Clientes", "users"],
    ["usuarios", "Usuarios", "user"],
    ["reportes", "Reportes", "chart"],
    ["configuracion", "Configuración", "settings"],
  ],
  delivery: [["", "Entregas", "truck"]],
};
const titles: Record<string, string> = {
  "cocina/": "Panel de cocina",
  "cocina/pedidos": "Pedidos entrantes",
  "cocina/historial": "Historial de pedidos",
  "cocina/tiempos": "Control de tiempos",
  "mesera/": "Dashboard de salón",
  "mesera/mesas": "Gestión de mesas",
  "mesera/nuevo-pedido": "Crear nuevo pedido",
  "mesera/pedidos": "Pedidos de salón",
  "mesera/cierre-mesa": "Cierre de mesa",
  "caja/": "Dashboard de caja",
  "caja/cobros": "Cobros",
  "caja/comprobantes": "Comprobantes",
  "caja/apertura": "Apertura de caja",
  "caja/cierre": "Cierre de caja",
  "caja/historial": "Historial de pagos",
  "administrador/": "Dashboard general",
  "administrador/productos": "Gestión de productos",
  "administrador/promociones": "Gestión de promociones",
  "administrador/clientes": "Gestión de clientes",
  "administrador/usuarios": "Gestión de usuarios",
  "administrador/pedidos": "Gestión de pedidos",
  "administrador/reportes": "Reportes y analítica",
  "administrador/inventario": "Inventario",
  "administrador/configuracion": "Configuración del sistema",
  "delivery/": "Entregas de delivery",
};
const descriptions: Record<string, string> = {
  "cocina/": "Gestiona los pedidos en tiempo real",
  "cocina/pedidos": "Revisa y acepta los nuevos pedidos en tiempo real.",
  "cocina/historial": "Consulta los pedidos preparados y entregados.",
  "cocina/tiempos": "Supervisa el rendimiento y los tiempos de preparación.",
  "mesera/": "Todo bajo control para atender cada mesa.",
  "mesera/mesas":
    "Controla la disponibilidad y el estado de cada mesa en tiempo real.",
  "mesera/nuevo-pedido":
    "Selecciona la mesa, agrega los productos y envía a cocina.",
  "mesera/pedidos": "Gestiona los pedidos de tus mesas.",
  "mesera/cierre-mesa": "Revisa el consumo y solicita la cuenta.",
  "caja/": "Controla los cobros y movimientos del turno.",
  "caja/cobros": "Procesa los pagos y entrega el comprobante.",
  "caja/comprobantes": "Consulta, emite e imprime tus comprobantes locales.",
  "caja/apertura": "Registra el fondo inicial antes de iniciar el turno.",
  "caja/cierre": "Verifica los movimientos y cierra el turno.",
  "caja/historial": "Consulta todas las transacciones realizadas.",
  "administrador/": "Resumen de tu negocio en tiempo real.",
  "administrador/productos": "Administra productos, precios, categorías y disponibilidad del menú.",
  "administrador/promociones": "Crea ofertas que impulsen tus ventas.",
  "administrador/clientes": "Conoce y administra a tus clientes.",
  "administrador/usuarios": "Administra el acceso de tu equipo al sistema.",
  "administrador/pedidos":
    "Supervisa y administra todos los pedidos del negocio.",
  "administrador/reportes":
    "Convierte tus datos en decisiones para hacer crecer el negocio.",
  "administrador/inventario":
    "Controla tus insumos, stock y movimientos en tiempo real.",
  "administrador/configuracion": "Administra los datos y reglas de tu negocio.",
  "delivery/": "Gestiona los pedidos listos y las entregas en curso.",
};
export function OperationsPage({
  route,
  navigate: onNavigate,
}: {
  route: string;
  navigate: (path: string) => void;
}) {
  const [, setClock] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(
      () => setClock((value) => value + 1),
      60000,
    );
    return () => window.clearInterval(timer);
  }, []);
  const user = useSession();
  const state = useOperations();
  const [, role, section = ""] = route.split("/");
  const [menu, setMenu] = useState(false);
  const [actionHost, setActionHost] = useState<HTMLDivElement | null>(null);
  const [profile, setProfile] = useState(false);
  const [preparingPreview,setPreparingPreview] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const navigate = (path:string) => {setMenu(false);setProfile(false);setNotifications(false);setMessage("");onNavigate(path);};
  const notify = (task: () => void) => {
    try {
      task();
      setFailed(false);
      setMessage("Cambios guardados.");
    } catch (error) {
      setFailed(true);
      window.dispatchEvent(new CustomEvent("operations:error", {detail:error instanceof Error ? error.message : "No se pudo guardar el cambio."}));
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el cambio. Revisa el espacio disponible del navegador.",
      );
    }
  };
  const allowed = user && (user.role === role || user.role === "administrador");
  const key = `${role}/${section}`;
  if (!allowed)
    return (
      <main id="contenido" className="ops-root">
        <h1>Acceso restringido</h1>
        <p>Inicia sesión con una cuenta del rol correspondiente.</p>
        <button onClick={() => navigate("/iniciar-sesion")}>
          Iniciar sesión
        </button>
      </main>
    );
  if (!titles[key])
    return (
      <main id="contenido" className="ops-root">
        <h1>Página no encontrada</h1>
        <button onClick={() => navigate(`/${role}`)}>Volver al panel</button>
      </main>
    );
  const pending = state.orders.filter(
    (o) => !o.draft && !["Entregado", "Cancelado"].includes(o.status),
  );
  return (
    <div className="ops-root ops-workspace ops-reference" data-page={key}>
      <aside className="ops-sidebar" aria-label="Menú del panel">
        <a className="ops-brand" href="/" onClick={e => {e.preventDefault();navigate("/");}}><img src="/images/logo.webp" alt="Leñas y Sabores" /></a>
        <div className="ops-area-label">{role === "administrador" ? "Panel de administración" : roleNames[role as Role]}</div>
        <nav
          id="ops-navigation"
          className="ops-side-navigation"
          aria-label={`Navegación ${roleNames[role as Role]}`}
        >
          {menus[role]?.map(([path, label, icon]) => (
            <button
              className={section === path ? "active" : ""}
              aria-current={section === path ? "page" : undefined} key={path}
              onClick={() => {
                setMenu(false);
                navigate(`/${role}${path ? "/" + path : ""}`);
              }}
            >
              <Icon name={icon} />
              {label}
            </button>
          ))}
        </nav>
        <button className="ops-side-account" onClick={() => setProfile(true)}><Icon name="user" /><span>{user.name}<small>{roleNames[user.role]}</small></span><Icon name="chevron" /></button>
      </aside>
      <div className="ops-workspace-toolbar">
        <button className="ops-menu" aria-label="Abrir menú del panel" aria-expanded={menu} onClick={() => setMenu(true)}><Icon name="menu" /></button>
        <a className="ops-mobile-brand" href="/" onClick={e=>{e.preventDefault();navigate("/");}}><img src="/images/logo.webp" alt="Leñas y Sabores"/></a>
        <span className="ops-workspace-status"><span aria-hidden="true" className={state.settings.open ? "is-open" : ""} />{state.settings.open ? "Local abierto" : "Local cerrado"}</span>
        <button aria-label="Notificaciones de pedidos" onClick={() => setNotifications(true)}><Icon name="bell" />{pending.length}</button>
        <button className="ops-mobile-account" aria-label={`Cuenta de ${user.name}`} onClick={() => setProfile(true)}><Icon name="user" /></button>
      </div>
      {menu && <OperationsDialog title={roleNames[role as Role]} onClose={() => setMenu(false)} className="ops-navigation-dialog">        <nav
          id="ops-mobile-navigation"
          className="ops-side-navigation"
          aria-label={`Navegación ${roleNames[role as Role]}`}
        >
          {menus[role]?.map(([path, label, icon]) => (
            <button
              className={section === path ? "active" : ""}
              aria-current={section === path ? "page" : undefined} key={path}
              onClick={() => {
                setMenu(false);
                navigate(`/${role}${path ? "/" + path : ""}`);
              }}
            >
              <Icon name={icon} />
              {label}
            </button>
          ))}
        </nav>
</OperationsDialog>}
      {profile && <OperationsDialog title="Mi cuenta" onClose={() => setProfile(false)}>
        <div className="ops-account-summary"><Icon name="user" /><div><strong>{user.name}</strong><p>{roleNames[user.role]}</p></div></div>
        <div className="ops-account-actions">
          <button onClick={() => {setProfile(false);setNotifications(true);}}><Icon name="bell" />Pedidos activos ({pending.length})</button>
          {user.role === "administrador" && <><h3>Cambiar de área</h3>{Object.keys(menus).map(r => <button key={r} onClick={() => {setProfile(false);navigate("/" + r);}}><Icon name={menus[r][0][2]} />{roleNames[r as Role]}<Icon name="chevron" /></button>)}</>}
          {user.role === "administrador" && <button disabled={preparingPreview} onClick={async()=>{
            setPreparingPreview(true);
            try { await loadWorkspacePreview(); notify(()=>setProfile(false)); }
            catch(error) { notify(()=>{throw error;}); }
            finally {setPreparingPreview(false);}
          }}><Icon name="plus"/>{preparingPreview ? "Preparando datos…" : state.suppliers.some(s=>s.id==="workspace-preview-supplier") ? "Actualizar muestra de demostración":"Cargar datos de demostración"}</button>}
          <button onClick={() => navigate("/mi-cuenta")}><Icon name="user" />Editar mi cuenta</button>
          <button onClick={() => navigate("/")}><Icon name="home" />Ver sitio público</button>
          <button onClick={() => {logoutLocal();navigate("/iniciar-sesion");}}><Icon name="power" />Cerrar sesión</button>
        </div>
      </OperationsDialog>}
      {notifications && <OperationsDialog title="Pedidos activos" onClose={() => setNotifications(false)}>
        {pending.map(o => <div className="ops-notification-item" key={o.id}><strong>#{o.id}</strong><span>{o.customer}</span><span>{o.status}</span></div>)}
        {!pending.length && <Empty>No hay pedidos pendientes.</Empty>}
      </OperationsDialog>}
      <OperationsPageActions.Provider value={actionHost}>
      <main id="contenido" className="ops-content">
        <div
          className={`ops-page-heading ${role === "cocina" ? "script" : ""}`}
        >
          <div>
            <h1>{titles[key]}</h1>
            <p>{descriptions[key]}</p>
          </div>
          <div id="ops-page-actions" ref={setActionHost}>{!["administrador","caja"].includes(role) && <time className="ops-header-date-pill" dateTime={new Date().toISOString()}><Icon name="calendar"/><span>{new Date().toLocaleDateString("es-PE",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</span><b>{new Date().toLocaleTimeString("es-PE",{hour:"2-digit",minute:"2-digit",hour12:false})}</b></time>}</div>
        </div>
        {message && (
          <div
            className={`ops-message ${failed ? "error" : ""}`}
            role={failed ? "alert" : "status"}
          >
            {message}
            <button aria-label="Cerrar mensaje" onClick={() => setMessage("")}>
              ×
            </button>
          </div>
        )}
        {role === "cocina" ? (
          <KitchenViews
            key={key}
            section={section}
            notify={notify}
            navigate={navigate}
          />
        ) : role === "mesera" ? (
          <WaiterViews
            key={key}
            section={section}
            notify={notify}
            navigate={navigate}
          />
        ) : role === "caja" ? (
          <CashViews
            key={key}
            section={section}
            notify={notify}
            navigate={navigate}
          />
        ) : role === "administrador" ? (
          <AdminViews
            key={key}
            section={section}
            notify={notify}
            navigate={navigate}
          />
        ) : (
          <DeliveryViews notify={notify} />
        )}
      </main>
      </OperationsPageActions.Provider>

    </div>
  );
}
