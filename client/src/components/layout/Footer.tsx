import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Camera } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  const settings = {
    businessInfo: {
      businessName: "Jessi Bradford Photography",
      email: "bradford.j.photos@gmail.com",
      phone: "(385) 457-6487",
      location: "Salina, Utah",
      website: "https://jessibradfordphotography.com"
    },
    socialMedia: {
      facebook: "https://www.facebook.com/profile.php?id=61578237507323",
      instagram: "https://www.instagram.com/jessibradfordphotography",
      pinterest: "",
      twitter: "",
      youtube: "",
      tiktok: ""
    }
  };

  const socialLinks = [
    { platform: 'facebook', url: settings.socialMedia.facebook, icon: Facebook, color: 'hover:bg-blue-600' },
    { platform: 'instagram', url: settings.socialMedia.instagram, icon: Instagram, color: 'hover:bg-pink-600' },
    { platform: 'twitter', url: settings.socialMedia.twitter, icon: Twitter, color: 'hover:bg-blue-400' },
    { platform: 'youtube', url: settings.socialMedia.youtube, icon: Youtube, color: 'hover:bg-red-600' },
  ].filter(link => link.url);

  return (
    <footer className="bg-sage-800 text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-sage-600 rounded-full">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="footer-business-name">{settings.businessInfo.businessName}</h3>
                <p className="text-sage-200">Photography</p>
              </div>
            </div>
            <p className="text-sage-200 mb-4 max-w-md">
              Capturing your beautiful moments with an artistic approach. Specializing in portraits and lifestyle photography in Sevier County.
            </p>
            {socialLinks.length > 0 && (
              <div className="flex space-x-4">
                {socialLinks.map(({ platform, url, icon: Icon, color }) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`footer-social-icon ${color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['portfolio', 'services', 'about', 'contact'].map(link => (
                <li key={link}>
                  <Link to={`/${link}`} className="footer-contact-link capitalize">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-sage-300" />
                <a href={`mailto:${settings.businessInfo.email}`} className="footer-contact-link">
                  {settings.businessInfo.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-sage-300" />
                <a href={`tel:${settings.businessInfo.phone.replace(/\s/g, '')}`} className="footer-contact-link">
                  {settings.businessInfo.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-sage-300" />
                <span className="text-sage-200">
                  {settings.businessInfo.location}<br />
                </span>
              </div>
            </div>
          </div>

        </div>

        <div className="footer-bottom-bar text-center mt-8">
          <p className="text-sage-300">
            © 2025 {settings.businessInfo.businessName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;