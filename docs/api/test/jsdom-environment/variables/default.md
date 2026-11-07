[**Quini6 Frontend v0.0.1**](../../../README.md)

***

[Quini6 Frontend](../../../modules.md) / [test/jsdom-environment](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [test/jsdom-environment.ts:60](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/test/jsdom-environment.ts#L60)

## Type Declaration

### setupVM()

> **setupVM**(`options?`): `Promise`\<\{ `getVmContext`(): `Context`; `teardown`(): `void`; \}\>

#### Parameters

##### options?

###### jsdom?

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<\{ `getVmContext`(): `Context`; `teardown`(): `void`; \}\>

### setup()

> **setup**(`global`, `options?`): `Promise`\<\{ `teardown`(`global2`): `void`; \}\>

#### Parameters

##### global

`Record`\<`string`, `unknown`\>

##### options?

###### jsdom?

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<\{ `teardown`(`global2`): `void`; \}\>
