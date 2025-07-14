import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Image, Edit, Trash2, Eye } from 'lucide-react';

const PortfolioManager: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
          <p className="text-gray-600">Manage your photography portfolios and galleries</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Portfolio</span>
        </button>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Portraits', count: 24, status: 'published' },
          { name: 'Couples', count: 18, status: 'published' },
          { name: 'Families', count: 32, status: 'published' },
          { name: 'Engagements', count: 15, status: 'draft' },
          { name: 'Weddings', count: 8, status: 'draft' },
          { name: 'Events', count: 12, status: 'published' }
        ].map((portfolio, index) => (
          <motion.div
            key={portfolio.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center">
                <Image className="w-6 h-6 text-sage-600" />
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{portfolio.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{portfolio.count} photos</p>
            
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                portfolio.status === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {portfolio.status}
              </span>
              <button className="text-sm text-sage-600 hover:text-sage-800">
                Manage Photos
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioManager; 