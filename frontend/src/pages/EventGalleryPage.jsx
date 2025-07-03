import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import Navbar from './Navbar';
import './EventGalleryPage.css';
import UploadForm from './MediaPostPage';
import { useAuth } from '../contexts/AuthContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const EventGalleryPage = () => {
  const [mediaList, setMediaList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
  const { eventId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get(`/media/event/${eventId}`);
        setMediaList(res.data);
      } catch (err) {
        console.error('Failed to fetch media:', err);
      }
    };

    fetchMedia();
  }, [eventId]);

  const handlePreview = (media) => setPreviewMedia(media);
  const handleClosePreview = () => setPreviewMedia(null);

  const handleDelete = async (mediaId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this media?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/media/${mediaId}`);
      setMediaList((prev) => prev.filter((m) => m._id !== mediaId));
      if (previewMedia?._id === mediaId) setPreviewMedia(null);
    } catch (err) {
      console.error("Failed to delete media:", err);
    }
  };

  const handleLike = async (mediaId) => {
    try {
      const res = await axios.post(`/media/${mediaId}/like`);
      const { likedByUser } = res.data;
    
      setMediaList(prev =>
        prev.map(m => {
          if (m._id !== mediaId) return m;
        
          let updatedLikes;
          if (likedByUser) {
            updatedLikes = [...(m.likes || []), user._id]; // add like
          } else {
            updatedLikes = m.likes?.filter(id => id !== user._id); // remove like
          }
        
          return { ...m, likes: updatedLikes };
        })
      );
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };
  return (
    <div className="group/design-root">
      <Navbar />

      <div className={`gallery-container ${showForm ? 'form-open' : ''}`}>
        <div className="gallery-main">
          {!showForm && (
            <div className="upload-btn-wrapper">
              <button className="upload-btn" onClick={() => setShowForm(true)}>
                + Upload Media
              </button>
            </div>
          )}

          <h3>Media Gallery</h3>

          <div className="media-grid">
            {mediaList.length === 0 ? (
              <p className="no-media-msg">No media uploaded yet.</p>
            ) : (
              mediaList.map((media) => {
              const isLiked = media.likes?.includes(user?._id); // Check if current user liked it
              return (
                <div
                  key={media._id}
                  className="media-card"
                  onClick={() => handlePreview(media)}
                >
                  {media.mediaType === 'image' ? (
                    <img src={media.url} alt={media.caption || 'Media'} />
                  ) : (
                    <video src={media.url} />
                  )}

                  {(user?.role === "admin" || user?._id === media?.uploaderId?._id) && (
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(media._id);
                      }}
                    >
                      🗑️
                    </button>
                  )}

                  <div
                    className="like-section"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(media._id);
                    }}
                  >
                    {isLiked ? (
                      <FaHeart className="like-icon liked" />
                    ) : (
                      <FaRegHeart className="like-icon" />
                    )}
                    <span className="like-count">{media.likes?.length || 0}</span>
                  </div>
                </div>
              );
            })
            )}
          </div>
        </div>

        <div className={`side-form-panel ${showForm ? 'visible' : ''}`}>
          {showForm && (
            <UploadForm
              eventId={eventId}
              onClose={() => setShowForm(false)}
              onSuccess={async () => {
                setShowForm(false);
                setPreviewMedia(null);
                try {
                  const res = await axios.get(`/media/event/${eventId}`);
                  setMediaList(res.data);
                } catch (err) {
                  console.error('Failed to fetch media:', err);
                }
              }}
            />
          )}
        </div>
      </div>

      {previewMedia && (
        <div className="preview-overlay" onClick={handleClosePreview}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleClosePreview}>×</button>
            {previewMedia.mediaType === 'image' ? (
              <img src={previewMedia.url} alt="Preview" className="no-border-preview" />
            ) : (
              <video src={previewMedia.url} controls />
            )}
            <div className="preview-details">
              {previewMedia.caption && <p className="caption">{previewMedia.caption}</p>}
              {previewMedia.uploaderId?.name && (
                <p className="uploader">Uploaded by: {previewMedia.uploaderId.name}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventGalleryPage;
