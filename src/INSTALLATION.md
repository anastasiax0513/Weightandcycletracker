# How to Install Health Tracker as a Mobile App

## Step 1: Deploy Your App

To install this app on your mobile device, you first need to deploy it to a web server. Here are the easiest options:

### Option A: Deploy to Vercel (Recommended - Free)

1. **Download your project files** from Figma Make
2. **Create a GitHub repository** and upload your files
3. **Go to [vercel.com](https://vercel.com)** and sign up/login
4. **Click "New Project"** and import your GitHub repository
5. **Configure the build settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build` (or leave default)
   - Output Directory: `dist` (or leave default)
6. **Click "Deploy"**
7. Wait a few minutes and you'll get a live URL (e.g., `your-app.vercel.app`)

### Option B: Deploy to Netlify (Also Free)

1. **Download your project files** from Figma Make
2. **Go to [netlify.com](https://netlify.com)** and sign up/login
3. **Drag and drop** your project folder into Netlify
4. Wait for deployment and get your live URL (e.g., `your-app.netlify.app`)

### Option C: Deploy to GitHub Pages (Free)

1. **Create a GitHub repository** with your files
2. **Go to repository Settings** → Pages
3. **Select the branch** to deploy from
4. **Save** and wait for deployment
5. Your app will be available at `username.github.io/repository-name`

---

## Step 2: Install on Your Device

Once deployed, visit your app URL on your mobile device:

### 📱 On iPhone/iPad (iOS/iPadOS):

1. **Open Safari** (must use Safari, not Chrome)
2. **Go to your deployed app URL** (e.g., `your-app.vercel.app`)
3. **Tap the Share button** (square with arrow pointing up) at the bottom
4. **Scroll down and tap "Add to Home Screen"**
5. **Tap "Add"** in the top right
6. The app icon will appear on your home screen!

### 📱 On Android:

**Method 1: Chrome Browser**
1. **Open Chrome** on your Android device
2. **Go to your deployed app URL**
3. **Look for the install prompt** at the bottom of the screen
4. **Tap "Install"** or "Add to Home Screen"
5. Alternatively, tap the **three-dot menu** → **"Install app"** or **"Add to Home Screen"**

**Method 2: Samsung Internet**
1. **Open Samsung Internet**
2. **Go to your deployed app URL**
3. **Tap the menu** → **"Add page to"** → **"Home screen"**

---

## Step 3: Use the App

Once installed:
- **Launch the app** from your home screen like any other app
- **All your data is saved locally** on your device using localStorage
- **Works offline** (after the initial load, when deployed with a service worker)
- **Looks and feels like a native app** - no browser UI!

---

## Troubleshooting

### "I don't see the install prompt"
- Make sure you're using **HTTPS** (your deployed URL should start with `https://`)
- Try clearing your browser cache
- On iPhone, you **must use Safari**
- Some browsers may not show the prompt immediately - refresh the page

### "The app won't work offline"
- Service workers (for offline functionality) only work in deployed environments
- They won't work in preview mode or localhost
- Once deployed, visit the app once while online, then it will cache for offline use

### "I can't find the app icon"
- Check your home screen pages
- On Android, check your app drawer
- Try the installation process again

---

## What You Can Do Once Installed

✅ Track your weight with goals and trend analysis  
✅ Monitor your menstrual cycle with predictions  
✅ Log daily steps and water intake  
✅ View all metrics on a monthly calendar  
✅ Compare multiple metrics on the same chart  
✅ All data stored locally and privately on your device  
✅ Works offline after first load  
✅ Receive notifications (when you enable them)  

---

## Need Help?

If you have issues with deployment:
- Check that all files are uploaded correctly
- Ensure your `manifest.json` file is accessible at `/manifest.json`
- Verify your app works in a browser first before installing
- Make sure you're accessing via HTTPS (not HTTP)

Enjoy your Health Tracker app! 🎉
