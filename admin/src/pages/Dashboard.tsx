import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Image, 
  Users, 
  TrendingUp, 
  Plus,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  // Mock data - replace with real API calls
  const stats = [
    {
      title: 'Pending Bookings',
      value: '12',
      change: '+3',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Total Portfolios',
      value: '8',
      change: '+1',
      icon: Image,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Client Galleries',
      value: '24',
      change: '+5',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'This Month',
      value: '$2,450',
      change: '+12%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const recentBookings = [
    {
      id: '1',
      clientName: 'Sarah Johnson',
      service: 'Family Session',
      date: '2024-02-15',
      time: '2:00 PM',
      status: 'pending'
    },
    {
      id: '2',
      clientName: 'Mike & Lisa Chen',
      service: 'Couple Session',
      date: '2024-02-18',
      time: '4:00 PM',
      status: 'confirmed'
    },
    {
      id: '3',
      clientName: 'Emma Davis',
      service: 'Portrait Session',
      date: '2024-02-20',
      time: '10:00 AM',
      status: 'pending'
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </button>
          <button className="btn-secondary flex items-center space-x-2">
            <Image className="w-4 h-4" />
            <span>Add Photos</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change} from last month</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <button className="text-sm text-sage-600 hover:text-sage-800">View all</button>
          </div>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(booking.status)}
                  <div>
                    <p className="font-medium text-gray-900">{booking.clientName}</p>
                    <p className="text-sm text-gray-600">{booking.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{booking.date}</p>
                  <p className="text-sm text-gray-600">{booking.time}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add New Portfolio</p>
                <p className="text-sm text-gray-600">Create a new photography portfolio</p>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Image className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Upload Photos</p>
                <p className="text-sm text-gray-600">Add photos to existing portfolios</p>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Create Client Gallery</p>
                <p className="text-sm text-gray-600">Set up a private gallery for clients</p>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Review Bookings</p>
                <p className="text-sm text-gray-600">Check and manage booking requests</p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 