import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Heart, Users, Baby, GraduationCap, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

// Configuration moved outside component for performance
const HERO_IMAGES = [
  '/images/cars/03.jpg',
  '/images/family/02.jpg',
  '/images/fall/02.jpg'
];

const FEATURED_PHOTOS = [
  { id: 1, imageUrl: '/images/fall/04.jpg', title: 'Fall Sessions' },
  { id: 2, imageUrl: '/images/cars/03.jpg', title: 'Automotive' },
  { id: 3, imageUrl: '/images/senior/03.jpg', title: 'Seniors' },
  { id: 4, imageUrl: '/images/boudoir/03.jpg', title: 'Boudoir' },
  { id: 5, imageUrl: '/images/maternity/03.jpg', title: 'Maternity' },
  { id: 6, imageUrl: '/images/family/03.jpg', title: 'Family' },
  { id: 7, imageUrl: '/images/portrait/03.jpg', title: 'Portraits' },
];

const ICON_MAP: Record<string, any> = { Camera, Heart, Users, Baby, GraduationCap, Sparkles };

const Home: React.FC = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [featureIndex, setFeatureIndex] = useState(0);

  // --- Auto-Rotation Logic ---
  
  useEffect(() => {
    const heroTimer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    
    const featureTimer = setInterval(() => {
      setFeatureIndex((prev) => (prev + 1) % FEATURED_PHOTOS.length);
    }, 5000); // Rotates featured work every 5 seconds

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

  // Logic for the 3-at-a-time Feature Slider
  const visibleFeatures = [
    FEATURED_PHOTOS[featureIndex],
    FEATURED_PHOTOS[(featureIndex + 1) % FEATURED_PHOTOS.length],
    FEATURED_PHOTOS[(featureIndex + 2) % FEATURED_PHOTOS.length],
  ];

  return (
    <div className="min-h-screen bg-wood-50 overflow-x-hidden">
      {/* --- HERO SECTION --- */}
      {/* Using 'fixed' or 'absolute' with inset-0 and object-cover to prevent white edges */}
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

      {/* --- FEATURED WORK --- */}
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

        {/* The Grid: 'overflow-hidden' here prevents any edge-bleeding of the next/prev images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-hidden py-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleFeatures.map((photo, idx) => (
              <motion.div
                key={`${photo.id}-${idx}`} // Complex key helps smooth the transition
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

      {/* --- SERVICES --- */}
      <section className="py-24 bg-wood-100/50 wood-texture border-y border-wood-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-vintage text-wood-800">The Experience</h2>
            <p className="text-wood-600 mt-2">Professional sessions tailored to your story</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {SERVICES.map((service) => {
              const Icon = ICON_MAP[service.icon] || Camera;
              return (
                <div key={service.id} className="group bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 border border-transparent hover:border-wood-200">
                  <div className="w-16 h-16 bg-wood-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-wood-800 transition-colors duration-500">
                    <Icon className="w-8 h-8 text-wood-700 group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-2xl font-semibold text-wood-800 mb-4">{service.name}</h3>
                  <p className="text-wood-600 leading-relaxed text-lg">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-32 text-center px-4">
        <h2 className="text-5xl font-vintage text-wood-800 mb-6">Let's create something timeless</h2>
        <p className="text-xl text-wood-600 mb-10 max-w-2xl mx-auto italic font-light">
          Available for travel throughout Sevier County and the surrounding mountain West.
        </p>
        <Link to="/contact" className="btn-primary inline-block px-12 py-4 rounded-full bg-wood-800 text-white hover:bg-wood-900 transition-all text-lg font-medium">
          Get in Touch
        </Link>
      </section>
    </div>
  );
};

const SERVICES = [
  { id: 1, name: 'Portrait', icon: 'Camera', description: 'Personal sessions designed to capture your personality naturally.' },
  { id: 2, name: 'Couples', icon: 'Heart', description: 'Highlighting the connection, laughter, and love between partners.' },
  { id: 3, name: 'Family', icon: 'Users', description: 'Authentic moments capturing genuine everyday connections.' },
  { id: 4, name: 'Newborn', icon: 'Baby', description: 'Soft, intimate sessions focused on those first precious days.' },
  { id: 5, name: 'Maternity', icon: 'Sparkles', description: 'Celebrating the anticipation and joy of welcoming new life.' },
  { id: 6, name: 'Seniors', icon: 'GraduationCap', description: 'Showcasing your personality during this milestone moment.' }
];

export default Home;