# 🚀 Next.js App con NextAuth

Proyecto configurado con Next.js 16, Tailwind CSS v4, NextAuth v5, React Query y más.

## 📦 Instalación

```bash
npm install
```

## 🔐 Configuración de NextAuth

1. **Generar AUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```
   Copia el resultado y pégalo en `.env.local` como `AUTH_SECRET`

2. **Configurar variables de entorno:**
   Edita el archivo `.env.local` y actualiza:
   ```env
   AUTH_SECRET=tu-secreto-generado-aqui
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Credenciales de prueba:**
   - Email: `demo@example.com`
   - Password: `demo123`

## 🎯 Características

- ✅ **NextAuth v5** - Autenticación moderna
- ✅ **Credentials Provider** - Login con email/contraseña
- ✅ **OAuth ready** - Preparado para GitHub y Google
- ✅ **Protected Routes** - Middleware para rutas protegidas
- ✅ **Theme Support** - Modo claro/oscuro con Tailwind v4
- ✅ **Session Management** - Gestión de sesiones con JWT
- ✅ **TypeScript** - Tipado completo

## 🚦 Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

## 📁 Estructura de autenticación

```
app/
├── auth/
│   └── signin/
│       └── page.tsx          # Página de login
├── dashboard/
│   └── page.tsx              # Dashboard protegido
└── api/
    └── auth/
        └── [...nextauth]/
            └── route.ts      # API de NextAuth

components/
├── SignOutButton.tsx         # Botón de cerrar sesión
└── UserInfo.tsx              # Info del usuario

lib/
└── auth.ts                   # Configuración de NextAuth

middleware.ts                 # Protección de rutas
```

## 🔒 Rutas

- `/` - Página principal (pública)
- `/auth/signin` - Login (pública)
- `/dashboard` - Dashboard (protegida)

## 🎨 Añadir proveedores OAuth

### GitHub OAuth

1. Ve a https://github.com/settings/developers
2. Crea una nueva OAuth App
3. Agrega las credenciales a `.env.local`:
   ```env
   AUTH_GITHUB_ID=tu_client_id
   AUTH_GITHUB_SECRET=tu_client_secret
   ```
4. Descomenta el provider en `lib/auth.ts`

### Google OAuth

1. Ve a https://console.cloud.google.com/
2. Crea un nuevo proyecto y configura OAuth
3. Agrega las credenciales a `.env.local`:
   ```env
   AUTH_GOOGLE_ID=tu_client_id
   AUTH_GOOGLE_SECRET=tu_client_secret
   ```
4. Descomenta el provider en `lib/auth.ts`

## 💡 Uso en componentes

### Client Components
```tsx
'use client';
import { useSession } from 'next-auth/react';

export default function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <div>Cargando...</div>;
  if (!session) return <div>No autenticado</div>;
  
  return <div>Hola {session.user?.name}</div>;
}
```

### Server Components
```tsx
import { auth } from '@/lib/auth';

export default async function MyServerComponent() {
  const session = await auth();
  
  if (!session) {
    return <div>No autenticado</div>;
  }
  
  return <div>Hola {session.user?.name}</div>;
}
```

## 📚 Recursos

- [NextAuth v5 Docs](https://authjs.dev/)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/)

---

Desarrollado con ❤️ usando Next.js y NextAuth
