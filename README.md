<div align="center">
  <img src="public/porkast-text-logo-white.jpg" alt="Porkast Logo" width="400" />
  <h3>Discover, Subscribe, Share - Your Personalized Podcast Platform</h3>

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
  [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

---

## 🚀 Overview

**Porkast** is a modern, full-stack podcast exploration and management platform. It allows users to discover new content, curate personal playlists, and generate custom RSS feeds that can be used in any standard podcast player.

Whether you're looking to follow specific topics via keyword subscriptions or manage a "Listen Later" queue, Porkast provides a seamless experience across web and Telegram.

## ✨ Key Features

- 🔍 **Advanced Discovery**: Search millions of podcasts powered by iTunes and Spotify APIs.
- 📬 **Smart Subscriptions**: Subscribe to specific podcasts or **keywords** to automatically track new episodes matching your interests.
- 🎵 **Personalized Playlists**: Create, manage, and share custom podcast playlists.
- ⏳ **Listen Later**: A dedicated queue for episodes you want to catch up on.
- 📡 **RSS Feed Generation**: Turn your subscriptions, playlists, and "Listen Later" queue into personal RSS feeds compatible with any podcast app (Overcast, Pocket Casts, etc.).
- 🤖 **Telegram Integration**: Full-featured [Telegram Bot](https://t.me/PorkcastBot) to manage your podcast life on the go.
- 📧 **Notifications**: Stay updated with new episode alerts via email.
- 🌓 **Modern UI**: Clean, responsive design with dark/light mode support.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Authentication**: Custom Email OTP Auth (JWT-based)
- **Database**: PostgreSQL
- **ORM**: [Prisma](https://www.prisma.io/)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **Audio Engine**: [Shikwasa](https://github.com/the-mugen/shikwasa)
- **Email Service**: [Resend](https://resend.com/) & [React Email](https://react.email/)
- **RSS Parsing**: [rss-parser](https://www.npmjs.com/package/rss-parser)

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and Yarn/NPM/PNPM
- A PostgreSQL database
- Resend API key (for emails)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/porkast.git
   cd porkast
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file (or copy from `.env.sample`) and fill in your credentials:

   ```bash
   cp .env.sample .env.local
   ```

4. **Initialize Database:**

   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run the development server:**

   ```bash
   yarn dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```text
├── app/              # Next.js App Router (Pages & API)
├── components/       # Reusable React UI components
├── libs/             # Business logic, DB clients, and utilities
├── prisma/           # Database schema and migrations
├── public/           # Static assets (images, logos)
├── types/            # TypeScript type definitions
└── middleware.ts     # Auth & session middleware
```

## 🤖 Telegram Bot

Porkast is also available as a Telegram Bot. Check out the source code for the bot (if in a separate repo) or use it directly at [@PorkcastBot](https://t.me/PorkcastBot).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  Developed with ❤️ for the Podcast Community.
</div>
