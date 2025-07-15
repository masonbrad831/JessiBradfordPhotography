import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Plus, Trash2, Edit, Eye, X } from 'lucide-react';
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

type FeaturedWorkType = Array<any> | { items: Array<any>; sectionDescription?: string };
const FeaturedWorkManager: React.FC = () => {
  const [featuredWork, setFeaturedWork] = useState<FeaturedWorkType>([]);
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
  const [multiImages, setMultiImages] = useState<any[]>([]); // {file, uploading, url, public_id, progress}
  const [cloudinaryReady, setCloudinaryReady] = useState(false);
  const [selectingFromCloudinary, setSelectingFromCloudinary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadFeaturedWork() {
      setLoading(true);
      try {
        const workData = await fetchResource('FeaturedWork');
        if (workData && typeof workData === 'object' && Array.isArray(workData.items)) {
          setFeaturedWork(workData);
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

  // Remove unused newWork state and categories array
  // Remove handleAddWork and handleEditWork functions

  const handleDeleteWork = async (id: string) => {
    try {
      // Find the imageUrl of the work being deleted
      const work = workItems.find(w => w.id === id);
      const imageUrl = work?.imageUrl;
      const updatedWork = workItems.filter(work => work.id !== id);
      await saveResource('FeaturedWork', updatedWork);
      setFeaturedWork(updatedWork);
      // Unstar in all portfolios
      if (imageUrl) {
        const allPortfolios = await fetchResource('Portfolio');
        if (Array.isArray(allPortfolios)) {
          const updatedPortfolios = allPortfolios.map((p: any) => ({
            ...p,
            photos: Array.isArray(p.photos)
              ? p.photos.map((photo: any) =>
                  photo.imageUrl === imageUrl ? { ...photo, isStarred: false } : photo
                )
              : [],
          }));
          await saveResource('Portfolio', updatedPortfolios);
        }
      }
      toast.success('Featured work removed');
    } catch (e) {
      toast.error('Failed to remove featured work');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const updatedWork = workItems.map(work =>
        work.id === id ? { ...work, isActive: !work.isActive } : work
      );
      await saveResource('FeaturedWork', updatedWork);
      setFeaturedWork(updatedWork);
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = workItems.findIndex(work => work.id === id);
    if (currentIndex === -1) return;
    const newWorkArr = [...workItems];
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

  // Add all uploaded/selected images to featured work
  const handleAddMultiPhotos = async () => {
    const validImages = multiImages.filter(img => img.url);
    if (validImages.length === 0) {
      toast.error('Please upload or select at least one image');
      return;
    }
    const newWorks = validImages.map(img => ({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      imageUrl: img.url,
      isActive: true,
      order: workItems.length + 1,
    }));
    let updatedWork: any[] = [...workItems, ...newWorks];
    try {
      if (sectionDescription) {
        await saveResource('FeaturedWork', { sectionDescription, items: updatedWork });
        setFeaturedWork({ sectionDescription, items: updatedWork });
      } else {
        await saveResource('FeaturedWork', updatedWork);
        setFeaturedWork(updatedWork);
      }
      setShowAddModal(false);
      setMultiImages([]);
      toast.success('Images added to featured work');
    } catch (e) {
      toast.error('Failed to add images');
    }
  };

  // Helper to always get the items array
  const workItems = Array.isArray(featuredWork) ? featuredWork : featuredWork.items || [];

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
              await saveResource('FeaturedWork', { sectionDescription, items: workItems });
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
        ) : workItems.length === 0 ? (
          <p>No featured work added yet. Add some to display on the homepage!</p>
        ) : (
          workItems.map((work, index) => (
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
                      disabled={index === workItems.length - 1}
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
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => { setShowAddModal(false); setMultiImages([]); }}
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
                  <Plus className="w-6 h-6" /> Add Featured Work Image(s)
                </h2>
                <button
                  onClick={() => { setShowAddModal(false); setMultiImages([]); }}
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
                    onClick={() => { setShowAddModal(false); setMultiImages([]); }}
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

export default FeaturedWorkManager; 