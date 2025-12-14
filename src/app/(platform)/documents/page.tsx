import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Upload,
  Search,
  Filter,
  FileText,
  FileImage,
  FileSpreadsheet,
  File,
  Download,
  Eye,
  Brain,
  MoreVertical,
  Folder,
  Clock,
} from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  CONTRACT: <FileText className="h-5 w-5 text-blue-500" />,
  COURT_FILING: <FileText className="h-5 w-5 text-purple-500" />,
  CORRESPONDENCE: <FileText className="h-5 w-5 text-green-500" />,
  EVIDENCE: <FileImage className="h-5 w-5 text-orange-500" />,
  INVOICE: <FileSpreadsheet className="h-5 w-5 text-emerald-500" />,
  OTHER: <File className="h-5 w-5 text-gray-500" />,
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function getDocuments(organizationId: string, filters: any) {
  const where: any = { organizationId };

  if (filters.category) {
    where.category = filters.category;
  }
  if (filters.clientId) {
    where.clientId = filters.clientId;
  }
  if (filters.caseId) {
    where.caseId = filters.caseId;
  }
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { tags: { has: filters.search } },
    ];
  }

  return prisma.document.findMany({
    where,
    include: {
      client: true,
      case: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

async function getDocumentStats(organizationId: string) {
  const [total, analyzed, byCategory] = await Promise.all([
    prisma.document.count({ where: { organizationId } }),
    prisma.document.count({ where: { organizationId, isAnalyzed: true } }),
    prisma.document.groupBy({
      by: ['category'],
      where: { organizationId },
      _count: { id: true },
    }),
  ]);

  return { total, analyzed, byCategory };
}

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: { category?: string; clientId?: string; caseId?: string; search?: string };
}) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const orgUser = await prisma.organizationUser.findFirst({
    where: { userId: session.user.id },
  });

  if (!orgUser) redirect('/onboarding');

  const [documents, stats] = await Promise.all([
    getDocuments(orgUser.organizationId, searchParams),
    getDocumentStats(orgUser.organizationId),
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Documents</h1>
          <p className="text-gray-500">Manage and analyze your legal documents</p>
        </div>
        <Button asChild variant="navy">
          <Link href="/documents/upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Documents</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">AI Analyzed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.analyzed}</p>
              </div>
              <Brain className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Contracts</p>
                <p className="text-2xl font-bold">
                  {stats.byCategory.find((c) => c.category === 'CONTRACT')?._count.id || 0}
                </p>
              </div>
              <Folder className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Court Filings</p>
                <p className="text-2xl font-bold">
                  {stats.byCategory.find((c) => c.category === 'COURT_FILING')?._count.id || 0}
                </p>
              </div>
              <FileText className="h-8 w-8 text-orange-400" />
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
                  placeholder="Search documents..."
                  defaultValue={searchParams.search}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-law-navy"
                />
              </form>
            </div>
            <select
              defaultValue={searchParams.category || ''}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-law-navy"
            >
              <option value="">All Categories</option>
              <option value="CONTRACT">Contracts</option>
              <option value="COURT_FILING">Court Filings</option>
              <option value="CORRESPONDENCE">Correspondence</option>
              <option value="EVIDENCE">Evidence</option>
              <option value="INTAKE">Intake Forms</option>
              <option value="INVOICE">Invoices</option>
              <option value="OTHER">Other</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      {documents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
            <p className="text-gray-500 mb-4">Upload your first document to get started.</p>
            <Button asChild variant="navy">
              <Link href="/documents/upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client / Case
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {categoryIcons[doc.category] || categoryIcons.OTHER}
                          <div>
                            <p className="font-medium truncate max-w-xs">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.mimeType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {doc.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          {doc.client && (
                            <p>{doc.client.firstName} {doc.client.lastName}</p>
                          )}
                          {doc.case && (
                            <p className="text-gray-500 text-xs">{doc.case.title}</p>
                          )}
                          {!doc.client && !doc.case && (
                            <span className="text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {formatFileSize(doc.size)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {doc.isAnalyzed ? (
                          <span className="flex items-center gap-1 text-xs text-blue-600">
                            <Brain className="h-3 w-3" />
                            Analyzed
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          {!doc.isAnalyzed && (
                            <Button variant="ghost" size="sm">
                              <Brain className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
