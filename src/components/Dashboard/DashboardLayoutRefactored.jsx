import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/image/logo.jpg';

export default function DashboardLayoutRefactored({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Driver info from localStorage
  const [driverInfo, setDriverInfo] = useState(() => {
    try {
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const user = JSON.parse(userRaw);
        return {
          name: user.full_name || user.fullName || user.name || 'Driver',
          email: user.email || user.Email || '',
        };
      }
    } catch (err) {
      console.error('Error parsing user data:', err);
    }
    return { name: 'Driver', email: '' };
  });

  // Close sidebar when clicking on content
  const closeSidebar = () => setSidebarOpen(false);

  const menuItems = [
    { id: 1, title: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { id: 2, title: 'Pending Bookings', icon: '⏳', path: '/pending-bookings' },
    { id: 3, title: 'Ongoing Bookings', icon: '🚗', path: '/ongoing-bookings' },
    { id: 4, title: 'Profile', icon: '👤', path: '/profile' },
    { id: 5, title: 'Messages', icon: '💬', path: '/messages' },
    { id: 6, title: 'Ride History', icon: '📜', path: '/ride-history' },
    { id: 7, title: 'Support', icon: '🛟', path: '/support' },
    { id: 8, title: 'Transactions', icon: '💰', path: '/transactions' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* ===== DESKTOP SIDEBAR - Always Visible on MD+ ===== */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col bg-gradient-to-b from-green-600 to-green-700 text-white shadow-lg fixed h-full md:relative z-40">
        
        {/* Sidebar Header */}
        <div className="p-4 md:p-6 border-b border-green-500 flex items-center gap-3">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-12 h-12 rounded-full object-cover border-2 border-white"
          />
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-white truncate">E-Sakay</h2>
          </div>
        </div>

        {/* Navigation Menu - Scrollable */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-white text-green-600 shadow-md'
                  : 'text-white hover:bg-green-700'
              }`}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <span className="truncate">{item.title}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-green-500 p-4 md:p-6 space-y-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 font-bold text-green-600">
              {driverInfo.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{driverInfo.name}</p>
              <p className="text-xs text-green-100 truncate">{driverInfo.email}</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors duration-200 text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ===== MOBILE OVERLAY & DRAWER ===== */}
      {sidebarOpen && (
        <>
          {/* Overlay - Click to Close */}
          <div 
            className="md:hidden fixed inset-0 z-30 bg-black/50 transition-opacity duration-200"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Mobile Drawer */}
          <aside className="md:hidden fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-green-600 to-green-700 text-white shadow-lg z-40 overflow-y-auto">
            
            {/* Close Button */}
            <div className="flex items-center justify-between p-4 border-b border-green-500">
              <div className="flex items-center gap-2">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
                <span className="font-bold">E-Sakay</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-green-700 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Mobile Menu */}
            <nav className="py-4 px-2 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-white text-green-600'
                      : 'text-white hover:bg-green-700'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>

            {/* User Profile - Mobile */}
            <div className="border-t border-green-500 p-4 space-y-3 mt-auto">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold text-green-600">
                  {driverInfo.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm">{driverInfo.name}</p>
                  <p className="text-xs text-green-100">{driverInfo.email}</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </aside>
        </>
      )}

      {/* ===== MAIN CONTENT AREA ===== */}
      <main className="flex-1 overflow-y-auto w-full md:w-auto">
        {/* Mobile Header with Hamburger */}
        <div className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <h1 className="text-lg font-bold text-gray-800">E-Sakay</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Main Content */}
        <div className="w-full">
          {children}
        </div>
      </main>

      {/* ===== LOGOUT CONFIRMATION MODAL ===== */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Modal Overlay */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowLogoutConfirm(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-lg max-w-sm w-full p-6 space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Confirm Logout</h2>
            <p className="text-gray-600">Are you sure you want to logout? You'll be returned to the login page.</p>
            
            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
