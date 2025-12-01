# GitHub Pages Deployment Fix

## Issue
The `gh-pages` npm package fails on Windows due to path length limitations (ENAMETOOLONG error).

## Solution
We've switched to **GitHub Actions** for automated deployment, which:
- ✅ Runs on Linux servers (no Windows path limits)
- ✅ Deploys automatically on every push to `main`
- ✅ Uses the official GitHub Pages action
- ✅ More reliable and faster

## Setup Instructions

### Step 1: Push Your Code
```bash
git add .
git commit -m "Configure PWA and GitHub Actions deployment"
git push origin main
```

### Step 2: Configure GitHub Pages
1. Go to your repository: https://github.com/godambassador7-lab/sword-drill-final
2. Click **Settings** → **Pages**
3. Under **Source**, select: **GitHub Actions**
4. Save

### Step 3: Wait for Deployment
- GitHub Actions will automatically build and deploy
- Check progress: **Actions** tab in your repository
- First deployment takes ~2-3 minutes

### Step 4: Access Your PWA
Once deployed, your app will be live at:
**https://godambassador7-lab.github.io/sword-drill-final**

## How It Works

The workflow file (`.github/workflows/deploy.yml`) automatically:
1. Checks out your code
2. Installs dependencies
3. Builds the production bundle
4. Deploys to GitHub Pages

## Manual Deployment (Optional)

You can also trigger deployment manually:
1. Go to **Actions** tab
2. Select "Deploy to GitHub Pages"
3. Click **Run workflow**

## Updating the App

Every time you push to `main`, GitHub Actions will:
- ✅ Rebuild the app
- ✅ Deploy the new version
- ✅ Update your live site

No need to run `npm run deploy` anymore!

## Troubleshooting

### Deployment Failed?
1. Check the **Actions** tab for error logs
2. Ensure GitHub Pages is set to "GitHub Actions" source
3. Verify your repository has Pages enabled

### 404 Error?
1. Wait 5 minutes after first deployment
2. Clear browser cache
3. Check the homepage URL in `package.json` matches your repo name

### Build Errors?
1. Test locally: `npm run build`
2. Check the Actions logs for specific errors
3. Ensure all dependencies are in `package.json`

## Benefits Over gh-pages Package

| Feature | gh-pages package | GitHub Actions |
|---------|------------------|----------------|
| Works on Windows | ❌ (path limits) | ✅ |
| Auto-deploy on push | ❌ | ✅ |
| Build logs | ❌ | ✅ (Actions tab) |
| Rollback support | ❌ | ✅ |
| No local build needed | ❌ | ✅ |
| Caching | ❌ | ✅ |

## Files Created
- `.github/workflows/deploy.yml` - GitHub Actions workflow
- This deployment guide

You can remove the `gh-pages` package if you want:
```bash
npm uninstall gh-pages
```

And remove these scripts from `package.json`:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d build"
```

---

**Ready to Deploy!** Just push your changes and GitHub Actions will handle the rest! 🚀
