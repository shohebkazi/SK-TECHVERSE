const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// ════════════════════════════════════════════
// User
// ════════════════════════════════════════════
const userSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:   { type: String, required: true, minlength: 6, select: false },
  role:       { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar:     String,
  phone:      String,
  company:    String,
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = function (pwd) {
  return bcrypt.compare(pwd, this.password);
};

// ════════════════════════════════════════════
// Project
// ════════════════════════════════════════════
const projectSchema = new mongoose.Schema({
  title:           { type: String, required: true, trim: true },
  description:     { type: String, required: true },
  fullDescription: String,
  image:           { type: String, default: '/assets/project-placeholder.jpg' },
  screenshots:     [String],
  technologies:    [String],
  category:        { type: String, enum: ['Web','Mobile','AI','ERP','Portfolio','Other'], default: 'Web' },
  features:        [String],
  price:           { type: Number, default: 0 },
  discountPrice:   { type: Number, default: 0 },
  rating:          { type: Number, default: 4.8 },
  sales:           { type: Number, default: 0 },
  deliveryTime:    { type: String, default: '7-10 Days' },
  supportPeriod:   { type: String, default: '6 Months Free Support' },
  liveUrl:         String,
  githubUrl:       String,
  featured:        { type: Boolean, default: false },
  status:          { type: String, enum: ['active','draft'], default: 'active' },
  views:           { type: Number, default: 0 },
}, { timestamps: true });

// ════════════════════════════════════════════
// Service
// ════════════════════════════════════════════
const serviceSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  icon:        String,
  features:    [String],
  price:       { from: Number, to: Number, currency: { type: String, default: 'INR' } },
  category:    String,
  order:       { type: Number, default: 0 },
  active:      { type: Boolean, default: true },
}, { timestamps: true });

// ════════════════════════════════════════════
// Contact
// ════════════════════════════════════════════
const contactSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  phone:   String,
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status:  { type: String, enum: ['new','read','replied','closed'], default: 'new' },
  source:  { type: String, default: 'website' },
}, { timestamps: true });

// ════════════════════════════════════════════
// Order
// ════════════════════════════════════════════
const orderSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clientName:   { type: String, required: true },
  clientEmail:  { type: String, required: true },
  clientPhone:  String,
  projectType:  { type: String, required: true },
  projectTitle: String,
  description:  { type: String, required: true },
  budget:       { min: Number, max: Number },
  deadline:     Date,
  requirements: [String],
  attachments:  [String],
  status: {
    type: String,
    enum: ['pending','reviewing','in-progress','completed','cancelled'],
    default: 'pending',
  },
  priority:    { type: String, enum: ['low','medium','high'], default: 'medium' },
  invoiceId:   String,
  totalAmount: Number,
  paidAmount:  { type: Number, default: 0 },
  notes:       String,
}, { timestamps: true });

// ════════════════════════════════════════════
// Blog
// ════════════════════════════════════════════
const blogSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  slug:        { type: String, unique: true },
  excerpt:     String,
  content:     { type: String, required: true },
  image:       String,
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags:        [String],
  category:    String,
  status:      { type: String, enum: ['draft','published'], default: 'draft' },
  views:       { type: Number, default: 0 },
  likes:       { type: Number, default: 0 },
  readTime:    Number,
  publishedAt: Date,
}, { timestamps: true });

blogSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// ════════════════════════════════════════════
// Testimonial
// ════════════════════════════════════════════
const testimonialSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientRole: String,
  company:    String,
  avatar:     String,
  rating:     { type: Number, min: 1, max: 5, default: 5 },
  review:     { type: String, required: true },
  project:    String,
  featured:   { type: Boolean, default: false },
  active:     { type: Boolean, default: true },
}, { timestamps: true });

// ── Exports ───────────────────────────────────────────────────
const User        = mongoose.model('User',        userSchema);
const Project     = mongoose.model('Project',     projectSchema);
const Service     = mongoose.model('Service',     serviceSchema);
const Contact     = mongoose.model('Contact',     contactSchema);
const Order       = mongoose.model('Order',       orderSchema);
const Blog        = mongoose.model('Blog',        blogSchema);
const Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = { User, Project, Service, Contact, Order, Blog, Testimonial };
