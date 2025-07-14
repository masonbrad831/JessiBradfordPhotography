import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

const BookingManager: React.FC = () => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600">Manage client appointments and booking requests</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Calendar View</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

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
    </div>
  );
};

export default BookingManager; 