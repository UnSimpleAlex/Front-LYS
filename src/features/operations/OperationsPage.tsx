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
import { useOperations, changeStatus } from "./operationsStore";
import { OrderCard, Empty } from "./OperationsUI";
import "../../styles/operations.css";
import "../../styles/operations-fidelity.css";
import "../../styles/operations-fidelity-layout.css";
import "../../styles/operations-fidelity-responsive.css";
import "../../styles/operations-adaptive.css";
const menus: Record<string, [string, string, IconName][]> = {
  cocina: [
    ["", "Panel cocina", "chef"],
    ["pedidos", "Pedidos", "receipt"],
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
    ["", "Dashboard", "chart"],
    ["productos", "Productos", "box"],
    ["promociones", "Promociones", "tag"],
    ["clientes", "Clientes", "users"],
    ["usuarios", "Usuarios", "user"],
    ["pedidos", "Pedidos", "receipt"],
    ["reportes", "Reportes", "chart"],
    ["inventario", "Inventario", "box"],
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
  "cocina/": "Pedidos en tiempo real.",
  "cocina/pedidos": "Revisa y acepta los nuevos pedidos.",
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
  "administrador/productos": "Administra tu carta, precios y disponibilidad.",
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
  navigate,
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
  const [profile, setProfile] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [detail, setDetail] = useState("");
  const notify = (task: () => void) => {
    try {
      task();
      setFailed(false);
      setMessage("Cambios guardados.");
    } catch (error) {
      setFailed(true);
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
    <div className="ops-root" data-page={key}>
      <header className="ops-header">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
          aria-label="Ir al inicio"
        >
          <img
            className="ops-logo"
            src="/images/logo.webp"
            alt="Leñas y Sabores · Pollos & Parrillas"
          />
        </a>
        <button
          className="ops-menu"
          aria-label={menu ? "Cerrar menú del panel" : "Abrir menú del panel"}
          aria-expanded={menu}
          aria-controls="ops-navigation"
          onClick={() => setMenu(!menu)}
        >
          <Icon name="menu" />
        </button>
        <nav
          id="ops-navigation"
          className={menu ? "open" : ""}
          aria-label={`Navegación ${roleNames[role as Role]}`}
        >
          {menus[role]?.map(([path, label, icon]) => (
            <button
              className={section === path ? "active" : ""}
              key={path}
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
        <div className="ops-header-right">
          <span className="ops-date">
            <Icon name="calendar" />
            {new Date().toLocaleDateString("es-PE", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="ops-open">
            ●{" "}
            {role === "caja"
              ? state.shifts.some((s) => !s.closed)
                ? "Caja abierta"
                : "Caja cerrada"
              : state.settings.open
                ? role === "cocina"
                  ? "Cocina activa"
                  : role === "mesera"
                    ? "Turno activo"
                    : "Local abierto"
                : "Local cerrado"}
            {role !== "administrador" && <small>{state.settings.hours}</small>}
          </span>
          <button
            className="ops-notification-toggle"
            aria-label="Notificaciones de pedidos"
            aria-expanded={notifications}
            onClick={() => setNotifications(!notifications)}
          >
            <Icon name="bell" />
            <sup>{pending.length}</sup>
          </button>
          <button
            className="ops-user"
            aria-label={`Cuenta de ${user.name}`}
            title={`${user.name} · ${roleNames[user.role]}`}
            aria-expanded={profile}
            onClick={() => setProfile(!profile)}
          >
            <span className="ops-avatar">
              <Icon name="user" />
            </span>
            <span>
              {user.name}
              <small>{roleNames[user.role]}</small>
            </span>
            <Icon name="chevron" />
          </button>
        </div>
        {profile && (
          <div className="ops-profile-menu">
            <button onClick={() => navigate("/mi-cuenta")}>Mi cuenta</button>
            <button onClick={() => navigate("/")}>Ver sitio público</button>
            {user.role === "administrador" &&
              Object.keys(menus).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setProfile(false);
                    navigate("/" + r);
                  }}
                >
                  Panel {roleNames[r as Role]}
                </button>
              ))}
            <button
              onClick={() => {
                logoutLocal();
                navigate("/iniciar-sesion");
              }}
            >
              Cerrar sesión
            </button>
          </div>
        )}
        {notifications && (
          <div className="ops-notification-menu">
            <strong>Pedidos activos: {pending.length}</strong>
            {pending.slice(0, 5).map((o) => (
              <p key={o.id}>
                #{o.id} · {o.status}
              </p>
            ))}
            {!pending.length && <p>No hay pedidos pendientes.</p>}
          </div>
        )}
      </header>
      <main id="contenido" className="ops-content">
        <div
          className={`ops-page-heading ${role === "cocina" ? "script" : ""}`}
        >
          <div>
            <span>
              {role === "administrador"
                ? "Administración"
                : roleNames[role as Role]}
            </span>
            <h1>{titles[key]}</h1>
            <p>{descriptions[key]}</p>
          </div>
          <div className="ops-slogan">
            El auténtico
            <br />
            sabor de la leña
          </div>
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
          <div className="ops-incoming-grid">
            {state.orders
              .filter(
                (o) =>
                  o.channel === "Delivery" &&
                  ["Listo", "En camino"].includes(o.status),
              )
              .map((o) => (
                <OrderCard
                  key={o.id}
                  order={o}
                  onDetail={() => setDetail(detail === o.id ? "" : o.id)}
                  onStatus={(id, status) =>
                    notify(() => changeStatus(id, status))
                  }
                />
              ))}
            {!state.orders.some(
              (o) =>
                o.channel === "Delivery" &&
                ["Listo", "En camino"].includes(o.status),
            ) && <Empty>No hay entregas pendientes.</Empty>}
            {detail && <PanelDelivery id={detail} />}
          </div>
        )}
      </main>
      <div className="ops-local-note">
        Simulación local · Datos guardados en este navegador
      </div>
    </div>
  );
}
function PanelDelivery({ id }: { id: string }) {
  const o = useOperations().orders.find((o) => o.id === id);
  return o ? (
    <section className="ops-panel">
      <h2>Entrega #{o.id}</h2>
      <p>
        {o.customer} · {o.phone}
      </p>
      <p>{o.address}</p>
      <p>{o.notes}</p>
    </section>
  ) : null;
}
