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
  Sparkles,
  TrendingUp,
  Shield,
  ArrowUpRight,
  User,
  Phone,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-law-navy/5 to-law-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-law-navy to-law-navy/80 flex items-center justify-center shadow-lg shadow-law-navy/20">
                <span className="text-xl font-bold text-white">
                  {clientData.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <Shield className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Welcome back, {clientData.name.split(' ')[0]}!
              </h1>
              <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-law-gold" />
                Your secure client portal
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Link href="/portal/messages" className="group">
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 flex flex-col items-center text-center h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-3 sm:p-4 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-blue-800/30 rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-500">
                <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                {clientData.unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                    {clientData.unreadMessages}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">Messages</span>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          </Link>

          <Link href="/portal/documents" className="group">
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800 flex flex-col items-center text-center h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-3 sm:p-4 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/50 dark:to-green-800/30 rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-500">
                <FolderOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-600 transition-colors">Documents</span>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          </Link>

          <Link href="/portal/appointments" className="group">
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 flex flex-col items-center text-center h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-3 sm:p-4 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/50 dark:to-purple-800/30 rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-500">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 transition-colors">Appointments</span>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          </Link>

          <Link href="/portal/billing" className="group">
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-800 flex flex-col items-center text-center h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-3 sm:p-4 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/50 dark:to-amber-800/30 rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-500">
                <CreditCard className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-amber-600 transition-colors">Billing</span>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Case */}
            {clientData.cases.map((caseItem) => (
              <Card key={caseItem.id} className="group relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 dark:shadow-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-law-navy/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-law-navy/10 to-blue-100 dark:from-law-navy/30 dark:to-blue-900/30 rounded-xl">
                        <FileText className="h-5 w-5 text-law-navy" />
                      </div>
                      <span className="font-semibold">Active Case</span>
                    </CardTitle>
                    <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-50 text-green-700 dark:from-green-900/50 dark:to-green-800/30 dark:text-green-400 text-xs rounded-full font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      In Progress
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">{caseItem.title}</h3>
                  <p className="text-sm text-gray-500 mb-5 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Lead Attorney: {caseItem.attorney}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-500 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-law-navy" />
                        Case Progress
                      </span>
                      <span className="font-bold text-law-navy">{caseItem.progress}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-law-navy to-blue-600 rounded-full transition-all duration-1000 relative"
                        style={{ width: `${caseItem.progress}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer" />
                      </div>
                    </div>
                  </div>

                  {/* Key Info */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <Calendar className="h-4 w-4 text-law-gold" />
                      <span>
                        Next Hearing:{' '}
                        <span className="font-medium">
                          {new Date(caseItem.nextHearing).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </span>
                    </div>
                  </div>

                  <Link href={`/portal/cases/${caseItem.id}`}>
                    <Button variant="outline" size="sm" className="mt-5 group/btn border-law-navy/20 hover:border-law-navy/50 hover:bg-law-navy/5">
                      View Case Details
                      <ChevronRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}

            {/* Tasks */}
            <Card className="group relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 dark:shadow-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative">
                <CardTitle className="text-base flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/50 dark:to-purple-800/30 rounded-xl">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="font-semibold">Your Tasks</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-3">
                  {clientData.tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className={`group/item flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
                        task.priority === 'high'
                          ? 'border-red-200 bg-gradient-to-r from-red-50 to-red-25 dark:from-red-900/20 dark:to-red-800/10 dark:border-red-800/50 hover:border-red-300'
                          : task.priority === 'medium'
                          ? 'border-amber-200 bg-gradient-to-r from-amber-50 to-amber-25 dark:from-amber-900/20 dark:to-amber-800/10 dark:border-amber-800/50 hover:border-amber-300'
                          : 'border-gray-200 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/30 dark:to-gray-600/20 dark:border-gray-700 hover:border-gray-300'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded-lg border-2 border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer transition-all hover:border-purple-400"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {task.priority === 'high' && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-red-600 dark:text-red-400">Urgent</span>
                          <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Documents */}
            <Card className="group relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 dark:shadow-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/50 dark:to-green-800/30 rounded-xl">
                      <FolderOpen className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-semibold">Recent Documents</span>
                  </CardTitle>
                  <Link href="/portal/documents" className="text-sm text-law-navy hover:text-law-gold transition-colors flex items-center gap-1 group/link">
                    View All
                    <ArrowUpRight className="h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-3">
                  {clientData.recentDocuments.map((doc, index) => (
                    <div
                      key={doc.id}
                      className="group/item flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-lg group-hover/item:scale-110 transition-transform duration-300">
                          <FileText className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white group-hover/item:text-green-600 transition-colors">{doc.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Added {new Date(doc.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.requiresSignature ? (
                          <Button className="bg-gradient-to-r from-law-navy to-law-navy/90 hover:from-law-navy/90 hover:to-law-navy shadow-lg shadow-law-navy/25 hover:shadow-law-navy/40 transition-all duration-300 hover:scale-[1.02]" size="sm">
                            <Sparkles className="h-4 w-4 mr-1" />
                            Sign Now
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="hover:bg-green-50 dark:hover:bg-green-900/20">
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
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-law-navy via-law-navy/95 to-blue-800 text-white shadow-xl shadow-law-navy/30">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                </div>
                <div className="relative p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Upcoming Appointment</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-xl">
                      {clientData.upcomingAppointments[0].title}
                    </h3>
                    <p className="text-blue-200 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
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
                    <p className="text-sm text-blue-200 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      with {clientData.upcomingAppointments[0].attorney}
                    </p>
                  </div>
                  {clientData.upcomingAppointments[0].type === 'video' && (
                    <Button className="mt-5 w-full bg-white text-law-navy hover:bg-white/90 shadow-lg group" size="lg">
                      <Video className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                      Join Video Call
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Pending Payment */}
            {clientData.pendingInvoice && (
              <Card className="group relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 dark:shadow-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="relative p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/50 dark:to-amber-800/30 rounded-xl">
                      <CreditCard className="h-5 w-5 text-amber-600" />
                    </div>
                    <span className="font-semibold">Payment Due</span>
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-law-navy to-blue-600 bg-clip-text text-transparent mb-2">
                    ${clientData.pendingInvoice.amount.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500 mb-5 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Due by{' '}
                    {new Date(clientData.pendingInvoice.dueDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <Link href="/portal/billing">
                    <Button className="w-full bg-gradient-to-r from-law-navy to-law-navy/90 hover:from-law-navy/90 hover:to-law-navy shadow-lg shadow-law-navy/25 hover:shadow-law-navy/40 transition-all duration-300 hover:scale-[1.02]">
                      Pay Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Notifications */}
            <Card className="group relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 dark:shadow-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative pb-3">
                <CardTitle className="text-base flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-blue-800/30 rounded-xl relative">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  </div>
                  <span className="font-semibold">Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-3">
                  {notifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-xl transition-all duration-300 ${
                        notification.read
                          ? 'bg-gray-50 dark:bg-gray-700/30'
                          : 'bg-gradient-to-r from-blue-50 to-blue-25 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-100 dark:border-blue-800/50'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card className="group relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 dark:shadow-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-law-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="relative p-6 text-center">
                <div className="relative inline-block mb-4">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-law-navy to-law-navy/80 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-law-navy/20">
                    RA
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Robert Anderson</h3>
                <p className="text-sm text-gray-500 mb-5">Your Lead Attorney</p>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full group/btn border-law-navy/20 hover:border-law-navy/50 hover:bg-law-navy/5">
                    <MessageSquare className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                    Send Message
                  </Button>
                  <Button variant="ghost" className="w-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Schedule Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
