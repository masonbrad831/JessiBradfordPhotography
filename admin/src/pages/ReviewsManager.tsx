import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Trash2, Edit, Eye, X, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchResource, saveResource } from '../api';

const ReviewsManager: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [newReview, setNewReview] = useState({
    clientName: '',
    rating: 5,
    comment: '',
    serviceType: '',
    date: new Date().toISOString().split('T')[0],
    isActive: true,
    isFeatured: false,
    order: 1
  });
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

  const serviceTypes = [
    'Family Session',
    'Couple Session',
    'Portrait Session',
    'Engagement Session',
    'Wedding Photography',
    'Event Photography'
  ];

  const handleAddReview = async () => {
    if (!newReview.clientName || !newReview.comment || !newReview.serviceType) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const review = {
        id: Date.now().toString(),
        ...newReview,
        order: reviews.length + 1
      };
      const updatedReviews = [...reviews, review];
      await saveResource('Review', updatedReviews);
      setReviews(updatedReviews);
      setNewReview({
        clientName: '',
        rating: 5,
        comment: '',
        serviceType: '',
        date: new Date().toISOString().split('T')[0],
        isActive: true,
        isFeatured: false,
        order: updatedReviews.length + 1
      });
      setShowAddModal(false);
      toast.success('Review added');
    } catch (e) {
      toast.error('Failed to add review');
    }
  };

  const handleEditReview = async () => {
    if (!editingReview.clientName || !editingReview.comment || !editingReview.serviceType) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const updatedReviews = reviews.map(review =>
        review.id === editingReview.id ? editingReview : review
      );
      await saveResource('Review', updatedReviews);
      setReviews(updatedReviews);
      setEditingReview(null);
      toast.success('Review updated');
    } catch (e) {
      toast.error('Failed to update review');
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      const updatedReviews = reviews.filter(review => review.id !== id);
      await saveResource('Review', updatedReviews);
      setReviews(updatedReviews);
      toast.success('Review removed');
    } catch (e) {
      toast.error('Failed to remove review');
    }
  };

  const handleToggleActive = (id: string) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, isActive: !review.isActive } : review
    ));
  };

  const handleToggleFeatured = (id: string) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, isFeatured: !review.isFeatured } : review
    ));
  };

  const handleCopyReview = (review: any) => {
    const reviewText = `"${review.comment}" - ${review.clientName}`;
    navigator.clipboard.writeText(reviewText);
    toast.success('Review copied to clipboard');
  };

  const handleReorder = (id: string, direction: 'up' | 'down') => {
    const currentIndex = reviews.findIndex(review => review.id === id);
    if (currentIndex === -1) return;

    const newReviews = [...reviews];
    if (direction === 'up' && currentIndex > 0) {
      [newReviews[currentIndex], newReviews[currentIndex - 1]] = 
      [newReviews[currentIndex - 1], newReviews[currentIndex]];
    } else if (direction === 'down' && currentIndex < newReviews.length - 1) {
      [newReviews[currentIndex], newReviews[currentIndex + 1]] = 
      [newReviews[currentIndex + 1], newReviews[currentIndex]];
    }

    setReviews(newReviews);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
          <p className="text-gray-600">Manage client reviews and testimonials</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Review</span>
        </button>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Client Reviews</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No reviews found. Add one!</div>
          ) : (
            reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{review.clientName}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          review.isFeatured 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {review.isFeatured ? 'Featured' : 'Regular'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          review.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {review.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill={i < review.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                      <span className="text-sm text-gray-600">({review.rating}/5)</span>
                    </div>
                    
                    <p className="text-gray-700 mb-3 italic">"{review.comment}"</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{review.serviceType}</span>
                      <span>{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleFeatured(review.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        review.isFeatured 
                          ? 'text-purple-600 hover:bg-purple-100' 
                          : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                      }`}
                      title={review.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleToggleActive(review.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        review.isActive 
                          ? 'text-green-600 hover:bg-green-100' 
                          : 'text-red-600 hover:bg-red-100'
                      }`}
                      title={review.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleCopyReview(review)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      title="Copy review text"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => setEditingReview(review)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      title="Edit review"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Order: {review.order}</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleReorder(review.id, 'up')}
                      disabled={index === 0}
                      className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleReorder(review.id, 'down')}
                      disabled={index === reviews.length - 1}
                      className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || editingReview) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowAddModal(false);
              setEditingReview(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingReview ? 'Edit Review' : 'Add Review'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingReview(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={editingReview?.clientName || newReview.clientName}
                    onChange={(e) => {
                      if (editingReview) {
                        setEditingReview({ ...editingReview, clientName: e.target.value });
                      } else {
                        setNewReview({ ...newReview, clientName: e.target.value });
                      }
                    }}
                    className="input-field"
                    placeholder="Enter client name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => {
                          if (editingReview) {
                            setEditingReview({ ...editingReview, rating });
                          } else {
                            setNewReview({ ...newReview, rating });
                          }
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          (editingReview?.rating || newReview.rating) >= rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        <Star className="w-6 h-6" fill="currentColor" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type
                  </label>
                  <select
                    value={editingReview?.serviceType || newReview.serviceType}
                    onChange={(e) => {
                      if (editingReview) {
                        setEditingReview({ ...editingReview, serviceType: e.target.value });
                      } else {
                        setNewReview({ ...newReview, serviceType: e.target.value });
                      }
                    }}
                    className="input-field"
                  >
                    <option value="">Select service type</option>
                    {serviceTypes.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Comment
                  </label>
                  <textarea
                    value={editingReview?.comment || newReview.comment}
                    onChange={(e) => {
                      if (editingReview) {
                        setEditingReview({ ...editingReview, comment: e.target.value });
                      } else {
                        setNewReview({ ...newReview, comment: e.target.value });
                      }
                    }}
                    className="input-field"
                    rows={4}
                    placeholder="Enter the review comment..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Date
                  </label>
                  <input
                    type="date"
                    value={editingReview?.date || newReview.date}
                    onChange={(e) => {
                      if (editingReview) {
                        setEditingReview({ ...editingReview, date: e.target.value });
                      } else {
                        setNewReview({ ...newReview, date: e.target.value });
                      }
                    }}
                    className="input-field"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingReview?.isActive ?? newReview.isActive}
                      onChange={(e) => {
                        if (editingReview) {
                          setEditingReview({ ...editingReview, isActive: e.target.checked });
                        } else {
                          setNewReview({ ...newReview, isActive: e.target.checked });
                        }
                      }}
                      className="rounded text-sage-600"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingReview?.isFeatured ?? newReview.isFeatured}
                      onChange={(e) => {
                        if (editingReview) {
                          setEditingReview({ ...editingReview, isFeatured: e.target.checked });
                        } else {
                          setNewReview({ ...newReview, isFeatured: e.target.checked });
                        }
                      }}
                      className="rounded text-sage-600"
                    />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingReview(null);
                    }}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingReview ? handleEditReview : handleAddReview}
                    className="flex-1 btn-primary"
                  >
                    {editingReview ? 'Update Review' : 'Add Review'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewsManager; 