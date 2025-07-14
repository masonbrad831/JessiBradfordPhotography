import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Plus, Trash2, Edit, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchResource, saveResource } from '../api';

const FeaturedWorkManager: React.FC = () => {
  const [featuredWork, setFeaturedWork] = useState<any[]>([]);
  const [sectionDescription, setSectionDescription] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWork, setEditingWork] = useState<any>(null);
  const [newWork, setNewWork] = useState({
    title: '',
    imageUrl: '',
    category: '',
    order: 1
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedWork() {
      setLoading(true);
      try {
        const workData = await fetchResource('FeaturedWork');
        if (workData && typeof workData === 'object' && Array.isArray(workData.items)) {
          setFeaturedWork(workData.items);
          setSectionDescription(workData.sectionDescription || "");
        } else if (Array.isArray(workData)) {
          setFeaturedWork(workData);
          setSectionDescription("");
        } else {
          setFeaturedWork([]);
          setSectionDescription("");
        }
      } catch (e) {
        setFeaturedWork([]);
        setSectionDescription("");
      } finally {
        setLoading(false);
      }
    }
    loadFeaturedWork();
  }, []);

  const categories = [
    'family',
    'couple',
    'portrait',
    'engagement',
    'wedding',
    'event'
  ];

  const handleAddWork = async () => {
    if (!newWork.title || !newWork.imageUrl || !newWork.category) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      const work = {
        id: Date.now().toString(),
        ...newWork,
        isActive: true,
        order: featuredWork.length + 1
      };
      const updatedWork = [...featuredWork, work];
      await saveResource('FeaturedWork', { sectionDescription, items: updatedWork });
      setFeaturedWork(updatedWork);
      setNewWork({ title: '', imageUrl: '', category: '', order: updatedWork.length + 1 });
      setShowAddModal(false);
      toast.success('Featured work added');
    } catch (e) {
      toast.error('Failed to add featured work');
    }
  };

  const handleEditWork = async () => {
    if (!editingWork.title || !editingWork.imageUrl || !editingWork.category) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      const updatedWork = featuredWork.map(work =>
        work.id === editingWork.id ? editingWork : work
      );
      await saveResource('FeaturedWork', updatedWork);
      setFeaturedWork(updatedWork);
      setEditingWork(null);
      toast.success('Featured work updated');
    } catch (e) {
      toast.error('Failed to update featured work');
    }
  };

  const handleDeleteWork = async (id: string) => {
    try {
      const updatedWork = featuredWork.filter(work => work.id !== id);
      await saveResource('FeaturedWork', updatedWork);
      setFeaturedWork(updatedWork);
      toast.success('Featured work removed');
    } catch (e) {
      toast.error('Failed to remove featured work');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const updatedWork = featuredWork.map(work =>
        work.id === id ? { ...work, isActive: !work.isActive } : work
      );
      await saveResource('FeaturedWork', updatedWork);
      setFeaturedWork(updatedWork);
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = featuredWork.findIndex(work => work.id === id);
    if (currentIndex === -1) return;
    const newWorkArr = [...featuredWork];
    if (direction === 'up' && currentIndex > 0) {
      [newWorkArr[currentIndex], newWorkArr[currentIndex - 1]] = 
      [newWorkArr[currentIndex - 1], newWorkArr[currentIndex]];
    } else if (direction === 'down' && currentIndex < newWorkArr.length - 1) {
      [newWorkArr[currentIndex], newWorkArr[currentIndex + 1]] = 
      [newWorkArr[currentIndex + 1], newWorkArr[currentIndex]];
    }
    // Update order property
    newWorkArr.forEach((work, idx) => work.order = idx + 1);
    try {
      await saveResource('FeaturedWork', newWorkArr);
      setFeaturedWork(newWorkArr);
    } catch (e) {
      toast.error('Failed to reorder');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Section Description</h2>
        <textarea
          className="input-field w-full mb-2"
          value={sectionDescription}
          onChange={e => setSectionDescription(e.target.value)}
          rows={2}
          placeholder="Enter a description for the Featured Work section"
        />
        <button
          className="btn-primary"
          onClick={async () => {
            try {
              await saveResource('FeaturedWork', { sectionDescription, items: featuredWork });
              toast.success('Section description updated!');
            } catch {
              toast.error('Failed to update section description');
            }
          }}
        >Save Description</button>
        <div className="mt-4 text-lg text-wood-600 max-w-2xl mx-auto border-l-4 border-wood-200 pl-4 bg-wood-50">
          {sectionDescription || 'A glimpse into my artistic vision and the beautiful moments I\'ve captured'}
        </div>
      </div>
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
        {loading ? (
          <p>Loading featured work...</p>
        ) : featuredWork.length === 0 ? (
          <p>No featured work added yet. Add some to display on the homepage!</p>
        ) : (
          featuredWork.map((work, index) => (
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
          ))
        )}
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