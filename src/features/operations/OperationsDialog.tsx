import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon } from "./OperationsVisuals";

export function OperationsDialog({ title, children, onClose, className = "" }: {
  title: string; children: ReactNode; onClose: () => void; className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const [error, setError] = useState("");
  useEffect(() => {
    if (!returnFocus.current) returnFocus.current = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    ref.current?.showModal();
    document.body.style.overflow = "hidden";
    const feedback = (event: Event) => setError((event as CustomEvent<string>).detail);
    window.addEventListener("operations:error", feedback);
    return () => {
      window.removeEventListener("operations:error", feedback);
      document.body.style.overflow = overflow;
      // Restore focus after React removes the modal from the top layer.
      requestAnimationFrame(() => {
        if (!ref.current?.isConnected && returnFocus.current?.isConnected) returnFocus.current.focus();
      });
    };
  }, []);
  return <dialog ref={ref} className={`ops-dialog ${className}`} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }} onClose={onClose}>
    <header><h2 id={titleId}>{title}</h2><button type="button" aria-label="Cerrar ventana" onClick={onClose}><Icon name="close" /></button></header>
    <div className="ops-dialog-body" onSubmitCapture={() => setError("")}>{error && <p className="ops-message error" role="alert">{error}</p>}{children}</div>
  </dialog>;
}
