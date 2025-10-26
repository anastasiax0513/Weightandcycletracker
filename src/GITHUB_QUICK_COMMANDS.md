# ⚡ GitHub Push - Quick Commands

## 🎯 Fastest Method: GitHub Desktop
1. Download: [desktop.github.com](https://desktop.github.com)
2. Add your folder → Commit → Publish
3. Done! ✅

---

## 💻 Command Line (Copy & Paste)

### Step 1: Create Repository on GitHub
1. Go to [github.com/new](https://github.com/new)
2. Name: `health-tracker`
3. Click "Create repository"
4. **Don't close the page!**

### Step 2: Open Terminal in Your Project Folder
**Windows:** 
- Open folder in File Explorer
- Type `cmd` in address bar, press Enter

**Mac:** 
- Open folder in Finder
- Right-click → Services → New Terminal at Folder

**Linux:** 
- Right-click in folder → Open Terminal

### Step 3: Run These Commands

**Replace `YOUR_USERNAME` with your actual GitHub username!**

```bash
git init

git add .

git add .npmrc .vercelignore

git commit -m "Initial commit - Health Tracker"

git branch -M main

git remote add origin https://github.com/YOUR_USERNAME/health-tracker.git

git push -u origin main
```

### Step 4: Enter Credentials
- **Username:** Your GitHub username
- **Password:** Your Personal Access Token
  - Don't have one? Get it here: [github.com/settings/tokens](https://github.com/settings/tokens)
  - Click "Generate new token (classic)" → Check `repo` → Generate
  - Copy the token and use it as password

---

## ✅ Verify Upload

Go to: `https://github.com/YOUR_USERNAME/health-tracker`

You should see all your files including `.npmrc` and `.vercelignore`!

---

## 🚀 Next: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. New Project → Import your repository
3. Settings:
   - Framework: **Vite**
   - Build: **`npm run build`**
   - Output: **`dist`**
4. Deploy!

---

## ⚠️ Having Issues?

**"Permission denied"** → Use Personal Access Token (see Step 4)

**"Git not found"** → Install Git: [git-scm.com](https://git-scm.com)

**Can't connect?** → Use GitHub Desktop instead (easiest!)

**Too complicated?** → Skip GitHub, use Vercel CLI:
```bash
npm install -g vercel
vercel
```

---

✨ **That's it! Choose the method that works for you.**
