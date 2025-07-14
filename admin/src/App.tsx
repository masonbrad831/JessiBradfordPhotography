import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PortfolioManager from './pages/PortfolioManager';
import BookingManager from './pages/BookingManager';
import ClientGalleryManager from './pages/ClientGalleryManager';
import Settings from './pages/Settings';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="portfolio" element={<PortfolioManager />} />
              <Route path="bookings" element={<BookingManager />} />
              <Route path="client-galleries" element={<ClientGalleryManager />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 