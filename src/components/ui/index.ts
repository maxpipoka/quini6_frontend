// Base UI Components - Barrel Exports
// All components are pure Astro components (no client JS needed except Modal)

export { default as Button } from './Button.astro';
export { default as Input } from './Input.astro';
export { default as Select } from './Select.astro';
export { default as Modal } from './Modal.astro';
export { default as Toast } from './Toast.astro';
export { default as Spinner } from './Spinner.astro';
export { default as Table } from './Table.astro';
export { default as Pagination } from './Pagination.astro';

// Re-export ErrorBoundary from PR 1
export { default as ErrorBoundary } from './ErrorBoundary.astro';

// Type exports for consumers
export type { Props as ButtonProps } from './Button.astro';
export type { Props as InputProps } from './Input.astro';
export type { Props as SelectProps } from './Select.astro';
export type { Props as ModalProps } from './Modal.astro';
export type { Props as ToastProps } from './Toast.astro';
export type { Props as SpinnerProps } from './Spinner.astro';
export type { Props as TableProps } from './Table.astro';
export type { Props as PaginationProps } from './Pagination.astro';
export type { Props as ErrorBoundaryProps } from './ErrorBoundary.astro';
