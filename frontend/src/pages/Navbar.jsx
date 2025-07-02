import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';
import logo from '../assets/bg.png';
import defaultAvatar from '../assets/profile.png'; // ✅ import default image

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ use context directly

  const handleProfileClick = () => {
    if (user?.role === 'admin') {
      navigate('/admin/profile');
    } else if (user?.role === 'user') {
      navigate('/user/profile');
    } else {
      navigate('/profile');
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Event Vibes" />
        <h2>Event Vibes</h2>
      </div>

      <nav className="navbar-actions">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Home
        </Link>

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

        {user && (
          <div
            className="navbar-profile-pic"
            onClick={handleProfileClick}
            title="Profile"
          >
            <img
              src={user.profilePic && user.profilePic.trim() !== '' ? user.profilePic : defaultAvatar}
              alt="Profile"
            />
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;