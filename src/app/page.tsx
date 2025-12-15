import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Scale,
  Users,
  FileText,
  Calendar,
  Shield,
  Zap,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Star,
  Play,
  Sparkles,
  BarChart3,
  Globe,
  Lock,
  Clock,
  ChevronRight,
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Client Portal',
    description: 'Give clients 24/7 secure access to their cases, documents, and communications.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FileText,
    title: 'Smart Documents',
    description: 'AI-powered document analysis, e-signatures, and automated organization.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Calendar,
    title: 'Scheduling',
    description: 'Integrated calendar with video consultations and automatic reminders.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: MessageSquare,
    title: 'Secure Messaging',
    description: 'Encrypted client communication with AI-suggested responses.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Real-time insights into case progress, billing, and firm performance.',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption, 2FA, and full compliance with legal standards.',
    gradient: 'from-slate-500 to-zinc-600',
  },
];

const stats = [
  { value: '10,000+', label: 'Active Cases' },
  { value: '500+', label: 'Law Firms' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'Rating' },
];

const testimonials = [
  {
    quote: "This platform transformed how we interact with clients. The AI features alone save us hours every day.",
    author: "Sarah Mitchell",
    role: "Managing Partner",
    firm: "Mitchell & Associates",
    avatar: "SM",
  },
  {
    quote: "Finally, a legal tech solution that actually understands what law firms need. The client portal is exceptional.",
    author: "James Rodriguez",
    role: "Senior Attorney",
    firm: "Rodriguez Law Group",
    avatar: "JR",
  },
  {
    quote: "The ROI was immediate. We reduced administrative work by 60% in the first month.",
    author: "Emily Chen",
    role: "Operations Director",
    firm: "Chen Legal Partners",
    avatar: "EC",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-law-gold/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                <div className="relative bg-gradient-to-br from-law-navy to-blue-700 p-2 rounded-xl shadow-lg">
                  <Scale className="h-6 w-6 md:h-7 md:w-7 text-white" />
                </div>
              </div>
              <span className="font-serif text-xl md:text-2xl font-bold text-law-navy">
                LawFirm<span className="text-law-gold">Pro</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-600 hover:text-law-navy font-medium transition-colors">
                Features
              </Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-law-navy font-medium transition-colors">
                Testimonials
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-law-navy font-medium transition-colors">
                Pricing
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:flex font-semibold">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="btn-premium text-white px-4 md:px-6">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-law-navy/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-law-gold/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-law-navy/5 border border-law-navy/10 mb-6 animate-fade-in">
                <Sparkles className="h-4 w-4 text-law-gold" />
                <span className="text-sm font-semibold text-law-navy">AI-Powered Legal Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-law-navy leading-tight mb-6 animate-slide-up">
                Transform Your
                <span className="block mt-2">
                  <span className="gradient-text-gold">Law Firm&apos;s</span>
                </span>
                <span className="block mt-2">Client Experience</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 mb-8 animate-slide-up stagger-1 opacity-0" style={{ animationFillMode: 'forwards' }}>
                The all-in-one platform to invite clients, manage cases, and grow your practice
                with AI-powered automation and enterprise-grade security.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up stagger-2 opacity-0" style={{ animationFillMode: 'forwards' }}>
                <Link href="/register">
                  <Button size="lg" className="btn-premium text-white w-full sm:w-auto text-lg px-8 py-6">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-2 hover:bg-gray-50 group">
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-10 animate-slide-up stagger-3 opacity-0" style={{ animationFillMode: 'forwards' }}>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">256-bit Encryption</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">99.9% Uptime</span>
                </div>
              </div>
            </div>

            {/* Right Content - Dashboard Preview */}
            <div className="relative animate-slide-in-right opacity-0 stagger-2" style={{ animationFillMode: 'forwards' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-law-navy/20 to-law-gold/20 rounded-3xl blur-2xl" />
              <div className="relative glass-card p-2 md:p-3">
                {/* Mock Dashboard */}
                <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-inner">
                  {/* Top Bar */}
                  <div className="bg-white px-4 py-3 border-b flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-lg h-6" />
                  </div>
                  {/* Content */}
                  <div className="p-4 md:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="h-4 w-32 bg-law-navy/10 rounded mb-2" />
                        <div className="h-3 w-24 bg-gray-200 rounded" />
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-law-navy to-blue-600 shadow-lg" />
                    </div>
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-3 shadow-soft hover:shadow-md transition-shadow">
                          <div className="h-6 w-12 bg-law-gold/20 rounded mb-2" />
                          <div className="h-2 w-16 bg-gray-200 rounded" />
                        </div>
                      ))}
                    </div>
                    {/* Chart Area */}
                    <div className="bg-white rounded-xl p-4 shadow-soft">
                      <div className="flex items-end gap-2 h-24">
                        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-law-navy to-blue-500 rounded-t-lg transition-all duration-300 hover:from-law-gold hover:to-amber-400 cursor-pointer"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>
                    {/* Task List */}
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-soft hover:shadow-md transition-shadow cursor-pointer">
                          <div className="w-4 h-4 rounded-full border-2 border-law-navy" />
                          <div className="flex-1 h-2 bg-gray-200 rounded" />
                          <div className="h-5 w-16 bg-green-100 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-premium p-4 animate-float hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Case Updated</p>
                    <p className="text-xs text-gray-500">Smith vs. Corp</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-premium p-4 animate-float hidden md:block" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-law-gold/20 flex items-center justify-center">
                    <Star className="h-5 w-5 text-law-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">New Review</p>
                    <p className="text-xs text-gray-500">5.0 Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 md:py-24 gradient-hero overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-blue-200 font-medium text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-law-navy/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-law-gold/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-law-navy/5 border border-law-navy/10 mb-6">
              <Zap className="h-4 w-4 text-law-gold" />
              <span className="text-sm font-semibold text-law-navy">Powerful Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-law-navy mb-6">
              Everything You Need to
              <span className="gradient-text-gold"> Succeed</span>
            </h2>
            <p className="text-lg text-gray-600">
              A comprehensive suite of tools designed specifically for modern law firms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="premium-card group cursor-pointer border-0">
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <feature.icon className="h-full w-full text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-law-navy transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <div className="mt-4 flex items-center text-law-navy font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 mb-6">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-700">AI-Powered</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-law-navy mb-6">
                Let AI Handle the
                <span className="block gradient-text-gold">Heavy Lifting</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our advanced AI analyzes documents, predicts case outcomes, drafts responses,
                and automates repetitive tasks so you can focus on what matters most.
              </p>
              <div className="space-y-4">
                {[
                  'Smart document analysis and summarization',
                  'Automated client intake and conflict checking',
                  'AI-powered response suggestions',
                  'Predictive case outcome analysis',
                  'Intelligent deadline management',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 group-hover:scale-110 transition-all">
                      <CheckCircle className="h-4 w-4 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/register" className="inline-block mt-8">
                <Button className="btn-premium text-white">
                  Try AI Features Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 md:p-8 shadow-premium overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl" />
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-gray-500 text-sm">ai-assistant.tsx</span>
                </div>
                <div className="space-y-4 font-mono text-sm">
                  <div className="text-purple-400">{`// AI Document Analysis`}</div>
                  <div className="text-green-400 animate-pulse">Analyzing contract.pdf...</div>
                  <div className="text-gray-400 mt-4">
                    <span className="text-blue-400">Found:</span> 12 key clauses
                  </div>
                  <div className="text-gray-400">
                    <span className="text-yellow-400">Risk Level:</span> <span className="px-2 py-0.5 bg-yellow-500/20 rounded text-yellow-300">Medium</span>
                  </div>
                  <div className="text-gray-400">
                    <span className="text-pink-400">Suggested:</span> Review Section 4.2
                  </div>
                  <div className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="text-green-400 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Analysis complete in 2.3s
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 md:py-32 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-law-gold/10 border border-law-gold/20 mb-6">
              <Star className="h-4 w-4 text-law-gold" />
              <span className="text-sm font-semibold text-amber-700">Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-law-navy mb-6">
              Trusted by Leading
              <span className="gradient-text-gold"> Law Firms</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="premium-card border-0 group">
                <CardContent className="p-6 md:p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-law-gold text-law-gold" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-law-navy to-blue-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.firm}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-law-gold/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of law firms already using LawFirmPro to deliver exceptional client experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="btn-gold w-full sm:w-auto text-lg px-8 py-6">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
              Schedule Demo
            </Button>
          </div>
          <p className="mt-6 text-blue-200 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-12">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-law-navy to-blue-700 p-2 rounded-xl">
                  <Scale className="h-6 w-6 text-white" />
                </div>
                <span className="font-serif text-xl font-bold text-white">
                  LawFirm<span className="text-law-gold">Pro</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed">
                The modern platform for forward-thinking law firms.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2024 LawFirmPro. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Globe className="h-5 w-5" />
              <span className="text-sm">English (US)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
