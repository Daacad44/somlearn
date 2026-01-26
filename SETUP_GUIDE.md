# Somlearn - Complete Setup Guide (Updated)

## 🚀 Quick Start

### Step 1: Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Get Your FREE Google Gemini API Key

**Google AI Studio (Gemini) - 100% FREE! 🎉**

1. Visit: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)
5. **Cost:** COMPLETELY FREE - No credit card required!

### Step 3: Configure API Keys

Create/Edit `.env` file in the `frontend` directory:

```env
# Google Gemini API Key (FREE - Required)
VITE_GEMINI_API_KEY=AIzaSy...your-key-here

# Image APIs (Optional - both FREE)
VITE_UNSPLASH_ACCESS_KEY=your-unsplash-key-here
VITE_PEXELS_API_KEY=your-pexels-key-here
```

### Step 4: Run the Application

```bash
cd frontend
npm run dev
```

Access at: **http://localhost:5173**

## ✨ NEW Features

### 🎨 Enhanced Design
✅ **Beautiful Icons** - Every slide has relevant emoji icons
✅ **Gradient Backgrounds** - Professional glassmorphism effects
✅ **Smooth Animations** - Hover effects and transitions
✅ **Better Typography** - Enhanced readability

### 📥 Dual Export Options
✅ **PowerPoint (.pptx)** - Download as editable presentation
✅ **PDF Document (.pdf)** - Download as portable document
✅ **High Quality** - Professional formatting maintained

### 🛠️ Functional Editor Tools
✅ **Layout Tool** - Adjust slide layouts
✅ **Text Tool** - Edit text formatting
✅ **Design Tool** - Change colors and themes
✅ **Media Tool** - Add images and graphics

### 🤖 FREE AI Generation
✅ **Google Gemini** - Completely free AI content
✅ **Smart Icons** - Auto-selected based on content
✅ **Real Images** - From Unsplash/Pexels
✅ **No Cost** - Unlimited presentations!

## 💰 Cost Breakdown (ALL FREE!)

| Service | Cost | Limit |
|---------|------|-------|
| Google Gemini | **FREE** | 60 requests/minute |
| Unsplash | **FREE** | 5,000/hour |
| Pexels | **FREE** | Unlimited |

**Total Cost:** $0.00 per presentation! 🎉

## 🎯 How to Use

1. **Enter Topic** → e.g., "Climate Change Solutions"
2. **Select Options** → Slides count, style, template
3. **Click Generate** → AI creates content with icons
4. **Review & Edit** → Use toolbar to customize
5. **Export** → Download as PPT or PDF

## 📚 API Key Setup

### Google Gemini (Required)
- **URL:** https://aistudio.google.com/app/apikey
- **Steps:**
  1. Sign in with Google
  2. Click "Create API Key"
  3. Copy key to `.env` file
- **Free Tier:** 60 requests/minute (more than enough!)

### Unsplash (Optional)
- **URL:** https://unsplash.com/developers
- **Free:** 5,000 requests/hour

### Pexels (Optional)
- **URL:** https://www.pexels.com/api/
- **Free:** Unlimited requests

## 🔧 Troubleshooting

### Build Errors
```bash
npm run build
```

### Clear Cache
```bash
rm -rf node_modules package-lock.json
npm install
```

### API Not Working
- Check `.env` file has correct keys
- Restart dev server: `npm run dev`
- Check browser console for errors

## 📖 What's New

### v2.0 Updates
- ✅ Switched to FREE Google Gemini API
- ✅ Added PDF export functionality
- ✅ Enhanced UI with icons and gradients
- ✅ Functional editor toolbar
- ✅ Better slide thumbnails
- ✅ Improved animations

---

**Ready to create amazing presentations for FREE!** 🚀
