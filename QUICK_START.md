# 🚀 Quick Start - Supabase Setup

## 1️⃣ Run This SQL in Supabase

Go to your Supabase project → **SQL Editor** → Copy and run the SQL from **`supabase-schema.sql`**

## 2️⃣ Get Your Database Connection String

1. Supabase Dashboard → **Settings** → **Database**
2. Scroll to **Connection String** → **URI**
3. Copy the string, it looks like:
   ```
   postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

## 3️⃣ Create `.env` File

Create a file named `.env` in the project root:

```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
OPENAI_API_KEY="sk-..."
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
PORT=5000
NODE_ENV=development
```

Replace `[YOUR-PASSWORD]` with your actual Supabase database password.

## 4️⃣ Start the App

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5000`

---

## 📋 Database Tables Created

The SQL script creates these tables:

### `users` - User accounts
- id, email, name, profile data
- subscription_status, stripe IDs
- soul_gems (virtual currency)
- birth info, religion, horoscope preferences
- referral system (referral_code, referred_by, referral_count)

### `messages` - AI-generated content
- User inputs and AI responses
- Emotion detection
- Type: message, affirmation, tarot, horoscope

### `payments` - Transaction history
- Payment amounts and types
- Stripe payment IDs

### `sessions` - Auth sessions
- For Replit Auth integration

---

## 🔐 Environment Variables Needed

| Variable | Where to Get It | Required? |
|----------|----------------|-----------|
| `DATABASE_URL` | Supabase → Settings → Database | ✅ Yes |
| `OPENAI_API_KEY` | https://platform.openai.com/api-keys | ✅ Yes |
| `STRIPE_SECRET_KEY` | https://dashboard.stripe.com/apikeys | ✅ Yes |
| `STRIPE_PUBLIC_KEY` | https://dashboard.stripe.com/apikeys | ✅ Yes (client) |
| `STRIPE_WEBHOOK_SECRET` | https://dashboard.stripe.com/webhooks | ⚠️ For payments |

---

## ✅ Verify Setup

```bash
# Test TypeScript compilation
npm run check

# Build the app
npm run build

# Start development server
npm run dev
```

---

## 📚 Full Documentation

- **Full setup guide**: See `SUPABASE_SETUP.md`
- **SQL schema**: See `supabase-schema.sql`
- **Env template**: See `.env.example`

## 🆘 Need Help?

- Connection issues? Check `SUPABASE_SETUP.md` → Troubleshooting section
- Database errors? Make sure you ran the full SQL script
- SSL errors? Add `?sslmode=require` to your DATABASE_URL
