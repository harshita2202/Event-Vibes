import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import "./MediaPostPage.css";

const MediaPostPage = ({ eventId, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);
    formData.append("mediaType", mediaType);
    formData.append("eventId", eventId);

    try {
      setUploading(true);

      await axios.post("/media/upload", formData);

      alert("Upload successful");
      resetForm();
      onSuccess();
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setCaption("");
  };
  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <h3>Upload Media</h3>

      <div className="form-field">
        <label className="upload-label">Choose File <span style={{ color: 'red' }}>*</span></label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
              setFile(selectedFile);
              setMediaType(selectedFile.type.startsWith("video") ? "video" : "image");
            }
          }}
          required
          disabled={uploading}
          id="media-upload"
        />
      </div>

      <div className="form-field">
        <label className="upload-label">Caption</label>
        <input
          type="text"
          placeholder="Enter caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          disabled={uploading}
        />
      </div>

      {uploading && (
        <div className="upload-status">
          <p>Uploading your media...</p>
        </div>
      )}

      <div className="btn-group">
        <button
          type="button"
          onClick={onClose}
          disabled={uploading}
          className="cancel-btn"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={uploading || !file}
          className="submit-btn"
        >
          {uploading ? (
            <>
              <span className="spinner"></span>
              Uploading...
            </>
          ) : (
            "Upload"
          )}
        </button>
      </div>
    </form>
  );
};

export default MediaPostPage;