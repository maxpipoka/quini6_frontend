;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="977242c1-ff82-45a9-bc6a-b69b6e8d4103",e._sentryDebugIdIdentifier="sentry-dbid-977242c1-ff82-45a9-bc6a-b69b6e8d4103")}catch(e){}}();import { z } from 'zod';
import './_sentry-release-injection-file_BwnRfS4D.mjs';

const ModalityEnum = z.enum([
  "TRADICIONAL",
  "LA_SEGUNDA",
  "REVANCHA",
  "SIEMPRE_SALE"
]);
const MODALITY_ORDER = ["TRADICIONAL", "LA_SEGUNDA", "REVANCHA", "SIEMPRE_SALE"];
const MODALITY_LABELS = {
  TRADICIONAL: "Tradicional",
  LA_SEGUNDA: "La Segunda",
  REVANCHA: "Revancha",
  SIEMPRE_SALE: "Siempre Sale"
};
const DrawNumberSchema = z.number().int().min(0).max(45);
const SixUniqueNumbersSchema = z.array(DrawNumberSchema).length(6, "Debe seleccionar exactamente 6 números").refine((arr) => new Set(arr).size === 6, "Los números no pueden repetirse");
const DrawResultSchema = z.object({
  modality: ModalityEnum,
  numbers: SixUniqueNumbersSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
const DrawResponseSchema = z.object({
  id: z.string().uuid(),
  officialNumber: z.number().int().positive(),
  drawDate: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  results: z.array(DrawResultSchema).length(4)
});
const DrawSummarySchema = z.object({
  id: z.string().uuid(),
  officialNumber: z.number().int().positive(),
  drawDate: z.string().datetime(),
  results: z.array(
    z.object({
      modality: ModalityEnum,
      numbers: SixUniqueNumbersSchema
    })
  ).length(4)
});
const PaginatedDrawsResponseSchema = z.object({
  data: z.array(DrawSummarySchema),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative()
});
const ExactSearchRequestSchema = z.object({
  numbers: SixUniqueNumbersSchema
});
const SearchMatchSchema = z.object({
  drawDate: z.string().datetime(),
  officialNumber: z.number().int().positive(),
  modality: z.string(),
  numbers: z.array(z.number().int().min(0).max(45)).length(6)
});
const ExactSearchResponseSchema = z.object({
  found: z.boolean(),
  totalMatches: z.number().int().nonnegative(),
  matches: z.array(SearchMatchSchema)
});
z.object({
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  modality: ModalityEnum.optional()
});
const NumberFrequencySchema = z.object({
  number: z.number().int().min(0).max(45),
  count: z.number().int().nonnegative(),
  percentage: z.number().min(0).max(100)
});
const FrequencyResponseSchema = z.object({
  modality: ModalityEnum.optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  totalDraws: z.number().int().nonnegative(),
  frequencies: z.array(NumberFrequencySchema).length(46)
});
const HealthCheckSchema = z.object({
  status: z.enum(["ok", "degraded", "down"]),
  timestamp: z.string().datetime(),
  uptime: z.number().nonnegative(),
  version: z.string()
});
const HealthDbSchema = z.object({
  status: z.enum(["ok", "down"]),
  latency: z.number().nonnegative(),
  timestamp: z.string().datetime()
});
z.object({
  statusCode: z.number().int(),
  message: z.union([z.string(), z.array(z.string())]),
  error: z.string(),
  timestamp: z.string().datetime(),
  path: z.string(),
  requestId: z.string().uuid()
});
const ModalityResultInputSchema = z.object({
  modality: ModalityEnum,
  numbers: SixUniqueNumbersSchema
});
const CreateDrawSchema = z.object({
  officialNumber: z.number().int().positive(),
  drawDate: z.string().datetime(),
  results: z.array(ModalityResultInputSchema).length(4)
});
const UpdateDrawSchema = z.object({
  officialNumber: z.number().int().positive().optional(),
  drawDate: z.string().datetime().optional(),
  results: z.array(ModalityResultInputSchema).length(4).optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: "Al menos un campo debe ser proporcionado"
});
const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres")
});
const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres")
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "La nueva contraseña debe ser diferente a la actual",
  path: ["newPassword"]
});
const CommitImportSchema = z.object({
  previewId: z.string().uuid(),
  duplicatePolicy: z.enum(["SKIP", "REPLACE", "ABORT"]).default("SKIP")
});
const DrawRowInputSchema = z.object({
  officialNumber: z.number().int().positive(),
  drawDate: z.string().datetime(),
  results: z.array(
    z.object({
      modality: ModalityEnum,
      numbers: SixUniqueNumbersSchema
    })
  ).length(4)
});
const ImportPolicySchema = z.enum(["skip", "replace", "merge"]);
const ImportPreviewRequestSchema = z.object({
  rows: z.array(DrawRowInputSchema)
});
const ImportPreviewResponseSchema = z.object({
  importId: z.string().uuid(),
  validCount: z.number().int().nonnegative(),
  invalidCount: z.number().int().nonnegative()
});
z.object({
  importId: z.string().uuid(),
  policy: ImportPolicySchema
});
const ImportErrorSchema = z.object({
  row: z.number().int().positive(),
  field: z.string(),
  message: z.string()
});
const ImportCommitResponseSchema = z.object({
  created: z.number().int().nonnegative(),
  updated: z.number().int().nonnegative(),
  skipped: z.number().int().nonnegative(),
  failed: z.number().int().nonnegative(),
  errors: z.array(ImportErrorSchema)
});
z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sort: z.enum(["date", "fileName", "processed", "succeeded", "failed"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  policy: ImportPolicySchema.optional()
});
const ImportSummarySchema = z.object({
  importId: z.string().uuid(),
  fileName: z.string(),
  date: z.string().datetime(),
  rowsProcessed: z.number().int().nonnegative(),
  succeeded: z.number().int().nonnegative(),
  failed: z.number().int().nonnegative(),
  policy: ImportPolicySchema
});
const ImportHistoryResponseSchema = z.object({
  data: z.array(ImportSummarySchema),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative()
});
const ImportErrorDetailSchema = z.object({
  rowNumber: z.number().int().positive(),
  field: z.string(),
  message: z.string(),
  rawValue: z.unknown()
});
const ImportErrorsResponseSchema = z.object({
  errors: z.array(ImportErrorDetailSchema)
});
const ImportProgressStageSchema = z.enum(["processing", "committing", "completed"]);
z.object({
  stage: ImportProgressStageSchema,
  progress: z.number().min(0).max(100)
});
z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  status: z.enum(["pending", "completed", "partial", "failed"]).optional(),
  type: z.enum(["csv", "xlsx"]).optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional()
});
function formatDrawNumber(n) {
  return n.toString().padStart(2, "0");
}

export { CreateDrawSchema as C, DrawResponseSchema as D, ExactSearchRequestSchema as E, FrequencyResponseSchema as F, HealthCheckSchema as H, ImportHistoryResponseSchema as I, LoginSchema as L, MODALITY_ORDER as M, PaginatedDrawsResponseSchema as P, UpdateDrawSchema as U, MODALITY_LABELS as a, ImportErrorsResponseSchema as b, ExactSearchResponseSchema as c, HealthDbSchema as d, ChangePasswordSchema as e, formatDrawNumber as f, CommitImportSchema as g, ImportPreviewResponseSchema as h, ImportPreviewRequestSchema as i, ImportCommitResponseSchema as j };
