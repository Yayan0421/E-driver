import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/image/logo.jpg';
import '../../styles/sidenavbar.css';

const SideNavbar = ({ userName, userRole = 'Driver', isOpen = true, onToggle = () => {} }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Initialize driver info from localStorage - lazy initialization
  const [driverInfo, setDriverInfo] = useState(() => {
    try {
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const user = JSON.parse(userRaw);
        const name = user.full_name || user.fullName || user.name || userName || 'Driver';
        const email = user.email || user.Email || '';
        return { name, email };
      }
    } catch (err) {
      console.error('Error parsing user data:', err);
    }
    return { name: userName || 'Driver', email: '' };
  });

  // Sync with localStorage when it changes (from other operations)
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const userRaw = localStorage.getItem('user');
        if (userRaw) {
          const user = JSON.parse(userRaw);
          const name = user.full_name || user.fullName || user.name || 'Driver';
          const email = user.email || user.Email || '';
          setDriverInfo({ name, email });
        }
      } catch (err) {
        console.error('Error parsing stored user data:', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const menuItems = [
    { id: 1, title: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { id: 2, title: 'Pending Bookings', icon: '⏳', path: '/pending-bookings' },
    { id: 3, title: 'Ongoing Bookings', icon: '🚗', path: '/ongoing-bookings' },
    { id: 4, title: 'Profile', icon: '👤', path: '/profile' },
    { id: 5, title: 'Messages', icon: '💬', path: '/messages' },
    { id: 6, title: 'Rides History', icon: '📅', path: '/rides-history' },
    { id: 7, title: 'Transaction', icon: '💳', path: '/transaction' },
    { id: 8, title: 'Support', icon: '🆘', path: '/support' },
    { id: 9, title: 'About Us', icon: 'ℹ️', path: '/about-us' },
  ];

  const getInitials = (name) => {
    if (!name) return 'D';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const isActive = (path) => location.pathname === path;

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    // Clear all auth data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('driverFormData');
    navigate('/');
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className={`sidenavbar-container ${isOpen ? 'open' : 'collapsed'}`}>
      {/* Header */}
      <div className="sidenavbar-header">
        <div className="logo-section">
          <div className="logo-circle">
            <img src={logo} alt="Charide Logo" className="logo-image" />
          </div>
          <div className="header-content">
            <h1 className="logo-text">Charide</h1>
            <button 
              className="collapse-btn" 
              onClick={() => onToggle()}
              title={isOpen ? 'Collapse' : 'Expand'}
            >
              ‹
            </button>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="sidenavbar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-title">{item.title}</span>
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className="sidenavbar-user">
        <div className="user-profile">
          <div className="user-avatar">
            {getInitials(driverInfo.name)}
          </div>
          <div className="user-info">
            <h3 className="user-name">{driverInfo.name}</h3>
            <p className="user-email">{driverInfo.email}</p>
            <p className="user-role">{userRole}</p>
          </div>
        </div>

        {/* Logout */}
        <button 
          className="logout-btn"
          onClick={handleLogoutClick}
        >
          <span className="logout-icon">📤</span>
          <span className="logout-text">Log Out</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <div className="logout-modal-header">
              <h2>Confirm Logout</h2>
            </div>
            <div className="logout-modal-body">
              <p>Are you going to log out?</p>
            </div>
            <div className="logout-modal-footer">
              <button 
                className="logout-modal-btn cancel-btn"
                onClick={handleCancelLogout}
              >
                Cancel
              </button>
              <button 
                className="logout-modal-btn confirm-btn"
                onClick={handleConfirmLogout}
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideNavbar;    