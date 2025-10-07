# How to Get Your Database Connection String

## Step-by-Step with Screenshots Reference

### 1. Go to Your Project Settings
https://supabase.com/dashboard/project/bqienrquqtphdwbqyogs/settings/database

### 2. Look for "Connection String" Section
Scroll down the page until you see a section titled **"Connection String"**

### 3. You'll See Multiple Tabs:
- **URI** (this is what we need!)
- Session pooling
- Transaction pooling

### 4. Click on "URI" Tab
You should see something like:
```
postgresql://postgres.bqienrquqtphdwbqyogs:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### 5. Copy the Entire String
- Make sure you copy the WHOLE line
- It includes `[YOUR-PASSWORD]` which Supabase automatically fills in
- Or you might need to click "Show password" or replace `[YOUR-PASSWORD]` with your actual database password

---

## Alternative: If You Don't See "Connection String"

### Try "Database Settings" → "Connection Info"
Look for:
- Host
- Database name
- Port
- User
- Password

Then construct the URL manually:
```
postgresql://[USER].[PROJECT-REF]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```

For your project, it should be:
```
postgresql://postgres.bqienrquqtphdwbqyogs:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

## Can't Find It?

**Option 1: Reset Database Password**
1. Go to: https://supabase.com/dashboard/project/bqienrquqtphdwbqyogs/settings/database
2. Look for "Database Password" section
3. Click "Reset Database Password"
4. Copy the new password
5. Use this connection string:
```
postgresql://postgres.bqienrquqtphdwbqyogs:[NEW-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Option 2: Use Default Format**
Try this format (replace PASSWORD with your database password):
```
postgresql://postgres.bqienrquqtphdwbqyogs:PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

## Why Do We Need This?

The **anon key** you provided is for the Supabase JavaScript client (browser-side API calls).

But this app uses **Drizzle ORM** which connects directly to PostgreSQL, so it needs the database connection string.

Both are needed:
- ✅ Anon key (already have it) - for future Supabase client features
- ❌ Database URL (still need) - for Drizzle ORM database queries
