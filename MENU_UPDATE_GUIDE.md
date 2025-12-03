# Hamburger Menu Reorganization Guide

## Overview
The menu has been completely reorganized with your requested structure.

## New Menu Structure

### 1. **HOME** (Top-level button - prominent white)
- Home

### 2. **TRAIN** (Section)
- Practice Review
- Personal Verse Bank

### 3. **STUDY** (Section - All study materials consolidated here)
- Bible Reader
- Greek Lexicon
- Hebrew Lexicon
- Smith's Dictionary (with lock icon + secure purchase)
- Biblical Bloodlines
- Κοινή Greek (course)
- עברית עתיקה (course)
- Hermeneutics (course)
- Church History (course)
- Kings of Israel (course)
- Textual Criticism (course)

### 4. **PLANS & CALENDAR** (Section)
- Learning Plans
- Activity Calendar

### 5. **ACHIEVEMENTS & REWARDS** (Section)
- Achievements & Badges (with NEW indicator)
- Power-Ups & Unlockables (with active count badge)
- Streak Milestones

### 6. **PROFILE & PROGRESS** (Section)
- Level Progress & XP
- Points Log & Stats

### 7. **TUTORIAL & HELP** (Section)
- Tutorials & Help

### 8. **SETTINGS** (Section)
- Account & Preferences

### SIGN OUT (Bottom separator - red)
- Sign Out

## Key Features

### ✅ Train Section
- **Practice Review** - Main quiz practice mode
- **Personal Verse Bank** - User's saved verses

### ✅ Study Section
- **All learning materials in one place**
- **Smith's Dictionary** now uses secure `purchaseUnlockable()` function with server-side validation
- **All 6 courses** grouped together under Study
- **Lexicons** easily accessible
- **Biblical Bloodlines** family tree tool

### ✅ Achievements & Rewards
- **All unlockables** now consolidated here (not scattered)
- **Power-Ups & Unlockables** combined into one button
- **Active boost count** shows on badge

### ✅ Tutorial & Help
- **New dedicated section** between Profile and Settings
- Makes help more discoverable

## Security Enhancement

Smith's Dictionary purchase now uses the secure validation:

```javascript
purchaseUnlockable(currentUser.uid, 'smithDictionary', 500).then(result => {
  if (result.success && result.validatedData) {
    setUserData(prev => ({
      ...prev,
      totalPoints: result.validatedData.totalPoints,
      unlockables: result.validatedData.unlockables
    }));
    showToast('📖 Smith\'s Bible Dictionary unlocked!', 'success');
  } else {
    showToast(result.error || 'Failed to unlock dictionary', 'error');
  }
}).catch(err => {
  showToast('Error: ' + err.message, 'error');
});
```

This ensures:
- Server-side point validation
- Recomputes points from quiz history
- Detects tampering
- Returns validated remaining points

## Visual Improvements

1. **Cleaner Organization**: Train and Study are distinct and focused
2. **Consistent Icons**: All 18px (except Home/Sign Out at 20px)
3. **Smart Badges**:
   - NEW on Achievements (if unviewed)
   - Active count on Power-Ups (if boosts active)
   - Lock icon on Smith's Dictionary (if not unlocked)
4. **Section Headers**: Amber uppercase with proper spacing
5. **Hover Effects**: Subtle gradients matching each section's theme

## Code Location

**File**: `src/App.js`
**Lines to Replace**: 5162-5647
**Replace with**: Content from `MENU_REPLACEMENT.txt`

## Manual Replacement Steps

1. Open `src/App.js` in your editor
2. Navigate to line 5162: `<nav className="space-y-1">`
3. Select all text from line 5162 through line 5647
   - This includes everything from `<nav className="space-y-1">` to the closing `</div>` before Tutorial & Help section
4. Delete the selected text
5. Paste the entire content from `MENU_REPLACEMENT.txt` (skip the first line which is just a comment)
6. Save the file
7. Verify Sign Out button is still intact at lines 5649-5656 (should not be affected)

## Testing Checklist

After replacement, verify:
- [ ] Home button works and is prominent (white)
- [ ] Practice Review starts correctly
- [ ] Personal Verse Bank loads
- [ ] Bible Reader modal opens
- [ ] Greek Lexicon loads
- [ ] Hebrew Lexicon loads
- [ ] Smith's Dictionary shows lock if not unlocked
- [ ] Smith's Dictionary purchase uses secure validation
- [ ] Smith's Dictionary opens if already unlocked
- [ ] Biblical Bloodlines opens
- [ ] All 6 courses load (Greek, Hebrew, Hermeneutics, Church History, Kings, Textual Criticism)
- [ ] Learning Plans open
- [ ] Calendar displays
- [ ] Achievements page loads with NEW badge if applicable
- [ ] Power-Up Shop shows active boost count
- [ ] Streak Milestones loads
- [ ] Analytics (Level Progress) loads
- [ ] Mastery (Points Log) loads
- [ ] Tutorials & Help opens modal
- [ ] Settings page loads
- [ ] Sign Out works
- [ ] Menu closes after each selection

## Benefits

1. **Logical Grouping**: Train vs Study is clear distinction
2. **All Courses Together**: No more hunting for study materials
3. **Unlockables Consolidated**: Everything in Achievements & Rewards
4. **Help is Discoverable**: Dedicated section makes it easy to find
5. **Security**: Smith's Dictionary uses validated purchase
6. **Cleaner**: Fewer sections, better organization
7. **Scalable**: Easy to add new items to appropriate sections

## Structure Summary

```
📱 Menu
├── 🏠 Home (prominent)
├── 🎯 Train (2 items)
│   ├── Practice Review
│   └── Personal Verse Bank
├── 📚 Study (11 items)
│   ├── Bible Reader
│   ├── Lexicons (2)
│   ├── Smith's Dictionary
│   ├── Biblical Bloodlines
│   └── Courses (6)
├── 📅 Plans & Calendar (2 items)
├── 🏆 Achievements & Rewards (3 items)
├── 📊 Profile & Progress (2 items)
├── ❓ Tutorial & Help (1 item)
├── ⚙️ Settings (1 item)
└── 🚪 Sign Out (bottom)
```

Total: 8 sections, ~22 menu items (down from previous scattered organization)
