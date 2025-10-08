# 🚀 Complete Netlify Environment Variables Setup

## 🔧 Required Environment Variables

You need to set these environment variables in your Netlify dashboard to fix all the current errors:

### 1. OpenAI Configuration
```
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 2. Stripe Configuration (Client-side)
```
VITE_STRIPE_PUBLIC_KEY=pk_test_your-stripe-publishable-key-here
```

### 3. Stripe Configuration (Server-side)
```
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key-here
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret-here
```

### 4. Supabase Configuration
```
SUPABASE_URL=https://bqienrquqtphdwbqyogs.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📋 Step-by-Step Setup

### Step 1: Get Your API Keys

#### OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)

#### Stripe Keys
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy **Publishable key** (starts with `pk_test_`)
3. Copy **Secret key** (starts with `sk_test_`)

#### Supabase Keys
1. Go to https://supabase.com/dashboard/project/bqienrquqtphdwbqyogs/settings/api
2. Copy **anon/public** key
3. Copy **service_role** key (click "Reveal")

### Step 2: Add to Netlify Dashboard

1. **Go to your Netlify site dashboard**
2. **Navigate to Site Settings → Build & deploy → Environment variables**
3. **Add each variable:**

   Click "Add variable" for each:
   
   | Variable Name | Value | Notes |
   |---------------|-------|-------|
   | `OPENAI_API_KEY` | `sk-...` | Your OpenAI API key |
   | `VITE_STRIPE_PUBLIC_KEY` | `pk_test_...` | Stripe publishable key |
   | `STRIPE_SECRET_KEY` | `sk_test_...` | Stripe secret key |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Stripe webhook secret |
   | `SUPABASE_URL` | `https://bqienrquqtphdwbqyogs.supabase.co` | Your Supabase URL |
   | `SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Supabase anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | Supabase service role key |

4. **Save all variables**

### Step 3: Redeploy

1. Go to **Deploys** tab
2. Click **Trigger deploy → Deploy site**
3. Wait for deployment to complete

## 🎯 What This Fixes

✅ **Stripe Error**: `VITE_STRIPE_PUBLIC_KEY` will fix the "empty string" Stripe error  
✅ **API 404 Errors**: Netlify configuration will route `/api/*` to serverless functions  
✅ **Horoscope Functionality**: `OPENAI_API_KEY` will enable AI-generated horoscopes  
✅ **Database Access**: Supabase keys will enable user sessions and data storage  
✅ **Missing Assets**: Added favicon and icons to prevent 404s  

## 🔍 Verification

After deployment, check:

1. **No Stripe errors** in browser console
2. **API endpoints work**: `/api/user/session` should return data
3. **Horoscope generation** works without errors
4. **No 404 errors** for favicon/icons

## ⚠️ Important Notes

- **VITE_** prefix is required for client-side environment variables in Vite
- **Never expose secret keys** (those starting with `sk_`) on the client side
- **Test with Stripe test keys** before using live keys
- **Supabase service role key** bypasses Row Level Security - keep it secure

## 🆘 Troubleshooting

### Still getting Stripe errors?
- Verify `VITE_STRIPE_PUBLIC_KEY` is set (with VITE_ prefix)
- Check it starts with `pk_test_` for test mode

### API endpoints still 404?
- Ensure `netlify.toml` is in your repository root
- Check deployment logs for function build errors

### Horoscope not working?
- Verify `OPENAI_API_KEY` starts with `sk-`
- Check OpenAI account has sufficient credits

### Database errors?
- Verify all three Supabase environment variables are set
- Check Supabase project is active