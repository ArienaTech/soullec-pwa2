# Soullec - AI-Powered Spiritual Guidance App

## Overview

Soullec is a mobile-first Progressive Web App (PWA) that delivers personalized spiritual insights, tarot readings, horoscopes, and manifestation affirmations using AI. The app uses a freemium model with "Soul Gems" as virtual currency, allowing users to access mystical guidance through free daily credits or paid options. Built with React, Express, and PostgreSQL, it features a mystical aesthetic inspired by wellness apps like Calm and Co-Star.

## Monetization Strategy

**Soul Gems Currency System:**
- Virtual currency called "Soul Gems" (💎) for all features
- Each reading costs 1 Soul Gem (Messages, Manifestations, Tarot, Horoscope)

**Free Tier (No Signup):**
- 1 free Soul Gem daily (auto-replenished at midnight)
- Access to all features with daily limit
- Earn 5 bonus gems by redeeming a friend's referral code

**Pay-Per-Use (No Signup):**
- $0.99 USD = 5 Soul Gems
- $2.99 USD = 15 Soul Gems
- $4.99 USD = 30 Soul Gems
- One-time purchases via Stripe

**Premium Subscription (Requires Signup):**
- $9.99 USD/month = Unlimited Soul Gems
- Replit Auth integration (Google/GitHub/Email)
- Premium badge indicator
- Linked to Stripe subscription

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Updates (October 7, 2025)

- **Rebranded to Soullec**: Changed app name from Manifestly to Soullec across all app metadata, translations (11 languages), and documentation

- **🎁 Viral Referral System** (Growth Engine):
  - **Unique referral codes**: Each user gets a 6-character alphanumeric code (e.g., "A3X9K2")
  - **Generous rewards**: Referrer gets 10 gems, referee gets 5 gems when code is redeemed
  - **Built-in safeguards**: Prevents self-referral and duplicate code usage
  - **Copy-to-share UI**: One-click copy button for easy sharing
  - **Referral tracking**: Users see how many friends they've referred
  - **Database schema**: Added referralCode (unique), referredBy (user ID), referralCount (default 0)
  - **API endpoints**: POST /api/referral/generate, POST /api/referral/redeem
  - **Implementation**: Both PostgresStorage and MemStorage support referral operations
  - **Note**: Referral stats update on page refresh (no real-time WebSocket updates)

- **Soul Gems Credit System**: Implemented atomic virtual currency monetization:
  - **Reduced to 1 free gem daily** (down from 3) to increase perceived value of referrals and drive purchases
  - Pay-per-use gem purchases: $0.99 (5 gems), $2.99 (15 gems), $4.99 (30 gems)
  - $9.99/month Soullec Premium subscription (unlimited gems)
  - 1 gem per reading for all features (Messages, Manifestations, Tarot, Horoscope)
  - **Atomic deduction prevents double-spending**: SQL UPDATE with WHERE clause ensures race-condition-safe gem consumption in both PostgresStorage and MemStorage
- **Real-time Balance Display**: Gem balance shown in navbar with automatic updates after each reading

- **✅ Replit Auth Implementation** (Fully Functional):
  - **Anonymous users continue working without login** - 1 daily free gem or pay-per-use
  - **Login/Logout buttons** in navbar (moved to end of navbar per user request)
  - **Premium subscription requires authentication** - Users must sign in to subscribe to $9.99/month unlimited gems
  - **OAuth providers**: Google and Email/Password (configurable in Replit workspace settings)
  - **Session management**: PostgreSQL session storage with 1-week expiration
  - **Profile page integration**: Shows account status, email, and Premium upgrade button for authenticated users
  - **Authentication endpoints**: `/api/login`, `/api/logout`, `/api/callback`, `/api/auth/user`, `/api/auth/link`

- **🔗 Account Linking System** (Critical Feature):
  - **Seamless data migration**: When anonymous users log in, their data is automatically transferred to their authenticated account
  - **Additive gem balance**: Anonymous gems + authenticated gems = final balance (no gems lost)
  - **Complete profile merge**: Transfers all profile data (birthDate, religion, horoscope preferences, etc.)
  - **Message/payment history**: All anonymous messages and payments transferred to authenticated account
  - **Race-condition safe**: Transfer dependencies first → merge data → delete anonymous user
  - **Error resilient**: If linking fails, keeps anonymous ID in localStorage so free tier still works
  - **User notification**: Success toast shows "Account Linked - Your gems and history have been transferred!"
  - **Implementation**: `linkAnonymousToAuthenticated()` in both PostgresStorage and MemStorage

- **🌟 MAJOR FEATURE: Faith-Aligned Spiritual Guidance** (Key Differentiator):
  - **All readings personalized to user's religion preference**
  - **Specific scripture/sacred text references** in every reading:
    - Christianity: Bible verses, Jesus' teachings, Christian concepts (grace, faith, prayer)
    - Islam: Quranic verses, Hadith wisdom, Islamic principles (tawakkul, sabr, dua)
    - Buddhism: Buddha's sutras, Four Noble Truths, Eightfold Path, mindfulness teachings
    - Hinduism: Bhagavad Gita wisdom, dharma/karma concepts, mantras
    - Judaism: Torah/Talmud wisdom, mitzvot, tikkun olam
    - Other traditions supported with authentic spiritual guidance
  - **Integrated across ALL features**: Messages, Manifestations, Tarot, Horoscopes
  - **Deep integration, not superficial**: Readings feel like spiritual counsel from within the user's own faith tradition
  - **Automatic translation**: Religion-aligned guidance preserved when changing languages

### Previous Updates (October 6, 2025)

- **Expanded Horoscope Systems**: Now supports 6 culturally-relevant systems:
  - Western Zodiac (12 signs)
  - Vedic/Jyotish (27 Nakshatras, doshas)
  - Japanese (12 animals, 5 elements, blood type)
  - Korean Saju (천간/지지, 오행)
  - Thai Lanna (12 animals with unique traits)
  - Chinese Bazi (八字 - Four Pillars of Destiny)

- **Virtual Tarot Reading Feature**: 
  - 22 Major Arcana card database with upright/reversed meanings
  - GPT-4o-powered mystical interpretations
  - 3-card Past-Present-Future spread
  - Animated card flip effects using Framer Motion
  - Multi-language support for readings
  - Integrated into Home page with dedicated button

- **Language Control**: Globe icon in navbar is now the exclusive language selector (removed from Profile page per user request)

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and API caching

**UI Framework**
- Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Custom theme system supporting light/dark modes with CSS variables
- Mobile-first responsive design approach

**Design System**
- Color palette: Soft lavender, cosmic blue, and pink glow for light mode; deep purple-black and vibrant pink for dark mode
- Typography: Playfair Display (headers), Dancing Script (affirmations), Inter (body)
- Gradient overlays for mystical aesthetic
- Spacing follows Tailwind's 4-point scale

**State Management**
- Local storage for user session persistence (user ID, streak tracking, theme preference)
- TanStack Query for server data caching and synchronization
- React hooks for component-level state

### Backend Architecture

**Server Framework**
- Express.js with TypeScript running on Node.js
- RESTful API design with route handlers in `server/routes.ts`
- Middleware for JSON parsing, logging, and error handling
- Raw body parser for Stripe webhook validation

**API Endpoints**
- `POST /api/user/session` - Create or retrieve anonymous user sessions
- `POST /api/messages/generate` - Generate AI-powered Barnum messages from emotional input
- `POST /api/messages/affirmation` - Generate manifestation affirmations
- `POST /api/tarot/reading` - Generate tarot readings with card draws and GPT-4 interpretations
- `POST /api/horoscope/daily` - Generate personalized daily horoscope readings
- Stripe payment and webhook endpoints for monetization

**AI Integration**
- OpenAI GPT-4o for highly personalized, emotionally resonant content generation
- Deep emotion detection with nuance analysis (hopeful, stressed, in love, lost, grateful, anxious, peaceful, uncertain, empowered)
- Advanced prompting system designed for addictive, shareable content:
  - References specific user words/phrases for personalization
  - Concrete horoscope connections (mentions actual animals, elements, pillars)
  - Actionable daily guidance with specific timing and predictions
  - Visceral, sensory language that creates emotional resonance
  - Strategic hooks that encourage daily return visits
- High temperature (0.9) for creative, unique responses
- Extended token limits (400 tokens) for richer, more detailed messages

### Data Storage

**Database**
- PostgreSQL via Neon serverless driver
- Drizzle ORM for type-safe database queries and migrations
- Connection pooling for efficient database access

**Schema Design**
- `users` table: Tracks user IDs, email (optional), subscription status, Stripe customer/subscription IDs
- `messages` table: Stores user inputs, AI responses, detected emotions, and message types
- `payments` table: Records payment transactions with amount, type, and Stripe payment IDs
- UUID primary keys generated by PostgreSQL's `gen_random_uuid()`

**Data Access Layer**
- Storage interface (`IStorage`) for abstraction and testability
- SupabaseStorage implementation using Drizzle ORM
- CRUD operations for users, messages, and payments

### External Dependencies

**Payment Processing**
- Stripe for payment collection (one-time $1.99 purchases and $9.99/month subscriptions)
- Stripe Elements for secure payment forms
- Webhook handling for subscription lifecycle events
- Client-side: `@stripe/stripe-js` and `@stripe/react-stripe-js`
- Server-side: `stripe` SDK for API interactions

**AI Services**
- OpenAI API (GPT-5 model) for natural language processing
- Emotion detection via chat completions with JSON response format
- Message generation with customizable tone mapping
- Affirmation creation in present-tense, cinematic style

**Database**
- Neon PostgreSQL serverless database
- `@neondatabase/serverless` driver for connection management
- Drizzle ORM (`drizzle-orm`) for query building and schema management
- `drizzle-kit` for migrations

**Session Management**
- Anonymous user sessions tracked via localStorage
- No authentication required for initial usage
- Session persistence across page refreshes

**Image Generation**
- `html-to-image` library for converting DOM elements to shareable images
- Canvas-based rendering for social media sharing

**PWA Features**
- Service worker support (configured in `manifest.json`)
- Offline capability readiness
- Mobile app-like experience with standalone display mode