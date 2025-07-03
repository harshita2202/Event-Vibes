import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import appIcon from '../assets/favicon.png';
import sabrang from '../assets/sabrang.jpeg'; // Optional: used for hero only

// 🖼️ Import unique folder images
import arambh from '../assets/arambh.jpeg';
import homePage from '../assets/homePage.jpeg';
import Freshers from '../assets/freshers.jpeg';
import techfest from '../assets/techfest.jpeg';
import republic from '../assets/republic.jpeg';

const Home = () => {
  const navigate = useNavigate();

  // 📦 Folder titles and their images
  const folders = [
    { title: "Aarambh", image: arambh },
    { title: "Sabrang", image: homePage },
    { title: "Freshers", image: Freshers },
    { title: "Tech Fest", image: techfest },
    { title: "Republic Day", image: republic },
  ];

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo-container">
          <img src={appIcon} alt="App Icon" className="app-icon" />
          <div className="logo">Event Vibes</div>
        </div>
        <button className="nav-btn" onClick={() => navigate('/login')}>
          Login / Register
        </button>
      </nav>

      <div
        className="home-image"
        style={{ backgroundImage: `url(${sabrang})` }}
      >
        <div className="center-content">
          <h1 className="main-title">Event Folders</h1>
        </div>
      </div>

      <div className="folder-section">
        {folders.map((folder, index) => (
          <div
            key={index}
            className="folder"
            style={{ backgroundImage: `url(${folder.image})` }}
          >
            <div className="folder-title">{folder.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
