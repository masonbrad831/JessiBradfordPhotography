import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Camera, Mail, Phone, MapPin, Save } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your business information and preferences</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-sage-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
              <p className="text-sm text-gray-600">Update your business details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                defaultValue="Jessi Bradford Photography"
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  defaultValue="jessi@jessibradfordphotography.com"
                  className="input-field"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  defaultValue="(555) 123-4567"
                  className="input-field"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  defaultValue="Salina, Utah"
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Admin Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-sage-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Admin Settings</h2>
              <p className="text-sm text-gray-600">Manage your admin preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Username
              </label>
              <input
                type="text"
                defaultValue="admin"
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Notifications
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded text-sage-600" />
                  <span className="text-sm text-gray-700">New booking notifications</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded text-sage-600" />
                  <span className="text-sm text-gray-700">Gallery access notifications</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded text-sage-600" />
                  <span className="text-sm text-gray-700">Weekly reports</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallery Settings
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded text-sage-600" />
                  <span className="text-sm text-gray-700">Allow client downloads</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded text-sage-600" />
                  <span className="text-sm text-gray-700">Watermark photos</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded text-sage-600" />
                  <span className="text-sm text-gray-700">Auto-expire galleries after 30 days</span>
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Additional Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Session Duration
            </label>
            <select className="input-field">
              <option>1 hour</option>
              <option>1.5 hours</option>
              <option>2 hours</option>
              <option>3 hours</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Zone
            </label>
            <select className="input-field">
              <option>Mountain Time (MT)</option>
              <option>Pacific Time (PT)</option>
              <option>Central Time (CT)</option>
              <option>Eastern Time (ET)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select className="input-field">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select className="input-field">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings; 