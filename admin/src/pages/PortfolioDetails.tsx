import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchResource, saveResource } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Image, Star, StarOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface Photo {
  id: string;
  imageUrl: string;
  title?: string;
  category?: string;
  description?: string;
  isStarred?: boolean;
}

interface Portfolio {
  id: string;
  title: string;
  description: string;
  photos: Photo[];
}

const categories = [
  'family',
  'couple',
  'portrait',
  'engagement',
  'wedding',
  'event',
];

// Cloudinary credentials are now loaded from environment variables for security and flexibility.
// Make sure to set these in your .env file:
// REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
// REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
// REACT_APP_CLOUDINARY_API_KEY=your_api_key
const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '';
const CLOUDINARY_API_KEY = process.env.REACT_APP_CLOUDINARY_API_KEY || '';

declare global {
  interface Window {
    cloudinary: any;
  }
}

const PortfolioDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ title: '', imageUrl: '', category: '', description: '' });
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [multiImages, setMultiImages] = useState<any[]>([]); // {file, uploading, url, public_id, title, category, description, progress}
  const [selectingFromCloudinary, setSelectingFromCloudinary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cloudinaryReady, setCloudinaryReady] = useState(false);

  useEffect(() => {
    loadPortfolio();
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
    // eslint-disable-next-line
  }, [id]);

  const loadPortfolio = async () => {
    setLoading(true);
    try {
      const data = await fetchResource('Portfolio');
      const found = Array.isArray(data) ? data.find((p: Portfolio) => p.id === id) : null;
      setPortfolio(found || null);
    } catch {
      setPortfolio(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhoto = async () => {
    if (!portfolio) return;
    if (!newPhoto.title || !newPhoto.imageUrl || !newPhoto.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    const photo: Photo = {
      id: Date.now().toString(),
      ...newPhoto,
    };
    const updatedPortfolio = { ...portfolio, photos: [...portfolio.photos, photo] };
    try {
      const allPortfolios = await fetchResource('Portfolio');
      const updated = Array.isArray(allPortfolios)
        ? allPortfolios.map((p: Portfolio) => p.id === portfolio.id ? updatedPortfolio : p)
        : [];
      await saveResource('Portfolio', updated);
      setPortfolio(updatedPortfolio);
      setShowAddPhoto(false);
      setNewPhoto({ title: '', imageUrl: '', category: '', description: '' });
      toast.success('Photo added');
    } catch {
      toast.error('Failed to add photo');
    }
  };

  const handleDeletePhoto = async () => {
    if (!portfolio || !photoToDelete) return;
    const updatedPortfolio = {
      ...portfolio,
      photos: portfolio.photos.filter(photo => photo.id !== photoToDelete.id),
    };
    try {
      const allPortfolios = await fetchResource('Portfolio');
      const updated = Array.isArray(allPortfolios)
        ? allPortfolios.map((p: Portfolio) => p.id === portfolio.id ? updatedPortfolio : p)
        : [];
      await saveResource('Portfolio', updated);
      setPortfolio(updatedPortfolio);
      setPhotoToDelete(null);
      setShowDeleteModal(false);
      toast.success('Photo deleted');
    } catch {
      toast.error('Failed to delete photo');
    }
  };

  // Multi-image upload handler with progress
  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setMultiImages(files.map(file => ({ file, uploading: true, url: '', public_id: '', title: '', category: '', description: '', progress: 0 })));
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
          // data.assets: [{ public_id, secure_url, ... }]
          setMultiImages(prev => [
            ...prev,
            ...data.assets.map((asset: any) => ({
              file: null,
              uploading: false,
              url: asset.secure_url,
              public_id: asset.public_id,
              title: '',
              category: '',
              description: '',
            }))
          ]);
          setSelectingFromCloudinary(false);
        },
      }
    );
    ml.show();
  };

  // Add all uploaded/selected images to portfolio (no required fields)
  const handleAddMultiPhotos = async () => {
    if (!portfolio) return;
    const validImages = multiImages.filter(img => img.url);
    if (validImages.length === 0) {
      toast.error('Please upload or select at least one image');
      return;
    }
    const newPhotos = validImages.map(img => ({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      imageUrl: img.url,
    }));
    const updatedPortfolio = { ...portfolio, photos: [...portfolio.photos, ...newPhotos] };
    try {
      const allPortfolios = await fetchResource('Portfolio');
      const updated = Array.isArray(allPortfolios)
        ? allPortfolios.map((p: Portfolio) => p.id === portfolio.id ? updatedPortfolio : p)
        : [];
      await saveResource('Portfolio', updated);
      setPortfolio(updatedPortfolio);
      setShowAddPhoto(false);
      setMultiImages([]);
      toast.success('Photos added');
    } catch {
      toast.error('Failed to add photos');
    }
  };

  const handleToggleStar = async (photoId: string) => {
    if (!portfolio) return;
    // Toggle isStarred in portfolio
    const updatedPhotos = portfolio.photos.map(photo =>
      photo.id === photoId ? { ...photo, isStarred: !photo.isStarred } : photo
    );
    const updatedPortfolio = { ...portfolio, photos: updatedPhotos };
    // Sync with Featured Work
    try {
      // Get current featured work
      let featuredWork = await fetchResource('FeaturedWork');
      let items = Array.isArray(featuredWork)
        ? featuredWork
        : (featuredWork && Array.isArray(featuredWork.items))
          ? featuredWork.items
          : [];
      const photo = updatedPhotos.find(p => p.id === photoId);
      if (!photo) return;
      if (photo.isStarred) {
        // Add to featured work if not present
        if (!items.some((fw: any) => fw.imageUrl === photo.imageUrl)) {
          items = [
            ...items,
            {
              id: photo.id,
              imageUrl: photo.imageUrl,
              isActive: true,
              order: items.length + 1,
            },
          ];
        }
      } else {
        // Remove from featured work if present
        items = items.filter((fw: any) => fw.imageUrl !== photo.imageUrl);
      }
      // Save featured work
      if (featuredWork && typeof featuredWork === 'object' && Array.isArray(featuredWork.items)) {
        await saveResource('FeaturedWork', { ...featuredWork, items });
      } else {
        await saveResource('FeaturedWork', items);
      }
      // Save portfolio
      const allPortfolios = await fetchResource('Portfolio');
      const updated = Array.isArray(allPortfolios)
        ? allPortfolios.map((p: Portfolio) => p.id === portfolio.id ? updatedPortfolio : p)
        : [];
      await saveResource('Portfolio', updated);
      setPortfolio(updatedPortfolio);
      toast.success(photo.isStarred ? 'Added to Featured Work' : 'Removed from Featured Work');
    } catch {
      toast.error('Failed to update featured work');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg text-red-600 font-semibold mb-4">Portfolio not found.</p>
        <button onClick={() => navigate('/portfolio-manager')} className="btn-secondary">Back to Portfolios</button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Image className="w-8 h-8 text-sage-600" />
            {portfolio.title}
          </h1>
          <p className="text-gray-600 mt-2">{portfolio.description}</p>
        </div>
        <button onClick={() => navigate('/portfolio-manager')} className="btn-secondary">Back to Portfolios</button>
      </div>
      <div className="flex items-center justify-between mt-8">
        <h2 className="text-2xl font-semibold text-wood-800">Photos</h2>
        <button onClick={() => setShowAddPhoto(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Photo
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.photos.length === 0 ? (
          <p>No photos in this portfolio. Add some!</p>
        ) : (
          portfolio.photos.map((photo, index) => (
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
                    onClick={() => handleToggleStar(photo.id)}
                    className={`p-2 rounded-full ${photo.isStarred ? 'bg-yellow-200 text-yellow-600' : 'bg-gray-100 text-gray-400'} hover:bg-yellow-300 hover:text-yellow-700 transition`}
                    title={photo.isStarred ? 'Remove from Featured Work' : 'Add to Featured Work'}
                  >
                    {photo.isStarred ? <Star className="w-5 h-5 fill-yellow-400" /> : <StarOff className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => { setPhotoToDelete(photo); setShowDeleteModal(true); }}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-wood-800 mb-1">{photo.title}</h3>
                <p className="text-sm text-wood-600 mb-2">{photo.description}</p>
                <span className="inline-block px-2 py-1 text-xs bg-sage-100 text-sage-700 rounded">
                  {photo.category}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
      {/* Add Photo Modal */}
      <AnimatePresence>
        {showAddPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => { setShowAddPhoto(false); setMultiImages([]); }}
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
                  <Plus className="w-6 h-6" /> Add Photo(s)
                </h2>
                <button
                  onClick={() => { setShowAddPhoto(false); setMultiImages([]); }}
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
                        <div className="flex-1 flex flex-col gap-2 w-full">
                          {/* Removed title, category, description input fields */}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex space-x-3 pt-4 sticky bottom-0 bg-white border-t border-gray-100 -mx-8 px-8 py-6 rounded-b-2xl">
                  <button
                    type="button"
                    onClick={() => { setShowAddPhoto(false); setMultiImages([]); }}
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
      {/* Delete Photo Modal */}
      <AnimatePresence>
        {showDeleteModal && photoToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="text-xl font-semibold text-red-700">Delete Photo</h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-lg text-red-700 font-semibold">Are you sure you want to delete this photo?</p>
                <p className="text-wood-700">This will permanently delete <span className="font-bold">{photoToDelete.title}</span>. This action cannot be undone.</p>
                <div className="flex space-x-3 pt-4 sticky bottom-0 bg-white border-t border-gray-200 -mx-6 px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeletePhoto}
                    className="flex-1 btn-danger"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
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

export default PortfolioDetails; 