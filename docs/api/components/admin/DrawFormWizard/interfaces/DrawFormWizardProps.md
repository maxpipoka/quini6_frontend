[**Quini6 Frontend v0.0.1**](../../../../README.md)

***

[Quini6 Frontend](../../../../modules.md) / [components/admin/DrawFormWizard](../README.md) / DrawFormWizardProps

# Interface: DrawFormWizardProps

Defined in: [components/admin/DrawFormWizard.tsx:14](https://github.com/maxpipoka/quini6_frontend/blob/9f722dfc2bfe14741847adbac029e48d9370d9af/src/components/admin/DrawFormWizard.tsx#L14)

## Properties

### initialData?

> `optional` **initialData?**: `Partial`\<\{ `officialNumber`: `number`; `drawDate`: `string`; `results`: `object`[]; \}\>

Defined in: [components/admin/DrawFormWizard.tsx:15](https://github.com/maxpipoka/quini6_frontend/blob/9f722dfc2bfe14741847adbac029e48d9370d9af/src/components/admin/DrawFormWizard.tsx#L15)

***

### isEditing?

> `optional` **isEditing?**: `boolean`

Defined in: [components/admin/DrawFormWizard.tsx:16](https://github.com/maxpipoka/quini6_frontend/blob/9f722dfc2bfe14741847adbac029e48d9370d9af/src/components/admin/DrawFormWizard.tsx#L16)

***

### drawId?

> `optional` **drawId?**: `string`

Defined in: [components/admin/DrawFormWizard.tsx:17](https://github.com/maxpipoka/quini6_frontend/blob/9f722dfc2bfe14741847adbac029e48d9370d9af/src/components/admin/DrawFormWizard.tsx#L17)

***

### onSubmit

> **onSubmit**: (`data`) => `Promise`\<`void`\>

Defined in: [components/admin/DrawFormWizard.tsx:18](https://github.com/maxpipoka/quini6_frontend/blob/9f722dfc2bfe14741847adbac029e48d9370d9af/src/components/admin/DrawFormWizard.tsx#L18)

#### Parameters

##### data

\{ `officialNumber`: `number`; `drawDate`: `string`; `results`: `object`[]; \} \| \{ `officialNumber?`: `number`; `drawDate?`: `string`; `results?`: `object`[]; \}

#### Returns

`Promise`\<`void`\>

***

### onCancel

> **onCancel**: () => `void`

Defined in: [components/admin/DrawFormWizard.tsx:19](https://github.com/maxpipoka/quini6_frontend/blob/9f722dfc2bfe14741847adbac029e48d9370d9af/src/components/admin/DrawFormWizard.tsx#L19)

#### Returns

`void`

***

### isLoading?

> `optional` **isLoading?**: `boolean`

Defined in: [components/admin/DrawFormWizard.tsx:20](https://github.com/maxpipoka/quini6_frontend/blob/9f722dfc2bfe14741847adbac029e48d9370d9af/src/components/admin/DrawFormWizard.tsx#L20)
