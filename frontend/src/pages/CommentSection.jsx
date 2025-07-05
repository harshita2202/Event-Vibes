import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { useAuth } from '../contexts/AuthContext';
import './CommentSection.css';

const CommentSection = ({ mediaId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${mediaId}`);
        setComments(res.data);
      } catch (err) {
        console.error('Error loading comments:', err);
      }
    };
    fetchComments();
  }, [mediaId]);

  const handlePost = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(`/comments/${mediaId}`, { text: newComment });
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Post failed:', err);
    }
  };

  const handleDelete = async (commentId) => {
    const confirm = window.confirm('Delete this comment?');
    if (!confirm) return;

    try {
      await axios.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEdit = async (commentId, newText) => {
    try {
      const res = await axios.put(`/comments/${commentId}`, { text: newText });
      setComments(comments.map((c) => (c._id === commentId ? res.data : c)));
    } catch (err) {
      console.error('Edit failed:', err);
    }
  };

  return (
    <div className="comment-section">
      <h4>Comments</h4>

      <div className="comment-input">
        <textarea
          value={newComment}
          placeholder="Write a comment..."
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handlePost}>Post</button>
      </div>

      <div className="comment-list">
        {comments.length === 0 && <p className="no-comments">No comments yet.</p>}
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            currentUser={user}
            onDelete={() => handleDelete(comment._id)}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
};

const CommentItem = ({ comment, currentUser, onDelete, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const isOwner =
    currentUser?._id === comment.userId?._id || currentUser?.role === 'admin';

  const name = comment.userId?.name || 'Unknown';
  const profilePic = comment.userId?.profilePic || '/default-avatar.png';

  return (
    <div className="comment-item">
      <div className="comment-user">
        <img src={profilePic} alt={name} />
        <strong>{name}</strong>
      </div>

      {editing ? (
        <div className="edit-mode">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <button
            onClick={() => {
              onEdit(comment._id, editText);
              setEditing(false);
            }}
          >
            Save
          </button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <p className="comment-text">{comment.text}</p>
      )}

      {isOwner && !editing && (
        <div className="comment-actions">
          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
