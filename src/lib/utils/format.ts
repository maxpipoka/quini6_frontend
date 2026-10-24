/**
 * Format utilities - currency, date, number formatting
 */

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatCurrency(amount: number, currency = 'ARS', locale = 'es-AR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('es-AR', options).format(value);
}

export function formatDate(dateString: string, pattern = 'dd/MM/yyyy', locale = es): string {
  try {
    const date = parseISO(dateString);
    return format(date, pattern, { locale });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  return formatDate(dateString, 'dd/MM/yyyy HH:mm');
}

export function formatDrawNumber(n: number): string {
  return n.toString().padStart(2, '0');
}

export function parseDrawNumber(s: string): number {
  const n = parseInt(s, 10);
  if (isNaN(n) || n < 0 || n > 45) {
    throw new Error(`Número inválido: ${s}`);
  }
  return n;
}

export function formatPercentage(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
}
