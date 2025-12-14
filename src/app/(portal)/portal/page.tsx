'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  FolderOpen,
  MessageSquare,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Download,
  Video,
  Bell,
  ChevronRight,
} from 'lucide-react';

// Mock client data
const clientData = {
  name: 'John Smith',
  cases: [
    {
      id: '1',
      title: 'Smith v. ABC Corporation',
      status: 'active',
      attorney: 'Robert Anderson',
      nextHearing: '2024-02-15',
      progress: 65,
    },
  ],
  upcomingAppointments: [
    {
      id: '1',
      title: 'Case Strategy Meeting',
      date: '2024-01-25',
      time: '2:00 PM',
      type: 'video',
      attorney: 'Robert Anderson',
    },
  ],
  recentDocuments: [
    {
      id: '1',
      name: 'Settlement Offer Letter.pdf',
      date: '2024-01-18',
      requiresSignature: true,
    },
    {
      id: '2',
      name: 'Discovery Response.pdf',
      date: '2024-01-15',
      requiresSignature: false,
    },
  ],
  unreadMessages: 2,
  pendingInvoice: {
    amount: 2500,
    dueDate: '2024-02-01',
  },
  tasks: [
    { id: '1', title: 'Sign Settlement Offer Letter', priority: 'high', dueDate: '2024-01-22' },
    { id: '2', title: 'Upload medical records', priority: 'medium', dueDate: '2024-01-30' },
    { id: '3', title: 'Review discovery questions', priority: 'low', dueDate: '2024-02-05' },
  ],
};

export default function ClientPortalDashboard() {
  const [notifications] = useState([
    { id: '1', message: 'New document ready for signature', time: '2 hours ago', read: false },
    { id: '2', message: 'Your attorney left a message', time: '5 hours ago', read: false },
    { id: '3', message: 'Upcoming appointment reminder', time: '1 day ago', read: true },
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {clientData.name.split(' ')[0]}!
        </h1>
        <p className="text-gray-500">Here's an overview of your case and upcoming tasks.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Link href="/portal/messages">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="p-3 bg-blue-100 rounded-full mb-2 relative">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                {clientData.unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {clientData.unreadMessages}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium">Messages</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/portal/documents">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="p-3 bg-green-100 rounded-full mb-2">
                <FolderOpen className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm font-medium">Documents</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/portal/appointments">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="p-3 bg-purple-100 rounded-full mb-2">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium">Appointments</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/portal/billing">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="p-3 bg-yellow-100 rounded-full mb-2">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="text-sm font-medium">Billing</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Case */}
          {clientData.cases.map((caseItem) => (
            <Card key={caseItem.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-5 w-5 text-law-navy" />
                    Active Case
                  </CardTitle>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    In Progress
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">{caseItem.title}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Lead Attorney: {caseItem.attorney}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-500">Case Progress</span>
                    <span className="font-medium">{caseItem.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-law-navy rounded-full transition-all"
                      style={{ width: `${caseItem.progress}%` }}
                    />
                  </div>
                </div>

                {/* Key Info */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      Next Hearing:{' '}
                      {new Date(caseItem.nextHearing).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <Link href={`/portal/cases/${caseItem.id}`}>
                  <Button variant="outline" size="sm" className="mt-4">
                    View Case Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}

          {/* Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-law-navy" />
                Your Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clientData.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      task.priority === 'high'
                        ? 'border-red-200 bg-red-50'
                        : task.priority === 'medium'
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-gray-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {task.priority === 'high' && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Documents */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-law-navy" />
                  Recent Documents
                </CardTitle>
                <Link href="/portal/documents">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clientData.recentDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          Added {new Date(doc.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.requiresSignature ? (
                        <Button variant="navy" size="sm">
                          Sign Now
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          {/* Upcoming Appointment */}
          {clientData.upcomingAppointments.length > 0 && (
            <Card className="bg-law-navy text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">Upcoming Appointment</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">
                    {clientData.upcomingAppointments[0].title}
                  </h3>
                  <p className="text-blue-200">
                    {new Date(clientData.upcomingAppointments[0].date).toLocaleDateString(
                      'en-US',
                      {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}{' '}
                    at {clientData.upcomingAppointments[0].time}
                  </p>
                  <p className="text-sm text-blue-200">
                    with {clientData.upcomingAppointments[0].attorney}
                  </p>
                </div>
                {clientData.upcomingAppointments[0].type === 'video' && (
                  <Button variant="gold" size="sm" className="mt-4 w-full">
                    <Video className="h-4 w-4 mr-2" />
                    Join Video Call
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Pending Payment */}
          {clientData.pendingInvoice && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-law-navy" />
                  <span className="font-medium">Payment Due</span>
                </div>
                <div className="text-3xl font-bold text-law-navy mb-2">
                  ${clientData.pendingInvoice.amount.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Due by{' '}
                  {new Date(clientData.pendingInvoice.dueDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <Link href="/portal/billing">
                  <Button variant="navy" size="sm" className="w-full">
                    Pay Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-5 w-5 text-law-navy" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${
                      notification.read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-100'
                    }`}
                  >
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-law-navy text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                RA
              </div>
              <h3 className="font-semibold">Robert Anderson</h3>
              <p className="text-sm text-gray-500 mb-4">Your Lead Attorney</p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="ghost" size="sm" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
