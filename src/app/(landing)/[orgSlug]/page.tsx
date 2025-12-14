import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  Calendar,
  MessageSquare,
} from 'lucide-react';

interface LandingPageProps {
  params: { orgSlug: string };
}

async function getOrganizationLanding(slug: string) {
  const org = await prisma.organization.findUnique({
    where: { slug },
    include: {
      branding: true,
      settings: true,
      landingPages: {
        where: { status: 'PUBLISHED' },
        take: 1,
      },
      users: {
        where: { isActive: true, role: { in: ['OWNER', 'ATTORNEY'] } },
        include: { user: true },
        take: 10,
      },
    },
  });

  return org;
}

export default async function OrganizationLandingPage({ params }: LandingPageProps) {
  const org = await getOrganizationLanding(params.orgSlug);

  if (!org) {
    notFound();
  }

  const branding = org.branding;
  const landingPage = org.landingPages[0];
  const attorneys = org.users;

  // Default content if no landing page is set up
  const heroContent = landingPage?.heroSection as { headline?: string; subheadline?: string } || {
    headline: `Welcome to ${org.name}`,
    subheadline: 'Experienced legal representation you can trust.',
  };

  return (
    <div
      className="min-h-screen"
      style={{
        '--primary-color': branding?.primaryColor || '#1a365d',
        '--secondary-color': branding?.secondaryColor || '#d69e2e',
        '--accent-color': branding?.accentColor || '#2d3748',
      } as React.CSSProperties}
    >
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              {org.logo ? (
                <img src={org.logo} alt={org.name} className="h-10" />
              ) : (
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: branding?.primaryColor || '#1a365d' }}
                >
                  {org.name.charAt(0)}
                </div>
              )}
              <span
                className="font-serif text-xl font-bold"
                style={{ color: branding?.primaryColor || '#1a365d' }}
              >
                {org.name}
              </span>
            </div>
            <div className="flex items-center gap-4">
              {org.phone && (
                <a
                  href={`tel:${org.phone}`}
                  className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <Phone className="h-4 w-4" />
                  {org.phone}
                </a>
              )}
              <Button
                style={{ backgroundColor: branding?.secondaryColor || '#d69e2e' }}
                className="text-white hover:opacity-90"
              >
                Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: branding?.primaryColor || '#1a365d' }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
            {heroContent.headline}
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-10">
            {heroContent.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              style={{ backgroundColor: branding?.secondaryColor || '#d69e2e' }}
              className="text-white hover:opacity-90"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Consultation
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
              <MessageSquare className="h-5 w-5 mr-2" />
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-2 text-gray-600">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Free Initial Consultation</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>5-Star Rated</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-5 w-5 text-blue-500" />
              <span>24/7 Availability</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-serif font-bold mb-4"
              style={{ color: branding?.primaryColor || '#1a365d' }}
            >
              About Our Firm
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {org.description || `${org.name} is dedicated to providing exceptional legal services with a personal touch. Our experienced team is committed to achieving the best possible outcomes for our clients.`}
            </p>
          </div>

          {/* Attorneys Grid */}
          {attorneys.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {attorneys.map((attorney) => (
                <Card key={attorney.id} className="text-center">
                  <CardHeader>
                    <div className="mx-auto h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600 mb-4">
                      {attorney.user.avatar ? (
                        <img
                          src={attorney.user.avatar}
                          alt={`${attorney.user.firstName} ${attorney.user.lastName}`}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        `${attorney.user.firstName?.charAt(0)}${attorney.user.lastName?.charAt(0)}`
                      )}
                    </div>
                    <CardTitle>
                      {attorney.user.firstName} {attorney.user.lastName}
                    </CardTitle>
                    <CardDescription>{attorney.user.title || attorney.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {attorney.user.practiceAreas && attorney.user.practiceAreas.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2">
                        {attorney.user.practiceAreas.slice(0, 3).map((area) => (
                          <span
                            key={area}
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: branding?.primaryColor || '#1a365d' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl opacity-90 mb-8">
                Schedule a free consultation today and let us help you navigate your legal matters.
              </p>
              <div className="space-y-4">
                {org.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5" />
                    <a href={`tel:${org.phone}`} className="hover:underline">
                      {org.phone}
                    </a>
                  </div>
                )}
                {org.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5" />
                    <a href={`mailto:${org.email}`} className="hover:underline">
                      {org.email}
                    </a>
                  </div>
                )}
                {org.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5" />
                    <span>
                      {org.address}
                      {org.city && `, ${org.city}`}
                      {org.state && `, ${org.state}`}
                      {org.zipCode && ` ${org.zipCode}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Request a Consultation</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">First Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">How can we help?</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    style={{ backgroundColor: branding?.secondaryColor || '#d69e2e' }}
                  >
                    Submit Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {org.name}. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Attorney advertising. Prior results do not guarantee a similar outcome.
          </p>
        </div>
      </footer>
    </div>
  );
}
