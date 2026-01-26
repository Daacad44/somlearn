# 🔑 How to Get Your FREE Google Gemini API Key

## Step-by-Step Guide

### 1. Visit Google AI Studio
Go to: **https://aistudio.google.com/app/apikey**

### 2. Sign In
- Use your Google account (Gmail)
- If you don't have one, create a free Google account

### 3. Create API Key
1. Click the **"Create API Key"** button
2. Select **"Create API key in new project"** (recommended)
3. Your key will be generated instantly!

### 4. Copy Your Key
- The key starts with `AIza...`
- Click the copy button
- **IMPORTANT:** Save it somewhere safe!

### 5. Add to Somlearn
1. Open `d:/Somlearn/frontend/.env`
2. Paste your key:
   ```env
   VITE_GEMINI_API_KEY=AIzaSy...your-actual-key-here
   ```
3. Save the file
4. Restart the dev server

## ✅ Verification

After adding your key, test it:
1. Go to http://localhost:5173
2. Enter a topic like "Future of AI"
3. Click "Generate Deck"
4. Wait 10-15 seconds
5. You should see unique, AI-generated content!

## 💡 Key Features

### Free Tier Limits
- **60 requests per minute** (very generous!)
- **1,500 requests per day**
- **1 million tokens per month**

### What This Means
- You can generate **hundreds of presentations per day**
- Completely FREE forever
- No credit card required

## 🔒 Security Tips

1. **Never share your API key publicly**
2. **Don't commit `.env` to Git** (it's already in `.gitignore`)
3. **Regenerate if exposed** (easy to do in AI Studio)

## ❓ Troubleshooting

### "API key not configured" message
- Check `.env` file exists in `frontend` folder
- Verify key starts with `AIza`
- Restart dev server: `npm run dev`

### "Invalid API key" error
- Regenerate key in AI Studio
- Make sure no extra spaces in `.env`
- Check key is on correct line

### Still not working?
- Clear browser cache
- Check browser console for errors
- Verify internet connection

## 🎉 You're All Set!

Once your key is working, you can:
- Generate unlimited presentations
- Use all AI features for FREE
- Export to PPT and PDF
- Enjoy beautiful designs with icons

---

**Need help?** Check the console logs or create an issue on GitHub!
