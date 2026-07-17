const router    = require('express').Router();
const { Project } = require('../models');
const { protect, adminOnly } = require('../middleware/auth');
const upload    = require('../middleware/upload');
const { uploadManyBuffers } = require('../utils/cloudinaryUpload');

router.get('/', async (req, res) => {
  try {
    const { category, featured, page = 1, limit = 50, search } = req.query;
    const q = { status: 'active' };
    if (category) q.category = category;
    if (featured) q.featured = featured === 'true';
    if (search)   q.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    const skip     = (page - 1) * limit;
    const projects = await Project.find(q).sort('-createdAt').limit(+limit).skip(skip);
    const total    = await Project.countDocuments(q);
    res.json({ projects, total, pages: Math.ceil(total / limit), page: +page });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const projects = await Project.find().sort('-createdAt');
    res.json({ projects, total: projects.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const p = await Project.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
    if (!p) return res.status(404).json({ message: 'Project not found' });
    res.json(p);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, adminOnly, upload.array('screenshots', 8), async (req, res) => {
  try {
    const body = { ...req.body };

    ['technologies', 'features'].forEach((key) => {
      if (typeof body[key] === 'string') {
        try { body[key] = JSON.parse(body[key]); } catch { body[key] = body[key].split(',').map(s => s.trim()); }
      }
    });

    if (req.files && req.files.length > 0) {
      body.screenshots = await uploadManyBuffers(req.files);
      body.image = body.screenshots[0];
    }

    const project = await Project.create(body);
    res.status(201).json(project);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, adminOnly, upload.array('screenshots', 8), async (req, res) => {
  try {
    const body = { ...req.body };

    ['technologies', 'features'].forEach((key) => {
      if (typeof body[key] === 'string') {
        try { body[key] = JSON.parse(body[key]); } catch { body[key] = body[key].split(',').map(s => s.trim()); }
      }
    });

    let existingShots = [];
    if (body.existingScreenshots) {
      try { existingShots = JSON.parse(body.existingScreenshots); } catch { existingShots = []; }
      delete body.existingScreenshots;
    }

    const newShots = req.files && req.files.length > 0
      ? await uploadManyBuffers(req.files)
      : [];

    const finalShots = [...existingShots, ...newShots];
    if (finalShots.length > 0) {
      body.screenshots = finalShots;
      body.image = finalShots[0];
    }

    const project = await Project.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const p = await Project.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;