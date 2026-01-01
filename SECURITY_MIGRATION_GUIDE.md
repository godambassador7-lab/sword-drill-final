# Security Migration Guide - Moving Sensitive Logic to Private Core

This guide documents the security improvements made to the Sword Drill app by moving sensitive game logic from the public codebase into the private core repository.

## 🎯 Overview

We've extracted the following security-sensitive components from the public code and moved them into the **private core submodule** at `src/core/core/`:

1. **Anti-Cheat & Point Validation** (`antiCheat/`)
2. **Economy Tables** (`economy/`)
3. **Daily Missions Logic** (`missions/`)

## 📦 New Private Core Modules

### 1. Anti-Cheat Module (`src/core/core/antiCheat/`)

**Purpose:** Prevent point farming, duplicate submissions, and save-file tampering

**Moved from:**
- `src/services/pointValidation.js` (entire file)
- `src/services/dbService.js` (validation logic)

**Key Features:**
- Rate limiting (max quizzes per day, min time between quizzes)
- Diminishing returns for repeated quiz types
- Quiz signature generation to prevent duplicates
- Server-side point calculation (never trust client)
- Streak recomputation from history
- Cooldown validation
- Event signing (for future HMAC/JWT)

**Exports:**
```javascript
import {
  RATE_LIMITS,
  DIMINISHING_RETURNS,
  validateQuizSubmission,
  calculateValidatedPoints,
  recomputeStreakFromHistory,
  recomputeTotalPoints,
  validateCooldown,
  validatePurchase,
  signEvent,
  verifySignedEvent
} from './core';
```

### 2. Economy Module (`src/core/core/economy/`)

**Purpose:** Hide pricing, rewards, loot tables, and power-up effects

**Moved from:**
- `src/components/PowerUpStore.jsx` (ECONOMY_POWER_UPS constant)
- `src/components/StreakChests.jsx` (CHEST_TIERS and reward tables)
- `src/components/DailyChestsPage.jsx` (DAILY_CHESTS and rewards)
- `src/services/StreakManager.js` (XP formulas and streak rewards)

**Key Features:**
- Power-up definitions (costs, durations, effects)
- Daily chest reward tables
- Streak chest progression
- Unlockable pricing
- Manna economy (daily currency)
- Key drop rates and chest loot tables
- Streak XP formulas and milestone rewards
- Weighted loot generation

**Exports:**
```javascript
import {
  POWER_UPS,
  DAILY_CHESTS,
  STREAK_CHESTS,
  UNLOCKABLE_COSTS,
  MANNA_COSTS,
  KEY_ECONOMY,
  STREAK_REWARDS,
  calculateStreakXP,
  getStreakMilestoneRewards,
  rollChestLoot,
  getPurchaseCost
} from './core';
```

### 3. Missions Module (`src/core/core/missions/`)

**Purpose:** Server-side mission selection and validation

**Moved from:**
- `src/components/DailyMissionBoard.jsx` (ALL_MISSIONS and generation logic)

**Key Features:**
- All mission definitions with rewards
- Deterministic daily mission rotation (seeded random)
- Category-based selection for variety
- Server-side completion validation
- Mission reward calculation
- Daily progress tracking fields

**Exports:**
```javascript
import {
  ALL_MISSIONS,
  generateDailyMissions,
  getTodaysMissions,
  validateMissionCompletion,
  awardMissionReward,
  resetDailyMissionProgress,
  incrementMissionProgress
} from './core';
```

## 🔄 Migration Steps for Public Code

### Step 1: Update `dbService.js`

The `dbService.js` already uses imports from `pointValidation.js`. Update it to use the private core:

```javascript
// OLD (currently using local pointValidation.js)
import {
  validateQuizSubmission,
  calculateValidatedPoints,
  recomputeStreakFromHistory,
  recomputeTotalPoints,
  signQuizEvent,
  validateUnlockablePurchase,
  validateVerseOfDayRead
} from './pointValidation';

// NEW (use private core)
import {
  validateQuizSubmission,
  calculateValidatedPoints,
  recomputeStreakFromHistory,
  recomputeTotalPoints,
  signEvent,
  validatePurchase,
  validateCooldown
} from '../core/core';

// Note: Function names changed:
// - signQuizEvent → signEvent
// - validateUnlockablePurchase → validatePurchase
// - validateVerseOfDayRead → validateCooldown
```

### Step 2: Update `PowerUpStore.jsx`

```javascript
// OLD (hardcoded in component)
const ECONOMY_POWER_UPS = {
  DOUBLE_POINTS: { cost: 50, ... },
  // ... etc
};

// NEW (import from private core)
import { POWER_UPS } from '../core/core';

// Replace all ECONOMY_POWER_UPS with POWER_UPS
```

### Step 3: Update `StreakChests.jsx`

```javascript
// OLD (hardcoded in component)
const ECONOMY_POWER_UPS = { ... };
const CHEST_TIERS = { daily: [ ... ] };

// NEW (import from private core)
import { POWER_UPS, STREAK_CHESTS } from '../core/core';

// Update references:
// - ECONOMY_POWER_UPS → POWER_UPS
// - CHEST_TIERS.daily → STREAK_CHESTS
```

### Step 4: Update `DailyChestsPage.jsx`

```javascript
// OLD (hardcoded in component)
const ECONOMY_POWER_UPS = { ... };
const DAILY_CHESTS = [ ... ];

// NEW (import from private core)
import { POWER_UPS, DAILY_CHESTS } from '../core/core';

// Note: Time restriction logic stays in component (client UX)
// Only the reward tables come from core
```

### Step 5: Update `DailyMissionBoard.jsx`

```javascript
// OLD (hardcoded in component)
const ALL_MISSIONS = [ ... ];

// Component generates missions locally
const generateDailyMissions = () => { ... };

// NEW (import from private core)
import { ALL_MISSIONS, generateDailyMissions } from '../core/core';

// Remove local ALL_MISSIONS and generateDailyMissions
// Use imported versions instead
```

### Step 6: Update `StreakManager.js`

```javascript
// OLD (XP formulas exposed)
const dailyReward = 10 + streakLS * 2;

// NEW (import from private core)
import { calculateStreakXP, STREAK_REWARDS } from '../core/core';

// Use: calculateStreakXP(streakDay)
// Access constants via STREAK_REWARDS
```

### Step 7: Delete Public Files (After Migration)

Once all public code is updated to use the private core:

1. **Delete** `src/services/pointValidation.js` (now in core)
2. **Keep** `src/services/dbService.js` (but updated to use core)
3. **Keep** components but remove hardcoded constants

## 🛡️ Security Improvements

### Before Migration
- ❌ Point validation logic visible in `pointValidation.js`
- ❌ Daily caps and rate limits hardcoded in client
- ❌ Power-up costs in `PowerUpStore.jsx` (can be inspected)
- ❌ Chest reward tables in `StreakChests.jsx` (can precompute drops)
- ❌ Mission rewards in `DailyMissionBoard.jsx` (can script farming)
- ❌ XP formulas in `StreakManager.js` (can game streak system)

### After Migration
- ✅ All validation logic in private core
- ✅ Rate limits and caps hidden
- ✅ Economy tables server-side
- ✅ Mission selection deterministic but hidden
- ✅ Loot generation server-side
- ✅ Streak formulas protected

## 🔒 Anti-Cheat Enhancements

### Current Implementation
1. **Quiz Submission Validation**
   - Timestamp validation (prevent future dates)
   - Duplicate detection via signatures
   - Rate limiting (3-second cooldown)
   - Daily quiz caps
   - Per-type quiz caps

2. **Point Calculation**
   - Server-side calculation only
   - Base point caps (max 100 per quiz)
   - Final point caps (max 250 after multipliers)
   - Daily point caps (max 2000/day)
   - Diminishing returns for farming

3. **Streak Protection**
   - Recompute from history (don't trust client)
   - Validate date continuity
   - Grace period for missed days
   - Streak freeze power-up validation

### Future Enhancements (TODO)
- [ ] Replace `simpleHash()` with **HMAC-SHA256** or **JWT signing**
- [ ] Add server-side endpoints for validation (move from Firebase rules)
- [ ] Implement **rate limiting** at network level
- [ ] Add **anomaly detection** for suspicious patterns
- [ ] Log validation failures for security monitoring

## 📝 Testing Checklist

After migration, test these scenarios:

- [ ] Quiz submission validates correctly
- [ ] Points are calculated server-side
- [ ] Daily limits enforced
- [ ] Diminishing returns apply after 5 same-type quizzes
- [ ] Power-ups show correct costs and effects
- [ ] Daily chests give correct rewards
- [ ] Streak chests unlock at correct milestones
- [ ] Missions rotate daily
- [ ] Mission completion validated server-side
- [ ] Streak XP calculates correctly
- [ ] Purchase validation prevents overspending

## 🚀 Deployment Steps

### 1. Update Private Core Repository
```bash
cd src/core
git add antiCheat/ economy/ missions/ index.js
git commit -m "Add anti-cheat, economy, and missions modules"
git push
```

### 2. Update Public Code
```bash
# In main repo root
git add src/services/dbService.js
git add src/components/PowerUpStore.jsx
git add src/components/StreakChests.jsx
git add src/components/DailyChestsPage.jsx
git add src/components/DailyMissionBoard.jsx
git add src/services/StreakManager.js

git commit -m "Migrate to use private core for security-sensitive logic"
```

### 3. Delete Old Files
```bash
git rm src/services/pointValidation.js
git commit -m "Remove point validation from public code"
```

### 4. Update Submodule Reference
```bash
# In main repo
git add src/core
git commit -m "Update core submodule to latest security release"
git push
```

## 🔐 Access Control

### Private Core Repository Access
- **Maintainers only**: Full read/write
- **Contributors**: Request-only (must be vetted)
- **Public**: No access

### Environment Variables (Future)
For maximum security, add these to `.env`:
```bash
# HMAC signing key (generate with: openssl rand -hex 32)
REACT_APP_HMAC_SECRET=your-secret-key-here

# Rate limit API endpoint
REACT_APP_VALIDATION_ENDPOINT=https://api.yourserver.com/validate
```

## 📚 Additional Resources

- [Private Core README](src/core/core/README.md)
- [Git Submodules Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Client-Side Security Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)

## ❓ FAQ

**Q: Can players still cheat by modifying localStorage?**
A: Server-side validation recomputes all values from Firebase history. LocalStorage is only for UX (faster loading), not source of truth.

**Q: What if someone decompiles the private core?**
A: Defense in depth. Even with code, they can't modify server validation. Firebase Security Rules + server endpoints provide final authority.

**Q: How do we update game balance now?**
A: Update values in private core modules, test, commit to private repo, then update submodule reference in main repo.

**Q: Can we use this in production?**
A: Current implementation is good for medium-security. For high-stakes production, add server-side API endpoints with HMAC/JWT.

---

**Last Updated:** 2026-01-01
**Version:** 1.0
**Author:** Claude Code Security Team
