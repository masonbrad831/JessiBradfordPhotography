import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Heart, Users, MapPin, Baby, GraduationCap, Sparkles } from 'lucide-react';

const ICON_MAP: Record<string, any> = { Camera, Heart, Users, Baby, GraduationCap, Sparkles };

const hero1 = '/images/car.jpeg';
const hero2 = '/images/car.jpeg';
const hero3 = '/images/baby.jpeg';

const feature1 = '/images/car.jpeg';
const feature2 = '/images/car.jpeg';
const feature3 = '/images/family.jpeg';

const introImg = '/images/car.jpeg';

const Home: React.FC = () => {
  const heroImages = [hero1, hero2, hero3];
  const featuredPhotos = [
    { id: 1, imageUrl: feature1, title: 'Feature 1' },
    { id: 2, imageUrl: feature2, title: 'Feature 2' },
    { id: 3, imageUrl: feature3, title: 'Feature 3' },
  ];
  const homeIntro = {
    heading: 'Based in Salina, Utah',
    description:
      'I specialize in capturing authentic moments through portrait, couple, and family photography. My warm, rustic style brings out the natural beauty and emotion in every session.',
    location: 'Serving Sevier County',
    buttonText: 'Learn More About Me',
    buttonLink: '/about',
    imageUrl: introImg,
  };

  
  const services = [
  {
    id: 1,
    name: 'Portrait',
    icon: 'Camera',
    description: 'Personal portrait sessions designed to capture your personality in a natural, relaxed way.'
  },
  {
    id: 2,
    name: 'Couples',
    icon: 'Heart',
    description: 'Romantic sessions that highlight the connection, laughter, and love between you and your partner.'
  },
  {
    id: 3,
    name: 'Family & Lifestyle',
    icon: 'Users',
    description: 'Authentic family sessions that capture genuine moments, laughter, and everyday connections.'
  },
  {
    id: 4,
    name: 'Newborn',
    icon: 'Baby',
    description: 'Soft, intimate sessions focused on preserving the first precious days of your baby’s life.'
  },
  {
    id: 5,
    name: 'Maternity',
    icon: 'Sparkles',
    description: 'Beautiful maternity portraits celebrating the anticipation and joy of welcoming new life.'
  },
  {
    id: 6,
    name: 'Seniors',
    icon: 'GraduationCap',
    description: 'Senior photo sessions that showcase your personality and celebrate this milestone moment.'
  }
];

  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrentHero((prev) => (prev + 1) % heroImages.length), 8000);
    return () => clearInterval(interval);
  }, []);

  const prevHero = () => setCurrentHero((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  const nextHero = () => setCurrentHero((prev) => (prev + 1) % heroImages.length);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0">
          <AnimatePresence mode="wait">
            {heroImages.map((img, index) =>
              index === currentHero ? (
                <motion.div
                  key={img}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-xl brightness-75"
                  style={{ backgroundImage: `url('${img}')` }}
                ></motion.div>
              ) : null
            )}
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentHero}
              src={heroImages[currentHero]}
              alt="Hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="max-w-3xl w-full h-auto rounded-lg shadow-xl object-contain"
              style={{ maxHeight: '80vh' }}
            />
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-wood-900/80 to-farmhouse-900/80 z-20"></div>

        <div className="relative z-30 text-center text-white container-custom">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-vintage font-bold mb-6">Jessi Bradford</h1>
            <p className="text-2xl md:text-3xl font-cursive mb-8">Photography</p>
            <p className="text-xl md:text-2xl text-wood-200 mb-12 max-w-2xl mx-auto">
              Capturing life's beautiful moments with a warm, rustic approach
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/portfolio" className="btn-primary inline-flex items-center">
                View Portfolio
              </Link>
              <Link to="/contact" className="btn-secondary text-white border-white hover:bg-white hover:text-wood-800">
                Book Session
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Subtle Arrows */}
        <div className="absolute inset-0 z-30 flex items-center justify-between px-6 pointer-events-none">
          <button
            onClick={prevHero}
            className="pointer-events-auto text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-300"
          >
            ‹
          </button>
          <button
            onClick={nextHero}
            className="pointer-events-auto text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-300"
          >
            ›
          </button>
        </div>
      </section>

      {/* About Preview */}
      <section className="section-padding bg-wood-50 wood-texture">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-vintage font-semibold text-wood-800 mb-6">{homeIntro.heading}</h2>
            <p className="text-lg text-wood-700 mb-6">{homeIntro.description}</p>
            <div className="flex items-center space-x-4 mb-6">
              <MapPin className="w-6 h-6 text-wood-600" />
              <span className="text-wood-700">{homeIntro.location}</span>
            </div>
            <Link className="btn-primary" to={homeIntro.buttonLink}>{homeIntro.buttonText}</Link>
          </div>
          <div className="relative">
            <div className="aspect-square bg-wood-200 rounded-lg overflow-hidden rustic-border">
              <img src={homeIntro.imageUrl} alt="Intro" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="section-padding bg-warm-50">
        <div className="container-custom text-center mb-12">
          <h2 className="text-4xl font-vintage font-semibold text-wood-800 mb-4">Featured Work</h2>
          <p className="text-lg text-wood-600 max-w-2xl mx-auto">A glimpse into my artistic vision and the beautiful moments I've captured</p>
        </div>

        <div className="flex gap-4 justify-center">
          {featuredPhotos.map((photo) => (
            <div key={photo.id} className="aspect-square w-1/3 bg-wood-200 rounded-lg overflow-hidden rustic-border">
              <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-wood-50 wood-texture">
        <div className="container-custom text-center mb-12">
          <h2 className="text-4xl font-vintage font-semibold text-wood-800 mb-4">Photography Services</h2>
          <p className="text-lg text-wood-600 max-w-2xl mx-auto">Professional photography sessions tailored to capture your unique story</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = ICON_MAP[service.icon] || Camera;
            return (
              <div key={service.id} className="farmhouse-card text-center card-hover">
                <div className="w-16 h-16 bg-wood-200 rounded-full flex items-center justify-center mx-auto mb-6 border border-wood-300">
                  <Icon className="w-8 h-8 text-wood-700" />
                </div>
                <h3 className="text-xl font-semibold text-wood-800 mb-4">{service.name}</h3>
                <p className="text-wood-600">{service.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-wood-100 wood-texture text-center">
        <h2 className="text-4xl font-vintage font-semibold text-wood-800 mb-6">Ready to Capture Your Story?</h2>
        <p className="text-lg text-wood-700 mb-8 max-w-2xl mx-auto">
          Let's create beautiful memories together. Book your session today and experience photography that captures the authentic moments of your life.
        </p>
        <Link to="/contact" className="btn-secondary">Get in Touch</Link>
      </section>
    </div>
  );
};

export default Home;