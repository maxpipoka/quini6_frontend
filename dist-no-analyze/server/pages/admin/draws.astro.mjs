;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="4b7878cc-61c7-4827-85cd-2ab8afd07a1b",e._sentryDebugIdIdentifier="sentry-dbid-4b7878cc-61c7-4827-85cd-2ab8afd07a1b")}catch(e){}}();import '../../chunks/page-ssr_DXgf4VtS.mjs';
import { e as createAstro, f as createComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute, n as renderSlot, k as renderComponent, l as renderScript } from '../../chunks/astro/server_BCpdA0Tk.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/layout_D3ahR9qN.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Calendar, Filter, X } from 'lucide-react';
import { M as MODALITY_ORDER } from '../../chunks/schemas_BWmv8V5v.mjs';
import '../../chunks/_sentry-release-injection-file_BwnRfS4D.mjs';
import { $ as $$Table } from '../../chunks/Table_DaoQHMji.mjs';
import 'clsx';
/* empty css                                    */
import { D as DrawFormWizard } from '../../chunks/DrawFormWizard_BBAdbao3.mjs';
export { renderers } from '../../renderers.mjs';

function DrawTableFilters({
  initialFilters,
  onFilterChange,
  isLoading = false
}) {
  const [filters, setFilters] = useState({
    startDate: initialFilters?.startDate ?? "",
    endDate: initialFilters?.endDate ?? "",
    modality: initialFilters?.modality ?? ""
  });
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);
  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };
  const handleClear = () => {
    const cleared = { startDate: "", endDate: "", modality: "" };
    setFilters(cleared);
    onFilterChange(cleared);
  };
  const hasActiveFilters = filters.startDate || filters.endDate || filters.modality;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 rounded-xl border border-border bg-surface-elevated p-4 lg:flex-row", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxs("label", { htmlFor: "start-date", className: "mb-1 block text-sm font-medium text-text-secondary", children: [
        /* @__PURE__ */ jsx(Calendar, { className: "mr-1 inline size-4", "aria-hidden": "true" }),
        "Fecha desde"
      ] }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "date",
          id: "start-date",
          value: filters.startDate,
          onChange: (e) => handleChange("startDate", e.target.value),
          disabled: isLoading,
          className: "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary placeholder-text-muted transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxs("label", { htmlFor: "end-date", className: "mb-1 block text-sm font-medium text-text-secondary", children: [
        /* @__PURE__ */ jsx(Calendar, { className: "mr-1 inline size-4", "aria-hidden": "true" }),
        "Fecha hasta"
      ] }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "date",
          id: "end-date",
          value: filters.endDate,
          onChange: (e) => handleChange("endDate", e.target.value),
          disabled: isLoading,
          className: "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary placeholder-text-muted transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxs(
        "label",
        {
          htmlFor: "modality-filter",
          className: "mb-1 block text-sm font-medium text-text-secondary",
          children: [
            /* @__PURE__ */ jsx(Filter, { className: "mr-1 inline size-4", "aria-hidden": "true" }),
            "Modalidad"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "select",
        {
          id: "modality-filter",
          value: filters.modality,
          onChange: (e) => handleChange("modality", e.target.value),
          disabled: isLoading,
          className: "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Todas" }),
            MODALITY_ORDER.map((modality) => /* @__PURE__ */ jsx("option", { value: modality, children: modality.charAt(0) + modality.slice(1).toLowerCase().replace("_", " ") }, modality))
          ]
        }
      )
    ] }),
    hasActiveFilters && /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: handleClear,
        disabled: isLoading,
        className: "flex h-fit items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-text-secondary transition-colors hover:bg-surface hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50",
        "aria-label": "Limpiar filtros",
        children: [
          /* @__PURE__ */ jsx(X, { className: "size-4", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Limpiar filtros" })
        ]
      }
    )
  ] });
}

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$Astro = createAstro("https://quini6.com");
const $$Modal = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Modal;
  const {
    isOpen,
    title,
    size = "md",
    closeOnBackdrop = true,
    closeOnEscape = true,
    // onClose is handled via custom event in client script
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onClose: _onClose,
    "aria-describedby": ariaDescribedBy,
    // aria-labelledby is handled via aria-labelledby={titleId} in the template
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    "aria-labelledby": _ariaLabelledBy,
    // rest is not needed as we spread on the root element
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ..._rest
  } = Astro2.props;
  const modalId = `modal-${Math.random().toString(36).slice(2, 9)}`;
  const titleId = title ? `${modalId}-title` : void 0;
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl"
  };
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", `<script>
  // Focus trap implementation
  let previouslyFocusedElement: HTMLElement | null = null;
  let focusableElements: HTMLElement[] = [];

  function getFocusableElements(container: HTMLElement): HTMLElement[] {
    const selector = [
      'button:not([disabled]):not([tabindex="-1"])',
      '[href]:not([disabled]):not([tabindex="-1"])',
      'input:not([disabled]):not([tabindex="-1"])',
      'select:not([disabled]):not([tabindex="-1"])',
      'textarea:not([disabled]):not([tabindex="-1"])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
      (el) => el.offsetParent !== null
    ); // Only visible elements
  }

  function trapFocus(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    const modalRoot = document.querySelector('[data-modal-root]');
    if (!modalRoot) return;

    const closeOnEscape = modalRoot.dataset.closeOnEscape === 'true';
    if (closeOnEscape && event.key === 'Escape') {
      const closeBtn = modalRoot.querySelector('[data-modal-close]') as HTMLElement;
      closeBtn?.click();
    }

    trapFocus(event);
  }

  function handleBackdropClick(event: MouseEvent) {
    const modalRoot = document.querySelector('[data-modal-root]');
    if (!modalRoot) return;

    const closeOnBackdrop = modalRoot.dataset.closeOnBackdrop === 'true';
    if (!closeOnBackdrop) return;

    const panel = modalRoot.querySelector('[data-modal-panel]');
    if (panel && !panel.contains(event.target as Node)) {
      const closeBtn = modalRoot.querySelector('[data-modal-close]') as HTMLElement;
      closeBtn?.click();
    }
  }

  function initializeModal() {
    const modalRoot = document.querySelector('[data-modal-root]');
    if (!modalRoot) return;

    // Store previously focused element
    previouslyFocusedElement = document.activeElement as HTMLElement;

    // Get focusable elements
    const panel = modalRoot.querySelector('[data-modal-panel]');
    if (panel) {
      focusableElements = getFocusableElements(panel as HTMLElement);

      // Focus first focusable element or close button
      const firstFocusable = focusableElements[0];
      const closeBtn = modalRoot.querySelector('[data-modal-close]') as HTMLElement;
      (firstFocusable || closeBtn)?.focus();
    }

    // Add event listeners
    document.addEventListener('keydown', handleKeydown);
    modalRoot.addEventListener('click', handleBackdropClick);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  function cleanupModal() {
    document.removeEventListener('keydown', handleKeydown);
    const modalRoot = document.querySelector('[data-modal-root]');
    modalRoot?.removeEventListener('click', handleBackdropClick);

    // Restore body scroll
    document.body.style.overflow = '';

    // Return focus to previously focused element
    previouslyFocusedElement?.focus();
    previouslyFocusedElement = null;
    focusableElements = [];
  }

  // Initialize on mount
  initializeModal();

  // Handle close button
  const closeBtn = document.querySelector('[data-modal-close]');
  closeBtn?.addEventListener('click', () => {
    cleanupModal();
    // Dispatch custom event for parent to handle
    document.dispatchEvent(new CustomEvent('modal-close'));
  });

  // Listen for external close requests
  window.addEventListener(
    'modal-close-request',
    () => {
      cleanupModal();
    },
    { once: true }
  );
<\/script>`])), isOpen && renderTemplate`${maybeRenderHead()}<div class="fixed inset-0 z-modal-backdrop flex items-center justify-center p-4" role="dialog" aria-modal="true"${addAttribute(titleId, "aria-labelledby")}${addAttribute(ariaDescribedBy, "aria-describedby")} data-modal-root${addAttribute(closeOnBackdrop, "data-close-on-backdrop")}${addAttribute(closeOnEscape, "data-close-on-escape")} data-astro-cid-hrybwmjy><div class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200" aria-hidden="true" data-modal-backdrop data-astro-cid-hrybwmjy></div><div${addAttribute(modalId, "id")}${addAttribute(`
        relative w-full ${sizeClasses[size]}
        max-h-[90vh] transform animate-fade-in
        animate-in animate-zoom-in-95 overflow-hidden rounded-xl
        bg-surface shadow-xl transition-all
        duration-200 ease-out
        focus:outline-none
      `, "class")} data-modal-panel data-astro-cid-hrybwmjy>${title && renderTemplate`<header class="flex items-center justify-between border-b border-border px-6 py-4" data-astro-cid-hrybwmjy><h2${addAttribute(titleId, "id")} class="text-heading-md font-semibold text-text-primary" data-astro-cid-hrybwmjy>${title}</h2><button type="button" class="rounded-lg p-1 text-text-muted transition-colors hover:bg-neutral-100 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 dark:hover:bg-neutral-800" aria-label="Cerrar modal" data-modal-close data-astro-cid-hrybwmjy><svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-hrybwmjy><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-astro-cid-hrybwmjy></path></svg></button></header>`}<div class="max-h-[calc(90vh-80px)] overflow-y-auto px-6 py-4" data-modal-content data-astro-cid-hrybwmjy>${renderSlot($$result, $$slots["default"])}</div></div></div>`);
}, "D:/Desarrollo/quini6_frontend/src/components/ui/Modal.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", ` <script>
  // Client-side data fetching and state management
  // This runs in the browser after hydration
  let currentPage = 1;
  let currentFilters = { startDate: '', endDate: '', modality: '' };
  let totalPages = 1;

  async function fetchDraws(page = 1, filters = currentFilters) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '20',
    });

    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.modality) params.append('modality', filters.modality);

    const response = await fetch(\`/api/admin/draws?\${params.toString()}\`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error al cargar sorteos');
    }

    return response.json();
  }

  async function deleteDraw(id: string) {
    const response = await fetch(\`/api/admin/draws/\${id}\`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'X-CSRF-Token': window.getCsrfToken?.() ?? '',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar sorteo');
    }
  }

  function getCsrfToken(): string | null {
    const match = document.cookie.match(/(?:^|; )csrf_token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  }
  window.getCsrfToken = getCsrfToken;

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = \`toast \${type} flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-in\`;
    toast.innerHTML = \`
      <span class="text-sm">\${message}</span>
      <button class="ml-2 text-current opacity-70 hover:opacity-100" onclick="this.parentElement.remove()">\xD7</button>
    \`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', async () => {
    await loadDraws();
  });

  async function loadDraws() {
    const tableBody = document.getElementById('draws-table-body');
    const emptyState = document.getElementById('empty-state');
    const pagination = document.getElementById('pagination');

    if (tableBody) {
      tableBody.innerHTML =
        '<tr><td colspan="5" class="text-center py-8"><span class="animate-spin size-8 border-4 border-primary-500 border-t-transparent rounded-full"></span></td></tr>';
    }

    try {
      const data = await fetchDraws(currentPage, currentFilters);
      renderTable(data.data);
      renderPagination(data.page, data.totalPages);
    } catch (error) {
      console.error('Error loading draws:', error);
      if (tableBody) {
        tableBody.innerHTML = \`<tr><td colspan="5" class="text-center py-8 text-error-500">Error al cargar sorteos</td></tr>\`;
      }
    }
  }

  function renderTable(draws: DrawSummary[]) {
    const tableBody = document.getElementById('draws-table-body');
    const emptyState = document.getElementById('empty-state');

    if (!tableBody) return;

    if (draws.length === 0) {
      tableBody.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    tableBody.innerHTML = draws
      .map((draw) => {
        const resultsHtml = draw.results
          .map(
            (r) => \`
        <span class="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary-500/10 text-primary-500 text-xs font-mono">
          \${r.modality.charAt(0) + r.modality.slice(1).toLowerCase().replace('_', ' ')}: \${r.numbers.map((n) => formatDrawNumber(n)).join(' ')}
        </span>
      \`
          )
          .join(' ');

        return \`
        <tr class="dark:hover:bg-neutral-800/50 transition-colors hover:bg-neutral-50">
          <td class="text-text-primary px-4 py-3 text-sm font-mono">\${formatDrawNumber(draw.officialNumber)}</td>
          <td class="text-text-primary px-4 py-3 text-sm">\${new Date(draw.drawDate).toLocaleDateString('es-AR')}</td>
          <td class="text-text-primary px-4 py-3 text-sm flex flex-wrap gap-1">\${resultsHtml}</td>
          <td class="text-text-primary px-4 py-3 text-sm">
            <div class="flex items-center gap-2">
              <button
                data-action="edit"
                data-id="\${draw.id}"
                class="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary-500 hover:bg-primary-500/10 rounded-lg transition-colors"
              >
                <svg class="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                Editar
              </button>
              <button
                data-action="delete"
                data-id="\${draw.id}"
                class="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-error-500 hover:bg-error-500/10 rounded-lg transition-colors"
              >
                <svg class="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                Eliminar
              </button>
            </div>
          </td>
        </tr>
      \`;
      })
      .join('');

    // Attach event listeners
    tableBody.querySelectorAll('[data-action="edit"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.id;
        if (id) openEditModal(id);
      });
    });

    tableBody.querySelectorAll('[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.id;
        if (
          id &&
          confirm('\xBFEst\xE1 seguro de eliminar este sorteo? Esta acci\xF3n no se puede deshacer.')
        ) {
          try {
            await deleteDraw(id);
            showToast('Sorteo eliminado correctamente', 'success');
            await loadDraws();
          } catch (error) {
            showToast(error instanceof Error ? error.message : 'Error al eliminar', 'error');
          }
        }
      });
    });
  }

  function renderPagination(page: number, total: number) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    currentPage = page;
    totalPages = total;

    if (total <= 1) {
      pagination.innerHTML = '';
      return;
    }

    let html = '<nav class="flex items-center justify-center gap-2" aria-label="Paginaci\xF3n">';

    // Previous button
    html += \`
      <button
        data-page="\${page - 1}"
        \${page === 1 ? 'disabled' : ''}
        class="px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary hover:bg-surface rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Anterior
      </button>
    \`;

    // Page numbers
    const start = Math.max(1, page - 2);
    const end = Math.min(total, page + 2);

    if (start > 1) {
      html += \`<button data-page="1" class="px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary hover:bg-surface rounded-lg">1</button>\`;
      if (start > 2) html += \`<span class="px-2 text-text-muted">\u2B26</span>\`;
    }

    for (let i = start; i <= end; i++) {
      html += \`
        <button
          data-page="\${i}"
          \${i === page ? 'aria-current="page"' : ''}
          class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors \${i === page ? 'bg-primary-500 text-white' : 'text-text-secondary hover:text-text-primary hover:bg-surface'}"
        >
          \${i}
        </button>
      \`;
    }

    if (end < total) {
      if (end < total - 1) html += \`<span class="px-2 text-text-muted">\u2B26</span>\`;
      html += \`<button data-page="\${total}" class="px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary hover:bg-surface rounded-lg">\${total}</button>\`;
    }

    // Next button
    html += \`
      <button
        data-page="\${page + 1}"
        \${page === total ? 'disabled' : ''}
        class="px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary hover:bg-surface rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Siguiente
      </button>
    \`;

    html += '</nav>';
    pagination.innerHTML = html;

    pagination.querySelectorAll('[data-page]').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const page = parseInt((e.currentTarget as HTMLElement).dataset.page || '1');
        if (page !== currentPage && page >= 1 && page <= totalPages) {
          await loadDraws();
        }
      });
    });
  }

  // Modal handling
  let currentDrawId: string | null = null;
  let isEditing = false;

  const createModal = document.getElementById('create-modal');
  const editModal = document.getElementById('edit-modal');

  function openCreateModal() {
    isEditing = false;
    currentDrawId = null;
    if (createModal) {
      (createModal as any).showModal?.();
      createModal.classList.remove('hidden');
    }
  }

  async function openEditModal(id: string) {
    isEditing = true;
    currentDrawId = id;
    const editModalContent = document.getElementById('edit-modal-content');
    if (editModalContent) {
      editModalContent.innerHTML =
        '<div class="flex justify-center py-8"><span class="animate-spin size-8 border-4 border-primary-500 border-t-transparent rounded-full"></span></div>';
    }
    if (editModal) {
      (editModal as any).showModal?.();
      editModal.classList.remove('hidden');
      editModal.dataset.drawId = id;
    }

    try {
      const response = await fetch(\`/api/admin/draws/\${id}\`, { credentials: 'include' });
      if (!response.ok) throw new Error('Error al cargar sorteo');
      const draw = await response.json();
      // The DrawFormWizard in edit modal will be initialized with draw data
      if (editModalContent) {
        // Re-render with data - the React component will handle this
        // We'll use a custom event to pass data to the React island
        window.dispatchEvent(new CustomEvent('draw-data-loaded', { detail: draw }));
      }
    } catch (error) {
      console.error('Error loading draw:', error);
      if (editModalContent) {
        editModalContent.innerHTML = \`<p class="text-center text-error-500 py-8">Error al cargar sorteo</p>\`;
      }
    }
  }

  function closeModals() {
    if (createModal) {
      (createModal as any).close?.();
      createModal.classList.add('hidden');
    }
    if (editModal) {
      (editModal as any).close?.();
      editModal.classList.add('hidden');
    }
    currentDrawId = null;
    isEditing = false;
  }

  // Make closeModals available globally for React island onCancel handlers
  window.closeModals = closeModals;

  async function handleCreateSubmit(data: any) {
    try {
      const response = await fetch('/api/admin/draws', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken() || '',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let message = 'Error al guardar sorteo';
        try {
          const errorData: unknown = await response.json();
          // Manual type check instead of type guard
          const isValidError =
            errorData !== null &&
            typeof errorData === 'object' &&
            'message' in errorData &&
            typeof (errorData as Record<string, unknown>).message === 'string';
          if (isValidError) {
            message = String((errorData as Record<string, unknown>).message);
          }
        } catch {
          // ignore parse error
        }
        throw new Error(message);
      }

      showToast('Sorteo creado correctamente', 'success');
      closeModals();
      await loadDraws();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error al guardar', 'error');
      throw error;
    }
  }

  async function handleEditSubmit(data: any) {
    if (!currentDrawId) return;
    try {
      const response = await fetch(\`/api/admin/draws/\${currentDrawId}\`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken() || '',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let message = 'Error al actualizar sorteo';
        try {
          const errorData: unknown = await response.json();
          // Manual type check instead of type guard
          const isValidError =
            errorData !== null &&
            typeof errorData === 'object' &&
            'message' in errorData &&
            typeof (errorData as Record<string, unknown>).message === 'string';
          if (isValidError) {
            message = String((errorData as Record<string, unknown>).message);
          }
        } catch {
          // ignore parse error
        }
        throw new Error(message);
      }

      showToast('Sorteo actualizado correctamente', 'success');
      closeModals();
      await loadDraws();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error al guardar', 'error');
      throw error;
    }
  }

  function handleCancel() {
    closeModals();
  }

  // Handle filter changes
  window.addEventListener('filters-changed', async (e: CustomEvent) => {
    currentFilters = e.detail;
    currentPage = 1;
    await loadDraws();
  });

  // Handle form submissions from DrawFormWizard
  window.addEventListener('draw-form-submit', async (e: CustomEvent) => {
    const { data, isEditing } = e.detail;
    if (isEditing && currentDrawId) {
      await handleEditSubmit(data, currentDrawId);
    } else {
      await handleCreateSubmit(data);
    }
  });

  // Handle cross-tab refresh from import wizard
  window.addEventListener('draws:refresh', async () => {
    await loadDraws();
  });

  async function handleCreateSubmit(data: any) {
    try {
      const response = await fetch('/api/admin/draws', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken() || '',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData: unknown = await response.json();
        // Manual type check instead of assuming error.message exists
        const isValidError =
          errorData !== null &&
          typeof errorData === 'object' &&
          'message' in errorData &&
          typeof (errorData as Record<string, unknown>).message === 'string';
        const message = isValidError
          ? String((errorData as Record<string, unknown>).message)
          : 'Error al guardar sorteo';
        throw new Error(message);
      }

      showToast('Sorteo creado correctamente', 'success');
      closeModals();
      await loadDraws();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error al guardar', 'error');
      throw error;
    }
  }

  async function handleEditSubmit(data: any, drawId: string) {
    try {
      const response = await fetch(\`/api/admin/draws/\${drawId}\`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken() || '',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData: unknown = await response.json();
        // Manual type check instead of assuming error.message exists
        const isValidError =
          errorData !== null &&
          typeof errorData === 'object' &&
          'message' in errorData &&
          typeof (errorData as Record<string, unknown>).message === 'string';
        const message = isValidError
          ? String((errorData as Record<string, unknown>).message)
          : 'Error al actualizar sorteo';
        throw new Error(message);
      }

      showToast('Sorteo actualizado correctamente', 'success');
      closeModals();
      await loadDraws();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error al guardar', 'error');
      throw error;
    }
  }
<\/script> `, ""], ["", ` <script>
  // Client-side data fetching and state management
  // This runs in the browser after hydration
  let currentPage = 1;
  let currentFilters = { startDate: '', endDate: '', modality: '' };
  let totalPages = 1;

  async function fetchDraws(page = 1, filters = currentFilters) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '20',
    });

    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.modality) params.append('modality', filters.modality);

    const response = await fetch(\\\`/api/admin/draws?\\\${params.toString()}\\\`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error al cargar sorteos');
    }

    return response.json();
  }

  async function deleteDraw(id: string) {
    const response = await fetch(\\\`/api/admin/draws/\\\${id}\\\`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'X-CSRF-Token': window.getCsrfToken?.() ?? '',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar sorteo');
    }
  }

  function getCsrfToken(): string | null {
    const match = document.cookie.match(/(?:^|; )csrf_token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  }
  window.getCsrfToken = getCsrfToken;

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = \\\`toast \\\${type} flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-in\\\`;
    toast.innerHTML = \\\`
      <span class="text-sm">\\\${message}</span>
      <button class="ml-2 text-current opacity-70 hover:opacity-100" onclick="this.parentElement.remove()">\xD7</button>
    \\\`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', async () => {
    await loadDraws();
  });

  async function loadDraws() {
    const tableBody = document.getElementById('draws-table-body');
    const emptyState = document.getElementById('empty-state');
    const pagination = document.getElementById('pagination');

    if (tableBody) {
      tableBody.innerHTML =
        '<tr><td colspan="5" class="text-center py-8"><span class="animate-spin size-8 border-4 border-primary-500 border-t-transparent rounded-full"></span></td></tr>';
    }

    try {
      const data = await fetchDraws(currentPage, currentFilters);
      renderTable(data.data);
      renderPagination(data.page, data.totalPages);
    } catch (error) {
      console.error('Error loading draws:', error);
      if (tableBody) {
        tableBody.innerHTML = \\\`<tr><td colspan="5" class="text-center py-8 text-error-500">Error al cargar sorteos</td></tr>\\\`;
      }
    }
  }

  function renderTable(draws: DrawSummary[]) {
    const tableBody = document.getElementById('draws-table-body');
    const emptyState = document.getElementById('empty-state');

    if (!tableBody) return;

    if (draws.length === 0) {
      tableBody.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    tableBody.innerHTML = draws
      .map((draw) => {
        const resultsHtml = draw.results
          .map(
            (r) => \\\`
        <span class="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary-500/10 text-primary-500 text-xs font-mono">
          \\\${r.modality.charAt(0) + r.modality.slice(1).toLowerCase().replace('_', ' ')}: \\\${r.numbers.map((n) => formatDrawNumber(n)).join(' ')}
        </span>
      \\\`
          )
          .join(' ');

        return \\\`
        <tr class="dark:hover:bg-neutral-800/50 transition-colors hover:bg-neutral-50">
          <td class="text-text-primary px-4 py-3 text-sm font-mono">\\\${formatDrawNumber(draw.officialNumber)}</td>
          <td class="text-text-primary px-4 py-3 text-sm">\\\${new Date(draw.drawDate).toLocaleDateString('es-AR')}</td>
          <td class="text-text-primary px-4 py-3 text-sm flex flex-wrap gap-1">\\\${resultsHtml}</td>
          <td class="text-text-primary px-4 py-3 text-sm">
            <div class="flex items-center gap-2">
              <button
                data-action="edit"
                data-id="\\\${draw.id}"
                class="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary-500 hover:bg-primary-500/10 rounded-lg transition-colors"
              >
                <svg class="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                Editar
              </button>
              <button
                data-action="delete"
                data-id="\\\${draw.id}"
                class="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-error-500 hover:bg-error-500/10 rounded-lg transition-colors"
              >
                <svg class="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                Eliminar
              </button>
            </div>
          </td>
        </tr>
      \\\`;
      })
      .join('');

    // Attach event listeners
    tableBody.querySelectorAll('[data-action="edit"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.id;
        if (id) openEditModal(id);
      });
    });

    tableBody.querySelectorAll('[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.id;
        if (
          id &&
          confirm('\xBFEst\xE1 seguro de eliminar este sorteo? Esta acci\xF3n no se puede deshacer.')
        ) {
          try {
            await deleteDraw(id);
            showToast('Sorteo eliminado correctamente', 'success');
            await loadDraws();
          } catch (error) {
            showToast(error instanceof Error ? error.message : 'Error al eliminar', 'error');
          }
        }
      });
    });
  }

  function renderPagination(page: number, total: number) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    currentPage = page;
    totalPages = total;

    if (total <= 1) {
      pagination.innerHTML = '';
      return;
    }

    let html = '<nav class="flex items-center justify-center gap-2" aria-label="Paginaci\xF3n">';

    // Previous button
    html += \\\`
      <button
        data-page="\\\${page - 1}"
        \\\${page === 1 ? 'disabled' : ''}
        class="px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary hover:bg-surface rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Anterior
      </button>
    \\\`;

    // Page numbers
    const start = Math.max(1, page - 2);
    const end = Math.min(total, page + 2);

    if (start > 1) {
      html += \\\`<button data-page="1" class="px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary hover:bg-surface rounded-lg">1</button>\\\`;
      if (start > 2) html += \\\`<span class="px-2 text-text-muted">\u2B26</span>\\\`;
    }

    for (let i = start; i <= end; i++) {
      html += \\\`
        <button
          data-page="\\\${i}"
          \\\${i === page ? 'aria-current="page"' : ''}
          class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors \\\${i === page ? 'bg-primary-500 text-white' : 'text-text-secondary hover:text-text-primary hover:bg-surface'}"
        >
          \\\${i}
        </button>
      \\\`;
    }

    if (end < total) {
      if (end < total - 1) html += \\\`<span class="px-2 text-text-muted">\u2B26</span>\\\`;
      html += \\\`<button data-page="\\\${total}" class="px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary hover:bg-surface rounded-lg">\\\${total}</button>\\\`;
    }

    // Next button
    html += \\\`
      <button
        data-page="\\\${page + 1}"
        \\\${page === total ? 'disabled' : ''}
        class="px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary hover:bg-surface rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Siguiente
      </button>
    \\\`;

    html += '</nav>';
    pagination.innerHTML = html;

    pagination.querySelectorAll('[data-page]').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const page = parseInt((e.currentTarget as HTMLElement).dataset.page || '1');
        if (page !== currentPage && page >= 1 && page <= totalPages) {
          await loadDraws();
        }
      });
    });
  }

  // Modal handling
  let currentDrawId: string | null = null;
  let isEditing = false;

  const createModal = document.getElementById('create-modal');
  const editModal = document.getElementById('edit-modal');

  function openCreateModal() {
    isEditing = false;
    currentDrawId = null;
    if (createModal) {
      (createModal as any).showModal?.();
      createModal.classList.remove('hidden');
    }
  }

  async function openEditModal(id: string) {
    isEditing = true;
    currentDrawId = id;
    const editModalContent = document.getElementById('edit-modal-content');
    if (editModalContent) {
      editModalContent.innerHTML =
        '<div class="flex justify-center py-8"><span class="animate-spin size-8 border-4 border-primary-500 border-t-transparent rounded-full"></span></div>';
    }
    if (editModal) {
      (editModal as any).showModal?.();
      editModal.classList.remove('hidden');
      editModal.dataset.drawId = id;
    }

    try {
      const response = await fetch(\\\`/api/admin/draws/\\\${id}\\\`, { credentials: 'include' });
      if (!response.ok) throw new Error('Error al cargar sorteo');
      const draw = await response.json();
      // The DrawFormWizard in edit modal will be initialized with draw data
      if (editModalContent) {
        // Re-render with data - the React component will handle this
        // We'll use a custom event to pass data to the React island
        window.dispatchEvent(new CustomEvent('draw-data-loaded', { detail: draw }));
      }
    } catch (error) {
      console.error('Error loading draw:', error);
      if (editModalContent) {
        editModalContent.innerHTML = \\\`<p class="text-center text-error-500 py-8">Error al cargar sorteo</p>\\\`;
      }
    }
  }

  function closeModals() {
    if (createModal) {
      (createModal as any).close?.();
      createModal.classList.add('hidden');
    }
    if (editModal) {
      (editModal as any).close?.();
      editModal.classList.add('hidden');
    }
    currentDrawId = null;
    isEditing = false;
  }

  // Make closeModals available globally for React island onCancel handlers
  window.closeModals = closeModals;

  async function handleCreateSubmit(data: any) {
    try {
      const response = await fetch('/api/admin/draws', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken() || '',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let message = 'Error al guardar sorteo';
        try {
          const errorData: unknown = await response.json();
          // Manual type check instead of type guard
          const isValidError =
            errorData !== null &&
            typeof errorData === 'object' &&
            'message' in errorData &&
            typeof (errorData as Record<string, unknown>).message === 'string';
          if (isValidError) {
            message = String((errorData as Record<string, unknown>).message);
          }
        } catch {
          // ignore parse error
        }
        throw new Error(message);
      }

      showToast('Sorteo creado correctamente', 'success');
      closeModals();
      await loadDraws();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error al guardar', 'error');
      throw error;
    }
  }

  async function handleEditSubmit(data: any) {
    if (!currentDrawId) return;
    try {
      const response = await fetch(\\\`/api/admin/draws/\\\${currentDrawId}\\\`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken() || '',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let message = 'Error al actualizar sorteo';
        try {
          const errorData: unknown = await response.json();
          // Manual type check instead of type guard
          const isValidError =
            errorData !== null &&
            typeof errorData === 'object' &&
            'message' in errorData &&
            typeof (errorData as Record<string, unknown>).message === 'string';
          if (isValidError) {
            message = String((errorData as Record<string, unknown>).message);
          }
        } catch {
          // ignore parse error
        }
        throw new Error(message);
      }

      showToast('Sorteo actualizado correctamente', 'success');
      closeModals();
      await loadDraws();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error al guardar', 'error');
      throw error;
    }
  }

  function handleCancel() {
    closeModals();
  }

  // Handle filter changes
  window.addEventListener('filters-changed', async (e: CustomEvent) => {
    currentFilters = e.detail;
    currentPage = 1;
    await loadDraws();
  });

  // Handle form submissions from DrawFormWizard
  window.addEventListener('draw-form-submit', async (e: CustomEvent) => {
    const { data, isEditing } = e.detail;
    if (isEditing && currentDrawId) {
      await handleEditSubmit(data, currentDrawId);
    } else {
      await handleCreateSubmit(data);
    }
  });

  // Handle cross-tab refresh from import wizard
  window.addEventListener('draws:refresh', async () => {
    await loadDraws();
  });

  async function handleCreateSubmit(data: any) {
    try {
      const response = await fetch('/api/admin/draws', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken() || '',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData: unknown = await response.json();
        // Manual type check instead of assuming error.message exists
        const isValidError =
          errorData !== null &&
          typeof errorData === 'object' &&
          'message' in errorData &&
          typeof (errorData as Record<string, unknown>).message === 'string';
        const message = isValidError
          ? String((errorData as Record<string, unknown>).message)
          : 'Error al guardar sorteo';
        throw new Error(message);
      }

      showToast('Sorteo creado correctamente', 'success');
      closeModals();
      await loadDraws();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error al guardar', 'error');
      throw error;
    }
  }

  async function handleEditSubmit(data: any, drawId: string) {
    try {
      const response = await fetch(\\\`/api/admin/draws/\\\${drawId}\\\`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken() || '',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData: unknown = await response.json();
        // Manual type check instead of assuming error.message exists
        const isValidError =
          errorData !== null &&
          typeof errorData === 'object' &&
          'message' in errorData &&
          typeof (errorData as Record<string, unknown>).message === 'string';
        const message = isValidError
          ? String((errorData as Record<string, unknown>).message)
          : 'Error al actualizar sorteo';
        throw new Error(message);
      }

      showToast('Sorteo actualizado correctamente', 'success');
      closeModals();
      await loadDraws();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error al guardar', 'error');
      throw error;
    }
  }
<\/script> `, ""])), renderScript($$result, "D:/Desarrollo/quini6_frontend/src/pages/admin/draws/index.astro?astro&type=script&index=0&lang.ts"), renderComponent($$result, "AdminLayout", $$Layout, { "title": "Gesti\xF3n de Sorteos - Admin Quini 6", "data-astro-cid-o37htkrf": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6" data-astro-cid-o37htkrf> <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" data-astro-cid-o37htkrf> <div data-astro-cid-o37htkrf> <h1 class="font-sans text-2xl font-bold text-text-primary" data-astro-cid-o37htkrf>Gestión de Sorteos</h1> <p class="mt-1 text-text-secondary" data-astro-cid-o37htkrf>Administra los sorteos del Quini 6</p> </div> <div class="flex items-center gap-3" data-astro-cid-o37htkrf> <a href="/admin/imports/upload" class="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2" data-astro-cid-o37htkrf> <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-o37htkrf><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" data-astro-cid-o37htkrf></path></svg>
Importar Sorteos
</a> <button id="create-draw-btn" class="hover:bg-primary-500/90 flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface" data-astro-cid-o37htkrf> <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-o37htkrf><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" data-astro-cid-o37htkrf></path></svg>
Crear Sorteo
</button> </div> </div> <!-- Filters --> ${renderComponent($$result2, "DrawTableFilters", DrawTableFilters, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@components/admin/DrawTableFilters.tsx", "client:component-export": "DrawTableFilters", "data-astro-cid-o37htkrf": true })} <!-- Draws Table --> <div class="overflow-hidden rounded-xl border border-border bg-surface-elevated" data-astro-cid-o37htkrf> <div class="overflow-x-auto" data-astro-cid-o37htkrf> ${renderComponent($$result2, "Table", $$Table, { "columns": [
    { key: "officialNumber", header: "N\xBA Oficial", align: "center" },
    { key: "drawDate", header: "Fecha", align: "center" },
    { key: "results", header: "Resultados", render: () => ({ html: "" }) },
    // Handled by JS
    { key: "actions", header: "Acciones", align: "center", render: () => ({ html: "" }) }
    // Handled by JS
  ], "data": [], "rowKey": "id", "emptyState": "No hay sorteos registrados", "loadingState": true, "loadingText": "Cargando sorteos...", "aria-label": "Tabla de sorteos", "data-astro-cid-o37htkrf": true }, { "tbody": async ($$result3) => renderTemplate`<tbody id="draws-table-body" class="divide-y divide-border" data-astro-cid-o37htkrf></tbody>` })} </div> <div id="pagination" class="border-t border-border px-4 py-3" data-astro-cid-o37htkrf></div> </div> <!-- Create Modal --> ${renderComponent($$result2, "Modal", $$Modal, { "id": "create-modal", "title": "Crear Nuevo Sorteo", "isOpen": false, "class": "max-h-[90vh] max-w-3xl overflow-hidden", "data-astro-cid-o37htkrf": true }, { "default": async ($$result3) => renderTemplate` <div id="create-modal-content" class="p-0" data-astro-cid-o37htkrf> ${renderComponent($$result3, "DrawFormWizard", DrawFormWizard, { "client:visible": true, "isEditing": false, "onSubmit": ((data) => {
    window.dispatchEvent(
      new CustomEvent("draw-form-submit", {
        detail: { data, isEditing: false }
      })
    );
  }), "onCancel": (() => {
    window.closeModals?.();
  }), "client:component-hydration": "visible", "client:component-path": "@components/admin/DrawFormWizard.tsx", "client:component-export": "DrawFormWizard", "data-astro-cid-o37htkrf": true })} </div> ` })} <!-- Edit Modal --> ${renderComponent($$result2, "Modal", $$Modal, { "id": "edit-modal", "title": "Editar Sorteo", "isOpen": false, "class": "max-h-[90vh] max-w-3xl overflow-hidden", "data-astro-cid-o37htkrf": true }, { "default": async ($$result3) => renderTemplate` <div id="edit-modal-content" class="p-0" data-astro-cid-o37htkrf> ${renderComponent($$result3, "DrawFormWizard", DrawFormWizard, { "client:visible": true, "isEditing": true, "onSubmit": ((data) => {
    const editModal = document.getElementById("edit-modal");
    const drawId = editModal?.dataset.drawId ?? "";
    window.dispatchEvent(
      new CustomEvent("draw-form-submit", {
        detail: { data, isEditing: true, drawId }
      })
    );
  }), "onCancel": (() => {
    window.closeModals?.();
  }), "client:component-hydration": "visible", "client:component-path": "@components/admin/DrawFormWizard.tsx", "client:component-export": "DrawFormWizard", "data-astro-cid-o37htkrf": true })} </div> ` })} <!-- Toast Container --> <div id="toast-container" class="fixed bottom-4 right-4 z-50 flex flex-col gap-2" data-astro-cid-o37htkrf></div> </div> ${renderScript($$result2, "D:/Desarrollo/quini6_frontend/src/pages/admin/draws/index.astro?astro&type=script&index=1&lang.ts")}  ` }));
}, "D:/Desarrollo/quini6_frontend/src/pages/admin/draws/index.astro", void 0);

const $$file = "D:/Desarrollo/quini6_frontend/src/pages/admin/draws/index.astro";
const $$url = "/admin/draws";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
