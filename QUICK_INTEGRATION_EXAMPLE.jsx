/**
 * QUICK INTEGRATION EXAMPLE
 *
 * This file shows how to quickly integrate the Hebrew Calendar and Activity Dashboard
 * into your existing Sword Drill App.js
 *
 * Copy the relevant sections into your App.js file.
 */

// ============================================================================
// STEP 1: ADD IMPORTS (Add these to your existing imports in App.js)
// ============================================================================

import React, { Suspense, lazy } from 'react';
import { CalendarDays } from 'lucide-react';

// Calendar hooks
import { useHebrewCalendarPreference } from './hooks/useHebrewDate';
import { useFeastDays } from './hooks/useFeastDays';

// Calendar components (lazy loaded for performance)
import DualCalendarDisplay from './components/DualCalendarDisplay';
const ActivityDashboard = lazy(() => import('./components/ActivityDashboard'));
const FeastDayList = lazy(() => import('./components/FeastDayList'));


// ============================================================================
// STEP 2: ADD STATE (Add these to your existing state variables)
// ============================================================================

function App() {
  // ... your existing state ...

  // Calendar state
  const [showActivityDashboard, setShowActivityDashboard] = useState(false);
  const { showHebrewCalendar, setShowHebrewCalendar } = useHebrewCalendarPreference(user?.uid);
  const { upcomingFeasts, todaysFeast } = useFeastDays(60);

  // ... rest of your component ...
}


// ============================================================================
// STEP 3: ADD CALENDAR DISPLAY (Add this to your header/top bar)
// ============================================================================

// Option A: Simple top bar replacement
<div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
  <h1 className="text-xl font-bold">Sword Drill</h1>

  <DualCalendarDisplay
    showHebrewCalendar={showHebrewCalendar}
    onRomanDateClick={() => setShowActivityDashboard(true)}
  />
</div>

// Option B: As part of existing header
<header className="app-header">
  {/* Your existing header content */}

  <div className="header-calendar mt-3">
    <DualCalendarDisplay
      showHebrewCalendar={showHebrewCalendar}
      onRomanDateClick={() => setShowActivityDashboard(true)}
      className="max-w-2xl mx-auto"
    />
  </div>
</header>


// ============================================================================
// STEP 4: ADD SETTINGS SECTION (Add this to your Settings view)
// ============================================================================

// Inside your Settings component/view:
<div className="settings-view p-6">
  {/* Your existing settings sections */}

  {/* Calendar Settings Section */}
  <div className="settings-section mt-6">
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
      <CalendarDays size={28} />
      Calendar Settings
    </h2>

    {/* Hebrew Calendar Toggle */}
    <label className="flex items-center justify-between p-4 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors mb-4">
      <div className="flex-1">
        <div className="font-semibold text-white">Display Hebrew Calendar</div>
        <div className="text-sm text-slate-400 mt-1">
          Show Hebrew dates alongside Gregorian dates
        </div>
      </div>
      <div className="ml-4">
        <input
          type="checkbox"
          checked={showHebrewCalendar}
          onChange={(e) => setShowHebrewCalendar(e.target.checked)}
          className="form-checkbox h-5 w-5 text-blue-600 rounded"
        />
      </div>
    </label>

    {/* Feast Days List (shown when Hebrew calendar is enabled) */}
    {showHebrewCalendar && (
      <Suspense fallback={
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      }>
        <FeastDayList daysAhead={60} />
      </Suspense>
    )}
  </div>
</div>


// ============================================================================
// STEP 5: ADD ACTIVITY DASHBOARD MODAL (Add this near the end of your App)
// ============================================================================

// Add this before your closing </div> or </ErrorBoundary>
return (
  <div className="app">
    {/* Your existing app content */}

    {/* Activity Dashboard Modal - Add this */}
    {showActivityDashboard && (
      <Suspense fallback={
        <div className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-slate-300">Loading Activity Dashboard...</p>
          </div>
        </div>
      }>
        <ActivityDashboard
          userId={user?.uid}
          onClose={() => setShowActivityDashboard(false)}
          currentStreak={userProgress?.currentStreak || 0}
        />
      </Suspense>
    )}

    {/* SHARP Assistant - Your existing SHARP component */}
    {/* (SHARP now automatically knows about feast days!) */}
  </div>
);


// ============================================================================
// STEP 6: OPTIONAL - ADD FEAST DAY AWARENESS TO HOME VIEW
// ============================================================================

// Add special banners/greetings based on current feast days
function HomeView() {
  const { todaysFeast } = useFeastDays(60);

  return (
    <div className="home-view">
      {/* Special banner if today is a feast day */}
      {todaysFeast && (
        <div className="feast-day-banner bg-gradient-to-r from-amber-600 to-orange-600 p-6 rounded-lg mb-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={32} className="animate-pulse" />
            <h2 className="text-2xl font-bold">Today is {todaysFeast.name}!</h2>
          </div>
          {todaysFeast.details && (
            <p className="text-amber-50">{todaysFeast.details.tooltip}</p>
          )}
        </div>
      )}

      {/* Your existing home view content */}
    </div>
  );
}


// ============================================================================
// STEP 7: OPTIONAL - ADD FIREBASE PERSISTENCE
// ============================================================================

// Add this to your dbService.js (or create new calendarService.js)

import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Save calendar preferences to Firestore
 */
export async function saveCalendarPreferences(userId, preferences) {
  if (!userId) return;

  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'calendarPreferences.showHebrewCalendar': preferences.showHebrewCalendar,
      'calendarPreferences.updatedAt': serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving calendar preferences:', error);
  }
}

/**
 * Load calendar preferences from Firestore
 */
export async function loadCalendarPreferences(userId) {
  if (!userId) return { showHebrewCalendar: false };

  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const data = userDoc.data();

    return {
      showHebrewCalendar: data?.calendarPreferences?.showHebrewCalendar || false
    };
  } catch (error) {
    console.error('Error loading calendar preferences:', error);
    return { showHebrewCalendar: false };
  }
}

// Then in your App.js, load preferences on user login:
useEffect(() => {
  if (user?.uid) {
    loadCalendarPreferences(user.uid).then(prefs => {
      setShowHebrewCalendar(prefs.showHebrewCalendar);
    });
  }
}, [user?.uid]);

// And save when preference changes:
useEffect(() => {
  if (user?.uid) {
    saveCalendarPreferences(user.uid, { showHebrewCalendar });
  }
}, [showHebrewCalendar, user?.uid]);


// ============================================================================
// EXAMPLE: COMPLETE MINIMAL INTEGRATION
// ============================================================================

import React, { useState, Suspense, lazy } from 'react';
import { useHebrewCalendarPreference } from './hooks/useHebrewDate';
import { useFeastDays } from './hooks/useFeastDays';
import DualCalendarDisplay from './components/DualCalendarDisplay';
const ActivityDashboard = lazy(() => import('./components/ActivityDashboard'));

function MinimalApp() {
  const [user] = useState({ uid: 'demo-user' });
  const [showActivityDashboard, setShowActivityDashboard] = useState(false);
  const { showHebrewCalendar, setShowHebrewCalendar } = useHebrewCalendarPreference(user?.uid);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header with Calendar */}
      <header className="p-4 border-b border-slate-700">
        <DualCalendarDisplay
          showHebrewCalendar={showHebrewCalendar}
          onRomanDateClick={() => setShowActivityDashboard(true)}
        />
      </header>

      {/* Main Content */}
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-4">Sword Drill</h1>

        {/* Settings */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showHebrewCalendar}
            onChange={(e) => setShowHebrewCalendar(e.target.checked)}
            className="form-checkbox h-5 w-5"
          />
          <span>Show Hebrew Calendar</span>
        </label>
      </main>

      {/* Activity Dashboard */}
      {showActivityDashboard && (
        <Suspense fallback={<div>Loading...</div>}>
          <ActivityDashboard
            userId={user?.uid}
            onClose={() => setShowActivityDashboard(false)}
            currentStreak={5}
          />
        </Suspense>
      )}
    </div>
  );
}

export default MinimalApp;


// ============================================================================
// TESTING SHARP'S FEAST DAY KNOWLEDGE
// ============================================================================

/**
 * Test these queries with S.H.A.R.P. Assistant:
 *
 * 1. "What is Passover?"
 * 2. "When is the next feast day?"
 * 3. "Tell me about Yom Kippur"
 * 4. "What feast day is today?"
 * 5. "Explain the Hebrew calendar"
 * 6. "When is Sukkot?"
 * 7. "What are the spring feasts?"
 * 8. "Tell me about Shavuot"
 * 9. "What is Rosh Chodesh?"
 * 10. "When is Hanukkah?"
 *
 * SHARP will now automatically recognize and answer these queries
 * with detailed Biblical information!
 */
