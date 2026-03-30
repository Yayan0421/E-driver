import React from 'react';
import Navbar from '../components/frontapage/navbar';
import Home from '../components/frontapage/home';
import AboutHome from '../components/frontapage/abouthome';
import OurServices from '../components/frontapage/oursvhome';
import ContactUs from '../components/frontapage/contactus';
import Footer from '../components/frontapage/footer';

const FrontPage = () => {
  return (
    <div className="frontpage">
      <Navbar />
      <Home />
      <AboutHome />
      <OurServices />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default FrontPage;
