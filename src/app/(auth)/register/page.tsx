'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Scale, Eye, EyeOff, Mail, Lock, User, Building, Sparkles, Shield, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { registerSchema, type RegisterInput } from '@/lib/validators';
import { useToast } from '@/components/ui/use-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterInput & { organizationName?: string }>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterInput & { organizationName?: string }) => {
    if (step === 1) {
      setStep(2);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      toast({
        title: 'Account created!',
        description: 'Please check your email to verify your account.',
        variant: 'success',
      });

      router.push('/login?registered=true');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Registration failed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = password ? getPasswordStrength(password) : 0;
  const strengthColors = ['from-red-500 to-red-400', 'from-orange-500 to-orange-400', 'from-yellow-500 to-yellow-400', 'from-lime-500 to-lime-400', 'from-green-500 to-green-400'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-law-navy via-law-navy/95 to-blue-900" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-law-gold/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 hidden lg:block">
        <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 animate-float">
          <Shield className="h-8 w-8 text-white/80" />
        </div>
      </div>
      <div className="absolute bottom-32 right-20 hidden lg:block">
        <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 animate-float animation-delay-2000">
          <Sparkles className="h-8 w-8 text-law-gold/80" />
        </div>
      </div>
      <div className="absolute top-1/3 right-32 hidden lg:block">
        <div className="p-3 bg-white/10 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 animate-float animation-delay-4000">
          <Scale className="h-6 w-6 text-white/60" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 w-full max-w-md">
        <Card className="w-full relative overflow-hidden border-0 shadow-2xl bg-white/90 backdrop-blur-xl">
          {/* Decorative gradient border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-law-navy/20 via-transparent to-law-gold/20 pointer-events-none" />

          <CardHeader className="relative text-center pb-2">
            <Link href="/" className="flex items-center justify-center gap-3 mb-6 group">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-law-navy to-law-navy/80 flex items-center justify-center shadow-lg shadow-law-navy/30 group-hover:scale-105 transition-transform duration-300">
                  <Scale className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-law-gold rounded-full border-2 border-white flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <span className="font-serif text-2xl font-bold bg-gradient-to-r from-law-navy to-law-navy/80 bg-clip-text text-transparent">
                LawFirm Platform
              </span>
            </Link>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-gray-500">
              {step === 1 ? 'Enter your personal details' : 'Set up your organization'}
            </CardDescription>

            {/* Step Indicator */}
            <div className="flex justify-center items-center gap-3 mt-6">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${step >= 1 ? 'bg-law-navy text-white' : 'bg-gray-100 text-gray-400'}`}>
                {step > 1 ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">1</span>
                )}
                <span className="text-xs font-medium">Details</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300" />
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${step >= 2 ? 'bg-law-navy text-white' : 'bg-gray-100 text-gray-400'}`}>
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">2</span>
                <span className="text-xs font-medium">Organization</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {step === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1 bg-gray-100 rounded-lg group-focus-within:bg-law-navy/10 transition-colors">
                          <User className="h-4 w-4 text-gray-400 group-focus-within:text-law-navy transition-colors" />
                        </div>
                        <Input
                          id="firstName"
                          placeholder="John"
                          className="pl-12 h-12 bg-gray-50/50 border-gray-200 focus:border-law-navy focus:ring-law-navy/20 rounded-xl transition-all"
                          error={!!errors.firstName}
                          {...register('firstName')}
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-500 rounded-full" />
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        className="h-12 bg-gray-50/50 border-gray-200 focus:border-law-navy focus:ring-law-navy/20 rounded-xl transition-all"
                        error={!!errors.lastName}
                        {...register('lastName')}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-500 rounded-full" />
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1 bg-gray-100 rounded-lg group-focus-within:bg-law-navy/10 transition-colors">
                        <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-law-navy transition-colors" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@lawfirm.com"
                        className="pl-12 h-12 bg-gray-50/50 border-gray-200 focus:border-law-navy focus:ring-law-navy/20 rounded-xl transition-all"
                        error={!!errors.email}
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1 bg-gray-100 rounded-lg group-focus-within:bg-law-navy/10 transition-colors">
                        <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-law-navy transition-colors" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-12 pr-12 h-12 bg-gray-50/50 border-gray-200 focus:border-law-navy focus:ring-law-navy/20 rounded-xl transition-all"
                        error={!!errors.password}
                        {...register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {password && (
                      <div className="space-y-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full transition-all ${
                                i < passwordStrength
                                  ? `bg-gradient-to-r ${strengthColors[passwordStrength - 1]}`
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs font-medium ${passwordStrength >= 4 ? 'text-green-600' : passwordStrength >= 3 ? 'text-lime-600' : passwordStrength >= 2 ? 'text-yellow-600' : 'text-red-500'}`}>
                          Strength: {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Enter password'}
                        </p>
                      </div>
                    )}
                    {errors.password && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1 bg-gray-100 rounded-lg group-focus-within:bg-law-navy/10 transition-colors">
                        <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-law-navy transition-colors" />
                      </div>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-12 h-12 bg-gray-50/50 border-gray-200 focus:border-law-navy focus:ring-law-navy/20 rounded-xl transition-all"
                        error={!!errors.confirmPassword}
                        {...register('confirmPassword')}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full" />
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <div className="space-y-2 animate-in slide-in-from-right-5 duration-300">
                  <label htmlFor="organizationName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Building className="h-4 w-4 text-law-navy" />
                    Law Firm Name
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1 bg-gray-100 rounded-lg group-focus-within:bg-law-navy/10 transition-colors">
                      <Building className="h-4 w-4 text-gray-400 group-focus-within:text-law-navy transition-colors" />
                    </div>
                    <Input
                      id="organizationName"
                      placeholder="Smith & Associates"
                      className="pl-12 h-12 bg-gray-50/50 border-gray-200 focus:border-law-navy focus:ring-law-navy/20 rounded-xl transition-all"
                      {...register('organizationName')}
                    />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-law-gold" />
                    You can skip this and create an organization later.
                  </p>
                </div>
              )}

              <div className="flex gap-4 pt-2">
                {step === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12 rounded-xl border-gray-200 hover:border-gray-300"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-gradient-to-r from-law-navy to-law-navy/90 hover:from-law-navy/90 hover:to-law-navy shadow-lg shadow-law-navy/25 hover:shadow-law-navy/40 transition-all duration-300 hover:scale-[1.02] rounded-xl text-base font-semibold"
                  loading={isLoading}
                >
                  {step === 1 ? (
                    <>
                      Continue
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  ) : isLoading ? (
                    'Creating Account...'
                  ) : (
                    <>
                      Create Account
                      <CheckCircle2 className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            {step === 1 && (
              <>
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 rounded-xl border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group"
                  onClick={() => {
                    // Handle Google sign up
                  }}
                >
                  <svg className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </>
            )}
          </CardContent>
          <CardFooter className="relative flex flex-col gap-4 pb-8">
            <p className="text-xs text-center text-gray-500">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-law-navy hover:text-law-gold font-medium transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-law-navy hover:text-law-gold font-medium transition-colors">
                Privacy Policy
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-law-navy font-semibold hover:text-law-gold transition-colors">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Trust Badge */}
        <div className="mt-8 flex items-center justify-center gap-4 text-white/60 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>256-bit SSL</span>
          </div>
          <div className="w-1 h-1 bg-white/40 rounded-full" />
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Secure Signup</span>
          </div>
        </div>
      </div>
    </div>
  );
}
