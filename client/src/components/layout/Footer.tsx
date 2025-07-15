import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Camera, Twitter, Youtube } from 'lucide-react';
import { fetchResource } from '../../api';

interface Settings {
  businessInfo: {
    businessName: string;
    email: string;
    phone: string;
    location: string;
    address: string;
    website: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    pinterest: string;
    twitter: string;
    youtube: string;
    tiktok: string;
  };
}

const Footer: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    businessInfo: {
      businessName: "Jessi Bradford Photography",
      email: "jessi@jessibradfordphotography.com",
      phone: "(555) 123-4567",
      location: "Salina, Utah",
      address: "123 Main Street, Salina, UT 84654",
      website: "https://jessibradfordphotography.com"
    },
    socialMedia: {
      facebook: "",
      instagram: "",
      pinterest: "",
      twitter: "",
      youtube: "",
      tiktok: ""
    }
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await fetchResource('Settings');
        if (data) {
          setSettings(data);
        }
      } catch (e) {
        console.log('Using default settings for footer');
      }
    }
    loadSettings();
  }, []);

  const socialLinks = [
    { platform: 'facebook', url: settings.socialMedia.facebook, icon: Facebook, color: 'hover:bg-blue-600' },
    { platform: 'instagram', url: settings.socialMedia.instagram, icon: Instagram, color: 'hover:bg-pink-600' },
    { platform: 'twitter', url: settings.socialMedia.twitter, icon: Twitter, color: 'hover:bg-blue-400' },
    { platform: 'youtube', url: settings.socialMedia.youtube, icon: Youtube, color: 'hover:bg-red-600' },
  ].filter(link => link.url); // Only show social links that have URLs

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
                <h3 className="text-xl font-serif font-semibold">{settings.businessInfo.businessName}</h3>
                <p className="text-sage-200">Photography</p>
              </div>
            </div>
            <p className="text-sage-200 mb-4 max-w-md">
              Capturing life's beautiful moments with a moody, artistic approach. 
              Specializing in portraits, couples, and family photography in {settings.businessInfo.location}.
            </p>
            {socialLinks.length > 0 && (
            <div className="flex space-x-4">
                {socialLinks.map(({ platform, url, icon: Icon, color }) => (
              <a
                    key={platform}
                    href={url}
                target="_blank"
                rel="noopener noreferrer"
                    className={`p-2 bg-sage-700 rounded-full ${color} transition-colors`}
              >
                    <Icon className="w-5 h-5" />
              </a>
                ))}
            </div>
            )}
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
                  href={`mailto:${settings.businessInfo.email}`}
                  className="text-sage-200 hover:text-white transition-colors"
                >
                  {settings.businessInfo.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-sage-300" />
                <a
                  href={`tel:${settings.businessInfo.phone.replace(/\s/g, '')}`}
                  className="text-sage-200 hover:text-white transition-colors"
                >
                  {settings.businessInfo.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-sage-300" />
                <span className="text-sage-200">
                  {settings.businessInfo.location}<br />
                  {settings.businessInfo.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sage-700 mt-8 pt-8 text-center">
          <p className="text-sage-300">
            © {new Date().getFullYear()} {settings.businessInfo.businessName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 