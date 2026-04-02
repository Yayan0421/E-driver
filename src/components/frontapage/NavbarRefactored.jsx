import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/image/logo.jpg';

export default function NavbarRefactored() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
      {/* Main Navbar Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo Section - Responsive Size */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <img 
              src={logo} 
              alt="E-Sakay Logo" 
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-white"
            />
            <span className="text-lg sm:text-xl md:text-2xl font-bold whitespace-nowrap">
              E-Sakay
            </span>
          </div>

          {/* Desktop Menu - Hidden on Mobile, Visible on MD+ */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a 
                  href={link.href}
                  className="text-white hover:text-green-100 font-medium transition-colors duration-200 text-sm lg:text-base"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right Section - CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Driver Portal Button - Full Width on Mobile (up to sm), Auto on Desktop */}
            <button 
              onClick={() => navigate('/signup')}
              className="px-3 sm:px-4 md:px-6 py-2 md:py-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold text-xs sm:text-sm md:text-base rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-1 md:gap-2 whitespace-nowrap"
            >
              <span className="text-sm md:text-base">🚙</span>
              <span className="hidden sm:inline">Driver Portal</span>
              <span className="sm:hidden">Driver</span>
            </button>

            {/* Mobile Hamburger Menu - Visible Only on Tablets and Below */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-green-700 rounded-lg transition-colors duration-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <span className="text-2xl">✕</span>
              ) : (
                <span className="text-2xl">☰</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Full Width Dropdown (Visible Only on Mobile) */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-green-500 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
