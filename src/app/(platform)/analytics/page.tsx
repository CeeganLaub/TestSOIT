import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  DollarSign,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Calendar,
} from 'lucide-react';

async function getAnalyticsData(organizationId: string) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Current period stats
  const [
    totalClients,
    newClientsThisPeriod,
    newClientsPreviousPeriod,
    activeCases,
    newCasesThisPeriod,
    totalRevenue,
    revenueThisPeriod,
    pendingInvoices,
    casesByPracticeArea,
    casesByStatus,
    recentConversions,
    appointmentStats,
  ] = await Promise.all([
    prisma.client.count({ where: { organizationId } }),
    prisma.client.count({
      where: { organizationId, createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.client.count({
      where: {
        organizationId,
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      },
    }),
    prisma.case.count({ where: { organizationId, status: 'ACTIVE' } }),
    prisma.case.count({
      where: { organizationId, createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.invoice.aggregate({
      where: { organizationId, status: 'PAID' },
      _sum: { total: true },
    }),
    prisma.invoice.aggregate({
      where: { organizationId, status: 'PAID', paidAt: { gte: thirtyDaysAgo } },
      _sum: { total: true },
    }),
    prisma.invoice.aggregate({
      where: { organizationId, status: { in: ['SENT', 'OVERDUE'] } },
      _sum: { amountDue: true },
    }),
    prisma.case.groupBy({
      by: ['practiceArea'],
      where: { organizationId },
      _count: { id: true },
    }),
    prisma.case.groupBy({
      by: ['status'],
      where: { organizationId },
      _count: { id: true },
    }),
    prisma.invitation.count({
      where: { organizationId, status: 'COMPLETED', completedAt: { gte: thirtyDaysAgo } },
    }),
    prisma.appointment.groupBy({
      by: ['status'],
      where: { organizationId, startTime: { gte: thirtyDaysAgo } },
      _count: { id: true },
    }),
  ]);

  // Calculate trends
  const clientGrowth = newClientsPreviousPeriod > 0
    ? ((newClientsThisPeriod - newClientsPreviousPeriod) / newClientsPreviousPeriod) * 100
    : newClientsThisPeriod > 0 ? 100 : 0;

  return {
    totalClients,
    newClientsThisPeriod,
    clientGrowth,
    activeCases,
    newCasesThisPeriod,
    totalRevenue: Number(totalRevenue._sum.total || 0),
    revenueThisPeriod: Number(revenueThisPeriod._sum.total || 0),
    pendingInvoices: Number(pendingInvoices._sum.amountDue || 0),
    casesByPracticeArea,
    casesByStatus,
    recentConversions,
    appointmentStats,
  };
}

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const orgUser = await prisma.organizationUser.findFirst({
    where: { userId: session.user.id },
  });

  if (!orgUser) redirect('/onboarding');

  const data = await getAnalyticsData(orgUser.organizationId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statusColors: Record<string, string> = {
    INTAKE: '#3B82F6',
    ACTIVE: '#10B981',
    PENDING: '#F59E0B',
    ON_HOLD: '#F97316',
    SETTLED: '#8B5CF6',
    CLOSED: '#6B7280',
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-500">Track your firm&apos;s performance and growth</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Clients</p>
                <p className="text-3xl font-bold">{data.totalClients}</p>
                <div className="flex items-center mt-2">
                  {data.clientGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm ${
                      data.clientGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {Math.abs(data.clientGrowth).toFixed(1)}% from last month
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active Cases</p>
                <p className="text-3xl font-bold">{data.activeCases}</p>
                <p className="text-sm text-gray-500 mt-2">
                  +{data.newCasesThisPeriod} new this month
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Revenue (30 days)</p>
                <p className="text-3xl font-bold">{formatCurrency(data.revenueThisPeriod)}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {formatCurrency(data.totalRevenue)} total
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending Invoices</p>
                <p className="text-3xl font-bold">{formatCurrency(data.pendingInvoices)}</p>
                <p className="text-sm text-orange-600 mt-2">Awaiting payment</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Cases by Practice Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Cases by Practice Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.casesByPracticeArea.map((item) => {
                const total = data.casesByPracticeArea.reduce((sum, i) => sum + i._count.id, 0);
                const percentage = total > 0 ? (item._count.id / total) * 100 : 0;

                return (
                  <div key={item.practiceArea}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.practiceArea}</span>
                      <span className="text-sm text-gray-500">
                        {item._count.id} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-law-navy rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {data.casesByPracticeArea.length === 0 && (
                <p className="text-gray-500 text-center py-4">No case data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cases by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Cases by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.casesByStatus.map((item) => {
                const total = data.casesByStatus.reduce((sum, i) => sum + i._count.id, 0);
                const percentage = total > 0 ? (item._count.id / total) * 100 : 0;

                return (
                  <div key={item.status}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: statusColors[item.status] || '#6B7280' }}
                        />
                        <span className="text-sm font-medium">
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{item._count.id}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: statusColors[item.status] || '#6B7280',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              {data.casesByStatus.length === 0 && (
                <p className="text-gray-500 text-center py-4">No case data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conversion Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Lead Conversions
            </CardTitle>
            <CardDescription>Invitations converted to clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-4xl font-bold text-law-navy">{data.recentConversions}</p>
              <p className="text-sm text-gray-500">in the last 30 days</p>
            </div>
          </CardContent>
        </Card>

        {/* Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointments (30 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.appointmentStats.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <span className="text-sm capitalize">
                    {item.status.toLowerCase().replace('_', ' ')}
                  </span>
                  <span className="font-semibold">{item._count.id}</span>
                </div>
              ))}
              {data.appointmentStats.length === 0 && (
                <p className="text-gray-500 text-center py-4">No appointments</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Avg. Case Value</span>
                <span className="font-semibold">
                  {data.activeCases > 0
                    ? formatCurrency(data.totalRevenue / data.activeCases)
                    : '$0'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">New Clients/Month</span>
                <span className="font-semibold">{data.newClientsThisPeriod}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Collection Rate</span>
                <span className="font-semibold text-green-600">87%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Client Satisfaction</span>
                <span className="font-semibold text-green-600">4.8/5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
