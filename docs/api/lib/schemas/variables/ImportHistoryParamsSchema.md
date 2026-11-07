[**Quini6 Frontend v0.0.1**](../../../README.md)

***

[Quini6 Frontend](../../../modules.md) / [lib/schemas](../README.md) / ImportHistoryParamsSchema

# Variable: ImportHistoryParamsSchema

> `const` **ImportHistoryParamsSchema**: `ZodObject`\<\{ `page`: `ZodDefault`\<`ZodNumber`\>; `limit`: `ZodDefault`\<`ZodNumber`\>; `sort`: `ZodOptional`\<`ZodEnum`\<\[`"date"`, `"fileName"`, `"processed"`, `"succeeded"`, `"failed"`\]\>\>; `order`: `ZodOptional`\<`ZodEnum`\<\[`"asc"`, `"desc"`\]\>\>; `startDate`: `ZodOptional`\<`ZodString`\>; `endDate`: `ZodOptional`\<`ZodString`\>; `policy`: `ZodOptional`\<`ZodEnum`\<\[`"skip"`, `"replace"`, `"merge"`\]\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `page`: `number`; `limit`: `number`; `sort?`: `"date"` \| `"failed"` \| `"fileName"` \| `"processed"` \| `"succeeded"`; `order?`: `"asc"` \| `"desc"`; `startDate?`: `string`; `endDate?`: `string`; `policy?`: `"skip"` \| `"replace"` \| `"merge"`; \}, \{ `page?`: `number`; `limit?`: `number`; `sort?`: `"date"` \| `"failed"` \| `"fileName"` \| `"processed"` \| `"succeeded"`; `order?`: `"asc"` \| `"desc"`; `startDate?`: `string`; `endDate?`: `string`; `policy?`: `"skip"` \| `"replace"` \| `"merge"`; \}\>

Defined in: [lib/schemas.ts:310](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/schemas.ts#L310)
