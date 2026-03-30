import React, { useState, useEffect } from 'react';
import SideNavbar from './SideNavbar';
import { Link } from 'react-router-dom';
import '../../styles/profile.css';
import api from '../../api';

const Profile = () => {
  const [userName] = useState('Kim Ryan');
  const [userRole] = useState('Driver');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [driverProfile, setDriverProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('personal');
  const [editMode, setEditMode] = useState(false);
  const [editableProfile, setEditableProfile] = useState(null);

  useEffect(() => {
    // Load profile from backend
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getProfile();
        console.log('Profile data received:', res);
        
        // Check if response has actual data (not just empty object)
        if (res && Object.keys(res).length > 0) {
          setDriverProfile(res);
        } else {
          setDriverProfile(null);
          setError('No profile data found');
        }
      } catch (err) {
        console.error('Failed to load profile', err);
        setError('Failed to load profile');
        setDriverProfile(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // editableProfile is set when toggling edit mode to avoid synchronous setState in effect

  const toggleEdit = () => {
    if (!editMode && driverProfile) setEditableProfile(driverProfile);
    setEditMode((v) => !v);
  };

  const handleFieldChange = (field, value) => {
    setEditableProfile((prev) => ({ ...(prev || {}), [field]: value }));
  };

  const handleSave = () => {
    if (editableProfile) {
      (async () => {
        try {
          const res = await api.updateProfile(editableProfile);
          setDriverProfile(res || editableProfile);
          setEditMode(false);
        } catch (err) {
          console.error('Failed to save profile', err);
          alert('Failed to save profile');
        }
      })();
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <SideNavbar 
          userName={userName} 
          userRole={userRole}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className={`profile-wrapper ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
          <div className="profile-container">
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading your profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!driverProfile || error) {
    return (
      <div className="dashboard-container">
        <SideNavbar 
          userName={userName} 
          userRole={userRole}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className={`profile-wrapper ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
          <div className="profile-container">
            <div className="no-profile">
              <h2>{error || 'No Profile Data'}</h2>
              <p>Please complete the driver application form first</p>
              <Link to="/driver-application" className="btn-primary">
                Go to Driver Application
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <SideNavbar 
        userName={userName} 
        userRole={userRole}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className={`profile-wrapper ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <div className="profile-container">
          {/* Header */}
          <div className="profile-header">
            <h1>My Profile</h1>
            <p>Driver Application Details</p>
          </div>

          {/* Selfie and Basic Info */}
          <div className="profile-top">
            {driverProfile.selfieImage && (
              <div className="selfie-container">
                <img src={driverProfile.selfieImage} alt="Profile" className="profile-selfie" />
              </div>
            )}
            <div className="basic-info">
              <h2>{driverProfile.fullName}</h2>
              <p className="role-badge">Driver</p>
              <div className="info-items">
                <div className="info-item">
                  <span className="label">Email</span>
                  <span className="value">{driverProfile.email}</span>
                </div>
                <div className="info-item">
                  <span className="label">Phone</span>
                  <span className="value">{driverProfile.phone}</span>
                </div>
                <div className="info-item">
                  <span className="label">Date of Birth</span>
                  <span className="value">{driverProfile.dateOfBirth}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeSection === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveSection('personal')}
            >
              Personal Info
            </button>
            <button 
              className={`tab-btn ${activeSection === 'vehicle' ? 'active' : ''}`}
              onClick={() => setActiveSection('vehicle')}
            >
              Vehicle Info
            </button>
            <button 
              className={`tab-btn ${activeSection === 'driving' ? 'active' : ''}`}
              onClick={() => setActiveSection('driving')}
            >
              Driving Info
            </button>
            <button 
              className={`tab-btn ${activeSection === 'emergency' ? 'active' : ''}`}
              onClick={() => setActiveSection('emergency')}
            >
              Emergency Contact
            </button>
          </div>

          {/* Personal Information Section */}
          {activeSection === 'personal' && (
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="info-grid">
                <div className="info-card">
                  <label>Full Name</label>
                  {editMode ? (
                    <input value={editableProfile?.fullName || ''} onChange={(e) => handleFieldChange('fullName', e.target.value)} />
                  ) : (
                    <p>{driverProfile.fullName}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>Date of Birth</label>
                  {editMode ? (
                    <input value={editableProfile?.dateOfBirth || ''} onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)} />
                  ) : (
                    <p>{driverProfile.dateOfBirth}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>Email</label>
                  {editMode ? (
                    <input value={editableProfile?.email || ''} onChange={(e) => handleFieldChange('email', e.target.value)} />
                  ) : (
                    <p>{driverProfile.email}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>Phone</label>
                  {editMode ? (
                    <input value={editableProfile?.phone || ''} onChange={(e) => handleFieldChange('phone', e.target.value)} />
                  ) : (
                    <p>{driverProfile.phone}</p>
                  )}
                </div>
                <div className="info-card full-width">
                  <label>Address</label>
                  {editMode ? (
                    <input value={editableProfile?.address || ''} onChange={(e) => handleFieldChange('address', e.target.value)} />
                  ) : (
                    <p>{driverProfile.address}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>ID Type</label>
                  {editMode ? (
                    <input value={editableProfile?.idType || ''} onChange={(e) => handleFieldChange('idType', e.target.value)} />
                  ) : (
                    <p>{driverProfile.idType}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>ID Number</label>
                  {editMode ? (
                    <input value={editableProfile?.idNumber || ''} onChange={(e) => handleFieldChange('idNumber', e.target.value)} />
                  ) : (
                    <p>{driverProfile.idNumber}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Vehicle Information Section */}
          {activeSection === 'vehicle' && (
            <div className="profile-section">
              <h3>Vehicle Information</h3>
              <div className="info-grid">
                <div className="info-card">
                  <label>Vehicle Type</label>
                  {editMode ? (
                    <input value={editableProfile?.vehicleType || ''} onChange={(e) => handleFieldChange('vehicleType', e.target.value)} />
                  ) : (
                    <p>{driverProfile.vehicleType}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>Brand</label>
                  {editMode ? (
                    <input value={editableProfile?.vehicleBrand || ''} onChange={(e) => handleFieldChange('vehicleBrand', e.target.value)} />
                  ) : (
                    <p>{driverProfile.vehicleBrand}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>Model</label>
                  {editMode ? (
                    <input value={editableProfile?.vehicleModel || ''} onChange={(e) => handleFieldChange('vehicleModel', e.target.value)} />
                  ) : (
                    <p>{driverProfile.vehicleModel}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>Year</label>
                  {editMode ? (
                    <input value={editableProfile?.vehicleYear || ''} onChange={(e) => handleFieldChange('vehicleYear', e.target.value)} />
                  ) : (
                    <p>{driverProfile.vehicleYear}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>License Plate</label>
                  {editMode ? (
                    <input value={editableProfile?.licensePlate || ''} onChange={(e) => handleFieldChange('licensePlate', e.target.value)} />
                  ) : (
                    <p>{driverProfile.licensePlate}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>Color</label>
                  {editMode ? (
                    <input value={editableProfile?.vehicleColor || ''} onChange={(e) => handleFieldChange('vehicleColor', e.target.value)} />
                  ) : (
                    <p>{driverProfile.vehicleColor}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>Insurance Company</label>
                  {editMode ? (
                    <input value={editableProfile?.insuranceCompany || ''} onChange={(e) => handleFieldChange('insuranceCompany', e.target.value)} />
                  ) : (
                    <p>{driverProfile.insuranceCompany}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>Insurance Number</label>
                  {editMode ? (
                    <input value={editableProfile?.insuranceNumber || ''} onChange={(e) => handleFieldChange('insuranceNumber', e.target.value)} />
                  ) : (
                    <p>{driverProfile.insuranceNumber}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Driving Information Section */}
          {activeSection === 'driving' && (
            <div className="profile-section">
              <h3>Driving Information</h3>
              <div className="info-grid">
                <div className="info-card">
                  <label>License Number</label>
                  {editMode ? (
                    <input value={editableProfile?.licenseNumber || ''} onChange={(e) => handleFieldChange('licenseNumber', e.target.value)} />
                  ) : (
                    <p>{driverProfile.licenseNumber}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>License Expiry</label>
                  {editMode ? (
                    <input value={editableProfile?.licenseExpiry || ''} onChange={(e) => handleFieldChange('licenseExpiry', e.target.value)} />
                  ) : (
                    <p>{driverProfile.licenseExpiry}</p>
                  )}
                </div>
                <div className="info-card full-width">
                  <label>Driving Experience</label>
                  {editMode ? (
                    <input value={editableProfile?.drivingExperience || ''} onChange={(e) => handleFieldChange('drivingExperience', e.target.value)} />
                  ) : (
                    <p>{driverProfile.drivingExperience}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>Traffic Violations</label>
                  {editMode ? (
                    <select value={editableProfile?.violations || 'no'} onChange={(e) => handleFieldChange('violations', e.target.value)}>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  ) : (
                    <p>{driverProfile.violations === 'no' ? 'No' : 'Yes'}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Emergency Contact Section */}
          {activeSection === 'emergency' && (
            <div className="profile-section">
              <h3>Emergency Contact</h3>
              <div className="info-grid">
                <div className="info-card">
                  <label>Contact Name</label>
                  {editMode ? (
                    <input value={editableProfile?.emergencyContactName || ''} onChange={(e) => handleFieldChange('emergencyContactName', e.target.value)} />
                  ) : (
                    <p>{driverProfile.emergencyContactName}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>Contact Phone</label>
                  {editMode ? (
                    <input value={editableProfile?.emergencyContactPhone || ''} onChange={(e) => handleFieldChange('emergencyContactPhone', e.target.value)} />
                  ) : (
                    <p>{driverProfile.emergencyContactPhone}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="profile-actions">
            <button className="btn-secondary" type="button" onClick={toggleEdit}>
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
            <button className="btn-primary" type="button" onClick={editMode ? handleSave : undefined}>
              {editMode ? 'Save' : 'Update Information'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
