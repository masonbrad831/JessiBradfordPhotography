import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Star, Plus, X } from 'lucide-react';
import { fetchResource, saveResource } from '../api';
import ReviewForm from '../components/ReviewForm';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [featuredReviews, setFeaturedReviews] = useState<any[]>([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await fetchResource('Review');
      const allReviews = Array.isArray(data) ? data : [];
      setReviews(allReviews.filter((r: any) => r.isActive && r.isApproved));
      setFeaturedReviews(allReviews.filter((r: any) => r.isActive && r.isApproved && r.isFeatured));
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-cycle featured reviews if more than 3
  useEffect(() => {
    if (featuredReviews.length <= 3) return;
    const maxSteps = featuredReviews.length - 2;
    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prev) => {
        const next = prev + 1;
        if (next >= maxSteps) {
          return 0;
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredReviews]);

  const getVisibleReviews = () => {
    if (featuredReviews.length <= 3) {
      return featuredReviews;
    }
    
    const reviews = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentFeaturedIndex + i) % featuredReviews.length;
      reviews.push(featuredReviews[index]);
    }
    return reviews;
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 50;
    
    if (info.offset.x > threshold) {
      setCurrentFeaturedIndex((prev) => 
        prev === 0 ? featuredReviews.length - 1 : prev - 1
      );
    } else if (info.offset.x < -threshold) {
      setCurrentFeaturedIndex((prev) => (prev + 1) % featuredReviews.length);
    }
  };

  const handleSubmitReview = async (review: any) => {
    try {
      const currentReviews = await fetchResource('Review');
      const allReviews = Array.isArray(currentReviews) ? currentReviews : [];
      const updatedReviews = [...allReviews, review];
      await saveResource('Review', updatedReviews);
      await loadReviews(); // Reload to get updated data
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  const slideX = useTransform(
    dragX,
    (dragValue) => {
      if (featuredReviews.length <= 3) return 0;
      const dragOffset = dragValue / 10;
      return `${dragOffset}%`;
    }
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-wood-600">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-wood-900 to-farmhouse-900">
        <div className="container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-vintage font-bold mb-6">
              Client Reviews
            </h1>
            <p className="text-xl md:text-2xl text-wood-200 mb-8 max-w-3xl mx-auto">
              Hear from families and couples who have experienced my photography
            </p>
            <div className="space-y-4">
              <button
                onClick={() => setShowReviewForm(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Share Your Experience
              </button>
              <div className="text-wood-200 text-sm">
                <p>• You must have a confirmed booking to leave a review</p>
                <p>• Reviews can only be submitted on or after your session date</p>
                <p>• Please have your booking ID ready</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Reviews Carousel */}
      {featuredReviews.length > 0 && (
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
                Featured Reviews
              </h2>
              <p className="text-lg text-wood-600 max-w-2xl mx-auto">
                Some of our favorite testimonials from happy clients
              </p>
            </motion.div>

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
                  animate={{ opacity: isDragging ? 0 : 0.7 }}
                  className="absolute top-4 right-4 text-xs text-wood-500 bg-white/80 px-2 py-1 rounded"
                >
                  Drag to navigate
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* All Reviews */}
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
              All Reviews
            </h2>
            <p className="text-lg text-wood-600 max-w-2xl mx-auto">
              See what our clients have to say about their photography experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.length === 0 ? (
              <div className="col-span-full text-center text-wood-600 py-12">
                No reviews yet. Be the first to share your experience!
              </div>
            ) : (
              reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg shadow-md p-6 farmhouse-card"
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
                    <p className="text-xs text-wood-500 mt-1">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Review Form Modal */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowReviewForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ReviewForm
                onSubmit={handleSubmitReview}
                onClose={() => setShowReviewForm(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reviews; 