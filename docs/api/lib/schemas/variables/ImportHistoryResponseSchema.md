[**Quini6 Frontend v0.0.1**](../../../README.md)

***

[Quini6 Frontend](../../../modules.md) / [lib/schemas](../README.md) / ImportHistoryResponseSchema

# Variable: ImportHistoryResponseSchema

> `const` **ImportHistoryResponseSchema**: `ZodObject`\<\{ `data`: `ZodArray`\<`ZodObject`\<\{ `importId`: `ZodString`; `fileName`: `ZodString`; `date`: `ZodString`; `rowsProcessed`: `ZodNumber`; `succeeded`: `ZodNumber`; `failed`: `ZodNumber`; `policy`: `ZodEnum`\<\[`"skip"`, `"replace"`, `"merge"`\]\>; \}, `"strip"`, `ZodTypeAny`, \{ `importId`: `string`; `fileName`: `string`; `date`: `string`; `rowsProcessed`: `number`; `succeeded`: `number`; `failed`: `number`; `policy`: `"skip"` \| `"replace"` \| `"merge"`; \}, \{ `importId`: `string`; `fileName`: `string`; `date`: `string`; `rowsProcessed`: `number`; `succeeded`: `number`; `failed`: `number`; `policy`: `"skip"` \| `"replace"` \| `"merge"`; \}\>, `"many"`\>; `page`: `ZodNumber`; `limit`: `ZodNumber`; `total`: `ZodNumber`; `totalPages`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `data`: `object`[]; `page`: `number`; `limit`: `number`; `total`: `number`; `totalPages`: `number`; \}, \{ `data`: `object`[]; `page`: `number`; `limit`: `number`; `total`: `number`; `totalPages`: `number`; \}\>

Defined in: [lib/schemas.ts:334](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/schemas.ts#L334)
