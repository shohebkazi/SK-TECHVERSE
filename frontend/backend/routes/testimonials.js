const router         = require('express').Router();
const { Testimonial } = require('../models');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try { res.json(await Testimonial.find({ active: true }).sort('-createdAt')); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try { res.json(await Testimonial.find().sort('-createdAt')); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try { res.status(201).json(await Testimonial.create(req.body)); }
  catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try { res.json(await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try { await Testimonial.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;