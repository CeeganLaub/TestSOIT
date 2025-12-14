import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Users,
  Briefcase,
  FileText,
  Calendar,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  Plus,
} from 'lucide-react';

async function getDashboardData(organizationId: string) {
  const [
    clientCount,
    activeCaseCount,
    pendingInvitations,
    upcomingAppointments,
    unreadMessages,
    recentDocuments,
    overdueInvoices,
    tasks,
  ] = await Promise.all([
    prisma.client.count({ where: { organizationId } }),
    prisma.case.count({ where: { organizationId, status: 'ACTIVE' } }),
    prisma.invitation.count({ where: { organizationId, status: 'PENDING' } }),
    prisma.appointment.findMany({
      where: {
        organizationId,
        startTime: { gte: new Date() },
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
      },
      take: 5,
      orderBy: { startTime: 'asc' },
      include: { client: true },
    }),
    prisma.message.count({
      where: { organizationId, isRead: false, isFromClient: true },
    }),
    prisma.document.findMany({
      where: { organizationId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { client: true, case: true },
    }),
    prisma.invoice.count({
      where: { organizationId, status: 'OVERDUE' },
    }),
    prisma.task.findMany({
      where: {
        organizationId,
        status: { in: ['TODO', 'IN_PROGRESS'] },
      },
      take: 5,
      orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
      include: { case: true },
    }),
  ]);

  return {
    clientCount,
    activeCaseCount,
    pendingInvitations,
    upcomingAppointments,
    unreadMessages,
    recentDocuments,
    overdueInvoices,
    tasks,
  };
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Get user's first organization
  const orgUser = await prisma.organizationUser.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  });

  if (!orgUser) {
    redirect('/onboarding');
  }

  const data = await getDashboardData(orgUser.organizationId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {session.user.name?.split(' ')[0]}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Here's what's happening with {orgUser.organization.name}
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link href="/clients/invite">
                  <Plus className="h-4 w-4 mr-2" />
                  Invite Client
                </Link>
              </Button>
              <Button asChild variant="navy">
                <Link href="/cases/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Case
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Clients</p>
                  <p className="text-2xl font-bold">{data.clientCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Briefcase className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active Cases</p>
                  <p className="text-2xl font-bold">{data.activeCaseCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Unread Messages</p>
                  <p className="text-2xl font-bold">{data.unreadMessages}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Overdue Invoices</p>
                  <p className="text-2xl font-bold">{data.overdueInvoices}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.upcomingAppointments.length === 0 ? (
                <p className="text-gray-500 text-sm">No upcoming appointments</p>
              ) : (
                <div className="space-y-4">
                  {data.upcomingAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-start gap-3">
                      <div className="p-2 bg-law-gold/10 rounded-lg">
                        <Clock className="h-4 w-4 text-law-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{apt.title}</p>
                        <p className="text-xs text-gray-500">
                          {apt.client.firstName} {apt.client.lastName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(apt.startTime).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button asChild variant="ghost" className="w-full mt-4">
                <Link href="/appointments">View All</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Priority Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.tasks.length === 0 ? (
                <p className="text-gray-500 text-sm">No pending tasks</p>
              ) : (
                <div className="space-y-3">
                  {data.tasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-gray-300"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{task.title}</p>
                        {task.case && (
                          <p className="text-xs text-gray-500">{task.case.title}</p>
                        )}
                        {task.dueDate && (
                          <p className="text-xs text-gray-400">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          task.priority === 'URGENT'
                            ? 'bg-red-100 text-red-700'
                            : task.priority === 'HIGH'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <Button asChild variant="ghost" className="w-full mt-4">
                <Link href="/tasks">View All Tasks</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Documents */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.recentDocuments.length === 0 ? (
                <p className="text-gray-500 text-sm">No documents yet</p>
              ) : (
                <div className="space-y-3">
                  {data.recentDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <FileText className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{doc.name}</p>
                        {doc.client && (
                          <p className="text-xs text-gray-500">
                            {doc.client.firstName} {doc.client.lastName}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button asChild variant="ghost" className="w-full mt-4">
                <Link href="/documents">View All</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
              <Link href="/clients/invite">
                <Users className="h-5 w-5" />
                <span>Invite Client</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
              <Link href="/cases/new">
                <Briefcase className="h-5 w-5" />
                <span>New Case</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
              <Link href="/documents/upload">
                <FileText className="h-5 w-5" />
                <span>Upload Document</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
              <Link href="/invoices/new">
                <DollarSign className="h-5 w-5" />
                <span>Create Invoice</span>
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
