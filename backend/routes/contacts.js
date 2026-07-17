const router      = require('express').Router();
const nodemailer  = require('nodemailer');
const { Contact } = require('../models');
const { protect, adminOnly } = require('../middleware/auth');

const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// CREATE contact/client message (public — from Contact form)
router.post('/', async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    if (process.env.EMAIL_USER) {
      await mailer.sendMail({
        from:    process.env.EMAIL_USER,
        to:      process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `[SK TECHVERSE] New Contact: ${req.body.subject || 'General Inquiry'}`,
        html:    `<h2>New message from ${req.body.name}</h2><p><b>Email:</b> ${req.body.email}</p><p><b>Phone:</b> ${req.body.phone || 'N/A'}</p><hr><p>${req.body.message}</p>`,
      }).catch(console.warn);
    }
    res.status(201).json({ message: 'Message sent successfully', id: contact._id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET all contacts/clients (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    res.json(await Contact.find().sort('-createdAt'));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET single contact (admin)
router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const c = await Contact.findById(req.params.id);
    if (!c) return res.status(404).json({ message: 'Not found' });
    res.json(c);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// UPDATE status (new/read/replied/closed) (admin)
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE contact (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;