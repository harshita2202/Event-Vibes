const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const protect = require('../middleware/authMiddleware');
const Media = require('../models/Media');

// Add a new comment
router.post('/:mediaId', protect, async (req, res) => {
  try {
    const { text } = req.body;
    const newComment = new Comment({
      mediaId: req.params.mediaId,
      userId: req.user._id, // ✅ changed from commenterId
      text,
    });
    await newComment.save();
    const populated = await newComment.populate('userId', 'name profilePic'); // ✅ populate after save
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Get comments for a media
router.get('/:mediaId', protect, async (req, res) => {
  try {
    const comments = await Comment.find({ mediaId: req.params.mediaId })
      .populate('userId', 'name profilePic') // ✅ changed from commenterId
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Update a comment (own only)
router.put('/:commentId', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (!comment.userId.equals(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to edit this comment' });
    }

    comment.text = req.body.text;
    comment.edited = true;
    await comment.save();

    const updated = await comment.populate('userId', 'name profilePic');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// Delete a comment (own or admin or uploader)
router.delete('/:commentId', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const media = await Media.findById(comment.mediaId);

    const isOwner = comment.userId.equals(req.user._id);
    const isAdmin = req.user.role === 'admin';
    const isUploader = media && media.uploaderId.equals(req.user._id); // optional

    if (!isOwner && !isAdmin && !isUploader) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;
