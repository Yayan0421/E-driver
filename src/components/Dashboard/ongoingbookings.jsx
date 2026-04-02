import React, { useState, useEffect } from 'react';
import SideNavbar from './SideNavbar';
import '../../styles/ongoingbookings.css';
import api from '../../api';

const OngoingBookings = () => {
  const [userName] = useState('Kim Ryan');
  const [userRole] = useState('Driver');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchOngoingBookings();
    
    // Refresh ongoing bookings every 10 seconds to catch updates
    const interval = setInterval(() => {
      fetchOngoingBookings();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchOngoingBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getBookings();
      
      if (Array.isArray(res)) {
        // Filter for accepted bookings (these are the ongoing rides)
        const ongoingBookings = res.filter(booking => booking.status === 'accepted');
        setBookings(ongoingBookings);
      } else {
        setError('Failed to load ongoing bookings');
        setBookings([]);
      }
    } catch (err) {
      console.error('Failed to load ongoing bookings', err);
      setError('Failed to load ongoing bookings');
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

  const handleCompleteBooking = async (bookingId) => {
    try {
      setActionLoading(bookingId);
      const res = await api.completeBooking(bookingId, 0, 0, 0, 0, 'cash');
      
      if (res.error) {
        setError(`Failed to complete booking: ${res.error}`);
        return;
      }
      
      if (res.success || res.booking) {
        setSuccessMessage('Booking completed successfully! ✓');
        setSelectedBooking(null);
        // Remove from ongoing list
        setBookings(bookings.filter(b => b.id !== bookingId));
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('Failed to complete booking. Please try again.');
      }
    } catch (err) {
      console.error('Error completing booking:', err);
      setError(`Error completing booking: ${err.message || 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      setActionLoading(bookingId);
      const res = await api.cancelBooking(bookingId);
      
      if (res.error) {
        setError(`Failed to cancel booking: ${res.error}`);
        return;
      }
      
      if (res.success || res.booking) {
        setSuccessMessage('Booking cancelled. It will appear in Rides History. ✓');
        setSelectedBooking(null);
        // Remove from ongoing list
        setBookings(bookings.filter(b => b.id !== bookingId));
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('Failed to cancel booking. Please try again.');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError(`Error cancelling booking: ${err.message || 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Header with Hamburger */}
      <div className="dashboard-mobile-header">
        <button className="dashboard-hamburger" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          ☰
        </button>
        <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#111827', flex: 1, marginLeft: '0.5rem' }}>Ongoing Bookings</h2>
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
          <div className="ongoing-header">
            <h1>Ongoing Bookings</h1>
            <p className="subtitle">Track your active rides in real-time</p>
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
              <div className="stat-label">Active Rides</div>
              <div className="stat-value">{bookings.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Today's Earnings</div>
              <div className="stat-value">
                {formatCurrency(bookings.reduce((sum, b) => sum + (b.fare || 0), 0))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bookings-container">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading ongoing bookings...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                <p>⚠️ {error}</p>
                <button onClick={fetchOngoingBookings}>Retry</button>
              </div>
            ) : bookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🚕</div>
                <h2>No Ongoing Bookings</h2>
                <p>You don't have any active rides right now</p>
              </div>
            ) : (
              <div className="bookings-grid">
                {bookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="booking-card ongoing-card"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <div className="booking-header">
                      <div className="passenger-info">
                        <div className="passenger-avatar">
                          {booking.passengerName?.charAt(0) || 'P'}
                        </div>
                        <div className="passenger-details">
                          <h3>{booking.passengerName || 'Unknown Passenger'}</h3>
                          <p className="rating">⭐ {booking.passengerRating || 'N/A'}</p>
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
                        <span className="label">Fare:</span>
                        <span className="value fare">{formatCurrency(booking.fare || 0)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Time:</span>
                        <span className="value">{formatDate(booking.createdAt)}</span>
                      </div>
                    </div>

                    <div className="booking-actions">
                      <button 
                        className="btn-complete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteBooking(booking.id);
                        }}
                        disabled={actionLoading === booking.id}
                      >
                        {actionLoading === booking.id ? '⏳ Processing...' : '✓ Complete'}
                      </button>
                      <button 
                        className="btn-cancel"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelBooking(booking.id);
                        }}
                        disabled={actionLoading === booking.id}
                      >
                        {actionLoading === booking.id ? '⏳ Processing...' : '✕ Cancel'}
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
                  <h2>Booking Details</h2>
                  <button 
                    className="close-btn"
                    onClick={() => setSelectedBooking(null)}
                  >
                    ✕
                  </button>
                </div>
                <div className="modal-body">
                  <div className="detail-section">
                    <h3>Passenger Information</h3>
                    <p><strong>Name:</strong> {selectedBooking.passengerName}</p>
                    <p><strong>Phone:</strong> {selectedBooking.passengerPhone || 'N/A'}</p>
                    <p><strong>Rating:</strong> ⭐ {selectedBooking.passengerRating || 'N/A'}</p>
                  </div>
                  <div className="detail-section">
                    <h3>Route Information</h3>
                    <p><strong>Pickup:</strong> {selectedBooking.pickupAddress}</p>
                    <p><strong>Dropoff:</strong> {selectedBooking.dropoffAddress}</p>
                    <p><strong>Distance:</strong> {selectedBooking.distance} km</p>
                  </div>
                  <div className="detail-section">
                    <h3>Fare Details</h3>
                    <p><strong>Estimated Fare:</strong> {formatCurrency(selectedBooking.fare)}</p>
                    <p><strong>Status:</strong> {selectedBooking.status}</p>
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

export default OngoingBookings;
