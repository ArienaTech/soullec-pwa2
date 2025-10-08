# 🚀 Netlify Environment Variables Setup

## 📋 Overview
Your OpenAI API key has been revoked and needs to be updated in Netlify environment variables to restore horoscope reading functionality.

## 🔑 Step 1: Get a New OpenAI API Key

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Give it a name like "Netlify Horoscope App"
4. Copy the generated key (starts with `sk-`)

## ⚙️ Step 2: Update Netlify Environment Variables

### Option A: Using Netlify Dashboard (Recommended)

1. **Go to your Netlify site dashboard**
2. **Navigate to Site Settings**
   - Click on your site name
   - Go to "Site settings"

3. **Access Environment Variables**
   - In the left sidebar, click "Build & deploy"
   - Click "Environment variables"

4. **Update the OpenAI API Key**
   - Look for `OPENAI_API_KEY` variable
   - If it exists, click "Edit" and update the value
   - If it doesn't exist, click "Add variable"
     - Key: `OPENAI_API_KEY`
     - Value: Your new OpenAI API key (starts with `sk-`)
   - Click "Save"

### Option B: Using Netlify CLI

```bash
# Install Netlify CLI if you haven't already
npm install -g netlify-cli

# Login to Netlify
netlify login

# Set the environment variable (replace with your actual key)
netlify env:set OPENAI_API_KEY sk-your-new-api-key-here
```

## 🔄 Step 3: Redeploy Your Site

After updating the environment variable:

1. **Trigger a new deployment**
   - Go to "Deploys" in your Netlify dashboard
   - Click "Trigger deploy" → "Deploy site"
   
   OR
   
   - Push a new commit to your connected Git repository

2. **Wait for deployment to complete**
   - Monitor the deploy logs for any errors
   - Ensure the build completes successfully

## ✅ Step 4: Test the Horoscope Functionality

1. **Visit your deployed site**
2. **Test horoscope reading:**
   - Set up your birth information in the profile
   - Try generating a daily horoscope
   - Verify that it returns AI-generated content instead of errors

## 🛠️ Local Testing (Optional)

If you want to test locally first:

1. **Update your local `.env` file:**
   ```bash
   OPENAI_API_KEY=sk-your-new-api-key-here
   ```

2. **Run the test script:**
   ```bash
   node test-horoscope.js
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Test at http://localhost:5000**

## 🔍 Troubleshooting

### If horoscope still doesn't work:

1. **Check deployment logs:**
   - Go to Netlify dashboard → Deploys → Click on latest deploy
   - Look for any error messages in the build or function logs

2. **Verify environment variable:**
   - In Netlify dashboard → Site settings → Environment variables
   - Ensure `OPENAI_API_KEY` is set and starts with `sk-`

3. **Check API key validity:**
   - Go to [OpenAI Usage](https://platform.openai.com/usage) to verify the key is active
   - Ensure you have sufficient credits/quota

4. **Common error messages:**
   - "Invalid API key" → Key is wrong or expired
   - "Quota exceeded" → Need to add billing/credits to OpenAI account
   - "Rate limit" → Too many requests, wait and try again

## 📞 Support

If you continue having issues:
1. Check the browser console for error messages
2. Check Netlify function logs for server-side errors
3. Verify your OpenAI account has sufficient credits

## 🎯 Expected Behavior After Fix

✅ Horoscope readings should generate personalized AI content  
✅ No "API key invalid" or similar errors  
✅ Content should be relevant to user's birth information  
✅ Multiple horoscope types should work (Western, Chinese, Vedic, etc.)  