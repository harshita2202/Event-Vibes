import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import './UploadPage.css';

const UploadPage = () => {
  const { eventId } = useParams();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file!");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);
    formData.append('eventId', eventId);

    try {
      setUploading(true);
      setUploadStatus('Uploading...');

      await axios.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      setUploadStatus('Upload complete!');
      setFile(null);
      setCaption('');
      
      setTimeout(() => setUploadStatus(''), 2000);
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadStatus('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <h1>Upload Media</h1>
      <form onSubmit={handleUpload}>
        <label>
          Select File
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])} 
            disabled={uploading}
          />
        </label>
        <label>
          Caption
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a caption"
            disabled={uploading}
          />
        </label>

        {uploadStatus && (
          <p className={`upload-status ${uploadStatus.includes('failed') ? 'error' : ''}`}>
            {uploadStatus}
          </p>
        )}

        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default UploadPage;