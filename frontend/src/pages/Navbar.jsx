import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import './Navbar.css';
import logo from '../assets/bg.png'; 

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth(); 

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Event Vibes" />
        <h2>Event Vibes</h2>
      </div>

      <nav className="navbar-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>

        {user?.role === 'admin' && (
          <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
            Folders
          </Link>
        )}

        {user?.role === 'user' && (
          <Link to="/user" className={location.pathname === '/user' ? 'active' : ''}>
            Folders
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
