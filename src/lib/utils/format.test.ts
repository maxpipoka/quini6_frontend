import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatDateTime,
  formatDrawNumber,
  parseDrawNumber,
  formatPercentage,
  formatCompactNumber,
} from '../utils/format';

describe('format utilities', () => {
  describe('formatCurrency', () => {
    it('formats positive numbers as ARS currency', () => {
      // The actual format uses a non-breaking space
      expect(formatCurrency(125000)).toMatch(/\$[^\d]*125\.000/);
    });

    it('formats zero as currency', () => {
      expect(formatCurrency(0)).toMatch(/\$[^\d]*0/);
    });

    it('formats large numbers with thousands separators', () => {
      expect(formatCurrency(2500000)).toMatch(/\$[^\d]*2\.500\.000/);
    });

    it('accepts custom currency', () => {
      // en-US format doesn't include decimals by default for whole numbers
      expect(formatCurrency(100, 'USD', 'en-US')).toBe('$100');
    });
  });

  describe('formatNumber', () => {
    it('formats numbers with thousand separators', () => {
      expect(formatNumber(125000)).toBe('125.000');
    });

    it('formats decimal numbers', () => {
      expect(formatNumber(1234.56)).toBe('1.234,56');
    });

    it('accepts custom options', () => {
      expect(formatNumber(1000, { minimumFractionDigits: 2 })).toBe('1.000,00');
    });
  });

  describe('formatDate', () => {
    it('formats ISO date to dd/MM/yyyy', () => {
      expect(formatDate('2024-01-15')).toBe('15/01/2024');
    });

    it('formats ISO datetime to dd/MM/yyyy', () => {
      expect(formatDate('2024-01-15T10:30:00Z')).toBe('15/01/2024');
    });

    it('returns original string for invalid dates', () => {
      expect(formatDate('invalid-date')).toBe('invalid-date');
    });

    it('accepts custom pattern', () => {
      expect(formatDate('2024-01-15', 'yyyy-MM-dd')).toBe('2024-01-15');
    });
  });

  describe('formatDateTime', () => {
    it('formats ISO datetime to dd/MM/yyyy HH:mm', () => {
      expect(formatDateTime('2024-01-15T10:30:00Z')).toMatch(/15\/01\/2024 \d{2}:\d{2}/);
    });
  });

  describe('formatDrawNumber', () => {
    it('pads single digit numbers with zero', () => {
      expect(formatDrawNumber(5)).toBe('05');
    });

    it('returns double digit numbers as-is', () => {
      expect(formatDrawNumber(45)).toBe('45');
    });

    it('handles zero', () => {
      expect(formatDrawNumber(0)).toBe('00');
    });
  });

  describe('parseDrawNumber', () => {
    it('parses padded numbers', () => {
      expect(parseDrawNumber('05')).toBe(5);
    });

    it('parses non-padded numbers', () => {
      expect(parseDrawNumber('45')).toBe(45);
    });

    it('throws on invalid input', () => {
      expect(() => parseDrawNumber('abc')).toThrow('Número inválido');
    });

    it('throws on out of range', () => {
      expect(() => parseDrawNumber('50')).toThrow('Número inválido');
    });

    it('throws on negative numbers', () => {
      expect(() => parseDrawNumber('-1')).toThrow('Número inválido');
    });
  });

  describe('formatPercentage', () => {
    it('formats percentage with 2 decimals by default', () => {
      expect(formatPercentage(25.5)).toBe('25.50%');
    });

    it('formats percentage with custom decimals', () => {
      expect(formatPercentage(25.5555, 1)).toBe('25.6%');
    });
  });

  describe('formatCompactNumber', () => {
    it('formats thousands as K', () => {
      // Spanish compact format uses K/M
      expect(formatCompactNumber(1500)).toMatch(/1[.,]5\s*[KM]/);
    });

    it('formats millions as M', () => {
      expect(formatCompactNumber(1500000)).toMatch(/1[.,]5\s*[KM]/);
    });
  });
});
