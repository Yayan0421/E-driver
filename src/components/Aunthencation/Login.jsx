import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import '../../styles/login.css';
import logo from '../../assets/image/logo.jpg';
import Swal from 'sweetalert2';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      try {
        const res = await api.login(formData);
        console.log('Login response:', res);
        if (res && res.token) {
          api.saveAuth(res.user, res.token);
          const name = res.user?.name || res.user?.fullName || res.user?.full_name || res.user?.username || 'User';
          await Swal.fire({
            title: `Welcome, ${name}`,
            text: 'You have successfully signed in.',
            icon: 'success',
            confirmButtonText: 'Continue'
          });
          navigate('/dashboard');
        } else if (res && res.error) {
          const msgRaw = String(res.error || res.message || '');
          const msg = msgRaw.toLowerCase();
          if (msg.includes('not found') || msg.includes('no user') || msg.includes('user not')) {
            Swal.fire({ title: 'No user found', text: 'Please sign up first.', icon: 'info' });
          } else if (msg.includes('incorrect') || msg.includes('password')) {
            Swal.fire({ title: 'Incorrect email or password', text: 'Please check your credentials.', icon: 'error' });
          } else {
            Swal.fire({ title: 'Login failed', text: String(res.error || res.message) || 'No token returned', icon: 'error' });
          }
        } else {
          Swal.fire({ title: 'Login failed', text: 'Unexpected response from server (no token). Check console for response.', icon: 'error' });
        }
      } catch (err) {
        console.error(err);
        Swal.fire({ title: 'Login failed', text: 'An error occurred. Check console for details.', icon: 'error' });
      }
    })();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Left Section - Branding */}
        <div className="login-left">
          <div className="login-branding">
            <img src={logo} alt="E-Sakay Logo" className="login-logo" />
            <h1 className="login-brand-name">E-Sakay</h1>
            <p className="login-tagline">Safe, Fast & Reliable Rides</p>
          </div>
          <div className="login-features">
            <div className="feature">✓ Affordable rates</div>
            <div className="feature">✓ Verified drivers</div>
            <div className="feature">✓ Quick pickup</div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="login-right">
          <div className="login-form-wrapper">
            <button className="back-btn" onClick={() => navigate('/')}>
              ← Back
            </button>
            <h2 className="login-form-title">Welcome Back</h2>
            <p className="login-form-subtitle">Sign in to your account</p>

            <form className="login-form" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="form-group">
                <label htmlFor="email">Email or Username</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="/" className="forgot-password">Forgot password?</Link>
              </div>

              {/* Login Button */}
              <button type="submit" className="login-btn">Sign In</button>
            </form>

            {/* Sign Up Link */}
            <div className="login-footer">
              <p>Don't have an account? <Link to="/signup" className="signup-link">Sign up here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
