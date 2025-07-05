import React, { useState, useEffect, useRef } from 'react';
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
    if (!window.confirm("Delete this comment?")) return;
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

      <div className="comment-form">
        <textarea
          value={newComment}
          placeholder="Write a comment..."
          rows={3}
          onChange={(e) => setNewComment(e.target.value)}
          className="comment-textarea"
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
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const menuRef = useRef(null);
  const name = comment.userId?.name || 'Unknown';

  const isOwner =
    currentUser?._id === comment.userId?._id || currentUser?.role === 'admin';

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div className="comment">
      <div className="author">{name}</div>

      {editing ? (
        <div>
          <textarea
            className="edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <div className="comment-actions">
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
        </div>
      ) : (
        <>
          <p>{comment.text}</p>
          {isOwner && (
            <div className="comment-actions" ref={menuRef}>
              <button
                className="menu-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownVisible((prev) => !prev);
                }}
              >
                ⋮
              </button>

              {dropdownVisible && (
                <div className="dropdown-menu dropdown-visible">
                  <button
                    onClick={() => {
                      setEditing(true);
                      setDropdownVisible(false);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete();
                      setDropdownVisible(false);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentSection;
