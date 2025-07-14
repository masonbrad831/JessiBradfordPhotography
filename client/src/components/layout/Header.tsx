import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Camera } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Booking', href: '/booking' },
    { name: 'Client Gallery', href: '/client-gallery' },
    { name: 'Reviews', href: '/reviews' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="relative bg-logo-cream/90 shadow-lg sticky top-0 z-50 border-b-2 border-logo-sage/40 backdrop-blur-md">
      <div className="container-custom relative flex items-center justify-between h-24">
        {/* Logo and Name Row */}
        <Link to="/" className="flex items-center group relative z-20 transition-transform duration-300 hover:scale-105" style={{ minWidth: '0' }}>
          {/* Logo Badge - breakout */}
          <div className="relative flex items-center">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-36 h-36 flex items-center justify-center" style={{ zIndex: 10 }}>
              <div className="rounded-full bg-logo-cream border-4 border-logo-sage shadow-xl overflow-hidden w-36 h-36 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <img src="/images/logo.png" alt="Jessi Bradford Photography Logo" className="w-32 h-32 object-contain" />
              </div>
            </div>
            <div className="pl-40 flex flex-col justify-center min-w-0">
              <h1 className="text-xl font-cursive font-semibold text-logo-terracotta whitespace-nowrap overflow-hidden text-ellipsis">Jessi Bradford</h1>
              <p className="text-sm text-logo-green font-light tracking-widest" style={{ letterSpacing: '0.15em' }}>PHOTOGRAPHY</p>
            </div>
          </div>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 ml-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`font-medium transition-all duration-300 relative group ${
                isActive(item.href)
                  ? 'text-logo-green border-b-2 border-logo-terracotta font-semibold'
                  : 'text-logo-brown hover:text-logo-green hover:border-b-2 hover:border-logo-sage'
              }`}
            >
              {item.name}
              {isActive(item.href) && (
                <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-logo-terracotta transform scale-x-100 transition-transform duration-300"></div>
              )}
              <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-logo-sage transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </Link>
          ))}
        </nav>
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-md text-logo-brown hover:text-logo-green hover:bg-logo-cream transition-all duration-300 border border-logo-sage ml-4 focus:outline-none focus:ring-2 focus:ring-logo-sage focus:ring-offset-2"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-logo-cream border-t-2 border-logo-sage">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? 'text-logo-green bg-logo-sage border-l-4 border-logo-terracotta'
                    : 'text-logo-brown hover:text-logo-green hover:bg-logo-cream'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 