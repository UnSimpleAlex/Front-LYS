import { KitchenBoard } from "./KitchenBoard";
import { KitchenIncoming } from "./KitchenIncoming";
import { KitchenHistory } from "./KitchenHistory";
import { KitchenTimes } from "./KitchenTimes";
import { useState } from "react";
import {
  changeStatus,
  getOperations,
  minutes,
  seedKitchenPreview,
  useOperations,
  type Order,
  type Status,
} from "./operationsStore";
import { OrderDetail, Stats } from "./OperationsUI";
export function KitchenViews({
  section,
  notify,
  navigate,
}: {
  section: string;
  notify: (task: () => void) => void;
  navigate: (path: string) => void;
}) {
  const state = useOperations();
  const [detail, setDetail] = useState<Order | null>(null);
  const orders = state.orders.filter((o) => !o.draft);
  const current = orders.filter(
    (o) => !["Entregado", "Cancelado", "En camino"].includes(o.status),
  );
  const completed = orders.filter((o) => o.ready && o.accepted);
  const average = completed.length
    ? Math.round(
        completed.reduce(
          (sum, o) =>
            sum + (Date.parse(o.ready!) - Date.parse(o.accepted!)) / 60000,
          0,
        ) / completed.length,
      )
    : 0;
  const late = current.filter(
    (order) =>
      order.status !== "Listo" &&
      minutes(order.accepted || order.created) > state.settings.target,
  );
  const advance = (id: string, status: Status) =>
    notify(() => changeStatus(id, status));
  return (
    <>
      <Stats
        entries={
          section === "pedidos"
            ? [
                {
                  label: "Nuevos",
                  value: orders.filter((o) => o.status === "Recibido").length,
                  icon: "receipt",
                  hint: "Pendientes de aceptación",
                },
                {
                  label: "Delivery",
                  value: current.filter((o) => o.channel === "Delivery").length,
                  icon: "scooter",
                  tone: "blue",
                  hint: "Pedidos entrantes",
                },
                {
                  label: "Salón",
                  value: current.filter((o) => o.channel === "Salón").length,
                  icon: "table",
                  tone: "gold",
                  hint: "Pedidos en salón",
                },
                {
                  label: "Tiempo de espera",
                  value: `${Math.round(current.reduce((s, o) => s + minutes(o.created), 0) / Math.max(1, current.length))} min`,
                  icon: "clock",
                  tone: "gold",
                  hint: "Promedio actual",
                },
              ]
            : section === "historial"
              ? [
                  {
                    label: "Pedidos registrados",
                    value: orders.length,
                    icon: "receipt",
                    hint: "Total procesados",
                  },
                  {
                    label: "Completados",
                    value: orders.filter((o) => o.status === "Entregado")
                      .length,
                    icon: "check",
                    tone: "green",
                    hint: "Entregados al cliente",
                  },
                  {
                    label: "Cancelados",
                    value: orders.filter((o) => o.status === "Cancelado")
                      .length,
                    icon: "close",
                    tone: "gray",
                    hint: "No se prepararon",
                  },
                  {
                    label: "Tiempo promedio",
                    value: `${average} min`,
                    icon: "clock",
                    tone: "gold",
                    hint: "Desde aceptación a listo",
                  },
                ]
              : section === "tiempos"
                ? [
                    {
                      label: "Tiempo promedio",
                      value: `${average} min`,
                      icon: "clock",
                      tone: "gold",
                      hint: "Desde inicio del turno",
                    },
                    {
                      label: "Pedidos fuera de tiempo",
                      value: late.length,
                      icon: "bell",
                      hint: "Requieren atención",
                    },
                    {
                      label: "Eficiencia de cocina",
                      value: `${completed.length ? Math.round((completed.filter((o) => (Date.parse(o.ready!) - Date.parse(o.accepted!)) / 60000 <= state.settings.target).length / completed.length) * 100) : 0}%`,
                      icon: "check",
                      tone: "green",
                      hint: "Pedidos a tiempo",
                    },
                    {
                      label: "Mejor tiempo",
                      value: `${completed.length ? Math.round(Math.min(...completed.map((o) => (Date.parse(o.ready!) - Date.parse(o.accepted!)) / 60000))) : 0} min`,
                      icon: "trophy",
                      tone: "gold",
                      hint: "Pedidos completados",
                    },
                  ]
                : [
                    {
                      label: "Pedidos pendientes",
                      value: orders.filter((o) => o.status === "Recibido")
                        .length,
                      icon: "receipt",
                      hint: "Esperando confirmación o preparación",
                    },
                    {
                      label: "En preparación",
                      value: orders.filter((o) => o.status === "En preparación")
                        .length,
                      icon: "chef",
                      tone: "gold",
                      hint: "Cocinándose actualmente",
                    },
                    {
                      label: "Tiempo promedio",
                      value: `${average} min`,
                      icon: "clock",
                      tone: "gray",
                      hint: "Desde aceptación a listo",
                    },
                    {
                      label: "Pedidos a tiempo",
                      value: `${completed.length ? Math.round((completed.filter((o) => (Date.parse(o.ready!) - Date.parse(o.accepted!)) / 60000 <= state.settings.target).length / completed.length) * 100) : 0}%`,
                      icon: "chart",
                      tone: "green",
                      hint: "Pedidos preparados dentro de la meta",
                    },
                  ]
        }
      />
      {section === "" ? (
        <KitchenBoard
          orders={orders}
          target={state.settings.target}
          onDetail={setDetail}
          onStatus={advance}
          navigate={navigate}
        />
      ) : section === "pedidos" ? (
        <KitchenIncoming
          orders={orders}
          target={state.settings.target}
          onDetail={setDetail}
          onStatus={advance}
        />
      ) : section === "historial" ? (
        <KitchenHistory orders={orders} onDetail={setDetail} />
      ) : (
        <KitchenTimes
          orders={orders}
          target={state.settings.target}
          onDetail={setDetail}
        />
      )}
      {section &&
        !orders.some((order) => order.customerId === "kitchen-preview") && (
          <div className="kr-demo">
            <button
              className="ops-outline"
              onClick={() => notify(seedKitchenPreview)}
            >
              Cargar muestra de cocina
            </button>
            <small>Pedidos de demostración guardados en este navegador.</small>
          </div>
        )}
      {detail && (
        <OrderDetail
          order={
            getOperations().orders.find((o) => o.id === detail.id) || detail
          }
          onClose={() => setDetail(null)}
        />
      )}
    </>
  );
}
