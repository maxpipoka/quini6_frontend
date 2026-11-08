[**Quini6 Frontend v0.0.1**](../../../README.md)

***

[Quini6 Frontend](../../../modules.md) / [lib/schemas](../README.md) / UpdateDrawSchema

# Variable: UpdateDrawSchema

> `const` **UpdateDrawSchema**: `ZodEffects`\<`ZodObject`\<\{ `officialNumber`: `ZodOptional`\<`ZodNumber`\>; `drawDate`: `ZodOptional`\<`ZodString`\>; `results`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `modality`: `ZodEnum`\<\[`"TRADICIONAL"`, `"LA_SEGUNDA"`, `"REVANCHA"`, `"SIEMPRE_SALE"`\]\>; `numbers`: `ZodEffects`\<`ZodArray`\<`ZodNumber`, `"many"`\>, `number`[], `number`[]\>; \}, `"strip"`, `ZodTypeAny`, \{ `modality`: `"TRADICIONAL"` \| `"LA_SEGUNDA"` \| `"REVANCHA"` \| `"SIEMPRE_SALE"`; `numbers`: `number`[]; \}, \{ `modality`: `"TRADICIONAL"` \| `"LA_SEGUNDA"` \| `"REVANCHA"` \| `"SIEMPRE_SALE"`; `numbers`: `number`[]; \}\>, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `officialNumber?`: `number`; `drawDate?`: `string`; `results?`: `object`[]; \}, \{ `officialNumber?`: `number`; `drawDate?`: `string`; `results?`: `object`[]; \}\>, \{ `officialNumber?`: `number`; `drawDate?`: `string`; `results?`: `object`[]; \}, \{ `officialNumber?`: `number`; `drawDate?`: `string`; `results?`: `object`[]; \}\>

Defined in: [lib/schemas.ts:205](https://github.com/maxpipoka/quini6_frontend/blob/9f722dfc2bfe14741847adbac029e48d9370d9af/src/lib/schemas.ts#L205)
