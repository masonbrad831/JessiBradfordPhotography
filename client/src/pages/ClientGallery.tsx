import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, Download, Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchResource } from '../api';
import { patchResource } from '../api';
import { useRef } from 'react';

const ClientGallery: React.FC = () => {
  const [accessCode, setAccessCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clientGalleries, setClientGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedGallery, setSelectedGallery] = useState<any | null>(null);
  // Move these hooks to the top level
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'selected' | 'unselected'>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [lockedBySubmit, setLockedBySubmit] = useState(false);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Reset selection/filter/lightbox when gallery changes
  useEffect(() => {
    if (selectedGallery) {
      setSelectedPhotos(selectedGallery.selectedPhotoIds || []);
      setFilter('all');
      setLightboxOpen(false);
      setLightboxIndex(0);
    }
  }, [selectedGallery]);

  useEffect(() => {
    async function loadGalleries() {
      setLoading(true);
      try {
        const galleriesData = await fetchResource('ClientGallery');
        setClientGalleries(Array.isArray(galleriesData) ? galleriesData : []);
      } catch (e) {
        setClientGalleries([]);
      } finally {
        setLoading(false);
      }
    }
    loadGalleries();
  }, []);

  useEffect(() => {
    if (selectedGallery && selectedGallery.selectionLocked) {
      setLockedBySubmit(true);
    }
  }, [selectedGallery]);

  const handleAccessCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSelectedGallery(null);
    try {
      const galleriesData = await fetchResource('ClientGallery');
      const matches = Array.isArray(galleriesData)
        ? galleriesData.filter((g: any) => g.accessCode && g.accessCode.toLowerCase() === accessCode.trim().toLowerCase())
        : [];
      if (matches.length === 0) {
        setError('No galleries found for that access code.');
        setIsAuthenticated(false);
      } else {
        setClientGalleries(matches);
        setIsAuthenticated(true);
        if (matches.length === 1) {
          setSelectedGallery(matches[0]);
        }
      }
    } catch (e) {
      setError('Failed to fetch galleries.');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-sage-600" />
              </div>
              <h1 className="text-3xl font-serif font-semibold text-sage-800 mb-2">
                Client Gallery
              </h1>
              <p className="text-sage-600">
                Enter your access code to view your gallery
              </p>
            </div>

            <form onSubmit={handleAccessCodeSubmit} className="space-y-6">
              <div>
                <label htmlFor="accessCode" className="block text-sm font-medium text-sage-700 mb-2">
                  Access Code
                </label>
                <input
                  type="text"
                  id="accessCode"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="Enter your access code"
                />
              </div>
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Checking...' : 'Access Gallery'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-sage-600">
                Don't have your code? Contact me at{' '}
                <a href="mailto:bradford.j.photos@gmail.com" className="text-sage-700 hover:text-sage-800">
                  bradford.j.photos@gmail.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // If multiple galleries, show a list to pick from
  if (isAuthenticated && !selectedGallery && clientGalleries.length > 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-cream-100 flex items-center justify-center py-16">
        <div className="container-custom max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl shadow-2xl p-10 border border-sage-100"
          >
            <h2 className="text-3xl font-bold text-sage-800 mb-8 text-center font-serif tracking-tight">Select Your Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {clientGalleries.map((gallery) => (
                <div
                  key={gallery.id}
                  className="rounded-3xl bg-sage-50 border border-sage-200 shadow-md hover:shadow-2xl transition-shadow flex flex-col items-stretch group cursor-pointer overflow-hidden min-h-[260px] md:min-h-[320px] p-2"
                >
                  <div className="flex-1 flex flex-col justify-between p-8 md:p-10">
                    <div className="mb-8">
                      <h3 className="text-2xl md:text-3xl font-bold text-sage-900 mb-3 font-serif group-hover:text-sage-700 transition-colors">{gallery.sessionType || 'Gallery'}</h3>
                      <p className="text-sage-700 text-lg mb-2">{gallery.clientName}</p>
                      {gallery.sessionDate && <p className="text-sage-400 text-base">{new Date(gallery.sessionDate).toLocaleDateString()}</p>}
                    </div>
                    <button
                      className="btn-primary w-full py-4 text-xl font-bold rounded-2xl mt-4 group-hover:scale-105 transition-transform shadow-lg"
                      style={{ minHeight: '56px' }}
                      onClick={() => setSelectedGallery(gallery)}
                    >
                      View Gallery
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Gallery view for selectedGallery
  if (selectedGallery) {
    const maxSelectable = selectedGallery.maxSelectable || 0;
    const extraPhotoPrice = selectedGallery.extraPhotoPrice || 0;
    const locked = selectedGallery.locked;
    const photos = Array.isArray(selectedGallery.photos) ? selectedGallery.photos : [];

    // Filtered photos
    const filteredPhotos = photos.filter((photo: any) => {
      if (filter === 'selected') return selectedPhotos.includes(photo.id);
      if (filter === 'unselected') return !selectedPhotos.includes(photo.id);
      return true;
    });

    // Selection logic
    const togglePhotoSelection = (photoId: string) => {
      if (locked || selectionLocked) return;
      setSelectedPhotos(prev =>
        prev.includes(photoId)
          ? prev.filter(id => id !== photoId)
          : [...prev, photoId]
      );
    };

    // Slideshow/lightbox state
    const openLightbox = (idx: number) => {
      if (locked) return;
      setLightboxIndex(idx);
      setLightboxOpen(true);
    };
    const closeLightbox = () => setLightboxOpen(false);
    const gotoPrev = () => setLightboxIndex(i => (i - 1 + filteredPhotos.length) % filteredPhotos.length);
    const gotoNext = () => setLightboxIndex(i => (i + 1) % filteredPhotos.length);
    const currentPhoto = filteredPhotos[lightboxIndex];

    // Submit selection handler
    const handleSubmitSelection = async () => {
      setSubmitting(true);
      setSubmitSuccess(false);
      try {
        // Fetch all galleries, update this one, PATCH to backend
        const allGalleries = await fetchResource('ClientGallery');
        const updatedGalleries = Array.isArray(allGalleries)
          ? allGalleries.map((g: any) =>
              g.id === selectedGallery.id
                ? { ...g, selectedPhotoIds: selectedPhotos, selectionLocked: true }
                : g
            )
          : [];
        await patchResource('ClientGallery', updatedGalleries);
        setSubmitSuccess(true);
        setShowConfirmModal(true);
      } catch {
        setSubmitSuccess(false);
      } finally {
        setSubmitting(false);
      }
    };

    // Prevent selection changes if locked by submit or selectionLocked is true
    const selectionLocked = lockedBySubmit || selectedGallery.selectionLocked;

    // UI
    return (
      <div className="min-h-screen bg-cream-50">
        <section className="bg-sage-800 text-white py-12">
          <div className="container-custom text-center">
            <h1 className="text-4xl font-serif font-bold mb-2">{selectedGallery.sessionType || 'Gallery'}</h1>
            <p className="text-lg text-sage-200 mb-2">{selectedGallery.clientName}</p>
            {locked && <div className="flex justify-center items-center gap-2 text-red-200 font-semibold"><Lock className="w-5 h-5" /> This gallery is locked</div>}
          </div>
        </section>
        <section className="section-padding bg-cream-100">
          <div className="container-custom">
            {/* Filter buttons */}
            <div className="flex gap-2 mb-6">
              <button className={`btn-secondary ${filter === 'all' ? 'ring-2 ring-sage-400' : ''}`} onClick={() => setFilter('all')}>All</button>
              <button className={`btn-secondary ${filter === 'selected' ? 'ring-2 ring-sage-400' : ''}`} onClick={() => setFilter('selected')}>Selected</button>
              <button className={`btn-secondary ${filter === 'unselected' ? 'ring-2 ring-sage-400' : ''}`} onClick={() => setFilter('unselected')}>Unselected</button>
            </div>
            {/* Photo grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {locked ? (
                Array.from({ length: photos.length || 8 }).map((_, idx) => (
                  <div key={idx} className="aspect-[4/3] bg-sage-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-8 h-8 text-sage-400" />
                  </div>
                ))
              ) : filteredPhotos.length === 0 ? (
                <div className="col-span-full text-center text-sage-600">No photos to display.</div>
              ) : filteredPhotos.map((photo: any, idx: number) => {
                const isSelected = selectedPhotos.includes(photo.id);
                return (
                  <div key={photo.id} className="relative group cursor-pointer" onClick={() => openLightbox(idx)}>
                    <img src={photo.imageUrl} alt="gallery" className="w-full h-40 object-cover rounded-lg border" />
                    <button
                      type="button"
                      className={`absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 transition ${isSelected ? 'text-red-500' : 'text-gray-400'}`}
                      tabIndex={-1}
                      aria-label={isSelected ? 'Unselect photo' : 'Select photo'}
                      onClick={e => { e.stopPropagation(); togglePhotoSelection(photo.id); }}
                    >
                      <Heart className={`w-6 h-6 ${isSelected ? 'fill-red-500' : 'fill-none'}`} />
                    </button>
                  </div>
                );
              })}
            </div>
            {/* Selection info and extra charge */}
            {!locked && (
              <div className="mt-8 flex flex-col items-center gap-2">
                <div className="text-sage-700 font-medium">
                  Selected: {selectedPhotos.length} / {maxSelectable || '∞'}
                  {maxSelectable > 0 && selectedPhotos.length > maxSelectable && (
                    <span className="ml-2 text-red-600 font-semibold">+
                      ${(selectedPhotos.length - maxSelectable) * extraPhotoPrice} extra
                    </span>
                  )}
                </div>
                <div className="text-xs text-sage-500">Click a photo to enlarge or select.</div>
                {selectedPhotos.length > 0 && !selectionLocked && (
                  <button
                    className="btn-primary mt-4"
                    onClick={handleSubmitSelection}
                    disabled={submitting}
                    ref={confirmButtonRef}
                  >
                    {submitting ? 'Submitting...' : submitSuccess ? 'Submitted!' : 'Submit Selection'}
                  </button>
                )}
                {selectionLocked && (
                  <div className="text-green-600 text-sm mt-2">Your selection has been submitted and is now locked. Contact your photographer to request changes.</div>
                )}
                {/* Confirmation Modal */}
                {showConfirmModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                      <h3 className="text-2xl font-bold mb-4 text-sage-800">Selection Submitted</h3>
                      <p className="text-sage-700 mb-6">Your selection has been submitted! No changes are allowed unless requested. If you need to make changes, please contact your photographer.</p>
                      <div className="flex gap-4 mt-6">
                        <button
                          className="btn-secondary w-1/2"
                          onClick={() => { setShowConfirmModal(false); setSubmitSuccess(false); }}
                        >
                          Go Back
                        </button>
                        <button
                          className="btn-primary w-1/2"
                          onClick={() => { setShowConfirmModal(false); setLockedBySubmit(true); }}
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
        {/* Lightbox modal */}
        {lightboxOpen && !locked && currentPhoto && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
            <button className="absolute top-4 right-4 text-white bg-black bg-opacity-40 rounded-full p-2" onClick={closeLightbox}><X className="w-6 h-6" /></button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-40 rounded-full p-2" onClick={gotoPrev}><ChevronLeft className="w-6 h-6" /></button>
            <div className="max-w-3xl w-full flex flex-col items-center">
              <img src={currentPhoto.imageUrl} alt="enlarged" className="max-h-[70vh] w-auto rounded-lg shadow-lg mb-4" />
              <button
                type="button"
                className={`bg-white bg-opacity-80 rounded-full p-2 transition ${selectedPhotos.includes(currentPhoto.id) ? 'text-red-500' : 'text-gray-400'}`}
                onClick={() => togglePhotoSelection(currentPhoto.id)}
              >
                <Heart className={`w-8 h-8 ${selectedPhotos.includes(currentPhoto.id) ? 'fill-red-500' : 'fill-none'}`} />
              </button>
            </div>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-40 rounded-full p-2" onClick={gotoNext}><ChevronRight className="w-6 h-6" /></button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <section className="bg-sage-800 text-white py-20">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-serif font-bold mb-6">Client Gallery</h1>
            <p className="text-xl text-sage-200 max-w-2xl mx-auto">
              View and download your beautiful photos from our session together
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding bg-cream-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center text-sage-600">Loading galleries...</div>
            ) : clientGalleries.length === 0 ? (
              <div className="col-span-full text-center text-sage-600">No galleries found.</div>
            ) : clientGalleries.map((gallery, index) => (
              <motion.div
                key={gallery.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-cream-200 rounded-lg overflow-hidden shadow-lg card-hover"
              >
                <div className="aspect-[4/3] bg-sage-200 relative overflow-hidden">
                  <img
                    src={gallery.coverImage}
                    alt={`${gallery.clientName} Gallery`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-sage-800 mb-2">
                    {gallery.clientName}
                  </h3>
                  <p className="text-sage-600 mb-2">
                    {gallery.category} Session
                  </p>
                  <p className="text-sm text-sage-500 mb-4">
                    {new Date(gallery.sessionDate).toLocaleDateString()} • {gallery.photoCount} photos
                  </p>
                  <button className="btn-primary w-full">
                    View Gallery
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClientGallery; 