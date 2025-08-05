# BuzzBerry Auth & Onboarding Platform

A modern, scalable SaaS authentication and onboarding platform built with Next.js 14, Supabase, and Tailwind CSS.

## 🚀 Features

- **🔐 Secure Authentication**: Google OAuth and email/password authentication
- **🎨 Modern UI**: Dark mode design with responsive layouts
- **📱 Mobile Optimized**: Fully responsive design with mobile-first approach
- **🤖 AI Integration**: Gemini AI-powered chat functionality
- **📊 Dashboard**: Comprehensive analytics and user management
- **🔍 Discover Page**: Advanced creator discovery and filtering
- **⚡ Performance**: Built with Next.js 14 for optimal performance

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS + shadcn/ui
- **AI**: Google Gemini API
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- Google Cloud Console access (for Gemini API)
- Git installed

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/BuzzBerryCode/Buzz.git
cd Buzz
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp .env.example .env.local
```

Update `.env.local` with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Google Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### 4. Database Setup

Run the Supabase migration script:

```bash
# Copy the SQL from supabase-migration.sql and run it in your Supabase SQL editor
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Enable Google OAuth in Authentication → Providers
3. Configure your OAuth redirect URLs
4. Run the database migration script
5. Set up Row Level Security (RLS) policies

### Google Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── components/        # Reusable components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   └── types/            # TypeScript type definitions
├── docs/                 # Documentation
├── public/               # Static assets
└── supabase-migration.sql # Database schema
```

## 🔒 Security

### Environment Variables

- Never commit `.env.local` or any files containing real API keys
- Use `.env.example` as a template for required variables
- All sensitive keys are properly excluded in `.gitignore`

### Database Security

- Row Level Security (RLS) is enabled on all tables
- User authentication is required for all sensitive operations
- API routes validate user sessions before processing requests

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [documentation](docs/)
2. Search existing [issues](https://github.com/BuzzBerryCode/Buzz/issues)
3. Create a new issue with detailed information

## 🔄 Updates

Stay updated with the latest changes:

```bash
git pull origin main
npm install
npm run dev
```

---

**Note**: This is a production-ready SaaS platform. Ensure you have proper security measures in place before deploying to production.
