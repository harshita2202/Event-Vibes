import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import Navbar from './Navbar';
import './UserProfile.css';
import { useAuth } from '../contexts/AuthContext';
import defaultAvatar from '../assets/profile.png';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const UserProfile = () => {
  const { user } = useAuth();
  const [media, setMedia] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [name, setName] = useState(user.name);
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [showPicUpload, setShowPicUpload] = useState(false);
  const [newPic, setNewPic] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);

  const profilePic = user?.profilePic && user.profilePic.trim() !== '' ? user.profilePic : defaultAvatar;

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
    if (!newPic) return alert('Please choose a file');
    const formData = new FormData();
    formData.append('file', newPic);
    try {
      setUploading(true);
      await axios.put('/users/update-profile-pic', formData);
      window.location.reload();
    } catch (err) {
      alert('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePic = async () => {
    const confirm = window.confirm('Are you sure you want to delete your profile picture?');
    if (!confirm) return;

    try {
      await axios.put('/users/delete-profile-pic');
      window.location.reload();
    } catch (err) {
      alert('Failed to delete profile picture');
    }
  };

  const handleLike = async (mediaId) => {
    try {
      const res = await axios.post(`/media/${mediaId}/like`);
      setMedia((prev) =>
        prev.map((m) =>
          m._id === mediaId
            ? {
                ...m,
                likes: res.data.likesCount
                  ? [...(m.likes || []), user._id]
                  : m.likes.filter((id) => id !== user._id),
              }
            : m
        )
      );
    } catch (err) {
      console.error('Error liking media:', err);
    }
  };

  const handleDelete = async (mediaId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this media?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`/media/${mediaId}`);
      setMedia((prev) => prev.filter((m) => m._id !== mediaId));
      if (previewMedia?._id === mediaId) setPreviewMedia(null);
    } catch (err) {
      alert('Failed to delete media');
    }
  };

  return (
    <div className="group/design-root">
      <Navbar />
      <div className="profile-container">
        <div className="icon-bar">
          <button className="settings-icon" onClick={() => setShowSettings(!showSettings)} title="Edit profile">⚙️</button>
        </div>

        {showSettings && (
          <div className="overlay-form">
            <div className="edit-section">
              <label>Change Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
              <button className="green-btn" onClick={handleNameUpdate}>Update Name</button>
            </div>
            <div className="edit-section">
              <label>Change Password</label>
              <input type="password" placeholder="Current password" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} />
              <input type="password" placeholder="New password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
              <button className="green-btn" onClick={handlePasswordUpdate}>Update Password</button>
            </div>
            <button className="red-btn" onClick={() => setShowSettings(false)}>Cancel</button>
          </div>
        )}

        <div className="profile-header-row">
          <div className="profile-pic-wrapper-large" onClick={() => { if (!showPicUpload) window.open(profilePic, '_blank'); }}>
            <img
              src={profilePic}
              alt="Profile"
              className="profile-pic"
              onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar; }}
            />
            <div className="plus-icon" onClick={(e) => { e.stopPropagation(); setShowPicUpload(!showPicUpload); }} title="Change Photo">+</div>
            {showPicUpload && (
              <div className="pic-upload-inline">
                <input type="file" accept="image/*" onChange={(e) => setNewPic(e.target.files[0])} />
                <div className="btn-row">
                  <button className="green-btn" onClick={handlePicUpload}>Upload</button>
                  <button className="red-btn" onClick={handleDeletePic}>Delete</button>
                </div>
                {uploading && <div className="uploading-text">Uploading...</div>}
              </div>
            )}
          </div>

          <div className="profile-info">
            <h2>{user.name}</h2>
            <p className="subtitle">Student at JKLU</p>
          </div>
        </div>

        <div className="media-section">
          <h3>Your Posts</h3>
          <div className="media-grid">
            {media.length > 0 ? (
              media.map((item) => {
                const isLiked = item.likes?.includes(user._id);
                return (
                  <div key={item._id} className="media-card" onClick={() => setPreviewMedia(item)}>
                    {item.mediaType === 'image' ? (
                      <img src={item.url} alt={item.caption || 'Media'} />
                    ) : (
                      <video src={item.url} />
                    )}
                    <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}>🗑️</button>
                    <div className="like-section" onClick={(e) => { e.stopPropagation(); handleLike(item._id); }}>
                      {isLiked ? <FaHeart className="like-icon liked" /> : <FaRegHeart className="like-icon" />}
                      <span className="like-count">{item.likes?.length || 0}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No media uploaded yet.</p>
            )}
          </div>
        </div>
      </div>

      {previewMedia && (
        <div className="preview-overlay" onClick={() => setPreviewMedia(null)}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setPreviewMedia(null)}>×</button>
            {previewMedia.mediaType === 'image' ? (
              <img src={previewMedia.url} alt="Preview" />
            ) : (
              <video src={previewMedia.url} controls />
            )}
            <div className="preview-details">
              {previewMedia.caption && <p className="caption">{previewMedia.caption}</p>}
              <p className="like-count-preview">{previewMedia.likes?.length || 0} Likes</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
