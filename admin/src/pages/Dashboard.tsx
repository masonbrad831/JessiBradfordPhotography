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
      bgColor: 'bg-gradient-to-br from-orange-100 to-orange-200'
    },
    {
      title: 'Total Portfolios',
      value: '8',
      change: '+1',
      icon: Image,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-100 to-blue-200'
    },
    {
      title: 'Client Galleries',
      value: '24',
      change: '+5',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-100 to-green-200'
    },
    {
      title: 'This Month',
      value: '$2,450',
      change: '+12%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-100 to-purple-200'
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
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex space-x-4">
          <button className="btn-primary flex items-center space-x-3">
            <Plus className="w-5 h-5" />
            <span>New Booking</span>
          </button>
          <button className="btn-secondary flex items-center space-x-3">
            <Image className="w-5 h-5" />
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
            className="stats-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-green-600">{stat.change} from last month</p>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bgColor} shadow-lg`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
            <button className="text-sm font-semibold text-sage-600 hover:text-sage-800 transition-colors">View all</button>
          </div>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm rounded-xl border border-gray-200/60">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(booking.status)}
                  <div>
                    <p className="font-semibold text-gray-900">{booking.clientName}</p>
                    <p className="text-sm font-medium text-gray-600">{booking.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{booking.date}</p>
                  <p className="text-sm font-medium text-gray-600">{booking.time}</p>
                  <span className={`status-badge ${getStatusColor(booking.status)}`}>
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
          className="card"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center space-x-4 p-4 text-left hover:bg-gray-50/80 rounded-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Add New Portfolio</p>
                <p className="text-sm font-medium text-gray-600">Create a new photography portfolio</p>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-4 p-4 text-left hover:bg-gray-50/80 rounded-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Manage Availability</p>
                <p className="text-sm font-medium text-gray-600">Update your calendar and time slots</p>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-4 p-4 text-left hover:bg-gray-50/80 rounded-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Client Galleries</p>
                <p className="text-sm font-medium text-gray-600">Manage client photo galleries</p>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-4 p-4 text-left hover:bg-gray-50/80 rounded-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Image className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Featured Work</p>
                <p className="text-sm font-medium text-gray-600">Update your featured photography</p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 