const router      = require('express').Router();
const { Service } = require('../models');
const { protect, adminOnly } = require('../middleware/auth');

// GET all active services (public)
router.get('/', async (req, res) => {
  try {
    res.json(await Service.find({ active: true }).sort('order'));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET all services including inactive (admin)
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    res.json(await Service.find().sort('order'));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET single service
router.get('/:id', async (req, res) => {
  try {
    const s = await Service.findById(req.params.id);
    if (!s) return res.status(404).json({ message: 'Service not found' });
    res.json(s);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// CREATE service (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try { res.status(201).json(await Service.create(req.body)); }
  catch (e) { res.status(400).json({ message: e.message }); }
});

// UPDATE service (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Service not found' });
    res.json(updated);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// DELETE service (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;