export function localDateKey(value: string) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export const dateText = (date: string) =>
  new Date(date).toLocaleString("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  });
export function downloadCsv(
  name: string,
  headers: string[],
  rows: (string | number | boolean)[][],
) {
  const cell = (value: string | number | boolean) => {
    const text = String(value);
    const safe = typeof value === "string" && /^\s*[=+@-]/.test(text) ? "'" + text : text;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  const blob = new Blob(
    [
      "\ufeff" +
        [headers, ...rows].map((row) => row.map(cell).join(";")).join("\r\n"),
    ],
    { type: "text/csv;charset=utf-8" },
  );
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name + ".csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
export function printLocal(title: string, lines: string[]) {
  const popup = window.open("", "_blank", "width=700,height=800");
  if (!popup) throw new Error("Permite la ventana de impresión.");
  popup.document.title = title;
  popup.document.documentElement.lang = "es";
  const h = popup.document.createElement("h1");
  h.textContent = title;
  popup.document.body.append(h);
  const note = popup.document.createElement("p");
  note.textContent = "Simulación local · Sin valor tributario";
  popup.document.body.append(note);
  lines.forEach((line) => {
    const p = popup.document.createElement("p");
    p.textContent = line;
    popup.document.body.append(p);
  });
  popup.print();
}
