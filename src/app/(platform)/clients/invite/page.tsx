'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone, User, MessageSquare, QrCode, Send, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createInvitationSchema, type CreateInvitationInput } from '@/lib/validators';
import { useToast } from '@/components/ui/use-toast';

export default function InviteClientPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [inviteResult, setInviteResult] = useState<{
    inviteUrl: string;
    qrCodeUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateInvitationInput>({
    resolver: zodResolver(createInvitationSchema),
    defaultValues: {
      type: 'CLIENT',
      sendVia: ['email'],
    },
  });

  const sendVia = watch('sendVia');

  const onSubmit = async (data: CreateInvitationInput) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          organizationId: 'current-org-id', // Would come from context
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send invitation');
      }

      setInviteResult({
        inviteUrl: result.invitation.inviteUrl,
        qrCodeUrl: result.invitation.qrCodeUrl,
      });

      toast({
        title: 'Invitation Sent!',
        description: `Invitation sent to ${data.email}`,
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send invitation',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (inviteResult?.inviteUrl) {
      await navigator.clipboard.writeText(inviteResult.inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleSendVia = (method: 'email' | 'sms') => {
    const current = sendVia || [];
    if (current.includes(method)) {
      setValue('sendVia', current.filter((m) => m !== method));
    } else {
      setValue('sendVia', [...current, method]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invite Client</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Send an invitation to a new client to join your client portal.
          </p>
        </div>

        {inviteResult ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600 flex items-center gap-2">
                <Check className="h-5 w-5" />
                Invitation Created
              </CardTitle>
              <CardDescription>
                Share this invitation link with your client.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Invite URL */}
              <div>
                <label className="text-sm font-medium mb-2 block">Invitation Link</label>
                <div className="flex gap-2">
                  <Input
                    value={inviteResult.inviteUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" onClick={copyToClipboard}>
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center">
                <label className="text-sm font-medium mb-2 block">QR Code</label>
                <div className="inline-block p-4 bg-white rounded-lg shadow">
                  <img
                    src={inviteResult.qrCodeUrl}
                    alt="QR Code"
                    className="w-48 h-48"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Scan this code to open the invitation
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setInviteResult(null)}
                >
                  Send Another
                </Button>
                <Button
                  variant="navy"
                  className="flex-1"
                  onClick={() => router.push('/clients')}
                >
                  View Clients
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
              <CardDescription>
                Enter the client's information to send an invitation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="pl-10"
                        {...register('firstName')}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      {...register('lastName')}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="client@email.com"
                      className="pl-10"
                      error={!!errors.email}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      className="pl-10"
                      {...register('phone')}
                    />
                  </div>
                </div>

                {/* Personal Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Personal Message (Optional)
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      id="message"
                      placeholder="Add a personal message to the invitation..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-law-navy min-h-[100px]"
                      {...register('message')}
                    />
                  </div>
                </div>

                {/* Send Via */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Send Invitation Via</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => toggleSendVia('email')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        sendVia?.includes('email')
                          ? 'bg-law-navy text-white border-law-navy'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-law-navy'
                      }`}
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSendVia('sms')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        sendVia?.includes('sms')
                          ? 'bg-law-navy text-white border-law-navy'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-law-navy'
                      }`}
                    >
                      <Phone className="h-4 w-4" />
                      SMS
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="navy" className="flex-1" loading={isLoading}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Invitation
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
