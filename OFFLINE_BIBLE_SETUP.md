# Offline Bible Download Setup Guide

## Overview

The offline Bible download feature allows users to download complete Bible translations to their device for reading without an internet connection, similar to YouVersion.

## Implementation Status

✅ **Complete:**
- Backend service (`src/services/offlineBibleService.js`)
- UI component (`src/components/BibleDownloadManager.jsx`)
- IndexedDB storage system
- Progress tracking during download
- Storage management
- Integration into Settings page

⚠️ **Pending:**
- Creating full Bible JSON files for each translation
- Converting existing Bible data to downloadable format

## File Structure

### Location
All downloadable Bible files must be placed in:
```
public/bibles/
```

### Required Files
Based on `AVAILABLE_TRANSLATIONS` in `offlineBibleService.js`:

1. **kjv.json** - King James Version (Free)
2. **asv.json** - American Standard Version (Free)
3. **bishops.json** - Bishop's Bible (Free)
4. **geneva.json** - Geneva Bible (Free)
5. **lxx.json** - Septuagint / Greek Old Testament (Requires unlock)
6. **wlc.json** - Westminster Leningrad Codex / Hebrew OT (Requires unlock)

### JSON Format

Each file should follow this structure:

```json
{
  "metadata": {
    "name": "King James Version",
    "abbreviation": "KJV",
    "language": "English",
    "year": 1611,
    "description": "Classic English translation from 1611",
    "copyright": "Public Domain"
  },
  "books": {
    "Genesis": {
      "1": {
        "1": "In the beginning God created the heaven and the earth.",
        "2": "And the earth was without form, and void...",
        ...
      },
      "2": {
        "1": "Thus the heavens and the earth were finished...",
        ...
      },
      ...
    },
    "Exodus": {
      ...
    },
    ...
  }
}
```

## Converting Existing Bible Data

### Current Bible Data Location
Your existing Bible data is in:
```
public/bible/kjv/
public/bible/asv/
public/bible/web/
public/bible/ylt/
...
```

### Conversion Script Needed

You'll need to create a script to:
1. Read all books from a translation folder (e.g., `public/bible/kjv/`)
2. Combine them into a single JSON file
3. Add metadata
4. Output to `public/bibles/[translation].json`

### Example Conversion Script (Node.js)

```javascript
// scripts/convertBibleToDownloadable.js
const fs = require('fs');
const path = require('path');

const TRANSLATIONS = {
  kjv: {
    name: 'King James Version',
    abbreviation: 'KJV',
    language: 'English',
    year: 1611,
    description: 'Classic English translation from 1611'
  },
  asv: {
    name: 'American Standard Version',
    abbreviation: 'ASV',
    language: 'English',
    year: 1901,
    description: 'American revision of the KJV from 1901'
  }
};

function convertTranslation(translationId) {
  const metadata = TRANSLATIONS[translationId];
  const sourcePath = path.join(__dirname, '../public/bible', translationId);
  const outputPath = path.join(__dirname, '../public/bibles', `${translationId}.json`);

  const result = {
    metadata: metadata,
    books: {}
  };

  // Read all JSON files in the translation directory
  const files = fs.readdirSync(sourcePath).filter(f => f.endsWith('.json'));

  files.forEach(file => {
    const bookName = file.replace('.json', '');
    const bookPath = path.join(sourcePath, file);
    const bookData = JSON.parse(fs.readFileSync(bookPath, 'utf8'));

    // Assuming bookData has chapters as keys
    result.books[bookName] = bookData.chapters || bookData;
  });

  // Write the combined file
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`✅ Created ${outputPath}`);

  // Get file size
  const stats = fs.statSync(outputPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`   Size: ${sizeMB} MB`);
}

// Convert all translations
Object.keys(TRANSLATIONS).forEach(convertTranslation);
```

### Running the Conversion

1. Create the script at `scripts/convertBibleToDownloadable.js`
2. Run: `node scripts/convertBibleToDownloadable.js`
3. Verify output files in `public/bibles/`

## Testing the Feature

### 1. Start Development Server
```bash
npm start
```

### 2. Navigate to Settings
- Open the app
- Click the menu (hamburger icon)
- Go to Settings section
- Scroll to "Offline Bible Translations"

### 3. Test Download
- Click "Download" on KJV or ASV
- Watch the progress bar show translation name and percentage
- Verify download completes
- Check that the translation appears in "Downloaded Translations"

### 4. Test Offline Access
- Open browser DevTools
- Go to Application → IndexedDB → SwordDrillBible
- Verify translation data is stored
- Test offline mode (disconnect internet)
- Verify Bible can still be read

### 5. Test Delete
- Click "Delete" on a downloaded translation
- Confirm deletion
- Verify storage is freed

## Browser Storage Limits

### IndexedDB Quotas
- Desktop browsers: Usually 50% of available disk space
- Mobile browsers: Varies (typically 10-50 MB minimum)
- Each Bible translation: 4-5 MB

### Storage Info Display
The BibleDownloadManager component shows:
- Total storage used
- Available storage
- Percentage used
- Per-translation size

## Next Steps

1. **Create Conversion Script**: Write the script to convert existing Bible data
2. **Generate JSON Files**: Run conversion for all 6 translations
3. **Verify File Sizes**: Ensure files are optimized (compress if needed)
4. **Test Downloads**: Test each translation downloads correctly
5. **Test Reading**: Verify downloaded Bibles can be read offline
6. **Mobile Testing**: Test on actual mobile devices (iOS Safari, Android Chrome)

## Future Enhancements

Potential improvements for later:

- **Compression**: Use gzip or brotli for smaller downloads
- **Delta Updates**: Download only changed books/chapters
- **Background Download**: Allow app usage while downloading
- **Download Queue**: Queue multiple translations
- **Auto-Update**: Check for translation updates periodically
- **Reading Progress Sync**: Track reading position per translation
- **Offline Bible Reader**: Dedicated reader for downloaded translations

## File Locations Reference

```
src/
├── services/
│   └── offlineBibleService.js          # Backend service (✅ Complete)
└── components/
    └── BibleDownloadManager.jsx         # UI component (✅ Complete)

public/
├── bible/                               # Current Bible data (source)
│   ├── kjv/
│   ├── asv/
│   └── ...
└── bibles/                              # Downloadable Bibles (⚠️ Need to create)
    ├── README.md                        # Format documentation
    ├── SAMPLE_kjv_structure.json        # Example structure
    ├── kjv.json                         # ⚠️ To be created
    ├── asv.json                         # ⚠️ To be created
    ├── bishops.json                     # ⚠️ To be created
    ├── geneva.json                      # ⚠️ To be created
    ├── lxx.json                         # ⚠️ To be created (requires unlock)
    └── wlc.json                         # ⚠️ To be created (requires unlock)
```

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify JSON file structure matches expected format
3. Check IndexedDB in DevTools
4. Ensure file URLs are correct
5. Test with small sample file first

---

**Status**: Ready for Bible JSON file creation and testing
**Date**: 2026-01-01
**Version**: 1.0
