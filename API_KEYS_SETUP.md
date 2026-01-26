# Somlearn - API Keys Setup Guide

## Required API Keys

### 1. OpenAI API Key (Required for AI Content Generation)
**What it does:** Generates presentation content, titles, and bullet points using GPT-4

**How to get it:**
1. Go to https://platform.openai.com/signup
2. Create an account or sign in
3. Navigate to https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Copy the key (starts with `sk-...`)
6. **Cost:** Pay-as-you-go, ~$0.01-0.03 per presentation

**Add to `.env` file:**
```
OPENAI_API_KEY=sk-your-key-here
```

### 2. Unsplash API Key (Optional - For High-Quality Images)
**What it does:** Provides professional stock photos for slides

**How to get it:**
1. Go to https://unsplash.com/developers
2. Create an account
3. Create a new application
4. Copy the "Access Key"
5. **Cost:** Free (5,000 requests/hour)

**Add to `.env` file:**
```
UNSPLASH_ACCESS_KEY=your-access-key-here
```

### 3. Alternative: Pexels API (Free Alternative)
**What it does:** Another source for free stock photos

**How to get it:**
1. Go to https://www.pexels.com/api/
2. Sign up for free
3. Get your API key
4. **Cost:** Completely free

**Add to `.env` file:**
```
PEXELS_API_KEY=your-api-key-here
```

## Setup Instructions

1. Create a `.env` file in the `backend` directory:
   ```bash
   cd backend
   touch .env  # or create manually on Windows
   ```

2. Add your API keys to the `.env` file:
   ```env
   OPENAI_API_KEY=sk-your-openai-key-here
   UNSPLASH_ACCESS_KEY=your-unsplash-key-here
   PEXELS_API_KEY=your-pexels-key-here
   ```

3. The application will automatically use these keys

## Estimated Costs

- **OpenAI GPT-4:** $0.01-0.03 per presentation (10-15 slides)
- **Unsplash:** Free
- **Pexels:** Free

## Testing Without API Keys

The application includes fallback mock data, so you can test the UI without API keys. However, for production use with real AI-generated content, you'll need at least the OpenAI API key.
