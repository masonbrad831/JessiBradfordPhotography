import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Plus, Trash2, Edit, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';

const FeaturedWorkManager: React.FC = () => {
  const [featuredWork, setFeaturedWork] = useState([
    {
      id: '1',
      title: 'Family Portrait',
      imageUrl: `${process.env.REACT_APP_API_URL || ''}/placeholder/600/400`,
      category: 'family',
      isActive: true,
      order: 1
    },
    {
      id: '2',
      title: 'Couple Session',
      imageUrl: `${process.env.REACT_APP_API_URL || ''}/placeholder/600/400`,
      category: 'couple',
      isActive: true,
      order: 2
    },
    {
      id: '3',
      title: 'Individual Portrait',
      imageUrl: `${process.env.REACT_APP_API_URL || ''}/placeholder/600/400`,
      category: 'portrait',
      isActive: true,
      order: 3
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWork, setEditingWork] = useState<any>(null);
  const [newWork, setNewWork] = useState({
    title: '',
    imageUrl: '',
    category: '',
    order: featuredWork.length + 1
  });

  const categories = [
    'family',
    'couple',
    'portrait',
    'engagement',
    'wedding',
    'event'
  ];

  const handleAddWork = () => {
    if (!newWork.title || !newWork.imageUrl || !newWork.category) {
      toast.error('Please fill in all fields');
      return;
    }

    const work = {
      id: Date.now().toString(),
      ...newWork,
      isActive: true
    };

    setFeaturedWork([...featuredWork, work]);
    setNewWork({ title: '', imageUrl: '', category: '', order: featuredWork.length + 2 });
    setShowAddModal(false);
    toast.success('Featured work added');
  };

  const handleEditWork = () => {
    if (!editingWork.title || !editingWork.imageUrl || !editingWork.category) {
      toast.error('Please fill in all fields');
      return;
    }

    setFeaturedWork(featuredWork.map(work => 
      work.id === editingWork.id ? editingWork : work
    ));
    setEditingWork(null);
    toast.success('Featured work updated');
  };

  const handleDeleteWork = (id: string) => {
    setFeaturedWork(featuredWork.filter(work => work.id !== id));
    toast.success('Featured work removed');
  };

  const handleToggleActive = (id: string) => {
    setFeaturedWork(featuredWork.map(work => 
      work.id === id ? { ...work, isActive: !work.isActive } : work
    ));
  };

  const handleReorder = (id: string, direction: 'up' | 'down') => {
    const currentIndex = featuredWork.findIndex(work => work.id === id);
    if (currentIndex === -1) return;

    const newWork = [...featuredWork];
    if (direction === 'up' && currentIndex > 0) {
      [newWork[currentIndex], newWork[currentIndex - 1]] = 
      [newWork[currentIndex - 1], newWork[currentIndex]];
    } else if (direction === 'down' && currentIndex < newWork.length - 1) {
      [newWork[currentIndex], newWork[currentIndex + 1]] = 
      [newWork[currentIndex + 1], newWork[currentIndex]];
    }

    setFeaturedWork(newWork);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Featured Work Management</h1>
          <p className="text-gray-600">Manage the featured work section on the homepage</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Featured Work</span>
        </button>
      </div>

      {/* Featured Work Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredWork.map((work, index) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
              <img
                src={work.imageUrl}
                alt={work.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{work.title}</h3>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleToggleActive(work.id)}
                    className={`p-1 rounded ${
                      work.isActive 
                        ? 'text-green-600 hover:bg-green-100' 
                        : 'text-red-600 hover:bg-red-100'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingWork(work)}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteWork(work.id)}
                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 capitalize mb-2">
                {work.category} Photography
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Order: {work.order}</span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleReorder(work.id, 'up')}
                    disabled={index === 0}
                    className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleReorder(work.id, 'down')}
                    disabled={index === featuredWork.length - 1}
                    className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || editingWork) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowAddModal(false);
              setEditingWork(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingWork ? 'Edit Featured Work' : 'Add Featured Work'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingWork(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingWork?.title || newWork.title}
                    onChange={(e) => {
                      if (editingWork) {
                        setEditingWork({ ...editingWork, title: e.target.value });
                      } else {
                        setNewWork({ ...newWork, title: e.target.value });
                      }
                    }}
                    className="input-field"
                    placeholder="Enter work title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={editingWork?.imageUrl || newWork.imageUrl}
                    onChange={(e) => {
                      if (editingWork) {
                        setEditingWork({ ...editingWork, imageUrl: e.target.value });
                      } else {
                        setNewWork({ ...newWork, imageUrl: e.target.value });
                      }
                    }}
                    className="input-field"
                    placeholder="Enter image URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={editingWork?.category || newWork.category}
                    onChange={(e) => {
                      if (editingWork) {
                        setEditingWork({ ...editingWork, category: e.target.value });
                      } else {
                        setNewWork({ ...newWork, category: e.target.value });
                      }
                    }}
                    className="input-field"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingWork?.order || newWork.order}
                    onChange={(e) => {
                      if (editingWork) {
                        setEditingWork({ ...editingWork, order: parseInt(e.target.value) });
                      } else {
                        setNewWork({ ...newWork, order: parseInt(e.target.value) });
                      }
                    }}
                    className="input-field"
                    min="1"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingWork(null);
                    }}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingWork ? handleEditWork : handleAddWork}
                    className="flex-1 btn-primary"
                  >
                    {editingWork ? 'Update Work' : 'Add Work'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeaturedWorkManager; 