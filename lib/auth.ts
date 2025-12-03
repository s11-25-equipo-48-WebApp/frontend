
import api from '@/services/config';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: string;
      estado?: string;
      organizations?: Array<{
        id: string;
        name: string;
        role: string;
      }>;
      accessToken: string;
    } | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    email?: string;
    name?: string;
    image?: string;
    role?: string;
    estado?: string;
    organizations?: Array<{
      id: string;
      name: string;
      role: string;
    }>;
    accessToken?: string;
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
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = credentials;
          const { data } = await api.post('/auth/login', { email, password });

          console.log('Login response:', {
            hasData: !!data,
            hasUser: !!data?.user,
            hasAccessToken: !!data?.accessToken,
            userFields: data?.user ? Object.keys(data.user) : [],
          });

          if (!data || !data.user || !data.accessToken) {
            console.error('Login failed: Missing data', { data });
            return null;
          }

          // WORKAROUND: Extraer rol de organizations si no existe a nivel de user
          const user = data.user;
          let roleFromUser = user.role;

          if (
            !roleFromUser &&
            user.organizations &&
            user.organizations.length > 0
          ) {
            // Si no hay role a nivel user, tomar el rol de la primera organización
            roleFromUser = user.organizations[0].role;
            console.log('Role extracted from organizations:', roleFromUser);
          }

          const userWithToken = {
            id: user.id,
            name: user.name,
            email: user.email,
            estado: user.estado,
            role: roleFromUser, // Rol extraído (ya sea del user o de organizations)
            organizations: user.organizations, // Mantener las organizaciones también
            accessToken: data.accessToken,
          };

          console.log('Authorized user:', {
            id: userWithToken.id,
            email: userWithToken.email,
            role: userWithToken.role,
            estado: userWithToken.estado,
            hasOrganizations: !!userWithToken.organizations?.length,
          });

          return userWithToken;
        } catch (_error) {
          console.error('Authorization error:', _error);
          return null;
        }
      },
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
      // PRIMERO: Si es un nuevo usuario (login), asignar todos los datos
      if (user) {
        console.log('JWT Callback - New user login:', {
          hasUser: !!user,
          userKeys: Object.keys(user),
        });

        token.id = user.id || (user as any).id;
        token.email = user.email || (user as any).email;
        token.name = user.name || (user as any).name;
        token.image = user.image || (user as any).image;
        token.estado = (user as any).estado;
        token.role = (user as any).role;
        token.organizations = (user as any).organizations;
        token.accessToken = (user as any).accessToken;

        console.log('JWT Callback - Token assigned:', {
          id: token.id,
          email: token.email,
          role: token.role,
          estado: token.estado,
          organizationsCount: token.organizations?.length || 0,
          hasAccessToken: !!token.accessToken,
        });
      }

      // SEGUNDO: Si hay update (por refresh), actualizar también
      if (trigger === 'update' && session?.user) {
        console.log('JWT Callback - Update trigger:', {
          updateFields: Object.keys(session.user),
        });

        token.id = session.user.id || token.id;
        token.email = session.user.email || token.email;
        token.name = session.user.name || token.name;
        token.image = session.user.image || token.image;
        token.estado = session.user.estado || token.estado;
        token.role = session.user.role || token.role;
        token.organizations = session.user.organizations || token.organizations;
        token.accessToken = session.user.accessToken || token.accessToken;
      }

      return token;
    },
    session(params) {
      const { session, token } = params;

      console.log('Session Callback - Token state:', {
        tokenId: token.id,
        tokenRole: token.role,
        tokenEmail: token.email,
        organizationsCount: token.organizations?.length || 0,
        hasAccessToken: !!token.accessToken,
      });

      if (session.user) {
        // Copiar todos los campos del token a la sesión
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        session.user.estado = token.estado as string;
        session.user.role = token.role as string;
        session.user.organizations = token.organizations as any;
        session.user.accessToken = token.accessToken as string;

        console.log('Session Callback - Session user:', {
          id: session.user.id,
          role: session.user.role,
          email: session.user.email,
          organizationsCount: session.user.organizations?.length || 0,
        });
      }

      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24, // 1 día
     updateAge: 60 * 60 * 20, // 20 horas 
  },
  trustHost: true, // Importante para producción (Vercel, etc.)
});
