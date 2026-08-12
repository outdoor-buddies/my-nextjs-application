import NextAuth, { type DefaultSession } from 'next-auth';
import 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcrypt';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      role?: string;
      profileId?: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    id?: string;
    role?: string;
    profileId?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    profileId?: string | null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { profile: true },
        });

        if (!user) return null;

        const isPasswordValid = await compare(credentials.password as string, user.password);
        if (!isPasswordValid) return null;

        const profileId = user.profile ? String(user.profile.id) : null;

        return {
          id: user.id.toString(),
          email: user.email,
          role: user.role,
          profileId: profileId,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.profileId = user.profileId;
      }

    if (token.id) {
      const parsedUserId = parseInt(token.id, 10);

      if (!isNaN(parsedUserId)) {
        const dbProfile = await prisma.profile.findFirst({
          where: { userId: parsedUserId },
          select: { id: true },
        });

        token.profileId = dbProfile ? String(dbProfile.id) : null;
      }
    }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.profileId = token.profileId ? String(token.profileId) : null;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
