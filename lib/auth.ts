import NextAuth from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
// import GitHub from 'next-auth/providers/github';
// import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email?: string | null
      firstName?: string | null
      lastName?: string | null
      role?: string
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
        // IMPORTANTE: Aquí debes validar contra tu base de datos
        // Este es solo un ejemplo para demostración
        if (credentials?.email === 'demo@example.com' && credentials.password === 'demo123') {
          return { id: '1', email: 'demo@example.com', firstName: 'John', lastName: 'Doe', role: 'admin'};
        }
        return null;
      }
    }),
    
    // Descomentar cuando tengas las credenciales de GitHub
    // GitHub({
    //   clientId: process.env.AUTH_GITHUB_ID!,
    //   clientSecret: process.env.AUTH_GITHUB_SECRET!
    // }),
    
    // Descomentar cuando tengas las credenciales de Google
    // Google({
    //   clientId: process.env.AUTH_GOOGLE_ID!,
    //   clientSecret: process.env.AUTH_GOOGLE_SECRET!
    // })
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
          firstName?: string | null
          lastName?: string | null
          role?: string
        };
        token.id = user.id;
        token.firstName = userComplete.firstName;
        token.lastName = userComplete.lastName;
        token.role = userComplete.role;
      }

      return token;
    },
    session(params) {
      const { session, token } = params;
        if (session.user && token.id) {
          session.user.id = token.id as string;
          session.user.firstName = token.firstName as string;
          session.user.lastName = token.lastName as string;
          session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt'
  },
  trustHost: true // Importante para producción (Vercel, etc.)
});
