import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, Heart, Star, MapPin } from 'lucide-react';

const heroImages = [
  '/images/hero1.jpg',
  '/images/hero2.jpg',
  '/images/hero3.jpg',
];

const Home: React.FC = () => {
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const featuredPhotos = [
    {
      id: '1',
      title: 'Family Portrait',
      imageUrl: '/api/placeholder/600/400',
      category: 'family'
    },
    {
      id: '2',
      title: 'Couple Session',
      imageUrl: '/api/placeholder/600/400',
      category: 'couple'
    },
    {
      id: '3',
      title: 'Individual Portrait',
      imageUrl: '/api/placeholder/600/400',
      category: 'portrait'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Blurred left background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <div
            className="absolute left-0 top-0 w-1/2 h-full bg-cover bg-center filter blur-xl brightness-75"
            style={{
              backgroundImage: `url('${heroImages[currentHero]}')`,
            }}
          ></div>
          <div
            className="absolute right-0 top-0 w-1/2 h-full bg-cover bg-center filter blur-xl brightness-75"
            style={{
              backgroundImage: `url('${heroImages[currentHero]}')`,
            }}
          ></div>
        </div>
        {/* Centered main image */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <img
            src={heroImages[currentHero]}
            alt="Slideshow hero"
            className="max-w-3xl w-full h-auto rounded-lg shadow-xl object-contain"
            style={{ maxHeight: '80vh' }}
          />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-wood-900/80 to-farmhouse-900/80 z-20"></div>
        {/* Hero text */}
        <div className="relative z-30 text-center text-white container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-vintage font-bold mb-6">
              Jessi Bradford
            </h1>
            <p className="text-2xl md:text-3xl font-cursive mb-8">
              Photography
            </p>
            <p className="text-xl md:text-2xl text-wood-200 mb-12 max-w-2xl mx-auto">
              Capturing life's beautiful moments with a warm, rustic approach
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/portfolio" className="btn-primary inline-flex items-center">
                View Portfolio
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/contact" className="btn-secondary text-white border-white hover:bg-white hover:text-wood-800">
                Book Session
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Preview */}
      <section className="section-padding bg-wood-50 wood-texture">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-vintage font-semibold text-wood-800 mb-6">
                Based in Salina, Utah
              </h2>
              <p className="text-lg text-wood-700 mb-6">
                I specialize in capturing authentic moments through portrait, couple, and family photography. 
                My warm, rustic style brings out the natural beauty and emotion in every session.
              </p>
              <div className="flex items-center space-x-4 mb-6">
                <MapPin className="w-6 h-6 text-wood-600" />
                <span className="text-wood-700">Serving Sevier County</span>
              </div>
              <Link to="/about" className="btn-primary">
                Learn More About Me
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-wood-200 rounded-lg overflow-hidden rustic-border">
                <img
                  src="/api/placeholder/600/600"
                  alt="Jessi Bradford"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="section-padding bg-warm-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-vintage font-semibold text-wood-800 mb-4">
              Featured Work
            </h2>
            <p className="text-lg text-wood-600 max-w-2xl mx-auto">
              A glimpse into my artistic vision and the beautiful moments I've captured
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/3] bg-wood-200 rounded-lg overflow-hidden mb-4 rustic-border">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg font-semibold text-wood-800 mb-2">
                  {photo.title}
                </h3>
                <p className="text-wood-600 capitalize">
                  {photo.category} Photography
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/portfolio" className="btn-secondary">
              View Full Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding bg-wood-50 wood-texture">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-vintage font-semibold text-wood-800 mb-4">
              Photography Services
            </h2>
            <p className="text-lg text-wood-600 max-w-2xl mx-auto">
              Professional photography sessions tailored to capture your unique story
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: 'Couples', description: 'Romantic sessions for couples in love' },
              { icon: Camera, title: 'Portraits', description: 'Individual and family portrait sessions' },
              { icon: Star, title: 'Special Events', description: 'Engagements, anniversaries, and more' }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="farmhouse-card text-center card-hover"
              >
                <div className="w-16 h-16 bg-wood-200 rounded-full flex items-center justify-center mx-auto mb-6 border border-wood-300">
                  <service.icon className="w-8 h-8 text-wood-700" />
                </div>
                <h3 className="text-xl font-semibold text-wood-800 mb-4">
                  {service.title}
                </h3>
                <p className="text-wood-600">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="btn-primary">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="section-padding bg-warm-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-vintage font-semibold text-wood-800 mb-4">
              What Clients Say
            </h2>
            <p className="text-lg text-wood-600 max-w-2xl mx-auto">
              Hear from families and couples who have experienced my photography
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah & Mike',
                text: 'Jessi captured our family perfectly. The photos are absolutely stunning!',
                rating: 5
              },
              {
                name: 'Emily & David',
                text: 'Our engagement session was magical. Jessi made us feel so comfortable.',
                rating: 5
              },
              {
                name: 'The Johnson Family',
                text: 'Professional, creative, and so easy to work with. Highly recommend!',
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="farmhouse-card"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-warm-500 fill-current" />
                  ))}
                </div>
                <p className="text-wood-700 mb-4 italic">"{testimonial.text}"</p>
                <p className="text-wood-800 font-semibold">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/reviews" className="btn-secondary">
              Read All Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-wood-100 wood-texture">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-vintage font-semibold text-wood-800 mb-6">
              Ready to Capture Your Story?
            </h2>
            <p className="text-lg text-wood-700 mb-8 max-w-2xl mx-auto">
              Let's create beautiful memories together. Book your session today and experience 
              photography that captures the authentic moments of your life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking" className="btn-primary">
                Book Your Session
              </Link>
              <Link to="/contact" className="btn-secondary">
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home; 