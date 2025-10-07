# ✅ Setup Checklist for Your Supabase Project

Your Supabase project: **bqienrquqtphdwbqyogs**

## 📋 Step-by-Step Setup

### ✅ Step 1: Run the SQL Schema (REQUIRED)

1. Go to your SQL Editor: https://supabase.com/dashboard/project/bqienrquqtphdwbqyogs/sql/new
2. Copy **ALL** the contents from `supabase-schema.sql` (in this project)
3. Paste it into the SQL editor
4. Click **Run** (or press Ctrl+Enter)
5. Verify you see success messages

**What this creates:**
- ✅ `users` table (accounts, soul gems, referrals)
- ✅ `messages` table (AI responses)
- ✅ `payments` table (Stripe transactions)
- ✅ `sessions` table (authentication)

---

### 🔐 Step 2: Get Your Database Password (REQUIRED)

1. Go to: https://supabase.com/dashboard/project/bqienrquqtphdwbqyogs/settings/database
2. Scroll down to **"Connection String"**
3. Click on **"URI"** tab
4. You'll see something like:
   ```
   postgresql://postgres.bqienrquqtphdwbqyogs:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
5. Copy the FULL string (it includes your password)

---

### 📝 Step 3: Update Your .env File

I've created a `.env` file for you with your Supabase details. Now update these values:

```bash
# Replace [YOUR-DATABASE-PASSWORD] with your actual password from Step 2
DATABASE_URL="postgresql://postgres.bqienrquqtphdwbqyogs:[YOUR-DATABASE-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# Add your OpenAI API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-..."

# Add your Stripe keys from: https://dashboard.stripe.com/apikeys
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

---

### 🚀 Step 4: Test Your Setup

```bash
# Install dependencies
npm install

# Test the build
npm run build

# Start the development server
npm run dev
```

Visit: http://localhost:5000

---

## 🔑 Where to Get API Keys

### OpenAI API Key (REQUIRED for AI features)
1. Go to: https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Copy the key (starts with `sk-proj-...`)
4. Paste it in `.env` as `OPENAI_API_KEY`

### Stripe Keys (REQUIRED for payments)
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy **Publishable key** → `STRIPE_PUBLIC_KEY` in `.env`
3. Copy **Secret key** → `STRIPE_SECRET_KEY` in `.env`

### Stripe Webhook Secret (for payment notifications)
1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click **"Add endpoint"**
3. Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
4. Select events: `checkout.session.completed`, `payment_intent.succeeded`
5. Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET` in `.env`

---

## ✅ Verification Checklist

- [ ] SQL schema run successfully in Supabase
- [ ] DATABASE_URL updated with real password in `.env`
- [ ] OPENAI_API_KEY added to `.env`
- [ ] STRIPE_SECRET_KEY added to `.env`
- [ ] STRIPE_PUBLIC_KEY added to `.env`
- [ ] `npm install` completed
- [ ] `npm run dev` starts without errors
- [ ] Can access http://localhost:5000

---

## 🎯 Quick Links for Your Project

- **SQL Editor**: https://supabase.com/dashboard/project/bqienrquqtphdwbqyogs/sql
- **Database Settings**: https://supabase.com/dashboard/project/bqienrquqtphdwbqyogs/settings/database
- **API Settings**: https://supabase.com/dashboard/project/bqienrquqtphdwbqyogs/settings/api
- **Table Editor**: https://supabase.com/dashboard/project/bqienrquqtphdwbqyogs/editor
- **Logs**: https://supabase.com/dashboard/project/bqienrquqtphdwbqyogs/logs/explorer

---

## 🆘 Troubleshooting

### Error: "connect ECONNREFUSED"
- ❌ DATABASE_URL is missing or incorrect
- ✅ Go to Step 2 and get the correct connection string

### Error: "Invalid API key"
- ❌ OPENAI_API_KEY is missing or invalid
- ✅ Check your key at https://platform.openai.com/api-keys

### Error: "relation does not exist"
- ❌ SQL schema not run in Supabase
- ✅ Go to Step 1 and run the full SQL script

### Error: "SSL error"
- ❌ Connection string might be wrong
- ✅ Make sure you're using the "Transaction" or "Session" pooler URL

---

## 📊 View Your Data

Once the app is running:
1. Create a test user in the app
2. View the data in Supabase: https://supabase.com/dashboard/project/bqienrquqtphdwbqyogs/editor

---

## 🎉 Next Steps After Setup

1. Test all features (messages, manifestations, tarot, horoscope)
2. Set up Stripe webhook for payment processing
3. Deploy to production (Vercel, Railway, etc.)
4. Update RLS policies for production security

---

**Need help?** Check the detailed guide in `SUPABASE_SETUP.md`
