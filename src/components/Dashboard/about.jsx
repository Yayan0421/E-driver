import React, { useState } from 'react';
import SideNavbar from './SideNavbar';
import '../../styles/about.css';

const About = () => {
  const [userName] = useState('Kim Ryan');
  const [userRole] = useState('Driver');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const teamMembers = [
    {
      id: 1,
      name: 'Maria Santos',
      role: 'CEO & Founder',
      bio: 'Visionary leader with 15 years of experience in transportation and technology.',
      avatar: '👨‍💼'
    },
    {
      id: 2,
      name: 'Juan Dela Cruz',
      role: 'CTO & Co-Founder',
      bio: 'Full-stack developer passionate about creating innovative mobility solutions.',
      avatar: '👨‍💻'
    },
    {
      id: 3,
      name: 'Anna Reyes',
      role: 'Head of Operations',
      bio: 'Strategic thinker focused on driver success and customer satisfaction.',
      avatar: '👩‍💼'
    },
    {
      id: 4,
      name: 'Carlos Manuel',
      role: 'Community Manager',
      bio: 'Community advocate dedicated to supporting our driver network.',
      avatar: '👨‍🤝‍👨'
    }
  ];

  const features = [
    {
      icon: '📱',
      title: 'Mobile First',
      description: 'Easy-to-use mobile app available on iOS and Android devices'
    },
    {
      icon: '💰',
      title: 'Fair Earnings',
      description: 'Transparent pricing with no hidden fees, weekly payouts'
    },
    {
      icon: '🛡️',
      title: 'Safety First',
      description: 'Driver safety assured with 24/7 support and insurance coverage'
    },
    {
      icon: '⭐',
      title: 'Quality Service',
      description: 'Premium rides with professional and courteous drivers'
    },
    {
      icon: '📊',
      title: 'Analytics',
      description: 'Real-time earnings tracking and detailed ride analytics'
    },
    {
      icon: '🌍',
      title: 'Expanding Network',
      description: 'Growing across Southeast Asia with thousands of drivers'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Founded',
      description: 'Charide was founded with a mission to revolutionize ride-sharing in the Philippines'
    },
    {
      year: '2021',
      title: '10K Drivers',
      description: 'Reached 10,000 active drivers on the platform'
    },
    {
      year: '2022',
      title: 'Regional Expansion',
      description: 'Expanded operations to Thailand and Vietnam'
    },
    {
      year: '2023',
      title: '1M Rides',
      description: 'Completed 1 million successful rides on the platform'
    },
    {
      year: '2024',
      title: 'AI Integration',
      description: 'Launched AI-powered route optimization for drivers'
    },
    {
      year: '2025',
      title: 'Next Gen',
      description: 'Introducing new driver benefits and premium tier features'
    }
  ];

  const values = [
    {
      icon: '🤝',
      title: 'Trust & Reliability',
      text: 'We build long-term relationships with our drivers and passengers through consistent, reliable service.'
    },
    {
      icon: '💡',
      title: 'Innovation',
      text: 'We continuously improve our platform with cutting-edge technology and driver feedback.'
    },
    {
      icon: '🌱',
      title: 'Sustainability',
      text: 'We reduce carbon footprint and promote eco-friendly transportation options.'
    },
    {
      icon: '📈',
      title: 'Growth',
      text: 'We empower drivers to grow their income and build successful livelihoods.'
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Mobile Header with Hamburger */}
      <div className="dashboard-mobile-header">
        <button className="dashboard-hamburger" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          ☰
        </button>
        <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#111827', flex: 1, marginLeft: '0.5rem' }}>About Us</h2>
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
      
      <div className={`about-wrapper ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <div className="about-container">
          {/* Hero Section */}
          <div className="hero-section">
            <h1>About Charide</h1>
            <p>Revolutionizing ride-sharing in Southeast Asia</p>
            <div className="hero-badge">
              <span className="badge-icon">🌟</span>
              <span>Join thousands of drivers earning with Charide</span>
            </div>
          </div>

          {/* Mission & Vision */}
          <section className="mission-section">
            <div className="mission-card">
              <div className="mission-icon">🎯</div>
              <h2>Our Mission</h2>
              <p>
                To provide a safe, reliable, and rewarding platform that empowers drivers to build sustainable livelihoods 
                while delivering exceptional service to passengers across Southeast Asia.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-icon">🚀</div>
              <h2>Our Vision</h2>
              <p>
                To become the leading ride-sharing platform in Southeast Asia, known for driver excellence, 
                user satisfaction, and innovative technology solutions.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-icon">💚</div>
              <h2>Our Commitment</h2>
              <p>
                We are committed to fair earnings, driver safety, continuous innovation, and building 
                a sustainable transportation ecosystem for our communities.
              </p>
            </div>
          </section>

          {/* Statistics */}
          <section className="stats-section">
            <h2>By The Numbers</h2>
            <div className="stats-grid">
              <div className="stat-box">
                <h3>50K+</h3>
                <p>Active Drivers</p>
              </div>
              <div className="stat-box">
                <h3>5M+</h3>
                <p>Rides Completed</p>
              </div>
              <div className="stat-box">
                <h3>4.8★</h3>
                <p>Average Rating</p>
              </div>
              <div className="stat-box">
                <h3>6</h3>
                <p>Countries Operating</p>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="features-section">
            <h2>Why Choose Charide</h2>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Values */}
          <section className="values-section">
            <h2>Our Core Values</h2>
            <div className="values-grid">
              {values.map((value, index) => (
                <div key={index} className="value-card">
                  <div className="value-icon">{value.icon}</div>
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section className="timeline-section">
            <h2>Our Journey</h2>
            <div className="timeline">
              {milestones.map((milestone, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker">
                    <span className="timeline-year">{milestone.year}</span>
                  </div>
                  <div className="timeline-content">
                    <h3>{milestone.title}</h3>
                    <p>{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Team */}
          <section className="team-section">
            <h2>Our Leadership Team</h2>
            <p className="team-subtitle">
              Meet the passionate people behind Charide
            </p>
            <div className="team-grid">
              {teamMembers.map((member) => (
                <div key={member.id} className="team-card">
                  <div className="team-avatar">{member.avatar}</div>
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="contact-section">
            <h2>Get In Touch</h2>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <div>
                  <h3>Email</h3>
                  <a href="mailto:info@charide.com">info@charide.com</a>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <div>
                  <h3>Phone</h3>
                  <a href="tel:+639123456789">(+63) 912-345-6789</a>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <h3>Address</h3>
                  <p>123 Tech Hub, Manila, Philippines</p>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">🌐</span>
                <div>
                  <h3>Website</h3>
                  <a href="https://www.charide.com" target="_blank" rel="noopener noreferrer">
                    www.charide.com
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Social Links */}
          <section className="social-section">
            <h2>Follow Us</h2>
            <div className="social-links">
              <a href="#" className="social-link">
                <span className="social-icon">📘</span>
                <span>Facebook</span>
              </a>
              <a href="#" className="social-link">
                <span className="social-icon">🐦</span>
                <span>Twitter</span>
              </a>
              <a href="#" className="social-link">
                <span className="social-icon">📷</span>
                <span>Instagram</span>
              </a>
              <a href="#" className="social-link">
                <span className="social-icon">💼</span>
                <span>LinkedIn</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
