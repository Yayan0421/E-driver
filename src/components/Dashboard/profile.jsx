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
  const [saveMessage, setSaveMessage] = useState(null);

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
          setSaveMessage('Profile updated successfully!');
          setTimeout(() => setSaveMessage(null), 3000);
        } catch (err) {
          console.error('Failed to save profile', err);
          setSaveMessage('Failed to save profile. Please try again.');
          setTimeout(() => setSaveMessage(null), 4000);
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

          {/* Save Message */}
          {saveMessage && (
            <div className={`save-message ${saveMessage.includes('success') ? 'success' : 'error'}`}>
              {saveMessage}
            </div>
          )}

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
                    <input type="text" placeholder="Enter full name" value={editableProfile?.fullName || ''} onChange={(e) => handleFieldChange('fullName', e.target.value)} />
                  ) : (
                    <p>{driverProfile.fullName || 'Not provided'}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>Date of Birth</label>
                  {editMode ? (
                    <input type="date" value={editableProfile?.dateOfBirth || ''} onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)} />
                  ) : (
                    <p>{driverProfile.dateOfBirth || 'Not provided'}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>Email</label>
                  {editMode ? (
                    <input type="email" value={editableProfile?.email || ''} onChange={(e) => handleFieldChange('email', e.target.value)} />
                  ) : (
                    <p>{driverProfile.email || 'Not provided'}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>Phone</label>
                  {editMode ? (
                    <input type="tel" placeholder="+63 9XX XXX XXXX" value={editableProfile?.phone || ''} onChange={(e) => handleFieldChange('phone', e.target.value)} />
                  ) : (
                    <p>{driverProfile.phone || 'Not provided'}</p>
                  )}
                </div>
                <div className="info-card full-width">
                  <label>Address</label>
                  {editMode ? (
                    <input type="text" placeholder="Your residential address" value={editableProfile?.address || ''} onChange={(e) => handleFieldChange('address', e.target.value)} />
                  ) : (
                    <p>{driverProfile.address || 'Not provided'}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>ID Type</label>
                  {editMode ? (
                    <select value={editableProfile?.idType || 'national-id'} onChange={(e) => handleFieldChange('idType', e.target.value)}>
                      <option value="national-id">National ID</option>
                      <option value="passport">Passport</option>
                      <option value="license">Driver's License</option>
                    </select>
                  ) : (
                    <p>{driverProfile.idType || 'Not provided'}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>ID Number</label>
                  {editMode ? (
                    <input type="text" placeholder="Enter ID number" value={editableProfile?.idNumber || ''} onChange={(e) => handleFieldChange('idNumber', e.target.value)} />
                  ) : (
                    <p>{driverProfile.idNumber || 'Not provided'}</p>
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
                    <select value={editableProfile?.vehicleType || 'motorcycle'} onChange={(e) => handleFieldChange('vehicleType', e.target.value)}>
                      <option value="motorcycle">Motorcycle</option>
                      <option value="car">Car</option>
                      <option value="van">Van</option>
                    </select>
                  ) : (
                    <p>{driverProfile.vehicleType || 'Not provided'}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>Brand</label>
                  {editMode ? (
                    <input type="text" placeholder="Vehicle brand" value={editableProfile?.vehicleBrand || ''} onChange={(e) => handleFieldChange('vehicleBrand', e.target.value)} />
                  ) : (
                    <p>{driverProfile.vehicleBrand || 'Not provided'}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>Model</label>
                  {editMode ? (
                    <input type="text" placeholder="Vehicle model" value={editableProfile?.vehicleModel || ''} onChange={(e) => handleFieldChange('vehicleModel', e.target.value)} />
                  ) : (
                    <p>{driverProfile.vehicleModel || 'Not provided'}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>Year</label>
                  {editMode ? (
                    <input type="text" placeholder="YYYY" value={editableProfile?.vehicleYear || ''} onChange={(e) => handleFieldChange('vehicleYear', e.target.value)} />
                  ) : (
                    <p>{driverProfile.vehicleYear || 'Not provided'}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>License Plate</label>
                  {editMode ? (
                    <input type="text" placeholder="License plate" value={editableProfile?.licensePlate || ''} onChange={(e) => handleFieldChange('licensePlate', e.target.value)} />
                  ) : (
                    <p>{driverProfile.licensePlate || 'Not provided'}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>Color</label>
                  {editMode ? (
                    <input type="text" placeholder="Vehicle color" value={editableProfile?.vehicleColor || ''} onChange={(e) => handleFieldChange('vehicleColor', e.target.value)} />
                  ) : (
                    <p>{driverProfile.vehicleColor || 'Not provided'}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>Insurance Company</label>
                  {editMode ? (
                    <input type="text" placeholder="Insurance company name" value={editableProfile?.insuranceCompany || ''} onChange={(e) => handleFieldChange('insuranceCompany', e.target.value)} />
                  ) : (
                    <p>{driverProfile.insuranceCompany || 'Not provided'}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>Insurance Number</label>
                  {editMode ? (
                    <input type="text" placeholder="Insurance policy number" value={editableProfile?.insuranceNumber || ''} onChange={(e) => handleFieldChange('insuranceNumber', e.target.value)} />
                  ) : (
                    <p>{driverProfile.insuranceNumber || 'Not provided'}</p>
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
                    <input type="text" placeholder="License number" value={editableProfile?.licenseNumber || ''} onChange={(e) => handleFieldChange('licenseNumber', e.target.value)} />
                  ) : (
                    <p>{driverProfile.licenseNumber || 'Not provided'}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>License Expiry</label>
                  {editMode ? (
                    <input type="date" value={editableProfile?.licenseExpiry || ''} onChange={(e) => handleFieldChange('licenseExpiry', e.target.value)} />
                  ) : (
                    <p>{driverProfile.licenseExpiry || 'Not provided'}</p>
                  )}
                </div>
                <div className="info-card full-width">
                  <label>Driving Experience</label>
                  {editMode ? (
                    <input type="text" placeholder="e.g., 5 years" value={editableProfile?.drivingExperience || ''} onChange={(e) => handleFieldChange('drivingExperience', e.target.value)} />
                  ) : (
                    <p>{driverProfile.drivingExperience || 'Not provided'}</p>
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
                    <input type="text" placeholder="Emergency contact name" value={editableProfile?.emergencyContactName || ''} onChange={(e) => handleFieldChange('emergencyContactName', e.target.value)} />
                  ) : (
                    <p>{driverProfile.emergencyContactName || 'Not provided'}</p>
                  )}
                </div>
                <div className="info-card">
                  <label>Contact Phone</label>
                  {editMode ? (
                    <input type="tel" placeholder="+63 9XX XXX XXXX" value={editableProfile?.emergencyContactPhone || ''} onChange={(e) => handleFieldChange('emergencyContactPhone', e.target.value)} />
                  ) : (
                    <p>{driverProfile.emergencyContactPhone || 'Not provided'}</p>
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
