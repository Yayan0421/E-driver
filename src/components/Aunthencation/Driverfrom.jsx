import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitDriverApplication } from '../../api';
import '../../styles/driverform.css';
import Swal from 'sweetalert2';

const DriverForm = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const touchStartX = useRef(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [reviewSection, setReviewSection] = useState(0); // 0: Personal, 1: Vehicle, 2: Driving, 3: Selfie
  const [cameraActive, setCameraActive] = useState(false);
  const [selfieImage, setSelfieImage] = useState(null);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    idType: 'national-id',
    idNumber: '',

    // Vehicle Information
    vehicleType: 'motorcycle',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    licensePlate: '',
    vehicleColor: '',
    insuranceCompany: '',
    insuranceNumber: '',

    // Driving Information
    licenseNumber: '',
    licenseExpiry: '',
    drivingExperience: '',

    // Background
    emergencyContactName: '',
    emergencyContactPhone: '',
    violations: 'no',

    // Agreements
    acceptTerms: false
  });

  // Camera management functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  // Webcam effects
  useEffect(() => {
    if (cameraActive && currentStep === 4) {
      startCamera();
      return () => {
        stopCamera();
      };
    }
  }, [cameraActive, currentStep]);

  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const imageData = canvasRef.current.toDataURL('image/jpeg');
      setSelfieImage(imageData);
      stopCamera();
      setCameraActive(false);
    }
  };

  const retakeSelfie = () => {
    setSelfieImage(null);
    setCameraActive(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Swipe handlers for review carousel
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const difference = touchStartX.current - touchEndX;

    if (Math.abs(difference) > 50) { // Swipe threshold
      if (difference > 0 && reviewSection < 3) {
        setReviewSection(reviewSection + 1);
      } else if (difference < 0 && reviewSection > 0) {
        setReviewSection(reviewSection - 1);
      }
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const validateStep = (step) => {
    switch(step) {
      case 1:
        return formData.fullName && formData.dateOfBirth && formData.email && formData.phone;
      case 2:
        return formData.vehicleBrand && formData.vehicleModel && formData.vehicleYear && formData.licensePlate;
      case 3:
        return formData.licenseNumber && formData.licenseExpiry && formData.drivingExperience;
      case 4:
        return selfieImage !== null;
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      alert('Please accept Terms & Conditions');
      return;
    }

    // Save driver data to backend which inserts into Supabase
    const driverData = { ...formData, selfieImage };
    try {
      const json = await submitDriverApplication(driverData);
      if (json && json.success) {
        await Swal.fire({
          title: 'Application Submitted',
          text: 'Your driver application was submitted successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        navigate('/login');
        return;
      }

      console.error('Driver application save failed', json);
      alert('Failed to submit application — please try again');
    } catch (err) {
      console.error('Failed to submit application', err);
      alert('Failed to submit application — please try again');
    }
  };

  return (
    <div className="driver-form-container">
      <div className="driver-form-wrapper">
        <div className="form-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back
          </button>
          <h1>Driver Application Form</h1>
          <p>Join our team of professional drivers</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-steps">
            {[1, 2, 3, 4, 5].map((step) => (
              <div 
                key={step} 
                className={`progress-step ${currentStep >= step ? 'active' : ''}`}
              >
                <span>{step}</span>
              </div>
            ))}
          </div>
          <div className="progress-labels">
            <span>Personal</span>
            <span>Vehicle</span>
            <span>Driving</span>
            <span>Selfie</span>
            <span>Review</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="form-step">
              <h2>Personal Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth *</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+63 9XX XXX XXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Your residential address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="idType">ID Type</label>
                  <select 
                    id="idType" 
                    name="idType"
                    value={formData.idType}
                    onChange={handleChange}
                  >
                    <option value="national-id">National ID</option>
                    <option value="passport">Passport</option>
                    <option value="license">Driver's License</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="idNumber">ID Number</label>
                  <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    placeholder="Your ID number"
                    value={formData.idNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Vehicle Information */}
          {currentStep === 2 && (
            <div className="form-step">
              <h2>Vehicle Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="vehicleType">Vehicle Type *</label>
                  <select 
                    id="vehicleType" 
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                  >
                    <option value="motorcycle">Motorcycle</option>
                    <option value="tricycle">Tricycle</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="vehicleBrand">Brand *</label>
                  <input
                    type="text"
                    id="vehicleBrand"
                    name="vehicleBrand"
                    placeholder="Vehicle brand"
                    value={formData.vehicleBrand}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="vehicleModel">Model *</label>
                  <input
                    type="text"
                    id="vehicleModel"
                    name="vehicleModel"
                    placeholder="Vehicle model"
                    value={formData.vehicleModel}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="vehicleYear">Year *</label>
                  <input
                    type="number"
                    id="vehicleYear"
                    name="vehicleYear"
                    placeholder="2024"
                    value={formData.vehicleYear}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="licensePlate">License Plate *</label>
                  <input
                    type="text"
                    id="licensePlate"
                    name="licensePlate"
                    placeholder="ABC-1234"
                    value={formData.licensePlate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="vehicleColor">Color</label>
                  <input
                    type="text"
                    id="vehicleColor"
                    name="vehicleColor"
                    placeholder="Vehicle color"
                    value={formData.vehicleColor}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="insuranceCompany">Insurance Company</label>
                  <input
                    type="text"
                    id="insuranceCompany"
                    name="insuranceCompany"
                    placeholder="Insurance company name"
                    value={formData.insuranceCompany}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="insuranceNumber">Insurance Number</label>
                  <input
                    type="text"
                    id="insuranceNumber"
                    name="insuranceNumber"
                    placeholder="Insurance policy number"
                    value={formData.insuranceNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Driving Information */}
          {currentStep === 3 && (
            <div className="form-step">
              <h2>Driving Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="licenseNumber">Driver's License Number *</label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    placeholder="Your license number"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="licenseExpiry">License Expiry Date *</label>
                  <input
                    type="date"
                    id="licenseExpiry"
                    name="licenseExpiry"
                    value={formData.licenseExpiry}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="drivingExperience">Years of Driving Experience *</label>
                <input
                  type="number"
                  id="drivingExperience"
                  name="drivingExperience"
                  placeholder="e.g., 5"
                  value={formData.drivingExperience}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="emergencyContactName">Emergency Contact Name</label>
                  <input
                    type="text"
                    id="emergencyContactName"
                    name="emergencyContactName"
                    placeholder="Contact person's name"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emergencyContactPhone">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    placeholder="+63 9XX XXX XXXX"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="violations">Traffic Violations</label>
                <select 
                  id="violations" 
                  name="violations"
                  value={formData.violations}
                  onChange={handleChange}
                >
                  <option value="no">No violations</option>
                  <option value="yes">Yes, I have violations</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Identity Verification - Selfie */}
          {currentStep === 4 && (
            <div className="form-step">
              <h2>Identity Verification</h2>
              <p className="step-description">Take a clear selfie for driver verification</p>

              <div className="selfie-section">
                <div className="selfie-instructions">
                  <h3>📸 Selfie Guidelines</h3>
                  <ul>
                    <li>Face must be clearly visible</li>
                    <li>Good lighting - avoid shadows on face</li>
                    <li>Neutral background preferred</li>
                    <li>Look directly at the camera</li>
                    <li>Remove sunglasses and hats</li>
                  </ul>
                </div>

                {!selfieImage ? (
                  <>
                    {!cameraActive ? (
                      <button 
                        type="button" 
                        className="btn-capture"
                        onClick={() => setCameraActive(true)}
                      >
                        📷 Start Camera
                      </button>
                    ) : (
                      <div className="camera-container">
                        <video 
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="camera-video"
                        />
                        <canvas 
                          ref={canvasRef} 
                          style={{ display: 'none' }}
                        />
                        <div className="camera-controls">
                          <button 
                            type="button" 
                            className="btn-primary"
                            onClick={captureSelfie}
                          >
                            📸 Take Photo
                          </button>
                          <button 
                            type="button" 
                            className="btn-secondary"
                            onClick={() => {
                              setCameraActive(false);
                              stopCamera();
                            }}
                          >
                            Close Camera
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="selfie-preview">
                    <img src={selfieImage} alt="Selfie Preview" />
                    <div className="preview-actions">
                      <button 
                        type="button" 
                        className="btn-primary"
                        onClick={() => {}}
                      >
                        ✓ Confirm
                      </button>
                      <button 
                        type="button" 
                        className="btn-secondary"
                        onClick={retakeSelfie}
                      >
                        🔄 Retake
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Review & Agreement */}
          {currentStep === 5 && (
            <div className="form-step">
              <h2>Review Your Information</h2>
              
              {/* Review Carousel Container */}
              <div 
                className="review-carousel"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Section 0: Personal Information */}
                {reviewSection === 0 && (
                  <div className="review-carousel-content">
                    <h3>Personal Information</h3>
                    <div className="carousel-review-grid">
                      <div className="carousel-review-item">
                        <span className="label">Full Name:</span>
                        <span className="value">{formData.fullName}</span>
                      </div>
                      <div className="carousel-review-item">
                        <span className="label">Date of Birth:</span>
                        <span className="value">{formData.dateOfBirth}</span>
                      </div>
                      <div className="carousel-review-item">
                        <span className="label">Email:</span>
                        <span className="value">{formData.email}</span>
                      </div>
                      <div className="carousel-review-item">
                        <span className="label">Phone:</span>
                        <span className="value">{formData.phone}</span>
                      </div>
                      <div className="carousel-review-item">
                        <span className="label">Address:</span>
                        <span className="value">{formData.address || 'Not provided'}</span>
                      </div>
                      <div className="carousel-review-item">
                        <span className="label">ID Type:</span>
                        <span className="value">{formData.idType}</span>
                      </div>
                      <div className="carousel-review-item">
                        <span className="label">ID Number:</span>
                        <span className="value">{formData.idNumber || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 1: Vehicle Information */}
                {reviewSection === 1 && (
                  <div className="review-carousel-content">
                    <h3>Vehicle Information</h3>
                    <div className="carousel-review-grid">
                      <div className="carousel-review-item">
                        <span className="label">Vehicle Type:</span>
                        <span className="value">{formData.vehicleType}</span>
                      </div>
                      <div className="carousel-review-item">
                        <span className="label">Brand:</span>
                        <span className="value">{formData.vehicleBrand}</span>
                      </div>
                      <div className="carousel-review-item">
                        <span className="label">Model:</span>
                        <span className="value">{formData.vehicleModel}</span>
                      </div>
                      <div className="carousel-review-item">
                        <span className="label">Year:</span>
                        <span className="value">{formData.vehicleYear}</span>
                      </div>
                      <div className="carousel-review-item">
                        <span className="label">License Plate:</span>
                        <span className="value">{formData.licensePlate}</span>
                      </div>
                      <div className="carousel-review-item">
                        <span className="label">Color:</span>
                        <span className="value">{formData.vehicleColor || 'Not provided'}</span>
                      </div>
                      <div className="carousel-review-item">
                        <span className="label">Insurance Company:</span>
                        <span className="value">{formData.insuranceCompany || 'Not provided'}</span>
                      </div>
                      <div className="carousel-review-item">
                        <span className="label">Insurance Number:</span>
                        <span className="value">{formData.insuranceNumber || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 2: Driving Information */}
                {reviewSection === 2 && (
                  <div className="review-carousel-content">
                    <h3>Driving Information</h3>
                    <div className="carousel-review-grid">
                      <div className="carousel-review-item">
                        <span className="label">License Number:</span>
                        <span className="value">{formData.licenseNumber}</span>
                      </div>
                      <div className="carousel-review-item">
                        <span className="label">License Expiry:</span>
                        <span className="value">{formData.licenseExpiry}</span>
                      </div>
                      <div className="carousel-review-item">
                        <span className="label">Driving Experience:</span>
                        <span className="value">{formData.drivingExperience} years</span>
                      </div>
                      <div className="carousel-review-item">
                        <span className="label">Emergency Contact Name:</span>
                        <span className="value">{formData.emergencyContactName || 'Not provided'}</span>
                      </div>
                      <div className="carousel-review-item">
                        <span className="label">Emergency Contact Phone:</span>
                        <span className="value">{formData.emergencyContactPhone || 'Not provided'}</span>
                      </div>
                      <div className="carousel-review-item">
                        <span className="label">Traffic Violations:</span>
                        <span className="value">{formData.violations}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 3: Selfie */}
                {reviewSection === 3 && (
                  <div className="review-carousel-content">
                    <h3>Identity Verification</h3>
                    {selfieImage && (
                      <div className="selfie-review-container">
                        <img src={selfieImage} alt="Your Selfie" className="selfie-review-image" />
                        <p className="selfie-review-label">Your verification photo</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation Circles */}
              <div className="carousel-navigation">
                {[0, 1, 2, 3].map((index) => (
                  <button
                    key={index}
                    className={`carousel-circle ${reviewSection === index ? 'active' : ''}`}
                    onClick={() => setReviewSection(index)}
                    type="button"
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="terms-section">
                <label className="terms-checkbox">
                  <input 
                    type="checkbox" 
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    required
                  />
                  <span>
                    I agree to the Terms & Conditions and certify that all information 
                    provided is accurate and complete.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-actions">
            {currentStep > 1 && (
              <button type="button" className="btn-secondary" onClick={handlePrev}>
                ← Previous
              </button>
            )}
            
            {currentStep < 5 && (
              <button type="button" className="btn-primary" onClick={handleNext}>
                Next →
              </button>
            )}
            
            {currentStep === 5 && (
              <button type="submit" className="btn-submit">
                Submit Application
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverForm;
