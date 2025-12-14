import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Scale,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  Shield,
  Zap,
  BarChart3,
  Brain,
  Globe,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Scale className="h-8 w-8 text-law-navy dark:text-law-gold" />
              <span className="font-serif text-xl font-bold text-law-navy dark:text-white">
                LawFirm Platform
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-gray-600 hover:text-law-navy dark:text-gray-300">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-law-navy dark:text-gray-300">
                Pricing
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-law-navy dark:text-gray-300">
                Sign In
              </Link>
              <Button asChild variant="gold">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-law-navy dark:text-white mb-6">
            Transform Your Law Firm&apos;s
            <span className="text-law-gold"> Client Experience</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            The all-in-one platform to invite clients, manage cases, and grow your practice.
            Built with AI-powered automation and enterprise-grade security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="xl" variant="navy">
              <Link href="/register">Start Free Trial</Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/demo">Watch Demo</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-law-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold text-law-gold">500+</div>
              <div className="text-gray-300">Law Firms</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-law-gold">50K+</div>
              <div className="text-gray-300">Active Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-law-gold">1M+</div>
              <div className="text-gray-300">Documents Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-law-gold">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-law-navy dark:text-white mb-4">
              Everything You Need to Run a Modern Law Practice
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Streamline operations, delight clients, and grow your firm with powerful tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Users className="h-10 w-10 text-law-gold mb-2" />
                <CardTitle>Client Invitation System</CardTitle>
                <CardDescription>
                  Invite clients via email, SMS, or QR code. Track every interaction.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Globe className="h-10 w-10 text-law-gold mb-2" />
                <CardTitle>Custom Landing Pages</CardTitle>
                <CardDescription>
                  Beautiful, customizable pages for each attorney or practice area.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <FileText className="h-10 w-10 text-law-gold mb-2" />
                <CardTitle>Document Management</CardTitle>
                <CardDescription>
                  Secure upload, storage, and AI-powered document analysis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <MessageSquare className="h-10 w-10 text-law-gold mb-2" />
                <CardTitle>Secure Messaging</CardTitle>
                <CardDescription>
                  End-to-end encrypted communication with clients and team.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Calendar className="h-10 w-10 text-law-gold mb-2" />
                <CardTitle>Smart Scheduling</CardTitle>
                <CardDescription>
                  AI-optimized appointment booking with video integration.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Shield className="h-10 w-10 text-law-gold mb-2" />
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  2FA, audit logs, and compliance-ready infrastructure.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Brain className="h-10 w-10 text-law-gold mb-2" />
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>
                  Case predictions, document analysis, and sentiment tracking.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Zap className="h-10 w-10 text-law-gold mb-2" />
                <CardTitle>Workflow Automation</CardTitle>
                <CardDescription>
                  Automate tasks, reminders, and client communication.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-law-gold mb-2" />
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Track performance, revenue, and client satisfaction.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-law-navy dark:text-white mb-4">
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              30+ AI features to automate your practice and delight your clients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-law-navy dark:text-white mb-4">
                AI Document Analyzer
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-law-gold">✓</span> Extract key terms and dates
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-law-gold">✓</span> Identify risks and red flags
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-law-gold">✓</span> Generate plain-language summaries
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-law-navy dark:text-white mb-4">
                Case Strength Predictor
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-law-gold">✓</span> Win probability analysis
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-law-gold">✓</span> Settlement range estimates
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-law-gold">✓</span> Similar case comparisons
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-law-navy dark:text-white mb-4">
                AI Client Assistant
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-law-gold">✓</span> 24/7 chatbot support
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-law-gold">✓</span> Schedule appointments automatically
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-law-gold">✓</span> Answer case status questions
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-law-navy dark:text-white mb-4">
                Smart Deadline Tracker
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-law-gold">✓</span> Auto-calculate court deadlines
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-law-gold">✓</span> Jurisdiction-aware rules
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-law-gold">✓</span> Cascading reminders
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-law-navy">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join hundreds of law firms already using LawFirm Platform to grow their practice.
          </p>
          <Button asChild size="xl" variant="gold">
            <Link href="/register">Start Your Free Trial</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scale className="h-6 w-6 text-law-gold" />
                <span className="font-serif text-lg font-bold text-white">LawFirm Platform</span>
              </div>
              <p className="text-gray-400 text-sm">
                The modern platform for modern law firms.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#features">Features</Link></li>
                <li><Link href="#pricing">Pricing</Link></li>
                <li><Link href="/integrations">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/careers">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
                <li><Link href="/security">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} LawFirm Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
