import { describe, it, expect } from 'vitest';
import * as schemas from '../schemas';

describe('Zod schemas', () => {
  describe('ModalityEnum', () => {
    it('accepts valid modalities', () => {
      expect(schemas.ModalityEnum.safeParse('TRADICIONAL').success).toBe(true);
      expect(schemas.ModalityEnum.safeParse('LA_SEGUNDA').success).toBe(true);
      expect(schemas.ModalityEnum.safeParse('REVANCHA').success).toBe(true);
      expect(schemas.ModalityEnum.safeParse('SIEMPRE_SALE').success).toBe(true);
    });

    it('rejects invalid modality', () => {
      const result = schemas.ModalityEnum.safeParse('INVALID');
      expect(result.success).toBe(false);
    });
  });

  describe('DrawNumberSchema', () => {
    it('accepts valid numbers 0-45', () => {
      expect(schemas.DrawNumberSchema.safeParse(0).success).toBe(true);
      expect(schemas.DrawNumberSchema.safeParse(23).success).toBe(true);
      expect(schemas.DrawNumberSchema.safeParse(45).success).toBe(true);
    });

    it('rejects negative numbers', () => {
      expect(schemas.DrawNumberSchema.safeParse(-1).success).toBe(false);
    });

    it('rejects numbers > 45', () => {
      expect(schemas.DrawNumberSchema.safeParse(46).success).toBe(false);
    });

    it('rejects non-integers', () => {
      expect(schemas.DrawNumberSchema.safeParse(5.5).success).toBe(false);
    });
  });

  describe('SixUniqueNumbersSchema', () => {
    it('accepts 6 unique valid numbers', () => {
      const result = schemas.SixUniqueNumbersSchema.safeParse([5, 12, 23, 34, 41, 45]);
      expect(result.success).toBe(true);
    });

    it('rejects array with wrong length (too few)', () => {
      const result = schemas.SixUniqueNumbersSchema.safeParse([1, 2, 3]);
      expect(result.success).toBe(false);
    });

    it('rejects array with wrong length (too many)', () => {
      const result = schemas.SixUniqueNumbersSchema.safeParse([1, 2, 3, 4, 5, 6, 7]);
      expect(result.success).toBe(false);
    });

    it('rejects array with duplicate numbers', () => {
      const result = schemas.SixUniqueNumbersSchema.safeParse([5, 12, 23, 34, 41, 5]);
      expect(result.success).toBe(false);
    });

    it('rejects array with out of range numbers', () => {
      const result = schemas.SixUniqueNumbersSchema.safeParse([5, 12, 23, 34, 41, 46]);
      expect(result.success).toBe(false);
    });
  });

  describe('DrawResultSchema', () => {
    const validDrawResult = {
      modality: 'TRADICIONAL',
      numbers: [5, 12, 23, 34, 41, 45],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    };

    it('accepts valid draw result', () => {
      const result = schemas.DrawResultSchema.safeParse(validDrawResult);
      expect(result.success).toBe(true);
    });

    it('rejects invalid modality', () => {
      const result = schemas.DrawResultSchema.safeParse({
        ...validDrawResult,
        modality: 'INVALID',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid numbers', () => {
      const result = schemas.DrawResultSchema.safeParse({
        ...validDrawResult,
        numbers: [5, 12, 23, 34, 41, 46],
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid datetime', () => {
      const result = schemas.DrawResultSchema.safeParse({
        ...validDrawResult,
        createdAt: 'invalid-date',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('DrawResponseSchema', () => {
    const validDrawResponse = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      officialNumber: 3245,
      drawDate: '2024-01-15T10:00:00Z',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      results: [
        {
          modality: 'TRADICIONAL',
          numbers: [5, 12, 23, 34, 41, 45],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          modality: 'LA_SEGUNDA',
          numbers: [1, 2, 3, 4, 5, 6],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          modality: 'REVANCHA',
          numbers: [7, 8, 9, 10, 11, 12],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          modality: 'SIEMPRE_SALE',
          numbers: [13, 14, 15, 16, 17, 18],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
      ],
    };

    it('accepts valid draw response', () => {
      const result = schemas.DrawResponseSchema.safeParse(validDrawResponse);
      expect(result.success).toBe(true);
    });

    it('rejects invalid UUID', () => {
      const result = schemas.DrawResponseSchema.safeParse({
        ...validDrawResponse,
        id: 'invalid-uuid',
      });
      expect(result.success).toBe(false);
    });

    it('rejects non-positive officialNumber', () => {
      const result = schemas.DrawResponseSchema.safeParse({
        ...validDrawResponse,
        officialNumber: 0,
      });
      expect(result.success).toBe(false);
    });

    it('rejects wrong number of results', () => {
      const result = schemas.DrawResponseSchema.safeParse({
        ...validDrawResponse,
        results: validDrawResponse.results.slice(0, 3),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('DrawSummarySchema', () => {
    const validDrawSummary = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      officialNumber: 3245,
      drawDate: '2024-01-15T10:00:00Z',
      results: [
        { modality: 'TRADICIONAL', numbers: [5, 12, 23, 34, 41, 45] },
        { modality: 'LA_SEGUNDA', numbers: [1, 2, 3, 4, 5, 6] },
        { modality: 'REVANCHA', numbers: [7, 8, 9, 10, 11, 12] },
        { modality: 'SIEMPRE_SALE', numbers: [13, 14, 15, 16, 17, 18] },
      ],
    };

    it('accepts valid draw summary', () => {
      const result = schemas.DrawSummarySchema.safeParse(validDrawSummary);
      expect(result.success).toBe(true);
    });

    it('rejects wrong number of results', () => {
      const result = schemas.DrawSummarySchema.safeParse({
        ...validDrawSummary,
        results: validDrawSummary.results.slice(0, 3),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('PaginatedDrawsResponseSchema', () => {
    const validPaginated = {
      data: [],
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    };

    it('accepts valid paginated response', () => {
      const result = schemas.PaginatedDrawsResponseSchema.safeParse(validPaginated);
      expect(result.success).toBe(true);
    });

    it('rejects non-positive page', () => {
      const result = schemas.PaginatedDrawsResponseSchema.safeParse({
        ...validPaginated,
        page: 0,
      });
      expect(result.success).toBe(false);
    });

    it('rejects negative total', () => {
      const result = schemas.PaginatedDrawsResponseSchema.safeParse({
        ...validPaginated,
        total: -1,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('ExactSearchRequestSchema', () => {
    it('accepts valid request', () => {
      const result = schemas.ExactSearchRequestSchema.safeParse({
        numbers: [5, 12, 23, 34, 41, 45],
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid numbers', () => {
      const result = schemas.ExactSearchRequestSchema.safeParse({
        numbers: [5, 12, 23, 34, 41, 46],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('SearchMatchSchema', () => {
    const validMatch = {
      drawDate: '2024-01-15T10:00:00Z',
      officialNumber: 3245,
      modality: 'TRADICIONAL',
      numbers: [5, 12, 23, 34, 41, 45],
    };

    it('accepts valid match', () => {
      const result = schemas.SearchMatchSchema.safeParse(validMatch);
      expect(result.success).toBe(true);
    });

    it('rejects wrong number of numbers', () => {
      const result = schemas.SearchMatchSchema.safeParse({
        ...validMatch,
        numbers: [5, 12, 23],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('ExactSearchResponseSchema', () => {
    it('accepts found response', () => {
      const result = schemas.ExactSearchResponseSchema.safeParse({
        found: true,
        totalMatches: 1,
        matches: [
          {
            drawDate: '2024-01-15T10:00:00Z',
            officialNumber: 3245,
            modality: 'TRADICIONAL',
            numbers: [5, 12, 23, 34, 41, 45],
          },
        ],
      });
      expect(result.success).toBe(true);
    });

    it('accepts not found response', () => {
      const result = schemas.ExactSearchResponseSchema.safeParse({
        found: false,
        totalMatches: 0,
        matches: [],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('NumberFrequencySchema', () => {
    it('accepts valid frequency', () => {
      const result = schemas.NumberFrequencySchema.safeParse({
        number: 5,
        count: 150,
        percentage: 25.5,
      });
      expect(result.success).toBe(true);
    });

    it('rejects number out of range', () => {
      const result = schemas.NumberFrequencySchema.safeParse({
        number: 46,
        count: 150,
        percentage: 25.5,
      });
      expect(result.success).toBe(false);
    });

    it('rejects negative count', () => {
      const result = schemas.NumberFrequencySchema.safeParse({
        number: 5,
        count: -1,
        percentage: 25.5,
      });
      expect(result.success).toBe(false);
    });

    it('rejects percentage out of range', () => {
      const result = schemas.NumberFrequencySchema.safeParse({
        number: 5,
        count: 150,
        percentage: 150,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('FrequencyResponseSchema', () => {
    const validFrequencyResponse = {
      modality: 'TRADICIONAL',
      fromDate: '2024-01-01T00:00:00Z',
      toDate: '2024-12-31T23:59:59Z',
      totalDraws: 100,
      frequencies: Array.from({ length: 46 }, (_, i) => ({
        number: i,
        count: Math.floor(Math.random() * 100),
        percentage: Math.random() * 100,
      })),
    };

    it('accepts valid frequency response', () => {
      const result = schemas.FrequencyResponseSchema.safeParse(validFrequencyResponse);
      expect(result.success).toBe(true);
    });

    it('rejects wrong length frequencies array', () => {
      const result = schemas.FrequencyResponseSchema.safeParse({
        ...validFrequencyResponse,
        frequencies: validFrequencyResponse.frequencies.slice(0, 45),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('HealthCheckSchema', () => {
    it('accepts valid health check', () => {
      const result = schemas.HealthCheckSchema.safeParse({
        status: 'ok',
        timestamp: '2024-01-15T10:00:00Z',
        uptime: 3600,
        version: '1.0.0',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid status', () => {
      const result = schemas.HealthCheckSchema.safeParse({
        status: 'invalid',
        timestamp: '2024-01-15T10:00:00Z',
        uptime: 3600,
        version: '1.0.0',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('ApiErrorResponseSchema', () => {
    it('accepts valid error response', () => {
      const result = schemas.ApiErrorResponseSchema.safeParse({
        statusCode: 404,
        message: 'Not found',
        error: 'Not Found',
        timestamp: '2024-01-15T10:00:00Z',
        path: '/api/test',
        requestId: '123e4567-e89b-12d3-a456-426614174000',
      });
      expect(result.success).toBe(true);
    });

    it('accepts array message', () => {
      const result = schemas.ApiErrorResponseSchema.safeParse({
        statusCode: 400,
        message: ['field1 required', 'field2 invalid'],
        error: 'Bad Request',
        timestamp: '2024-01-15T10:00:00Z',
        path: '/api/test',
        requestId: '123e4567-e89b-12d3-a456-426614174000',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('CreateDrawSchema', () => {
    const validCreateDraw = {
      officialNumber: 3246,
      drawDate: '2024-01-20T10:00:00Z',
      results: [
        { modality: 'TRADICIONAL', numbers: [5, 12, 23, 34, 41, 45] },
        { modality: 'LA_SEGUNDA', numbers: [1, 2, 3, 4, 5, 6] },
        { modality: 'REVANCHA', numbers: [7, 8, 9, 10, 11, 12] },
        { modality: 'SIEMPRE_SALE', numbers: [13, 14, 15, 16, 17, 18] },
      ],
    };

    it('accepts valid create draw', () => {
      const result = schemas.CreateDrawSchema.safeParse(validCreateDraw);
      expect(result.success).toBe(true);
    });

    it('rejects wrong number of results', () => {
      const result = schemas.CreateDrawSchema.safeParse({
        ...validCreateDraw,
        results: validCreateDraw.results.slice(0, 3),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('UpdateDrawSchema', () => {
    it('accepts partial update with officialNumber', () => {
      const result = schemas.UpdateDrawSchema.safeParse({
        officialNumber: 3247,
      });
      expect(result.success).toBe(true);
    });

    it('accepts partial update with drawDate', () => {
      const result = schemas.UpdateDrawSchema.safeParse({
        drawDate: '2024-01-25T10:00:00Z',
      });
      expect(result.success).toBe(true);
    });

    it('accepts partial update with results', () => {
      const result = schemas.UpdateDrawSchema.safeParse({
        results: [
          { modality: 'TRADICIONAL', numbers: [5, 12, 23, 34, 41, 45] },
          { modality: 'LA_SEGUNDA', numbers: [1, 2, 3, 4, 5, 6] },
          { modality: 'REVANCHA', numbers: [7, 8, 9, 10, 11, 12] },
          { modality: 'SIEMPRE_SALE', numbers: [13, 14, 15, 16, 17, 18] },
        ],
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty object', () => {
      const result = schemas.UpdateDrawSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('LoginSchema', () => {
    it('accepts valid login', () => {
      const result = schemas.LoginSchema.safeParse({
        email: 'admin@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = schemas.LoginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('rejects short password', () => {
      const result = schemas.LoginSchema.safeParse({
        email: 'admin@example.com',
        password: 'short',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('ChangePasswordSchema', () => {
    it('accepts valid password change', () => {
      const result = schemas.ChangePasswordSchema.safeParse({
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123',
      });
      expect(result.success).toBe(true);
    });

    it('rejects same old and new password', () => {
      const result = schemas.ChangePasswordSchema.safeParse({
        currentPassword: 'samePassword123',
        newPassword: 'samePassword123',
      });
      expect(result.success).toBe(false);
    });

    it('rejects short new password', () => {
      const result = schemas.ChangePasswordSchema.safeParse({
        currentPassword: 'oldPassword123',
        newPassword: 'short',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('CommitImportSchema', () => {
    it('accepts valid commit', () => {
      const result = schemas.CommitImportSchema.safeParse({
        previewId: '123e4567-e89b-12d3-a456-426614174000',
        duplicatePolicy: 'SKIP',
      });
      expect(result.success).toBe(true);
    });

    it('uses default duplicatePolicy', () => {
      const result = schemas.CommitImportSchema.safeParse({
        previewId: '123e4567-e89b-12d3-a456-426614174000',
      });
      expect(result.success).toBe(true);
      if (!result.success) throw new Error('expected success');
      expect(result.data.duplicatePolicy).toBe('SKIP');
    });

    it('accepts all duplicatePolicy values', () => {
      expect(
        schemas.CommitImportSchema.safeParse({
          previewId: '123e4567-e89b-12d3-a456-426614174000',
          duplicatePolicy: 'SKIP',
        }).success
      ).toBe(true);
      expect(
        schemas.CommitImportSchema.safeParse({
          previewId: '123e4567-e89b-12d3-a456-426614174000',
          duplicatePolicy: 'REPLACE',
        }).success
      ).toBe(true);
      expect(
        schemas.CommitImportSchema.safeParse({
          previewId: '123e4567-e89b-12d3-a456-426614174000',
          duplicatePolicy: 'ABORT',
        }).success
      ).toBe(true);
    });
  });

  describe('ImportListParamsSchema', () => {
    it('uses defaults', () => {
      const result = schemas.ImportListParamsSchema.safeParse({});
      expect(result.success).toBe(true);
      if (!result.success) throw new Error('expected success');
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
    });

    it('accepts valid params', () => {
      const result = schemas.ImportListParamsSchema.safeParse({
        page: 2,
        limit: 50,
        status: 'completed',
        type: 'csv',
        fromDate: '2024-01-01T00:00:00Z',
        toDate: '2024-12-31T23:59:59Z',
      });
      expect(result.success).toBe(true);
    });

    it('rejects limit > 100', () => {
      const result = schemas.ImportListParamsSchema.safeParse({
        limit: 101,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('formatDrawNumber / parseDrawNumber', () => {
    it('formats and parses correctly', () => {
      expect(schemas.formatDrawNumber(5)).toBe('05');
      expect(schemas.parseDrawNumber('05')).toBe(5);
    });

    it('handles edge cases', () => {
      expect(schemas.formatDrawNumber(0)).toBe('00');
      expect(schemas.parseDrawNumber('00')).toBe(0);
      expect(schemas.formatDrawNumber(45)).toBe('45');
      expect(schemas.parseDrawNumber('45')).toBe(45);
    });
  });
});
