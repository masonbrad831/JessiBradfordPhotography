import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Heart,
  Globe,
  Building,
  User,
  Bell,
  Image as ImageIcon,
  Globe as GlobeIcon,
  Search,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchResource, saveResource } from '../api';

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
  adminSettings: {
    emailNotifications: {
      newBookings: boolean;
      galleryAccess: boolean;
      weeklyReports: boolean;
    };
    gallerySettings: {
      allowDownloads: boolean;
      watermarkPhotos: boolean;
      autoExpireGalleries: boolean;
      expireAfterDays: number;
    };
  };
  siteSettings: {
    defaultSessionDuration: string;
    timezone: string;
    currency: string;
    language: string;
    contactFormEnabled: boolean;
    bookingEnabled: boolean;
    galleryEnabled: boolean;
  };
  seoSettings: {
    siteTitle: string;
    siteDescription: string;
    keywords: string;
  };
}

const Settings: React.FC = () => {
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
    },
    adminSettings: {
      emailNotifications: {
        newBookings: true,
        galleryAccess: true,
        weeklyReports: false
      },
      gallerySettings: {
        allowDownloads: true,
        watermarkPhotos: true,
        autoExpireGalleries: false,
        expireAfterDays: 30
      }
    },
    siteSettings: {
      defaultSessionDuration: "1.5 hours",
      timezone: "Mountain Time (MT)",
      currency: "USD ($)",
      language: "English",
      contactFormEnabled: true,
      bookingEnabled: true,
      galleryEnabled: true
    },
    seoSettings: {
      siteTitle: "Jessi Bradford Photography - Professional Photographer in Salina, Utah",
      siteDescription: "Professional photography services in Salina, Utah. Specializing in family portraits, couple sessions, weddings, and events.",
      keywords: "photography, photographer, Salina Utah, family portraits, wedding photography, couple sessions"
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const data = await fetchResource('Settings');
        if (data) {
          setSettings(data);
        }
      } catch (e) {
        console.log('Using default settings');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveResource('Settings', settings);
      toast.success('Settings saved successfully!');
    } catch (e) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateBusinessInfo = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      businessInfo: { ...prev.businessInfo, [field]: value }
    }));
  };

  const updateSocialMedia = (platform: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value }
    }));
  };

  const updateEmailNotifications = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      adminSettings: {
        ...prev.adminSettings,
        emailNotifications: { ...prev.adminSettings.emailNotifications, [field]: value }
      }
    }));
  };

  const updateGallerySettings = (field: string, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      adminSettings: {
        ...prev.adminSettings,
        gallerySettings: { ...prev.adminSettings.gallerySettings, [field]: value }
      }
    }));
  };

  const updateSiteSettings = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      siteSettings: { ...prev.siteSettings, [field]: value }
    }));
  };

  const updateSeoSettings = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      seoSettings: { ...prev.seoSettings, [field]: value }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your business information and preferences</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Business Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center shadow-lg">
              <Building className="w-6 h-6 text-sage-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Business Information</h2>
              <p className="text-sm text-gray-600">Update your business details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={settings.businessInfo.businessName}
                onChange={(e) => updateBusinessInfo('businessName', e.target.value)}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={settings.businessInfo.email}
                  onChange={(e) => updateBusinessInfo('email', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={settings.businessInfo.phone}
                  onChange={(e) => updateBusinessInfo('phone', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={settings.businessInfo.location}
                  onChange={(e) => updateBusinessInfo('location', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={settings.businessInfo.address}
                  onChange={(e) => updateBusinessInfo('address', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Website
              </label>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={settings.businessInfo.website}
                  onChange={(e) => updateBusinessInfo('website', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Media Links */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-lg">
              <GlobeIcon className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Social Media</h2>
              <p className="text-sm text-gray-600">Manage your social media links</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <Facebook className="w-4 h-4 text-blue-600" />
                <span>Facebook</span>
              </label>
              <input
                type="url"
                value={settings.socialMedia.facebook}
                onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                className="input-field"
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <Instagram className="w-4 h-4 text-pink-600" />
                <span>Instagram</span>
              </label>
              <input
                type="url"
                value={settings.socialMedia.instagram}
                onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                className="input-field"
                placeholder="https://instagram.com/yourhandle"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-600" />
                <span>Pinterest</span>
              </label>
              <input
                type="url"
                value={settings.socialMedia.pinterest}
                onChange={(e) => updateSocialMedia('pinterest', e.target.value)}
                className="input-field"
                placeholder="https://pinterest.com/yourprofile"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <Twitter className="w-4 h-4 text-blue-400" />
                <span>Twitter</span>
              </label>
              <input
                type="url"
                value={settings.socialMedia.twitter}
                onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                className="input-field"
                placeholder="https://twitter.com/yourhandle"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <Youtube className="w-4 h-4 text-red-600" />
                <span>YouTube</span>
              </label>
              <input
                type="url"
                value={settings.socialMedia.youtube}
                onChange={(e) => updateSocialMedia('youtube', e.target.value)}
                className="input-field"
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                TikTok
              </label>
              <input
                type="url"
                value={settings.socialMedia.tiktok}
                onChange={(e) => updateSocialMedia('tiktok', e.target.value)}
                className="input-field"
                placeholder="https://tiktok.com/@yourhandle"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Admin Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center shadow-lg">
            <SettingsIcon className="w-6 h-6 text-sage-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Admin Settings</h2>
            <p className="text-sm text-gray-600">Manage your admin preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Bell className="w-5 h-5 text-sage-600" />
              <span>Email Notifications</span>
            </h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={settings.adminSettings.emailNotifications.newBookings}
                  onChange={(e) => updateEmailNotifications('newBookings', e.target.checked)}
                  className="rounded text-sage-600" 
                />
                <span className="text-sm text-gray-700">New booking notifications</span>
              </label>
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={settings.adminSettings.emailNotifications.galleryAccess}
                  onChange={(e) => updateEmailNotifications('galleryAccess', e.target.checked)}
                  className="rounded text-sage-600" 
                />
                <span className="text-sm text-gray-700">Gallery access notifications</span>
              </label>
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={settings.adminSettings.emailNotifications.weeklyReports}
                  onChange={(e) => updateEmailNotifications('weeklyReports', e.target.checked)}
                  className="rounded text-sage-600" 
                />
                <span className="text-sm text-gray-700">Weekly reports</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-sage-600" />
              <span>Gallery Settings</span>
            </h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={settings.adminSettings.gallerySettings.allowDownloads}
                  onChange={(e) => updateGallerySettings('allowDownloads', e.target.checked)}
                  className="rounded text-sage-600" 
                />
                <span className="text-sm text-gray-700">Allow client downloads</span>
              </label>
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={settings.adminSettings.gallerySettings.watermarkPhotos}
                  onChange={(e) => updateGallerySettings('watermarkPhotos', e.target.checked)}
                  className="rounded text-sage-600" 
                />
                <span className="text-sm text-gray-700">Watermark photos</span>
              </label>
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={settings.adminSettings.gallerySettings.autoExpireGalleries}
                  onChange={(e) => updateGallerySettings('autoExpireGalleries', e.target.checked)}
                  className="rounded text-sage-600" 
                />
                <span className="text-sm text-gray-700">Auto-expire galleries</span>
              </label>
              {settings.adminSettings.gallerySettings.autoExpireGalleries && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expire after (days)
                  </label>
                  <input
                    type="number"
                    value={settings.adminSettings.gallerySettings.expireAfterDays}
                    onChange={(e) => updateGallerySettings('expireAfterDays', parseInt(e.target.value))}
                    className="input-field w-24"
                    min="1"
                    max="365"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Site Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center shadow-lg">
            <GlobeIcon className="w-6 h-6 text-purple-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Site Settings</h2>
            <p className="text-sm text-gray-600">Configure your website features</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Default Session Duration
            </label>
            <select 
              value={settings.siteSettings.defaultSessionDuration}
              onChange={(e) => updateSiteSettings('defaultSessionDuration', e.target.value)}
              className="input-field"
            >
              <option value="1 hour">1 hour</option>
              <option value="1.5 hours">1.5 hours</option>
              <option value="2 hours">2 hours</option>
              <option value="3 hours">3 hours</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Time Zone
            </label>
            <select 
              value={settings.siteSettings.timezone}
              onChange={(e) => updateSiteSettings('timezone', e.target.value)}
              className="input-field"
            >
              <option value="Mountain Time (MT)">Mountain Time (MT)</option>
              <option value="Pacific Time (PT)">Pacific Time (PT)</option>
              <option value="Central Time (CT)">Central Time (CT)</option>
              <option value="Eastern Time (ET)">Eastern Time (ET)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Currency
            </label>
            <select 
              value={settings.siteSettings.currency}
              onChange={(e) => updateSiteSettings('currency', e.target.value)}
              className="input-field"
            >
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
              <option value="GBP (£)">GBP (£)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Language
            </label>
            <select 
              value={settings.siteSettings.language}
              onChange={(e) => updateSiteSettings('language', e.target.value)}
              className="input-field"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Toggles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-3">
              <input 
                type="checkbox" 
                checked={settings.siteSettings.contactFormEnabled}
                onChange={(e) => updateSiteSettings('contactFormEnabled', e.target.checked)}
                className="rounded text-sage-600" 
              />
              <span className="text-sm text-gray-700">Contact Form</span>
            </label>
            <label className="flex items-center space-x-3">
              <input 
                type="checkbox" 
                checked={settings.siteSettings.bookingEnabled}
                onChange={(e) => updateSiteSettings('bookingEnabled', e.target.checked)}
                className="rounded text-sage-600" 
              />
              <span className="text-sm text-gray-700">Booking System</span>
            </label>
            <label className="flex items-center space-x-3">
              <input 
                type="checkbox" 
                checked={settings.siteSettings.galleryEnabled}
                onChange={(e) => updateSiteSettings('galleryEnabled', e.target.checked)}
                className="rounded text-sage-600" 
              />
              <span className="text-sm text-gray-700">Client Galleries</span>
            </label>
          </div>
        </div>
      </motion.div>

      {/* SEO Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center shadow-lg">
            <Search className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">SEO Settings</h2>
            <p className="text-sm text-gray-600">Optimize your site for search engines</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Site Title
            </label>
            <input
              type="text"
              value={settings.seoSettings.siteTitle}
              onChange={(e) => updateSeoSettings('siteTitle', e.target.value)}
              className="input-field"
              placeholder="Your site title for search engines"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Site Description
            </label>
            <textarea
              value={settings.seoSettings.siteDescription}
              onChange={(e) => updateSeoSettings('siteDescription', e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Brief description of your photography business"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Keywords
            </label>
            <input
              type="text"
              value={settings.seoSettings.keywords}
              onChange={(e) => updateSeoSettings('keywords', e.target.value)}
              className="input-field"
              placeholder="photography, photographer, your location, services"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings; 