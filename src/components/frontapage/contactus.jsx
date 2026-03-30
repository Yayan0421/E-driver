import React, { useState } from 'react';
import '../../styles/contactus.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div id="contact" className="contact-container">
      {/* Header Section */}
      <div className="contact-header">
        <h1 className="contact-title">
          Contact <span className="contact-highlight">Us</span>
        </h1>
        <p className="contact-subtitle">Have questions? We're here to help</p>
      </div>

      {/* Main Content */}
      <div className="contact-content">
        {/* Left Section - Contact Info */}
        <div className="contact-left">
          {/* Location Card */}
          <div className="contact-card">
            <div className="contact-icon location-icon">📍</div>
            <h3 className="contact-card-title">Location</h3>
            <p className="contact-card-text">ESSU Main Campus, Borongan City</p>
          </div>

          {/* Phone Card */}
          <div className="contact-card">
            <div className="contact-icon phone-icon">📱</div>
            <h3 className="contact-card-title">Phone</h3>
            <p className="contact-card-text">+63 912 345 6789</p>
          </div>

          {/* Email Card */}
          <div className="contact-card">
            <div className="contact-icon email-icon">✉️</div>
            <h3 className="contact-card-title">Email</h3>
            <p className="contact-card-text">support@charide.ph</p>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div className="contact-right">
          <form className="contact-form" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Message Textarea */}
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="How can we help?"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
