// routes/auth.js
const authRouter   = require('express').Router();
const jwt          = require('jsonwebtoken');
const { User }     = require('../models');
const { protect }  = require('../middleware/auth');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// Register
authRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, company } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });
    const user  = await User.create({ name, email, password, phone, company });
    const token = signToken(user._id);
    res.status(201).json({ token, user: { id:user._id, name:user.name, email:user.email, role:user.role } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    const token = signToken(user._id);
    res.json({ token, user: { id:user._id, name:user.name, email:user.email, role:user.role } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get profile
authRouter.get('/me', protect, (req, res) => res.json(req.user));

// Change password
authRouter.put('/change-password', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(req.body.currentPassword)))
      return res.status(400).json({ message: 'Current password incorrect' });
    user.password = req.body.newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = authRouter;

// ─────────────────────────────────────────────────────────────
// routes/projects.js
const projRouter  = require('express').Router();
const { Project } = require('../models');
const { protect: prot, adminOnly: adm } = require('../middleware/auth');

projRouter.get('/', async (req, res) => {
  try {
    const { category, featured, page = 1, limit = 9, search } = req.query;
    const q = { status: 'active' };
    if (category) q.category = category;
    if (featured) q.featured = featured === 'true';
    if (search)   q.$or = [{ title:{ $regex:search, $options:'i' } }, { description:{ $regex:search, $options:'i' } }];
    const skip     = (page - 1) * limit;
    const projects = await Project.find(q).sort('-createdAt').limit(+limit).skip(skip);
    const total    = await Project.countDocuments(q);
    res.json({ projects, total, pages: Math.ceil(total / limit), page: +page });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

projRouter.get('/featured', async (req, res) => {
  try { res.json(await Project.find({ status:'active', featured:true }).sort('-createdAt').limit(6)); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

projRouter.get('/:id', async (req, res) => {
  try {
    const p = await Project.findByIdAndUpdate(req.params.id, { $inc:{ views:1 } }, { new:true });
    if (!p) return res.status(404).json({ message: 'Project not found' });
    res.json(p);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

projRouter.post('/',         prot, adm, async (req,res) => { try { res.status(201).json(await Project.create(req.body)); } catch(e){ res.status(400).json({message:e.message}); } });
projRouter.put('/:id',       prot, adm, async (req,res) => { try { res.json(await Project.findByIdAndUpdate(req.params.id, req.body, {new:true,runValidators:true})); } catch(e){ res.status(400).json({message:e.message}); } });
projRouter.delete('/:id',    prot, adm, async (req,res) => { try { await Project.findByIdAndDelete(req.params.id); res.json({message:'Deleted'}); } catch(e){ res.status(500).json({message:e.message}); } });

module.exports = projRouter;

// ─────────────────────────────────────────────────────────────
// routes/services.js
const svcRouter   = require('express').Router();
const { Service } = require('../models');
const { protect: p2, adminOnly: a2 } = require('../middleware/auth');

svcRouter.get('/',    async(req,res)=>{ try{ res.json(await Service.find({active:true}).sort('order')); }catch(e){ res.status(500).json({message:e.message}); } });
svcRouter.post('/',   p2,a2, async(req,res)=>{ try{ res.status(201).json(await Service.create(req.body)); }catch(e){ res.status(400).json({message:e.message}); } });
svcRouter.put('/:id', p2,a2, async(req,res)=>{ try{ res.json(await Service.findByIdAndUpdate(req.params.id, req.body,{new:true})); }catch(e){ res.status(400).json({message:e.message}); } });
svcRouter.delete('/:id',p2,a2,async(req,res)=>{ try{ await Service.findByIdAndDelete(req.params.id); res.json({message:'Deleted'}); }catch(e){ res.status(500).json({message:e.message}); } });

module.exports = svcRouter;

// ─────────────────────────────────────────────────────────────
// routes/contacts.js
const ctRouter    = require('express').Router();
const nodemailer  = require('nodemailer');
const { Contact } = require('../models');
const { protect: p3, adminOnly: a3 } = require('../middleware/auth');

const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

ctRouter.post('/', async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    if (process.env.EMAIL_USER) {
      await mailer.sendMail({
        from:    process.env.EMAIL_USER,
        to:      process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `[SK TECHVERSE] New Contact: ${req.body.subject}`,
        html:    `<h2>New message from ${req.body.name}</h2><p><b>Email:</b> ${req.body.email}</p><p><b>Phone:</b> ${req.body.phone||'N/A'}</p><hr><p>${req.body.message}</p>`,
      }).catch(console.warn);
    }
    res.status(201).json({ message: 'Message sent successfully', id: contact._id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

ctRouter.get('/',         p3, a3, async(req,res)=>{ try{ res.json(await Contact.find().sort('-createdAt')); }catch(e){ res.status(500).json({message:e.message}); } });
ctRouter.patch('/:id',    p3, a3, async(req,res)=>{ try{ res.json(await Contact.findByIdAndUpdate(req.params.id, req.body, {new:true})); }catch(e){ res.status(500).json({message:e.message}); } });
ctRouter.delete('/:id',   p3, a3, async(req,res)=>{ try{ await Contact.findByIdAndDelete(req.params.id); res.json({message:'Deleted'}); }catch(e){ res.status(500).json({message:e.message}); } });

module.exports = ctRouter;

// ─────────────────────────────────────────────────────────────
// routes/orders.js
const ordRouter  = require('express').Router();
const { Order }  = require('../models');
const { protect: p4, adminOnly: a4 } = require('../middleware/auth');

ordRouter.post('/', async (req, res) => {
  try { res.status(201).json(await Order.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
});

ordRouter.get('/', p4, a4, async (req, res) => {
  try {
    const { status, priority, page=1, limit=10 } = req.query;
    const q = {};
    if (status)   q.status   = status;
    if (priority) q.priority = priority;
    const orders = await Order.find(q).sort('-createdAt').limit(+limit).skip((page-1)*limit);
    const total  = await Order.countDocuments(q);
    res.json({ orders, total, pages: Math.ceil(total/limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

ordRouter.get('/:id',   p4, a4, async(req,res)=>{ try{ const o=await Order.findById(req.params.id); if(!o) return res.status(404).json({message:'Not found'}); res.json(o); }catch(e){ res.status(500).json({message:e.message}); } });
ordRouter.patch('/:id', p4, a4, async(req,res)=>{ try{ res.json(await Order.findByIdAndUpdate(req.params.id, req.body, {new:true,runValidators:true})); }catch(e){ res.status(400).json({message:e.message}); } });

module.exports = ordRouter;

// ─────────────────────────────────────────────────────────────
// routes/blog.js
const blgRouter = require('express').Router();
const { Blog }  = require('../models');
const { protect: p5, adminOnly: a5 } = require('../middleware/auth');

blgRouter.get('/', async (req, res) => {
  try {
    const { page=1, limit=6, category, tag } = req.query;
    const q = { status:'published' };
    if (category) q.category = category;
    if (tag)      q.tags = tag;
    const posts = await Blog.find(q).sort('-publishedAt').populate('author','name').limit(+limit).skip((page-1)*limit);
    const total = await Blog.countDocuments(q);
    res.json({ posts, total, pages: Math.ceil(total/limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

blgRouter.get('/:slug', async (req, res) => {
  try {
    const post = await Blog.findOneAndUpdate({ slug:req.params.slug }, { $inc:{ views:1 } }, { new:true }).populate('author','name');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

blgRouter.post('/',      p5, a5, async(req,res)=>{ try{ res.status(201).json(await Blog.create({ ...req.body, author:req.user._id })); }catch(e){ res.status(400).json({message:e.message}); } });
blgRouter.put('/:id',    p5, a5, async(req,res)=>{ try{ res.json(await Blog.findByIdAndUpdate(req.params.id, req.body, {new:true})); }catch(e){ res.status(400).json({message:e.message}); } });
blgRouter.delete('/:id', p5, a5, async(req,res)=>{ try{ await Blog.findByIdAndDelete(req.params.id); res.json({message:'Deleted'}); }catch(e){ res.status(500).json({message:e.message}); } });

module.exports = blgRouter;

// ─────────────────────────────────────────────────────────────
// routes/testimonials.js
const tstRouter       = require('express').Router();
const { Testimonial } = require('../models');
const { protect: p6, adminOnly: a6 } = require('../middleware/auth');

tstRouter.get('/',       async(req,res)=>{ try{ res.json(await Testimonial.find({active:true}).sort('-createdAt')); }catch(e){ res.status(500).json({message:e.message}); } });
tstRouter.post('/',      p6,a6, async(req,res)=>{ try{ res.status(201).json(await Testimonial.create(req.body)); }catch(e){ res.status(400).json({message:e.message}); } });
tstRouter.put('/:id',    p6,a6, async(req,res)=>{ try{ res.json(await Testimonial.findByIdAndUpdate(req.params.id, req.body,{new:true})); }catch(e){ res.status(400).json({message:e.message}); } });
tstRouter.delete('/:id', p6,a6, async(req,res)=>{ try{ await Testimonial.findByIdAndDelete(req.params.id); res.json({message:'Deleted'}); }catch(e){ res.status(500).json({message:e.message}); } });

module.exports = tstRouter;

// ─────────────────────────────────────────────────────────────
// routes/admin.js
const admRouter = require('express').Router();
const { Project:P, Contact:C, Order:O, Blog:B, User:U, Testimonial:T, Service:S } = require('../models');
const { protect: p7, adminOnly: a7 } = require('../middleware/auth');

admRouter.get('/analytics', p7, a7, async (req, res) => {
  try {
    const [projects, contacts, orders, blogs, users, testimonials, services] = await Promise.all([
      P.countDocuments(), C.countDocuments(), O.countDocuments(),
      B.countDocuments({ status:'published' }), U.countDocuments(),
      T.countDocuments({ active:true }), S.countDocuments({ active:true }),
    ]);
    const newContacts   = await C.countDocuments({ status:'new' });
    const pendingOrders = await O.countDocuments({ status:'pending' });
    const recentOrders  = await O.find().sort('-createdAt').limit(5);
    const recentMsgs    = await C.find({ status:'new' }).sort('-createdAt').limit(5);
    const revenue       = await O.aggregate([{ $group:{ _id:null, total:{ $sum:'$totalAmount' } } }]);

    res.json({
      stats:{ projects, contacts, orders, blogs, users, testimonials, services, newContacts, pendingOrders },
      revenue: revenue[0]?.total || 0,
      recentOrders,
      recentMsgs,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// All users (admin)
admRouter.get('/users', p7, a7, async (req,res) => {
  try { res.json(await U.find().sort('-createdAt').limit(50)); }
  catch(e){ res.status(500).json({message:e.message}); }
});

// Promote user to admin
admRouter.patch('/users/:id/role', p7, a7, async (req,res) => {
  try { res.json(await U.findByIdAndUpdate(req.params.id, {role:req.body.role},{new:true})); }
  catch(e){ res.status(400).json({message:e.message}); }
});

module.exports = admRouter;
