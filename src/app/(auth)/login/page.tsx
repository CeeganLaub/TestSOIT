'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Scale, Eye, EyeOff, Mail, Lock, Smartphone, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { loginSchema, type LoginInput } from '@/lib/validators';
import { useToast } from '@/components/ui/use-toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        twoFactorCode: data.twoFactorCode,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === '2FA_REQUIRED') {
          setRequires2FA(true);
          toast({
            title: 'Two-Factor Authentication',
            description: 'Please enter your 2FA code to continue.',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Welcome back!',
          description: 'You have been successfully logged in.',
          variant: 'success',
        });
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md relative overflow-hidden border-0 shadow-2xl bg-white/90 backdrop-blur-xl">
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
          Welcome Back
        </CardTitle>
        <CardDescription className="text-gray-500">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            {errors.password && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full" />
                {errors.password.message}
              </p>
            )}
          </div>

          {requires2FA && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label htmlFor="twoFactorCode" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Shield className="h-4 w-4 text-law-navy" />
                Two-Factor Code
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1 bg-gray-100 rounded-lg group-focus-within:bg-law-navy/10 transition-colors">
                  <Smartphone className="h-4 w-4 text-gray-400 group-focus-within:text-law-navy transition-colors" />
                </div>
                <Input
                  id="twoFactorCode"
                  type="text"
                  placeholder="123456"
                  className="pl-12 h-12 bg-gray-50/50 border-gray-200 focus:border-law-navy focus:ring-law-navy/20 rounded-xl transition-all text-center text-lg tracking-[0.5em] font-mono"
                  maxLength={6}
                  {...register('twoFactorCode')}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-law-navy focus:ring-law-navy/20" />
              <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-law-navy hover:text-law-gold font-medium transition-colors">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-law-navy to-law-navy/90 hover:from-law-navy/90 hover:to-law-navy shadow-lg shadow-law-navy/25 hover:shadow-law-navy/40 transition-all duration-300 hover:scale-[1.02] rounded-xl text-base font-semibold"
            loading={isLoading}
          >
            {isLoading ? (
              'Signing in...'
            ) : (
              <>
                Sign In
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </form>

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
          onClick={() => signIn('google', { callbackUrl })}
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
      </CardContent>
      <CardFooter className="relative flex justify-center pb-8">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-law-navy font-semibold hover:text-law-gold transition-colors">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

function LoginLoading() {
  return (
    <Card className="w-full max-w-md border-0 shadow-2xl bg-white/90 backdrop-blur-xl">
      <CardContent className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="flex justify-center">
            <div className="w-14 h-14 bg-gray-200 rounded-2xl" />
          </div>
          <div className="h-8 bg-gray-200 rounded-lg w-3/4 mx-auto" />
          <div className="h-4 bg-gray-200 rounded-lg w-1/2 mx-auto" />
          <div className="space-y-4 mt-8">
            <div className="h-12 bg-gray-200 rounded-xl" />
            <div className="h-12 bg-gray-200 rounded-xl" />
            <div className="h-12 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
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
        <Suspense fallback={<LoginLoading />}>
          <LoginForm />
        </Suspense>

        {/* Trust Badge */}
        <div className="mt-8 flex items-center justify-center gap-4 text-white/60 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>256-bit SSL</span>
          </div>
          <div className="w-1 h-1 bg-white/40 rounded-full" />
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Secure Login</span>
          </div>
        </div>
      </div>
    </div>
  );
}
