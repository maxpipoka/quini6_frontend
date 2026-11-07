[**Quini6 Frontend v0.0.1**](../../../README.md)

***

[Quini6 Frontend](../../../modules.md) / [lib/schemas](../README.md) / ExactSearchResponseSchema

# Variable: ExactSearchResponseSchema

> `const` **ExactSearchResponseSchema**: `ZodObject`\<\{ `found`: `ZodBoolean`; `totalMatches`: `ZodNumber`; `matches`: `ZodArray`\<`ZodObject`\<\{ `drawDate`: `ZodString`; `officialNumber`: `ZodNumber`; `modality`: `ZodString`; `numbers`: `ZodArray`\<`ZodNumber`, `"many"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `drawDate`: `string`; `officialNumber`: `number`; `modality`: `string`; `numbers`: `number`[]; \}, \{ `drawDate`: `string`; `officialNumber`: `number`; `modality`: `string`; `numbers`: `number`[]; \}\>, `"many"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `found`: `boolean`; `totalMatches`: `number`; `matches`: `object`[]; \}, \{ `found`: `boolean`; `totalMatches`: `number`; `matches`: `object`[]; \}\>

Defined in: [lib/schemas.ts:112](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/schemas.ts#L112)
