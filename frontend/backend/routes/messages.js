const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const auth = require('../middleware/auth'); // apke existing auth middleware ka path check kar lena

// ── PUBLIC: Contact form se naya message create hota hai ──
// POST /api/messages
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email aur message required hain' });
    }
    const newMsg = await Message.create({ name, email, phone, subject, message });
    res.status(201).json({ message: 'Message received', data: newMsg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ADMIN: Saare messages list karo (protected) ──
// GET /api/messages
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ADMIN: Single message dekho ──
// GET /api/messages/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: msg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ADMIN: Read/unread status toggle ya update ──
// PUT /api/messages/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Message.findByIdAndUpdate(
      req.params.id,
      { read: req.body.read },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Updated', data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ADMIN: Message delete karo ──
// DELETE /api/messages/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;