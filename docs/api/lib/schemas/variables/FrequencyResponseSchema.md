[**Quini6 Frontend v0.0.1**](../../../README.md)

***

[Quini6 Frontend](../../../modules.md) / [lib/schemas](../README.md) / FrequencyResponseSchema

# Variable: FrequencyResponseSchema

> `const` **FrequencyResponseSchema**: `ZodObject`\<\{ `modality`: `ZodOptional`\<`ZodEnum`\<\[`"TRADICIONAL"`, `"LA_SEGUNDA"`, `"REVANCHA"`, `"SIEMPRE_SALE"`\]\>\>; `fromDate`: `ZodOptional`\<`ZodString`\>; `toDate`: `ZodOptional`\<`ZodString`\>; `totalDraws`: `ZodNumber`; `frequencies`: `ZodArray`\<`ZodObject`\<\{ `number`: `ZodNumber`; `count`: `ZodNumber`; `percentage`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `number`: `number`; `count`: `number`; `percentage`: `number`; \}, \{ `number`: `number`; `count`: `number`; `percentage`: `number`; \}\>, `"many"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `modality?`: `"TRADICIONAL"` \| `"LA_SEGUNDA"` \| `"REVANCHA"` \| `"SIEMPRE_SALE"`; `fromDate?`: `string`; `toDate?`: `string`; `totalDraws`: `number`; `frequencies`: `object`[]; \}, \{ `modality?`: `"TRADICIONAL"` \| `"LA_SEGUNDA"` \| `"REVANCHA"` \| `"SIEMPRE_SALE"`; `fromDate?`: `string`; `toDate?`: `string`; `totalDraws`: `number`; `frequencies`: `object`[]; \}\>

Defined in: [lib/schemas.ts:140](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/schemas.ts#L140)
