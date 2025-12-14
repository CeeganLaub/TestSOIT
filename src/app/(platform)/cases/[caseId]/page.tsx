import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Edit,
  FileText,
  Calendar,
  MessageSquare,
  DollarSign,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  ExternalLink,
  Brain,
} from 'lucide-react';

async function getCase(caseId: string, organizationId: string) {
  return prisma.case.findFirst({
    where: { id: caseId, organizationId },
    include: {
      client: true,
      assignments: {
        include: { user: true },
      },
      documents: {
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
      tasks: {
        where: { status: { in: ['TODO', 'IN_PROGRESS'] } },
        take: 5,
        orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
      },
      events: {
        take: 10,
        orderBy: { eventDate: 'desc' },
      },
      invoices: {
        take: 3,
        orderBy: { createdAt: 'desc' },
      },
      notes: {
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          documents: true,
          tasks: true,
          messages: true,
          invoices: true,
        },
      },
    },
  });
}

export default async function CaseDetailPage({
  params,
}: {
  params: { caseId: string };
}) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const orgUser = await prisma.organizationUser.findFirst({
    where: { userId: session.user.id },
  });

  if (!orgUser) redirect('/onboarding');

  const caseData = await getCase(params.caseId, orgUser.organizationId);

  if (!caseData) notFound();

  const statusColors: Record<string, string> = {
    INTAKE: 'bg-blue-100 text-blue-800 border-blue-200',
    ACTIVE: 'bg-green-100 text-green-800 border-green-200',
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    ON_HOLD: 'bg-orange-100 text-orange-800 border-orange-200',
    SETTLED: 'bg-purple-100 text-purple-800 border-purple-200',
    CLOSED: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/cases"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Cases
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {caseData.title}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  statusColors[caseData.status]
                }`}
              >
                {caseData.status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {caseData.caseNumber}
              </span>
              <span>{caseData.practiceArea}</span>
              {caseData.caseType && <span>• {caseData.caseType}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Brain className="h-4 w-4 mr-2" />
              AI Analysis
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Case Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {caseData.description ? (
                <p className="text-gray-600 whitespace-pre-wrap">{caseData.description}</p>
              ) : (
                <p className="text-gray-400 italic">No description provided</p>
              )}

              {/* AI Summary */}
              {caseData.aiSummary && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
                    <Brain className="h-4 w-4" />
                    AI Summary
                  </div>
                  <p className="text-blue-900 text-sm">{caseData.aiSummary}</p>
                </div>
              )}

              {/* Win Probability */}
              {caseData.winProbability !== null && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">AI Win Probability</span>
                    <span className="text-lg font-bold">
                      {Math.round((caseData.winProbability || 0) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(caseData.winProbability || 0) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Timeline & Events</CardTitle>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Event
              </Button>
            </CardHeader>
            <CardContent>
              {caseData.events.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No events recorded</p>
              ) : (
                <div className="space-y-4">
                  {caseData.events.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            event.isCompleted ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                        {index < caseData.events.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{event.title}</p>
                            {event.description && (
                              <p className="text-sm text-gray-500">{event.description}</p>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(event.eventDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Open Tasks ({caseData._count.tasks})</CardTitle>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </CardHeader>
            <CardContent>
              {caseData.tasks.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No open tasks</p>
              ) : (
                <div className="space-y-3">
                  {caseData.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <input type="checkbox" className="h-4 w-4 rounded" />
                      <div className="flex-1">
                        <p className="font-medium">{task.title}</p>
                        {task.dueDate && (
                          <p className="text-xs text-gray-500">
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
            </CardContent>
          </Card>

          {/* Recent Documents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Documents ({caseData._count.documents})</CardTitle>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Upload
              </Button>
            </CardHeader>
            <CardContent>
              {caseData.documents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No documents uploaded</p>
              ) : (
                <div className="space-y-2">
                  {caseData.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {doc.isAnalyzed && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          AI Analyzed
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <Button asChild variant="ghost" className="w-full mt-4">
                <Link href={`/cases/${caseData.id}/documents`}>View All Documents</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-law-navy text-white flex items-center justify-center font-semibold">
                  {caseData.client.firstName.charAt(0)}
                  {caseData.client.lastName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">
                    {caseData.client.firstName} {caseData.client.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{caseData.client.email}</p>
                </div>
              </div>
              {caseData.client.phone && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="text-gray-400">Phone:</span> {caseData.client.phone}
                </p>
              )}
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={`/clients/${caseData.client.id}`}>View Client Profile</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Team */}
          <Card>
            <CardHeader>
              <CardTitle>Legal Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {caseData.assignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                      {assignment.user.firstName?.charAt(0)}
                      {assignment.user.lastName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">
                        {assignment.user.firstName} {assignment.user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {assignment.role}
                        {assignment.isPrimary && ' (Primary)'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-4">
                <Plus className="h-4 w-4 mr-1" />
                Add Team Member
              </Button>
            </CardContent>
          </Card>

          {/* Key Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Key Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase">Opened</p>
                <p className="font-medium">
                  {new Date(caseData.openedAt).toLocaleDateString()}
                </p>
              </div>
              {caseData.statuteOfLimitations && (
                <div>
                  <p className="text-xs text-gray-500 uppercase">Statute of Limitations</p>
                  <p className="font-medium text-red-600">
                    {new Date(caseData.statuteOfLimitations).toLocaleDateString()}
                  </p>
                </div>
              )}
              {caseData.nextDeadline && (
                <div>
                  <p className="text-xs text-gray-500 uppercase">Next Deadline</p>
                  <p className="font-medium text-orange-600">
                    {new Date(caseData.nextDeadline).toLocaleDateString()}
                  </p>
                </div>
              )}
              {caseData.trialDate && (
                <div>
                  <p className="text-xs text-gray-500 uppercase">Trial Date</p>
                  <p className="font-medium">
                    {new Date(caseData.trialDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Financial */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase">Fee Arrangement</p>
                <p className="font-medium">{caseData.feeArrangement.replace('_', ' ')}</p>
              </div>
              {caseData.estimatedValue && (
                <div>
                  <p className="text-xs text-gray-500 uppercase">Estimated Value</p>
                  <p className="font-medium">
                    ${Number(caseData.estimatedValue).toLocaleString()}
                  </p>
                </div>
              )}
              {caseData.retainerAmount && (
                <div>
                  <p className="text-xs text-gray-500 uppercase">Retainer</p>
                  <p className="font-medium">
                    ${Number(caseData.retainerAmount).toLocaleString()}
                  </p>
                </div>
              )}
              <Button asChild variant="outline" size="sm" className="w-full mt-2">
                <Link href={`/cases/${caseData.id}/billing`}>View Billing</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Generate Document
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
