# Student Sphere

A modern discussion platform built exclusively for SRMIST students.

## Overview

Student Sphere is a community-driven platform where SRMIST students can discuss academic topics, share resources, and engage in campus-related conversations. Access is restricted to verified @srmist.edu.in email addresses.

## Features

- **Secure Authentication** - Google OAuth with email domain restriction
- **Discussion Forums** - Academic and non-academic categories
- **Community Engagement** - Upvote system and threaded comments
- **Smart Search** - Find posts and discussions quickly
- **User Profiles** - Personal dashboard with activity tracking
- **Content Moderation** - Admin tools for community safety
- **Real-time Notifications** - Stay informed about updates

## Technology

- Next.js 15 with React 19
- TypeScript for type safety
- Tailwind CSS for styling
- Prisma ORM with SQLite
- NextAuth.js for authentication
- Framer Motion for animations

## Getting Started

### Prerequisites
- Node.js 20+ installed
- Google OAuth credentials ([Get them here](https://console.cloud.google.com/apis/credentials))

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/krishnt02/Student-Sphere.git
   cd Student-Sphere
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual values:
   - Generate `NEXTAUTH_SECRET`: `openssl rand -base64 32`
   - Add your Google OAuth credentials
   - Set your admin email in `ADMIN_EMAILS`

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Configuration

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-a-secure-random-string>"
GOOGLE_CLIENT_ID="<your-google-oauth-client-id>"
GOOGLE_CLIENT_SECRET="<your-google-oauth-client-secret>"
ADMIN_EMAILS="admin@srmist.edu.in,another-admin@srmist.edu.in"
```

### Environment Variables Explained

- `DATABASE_URL`: SQLite database connection string
- `NEXTAUTH_URL`: Your application URL (change for production)
- `NEXTAUTH_SECRET`: A random secret key for session encryption (generate using `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID`: OAuth 2.0 Client ID from Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: OAuth 2.0 Client Secret from Google Cloud Console
- `ADMIN_EMAILS`: Comma-separated list of admin email addresses

## Project Structure

```
app/
├── api/            # Backend API routes
├── admin/          # Admin dashboard
├── auth/           # Authentication pages
├── posts/          # Post detail pages
└── ...             # Other app pages

components/
├── ui/             # Reusable UI components
└── ...             # Feature components

lib/                # Utility functions
prisma/             # Database schema
public/             # Static assets
```

## Admin Features

Admin access is configured via the `ADMIN_EMAILS` environment variable.

- Dashboard with platform statistics
- Content management and moderation
- User management system
- Report handling and resolution

## Contributing

This is an academic project for SRMIST. For issues or suggestions, please contact the developer.
1) Fork the repository
2) Create a feature branch
3) Make your changes
4) Test thoroughly
5) Submit a pull request

## License

Academic Project - SRMIST

---

Developed for the SRMIST student community by Nipun Thakuria.
