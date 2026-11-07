[**Quini6 Frontend v0.0.1**](../../../../README.md)

***

[Quini6 Frontend](../../../../modules.md) / [lib/api/client](../README.md) / ApiClient

# Class: ApiClient

Defined in: [lib/api/client.ts:85](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L85)

## Constructors

### Constructor

> **new ApiClient**(`config`): `ApiClient`

Defined in: [lib/api/client.ts:117](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L117)

#### Parameters

##### config

[`ApiClientConfig`](../interfaces/ApiClientConfig.md)

#### Returns

`ApiClient`

## Methods

### getLatestDraw()

> **getLatestDraw**(): `Promise`\<\{ `id`: `string`; `officialNumber`: `number`; `drawDate`: `string`; `createdAt`: `string`; `updatedAt`: `string`; `results`: `object`[]; \}\>

Defined in: [lib/api/client.ts:262](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L262)

#### Returns

`Promise`\<\{ `id`: `string`; `officialNumber`: `number`; `drawDate`: `string`; `createdAt`: `string`; `updatedAt`: `string`; `results`: `object`[]; \}\>

***

### getDraw()

> **getDraw**(`officialNumber`): `Promise`\<\{ `id`: `string`; `officialNumber`: `number`; `drawDate`: `string`; `createdAt`: `string`; `updatedAt`: `string`; `results`: `object`[]; \}\>

Defined in: [lib/api/client.ts:268](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L268)

#### Parameters

##### officialNumber

`number`

#### Returns

`Promise`\<\{ `id`: `string`; `officialNumber`: `number`; `drawDate`: `string`; `createdAt`: `string`; `updatedAt`: `string`; `results`: `object`[]; \}\>

***

### getDrawHistory()

> **getDrawHistory**(`params?`): `Promise`\<\{ `data`: `object`[]; `page`: `number`; `limit`: `number`; `total`: `number`; `totalPages`: `number`; \}\>

Defined in: [lib/api/client.ts:274](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L274)

#### Parameters

##### params?

###### page?

`number`

###### limit?

`number`

###### year?

`number`

#### Returns

`Promise`\<\{ `data`: `object`[]; `page`: `number`; `limit`: `number`; `total`: `number`; `totalPages`: `number`; \}\>

***

### searchExactCombination()

> **searchExactCombination**(`numbers`, `dateRange?`): `Promise`\<\{ `found`: `boolean`; `totalMatches`: `number`; `matches`: `object`[]; \}\>

Defined in: [lib/api/client.ts:292](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L292)

#### Parameters

##### numbers

`number`[]

##### dateRange?

###### fromDate?

`string`

###### toDate?

`string`

#### Returns

`Promise`\<\{ `found`: `boolean`; `totalMatches`: `number`; `matches`: `object`[]; \}\>

***

### getNumberFrequency()

> **getNumberFrequency**(`params?`): `Promise`\<\{ `modality?`: `"TRADICIONAL"` \| `"LA_SEGUNDA"` \| `"REVANCHA"` \| `"SIEMPRE_SALE"`; `fromDate?`: `string`; `toDate?`: `string`; `totalDraws`: `number`; `frequencies`: `object`[]; \}\>

Defined in: [lib/api/client.ts:309](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L309)

#### Parameters

##### params?

###### fromDate?

`string` = `...`

###### toDate?

`string` = `...`

###### modality?

`"TRADICIONAL"` \| `"LA_SEGUNDA"` \| `"REVANCHA"` \| `"SIEMPRE_SALE"` = `...`

#### Returns

`Promise`\<\{ `modality?`: `"TRADICIONAL"` \| `"LA_SEGUNDA"` \| `"REVANCHA"` \| `"SIEMPRE_SALE"`; `fromDate?`: `string`; `toDate?`: `string`; `totalDraws`: `number`; `frequencies`: `object`[]; \}\>

***

### healthCheck()

> **healthCheck**(): `Promise`\<\{ `status`: `"ok"` \| `"degraded"` \| `"down"`; `timestamp`: `string`; `uptime`: `number`; `version`: `string`; \}\>

Defined in: [lib/api/client.ts:323](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L323)

#### Returns

`Promise`\<\{ `status`: `"ok"` \| `"degraded"` \| `"down"`; `timestamp`: `string`; `uptime`: `number`; `version`: `string`; \}\>

***

### healthDbCheck()

> **healthDbCheck**(): `Promise`\<\{ `status`: `"ok"` \| `"down"`; `latency`: `number`; `timestamp`: `string`; \}\>

Defined in: [lib/api/client.ts:329](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L329)

#### Returns

`Promise`\<\{ `status`: `"ok"` \| `"down"`; `latency`: `number`; `timestamp`: `string`; \}\>

***

### adminLogin()

> **adminLogin**(`credentials`): `Promise`\<\{ `user`: `unknown`; \}\>

Defined in: [lib/api/client.ts:339](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L339)

#### Parameters

##### credentials

###### email

`string` = `...`

###### password

`string` = `...`

#### Returns

`Promise`\<\{ `user`: `unknown`; \}\>

***

### adminMe()

> **adminMe**(): `Promise`\<`unknown`\>

Defined in: [lib/api/client.ts:346](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L346)

#### Returns

`Promise`\<`unknown`\>

***

### adminLogout()

> **adminLogout**(): `Promise`\<`void`\>

Defined in: [lib/api/client.ts:350](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L350)

#### Returns

`Promise`\<`void`\>

***

### adminChangePassword()

> **adminChangePassword**(`data`): `Promise`\<`void`\>

Defined in: [lib/api/client.ts:354](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L354)

#### Parameters

##### data

###### currentPassword

`string` = `...`

###### newPassword

`string` = `...`

#### Returns

`Promise`\<`void`\>

***

### adminCreateDraw()

> **adminCreateDraw**(`data`): `Promise`\<\{ `id`: `string`; `officialNumber`: `number`; `drawDate`: `string`; `createdAt`: `string`; `updatedAt`: `string`; `results`: `object`[]; \}\>

Defined in: [lib/api/client.ts:361](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L361)

#### Parameters

##### data

###### officialNumber

`number` = `...`

###### drawDate

`string` = `...`

###### results

`object`[] = `...`

#### Returns

`Promise`\<\{ `id`: `string`; `officialNumber`: `number`; `drawDate`: `string`; `createdAt`: `string`; `updatedAt`: `string`; `results`: `object`[]; \}\>

***

### adminUpdateDraw()

> **adminUpdateDraw**(`id`, `data`): `Promise`\<\{ `id`: `string`; `officialNumber`: `number`; `drawDate`: `string`; `createdAt`: `string`; `updatedAt`: `string`; `results`: `object`[]; \}\>

Defined in: [lib/api/client.ts:369](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L369)

#### Parameters

##### id

`string`

##### data

###### officialNumber?

`number` = `...`

###### drawDate?

`string` = `...`

###### results?

`object`[] = `...`

#### Returns

`Promise`\<\{ `id`: `string`; `officialNumber`: `number`; `drawDate`: `string`; `createdAt`: `string`; `updatedAt`: `string`; `results`: `object`[]; \}\>

***

### adminDeleteDraw()

> **adminDeleteDraw**(`id`): `Promise`\<`void`\>

Defined in: [lib/api/client.ts:377](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L377)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

***

### adminImportPreview()

> **adminImportPreview**(`file`): `Promise`\<`unknown`\>

Defined in: [lib/api/client.ts:381](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L381)

#### Parameters

##### file

`File`

#### Returns

`Promise`\<`unknown`\>

***

### adminImportCommit()

> **adminImportCommit**(`data`): `Promise`\<`unknown`\>

Defined in: [lib/api/client.ts:390](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L390)

#### Parameters

##### data

###### previewId

`string` = `...`

###### duplicatePolicy

`"SKIP"` \| `"REPLACE"` \| `"ABORT"` = `...`

#### Returns

`Promise`\<`unknown`\>

***

### adminListImports()

> **adminListImports**(`params?`): `Promise`\<`unknown`\>

Defined in: [lib/api/client.ts:397](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L397)

#### Parameters

##### params?

###### page

`number` = `...`

###### limit

`number` = `...`

###### status?

`"failed"` \| `"completed"` \| `"pending"` \| `"partial"` = `...`

###### type?

`"csv"` \| `"xlsx"` = `...`

###### fromDate?

`string` = `...`

###### toDate?

`string` = `...`

#### Returns

`Promise`\<`unknown`\>

***

### adminGetImport()

> **adminGetImport**(`id`): `Promise`\<`unknown`\>

Defined in: [lib/api/client.ts:410](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L410)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`unknown`\>

***

### importPreview()

> **importPreview**(`rows`): `Promise`\<\{ `importId`: `string`; `validCount`: `number`; `invalidCount`: `number`; \}\>

Defined in: [lib/api/client.ts:422](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L422)

Submit parsed rows for import preview
POST /admin/imports/preview

#### Parameters

##### rows

`object`[]

#### Returns

`Promise`\<\{ `importId`: `string`; `validCount`: `number`; `invalidCount`: `number`; \}\>

***

### importCommit()

> **importCommit**(`importId`, `policy`, `_options?`): `Promise`\<\{ `created`: `number`; `updated`: `number`; `skipped`: `number`; `failed`: `number`; `errors`: `object`[]; \}\>

Defined in: [lib/api/client.ts:434](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L434)

Commit a previewed import with conflict resolution policy
POST /admin/imports/{importId}/commit?policy={policy}

#### Parameters

##### importId

`string`

##### policy

`"skip"` \| `"replace"` \| `"merge"`

##### \_options?

###### onProgress?

(`progress`) => `void`

#### Returns

`Promise`\<\{ `created`: `number`; `updated`: `number`; `skipped`: `number`; `failed`: `number`; `errors`: `object`[]; \}\>

***

### getImportHistory()

> **getImportHistory**(`params?`): `Promise`\<\{ `data`: `object`[]; `page`: `number`; `limit`: `number`; `total`: `number`; `totalPages`: `number`; \}\>

Defined in: [lib/api/client.ts:451](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L451)

Get paginated import history
GET /admin/imports

#### Parameters

##### params?

###### page

`number` = `...`

###### limit

`number` = `...`

###### sort?

`"date"` \| `"failed"` \| `"fileName"` \| `"processed"` \| `"succeeded"` = `...`

###### order?

`"asc"` \| `"desc"` = `...`

###### startDate?

`string` = `...`

###### endDate?

`string` = `...`

###### policy?

`"skip"` \| `"replace"` \| `"merge"` = `...`

#### Returns

`Promise`\<\{ `data`: `object`[]; `page`: `number`; `limit`: `number`; `total`: `number`; `totalPages`: `number`; \}\>

***

### getImportErrors()

> **getImportErrors**(`importId`): `Promise`\<\{ `errors`: `object`[]; \}\>

Defined in: [lib/api/client.ts:470](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L470)

Get detailed errors for a specific import
GET /admin/imports/{importId}/errors

#### Parameters

##### importId

`string`

#### Returns

`Promise`\<\{ `errors`: `object`[]; \}\>
