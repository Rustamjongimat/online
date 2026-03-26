import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// Admin credentials — fallback values used if env vars are not set
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@onlineacademy.uz';
// Hash of: Admin2024!
const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH ||
  '$2b$12$acSHc0kWuLTPFbdFHOehV.hIqOLaDPRpeAq/BuaAJGy1osVio7dAO';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        if (credentials.email !== ADMIN_EMAIL) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          ADMIN_PASSWORD_HASH
        );
        if (!isValid) return null;

        return {
          id: '1',
          email: ADMIN_EMAIL,
          name: 'Admin',
        };
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as { id?: string }).id = token.id as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'online_academy_secret_rustamjon_qtwadkdx_2024',
};
