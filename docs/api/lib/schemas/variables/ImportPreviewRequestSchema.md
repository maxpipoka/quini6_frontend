[**Quini6 Frontend v0.0.1**](../../../README.md)

***

[Quini6 Frontend](../../../modules.md) / [lib/schemas](../README.md) / ImportPreviewRequestSchema

# Variable: ImportPreviewRequestSchema

> `const` **ImportPreviewRequestSchema**: `ZodObject`\<\{ `rows`: `ZodArray`\<`ZodObject`\<\{ `officialNumber`: `ZodNumber`; `drawDate`: `ZodString`; `results`: `ZodArray`\<`ZodObject`\<\{ `modality`: `ZodEnum`\<\[`"TRADICIONAL"`, `"LA_SEGUNDA"`, `"REVANCHA"`, `"SIEMPRE_SALE"`\]\>; `numbers`: `ZodEffects`\<`ZodArray`\<`ZodNumber`, `"many"`\>, `number`[], `number`[]\>; \}, `"strip"`, `ZodTypeAny`, \{ `modality`: `"TRADICIONAL"` \| `"LA_SEGUNDA"` \| `"REVANCHA"` \| `"SIEMPRE_SALE"`; `numbers`: `number`[]; \}, \{ `modality`: `"TRADICIONAL"` \| `"LA_SEGUNDA"` \| `"REVANCHA"` \| `"SIEMPRE_SALE"`; `numbers`: `number`[]; \}\>, `"many"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `officialNumber`: `number`; `drawDate`: `string`; `results`: `object`[]; \}, \{ `officialNumber`: `number`; `drawDate`: `string`; `results`: `object`[]; \}\>, `"many"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `rows`: `object`[]; \}, \{ `rows`: `object`[]; \}\>

Defined in: [lib/schemas.ts:269](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/schemas.ts#L269)
