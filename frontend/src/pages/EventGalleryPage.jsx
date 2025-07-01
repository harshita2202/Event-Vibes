import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import Navbar from './Navbar';
import './EventGalleryPage.css';

const EventGalleryPage = () => {
  const [mediaList, setMediaList] = useState([]);
  const { eventId } = useParams();  // Get eventId from the URL

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get(`/media/event/${eventId}`);  // Assuming your API looks like this
        setMediaList(res.data);
      } catch (err) {
        console.error('Failed to fetch media:', err);
      }
    };

    fetchMedia();
  }, [eventId]);

  return (
    <div className="group/design-root">
      <Navbar />

      <div className="gallery-page">
        <div className="upload-link-container">
          <Link to={`/media/${eventId}/upload`} className="upload-button">
            Upload Media
          </Link>
        </div>

        <div className="media-grid">
          {mediaList.length === 0 ? (
            <p className="no-media-msg">No media uploaded yet.</p>
          ) : (
            mediaList.map((media) => (
              <Link
                key={media._id}
                to={`/media/${eventId}/post/${media._id}`}
                className="media-card"
              >
                {media.mediaType === 'image' ? (
                  <img src={media.url} alt={media.caption || 'Event media'} />
                ) : (
                  <video src={media.url} controls />
                )}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventGalleryPage;
