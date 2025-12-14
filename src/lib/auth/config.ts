import { PrismaAdapter } from '@auth/prisma-adapter';
import { type NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
    newUser: '/onboarding',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        twoFactorCode: { label: '2FA Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            organizations: {
              include: {
                organization: true,
              },
            },
          },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error('Account is temporarily locked. Please try again later.');
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValidPassword) {
          // Increment failed login attempts
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: { increment: 1 },
              lockedUntil:
                user.failedLoginAttempts >= 4
                  ? new Date(Date.now() + 15 * 60 * 1000) // Lock for 15 minutes
                  : null,
            },
          });
          throw new Error('Invalid credentials');
        }

        // Check 2FA if enabled
        if (user.twoFactorEnabled) {
          if (!credentials.twoFactorCode) {
            throw new Error('2FA_REQUIRED');
          }

          // Verify 2FA code (implementation in separate file)
          const { verifyTOTP } = await import('./two-factor');
          const isValidCode = verifyTOTP(
            user.twoFactorSecret!,
            credentials.twoFactorCode as string
          );

          if (!isValidCode) {
            throw new Error('Invalid 2FA code');
          }
        }

        // Reset failed login attempts and update last login
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`.trim() || user.email,
          image: user.avatar,
          firstName: user.firstName,
          lastName: user.lastName,
          organizations: user.organizations,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user && user.id) {
        token.id = user.id;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.organizations = (user as any).organizations;
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.organizations = token.organizations as any[];
      }
      return session;
    },
    async signIn({ user, account }) {
      // Allow OAuth sign-in
      if (account?.provider !== 'credentials') {
        return true;
      }
      return true;
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser) {
        // Send welcome email to new users
        // await sendWelcomeEmail(user.email);
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
};
