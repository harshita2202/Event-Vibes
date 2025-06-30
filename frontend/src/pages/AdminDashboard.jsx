import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import axios from '../utils/axiosInstance';
import './AdminDashboard.css';
import EventForm from './EventForm';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

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

  return (
    <div className="group/design-root">
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
              <div className="folder-card" key={event._id}>
                <div
                  className="card-image"
                  style={{ backgroundImage: `url(${event.coverImage})` }}
                >
                  <div className="admin-actions">
                    <button onClick={() => { setEditingEvent(event); setShowForm(true); }}>✏️</button>
                    <button onClick={() => handleDelete(event._id)}>🗑️</button>
                  </div>
                </div>
                <p>{event.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`side-form-panel ${showForm ? 'visible' : ''}`}>
          {showForm && (
            <EventForm
              onClose={() => {
                setShowForm(false);
                setEditingEvent(null);
              }}
              onSuccess={() => {
                fetchEvents();
                setShowForm(false);
                setEditingEvent(null);
              }}
              existingEvent={editingEvent}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
