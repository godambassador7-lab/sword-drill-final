# Sword Drill - Core Game Logic (Private Submodule)

This directory contains all sensitive game mechanics, scoring algorithms, and business logic for Sword Drill. It should be maintained as a **private Git submodule** separate from the public repository.

## 🔒 Why Keep This Private?

This core module contains:
- **Achievement unlock conditions** - Prevents users from knowing exactly how to unlock achievements
- **Point economy formulas** - Protects game balance and prevents exploitation
- **Level progression requirements** - Keeps advancement thresholds secret
- **Quiz difficulty curves** - Maintains competitive integrity
- **Answer validation logic** - Prevents users from reverse-engineering accepted answers
- **Verse selection algorithms** - Protects content strategy

## 📁 Module Structure

```
src/core/
├── achievements/     # Achievement system and unlock logic
├── points/          # Point economy and scoring algorithms
├── levels/          # Level progression requirements
├── quiz/            # Quiz difficulty and timing configuration
├── validation/      # Answer checking and fuzzy matching
├── verses/          # Verse pool and daily verse selection
├── index.js         # Main exports (import from here)
└── README.md        # This file
```

## 🚀 Setup as Private Submodule

### Initial Setup (First Time)

1. **Create a private repository** for this core logic:
   ```bash
   # On GitHub, create a new PRIVATE repository: sword-drill-core
   ```

2. **Initialize this folder as a Git repository**:
   ```bash
   cd src/core
   git init
   git add .
   git commit -m "Initial core logic extraction"
   git remote add origin https://github.com/YourUsername/sword-drill-core.git
   git branch -M main
   git push -u origin main
   ```

3. **In the main Sword Drill repo**, add as submodule:
   ```bash
   cd ../../  # Back to sword-drill root
   git rm -rf src/core  # Remove tracked folder
   git submodule add https://github.com/YourUsername/sword-drill-core.git src/core
   git commit -m "Add core logic as private submodule"
   ```

4. **Add to .gitignore** in main repo (optional extra protection):
   ```bash
   echo "src/core/" >> .gitignore
   ```

### For Collaborators

When cloning the main repository:
```bash
git clone https://github.com/YourUsername/sword-drill.git
cd sword-drill
git submodule update --init --recursive
```

Or clone with submodules in one command:
```bash
git clone --recursive https://github.com/YourUsername/sword-drill.git
```

## 📦 Usage in App.js

Replace all direct constant/function definitions with imports from `core`:

### Before (Old Code):
```javascript
// App.js - OLD
const ACHIEVEMENT_TIERS = { ... };
const LEVEL_REQUIREMENTS = { ... };
const POINT_SYSTEM = { ... };
const checkForNewAchievements = (userData) => { ... };
const matchBiblicalReference = (userAnswer, correctAnswer) => { ... };
```

### After (New Code):
```javascript
// App.js - NEW
import {
  ACHIEVEMENT_TIERS,
  ACHIEVEMENTS,
  checkForNewAchievements,
  LEVEL_REQUIREMENTS,
  POINT_SYSTEM,
  QUIZ_POINTS,
  matchBiblicalReference,
  DEFAULT_VERSE_FALLBACK,
  VERSE_DATABASE
} from './core';

// Everything else stays the same!
```

## 🔄 Updating Core Logic

When you need to update game mechanics:

1. Make changes in `src/core/*`
2. Commit and push to the **private** core repository:
   ```bash
   cd src/core
   git add .
   git commit -m "Update point values"
   git push
   ```

3. Update submodule reference in main repo:
   ```bash
   cd ../../  # Back to main repo root
   git add src/core
   git commit -m "Update core logic submodule"
   git push
   ```

## 🧪 Testing

After extraction, test all quiz flows:
- [ ] Achievement unlocking works
- [ ] Points are awarded correctly
- [ ] Level progression triggers properly
- [ ] Quiz difficulty scales with level
- [ ] Answer validation accepts correct answers
- [ ] Daily verse rotates correctly

## 🛡️ Security Best Practices

1. **Never** commit this folder to the public repository
2. Keep the private repository access restricted to trusted collaborators only
3. Use environment variables for any API keys or secrets
4. Consider server-side validation for production (even more secure)
5. Regularly audit who has access to the private core repository

## 📋 Checklist for Public Release

Before publishing main repo to GitHub:
- [ ] Core logic moved to private submodule
- [ ] `src/core/` added to .gitignore
- [ ] All imports updated to use `./core`
- [ ] Application tested and working
- [ ] No sensitive constants left in App.js
- [ ] Achievement JSON files not in public repo
- [ ] README updated with setup instructions

## 🤝 Contributing

If you're a contributor and need access to core logic:
1. Request access to the private `sword-drill-core` repository
2. Clone with submodules: `git clone --recursive <repo-url>`
3. Make changes in appropriate core module
4. Submit pull request to private core repo

## 📚 Module Documentation

### Achievements (`./achievements`)
- `ACHIEVEMENT_TIERS` - Tier configuration
- `ACHIEVEMENTS` - All achievements by tier
- `checkForNewAchievements(userData)` - Returns newly unlocked achievement IDs

### Points (`./points`)
- `POINT_SYSTEM` - Complete point economy configuration
- `calculateQuizPoints(...)` - Calculate points for quiz completion
- `getBonusPoints(type, multiplier)` - Get bonus points
- `getPenaltyPoints(type, level)` - Get penalty points

### Levels (`./levels`)
- `LEVEL_REQUIREMENTS` - Requirements for each level
- `checkLevelProgression(userData)` - Check if user can level up
- `getLevelRequirements(level)` - Get requirements for specific level

### Quiz (`./quiz`)
- `getQuizDifficulty(level)` - Get difficulty config for level
- `getTimeThreshold(quizType)` - Get time thresholds
- `deservesSpeedBonus(quizType, time)` - Check for speed bonus

### Validation (`./validation`)
- `matchBiblicalReference(user, correct)` - Fuzzy match references
- `validateFillBlank(user, correct)` - Validate fill-blank answer
- `validateMultipleChoice(user, correct)` - Validate MC answer

### Verses (`./verses`)
- `getDailyVerse(date)` - Get verse of the day
- `getRandomVerse(exclude)` - Get random verse
- `getVerseByReference(ref)` - Get specific verse

## 🔗 Related Files

**Private (Not in public repo):**
- `src/data/sword_drill_achievements/achievements.json`
- `src/data/sword_drill_achievements/achievement_conditions.json`
- `src/dailyVerses.js` (if it contains curated verse pool)

**Public (Safe to share):**
- UI components
- State management
- Navigation logic
- Display formatting
- Animation code

## ⚠️ Important Notes

- This approach provides **defense in depth** - even if someone gets the code, they can't see your game mechanics
- For **maximum security**, implement server-side validation endpoints
- Keep your private repository's access list up to date
- Consider using GitHub's "required reviewers" for core logic changes

## 📞 Support

If you have questions about core logic or submodule setup:
1. Check this README first
2. Review Git submodule documentation
3. Contact the project maintainer

---

**Remember:** The strength of your game's competitive integrity relies on keeping these mechanics private. Treat this module with the same care as you would API keys or passwords.
