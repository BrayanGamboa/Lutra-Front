# Lutra-Front

Frontend base para aplicación de facturación electrónica orientada a microservicios. Proyecto enfocado en un solo desarrollador, con estructura feature-driven, tipado estricto y piezas reutilizables para autenticación, consulta y creación de facturas.

## 1. Descripción del proyecto

Lutra-Front centraliza experiencia web de autenticación y operación de facturación electrónica. Su objetivo es ofrecer base clara para crecer por dominios, mantener integración limpia con microservicios y evitar acoplamiento entre UI, estado local y acceso HTTP.

## 2. Arquitectura Feature-Driven

Se eligió arquitectura feature-driven porque favorece crecimiento por dominio y no por tipo técnico. Para un solo programador reduce salto mental entre carpetas, concentra contratos, hooks, servicios y componentes de cada feature, y facilita migrar un dominio completo sin tocar resto de aplicación.

### Responsabilidad de carpetas

- `src/app/`: composición global, providers, rutas y guards.
- `src/assets/styles/`: entrada de estilos globales con Tailwind.
- `src/components/`: piezas UI reutilizables y agnósticas al dominio.
- `src/features/auth/`: login, store de sesión, tipos y servicio de autenticación.
- `src/features/billing/`: consultas, mutaciones, estado auxiliar y formularios de facturación.
- `src/layouts/`: shells visuales reutilizables para áreas pública y privada.
- `src/pages/`: vistas finales ensambladas desde features y layouts.
- `src/shared/`: utilidades transversales, cliente HTTP y hooks genéricos.

### Regla de dependencias

Flujo permitido: `pages` → `features` → `shared`.

- `pages` orquesta casos de uso y composición visual.
- `features` encapsula lógica de negocio por dominio.
- `shared` ofrece utilidades puras y piezas transversales.

Nunca al revés. `shared` no conoce features. `features` no depende de pages.

## 3. Desacoplamiento con Microservicios

Cada carpeta `feature/*/services/` representa frontera de integración con un microservicio independiente:

- `features/auth/services/` apunta a servicio de autenticación.
- `features/billing/services/` apunta a servicio de facturación.

`axiosClient` centraliza autenticación JWT, headers comunes y manejo global de `401`. Así cada servicio mantiene foco en endpoints y payloads, sin repetir interceptores ni lógica de sesión.

### Checklist para agregar nuevo microservicio

1. Crear `src/features/<feature>/types/` con contratos de request y response.
2. Crear `src/features/<feature>/services/` con funciones Axios enfocadas por endpoint.
3. Crear `src/features/<feature>/hooks/` para queries y mutations con TanStack Query.
4. Crear componentes o páginas que consuman hooks, nunca servicios directos.
5. Si requiere estado cliente, agregar store Zustand propia dentro de feature.

## 4. Flujo de Datos

Flujo principal:

`Componente UI` → `Hook (React Query)` → `Service (Axios)` → `API`

Retorno:

`API` → `Service` → `Hook` → `Zustand Store` → `Componente UI`

Este patrón separa renderizado, coordinación de estado remoto, acceso HTTP y persistencia de sesión. Resultado: cambios de endpoint o reglas de negocio quedan aislados.

## 5. Convenciones de código

### Naming

- Archivos y carpetas por feature en `camelCase` o `PascalCase` según tipo de artefacto.
- Componentes React y layouts en `PascalCase.tsx`.
- Hooks en `useX.ts`.
- Tipos por dominio en `*.types.ts`.

### Exports

- Preferencia por named exports para mejorar autocomplete, refactors y consistencia.
- Default exports solo si librería externa lo exige.

### Barrel files

- No usar `index.ts` al inicio del proyecto.
- Introducir barrel file solo cuando una carpeta exponga varios artefactos estables y el beneficio de importación supere riesgo de dependencias circulares.

## 6. Variables de entorno

Antes de correr proyecto, crea archivo `.env` basado en `.env.example` y define:

VITE_API_URL= URL_API

Esta URL debe apuntar al gateway o BFF que concentra microservicios backend.

## 8. Cómo correr el proyecto

```bash
npm i
npm run dev
```