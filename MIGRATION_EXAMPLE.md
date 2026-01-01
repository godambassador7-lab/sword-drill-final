# Migration Example: PowerUpStore.jsx

This document shows a before/after comparison of migrating `PowerUpStore.jsx` to use the private core.

## Before Migration (Current State)

```jsx
// src/components/PowerUpStore.jsx
import React, { useState } from 'react';
import { ShoppingBag, Zap, Shield, Clock } from 'lucide-react';
import { updateUserProgress } from '../services/dbService';

// ❌ SECURITY ISSUE: Economy data hardcoded in public component
const ECONOMY_POWER_UPS = {
  DOUBLE_POINTS: {
    cost: 50,
    duration: 600000,
    multiplier: 2,
    name: 'Double Points',
    icon: '⚡'
  },
  STREAK_FREEZE: {
    cost: 75,
    duration: 86400000,
    name: 'Streak Freeze',
    icon: '🧊'
  },
  // ... more power-ups
};

const PowerUpStore = ({ onBack, userData, setUserData, userId }) => {
  const purchasePowerUp = (powerUpKey) => {
    const powerUp = ECONOMY_POWER_UPS[powerUpKey];

    // ❌ Client-side validation (can be bypassed)
    if (userData.totalPoints < powerUp.cost) {
      alert('Not enough points!');
      return;
    }

    // ❌ Client calculates new balance
    const newPoints = userData.totalPoints - powerUp.cost;

    // ... update userData and Firebase
  };

  return (
    <div>
      {Object.entries(ECONOMY_POWER_UPS).map(([key, powerUp]) => (
        <PowerUpCard
          key={key}
          powerUp={powerUp}
          onPurchase={() => purchasePowerUp(key)}
        />
      ))}
    </div>
  );
};
```

## After Migration (Secure Version)

```jsx
// src/components/PowerUpStore.jsx
import React, { useState } from 'react';
import { ShoppingBag, Zap, Shield, Clock } from 'lucide-react';
import { updateUserProgress } from '../services/dbService';

// ✅ SECURE: Import from private core
import { POWER_UPS, getPurchaseCost } from '../core/core';

const PowerUpStore = ({ onBack, userData, setUserData, userId }) => {
  const purchasePowerUp = async (powerUpKey) => {
    // ✅ Get cost from private core
    const cost = getPurchaseCost('powerup', powerUpKey);
    const powerUp = POWER_UPS[powerUpKey];

    // ✅ Simple client-side check (UX only)
    if (userData.totalPoints < cost) {
      alert('Not enough points!');
      return;
    }

    try {
      // ✅ Server-side validation happens in dbService
      // dbService will call validatePurchase() from private core
      const result = await updateUserProgress(userId, {
        purchasePowerUp: {
          type: powerUpKey,
          cost: cost,
          timestamp: Date.now()
        }
      });

      if (!result.success) {
        alert(`Purchase failed: ${result.error}`);
        return;
      }

      // ✅ Use validated data from server
      setUserData(prev => ({
        ...prev,
        totalPoints: result.validatedData.totalPoints,
        activeBoosts: result.validatedData.activeBoosts
      }));

      alert(`✅ Purchased ${powerUp.name}!`);
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  return (
    <div>
      {/* ✅ Still iterate over power-ups from core */}
      {Object.entries(POWER_UPS).map(([key, powerUp]) => (
        <PowerUpCard
          key={key}
          powerUp={powerUp}
          canAfford={userData.totalPoints >= powerUp.cost}
          onPurchase={() => purchasePowerUp(key)}
        />
      ))}
    </div>
  );
};
```

## Key Changes

### 1. Import from Private Core
```javascript
// Before
const ECONOMY_POWER_UPS = { ... };

// After
import { POWER_UPS, getPurchaseCost } from '../core/core';
```

### 2. Use Server Validation
```javascript
// Before (client-side only)
const newPoints = userData.totalPoints - powerUp.cost;
setUserData({ ...userData, totalPoints: newPoints });

// After (server validates)
const result = await updateUserProgress(userId, {
  purchasePowerUp: { type, cost, timestamp }
});
setUserData(prev => ({
  ...prev,
  totalPoints: result.validatedData.totalPoints
}));
```

### 3. Handle Validation Errors
```javascript
// Before (no server validation)
if (userData.totalPoints < powerUp.cost) {
  alert('Not enough points!');
  return;
}

// After (server checks and returns error)
if (!result.success) {
  alert(`Purchase failed: ${result.error}`);
  return;
}
```

## Enhanced dbService for Power-Up Purchase

Update `dbService.js` to add a `purchasePowerUp` function:

```javascript
// src/services/dbService.js
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import {
  validatePurchase,
  recomputeTotalPoints,
  signEvent,
  POWER_UPS
} from '../core/core';

export const purchasePowerUp = async (userId, powerUpType) => {
  try {
    // Get user data and history
    const userDoc = await getDoc(doc(db, 'userProgress', userId));
    const existingData = userDoc.data() || {};
    const quizHistory = existingData.quizHistory || [];

    // Get cost from private core
    const powerUp = POWER_UPS[powerUpType];
    if (!powerUp) {
      return { success: false, error: 'Invalid power-up type' };
    }

    // SERVER-SIDE VALIDATION: Validate purchase
    const validation = validatePurchase(
      powerUp.cost,
      existingData.totalPoints || 0,
      quizHistory
    );

    if (!validation.valid) {
      console.warn('[dbService] Purchase validation FAILED:', validation.error);
      return {
        success: false,
        error: validation.error,
        suspectedTampering: validation.suspectedTampering
      };
    }

    // Create power-up boost
    const newBoost = {
      type: powerUpType,
      name: powerUp.name,
      activatedAt: Date.now(),
      expiresAt: Date.now() + powerUp.duration,
      ...powerUp
    };

    // Sign the purchase event
    const signedEvent = signEvent({
      type: 'powerup_purchase',
      powerUpType: powerUpType,
      cost: powerUp.cost,
      timestamp: Date.now()
    });

    // Update database
    const updatedBoosts = [...(existingData.activeBoosts || []), newBoost];

    await updateDoc(doc(db, 'userProgress', userId), {
      activeBoosts: updatedBoosts,
      totalPoints: validation.remainingPoints,
      lastPurchaseTimestamp: serverTimestamp(),
      purchaseHistory: arrayUnion(signedEvent)
    });

    return {
      success: true,
      validatedData: {
        totalPoints: validation.remainingPoints,
        activeBoosts: updatedBoosts,
        recomputedPoints: validation.recomputedPoints
      }
    };
  } catch (error) {
    console.error('[dbService] Purchase FAILED:', error);
    return { success: false, error: error.message };
  }
};
```

## Testing the Migration

### Test Cases

1. **Valid Purchase**
   - User has 100 points
   - Buy 50-point power-up
   - ✅ Should succeed, deduct 50 points, add boost

2. **Insufficient Points**
   - User has 30 points
   - Try to buy 50-point power-up
   - ✅ Should fail with "Insufficient points" error

3. **Point Tampering Detection**
   - User manually edits localStorage to show 10,000 points
   - Try to purchase
   - ✅ Should fail with "Point total mismatch" error
   - ✅ Server recomputes from history

4. **Daily Limit**
   - User already earned 2000 points today (daily max)
   - Complete quiz for more points
   - ✅ Should not award additional points
   - ✅ Purchase validation uses correct total

### Test Script

```javascript
// Test in browser console
const testPurchase = async () => {
  console.log('Testing power-up purchase...');

  // Test 1: Valid purchase
  const result1 = await purchasePowerUp(userId, 'DOUBLE_POINTS');
  console.assert(result1.success, 'Valid purchase should succeed');

  // Test 2: Invalid power-up
  const result2 = await purchasePowerUp(userId, 'FAKE_POWERUP');
  console.assert(!result2.success, 'Invalid power-up should fail');

  // Test 3: Insufficient points (manually set low points first)
  // ... etc
};
```

## Performance Considerations

### Before (Hardcoded)
- ✅ No network call for power-up data
- ❌ Client can manipulate values

### After (Private Core)
- ✅ Same performance (core is local, not remote)
- ✅ Server validates every purchase
- ✅ Cannot manipulate values

**Note:** The private core is imported locally (it's in your `src/core` folder), so there's **no performance penalty**. The validation happens on the Firebase server via Firebase Functions or Security Rules.

## Rollout Strategy

1. **Phase 1: Add server validation** (keep existing client code working)
2. **Phase 2: Update components** to use private core imports
3. **Phase 3: Test thoroughly** in development
4. **Phase 4: Deploy to production** with monitoring
5. **Phase 5: Remove old code** after verification

---

**Next Steps:**
1. Apply this pattern to `StreakChests.jsx`
2. Apply to `DailyChestsPage.jsx`
3. Apply to `DailyMissionBoard.jsx`
4. Update `StreakManager.js` to use core XP formulas
