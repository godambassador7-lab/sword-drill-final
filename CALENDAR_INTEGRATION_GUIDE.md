# Hebrew Calendar & Activity Dashboard Integration Guide

## Overview

This guide explains how to integrate the new Hebrew Calendar and Activity Dashboard features into your Sword Drill application.

## Features Included

### 1. **Dual Calendar Display**
- Shows both Roman (Gregorian) and Hebrew calendar dates side-by-side
- Indicates current feast days and Shabbat
- Roman date is clickable to open Activity Dashboard

### 2. **Activity Dashboard**
- Monthly calendar view with quiz completion tracking
- Flame icons (🔥) on days with completed quizzes
- Statistics summary (monthly quizzes, streaks, points)
- Category breakdown
- Infinite scrolling through months
- Mobile-responsive design

### 3. **Biblical Feast Days**
- Automatic detection of all Biblical feast days
- Upcoming feast days list (next 60 days)
- Detailed information about each feast (themes, Scripture references, significance)
- Integration with Hebrew calendar calculations

### 4. **S.H.A.R.P. Assistant Enhancement**
- Can answer questions about feast days
- Provides Hebrew calendar information
- Aware of current feast day context
- Enhanced theological knowledge base

## File Structure

```
src/
├── components/
│   ├── DualCalendarDisplay.jsx      # Dual calendar component
│   ├── ActivityDashboard.jsx        # Main dashboard view
│   ├── MonthlyCalendar.jsx          # Calendar grid component
│   └── FeastDayList.jsx             # Feast days list component
├── hooks/
│   ├── useHebrewDate.js             # Hebrew date hook
│   ├── useFeastDays.js              # Feast days hook
│   └── useUserActivityData.js       # Activity data hook
├── services/
│   ├── utils/
│   │   └── hebrewCalendar.js        # Hebrew calendar utilities
│   └── assistant/
│       └── feastDayKnowledge.js     # Feast day knowledge for SHARP
└── data/
    └── biblical-feast-days-repo/
        └── data/
            └── feasts.json          # Feast days data
```

## Installation

The required dependencies have already been installed:

```bash
npm install @hebcal/core
```

## Integration Steps

### Step 1: Import Components and Hooks

Add these imports to your `App.js`:

\`\`\`javascript
import { Suspense, lazy } from 'react';
import { useHebrewDate, useHebrewCalendarPreference } from './hooks/useHebrewDate';
import { useFeastDays } from './hooks/useFeastDays';
import DualCalendarDisplay from './components/DualCalendarDisplay';
const ActivityDashboard = lazy(() => import('./components/ActivityDashboard'));
const FeastDayList = lazy(() => import('./components/FeastDayList'));
\`\`\`

### Step 2: Add State Management

In your main App component, add these state variables:

\`\`\`javascript
function App() {
  const [user, setUser] = useState(null);
  const [showActivityDashboard, setShowActivityDashboard] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'settings', etc.

  // Hebrew Calendar State
  const { showHebrewCalendar, setShowHebrewCalendar } = useHebrewCalendarPreference(user?.uid);
  const hebrewDate = useHebrewDate();
  const { upcomingFeasts, todaysFeast } = useFeastDays(60);

  // Your existing state...
}
\`\`\`

### Step 3: Add Dual Calendar to Top Bar

Replace or enhance your existing date display:

\`\`\`javascript
{/* Top Bar - Add this where you want the calendar display */}
<div className="top-bar-calendar">
  <DualCalendarDisplay
    showHebrewCalendar={showHebrewCalendar}
    onRomanDateClick={() => setShowActivityDashboard(true)}
    className="mb-4"
  />
</div>
\`\`\`

### Step 4: Add Activity Dashboard Modal

Add this near the end of your component, before the closing tags:

\`\`\`javascript
{/* Activity Dashboard Modal */}
{showActivityDashboard && (
  <Suspense fallback={<div>Loading dashboard...</div>}>
    <ActivityDashboard
      userId={user?.uid}
      onClose={() => setShowActivityDashboard(false)}
      currentStreak={userProgress?.currentStreak || 0}
    />
  </Suspense>
)}
\`\`\`

### Step 5: Add Settings Toggle

In your Settings view, add the Hebrew Calendar toggle:

\`\`\`javascript
{/* Settings View */}
<div className="settings-section">
  <h3 className="text-lg font-bold mb-3">Calendar Settings</h3>

  <label className="flex items-center justify-between p-4 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700">
    <div>
      <div className="font-semibold">Display Hebrew Calendar</div>
      <div className="text-sm text-slate-400">
        Show Hebrew dates alongside Gregorian dates
      </div>
    </div>
    <input
      type="checkbox"
      checked={showHebrewCalendar}
      onChange={(e) => setShowHebrewCalendar(e.target.checked)}
      className="form-checkbox h-5 w-5 text-blue-600"
    />
  </label>
</div>
\`\`\`

### Step 6: Add Feast Days List to Settings

In your Settings view, add the feast days list:

\`\`\`javascript
{/* Feast Days Section in Settings */}
{showHebrewCalendar && (
  <Suspense fallback={<div>Loading feast days...</div>}>
    <FeastDayList daysAhead={60} className="mt-6" />
  </Suspense>
)}
\`\`\`

### Step 7: Update Firebase Integration (Optional)

To persist Hebrew calendar preference in Firestore:

\`\`\`javascript
// In your dbService.js or similar
export async function updateCalendarPreferences(userId, preferences) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    calendarPreferences: {
      showHebrewCalendar: preferences.showHebrewCalendar,
      updatedAt: serverTimestamp()
    }
  });
}

// Load preferences on user login
export async function getCalendarPreferences(userId) {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  return userDoc.data()?.calendarPreferences || { showHebrewCalendar: false };
}
\`\`\`

## Usage Examples

### Example 1: Basic Integration

\`\`\`javascript
function App() {
  const [user, setUser] = useState(null);
  const [showActivityDashboard, setShowActivityDashboard] = useState(false);
  const { showHebrewCalendar, setShowHebrewCalendar } = useHebrewCalendarPreference(user?.uid);

  return (
    <div className="app">
      {/* Header with Calendar */}
      <header className="app-header">
        <DualCalendarDisplay
          showHebrewCalendar={showHebrewCalendar}
          onRomanDateClick={() => setShowActivityDashboard(true)}
        />
      </header>

      {/* Main Content */}
      <main>{/* Your app content */}</main>

      {/* Activity Dashboard */}
      {showActivityDashboard && (
        <ActivityDashboard
          userId={user?.uid}
          onClose={() => setShowActivityDashboard(false)}
          currentStreak={0}
        />
      )}
    </div>
  );
}
\`\`\`

### Example 2: With Feast Day Awareness

\`\`\`javascript
function HomeView() {
  const { todaysFeast } = useFeastDays(60);
  const hebrewDate = useHebrewDate();

  return (
    <div>
      {/* Special message if today is a feast day */}
      {todaysFeast && (
        <div className="feast-day-banner">
          <h2>Today is {todaysFeast.name}! 🎉</h2>
          <p>{todaysFeast.details?.tooltip}</p>
        </div>
      )}

      {/* Show if it's Shabbat */}
      {hebrewDate.isShabbat && (
        <div className="shabbat-greeting">
          <p>Shabbat Shalom! 🕊️</p>
        </div>
      )}
    </div>
  );
}
\`\`\`

### Example 3: SHARP Assistant with Feast Days

Users can now ask SHARP questions like:

- "What is Passover?"
- "When is the next feast day?"
- "Tell me about Yom Kippur"
- "What feast day is today?"
- "What is the Hebrew calendar?"
- "When is Sukkot?"

SHARP will automatically detect these queries and provide detailed Biblical information.

## Styling

The components use Tailwind CSS classes matching Sword Drill's amber/gold + slate/charcoal color palette:

- Primary: `amber-500`, `amber-600`
- Background: `slate-800`, `slate-900`
- Text: `slate-100`, `slate-300`
- Accents: `blue-600`, `purple-600`, `orange-500`

## Mobile Responsiveness

All components are mobile-first and responsive:

- Calendar display stacks vertically on small screens
- Activity dashboard adjusts grid layout
- Feast days list scrolls smoothly on mobile
- Touch-friendly tap targets

## Firebase Integration

### Required Firestore Structure

\`\`\`javascript
users/{userId}
  └── calendarPreferences {
      showHebrewCalendar: boolean,
      updatedAt: timestamp
  }

quizResults/{resultId}
  ├── uid: string
  ├── dateCompleted: timestamp
  ├── quizType: string
  ├── category: string
  ├── pointsEarned: number
  └── ...
\`\`\`

### Security Rules

Add these to your Firestore security rules:

\`\`\`javascript
match /users/{userId}/calendarPreferences {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

match /quizResults/{resultId} {
  allow read: if request.auth != null && resource.data.uid == request.auth.uid;
  allow write: if request.auth != null && request.auth.uid == request.resource.data.uid;
}
\`\`\`

## Testing

### Test Checklist

- [ ] Dual calendar displays both dates correctly
- [ ] Roman date click opens Activity Dashboard
- [ ] Activity Dashboard shows correct quiz history
- [ ] Flame icons appear on days with activity
- [ ] Month navigation works (previous/next/current)
- [ ] Settings toggle persists Hebrew calendar preference
- [ ] Feast days list shows upcoming feasts
- [ ] Feast day details expand on click
- [ ] SHARP can answer feast day questions
- [ ] Mobile layout is responsive
- [ ] Shabbat detection works (Saturday)
- [ ] Today's feast day is highlighted

### Manual Testing Commands

Test SHARP's feast day knowledge:

1. "What is Passover?"
2. "When is the next feast day?"
3. "Tell me about the Hebrew calendar"
4. "What feast is today?"
5. "Explain Yom Kippur"

## Troubleshooting

### Issue: Hebrew dates not showing
**Solution**: Check that `@hebcal/core` is installed and imported correctly.

### Issue: Activity Dashboard not loading quiz data
**Solution**: Verify Firestore query permissions and date field format.

### Issue: Feast days list empty
**Solution**: Check that `feasts.json` is in the correct location and readable.

### Issue: SHARP not answering feast day questions
**Solution**: Verify `feastDayKnowledge.js` is imported in `pipeline.js`.

## Performance Considerations

- Hebrew calendar calculations are cached
- Activity data is paginated by month
- Feast days are computed once per day
- Components use React.memo for optimization
- Lazy loading for heavy components (ActivityDashboard, FeastDayList)

## Future Enhancements

Possible additions:

1. **Export Activity Data**: Allow users to export calendar data as PDF/CSV
2. **Feast Day Notifications**: Push notifications for upcoming feasts
3. **Custom Reminders**: Set reminders for specific feast days
4. **Study Plans**: Create feast-based study plans
5. **Community Calendar**: Share activity with friends
6. **Historical View**: View activity for past years
7. **Achievements**: Unlock badges for feast day participation

## Support

For questions or issues, please refer to:
- Sword Drill documentation
- @hebcal/core documentation: https://github.com/hebcal/hebcal-es6
- Firebase documentation

## Credits

- Hebrew calendar powered by [@hebcal/core](https://github.com/hebcal/hebcal-es6)
- Feast day data compiled from Biblical sources
- Icons from [Lucide React](https://lucide.dev/)

---

**Happy coding, and may your Sword Drill journey be blessed!** 🗡️✨
