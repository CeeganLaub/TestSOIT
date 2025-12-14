'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  Calendar,
  Clock,
  User,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';

// Mock cases for client
const clientCases = [
  {
    id: '1',
    title: 'Smith v. ABC Corporation',
    caseNumber: 'CASE-2024-001',
    status: 'active',
    attorney: 'Robert Anderson',
    practiceArea: 'Personal Injury',
    progress: 65,
    nextHearing: '2024-02-15',
    openedDate: '2023-08-15',
    timeline: [
      { date: '2024-01-18', event: 'Settlement offer received', type: 'milestone' },
      { date: '2024-01-10', event: 'Deposition completed', type: 'event' },
      { date: '2023-12-20', event: 'Discovery completed', type: 'milestone' },
      { date: '2023-11-15', event: 'Case filed', type: 'milestone' },
      { date: '2023-08-15', event: 'Initial consultation', type: 'event' },
    ],
  },
];

export default function ClientCasesPage() {
  const [selectedCase, setSelectedCase] = useState(clientCases[0]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Cases</h1>
        <p className="text-gray-500">View the status and details of your legal matters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases List */}
        <div className="space-y-4">
          {clientCases.map((caseItem) => (
            <Card
              key={caseItem.id}
              className={`cursor-pointer transition-all ${
                selectedCase?.id === caseItem.id
                  ? 'ring-2 ring-law-navy'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedCase(caseItem)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      caseItem.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : caseItem.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {caseItem.status}
                  </span>
                  <span className="text-xs text-gray-500">{caseItem.caseNumber}</span>
                </div>
                <h3 className="font-semibold mb-1">{caseItem.title}</h3>
                <p className="text-sm text-gray-500">{caseItem.practiceArea}</p>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{caseItem.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-law-navy rounded-full"
                      style={{ width: `${caseItem.progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Case Details */}
        {selectedCase && (
          <div className="lg:col-span-2 space-y-6">
            {/* Case Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold mb-1">{selectedCase.title}</h2>
                    <p className="text-gray-500">{selectedCase.caseNumber}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium capitalize">
                    {selectedCase.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Practice Area</p>
                    <p className="font-medium">{selectedCase.practiceArea}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Lead Attorney</p>
                    <p className="font-medium">{selectedCase.attorney}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Opened</p>
                    <p className="font-medium">
                      {new Date(selectedCase.openedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Next Hearing</p>
                    <p className="font-medium text-law-navy">
                      {new Date(selectedCase.nextHearing).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Case Progress</span>
                    <span className="text-sm font-bold">{selectedCase.progress}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-law-navy rounded-full transition-all"
                      style={{ width: `${selectedCase.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Filed</span>
                    <span>Discovery</span>
                    <span>Negotiation</span>
                    <span>Resolution</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link href="/portal/documents">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <FileText className="h-6 w-6 mx-auto mb-2 text-law-navy" />
                    <span className="text-sm font-medium">Documents</span>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/portal/messages">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <MessageSquare className="h-6 w-6 mx-auto mb-2 text-law-navy" />
                    <span className="text-sm font-medium">Message Attorney</span>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/portal/appointments">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-law-navy" />
                    <span className="text-sm font-medium">Schedule Call</span>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/portal/billing">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-law-navy" />
                    <span className="text-sm font-medium">Billing</span>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Case Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

                  <div className="space-y-6">
                    {selectedCase.timeline.map((item, index) => (
                      <div key={index} className="relative flex gap-4 pl-10">
                        <div
                          className={`absolute left-2 top-1 h-4 w-4 rounded-full border-2 ${
                            item.type === 'milestone'
                              ? 'bg-law-navy border-law-navy'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          {item.type === 'milestone' && (
                            <CheckCircle className="h-3 w-3 text-white absolute -top-0.5 -left-0.5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{item.event}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(item.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Important Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Settlement Offer Pending</p>
                      <p className="text-sm text-blue-700">
                        A settlement offer has been received. Please review the document and
                        schedule a call with your attorney to discuss options.
                      </p>
                      <Button variant="navy" size="sm" className="mt-2">
                        Review Offer
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">Upcoming Court Date</p>
                      <p className="text-sm text-yellow-700">
                        Your next court appearance is scheduled for{' '}
                        {new Date(selectedCase.nextHearing).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
