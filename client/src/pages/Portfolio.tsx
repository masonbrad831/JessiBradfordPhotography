import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Download, Heart, Star } from 'lucide-react';
import { fetchResource } from '../api';

const Portfolio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'portrait', name: 'Portraits' },
    { id: 'couple', name: 'Couples' },
    { id: 'family', name: 'Family' },
    { id: 'engagement', name: 'Engagement' },
    { id: 'wedding', name: 'Wedding' }
  ];

  useEffect(() => {
    async function loadPhotos() {
      setLoading(true);
      try {
        const portfolioData = await fetchResource('Portfolio');
        if (portfolioData && Array.isArray(portfolioData.photos)) {
          setPhotos(portfolioData.photos.filter((photo: any) => photo.isActive !== false));
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

  const filteredPhotos = selectedCategory === 'all' 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="bg-sage-800 text-white py-20">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-serif font-bold mb-6">Portfolio</h1>
            <p className="text-xl text-sage-200 max-w-2xl mx-auto">
              Explore my collection of moody, artistic photography capturing life's beautiful moments
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="section-padding bg-cream-100">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-sage-600 text-white'
                    : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center text-sage-600">Loading photos...</div>
            ) : filteredPhotos.length === 0 ? (
              <div className="col-span-full text-center text-sage-600">No photos found.</div>
            ) : filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-cream-200 rounded-lg overflow-hidden shadow-lg card-hover"
              >
                <div className="aspect-[3/4] bg-sage-200 relative overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => togglePhotoSelection(photo.id)}
                        className={`p-3 rounded-full transition-colors ${
                          selectedPhotos.includes(photo.id)
                            ? 'bg-sage-600 text-white'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                      <button className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-sage-800 mb-2">
                    {photo.title}
                  </h3>
                  <p className="text-sage-600 capitalize">
                    {photo.category} Photography
                  </p>
                  {photo.description && (
                    <p className="text-sage-500 text-sm mt-2">
                      {photo.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Selection Actions */}
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
      </section>
    </div>
  );
};

export default Portfolio; 