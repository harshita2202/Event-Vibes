import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';
import logo from '../assets/bg.png';
import defaultAvatar from '../assets/profile.png'; // ✅ default fallback profile image
import { FaBell } from 'react-icons/fa';            // ✅ Notification bell icon
import axios from '../utils/axiosInstance';         // ✅ API call for notifications

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false); // ✅ toggle dropdown
  const [notifications, setNotifications] = useState([]);            // ✅ fetched data

  const handleProfileClick = () => {
    if (user?.role === 'admin') {
      navigate('/admin/profile');
    } else if (user?.role === 'user') {
      navigate('/user/profile');
    } else {
      navigate('/profile');
    }
  };

  // ✅ Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (user) {
          const res = await axios.get('/notifications');
          setNotifications(res.data);
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    };

    fetchNotifications();
  }, [user]);

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Event Vibes" />
        <h2>Event Vibes</h2>
      </div>

      <nav className="navbar-actions">
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

        {/* ✅ Bell Icon with Dropdown */}
        {user && (
          <div className="navbar-notification-wrapper">
            <FaBell
              className="notification-bell"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            />
            {showNotifications && (
              <div className="notification-dropdown">
                {notifications.length === 0 ? (
                  <p>No notifications</p>
                ) : (
                  notifications.map((n, idx) => (
                    <div key={idx} className="notification-item">
                      {n.message}
                      <br />
                      <small>{new Date(n.createdAt).toLocaleString()}</small>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ✅ Profile Icon */}
        {user && (
          <div
            className="navbar-profile-pic"
            onClick={handleProfileClick}
            title="Profile"
          >
            <img
              src={
                user.profilePic && user.profilePic.trim() !== ''
                  ? user.profilePic
                  : defaultAvatar
              }
              alt="Profile"
            />
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
