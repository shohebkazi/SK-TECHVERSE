# 🚀 SK TECHVERSE — Full Stack Portfolio Website

> **"Building Smart Digital Solutions with AI"**

A premium, futuristic full-stack portfolio website for the SK TECHVERSE software brand.
Built with **React.js + Tailwind CSS** on the frontend and **Node.js + Express + MongoDB** on the backend.

---


## ✨ Features

### Frontend
| Feature | Details |
|---------|---------|
| 🎨 UI Theme | Dark futuristic, neon blue + purple gradients |
| 💎 Glassmorphism | Cards, navbar, modals |
| ✨ Custom Cursor | Animated glow dot + ring |
| 🎆 Particles | Floating background particles |
| 📜 Scroll Progress | Neon gradient progress bar |
| 💫 Loader | Animated splash screen |
| 🌓 Dark/Light Mode | Toggle in navbar |
| 🤖 AI Chatbot | Intelligent floating chatbot widget |
| 💬 WhatsApp FAB | Floating action button |
| 📱 Fully Responsive | Mobile, tablet, desktop |
| ⌨️ Typing Animation | Hero section auto-typing text |
| 📊 Stat Counters | Animated count-up on scroll |

### Pages
| Page | Route |
|------|-------|
| Home | `/` |
| About Us | `/about` |
| Services | `/services` |
| Projects | `/projects` (with category filter) |
| AI Solutions | `/ai` |
| Pricing | `/pricing` |
| Testimonials | `/testimonials` |
| Blog | `/blog` |
| Contact | `/contact` |
| Order Project | `/order` |
| Login / Register | `/login` |
| Admin Dashboard | `/admin` |

### Backend
| Feature | Details |
|---------|---------|
| 🔑 JWT Auth | Register, login, role-based access |
| 🗄️ MongoDB | 7 models: User, Project, Service, Contact, Order, Blog, Testimonial |
| 🛡️ Helmet | HTTP security headers |
| 🔒 Rate Limiting | 120 req / 15 min per IP |
| 📧 Email | Nodemailer (Gmail) for contact notifications |
| 📁 File Upload | Multer + Cloudinary |
| 📄 PDF | PDFKit for invoice generation |
| 📈 Analytics | Aggregated stats endpoint |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone
```bash
git clone https://github.com/yourname/sk-techverse.git
cd sk-techverse
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — add MONGODB_URI and JWT_SECRET at minimum
npm run dev           # starts on http://localhost:5000
```

### 3. Seed the database (optional)
```bash
npm run seed
# Creates admin user: admin@sktechverse.com / Admin@123
```

### 4. Frontend
```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env — set REACT_APP_API_URL=http://localhost:5000/api
npm start             # starts on http://localhost:3000
```



## 📄 License
MIT — Free for personal and commercial use.

---

**Built with ❤️ by SK TECHVERSE** — *Building Smart Digital Solutions with AI*
