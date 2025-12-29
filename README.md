# CES Interactive Quiz Website

An interactive quiz game website for CES Las Vegas featuring a Spiraw/spirulina-themed quiz with game-style UI, real-time leaderboard, and timed questions.

## Features

- **Landing & Registration**: Game-themed landing page with registration form
- **Quiz Experience**: 15 questions with 15-second timer per question
- **Scoring System**: Points based on correctness and speed
- **Leaderboard**: Real-time leaderboard with top performers
- **Game Theme**: Neon effects, animations, and modern game UI
- **Responsive Design**: Optimized for tablets and mobile devices

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, TailwindCSS
- **Animations**: Framer Motion
- **Data Fetching**: SWR
- **Form Validation**: Zod + React Hook Form
- **Database**: MongoDB (using Mongoose)
- **Hosting**: Vercel

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

1. Create a MongoDB database. Recommended: **MongoDB Atlas** (free)
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free
   - Create a free cluster (M0 Sandbox)
   - Get your connection string

2. **No schema migration needed!** MongoDB creates collections automatically.

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ces_quiz?retryWrites=true&w=majority
SESSION_SECRET=your_random_session_secret_here
```

**MONGODB_URI Format Examples:**
- MongoDB Atlas: `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/ces_quiz?retryWrites=true&w=majority`
- Local: `mongodb://localhost:27017/ces_quiz`

**See `MONGODB_SETUP.md` for detailed setup instructions.**

### 4. Run Development Server

**Option A: Using npm**
```bash
npm run dev
```

**Option B: Using Docker (Recommended)**
```bash
# Start MongoDB and app with Docker Compose
docker-compose -f docker-compose.dev.yml up

# Or for production build
docker-compose up -d
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

**See [DOCKER.md](./DOCKER.md) for detailed Docker setup instructions.**

## Project Structure

```
/
├── app/
│   ├── api/              # API routes
│   ├── quiz/             # Quiz page
│   ├── leaderboard/      # Leaderboard page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css        # Global styles
├── components/
│   ├── ui/               # Reusable UI components
│   └── ...               # Game components
├── lib/
│   ├── db.ts             # Database connection
│   ├── questions.ts      # Quiz questions
│   ├── scoring.ts        # Scoring algorithm
│   └── validation.ts     # Zod schemas
└── types/
    └── index.ts           # TypeScript types
```

## Database Collections

- **registrations**: User registrations with session management
- **quizsubmissions**: Individual question submissions with timing
- Collections are created automatically when first used

## Security Features

- Rate limiting on API routes
- Session management with httpOnly cookies
- Input validation with Zod
- Timing validation to prevent cheating
- SQL injection prevention (Mongoose handles parameterization automatically)

## Deployment

### Quick Start

1. **Set Environment Variables** in your deployment platform:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   SESSION_SECRET=your_secure_random_string
   ```

2. **Run Database Schema**: Execute `lib/db-schema.sql` on your production database

3. **Deploy**: Push to your platform (Vercel, Netlify, Railway, etc.)

### Detailed Deployment Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions including:
- Platform-specific setup (Vercel, Netlify, Railway, Docker)
- Environment variable configuration
- Database connection optimization for serverless
- Security headers and production optimizations
- Troubleshooting guide

### Vercel (Recommended)

1. Push your code to GitHub
2. Import repository in Vercel
3. Add environment variables (`DATABASE_URL`, `SESSION_SECRET`)
4. Deploy - automatic on every push to main branch

## Quiz Rules

- 15 questions total
- 15 seconds per question
- Points awarded based on:
  - Correct answer: 100 base points
  - Speed bonus: Up to 100 additional points (faster = more points)
- Leaderboard ranked by total score, then by total time

## Customization

### Questions

Edit `lib/questions.ts` to modify quiz questions.

### Styling

Modify `app/globals.css` and component styles to customize the theme.

### Scoring

Adjust the scoring algorithm in `lib/scoring.ts`.

## License

MIT
