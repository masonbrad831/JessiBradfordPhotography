import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, MapPin, Camera } from 'lucide-react';
import BookingCalendar from '../components/BookingCalendar';

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

  const services = [
    { id: 'portrait', name: 'Portrait Session', price: '$150', duration: '1 hour' },
    { id: 'couple', name: 'Couple Session', price: '$200', duration: '1.5 hours' },
    { id: 'family', name: 'Family Session', price: '$250', duration: '2 hours' },
    { id: 'engagement', name: 'Engagement Session', price: '$300', duration: '2 hours' }
  ];

  const handleDateSelect = (date: Date, timeSlot: string) => {
    setSelectedDate(date);
    setSelectedTime(timeSlot);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement booking submission
    console.log('Booking submitted:', { selectedDate, selectedTime, formData });
  };

  return (
    <div className="min-h-screen bg-white">
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
                    <div className="space-y-3">
                      {services.map((service) => (
                        <label key={service.id} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="service"
                            value={service.id}
                            checked={formData.service === service.id}
                            onChange={handleFormChange}
                            className="text-sage-600 focus:ring-sage-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sage-800">{service.name}</span>
                              <span className="text-sage-600">{service.price}</span>
                            </div>
                            <span className="text-sm text-sage-600">{service.duration}</span>
                          </div>
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
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={!selectedDate || !selectedTime || !formData.service}
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