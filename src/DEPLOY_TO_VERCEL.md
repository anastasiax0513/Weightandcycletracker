# 🚀 Deploy Health Tracker to Vercel

Follow these simple steps to deploy your Health Tracker app to Vercel:

---

## Method 1: Deploy with GitHub (Recommended)

### Step 1: Download Your Project
1. In Figma Make, click **"Export"** or download all project files
2. Save them to a folder on your computer (e.g., `health-tracker`)

### Step 2: Create a GitHub Repository
1. Go to [github.com](https://github.com) and sign in (or create an account)
2. Click the **"+"** icon in the top right → **"New repository"**
3. Name it `health-tracker` (or any name you prefer)
4. Click **"Create repository"**

### Step 3: Upload Files to GitHub

**Option A: Using GitHub Web Interface (Easiest)**
1. On your new repository page, click **"uploading an existing file"**
2. Drag and drop ALL your project files and folders
3. Click **"Commit changes"**

**Option B: Using Git Command Line**
```bash
cd path/to/your/health-tracker
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/health-tracker.git
git push -u origin main
```

### Step 4: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** and choose **"Continue with GitHub"**
3. Click **"New Project"**
4. Find your `health-tracker` repository and click **"Import"**
5. Configure your project:
   - **Framework Preset:** Vite
   - **Root Directory:** ./ (leave as is)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
6. Click **"Deploy"**
7. Wait 1-2 minutes for deployment to complete ✨

### Step 5: Get Your Live URL
- After deployment, you'll get a URL like: `https://health-tracker-xyz.vercel.app`
- Click the URL to open your live app!
- Share this URL to access on any device

---

## Method 2: Deploy with Vercel CLI (Advanced)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
cd path/to/your/health-tracker
vercel
```

Follow the prompts, and your app will be deployed!

---

## Method 3: Deploy by Dragging Files (Not Recommended for Updates)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Look for the option to **import from a local directory**
4. Upload your project folder
5. Configure as described in Method 1, Step 4

---

## After Deployment

### ✅ Your app is now live!

1. **Share the URL** - Send it to your phone via text/email
2. **Install on mobile** - Follow the instructions in `INSTALLATION.md`
3. **Custom Domain (Optional)** - In Vercel dashboard, go to your project → Settings → Domains to add a custom domain

### 🔄 Making Updates

When you make changes to your app:

**If using GitHub:**
1. Update your files
2. Commit and push to GitHub
3. Vercel will automatically redeploy! (Auto-deploy is enabled by default)

**If using Vercel CLI:**
```bash
vercel --prod
```

---

## Troubleshooting

### Build Failed?
- Make sure all files are uploaded (check the file structure matches)
- Verify `package.json`, `vite.config.ts`, and `tsconfig.json` exist
- Check the build logs in Vercel dashboard for specific errors

### App Not Loading?
- Clear your browser cache
- Check the Vercel deployment logs
- Make sure the build was successful (green checkmark in Vercel)

### Service Worker Not Working?
- Service workers only work on HTTPS (Vercel provides this automatically)
- Clear browser cache and reload
- Check browser console for errors

### Can't Install as PWA?
- Make sure you're accessing via the Vercel HTTPS URL
- On iOS, use Safari browser
- On Android, use Chrome browser
- The `manifest.json` should be accessible at `your-url.vercel.app/manifest.json`

---

## Environment Variables (If Needed Later)

If you add API integrations later:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add your variables (e.g., `API_KEY`)
3. Redeploy the project

---

## Support

- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **GitHub Help:** [docs.github.com](https://docs.github.com)

---

## Summary

✅ Free hosting forever (Vercel hobby plan)  
✅ Automatic HTTPS  
✅ Automatic deployments from GitHub  
✅ Global CDN for fast loading  
✅ PWA support out of the box  
✅ Analytics and performance monitoring  

**Your Health Tracker is ready to use anywhere! 🎉**
