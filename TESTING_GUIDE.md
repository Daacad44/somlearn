# 🧪 Manual Testing Guide - Somlearn v2.1

## ✅ Latest Updates (v2.1)

### 1. 📝 Inline Editing
**Test:** Click on any Slide Title or Bullet Point text.
**Expected:** It should turn into an editable field. Type something new.
**Verify:** Navigate away and back. The changes should persist.

### 2. 📥 PDF Export (All Slides)
**Test:** Click "Export" -> "PDF Document".
**Expected:** The PDF should contain **ALL** slides (1-10), not just the first one.

### 3. 🖼️ PPT Export (With Images)
**Test:** Click "Export" -> "PowerPoint".
**Expected:** The downloaded PPTX file should include the actual images, not just placeholders.

### 4. 🤖 AI Content Quality
**Test:** Generate a new deck.
**Expected:** EVERY slide should have a unique title and content. No more "Key Insight 1, 2, 3" repetition.

---

## 🎯 Step-by-Step Testing

### Test 1: Dashboard (30 seconds)
1. Open **http://localhost:5173**
2. Enter topic: **"Space Exploration 2050"**
3. Click: **"Generate Deck"**

### Test 2: AI Generation (15 seconds)
**Expected:**
- Loading animation appears
- AI generates unique content
- Slide 1: Title
- Slide 2: Exec Summary
- Slide 3: Detailed Data...

### Test 3: Editing (1 minute)
1. Click on the big title "Space Exploration 2050"
2. Rename it to **"Mars Colonization 2050"**
3. Click a bullet point and add " - Updated by me"
4. Go to Slide 2, then back to Slide 1.
**Expected:** Your new text is still there.

### Test 4: Export PDF (1 minute)
1. Click Export → PDF Document
2. Open the file.
**Expected:** 10 Pages. Page 1 says "Mars Colonization 2050".

### Test 5: Export PPT (1 minute)
1. Click Export → PowerPoint
2. Open PPTX.
**Expected:** Images are present. Slide 1 says "Mars Colonization 2050".

---

## 🎨 Design Checklist
- [ ] Editable fields look like normal text when not focused
- [ ] Navy & Amber theme preserved
- [ ] Animations still smooth

---

## ✅ Success Criteria
**Your v2.1 is working correctly if:**
- You can edit text
- PDF has all slides
- PPT has images
- AI content is unique

**Enjoy the update!** 🚀
