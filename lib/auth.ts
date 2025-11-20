import api from '@/services/config';
import NextAuth from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      role?: string
      estado?: string
      accessToken: JWT
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
          const {data} = await api.post('/auth/login', { email, password });
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
    async jwt({ token, user }) {
      if (user) {
        const userComplete = user as AdapterUser & {
          name: string
          email: string
          image: string
          estado: string
          role: string
          accessToken: JWT
        };
        token.id = userComplete.id;
        token.email = userComplete.email;
        token.name = userComplete.name;
        token.image = userComplete.image;
        token.estado = userComplete.estado;
        token.role = userComplete.role;
        token.accessToken = userComplete.accessToken;
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
          session.user.accessToken = token.accessToken as JWT;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60  // 1 hora
  },
  trustHost: true // Importante para producción (Vercel, etc.)
});
