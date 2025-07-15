import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle, XCircle, MessageSquare, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchResource, saveResource } from '../api';

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
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'created' | 'appointment'>('created');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'declined' | 'done'>('all');

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM'
  ];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const bookingsData = await fetchResource('Booking');
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        const servicesData = await fetchResource('SessionTypes');
        setServices(Array.isArray(servicesData) ? servicesData.map((s: any) => s.name) : []);
      } catch (e) {
        toast.error('Failed to load bookings or services');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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

  // Helper to determine if a booking is done (appointment date in the past)
  const isDone = (booking: any) => {
    const today = new Date();
    const apptDate = new Date(booking.date + 'T' + (booking.time || '00:00'));
    return apptDate < today;
  };

  // Sort and filter bookings
  let displayedBookings = [...bookings];
  if (statusFilter !== 'all') {
    if (statusFilter === 'done') {
      displayedBookings = displayedBookings.filter(b => isDone(b));
    } else if (statusFilter === 'declined') {
      displayedBookings = displayedBookings.filter(b => b.status === 'declined' || b.status === 'cancelled');
    } else {
      displayedBookings = displayedBookings.filter(b => b.status === statusFilter);
    }
  }
  if (sortBy === 'created') {
    displayedBookings.sort((a, b) => Number(b.id) - Number(a.id));
  } else if (sortBy === 'appointment') {
    displayedBookings.sort((a, b) => new Date(b.date + 'T' + (b.time || '00:00')).getTime() - new Date(a.date + 'T' + (a.time || '00:00')).getTime());
  }

  const handleNewBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.clientName || !newBooking.email || !newBooking.service || !newBooking.date || !newBooking.time) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const newId = Date.now().toString();
      const bookingToSave = { ...newBooking, id: newId, status: 'pending' };
      const updatedBookings = [...bookings, bookingToSave];
      await saveResource('Booking', updatedBookings);
      setBookings(updatedBookings);
      toast.success('Booking created successfully!');
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
    } catch (e) {
      toast.error('Failed to create booking');
    }
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

      {/* Sorting and Filtering Controls */}
      <div className="flex flex-wrap items-center gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <button onClick={() => setStatusFilter('all')} className={`px-3 py-1 rounded-full text-sm font-medium ${statusFilter === 'all' ? 'bg-sage-600 text-white' : 'bg-sage-100 text-sage-700 hover:bg-sage-200'}`}>All</button>
          <button onClick={() => setStatusFilter('confirmed')} className={`px-3 py-1 rounded-full text-sm font-medium ${statusFilter === 'confirmed' ? 'bg-sage-600 text-white' : 'bg-sage-100 text-sage-700 hover:bg-sage-200'}`}>Accepted</button>
          <button onClick={() => setStatusFilter('pending')} className={`px-3 py-1 rounded-full text-sm font-medium ${statusFilter === 'pending' ? 'bg-sage-600 text-white' : 'bg-sage-100 text-sage-700 hover:bg-sage-200'}`}>Pending</button>
          <button onClick={() => setStatusFilter('done')} className={`px-3 py-1 rounded-full text-sm font-medium ${statusFilter === 'done' ? 'bg-sage-600 text-white' : 'bg-sage-100 text-sage-700 hover:bg-sage-200'}`}>Done</button>
          <button onClick={() => setStatusFilter('declined')} className={`px-3 py-1 rounded-full text-sm font-medium ${statusFilter === 'declined' ? 'bg-sage-600 text-white' : 'bg-sage-100 text-sage-700 hover:bg-sage-200'}`}>Declined</button>
        </div>
        <div className="flex gap-2 ml-auto">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="input-field text-sm py-1 px-2">
            <option value="created">Booking Time (Newest)</option>
            <option value="appointment">Appointment Date</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading bookings...</div>
          ) : displayedBookings.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No bookings found.</div>
          ) : (
            displayedBookings.map((booking, index) => (
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
                  <button
                    className="btn-primary text-sm py-1 px-3"
                    onClick={async () => {
                      const updatedBookings = bookings.map(b =>
                        b.id === booking.id ? { ...b, status: 'confirmed' } : b
                      );
                      setBookings(updatedBookings);
                      try {
                        await saveResource('Booking', updatedBookings);
                        toast.success('Booking confirmed!');
                      } catch (e) {
                        toast.error('Failed to confirm booking');
                      }
                    }}
                    disabled={booking.status === 'confirmed'}
                  >
                    Accept
                  </button>
                  <button className="btn-secondary text-sm py-1 px-3">
                    Suggest Alternative
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 text-sm py-1 px-3"
                    onClick={async () => {
                      const updatedBookings = bookings.map(b =>
                        b.id === booking.id ? { ...b, status: 'declined' } : b
                      );
                      setBookings(updatedBookings);
                      try {
                        await saveResource('Booking', updatedBookings);
                        toast.success('Booking declined!');
                      } catch (e) {
                        toast.error('Failed to decline booking');
                      }
                    }}
                    disabled={booking.status === 'declined' || booking.status === 'cancelled'}
                  >
                    Decline
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 text-sm py-1 px-3">
                    <MessageSquare className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                </div>
              </motion.div>
            ))
          )}
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
              className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="text-xl font-semibold text-gray-900">New Booking</h2>
                <button
                  onClick={() => setShowNewBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleNewBookingSubmit(e);
                }}
                className="p-6 space-y-4"
              >
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

                <div className="flex space-x-3 pt-4 sticky bottom-0 bg-white border-t border-gray-200 -mx-6 px-6 py-4">
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