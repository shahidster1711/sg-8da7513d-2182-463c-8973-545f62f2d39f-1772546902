# 🚀 AndamanBazaar Setup Guide

Complete step-by-step guide to set up AndamanBazaar from scratch.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Google Gemini API Setup](#google-gemini-api-setup)
5. [Google OAuth Setup](#google-oauth-setup)
6. [Database Schema](#database-schema)
7. [Storage Configuration](#storage-configuration)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org))
- **npm** or **yarn** package manager
- **Git** for version control
- A **Supabase** account ([Sign up](https://supabase.com))
- A **Google Cloud** account ([Sign up](https://console.cloud.google.com))
- A **Vercel** account for deployment ([Sign up](https://vercel.com))

---

## Local Development Setup

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd andamanbazaar
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages including:
- Next.js 15
- React 18
- Supabase client
- shadcn/ui components
- Google Generative AI
- Image compression library
- date-fns for date formatting

---

## Supabase Configuration

### Step 1: Create a New Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose an organization or create one
4. Set project name: `andamanbazaar`
5. Set a strong database password
6. Choose a region closest to your users (e.g., Singapore for India)
7. Click "Create new project" (takes ~2 minutes)

### Step 2: Get API Credentials

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Starts with `eyJ...`
   - **service_role key**: Starts with `eyJ...` (keep secret!)

### Step 3: Configure Environment Variables

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Google Gemini API Setup

### Step 1: Get API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Choose your Google Cloud project (or create new)
4. Copy the API key

### Step 2: Add to Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your-api-key-here
```

---

## Google OAuth Setup

### Step 1: Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure consent screen if prompted:
   - User Type: External
   - App name: AndamanBazaar
   - User support email: your-email
   - Developer contact: your-email
6. Application type: **Web application**
7. Name: `AndamanBazaar`
8. Authorized redirect URIs:
   ```
   http://localhost:3000/auth/callback
   https://your-project.supabase.co/auth/v1/callback
   ```
9. Click **Create**
10. Copy **Client ID** and **Client Secret**

### Step 2: Configure Supabase Auth

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** provider
3. Enable it
4. Paste your **Client ID** and **Client Secret**
5. Click **Save**

### Step 3: Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Add these redirect URLs:
   ```
   http://localhost:3000
   http://localhost:3000/auth/callback
   https://your-vercel-domain.vercel.app
   https://your-vercel-domain.vercel.app/auth/callback
   ```

---

## Database Schema

### Automatic Setup via Supabase Integration

The database tables are automatically created when you connect Supabase to the project. The schema includes:

**Tables:**
- `profiles` - User profiles
- `listings` - Product listings
- `messages` - Direct messages
- `conversations` - Message threads
- `wishlists` - Saved listings
- `reviews` - Seller ratings
- `reports` - Reported items

**Features:**
- Row Level Security (RLS) on all tables
- Indexes for fast queries
- Foreign key constraints
- Timestamp tracking

### Manual Setup (if needed)

If tables aren't auto-created, run the SQL in Supabase SQL Editor:

```sql
-- See supabase/migrations/*.sql files for complete schema
```

### Verify Tables

1. Go to **Table Editor** in Supabase
2. Verify all 7 tables exist
3. Check RLS is enabled (shield icon shows locked)

---

## Storage Configuration

### Step 1: Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click **New bucket**
3. Name: `listing-images`
4. Public bucket: **Yes** (allows public read access)
5. File size limit: **5 MB**
6. Allowed MIME types: `image/jpeg, image/png, image/webp`
7. Click **Create bucket**

### Step 2: Configure Bucket Policies

The bucket should allow:
- **Public read** access (anyone can view images)
- **Authenticated users** can upload (INSERT)
- **Users can delete** only their own images

Storage policies are automatically configured.

### Step 3: Test Image Upload

1. Start the dev server: `npm run dev`
2. Sign up for an account
3. Go to "Post Ad"
4. Try uploading an image
5. Verify it appears in Storage bucket

---

## Testing

### Test Authentication

1. **Email/Password Signup:**
   - Go to `/auth/signup`
   - Create account with email
   - Check email for confirmation link
   - Verify redirect after confirmation

2. **Google OAuth:**
   - Click "Continue with Google"
   - Select Google account
   - Verify redirect to homepage

3. **Profile Creation:**
   - After signup, check `profiles` table in Supabase
   - Verify user record exists

### Test Listings

1. **Create Listing:**
   - Go to `/post`
   - Fill in all fields
   - Upload 2-3 images
   - Click "Generate Description" (test AI)
   - Submit listing
   - Verify appears on homepage

2. **Search:**
   - Go to `/search`
   - Try text search
   - Apply filters
   - Verify results update

3. **Listing Detail:**
   - Click any listing card
   - Verify all data displays
   - Test "Contact Seller" button
   - Check image carousel

### Test Messaging

1. **Start Conversation:**
   - View a listing (not your own)
   - Click "Contact Seller"
   - Send a message
   - Verify redirect to `/messages`

2. **Real-time Updates:**
   - Open `/messages` in two browser windows
   - Sign in as different users
   - Send messages between them
   - Verify messages appear instantly

### Test Wishlist

1. Click heart icon on listing card
2. Go to `/wishlist`
3. Verify saved item appears
4. Click heart again to remove
5. Verify it disappears from wishlist

---

## Deployment

### Deploy to Vercel

#### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

#### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Import Project**
3. Select your GitHub repository
4. Configure project:
   - Framework: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### Step 3: Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_GEMINI_API_KEY
NEXT_PUBLIC_APP_URL (set to your Vercel URL)
```

#### Step 4: Deploy

1. Click **Deploy**
2. Wait for build to complete (~2 minutes)
3. Verify deployment at provided URL

#### Step 5: Update Supabase URLs

1. Go to Supabase **Authentication** → **URL Configuration**
2. Add production URLs:
   ```
   https://your-app.vercel.app
   https://your-app.vercel.app/auth/callback
   ```

#### Step 6: Update Google OAuth

1. Go to Google Cloud Console → Credentials
2. Edit OAuth client
3. Add Vercel domain to authorized redirect URIs:
   ```
   https://your-app.vercel.app/auth/callback
   ```

### Custom Domain (Optional)

1. In Vercel, go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as shown
4. Update all OAuth redirect URLs to use custom domain

---

## Troubleshooting

### Images Not Loading

**Problem:** Images show broken or don't upload

**Solutions:**
1. Check Storage bucket exists and is public
2. Verify bucket name is `listing-images`
3. Check file size < 5MB
4. Clear browser cache
5. Check Supabase Storage policies

### Authentication Errors

**Problem:** "Invalid redirect URL" or OAuth fails

**Solutions:**
1. Verify redirect URLs in Supabase match exactly
2. Check Google OAuth credentials are correct
3. Ensure OAuth consent screen is published
4. Clear cookies and try again

### "Failed to fetch" Errors

**Problem:** API calls fail with network error

**Solutions:**
1. Verify Supabase URL is correct in `.env.local`
2. Check Supabase project is active (not paused)
3. Verify API keys are valid
4. Check RLS policies allow operation

### Messaging Not Real-time

**Problem:** Messages don't appear instantly

**Solutions:**
1. Verify Supabase Realtime is enabled
2. Check browser console for WebSocket errors
3. Ensure RLS policies allow SELECT on messages
4. Try refreshing the page

### AI Description Generation Fails

**Problem:** "Generate Description" doesn't work

**Solutions:**
1. Verify Gemini API key is valid
2. Check API quota hasn't been exceeded
3. Ensure Generative Language API is enabled in Google Cloud
4. Check browser console for errors

### Build Failures

**Problem:** Vercel build fails or times out

**Solutions:**
1. Run `npm run build` locally to test
2. Check all TypeScript errors are resolved
3. Verify all dependencies are in `package.json`
4. Check build logs for specific error
5. Try redeploying

---

## Next Steps

After successful setup:

1. **Customize Branding:**
   - Update colors in `tailwind.config.ts`
   - Replace logo and favicon
   - Update SEO metadata

2. **Add Admin User:**
   - Create account with admin email
   - Add email to `ADMIN_EMAILS` array in `src/pages/admin/dashboard.tsx`

3. **Configure Categories:**
   - Update categories list in `src/types/index.ts`
   - Customize for your market

4. **Set Up Analytics:**
   - Add Google Analytics
   - Configure Vercel Analytics
   - Set up error tracking (Sentry)

5. **Launch Marketing:**
   - Share on social media
   - Create promotional materials
   - Engage with local community

---

## Support

Need help? 

- 📧 Email: support@andamanbazaar.com
- 💬 Discord: [Join our community](#)
- 📖 Docs: [Full documentation](#)
- 🐛 Issues: [GitHub Issues](#)

---

**Happy Building! 🏝️**