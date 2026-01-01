/**
 * Convert Bible Translation Files for Offline Download
 *
 * This script converts the existing Bible translation files from:
 *   public/bible/[translation]/[BookName].json
 *
 * Into a single combined file for offline download:
 *   public/bibles/[translation].json
 */

const fs = require('fs');
const path = require('path');

// Translation metadata
const TRANSLATIONS = {
  kjv: {
    name: 'King James Version',
    abbreviation: 'KJV',
    language: 'English',
    year: 1611,
    description: 'Classic English translation from 1611',
    copyright: 'Public Domain'
  },
  asv: {
    name: 'American Standard Version',
    abbreviation: 'ASV',
    language: 'English',
    year: 1901,
    description: 'American revision of the KJV from 1901',
    copyright: 'Public Domain'
  },
  web: {
    name: 'World English Bible',
    abbreviation: 'WEB',
    language: 'English',
    year: 2000,
    description: 'Modern English public domain translation',
    copyright: 'Public Domain'
  },
  ylt: {
    name: "Young's Literal Translation",
    abbreviation: 'YLT',
    language: 'English',
    year: 1898,
    description: 'Literal word-for-word translation from 1898',
    copyright: 'Public Domain'
  }
};

function convertTranslation(translationId) {
  console.log(`\n📖 Converting ${translationId.toUpperCase()}...`);

  const metadata = TRANSLATIONS[translationId];
  if (!metadata) {
    console.error(`❌ No metadata found for ${translationId}`);
    return;
  }

  const sourcePath = path.join(__dirname, '../public/bible', translationId);
  const outputPath = path.join(__dirname, '../public/bibles', `${translationId}.json`);

  // Check if source directory exists
  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source directory not found: ${sourcePath}`);
    return;
  }

  const result = {
    metadata: metadata,
    books: {}
  };

  try {
    // Read all JSON files in the translation directory
    const files = fs.readdirSync(sourcePath).filter(f => f.endsWith('.json'));

    if (files.length === 0) {
      console.error(`❌ No JSON files found in ${sourcePath}`);
      return;
    }

    console.log(`   Found ${files.length} books`);

    files.forEach((file, index) => {
      const bookName = file.replace('.json', '');
      const bookPath = path.join(sourcePath, file);

      try {
        const bookData = JSON.parse(fs.readFileSync(bookPath, 'utf8'));

        // The structure is: { "book": "Genesis", "chapters": { "1": { "1": "verse text", ... }, ... } }
        // We want just the chapters object
        if (bookData.chapters) {
          result.books[bookName] = bookData.chapters;
        } else if (bookData.book) {
          // If there's no chapters key, use the whole object minus metadata
          const { book, ...chapters } = bookData;
          result.books[bookName] = chapters;
        } else {
          // Assume the entire object is the chapters
          result.books[bookName] = bookData;
        }

        // Progress indicator
        if ((index + 1) % 10 === 0) {
          console.log(`   Processed ${index + 1}/${files.length} books...`);
        }
      } catch (error) {
        console.error(`   ⚠️  Error reading ${bookName}:`, error.message);
      }
    });

    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the combined file
    console.log(`   Writing combined file...`);
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

    // Get file size
    const stats = fs.statSync(outputPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    const sizeKB = (stats.size / 1024).toFixed(0);

    console.log(`   ✅ Created ${path.basename(outputPath)}`);
    console.log(`   📦 Size: ${sizeMB} MB (${sizeKB} KB)`);
    console.log(`   📚 Books: ${Object.keys(result.books).length}`);

  } catch (error) {
    console.error(`❌ Error converting ${translationId}:`, error.message);
  }
}

// Main execution
console.log('🔄 Bible Translation Converter for Offline Download');
console.log('=' .repeat(60));

const translationsToConvert = process.argv.slice(2);

if (translationsToConvert.length === 0) {
  // Convert all translations
  console.log('Converting all available translations...\n');
  Object.keys(TRANSLATIONS).forEach(convertTranslation);
} else {
  // Convert only specified translations
  console.log(`Converting: ${translationsToConvert.join(', ')}\n`);
  translationsToConvert.forEach(id => {
    if (TRANSLATIONS[id.toLowerCase()]) {
      convertTranslation(id.toLowerCase());
    } else {
      console.error(`❌ Unknown translation: ${id}`);
      console.log(`   Available: ${Object.keys(TRANSLATIONS).join(', ')}`);
    }
  });
}

console.log('\n' + '='.repeat(60));
console.log('✨ Conversion complete!');
console.log('\nNext steps:');
console.log('1. Check public/bibles/ for generated files');
console.log('2. Test downloads in the app (Settings → Offline Bible Translations)');
console.log('3. Verify files can be parsed as valid JSON');
console.log('4. Test offline reading functionality\n');
