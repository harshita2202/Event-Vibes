import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import Navbar from './Navbar';
import './UserProfile.css';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [media, setMedia] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [name, setName] = useState(user.name);
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [showPicOptions, setShowPicOptions] = useState(false);
  const [newPic, setNewPic] = useState(null);

  useEffect(() => {
    const fetchUserMedia = async () => {
      try {
        const res = await axios.get('/media/user/me');
        setMedia(res.data);
      } catch (err) {
        console.error('Error fetching user media:', err);
      }
    };
    fetchUserMedia();
  }, []);

  const handleNameUpdate = async () => {
    try {
      await axios.put('/users/update-name', { name });
      const updatedUser = { ...user, name };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.location.reload();
    } catch {
      alert('Failed to update name');
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      await axios.put('/users/update-password', {
        currentPassword: oldPwd,
        newPassword: newPwd,
      });
      alert('Password updated');
      setOldPwd('');
      setNewPwd('');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update password');
    }
  };

  const handlePicUpload = async () => {
    if (!newPic) return alert("Please choose a file");

    const formData = new FormData();
    formData.append("file", newPic);

    try {
      const res = await axios.put("/users/update-profile-pic", formData);
      const updatedUser = { ...user, profilePic: res.data.profilePic };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.location.reload();
    } catch (err) {
      alert("Failed to upload profile picture");
    }
  };

  return (
    <div className="group/design-root">
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          {/* Profile Picture Wrapper */}
          <div
            className="profile-pic-wrapper"
            onClick={() => setShowPicOptions(!showPicOptions)}
          >
            <img
              src={user.profilePic || "https://res.cloudinary.com/demo/image/upload/v1710000000/default-avatar.jpg"}
              alt="Profile"
              className="profile-pic"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://res.cloudinary.com/demo/image/upload/v1710000000/default-avatar.jpg";
              }}
            />
          </div>

          {/* Profile Picture Options */}
          {showPicOptions && (
            <div className="pic-options">
              <button onClick={() => window.open(user.profilePic, "_blank")}>
                View Full Size
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewPic(e.target.files[0])}
              />
              <button onClick={handlePicUpload}>Upload New Picture</button>
              <button onClick={() => setShowPicOptions(false)}>Cancel</button>
            </div>
          )}

          <h2>{user.name}</h2>
          <p className="subtitle">Student at JKLU</p>

          {/* Settings Toggle */}
          <button
            className="settings-btn"
            onClick={() => setShowSettings(!showSettings)}
          >
            Settings ⚙️
          </button>

          {/* Settings Panel */}
          {showSettings && (
            <div className="settings-dropdown">
              <div className="section">
                <label>Change Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
                <button onClick={handleNameUpdate}>Update</button>
              </div>

              <div className="section">
                <label>Change Password</label>
                <input
                  type="password"
                  placeholder="Current password"
                  value={oldPwd}
                  onChange={(e) => setOldPwd(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                />
                <button onClick={handlePasswordUpdate}>Update</button>
              </div>

              <button className="logout-btn" onClick={logout}>Logout</button>
            </div>
          )}
        </div>

        {/* Media Grid */}
        <div className="media-section">
          <h3>Your Posts</h3>
          <div className="media-grid">
            {media.length > 0 ? (
              media.map((item) => (
                <div key={item._id} className="media-card">
                  {item.mediaType === 'image' ? (
                    <img src={item.url} alt={item.caption || 'Media'} />
                  ) : (
                    <video src={item.url} controls />
                  )}
                </div>
              ))
            ) : (
              <p>No media uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
