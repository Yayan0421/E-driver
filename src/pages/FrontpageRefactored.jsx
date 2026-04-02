import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarRefactored from '../components/frontapage/NavbarRefactored';
import {
  Container,
  SectionTitle,
  Button,
  ResponsiveGrid,
  ResponsiveFlex,
  Card,
  StatCard,
} from '../components/Reusable/ResponsiveComponents';

export default function FrontpageRefactored() {
  const navigate = useNavigate();

  // Hero Section Features
  const heroFeatures = [
    { icon: '🏍️', label: 'Fast Pickup', value: '< 5 mins' },
    { icon: '✨', label: 'Safe Rides', value: '100%' },
    { icon: '💰', label: 'Best Rates', value: 'Affordable' },
    { icon: '⭐', label: 'Rated 5★', value: '4.9/5' },
    { icon: '🛡️', label: 'Insured', value: 'Full Cover' },
    { icon: '👥', label: 'Verified', value: 'Drivers' },
  ];

  // Stats Section
  const stats = [
    { icon: '🚗', label: 'Active Drivers', value: '2,500+' },
    { icon: '👥', label: 'Happy Users', value: '50K+' },
    { icon: '📍', label: 'Cities', value: '12' },
    { icon: '✅', label: 'Completed Rides', value: '100K+' },
  ];

  // How It Works
  const steps = [
    {
      number: '1',
      title: 'Download App',
      description: 'Get the E-Sakay app on your phone',
      icon: '📱'
    },
    {
      number: '2',
      title: 'Book Ride',
      description: 'Enter your destination and book',
      icon: '📍'
    },
    {
      number: '3',
      title: 'Meet Driver',
      description: 'Driver arrives in minutes',
      icon: '⏱️'
    },
    {
      number: '4',
      title: 'Enjoy Ride',
      description: 'Safe and comfortable journey',
      icon: '🏍️'
    },
  ];

  return (
    <div className="w-full overflow-x-hidden">
      {/* Navbar */}
      <NavbarRefactored />

      {/* ===== HERO SECTION ===== */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-10 md:py-16 lg:py-20 w-full">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16">
            
            {/* Left Content */}
            <div className="w-full md:w-1/2 space-y-4 md:space-y-6 text-center md:text-left">
              <SectionTitle subtitle="Motorcycle Ride-Hailing Service">
                Safe, Fast &{' '}
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Reliable
                </span>
              </SectionTitle>

              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                Experience the fastest and most convenient motorcycle ride-hailing service in your area. Book now and enjoy your first ride with special discounts.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 md:pt-4">
                <Button 
                  variant="primary"
                  fullWidth={false}
                  onClick={() => navigate('/signup')}
                >
                  🚙 Get Started
                </Button>
                <Button 
                  variant="outline"
                  fullWidth={false}
                  onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right Content - Feature Grid */}
            <div className="w-full md:w-1/2">
              <ResponsiveGrid cols={{ mobile: 2, tablet: 3, desktop: 3, large: 3 }}>
                {heroFeatures.map((feature, idx) => (
                  <Card key={idx} hover>
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="text-4xl md:text-5xl">{feature.icon}</div>
                      <p className="text-xs md:text-sm font-semibold text-gray-700">
                        {feature.label}
                      </p>
                      <p className="text-lg md:text-xl font-bold text-green-600">
                        {feature.value}
                      </p>
                    </div>
                  </Card>
                ))}
              </ResponsiveGrid>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-12 md:py-16 lg:py-20 bg-white w-full">
        <Container>
          <div className="text-center mb-10 md:mb-12 lg:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose E-Sakay?
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              Join thousands of satisfied riders and drivers on the most reliable platform.
            </p>
          </div>

          <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 2, large: 4 }}>
            {stats.map((stat, idx) => (
              <StatCard 
                key={idx}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
              />
            ))}
          </ResponsiveGrid>
        </Container>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="about" className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-gray-100 w-full">
        <Container>
          <div className="text-center mb-10 md:mb-12 lg:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              Book a ride in 4 simple steps
            </p>
          </div>

          {/* Steps Grid */}
          <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 2, large: 4 }}>
            {steps.map((step, idx) => (
              <Card key={idx} className="relative">
                {/* Step Number Badge */}
                <div className="absolute -top-4 -right-4 w-10 h-10 md:w-12 md:h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg md:text-xl shadow-lg">
                  {step.number}
                </div>

                {/* Content */}
                <div className="space-y-4 pt-4">
                  <div className="text-5xl md:text-6xl">{step.icon}</div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    {step.description}
                  </p>
                </div>

                {/* Connector Line (Hidden on mobile) */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 w-12 h-1 bg-green-200" />
                )}
              </Card>
            ))}
          </ResponsiveGrid>
        </Container>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-green-600 to-green-700 text-white w-full">
        <Container>
          <div className="text-center space-y-6 md:space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Ready to Ride?
              </h2>
              <p className="text-green-100 text-base md:text-lg max-w-2xl mx-auto">
                Join E-Sakay today and get 20% off your first ride!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => navigate('/signup')}
                className="px-6 md:px-8 py-3 md:py-4 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 text-base md:text-lg"
              >
                Sign Up as Passenger
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 md:px-8 py-3 md:py-4 border-2 border-white text-white hover:bg-white hover:text-green-600 font-bold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 text-base md:text-lg"
              >
                Become a Driver
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-gray-300 py-8 md:py-12 w-full">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg">E-Sakay</h3>
              <p className="text-sm">Safe, fast, and reliable motorcycle rides.</p>
            </div>

            {/* Links */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#home" className="hover:text-white transition">Home</a></li>
                <li><a href="#about" className="hover:text-white transition">About</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>Email: info@esakay.com</li>
                <li>Phone: +1234567890</li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>&copy; 2026 E-Sakay. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
