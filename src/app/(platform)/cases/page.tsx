import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Briefcase,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  INTAKE: 'bg-blue-100 text-blue-800',
  ACTIVE: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  ON_HOLD: 'bg-orange-100 text-orange-800',
  SETTLED: 'bg-purple-100 text-purple-800',
  CLOSED: 'bg-gray-100 text-gray-800',
  ARCHIVED: 'bg-gray-100 text-gray-500',
};

const priorityIcons: Record<string, React.ReactNode> = {
  URGENT: <AlertTriangle className="h-4 w-4 text-red-500" />,
  HIGH: <AlertTriangle className="h-4 w-4 text-orange-500" />,
  NORMAL: <Clock className="h-4 w-4 text-blue-500" />,
  LOW: <CheckCircle className="h-4 w-4 text-gray-400" />,
};

async function getCases(organizationId: string, filters: any) {
  const where: any = { organizationId };

  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.practiceArea) {
    where.practiceArea = filters.practiceArea;
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { caseNumber: { contains: filters.search, mode: 'insensitive' } },
      { client: { firstName: { contains: filters.search, mode: 'insensitive' } } },
      { client: { lastName: { contains: filters.search, mode: 'insensitive' } } },
    ];
  }

  const cases = await prisma.case.findMany({
    where,
    include: {
      client: true,
      assignments: {
        include: { user: true },
        where: { isPrimary: true },
      },
      _count: {
        select: {
          documents: true,
          tasks: { where: { status: { in: ['TODO', 'IN_PROGRESS'] } } },
        },
      },
    },
    orderBy: [{ priority: 'desc' }, { updatedAt: 'desc' }],
  });

  return cases;
}

async function getCaseStats(organizationId: string) {
  const [total, active, pending, urgent] = await Promise.all([
    prisma.case.count({ where: { organizationId } }),
    prisma.case.count({ where: { organizationId, status: 'ACTIVE' } }),
    prisma.case.count({ where: { organizationId, status: 'PENDING' } }),
    prisma.case.count({ where: { organizationId, priority: 'URGENT' } }),
  ]);

  return { total, active, pending, urgent };
}

export default async function CasesPage({
  searchParams,
}: {
  searchParams: { status?: string; practiceArea?: string; search?: string };
}) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const orgUser = await prisma.organizationUser.findFirst({
    where: { userId: session.user.id },
  });

  if (!orgUser) redirect('/onboarding');

  const [cases, stats] = await Promise.all([
    getCases(orgUser.organizationId, searchParams),
    getCaseStats(orgUser.organizationId),
  ]);

  const practiceAreas = await prisma.case.groupBy({
    by: ['practiceArea'],
    where: { organizationId: orgUser.organizationId },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cases</h1>
          <p className="text-gray-500">Manage your legal matters</p>
        </div>
        <Button asChild variant="navy">
          <Link href="/cases/new">
            <Plus className="h-4 w-4 mr-2" />
            New Case
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Cases</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Briefcase className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Urgent</p>
                <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <form>
                <input
                  type="text"
                  name="search"
                  placeholder="Search cases..."
                  defaultValue={searchParams.search}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-law-navy"
                />
              </form>
            </div>
            <select
              defaultValue={searchParams.status || ''}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-law-navy"
            >
              <option value="">All Statuses</option>
              <option value="INTAKE">Intake</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="SETTLED">Settled</option>
              <option value="CLOSED">Closed</option>
            </select>
            <select
              defaultValue={searchParams.practiceArea || ''}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-law-navy"
            >
              <option value="">All Practice Areas</option>
              {practiceAreas.map((pa) => (
                <option key={pa.practiceArea} value={pa.practiceArea}>
                  {pa.practiceArea}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Cases List */}
      {cases.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No cases found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first case.</p>
            <Button asChild variant="navy">
              <Link href="/cases/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Case
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {cases.map((caseItem) => (
            <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {priorityIcons[caseItem.priority]}
                      <Link
                        href={`/cases/${caseItem.id}`}
                        className="font-semibold text-lg hover:text-law-navy truncate"
                      >
                        {caseItem.title}
                      </Link>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-2">
                      <span className="font-mono">{caseItem.caseNumber}</span>
                      <span>•</span>
                      <span>{caseItem.practiceArea}</span>
                      {caseItem.caseType && (
                        <>
                          <span>•</span>
                          <span>{caseItem.caseType}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>
                          {caseItem.client.firstName} {caseItem.client.lastName}
                        </span>
                      </div>
                      {caseItem.assignments[0] && (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">Attorney:</span>
                          <span>
                            {caseItem.assignments[0].user.firstName}{' '}
                            {caseItem.assignments[0].user.lastName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[caseItem.status]
                      }`}
                    >
                      {caseItem.status.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{caseItem._count.documents} docs</span>
                      <span>{caseItem._count.tasks} tasks</span>
                    </div>
                    {caseItem.nextDeadline && (
                      <span className="text-xs text-orange-600">
                        Next: {new Date(caseItem.nextDeadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
