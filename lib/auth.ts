import { refreshAccessTokenServer } from '@/hooks/useRefreshToken.server';
import api from '@/services/config';
import NextAuth from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';

// Función para decodificar el JWT del backend y obtener el tiempo de expiración
function decodeJWT(token: string): { exp: number } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// Función para verificar si el accessToken del backend está por vencer (menos de 5 minutos)
function isAccessTokenExpiringSoon(accessToken: string): boolean {
  const decoded = decodeJWT(accessToken);
  if (!decoded || !decoded.exp) {
    return true; // Si no se puede decodificar, asumir que está vencido
  }

  const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
  const timeUntilExpiry = decoded.exp - currentTime;
  const fiveMinutes = 5 * 60; // 5 minutos en segundos

  return timeUntilExpiry < fiveMinutes;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      role?: string
      estado?: string
      accessToken: string
    } | null
  }
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    // Proveedor de credenciales (usuario/contraseña)
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'tu@email.com' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = credentials;
          const { data } = await api.post('/auth/login', { email, password });
          if (!data || !data.user || !data.accessToken) {
            return null;
          }
          return {
            accessToken: data.accessToken,
            ...data.user
          };
        } catch (_error) {
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Retorna true si el usuario está autenticado
      return !!auth;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const userComplete = user as AdapterUser & {
          name: string
          email: string
          image: string
          estado: string
          role: string
          accessToken: string
        };
        token.id = userComplete.id;
        token.email = userComplete.email;
        token.name = userComplete.name;
        token.image = userComplete.image;
        token.estado = userComplete.estado;
        token.role = userComplete.role;
        token.accessToken = userComplete.accessToken;
      }
      // Verificar si el accessToken del backend está por vencer y refrescarlo
      if (token.accessToken && typeof token.accessToken === 'string') {
        if (isAccessTokenExpiringSoon(token.accessToken)) {
          console.log('AccessToken expiring soon, refreshing...');
          const newAccessToken = await refreshAccessTokenServer({ accessToken: token.accessToken });
          if (newAccessToken) {
            token.accessToken = newAccessToken;
            console.log('AccessToken refreshed successfully');
          } else {
            console.error('Failed to refresh accessToken');
          }
        }
      }

      if (trigger === 'update' && session.user) {
        try {
          token.accessToken = session.user.accessToken;
        } catch (error) {
          return token;
        }
      }
      return token;
    },
    session(params) {
      const { session, token } = params;
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        session.user.estado = token.estado as string;
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 // 1 día
  },
  trustHost: true // Importante para producción (Vercel, etc.)
});
