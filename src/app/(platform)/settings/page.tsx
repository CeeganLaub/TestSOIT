import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  User,
  Building,
  Palette,
  Shield,
  Bell,
  CreditCard,
  Link2,
  Users,
  FileText,
  ChevronRight,
} from 'lucide-react';

const settingsSections = [
  {
    title: 'Profile',
    description: 'Manage your personal information',
    href: '/settings/profile',
    icon: User,
  },
  {
    title: 'Organization',
    description: 'Firm details, branding, and preferences',
    href: '/settings/organization',
    icon: Building,
  },
  {
    title: 'Branding',
    description: 'Customize colors, logo, and landing pages',
    href: '/settings/branding',
    icon: Palette,
  },
  {
    title: 'Team Members',
    description: 'Manage attorneys, staff, and permissions',
    href: '/settings/team',
    icon: Users,
  },
  {
    title: 'Security',
    description: 'Two-factor auth, sessions, and passwords',
    href: '/settings/security',
    icon: Shield,
  },
  {
    title: 'Notifications',
    description: 'Email, SMS, and push notification settings',
    href: '/settings/notifications',
    icon: Bell,
  },
  {
    title: 'Billing & Subscription',
    description: 'Plans, payment methods, and invoices',
    href: '/settings/billing',
    icon: CreditCard,
  },
  {
    title: 'Integrations',
    description: 'Connect with Clio, Stripe, DocuSign, and more',
    href: '/settings/integrations',
    icon: Link2,
  },
  {
    title: 'Templates',
    description: 'Email, document, and intake form templates',
    href: '/settings/templates',
    icon: FileText,
  },
];

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      organizations: {
        include: { organization: true },
      },
    },
  });

  if (!user) redirect('/login');

  const orgUser = user.organizations[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500">Manage your account and organization settings</p>
      </div>

      {/* User Overview */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-law-navy text-white flex items-center justify-center text-xl font-bold">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-500">{user.email}</p>
              {orgUser && (
                <p className="text-sm text-gray-400">
                  {orgUser.role} at {orgUser.organization.name}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      <div className="grid gap-4">
        {settingsSections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <section.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{section.title}</h3>
                    <p className="text-sm text-gray-500">{section.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
