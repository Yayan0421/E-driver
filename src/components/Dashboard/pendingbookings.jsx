import React, { useState, useEffect } from 'react';
import SideNavbar from './SideNavbar';
import '../../styles/pendingbookings.css';
import api from '../../api';

const PendingBookings = () => {
  const [userName] = useState('Kim Ryan');
  const [userRole] = useState('Driver');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchPendingBookings();
    
    // Refresh pending bookings every 10 seconds to catch updates
    const interval = setInterval(() => {
      fetchPendingBookings();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchPendingBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getBookings();
      
      if (Array.isArray(res)) {
        // Filter for pending bookings (these are the unaccepted requests)
        const pendingBookings = res.filter(booking => booking.status === 'pending');
        setBookings(pendingBookings);
      } else {
        setError('Failed to load pending bookings');
        setBookings([]);
      }
    } catch (err) {
      console.error('Failed to load pending bookings', err);
      setError('Failed to load pending bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      setActionLoading(bookingId);
      const res = await api.acceptBooking(bookingId);
      
      if (res.error) {
        setError(`Failed to accept booking: ${res.error}`);
        return;
      }
      
      if (res.success || res.booking) {
        setSuccessMessage('Booking accepted successfully! ✓');
        setSelectedBooking(null);
        // Remove from pending list
        setBookings(bookings.filter(b => b.id !== bookingId));
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('Failed to accept booking. Please try again.');
      }
    } catch (err) {
      console.error('Error accepting booking:', err);
      setError(`Error accepting booking: ${err.message || 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      setActionLoading(bookingId);
      const res = await api.rejectBooking(bookingId);
      
      if (res.error) {
        setError(`Failed to reject booking: ${res.error}`);
        return;
      }
      
      if (res.success || res.booking) {
        setSuccessMessage('Booking rejected. Available for other drivers! ✓');
        setSelectedBooking(null);
        // Remove from pending list
        setBookings(bookings.filter(b => b.id !== bookingId));
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('Failed to reject booking. Please try again.');
      }
    } catch (err) {
      console.error('Error rejecting booking:', err);
      setError(`Error rejecting booking: ${err.message || 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const getTimeSinceRequest = (createdAt) => {
    const createdTime = new Date(createdAt);
    const now = new Date();
    const diffMs = now - createdTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const filteredBookings = filterStatus === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus);

  return (
    <div className="dashboard-container">
      {/* Mobile Header with Hamburger */}
      <div className="dashboard-mobile-header">
        <button className="dashboard-hamburger" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          ☰
        </button>
        <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#111827', flex: 1, marginLeft: '0.5rem' }}>Pending Bookings</h2>
      </div>

      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <SideNavbar
        userName={userName}
        userRole={userRole}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="main-content">
        <div className="content-wrapper">
          {/* Header */}
          <div className="pending-header">
            <h1>Pending Bookings</h1>
            <p className="subtitle">Review and respond to booking requests</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="success-message">
              <p>{successMessage}</p>
            </div>
          )}

          {/* Stats Section */}
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-label">Pending Requests</div>
              <div className="stat-value">{filteredBookings.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Potential Earnings</div>
              <div className="stat-value">
                {formatCurrency(filteredBookings.reduce((sum, b) => sum + (b.fare || 0), 0))}
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="filter-section">
            <label htmlFor="status-filter">Filter by Status:</label>
            <select 
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Pending</option>
              <option value="pending">Pending</option>
              <option value="requested">Requested</option>
              <option value="awaiting">Awaiting Response</option>
            </select>
          </div>

          {/* Main Content */}
          <div className="bookings-container">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading pending bookings...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                <p>⚠️ {error}</p>
                <button onClick={fetchPendingBookings}>Retry</button>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h2>No Pending Bookings</h2>
                <p>You don't have any pending booking requests</p>
              </div>
            ) : (
              <div className="bookings-grid">
                {filteredBookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="booking-card pending-card"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <div className="pending-badge">
                      <span>⏳ Awaiting Response</span>
                      <span className="time-ago">{getTimeSinceRequest(booking.createdAt)}</span>
                    </div>

                    <div className="booking-header">
                      <div className="passenger-info">
                        <div className="passenger-avatar">
                          {booking.passengerName?.charAt(0) || 'P'}
                        </div>
                        <div className="passenger-details">
                          <h3>{booking.passengerName || 'Unknown Passenger'}</h3>
                          <p className="rating">⭐ {booking.passengerRating || 'New'}</p>
                        </div>
                      </div>
                      <div className="booking-id">#{booking.id?.slice(0, 8)}</div>
                    </div>

                    <div className="booking-route">
                      <div className="location-point pickup">
                        <div className="location-icon">📍</div>
                        <div className="location-text">
                          <p className="label">Pickup</p>
                          <p className="address">{booking.pickupAddress || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="route-line"></div>
                      <div className="location-point dropoff">
                        <div className="location-icon">🎯</div>
                        <div className="location-text">
                          <p className="label">Dropoff</p>
                          <p className="address">{booking.dropoffAddress || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="booking-details">
                      <div className="detail-row">
                        <span className="label">Distance:</span>
                        <span className="value">{booking.distance || '0'} km</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Offered Fare:</span>
                        <span className="value fare">{formatCurrency(booking.fare || 0)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Request Time:</span>
                        <span className="value">{formatDate(booking.createdAt)}</span>
                      </div>
                    </div>

                    <div className="booking-actions">
                      <button 
                        className="btn-accept"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptBooking(booking.id);
                        }}
                        disabled={actionLoading === booking.id}
                      >
                        {actionLoading === booking.id ? '⏳ Processing...' : '✓ Accept'}
                      </button>
                      <button 
                        className="btn-reject"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRejectBooking(booking.id);
                        }}
                        disabled={actionLoading === booking.id}
                      >
                        {actionLoading === booking.id ? '⏳ Processing...' : '✕ Reject'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal for selected booking */}
          {selectedBooking && (
            <div className="booking-modal-overlay" onClick={() => setSelectedBooking(null)}>
              <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Booking Request Details</h2>
                  <button 
                    className="close-btn"
                    onClick={() => setSelectedBooking(null)}
                  >
                    ✕
                  </button>
                </div>
                <div className="modal-body">
                  <div class="detail-section">
                    <h3>Passenger Information</h3>
                    <p><strong>Name:</strong> {selectedBooking.passengerName}</p>
                    <p><strong>Phone:</strong> {selectedBooking.passengerPhone || 'N/A'}</p>
                    <p><strong>Rating:</strong> ⭐ {selectedBooking.passengerRating || 'New User'}</p>
                  </div>
                  <div class="detail-section">
                    <h3>Trip Information</h3>
                    <p><strong>📍 Pickup Location:</strong> {selectedBooking.pickupAddress}</p>
                    <p><strong>🎯 Dropoff Location:</strong> {selectedBooking.dropoffAddress}</p>
                    <p><strong>Distance:</strong> {selectedBooking.distance} km</p>
                  </div>
                  <div class="detail-section">
                    <h3>Fare Details</h3>
                    <p><strong>Offered Fare:</strong> {formatCurrency(selectedBooking.fare)}</p>
                    <p><strong>Requested at:</strong> {formatDate(selectedBooking.createdAt)}</p>
                  </div>
                  <div class="modal-actions">
                    <button 
                      className="btn-accept-modal"
                      onClick={() => {
                        handleAcceptBooking(selectedBooking.id);
                      }}
                      disabled={actionLoading === selectedBooking.id}
                    >
                      {actionLoading === selectedBooking.id ? '⏳ Processing...' : '✓ Accept This Booking'}
                    </button>
                    <button 
                      className="btn-reject-modal"
                      onClick={() => {
                        handleRejectBooking(selectedBooking.id);
                      }}
                      disabled={actionLoading === selectedBooking.id}
                    >
                      {actionLoading === selectedBooking.id ? '⏳ Processing...' : '✕ Reject This Booking'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingBookings;
