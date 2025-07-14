import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, User } from 'lucide-react';
import { fetchResource } from '../api';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      setLoading(true);
      try {
        const reviewsData = await fetchResource('Review');
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      } catch (e) {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

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
            <h1 className="text-5xl font-serif font-bold mb-6">Client Reviews</h1>
            <p className="text-xl text-sage-200 max-w-2xl mx-auto">
              Hear what my wonderful clients have to say about their experience
            </p>
          </motion.div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="section-padding bg-cream-100">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-semibold text-sage-800 mb-6">
              What Clients Say
            </h2>
            <p className="text-lg text-sage-600 max-w-3xl mx-auto">
              Real experiences from wonderful clients who trusted me to capture their special moments
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {loading ? (
              <div className="col-span-full text-center text-sage-600">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="col-span-full text-center text-sage-600">No reviews found.</div>
            ) : (
              reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="bg-cream-200 rounded-lg shadow-lg p-10 card-hover"
                >
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-sage-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-sage-800 mb-2">
                        {review.clientName}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < review.rating ? 'text-sage-600' : 'text-sage-300'}`}
                            fill={i < review.rating ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sage-700 mb-8 text-lg leading-relaxed">"{review.comment}"</p>
                  <div className="flex items-center justify-between text-sage-500 text-base pt-6 border-t border-sage-200">
                    <span className="font-medium">{review.serviceType}</span>
                    <span>{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-sage-800 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif font-semibold mb-6">
              Ready to Book Your Session?
            </h2>
            <p className="text-xl text-sage-200 mb-8 max-w-2xl mx-auto">
              Join my happy clients and let me capture your story with beautiful, moody photography.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="btn-primary bg-white text-sage-800 hover:bg-sage-100">
                Contact Me
              </a>
              <a href="/portfolio" className="btn-secondary border-white text-white hover:bg-white hover:text-sage-800">
                View Portfolio
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Reviews; 