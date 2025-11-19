// ⚔️ Sword Drill — Streak & XP Manager
// Tracks login streaks, grants XP rewards, and logs daily updates.
// ✅ FIXED: Now persists to Firebase for cross-device sync

import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

export const getCurrentStreak = async (userId) => {
  try {
    const today = new Date();
    const todayISO = today.toISOString().split('T')[0];
    const lastLoginLS = localStorage.getItem("lastLoginDate");
    let streakLS = parseInt(localStorage.getItem("streakCount")) || 0;
    let totalXP = parseInt(localStorage.getItem("xpTotal")) || 0;

    console.log("🕓 Checking streak...");
    console.log("➡️ Last Login (LS):", lastLoginLS || "none");
    console.log("➡️ Today:", todayISO);

    // 🟢 First-time login or cleared cache
    if (!lastLoginLS) {
      streakLS = 1;
      totalXP += 10; // XP reward for day 1
      localStorage.setItem("streakCount", streakLS);
      localStorage.setItem("xpTotal", totalXP);
      localStorage.setItem("lastLoginDate", todayISO);
      
      // ✅ SYNC TO FIREBASE
      if (userId) {
        await updateDoc(doc(db, 'userProgress', userId), {
          currentStreak: streakLS,
          lastActiveDate: todayISO,
          totalXP: totalXP,
          lastUpdated: new Date()
        }).catch(err => console.error("Firebase sync error:", err));
      }
      
      console.log(`✨ First login — starting streak at ${streakLS} day(s) (+10 XP)`);
      return { streak: streakLS, totalXP };
    }

    const lastLoginDate = new Date(lastLoginLS);
    const diffDays = Math.floor((today - lastLoginDate) / (1000 * 60 * 60 * 24));

    // ✅ New day: increment streak & reward XP
    if (diffDays === 1) {
      streakLS += 1;
      const dailyReward = 10 + streakLS * 2; // XP bonus grows slightly each day
      totalXP += dailyReward;
      localStorage.setItem("streakCount", streakLS);
      localStorage.setItem("xpTotal", totalXP);
      localStorage.setItem("lastLoginDate", todayISO);
      
      // ✅ SYNC TO FIREBASE
      if (userId) {
        await updateDoc(doc(db, 'userProgress', userId), {
          currentStreak: streakLS,
          lastActiveDate: todayISO,
          totalXP: totalXP,
          lastUpdated: new Date()
        }).catch(err => console.error("Firebase sync error:", err));
      }
      
      console.log(`🔥 Streak increased! Day ${streakLS} (+${dailyReward} XP)`);
    }
    // 😴 Same day: no change
    else if (diffDays === 0) {
      console.log(`😌 Same day login — streak remains at ${streakLS}`);
    }
    // 💀 Missed a day: reset streak, smaller XP reward
    else if (diffDays > 1) {
      console.log(`💀 Missed ${diffDays} day(s). Streak reset.`);
      streakLS = 1;
      totalXP += 5; // consolation reward
      localStorage.setItem("streakCount", streakLS);
      localStorage.setItem("xpTotal", totalXP);
      localStorage.setItem("lastLoginDate", todayISO);
      
      // ✅ SYNC TO FIREBASE
      if (userId) {
        await updateDoc(doc(db, 'userProgress', userId), {
          currentStreak: streakLS,
          lastActiveDate: todayISO,
          totalXP: totalXP,
          lastUpdated: new Date()
        }).catch(err => console.error("Firebase sync error:", err));
      }
    }

    console.log(`✅ Current streak: ${streakLS} | Total XP: ${totalXP}`);
    return { streak: streakLS, totalXP };
  } catch (error) {
    console.error("❌ Error in StreakManager:", error);
    return { streak: 0, totalXP: 0 };
  }
};

// 🧹 Manual reset (for testing or admin use)
export const resetStreak = async (userId) => {
  localStorage.removeItem("lastLoginDate");
  localStorage.setItem("streakCount", 1);
  localStorage.setItem("xpTotal", 0);
  
  // ✅ SYNC TO FIREBASE
  if (userId) {
    await updateDoc(doc(db, 'userProgress', userId), {
      currentStreak: 1,
      totalXP: 0,
      lastUpdated: new Date()
    }).catch(err => console.error("Firebase sync error:", err));
  }
  
  console.log("🔄 Streak reset to 1 and XP cleared.");
  return { streak: 1, totalXP: 0 };
};

// 🧮 Optional getter for total XP anywhere in app
export const getTotalXP = () => {
  return parseInt(localStorage.getItem("xpTotal")) || 0;
};
