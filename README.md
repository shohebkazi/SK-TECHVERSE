# 🚀 SK TECHVERSE — Full Stack Portfolio Website

> **"Building Smart Digital Solutions with AI"**

A premium, futuristic full-stack portfolio website for the SK TECHVERSE software brand.
Built with **React.js + Tailwind CSS** on the frontend and **Node.js + Express + MongoDB** on the backend.

---

## 📁 Project Structure

```
SK-TECHVERSE/
├── frontend/                        # React.js frontend
│   ├── public/
│   │   ├── index.html               # HTML entry point + SEO meta tags
│   │   └── assets/                  # Static images, icons
│   ├── src/
│   │   ├── styles/
│   │   │   └── globals.css          # All CSS (variables, components, responsive)
│   │   ├── data/
│   │   │   └── index.js             # Static data (services, projects, testimonials, etc.)
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # JWT auth state (login, register, logout)
│   │   │   └── ThemeContext.jsx     # Dark / Light mode toggle
│   │   ├── hooks/
│   │   │   └── index.js             # useCounter, useInView, useTyping, useScrollProgress
│   │   ├── components/
│   │   │   ├── Cursor.jsx           # Custom animated cursor
│   │   │   ├── Effects.jsx          # Particles, Loader, ScrollProgress
│   │   │   ├── Navbar.jsx           # Sticky navbar + mobile drawer
│   │   │   ├── Footer.jsx           # Full footer with links
│   │   │   └── ChatBot.jsx          # AI chatbot widget
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Hero, stats, services preview, CTA
│   │   │   ├── AboutServices.jsx    # About Us + Services pages
│   │   │   ├── ProjectsAIPricingTest.jsx  # Projects, AI, Pricing, Testimonials
│   │   │   ├── BlogContactOrderAuth.jsx   # Blog, Contact, Order, Auth pages
│   │   │   └── admin/
│   │   │       └── Dashboard.jsx    # Full admin dashboard
│   │   └── App.jsx                  # Main router + layout
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
│
└── backend/                         # Node.js + Express backend
    ├── models/
    │   └── index.js                 # All Mongoose models (User, Project, Service, etc.)
    ├── routes/
    │   ├── index.js                 # All route handlers
    │   ├── auth.js                  # /api/auth
    │   ├── projects.js              # /api/projects
    │   ├── services.js              # /api/services
    │   ├── contacts.js              # /api/contacts
    │   ├── orders.js                # /api/orders
    │   ├── blog.js                  # /api/blog
    │   ├── testimonials.js          # /api/testimonials
    │   └── admin.js                 # /api/admin
    ├── middleware/
    │   └── auth.js                  # JWT protect + adminOnly middleware
    ├── scripts/
    │   └── seed.js                  # Database seeder
    ├── server.js                    # Express app entry point
    ├── package.json
    └── .env.example
```

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

---

## 🌐 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | User | Get profile |
| PUT | `/api/auth/change-password` | User | Change password |

### Projects
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/projects` | — | List projects (filter, paginate) |
| GET | `/api/projects/featured` | — | Featured projects |
| GET | `/api/projects/:id` | — | Single project |
| POST | `/api/projects` | Admin | Create |
| PUT | `/api/projects/:id` | Admin | Update |
| DELETE | `/api/projects/:id` | Admin | Delete |

### Contact
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/contacts` | — | Submit contact form |
| GET | `/api/contacts` | Admin | List all contacts |
| PATCH | `/api/contacts/:id` | Admin | Update status |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | — | Submit order |
| GET | `/api/orders` | Admin | List all orders |
| GET | `/api/orders/:id` | Admin | Single order |
| PATCH | `/api/orders/:id` | Admin | Update status |

### Blog, Services, Testimonials
- `GET /api/blog` — public posts
- `GET /api/blog/:slug` — single post
- `POST/PUT/DELETE /api/blog` — Admin only
- Same pattern for `/api/services` and `/api/testimonials`

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/analytics` | Admin | Dashboard stats |
| GET | `/api/admin/users` | Admin | All users |
| PATCH | `/api/admin/users/:id/role` | Admin | Update user role |

---

## 🚢 Deployment

### Frontend → Vercel
```bash
npm i -g vercel
cd frontend
vercel --prod
# Set env var: REACT_APP_API_URL = https://your-api.railway.app/api
```

### Backend → Railway
```bash
npm i -g @railway/cli
cd backend
railway login && railway up
# Add env vars in Railway dashboard
```

### MongoDB → Atlas
1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Get connection string
3. Add to `MONGODB_URI` in backend `.env`

---

## 🔐 Default Admin Credentials

```
Email:    admin@sktechverse.com
Password: Admin@123
```
⚠️ **Change these immediately after first login in production.**

---

## 🎨 Customization

### Brand Colors (`frontend/src/styles/globals.css`)
```css
:root {
  --neon-blue:   #00d4ff;   /* Primary accent */
  --neon-purple: #a855f7;   /* Secondary accent */
  --neon-cyan:   #06b6d4;   /* Highlights */
  --neon-pink:   #ec4899;   /* CTA accents */
  --neon-green:  #10b981;   /* Success states */
}
```

### WhatsApp Number
Search and replace `919999999999` in:
- `frontend/src/pages/BlogContactOrderAuth.jsx`
- `frontend/src/App.jsx`
- `frontend/.env` → `REACT_APP_WHATSAPP`

### Content
Edit `frontend/src/data/index.js` to update:
- Services list, Projects, Testimonials, Blog posts, Tech stack, Pricing plans

---

## 📄 License
MIT — Free for personal and commercial use.

---

**Built with ❤️ by SK TECHVERSE** — *Building Smart Digital Solutions with AI*
