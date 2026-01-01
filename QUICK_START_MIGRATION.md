# Quick Start: Security Migration

## ✅ What's Done

Your private core now has three new security modules:
- `antiCheat/` - Rate limiting & validation
- `economy/` - Power-ups, chests, rewards
- `missions/` - Daily mission system

**Committed to:** https://github.com/godambassador7-lab/sword-drill-core.git
**Commit:** `b7fa53a`

---

## 🚀 Next Steps (Start Here)

### Step 1: Update dbService.js (5 minutes)

**File:** [src/services/dbService.js](src/services/dbService.js)

**Change line 3-11 from:**
```javascript
import {
  validateQuizSubmission,
  calculateValidatedPoints,
  recomputeStreakFromHistory,
  recomputeTotalPoints,
  signQuizEvent,
  validateUnlockablePurchase,
  validateVerseOfDayRead
} from './pointValidation';
```

**To:**
```javascript
import {
  validateQuizSubmission,
  calculateValidatedPoints,
  recomputeStreakFromHistory,
  recomputeTotalPoints,
  signEvent,
  validatePurchase,
  validateCooldown
} from '../core/core';
```

**Find and replace:**
- `signQuizEvent` → `signEvent`
- `validateUnlockablePurchase` → `validatePurchase`
- `validateVerseOfDayRead` → `validateCooldown`

---

### Step 2: Update PowerUpStore.jsx (10 minutes)

**File:** [src/components/PowerUpStore.jsx](src/components/PowerUpStore.jsx)

**Add import at top:**
```javascript
import { POWER_UPS, getPurchaseCost } from '../core/core';
```

**Delete lines 5-13** (the hardcoded ECONOMY_POWER_UPS constant)

**Find and replace in file:**
- `ECONOMY_POWER_UPS` → `POWER_UPS` (all occurrences)

---

### Step 3: Update StreakChests.jsx (5 minutes)

**File:** [src/components/StreakChests.jsx](src/components/StreakChests.jsx)

**Add import at top:**
```javascript
import { POWER_UPS, STREAK_CHESTS } from '../core/core';
```

**Delete lines 4-9** (ECONOMY_POWER_UPS constant)

**Delete lines 16-95** (CHEST_TIERS constant)

**Change line 106:**
```javascript
// FROM:
const available = CHEST_TIERS.daily.filter(chest =>

// TO:
const available = STREAK_CHESTS.filter(chest =>
```

**Find and replace:**
- `ECONOMY_POWER_UPS` → `POWER_UPS`

---

### Step 4: Update DailyChestsPage.jsx (5 minutes)

**File:** [src/components/DailyChestsPage.jsx](src/components/DailyChestsPage.jsx)

**Add import at top:**
```javascript
import { POWER_UPS, DAILY_CHESTS as CORE_DAILY_CHESTS } from '../core/core';
```

**Delete lines 13-20** (ECONOMY_POWER_UPS constant)

**Delete lines 60-85** (DAILY_CHESTS array)

**Replace deleted array:**
```javascript
const DAILY_CHESTS = CORE_DAILY_CHESTS;
```

**Find and replace:**
- `ECONOMY_POWER_UPS` → `POWER_UPS`

---

### Step 5: Update DailyMissionBoard.jsx (10 minutes)

**File:** [src/components/DailyMissionBoard.jsx](src/components/DailyMissionBoard.jsx)

**Add import at top:**
```javascript
import { ALL_MISSIONS, generateDailyMissions } from '../core/core';
```

**Delete lines 8-91** (ALL_MISSIONS array definition)

**Delete lines 94-115** (generateDailyMissions function)

Now `ALL_MISSIONS` and `generateDailyMissions` come from core!

---

### Step 6: Update StreakManager.js (5 minutes)

**File:** [src/services/StreakManager.js](src/services/StreakManager.js)

**Add import at top:**
```javascript
import { calculateStreakXP, STREAK_REWARDS } from '../core/core';
```

**Replace line 48** (XP calculation):
```javascript
// FROM:
const dailyReward = 10 + streakLS * 2;

// TO:
const dailyReward = calculateStreakXP(streakLS);
```

**Same for line 74:**
```javascript
// FROM:
totalXP += 5;

// TO:
const consolationXP = 5; // or use STREAK_REWARDS.baseXP / 2
totalXP += consolationXP;
```

---

### Step 7: Delete Old File

**After** all components are updated and tested:

```bash
git rm src/services/pointValidation.js
```

---

### Step 8: Test Everything

Run your app and test:

1. Complete a quiz → Points awarded correctly?
2. Try to spam quizzes → Rate limit works?
3. Buy a power-up → Deducts correct cost?
4. Open daily chest → Gives correct rewards?
5. Check missions → Shows 3 daily missions?
6. Complete mission → Awards correct points?
7. View streak → XP calculates correctly?

---

### Step 9: Commit & Push

```bash
# In main repo
git add src/services/dbService.js
git add src/components/PowerUpStore.jsx
git add src/components/StreakChests.jsx
git add src/components/DailyChestsPage.jsx
git add src/components/DailyMissionBoard.jsx
git add src/services/StreakManager.js
git rm src/services/pointValidation.js

git commit -m "Migrate to private core security modules

- Update all components to use private core imports
- Remove hardcoded economy data from public code
- Delete pointValidation.js (now in private core)
- All validation and economy logic now server-side

Refs: #security"

git push
```

---

### Step 10: Update Submodule Reference

```bash
# Update the submodule pointer to latest core
git add src/core
git commit -m "Update core submodule to latest security release"
git push
```

---

## ⚠️ Common Issues

### Issue: "Module not found: Can't resolve '../core/core'"
**Fix:** Make sure you're in the sword-drill root directory and the core submodule is present.

```bash
git submodule update --init --recursive
```

### Issue: "POWER_UPS is undefined"
**Fix:** The core module exports changed. Use exact import names:
```javascript
import { POWER_UPS } from '../core/core';
```

### Issue: Tests failing
**Fix:** Update your test mocks to use core imports:
```javascript
jest.mock('../core/core', () => ({
  POWER_UPS: { /* mock data */ },
  validateQuizSubmission: jest.fn()
}));
```

---

## 📚 Full Documentation

For complete details, see:
- **SECURITY_IMPLEMENTATION_SUMMARY.md** - What was done
- **SECURITY_MIGRATION_GUIDE.md** - Complete guide
- **MIGRATION_EXAMPLE.md** - Detailed PowerUpStore example

---

## 🎯 Summary

**Time estimate:** 40-60 minutes total

**Steps:**
1. ✅ Update dbService.js (5 min)
2. ✅ Update PowerUpStore.jsx (10 min)
3. ✅ Update StreakChests.jsx (5 min)
4. ✅ Update DailyChestsPage.jsx (5 min)
5. ✅ Update DailyMissionBoard.jsx (10 min)
6. ✅ Update StreakManager.js (5 min)
7. ✅ Delete pointValidation.js (1 min)
8. ✅ Test (10-15 min)
9. ✅ Commit & push (2 min)
10. ✅ Update submodule (2 min)

**Result:** Secure game economy with server-side validation! 🔒

---

**Questions?** Check the detailed guides or test incrementally (one file at a time).
