[**Quini6 Frontend v0.0.1**](../../../README.md)

***

[Quini6 Frontend](../../../modules.md) / [lib/schemas](../README.md) / DrawResponseSchema

# Variable: DrawResponseSchema

> `const` **DrawResponseSchema**: `ZodObject`\<\{ `id`: `ZodString`; `officialNumber`: `ZodNumber`; `drawDate`: `ZodString`; `createdAt`: `ZodString`; `updatedAt`: `ZodString`; `results`: `ZodArray`\<`ZodObject`\<\{ `modality`: `ZodEnum`\<\[`"TRADICIONAL"`, `"LA_SEGUNDA"`, `"REVANCHA"`, `"SIEMPRE_SALE"`\]\>; `numbers`: `ZodEffects`\<`ZodArray`\<`ZodNumber`, `"many"`\>, `number`[], `number`[]\>; `createdAt`: `ZodString`; `updatedAt`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `modality`: `"TRADICIONAL"` \| `"LA_SEGUNDA"` \| `"REVANCHA"` \| `"SIEMPRE_SALE"`; `numbers`: `number`[]; `createdAt`: `string`; `updatedAt`: `string`; \}, \{ `modality`: `"TRADICIONAL"` \| `"LA_SEGUNDA"` \| `"REVANCHA"` \| `"SIEMPRE_SALE"`; `numbers`: `number`[]; `createdAt`: `string`; `updatedAt`: `string`; \}\>, `"many"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `id`: `string`; `officialNumber`: `number`; `drawDate`: `string`; `createdAt`: `string`; `updatedAt`: `string`; `results`: `object`[]; \}, \{ `id`: `string`; `officialNumber`: `number`; `drawDate`: `string`; `createdAt`: `string`; `updatedAt`: `string`; `results`: `object`[]; \}\>

Defined in: [lib/schemas.ts:56](https://github.com/maxpipoka/quini6_frontend/blob/9f722dfc2bfe14741847adbac029e48d9370d9af/src/lib/schemas.ts#L56)
