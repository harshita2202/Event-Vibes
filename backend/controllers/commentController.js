const Comment = require('../models/Comment');
const Media = require('../models/Media');

// POST a comment
exports.addComment = async (req, res) => {
  try {
    const { mediaId, text } = req.body;

    const comment = await Comment.create({
      mediaId,
      userId: req.user._id,
      text,
    });

    const populated = await comment.populate('userId', 'name profilePic');
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to post comment' });
  }
};

// GET comments for a media
exports.getCommentsForMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const comments = await Comment.find({ mediaId })
      .populate('userId', 'name profilePic')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// PUT (edit) a comment
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (!comment.userId.equals(req.user._id)) return res.status(403).json({ error: 'Unauthorized' });

    comment.text = text;
    comment.edited = true;
    await comment.save();

    const updated = await comment.populate('userId', 'name profilePic');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

// DELETE a comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const media = await Media.findById(comment.mediaId);

    if (
      !comment.userId.equals(req.user._id) &&
      !req.user.isAdmin &&
      !media.uploader.equals(req.user._id)
    ) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};
