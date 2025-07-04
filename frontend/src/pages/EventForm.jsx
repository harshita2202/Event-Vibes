import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';

const EventForm = ({ existingEvent, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingEvent) {
      setTitle(existingEvent.title || '');
      setDescription(existingEvent.description || '');
      setCoverImageUrl(existingEvent.coverImage || '');
    }
  }, [existingEvent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // ✅ Basic client-side validation
    if (!title.trim()) {
      alert('Title is required.');
      return;
    }
    if (!coverImageUrl.trim() && !coverImageFile) {
      alert('Cover image is required (URL or file).');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);

      if (coverImageFile) {
        formData.append('coverImageFile', coverImageFile);
      } else {
        formData.append('coverImageUrl', coverImageUrl);
      }

      if (existingEvent) {
        await axios.put(`/events/${existingEvent._id}`, formData);
      } else {
        await axios.post('/events/create', formData);
      }

      onSuccess();
    } catch (err) {
      console.error('Event submission error', err);
      if (err.response?.status === 409) {
        alert('An event with this title already exists.');
      } else if (err.response?.data?.error) {
        alert(err.response.data.error);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <h4>{existingEvent ? "Edit" : "Create"} Event</h4>

      <label>Title <span style={{ color: 'red' }}>*</span></label>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        disabled={loading}
      />

      <label>Description</label>
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        disabled={loading}
      />

      <label>Cover Image <span style={{ color: 'red' }}>*</span></label>
      <input
        type="text"
        placeholder="Image URL (optional if uploading)"
        value={coverImageUrl}
        onChange={e => setCoverImageUrl(e.target.value)}
        disabled={loading}
      />
      <span style={{ fontSize: '12px', color: '#666' }}>OR</span>
      <input
        type="file"
        accept="image/*"
        onChange={e => setCoverImageFile(e.target.files[0])}
        disabled={loading}
      />

      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'OK'}
        </button>
        <button type="button" onClick={onClose} disabled={loading}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EventForm;
