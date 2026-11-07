[**Quini6 Frontend v0.0.1**](../../../README.md)

***

[Quini6 Frontend](../../../modules.md) / [lib/schemas](../README.md) / ApiErrorResponseSchema

# Variable: ApiErrorResponseSchema

> `const` **ApiErrorResponseSchema**: `ZodObject`\<\{ `statusCode`: `ZodNumber`; `message`: `ZodUnion`\<\[`ZodString`, `ZodArray`\<`ZodString`, `"many"`\>\]\>; `error`: `ZodString`; `timestamp`: `ZodString`; `path`: `ZodString`; `requestId`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `statusCode`: `number`; `message`: `string` \| `string`[]; `error`: `string`; `timestamp`: `string`; `path`: `string`; `requestId`: `string`; \}, \{ `statusCode`: `number`; `message`: `string` \| `string`[]; `error`: `string`; `timestamp`: `string`; `path`: `string`; `requestId`: `string`; \}\>

Defined in: [lib/schemas.ts:175](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/schemas.ts#L175)
