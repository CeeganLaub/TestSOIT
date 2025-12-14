'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, User, Briefcase, DollarSign, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createCaseSchema, type CreateCaseInput } from '@/lib/validators';
import { useToast } from '@/components/ui/use-toast';

const practiceAreas = [
  'Personal Injury',
  'Family Law',
  'Criminal Defense',
  'Corporate Law',
  'Real Estate',
  'Immigration',
  'Employment Law',
  'Intellectual Property',
  'Bankruptcy',
  'Estate Planning',
  'Tax Law',
  'Civil Litigation',
  'Other',
];

const feeArrangements = [
  { value: 'HOURLY', label: 'Hourly' },
  { value: 'FLAT_FEE', label: 'Flat Fee' },
  { value: 'CONTINGENCY', label: 'Contingency' },
  { value: 'RETAINER', label: 'Retainer' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'PRO_BONO', label: 'Pro Bono' },
];

export default function NewCasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateCaseInput>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      priority: 'NORMAL',
      feeArrangement: 'HOURLY',
    },
  });

  const feeArrangement = watch('feeArrangement');

  const onSubmit = async (data: CreateCaseInput) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create case');
      }

      toast({
        title: 'Case Created!',
        description: `Case ${result.case.caseNumber} has been created.`,
        variant: 'success',
      });

      router.push(`/cases/${result.case.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create case',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <Link
        href="/cases"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Cases
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Case</h1>
        <p className="text-gray-500">Enter the case details to get started.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                s <= step
                  ? 'bg-law-navy text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-1 mx-2 ${
                  s < step ? 'bg-law-navy' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Client & Basic Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Client & Basic Information
              </CardTitle>
              <CardDescription>Select the client and enter case basics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Client *</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-law-navy"
                  {...register('clientId')}
                >
                  <option value="">Select a client...</option>
                  {/* Would be populated from API */}
                </select>
                {errors.clientId && (
                  <p className="text-sm text-destructive">{errors.clientId.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Don't see the client?{' '}
                  <Link href="/clients/invite" className="text-law-navy hover:underline">
                    Invite them first
                  </Link>
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Case Title *</label>
                <Input
                  placeholder="e.g., Smith v. ABC Corporation"
                  error={!!errors.title}
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-law-navy min-h-[100px]"
                  placeholder="Brief description of the case..."
                  {...register('description')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Practice Area *</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-law-navy"
                    {...register('practiceArea')}
                  >
                    <option value="">Select...</option>
                    {practiceAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  {errors.practiceArea && (
                    <p className="text-sm text-destructive">{errors.practiceArea.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Case Type</label>
                  <Input placeholder="e.g., Auto Accident" {...register('caseType')} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <div className="flex gap-2">
                  {['LOW', 'NORMAL', 'HIGH', 'URGENT'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setValue('priority', p as any)}
                      className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                        watch('priority') === p
                          ? p === 'URGENT'
                            ? 'bg-red-100 border-red-500 text-red-700'
                            : p === 'HIGH'
                            ? 'bg-orange-100 border-orange-500 text-orange-700'
                            : 'bg-law-navy text-white border-law-navy'
                          : 'bg-white border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="button" variant="navy" onClick={() => setStep(2)}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Financial */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Information
              </CardTitle>
              <CardDescription>Set up billing and fee arrangements.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fee Arrangement</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {feeArrangements.map((fee) => (
                    <button
                      key={fee.value}
                      type="button"
                      onClick={() => setValue('feeArrangement', fee.value as any)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        feeArrangement === fee.value
                          ? 'bg-law-navy text-white border-law-navy'
                          : 'bg-white border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {fee.label}
                    </button>
                  ))}
                </div>
              </div>

              {feeArrangement === 'CONTINGENCY' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contingency Percentage</label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="33"
                      className="pr-8"
                      {...register('contingencyPercent', { valueAsNumber: true })}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estimated Case Value</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="0"
                      className="pl-7"
                      {...register('estimatedValue', { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Retainer Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="0"
                      className="pl-7"
                      {...register('retainerAmount', { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="button" variant="navy" onClick={() => setStep(3)}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Important Dates */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Important Dates
              </CardTitle>
              <CardDescription>Set key deadlines and dates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Statute of Limitations</label>
                <Input type="date" {...register('statuteOfLimitations')} />
                <p className="text-xs text-gray-500">
                  Critical deadline - AI will calculate reminders automatically
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>AI Deadline Calculator:</strong> Once you create this case, our AI
                  will automatically calculate relevant deadlines based on the practice area
                  and jurisdiction.
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button type="submit" variant="navy" loading={isLoading}>
                  Create Case
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}
