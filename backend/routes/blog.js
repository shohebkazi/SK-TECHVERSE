const router   = require('express').Router();
const { Blog } = require('../models');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 6, category, tag } = req.query;
    const q = { status: 'published' };
    if (category) q.category = category;
    if (tag)      q.tags = tag;
    const posts = await Blog.find(q).sort('-publishedAt').populate('author', 'name').limit(+limit).skip((page - 1) * limit);
    const total = await Blog.countDocuments(q);
    res.json({ posts, total, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: get all posts including drafts
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    res.json(await Blog.find().sort('-createdAt').populate('author', 'name'));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:slug', async (req, res) => {
  try {
    const post = await Blog.findOneAndUpdate({ slug: req.params.slug }, { $inc: { views: 1 } }, { new: true }).populate('author', 'name');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try { res.status(201).json(await Blog.create({ ...req.body, author: req.user._id })); }
  catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try { res.json(await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try { await Blog.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;