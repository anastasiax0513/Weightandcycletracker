# 🚀 Vercel Deployment Checklist

## Before Uploading to GitHub

### ✅ Required Files Checklist
Copy this entire project to your GitHub repository, making sure to include:

#### Configuration Files (Root Directory)
- [ ] `.npmrc` ⚠️ HIDDEN FILE - May not upload automatically!
- [ ] `.vercelignore` ⚠️ HIDDEN FILE - May not upload automatically!
- [ ] `package.json`
- [ ] `vite.config.ts`
- [ ] `tsconfig.json`
- [ ] `tsconfig.node.json`
- [ ] `vercel.json`
- [ ] `index.html`
- [ ] `main.tsx`
- [ ] `App.tsx`

#### Main Folders
- [ ] `components/` (all 9 tracker/utility files + `ui/` subfolder with 45+ components)
- [ ] `hooks/` (useLocalStorage.ts)
- [ ] `public/` (manifest.json, service-worker.js)
- [ ] `styles/` (globals.css)
- [ ] `types/` (health.ts)
- [ ] `utils/` (calculations.ts, registerServiceWorker.ts)

#### Documentation (Optional but Recommended)
- [ ] `README.md`
- [ ] `DEPLOY_TO_VERCEL.md`
- [ ] `INSTALLATION.md`

---

## How to Check for Hidden Files

### On Mac/Linux Terminal:
```bash
cd your-project-folder
ls -la
```
Look for files starting with `.` (like `.npmrc` and `.vercelignore`)

### On Windows Command Prompt:
```cmd
cd your-project-folder
dir /a
```

### In VS Code / Code Editor:
- Make sure "Show Hidden Files" is enabled in your file explorer settings
- Files starting with `.` should be visible

---

## Upload to GitHub

### Option 1: GitHub Desktop (Easiest)
1. Open GitHub Desktop
2. Click "Add" → "Add Existing Repository"
3. Select your project folder
4. Make sure `.npmrc` and `.vercelignore` appear in the changes list
5. Commit and push to GitHub

### Option 2: Command Line
```bash
cd your-project-folder
git init
git add .
git add .npmrc .vercelignore  # Explicitly add hidden files!
git commit -m "Initial commit - Health Tracker app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Option 3: Drag & Drop to GitHub.com
1. Go to github.com → Create new repository
2. **DO NOT** drag and drop - this often skips hidden files!
3. Instead use GitHub Desktop or Command Line above

---

## Deploy to Vercel

### Step 1: Connect Repository
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository
4. Don't click Deploy yet!

### Step 2: Configure Build Settings
**CRITICAL:** Before deploying, set these exact values:
- **Framework Preset:** Vite
- **Root Directory:** `./` (leave as default)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 3: Deploy
1. Click **"Deploy"**
2. Wait 1-3 minutes for build to complete
3. You should see: ✅ "Building" → ✅ "Deployment Ready"

### Step 4: If Build Fails
1. Click on the failed deployment
2. Read the error logs carefully
3. Common issues:
   - Missing `.npmrc` file → Re-upload to GitHub
   - TypeScript errors → Check the error message
   - Missing dependencies → Check `package.json`
4. After fixing, push to GitHub (Vercel auto-redeploys)

---

## After Successful Deployment

### Test Your App
1. ✅ Click the deployment URL (e.g., `your-app.vercel.app`)
2. ✅ Check all 4 trackers work (Weight, Cycle, Steps, Water)
3. ✅ Test calendar navigation
4. ✅ Test adding data for different dates
5. ✅ Verify PWA install prompt appears

### Install as PWA on Phone
1. Open the Vercel URL on your phone
2. **iPhone:** Safari → Share → Add to Home Screen
3. **Android:** Chrome → Menu (⋮) → Install App
4. The app icon should appear on your home screen!

---

## Quick Reference

| What | Where |
|------|-------|
| Project Settings | Vercel → Your Project → Settings → General |
| Build Logs | Vercel → Your Project → Deployments → Click deployment |
| Redeploy | Vercel → Deployments → ⋮ (three dots) → Redeploy |
| Environment Variables | Settings → Environment Variables |
| Custom Domain | Settings → Domains |

---

## Still Having Issues?

1. **Check Build Logs:** Always read the full error message in Vercel
2. **Verify Files:** Make sure `.npmrc` is in your GitHub repo
3. **Clear Cache:** Vercel → Settings → Clear Build Cache → Redeploy
4. **Ask for Help:** Include the exact error message from build logs

---

✨ **Your Health Tracker will be live at: `https://your-app-name.vercel.app`**
