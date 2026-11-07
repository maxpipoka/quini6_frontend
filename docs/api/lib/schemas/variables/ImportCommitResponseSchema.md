[**Quini6 Frontend v0.0.1**](../../../README.md)

***

[Quini6 Frontend](../../../modules.md) / [lib/schemas](../README.md) / ImportCommitResponseSchema

# Variable: ImportCommitResponseSchema

> `const` **ImportCommitResponseSchema**: `ZodObject`\<\{ `created`: `ZodNumber`; `updated`: `ZodNumber`; `skipped`: `ZodNumber`; `failed`: `ZodNumber`; `errors`: `ZodArray`\<`ZodObject`\<\{ `row`: `ZodNumber`; `field`: `ZodString`; `message`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `row`: `number`; `field`: `string`; `message`: `string`; \}, \{ `row`: `number`; `field`: `string`; `message`: `string`; \}\>, `"many"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `created`: `number`; `updated`: `number`; `skipped`: `number`; `failed`: `number`; `errors`: `object`[]; \}, \{ `created`: `number`; `updated`: `number`; `skipped`: `number`; `failed`: `number`; `errors`: `object`[]; \}\>

Defined in: [lib/schemas.ts:299](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/schemas.ts#L299)
