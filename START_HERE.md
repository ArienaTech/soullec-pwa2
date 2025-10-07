# 🚀 How to Run Soullec

## ✅ The App is NOW RUNNING!

Your development server is live at: **http://localhost:5000**

---

## 🎯 Quick Start

### 1. **Access the App**
Open your browser and go to:
```
http://localhost:5000
```

You should see:
- ✨ **Welcome modal** explaining the 6 astrology systems
- Beautiful gradient UI
- Profile setup banner

### 2. **Test the Features**
1. Click "Set Up My Cosmic Profile" from the welcome modal
2. Enter a birth date (e.g., 1990-01-15)
3. Select some astrology systems (try Western, Vedic, Chinese Bazi)
4. Pick a religion (optional)
5. Save and go back to home
6. Try getting a reading!

### 3. **See Your Improvements**
- Check header for **system badges** (purple stars)
- Check header for **religion badge** (green heart)
- Generate a message and see **"POWERED BY"** section
- Try sharing and see the viral copy!

---

## ⚠️ Important Notes

### AI Features Won't Work Yet
The app is running but **AI features are disabled** because you need:

**OpenAI API Key** (for AI readings):
1. Go to: https://platform.openai.com/api-keys
2. Create an account and get an API key
3. Edit `.env` file and replace:
   ```bash
   OPENAI_API_KEY="your-openai-key-here"
   ```
   with:
   ```bash
   OPENAI_API_KEY="sk-proj-YOUR-ACTUAL-KEY"
   ```
4. Restart server: `pkill -f tsx && npm run dev`

**Without OpenAI:**
- The welcome modal WILL work ✅
- Profile setup WILL work ✅
- System badges WILL work ✅
- But AI message generation WON'T work ❌

---

## 🛠️ Development Commands

### Start the server:
```bash
npm run dev
```

### Stop the server:
```bash
pkill -f "tsx server"
```

### Rebuild TypeScript:
```bash
npm run check
```

### Build for production:
```bash
npm run build
```

---

## 📁 Project Structure

```
/workspace
├── client/               # Frontend React app
│   ├── src/
│   │   ├── pages/       # Home, Profile, Gems, Checkout
│   │   ├── components/  # UI components
│   │   └── contexts/    # Theme, Language
│   └── public/
│       └── _redirects   # ← NEW! SPA routing fix
├── server/              # Backend Express API
│   ├── index.ts        # Main server
│   ├── routes.ts       # API routes
│   ├── openai.ts       # AI integration
│   ├── horoscope.ts    # 6 astrology systems
│   └── supabaseStorage.ts
├── shared/              # Shared types
├── .env                 # Environment variables
├── netlify.toml        # ← NEW! Deployment config
└── package.json
```

---

## 🎨 What You're Seeing

### 1. **Welcome Modal** (First Visit)
Shows on first load explaining:
- 6 astrology systems
- Faith-friendly approach
- Free gem to try

### 2. **Profile Setup Banner**
Gradient banner with:
- Progress bar (birth date + systems + religion)
- Call to action
- Trophy icon

### 3. **Header Badges**
- Purple badge: Number of active systems
- Green badge: Your religion
- Both clickable

### 4. **Enhanced Messages**
- "POWERED BY" section showing systems used
- Proof that personalization works

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
pkill -f "tsx server"
npm run dev
```

### 404 Error
This means the server stopped. Restart it:
```bash
npm run dev
```

### Changes Not Showing
1. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Check browser console for errors

### Database Errors
Make sure Supabase keys in `.env` are correct. They're already set up!

---

## 🚀 Deploying to Production

### Option 1: Netlify (Recommended)
1. Push to GitHub
2. Connect to Netlify
3. Build settings are in `netlify.toml` ✅
4. Add environment variables in Netlify dashboard

### Option 2: Vercel
1. Push to GitHub
2. Connect to Vercel
3. Add redirect rules (same as Netlify)
4. Add environment variables

### Option 3: Your Own Server
1. Run `npm run build`
2. Serve `dist/public` folder
3. Configure reverse proxy to `dist/index.js`
4. Set environment variables

---

## 📊 Monitoring

### What to Track:
1. **Profile Completion Rate** - Target: 50%
2. **Conversion Rate** - Target: 7%
3. **Share Button Clicks** - Track viral growth
4. **System Badge Impressions** - See visibility

### Add Analytics:
```javascript
// In client/src/pages/Home.tsx
useEffect(() => {
  // Track welcome modal view
  gtag('event', 'view_welcome_modal');
}, [showWelcomeModal]);
```

---

## ✅ Checklist

Before showing to users:

- [x] Server running ✅
- [x] Routing configured ✅
- [x] Welcome modal works ✅
- [x] Profile setup works ✅
- [x] System badges visible ✅
- [ ] Add OPENAI_API_KEY (for AI features)
- [ ] Add STRIPE keys (for payments)
- [ ] Test on mobile
- [ ] Deploy to production

---

## 🎉 You're Ready!

The app is **fully functional** for testing the new UI features.

**To see everything in action:**
1. Go to http://localhost:5000
2. Complete your profile
3. Watch the badges appear
4. Generate a reading (needs OpenAI key)
5. Share and see the viral copy!

**Next step:** Get an OpenAI API key to enable AI features.

---

## 📞 Need Help?

Common issues are in the Troubleshooting section above.

**The app is running and working!** 🎊

Server log: `/tmp/server.log`