# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

```bash
# Development
yarn dev                    # Start dev server at localhost:3000

# Build & Deploy
yarn build                  # Generate Prisma client + Next.js production build
yarn start                  # Start production server
yarn lint                   # Run ESLint
yarn update-types           # Generate Supabase TypeScript types

# Database
npx prisma generate         # Generate Prisma client
npx prisma db push          # Sync schema to database
```

## Project Architecture

### Directory Overview

- **`app/`** - Next.js App Router pages and API routes
- **`components/`** - React UI components (client components use `'use client'`)
- **`libs/`** - Business logic and utilities (auth, database, API integrations)
- **`types/`** - TypeScript type definitions
- **`prisma/`** - Database schema (PostgreSQL via Prisma)
- **`supabase/`** - Supabase configuration and Edge functions

### Key Patterns

**API Response Format**: All API routes return `{ code: number, message: string, data: any }`. Use `JsonResponse` type from `types/response.ts`.

**Prisma Client**: Use the singleton from `libs/prisma.ts` to avoid connection exhaustion in development.

**Authentication**:
- Supabase Auth with JWT verification in `middleware.ts`
- Protected routes verify tokens via `jose` library
- Session refresh handled by Supabase auth helpers

**External APIs**:
- iTunes API in `libs/itunes.ts`
- Spotify API in `libs/spotify.ts`
- RSS parsing via `rss-parser` in various API routes

### Database Schema

Two Prisma schemas: `auth` (Supabase) and `public` (application). Main tables:
- `feed_channel` / `feed_item` - Podcast data
- `user_subscription` - User subscriptions
- `user_playlist` / `user_playlist_item` - Playlists
- `user_listen_later` - Listen later queue

### Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL` (PostgreSQL connection string)
- `CRON_SECRET` - For background job authentication
- `RESEND_API_KEY` - For email functionality
