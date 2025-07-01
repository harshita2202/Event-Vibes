import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import Navbar from './Navbar';
import './EventGalleryPage.css';
import UploadForm from './MediaPostPage';
import { useAuth } from '../contexts/AuthContext';

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
              mediaList.map((media) => (
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

                  {(user?.role === "admin" || user?._id === media?.uploaderId) && (
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
                </div>
              ))
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
            <p>{previewMedia.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventGalleryPage;
