'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FileText,
  FolderOpen,
  MessageSquare,
  Calendar,
  CreditCard,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/portal', icon: Home },
  { name: 'My Cases', href: '/portal/cases', icon: FileText },
  { name: 'Documents', href: '/portal/documents', icon: FolderOpen },
  { name: 'Messages', href: '/portal/messages', icon: MessageSquare },
  { name: 'Appointments', href: '/portal/appointments', icon: Calendar },
  { name: 'Billing', href: '/portal/billing', icon: CreditCard },
  { name: 'Profile', href: '/portal/profile', icon: User },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <Link href="/portal" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-law-navy text-white flex items-center justify-center font-bold text-sm">
              LP
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">Client Portal</span>
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Client Info */}
        <div className="p-4 border-b bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-law-navy text-white flex items-center justify-center font-semibold">
              JS
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">John Smith</p>
              <p className="text-sm text-gray-500">Anderson & Partners</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-law-navy text-white'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Help & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
            <HelpCircle className="h-5 w-5" />
            Help & Support
          </button>
          <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b flex items-center justify-between px-4">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-gray-600" />
          </button>

          <div className="flex-1 lg:flex-none" />

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </Button>
            <div className="h-8 w-8 rounded-full bg-law-navy text-white flex items-center justify-center font-semibold text-sm lg:hidden">
              JS
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
