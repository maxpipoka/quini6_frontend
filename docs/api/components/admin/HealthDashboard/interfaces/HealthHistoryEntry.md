[**Quini6 Frontend v0.0.1**](../../../../README.md)

***

[Quini6 Frontend](../../../../modules.md) / [components/admin/HealthDashboard](../README.md) / HealthHistoryEntry

# Interface: HealthHistoryEntry

Defined in: [components/admin/HealthDashboard.tsx:20](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/components/admin/HealthDashboard.tsx#L20)

## Properties

### timestamp

> **timestamp**: `string`

Defined in: [components/admin/HealthDashboard.tsx:21](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/components/admin/HealthDashboard.tsx#L21)

***

### apiHealth

> **apiHealth**: \{ `status`: `"ok"` \| `"degraded"` \| `"down"`; `timestamp`: `string`; `uptime`: `number`; `version`: `string`; \} \| `null`

Defined in: [components/admin/HealthDashboard.tsx:22](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/components/admin/HealthDashboard.tsx#L22)

***

### dbHealth

> **dbHealth**: \{ `status`: `"ok"` \| `"down"`; `latency`: `number`; `timestamp`: `string`; \} \| `null`

Defined in: [components/admin/HealthDashboard.tsx:23](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/components/admin/HealthDashboard.tsx#L23)
