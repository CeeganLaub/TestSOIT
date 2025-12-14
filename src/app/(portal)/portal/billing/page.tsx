'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CreditCard,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  FileText,
  ChevronRight,
  Plus,
  Shield,
} from 'lucide-react';

type Invoice = {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  description: string;
};

type PaymentMethod = {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  bankName?: string;
  isDefault: boolean;
};

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    amount: 2500,
    status: 'pending',
    dueDate: '2024-02-01',
    description: 'Legal Services - January 2024',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2023-012',
    amount: 3200,
    status: 'paid',
    dueDate: '2024-01-15',
    paidDate: '2024-01-12',
    description: 'Legal Services - December 2023',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2023-011',
    amount: 1800,
    status: 'paid',
    dueDate: '2023-12-15',
    paidDate: '2023-12-10',
    description: 'Court Filing Fees',
  },
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    isDefault: true,
  },
  {
    id: '2',
    type: 'bank',
    last4: '6789',
    bankName: 'Chase Bank',
    isDefault: false,
  },
];

export default function ClientBillingPage() {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const pendingBalance = mockInvoices
    .filter((i) => i.status === 'pending' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPaid = mockInvoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing</h1>
        <p className="text-gray-500">View invoices and make payments</p>
      </div>

      {/* Balance Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card className={pendingBalance > 0 ? 'border-yellow-200' : ''}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current Balance</p>
                <p className={`text-3xl font-bold ${pendingBalance > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                  ${pendingBalance.toLocaleString()}
                </p>
              </div>
              {pendingBalance > 0 ? (
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              ) : (
                <CheckCircle className="h-8 w-8 text-green-500" />
              )}
            </div>
            {pendingBalance > 0 && (
              <Button
                variant="navy"
                className="w-full mt-4"
                onClick={() => {
                  setSelectedInvoice(mockInvoices.find((i) => i.status === 'pending') || null);
                  setShowPayment(true);
                }}
              >
                Pay Now
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Paid (All Time)</p>
                <p className="text-3xl font-bold text-gray-900">${totalPaid.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoices */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FileText className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{invoice.invoiceNumber}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              invoice.status
                            )}`}
                          >
                            {invoice.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{invoice.description}</p>
                        <p className="text-xs text-gray-400">
                          {invoice.status === 'paid'
                            ? `Paid on ${new Date(invoice.paidDate!).toLocaleDateString()}`
                            : `Due ${new Date(invoice.dueDate).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">${invoice.amount.toLocaleString()}</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {invoice.status !== 'paid' && (
                          <Button
                            variant="navy"
                            size="sm"
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setShowPayment(true);
                            }}
                          >
                            Pay
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Payment Methods</CardTitle>
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPaymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-3 border rounded-lg ${
                      method.isDefault ? 'border-law-navy bg-law-navy/5' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard
                          className={`h-5 w-5 ${
                            method.isDefault ? 'text-law-navy' : 'text-gray-400'
                          }`}
                        />
                        <div>
                          <p className="font-medium">
                            {method.type === 'card'
                              ? `${method.brand} ****${method.last4}`
                              : `${method.bankName} ****${method.last4}`}
                          </p>
                          {method.isDefault && (
                            <p className="text-xs text-law-navy">Default</p>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Note */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800">Secure Payments</p>
                  <p className="text-sm text-green-700">
                    All payments are processed securely through Stripe. Your financial information
                    is never stored on our servers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auto-Pay */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-Pay</p>
                  <p className="text-sm text-gray-500">Automatically pay invoices when due</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-law-navy"></div>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Make Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Invoice</span>
                  <span className="font-medium">{selectedInvoice.invoiceNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Amount Due</span>
                  <span className="text-2xl font-bold">
                    ${selectedInvoice.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <div className="space-y-2">
                  {mockPaymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="payment"
                        defaultChecked={method.isDefault}
                        className="text-law-navy"
                      />
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <span>
                        {method.type === 'card'
                          ? `${method.brand} ****${method.last4}`
                          : `${method.bankName} ****${method.last4}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  Your payment is secured with 256-bit SSL encryption.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowPayment(false)}>
                  Cancel
                </Button>
                <Button variant="navy">
                  Pay ${selectedInvoice.amount.toLocaleString()}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
