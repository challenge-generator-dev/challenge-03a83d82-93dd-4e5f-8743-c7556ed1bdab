# Implementación de visualización de órdenes en tiempo real

El sistema de gestión de órdenes requiere la capacidad de publicar y consumir eventos en un topic Kafka para mostrar el estado de las órdenes en tiempo real. El sistema debe manejar la publicación de nuevos eventos y la actualización de la interfaz de usuario con los eventos recibidos. Los eventos contienen información sobre el estado de las órdenes, incluyendo detalles como el ID de la orden, el estado (pendiente, procesada, entregada) y la fecha de actualización. El sistema debe ser capaz de manejar volúmenes de eventos típicos y picos de tráfico, asegurando una latencia baja y una alta disponibilidad.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | Consumo de eventos en tiempo real con Kafka |
| **Nivel** | advanced-l2 |
| **Tipo** | practical |
| **Tiempo estimado** | 8 horas |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y entregará cada archivo con su ruta.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y entregará cada archivo con su ruta. Guárdalos en la carpeta donde quieras trabajar, respetando las rutas.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no entrega todos los archivos al terminar el análisis, escríbele: "entrégame todos los archivos con su ruta".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Configuración inicial del consumidor Kafka

**Objetivo:** Establecer una conexión con el topic Kafka y configurar el consumidor para recibir eventos.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- Configura el consumidor Kafka para conectarse al topic de órdenes.
- Implementa la lógica para recibir y procesar eventos del topic Kafka.

**Entregable:** Consumidor Kafka configurado y capaz de recibir eventos del topic de órdenes.

<details>
<summary>Pistas de conocimiento</summary>

- Considera la configuración necesaria para manejar diferentes tipos de eventos y volúmenes de tráfico.
- Piensa en cómo asegurar que el consumidor pueda manejar eventos fuera de orden o duplicados.

</details>

### Fase 2: Procesamiento y visualización de eventos

**Objetivo:** Implementar la lógica para procesar los eventos recibidos y actualizar la interfaz de usuario en tiempo real.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Desarrolla la lógica para procesar cada evento recibido y extraer la información relevante.
- Actualiza la interfaz de usuario con los datos de los eventos en tiempo real.

**Entregable:** Lógica implementada para procesar eventos y actualizar la interfaz de usuario con el estado de las órdenes en tiempo real.

<details>
<summary>Pistas de conocimiento</summary>

- Considera cómo manejar eventos que llegan desordenados o con retraso.
- Piensa en la mejor manera de actualizar la interfaz de usuario para reflejar los cambios en tiempo real sin causar parpadeo o latencia perceptible.

</details>

### Fase 3: Optimización y manejo de errores

**Objetivo:** Optimizar el rendimiento del consumidor Kafka y manejar posibles errores de forma efectiva.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Identifica y aplica optimizaciones para mejorar el rendimiento del consumidor Kafka.
- Implementa un manejo de errores robusto para asegurar la disponibilidad y fiabilidad del sistema.

**Entregable:** Consumidor Kafka optimizado con un manejo de errores robusto para asegurar la disponibilidad y fiabilidad del sistema.

<details>
<summary>Pistas de conocimiento</summary>

- Considera el uso de particiones y réplicas para mejorar la disponibilidad y el rendimiento.
- Piensa en cómo implementar un mecanismo de reintento para manejar errores transitorios.

</details>

## Dimensiones Evaluadas

- **queEs**: ¿Qué es un consumidor Kafka y cuál es su rol en este sistema?
- **comoSeUsa**: ¿Cómo se usa un consumidor Kafka para recibir y procesar eventos en tiempo real?
- **erroresComunes**: ¿Cuáles son los errores comunes que puede encontrar un consumidor Kafka y cómo se pueden manejar?
- **queDecisionesImplica**: ¿Qué decisiones de diseño implica la optimización del consumidor Kafka para manejar volúmenes de tráfico variables y errores transitorios?

## Criterios de Evaluacion

- Configuración correcta del consumidor Kafka para recibir eventos del topic de órdenes.
- Implementación de la lógica para procesar eventos y actualizar la interfaz de usuario en tiempo real.
- Optimización del rendimiento del consumidor Kafka y manejo robusto de errores.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT) si no tenes un agente en el IDE. Declara lo mismo que AGENTS.md; los archivos que te devuelva el chat los guardas en esta carpeta respetando las rutas.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | Apache Kafka |
| `client` | `client/` | chapter, support | client | Angular | Angular |
| `infra-local` | (raiz) | support | infra | Compose local | Apache Kafka |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd api && npm install && npm run build` — componente `api` (practice).
3. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `GET /orders/stream`
- `client` expone http (api: http://localhost:3000):
  - `GET /orders/stream`

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*
