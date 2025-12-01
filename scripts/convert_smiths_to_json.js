// Convert Smith's Bible Dictionary from JSON Lines to indexed JSON format
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'public', "Smith's Bible Dictionary.txt");
const outputPath = path.join(__dirname, '..', 'public', 'dictionaries', 'smiths.json');

function normalizeKey(term) {
  return (term || '').toString().toLowerCase().replace(/[^a-z]/g, '');
}

function convertSmithsDictionary() {
  console.log('Reading Smith\'s Bible Dictionary...');
  const content = fs.readFileSync(inputPath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());

  const index = {};
  let processedCount = 0;
  let skippedCount = 0;

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      if (entry.term && entry.definitions) {
        const key = normalizeKey(entry.term);
        if (key) {
          // Join all definitions into a single string
          const definition = Array.isArray(entry.definitions)
            ? entry.definitions.join(' ')
            : String(entry.definitions);

          index[key] = {
            headword: entry.term,
            pos: null, // Smith's doesn't include part of speech
            def: definition,
            src: 'SMITHS'
          };
          processedCount++;
        } else {
          skippedCount++;
        }
      } else {
        skippedCount++;
      }
    } catch (err) {
      console.error('Error parsing line:', line.substring(0, 50) + '...', err.message);
      skippedCount++;
    }
  }

  console.log(`Processed ${processedCount} entries, skipped ${skippedCount}`);
  console.log(`Writing to ${outputPath}...`);

  // Ensure dictionaries directory exists
  const dirPath = path.dirname(outputPath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
  console.log('Done! Smith\'s Bible Dictionary converted successfully.');
  console.log(`Total entries: ${Object.keys(index).length}`);
}

convertSmithsDictionary();
