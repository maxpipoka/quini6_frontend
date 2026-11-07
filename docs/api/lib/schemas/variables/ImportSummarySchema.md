[**Quini6 Frontend v0.0.1**](../../../README.md)

***

[Quini6 Frontend](../../../modules.md) / [lib/schemas](../README.md) / ImportSummarySchema

# Variable: ImportSummarySchema

> `const` **ImportSummarySchema**: `ZodObject`\<\{ `importId`: `ZodString`; `fileName`: `ZodString`; `date`: `ZodString`; `rowsProcessed`: `ZodNumber`; `succeeded`: `ZodNumber`; `failed`: `ZodNumber`; `policy`: `ZodEnum`\<\[`"skip"`, `"replace"`, `"merge"`\]\>; \}, `"strip"`, `ZodTypeAny`, \{ `importId`: `string`; `fileName`: `string`; `date`: `string`; `rowsProcessed`: `number`; `succeeded`: `number`; `failed`: `number`; `policy`: `"skip"` \| `"replace"` \| `"merge"`; \}, \{ `importId`: `string`; `fileName`: `string`; `date`: `string`; `rowsProcessed`: `number`; `succeeded`: `number`; `failed`: `number`; `policy`: `"skip"` \| `"replace"` \| `"merge"`; \}\>

Defined in: [lib/schemas.ts:322](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/schemas.ts#L322)
