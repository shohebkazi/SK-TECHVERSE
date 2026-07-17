/**
 * SK TECHVERSE — Database Seed Script
 * Run: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { User, Project, Service, Testimonial } = require('../models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sk-techverse';

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('✅  Connected to MongoDB');

  // Clear collections
  await Promise.all([User.deleteMany(), Project.deleteMany(), Service.deleteMany(), Testimonial.deleteMany()]);
  console.log('🗑️   Cleared existing data');

  // Admin user
  await User.create({
    name: 'SK Admin', email: 'admin@sktechverse.com',
    password: 'Admin@123', role: 'admin',
  });
  console.log('👤  Admin user created → admin@sktechverse.com / Admin@123');

  // Sample projects
  await Project.insertMany([
    { title:'AI Healthcare System',    description:'ML-powered patient diagnosis with real-time analytics.',  category:'AI',     technologies:['Python','TensorFlow','React','MongoDB'], featured:true },
    { title:'Smart Billing Software',  description:'Complete billing with GST, inventory and PDF invoices.',  category:'Web',    technologies:['Node.js','React','MySQL','PDFKit'],       featured:true },
    { title:'AI Quiz Portal',          description:'NLP-based auto question generation with adaptive scoring.',category:'AI',     technologies:['Python','NLP','React','Firebase'],         featured:false },
    { title:'Mobile Shop Management',  description:'Full POS and inventory system with mobile companion.',    category:'Mobile', technologies:['Flutter','Node.js','MongoDB'],              featured:true },
    { title:'Gym Management System',   description:'Member management, attendance and subscription billing.', category:'Web',    technologies:['React','Express','PostgreSQL'],             featured:false },
    { title:'Hospital ERP',            description:'Full ERP covering OPD, IPD, pharmacy and lab modules.',  category:'ERP',    technologies:['Angular','Java Spring','Oracle'],           featured:true },
    { title:'Restaurant Ordering',     description:'QR-code menu, kitchen display and payment integration.', category:'Web',    technologies:['React','Node.js','Stripe','Redis'],         featured:false },
  ]);
  console.log('🗂️   Projects seeded');

  // Sample services
  await Service.insertMany([
    { title:'AI Projects',          description:'Custom AI/ML solutions and automation.',         icon:'🤖', order:1 },
    { title:'Web Development',      description:'Full-stack MERN/MEAN applications.',             icon:'💻', order:2 },
    { title:'Android App Dev',      description:'Native and cross-platform mobile apps.',         icon:'📱', order:3 },
    { title:'College Projects',     description:'Academic projects with docs and source code.',   icon:'🎓', order:4 },
    { title:'Billing Software',     description:'GST-compliant billing and invoicing systems.',   icon:'🧾', order:5 },
    { title:'ERP Systems',          description:'Enterprise resource planning solutions.',         icon:'🏢', order:6 },
    { title:'E-Commerce Websites',  description:'High-converting online stores.',                 icon:'🛒', order:7 },
    { title:'UI/UX Design',         description:'Figma prototypes and pixel-perfect UI.',         icon:'🎨', order:8 },
    { title:'Cloud Hosting',        description:'AWS/GCP/Azure deployment with CI/CD.',           icon:'☁️', order:9 },
    { title:'API Development',      description:'RESTful and GraphQL API development.',           icon:'🔌', order:10 },
  ]);
  console.log('⚡  Services seeded');

  // Sample testimonials
  await Testimonial.insertMany([
    { clientName:'Rahul Sharma',  clientRole:'CEO',      company:'TechStart India', rating:5, review:'SK TECHVERSE delivered our ERP ahead of schedule. Outstanding quality!',           project:'Hospital ERP',          featured:true },
    { clientName:'Priya Mehta',   clientRole:'Founder',  company:'ShopEasy',        rating:5, review:'Our e-commerce revenue tripled after SK TECHVERSE redesigned our platform.',       project:'E-commerce Platform',   featured:true },
    { clientName:'Dr. V. Joshi',  clientRole:'Director', company:'MediCare Clinic', rating:5, review:'The AI healthcare system is revolutionary. Patient satisfaction jumped 60%!',      project:'AI Healthcare System',  featured:true },
    { clientName:'Anita Patel',   clientRole:'IT Mgr',   company:'GrowthCorp',      rating:5, review:'The billing software completely streamlined our finance workflow. Excellent team.', project:'Smart Billing Software', featured:false },
  ]);
  console.log('⭐  Testimonials seeded');

  console.log('\n🎉  Database seeded successfully!\n');
  process.exit(0);
};

seed().catch(err => { console.error('❌  Seed failed:', err); process.exit(1); });
