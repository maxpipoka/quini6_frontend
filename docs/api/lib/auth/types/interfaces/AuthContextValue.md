[**Quini6 Frontend v0.0.1**](../../../../README.md)

***

[Quini6 Frontend](../../../../modules.md) / [lib/auth/types](../README.md) / AuthContextValue

# Interface: AuthContextValue

Defined in: [lib/auth/types.ts:24](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/auth/types.ts#L24)

## Extends

- [`AuthState`](AuthState.md)

## Properties

### user

> **user**: [`User`](User.md) \| `null`

Defined in: [lib/auth/types.ts:9](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/auth/types.ts#L9)

#### Inherited from

[`AuthState`](AuthState.md).[`user`](AuthState.md#user)

***

### isLoading

> **isLoading**: `boolean`

Defined in: [lib/auth/types.ts:10](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/auth/types.ts#L10)

#### Inherited from

[`AuthState`](AuthState.md).[`isLoading`](AuthState.md#isloading)

***

### isAuthenticated

> **isAuthenticated**: `boolean`

Defined in: [lib/auth/types.ts:11](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/auth/types.ts#L11)

#### Inherited from

[`AuthState`](AuthState.md).[`isAuthenticated`](AuthState.md#isauthenticated)

***

### login

> **login**: (`creds`) => `Promise`\<`void`\>

Defined in: [lib/auth/types.ts:25](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/auth/types.ts#L25)

#### Parameters

##### creds

[`LoginCredentials`](LoginCredentials.md)

#### Returns

`Promise`\<`void`\>

***

### logout

> **logout**: () => `Promise`\<`void`\>

Defined in: [lib/auth/types.ts:26](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/auth/types.ts#L26)

#### Returns

`Promise`\<`void`\>

***

### changePassword

> **changePassword**: (`data`) => `Promise`\<`void`\>

Defined in: [lib/auth/types.ts:27](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/auth/types.ts#L27)

#### Parameters

##### data

[`ChangePasswordInput`](ChangePasswordInput.md)

#### Returns

`Promise`\<`void`\>

***

### refresh

> **refresh**: () => `Promise`\<`void`\>

Defined in: [lib/auth/types.ts:28](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/auth/types.ts#L28)

#### Returns

`Promise`\<`void`\>

***

### getCsrfToken

> **getCsrfToken**: () => `string` \| `null`

Defined in: [lib/auth/types.ts:29](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/auth/types.ts#L29)

#### Returns

`string` \| `null`
