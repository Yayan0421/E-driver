import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/home.css';
import angkas1 from '../../assets/image/angkas1.jpg';
import angkas2 from '../../assets/image/angkas2.jpg';
import angkas3 from '../../assets/image/angkas3.jpg';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div id="home" className="home-container">
      <div className="home-content">
        {/* Left Content */}
        <div className="home-left">
          <h1>Safe, Fast & Reliable</h1>
          <h1>Motorcycle Rides</h1>
          
          <h2>Your Everyday Ride Partner</h2>
          
          <p className="home-description">
            E-Sakay is a motorcycle ride-hailing service designed to get you to your destination quickly and safely. Avoid traffic, save time, and enjoy affordable rides with trained riders. Book anytime, anywhere!
          </p>
          
          <div className="home-buttons">
            <button className="btn btn-primary" onClick={() => navigate('/signup')}>Sign Up</button>
            <button className="btn btn-secondary" onClick={() => navigate('/login')}>Log In</button>
          </div>
        </div>
        
        {/* Right Illustration Cards */}
        <div className="home-right">
          {/* Card 1 - Rider on bike */}
          <div className="card">  <img src={angkas1} alt="Rider on bike" className="angkas" /></div>
          
          {/* Card 2 - Delivery person */}
          <div className="card">  <img src={angkas2} alt="Delivery person" className="angkas" /></div>
          
          {/* Card 3 - Rider with package */}
          <div className="card">  <img src={angkas3} alt="Rider with package" className="angkas" /></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
