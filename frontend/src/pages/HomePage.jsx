import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import bgImage from '../assets/background.png';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div
        className="home-image"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="home-overlay">
          <h1 className="main-title">EVENT VIBES</h1>
          <p className="subtitle">
            Browse event folders. Log in to view content and upload media.
          </p>
          <button className="login-btn" onClick={() => navigate('/login')}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;