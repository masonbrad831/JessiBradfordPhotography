import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-logo-cream/90 border-b-2 border-logo-sage/40 shadow-lg backdrop-blur-md">
      <div className="container-custom flex items-center justify-between h-24 relative">
        <Link to="/" className="flex items-center group relative z-20 hover:scale-105 transition-transform duration-300 header-logo-link">
          <div className="relative flex items-center">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-36 h-36 flex items-center justify-center header-logo-badge">
              <div className="w-36 h-36 rounded-full bg-logo-cream border-4 border-logo-sage shadow-xl overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <img src="/images/icon.png" alt="Logo" className="header-logo-img" />
              </div>
            </div>
            <div className="flex flex-col justify-center header-text">
              <h1 className="text-xl font-cursive font-semibold text-logo-terracotta">Jessi Bradford</h1>
              <p className="text-sm text-logo-green font-light tracking-widest">PHOTOGRAPHY</p>
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 ml-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`relative font-medium transition-all duration-300 ${
                isActive(item.href)
                  ? 'text-logo-green border-b-2 border-logo-terracotta font-semibold'
                  : 'text-logo-brown hover:text-logo-green hover:border-b-2 hover:border-logo-sage'
              }`}
            >
              {item.name}
              {isActive(item.href) && <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-logo-terracotta" />}
              <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-logo-sage scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden ml-4 p-2 rounded-md border border-logo-sage text-logo-brown hover:text-logo-green hover:bg-logo-cream transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-logo-sage focus:ring-offset-2"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mobile-nav-bg px-2 pt-2 pb-3 space-y-1">
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
      )}
    </header>
  );
};

export default Header;