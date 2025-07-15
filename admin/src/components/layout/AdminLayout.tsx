import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Image, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Camera,
  Star,
  Clock,
  Globe,
  Gift
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Portfolio Manager', href: '/portfolio-manager', icon: Image },
    { name: 'Bookings', href: '/bookings', icon: Calendar },
    { name: 'Availability', href: '/availability', icon: Clock },
    { name: 'Client Galleries', href: '/client-galleries', icon: Users },
    { name: 'Session Types', href: '/session-types', icon: Clock },
    { name: 'Additional Services', href: '/additional-services', icon: Gift },
    { name: 'Promotions', href: '/promotions', icon: Gift },
    { name: 'Website Content', href: '#', icon: Globe, children: [
      { name: 'Slideshow', href: '/slideshow', icon: Camera },
      { name: 'Featured Work', href: '/featured-work', icon: Image },
      { name: 'Reviews', href: '/reviews', icon: Star },
      { name: 'About Me', href: '/about-me', icon: Users },
      { name: 'Home Intro', href: '/home-intro', icon: Globe }
    ]},
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const renderNavigationItem = (item: any) => {
    if (item.children) {
      return (
        <div key={item.name} className="space-y-3">
          <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            {item.name}
          </div>
          {item.children.map((child: any) => (
            <Link
              key={child.name}
              to={child.href}
              onClick={() => setSidebarOpen(false)}
              className={`sidebar-item ml-4 ${
                isActive(child.href)
                  ? 'active'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <child.icon className="w-4 h-4" />
              <span className="font-medium text-sm">{child.name}</span>
            </Link>
          ))}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        to={item.href}
        onClick={() => setSidebarOpen(false)}
        className={`sidebar-item ${
          isActive(item.href)
            ? 'active'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <item.icon className="w-5 h-5" />
        <span className="font-medium">{item.name}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/90 backdrop-blur-md shadow-2xl border-r border-gray-200/60 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-gray-200/60 bg-gradient-to-r from-sage-50 to-sage-100/50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center shadow-lg">
                <Camera className="w-7 h-7 text-sage-700" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-sage-800">Admin Panel</h1>
                <p className="text-sm font-medium text-sage-600">Jessi Bradford</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-8 space-y-4 overflow-y-auto">
            {navigation.map(renderNavigationItem)}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200/60 bg-gradient-to-r from-gray-50/50 to-gray-100/50">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/60">
          <div className="flex items-center justify-between px-8 py-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-3 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-lg font-bold text-gray-800">
                  {user?.username || 'Admin'}
                </p>
                <p className="text-sm font-medium text-gray-500">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center shadow-lg">
                <Camera className="w-5 h-5 text-sage-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 