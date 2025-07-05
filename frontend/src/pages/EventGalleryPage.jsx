import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import Navbar from './Navbar';
import './EventGalleryPage.css';
import UploadForm from './MediaPostPage';
import { useAuth } from '../contexts/AuthContext';
import { FaHeart, FaRegHeart, FaDownload } from 'react-icons/fa';
import CommentSection from './CommentSection'; // ✅ Added

const EventGalleryPage = () => {
  const [mediaList, setMediaList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
  const { eventId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    if (showForm) {
      document.body.classList.add('form-open');
    } else {
      document.body.classList.remove('form-open');
    }

    return () => {
      document.body.classList.remove('form-open');
    };
  }, [showForm]);

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
            updatedLikes = [...(m.likes || []), user._id];
          } else {
            updatedLikes = m.likes?.filter(id => id !== user._id);
          }

          return { ...m, likes: updatedLikes };
        })
      );
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleDownload = async (url) => {
    try {
      const response = await fetch(url, { mode: 'cors' });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'image.jpg';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      alert("Unable to download image. Please try again.");
    }
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setPreviewMedia(null);
    try {
      const res = await axios.get(`/media/event/${eventId}`);
      setMediaList(res.data);
    } catch (err) {
      console.error('Failed to fetch media:', err);
    }
  };

  return (
    <div className="group/design-root">
      <Navbar />

      <div className={`gallery-container ${showForm ? 'form-open' : ''}`}>
        <div className="gallery-main">
          {!showForm && (
            <div className="upload-btn-wrapper">
              <button 
                className="upload-btn" 
                onClick={() => setShowForm(true)}
                aria-label="Upload media"
              >
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
                const isLiked = media.likes?.includes(user?._id);
                return (
                  <div
                    key={media._id}
                    className="media-card"
                    onClick={() => handlePreview(media)}
                  >
                    {media.mediaType === 'image' ? (
                      <img 
                        src={media.url} 
                        alt={media.caption || 'Media'} 
                        loading="lazy"
                      />
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
                        aria-label="Delete media"
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
              onSuccess={handleFormSuccess}
            />
          )}
        </div>
      </div>

      <div className={`mobile-form-overlay ${showForm ? 'active' : ''}`}>
        {showForm && (
          <div className="mobile-form-container">
            <UploadForm
              eventId={eventId}
              onClose={() => setShowForm(false)}
              onSuccess={handleFormSuccess}
            />
          </div>
        )}
      </div>

      {previewMedia && (
        <div className="preview-overlay" onClick={handleClosePreview}>
          <div className="preview-content expanded" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={handleClosePreview}
              aria-label="Close preview"
            >
              ×
            </button>

            <div className="preview-layout">
              <div className="media-preview-left">
                {previewMedia.mediaType === 'image' ? (
                  <>
                    <img
                      src={previewMedia.url}
                      alt="Preview"
                      className="no-border-preview"
                    />
                    <button
                      className="download-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(previewMedia.url);
                      }}
                      aria-label="Download image"
                    >
                      <FaDownload />
                    </button>
                  </>
                ) : (
                  <video src={previewMedia.url} controls />
                )}
              </div>

              <div className="media-preview-right">
                {previewMedia.caption && (
                  <p className="caption">{previewMedia.caption}</p>
                )}
                {previewMedia.uploaderId?.name && (
                  <p className="uploader">Uploaded by: {previewMedia.uploaderId.name}</p>
                )}
                <CommentSection mediaId={previewMedia._id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventGalleryPage;
