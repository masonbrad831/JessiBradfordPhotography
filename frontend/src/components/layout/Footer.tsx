import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Camera } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-sage-800 text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-sage-600 rounded-full">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold">Jessi Bradford</h3>
                <p className="text-sage-200">Photography</p>
              </div>
            </div>
            <p className="text-sage-200 mb-4 max-w-md">
              Capturing life's beautiful moments with a moody, artistic approach. 
              Specializing in portraits, couples, and family photography in Salina, Utah.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/JessiBradfordphotography"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-sage-700 rounded-full hover:bg-sage-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/jessibradfordphotography"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-sage-700 rounded-full hover:bg-sage-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/portfolio" className="text-sage-200 hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sage-200 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sage-200 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sage-200 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/client-gallery" className="text-sage-200 hover:text-white transition-colors">
                  Client Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-sage-300" />
                <a
                  href="mailto:bradford.j.photos@gmail.com"
                  className="text-sage-200 hover:text-white transition-colors"
                >
                  bradford.j.photos@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-sage-300" />
                <a
                  href="tel:385-457-6487"
                  className="text-sage-200 hover:text-white transition-colors"
                >
                  (385) 457-6487
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-sage-300" />
                <span className="text-sage-200">
                  Salina, Utah<br />
                  Serving Sevier County
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sage-700 mt-8 pt-8 text-center">
          <p className="text-sage-300">
            © {new Date().getFullYear()} Jessi Bradford Photography. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 