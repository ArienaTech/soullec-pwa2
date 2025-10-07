# 🔍 Netlify Functions Debug Guide

## Current Setup:

### Functions Directory:
```
netlify/functions/
├── api-messages-generate.ts
├── api-user-profile.ts
├── api-user-session.ts
└── test.ts
```

### Expected URLs After Deploy:
- `/.netlify/functions/test`
- `/.netlify/functions/api-user-session`
- `/.netlify/functions/api-user-profile`
- `/.netlify/functions/api-messages-generate`

### Mapped API Routes:
- `/api/test` → `/.netlify/functions/test`
- `/api/user/session` → `/.netlify/functions/api-user-session`
- `/api/user/profile` → `/.netlify/functions/api-user-profile`
- `/api/messages/generate` → `/.netlify/functions/api-messages-generate`

---

## 🧪 How to Test:

### Step 1: Check if Functions Built
In Netlify Deploy Log, look for:
```
Packaging Functions from netlify/functions directory:
 - api-messages-generate.ts
 - api-user-profile.ts
 - api-user-session.ts
 - test.ts
```

### Step 2: Test Function Endpoints Directly
Try these URLs in your browser:

**Test endpoint (simplest):**
```
https://your-site.netlify.app/.netlify/functions/test
```

**Session endpoint:**
```
https://your-site.netlify.app/.netlify/functions/api-user-session
```

### Step 3: Check Environment Variables
In Netlify Dashboard → Site settings → Environment variables:

**Required:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

**Optional:**
- `VITE_STRIPE_PUBLIC_KEY`

---

## 🐛 Common Issues:

### Issue 1: Functions Not Found (404)
**Symptom:** `/api/user/session` returns 404
**Cause:** Functions didn't build or redirects aren't working

**Fix:**
1. Check deploy log for function build errors
2. Verify `netlify.toml` is in repo root
3. Try accessing `/.netlify/functions/api-user-session` directly

### Issue 2: Functions Build But Crash
**Symptom:** 500 error or function timeout
**Cause:** Missing environment variables or runtime errors

**Fix:**
1. Check function logs in Netlify dashboard
2. Verify all environment variables are set
3. Check for TypeScript/dependency errors

### Issue 3: Redirects Don't Work
**Symptom:** `/api/test` works but `/api/user/session` doesn't
**Cause:** Redirect rules order or syntax

**Fix:**
1. Specific redirects must come BEFORE wildcard `/*`
2. Use `status = 200` for rewrites (not 301/302)

---

## 📊 Next Steps:

1. **Wait for current deployment to finish (2-3 min)**
2. **Open browser and test:**
   - First: `https://your-site.netlify.app/.netlify/functions/test`
   - Then: `https://your-site.netlify.app/api/test`
3. **Check Netlify Deploy Log** for function build messages
4. **Report back what you see!**

---

## 🚨 If Still Not Working:

### Option 1: Check Build Log
Share the "Functions" section from your deploy log

### Option 2: Try Direct Function URL
If `/.netlify/functions/test` returns JSON but `/api/test` returns 404, the redirect isn't working

### Option 3: Verify netlify.toml
Make sure it's in the root of your repo and committed

---

**Let me know what happens when you test `/api/test`!**