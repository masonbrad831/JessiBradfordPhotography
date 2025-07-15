import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Plus, Trash2, Edit, Eye, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchResource, saveResource } from '../api';

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '';
const CLOUDINARY_API_KEY = process.env.REACT_APP_CLOUDINARY_API_KEY || '';
declare global {
  interface Window {
    cloudinary: any;
  }
}

const SlideshowManager: React.FC = () => {
  const [slideshowImages, setSlideshowImages] = useState<any[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [multiImages, setMultiImages] = useState<any[]>([]); // {file, uploading, url, public_id, progress}
  const [cloudinaryReady, setCloudinaryReady] = useState(false);
  const [selectingFromCloudinary, setSelectingFromCloudinary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

    // Dynamically load Cloudinary Media Library Widget if not present
    if (!window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://media-library.cloudinary.com/global/all.js';
      script.async = true;
      script.onload = () => setCloudinaryReady(true);
      script.onerror = () => toast.error('Failed to load Cloudinary Media Library Widget');
      document.body.appendChild(script);
    } else {
      setCloudinaryReady(true);
    }
  }, []);

  // Multi-image upload handler with progress
  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setMultiImages(files.map(file => ({ file, uploading: true, url: '', public_id: '', progress: 0 })));
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      await new Promise<void>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setMultiImages(prev => prev.map((img, idx) => idx === i ? { ...img, progress: percent } : img));
          }
        };
        xhr.onload = () => {
          const data = JSON.parse(xhr.responseText);
          setMultiImages(prev => prev.map((img, idx) => idx === i ? { ...img, uploading: false, url: data.secure_url, public_id: data.public_id, progress: 100 } : img));
          resolve();
        };
        xhr.onerror = () => {
          setMultiImages(prev => prev.map((img, idx) => idx === i ? { ...img, uploading: false, progress: 0 } : img));
          resolve();
        };
        xhr.send(formData);
      });
    }
  };

  // Cloudinary Media Library Widget integration
  const openCloudinaryMediaLibrary = () => {
    if (!window.cloudinary) {
      toast.error('Cloudinary Media Library Widget not loaded yet. Please try again in a moment.');
      return;
    }
    setSelectingFromCloudinary(true);
    const ml = window.cloudinary.createMediaLibrary(
      {
        cloud_name: CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        multiple: true,
        max_files: 20,
        insert_caption: 'Select',
      },
      {
        insertHandler: (data: any) => {
          setMultiImages(prev => [
            ...prev,
            ...data.assets.map((asset: any) => ({
              file: null,
              uploading: false,
              url: asset.secure_url,
              public_id: asset.public_id,
              progress: 100,
            }))
          ]);
          setSelectingFromCloudinary(false);
        },
      }
    );
    ml.show();
  };

  // Add all uploaded/selected images to slideshow
  const handleAddMultiPhotos = async () => {
    const validImages = multiImages.filter(img => img.url);
    if (validImages.length === 0) {
      toast.error('Please upload or select at least one image');
      return;
    }
    const newSlides = validImages.map(img => ({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      imageUrl: img.url,
      isActive: true,
      order: slideshowImages.length + 1,
    }));
    const updatedImages = [...slideshowImages, ...newSlides];
    try {
      await saveResource('SlideshowImage', updatedImages);
      setSlideshowImages(updatedImages);
      setShowUploadModal(false);
      setMultiImages([]);
      toast.success('Images added to slideshow');
    } catch (e) {
      toast.error('Failed to add images');
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
            onClick={() => { setShowUploadModal(false); setMultiImages([]); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-sage-700 flex items-center gap-2">
                  <Plus className="w-6 h-6" /> Add Slideshow Image(s)
                </h2>
                <button
                  onClick={() => { setShowUploadModal(false); setMultiImages([]); }}
                  className="text-gray-400 hover:text-gray-600 rounded-full p-2 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    type="button"
                    className="btn-primary flex-1"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Images
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFiles}
                  />
                  <button
                    type="button"
                    className="btn-secondary flex-1"
                    onClick={openCloudinaryMediaLibrary}
                    disabled={!cloudinaryReady || selectingFromCloudinary}
                  >
                    Select from Cloudinary
                  </button>
                </div>
                {multiImages.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {multiImages.map((img, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl shadow-md border border-gray-200 flex flex-col md:flex-row gap-4 p-4 items-center">
                        <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-200">
                          {img.uploading ? (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mb-2"></div>
                              <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div className="bg-sage-500 h-2 rounded-full transition-all duration-300" style={{ width: `${img.progress || 0}%` }}></div>
                              </div>
                              <span className="text-xs text-gray-500 mt-1">{img.progress || 0}%</span>
                            </div>
                          ) : img.url ? (
                            <img src={img.url} alt="preview" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-gray-400">No Image</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex space-x-3 pt-4 sticky bottom-0 bg-white border-t border-gray-100 -mx-8 px-8 py-6 rounded-b-2xl">
                  <button
                    type="button"
                    onClick={() => { setShowUploadModal(false); setMultiImages([]); }}
                    className="flex-1 btn-secondary text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddMultiPhotos}
                    className="flex-1 btn-primary text-lg"
                    disabled={multiImages.length === 0 || multiImages.some(img => img.uploading)}
                  >
                    <Plus className="w-5 h-5 mr-2" /> Add
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