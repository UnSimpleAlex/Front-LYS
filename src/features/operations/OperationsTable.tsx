import {
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from "react";

type ElementProps = {
  children?: ReactNode;
  "data-label"?: string;
  role?: string;
};
const elements = (node: ReactNode) =>
  Children.toArray(node).filter(isValidElement) as ReactElement<ElementProps>[];
function textOf(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) =>
      isValidElement<ElementProps>(child)
        ? textOf(child.props.children)
        : String(child),
    )
    .join("");
}

// Labels follow the actual table headings, including when columns change by role.
export function OperationsTable({ children }: { children: ReactNode }) {
  const sections = elements(children);
  const head = sections.find((section) => section.type === "thead");
  const headings = elements(
    elements(head?.props.children)[0]?.props.children,
  ).map((cell) => textOf(cell.props.children));
  return (
    <table
      className="ops-responsive-table"
      role="table"
      data-wide={headings.length > 9}
      data-catalog={
        headings[0] === "Producto" && headings.includes("Disponibilidad")
      }
    >
      {sections.map((section) =>
        cloneElement(
          section,
          { role: "rowgroup" },
          elements(section.props.children).map((row) =>
            cloneElement(
              row,
              { role: "row" },
              elements(row.props.children).map((cell, index) =>
                cloneElement(cell, {
                  role: section.type === "thead" ? "columnheader" : "cell",
                  "data-label": headings[index] || "Detalle",
                }),
              ),
            ),
          ),
        ),
      )}
    </table>
  );
}
