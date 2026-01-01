# Offline Bible Translations

This directory contains Bible translations in JSON format for offline download functionality.

## Directory Structure

Each translation should be a single JSON file with the following structure:

```json
{
  "metadata": {
    "name": "King James Version",
    "abbreviation": "KJV",
    "language": "English",
    "year": 1611,
    "description": "Classic English translation from 1611"
  },
  "books": {
    "Genesis": {
      "1": {
        "1": "In the beginning God created the heaven and the earth.",
        "2": "And the earth was without form, and void...",
        ...
      },
      ...
    },
    ...
  }
}
```

## Expected Files

The following translation files are referenced by the offline download system:

- `kjv.json` - King James Version (KJV)
- `asv.json` - American Standard Version (ASV)
- `bishops.json` - Bishop's Bible
- `geneva.json` - Geneva Bible
- `lxx.json` - Septuagint (Greek Old Testament) - Requires unlock
- `wlc.json` - Westminster Leningrad Codex (Hebrew OT) - Requires unlock

## File Size

Each JSON file should be compressed and optimized for download. Typical sizes:
- English translations: 4-5 MB
- Greek/Hebrew: 3-4 MB

## Creating Translation Files

To create a new translation file:

1. Convert your Bible data to the JSON structure above
2. Ensure all books, chapters, and verses are properly formatted
3. Include complete metadata
4. Test the file can be parsed with `JSON.parse()`
5. Place the file in this directory

## Notes

- Files in this directory are downloaded by users for offline reading
- Keep file sizes reasonable for mobile download
- Ensure proper copyright/licensing for each translation
- Public domain translations are preferred
