import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from '../utils/axiosInstance';
import './AdminDashboard.css';
import EventForm from './EventForm';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events', err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this event?");
    if (!confirm) return;

    try {
      await axios.delete(`/events/${id}`);
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleFormSuccess = () => {
    fetchEvents();
    setShowForm(false);
    setEditingEvent(null);
  };

  return (
    <div className="dashboard-root">
      <Navbar />
      <div className={`admin-dashboard-container ${showForm ? 'form-open' : ''}`}>
        <div className="admin-dashboard">
          {/* Floating button wrapper */}
          {!showForm && (
            <div className="create-btn-wrapper">
              <button className="create-btn" onClick={() => setShowForm(true)}>
                + Create Event
              </button>
            </div>
          )}

          <div className="dashboard-header">
            <h3>Event Folder</h3>
          </div>

          <div className="folder-grid">
            {events.map(event => (
              <div
                className="folder-card"
                key={event._id}
                onClick={() => navigate(`/media/${event._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="card-image"
                  style={{ backgroundImage: `url(${event.coverImage})` }}
                >
                  <div className="admin-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingEvent(event);
                        setShowForm(true);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(event._id);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p>{event.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Form Panel */}
        <div className={`side-form-panel ${showForm ? 'visible' : ''}`}>
          {showForm && (
            <EventForm
              onClose={handleFormClose}
              onSuccess={handleFormSuccess}
              existingEvent={editingEvent}
            />
          )}
        </div>
      </div>

      {/* Mobile Form Overlay */}
      <div className={`mobile-form-overlay ${showForm ? 'active' : ''}`}>
        {showForm && (
          <div className="mobile-form-container">
            <EventForm
              onClose={handleFormClose}
              onSuccess={handleFormSuccess}
              existingEvent={editingEvent}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;