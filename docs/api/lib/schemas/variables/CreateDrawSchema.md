[**Quini6 Frontend v0.0.1**](../../../README.md)

***

[Quini6 Frontend](../../../modules.md) / [lib/schemas](../README.md) / CreateDrawSchema

# Variable: CreateDrawSchema

> `const` **CreateDrawSchema**: `ZodObject`\<\{ `officialNumber`: `ZodNumber`; `drawDate`: `ZodString`; `results`: `ZodArray`\<`ZodObject`\<\{ `modality`: `ZodEnum`\<\[`"TRADICIONAL"`, `"LA_SEGUNDA"`, `"REVANCHA"`, `"SIEMPRE_SALE"`\]\>; `numbers`: `ZodEffects`\<`ZodArray`\<`ZodNumber`, `"many"`\>, `number`[], `number`[]\>; \}, `"strip"`, `ZodTypeAny`, \{ `modality`: `"TRADICIONAL"` \| `"LA_SEGUNDA"` \| `"REVANCHA"` \| `"SIEMPRE_SALE"`; `numbers`: `number`[]; \}, \{ `modality`: `"TRADICIONAL"` \| `"LA_SEGUNDA"` \| `"REVANCHA"` \| `"SIEMPRE_SALE"`; `numbers`: `number`[]; \}\>, `"many"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `officialNumber`: `number`; `drawDate`: `string`; `results`: `object`[]; \}, \{ `officialNumber`: `number`; `drawDate`: `string`; `results`: `object`[]; \}\>

Defined in: [lib/schemas.ts:197](https://github.com/maxpipoka/quini6_frontend/blob/9f722dfc2bfe14741847adbac029e48d9370d9af/src/lib/schemas.ts#L197)
