import { useState } from "react";
import { Icon, PaymentMark, type IconName } from "./OperationsVisuals";
import { readUpload } from "./imageUpload";
import {
  paymentMethods,
  saveSettings,
  useOperations,
  type Settings,
} from "./operationsStore";

export function AdminSettings({
  notify,
}: {
  notify: (task: () => void) => void;
}) {
  const data = useOperations();
  const [form, setForm] = useState<Settings>({ ...data.settings });
  const [tab, setTab] = useState("General");
  const [error, setError] = useState("");
  const field = (
    key: keyof Settings,
    label: string,
    icon?: IconName,
    type = "text",
  ) => (
    <label>
      {label}
      <span className="anchor-field">
        {icon && <Icon name={icon} />}
        <input
          type={type}
          name={key}
          autoComplete={({ name: "organization", email: "email", phone: "tel", address: "street-address", city: "address-level2", postalCode: "postal-code", website: "url" } as Record<string, string>)[key] || "off"}
          value={String(form[key] ?? "")}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      </span>
    </label>
  );
  const hours = (
    <section className="anchor-settings-card">
      <h2>Horario de atención</h2>
      <p>Define el horario en que tu restaurante está disponible.</p>
      <div className="anchor-fields-two">
        <label>
          Hora de apertura
          <span className="anchor-field">
            <Icon name="clock" />
            <input
              type="time"
              name="openingTime"
              value={form.openingTime || "12:00"}
              onChange={(e) =>
                setForm({ ...form, openingTime: e.target.value })
              }
            />
          </span>
        </label>
        <label>
          Hora de cierre
          <span className="anchor-field">
            <Icon name="clock" />
            <input
              type="time"
              name="closingTime"
              value={form.closingTime || "23:00"}
              onChange={(e) =>
                setForm({ ...form, closingTime: e.target.value })
              }
            />
          </span>
        </label>
      </div>
    </section>
  );
  const operation = (
    <section className="anchor-settings-card">
      <h2>Operación del restaurante</h2>
      <p>Configura las opciones principales de operación.</p>
      <div className="anchor-fields-two">
        <label>
          Número de mesas en el local
          <span className="anchor-field">
            <Icon name="table" />
            <input
              type="number"
              min="1"
              max="200"
              value={form.tableCount ?? data.tables.length}
              onChange={(e) =>
                setForm({ ...form, tableCount: Number(e.target.value) })
              }
            />
          </span>
        </label>
        <div className="anchor-setting-toggle">
          <Icon name="truck" />
          <span>
            <strong>Delivery propio</strong>
            <small>
              Habilita esta opción si realizas delivery con tu propio equipo.
            </small>
          </span>
          <button
            type="button"
            className={`ops-promotion-state ${form.ownDelivery ? "on" : ""}`}
            aria-label="Delivery propio"
            aria-pressed={!!form.ownDelivery}
            onClick={() => setForm({ ...form, ownDelivery: !form.ownDelivery })}
          ><span aria-hidden="true" className="ops-state-track"><span className="ops-state-thumb"/></span></button>
        </div>
      </div>
    </section>
  );
  return (
    <form
      className="anchor-settings"
      onSubmit={(e) => {
        e.preventDefault();
        notify(() =>
          saveSettings({
            ...form,
            hours:
              form.openingTime || form.closingTime
                ? `${form.openingTime || "12:00"} – ${form.closingTime || "23:00"}`
                : form.hours,
          }),
        );
      }}
    >
      <nav
        className="anchor-settings-tabs"
        aria-label="Configuración del sistema"
      >
        {(
          [
            ["General", "settings"],
            ["Horarios", "clock"],
            ["Pedidos", "receipt"],
            ["Pagos", "card"],
          ] as [string, IconName][]
        ).map(([label, icon]) => (
          <button
            type="button"
            key={label}
            aria-current={tab === label ? "page" : undefined}
            onClick={() => setTab(label)}
          >
            <Icon name={icon} />
            {label}
          </button>
        ))}
      </nav>
      {tab === "General" ? (
        <>
          <section className="anchor-settings-card">
            <h2>Datos del negocio</h2>
            <p>Información principal que se muestra a tus clientes.</p>
            <div className="anchor-fields-two">
              <div className="anchor-field-column">
                {field("name", "Nombre del negocio")}
                {field("description", "Descripción corta")}
                {field("email", "Correo electrónico", "mail", "email")}
                {field("phone", "Teléfono de contacto", "phone", "tel")}
              </div>
              <div className="anchor-field-column">
                {field("address", "Dirección", "pin")}
                <div className="anchor-city-fields">
                  {field("city", "Ciudad")}
                  {field("postalCode", "Código postal")}
                </div>
                {field("ruc", "RUC (opcional)", "receipt")}
                {field("website", "Sitio web (opcional)", "link", "url")}
              </div>
            </div>
          </section>
          <div className="anchor-fields-two">
            {hours}
            {operation}
          </div>
        </>
      ) : tab === "Horarios" ? (
        <>
          {hours}
          <section className="anchor-settings-card">
            <h2>Disponibilidad del local</h2>
            <label className="ops-check">
              <input
                type="checkbox"
                checked={form.open}
                onChange={(e) => setForm({ ...form, open: e.target.checked })}
              />
              Local abierto
            </label>
          </section>
        </>
      ) : tab === "Pedidos" ? (
        <>
          {operation}
          <section className="anchor-settings-card">
            <h2>Preparación y precios</h2>
            <div className="anchor-fields-two">
              <label>
                Meta de preparación (minutos)
                <input
                  type="number"
                  min="1"
                  value={form.target}
                  onChange={(e) =>
                    setForm({ ...form, target: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                Impuesto incluido (%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.tax}
                  onChange={(e) =>
                    setForm({ ...form, tax: Number(e.target.value) })
                  }
                />
              </label>
            </div>
          </section>
        </>
      ) : (
        <section className="anchor-settings-card">
          <h2>Métodos de pago</h2>
          <p>Activa las formas de pago disponibles para tus clientes.</p>
          <div className="ops-method-grid">
            {paymentMethods.map((method) => (
              <article key={method}>
                <header>
                  <h3>
                    <PaymentMark name={method} />
                    {method}
                  </h3>
                  <button
                    type="button"
                    className={`ops-promotion-state ${form.methods.includes(method) ? "on" : ""}`}
                    aria-label={`Activar ${method}`}
                    aria-pressed={form.methods.includes(method)}
                    onClick={() =>
                      setForm({
                        ...form,
                        methods: form.methods.includes(method)
                          ? form.methods.filter((m) => m !== method)
                          : [...form.methods, method],
                      })
                    }
                  ><span aria-hidden="true" className="ops-state-track"><span className="ops-state-thumb"/></span></button>
                </header>
                {(method === "Yape" || method === "Plin") && (
                  <>
                    <label className="ops-qr-upload">
                      <span>Cambiar QR</span>
                      <span className="ops-qr-upload-button">Seleccionar archivo</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file)
                            void readUpload(file)
                              .then((image) =>
                                setForm({
                                  ...form,
                                  [method === "Yape" ? "yapeQr" : "plinQr"]:
                                    image,
                                }),
                              )
                              .catch((err) => setError(err.message));
                        }}
                      />
                    </label>
                    <div className="ops-settings-qr">
                    <img
                      className="ops-qr"
                      src={
                        form[method === "Yape" ? "yapeQr" : "plinQr"] ||
                        `/images/checkout/qr-${method.toLowerCase()}-demo.svg`
                      }
                      alt={`QR ${form[method === "Yape" ? "yapeQr" : "plinQr"] ? "configurado" : "de muestra"} para ${method}`}
                    />
                    <img className="ops-settings-qr-logo" src={`/images/checkout/${method.toLowerCase()}.webp`} alt=""/>
                    </div>
                  </>
                )}
                {method === "Efectivo" && <div className="ops-payment-illustration"><img src="/images/operations/currency/100.webp" alt="Billete de cien soles"/></div>}
                {method === "Tarjeta" && <div className="ops-payment-illustration"><svg viewBox="0 0 220 140" role="img" aria-label="Tarjeta de crédito o débito"><rect x="6" y="6" width="208" height="128" rx="16" fill="#18243c"/><rect x="6" y="32" width="208" height="24" fill="#42526b"/><rect x="25" y="76" width="30" height="22" rx="4" fill="#d7b56d"/><path d="M25 114h75m12 0h30" stroke="#fff" strokeWidth="5" strokeLinecap="round"/><circle cx="173" cy="101" r="14" fill="#ed0017"/><circle cx="190" cy="101" r="14" fill="#e9a324" fillOpacity=".9"/></svg></div>}
                {method === "Transferencia" && field("bank", "Cuenta bancaria")}
                {method === "Transferencia" && <div className="ops-payment-illustration"><svg viewBox="0 0 220 140" role="img" aria-label="Transferencia bancaria"><rect x="18" y="15" width="184" height="110" rx="14" fill="#f1f5f9"/><path d="m45 47 45-24 45 24Z" fill="#334155"/><path d="M51 53v43m26-43v43m26-43v43m26-43v43M43 103h94" stroke="#334155" strokeWidth="9"/><path d="M139 63h48m-12-12 12 12-12 12M187 94h-39m12-12-12 12 12 12" stroke="#ed0017" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg></div>}
              </article>
            ))}
          </div>
        </section>
      )}
      {error && <p role="alert">{error}</p>}
      <footer className="anchor-settings-footer">
        <button
          type="button"
          className="ops-outline"
          onClick={() => setForm({ ...data.settings })}
        >
          Cancelar
        </button>
        <button className="ops-primary">Guardar cambios</button>
      </footer>
    </form>
  );
}
