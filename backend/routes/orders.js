const router     = require('express').Router();
const { Order }  = require('../models');
const nodemailer = require('nodemailer');
const { protect, adminOnly } = require('../middleware/auth');

// ── Email setup ──────────────────────────────────────────────
const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const sendMail = async (to, subject, html) => {
  if (!process.env.EMAIL_USER) return;
  try {
    await mailer.sendMail({
      from: `"SK TECHVERSE" <${process.env.EMAIL_USER}>`,
      to, subject, html,
    });
  } catch (e) { console.warn('Email error:', e.message); }
};

// ── Email Templates ──────────────────────────────────────────
const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  body { margin:0; padding:0; background:#020409; font-family:'Segoe UI',sans-serif; }
  .wrap { max-width:600px; margin:0 auto; background:#0a0f1a; border:1px solid rgba(0,212,255,0.15); border-radius:16px; overflow:hidden; }
  .header { background:linear-gradient(135deg,#00d4ff,#a855f7); padding:2rem; text-align:center; }
  .header h1 { margin:0; color:#fff; font-size:1.6rem; letter-spacing:0.05em; }
  .header p  { margin:0.5rem 0 0; color:rgba(255,255,255,0.8); font-size:0.9rem; }
  .body { padding:2rem; color:#c8d0e0; line-height:1.7; }
  .status-box { border-radius:10px; padding:1.25rem 1.5rem; margin:1.5rem 0; border-left:4px solid; }
  .status-pending  { background:rgba(245,158,11,0.1);  border-color:#f59e0b; }
  .status-accepted { background:rgba(16,185,129,0.1);  border-color:#10b981; }
  .status-rejected { background:rgba(239,68,68,0.1);   border-color:#ef4444; }
  .status-progress { background:rgba(0,212,255,0.1);   border-color:#00d4ff; }
  .status-done     { background:rgba(168,85,247,0.1);  border-color:#a855f7; }
  .detail-row { display:flex; justify-content:space-between; padding:0.5rem 0; border-bottom:1px solid rgba(255,255,255,0.06); font-size:0.9rem; }
  .detail-label { color:#8892a4; }
  .detail-val   { color:#f0f4ff; font-weight:600; }
  .btn { display:inline-block; padding:0.75rem 2rem; background:linear-gradient(135deg,#00d4ff,#a855f7); color:#fff; text-decoration:none; border-radius:8px; font-weight:600; margin-top:1.5rem; }
  .footer { background:#020409; padding:1.25rem 2rem; text-align:center; color:#4a5568; font-size:0.78rem; border-top:1px solid rgba(255,255,255,0.05); }
  .wa-btn { display:inline-block; padding:0.6rem 1.5rem; background:#25D366; color:#fff; text-decoration:none; border-radius:8px; font-weight:600; margin-top:0.75rem; font-size:0.85rem; }
</style>
</head>
<body>
<div style="padding:2rem 1rem;">
  <div class="wrap">
    <div class="header">
      <h1>SK TECHVERSE</h1>
      <p>Building Smart Digital Solutions with AI</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      © 2024 SK TECHVERSE &nbsp;|&nbsp; contact@sktechverse.com &nbsp;|&nbsp; +91 74107 21438<br/>
      <a href="https://wa.me/917410721438" style="color:#25D366;">WhatsApp us anytime</a>
    </div>
  </div>
</div>
</body>
</html>`;

// Order confirmed (sent right after submission)
const orderConfirmedEmail = (order) => baseTemplate(`
  <p>Dear <strong style="color:#f0f4ff;">${order.clientName}</strong>,</p>
  <p>🎉 Thank you for submitting your project to <strong>SK TECHVERSE</strong>! We have received your order and our team will review it shortly.</p>

  <div class="status-box status-pending">
    <strong style="color:#f59e0b;">⏳ Status: Order Received — Under Review</strong><br/>
    <span style="font-size:0.88rem;">We will respond within <strong>2 hours</strong> on business days.</span>
  </div>

  <p style="font-size:0.9rem;color:#8892a4;margin-bottom:0.5rem;">ORDER DETAILS</p>
  <div class="detail-row"><span class="detail-label">Order ID</span><span class="detail-val">${order._id}</span></div>
  <div class="detail-row"><span class="detail-label">Project Type</span><span class="detail-val">${order.projectType}</span></div>
  <div class="detail-row"><span class="detail-label">Project Title</span><span class="detail-val">${order.projectTitle || 'N/A'}</span></div>
  <div class="detail-row"><span class="detail-label">Budget</span><span class="detail-val">${order.budget || 'To be discussed'}</span></div>
  <div class="detail-row"><span class="detail-label">Submitted</span><span class="detail-val">${new Date().toLocaleString('en-IN')}</span></div>

  <p style="margin-top:1.5rem;">You can track your project status anytime by visiting our website and entering your email.</p>
  <p>For instant updates, reach us on WhatsApp:</p>
  <a href="https://wa.me/917410721438?text=Hi! My Order ID is ${order._id}" class="wa-btn">💬 WhatsApp: +91 74107 21438</a>
  <br/><br/>
  <p style="color:#8892a4;font-size:0.88rem;">— Team SK TECHVERSE 🚀</p>
`);

// Admin notification (new order)
const adminNewOrderEmail = (order) => baseTemplate(`
  <p>🔔 <strong style="color:#f0f4ff;">New Project Order Received!</strong></p>
  <div class="status-box status-progress">
    <strong style="color:#00d4ff;">New Order — Action Required</strong>
  </div>
  <div class="detail-row"><span class="detail-label">Client</span><span class="detail-val">${order.clientName}</span></div>
  <div class="detail-row"><span class="detail-label">Email</span><span class="detail-val">${order.clientEmail}</span></div>
  <div class="detail-row"><span class="detail-label">Phone</span><span class="detail-val">${order.clientPhone || 'N/A'}</span></div>
  <div class="detail-row"><span class="detail-label">Project Type</span><span class="detail-val">${order.projectType}</span></div>
  <div class="detail-row"><span class="detail-label">Budget</span><span class="detail-val">${order.budget || 'N/A'}</span></div>
  <div class="detail-row"><span class="detail-label">Order ID</span><span class="detail-val">${order._id}</span></div>
  <p style="margin-top:1.5rem;"><strong>Description:</strong><br/><span style="color:#8892a4;">${order.description}</span></p>
  <a href="https://wa.me/91${order.clientPhone}" class="wa-btn">💬 Reply on WhatsApp</a>
`);

// Status update email to user
const statusUpdateEmail = (order) => {
  const statusMap = {
    reviewing:    { icon:'🔍', color:'status-pending',  label:'Under Review',    msg:'Our team is currently reviewing your project details and preparing a detailed proposal.' },
    accepted:     { icon:'✅', color:'status-accepted', label:'Project Accepted', msg:'Great news! Your project has been accepted. Our team will contact you shortly to discuss the next steps, timeline, and payment.' },
    'in-progress':{ icon:'⚡', color:'status-progress', label:'In Progress',     msg:'Your project is now actively being worked on by our development team. You will receive regular updates.' },
    completed:    { icon:'🎉', color:'status-done',     label:'Completed',       msg:'Your project has been completed successfully! Please review the deliverables and let us know if you need any changes.' },
    cancelled:    { icon:'❌', color:'status-rejected', label:'Cancelled',       msg:'Your project order has been cancelled. Please contact us if you have any questions or want to resubmit.' },
  };
  const s = statusMap[order.status] || { icon:'📋', color:'status-pending', label: order.status, msg:'Your project status has been updated.' };

  return baseTemplate(`
    <p>Dear <strong style="color:#f0f4ff;">${order.clientName}</strong>,</p>
    <p>Your project status has been updated by the SK TECHVERSE team.</p>

    <div class="status-box ${s.color}">
      <strong style="font-size:1.1rem;">${s.icon} ${s.label}</strong><br/>
      <span style="font-size:0.9rem;margin-top:0.5rem;display:block;">${s.msg}</span>
    </div>

    ${order.notes ? `
    <div style="background:rgba(168,85,247,0.08);border:1px solid rgba(168,85,247,0.2);border-radius:10px;padding:1.25rem;margin:1.5rem 0;">
      <p style="margin:0 0 0.5rem;color:#a855f7;font-size:0.78rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">📝 Message from Admin</p>
      <p style="margin:0;color:#f0f4ff;font-size:0.95rem;">${order.notes}</p>
    </div>` : ''}

    <p style="font-size:0.9rem;color:#8892a4;margin-bottom:0.5rem;">YOUR ORDER DETAILS</p>
    <div class="detail-row"><span class="detail-label">Order ID</span><span class="detail-val">${order._id}</span></div>
    <div class="detail-row"><span class="detail-label">Project</span><span class="detail-val">${order.projectTitle || order.projectType}</span></div>
    <div class="detail-row"><span class="detail-label">Updated</span><span class="detail-val">${new Date().toLocaleString('en-IN')}</span></div>

    <p style="margin-top:1.5rem;">Have questions? Contact us directly:</p>
    <a href="https://wa.me/917410721438?text=Hi! Regarding my Order ID: ${order._id}" class="wa-btn">💬 WhatsApp Us</a>
    <br/><br/>
    <p style="color:#8892a4;font-size:0.88rem;">— Team SK TECHVERSE 🚀</p>
  `);
};

// ── Routes ────────────────────────────────────────────────────

// Submit new order (public)
router.post('/', async (req, res) => {
  try {
    const order = await Order.create(req.body);

    // Email to user
    await sendMail(
      order.clientEmail,
      `✅ Order Received — SK TECHVERSE | Order #${order._id}`,
      orderConfirmedEmail(order)
    );

    // Email to admin
    await sendMail(
      process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      `🔔 New Order from ${order.clientName} — ${order.projectType}`,
      adminNewOrderEmail(order)
    );

    res.status(201).json({ message: 'Order submitted! Check your email for confirmation.', orderId: order._id });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Get all orders (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, priority, page=1, limit=10 } = req.query;
    const q = {};
    if (status)   q.status   = status;
    if (priority) q.priority = priority;
    const orders = await Order.find(q).sort('-createdAt').limit(+limit).skip((+page-1)*+limit);
    const total  = await Order.countDocuments(q);
    res.json({ orders, total, pages: Math.ceil(total/+limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Track order by email (public) — user enters email to see all their orders
router.post('/track', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const orders = await Order.find({ clientEmail: email.toLowerCase() })
      .sort('-createdAt')
      .select('_id projectType projectTitle status adminNotes budget createdAt updatedAt clientName');
    if (!orders.length) return res.status(404).json({ message: 'No orders found for this email.' });
    res.json({ orders, count: orders.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get single order by ID (public — for tracking)
router.get('/track/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .select('_id projectType projectTitle status adminNotes budget createdAt updatedAt clientName clientEmail');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get single order (admin)
router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const o = await Order.findById(req.params.id);
    if (!o) return res.status(404).json({ message: 'Not found' });
    res.json(o);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update order status + send email to user (admin)
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Send status update email to user
    if (req.body.status || req.body.adminNotes) {
      await sendMail(
        order.clientEmail,
        `📋 Project Update — ${order.projectTitle || order.projectType} | SK TECHVERSE`,
        statusUpdateEmail(order)
      );
    }

    res.json({ message: 'Order updated & email sent to client.', order });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;