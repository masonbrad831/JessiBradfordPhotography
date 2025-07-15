import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Check, X, Eye, EyeOff, ThumbsUp, ThumbsDown } from 'lucide-react';
import { fetchResource, patchResource } from '../api';

interface Review {
  id: string;
  bookingId: string;
  clientName: string;
  email: string;
  rating: number;
  comment: string;
  serviceType: string;
  date: string;
  isActive: boolean;
  isFeatured: boolean;
  isApproved: boolean;
  order: number;
}

const ReviewsManager: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'featured'>('all');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await fetchResource('Review');
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (review: Review) => {
    try {
      const updatedReview = { ...review, isApproved: !review.isApproved };
      const updatedReviews = reviews.map(r => r.id === review.id ? updatedReview : r);
      await patchResource('Review', updatedReviews);
      setReviews(updatedReviews);
    } catch (error) {
      console.error('Error updating review approval:', error);
    }
  };

  const handleToggleFeatured = async (review: Review) => {
    try {
      const updatedReview = { ...review, isFeatured: !review.isFeatured };
      const updatedReviews = reviews.map(r => r.id === review.id ? updatedReview : r);
      await patchResource('Review', updatedReviews);
      setReviews(updatedReviews);
    } catch (error) {
      console.error('Error updating review featured status:', error);
    }
  };

  const handleToggleActive = async (review: Review) => {
    try {
      const updatedReview = { ...review, isActive: !review.isActive };
      const updatedReviews = reviews.map(r => r.id === review.id ? updatedReview : r);
      await patchResource('Review', updatedReviews);
      setReviews(updatedReviews);
    } catch (error) {
      console.error('Error updating review active status:', error);
    }
  };

  const getFilteredReviews = () => {
    switch (filter) {
      case 'pending':
        return reviews.filter(r => !r.isApproved);
      case 'approved':
        return reviews.filter(r => r.isApproved);
      case 'featured':
        return reviews.filter(r => r.isFeatured);
      default:
        return reviews;
    }
  };

  const getStatusColor = (review: Review) => {
    if (!review.isApproved) return 'text-red-600';
    if (review.isFeatured) return 'text-green-600';
    return 'text-gray-600';
  };

  const getStatusText = (review: Review) => {
    if (!review.isApproved) return 'Pending';
    if (review.isFeatured) return 'Featured';
    return 'Approved';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-wood-600">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-vintage font-semibold text-wood-800">
          Reviews Manager
        </h1>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-wood-300 rounded-lg bg-white text-wood-700"
          >
            <option value="all">All Reviews</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="featured">Featured</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {getFilteredReviews().map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 border border-wood-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-wood-800 mb-1">
                  {review.clientName}
                </h3>
                <p className="text-sm text-wood-600 mb-2">{review.email}</p>
                <p className="text-sm text-wood-600 mb-2">Booking ID: {review.bookingId}</p>
                <div className="flex items-center gap-2 mb-2">
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
                <p className="text-sm text-wood-600 mb-2">
                  {review.serviceType ? review.serviceType : 'N/A'} • {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleApproval(review)}
                  className={`p-2 rounded-lg transition-colors ${
                    review.isApproved
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                  title={review.isApproved ? 'Unapprove' : 'Approve'}
                >
                  {review.isApproved ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleToggleFeatured(review)}
                  className={`p-2 rounded-lg transition-colors ${
                    review.isFeatured
                      ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={review.isFeatured ? 'Unfeature' : 'Feature'}
                >
                  {review.isFeatured ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleToggleActive(review)}
                  className={`p-2 rounded-lg transition-colors ${
                    review.isActive
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                  title={review.isActive ? 'Deactivate' : 'Activate'}
                >
                  {review.isActive ? <ThumbsUp className="w-4 h-4" /> : <ThumbsDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <p className="text-wood-700 mb-4">{review.comment}</p>
            
            <div className="flex items-center gap-4 text-sm">
              <span className={`font-medium ${getStatusColor(review)}`}>
                {getStatusText(review)}
              </span>
              <span className="text-wood-500">
                Order: {review.order}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {getFilteredReviews().length === 0 && (
        <div className="text-center py-12 text-wood-600">
          No reviews found for the selected filter.
        </div>
      )}
    </div>
  );
};

export default ReviewsManager; 