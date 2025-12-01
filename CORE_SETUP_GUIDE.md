# Sword Drill Core Logic - Setup Guide

This guide explains how to set up the `src/core` folder as a private Git submodule to protect your game's sensitive logic when publishing to GitHub.

## 🎯 What This Protects

The `src/core` folder contains:
- **Achievement unlock conditions** (`src/core/achievements`)
- **Point economy formulas** (`src/core/points`)
- **Level progression requirements** (`src/core/levels`)
- **Quiz difficulty curves** (`src/core/quiz`)
- **Answer validation logic** (`src/core/validation`)
- **Verse selection algorithms** (`src/core/verses`)

## 📋 Prerequisites

- Git installed on your system
- A GitHub account
- Access to create private repositories

## 🚀 Step-by-Step Setup

### Step 1: Create a Private Repository for Core Logic

1. Go to GitHub and create a **NEW PRIVATE** repository
2. Name it: `sword-drill-core` (or any name you prefer)
3. **Important:** Make it PRIVATE
4. Don't initialize with README (we'll push existing code)

### Step 2: Initialize Core Folder as Git Repository

```bash
# Navigate to the core folder
cd src/core

# Initialize as git repository
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial extraction of core game logic"

# Add your private repo as remote
git remote add origin https://github.com/YOUR_USERNAME/sword-drill-core.git

# Push to private repository
git branch -M main
git push -u origin main
```

### Step 3: Add Core as Submodule in Main Repo

```bash
# Go back to sword-drill root directory
cd ../..

# Remove the tracked src/core folder (but keep files for now)
git rm -r --cached src/core

# Add as submodule (pointing to your private repo)
git submodule add https://github.com/YOUR_USERNAME/sword-drill-core.git src/core

# Commit the submodule reference
git commit -m "Add core logic as private submodule"

# Push to main repo
git push
```

### Step 4: Update .gitignore (Optional Extra Protection)

Add this to your main repo's `.gitignore`:

```
# Core game logic (private submodule)
src/core/
!src/core/.gitkeep
```

**Note:** This is optional - Git submodules are already tracked separately.

### Step 5: Verify Setup

Check that everything is configured correctly:

```bash
# In main repo root
git submodule status

# Should show something like:
# <commit-hash> src/core (heads/main)
```

## 👥 For Collaborators

When someone clones your main repository, they need to initialize submodules:

### Option 1: Clone with Submodules
```bash
git clone --recursive https://github.com/YOUR_USERNAME/sword-drill.git
```

### Option 2: Clone Then Initialize Submodules
```bash
git clone https://github.com/YOUR_USERNAME/sword-drill.git
cd sword-drill
git submodule update --init --recursive
```

### Granting Access
To give someone access to the private core logic:
1. Go to your `sword-drill-core` repository on GitHub
2. Settings → Collaborators
3. Add their GitHub username

## 🔄 Updating Core Logic

### Making Changes to Core Logic

```bash
# Navigate to core folder
cd src/core

# Make your changes to files
# (e.g., update point values in src/core/points/index.js)

# Commit changes
git add .
git commit -m "Update point economy values"
git push
```

### Updating Submodule Reference in Main Repo

```bash
# Go back to main repo root
cd ../..

# Update submodule to latest commit
cd src/core
git pull origin main
cd ../..

# Commit the updated submodule reference
git add src/core
git commit -m "Update core logic submodule to latest"
git push
```

## 🧪 Testing After Setup

After setting up the submodule, verify everything works:

```bash
# In main repo root
npm install
npm run build
npm start
```

Test all quiz features to ensure:
- [ ] Achievements unlock properly
- [ ] Points are awarded correctly
- [ ] Level progression works
- [ ] Quiz difficulty scales
- [ ] Answer validation works
- [ ] Daily verse rotates

## 📁 Files That Should Stay Private

Make sure these are **ONLY in the private `sword-drill-core` repo**, not the public one:

```
src/core/
├── achievements/
│   └── index.js (achievement unlock logic)
├── points/
│   └── index.js (point economy formulas)
├── levels/
│   └── index.js (level requirements)
├── quiz/
│   └── index.js (difficulty curves)
├── validation/
│   └── index.js (answer checking)
├── verses/
│   └── index.js (verse selection)
├── index.js (main exports)
└── README.md
```

Also keep these data files private:
```
src/data/sword_drill_achievements/achievements.json
src/data/sword_drill_achievements/achievement_conditions.json
```

## 🔒 Security Best Practices

1. **Never** commit `src/core` to the public repository directly
2. Keep the private repository access list restricted
3. Regularly audit who has access to `sword-drill-core`
4. Use branch protection rules on the private repo
5. Consider enabling 2FA for collaborators
6. Use GPG signing for commits to core logic

## 🛠️ Troubleshooting

### "Submodule not found" Error
```bash
# Re-initialize submodules
git submodule update --init --recursive
```

### Changes Not Showing in Main Repo
```bash
# Make sure you committed in the submodule first
cd src/core
git status
git add .
git commit -m "Your changes"
git push

# Then update reference in main repo
cd ../..
git add src/core
git commit -m "Update submodule"
git push
```

### Accidentally Committed Core to Public Repo
```bash
# Remove from history (use carefully!)
git filter-branch --tree-filter 'rm -rf src/core' HEAD
git push --force
```

## 📚 Additional Resources

- [Git Submodules Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [GitHub: Working with Submodules](https://github.blog/2016-02-01-working-with-submodules/)
- [Atlassian Git Submodules Tutorial](https://www.atlassian.com/git/tutorials/git-submodule)

## ⚠️ Important Reminders

- The `src/core` folder is now tracked separately from your main repo
- Changes to core logic require **two separate commits** (one in submodule, one updating reference)
- Collaborators need access to **both** repositories
- Always test after updating the submodule reference

## 🎉 Success!

Once set up, you can safely publish your main Sword Drill repository to GitHub without exposing:
- Achievement unlock thresholds
- Point calculation formulas
- Level progression requirements
- Quiz difficulty parameters
- Answer validation leniency
- Verse selection strategies

Your game mechanics remain protected while the UI and user experience code can be open source!

---

**Need Help?**
If you encounter issues during setup, refer to the `src/core/README.md` for module-specific documentation or check the troubleshooting section above.
