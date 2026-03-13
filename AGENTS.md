# Porkast - Personalized Podcast Discovery Platform

## Project Overview

Porkast is a modern podcast discovery and management platform built with Next.js, allowing users to discover, subscribe, share, and manage personalized podcast content. The platform supports keyword search, playlist creation, listen later functionality, and provides Telegram Bot integration.

## Tech Stack

### Frontend Framework

- **Next.js 14** - React full-stack framework with App Router and Server Components support
- **TypeScript** - Type-safe JavaScript superset
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library based on Tailwind CSS

### Database & Authentication

- **PostgreSQL** - Primary database
- **Prisma** - Modern database ORM
- **Supabase** - Backend-as-a-Service providing authentication and database services

### Other Key Dependencies

- **React Email** - Email template components
- **Resend** - Email sending service
- **RSS Parser** - RSS feed parsing
- **Shikwasa** - Audio player component
- **Vercel Analytics** - Performance analytics

## Project Structure

```
/workspaces/porkast-next-app/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── jobs/          # Background task related APIs
│   │   ├── listenlater/   # Listen later functionality APIs
│   │   ├── playlist/      # Playlist functionality APIs
│   │   ├── podcast/       # Podcast content APIs
│   │   ├── rss/           # RSS subscription APIs
│   │   ├── search/        # Search functionality APIs
│   │   ├── subscription/  # Subscription functionality APIs
│   │   └── user/          # User management APIs
│   ├── listenlater/       # Listen later pages
│   ├── playlist/          # Playlist pages
│   ├── podcast/           # Podcast detail pages
│   ├── search/            # Search pages
│   ├── share/             # Share pages
│   ├── signin/            # Sign in pages
│   └── subscription/      # Subscription management pages
├── components/            # React components
├── libs/                  # Utility libraries and business logic
├── types/                 # TypeScript type definitions
├── prisma/                # Database schema and migrations
├── public/                # Static assets
└── supabase/              # Supabase configuration and functions
```

## Core Features

### 1. Podcast Discovery & Search

- Keyword-based podcast search
- Multi-source podcast content aggregation
- Smart recommendation algorithms

### 2. Subscription Management

- Keyword subscriptions
- Podcast channel subscriptions
- Exclude specific sources functionality

### 3. Playlists

- Create and manage personalized playlists
- Share playlist functionality
- Cross-device synchronization

### 4. Listen Later

- Quickly save interesting content
- Queue management
- Status tracking

### 5. Social Features

- Podcast sharing
- Subscription list sharing
- Telegram Bot integration

## Development Environment Setup

### Environment Variables Configuration

Copy `.env.sample` to `.env.local` and configure the following variables:

```bash
# API Configuration
API_BASE_URL=https://porkast.com/

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database Configuration
DATABASE_URL=postgres://username:password@domain.com:5432/porkastdb

# Other Service Configuration
CRON_SECRET=your_cron_secret
ZEPLO_TOKEN=your_zeplo_token
RESEND_API_KEY=your_resend_api_key
RESEND_SUPPORT_API_KEY=your_resend_support_api_key
```

### Install Dependencies

```bash
yarn install
# or
npm install
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push
```

### Development Server

```bash
yarn dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Build & Deployment

### Build Production Version

```bash
yarn build
# or
npm run build
```

### Start Production Server

```bash
yarn start
# or
npm start
```

### Docker Deployment

The project includes complete Dockerfile configuration:

```bash
# Build image
docker build -t porkast .

# Run container
docker run -p 3000:3000 porkast
```

## API Structure

### Playlist API

- `POST /api/playlist` - Create playlist
- `GET /api/playlist/[playlistId]` - Get playlist details
- `GET /api/playlist/list/[userId]` - Get user playlists
- `POST /api/playlist/item` - Add item to playlist

### Search API

- `GET /api/search/episode` - Search podcast episodes

### Subscription API

- `GET /api/subscription/list` - Get subscription list
- `POST /api/subscription/keyword` - Create keyword subscription
- `GET /api/rss/subscription/[userId]` - Get user RSS subscriptions

### Listen Later API

- `POST /api/listenlater/item` - Add to listen later
- `GET /api/listenlater/list` - Get listen later list
- `POST /api/listenlater/queue` - Manage listening queue

## Database Schema

### Core Table Structure

- **feed_channel** - Podcast channel information
- **feed_item** - Podcast episode information
- **user_subscription** - User subscriptions
- **user_playlist** - User playlists
- **user_playlist_item** - Playlist items
- **user_listen_later** - Listen later items
- **keyword_subscription** - Keyword subscriptions
- **profiles** - User profiles

### Authentication System

Uses Supabase Auth for user authentication, supporting:

- Email/password login
- Third-party OAuth login
- Session management
- User profiles

## Development Guidelines

### Code Style

- Use TypeScript for type-safe development
- Follow ESLint configuration rules
- Use Tailwind CSS for styling
- Components use functional React components

### Commit Convention

The project uses Git for version control, recommended to follow these commit conventions:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Code formatting adjustments
- `refactor:` Code refactoring
- `test:` Testing related
- `chore:` Build process or auxiliary tool changes

### Debugging & Testing

```bash
# Code linting
npm run lint

# Type checking
npx tsc --noEmit
```

## Deployment Platforms

### Vercel Deployment

The project is optimized for Vercel platform deployment:

- Automatic build and deployment
- Edge function support
- Performance analytics integration

### Self-hosted Deployment

Supports self-hosted deployment via Docker, see Dockerfile configuration for details.

## Extended Features

### Telegram Bot

The project provides Telegram Bot integration, users can:

- Search podcasts via @PorkcastBot
- Manage subscriptions and playlists
- Share podcast content

### RSS Subscription

Supports standard RSS format, users can:

- Subscribe to podcasts via RSS links
- Generate personal RSS subscription feeds
- Sync with other podcast apps

## Performance Optimization

- Use Next.js Image component for optimized image loading
- Implement code splitting and lazy loading
- Database query optimization
- CDN static resource distribution
- Cache strategy implementation

## Contributing Guidelines

1. Fork the project repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Create Pull Request

## License

This project is licensed under the MIT License, see LICENSE file for details.

## Contact

- Project Homepage: [https://github.com/Porkast/porkast-next-app](https://github.com/Porkast/porkast-next-app)
- Telegram Bot: [@PorkcastBot](https://t.me/PorkcastBot)
- Issue Feedback: [GitHub Issues](https://github.com/Porkast/porkast-next-app/issues)
