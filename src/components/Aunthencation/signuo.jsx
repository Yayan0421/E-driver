import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../styles/signup.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/image/logo.jpg';
import Swal from 'sweetalert2';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    (async () => {
      try {
        // Use the main signup flow (API module)
        const payload = { name: formData.fullName, email: formData.email, password: formData.password, phone: formData.phone, role: 'driver' };
        const res = await api.signup(payload);
        
        if (res && res.token && res.user) {
          // Save auth data including user with email to localStorage
          api.saveAuth(res.user, res.token);
          
          // Show success and redirect to driver form
          await Swal.fire({
            title: "You're now registered",
            text: "Registration saved.",
            icon: 'success',
            confirmButtonText: 'Continue'
          });
          navigate('/driver-application');
        } else if (res && res.error) {
          Swal.fire({
            title: 'Signup failed',
            text: res.error || 'An error occurred',
            icon: 'error'
          });
        } else {
          Swal.fire({
            title: 'Signup failed',
            text: 'Unexpected response from server',
            icon: 'error'
          });
        }
      } catch (err) {
        console.error('Signup error:', err);
        Swal.fire({
          title: 'Signup failed',
          text: 'An error occurred. Check console for details.',
          icon: 'error'
        });
      }
    })();
  };

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        {/* Left Section - Branding */}
        <div className="signup-left">
          <div className="signup-branding">
            <img src={logo} alt="E-Sakay Logo" className="signup-logo" />
            <h1 className="signup-brand-name">E-Sakay</h1>
            <p className="signup-tagline">Join Our Community</p>
          </div>
          <div className="signup-benefits">
            <h3>Why Be a Driver?</h3>
            <div className="benefit-item">✓ Easy to use platform</div>
            <div className="benefit-item">✓ Secure transactions</div>
            <div className="benefit-item">✓ 24/7 support</div>
            <div className="benefit-item">✓ Great earnings potential</div>
          </div>
        </div>

        {/* Right Section - Sign Up Form */}
        <div className="signup-right">
          <div className="signup-form-wrapper">
            <button className="back-btn" onClick={() => navigate('/')}>
              ← Back
            </button>
            
            <h2 className="signup-form-title">Driver Registration</h2>
            <p className="signup-form-subtitle">Create your driver account</p>

            <form className="signup-form" onSubmit={handleSubmit}>
              {/* Full Name Input */}
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email Input */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
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

              {/* Phone Input */}
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
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

              {/* Password Input */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Terms & Conditions */}
              <label className="terms-checkbox">
                <input type="checkbox" required />
                <span>I agree to the Terms & Conditions</span>
              </label>

              {/* Sign Up Button */}
              <button type="submit" className="signup-btn">Create Account</button>
            </form>

            {/* Login Link */}
            <div className="signup-footer">
              <p>Already have an account? <Link to="/login" className="login-link">Sign in here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
