import React, { useState, useEffect } from 'react';
import DashboardLayoutRefactored from '../components/Dashboard/DashboardLayoutRefactored';
import {
  Container,
  SectionTitle,
  Button,
  Input,
  FormGroup,
  Card,
  ResponsiveFlex,
  ResponsiveGrid,
  Modal,
} from '../components/Reusable/ResponsiveComponents';

export default function ProfileRefactored() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    dateOfBirth: '1990-01-15',
    nationalId: 'ID123456789',
    address: '123 Main St, City',
    vehicleType: 'Motorcycle',
    licensePlate: 'ABC-1234',
    licenseNumber: 'DL123456',
    licenseExpiry: '2025-12-31',
  });

  const [formData, setFormData] = useState(profileData);
  const [savingStatus, setSavingStatus] = useState(null);

  const sections = [
    {
      title: 'Personal Information',
      icon: '👤',
      fields: ['fullName', 'email', 'phone', 'dateOfBirth', 'nationalId', 'address']
    },
    {
      title: 'Vehicle Information',
      icon: '🏍️',
      fields: ['vehicleType', 'licensePlate']
    },
    {
      title: 'License Information',
      icon: '📄',
      fields: ['licenseNumber', 'licenseExpiry']
    },
  ];

  const fieldLabels = {
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    dateOfBirth: 'Date of Birth',
    nationalId: 'National ID',
    address: 'Address',
    vehicleType: 'Vehicle Type',
    licensePlate: 'License Plate',
    licenseNumber: 'License Number',
    licenseExpiry: 'License Expiry Date',
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSavingStatus('saving');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfileData(formData);
      setIsEditMode(false);
      setSavingStatus('success');
      setTimeout(() => setSavingStatus(null), 3000);
    } catch (error) {
      setSavingStatus('error');
      setTimeout(() => setSavingStatus(null), 3000);
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditMode(false);
  };

  return (
    <DashboardLayoutRefactored>
      <div className="w-full min-h-screen bg-gray-50">
        <Container className="py-8 md:py-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 md:mb-12">
            <div>
              <SectionTitle>Profile Settings</SectionTitle>
              <p className="text-gray-600 text-base md:text-lg">
                {isEditMode ? 'Edit your profile information' : 'View and manage your profile'}
              </p>
            </div>
            
            {!isEditMode && (
              <Button 
                variant="primary"
                onClick={() => setIsEditMode(true)}
              >
                ✏️ Edit Profile
              </Button>
            )}
          </div>

          {/* Status Messages */}
          {savingStatus === 'success' && (
            <div className="mb-6 p-4 md:p-6 bg-green-100 border-l-4 border-green-600 rounded-lg">
              <p className="text-green-800 font-semibold flex items-center gap-2">
                ✅ Profile updated successfully!
              </p>
            </div>
          )}
          {savingStatus === 'error' && (
            <div className="mb-6 p-4 md:p-6 bg-red-100 border-l-4 border-red-600 rounded-lg">
              <p className="text-red-800 font-semibold flex items-center gap-2">
                ❌ Failed to update profile. Please try again.
              </p>
            </div>
          )}

          {/* Profile Sections */}
          <div className="space-y-6 md:space-y-8">
            {sections.map((section) => (
              <Card key={section.title} className="space-y-6">
                {/* Section Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <span className="text-3xl md:text-4xl">{section.icon}</span>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {section.title}
                  </h2>
                </div>

                {/* Section Content */}
                {isEditMode ? (
                  <FormGroup>
                    <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 2, large: 2 }}>
                      {section.fields.map((field) => (
                        <Input
                          key={field}
                          label={fieldLabels[field]}
                          name={field}
                          type={field.includes('Date') ? 'date' : field === 'email' ? 'email' : 'text'}
                          value={formData[field]}
                          onChange={handleInputChange}
                          fullWidth
                        />
                      ))}
                    </ResponsiveGrid>
                  </FormGroup>
                ) : (
                  <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 2, large: 2 }}>
                    {section.fields.map((field) => (
                      <div 
                        key={field} 
                        className="p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <p className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                          {fieldLabels[field]}
                        </p>
                        <p className="text-base md:text-lg font-semibold text-gray-900">
                          {profileData[field] || 'Not provided'}
                        </p>
                      </div>
                    ))}
                  </ResponsiveGrid>
                )}
              </Card>
            ))}
          </div>

          {/* Edit Mode Action Buttons */}
          {isEditMode && (
            <div className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                variant="secondary"
                fullWidth={false}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth={false}
                onClick={handleSave}
                disabled={savingStatus === 'saving'}
              >
                {savingStatus === 'saving' ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </Container>
      </div>
    </DashboardLayoutRefactored>
  );
}
