[**Quini6 Frontend v0.0.1**](../../../README.md)

***

[Quini6 Frontend](../../../modules.md) / [lib/analytics](../README.md) / trackEvent

# Function: trackEvent()

> **trackEvent**(`name`, `props?`): `void`

Defined in: [lib/analytics.ts:76](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/analytics.ts#L76)

Track an event with Plausible Analytics.
Gracefully falls back if Plausible is not loaded.

## Parameters

### name

[`EventName`](../type-aliases/EventName.md)

The event name (typed for safety)

### props?

[`EventProps`](../type-aliases/EventProps.md)

Optional event properties

## Returns

`void`
