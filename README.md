# BuzzBerry AI - Authentication & Onboarding System

A modern, scalable SaaS authentication and onboarding codebase built with Next.js 14, Supabase, and Google Gemini AI.

## 🚀 Features

### Authentication & User Management
- **Google OAuth Integration** - Seamless sign-in with Google accounts
- **Supabase Auth** - Robust user authentication and session management
- **Invitation Code System** - Controlled access with invitation codes
- **Dark Mode UI** - Beautiful, modern dark theme throughout the application

### AI-Powered Chat System
- **Gemini AI Integration** - Advanced AI chat powered by Google Gemini
- **Real-time Chat History** - Persistent chat sessions with full conversation context
- **Chat Management** - Delete individual chats or clear all history
- **Responsive UI** - Optimized for desktop and mobile devices

### Dashboard & Navigation
- **Modular Dashboard** - Clean, organized dashboard with sidebar navigation
- **AI Search Page** - Main interface for AI-powered creator discovery
- **Discover Page** - Browse and filter creator database
- **Profile Management** - User profile with Google integration

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth, Google OAuth
- **AI**: Google Gemini API
- **UI Components**: Shadcn UI, Radix UI
- **State Management**: React Hooks, Server Components

## 📁 Project Structure

```
auth-onboarding-next.js/
├── app/
│   ├── api/                    # API routes
│   │   ├── ai-chat/           # AI chat functionality
│   │   ├── chat-history/      # Chat history management
│   │   └── chat-session/      # Chat session handling
│   ├── auth/                  # Authentication pages
│   ├── dashboard/             # Dashboard pages
│   │   ├── aisearch/         # AI Search interface
│   │   ├── chat/             # Chat interface
│   │   └── discover/         # Discover page
│   ├── components/           # Reusable components
│   │   ├── dashboard/        # Dashboard components
│   │   └── ui/              # UI components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   └── globals.css          # Global styles
├── public/                  # Static assets
├── docs/                    # Documentation
└── *.sql                   # Database migration files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Cloud Console account (for Gemini API)
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BuzzBerryCode/buzz-is-here.git
   cd buzz-is-here
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Google Gemini AI Configuration
   GEMINI_API_KEY=your_gemini_api_key

   # Next.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret

   # Optional: Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Set up the database**
   ```bash
   # Run the main migration
   psql -h your-supabase-host -U postgres -d postgres -f supabase-migration.sql
   
   # Run additional setup scripts as needed
   psql -h your-supabase-host -U postgres -d postgres -f create-chat-functions.sql
   psql -h your-supabase-host -U postgres -d postgres -f fix-chat-rls.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Enable Google OAuth in Authentication settings
3. Configure your Google OAuth credentials
4. Set up Row Level Security (RLS) policies
5. Run the database migration scripts

### Google Gemini API

1. Create a Google Cloud project
2. Enable the Gemini API
3. Create an API key
4. Add the key to your environment variables

### Google OAuth

1. Create OAuth 2.0 credentials in Google Cloud Console
2. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
3. Add credentials to environment variables

## 📊 Database Schema

### Core Tables

- **users** - User profiles and authentication data
- **chat_sessions** - AI chat conversation sessions
- **chat_messages** - Individual messages within chat sessions
- **creator_data** - Creator/influencer database

### Key Relationships

- Users have many chat sessions
- Chat sessions have many messages
- Messages belong to chat sessions and users

## 🔐 Security Features

- **Row Level Security (RLS)** - Database-level access control
- **Session Management** - Secure cookie-based sessions
- **API Route Protection** - Server-side authentication checks
- **Environment Variable Protection** - Sensitive data excluded from version control

## 🎨 UI/UX Features

- **Dark Mode** - Consistent dark theme throughout
- **Responsive Design** - Mobile-first approach
- **Loading States** - Smooth loading indicators
- **Error Handling** - User-friendly error messages
- **Accessibility** - WCAG compliant components

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the SQL migration files for database setup

## 🔄 Recent Updates

### Latest Features
- ✅ Server-side API routes for improved performance
- ✅ Enhanced chat history management
- ✅ Improved UI with larger submit buttons
- ✅ Immediate text clearing in chat input
- ✅ Comprehensive database migration scripts
- ✅ Dark mode optimization
- ✅ Mobile-responsive design improvements

### Performance Improvements
- ✅ Removed loading overlays for faster chat loading
- ✅ Optimized authentication flow
- ✅ Improved session management
- ✅ Better error handling and user feedback

---

**Built with ❤️ by the BuzzBerry Team**
