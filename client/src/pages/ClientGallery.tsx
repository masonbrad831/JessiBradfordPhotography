import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, Download, Heart } from 'lucide-react';
import { fetchResource } from '../api';

const ClientGallery: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [clientGalleries, setClientGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password verification
    setIsAuthenticated(true);
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
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
                Enter your gallery password to view your photos
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-sage-700 mb-2">
                  Gallery Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
              >
                Access Gallery
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-sage-600">
                Don't have your password? Contact me at{' '}
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

      {/* Photo Selection Actions */}
      {selectedPhotos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-4 border border-sage-200"
        >
          <div className="flex items-center space-x-4">
            <span className="text-sage-700">
              {selectedPhotos.length} photo{selectedPhotos.length !== 1 ? 's' : ''} selected
            </span>
            <button className="btn-primary">
              Download Selected
            </button>
            <button 
              onClick={() => setSelectedPhotos([])}
              className="text-sage-600 hover:text-sage-700"
            >
              Clear
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ClientGallery; 