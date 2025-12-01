# Sword Drill Core - Quick Reference Card

## 🎯 What You Need to Know

Your Sword Drill app now has a **private core module** at `src/core` that contains all sensitive game logic. Here's everything you need in a quick reference format.

## 📦 What's in the Core Module?

| Module | What It Does | Main Exports |
|--------|--------------|--------------|
| `achievements/` | Achievement unlock logic | `ACHIEVEMENTS`, `checkForNewAchievements()` |
| `points/` | Point economy & scoring | `POINT_SYSTEM`, `calculateQuizPoints()` |
| `levels/` | Level progression | `LEVEL_REQUIREMENTS`, `checkLevelProgression()` |
| `quiz/` | Quiz difficulty curves | `getQuizDifficulty()`, `getTimeThreshold()` |
| `validation/` | Answer checking | `matchBiblicalReference()`, `validateFillBlank()` |
| `verses/` | Verse pool & selection | `getDailyVerse()`, `getRandomVerse()` |

## 🚀 Quick Start Commands

### First Time Setup (As Submodule)
```bash
# 1. Create private repo on GitHub: sword-drill-core
# 2. Initialize core as git repo
cd src/core
git init
git add .
git commit -m "Initial core logic"
git remote add origin https://github.com/YOUR_USERNAME/sword-drill-core.git
git push -u origin main

# 3. Add as submodule in main repo
cd ../..
git rm -r --cached src/core
git submodule add https://github.com/YOUR_USERNAME/sword-drill-core.git src/core
git commit -m "Add core as private submodule"
git push
```

### Clone Main Repo (With Core Access)
```bash
git clone --recursive https://github.com/YOUR_USERNAME/sword-drill.git
```

### Update Core Logic
```bash
# Make changes in src/core
cd src/core
git add .
git commit -m "Update point values"
git push

# Update reference in main repo
cd ../..
git add src/core
git commit -m "Update core submodule"
git push
```

## 📋 Common Tasks

| Task | Command |
|------|---------|
| Clone with submodules | `git clone --recursive <repo-url>` |
| Initialize submodules | `git submodule update --init --recursive` |
| Update core logic | `cd src/core && git pull origin main` |
| Check submodule status | `git submodule status` |
| Build app | `npm run build` |
| Start dev server | `npm start` |

## 🔧 How to Use in Code

### Import from Core
```javascript
// In App.js or any component
import {
  ACHIEVEMENT_TIERS,
  POINT_SYSTEM,
  checkForNewAchievements,
  matchBiblicalReference,
  getDailyVerse
} from './core';
```

### Use Exactly as Before
```javascript
// Check achievements
const newAchievements = checkForNewAchievements(userData);

// Get daily verse
const verse = getDailyVerse();

// Validate reference
const isMatch = matchBiblicalReference(userAnswer, correctAnswer);

// Calculate points
import { calculateQuizPoints } from './core';
const points = calculateQuizPoints('fill-blank', true, 'Intermediate', 10);
```

## 🔒 Security Checklist

- [x] ✅ Core logic extracted to `src/core`
- [x] ✅ Core imported in App.js via `import { ... } from './core'`
- [x] ✅ App builds successfully
- [ ] 🔲 Created private GitHub repo for core
- [ ] 🔲 Configured as submodule
- [ ] 🔲 Tested public clone (should fail without core access)
- [ ] 🔲 Ready to publish main repo

## 📁 Protected Files

**Keep these PRIVATE:**
```
src/core/                                         (entire folder)
src/data/sword_drill_achievements/achievements.json
src/data/sword_drill_achievements/achievement_conditions.json
```

**Safe to make PUBLIC:**
```
src/App.js                                        (now imports from core)
src/components/                                    (all UI components)
src/services/                                      (helper services)
public/                                           (static assets)
```

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find module './core'" | Run `git submodule update --init --recursive` |
| Build fails after clone | Initialize submodules first |
| Changes not showing | Commit in submodule, then update reference in main |
| Submodule is empty | Need access to private repo |

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `CORE_SETUP_GUIDE.md` | Full submodule setup instructions |
| `PRE_PUBLISH_CHECKLIST.md` | Checklist before publishing |
| `src/core/README.md` | Core module documentation |
| `src/core/MIGRATION_SUMMARY.md` | What was extracted and where |
| `QUICK_REFERENCE.md` | This file - quick commands |

## 💡 Key Concepts

### Private Submodule
- Main repo references a commit in the private core repo
- Public can see that core exists, but not its contents
- Only collaborators with access can get the actual code

### Two-Commit Workflow
1. **Commit in submodule** (`src/core`): Changes to game logic
2. **Commit in main repo**: Update the submodule reference pointer

### Access Control
- **Main repo**: Can be public
- **Core repo**: Must stay private
- **Result**: UI is open source, game mechanics are protected

## 🎮 What's Protected

**Game Balance:**
- Point values (5-350 points per quiz)
- Achievement thresholds
- Level requirements
- Difficulty multipliers

**Anti-Cheat:**
- Answer validation leniency
- Time bonuses/penalties
- Fuzzy matching rules

**Content Strategy:**
- Verse selection algorithm
- Daily rotation logic
- Random verse distribution

## ✅ Success Indicators

You've successfully set up the core module when:

1. ✅ `npm run build` succeeds
2. ✅ App functions normally with core present
3. ✅ Public clone fails gracefully without core
4. ✅ Collaborators can access both repos
5. ✅ Updates work via two-commit workflow

## 🚨 Never Do This

- ❌ Commit `src/core` directly to public repo
- ❌ Put API keys in core module
- ❌ Force push to core repo (breaks references)
- ❌ Make core repo public
- ❌ Share core repo access publicly

## 📞 Quick Help

| Question | Answer |
|----------|--------|
| Can I still modify core logic? | Yes, commit in `src/core` then update reference |
| Do I need two repos? | Yes - main (public) + core (private) |
| What if I forget to update reference? | Others won't get your core changes |
| Can users see core exists? | Yes, but not its contents |
| Is this secure enough? | Yes for most cases; consider server validation for production |

## 🎯 Next Steps

1. **Now:** Test that everything builds
2. **Before publishing:** Complete PRE_PUBLISH_CHECKLIST.md
3. **To use submodule:** Follow CORE_SETUP_GUIDE.md
4. **For details:** Read src/core/README.md

---

**Remember:** Core = Private | UI = Public | Two commits for core changes

**Status:** ✅ Migration Complete | 📦 Ready for Submodule Setup | 🚀 Ready to Publish
