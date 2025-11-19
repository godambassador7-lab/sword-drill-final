# Hebrew Calendar & Biblical Feast Days Feature

## 🎯 Overview

This feature adds comprehensive Hebrew calendar support and Biblical feast day awareness to Sword Drill, enhancing the app's spiritual depth and educational value.

## ✨ Key Features

### 1. **Dual Calendar Display**
Display both Gregorian (Roman) and Hebrew calendar dates simultaneously, helping users understand the Biblical calendar system.

**Features:**
- Real-time Hebrew date conversion
- Automatic Shabbat (Sabbath) detection
- Current feast day highlighting
- Clickable Roman date to access Activity Dashboard
- Smooth animations and responsive design

### 2. **Activity Dashboard** 📅
A comprehensive monthly calendar view tracking quiz completion history with visual flame indicators.

**Features:**
- Monthly calendar grid with day-by-day activity
- Flame icons (🔥) showing quiz completion count per day
- Statistics summary card showing:
  - Monthly quiz count
  - Current streak
  - Best streak for the month
  - Total points earned
  - Most active day
- Category breakdown (Flash Cards, Drill, Ancient Texts, Random)
- Infinite scrolling through past and future months
- Hover tooltips showing detailed daily statistics
- Mobile-responsive layout

### 3. **Biblical Feast Days System**
Comprehensive database and display of all Biblical feast days and holidays.

**Included Feasts:**
- **Spring Feasts:**
  - Passover (Pesach)
  - Unleavened Bread (Chag HaMatzot)
  - Firstfruits (Bikkurim)
  - Feast of Weeks / Pentecost (Shavuot)

- **Fall Feasts:**
  - Feast of Trumpets (Yom Teruah / Rosh Hashanah)
  - Day of Atonement (Yom Kippur)
  - Feast of Tabernacles (Sukkot)

- **Other Observances:**
  - Weekly Sabbath (Shabbat)
  - New Moons (Rosh Chodesh)
  - Purim
  - Hanukkah (Feast of Dedication)

**Feast Day Information Includes:**
- English and Hebrew names
- Themes and spiritual significance
- Primary Old Testament references
- New Testament fulfillment passages
- Practical observance guidelines
- Days until next occurrence
- Category classification

### 4. **Enhanced S.H.A.R.P. Assistant** 🤖
SHARP now has deep knowledge of Biblical feast days and can answer questions about:

**Query Examples:**
- "What is Passover?"
- "When is the next feast day?"
- "Tell me about Yom Kippur"
- "What feast day is today?"
- "Explain the Hebrew calendar"
- "What are the appointed times?"
- "How did Jesus celebrate Passover?"
- "What is the significance of Sukkot?"

**SHARP's Enhanced Capabilities:**
- Automatic feast day intent detection
- Detailed theological explanations
- Scripture reference integration
- Historical context
- New Testament fulfillment connections
- Current feast day awareness in all responses

## 🏗️ Technical Architecture

### Components

#### `DualCalendarDisplay.jsx`
Displays both Roman and Hebrew dates side-by-side with feast day indicators.

#### `ActivityDashboard.jsx`
Full-screen modal showing monthly activity calendar with statistics.

#### `MonthlyCalendar.jsx`
Reusable calendar grid component with activity visualization.

#### `FeastDayList.jsx`
Expandable list of upcoming feast days with detailed information.

### Hooks

#### `useHebrewDate(date?)`
Hook for Hebrew date conversion and Shabbat detection.

#### `useHebrewCalendarPreference(userId)`
Manages user preference for Hebrew calendar display (with localStorage).

#### `useFeastDays(daysAhead)`
Fetches and caches upcoming feast days.

#### `useTodaysFeast()`
Checks if today is a feast day.

#### `useUserActivityData(userId, year, month)`
Loads user quiz activity data from Firestore for calendar visualization.

### Utilities

#### `hebrewCalendar.js`
Core utility functions for Hebrew calendar operations:
- `gregorianToHebrew()` - Convert dates
- `getUpcomingFeastDays()` - Get feast days list
- `isFeastDay()` - Check specific date
- `getFeastDetails()` - Get feast information
- `formatHebrewDate()` - Format for display

#### `feastDayKnowledge.js`
SHARP's feast day knowledge base:
- `answerFeastDayQuery()` - Process feast queries
- `isFeastDayQuery()` - Detect feast questions
- `getCurrentFeastDayContext()` - Context awareness

## 📊 Data Sources

### Feast Days Data (`feasts.json`)
Structured JSON containing:
- 11 major feasts and observances
- Biblical references (OT and NT)
- Themes and theological significance
- Practical participation guidelines
- Categories and classifications

### Hebrew Calendar Library
Uses `@hebcal/core` for accurate:
- Hebrew date calculations
- Feast day date determination
- Lunar month tracking
- Leap year handling

## 🎨 Design System

### Color Palette
Matches Sword Drill's existing aesthetic:

- **Primary Gold:** `amber-500`, `amber-600`
- **Accent Orange:** `orange-500`, `orange-600`
- **Background:** `slate-800`, `slate-900`
- **Text:** `slate-100`, `slate-300`, `slate-400`
- **Calendar Accents:** `blue-600`, `purple-600`
- **Feast Indicators:** `amber-400`, `amber-500`

### Icons
- Calendar: 📅
- Flame (activity): 🔥
- Star (Hebrew date): ⭐
- Sparkles (feast day): ✨
- Trophy (achievement): 🏆
- Target (goals): 🎯

## 📱 Mobile Support

All components are fully responsive:
- Touch-friendly tap targets (minimum 44x44px)
- Smooth scroll behavior
- Adaptive layouts for small screens
- Optimized performance for mobile devices
- Progressive enhancement approach

## 🔒 Privacy & Data

### Local Storage
- Hebrew calendar preference stored locally
- No sensitive data stored
- User-specific, device-specific

### Firebase Integration
Optional persistence to Firestore:
```javascript
users/{userId}/calendarPreferences
  - showHebrewCalendar: boolean
  - updatedAt: timestamp
```

### Quiz Activity Data
Reads existing quiz results:
```javascript
quizResults/{resultId}
  - uid: string
  - dateCompleted: timestamp
  - quizType: string
  - category: string
  - pointsEarned: number
```

## ⚡ Performance

### Optimizations
- Lazy loading for heavy components
- React.memo for pure components
- Caching of calendar calculations
- Pagination of activity data by month
- Debounced state updates
- Efficient Firestore queries with indexes

### Bundle Size
- `@hebcal/core`: ~45KB gzipped
- Components: ~30KB combined
- Total added: ~75KB gzipped

## 🧪 Testing

### Manual Test Cases

#### Dual Calendar Display
- [ ] Hebrew date displays correctly
- [ ] Roman date is clickable
- [ ] Shabbat indicator shows on Saturday
- [ ] Today's feast day is highlighted
- [ ] Responsive on mobile

#### Activity Dashboard
- [ ] Opens when clicking Roman date
- [ ] Close button works
- [ ] Shows correct quiz history
- [ ] Flame icons on active days
- [ ] Statistics are accurate
- [ ] Month navigation works
- [ ] Mobile layout adjusts properly

#### Feast Days
- [ ] Upcoming feasts list populates
- [ ] Feast details expand on click
- [ ] Scripture references display
- [ ] Days until calculation correct
- [ ] Category colors render

#### SHARP Integration
- [ ] Recognizes feast day queries
- [ ] Provides detailed answers
- [ ] Includes Scripture references
- [ ] Maintains conversation context

### Automated Testing
(To be implemented)

```javascript
describe('Hebrew Calendar', () => {
  test('converts Gregorian to Hebrew', () => {
    const result = gregorianToHebrew(new Date('2025-01-01'));
    expect(result.year).toBe(5785);
  });

  test('detects Shabbat correctly', () => {
    const saturday = new Date('2025-01-04'); // Saturday
    expect(isShabbat(saturday)).toBe(true);
  });
});
```

## 📚 Educational Value

### Learning Outcomes

Users will:
- Understand the Biblical calendar system
- Learn about appointed times (moedim)
- Connect OT feasts to NT fulfillment
- Discover Jesus' participation in feasts
- Appreciate Hebrew culture and tradition
- See Scripture's historical timeline

### Theological Integration

Supports study of:
- Typology (OT types, NT fulfillment)
- Covenant theology
- Jewish roots of Christianity
- Prophecy and eschatology
- Messianic connections

## 🚀 Future Enhancements

### Potential Additions

1. **Feast Day Study Plans**
   - Curated verse lists for each feast
   - Historical readings
   - Devotional content

2. **Notifications**
   - Upcoming feast reminders
   - Daily Hebrew date notification
   - Shabbat greeting

3. **Community Features**
   - Share activity calendar
   - Feast day challenges
   - Group study sessions

4. **Extended Calendar**
   - Torah reading portions (Parsha)
   - Omer counting (between Passover and Pentecost)
   - Fast days
   - Modern Israeli holidays

5. **Export/Sharing**
   - Export activity data as PDF
   - Share achievements
   - Calendar integration (Google/Apple Calendar)

6. **Historical Data**
   - Multi-year activity view
   - Long-term streak tracking
   - Year-over-year comparison

7. **Feast Day Content**
   - Video explanations
   - Traditional recipes
   - Family activities
   - Worship songs/liturgy

## 🤝 Contributing

### Adding New Feasts

To add a feast to the system:

1. Add entry to `feasts.json`:
```json
{
  "id": "new_feast",
  "englishName": "Feast Name",
  "hebrewName": "Hebrew Name",
  "category": "spring|fall|monthly|weekly",
  "type": ["annual", "pilgrimage"],
  "primaryOTRefs": ["Reference 1"],
  "ntRefs": ["Reference 1"],
  "themes": ["theme1", "theme2"],
  "participationSummary": "How to observe..."
}
```

2. Update feast day knowledge in `feastDayKnowledge.js`

3. Test with SHARP queries

### Reporting Issues

When reporting issues, include:
- Device/browser information
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Console errors

## 📖 Resources

### External Documentation
- [@hebcal/core documentation](https://github.com/hebcal/hebcal-es6)
- [Leviticus 23 (Biblical feast days)](https://www.biblegateway.com/passage/?search=Leviticus+23&version=KJV)
- [Hebrew calendar explanation](https://en.wikipedia.org/wiki/Hebrew_calendar)

### Internal Documentation
- [Integration Guide](./CALENDAR_INTEGRATION_GUIDE.md)
- [Quick Integration Example](./QUICK_INTEGRATION_EXAMPLE.jsx)
- [Feast Day Theology](./src/data/biblical-feast-days-repo/theology/feasts-and-jesus-in-nt.md)

## 📄 License

This feature is part of Sword Drill and follows the same license.

## 🙏 Acknowledgments

- Hebrew calendar calculations: @hebcal/core team
- Feast day research: Multiple Biblical commentaries and resources
- Icon design: Lucide Icons
- Community feedback and testing

---

**"And the LORD spoke to Moses, saying, 'Speak to the people of Israel and say to them, These are the appointed feasts of the LORD that you shall proclaim as holy convocations; they are my appointed feasts.'" — Leviticus 23:1-2 (ESV)**

May this feature help users grow in understanding of God's appointed times and their fulfillment in Christ! 🙏✨
