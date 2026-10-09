import { useState } from "react";
import { prepareDemoAccess, roleNames } from "../../services/localAuth";
export function DemoAccess() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  return (
    <section className="local-demo-access">
      <button
        type="button"
        className="text-link"
        onClick={() => setOpen(!open)}
      >
        Accesos de prueba por rol
      </button>
      {open && (
        <div>
          <p>Simulación guardada en este navegador. Usa datos de prueba.</p>
          <button
            type="button"
            className="info-button"
            onClick={() => {
              void prepareDemoAccess()
                .then(() => setReady(true))
                .catch(() =>
                  setError("No se pudo preparar el almacenamiento local."),
                );
            }}
          >
            Preparar cuentas de prueba
          </button>
          {ready && (
            <>
              <p>
                Contraseña de prueba: <strong>Demo2026!</strong>
              </p>
              <ul>
                {Object.entries(roleNames)
                  .filter(([role]) => role !== "cliente")
                  .map(([role, label]) => (
                    <li key={role}>
                      {label}: {role}@demo.local
                    </li>
                  ))}
              </ul>
            </>
          )}
          {error && <p role="alert">{error}</p>}
        </div>
      )}
    </section>
  );
}
