Actúa como un Arquitecto de Software Senior experto en React, TypeScript y Tailwind CSS.
Tu objetivo es generar el código base y la estructura inicial de un proyecto frontend para
una aplicación de Facturación Electrónica orientada a microservicios.

El proyecto debe ser desarrollado por un único programador, buscando un equilibrio entre
código limpio, escalabilidad y simplicidad.

---

## 🛠️ REQUISITOS TÉCNICOS OBLIGATORIOS

- Lenguaje: TypeScript (.ts / .tsx) estricto. Sin `any` implícito. `"strict": true` en tsconfig.
- Estilos: Tailwind CSS v3.
- Gestión de Estado: Zustand v4.
- Formularios y Validación: React Hook Form + Zod.
- Peticiones HTTP: Axios + TanStack Query v5 (React Query).
- Enrutado: React Router DOM v6 con `createBrowserRouter` (Data Router).
- Helper de Clases: `clsx` + `tailwind-merge` combinados en una función utilitaria `cn()`.
- Íconos: Lucide React.

NO instales dependencias ni ejecutes comandos. Solo genera archivos con código real.

---

## 📂 ESTRUCTURA DE CARPETAS

Genera EXACTAMENTE esta estructura dentro de `src/`:

src/
├── app/
│ ├── App.tsx # Componente raíz que monta Providers
│ ├── Providers.tsx # QueryClientProvider + RouterProvider
│ └── router.tsx # Rutas con createBrowserRouter
├── assets/
│ └── styles/
│ └── index.css # @tailwind base / components / utilities
├── components/
│ ├── ui/
│ │ └── cn.ts # Función utilitaria cn() con clsx + twMerge
│ ├── Button.tsx
│ ├── Input.tsx
│ ├── Table.tsx
│ └── Modal.tsx
├── features/
│ ├── auth/
│ │ ├── components/
│ │ │ └── LoginForm.tsx # Formulario con React Hook Form + Zod
│ │ ├── hooks/
│ │ │ └── useLogin.ts # Mutación con TanStack Query
│ │ ├── services/
│ │ │ └── authService.ts # Llamada Axios al microservicio de auth
│ │ ├── types/
│ │ │ └── auth.types.ts # Interfaces: User, LoginPayload, AuthResponse
│ │ └── authStore.ts # Zustand: user, token, isAuthenticated
│ └── billing/
│ ├── components/
│ │ └── InvoiceForm.tsx
│ ├── hooks/
│ │ ├── useCreateInvoice.ts
│ │ └── useGetInvoices.ts
│ ├── services/
│ │ └── billingService.ts
│ ├── types/
│ │ └── billing.types.ts
│ └── billingStore.ts
├── layouts/
│ ├── AuthLayout.tsx # Layout sin sidebar (login, registro)
│ ├── MainLayout.tsx # Layout con Sidebar + Navbar + <Outlet />
│ ├── Sidebar.tsx
│ └── Navbar.tsx
├── pages/
│ ├── LoginPage.tsx
│ ├── HomePage.tsx
│ └── billing/
│ └── InvoicesPage.tsx
└── shared/
├── lib/
│ └── axiosClient.ts # Instancia base de Axios con interceptores JWT
├── hooks/
│ └── useDebounce.ts
└── utils/
├── formatCurrency.ts
└── formatDate.ts

---

## 🎯 ENTREGABLES — CÓDIGO REAL REQUERIDO

Escribe el código completo, tipado y funcional para cada uno de estos archivos.
No uses placeholders vacíos. Cada archivo debe ser un stub bien tipado y listo para extender.

---

### 1. `src/components/ui/cn.ts`

Función utilitaria `cn(...inputs)` que combina `clsx` y `twMerge`.
Exportación nombrada. Comentario breve explicando su propósito.

---

### 2. `src/components/Button.tsx`

Componente reutilizable con:

- Props tipadas extendiendo `React.ButtonHTMLAttributes<HTMLButtonElement>`
- Variantes: `variant: 'primary' | 'secondary' | 'danger' | 'ghost'`
- Tamaños: `size: 'sm' | 'md' | 'lg'`
- Estado `isLoading` que muestra un spinner y deshabilita el botón
- Usa `cn()` para combinar clases dinámicamente
- `React.forwardRef` para acceso al DOM

---

### 3. `src/components/Input.tsx`

Componente reutilizable con:

- Props extendiendo `React.InputHTMLAttributes<HTMLInputElement>`
- Props adicionales: `label?: string`, `error?: string`, `helperText?: string`
- Renderiza el label, el input y el mensaje de error/helper con estilos Tailwind
- Compatible con `register()` de React Hook Form mediante `React.forwardRef`
- Usa `cn()` para aplicar estilos de error condicionalmente

---

### 4. `src/shared/lib/axiosClient.ts`

Instancia de Axios configurada con:

- `baseURL` desde `import.meta.env.VITE_API_URL`
- Interceptor de **request**: adjunta `Authorization: Bearer <token>` leyendo
  el token directamente desde el store de Zustand (`authStore`) — sin hooks,
  usando `authStore.getState().token`
- Interceptor de **response**: captura errores 401 y llama a `authStore.getState().logout()`
  para limpiar la sesión; re-lanza el error para que React Query lo propague

---

### 5. `src/features/auth/authStore.ts`

Store de Zustand con interfaz TypeScript explícita:

```ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}
```

- Usa `create<AuthState>()(...)` con tipado completo
- La acción `login` persiste el token en `localStorage`
- La acción `logout` limpia el estado y remueve el token de `localStorage`
- Al inicializar el store, intenta rehidratar el token desde `localStorage`

---

### 6. `src/features/auth/types/auth.types.ts`

Define y exporta las siguientes interfaces:

- `User`: `id`, `name`, `email`, `role`
- `LoginPayload`: `email`, `password`
- `AuthResponse`: `user`, `token`
- `LoginFormValues`: schema de Zod para el formulario (exporta también el tipo inferido)

---

### 7. `src/features/auth/services/authService.ts`

Función async `loginUser(payload: LoginPayload): Promise<AuthResponse>`:

- Importa la instancia de `axiosClient`
- Hace POST a `/auth/login`
- Retorna los datos tipados

---

### 8. `src/features/auth/hooks/useLogin.ts`

Hook personalizado usando `useMutation` de TanStack Query v5:

- Llama a `loginUser` del servicio
- En `onSuccess`: llama a `authStore.getState().login(user, token)` y redirige
  a `/home` usando `useNavigate`
- En `onError`: expone el mensaje de error para mostrarlo en el formulario
- Exporta: `{ mutate: login, isPending, error }`

---

### 9. `src/features/auth/components/LoginForm.tsx`

Formulario completo con React Hook Form + Zod:

- Usa `zodResolver` con el schema de `LoginFormValues`
- Campos: `email` y `password` usando el componente `<Input />` con `register()`
- Botón de submit usando `<Button />` con `isLoading={isPending}`
- Muestra error general de autenticación si `useLogin` retorna error
- Sin estilos de layout (eso lo maneja `LoginPage`)

---

### 10. `src/layouts/AuthLayout.tsx`

Layout minimalista para pantallas de autenticación:

- Centra el contenido vertical y horizontalmente
- Fondo neutro con Tailwind
- Renderiza `<Outlet />` de React Router

---

### 11. `src/pages/LoginPage.tsx`

Vista que:

- Renderiza `<LoginForm />`
- Incluye el título de la aplicación y un subtítulo descriptivo
- Usa el `<AuthLayout />` o asume que la ruta ya lo envuelve

---

### 12. `src/app/router.tsx`

Define las rutas con `createBrowserRouter`:
/ → Redirige a /home si autenticado, sino a /login
/login → AuthLayout > LoginPage
/ → MainLayout (protegida por ProtectedRoute)
/home → HomePage
/invoices → InvoicesPage

Incluye un componente `ProtectedRoute.tsx` que por ahora verifica
`isAuthenticated` del authStore y redirige a `/login` si es `false`.

---

### 13. `src/features/billing/types/billing.types.ts`

Define:

- `Invoice`: `id`, `number`, `clientName`, `total`, `status`, `createdAt`
- `CreateInvoicePayload`: campos para crear una factura
- `InvoiceStatus`: union type `'draft' | 'sent' | 'paid' | 'cancelled'`

---

### 14. `src/features/billing/services/billingService.ts`

Dos funciones async:

- `getInvoices(): Promise<Invoice[]>` — GET `/billing/invoices`
- `createInvoice(payload: CreateInvoicePayload): Promise<Invoice>` — POST `/billing/invoices`

---

### 15. `src/features/billing/hooks/useGetInvoices.ts` y `useCreateInvoice.ts`

- `useGetInvoices`: usa `useQuery` con `queryKey: ['invoices']`
- `useCreateInvoice`: usa `useMutation`, invalida `['invoices']` en `onSuccess`
  usando `useQueryClient`

---

### 16. Archivos de configuración raíz

**`vite.config.ts`**: alias `@/` → `./src/`
**`tsconfig.json`**: `"strict": true`, `paths` para `@/*`
**`tailwind.config.ts`**: `content: ['./index.html', './src/**/*.{ts,tsx}']`
**`.env.example`**:

VITE_API_URL=http://localhost:3000/api

---

## 📄 README.md

Genera un README.md completo en la raíz del proyecto con las siguientes secciones:

### 1. Descripción del proyecto

Qué es la aplicación y su propósito funcional.

### 2. Stack tecnológico

Tabla con tecnología y versión.

### 3. Arquitectura Feature-Driven

Explica:

- Por qué se eligió este enfoque sobre una arquitectura por tipo de archivo
- Qué contiene cada carpeta y cuál es su responsabilidad
- La regla de dependencias: `pages` → `features` → `shared` (nunca al revés)

### 4. Desacoplamiento con Microservicios

Explica:

- Cómo cada `feature/*/services/` mapea a un microservicio independiente
- Por qué el `axiosClient` centraliza la autenticación sin que cada servicio lo repita
- Cómo agregar un nuevo microservicio (checklist de 5 pasos)

### 5. Flujo de Datos

Describe el flujo:
`Componente UI` → `Hook (React Query)` → `Service (Axios)` → `API`
`API` → `Service` → `Hook` → `Zustand Store` → `Componente UI`

### 6. Convenciones de código

- Naming de archivos y carpetas
- Regla de exports (named vs default)
- Barrel files (`index.ts`) y cuándo usarlos

### 7. Variables de entorno

Qué configurar antes de correr el proyecto.

### 8. Cómo correr el proyecto

```bash
npm install
npm run dev
```

---

## ✅ CHECKLIST DE ENTREGABLES

Al finalizar, confirma que generaste:

- [ ] Todos los archivos de la estructura de carpetas
- [ ] `cn.ts`, `Button.tsx`, `Input.tsx` con tipado completo
- [ ] `axiosClient.ts` con interceptores JWT
- [ ] `authStore.ts` con rehidratación desde localStorage
- [ ] `auth.types.ts` con schema Zod incluido
- [ ] `authService.ts` y `useLogin.ts` funcionales
- [ ] `LoginForm.tsx` con React Hook Form + Zod
- [ ] `AuthLayout.tsx` y `LoginPage.tsx`
- [ ] `router.tsx` con `ProtectedRoute`
- [ ] Módulo `billing` con types, service y hooks
- [ ] Archivos de configuración: `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `.env.example`
- [ ] `README.md` con arquitectura documentada para evaluador académico

Proporciona el código limpio, modular, con comentarios concisos donde aporten valor,
y listo para servir de guía al resto del proyecto.
