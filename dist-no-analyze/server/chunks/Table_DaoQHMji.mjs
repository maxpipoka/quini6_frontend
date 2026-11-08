;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="821ceaf9-51df-42b6-848b-c1b97eddb620",e._sentryDebugIdIdentifier="sentry-dbid-821ceaf9-51df-42b6-848b-c1b97eddb620")}catch(e){}}();import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, k as renderComponent, r as renderTemplate, o as Fragment, u as unescapeHTML } from './astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { $ as $$Spinner } from './Spinner_BaZPL3Gl.mjs';
/* empty css                         */

const $$Astro = createAstro("https://quini6.com");
const $$Table = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Table;
  const {
    columns,
    data,
    emptyState = "No hay datos disponibles",
    loadingState = false,
    loadingText = "Cargando...",
    rowKey: _rowKey,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy
  } = Astro2.props;
  function getThClass(column) {
    let cls = "text-text-secondary px-4 py-3 text-left text-sm font-semibold";
    if (column.align === "center") cls += " text-center";
    if (column.align === "right") cls += " text-right";
    if (column.class) cls += ` ${column.class}`;
    return cls;
  }
  function getTdClass(column) {
    let cls = "text-text-primary px-4 py-3 text-sm";
    if (column.align === "center") cls += " text-center";
    if (column.align === "right") cls += " text-right";
    if (column.class) cls += ` ${column.class}`;
    return cls;
  }
  function getTrClass(rowIndex) {
    let cls = "dark:hover:bg-neutral-800/50 transition-colors hover:bg-neutral-50";
    if (rowIndex % 2 === 1) cls += " bg-neutral-50/50 dark:bg-neutral-800/30";
    return cls;
  }
  const headerRowClass = "border-b border-border bg-neutral-50 dark:bg-neutral-800";
  const tableClass = "w-full border-collapse";
  const loadingContainerClass = "flex flex-col items-center justify-center py-12";
  const loadingTextClass = "mt-4 text-text-secondary";
  const emptyContainerClass = "py-12 text-center";
  const emptyTextClass = "text-text-secondary";
  const mobileCardsContainerClass = "space-y-3 p-4 lg:hidden";
  const cardClass = "card-elevated p-4";
  const dlClass = "space-y-3";
  const cardItemClass = "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between";
  const dtClass = "text-sm font-medium text-text-secondary sm:w-1/3 sm:pr-4";
  const ddClass = "text-left text-sm text-text-primary sm:w-2/3 sm:text-right";
  const desktopTableClass = "hidden lg:block";
  const regionClass = "w-full overflow-x-auto";
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(regionClass, "class")} role="region"${addAttribute(ariaLabel, "aria-label")}${addAttribute(ariaDescribedBy, "aria-describedby")} data-astro-cid-xq6522ex> ${loadingState ? renderTemplate`<div${addAttribute(loadingContainerClass, "class")} role="status" aria-live="polite" data-astro-cid-xq6522ex> ${renderComponent($$result, "Spinner", $$Spinner, { "size": "lg", "color": "primary", "aria-label": loadingText, "data-astro-cid-xq6522ex": true })} <p${addAttribute(loadingTextClass, "class")} data-astro-cid-xq6522ex>${loadingText}</p> </div>` : data.length === 0 ? renderTemplate`<div${addAttribute(emptyContainerClass, "class")} data-astro-cid-xq6522ex> <p${addAttribute(emptyTextClass, "class")} data-astro-cid-xq6522ex>${emptyState}</p> </div>` : renderTemplate`<div data-astro-cid-xq6522ex> <div${addAttribute(desktopTableClass, "class")} data-astro-cid-xq6522ex> <table${addAttribute(tableClass, "class")} data-astro-cid-xq6522ex> <thead data-astro-cid-xq6522ex> <tr${addAttribute(headerRowClass, "class")} data-astro-cid-xq6522ex> ${columns.map((column) => renderTemplate`<th${addAttribute(getThClass(column), "class")} data-scope="col" data-astro-cid-xq6522ex> ${column.header} </th>`)} </tr> </thead> <tbody class="divide-y divide-border" data-astro-cid-xq6522ex> ${data.map((row, rowIndex) => renderTemplate`<tr${addAttribute(getTrClass(rowIndex), "class")} data-astro-cid-xq6522ex> ${columns.map((column) => {
    const cellValue = row[column.key];
    const rendered = column.render ? column.render(row, rowIndex) : cellValue ?? "";
    return renderTemplate`<td${addAttribute(getTdClass(column), "class")}${addAttribute(column.header, "data-label")} data-astro-cid-xq6522ex> ${typeof rendered === "object" && rendered !== null && "html" in rendered ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(rendered.html)}` })}` : rendered} </td>`;
  })} </tr>`)} </tbody> </table> </div> <div${addAttribute(mobileCardsContainerClass, "class")} data-astro-cid-xq6522ex> ${data.map((row, rowIndex) => renderTemplate`<article${addAttribute(cardClass, "class")}${addAttribute(rowIndex, "data-row-index")} data-astro-cid-xq6522ex> <dl${addAttribute(dlClass, "class")} data-astro-cid-xq6522ex> ${columns.map((column) => {
    const cellValue = row[column.key];
    const rendered = column.render ? column.render(row, rowIndex) : cellValue ?? "";
    return renderTemplate`<div${addAttribute(cardItemClass, "class")} data-astro-cid-xq6522ex> <dt${addAttribute(dtClass, "class")} data-astro-cid-xq6522ex>${column.header}</dt> <dd${addAttribute(ddClass, "class")} data-astro-cid-xq6522ex> ${typeof rendered === "object" && rendered !== null && "html" in rendered ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(rendered.html)}` })}` : rendered} </dd> </div>`;
  })} </dl> </article>`)} </div> </div>`} </div> `;
}, "D:/Desarrollo/quini6_frontend/src/components/ui/Table.astro", void 0);

export { $$Table as $ };
