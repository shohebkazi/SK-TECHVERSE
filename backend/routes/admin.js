const router = require('express').Router();
const { Project, Contact, Order, Blog, User, Testimonial, Service } = require('../models');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/analytics', protect, adminOnly, async (req, res) => {
  try {
    const [projects, contacts, orders, blogs, users, testimonials, services] = await Promise.all([
      Project.countDocuments(), Contact.countDocuments(), Order.countDocuments(),
      Blog.countDocuments({ status: 'published' }), User.countDocuments(),
      Testimonial.countDocuments({ active: true }), Service.countDocuments({ active: true }),
    ]);
    const newContacts   = await Contact.countDocuments({ status: 'new' });
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const recentOrders  = await Order.find().sort('-createdAt').limit(5);
    const recentMsgs    = await Contact.find({ status: 'new' }).sort('-createdAt').limit(5);
    const revenue       = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]);

    res.json({
      stats: { projects, contacts, orders, blogs, users, testimonials, services, newContacts, pendingOrders },
      revenue: revenue[0]?.total || 0,
      recentOrders,
      recentMsgs,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/users', protect, adminOnly, async (req, res) => {
  try { res.json(await User.find().sort('-createdAt').limit(50)); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.patch('/users/:id/role', protect, adminOnly, async (req, res) => {
  try { res.json(await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true })); }
  catch (e) { res.status(400).json({ message: e.message }); }
});

module.exports = router;