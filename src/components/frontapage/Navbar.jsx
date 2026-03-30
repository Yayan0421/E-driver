import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/navbar.css';
import logo from '../../assets/image/logo.jpg';

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <img src={logo} alt="E-Sakay Logo" className="logo-img" />
          <span className="logo-text">E-Sakay</span>
        </div>

        {/* Navigation Links */}
        <ul className="nav-menu">
          <li className="nav-item">
            <a href="#home" className="nav-link">Home</a>
          </li>
          <li className="nav-item">
            <a href="#about" className="nav-link">About</a>
          </li>
          <li className="nav-item">
            <a href="#services" className="nav-link">Services</a>
          </li>
          <li className="nav-item">
            <a href="#contact" className="nav-link">Contact</a>
          </li>
        </ul>

        {/* Driver Portal Button */}
        <button className="driver-portal-btn" onClick={() => navigate('/signup')}>
          <span className="btn-icon">🚙</span> Driver Portal
        </button>
      </div>
    </nav>
  );
}
