import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import bgImage from '../assets/bg.png';
import appIcon from '../assets/eventLogo.png'; 

const Home = () => {
  const navigate = useNavigate();

  const folderTitles = [
    "Aarambh",
    "Sabrang",
    "Freshers",
    "Tech Fest",
    "Republic Day",
  ];

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo-container">
          <img src={appIcon} alt="App Icon" className="app-icon" />
          <div className="logo">Event Vibes</div>
        </div>
        <button className="nav-btn" onClick={() => navigate('/login')}>
          Login
        </button>
      </nav>

      <div
        className="home-image"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="center-content">
          <h1 className="main-title">Event Folders</h1>
        </div>
      </div>

      <div className="folder-section">
        {folderTitles.map((title, index) => (
          <div
            key={index}
            className="folder"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <div className="folder-title">{title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
