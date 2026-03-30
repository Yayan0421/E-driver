import React from 'react';
import '../../styles/oursvhome.css';

const OurServices = () => {
  const services = [
    {
      id: 1,
      icon: '🏍️',
      title: 'Motorcycle Ride',
      description: 'Fast and efficient single-passenger transport for quick trips around campus.',
      price: 'Starting ₱15'
    },
    {
      id: 2,
      icon: '🛺',
      title: 'Tricycle Ride',
      description: 'Comfortable rides for up to 3 passengers with luggage space.',
      price: 'Starting ₱25'
    },
    {
      id: 3,
      icon: '📅',
      title: 'Scheduled Pickup',
      description: 'Pre-book your ride for class schedules or important appointments.',
      price: 'Same rate'
    }
  ];

  return (
    <div id="services" className="services-container">
      <div className="services-header">
        <h1 className="services-title">
          Our <span className="services-highlight">Services</span>
        </h1>
        <p className="services-subtitle">Choose the ride that fits your needs</p>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <div className="service-icon">{service.icon}</div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
            <div className="service-price">{service.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurServices;
