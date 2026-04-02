import React, { useEffect, useState, useCallback } from 'react';
import SideNavbar from './SideNavbar';
import '../../styles/dashboardhome.css';
import api from '../../api';

const Dashboardhome = () => {
  const [userName] = useState('Kim Ryan');
  const [userRole] = useState('Driver');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleViewMap = (booking) => {
    setSelectedBooking(booking);
    // Scroll to map smoothly
    setTimeout(() => {
      const mapElement = document.querySelector('.map-container');
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const formatBookingTime = (createdAt) => {
    if (!createdAt) return 'N/A';
    const date = new Date(createdAt);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const locateUser = () => {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const me = { id: 'me', passenger: 'You', address: 'Your location', lat, lng, time: 'Now' };
          setCurrentLocation(me);
          setSelectedBooking(me);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location. Please enable location services.');
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getBookings();
      
      if (Array.isArray(res)) {
        // Filter for only pending bookings (not accepted or other statuses)
        const pendingBookings = res.filter(b => b.status === 'pending');
        
        // Transform booking data to match the UI expectations
        const formattedBookings = pendingBookings.map(b => {
          // Debug log to check available location data
          console.log('Booking data:', {
            id: b.id,
            address: b.pickupAddress,
            lat: b.pickupLatitude,
            lng: b.pickupLongitude,
            allFields: Object.keys(b)
          });
          
          return {
            id: b.id,
            passenger: b.passengerName,
            email: b.passengerEmail,
            phone: b.passengerPhone,
            address: b.pickupAddress,
            dropoffAddress: b.dropoffAddress,
            lat: parseFloat(b.pickupLatitude) || 0,
            lng: parseFloat(b.pickupLongitude) || 0,
            dropoffLat: parseFloat(b.dropoffLatitude) || 0,
            dropoffLng: parseFloat(b.dropoffLongitude) || 0,
            time: formatBookingTime(b.createdAt),
            status: b.status,
            createdAt: b.createdAt,
            ...b // Keep all original fields as well
          };
        });
        
        setBookings(formattedBookings);
        
        // Auto-select first booking if available
        if (formattedBookings.length > 0 && !selectedBooking) {
          setSelectedBooking(formattedBookings[0]);
        }
      } else {
        setError('Failed to load bookings');
        setBookings([]);
      }
    } catch (err) {
      console.error('Failed to load bookings', err);
      setError(err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [selectedBooking]);

  useEffect(() => {
    // Fetch bookings on mount
    fetchBookings();

    // Set up interval to refresh bookings every 5 seconds
    const interval = setInterval(fetchBookings, 5000);

    // Try to auto-locate user and center the map on their location (async)
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const me = { id: 'me', passenger: 'You', address: 'Your location', lat, lng, time: 'Now' };
          setCurrentLocation(me);
        },
        () => {
          // ignore errors silently; user can click "Locate me"
        },
        { enableHighAccuracy: true }
      );
    }

    return () => clearInterval(interval);
  }, [fetchBookings]);

  return (
    <div className="dashboard-container">
      {/* Mobile Header with Hamburger */}
      <div className="dashboard-mobile-header">
        <button className="dashboard-hamburger" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          ☰
        </button>
        <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#111827', flex: 1, marginLeft: '0.5rem' }}>Dashboard</h2>
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
      <div className={`dashboard-main ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <div className="dashboard-content">
          <h1>Welcome, {userName}!</h1>
          <p>You are logged in as a {userRole}</p>

          {/* Map Section */}
          <div className="map-toolbar">
            <button className="btn-locate" onClick={(e) => { e.stopPropagation(); locateUser(); }}>
              Locate me
            </button>
            {selectedBooking && selectedBooking.id !== 'me' && (
              <span className="loc-info">📍 {selectedBooking.passenger} - {selectedBooking.address}</span>
            )}
            {currentLocation && selectedBooking && selectedBooking.id === 'me' && (
              <span className="loc-info">📍 Centered on your location</span>
            )}
            {!selectedBooking && <span className="loc-info">Select a booking to view on map</span>}
          </div>

          <div className="map-container map-expanded">
            {selectedBooking ? (
              selectedBooking.lat && selectedBooking.lng && (selectedBooking.lat !== 0 && selectedBooking.lng !== 0) ? (
                <iframe
                  title="live-map"
                  className="map-frame"
                  src={`https://www.google.com/maps?q=${selectedBooking.lat},${selectedBooking.lng}&z=16&output=embed`}
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div className="map-placeholder">
                  ⚠️ Location data not available for {selectedBooking.passenger}
                  <p>{selectedBooking.address || 'No address provided'}</p>
                </div>
              )
            ) : (
              <div className="map-placeholder">No location selected</div>
            )}
          </div>

          {/* Bookings Section */}
          <section className="bookings-section">
            <h2>Bookings</h2>
            {loading && <p className="loading-text">Loading bookings...</p>}
            {error && <p className="error-text">Error: {error}</p>}
            <div className="bookings-list">
              {!loading && bookings.length === 0 && <p>No bookings yet.</p>}
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className={`booking-card ${selectedBooking && selectedBooking.id === b.id ? 'booking-active' : ''}`}
                  onClick={() => setSelectedBooking(b)}
                >
                  <div className="booking-info">
                    <strong>{b.passenger}</strong>
                    {b.status && <span className={`booking-status ${b.status}`}>{b.status}</span>}
                    <span className="booking-time">{b.time}</span>
                    <div className="booking-address">
                      <div className="booking-address-label">Pickup:</div>
                      <div>{b.address}</div>
                    </div>
                    {b.dropoffAddress && (
                      <div className="booking-address">
                        <div className="booking-address-label">Dropoff:</div>
                        <div>{b.dropoffAddress}</div>
                      </div>
                    )}
                  </div>
                  <div className="booking-actions">
                    <button className="btn-view" onClick={(e) => { e.stopPropagation(); handleViewMap(b); }}>
                      View on map
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboardhome;