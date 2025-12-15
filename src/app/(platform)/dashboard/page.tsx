import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Activity,
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

  // Get user&apos;s first organization
  const orgUser = await prisma.organizationUser.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  });

  if (!orgUser) {
    redirect('/onboarding');
  }

  const data = await getDashboardData(orgUser.organizationId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-law-navy/5 to-law-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-gradient-to-br from-law-gold/5 to-amber-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-law-navy to-law-navy/80 flex items-center justify-center shadow-lg shadow-law-navy/20">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Welcome back, {session.user.name?.split(' ')[0]}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <span>{orgUser.organization.name}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline" className="group border-gray-200 hover:border-law-navy/30 hover:bg-law-navy/5 transition-all duration-300">
                <Link href="/clients/invite">
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Invite Client
                </Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-law-navy to-law-navy/90 hover:from-law-navy/90 hover:to-law-navy shadow-lg shadow-law-navy/25 hover:shadow-law-navy/40 transition-all duration-300 hover:scale-[1.02]">
                <Link href="/cases/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Case
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Total Clients */}
          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-blue-800/30 rounded-xl group-hover:scale-110 transition-transform duration-500">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="absolute -inset-1 bg-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clients</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{data.clientCount}</p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </div>

          {/* Active Cases */}
          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/50 dark:to-green-800/30 rounded-xl group-hover:scale-110 transition-transform duration-500">
                  <Briefcase className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="absolute -inset-1 bg-green-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Cases</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">{data.activeCaseCount}</p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </div>

          {/* Unread Messages */}
          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-800">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/50 dark:to-amber-800/30 rounded-xl group-hover:scale-110 transition-transform duration-500">
                  <MessageSquare className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                {data.unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold animate-pulse">
                    {data.unreadMessages}
                  </span>
                )}
                <div className="absolute -inset-1 bg-amber-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Messages</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">{data.unreadMessages}</p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </div>

          {/* Overdue Invoices */}
          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/50 dark:to-red-800/30 rounded-xl group-hover:scale-110 transition-transform duration-500">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                {data.overdueInvoices > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full text-white text-xs flex items-center justify-center font-bold animate-bounce">
                    !
                  </span>
                )}
                <div className="absolute -inset-1 bg-red-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">{data.overdueInvoices}</p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <Card className="group relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 dark:shadow-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-law-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-law-gold/20 to-amber-100 dark:from-law-gold/30 dark:to-amber-900/30 rounded-xl">
                    <Calendar className="h-5 w-5 text-law-gold" />
                  </div>
                  <span className="font-semibold">Upcoming</span>
                </div>
                <Link href="/appointments" className="text-sm text-law-navy hover:text-law-gold transition-colors flex items-center gap-1 group/link">
                  View all
                  <ArrowUpRight className="h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              {data.upcomingAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No upcoming appointments</p>
                  <Button asChild variant="ghost" className="mt-3" size="sm">
                    <Link href="/appointments/new">Schedule one</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.upcomingAppointments.map((apt, index) => (
                    <div
                      key={apt.id}
                      className="group/item flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 cursor-pointer"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="p-2 bg-gradient-to-br from-law-gold/20 to-amber-50 dark:from-law-gold/30 dark:to-amber-900/20 rounded-lg group-hover/item:scale-110 transition-transform duration-300">
                          <Clock className="h-4 w-4 text-law-gold" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate group-hover/item:text-law-navy transition-colors">{apt.title}</p>
                        <p className="text-xs text-gray-500">
                          {apt.client.firstName} {apt.client.lastName}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(apt.startTime).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover/item:text-law-navy group-hover/item:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card className="group relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 dark:shadow-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/50 dark:to-purple-800/30 rounded-xl">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="font-semibold">Priority Tasks</span>
                </div>
                <Link href="/tasks" className="text-sm text-law-navy hover:text-purple-600 transition-colors flex items-center gap-1 group/link">
                  View all
                  <ArrowUpRight className="h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              {data.tasks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <p className="text-gray-500 text-sm">All caught up!</p>
                  <p className="text-gray-400 text-xs mt-1">No pending tasks</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="group/item flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="relative mt-0.5">
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded-lg border-2 border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer transition-all hover:border-purple-400"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{task.title}</p>
                        {task.case && (
                          <p className="text-xs text-gray-500 truncate">{task.case.title}</p>
                        )}
                        {task.dueDate && (
                          <p className="text-xs text-gray-400 mt-1">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                          task.priority === 'URGENT'
                            ? 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 dark:from-red-900/50 dark:to-red-800/30 dark:text-red-400'
                            : task.priority === 'HIGH'
                            ? 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 dark:from-orange-900/50 dark:to-orange-800/30 dark:text-orange-400'
                            : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 dark:from-gray-700 dark:to-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Documents */}
          <Card className="group relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 dark:shadow-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-blue-800/30 rounded-xl">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-semibold">Recent Documents</span>
                </div>
                <Link href="/documents" className="text-sm text-law-navy hover:text-blue-600 transition-colors flex items-center gap-1 group/link">
                  View all
                  <ArrowUpRight className="h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              {data.recentDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No documents yet</p>
                  <Button asChild variant="ghost" className="mt-3" size="sm">
                    <Link href="/documents/upload">Upload one</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.recentDocuments.map((doc, index) => (
                    <div
                      key={doc.id}
                      className="group/item flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 cursor-pointer"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg group-hover/item:scale-110 transition-transform duration-300">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate group-hover/item:text-blue-600 transition-colors">{doc.name}</p>
                        {doc.client && (
                          <p className="text-xs text-gray-500">
                            {doc.client.firstName} {doc.client.lastName}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover/item:text-blue-600 group-hover/item:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Quick Actions
            </h2>
            <div className="h-px flex-1 ml-4 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/clients/invite"
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 flex flex-col items-center gap-3 text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-4 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-blue-800/30 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Invite Client</span>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Link>

            <Link
              href="/cases/new"
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800 flex flex-col items-center gap-3 text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-4 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/50 dark:to-green-800/30 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                <Briefcase className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">New Case</span>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Link>

            <Link
              href="/documents/upload"
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 flex flex-col items-center gap-3 text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-4 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/50 dark:to-purple-800/30 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Upload Document</span>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Link>

            <Link
              href="/invoices/new"
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-800 flex flex-col items-center gap-3 text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-4 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/50 dark:to-amber-800/30 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Create Invoice</span>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Link>
          </div>
        </div>

        {/* Activity Feed Teaser */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-law-navy to-law-navy/90 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          </div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI-Powered Insights</h3>
                <p className="text-white/70 text-sm">Get intelligent recommendations for your practice</p>
              </div>
            </div>
            <Button variant="secondary" className="bg-white text-law-navy hover:bg-white/90 shadow-lg">
              Explore AI Features
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
