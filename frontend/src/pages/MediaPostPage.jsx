import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axiosInstance";
import "./MediaPostPage.css";

const MediaPostPage = () => {
  const { postId } = useParams();
  const [media, setMedia] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get(`/media/${postId}`);
        setMedia(res.data);
      } catch (err) {
        console.error("Fetch media failed:", err);
      }
    };

    fetchMedia();
  }, [postId]);

  if (!media) return <p>Loading...</p>;

  return (
    <div className="media-post-page">
      <h1>{media.caption || "Untitled"}</h1>
      {media.mediaType === "image" ? (
        <img src={media.url} alt={media.caption} />
      ) : (
        <video src={media.url} controls />
      )}
      <p>Uploaded by: {media.uploaderId?.name || "Unknown"}</p>
      <p>{new Date(media.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default MediaPostPage;
