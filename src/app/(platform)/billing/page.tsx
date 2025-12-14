'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DollarSign,
  FileText,
  Clock,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Download,
  Send,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Receipt,
  ChevronRight,
} from 'lucide-react';

type Invoice = {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientId: string;
  caseTitle: string;
  amount: number;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  createdAt: string;
  paidAt?: string;
};

type TimeEntry = {
  id: string;
  description: string;
  clientName: string;
  caseTitle: string;
  hours: number;
  rate: number;
  date: string;
  status: 'unbilled' | 'billed' | 'paid';
  attorney: string;
};

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    clientName: 'John Smith',
    clientId: 'c1',
    caseTitle: 'Smith v. ABC Corp',
    amount: 5250.0,
    status: 'sent',
    dueDate: '2024-02-15',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    clientName: 'Sarah Johnson',
    clientId: 'c2',
    caseTitle: 'Johnson Divorce',
    amount: 3500.0,
    status: 'paid',
    dueDate: '2024-01-30',
    createdAt: '2024-01-10',
    paidAt: '2024-01-28',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    clientName: 'Michael Brown',
    clientId: 'c3',
    caseTitle: 'Brown Estate Planning',
    amount: 1500.0,
    status: 'overdue',
    dueDate: '2024-01-20',
    createdAt: '2024-01-05',
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    clientName: 'Emily Davis',
    clientId: 'c4',
    caseTitle: 'Davis Personal Injury',
    amount: 7500.0,
    status: 'draft',
    dueDate: '2024-02-28',
    createdAt: '2024-01-18',
  },
];

const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    description: 'Review motion to dismiss',
    clientName: 'John Smith',
    caseTitle: 'Smith v. ABC Corp',
    hours: 2.5,
    rate: 350,
    date: '2024-01-18',
    status: 'unbilled',
    attorney: 'Robert Anderson',
  },
  {
    id: '2',
    description: 'Client call - case strategy discussion',
    clientName: 'Sarah Johnson',
    caseTitle: 'Johnson Divorce',
    hours: 1.0,
    rate: 350,
    date: '2024-01-18',
    status: 'unbilled',
    attorney: 'Robert Anderson',
  },
  {
    id: '3',
    description: 'Draft interrogatories',
    clientName: 'John Smith',
    caseTitle: 'Smith v. ABC Corp',
    hours: 3.0,
    rate: 350,
    date: '2024-01-17',
    status: 'unbilled',
    attorney: 'Robert Anderson',
  },
  {
    id: '4',
    description: 'Court appearance - preliminary hearing',
    clientName: 'Emily Davis',
    caseTitle: 'Davis Personal Injury',
    hours: 4.0,
    rate: 350,
    date: '2024-01-17',
    status: 'billed',
    attorney: 'Robert Anderson',
  },
];

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-blue-100 text-blue-700',
  viewed: 'bg-purple-100 text-purple-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'time' | 'payments'>('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const stats = {
    outstanding: mockInvoices
      .filter((i) => ['sent', 'viewed', 'overdue'].includes(i.status))
      .reduce((sum, i) => sum + i.amount, 0),
    overdue: mockInvoices
      .filter((i) => i.status === 'overdue')
      .reduce((sum, i) => sum + i.amount, 0),
    paidThisMonth: mockInvoices
      .filter((i) => i.status === 'paid')
      .reduce((sum, i) => sum + i.amount, 0),
    unbilledTime:
      mockTimeEntries.filter((t) => t.status === 'unbilled').reduce((sum, t) => sum + t.hours, 0) *
      350,
  };

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTimeEntries = mockTimeEntries.filter((entry) =>
    entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing</h1>
          <p className="text-gray-500">Manage invoices, time entries, and payments</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="navy" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Outstanding</p>
                <p className="text-xl font-bold">
                  ${stats.outstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-xl font-bold text-red-600">
                  ${stats.overdue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Paid This Month</p>
                <p className="text-xl font-bold text-green-600">
                  ${stats.paidThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Unbilled Time</p>
                <p className="text-xl font-bold">
                  ${stats.unbilledTime.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {(['invoices', 'time', 'payments'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? 'border-law-navy text-law-navy'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'time' ? 'Time Entries' : tab}
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={
              activeTab === 'invoices' ? 'Search invoices...' : 'Search time entries...'
            }
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {activeTab === 'invoices' && (
          <select
            className="px-4 py-2 border rounded-lg"
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || null)}
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="viewed">Viewed</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        )}
      </div>

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-600">Invoice</th>
                    <th className="text-left p-4 font-medium text-gray-600">Client / Case</th>
                    <th className="text-left p-4 font-medium text-gray-600">Amount</th>
                    <th className="text-left p-4 font-medium text-gray-600">Status</th>
                    <th className="text-left p-4 font-medium text-gray-600">Due Date</th>
                    <th className="text-right p-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <span className="font-medium">{invoice.invoiceNumber}</span>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{invoice.clientName}</div>
                        <div className="text-sm text-gray-500">{invoice.caseTitle}</div>
                      </td>
                      <td className="p-4 font-semibold">
                        ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            statusColors[invoice.status]
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {invoice.status === 'draft' && (
                            <Button variant="ghost" size="sm">
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Link href={`/billing/invoices/${invoice.id}`}>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
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

      {/* Time Entries Tab */}
      {activeTab === 'time' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {mockTimeEntries.filter((t) => t.status === 'unbilled').length} unbilled entries |{' '}
              {mockTimeEntries.filter((t) => t.status === 'unbilled').reduce((sum, t) => sum + t.hours, 0)}{' '}
              hours
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Time Entry
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-600">Date</th>
                      <th className="text-left p-4 font-medium text-gray-600">Description</th>
                      <th className="text-left p-4 font-medium text-gray-600">Client / Case</th>
                      <th className="text-left p-4 font-medium text-gray-600">Hours</th>
                      <th className="text-left p-4 font-medium text-gray-600">Amount</th>
                      <th className="text-left p-4 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredTimeEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="p-4 text-gray-600">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{entry.description}</div>
                          <div className="text-sm text-gray-500">{entry.attorney}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{entry.clientName}</div>
                          <div className="text-sm text-gray-500">{entry.caseTitle}</div>
                        </td>
                        <td className="p-4">{entry.hours.toFixed(1)}</td>
                        <td className="p-4 font-semibold">
                          ${(entry.hours * entry.rate).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              entry.status === 'unbilled'
                                ? 'bg-yellow-100 text-yellow-700'
                                : entry.status === 'billed'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Methods Accepted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 border rounded-lg">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span>Credit Card</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border rounded-lg">
                  <Receipt className="h-5 w-5 text-green-600" />
                  <span>ACH / Bank Transfer</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border rounded-lg opacity-50">
                  <DollarSign className="h-5 w-5 text-gray-600" />
                  <span>Check</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Powered by Stripe. Fees: 2.9% + 30c (cards), 0.8% capped at $5 (ACH)
              </p>
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInvoices
                  .filter((i) => i.status === 'paid')
                  .map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 rounded-full">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">{invoice.clientName}</div>
                          <div className="text-sm text-gray-500">
                            {invoice.invoiceNumber} - {invoice.caseTitle}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          +${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invoice.paidAt && new Date(invoice.paidAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Payment Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Automated reminder scheduled
                    </p>
                    <p className="text-sm text-yellow-700">
                      Michael Brown - INV-2024-003 ($1,500) is 5 days overdue. A reminder email will
                      be sent in 2 days.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm">
                        Send Now
                      </Button>
                      <Button variant="ghost" size="sm">
                        Skip
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>AI Insight:</strong> Based on payment history, 3 clients typically pay
                    within 48 hours of reminder. Consider enabling auto-reminders at 7 days past
                    due.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
