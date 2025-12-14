'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, ExternalLink, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

type Integration = {
  id: string;
  name: string;
  description: string;
  category: string;
  logo: string;
  connected: boolean;
  status?: 'active' | 'error' | 'pending';
};

const integrations: Integration[] = [
  // Practice Management
  {
    id: 'clio',
    name: 'Clio',
    description: 'Sync matters, contacts, and time entries with Clio',
    category: 'Practice Management',
    logo: '/integrations/clio.svg',
    connected: false,
  },
  {
    id: 'mycase',
    name: 'MyCase',
    description: 'Connect with MyCase for case management',
    category: 'Practice Management',
    logo: '/integrations/mycase.svg',
    connected: false,
  },
  // Payments
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Accept credit card and ACH payments from clients',
    category: 'Payments',
    logo: '/integrations/stripe.svg',
    connected: true,
    status: 'active',
  },
  {
    id: 'lawpay',
    name: 'LawPay',
    description: 'Legal-specific payment processing',
    category: 'Payments',
    logo: '/integrations/lawpay.svg',
    connected: false,
  },
  // E-Signatures
  {
    id: 'docusign',
    name: 'DocuSign',
    description: 'Send documents for electronic signature',
    category: 'E-Signatures',
    logo: '/integrations/docusign.svg',
    connected: true,
    status: 'active',
  },
  {
    id: 'hellosign',
    name: 'HelloSign',
    description: 'E-signature solution for legal documents',
    category: 'E-Signatures',
    logo: '/integrations/hellosign.svg',
    connected: false,
  },
  // Calendar
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    description: 'Sync appointments with Google Calendar',
    category: 'Calendar',
    logo: '/integrations/google.svg',
    connected: true,
    status: 'active',
  },
  {
    id: 'outlook',
    name: 'Outlook Calendar',
    description: 'Sync with Microsoft Outlook',
    category: 'Calendar',
    logo: '/integrations/outlook.svg',
    connected: false,
  },
  // Video
  {
    id: 'daily',
    name: 'Daily.co',
    description: 'HIPAA-compliant video consultations',
    category: 'Video Conferencing',
    logo: '/integrations/daily.svg',
    connected: true,
    status: 'active',
  },
  {
    id: 'zoom',
    name: 'Zoom',
    description: 'Video meetings with clients',
    category: 'Video Conferencing',
    logo: '/integrations/zoom.svg',
    connected: false,
  },
  // Accounting
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Sync invoices and payments with QuickBooks',
    category: 'Accounting',
    logo: '/integrations/quickbooks.svg',
    connected: false,
  },
  {
    id: 'xero',
    name: 'Xero',
    description: 'Connect with Xero for accounting',
    category: 'Accounting',
    logo: '/integrations/xero.svg',
    connected: false,
  },
  // Communication
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'SMS notifications and 2FA',
    category: 'Communication',
    logo: '/integrations/twilio.svg',
    connected: true,
    status: 'active',
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'Email delivery service',
    category: 'Communication',
    logo: '/integrations/sendgrid.svg',
    connected: false,
  },
];

export default function IntegrationsPage() {
  const { toast } = useToast();
  const [integrationsState, setIntegrationsState] = useState(integrations);

  const categories = Array.from(new Set(integrations.map((i) => i.category)));

  const handleConnect = async (integrationId: string) => {
    toast({
      title: 'Connecting...',
      description: 'Opening authorization window',
    });

    // In production, this would open OAuth flow
    setTimeout(() => {
      setIntegrationsState((prev) =>
        prev.map((i) =>
          i.id === integrationId ? { ...i, connected: true, status: 'active' as const } : i
        )
      );
      toast({
        title: 'Connected!',
        description: 'Integration connected successfully',
        variant: 'success',
      });
    }, 1500);
  };

  const handleDisconnect = async (integrationId: string) => {
    setIntegrationsState((prev) =>
      prev.map((i) =>
        i.id === integrationId ? { ...i, connected: false, status: undefined } : i
      )
    );
    toast({
      title: 'Disconnected',
      description: 'Integration has been disconnected',
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <Link
        href="/settings"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Settings
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Integrations</h1>
        <p className="text-gray-500">
          Connect your favorite tools to streamline your workflow
        </p>
      </div>

      {/* Connected Integrations Summary */}
      <Card className="mb-8 bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Check className="h-5 w-5 text-green-600" />
            <span className="text-green-800">
              {integrationsState.filter((i) => i.connected).length} integrations connected
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Integrations by Category */}
      {categories.map((category) => (
        <div key={category} className="mb-8">
          <h2 className="text-lg font-semibold mb-4">{category}</h2>
          <div className="grid gap-4">
            {integrationsState
              .filter((i) => i.category === category)
              .map((integration) => (
                <Card key={integration.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {/* Placeholder for logo */}
                        <span className="text-xs font-bold text-gray-500">
                          {integration.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{integration.name}</h3>
                          {integration.connected && (
                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                              <Check className="h-3 w-3" />
                              Connected
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{integration.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {integration.connected ? (
                          <>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDisconnect(integration.id)}
                            >
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="navy"
                            size="sm"
                            onClick={() => handleConnect(integration.id)}
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
