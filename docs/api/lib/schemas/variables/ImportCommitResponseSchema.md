[**Quini6 Frontend v0.0.1**](../../../README.md)

***

[Quini6 Frontend](../../../modules.md) / [lib/schemas](../README.md) / ImportCommitResponseSchema

# Variable: ImportCommitResponseSchema

> `const` **ImportCommitResponseSchema**: `ZodObject`\<\{ `created`: `ZodNumber`; `updated`: `ZodNumber`; `skipped`: `ZodNumber`; `failed`: `ZodNumber`; `errors`: `ZodArray`\<`ZodObject`\<\{ `row`: `ZodNumber`; `field`: `ZodString`; `message`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `row`: `number`; `field`: `string`; `message`: `string`; \}, \{ `row`: `number`; `field`: `string`; `message`: `string`; \}\>, `"many"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `created`: `number`; `updated`: `number`; `skipped`: `number`; `failed`: `number`; `errors`: `object`[]; \}, \{ `created`: `number`; `updated`: `number`; `skipped`: `number`; `failed`: `number`; `errors`: `object`[]; \}\>

Defined in: [lib/schemas.ts:299](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/schemas.ts#L299)
