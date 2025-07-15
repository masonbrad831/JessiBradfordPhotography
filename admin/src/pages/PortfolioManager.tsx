import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Plus, Trash2, Edit, Eye, X, Star, StarOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchResource, saveResource } from '../api';

const PortfolioManager: React.FC = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<any>(null);
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    imageUrl: '',
    category: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    'family',
    'couple',
    'portrait',
    'engagement',
    'wedding',
    'event'
  ];

  useEffect(() => {
    async function loadPhotos() {
      setLoading(true);
      try {
        const portfolioData = await fetchResource('Portfolio');
        if (portfolioData && Array.isArray(portfolioData.photos)) {
          setPhotos(portfolioData.photos);
        } else {
          setPhotos([]);
        }
      } catch (e) {
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    }
    loadPhotos();
  }, []);

  const handleAddPhoto = async () => {
    if (!newPhoto.title || !newPhoto.imageUrl || !newPhoto.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const photo = {
        id: Date.now().toString(),
        ...newPhoto,
        isActive: true,
        isStarred: false
      };
      const updatedPhotos = [...photos, photo];
      await saveResource('Portfolio', { photos: updatedPhotos });
      setPhotos(updatedPhotos);
      setNewPhoto({ title: '', imageUrl: '', category: '', description: '' });
      setShowAddModal(false);
      toast.success('Photo added to portfolio');
    } catch (e) {
      toast.error('Failed to add photo');
    }
  };

  const handleEditPhoto = async () => {
    if (!editingPhoto.title || !editingPhoto.imageUrl || !editingPhoto.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const updatedPhotos = photos.map(photo =>
        photo.id === editingPhoto.id ? editingPhoto : photo
      );
      await saveResource('Portfolio', { photos: updatedPhotos });
      setPhotos(updatedPhotos);
      setEditingPhoto(null);
      toast.success('Photo updated');
    } catch (e) {
      toast.error('Failed to update photo');
    }
  };

  const handleDeletePhoto = async (id: string) => {
    try {
      const updatedPhotos = photos.filter(photo => photo.id !== id);
      await saveResource('Portfolio', { photos: updatedPhotos });
      setPhotos(updatedPhotos);
      toast.success('Photo removed from portfolio');
    } catch (e) {
      toast.error('Failed to remove photo');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const updatedPhotos = photos.map(photo =>
        photo.id === id ? { ...photo, isActive: !photo.isActive } : photo
      );
      await saveResource('Portfolio', { photos: updatedPhotos });
      setPhotos(updatedPhotos);
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const handleToggleStarred = async (id: string) => {
    try {
      const updatedPhotos = photos.map(photo =>
        photo.id === id ? { ...photo, isStarred: !photo.isStarred } : photo
      );
      await saveResource('Portfolio', { photos: updatedPhotos });
      setPhotos(updatedPhotos);
      
      // Also update FeaturedWork if starring
      const photo = photos.find(p => p.id === id);
      if (photo && !photo.isStarred) {
        // Add to featured work
        const featuredData = await fetchResource('FeaturedWork');
        let featuredItems = [];
        if (featuredData && Array.isArray(featuredData.items)) {
          featuredItems = featuredData.items;
        }
        
        const newFeaturedItem = {
          id: photo.id,
          title: photo.title,
          imageUrl: photo.imageUrl,
          category: photo.category,
          isActive: true,
          order: featuredItems.length + 1
        };
        
        const updatedFeaturedItems = [...featuredItems, newFeaturedItem];
        await saveResource('FeaturedWork', { 
          sectionDescription: featuredData?.sectionDescription || "A glimpse into my artistic vision and the beautiful moments I've captured",
          items: updatedFeaturedItems 
        });
        toast.success('Photo added to featured work!');
      } else if (photo && photo.isStarred) {
        // Remove from featured work
        const featuredData = await fetchResource('FeaturedWork');
        if (featuredData && Array.isArray(featuredData.items)) {
          const updatedFeaturedItems = featuredData.items.filter((item: any) => item.id !== id);
          await saveResource('FeaturedWork', { 
            sectionDescription: featuredData.sectionDescription,
            items: updatedFeaturedItems 
          });
          toast.success('Photo removed from featured work!');
        }
      }
    } catch (e) {
      toast.error('Failed to update starred status');
    }
  };

  const filteredPhotos = selectedCategory === 'all' 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
          <p className="text-gray-600">Manage your portfolio photos and star them for featured work</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo</span>
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-sage-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-sage-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading photos...</p>
        ) : filteredPhotos.length === 0 ? (
          <p>No photos found. Add some to your portfolio!</p>
        ) : (
          filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="aspect-[4/3] bg-gray-200 overflow-hidden relative">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleToggleStarred(photo.id)}
                    className={`p-2 rounded-full transition-colors ${
                      photo.isStarred
                        ? 'bg-yellow-500 text-white'
                        : 'bg-white/80 text-gray-600 hover:bg-yellow-500 hover:text-white'
                    }`}
                  >
                    {photo.isStarred ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleToggleActive(photo.id)}
                    className={`p-2 rounded-full transition-colors ${
                      photo.isActive
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{photo.title}</h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setEditingPhoto(photo)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 capitalize mb-2">
                  {photo.category} Photography
                </p>
                {photo.description && (
                  <p className="text-sm text-gray-500">{photo.description}</p>
                )}
                <div className="flex items-center space-x-2 mt-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    photo.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {photo.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {photo.isStarred && (
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || editingPhoto) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => {
              setShowAddModal(false);
              setEditingPhoto(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingPhoto ? 'Edit Photo' : 'Add New Photo'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingPhoto(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={editingPhoto ? editingPhoto.title : newPhoto.title}
                    onChange={(e) => {
                      if (editingPhoto) {
                        setEditingPhoto({ ...editingPhoto, title: e.target.value });
                      } else {
                        setNewPhoto({ ...newPhoto, title: e.target.value });
                      }
                    }}
                    className="input-field"
                    placeholder="Enter photo title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    value={editingPhoto ? editingPhoto.imageUrl : newPhoto.imageUrl}
                    onChange={(e) => {
                      if (editingPhoto) {
                        setEditingPhoto({ ...editingPhoto, imageUrl: e.target.value });
                      } else {
                        setNewPhoto({ ...newPhoto, imageUrl: e.target.value });
                      }
                    }}
                    className="input-field"
                    placeholder="Enter image URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={editingPhoto ? editingPhoto.category : newPhoto.category}
                    onChange={(e) => {
                      if (editingPhoto) {
                        setEditingPhoto({ ...editingPhoto, category: e.target.value });
                      } else {
                        setNewPhoto({ ...newPhoto, category: e.target.value });
                      }
                    }}
                    className="input-field"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingPhoto ? editingPhoto.description : newPhoto.description}
                    onChange={(e) => {
                      if (editingPhoto) {
                        setEditingPhoto({ ...editingPhoto, description: e.target.value });
                      } else {
                        setNewPhoto({ ...newPhoto, description: e.target.value });
                      }
                    }}
                    className="input-field"
                    rows={3}
                    placeholder="Enter photo description (optional)"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={editingPhoto ? handleEditPhoto : handleAddPhoto}
                    className="btn-primary flex-1"
                  >
                    {editingPhoto ? 'Update Photo' : 'Add Photo'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingPhoto(null);
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
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

export default PortfolioManager; 