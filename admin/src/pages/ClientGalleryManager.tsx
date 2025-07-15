import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Eye, Lock, Download, Share2, Edit } from 'lucide-react';
import { fetchResource, saveResource } from '../api';
import toast from 'react-hot-toast';
import { useRef } from 'react';

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '';
const CLOUDINARY_API_KEY = process.env.REACT_APP_CLOUDINARY_API_KEY || '';
declare global {
  interface Window {
    cloudinary: any;
  }
}

const defaultGallery = {
  id: '',
  clientName: '',
  accessCode: '',
  sessionType: '',
  photos: [],
  maxSelectable: 10,
  extraPhotoPrice: 0,
  selectedPhotoIds: [],
  locked: false,
  selectionLocked: false, // <-- add this
  status: 'active',
};

const ClientGalleryManager: React.FC = () => {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState<any | null>(null);
  const [form, setForm] = useState<any>(defaultGallery);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [multiImages, setMultiImages] = useState<any[]>([]); // {file, uploading, url, public_id, progress}
  const [cloudinaryReady, setCloudinaryReady] = useState(false);
  const [selectingFromCloudinary, setSelectingFromCloudinary] = useState(false);

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
    // Cloudinary widget loader
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

  const openCreateModal = () => {
    setForm({ ...defaultGallery, id: Date.now().toString(), accessCode: generateAccessCode() });
    setEditingGallery(null);
    setShowModal(true);
  };

  const openEditModal = (gallery: any) => {
    setForm(gallery);
    setEditingGallery(gallery);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGallery(null);
    setForm(defaultGallery);
  };

  function generateAccessCode() {
    // 24-char alphanumeric
    return Array.from({length: 24}, () => Math.random().toString(36)[2]).join('').toUpperCase();
  }

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

  const handleSave = async () => {
    try {
      let updated;
      if (editingGallery) {
        updated = galleries.map(g => g.id === form.id ? form : g);
      } else {
        updated = [...galleries, form];
      }
      await saveResource('ClientGallery', updated);
      setGalleries(updated);
      setShowModal(false);
      setEditingGallery(null);
      setForm(defaultGallery);
      toast.success('Gallery saved');
    } catch (e) {
      toast.error('Failed to save gallery');
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

  // Add all uploaded/selected images to form.photos
  const handleAddMultiPhotos = () => {
    const validImages = multiImages.filter(img => img.url);
    if (validImages.length === 0) {
      toast.error('Please upload or select at least one image');
      return;
    }
    const newPhotos = validImages.map(img => ({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      imageUrl: img.url,
      public_id: img.public_id,
    }));
    setForm({ ...form, photos: [...form.photos, ...newPhotos] });
    setMultiImages([]);
  };

  // Remove photo from form.photos
  const handleRemovePhoto = (photoId: string) => {
    setForm({ ...form, photos: form.photos.filter((p: any) => p.id !== photoId) });
  };

  // Add lock/unlock toggle for each gallery
  const handleToggleLock = async (gallery: any) => {
    const updated = galleries.map(g => g.id === gallery.id ? { ...g, locked: !g.locked } : g);
    setGalleries(updated);
    try {
      await saveResource('ClientGallery', updated);
      toast.success(gallery.locked ? 'Gallery unlocked' : 'Gallery locked');
    } catch {
      toast.error('Failed to update lock status');
    }
  };

  // Delete gallery
  const handleDeleteGallery = async (galleryId: string) => {
    if (!window.confirm('Are you sure you want to delete this gallery? This cannot be undone.')) return;
    const updated = galleries.filter(g => g.id !== galleryId);
    setGalleries(updated);
    try {
      await saveResource('ClientGallery', updated);
      toast.success('Gallery deleted');
    } catch {
      toast.error('Failed to delete gallery');
    }
  };

  // Get unique access codes and associated client names
  const accessCodeOptions: [string, string][] = Array.from(
    galleries.reduce((map, g) => {
      if (g.accessCode) map.set(g.accessCode, g.clientName);
      return map;
    }, new Map<string, string>())
  );

  const handleToggleSelectionLock = async (gallery: any) => {
    const updated = galleries.map(g => g.id === gallery.id ? { ...g, selectionLocked: !g.selectionLocked } : g);
    setGalleries(updated);
    try {
      await saveResource('ClientGallery', updated);
      toast.success(gallery.selectionLocked ? 'Selection unlocked' : 'Selection locked');
    } catch {
      toast.error('Failed to update selection lock');
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
        <button className="btn-primary flex items-center space-x-2" onClick={openCreateModal}>
          <Plus className="w-4 h-4" />
          <span>Create Gallery</span>
        </button>
      </div>
      {/* Modal skeleton for create/edit gallery */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-gray-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-sage-700 flex items-center gap-2">
                {editingGallery ? 'Edit Gallery' : 'Create Gallery'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 rounded-full p-2 transition">
                <span className="sr-only">Close</span>
                ×
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input type="text" className="input-field w-full" value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Type</label>
                <input type="text" className="input-field w-full" value={form.sessionType} onChange={e => setForm({ ...form, sessionType: e.target.value })} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Selectable</label>
                  <input type="number" min={1} className="input-field w-full" value={form.maxSelectable} onChange={e => setForm({ ...form, maxSelectable: Number(e.target.value) })} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Extra Photo Price</label>
                  <input type="number" min={0} className="input-field w-full" value={form.extraPhotoPrice} onChange={e => setForm({ ...form, extraPhotoPrice: Number(e.target.value) })} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.locked} onChange={e => setForm({ ...form, locked: e.target.checked })} />
                <span className="text-sm">Lock Gallery</span>
                <input type="checkbox" checked={form.selectionLocked} onChange={e => setForm({ ...form, selectionLocked: e.target.checked })} className="ml-4" />
                <span className="text-sm">Lock Selection</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Code</label>
                <div className="flex gap-2 items-center">
                  <select
                    className="input-field w-full font-mono"
                    value={form.accessCode}
                    onChange={e => setForm({ ...form, accessCode: e.target.value })}
                  >
                    <option value="">-- Generate New --</option>
                    {accessCodeOptions.map(function(option) {
                      const [code, name] = option;
                      return <option key={code} value={code}>{code} ({name})</option>;
                    })}
                  </select>
                  <button
                    type="button"
                    className="btn-secondary px-2 py-1"
                    onClick={() => setForm({ ...form, accessCode: generateAccessCode() })}
                  >
                    New
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Photos</label>
                <div className="flex flex-col md:flex-row gap-4 mb-2">
                  <button type="button" className="btn-primary flex-1" onClick={() => fileInputRef.current?.click()}>
                    Upload Images
                  </button>
                  <input type="file" accept="image/*" multiple ref={fileInputRef} style={{ display: 'none' }} onChange={handleFiles} />
                  <button type="button" className="btn-secondary flex-1" onClick={openCloudinaryMediaLibrary} disabled={!cloudinaryReady || selectingFromCloudinary}>
                    Select from Cloudinary
                  </button>
                </div>
                {multiImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    {multiImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img.url || (img.file && URL.createObjectURL(img.file))} alt="preview" className="w-full h-32 object-cover rounded-lg border" />
                        {img.uploading && <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center text-xs">{img.progress}%</div>}
                      </div>
                    ))}
                  </div>
                )}
                {multiImages.length > 0 && (
                  <button type="button" className="btn-primary w-full mb-2" onClick={handleAddMultiPhotos}>Add to Gallery</button>
                )}
                {form.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {form.photos.map((photo: any) => (
                      <div key={photo.id} className="relative group">
                        <img src={photo.imageUrl} alt="gallery" className="w-full h-24 object-cover rounded-lg border" />
                        <button type="button" className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-red-500 hover:text-red-700" onClick={() => handleRemovePhoto(photo.id)}>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-4 justify-end pt-4">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  {gallery.locked ? <Lock className="w-6 h-6 text-red-500" /> : <Users className="w-6 h-6 text-sage-600" />}
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600" onClick={() => handleToggleLock(gallery)} title={gallery.locked ? 'Unlock Gallery' : 'Lock Gallery'}>
                    {gallery.locked ? <Lock className="w-4 h-4 text-red-500" /> : <Lock className="w-4 h-4 text-gray-400" />}
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600" onClick={() => openEditModal(gallery)}>
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600" onClick={() => handleDeleteGallery(gallery.id)} title="Delete Gallery">
                    ×
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{gallery.clientName}</h3>
              <p className="text-sm text-gray-600 mb-2">{gallery.sessionType}</p>
              <p className="text-sm text-gray-500 mb-2">{gallery.photos?.length || 0} photos</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{gallery.locked ? 'Locked' : 'Unlocked'}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">Selected: {gallery.selectedPhotoIds?.length || 0}</span>
                {gallery.maxSelectable && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Max: {gallery.maxSelectable}</span>
                )}
                <button
                  className={`ml-2 px-2 py-1 rounded text-xs font-medium ${gallery.selectionLocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                  onClick={() => handleToggleSelectionLock(gallery)}
                >
                  {gallery.selectionLocked ? 'Selection Locked' : 'Selection Unlocked'}
                </button>
              </div>
              {/* Show selected photo thumbnails */}
              {gallery.selectedPhotoIds && gallery.selectedPhotoIds.length > 0 && gallery.photos && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {gallery.selectedPhotoIds.map((pid: string) => {
                    const photo = gallery.photos.find((p: any) => p.id === pid);
                    return photo ? (
                      <img key={pid} src={photo.imageUrl} alt="selected" className="w-10 h-10 object-cover rounded border" />
                    ) : null;
                  })}
                </div>
              )}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Access Code:</span>
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{gallery.accessCode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(gallery.status)}`}>{gallery.status}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                <button className="btn-primary text-sm py-1 px-3 flex items-center space-x-1" onClick={() => handleToggleLock(gallery)}>
                  <Lock className="w-3 h-3" />
                  <span>{gallery.locked ? 'Unlock' : 'Lock'}</span>
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