import React from 'react';
import '../../styles/abouthome.css';
import angkas3 from '../../assets/image/angkas3.jpg';

const AboutHome = () => {
  return (
    <div id="about" className="about-container">
      <h1 className="about-title">
        About <span className="about-highlight">E-Sakay</span>
      </h1>

      <div className="about-content">
        {/* Left Section - Image */}
        <div className="about-left">
          <div className="about-image-circle">
            <img 
              src={angkas3} 
              alt="E-Sakay Rider" 
              className="about-image"
            />
          </div>
        </div>

        {/* Right Section - Text and Features */}
        <div className="about-right">
          <p className="about-description">
            E-Sakay is ESSU's premier campus transport solution, connecting students and staff with reliable drivers for safe, affordable rides.
          </p>

          <div className="features-list">
            {/* Feature 1 */}
            <div className="feature-item">
              <div className="feature-check">✓</div>
              <div className="feature-content">
                <h3 className="feature-title">Verified Drivers</h3>
                <p className="feature-text">
                  All drivers are verified ESSU community members with proper documentation.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="feature-item">
              <div className="feature-check">✓</div>
              <div className="feature-content">
                <h3 className="feature-title">Quick Pickup</h3>
                <p className="feature-text">
                  Average pickup time of just 3 minutes within campus grounds.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="feature-item">
              <div className="feature-check">✓</div>
              <div className="feature-content">
                <h3 className="feature-title">Affordable Rates</h3>
                <p className="feature-text">
                  Student-friendly pricing starting at just ₱15 per ride.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutHome;
