import React from 'react';
import '../../styles/footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          © {currentYear} Charide. All rights reserved. ESSU Campus Transport
        </p>
      </div>
    </footer>
  );
};

export default Footer;
