import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Eye, Lock, Download, Share2, Edit } from 'lucide-react';
import { fetchResource } from '../api';

const ClientGalleryManager: React.FC = () => {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGalleries() {
      setLoading(true);
      try {
        const galleriesData = await fetchResource('ClientGallery');
        setGalleries(Array.isArray(galleriesData) ? galleriesData : []);
      } catch (e) {
        setGalleries([]);
      } finally {
        setLoading(false);
      }
    }
    loadGalleries();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Galleries</h1>
          <p className="text-gray-600">Manage private galleries for your clients</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Gallery</span>
        </button>
      </div>

      {/* Galleries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-gray-500">Loading galleries...</div>
        ) : galleries.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No galleries found.</div>
        ) : (
          galleries.map((gallery, index) => (
            <motion.div
              key={gallery.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-sage-600" />
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{gallery.clientName}</h3>
              <p className="text-sm text-gray-600 mb-2">{gallery.sessionType}</p>
              <p className="text-sm text-gray-500 mb-4">{gallery.photoCount} photos</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Access Code:</span>
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{gallery.accessCode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(gallery.status)}`}>
                    {gallery.status}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                <button className="btn-primary text-sm py-1 px-3 flex items-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span>Manage Access</span>
                </button>
                <button className="btn-secondary text-sm py-1 px-3 flex items-center space-x-1">
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Galleries', value: '12', color: 'text-green-600' },
          { label: 'Total Photos', value: '1,247', color: 'text-blue-600' },
          { label: 'This Month', value: '8', color: 'text-purple-600' },
          { label: 'Downloads', value: '156', color: 'text-orange-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center"
          >
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className={`text-sm font-medium ${stat.color}`}>{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ClientGalleryManager; 