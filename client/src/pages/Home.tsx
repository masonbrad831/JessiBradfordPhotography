import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, Camera, Heart, Star, MapPin, Users, Clock } from 'lucide-react';
import { fetchResource } from '../api';

const ICON_MAP: Record<string, any> = {
  Camera,
  Heart,
  Star,
  Users,
  Clock,
};

const Home: React.FC = () => {
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [currentHero, setCurrentHero] = useState(0);
  const [featuredPhotos, setFeaturedPhotos] = useState<any[]>([]);
  const [featuredWorkDescription, setFeaturedWorkDescription] = useState<string>("");
  const [homeIntro, setHomeIntro] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [featuredReviews, setFeaturedReviews] = useState<any[]>([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isReviewDragging, setIsReviewDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reviewContainerRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);
  const reviewDragX = useMotionValue(0);
  const xInput = [0, 100, 200, 300, 400];
  const background = useTransform(dragX, xInput, [
    "linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 100%)",
    "linear-gradient(90deg, #e0e0e0 0%, #d0d0d0 100%)",
    "linear-gradient(90deg, #d0d0d0 0%, #c0c0c0 100%)",
    "linear-gradient(90deg, #c0c0c0 0%, #b0b0b0 100%)",
    "linear-gradient(90deg, #b0b0b0 0%, #a0a0a0 100%)"
  ]);

  useEffect(() => {
    async function loadSlideshowAndFeatured() {
      try {
        const slideshow = await fetchResource('SlideshowImage');
        setHeroImages(Array.isArray(slideshow) ? slideshow.filter((img: any) => img.isActive !== false).map((img: any) => img.imageUrl) : []);
        const featured = await fetchResource('FeaturedWork');
        if (featured && typeof featured === 'object' && Array.isArray(featured.items)) {
          setFeaturedPhotos(featured.items.filter((f: any) => f.isActive !== false));
          setFeaturedWorkDescription(featured.sectionDescription || "");
        } else if (Array.isArray(featured)) {
          setFeaturedPhotos(featured.filter((f: any) => f.isActive !== false));
          setFeaturedWorkDescription("");
        } else {
          setFeaturedPhotos([]);
          setFeaturedWorkDescription("");
        }
        const intro = await fetchResource('HomeIntro');
        setHomeIntro(intro);
        // Fetch session types for services section
        const sessionTypes = await fetchResource('SessionTypes');
        setServices(Array.isArray(sessionTypes) ? sessionTypes : []);
        // Fetch reviews for testimonials section
        const reviews = await fetchResource('Review');
        const allReviews = Array.isArray(reviews) ? reviews : [];
        setFeaturedReviews(allReviews.filter((r: any) => r.isActive && r.isApproved && r.isFeatured));
      } catch (e) {
        setHeroImages([]);
        setFeaturedPhotos([]);
        setFeaturedWorkDescription("");
        setHomeIntro(null);
        setServices([]);
        setFeaturedReviews([]);
      }
    }
    loadSlideshowAndFeatured();
  }, []);

  useEffect(() => {
    if (heroImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroImages]);

  // Auto-cycle featured photos if more than 3
  useEffect(() => {
    if (featuredPhotos.length <= 3) return;
    const maxSteps = featuredPhotos.length - 2; // With 6 photos, max steps = 4
    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prev) => {
        const next = prev + 1;
        // When we reach the end, loop back to start
        if (next >= maxSteps) {
          return 0;
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredPhotos]);

  // Auto-cycle featured reviews if more than 3
  useEffect(() => {
    if (featuredReviews.length <= 3) return;
    const maxSteps = featuredReviews.length - 2;
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => {
        const next = prev + 1;
        if (next >= maxSteps) {
          return 0;
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredReviews]);

  const getVisiblePhotos = () => {
    if (featuredPhotos.length <= 3) {
      return featuredPhotos;
    }
    
    const photos = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentFeaturedIndex + i) % featuredPhotos.length;
      photos.push(featuredPhotos[index]);
    }
    return photos;
  };

  const getVisibleReviews = () => {
    if (featuredReviews.length <= 3) {
      return featuredReviews;
    }
    
    const reviews = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentReviewIndex + i) % featuredReviews.length;
      reviews.push(featuredReviews[index]);
    }
    return reviews;
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 50;
    
    if (info.offset.x > threshold) {
      // Swipe right - go to previous
      setCurrentFeaturedIndex((prev) => 
        prev === 0 ? featuredPhotos.length - 1 : prev - 1
      );
    } else if (info.offset.x < -threshold) {
      // Swipe left - go to next
      setCurrentFeaturedIndex((prev) => (prev + 1) % featuredPhotos.length);
    }
  };

  const handleReviewDragEnd = (event: any, info: PanInfo) => {
    setIsReviewDragging(false);
    const threshold = 50;
    
    if (info.offset.x > threshold) {
      setCurrentReviewIndex((prev) => 
        prev === 0 ? featuredReviews.length - 1 : prev - 1
      );
    } else if (info.offset.x < -threshold) {
      setCurrentReviewIndex((prev) => (prev + 1) % featuredReviews.length);
    }
  };

  const goToFeatured = (index: number) => {
    setCurrentFeaturedIndex(index);
  };

  // Calculate the transform for smooth continuous sliding
  const getSlideTransform = () => {
    if (featuredPhotos.length <= 3) return 0;
    return -(currentFeaturedIndex * (100 / 3));
  };

  // Create a transform that combines auto-transition with drag
  const slideX = useTransform(
    dragX,
    (dragValue) => {
      if (featuredPhotos.length <= 3) return 0;
      // Since we're only showing 3 photos at a time, we don't need to transform
      const dragOffset = dragValue / 10; // Scale down drag for smoother feel
      return `${dragOffset}%`;
    }
  );

  const reviewSlideX = useTransform(
    reviewDragX,
    (dragValue) => {
      if (featuredReviews.length <= 3) return 0;
      const dragOffset = dragValue / 10;
      return `${dragOffset}%`;
    }
  );

  // Create infinite loop photos array
  const getInfinitePhotos = () => {
    if (featuredPhotos.length <= 3) {
      return featuredPhotos;
    }
    
    // Create an array that repeats the photos to create seamless loop
    const repeatedPhotos = [...featuredPhotos, ...featuredPhotos, ...featuredPhotos];
    const startIndex = featuredPhotos.length + currentFeaturedIndex;
    
    const photos = [];
    for (let i = 0; i < 3; i++) {
      photos.push(repeatedPhotos[startIndex + i]);
    }
    return photos;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Blurred left background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <div
            className="absolute left-0 top-0 w-1/2 h-full bg-cover bg-center filter blur-xl brightness-75"
            style={{
              backgroundImage: heroImages.length > 0 ? `url('${heroImages[currentHero]}')` : undefined,
            }}
          ></div>
          <div
            className="absolute right-0 top-0 w-1/2 h-full bg-cover bg-center filter blur-xl brightness-75"
            style={{
              backgroundImage: heroImages.length > 0 ? `url('${heroImages[currentHero]}')` : undefined,
            }}
          ></div>
        </div>
        {/* Centered main image */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          {heroImages.length > 0 && (
          <img
            src={heroImages[currentHero]}
            alt="Slideshow hero"
            className="max-w-3xl w-full h-auto rounded-lg shadow-xl object-contain"
            style={{ maxHeight: '80vh' }}
          />
          )}
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
                {homeIntro?.heading || "Based in Salina, Utah"}
              </h2>
              <p className="text-lg text-wood-700 mb-6">
                {homeIntro?.description || "I specialize in capturing authentic moments through portrait, couple, and family photography. My warm, rustic style brings out the natural beauty and emotion in every session."}
              </p>
              <div className="flex items-center space-x-4 mb-6">
                <MapPin className="w-6 h-6 text-wood-600" />
                <span className="text-wood-700">{homeIntro?.location || "Serving Sevier County"}</span>
              </div>
              <Link className="btn-primary" to={homeIntro?.buttonLink || "/about"}>
                {homeIntro?.buttonText || "Learn More About Me"}
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
                  src={homeIntro?.imageUrl || "/api/placeholder/600/600"}
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
              {featuredWorkDescription || "A glimpse into my artistic vision and the beautiful moments I've captured"}
            </p>
          </motion.div>

          {featuredPhotos.length === 0 ? (
            <div className="text-center text-wood-600">No featured work yet.</div>
          ) : (
            <div className="relative">
              <motion.div
                ref={containerRef}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                style={{ x: dragX }}
                className="cursor-grab active:cursor-grabbing"
              >
                <motion.div 
                  className="flex gap-4"
                  style={{ 
                    width: "100%",
                    x: slideX 
                  }}
                  transition={{ 
                    duration: 0.75,
                    ease: "easeInOut"
                  }}
                >
                  {getVisiblePhotos().map((photo, index) => (
                    <motion.div
                      key={photo.id}
                      className="w-1/3"
                      style={{
                        transformStyle: "preserve-3d",
                        perspective: "1000px"
                      }}
                    >
                      <motion.div
                className="group cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          transformStyle: "preserve-3d"
                        }}
              >
                        <motion.div 
                          className="aspect-[1/1] bg-wood-200 rounded-lg overflow-hidden mb-4 rustic-border max-w-xs"
                          style={{
                            transformStyle: "preserve-3d"
                          }}
                        >
                          <motion.img
                    src={photo.imageUrl}
                    alt={photo.title}
                            className="w-full h-full object-cover"
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                              duration: 1,
                              ease: "easeInOut"
                            }}
                  />
                        </motion.div>

                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>



              {/* Drag hint */}
              {featuredPhotos.length > 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isDragging ? 0 : 0.7 }}
                  className="absolute top-4 right-4 text-xs text-wood-500 bg-white/80 px-2 py-1 rounded"
                >
                  Drag to navigate
                </motion.div>
              )}
          </div>
          )}

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
            {services.length === 0 ? (
              <div className="col-span-full text-center text-wood-600">No services available.</div>
            ) : services.map((service: any, index: number) => {
              const Icon = ICON_MAP[service.icon] || Camera;
              return (
              <motion.div
                  key={service.id || service.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="farmhouse-card text-center card-hover"
              >
                <div className="w-16 h-16 bg-wood-200 rounded-full flex items-center justify-center mx-auto mb-6 border border-wood-300">
                    <Icon className="w-8 h-8 text-wood-700" />
                </div>
                <h3 className="text-xl font-semibold text-wood-800 mb-4">
                    {service.name}
                </h3>
                <p className="text-wood-600">
                  {service.description}
                </p>
              </motion.div>
              );
            })}
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
            <p className="text-sm text-wood-500 mt-2">
              Reviews are only accepted from clients with confirmed bookings
            </p>
          </motion.div>

          {featuredReviews.length > 0 ? (
            <div className="relative">
              <motion.div
                ref={reviewContainerRef}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragStart={() => setIsReviewDragging(true)}
                onDragEnd={handleReviewDragEnd}
                style={{ x: reviewDragX }}
                className="cursor-grab active:cursor-grabbing"
              >
                <motion.div 
                  className="flex gap-4"
                  style={{ 
                    width: "100%",
                    x: reviewSlideX 
                  }}
                  transition={{ 
                    duration: 0.75,
                    ease: "easeInOut"
                  }}
                >
                  {getVisibleReviews().map((review, index) => (
                    <motion.div
                      key={review.id}
                      className="w-1/3"
                      style={{
                        transformStyle: "preserve-3d",
                        perspective: "1000px"
                      }}
                    >
                      <motion.div
                        className="group cursor-pointer bg-white rounded-lg shadow-md p-6 h-full"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          transformStyle: "preserve-3d"
                        }}
              >
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                  ))}
                </div>
                          <span className="text-sm text-wood-600">({review.rating}/5)</span>
                        </div>
                        
                        <blockquote className="text-wood-700 mb-4 italic">
                          "{review.comment}"
                        </blockquote>
                        
                        <div className="mt-auto">
                          <p className="font-semibold text-wood-800">{review.clientName}</p>
                          <p className="text-sm text-wood-600">{review.serviceType}</p>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Drag hint */}
              {featuredReviews.length > 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isReviewDragging ? 0 : 0.7 }}
                  className="absolute top-4 right-4 text-xs text-wood-500 bg-white/80 px-2 py-1 rounded"
                >
                  Drag to navigate
                </motion.div>
              )}
            </div>
          ) : (
            <div className="text-center text-wood-600 py-12">
              <p className="text-lg mb-4">No featured reviews yet.</p>
              <p className="text-sm">Check back soon for client testimonials!</p>
          </div>
          )}

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