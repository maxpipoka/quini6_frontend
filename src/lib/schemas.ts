/**
 * Zod Schemas - Shared validation schemas for Quini 6
 * Matches backend API contracts from FRONTEND_DEVELOPMENT_GUIDE.md
 */

import { z } from 'zod';

// ============================================================================
// Enums & Constants
// ============================================================================

// Backend returns modalities with suffixes like "_PRIMERA", "_SEGUNDA"
// We accept both canonical and backend variants, normalize to canonical
const CanonicalModalityEnum = z.enum([
  'TRADICIONAL',
  'LA_SEGUNDA',
  'REVANCHA',
  'SIEMPRE_SALE',
] as const);

const BackendModalityEnum = z.enum([
  'TRADICIONAL_PRIMERA',
  'TRADICIONAL_SEGUNDA',
  'LA_SEGUNDA_PRIMERA',
  'LA_SEGUNDA_SEGUNDA',
  'REVANCHA_PRIMERA',
  'REVANCHA_SEGUNDA',
  'SIEMPRE_SALE_PRIMERA',
  'SIEMPRE_SALE_SEGUNDA',
] as const);

export const ModalityEnum = z.union([CanonicalModalityEnum, BackendModalityEnum]).transform((val) => {
  if (val.startsWith('TRADICIONAL')) return 'TRADICIONAL';
  if (val.startsWith('LA_SEGUNDA')) return 'LA_SEGUNDA';
  if (val.startsWith('REVANCHA')) return 'REVANCHA';
  if (val.startsWith('SIEMPRE_SALE')) return 'SIEMPRE_SALE';
  return val;
});

export type Modality = z.infer<typeof ModalityEnum>;

export const MODALITY_ORDER: Modality[] = ['TRADICIONAL', 'LA_SEGUNDA', 'REVANCHA', 'SIEMPRE_SALE'];

export const MODALITY_LABELS: Record<Modality, string> = {
  TRADICIONAL: 'Tradicional',
  LA_SEGUNDA: 'La Segunda',
  REVANCHA: 'Revancha',
  SIEMPRE_SALE: 'Siempre Sale',
};

// ============================================================================
// Number Validation
// ============================================================================

export const DrawNumberSchema = z.coerce.number().int().min(0).max(45);

export const SixUniqueNumbersSchema = z
  .array(DrawNumberSchema)
  .length(6, 'Debe seleccionar exactamente 6 números')
  .refine((arr) => new Set(arr).size === 6, 'Los números no pueden repetirse');

export type SixUniqueNumbers = z.infer<typeof SixUniqueNumbersSchema>;

// ============================================================================
// Draw Schemas
// ============================================================================

export const DrawResultSchema = z.object({
  modality: ModalityEnum,
  numbers: SixUniqueNumbersSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type DrawResult = z.infer<typeof DrawResultSchema>;

export const DrawResponseSchema = z.object({
  id: z.string().uuid(),
  officialNumber: z.number().int().positive(),
  drawDate: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  results: z.array(DrawResultSchema).length(4),
});

export type DrawResponse = z.infer<typeof DrawResponseSchema>;

export const DrawSummarySchema = z.object({
  id: z.string().uuid(),
  officialNumber: z.number().int().positive(),
  drawDate: z.string().datetime(),
  results: z
    .array(
      z.object({
        modality: ModalityEnum,
        numbers: SixUniqueNumbersSchema,
      })
    )
    .length(4),
});

export type DrawSummary = z.infer<typeof DrawSummarySchema>;

export const PaginatedDrawsResponseSchema = z.object({
  data: z.array(DrawSummarySchema),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export type PaginatedDrawsResponse = z.infer<typeof PaginatedDrawsResponseSchema>;

// ============================================================================
// Search Schemas
// ============================================================================

export const ExactSearchRequestSchema = z.object({
  numbers: SixUniqueNumbersSchema,
});

export type ExactSearchRequest = z.infer<typeof ExactSearchRequestSchema>;

export const SearchMatchSchema = z.object({
  drawDate: z.string().datetime(),
  officialNumber: z.number().int().positive(),
  modality: z.string(),
  numbers: z.array(z.number().int().min(0).max(45)).length(6),
});

export type SearchMatch = z.infer<typeof SearchMatchSchema>;

export const ExactSearchResponseSchema = z.object({
  found: z.boolean(),
  totalMatches: z.number().int().nonnegative(),
  matches: z.array(SearchMatchSchema),
});

export type ExactSearchResponse = z.infer<typeof ExactSearchResponseSchema>;

// ============================================================================
// Frequency Schemas
// ============================================================================

export const FrequencyParamsSchema = z.object({
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  modality: ModalityEnum.optional(),
});

export type FrequencyParams = z.infer<typeof FrequencyParamsSchema>;

export const NumberFrequencySchema = z.object({
  number: z.number().int().min(0).max(45),
  count: z.number().int().nonnegative(),
  percentage: z.number().min(0).max(100),
});

export type NumberFrequency = z.infer<typeof NumberFrequencySchema>;

export const FrequencyResponseSchema = z.object({
  modality: ModalityEnum.optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  totalDraws: z.number().int().nonnegative(),
  frequencies: z.array(NumberFrequencySchema).length(46),
});

export type FrequencyResponse = z.infer<typeof FrequencyResponseSchema>;

// ============================================================================
// Health Check Schemas
// ============================================================================

export const HealthCheckSchema = z.object({
  status: z.enum(['ok', 'degraded', 'down']),
  timestamp: z.string().datetime(),
  uptime: z.number().nonnegative(),
  version: z.string(),
});

export type HealthCheck = z.infer<typeof HealthCheckSchema>;

export const HealthDbSchema = z.object({
  status: z.enum(['ok', 'down']),
  latency: z.number().nonnegative(),
  timestamp: z.string().datetime(),
});

export type HealthDb = z.infer<typeof HealthDbSchema>;

// ============================================================================
// Error Response Schema
// ============================================================================

export const ApiErrorResponseSchema = z.object({
  statusCode: z.number().int(),
  message: z.union([z.string(), z.array(z.string())]),
  error: z.string(),
  timestamp: z.string().datetime(),
  path: z.string(),
  requestId: z.string().uuid(),
});

export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

// ============================================================================
// Admin Schemas
// ============================================================================

export const ModalityResultInputSchema = z.object({
  modality: ModalityEnum,
  numbers: SixUniqueNumbersSchema,
});

export type ModalityResultInput = z.infer<typeof ModalityResultInputSchema>;

export const CreateDrawSchema = z.object({
  officialNumber: z.number().int().positive(),
  drawDate: z.string().datetime(),
  results: z.array(ModalityResultInputSchema).length(4),
});

export type CreateDrawInput = z.infer<typeof CreateDrawSchema>;

export const UpdateDrawSchema = z
  .object({
    officialNumber: z.number().int().positive().optional(),
    drawDate: z.string().datetime().optional(),
    results: z.array(ModalityResultInputSchema).length(4).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Al menos un campo debe ser proporcionado',
  });

export type UpdateDrawInput = z.infer<typeof UpdateDrawSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'La nueva contraseña debe ser diferente a la actual',
    path: ['newPassword'],
  });

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

export const CommitImportSchema = z.object({
  previewId: z.string().uuid(),
  duplicatePolicy: z.enum(['SKIP', 'REPLACE', 'ABORT']).default('SKIP'),
});

export type CommitImportInput = z.infer<typeof CommitImportSchema>;

// ============================================================================
// Import Schemas (Phase 3 Bulk Import)
// ============================================================================

// Draw row input for import preview
export const DrawRowInputSchema = z.object({
  officialNumber: z.number().int().positive(),
  drawDate: z.string().datetime(),
  results: z
    .array(
      z.object({
        modality: ModalityEnum,
        numbers: SixUniqueNumbersSchema,
      })
    )
    .length(4),
});

export type DrawRowInput = z.infer<typeof DrawRowInputSchema>;

// Import Policy enum
export const ImportPolicySchema = z.enum(['skip', 'replace', 'merge'] as const);

export type ImportPolicy = z.infer<typeof ImportPolicySchema>;

// Import Preview Request/Response
export const ImportPreviewRequestSchema = z.object({
  rows: z.array(DrawRowInputSchema),
});

export type ImportPreviewRequest = z.infer<typeof ImportPreviewRequestSchema>;

export const ImportPreviewResponseSchema = z.object({
  importId: z.string().uuid(),
  validCount: z.number().int().nonnegative(),
  invalidCount: z.number().int().nonnegative(),
});

export type ImportPreviewResponse = z.infer<typeof ImportPreviewResponseSchema>;

// Import Commit Request/Response
export const ImportCommitRequestSchema = z.object({
  importId: z.string().uuid(),
  policy: ImportPolicySchema,
});

export type ImportCommitRequest = z.infer<typeof ImportCommitRequestSchema>;

export const ImportErrorSchema = z.object({
  row: z.number().int().positive(),
  field: z.string(),
  message: z.string(),
});

export type ImportError = z.infer<typeof ImportErrorSchema>;

export const ImportCommitResponseSchema = z.object({
  created: z.number().int().nonnegative(),
  updated: z.number().int().nonnegative(),
  skipped: z.number().int().nonnegative(),
  failed: z.number().int().nonnegative(),
  errors: z.array(ImportErrorSchema),
});

export type ImportCommitResponse = z.infer<typeof ImportCommitResponseSchema>;

// Import History
export const ImportHistoryParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sort: z.enum(['date', 'fileName', 'processed', 'succeeded', 'failed']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  policy: ImportPolicySchema.optional(),
});

export type ImportHistoryParams = z.infer<typeof ImportHistoryParamsSchema>;

export const ImportSummarySchema = z.object({
  importId: z.string().uuid(),
  fileName: z.string(),
  date: z.string().datetime(),
  rowsProcessed: z.number().int().nonnegative(),
  succeeded: z.number().int().nonnegative(),
  failed: z.number().int().nonnegative(),
  policy: ImportPolicySchema,
});

export type ImportSummary = z.infer<typeof ImportSummarySchema>;

export const ImportHistoryResponseSchema = z.object({
  data: z.array(ImportSummarySchema),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export type ImportHistoryResponse = z.infer<typeof ImportHistoryResponseSchema>;

// Import Errors Detail
export const ImportErrorDetailSchema = z.object({
  rowNumber: z.number().int().positive(),
  field: z.string(),
  message: z.string(),
  rawValue: z.unknown(),
});

export type ImportErrorDetail = z.infer<typeof ImportErrorDetailSchema>;

export const ImportErrorsResponseSchema = z.object({
  errors: z.array(ImportErrorDetailSchema),
});

export type ImportErrorsResponse = z.infer<typeof ImportErrorsResponseSchema>;

// Import Progress
export const ImportProgressStageSchema = z.enum(['processing', 'committing', 'completed'] as const);

export type ImportProgressStage = z.infer<typeof ImportProgressStageSchema>;

export const ImportProgressSchema = z.object({
  stage: ImportProgressStageSchema,
  progress: z.number().min(0).max(100),
});

export type ImportProgress = z.infer<typeof ImportProgressSchema>;

// Import Preview Row (for table display)
export interface ImportPreviewRow {
  rowNumber: number;
  date: string;
  modality: string;
  tradicional: number[] | null;
  laSegunda: number[] | null;
  revancha: number[] | null;
  siempreSale: number[] | null;
  reintegro: number | null;
  isValid: boolean;
  errors: ImportErrorDetail[];
}

export type ImportPreviewRows = ImportPreviewRow[];

// Existing ImportListParamsSchema (updated to use ImportPolicySchema)
export const ImportListParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  status: z.enum(['pending', 'completed', 'partial', 'failed']).optional(),
  type: z.enum(['csv', 'xlsx']).optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
});

export type ImportListParams = z.infer<typeof ImportListParamsSchema>;

// ============================================================================
// Utility Types
// ============================================================================

export type ApiResponse<T> =
  { success: true; data: T } | { success: false; error: ApiErrorResponse };

// Helper to validate and parse API responses
export function parseApiResponse<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

// Format number for display (zero-padded)
export function formatDrawNumber(n: number): string {
  return n.toString().padStart(2, '0');
}

// Parse draw numbers from display format
export function parseDrawNumber(s: string): number {
  const n = parseInt(s, 10);
  if (isNaN(n) || n < 0 || n > 45) {
    throw new Error(`Número inválido: ${s}`);
  }
  return n;
}
