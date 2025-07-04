import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import './UserDashboard.css';
import axios from '../utils/axiosInstance'; 
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await axios.get('/events'); 
        setFolders(res.data);
      } catch (err) {
        console.error('Failed to fetch folders:', err);
      }
    };

    fetchFolders();
  }, []);

  const handleClick = (folderId) => {
    navigate(`/media/${folderId}`); 
  };

  return (
    <div className="dashboard-root">
      <Navbar />
      <div className="layout-content-container">
        <h3>Event Folders</h3>
        <div className="folder-grid">
          {folders.length > 0 ? (
            folders.map((folder) => (
              <div
                className="folder-card"
                key={folder._id}
                onClick={() => handleClick(folder._id)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="card-image"
                  style={{
                    backgroundImage: `url(${folder.coverImage || '/default-event-cover.jpg'})`
                  }}
                ></div>
                <p>{folder.title}</p>
              </div>
            ))
          ) : (
            <p>No folders available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
