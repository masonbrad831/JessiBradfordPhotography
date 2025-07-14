import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, MapPin, Camera, Check } from 'lucide-react';
import BookingCalendar from '../components/BookingCalendar';
import { fetchResource, saveResource } from '../api';
import { Promotion } from '../types';

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  specialRequests: string;
}

const Booking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    location: '',
    specialRequests: ''
  });
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [promotionCode, setPromotionCode] = useState('');
  const [promotionStatus, setPromotionStatus] = useState<'idle' | 'valid' | 'invalid' | 'used' | 'notallowed' | 'limit'>('idle');
  const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [dateUnavailable, setDateUnavailable] = useState(false);
  const [dateCheckLoading, setDateCheckLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    async function loadSessionTypes() {
      setLoading(true);
      try {
        const sessionTypes = await fetchResource('SessionTypes');
        setServices(Array.isArray(sessionTypes) ? sessionTypes : []);
      } catch (e) {
        setServices([]);
      } finally {
        setLoading(false);
      }
    }
    loadSessionTypes();
  }, []);

  useEffect(() => {
    async function loadPromotions() {
      try {
        const promos = await fetchResource('Promotions');
        setPromotions(Array.isArray(promos) ? promos : []);
      } catch (e) {
        setPromotions([]);
      }
    }
    loadPromotions();
  }, []);

  useEffect(() => {
    if (promotionCode) handlePromotionCheck();
    // eslint-disable-next-line
  }, [promotionCode, formData.service, formData.email, promotions]);

  useEffect(() => {
    async function loadBookings() {
      try {
        setDateCheckLoading(true);
        const allBookings = await fetchResource('Booking');
        setBookings(Array.isArray(allBookings) ? allBookings : []);
      } catch (e) {
        setBookings([]);
      } finally {
        setDateCheckLoading(false);
      }
    }
    loadBookings();
  }, []);

  const checkDateAvailability = async (date: Date) => {
    setDateCheckLoading(true);
    try {
      const allBookings = await fetchResource('Booking');
      setBookings(Array.isArray(allBookings) ? allBookings : []);
      const dateStr = date.toISOString().split('T')[0];
      const hasConfirmed = Array.isArray(allBookings) && allBookings.some(
        (b: any) => b.date === dateStr && b.status === 'confirmed'
      );
      setDateUnavailable(hasConfirmed);
    } catch (e) {
      setBookings([]);
      setDateUnavailable(false);
    } finally {
      setDateCheckLoading(false);
    }
  };

  const handleDateSelect = (date: Date, timeSlot: string) => {
    setSelectedDate(date);
    setSelectedTime(timeSlot);
    checkDateAvailability(date);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePromotionCheck = () => {
    if (!promotionCode) {
      setPromotionStatus('idle');
      setAppliedPromotion(null);
      return;
    }
    const promo = promotions.find(p => p.code.toLowerCase() === promotionCode.trim().toLowerCase());
    if (!promo) {
      setPromotionStatus('invalid');
      setAppliedPromotion(null);
      return;
    }
    // Check session type
    if (formData.service && !promo.allowedSessionTypes.includes(formData.service)) {
      setPromotionStatus('notallowed');
      setAppliedPromotion(null);
      return;
    }
    // Check usage limit
    if (promo.usedBy.length >= promo.usageLimit) {
      setPromotionStatus('limit');
      setAppliedPromotion(null);
      return;
    }
    // Check if user/email/browser has used
    const userKey = `promo_${promo.code.toLowerCase()}_used`;
    const alreadyUsed = promo.usedBy.includes(formData.email) || localStorage.getItem(userKey) === '1';
    if (alreadyUsed) {
      setPromotionStatus('used');
      setAppliedPromotion(null);
      return;
    }
    setPromotionStatus('valid');
    setAppliedPromotion(promo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dateUnavailable) {
      alert('Sorry, this date is already fully booked. Please select another date.');
      return;
    }
    if (!selectedDate || !selectedTime || !formData.service || !formData.name || !formData.email) {
      alert('Please fill in all required fields and select a date/time.');
      return;
    }
    // Promotion enforcement
    if (promotionCode) {
      if (!appliedPromotion || promotionStatus !== 'valid') {
        alert('Promotion code is not valid for this booking.');
        return;
      }
    }
    try {
      const bookings = await fetchResource('Booking');
      const newBooking = {
        id: Date.now().toString(),
        clientName: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        location: formData.location,
        notes: formData.specialRequests,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        status: 'pending',
        promotionCode: appliedPromotion ? appliedPromotion.code : undefined
      };
      const updatedBookings = Array.isArray(bookings) ? [...bookings, newBooking] : [newBooking];
      await saveResource('Booking', updatedBookings);
      // Update promotion usage
      if (appliedPromotion) {
        const updatedPromos = promotions.map(p =>
          p.id === appliedPromotion.id
            ? { ...p, usedBy: [...p.usedBy, formData.email] }
            : p
        );
        await saveResource('Promotions', updatedPromos);
        localStorage.setItem(`promo_${appliedPromotion.code.toLowerCase()}_used`, '1');
      }
      setConfirmation({ id: newBooking.id, name: newBooking.clientName });
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        location: '',
        specialRequests: ''
      });
      setSelectedDate(undefined);
      setSelectedTime('');
      setPromotionCode('');
      setPromotionStatus('idle');
      setAppliedPromotion(null);
    } catch (e) {
      alert('Failed to submit booking.');
    }
  };

  // Compute fully booked dates
  const fullyBookedDates = bookings
    .filter((b: any) => b.status === 'confirmed')
    .map((b: any) => b.date);

  return (
    <div className="min-h-screen bg-white">
      {/* Confirmation Message */}
      {confirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center border-2 border-sage-400">
            <h2 className="text-2xl font-bold text-sage-800 mb-4">Thank you, {confirmation.name}!</h2>
            <p className="text-lg text-sage-700 mb-2">Your booking has been submitted.</p>
            <p className="text-base text-sage-700 mb-4">Your Booking ID:</p>
            <div className="text-xl font-mono font-semibold text-sage-900 bg-sage-100 rounded p-2 mb-4 border border-sage-200">
              {confirmation.id}
            </div>
            <p className="text-sage-600 mb-4">Please save this Booking ID for payment, support, or future reference.</p>
            <button
              className="btn-primary w-full"
              onClick={() => setConfirmation(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="bg-sage-800 text-white py-20">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-serif font-bold mb-6">Book Your Session</h1>
            <p className="text-xl text-sage-200 max-w-2xl mx-auto">
              Choose your preferred date and time, then fill out the details to secure your photography session
            </p>
          </motion.div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="section-padding bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Calendar Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <BookingCalendar
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                fullyBookedDates={fullyBookedDates}
              />
            </motion.div>

            {/* Booking Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-3xl font-serif font-semibold text-sage-800 mb-6">
                  Session Details
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service Selection */}
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-3">
                      Select Service *
                    </label>
                    <div
                      className={`flex gap-6 overflow-x-auto pb-4 hide-scrollbar`}
                      style={{ maxWidth: '100%' }}
                    >
                      {loading ? (
                        <div>Loading services...</div>
                      ) : services.length === 0 ? (
                        <div>No services available.</div>
                      ) : services.map((service: any) => (
                        <label
                          key={service.id || service.name}
                          className={`min-w-[320px] max-w-xs bg-cream-50 rounded-lg p-6 border border-sage-200 card-hover cursor-pointer transition-all duration-200 ${formData.service === service.name ? 'ring-2 ring-sage-400' : ''}`}
                          style={{ opacity: 1, transform: 'none' }}
                        >
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                              <Camera className="w-7 h-7 text-sage-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-serif font-semibold text-sage-800 mb-1">{service.name}</h3>
                              <div className="flex items-center space-x-4 text-sage-600">
                                <span className="text-xl font-bold text-sage-700">${service.price}</span>
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-5 h-5" />
                                  <span className="text-base">{service.duration}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <User className="w-5 h-5" />
                                  <span className="text-base">{service.photoCount} photos</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-sage-700 mb-4 text-base leading-relaxed">{service.description}</p>
                          <div className="mb-4">
                            <h4 className="font-semibold text-sage-800 text-lg mb-2">What's Included:</h4>
                            <ul className="space-y-2">
                              {(service.includes || []).map((item: string, idx: number) => (
                                <li key={idx} className="flex items-start space-x-2">
                                  <Check className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-sage-700 text-base leading-relaxed">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <input
                            type="radio"
                            name="service"
                            value={service.name}
                            checked={formData.service === service.name}
                            onChange={handleFormChange}
                            className="text-sage-600 focus:ring-sage-500 mt-2"
                          />
                          <span className="ml-2 text-sage-700 font-medium">Select</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-sage-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-sage-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-sage-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-sage-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="specialRequests" className="block text-sm font-medium text-sage-700 mb-2">
                      Special Requests
                    </label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleFormChange}
                      rows={4}
                      placeholder="Any specific ideas, themes, or requests for your session..."
                      className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    />
                  </div>

                  {/* Promotion Code Input */}
                  <div>
                    <label htmlFor="promotionCode" className="block text-sm font-medium text-sage-700 mb-2">
                      Promotion Code
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        id="promotionCode"
                        name="promotionCode"
                        value={promotionCode}
                        onChange={e => setPromotionCode(e.target.value)}
                        className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                        placeholder="Enter code"
                      />
                      <button
                        type="button"
                        onClick={handlePromotionCheck}
                        className="btn-secondary"
                      >
                        Apply
                      </button>
                    </div>
                    {promotionStatus === 'valid' && appliedPromotion && (
                      <div className="text-green-600 mt-2 text-sm">
                        Promotion applied: {appliedPromotion.description}
                      </div>
                    )}
                    {promotionStatus === 'invalid' && (
                      <div className="text-red-600 mt-2 text-sm">Invalid promotion code.</div>
                    )}
                    {promotionStatus === 'used' && (
                      <div className="text-red-600 mt-2 text-sm">You have already used this promotion.</div>
                    )}
                    {promotionStatus === 'notallowed' && (
                      <div className="text-red-600 mt-2 text-sm">This code is not valid for the selected session type.</div>
                    )}
                    {promotionStatus === 'limit' && (
                      <div className="text-red-600 mt-2 text-sm">This promotion has reached its usage limit.</div>
                    )}
                  </div>

                  {/* Selected Date/Time Summary */}
                  {selectedDate && selectedTime && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-sage-100 rounded-lg border border-sage-200"
                    >
                      <h4 className="font-semibold text-sage-800 mb-2">Selected Session:</h4>
                      <div className="flex items-center space-x-4 text-sage-700">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{selectedDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{selectedTime}</span>
                        </div>
                      </div>
                      {dateUnavailable && (
                        <div className="text-red-600 mt-2 text-sm">
                          Sorry, this date is already fully booked. Please select another date.
                        </div>
                      )}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={!selectedDate || !selectedTime || !formData.service || dateUnavailable || dateCheckLoading}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Book Your Session
                  </button>
                </form>
              </div>
            </motion.div>
        </div>
      </section>
      {/* Information Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-serif font-semibold text-sage-800 mb-6">
              What to Expect
            </h2>
            <p className="text-lg text-sage-600 max-w-3xl mx-auto">
              After booking your session, I'll send you a confirmation email with all the details 
              and preparation tips to ensure your session is perfect.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: 'Confirmation',
                description: "You'll receive a confirmation email within 24 hours with session details."
              },
              {
                icon: Camera,
                title: 'Preparation Guide',
                description: 'Get helpful tips on what to wear and how to prepare for your session.'
              },
              {
                icon: MapPin,
                title: 'Location Details',
                description: "I'll provide specific location details and directions for your session."
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-sage-600" />
                </div>
                <h3 className="text-xl font-semibold text-sage-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-sage-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking; 