[**Quini6 Frontend v0.0.1**](../../../README.md)

***

[Quini6 Frontend](../../../modules.md) / [lib/schemas](../README.md) / ImportListParamsSchema

# Variable: ImportListParamsSchema

> `const` **ImportListParamsSchema**: `ZodObject`\<\{ `page`: `ZodDefault`\<`ZodNumber`\>; `limit`: `ZodDefault`\<`ZodNumber`\>; `status`: `ZodOptional`\<`ZodEnum`\<\[`"pending"`, `"completed"`, `"partial"`, `"failed"`\]\>\>; `type`: `ZodOptional`\<`ZodEnum`\<\[`"csv"`, `"xlsx"`\]\>\>; `fromDate`: `ZodOptional`\<`ZodString`\>; `toDate`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `page`: `number`; `limit`: `number`; `status?`: `"failed"` \| `"completed"` \| `"pending"` \| `"partial"`; `type?`: `"csv"` \| `"xlsx"`; `fromDate?`: `string`; `toDate?`: `string`; \}, \{ `page?`: `number`; `limit?`: `number`; `status?`: `"failed"` \| `"completed"` \| `"pending"` \| `"partial"`; `type?`: `"csv"` \| `"xlsx"`; `fromDate?`: `string`; `toDate?`: `string`; \}\>

Defined in: [lib/schemas.ts:389](https://github.com/maxpipoka/quini6_frontend/blob/9f722dfc2bfe14741847adbac029e48d9370d9af/src/lib/schemas.ts#L389)
