import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { fetchResource } from '../api';

interface ReviewFormProps {
  onSubmit: (review: any) => void;
  onClose: () => void;
}

interface Booking {
  id: string;
  clientName: string;
  email: string;
  service: string;
  date: string;
  status: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    bookingId: '',
    clientName: '',
    email: '',
    rating: 5,
    comment: '',
    serviceType: ''
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [sessionTypes, setSessionTypes] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [validationError, setValidationError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingsData, reviewsData, sessionTypesData] = await Promise.all([
        fetchResource('Booking'),
        fetchResource('Review'),
        fetchResource('SessionTypes')
      ]);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      setSessionTypes(Array.isArray(sessionTypesData) ? sessionTypesData : []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateBooking = (bookingId: string, email: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
      return { valid: false, error: 'Booking ID not found' };
    }
    if (booking.email.toLowerCase() !== email.toLowerCase()) {
      return { valid: false, error: 'Email does not match the booking email' };
    }
    if (booking.status !== 'confirmed') {
      return { valid: false, error: 'Booking must be confirmed to leave a review' };
    }
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate > today) {
      return { valid: false, error: 'You can only leave a review on or after your booking date' };
    }
    // Prevent duplicate reviews for this booking
    const duplicate = reviews.find(r => r.bookingId === bookingId);
    if (duplicate) {
      return { valid: false, error: 'A review for this booking has already been submitted' };
    }
    return { valid: true, booking };
  };

  const handleBookingIdChange = (bookingId: string) => {
    setFormData({ ...formData, bookingId });
    setValidationError('');
    setSelectedBooking(null);
    if (bookingId && formData.email) {
      const validation = validateBooking(bookingId, formData.email);
      if (validation.valid && validation.booking) {
        setSelectedBooking(validation.booking);
      } else {
        setValidationError(validation.error || 'Invalid booking');
      }
    }
  };

  const handleEmailChange = (email: string) => {
    setFormData({ ...formData, email });
    setValidationError('');
    setSelectedBooking(null);
    if (formData.bookingId && email) {
      const validation = validateBooking(formData.bookingId, email);
      if (validation.valid && validation.booking) {
        setSelectedBooking(validation.booking);
      } else {
        setValidationError(validation.error || 'Invalid booking');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bookingId || !formData.email || !formData.clientName || !formData.comment) {
      alert('Please fill in all required fields');
      return;
    }
    const validation = validateBooking(formData.bookingId, formData.email);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid booking');
      return;
    }
    setIsSubmitting(true);
    try {
      const review = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString().split('T')[0],
        isActive: false,
        isFeatured: false,
        isApproved: false,
        order: 1
      };
      await onSubmit(review);
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl p-8 text-center"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-wood-800 mb-2">Thank You!</h3>
        <p className="text-wood-600">Your review has been submitted and will be reviewed shortly.</p>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
      >
        <div className="text-wood-600">Loading booking information...</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-vintage font-semibold text-wood-800 mb-2">
          Share Your Experience
        </h3>
        <p className="text-wood-600">
          We'd love to hear about your photography session!
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-wood-700 mb-2">
            Booking ID *
          </label>
          <input
            type="text"
            value={formData.bookingId}
            onChange={(e) => handleBookingIdChange(e.target.value)}
            className="w-full px-4 py-2 border border-wood-300 rounded-lg focus:ring-2 focus:ring-wood-500 focus:border-transparent"
            placeholder="Enter your booking ID"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-wood-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleEmailChange(e.target.value)}
            className="w-full px-4 py-2 border border-wood-300 rounded-lg focus:ring-2 focus:ring-wood-500 focus:border-transparent"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-wood-700 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            className="w-full px-4 py-2 border border-wood-300 rounded-lg focus:ring-2 focus:ring-wood-500 focus:border-transparent"
            placeholder="Enter your name"
            required
          />
        </div>
        {validationError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{validationError}</p>
          </div>
        )}
        {selectedBooking && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Booking Confirmed</h4>
            <div className="text-sm text-green-700 space-y-1">
              <p><strong>Client:</strong> {selectedBooking.clientName}</p>
              <p><strong>Service:</strong> {selectedBooking.service}</p>
              <p><strong>Date:</strong> {new Date(selectedBooking.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {selectedBooking.status}</p>
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-wood-700 mb-2">
            Rating *
          </label>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFormData({ ...formData, rating })}
                className={`p-2 rounded-lg transition-colors ${
                  formData.rating >= rating
                    ? 'text-yellow-400 hover:text-yellow-500'
                    : 'text-gray-300 hover:text-gray-400'
                }`}
              >
                <Star className="w-8 h-8" fill={formData.rating >= rating ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-wood-600 mt-1">
            {formData.rating} out of 5 stars
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-wood-700 mb-2">
            Session Type (optional)
          </label>
          <select
            value={formData.serviceType}
            onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
            className="w-full px-4 py-2 border border-wood-300 rounded-lg focus:ring-2 focus:ring-wood-500 focus:border-transparent"
          >
            <option value="">Select a session type (optional)</option>
            {sessionTypes.map((type: any) => (
              <option key={type.id || type.name} value={type.name}>{type.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-wood-700 mb-2">
            Your Review *
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            className="w-full px-4 py-2 border border-wood-300 rounded-lg focus:ring-2 focus:ring-wood-500 focus:border-transparent"
            rows={4}
            placeholder="Share your experience with Jessi's photography..."
            required
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-wood-300 text-wood-700 rounded-lg hover:bg-wood-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !!validationError || !selectedBooking}
            className="flex-1 px-4 py-2 bg-wood-600 text-white rounded-lg hover:bg-wood-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Review
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ReviewForm; 