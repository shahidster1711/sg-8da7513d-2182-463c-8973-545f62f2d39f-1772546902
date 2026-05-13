<h1 align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d9488,100:14b8a6&height=180&section=header&text=AndamanBazaar%20Next.js&fontSize=44&animation=fadeIn&fontAlignY=35" width="100%" />
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase" />
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwind-css" />
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=flat-square" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel" />
</p>

<p align="center">
  <strong>🏝️ Hyperlocal Marketplace for Andaman & Nicobar Islands</strong>
</p>

---

## 🌟 Features

### Core Marketplace
- 📦 **Product Listings** — Rich listings with images, pricing, categories
- 🤖 **AI Descriptions** — Google Gemini-powered product descriptions
- 🔍 **Full-Text Search** — PostgreSQL-powered search with filters
- 🏷️ **Categories** — Electronics, Furniture, Vehicles, Marine, Produce, Handicrafts, Jobs, Real Estate

### User System
- 🔐 **Authentication** — Email/password + Google OAuth (Supabase Auth)
- 👤 **Profiles** — User profiles with verification badges
- 💬 **Real-time Chat** — Direct messaging via Supabase Realtime
- ❤️ **Wishlist** — Save favorite listings
- ⭐ **Reviews** — Seller ratings and reviews

### Admin Dashboard
- 📊 **Analytics** — Users, listings, system stats
- 🛡️ **Moderation** — Manage reports and content
- 👁️ **Oversight** — Full visibility into platform activity

---

## 🏗️ Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 15 (Pages Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| AI | Google Gemini API |
| Deployment | Vercel |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase & Gemini keys

# Run development server
npm run dev
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Gemini
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/             # shadcn/ui components
│   ├── ListingCard.tsx # Product card
│   └── Navigation.tsx  # Main nav
├── contexts/            # React contexts
├── hooks/              # Custom hooks
├── integrations/       # Supabase client
├── lib/                # Utilities & Gemini API
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   ├── auth/          # Auth pages
│   ├── listings/      # Listing pages
│   ├── admin/         # Admin dashboard
│   └── index.tsx      # Homepage
├── services/           # API service layer
└── styles/            # Global CSS
```

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| Primary | Teal/Turquoise (#0D9488) |
| Background | Sandy Beige (#FEF3C7) |
| Accent | Coral |
| Mode | Dark Mode Supported |

---

## 🔐 Database Schema

All tables use **Row Level Security (RLS)**:

- `profiles` — User information
- `listings` — Product listings
- `messages` — Direct messages
- `conversations` — Message threads
- `wishlists` — Saved listings
- `reviews` — Seller ratings
- `reports` — Reported content

---

## 🚢 Deployment

```bash
# Deploy to Vercel
vercel deploy --prod
```

Vercel automatically configures:
- Next.js build
- Preview deployments
- CI/CD pipeline

---

<p align="center">
  Built with ❤️ for the Andaman & Nicobar Islands community
</p>
