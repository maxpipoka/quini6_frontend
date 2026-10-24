/**
 * Validation utilities - extracted from schemas for unit testing
 */

export function validateUniqueNumbers(numbers: number[]): { valid: boolean; error?: string } {
  if (numbers.length !== 6) {
    return { valid: false, error: 'Debe seleccionar exactamente 6 números' };
  }
  if (new Set(numbers).size !== 6) {
    return { valid: false, error: 'Los números no pueden repetirse' };
  }
  if (!numbers.every((n) => n >= 0 && n <= 45)) {
    return { valid: false, error: 'Los números deben estar entre 0 y 45' };
  }
  return { valid: true };
}

export function validateDateRange(
  fromDate?: string,
  toDate?: string
): { valid: boolean; error?: string } {
  if (fromDate && toDate) {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    if (from > to) {
      return { valid: false, error: 'La fecha de inicio debe ser anterior a la fecha de fin' };
    }
  }
  return { valid: true };
}

export function validateDrawNumber(number: number): { valid: boolean; error?: string } {
  if (!Number.isInteger(number)) {
    return { valid: false, error: 'El número debe ser un entero' };
  }
  if (number < 0 || number > 45) {
    return { valid: false, error: 'El número debe estar entre 0 y 45' };
  }
  return { valid: true };
}
