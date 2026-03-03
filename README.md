# 🏝️ AndamanBazaar

A hyperlocal buy/sell marketplace for the Andaman and Nicobar Islands, India. Built with Next.js, Supabase, and Google Gemini AI.

![AndamanBazaar](public/og-image.png)

## 🌟 Features

### Core Marketplace
- **Product Listings**: Post items with title, description, price, category, condition, images (up to 5), and location
- **AI-Powered Descriptions**: Generate product descriptions using Google Gemini API
- **Advanced Search**: Full-text search with filters (category, price, condition, location, sorting)
- **Categories**: Electronics, Furniture, Clothing, Vehicles, Marine Equipment, Fresh Produce, Handicrafts, Services, Jobs, Real Estate, Pets, and more

### User Features
- **Authentication**: Email/password and Google OAuth via Supabase Auth
- **User Profiles**: Name, phone, location, avatar, verification badge
- **Real-time Messaging**: Direct chat between buyers and sellers with unread badges
- **Wishlist**: Save favorite listings with heart icon
- **Reviews & Ratings**: Leave star ratings and reviews for sellers
- **Seller Dashboard**: View active listings, edit/delete items, mark as sold

### Admin Features
- **Admin Dashboard**: View all listings, users, and reported items
- **Moderation**: Delete listings, manage reports
- **Analytics**: Total users, active listings, system stats

### Technical Features
- **Mobile-First Design**: Responsive UI with sticky bottom navigation
- **Island Theme**: Teal/turquoise primary colors with sandy beige accents
- **Dark Mode**: Full dark mode support
- **Image Compression**: Client-side image optimization before upload
- **SEO Optimized**: Next.js metadata API with OG images
- **Real-time Updates**: Supabase Realtime for instant messaging
- **Row Level Security**: Secure database access with RLS policies

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (Pages Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **AI**: Google Gemini API
- **Image Processing**: browser-image-compression
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Cloud account (for Gemini API)
- Vercel account (for deployment)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd andamanbazaar
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your credentials
3. Go to Authentication > Providers:
   - Enable Email provider
   - Enable Google provider (add OAuth credentials from Google Cloud Console)
4. Go to Storage and create a bucket named `listing-images` with public access

### 3. Set up Google Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Enable the Generative Language API

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Gemini API
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run database migrations

The database schema is automatically created via the Supabase SQL editor or migrations. The main tables are:

- `profiles` - User profiles with phone, location, avatar
- `listings` - Product listings with images, price, category
- `messages` - Direct messages between users
- `conversations` - Message threads
- `wishlists` - Saved listings
- `reviews` - Seller ratings and reviews
- `reports` - Reported listings

All tables have Row Level Security (RLS) policies enabled.

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
andamanbazaar/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── ListingCard.tsx # Product card component
│   │   ├── Navigation.tsx  # Main navigation
│   │   └── SEO.tsx         # SEO meta tags
│   ├── contexts/           # React contexts
│   │   └── ThemeProvider.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── use-toast.ts
│   │   └── use-mobile.tsx
│   ├── integrations/
│   │   └── supabase/       # Supabase client and types
│   ├── lib/                # Utility functions
│   │   ├── gemini.ts       # AI description generation
│   │   └── utils.ts        # Helper functions
│   ├── pages/              # Next.js pages
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── listings/       # Listing detail pages
│   │   ├── profile/        # User profile pages
│   │   ├── admin/          # Admin dashboard
│   │   ├── index.tsx       # Homepage
│   │   ├── search.tsx      # Search page
│   │   ├── post.tsx        # Create listing
│   │   ├── messages.tsx    # Chat interface
│   │   ├── wishlist.tsx    # Saved items
│   │   └── settings.tsx    # User settings
│   ├── services/           # API service layer
│   │   ├── authService.ts
│   │   ├── listingService.ts
│   │   ├── messageService.ts
│   │   ├── wishlistService.ts
│   │   ├── reviewService.ts
│   │   ├── reportService.ts
│   │   ├── profileService.ts
│   │   └── storageService.ts
│   ├── styles/
│   │   └── globals.css     # Global styles
│   └── types/
│       └── index.ts        # TypeScript types
├── public/                 # Static assets
├── supabase/
│   └── migrations/         # Database migrations
└── ...config files
```

## 🔐 Database Schema

### Tables

**profiles**
- User information (name, phone, location, avatar, verification status)

**listings**
- Product listings with seller_id, title, description, price, category, condition, images[], location, status

**messages**
- Direct messages with conversation_id, sender_id, receiver_id, content, read status

**conversations**
- Message threads linking listings with buyers and sellers

**wishlists**
- Saved listings per user

**reviews**
- Ratings and comments for sellers

**reports**
- User-reported listings with reason

### Row Level Security (RLS)

All tables have RLS policies to ensure:
- Users can only read their own data
- Users can create their own listings
- Users can only edit/delete their own content
- Public read access for listings and profiles
- Secure messaging between authenticated users

## 🎨 Design System

### Colors
- **Primary**: Teal/Turquoise (#0D9488)
- **Background**: Warm sandy beige (#FEF3C7)
- **Accent**: Coral for CTAs
- **Text**: Dark gray with proper contrast

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Readable sans-serif
- **Mobile-first**: Responsive text scaling

### Components
- Rounded cards with shadows
- Smooth transitions and hover effects
- Icon-first navigation
- Optimistic UI updates

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

Vercel will automatically:
- Build your Next.js app
- Configure custom domains
- Enable preview deployments
- Set up CI/CD

### Post-Deployment Steps

1. Update Supabase redirect URLs:
   - Go to Authentication > URL Configuration
   - Add your Vercel domain to redirect URLs

2. Configure Google OAuth:
   - Add Vercel domain to authorized redirect URIs in Google Cloud Console

3. Test all features:
   - Authentication flows
   - Image uploads
   - Real-time messaging
   - Search functionality

## 📱 Mobile App Considerations

The current implementation is a responsive web app. For native mobile apps:

1. Consider React Native or Flutter
2. Use Supabase client libraries for mobile
3. Implement push notifications for messages
4. Add offline support with local storage

## 🔧 Configuration

### Image Upload Settings

Configure in `storageService.ts`:
- Max file size: 5MB
- Allowed formats: JPG, PNG, WebP
- Compression quality: 0.8
- Max images per listing: 5

### Rate Limiting

Implement via Supabase Edge Functions:
- Max listings per user: 10/day
- Prevent spam postings

### Search Configuration

Full-text search powered by PostgreSQL:
- Indexes on title and description
- Configurable relevance ranking
- Filter aggregations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues or questions:
- Open an issue on GitHub
- Email: support@andamanbazaar.com
- Visit: [andamanbazaar.com](https://andamanbazaar.com)

## 🙏 Acknowledgments

- Built for the Andaman & Nicobar Islands community
- Inspired by OLX and other classifieds platforms
- Powered by Supabase and Next.js

---

**Built with ❤️ for the Andaman & Nicobar Islands**