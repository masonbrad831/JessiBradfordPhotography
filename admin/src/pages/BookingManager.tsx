import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle, XCircle, MessageSquare, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const BookingManager: React.FC = () => {
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    clientName: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: ''
  });

  const bookings = [
    {
      id: '1',
      clientName: 'Sarah Johnson',
      service: 'Family Session',
      date: '2024-02-15',
      time: '2:00 PM',
      status: 'pending',
      email: 'sarah@email.com',
      phone: '(555) 123-4567'
    },
    {
      id: '2',
      clientName: 'Mike & Lisa Chen',
      service: 'Couple Session',
      date: '2024-02-18',
      time: '4:00 PM',
      status: 'confirmed',
      email: 'mike@email.com',
      phone: '(555) 234-5678'
    },
    {
      id: '3',
      clientName: 'Emma Davis',
      service: 'Portrait Session',
      date: '2024-02-20',
      time: '10:00 AM',
      status: 'pending',
      email: 'emma@email.com',
      phone: '(555) 345-6789'
    }
  ];

  const services = [
    'Family Session',
    'Couple Session',
    'Portrait Session',
    'Engagement Session',
    'Wedding Photography',
    'Event Photography'
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM'
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNewBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!newBooking.clientName || !newBooking.email || !newBooking.service || !newBooking.date || !newBooking.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    // TODO: Send to API
    console.log('New booking:', newBooking);
    toast.success('Booking created successfully!');
    
    // Reset form and close modal
    setNewBooking({
      clientName: '',
      email: '',
      phone: '',
      service: '',
      date: '',
      time: '',
      notes: ''
    });
    setShowNewBookingModal(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setNewBooking(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600">Manage client appointments and booking requests</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsCalendarView(!isCalendarView)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              isCalendarView 
                ? 'bg-sage-600 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Calendar View</span>
          </button>
          <button 
            onClick={() => setShowNewBookingModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <User className="w-4 h-4" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {isCalendarView && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Calendar View</h2>
            <div className="flex space-x-2">
              <button className="text-sm text-sage-600 hover:text-sage-800">Today</button>
              <button className="text-sm text-sage-600 hover:text-sage-800">Week</button>
              <button className="text-sm text-sage-600 hover:text-sage-800">Month</button>
            </div>
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            {/* Calendar days would go here */}
            {Array.from({ length: 35 }, (_, i) => (
              <div key={i} className="p-2 text-center text-sm border border-gray-100 min-h-[60px]">
                <div className="text-gray-900">{i + 1}</div>
                {/* Booking indicators would go here */}
              </div>
            ))}
          </div>
          
          <div className="text-center text-gray-500 text-sm">
            Calendar functionality coming soon...
          </div>
        </motion.div>
      )}

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(booking.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{booking.clientName}</h3>
                    <p className="text-sm text-gray-600">{booking.service}</p>
                    <p className="text-sm text-gray-500">{booking.email} • {booking.phone}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{booking.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{booking.time}</span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-100">
                <button className="btn-primary text-sm py-1 px-3">
                  Accept
                </button>
                <button className="btn-secondary text-sm py-1 px-3">
                  Suggest Alternative
                </button>
                <button className="text-red-600 hover:text-red-800 text-sm py-1 px-3">
                  Decline
                </button>
                <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 text-sm py-1 px-3">
                  <MessageSquare className="w-4 h-4" />
                  <span>Message</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* New Booking Modal */}
      <AnimatePresence>
        {showNewBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">New Booking</h2>
                <button
                  onClick={() => setShowNewBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleNewBookingSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    value={newBooking.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    className="input-field"
                    placeholder="Enter client name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newBooking.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="input-field"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newBooking.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="input-field"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service *
                  </label>
                  <select
                    value={newBooking.service}
                    onChange={(e) => handleInputChange('service', e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Select a service</option>
                    {services.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={newBooking.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <select
                      value={newBooking.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="">Select time</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newBooking.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="input-field"
                    rows={3}
                    placeholder="Any special requests or notes..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewBookingModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    Create Booking
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingManager; 