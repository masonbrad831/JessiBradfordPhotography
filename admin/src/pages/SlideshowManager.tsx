import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Plus, Trash2, Edit, Eye, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchResource, saveResource } from '../api';

const SlideshowManager: React.FC = () => {
  const [slideshowImages, setSlideshowImages] = useState<any[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newImage, setNewImage] = useState({
    title: '',
    imageUrl: '',
    order: 1
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImages() {
      setLoading(true);
      try {
        const images = await fetchResource('SlideshowImage');
        setSlideshowImages(Array.isArray(images) ? images : []);
      } catch (e) {
        setSlideshowImages([]);
      } finally {
        setLoading(false);
      }
    }
    loadImages();
  }, []);

  const handleAddImage = async () => {
    if (!newImage.title || !newImage.imageUrl) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      const newSlide = {
        id: Date.now().toString(),
        ...newImage,
        isActive: true,
        order: slideshowImages.length + 1
      };
      const updatedImages = [...slideshowImages, newSlide];
      await saveResource('SlideshowImage', updatedImages);
      setSlideshowImages(updatedImages);
      setNewImage({ title: '', imageUrl: '', order: updatedImages.length + 1 });
      setShowUploadModal(false);
      toast.success('Image added to slideshow');
    } catch (e) {
      toast.error('Failed to add image');
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      const updatedImages = slideshowImages.filter(img => img.id !== id);
      await saveResource('SlideshowImage', updatedImages);
      setSlideshowImages(updatedImages);
      toast.success('Image removed from slideshow');
    } catch (e) {
      toast.error('Failed to remove image');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const updatedImages = slideshowImages.map(img =>
        img.id === id ? { ...img, isActive: !img.isActive } : img
      );
      await saveResource('SlideshowImage', updatedImages);
      setSlideshowImages(updatedImages);
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = slideshowImages.findIndex(img => img.id === id);
    if (currentIndex === -1) return;
    const newImages = [...slideshowImages];
    if (direction === 'up' && currentIndex > 0) {
      [newImages[currentIndex], newImages[currentIndex - 1]] = 
      [newImages[currentIndex - 1], newImages[currentIndex]];
    } else if (direction === 'down' && currentIndex < newImages.length - 1) {
      [newImages[currentIndex], newImages[currentIndex + 1]] = 
      [newImages[currentIndex + 1], newImages[currentIndex]];
    }
    // Update order property
    newImages.forEach((img, idx) => img.order = idx + 1);
    try {
      await saveResource('SlideshowImage', newImages);
      setSlideshowImages(newImages);
    } catch (e) {
      toast.error('Failed to reorder');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Slideshow Management</h1>
          <p className="text-gray-600">Manage the homepage hero slideshow images</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Image</span>
        </button>
      </div>

      {/* Slideshow Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Slideshow Preview</h2>
        <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Slideshow preview will appear here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Images List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Slideshow Images</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {slideshowImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{image.title}</h3>
                  <p className="text-sm text-gray-600">Order: {image.order}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      image.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {image.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActive(image.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      image.isActive 
                        ? 'text-green-600 hover:bg-green-100' 
                        : 'text-red-600 hover:bg-red-100'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleReorder(image.id, 'up')}
                    disabled={index === 0}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    ↑
                  </button>
                  
                  <button
                    onClick={() => handleReorder(image.id, 'down')}
                    disabled={index === slideshowImages.length - 1}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    ↓
                  </button>
                  
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Add Slideshow Image</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Title
                  </label>
                  <input
                    type="text"
                    value={newImage.title}
                    onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter image title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={newImage.imageUrl}
                    onChange={(e) => setNewImage({ ...newImage, imageUrl: e.target.value })}
                    className="input-field"
                    placeholder="Enter image URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={newImage.order}
                    onChange={(e) => setNewImage({ ...newImage, order: parseInt(e.target.value) })}
                    className="input-field"
                    min="1"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddImage}
                    className="flex-1 btn-primary"
                  >
                    Add Image
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

export default SlideshowManager; 