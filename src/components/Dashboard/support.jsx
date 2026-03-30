import React, { useState, useEffect } from 'react';
import SideNavbar from './SideNavbar';
import '../../styles/support.css';
import api from '../../api';

const Support = () => {
  const [userName] = useState('Kim Ryan');
  const [userRole] = useState('Driver');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [supportTickets, setSupportTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Get driver info from localStorage
  useEffect(() => {
    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        const name = user.full_name || user.fullName || user.name || 'Driver';
        const email = user.email || user.Email || '';
        setContactForm(prev => ({
          ...prev,
          name,
          email
        }));
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);

  // Fetch support tickets from Supabase
  useEffect(() => {
    fetchSupportTickets();
  }, []);

  const fetchSupportTickets = async () => {
    try {
      setLoadingTickets(true);
      const tickets = await api.getSupportTickets();
      setSupportTickets(Array.isArray(tickets) ? tickets : []);
      console.log('Fetched support tickets:', tickets);
    } catch (err) {
      console.error('Error fetching support tickets:', err);
      setSupportTickets([]);
    } finally {
      setLoadingTickets(false);
    }
  };

  const faqs = [
    {
      id: 1,
      question: 'How do I update my driver information?',
      answer: 'You can update your driver information in the Profile section. Go to Dashboard > Profile and click "Edit Profile" to make changes to your personal or vehicle details.'
    },
    {
      id: 2,
      question: 'How are my earnings calculated?',
      answer: 'Your earnings are calculated based on the distance traveled, time spent on the route, and any applicable bonuses or deductions. You can view detailed breakdowns in the Transaction section.'
    },
    {
      id: 3,
      question: 'When will I receive my payment?',
      answer: 'Payments are processed weekly on Fridays. The earnings from Monday to Sunday are paid out the following Friday. You can track your pending payments in the Transaction section.'
    },
    {
      id: 4,
      question: 'How do I cancel a ride?',
      answer: 'If you need to cancel an accepted ride, you can do so through the active ride screen. Note that frequent cancellations may affect your driver rating and eligibility for bonuses.'
    },
    {
      id: 5,
      question: 'What should I do if a passenger complains?',
      answer: 'If you receive a complaint, you will be notified immediately. You can respond to the complaint within 24 hours through the Messages section. Our support team will review and help resolve the issue.'
    },
    {
      id: 6,
      question: 'How can I improve my driver rating?',
      answer: 'To improve your rating: maintain a clean vehicle, arrive on time, follow traffic rules, be courteous to passengers, and handle complaints professionally. A good rating keeps you eligible for premium rides and bonuses.'
    },
    {
      id: 7,
      question: 'Is there a referral program?',
      answer: 'Yes! You can earn bonuses by referring new drivers. Each successful referral gives you ₱500 bonus. Share your referral code with friends and earn rewards for every driver they recruit.'
    },
    {
      id: 8,
      question: 'What documents do I need to keep updated?',
      answer: 'Keep your driver\'s license and vehicle registration updated at all times. Your vehicle insurance must be current, and you should have a copy of your vehicle\'s inspection certificate.'
    }
  ];

  const supportCategories = [
    { id: 'general', label: 'General Inquiries' },
    { id: 'payment', label: 'Payment & Earnings' },
    { id: 'technical', label: 'Technical Issues' },
    { id: 'complaint', label: 'Report a Problem' },
    { id: 'account', label: 'Account Issues' }
  ];

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.subject && contactForm.message) {
      try {
        setSubmitting(true);
        const res = await api.createSupportTicket(
          contactForm.name,
          contactForm.email,
          contactForm.subject,
          contactForm.category,
          contactForm.message
        );

        if (res.success || res.ticket) {
          setSubmitted(true);
          setContactForm(prev => ({
            ...prev,
            subject: '',
            category: 'general',
            message: ''
          }));
          // Refresh tickets list
          await fetchSupportTickets();
          setTimeout(() => setSubmitted(false), 5000);
        } else {
          console.error('Failed to submit support ticket:', res);
        }
      } catch (err) {
        console.error('Error submitting support ticket:', err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <SideNavbar 
        userName={userName} 
        userRole={userRole}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className={`support-wrapper ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <div className="support-container">
          {/* Header */}
          <div className="support-header">
            <h1>Support & Help Center</h1>
            <p>Get assistance with your driver account and app questions</p>
          </div>

          {/* Quick Contact Cards */}
          <div className="quick-contact-cards">
            <div className="contact-card">
              <div className="card-icon">☎️</div>
              <h3>Call Us</h3>
              <p className="card-text">Available 24/7</p>
              <a href="tel:+639123456789" className="card-link">+63 (912) 345-6789</a>
            </div>

            <div className="contact-card">
              <div className="card-icon">💬</div>
              <h3>Live Chat</h3>
              <p className="card-text">Avg. 2 min response</p>
              <button className="card-link btn-link">Start Chat</button>
            </div>

            <div className="contact-card">
              <div className="card-icon">📧</div>
              <h3>Email Us</h3>
              <p className="card-text">Respond within 24h</p>
              <a href="mailto:support@charide.com" className="card-link">support@charide.com</a>
            </div>

            <div className="contact-card">
              <div className="card-icon">⏱️</div>
              <h3>Response Time</h3>
              <p className="card-text">Our average</p>
              <span className="card-link stat">2 hours</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="support-tabs">
            <button 
              className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              📋 FAQs
            </button>
            <button 
              className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              ✉️ Contact Us
            </button>
            <button 
              className={`tab-btn ${activeTab === 'tickets' ? 'active' : ''}`}
              onClick={() => setActiveTab('tickets')}
            >
              🎟️ Support Tickets
            </button>
          </div>

          {/* FAQ Section */}
          {activeTab === 'faq' && (
            <div className="support-section">
              <div className="section-header">
                <h2>Frequently Asked Questions</h2>
                <p>Find answers to common questions about your driver account</p>
              </div>

              <div className="faq-items">
                {faqs.map((faq) => (
                  <div key={faq.id} className="faq-item">
                    <button 
                      className="faq-question"
                      onClick={() => toggleFAQ(faq.id)}
                    >
                      <span className="faq-number">{faq.id}</span>
                      <span className="faq-text">{faq.question}</span>
                      <span className={`faq-icon ${expandedFAQ === faq.id ? 'expanded' : ''}`}>
                        ▼
                      </span>
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Form Section */}
          {activeTab === 'contact' && (
            <div className="support-section">
              <div className="section-header">
                <h2>Contact Support Team</h2>
                <p>Can't find your answer? Send us a message and we'll get back to you shortly.</p>
              </div>

              {submitted && (
                <div className="success-message">
                  <span className="icon">✓</span>
                  <div>
                    <h4>Message Sent Successfully!</h4>
                    <p>Our support team will respond within 24 hours. You'll receive updates on your email.</p>
                  </div>
                </div>
              )}

              <form className="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <input 
                      type="text" 
                      id="subject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleContactChange}
                      placeholder="What is this about?"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select 
                      id="category"
                      name="category"
                      value={contactForm.category}
                      onChange={handleContactChange}
                    >
                      {supportCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="message">Message *</label>
                  <textarea 
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    placeholder="Please describe your issue in detail..."
                    rows="6"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          )}

          {/* Support Tickets Section */}
          {activeTab === 'tickets' && (
            <div className="support-section">
              <div className="section-header">
                <h2>Your Support Tickets</h2>
                <p>Track and manage your support requests</p>
              </div>

              <div className="tickets-list">
                {loadingTickets ? (
                  <div className="loading-message">
                    <p>Loading your support tickets...</p>
                  </div>
                ) : supportTickets.length > 0 ? (
                  supportTickets.map((ticket) => (
                    <div key={ticket.id} className="ticket-item">
                      <div className="ticket-header">
                        <div className="ticket-info">
                          <span className="ticket-id">#{ticket.id?.slice(0, 8) || 'NEW'}</span>
                          <h4>{ticket.subject}</h4>
                          <p className="ticket-date">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="ticket-meta">
                          <span className={`ticket-status ${ticket.status}`}>
                            {ticket.status === 'resolved' ? '✓ ' : ticket.status === 'in-progress' ? '⏳ ' : '⏳ '}
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                          </span>
                          <span className="ticket-category">
                            {supportCategories.find(c => c.id === ticket.category)?.label || ticket.category}
                          </span>
                        </div>
                      </div>
                      <div className="ticket-message">
                        <p className="message-label">Your Message:</p>
                        <p className="message-text">{ticket.message}</p>
                      </div>
                      {ticket.response && (
                        <div className="ticket-response">
                          <p className="response-label">Support Response:</p>
                          <p className="response-text">{ticket.response}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-tickets">
                    <p>You don't have any support tickets yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Help Resources */}
          <div className="help-resources">
            <h3>Other Resources</h3>
            <div className="resources-grid">
              <a href="#" className="resource-card">
                <div className="resource-icon">📱</div>
                <h4>App Version Info</h4>
                <p>Check your app version and update</p>
              </a>
              <a href="#" className="resource-card">
                <div className="resource-icon">📜</div>
                <h4>Terms & Conditions</h4>
                <p>Review our driving guidelines</p>
              </a>
              <a href="#" className="resource-card">
                <div className="resource-icon">🔒</div>
                <h4>Privacy Policy</h4>
                <p>Learn how we protect your data</p>
              </a>
              <a href="#" className="resource-card">
                <div className="resource-icon">🎓</div>
                <h4>Driver Academy</h4>
                <p>Learn driving tips and best practices</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
