import { describe, it, expect } from 'vitest';
import { validateUniqueNumbers, validateDateRange, validateDrawNumber } from '../utils/validation';

describe('validation utilities', () => {
  describe('validateUniqueNumbers', () => {
    it('accepts valid 6 unique numbers in range', () => {
      const result = validateUniqueNumbers([5, 12, 23, 34, 41, 45]);
      expect(result.valid).toBe(true);
    });

    it('rejects array with wrong length', () => {
      const result = validateUniqueNumbers([1, 2, 3]);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Debe seleccionar exactamente 6 números');
    });

    it('rejects array with duplicate numbers', () => {
      const result = validateUniqueNumbers([5, 12, 23, 34, 41, 5]);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Los números no pueden repetirse');
    });

    it('rejects numbers out of range (negative)', () => {
      const result = validateUniqueNumbers([-1, 12, 23, 34, 41, 45]);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Los números deben estar entre 0 y 45');
    });

    it('rejects numbers out of range (>45)', () => {
      const result = validateUniqueNumbers([5, 12, 23, 34, 41, 46]);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Los números deben estar entre 0 y 45');
    });

    it('accepts zero as valid number', () => {
      const result = validateUniqueNumbers([0, 12, 23, 34, 41, 45]);
      expect(result.valid).toBe(true);
    });

    it('accepts 45 as valid number', () => {
      const result = validateUniqueNumbers([5, 12, 23, 34, 41, 45]);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateDateRange', () => {
    it('accepts valid date range', () => {
      const result = validateDateRange('2024-01-01', '2024-12-31');
      expect(result.valid).toBe(true);
    });

    it('accepts single fromDate', () => {
      const result = validateDateRange('2024-01-01');
      expect(result.valid).toBe(true);
    });

    it('accepts single toDate', () => {
      const result = validateDateRange(undefined, '2024-12-31');
      expect(result.valid).toBe(true);
    });

    it('accepts both undefined', () => {
      const result = validateDateRange();
      expect(result.valid).toBe(true);
    });

    it('rejects fromDate after toDate', () => {
      const result = validateDateRange('2024-12-31', '2024-01-01');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('La fecha de inicio debe ser anterior a la fecha de fin');
    });

    it('accepts same date for from and to', () => {
      const result = validateDateRange('2024-01-15', '2024-01-15');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateDrawNumber', () => {
    it('accepts valid numbers 0-45', () => {
      expect(validateDrawNumber(0).valid).toBe(true);
      expect(validateDrawNumber(1).valid).toBe(true);
      expect(validateDrawNumber(45).valid).toBe(true);
    });

    it('rejects negative numbers', () => {
      const result = validateDrawNumber(-1);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('El número debe estar entre 0 y 45');
    });

    it('rejects numbers > 45', () => {
      const result = validateDrawNumber(46);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('El número debe estar entre 0 y 45');
    });

    it('rejects non-integers', () => {
      const result = validateDrawNumber(5.5);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('El número debe ser un entero');
    });

    it('rejects NaN', () => {
      const result = validateDrawNumber(NaN);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('El número debe ser un entero');
    });
  });
});
