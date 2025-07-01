import React, { useState } from 'react';
import { useParams } from 'react-router-dom';   // ✅ Import useParams
import './UploadPage.css';

const UploadPage = () => {
  const { eventId } = useParams();   // ✅ Get eventId from URL
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file!");
      return;
    }

    console.log("Uploading file:", file.name);
    console.log("Uploading for eventId:", eventId);  // ✅ Now we have the eventId

    // ⬇ Here you'd call your backend upload API with file + caption + eventId
    setUploading(true);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="upload-page">
      <h1>Upload Media</h1>
      <form onSubmit={handleUpload}>
        <label>
          Select File
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </label>
        <label>
          Caption
          <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Add a caption" />
        </label>
        {uploading && (
          <div className="progress-container">
            <p>Uploading...</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p>{progress}%</p>
          </div>
        )}
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadPage;
