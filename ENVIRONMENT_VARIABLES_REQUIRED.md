# ⚠️ CRITICAL: Environment Variables MUST Be Set in Netlify

## 🚨 The functions will FAIL if these aren't set!

Even if the functions build, they'll crash at runtime without these variables.

---

## ✅ Required Environment Variables:

Go to **Netlify Dashboard** → **Site settings** → **Environment variables**

Click **"Add a variable"** and add these **3 REQUIRED variables:**

### 1. SUPABASE_URL
```
https://your-project.supabase.co
```

### 2. SUPABASE_SERVICE_ROLE_KEY  
```
eyJ... (your service role key from Supabase)
```

### 3. OPENAI_API_KEY
```
sk-proj-... (the key you gave me earlier)
```

---

## 🎯 How to Get These Values:

### Supabase URL & Key:
1. Go to https://supabase.com/dashboard
2. Click your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → use for `SUPABASE_URL`
   - **service_role key** (secret!) → use for `SUPABASE_SERVICE_ROLE_KEY`

### OpenAI API Key:
Use the one you gave me:
```
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
```

---

## 🔍 After Adding Variables:

1. **Trigger a new deploy** (Deploys → Trigger deploy → Clear cache and deploy site)
2. **Wait 3 minutes**
3. **Test the site**

---

## ⚠️ IMPORTANT:

Without these environment variables, the functions will:
- Build successfully ✅
- But crash when called ❌
- Return 500 errors or timeouts

This might be why you're getting 404s - the functions might be crashing immediately!

---

**Have you set these 3 environment variables in Netlify?**

If NO → Set them now!
If YES → Wait for the current deployment to finish (2 min left)