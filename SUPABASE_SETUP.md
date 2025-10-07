# Supabase Setup Guide for Soullec

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Project name: `soullec` (or your preferred name)
   - Database password: (save this securely)
   - Region: Choose closest to your users
5. Wait for the project to be created (~2 minutes)

## Step 2: Run the SQL Schema

1. In your Supabase project dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the entire contents of `supabase-schema.sql`
4. Paste it into the SQL editor
5. Click **"Run"** or press `Ctrl+Enter`

You should see success messages for all tables and indexes created.

## Step 3: Get Your Connection Details

### Option A: Direct PostgreSQL Connection (Recommended for Production)

1. Go to **Project Settings** → **Database**
2. Scroll down to **Connection String** → **URI**
3. Copy the connection string (it looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with your actual database password

### Option B: Supabase Client (Alternative)

1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep this secret!)

## Step 4: Update Environment Variables

Create or update your `.env` file in the project root:

```bash
# Supabase Connection (choose one method)

# Method 1: Direct PostgreSQL Connection (Current setup - works as-is)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres"

# OR Method 2: Supabase Client (requires code changes)
# SUPABASE_URL="https://xxxxxxxxxxxxx.supabase.co"
# SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
# SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# OpenAI API Key
OPENAI_API_KEY="sk-..."

# Stripe Keys
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Other settings
PORT=5000
NODE_ENV=development
```

## Step 5: Test the Connection

Run these commands to test your connection:

```bash
# Install dependencies (if not already done)
npm install

# Test database connection
npm run db:push

# Start the development server
npm run dev
```

## Step 6: Enable Realtime (Optional)

If you want real-time features in the future:

1. Go to **Database** → **Replication**
2. Enable replication for the tables you want to sync in real-time
3. Update your code to use Supabase Realtime features

## Important Notes

### Current Setup
The app is already configured to use PostgreSQL via Drizzle ORM, which means:
- ✅ **No code changes needed** - just update `DATABASE_URL`
- ✅ Supabase is just a managed PostgreSQL database
- ✅ All existing queries will work as-is

### Security

1. **Never commit your `.env` file** - it's already in `.gitignore`
2. Use the **service_role key** only on the backend (it bypasses RLS)
3. The SQL schema includes Row Level Security (RLS) policies
4. For anonymous users, the current policies allow all reads (you may want to adjust this)

### Database Management

```bash
# Push schema changes to database
npm run db:push

# Generate new migrations
npx drizzle-kit generate

# View your database in Supabase Studio
# Go to: https://supabase.com/dashboard/project/[your-project-id]
```

## Troubleshooting

### Connection Issues

```bash
# Test connection with psql
psql "postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
```

### SSL Certificate Errors

If you get SSL errors, update your connection string:
```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

### Schema Already Exists

If you get errors about tables already existing, either:
1. Drop the tables first (⚠️ deletes all data):
   ```sql
   DROP TABLE IF EXISTS payments CASCADE;
   DROP TABLE IF EXISTS messages CASCADE;
   DROP TABLE IF EXISTS users CASCADE;
   DROP TABLE IF EXISTS sessions CASCADE;
   ```
2. Or modify the schema to use `CREATE TABLE IF NOT EXISTS` (already done)

## Monitoring & Logs

- **Query Performance**: Database → Query Performance
- **API Logs**: Logs → API Logs
- **Database Logs**: Logs → Database Logs
- **Usage**: Home → Usage

## Next Steps

1. ✅ Schema created
2. ✅ Environment variables configured
3. 🔄 Test the application
4. 🔄 Set up Stripe webhooks (use your production URL)
5. 🔄 Deploy to production

## Production Checklist

- [ ] Use production Supabase project
- [ ] Update RLS policies for production security
- [ ] Set up database backups (automatic in Supabase)
- [ ] Enable Point-in-Time Recovery (PITR)
- [ ] Set up monitoring and alerts
- [ ] Update Stripe to production keys
- [ ] Configure proper CORS settings
