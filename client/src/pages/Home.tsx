import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Heart, Users, Baby, GraduationCap, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const HERO_IMAGES = [
  '/images/cars/03.jpg',
  '/images/family/02.jpg',
  '/images/seasonal/02.jpg'
];

const FEATURED_PHOTOS = [
  { id: 1, imageUrl: '/images/seasonal/04.jpg', title: 'Seasonal' },
  { id: 2, imageUrl: '/images/cars/02.jpg', title: 'Cars' },
  { id: 3, imageUrl: '/images/senior/08.jpg', title: 'Seniors' },
  { id: 4, imageUrl: '/images/boudoir/03.jpg', title: 'Boudoir' },
  { id: 5, imageUrl: '/images/maternity/03.jpg', title: 'Maternity' },
  { id: 6, imageUrl: '/images/family/03.jpg', title: 'Family' },
  { id: 7, imageUrl: '/images/portrait/02.jpg', title: 'Portraits' },
];

const Home: React.FC = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [featureIndex, setFeatureIndex] = useState(0);

  
  useEffect(() => {
    const heroTimer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    
    const featureTimer = setInterval(() => {
      setFeatureIndex((prev) => (prev + 1) % FEATURED_PHOTOS.length);
    }, 5000); 

    return () => {
      clearInterval(heroTimer);
      clearInterval(featureTimer);
    };
  }, []);

  const nextFeatures = useCallback(() => {
    setFeatureIndex((prev) => (prev + 1) % FEATURED_PHOTOS.length);
  }, []);

  const prevFeatures = useCallback(() => {
    setFeatureIndex((prev) => (prev - 1 + FEATURED_PHOTOS.length) % FEATURED_PHOTOS.length);
  }, []);

  const visibleFeatures = [
    FEATURED_PHOTOS[featureIndex],
    FEATURED_PHOTOS[(featureIndex + 1) % FEATURED_PHOTOS.length],
    FEATURED_PHOTOS[(featureIndex + 2) % FEATURED_PHOTOS.length],
  ];

  return (
    <div className="min-h-screen bg-wood-50 overflow-x-hidden">
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-wood-900">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.img
              key={heroIndex}
              src={HERO_IMAGES[heroIndex]}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
            />
          </AnimatePresence>
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl font-vintage mb-4 tracking-tight">Jessi Bradford</h1>
            <p className="text-2xl md:text-3xl font-cursive text-wood-100 mb-10 opacity-90">Photography</p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link to="/portfolio" className="btn-primary px-10 py-4 rounded-full bg-white text-wood-900 hover:bg-wood-100 transition-all font-medium">
                View Portfolio
              </Link>
              <Link to="/contact" className="btn-secondary px-10 py-4 rounded-full border-2 border-white text-white hover:bg-white hover:text-wood-900 transition-all font-medium">
                Book Session
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-5xl font-vintage text-wood-800">Featured Work</h2>
            <p className="text-wood-600 mt-3 text-lg">Capturing the heart of Salina and beyond</p>
          </div>
          <div className="flex gap-3">
            <button onClick={prevFeatures} className="group p-3 rounded-full bg-white border border-wood-200 shadow-sm hover:bg-wood-800 transition-all">
              <ChevronLeft className="w-6 h-6 text-wood-800 group-hover:text-white" />
            </button>
            <button onClick={nextFeatures} className="group p-3 rounded-full bg-white border border-wood-200 shadow-sm hover:bg-wood-800 transition-all">
              <ChevronRight className="w-6 h-6 text-wood-800 group-hover:text-white" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-hidden py-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleFeatures.map((photo, idx) => (
              <motion.div
                key={`${photo.id}-${idx}`}
                layout
                initial={{ opacity: 0, filter: 'blur(0px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(0px)' }}
                transition={{ 
                  duration: 0.8, 
                  ease: "easeInOut",
                  layout: { duration: 0.6, ease: "easeInOut" } 
                }}
                className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer"
              >
                <img 
                  src={photo.imageUrl} 
                  alt={photo.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wood-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <h4 className="text-white font-vintage text-2xl">{photo.title}</h4>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
      <section className="py-32 text-center px-4">
        <h2 className="text-5xl font-vintage text-wood-800 mb-6">Let's create something timeless</h2>
        <p className="text-xl text-wood-600 mb-10 max-w-2xl mx-auto italic font-light">
          Available for travel throughout Sevier County and the surrounding areas.
        </p>
        
        {/* Added this wrapper div to handle spacing and centering */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <Link to="/contact" className="btn-primary inline-block px-12 py-4 rounded-full bg-wood-800 text-white hover:bg-wood-900 transition-all text-lg font-medium">
            Get in Touch
          </Link>
          <Link to="/services" className="btn-primary inline-block px-12 py-4 rounded-full bg-wood-800 text-white hover:bg-wood-900 transition-all text-lg font-medium">
            My Services
          </Link>
        </div>
      </section>
    </div>
  );
};


export default Home;