# AndamanBazaar 🏝️

A hyperlocal buy/sell marketplace for the Andaman and Nicobar Islands, India. Built with Next.js, TypeScript, Supabase, and AI-powered features.

## 🚀 Features

### Core Functionality
- **User Authentication**: Email/password and Google OAuth via Supabase Auth
- **Product Listings**: Post items with images, descriptions, pricing, and location
- **AI-Powered Descriptions**: Generate product descriptions using Google Gemini API
- **Advanced Search**: Full-text search with category, price, and location filters
- **Real-time Messaging**: In-app chat between buyers and sellers
- **Wishlist**: Save favorite listings for later
- **Seller Profiles**: Public profiles with ratings and reviews
- **Mobile-First Design**: Responsive UI optimized for all devices

### Categories
Electronics, Furniture, Clothing & Accessories, Vehicles, Marine Equipment, Fresh Produce, Handicrafts & Souvenirs, Services, Jobs, Real Estate, Pets, Miscellaneous

### Locations
Port Blair, Havelock, Neil Island, Baratang, Diglipur, Mayabunder, Rangat, Car Nicobar, Great Nicobar, Little Andaman, and more

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (Pages Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **AI**: Google Gemini API
- **Deployment**: Vercel
- **Image Handling**: browser-image-compression

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google Cloud account (for Gemini API)
- Vercel account (for deployment)

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd andamanbazaar
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**

Create a new Supabase project at https://supabase.com

Run the database migrations:
- Navigate to SQL Editor in your Supabase dashboard
- Copy and run the contents of `supabase/migrations/20260303135553_migration_3af4290f.sql`

Create a storage bucket named `listing-images`:
- Go to Storage in Supabase dashboard
- Create a new public bucket named `listing-images`
- Set the file size limit to 5MB
- Enable the following policies:
  - Allow authenticated users to upload
  - Allow public read access

4. **Set up Google Gemini API**

- Go to Google AI Studio: https://makersuite.google.com/app/apikey
- Create a new API key
- Copy the API key for use in environment variables

5. **Configure environment variables**

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google Gemini API
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

6. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🗄️ Database Schema

The application uses the following main tables:

- **profiles**: User information and settings
- **listings**: Product listings with images and details
- **messages**: Direct messages between users
- **conversations**: Chat threads for each listing
- **wishlists**: Saved/favorited listings
- **reviews**: Seller ratings and feedback
- **reports**: Flagged listings for moderation

All tables include Row Level Security (RLS) policies for data protection.

## 🎨 Design System

- **Primary Color**: Teal (#0D9488) - representing the tropical ocean
- **Accent**: Sandy Beige (#FEF3C7) - island beaches
- **Typography**: System fonts with excellent readability
- **Components**: Pre-built shadcn/ui components with island theme
- **Dark Mode**: Full dark mode support

## 📱 Key Pages

- `/` - Homepage with search and featured listings
- `/search` - Advanced search with filters
- `/post` - Create new listing (auth required)
- `/listings/[id]` - Listing detail page
- `/messages` - Real-time messaging
- `/wishlist` - Saved items
- `/profile/[id]` - Public seller profile
- `/settings` - Account settings
- `/auth/login` - Sign in page
- `/auth/signup` - Registration page

## 🔐 Authentication

The app supports two authentication methods:

1. **Email/Password**: Traditional email-based signup and login
2. **Google OAuth**: One-click sign in with Google

Both methods are handled by Supabase Auth and create a user profile automatically.

## 🖼️ Image Upload

Images are:
- Compressed client-side before upload (max 1MB, 1920px)
- Stored in Supabase Storage
- Limited to 5 images per listing
- Publicly accessible via CDN URLs

## 🤖 AI Features

### Product Description Generator
- Powered by Google Gemini 1.5 Flash
- Generates compelling descriptions from title and category
- One-click generation during listing creation
- Falls back gracefully if API is unavailable

## 🚀 Deployment

### Deploy to Vercel

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

2. **Import project to Vercel**
- Go to https://vercel.com
- Click "New Project"
- Import your GitHub repository
- Configure environment variables (same as `.env.local`)
- Deploy

3. **Configure Supabase redirect URLs**
- Go to Supabase Dashboard → Authentication → URL Configuration
- Add your Vercel domain to "Site URL"
- Add to "Redirect URLs": `https://your-domain.vercel.app/auth/callback`

### Environment Variables for Production

Make sure to add all environment variables in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_GEMINI_API_KEY`
- `NEXT_PUBLIC_APP_URL` (your Vercel domain)

## 🔒 Security

- **Row Level Security (RLS)**: All database tables protected with RLS policies
- **Authentication**: Secure session management via Supabase
- **Image Upload**: Client-side compression and validation
- **Input Validation**: Form validation on both client and server
- **XSS Protection**: React's built-in XSS protection
- **CORS**: Properly configured for Supabase and API routes

## 📊 Performance

- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic code splitting by Next.js
- **Caching**: Static page generation where possible
- **Compression**: Gzip compression enabled
- **CDN**: Vercel Edge Network for global distribution

## 🐛 Troubleshooting

### Common Issues

**Build fails with TypeScript errors**
```bash
npm run build
```
Check the error messages and fix type issues.

**Images not uploading**
- Verify Supabase storage bucket `listing-images` exists and is public
- Check file size (should be under 5MB after compression)
- Verify authentication token is valid

**Gemini API not working**
- Verify API key is correct in environment variables
- Check API quota limits in Google Cloud Console
- The feature gracefully degrades if API is unavailable

**Real-time messages not working**
- Verify Supabase Realtime is enabled for your project
- Check browser console for WebSocket connection errors
- Ensure RLS policies allow reading messages

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- shadcn/ui for the beautiful component library
- Supabase for the backend infrastructure
- Google Gemini for AI capabilities
- Vercel for hosting and deployment
- The Andaman & Nicobar Islands community

## 📞 Support

For support, email support@andamanbazaar.com or open an issue in the repository.

---

Built with ❤️ for the Andaman & Nicobar Islands community