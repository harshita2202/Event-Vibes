import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import bgImage from '../assets/background.png';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo">Event Vibes</div>
        <button className="nav-btn" onClick={() => navigate('/login')}>
          Login/Register
        </button>
      </nav>

      <div
        className="home-image"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="center-content">
          <h1 className="main-title">Event Folders</h1>
          <button className="login-btn" onClick={() => navigate('/login')}>
            View Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
