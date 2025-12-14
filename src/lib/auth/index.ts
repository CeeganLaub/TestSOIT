import NextAuth from 'next-auth';
import { authConfig } from './config';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);

export { authConfig };

// Helper to get current session on server
export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

// Helper to require authentication
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

// Helper to get current organization context
export async function getCurrentOrganization(organizationId?: string) {
  const user = await requireAuth();

  if (!user.organizations?.length) {
    throw new Error('No organization found');
  }

  if (organizationId) {
    const org = user.organizations.find(
      (o: any) => o.organizationId === organizationId
    );
    if (!org) {
      throw new Error('Organization not found');
    }
    return org;
  }

  // Return first organization as default
  return user.organizations[0];
}
