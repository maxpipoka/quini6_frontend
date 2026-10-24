# Definición funcional y visual del frontend

## Sitio de estadísticas del Quini 6 — Documento para Kombai

**Versión:** 1.0  
**Idioma:** español de Argentina  
**Producto:** sitio público responsive de resultados y estadísticas, con área administrativa separada  
**Backend:** API REST independiente con NestJS y PostgreSQL en Neon

---

# 1. Objetivo del producto

Crear un sitio web donde los visitantes puedan consultar el último sorteo del Quini 6, explorar resultados históricos y comprobar si una combinación exacta de seis números apareció en algún sorteo registrado.

El sitio debe priorizar la consulta rápida, la legibilidad de los números y una experiencia sencilla en móvil y escritorio. La monetización prevista es mediante publicidad, integrada sin interrumpir la navegación.

El producto **no** debe parecer un casino ni una casa de apuestas. No debe ofrecer predicciones, promesas de ganancias, “números seguros” ni probabilidades inventadas. No debe mostrar datos ficticios como si fueran resultados oficiales ni ofrecer registro público de usuarios en el MVP.

# 2. Público y principios de experiencia

Principios:

- **Directo:** el último sorteo y la búsqueda se encuentran fácilmente desde Inicio.
- **Legible:** números grandes, separados y fáciles de comparar.
- **Simple:** pocos pasos para buscar una combinación.
- **Responsive:** experiencia completa en teléfono, tablet y computadora.
- **Honesto:** mostrar fecha y número de sorteo; si la API falla, no inventar datos.
- **Accesible:** contraste adecuado, foco visible, etiquetas y navegación por teclado.
- **Rápido:** evitar animaciones pesadas, fondos de video y componentes innecesarios.

# 3. Identidad visual

## Dirección de arte

Un portal informativo moderno, sobrio y confiable, con referencias visuales de sitios de resultados deportivos o financieros, adaptado a las bolillas del Quini 6. Debe sentirse como un producto terminado, no como un dashboard genérico.

## Paleta propuesta

- Azul principal: `#174A8B` — acciones principales y elementos de marca.
- Azul oscuro: `#12345A` — encabezados.
- Celeste suave: `#EAF4FF` — fondos informativos.
- Fondo general: `#F5F7FA`.
- Tarjetas: `#FFFFFF`.
- Texto principal: `#182230`.
- Texto secundario: `#5D6878`.
- Bordes: `#DCE3EB`.
- Éxito: `#18794E`.
- Error: `#B42318`.
- Advertencia: `#9A6700`.

Ajustar tonos si hace falta para cumplir contraste accesible. No depender únicamente del color para transmitir estados.

## Tipografía y componentes

Usar Inter o una sans-serif equivalente, legible y consistente. Usar cifras tabulares si la fuente lo permite para que los números queden alineados.

- Título de página: 28–36 px en escritorio, 25–30 px en móvil.
- Títulos de sección: 20–24 px.
- Texto habitual: 14–16 px.
- Metadatos: idealmente 12–13 px o más.
- Tarjetas blancas, borde sutil, sombra mínima o nula y radios de 10–14 px.
- Espaciado consistente en múltiplos de 4 u 8 px.
- Iconos simples y consistentes, por ejemplo Lucide.
- Botones con estados hover, focus, disabled y loading.
- Evitar neón, brillos 3D, glassmorphism y sombras pesadas.

## Bolillas numéricas

Los resultados se representan como seis bolillas/fichas circulares uniformes, con número centrado y alto contraste.

- Mostrar siempre dos dígitos: `00`, `04`, `17`, `45`.
- Todas las bolillas de un resultado deben tener tamaño uniforme.
- No usar colores como único diferenciador de modalidades.
- No aplicar efectos de casino.
- En escritorio, mostrar seis bolillas en una línea cuando haya espacio.
- En móvil, mantenerlas legibles y evitar recortes o desplazamiento horizontal innecesario.

# 4. Navegación y rutas

## Navegación pública

- Inicio
- Buscar combinación
- Historial de sorteos
- Acerca del sitio (opcional)

El nombre/logo lleva a Inicio. “Buscar combinación” debe destacarse como acción principal. El acceso administrativo no debe dominar la navegación pública; puede ubicarse discretamente en el pie de página.

## Rutas sugeridas

- `/` — Inicio.
- `/buscar` — Búsqueda de combinación.
- `/sorteos` — Historial.
- `/sorteos/:drawNumber` — Detalle de un sorteo.
- `/admin/login` — Inicio de sesión administrativo.
- `/admin` — Inicio del panel.
- `/admin/sorteos` — Gestión de sorteos.
- `/admin/sorteos/nuevo` — Alta de sorteo.
- `/admin/sorteos/:id/editar` — Edición.
- `/admin/importaciones` — Historial de importaciones.
- `/admin/importaciones/nueva` — Importación y vista previa.

Adaptar las rutas al framework existente sin alterar los contratos de API. El área administrativa debe estar separada visual y funcionalmente de la pública.

# 5. Página de inicio

## Encabezado

- Nombre o logotipo tipográfico, por ejemplo “Quini 6 Estadísticas”.
- Navegación principal.
- Acción destacada “Buscar combinación”.
- Menú compacto y accesible en móvil.
- El encabezado debe ser limpio y no ocupar demasiado alto de pantalla.

## Título e introducción

Título: **Resultados y estadísticas del Quini 6**

Texto sugerido:
“Consultá los últimos sorteos, revisá el historial y buscá si una combinación exacta apareció en los resultados publicados.”

No prometer predicciones ni mejoras en probabilidades.

## Tarjeta principal: último sorteo

Debe ser el contenido central de la parte superior. Mostrar:

- Etiqueta “Último sorteo”.
- Número oficial del sorteo.
- Fecha con formato habitual argentino.
- Las cuatro modalidades.
- Enlace o botón para ver el detalle.

Cada modalidad aparece en un bloque distinguible, con nombre y seis bolillas:

1. Tradicional Primera.
2. La Segunda.
3. Revancha.
4. Siempre Sale.

Las cuatro secciones deben tener la misma jerarquía visual. Si la API no tiene datos, mostrar un estado vacío explicativo; nunca inventar números.

## Publicidad

Reservar espacios visuales para anuncios, sin insertar anuncios falsos:

- Un espacio horizontal opcional entre introducción y contenido.
- Un espacio secundario después del último sorteo o entre secciones.
- En escritorio, un espacio lateral opcional si no afecta la lectura.
- En móvil, anuncios dentro del flujo vertical, nunca superpuestos a resultados o botones.

Cuando no haya anuncio, el espacio debe colapsar o conservar una altura razonable. No usar pop-ups intrusivos ni publicidad que imite controles funcionales. La integración real de la red publicitaria queda para configuración posterior.

## Sorteos anteriores

Mostrar los cinco sorteos anteriores al último, sin repetir el último.

- Número oficial y fecha.
- Al seleccionar un sorteo, abrir su detalle.
- En escritorio, tarjetas compactas o lista ordenada.
- En móvil, lista vertical o tarjetas de ancho completo.
- Enlace “Ver todo el historial”.
- Si hay menos de cinco, mostrar solamente los disponibles.

## Acceso a búsqueda

La búsqueda debe ser muy visible. Puede mostrarse un botón hacia `/buscar` o un formulario resumido en Inicio, pero debe existir una única experiencia de búsqueda coherente, sin formularios duplicados con comportamientos distintos.

# 6. Búsqueda de combinación

## Introducción

Título: **Buscá tu combinación**

Texto:
“Ingresá seis números del 00 al 45 para comprobar si esa combinación exacta aparece en el historial de sorteos.”

Aclaración discreta:
“La consulta compara combinaciones exactas. No predice resultados futuros ni calcula probabilidades de ganar.”

## Formulario

Seis campos numéricos independientes, etiquetados del 1 al 6.

Reglas:

- Cada valor es un entero entre 0 y 45 inclusive.
- Permitir y mostrar `00`.
- No permitir repetidos.
- No permitir negativos, decimales ni valores superiores a 45.
- No enviar hasta que los seis valores sean válidos.
- Mostrar errores junto al campo correspondiente.
- El usuario puede ingresarlos en cualquier orden.
- No usar seis selectores desplegables con 46 opciones.
- El foco debe ser predecible; avanzar automáticamente al siguiente campo al ingresar dos dígitos solo si no dificulta editar.
- Permitir editar y corregir valores con facilidad.

Acciones:

- Botón principal: “Buscar combinación”.
- Acción secundaria: “Limpiar”.
- Mostrar loading y evitar envíos duplicados mientras la solicitud está en curso.

## Resultados con coincidencias

- Resumen: “Se encontraron N coincidencias exactas”.
- Cada coincidencia muestra número de sorteo, fecha, modalidad y seis bolillas.
- Ordenar de más reciente a más antiguo, según contrato de API.
- Permitir abrir el detalle del sorteo.
- Si hay muchas coincidencias, usar paginación o “Cargar más”.
- Modalidades distinguibles por texto y estructura, no solo por color.

## Sin coincidencias

Mostrar:
“No encontramos esta combinación en el historial disponible”.

Mantener los números ingresados y permitir editar o realizar otra búsqueda. Aclarar que la ausencia de coincidencias históricas no predice sorteos futuros.

## Error de red/API

Mostrar:
“No pudimos realizar la búsqueda. Intentá nuevamente”.

Mantener los números, ofrecer reintento y no mostrar stack traces ni errores internos.

## Accesibilidad del formulario

- Etiqueta accesible para cada campo, no solo placeholder.
- Errores expresados con texto y no solo con color.
- Foco en el primer campo inválido o anuncio accesible del resumen.
- Estado de carga y resultados anunciados mediante región accesible.
- Foco visible en todos los controles.

# 7. Historial de sorteos

Ruta: `/sorteos`.

Mostrar una lista o tabla ordenada del más reciente al más antiguo, con:

- Número oficial.
- Fecha.
- Acción “Ver resultados”.
- Paginación.
- Filtro por año si lo soporta la API.
- Búsqueda por número solo si se puede implementar de forma consistente con el backend.

En escritorio puede usarse una tabla ligera. En móvil, convertirla en tarjetas o lista adaptada; no forzar una tabla ancha para la información esencial. No cargar todo el historial de una vez.

Estados:

- Cargando: skeletons o indicador discreto.
- Sin resultados: explicación y enlace a Inicio.
- Error: mensaje y opción de reintentar.
- Filtro sin coincidencias: opción para limpiar el filtro.

# 8. Detalle de un sorteo

Ruta: `/sorteos/:drawNumber`.

Mostrar:

- Título “Sorteo N.º [número]”.
- Fecha.
- Cuatro bloques, uno por modalidad.
- Seis bolillas grandes por modalidad.
- Enlace al sorteo anterior/siguiente si puede determinarse de forma fiable.
- Enlace para volver al historial.
- Título de página y metadatos útiles para compartir/buscadores.

No mostrar premios, ganadores o montos que la API no provea expresamente.

# 9. Área administrativa

El área administrativa es parte del producto, pero está separada del sitio público. El alcance inicial contempla un único administrador y no incluye registro público. La autenticación/autorización real corresponde al backend; ocultar botones no reemplaza protección del servidor.

## Login — `/admin/login`

- Identidad del sitio y título “Acceso administrativo”.
- Email y contraseña.
- Opción para mostrar/ocultar contraseña.
- Botón “Iniciar sesión”.
- Validaciones claras y estado de carga.
- Mensaje genérico para credenciales incorrectas, sin revelar si un email existe.
- Diseño responsive y accesible.

No guardar contraseñas en almacenamiento local ni persistir tokens de sesión en `localStorage`. Usar el mecanismo de sesión acordado con el backend, preferentemente cookie segura administrada por el servidor. Ante sesión expirada, explicar la situación y permitir volver a autenticarse.

## Panel — `/admin`

Diseño sobrio y orientado a tareas, con navegación lateral en escritorio y compacta en móvil.

Secciones:

- Resumen.
- Sorteos.
- Importaciones.
- Cerrar sesión.

Resumen posible:

- Último sorteo registrado.
- Cantidad de sorteos, solo si existe un endpoint fiable.
- Estado de la última importación, si está disponible.
- Acciones rápidas “Cargar sorteo” e “Importar historial”.

No crear métricas decorativas sin datos reales.

## Gestión — `/admin/sorteos`

- Lista de sorteos con número, fecha y acciones.
- Botón “Nuevo sorteo”.
- Acciones editar y eliminar.
- Paginación si corresponde.
- Confirmación explícita antes de eliminar.
- Actualizar la lista solo después de confirmar el éxito de la API.

## Crear/editar sorteo

Formulario con:

- Número oficial.
- Fecha.
- Cuatro secciones de modalidad.
- Seis campos numéricos por modalidad.
- Validación de valores faltantes, repetidos o fuera de rango.
- Números presentados con dos dígitos.
- Acciones Guardar y Cancelar.
- Aviso antes de abandonar si hay cambios sin guardar.

La creación exige las cuatro modalidades completas. Al editar resultados, respetar el contrato del backend, que puede exigir enviar el conjunto completo. Asociar errores de API a campos cuando sea posible. No confiar solo en validaciones del frontend.

## Eliminar sorteo

Mostrar diálogo con el número oficial y explicar qué registro se eliminará. Requerir confirmación explícita. No ejecutar la acción con un clic accidental.

## Importación — `/admin/importaciones/nueva`

Diseñar un flujo claro de cinco pasos:

1. Seleccionar CSV/XLSX según los formatos admitidos y mostrar tamaño/columnas esperadas.
2. Analizar el archivo mediante la API.
3. Revisar filas válidas, inválidas, advertencias y duplicados.
4. Confirmar explícitamente la importación y la política de duplicados.
5. Mostrar resultado: insertados, omitidos, actualizados si se permite, fallidos y enlace al detalle.

La vista previa no equivale a haber importado. No permitir confirmar una importación que el backend declare no apta. Mostrar errores por número de fila y permitir corregir el archivo original. Si el proceso informa resultados parciales, reflejar exactamente ese estado.

## Historial de importaciones — `/admin/importaciones`

Mostrar fecha/hora, referencia segura del archivo, tipo, estado, conteos y acceso al detalle. No mostrar rutas físicas, secretos ni contenido completo innecesario.

# 10. Integración con la API

El frontend consume la API REST existente. No accede directamente a la base de datos ni duplica reglas de negocio.

Configurar la URL base mediante variable de entorno compatible con el framework; no fijar la URL de producción dentro de componentes.

Endpoints públicos previstos:

- `GET /api/draws/latest`
- `GET /api/draws/recent?limit=5&offset=0`
- `GET /api/draws/:drawNumber`
- `GET /api/draws?page=1&limit=20&year=2026`
- `POST /api/search/exact`

Endpoints administrativos previstos:

- `POST /api/admin/auth/login`
- `GET /api/admin/auth/me`
- `POST /api/admin/auth/logout`
- `POST /api/admin/auth/change-password`
- `POST /api/admin/draws`
- `PATCH /api/admin/draws/:id`
- `DELETE /api/admin/draws/:id`
- `POST /api/admin/import/preview`
- `POST /api/admin/import/commit`
- `GET /api/admin/imports?page=1&limit=20`
- `GET /api/admin/imports/:id`

Confirmar nombres de propiedades, cuerpos y respuestas con Swagger/OpenAPI del backend. No inventar contratos incompatibles.

Reglas de integración:

- Centralizar llamadas HTTP en un cliente/capa de servicios.
- Definir tipos de solicitudes y respuestas.
- Manejar carga, éxito, vacío y error.
- Evitar solicitudes duplicadas.
- No incluir secretos en variables públicas.
- Para sesiones cookie, usar credenciales cuando corresponda y coordinarlo con CORS/CSRF.
- No almacenar tokens de sesión en `localStorage`.
- Manejar `401` y `403` consistentemente.
- No mostrar errores internos al visitante.

Si la API aún no existe, usar mocks/fixtures claramente aislados y sustituibles. No presentarlos como resultados oficiales. La interfaz debe poder conectarse a la API real sin rehacer los componentes.

# 11. Estados visuales obligatorios

Cada pantalla relevante debe contemplar:

- Cargando: skeletons o indicador sin saltos bruscos.
- Éxito: datos claros.
- Vacío: explicación y siguiente acción.
- Error: mensaje entendible y reintento cuando corresponda.
- Validación: error junto al campo.
- Deshabilitado: apariencia evidente.
- API no disponible: pantalla estable, sin inventar datos.
- Sesión expirada: explicación y acceso al login.
- Cambios pendientes: aviso antes de descartar.
- Confirmación destructiva: diálogo accesible.

No resolver todos los errores con `alert()` del navegador. Usar mensajes inline, banners o diálogos consistentes.

# 12. Responsive design

Diseñar primero para móvil.

**Móvil**

- Navegación compacta y contenido de una columna.
- Botones con área táctil cómoda.
- Búsqueda fácil de completar.
- Bolillas legibles sin zoom.
- Historial como tarjetas/listas.
- Publicidad en el flujo, sin cubrir contenido.
- Formularios administrativos utilizables con teclado móvil.

**Tablet**

- Dos columnas cuando ayude a comparar modalidades o separar contenido/publicidad.
- No comprimir las bolillas.

**Escritorio**

- Contenedor centrado de ancho máximo aproximado 1120–1240 px.
- Espaciado suficiente, sin vacío excesivo.
- Columna publicitaria opcional si no afecta la tarea principal.
- Navegación lateral administrativa y tablas legibles.

Los breakpoints deben responder al contenido, no solo a modelos de dispositivos.

# 13. Accesibilidad

- Estructura semántica de encabezados.
- Etiquetas asociadas a todos los campos.
- Navegación completa por teclado.
- Contraste idealmente WCAG AA.
- Foco visible.
- Botones para acciones y enlaces para navegación.
- No depender solo del color.
- Nombres accesibles para iconos funcionales.
- Respetar `prefers-reduced-motion`.
- Mensajes de error anunciables por tecnologías de asistencia.
- No retrasar acciones frecuentes con animaciones.

# 14. SEO y rendimiento

Para páginas públicas:

- Título y descripción propios por página.
- Títulos descriptivos, por ejemplo “Resultados del sorteo N.º X — Quini 6 Estadísticas”.
- URLs estables y legibles.
- No indexar rutas administrativas como contenido público.
- No inventar datos estructurados, premios ni resultados.
- Optimizar fuentes, iconos y recursos.
- Evitar dependencias pesadas innecesarias.
- Paginación en historiales grandes.
- Si el framework permite SSR/prerenderizado, evaluarlo según la naturaleza dinámica de los datos sin comprometer la integración con la API.

# 15. Componentes reutilizables sugeridos

Adaptar nombres y estructura al framework:

- `PublicHeader`, `PublicFooter`
- `AdSlot`
- `DrawSummary`
- `ModalityResult`
- `NumberBall`
- `RecentDrawList`
- `DrawHistoryTable` o `DrawHistoryList`
- `CombinationSearchForm`
- `SearchMatchCard`
- `Pagination`
- `LoadingState`, `EmptyState`, `ErrorState`
- `AdminLayout`, `AdminSidebar`
- `AdminLoginForm`
- `DrawForm`
- `ImportUpload`
- `ImportPreviewTable`
- `ImportStatusBadge`
- `ConfirmDialog`
- Sistema accesible de notificaciones

No es obligatorio usar exactamente estos nombres. Evitar duplicar UI y lógica en distintas páginas.

# 16. Tono y microcopy

Usar español natural de Argentina, con voseo cuando corresponda, sin exagerar el tono coloquial.

Textos sugeridos:

- “Resultados y estadísticas del Quini 6”
- “Último sorteo”
- “Sorteos anteriores”
- “Ver todo el historial”
- “Buscá tu combinación”
- “Ingresá seis números del 00 al 45”
- “Buscar combinación”
- “Limpiar”
- “Se encontraron N coincidencias exactas”
- “No encontramos esta combinación en el historial disponible”
- “No pudimos cargar los resultados. Intentá nuevamente”
- “Ver resultados”
- “Acceso administrativo”
- “Guardar sorteo”
- “Vista previa de importación”
- “Confirmar importación”

Evitar “¡Estos números pueden hacerte ganar!”, “ganancia asegurada” y otras afirmaciones predictivas.

# 17. Criterios de aceptación del frontend

1. La home presenta el último sorteo y las cuatro modalidades.
2. Cada modalidad muestra seis números legibles, con dos dígitos.
3. Se muestran hasta cinco sorteos anteriores sin duplicar el último.
4. Se puede abrir el historial y el detalle de cada sorteo.
5. La búsqueda acepta seis números válidos, rechaza repetidos y admite cualquier orden de entrada.
6. Las coincidencias muestran sorteo, fecha y modalidad, y son exactas.
7. Todas las pantallas importantes tienen estados de carga, error, vacío y validación.
8. Los espacios publicitarios no interrumpen la tarea principal.
9. El área administrativa está separada y usa autenticación del backend.
10. Login, formularios e importación reflejan los estados reales de la API.
11. No hay datos ficticios visibles como oficiales en producción.
12. Funciona en móvil, tablet y escritorio.
13. Los controles son accesibles y tienen etiquetas.
14. Las llamadas a la API están centralizadas y configurables.
15. No se exponen secretos ni tokens de sesión en el frontend.
16. La interfaz está en español de Argentina.
17. No se agregan funciones que la API no respalda.

# 18. Prompt inicial para Kombai

Copiar este bloque junto con el documento:

> Actuá como diseñador UI/UX y desarrollador frontend senior. Leé la definición funcional y visual completa antes de generar la interfaz.
>
> Creá el frontend del sitio de estadísticas del Quini 6 con apariencia moderna, sobria, clara y responsive. Priorizá el último sorteo, las cuatro modalidades y la búsqueda de coincidencias exactas.
>
> Respetá la identidad visual, jerarquía de páginas, reglas de formularios, estados de carga/error/vacío, accesibilidad e integración con la API descritas aquí.
>
> No inventes resultados oficiales, no agregues predicciones ni funciones de apuestas y no conviertas la home en un dashboard administrativo. Mantené el área administrativa separada y protegida por el backend.
>
> Antes de implementar, inspeccioná el proyecto existente y confirmá qué framework, librerías, rutas y convenciones ya utiliza. No reemplaces tecnologías ni borres archivos sin justificarlo.
>
> Si la API aún no está disponible, usá datos mock claramente aislados y fáciles de sustituir; nunca los presentes como resultados reales. Centralizá el cliente de API y hacé configurable su URL base.
>
> Si un contrato de API no está definido, registrá la duda en lugar de inventar una respuesta incompatible. Priorizá la experiencia móvil y la facilidad para ingresar seis números.
>
> Esta definición establece qué debe ser el sitio y cómo debe comportarse. El plan incremental de implementación se seguirá por separado; no implementes el backend ni alteres su alcance desde el frontend.
