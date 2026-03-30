import React, { useState, useEffect } from 'react';
import SideNavbar from './SideNavbar';
import '../../styles/ridehistory.css';
import api from '../../api';

const RideHistory = () => {
  const [userName] = useState('Kim Ryan');
  const [userRole] = useState('Driver');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch ride history on mount
  useEffect(() => {
    fetchRideHistory();
    
    // Refresh ride history every 10 seconds to catch completed/cancelled bookings
    const interval = setInterval(() => {
      fetchRideHistory();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchRideHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getRideHistory();
      
      if (Array.isArray(res)) {
        setRides(res);
      } else {
        setError('Failed to load ride history');
        setRides([]);
      }
    } catch (err) {
      console.error('Failed to load ride history', err);
      setError('Failed to load ride history');
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter rides
  const filteredRides = rides.filter(ride => {
    const statusMatch = filterStatus === 'all' || ride.status === filterStatus;
    const searchMatch = 
      ride.passenger.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.pickupAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.dropoffAddress.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  // Calculate statistics
  const completedRides = rides.filter(r => r.status === 'completed').length;
  const totalEarnings = rides
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + r.fare, 0);
  const totalDistance = rides
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + r.distance, 0);
  const averageRating = rides
    .filter(r => r.rating)
    .reduce((sum, r) => sum + r.rating, 0) / rides.filter(r => r.rating).length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <span className="status-badge completed">✓ Completed</span>;
      case 'cancelled':
        return <span className="status-badge cancelled">✗ Cancelled</span>;
      case 'no-show':
        return <span className="status-badge no-show">⊘ No Show</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const getRideTypeIcon = (type) => {
    switch(type) {
      case 'Standard':
        return '🚗';
      case 'Premium':
        return '⭐';
      case 'Motorcycle':
        return '🏍️';
      default:
        return '🚗';
    }
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="no-rating">No rating</span>;
    return (
      <div className="stars">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < Math.floor(rating) ? 'star filled' : 'star'}>
            ★
          </span>
        ))}
        <span className="rating-value">({rating})</span>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <SideNavbar 
        userName={userName} 
        userRole={userRole}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className={`rides-wrapper ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <div className="rides-container">
          {/* Header */}
          <div className="rides-header">
            <h1>Rides History</h1>
            <p>View all your completed and cancelled rides</p>
          </div>

          {/* Statistics Cards */}
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon">🚗</div>
              <div className="stat-content">
                <p className="stat-label">Total Rides</p>
                <p className="stat-value">{completedRides}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📍</div>
              <div className="stat-content">
                <p className="stat-label">Total Distance</p>
                <p className="stat-value">{totalDistance.toFixed(1)} km</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💵</div>
              <div className="stat-content">
                <p className="stat-label">Total Earnings</p>
                <p className="stat-value">{formatCurrency(totalEarnings)}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <p className="stat-label">Average Rating</p>
                <p className="stat-value">{averageRating.toFixed(1)}</p>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="filters-section">
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Search by passenger name, ride ID, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
                onClick={() => setFilterStatus('completed')}
              >
                Completed
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'cancelled' ? 'active' : ''}`}
                onClick={() => setFilterStatus('cancelled')}
              >
                Cancelled
              </button>
            </div>
          </div>

          {/* Rides List */}
          <div className="rides-list">
            {loading && (
              <div className="loading-message">
                <p>Loading ride history...</p>
              </div>
            )}
            
            {error && (
              <div className="error-message">
                <p>⚠️ {error}</p>
              </div>
            )}
            
            {!loading && filteredRides.length === 0 && (
              <div className="empty-message">
                <p>No rides found</p>
              </div>
            )}
            
            {filteredRides.length > 0 ? (
              filteredRides.map((ride) => (
                <div key={ride.id} className="ride-card">
                  <div className="ride-header">
                    <div className="ride-title">
                      <span className="ride-icon">{getRideTypeIcon(ride.rideType)}</span>
                      <div className="ride-info-top">
                        <h3>{ride.passenger}</h3>
                        <p className="ride-date">{formatDate(ride.date)} at {ride.time}</p>
                      </div>
                    </div>
                    <div className="ride-actions">
                      {getStatusBadge(ride.status)}
                    </div>
                  </div>

                  <div className="ride-details">
                    <div className="route-info">
                      <div className="location pickup">
                        <span className="location-icon">📍</span>
                        <div className="location-details">
                          <p className="location-label">Pickup</p>
                          <p className="location-address">{ride.pickupAddress}</p>
                        </div>
                      </div>

                      <div className="route-line"></div>

                      <div className="location dropoff">
                        <span className="location-icon">🎯</span>
                        <div className="location-details">
                          <p className="location-label">Dropoff</p>
                          <p className="location-address">{ride.dropoffAddress}</p>
                        </div>
                      </div>
                    </div>

                    <div className="ride-stats">
                      <div className="stat">
                        <span className="label">Distance</span>
                        <span className="value">{ride.distance} km</span>
                      </div>
                      <div className="stat">
                        <span className="label">Duration</span>
                        <span className="value">{ride.duration}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Payment</span>
                        <span className="value">{ride.paymentMethod}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Ride Type</span>
                        <span className="value">{ride.rideType}</span>
                      </div>
                    </div>

                    <div className="ride-footer">
                      <div className="rating-section">
                        {renderStars(ride.rating)}
                      </div>
                      {ride.status === 'completed' && ride.fare && (
                        <div className="fare-section">
                          <span className="fare-label">Fare</span>
                          <span className="fare-amount">{formatCurrency(ride.fare)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-rides">
                <p>No rides found</p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="rides-summary">
            <p>Showing {filteredRides.length} of {rides.length} rides</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideHistory;
