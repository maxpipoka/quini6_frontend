[**Quini6 Frontend v0.0.1**](../../../README.md)

***

[Quini6 Frontend](../../../modules.md) / [lib/schemas](../README.md) / PaginatedDrawsResponseSchema

# Variable: PaginatedDrawsResponseSchema

> `const` **PaginatedDrawsResponseSchema**: `ZodObject`\<\{ `data`: `ZodArray`\<`ZodObject`\<\{ `id`: `ZodString`; `officialNumber`: `ZodNumber`; `drawDate`: `ZodString`; `results`: `ZodArray`\<`ZodObject`\<\{ `modality`: `ZodEnum`\<\[`"TRADICIONAL"`, `"LA_SEGUNDA"`, `"REVANCHA"`, `"SIEMPRE_SALE"`\]\>; `numbers`: `ZodEffects`\<`ZodArray`\<`ZodNumber`, `"many"`\>, `number`[], `number`[]\>; \}, `"strip"`, `ZodTypeAny`, \{ `modality`: `"TRADICIONAL"` \| `"LA_SEGUNDA"` \| `"REVANCHA"` \| `"SIEMPRE_SALE"`; `numbers`: `number`[]; \}, \{ `modality`: `"TRADICIONAL"` \| `"LA_SEGUNDA"` \| `"REVANCHA"` \| `"SIEMPRE_SALE"`; `numbers`: `number`[]; \}\>, `"many"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `id`: `string`; `officialNumber`: `number`; `drawDate`: `string`; `results`: `object`[]; \}, \{ `id`: `string`; `officialNumber`: `number`; `drawDate`: `string`; `results`: `object`[]; \}\>, `"many"`\>; `page`: `ZodNumber`; `limit`: `ZodNumber`; `total`: `ZodNumber`; `totalPages`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `data`: `object`[]; `page`: `number`; `limit`: `number`; `total`: `number`; `totalPages`: `number`; \}, \{ `data`: `object`[]; `page`: `number`; `limit`: `number`; `total`: `number`; `totalPages`: `number`; \}\>

Defined in: [lib/schemas.ts:83](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/schemas.ts#L83)
