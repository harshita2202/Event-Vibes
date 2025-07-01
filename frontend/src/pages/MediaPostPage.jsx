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

      <label className="upload-label">Choose File</label>
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
      />

      <label className="upload-label">Caption</label>
      <input
        type="text"
        placeholder="Enter caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        disabled={uploading}
      />

      <div className="btn-group">
        <button type="submit" disabled={uploading || !file}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <button type="button" onClick={onClose} disabled={uploading}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default MediaPostPage;