import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';
import logo from '../assets/favicon.png';
import defaultAvatar from '../assets/profile.png';
import { FaBell, FaPowerOff } from 'react-icons/fa'; // ✅ Added FaPowerOff
import axios from '../utils/axiosInstance';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleProfileClick = () => {
    if (user?.role === 'admin') {
      navigate('/admin/profile');
    } else if (user?.role === 'user') {
      navigate('/user/profile');
    } else {
      navigate('/profile');
    }
  };

  const handleBellClick = async () => {
    const toggled = !showNotifications;
    setShowNotifications(toggled);

    if (toggled) {
      try {
        await axios.put('/notifications/read-all');
        setUnreadCount(0);
      } catch (err) {
        console.error("Failed to mark notifications as read");
      }
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const res = await axios.get('/notifications');
        setNotifications(res.data);

        const unread = res.data.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error('Failed to load notifications');
      }
    };

    fetchNotifications();
  }, [user]);

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <img
          src={logo}
          alt="Event Vibes Logo"
          className="logo-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultAvatar;
          }}
          style={{ height: '35px', width: '35px', borderRadius: '5px', marginRight: '8px' }}
        />
        <h2>Event Vibes</h2>
      </div>

      <nav className="navbar-actions">
        {/* ✅ Replaced 'Home' text with power icon */}
        <Link to="/" className={location.pathname === '/' ? 'active' : ''} title="Home">
          <FaPowerOff size={18} />
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
          <div className="navbar-notification-wrapper">
            <div className="bell-container" onClick={handleBellClick}>
              <FaBell className="notification-bell" title="Notifications" />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </div>

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
