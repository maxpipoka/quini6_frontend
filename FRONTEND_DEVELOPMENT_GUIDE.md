# Quini 6 Backend - Guía de Desarrollo Frontend

## Resumen Ejecutivo

API REST para estadísticas históricas del Quini 6 (lotería argentina). Backend completo en NestJS + Prisma + PostgreSQL (Neon), desplegado en Vercel (serverless).

**Base URL:** `https://tu-dominio.vercel.app/api` (prefijo `/api` global)
**Documentación Swagger:** `/api/docs`
**Health checks:** `/api/health` y `/api/health/db`

---

## Stack Tecnológico Frontend (DEFINITIVO)

- **Framework:** **Astro** (output: `static` por defecto, `hybrid` para regeneración on-demand)
- **Styling:** **Tailwind CSS** + **CSS Custom Properties** para tema (ver sección "Sistema de Colores")
- **UI:** Componentes `.astro` + islas React/Preact solo donde haya interactividad (`client:load`, `client:visible`)
- **Datos:** Fetch en `getStaticPaths` (build) + API calls en islas (runtime)
- **Despliegue:** **Vercel** (static hosting + Deploy Hooks para rebuilds automáticos)
- **Diseño base:** **Kombai Canvas** — variantes "Inicio A" (desktop `var_99f4a4e16c3b` + móvil `var_27e5bb7433e5`) en `.kombai/canvas/quini6.canvas`

---

## Sistema de Colores (CSS Custom Properties)

**Objetivo:** Cambiar paleta completa editando **solo variables** — sin tocar componentes ni clases Tailwind.

### Definición en `:root` (src/styles/global.css)

```css
:root {
  /* Paleta base (valores actuales del canvas Kombai) */
  --color-primary: #12345a; /* azul oscuro principal */
  --color-primary-hover: #174a8b; /* hover/active */
  --color-primary-light: #b8d4f5; /* badges, acentos suaves */
  --color-background: #f5f7fa; /* fondo general */
  --color-surface: #ffffff; /* cards, header */
  --color-text: #182230; /* texto principal */
  --color-text-muted: #5d6878; /* texto secundario */
  --color-border: #dce3eb; /* bordes, divisores */
  --color-focus: #174a8b; /* focus-visible outline */

  /* Semánticos (derivados) */
  --color-success: #059669;
  --color-warning: #d97706;
  --color-error: #dc2626;
}

/* Alternativa: tema oscuro futuro */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #3b82f6;
    --color-primary-hover: #60a5fa;
    --color-primary-light: #1e3a5f;
    --color-background: #0f172a;
    --color-surface: #1e293b;
    --color-text: #f1f5f9;
    --color-text-muted: #94a3b8;
    --color-border: #334155;
    --color-focus: #60a5fa;
  }
}
```

### Uso en Tailwind (tailwind.config.mjs)

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-light': 'var(--color-primary-light)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        border: 'var(--color-border)',
        focus: 'var(--color-focus)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
      },
    },
  },
  plugins: [],
};
```

### Uso en componentes

```astro
<!-- En lugar de bg-[#12345A] text-white -->
<header class="bg-primary text-surface">
  <a class="text-primary-hover hover:underline" href="/">Quini 6</a>
</header>

<!-- Cards -->
<article class="bg-surface border-border rounded-xl border p-6">
  <h2 class="text-text">Título</h2>
  <p class="text-text-muted">Descripción</p>
</article>
```

### Cambiar paleta completa

Editas **solo** `src/styles/global.css` → refrescas → toda la app cambia.  
Para probar alternativas: duplicas el bloque `:root`, comentas/descomentas, o usas una clase en `<html>` (`.theme-alt`) y selectores CSS.

---

## Generación Estática de Páginas de Sorteo (SEO)

**Objetivo:** Un archivo HTML estático por sorteo (`/sorteos/[numero]`) para SEO óptimo y carga instantánea.

### Implementación en Astro

```astro
// src/pages/sorteos/[officialNumber].astro

export async function getStaticPaths() { const res = await fetch(`${import.meta.env.VITE_API_URL}/draws`,
{ headers: { 'Accept': 'application/json' } }); const { data: draws } = await res.json(); return draws.map((d:
DrawResponseDto) => ({ params: { officialNumber: String(d.officialNumber) }, props: { draw: d } })); }
const { draw } = Astro.props;

<Layout title={`${draw.officialNumber} - Quini 6 Estadísticas`}>
  <!-- HTML semántico del canvas Kombai + datos del sorteo -->
  <h1>Sorteo Nº {draw.officialNumber}</h1>
  <time>{new Date(draw.drawDate).toLocaleDateString('es-AR')}</time>
  {
    draw.results.map((r) => (
      <section>
        <h2>{r.modality}</h2>
        <ul>
          {r.numbers.map((n) => (
            <li>{n.padStart(2, '0')}</li>
          ))}
        </ul>
      </section>
    ))
  }
</Layout>
```

**Resultado:** `dist/sorteos/123/index.html`, `dist/sorteos/124/index.html`, … — cero JS, SEO perfecto.

### Trigger de Regeneración: **Vercel Deploy Hook**

1. En Vercel → Project Settings → Git → **Deploy Hooks** → _Create Hook_ → nombre "rebuild-sorteos"
2. URL generada: `https://api.vercel.com/v1/integrations/deploy/xxxx/xxxx`
3. Guardar en variable de entorno del backend: `VERCEL_DEPLOY_HOOK_URL`
4. En tu API (endpoint `POST /api/admin/draws` y `PATCH/DELETE`), **después de persistir**:
   ```js
   await fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' });
   ```
5. Vercel hace **rebuild + redeploy automático** → nuevo HTML generado en segundos.

> **Nota:** Si no se puede tocar la API, alternativa: **Vercel Cron Job** diario (`vercel.json` → `"crons": [{ "path": "/api/rebuild", "schedule": "0 3 * * *" }]`).

---

## Arquitectura y Autenticación

### Esquema de Autenticación

- **JWT en cookies HttpOnly** (`admin_session`) + **CSRF token** en cookie separada (`csrf_token`)
- **Solo para panel admin** (`/api/admin/*`)
- **Endpoints públicos** (`/api/draws/*`, `/api/search/*`, `/api/health/*`) no requieren auth

### Headers Requeridos para Admin

```
Cookie: admin_session=<jwt>; csrf_token=<csrf>
X-CSRF-Token: <valor de csrf_token cookie>  (en cada request mutante POST/PATCH/DELETE)
Content-Type: application/json
```

### CORS

- Solo permite `FRONTEND_URL` configurada en backend
- Credentials: `true` (cookies incluidas)
- Headers permitidos: `Content-Type`, `Authorization`, `X-CSRF-Token`

---

## Endpoints Públicos (Frontend Público)

### 1. Health Checks

| Método | Endpoint         | Descripción          |
| ------ | ---------------- | -------------------- |
| GET    | `/api/health`    | Estado del servicio  |
| GET    | `/api/health/db` | Estado BD + latencia |

### 2. Sorteos (`/api/draws`)

| Método | Endpoint        | Parámetros                                             | Respuesta                   |
| ------ | --------------- | ------------------------------------------------------ | --------------------------- |
| GET    | `/latest`       | -                                                      | `DrawResponseDto`           |
| GET    | `/recent`       | `limit` (default 5), `offset` (default 0)              | `DrawResponseDto[]`         |
| GET    | `/:drawNumber`  | path: número oficial                                   | `DrawResponseDto`           |
| GET    | `/` (historial) | `page` (1), `limit` (20), `year` (opcional, 4 dígitos) | `PaginatedDrawsResponseDto` |

#### DrawResponseDto

```typescript
interface DrawResponseDto {
  id: string; // UUID
  officialNumber: number; // Número oficial del sorteo
  drawDate: string; // ISO 8601
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  results: DrawResultDto[]; // 4 modalidades
}

interface DrawResultDto {
  modality: 'TRADICIONAL' | 'LA_SEGUNDA' | 'REVANCHA' | 'SIEMPRE_SALE';
  numbers: string[]; // 6 números como strings zero-padded ("05", "12", "45")
  createdAt: string;
  updatedAt: string;
}
```

#### PaginatedDrawsResponseDto

```typescript
interface PaginatedDrawsResponseDto {
  data: DrawResponseDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

### 3. Búsqueda Exacta (`/api/search`)

| Método | Endpoint | Body                                            | Query Params                                      | Respuesta                |
| ------ | -------- | ----------------------------------------------- | ------------------------------------------------- | ------------------------ |
| POST   | `/exact` | `{ numbers: number[] }` (6 enteros únicos 0-45) | `limit` (1-100, default 20), `offset` (default 0) | `ExactSearchResponseDto` |

#### Request

```typescript
interface ExactSearchDto {
  numbers: number[]; // exactamente 6, únicos, rango 0-45
}
```

#### Response

```typescript
interface ExactSearchResponseDto {
  found: boolean;
  totalMatches: number;
  matches: SearchMatchDto[];
}

interface SearchMatchDto {
  drawDate: string; // ISO 8601
  officialNumber: number;
  modality: string; // TRADICIONAL | LA_SEGUNDA | REVANCHA | SIEMPRE_SALE
  numbers: number[]; // 6 números ordenados
}
```

**Nota:** La búsqueda es por **permutación** (orden no importa). Rate limit: 30 req/min.

---

## Endpoints Admin (Panel de Administración)

### Autenticación Admin (`/api/admin/auth`)

| Método | Endpoint           | Auth          | Body                               | Descripción                  |
| ------ | ------------------ | ------------- | ---------------------------------- | ---------------------------- |
| POST   | `/login`           | Público       | `{ email, password }`              | Login, setea cookies         |
| GET    | `/me`              | Cookie + CSRF | -                                  | Usuario actual               |
| POST   | `/logout`          | Cookie + CSRF | -                                  | Logout, limpia cookies       |
| POST   | `/change-password` | Cookie + CSRF | `{ currentPassword, newPassword }` | Cambio pass + logout forzado |

#### LoginDto

```typescript
interface LoginDto {
  email: string; // email válido
  password: string; // min 8 chars
}
```

#### ChangePasswordDto

```typescript
interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string; // min 8 chars
}
```

### Gestión de Sorteos Admin (`/api/admin/draws`)

| Método | Endpoint | Auth          | Body            | Descripción       |
| ------ | -------- | ------------- | --------------- | ----------------- |
| POST   | `/`      | Cookie + CSRF | `CreateDrawDto` | Crear sorteo      |
| PATCH  | `/:id`   | Cookie + CSRF | `UpdateDrawDto` | Actualizar sorteo |
| DELETE | `/:id`   | Cookie + CSRF | -               | Eliminar sorteo   |

#### CreateDrawDto

```typescript
interface CreateDrawDto {
  officialNumber: number; // entero positivo, único
  drawDate: string; // ISO 8601
  results: ModalityResultDto[]; // exactamente 4 modalidades
}

interface ModalityResultDto {
  modality: 'TRADICIONAL' | 'LA_SEGUNDA' | 'REVANCHA' | 'SIEMPRE_SALE';
  numbers: number[]; // 6 enteros únicos 0-45
}
```

#### UpdateDrawDto (todos opcionales)

```typescript
interface UpdateDrawDto {
  officialNumber?: number;
  drawDate?: string;
  results?: ModalityResultDto[];
}
```

### Importación Masiva (`/api/admin/import`)

**Flujo:** 1) POST `/preview` → 2) Revisar preview → 3) POST `/commit`

| Método | Endpoint   | Auth                                | Descripción                         |
| ------ | ---------- | ----------------------------------- | ----------------------------------- |
| POST   | `/preview` | Cookie + CSRF + multipart/form-data | Subir CSV/XLSX, validar sin guardar |
| POST   | `/commit`  | Cookie + CSRF                       | Confirmar importación               |
| GET    | `/`        | Cookie + CSRF                       | Listar imports con filtros          |
| GET    | `/:id`     | Cookie + CSRF                       | Detalle de importación              |

#### Preview (multipart/form-data)

- Campo: `file` (CSV o XLSX, max 10MB)
- Respuesta: `PreviewResponse` con validaciones, duplicados, estadísticas

#### CommitImportDto

```typescript
interface CommitImportDto {
  previewId: string; // ID del preview a confirmar
  duplicatePolicy: 'SKIP' | 'REPLACE' | 'ABORT'; // default: SKIP
}
```

#### List Imports (query params)

```
page=1, limit=20, status=pending|completed|partial|failed, type=csv|xlsx, fromDate=ISO, toDate=ISO
```

---

## Rate Limiting

| Endpoint              | Límite  | Ventana |
| --------------------- | ------- | ------- |
| Login                 | 5 req   | 1 min   |
| Search exacto         | 30 req  | 1 min   |
| Import preview/commit | 10 req  | 1 min   |
| Default (otros admin) | 100 req | 1 min   |

**Respuesta 429:**

```json
{
  "statusCode": 429,
  "message": "Too Many Requests",
  "error": "Too Many Requests"
}
```

---

## Manejo de Errores

### Formato Estándar (HttpExceptionFilter)

```typescript
interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string; // ISO 8601
  path: string;
  requestId: string; // Para debugging
}
```

### Códigos Comunes

- **400** - Validación fallida (DTO inválido, reglas de negocio)
- **401** - No autenticado / credenciales inválidas / sesión expirada
- **403** - CSRF token faltante/inválido
- **404** - Recurso no encontrado
- **409** - Conflicto (ej. preview ya commiteado, número oficial duplicado)
- **413** - Archivo > 10MB
- **422** - Política UPDATE no habilitada en import
- **429** - Rate limit excedido
- **500** - Error interno (logs en Vercel)

---

## Validaciones Críticas (Frontend debe replicar)

### Números de Sorteo

- **Exactamente 6 números** por modalidad
- **Rango 0-45** (inclusive)
- **Únicos** (sin duplicados dentro de los 6)
- **Zero-padded en display** ("05", "12", "45")

### Modalidades (orden fijo en UI recomendado)

1. TRADICIONAL
2. LA_SEGUNDA
3. REVANCHA
4. SIEMPRE_SALE

### Fechas

- Formato ISO 8601 en API (`2026-10-23T20:00:00.000Z`)
- Input: `<input type="datetime-local">` o date picker
- Zona horaria: UTC en backend

### Búsqueda Exacta

- 6 números únicos 0-45
- Orden irrelevante (permutación)
- Mín 1, máx 100 resultados por página

---

## Variables de Entorno Frontend

```env
# Requeridas
VITE_API_URL=https://tu-backend.vercel.app/api
VITE_FRONTEND_URL=https://tu-frontend.vercel.app

# Opcionales
VITE_ENABLE_SWAGGER=false
```

---

## Plan de Desarrollo Frontend - Fases Incrementales

### FASE 1: Fundación y Páginas Públicas (Semana 1-2)

**Objetivo:** Landing + consulta de sorteos + búsqueda, sin auth

#### 1.1 Setup Inicial

- [ ] Inicializar proyecto (Vite + React/Next.js + TypeScript)
- [ ] Configurar ESLint, Prettier, Husky
- [ ] Cliente API tipado (axios/fetch + Zod/Valibot para validación runtime)
- [ ] Variables de entorno + config por ambiente
- [ ] Error boundary global + logging (Sentry opcional)

#### 1.2 Componentes Base

- [ ] `Button`, `Input`, `Select`, `Modal`, `Toast`, `Spinner`, `Table`, `Pagination`
- [ ] `NumberInput` (6 campos, validación 0-45, únicos, zero-padded display)
- [ ] `DatePicker` (ISO 8601 UTC)
- [ ] Layout: Header, Footer, Container responsive

#### 1.3 Páginas Públicas

- [ ] **Home/Landing** - Hero, stats rápidas, enlaces a secciones
- [ ] **Último Sorteo** (`GET /draws/latest`) - Card destacada con 4 modalidades
- [ ] **Historial Paginado** (`GET /draws`) - Tabla con filtros (año, paginación)
- [ ] **Detalle Sorteo** (`GET /draws/:number`) - Vista completa
- [ ] **Búsqueda Exacta** (`POST /search/exact`) - Form 6 números + resultados paginados
- [ ] **Estados**: Loading, Empty, Error (con requestId para soporte)

#### 1.4 Testing & Calidad

- [ ] Tests unitarios componentes críticos (Vitest + RTL)
- [ ] Tests E2E flujos principales (Playwright/Cypress)
- [ ] Storybook para componentes UI
- [ ] Lighthouse > 90

---

### FASE 2: Panel Admin - Autenticación y CRUD Sorteos (Semana 3-4)

**Objetivo:** Login, sesión, gestión completa de sorteos

#### 2.1 Autenticación Admin

- [ ] **Login Page** - Form email/pass, manejo cookies HttpOnly
- [ ] **CSRF Handling** - Leer `csrf_token` cookie, enviar `X-CSRF-Token` header
- [ ] **Auth Context/Store** - Estado usuario, refresh silencioso, logout automático en 401
- [ ] **Protected Routes** - Wrapper para `/admin/*`
- [ ] **Logout** - Llamada API + limpieza estado local
- [ ] **Change Password** - Modal con validación pass actual + nueva

#### 2.2 Gestión Sorteos Admin

- [ ] **Listado Admin** - Tabla con acciones (crear, editar, eliminar)
- [ ] **Crear Sorteo** - Modal/Form multi-paso:
  - Paso 1: Número oficial + fecha
  - Paso 2: 4 modalidades (validación en vivo 6 números únicos 0-45)
  - Preview antes de confirmar
- [ ] **Editar Sorteo** - Precarga datos, misma validación
- [ ] **Eliminar** - Confirmación modal + feedback
- [ ] **Validación cliente** - Replicar reglas backend (Zod schemas compartidos)

#### 2.3 UX/Admin

- [ ] Sidebar navigation admin
- [ ] Breadcrumbs
- [ ] Toast notifications (éxito/error con requestId)
- [ ] Confirmaciones destructivas
- [ ] Optimistic updates donde aplique

---

### FASE 3: Importación Masiva (Semana 5)

**Objetivo:** Flujo completo preview → commit

#### 3.1 Subida y Preview

- [ ] **Drag & Drop / File Input** - CSV/XLSX, max 10MB, validación tipo
- [ ] **Preview Results** - Tabla con:
  - Filas válidas / inválidas
  - Duplicados detectados (vs BD)
  - Conflictos por modalidad
  - Resumen estadístico
- [ ] **Error Detail** - Expandible por fila con mensaje específico

#### 3.2 Commit

- [ ] **Policy Selector** - SKIP / REPLACE / ABORT (radio buttons)
- [ ] **Confirmación** - Modal con resumen de lo que se va a importar
- [ ] **Progress** - Polling o WebSocket para imports largos
- [ ] **Resultado** - Toast + redirect a lista imports

#### 3.3 Historial Imports

- [ ] **Lista Paginada** - Filtros: estado, tipo, rango fechas
- [ ] **Detalle** - Ver filas procesadas, errores, logs

---

### FASE 4: Pulimiento, Observabilidad y Producción (Semana 6)

**Objetivo:** Calidad producción, monitoreo, docs

#### 4.1 Calidad

- [ ] Accesibilidad (WCAG AA) - focus management, ARIA, contraste
- [ ] i18n (es-AR) - react-i18next
- [ ] PWA - Service Worker, manifest, offline fallback
- [ ] SEO - Meta tags, sitemap, robots.txt

#### 4.2 Observabilidad

- [ ] Error tracking (Sentry) con requestId correlación
- [ ] Analytics (Plausible/GA4) - eventos clave: search, login, import
- [ ] Performance - Web Vitals, bundle analysis
- [ ] Health check UI - `/health` visible en admin

#### 4.3 Documentación

- [ ] README frontend - setup, scripts, arquitectura
- [ ] Guía de componentes (Storybook deployado)
- [ ] API client docs (tipos TypeScript exportados)
- [ ] Runbooks - deploy, rollback, debugging común

#### 4.4 Deploy

- [ ] Vercel/Netlify config - headers, rewrites, env vars
- [ ] Preview deployments en PRs
- [ ] Cache headers para assets estáticos
- [ ] CSP headers compatibles con Helmet backend

---

## Esquemas de Validación Compartidos (TypeScript/Zod)

```typescript
// shared/schemas.ts - usar en frontend Y backend si posible
import { z } from 'zod';

export const ModalityEnum = z.enum(['TRADICIONAL', 'LA_SEGUNDA', 'REVANCHA', 'SIEMPRE_SALE']);

export const NumbersSchema = z
  .array(z.number().int().min(0).max(45))
  .length(6)
  .refine((arr) => new Set(arr).size === 6, 'Números deben ser únicos');

export const ModalityResultSchema = z.object({
  modality: ModalityEnum,
  numbers: NumbersSchema,
});

export const CreateDrawSchema = z.object({
  officialNumber: z.number().int().positive(),
  drawDate: z.string().datetime(),
  results: z.array(ModalityResultSchema).length(4),
});

export const ExactSearchSchema = z.object({
  numbers: NumbersSchema,
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
  })
  .refine((d) => d.currentPassword !== d.newPassword, 'Password debe ser diferente');
```

---

## Checklist de Integración Backend-Frontend

| Item       | Verificación                                                   |
| ---------- | -------------------------------------------------------------- |
| CORS       | `FRONTEND_URL` coincide exactamente (incluye puerto si dev)    |
| Cookies    | `SameSite=Lax` o `None; Secure` en producción                  |
| CSRF       | Frontend lee cookie `csrf_token` y envía header `X-CSRF-Token` |
| Auth       | 401 en `/me` → redirect login + limpiar estado                 |
| Rate Limit | 429 → toast + retry-after header si existe                     |
| Fechas     | ISO 8601 UTC en ambos sentidos                                 |
| Números    | Zero-padded en display, enteros en API                         |
| Errores    | Mostrar `message` + `requestId` al usuario para soporte        |
| Swagger    | Tipos TypeScript generados desde `/api/docs/json`              |

---

## Recursos para el Equipo Frontend

- **Swagger JSON:** `GET /api/docs/json` → generar tipos con `openapi-typescript` o `orval`
- **Repo Backend:** [GitHub URL]
- **Deploy Backend:** Vercel (logs en dashboard)
- **Contacto Backend:** [Slack/Email del equipo backend]

---

## Próximos Pasos Inmediatos

1. **Clonar repo backend** y correr localmente (`npm run start:dev`)
2. **Generar tipos TypeScript** desde Swagger: `npx orval --input http://localhost:3001/api/docs/json`
3. **Setup proyecto frontend** con estructura de carpetas propuesta
4. **Implementar Fase 1.1-1.3** - Páginas públicas funcionales
5. **Demo a stakeholders** al final de Fase 1

---

_Documento generado automáticamente desde código backend - Actualizar tras cambios en API_
