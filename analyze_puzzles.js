const fs = require('fs');
const path = require('path');

const puzzleDir = './public/bible_word_search_250';
const files = fs.readdirSync(puzzleDir).filter(f => f.startsWith('ws_') && f.endsWith('.json'));

const sizes = {};
const largeGrids = [];
const themeCounts = {};

files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(path.join(puzzleDir, file), 'utf8'));
  const size = data.gridSize;
  sizes[size] = (sizes[size] || 0) + 1;

  // Track themes
  themeCounts[data.theme] = (themeCounts[data.theme] || 0) + 1;

  if (size > 15) {
    largeGrids.push({
      file,
      size,
      title: data.title,
      theme: data.theme,
      wordCount: data.words.length,
      words: data.words
    });
  }
});

console.log('Grid Size Distribution:');
Object.keys(sizes).sort((a,b) => parseInt(a)-parseInt(b)).forEach(size => {
  console.log(`  ${size}x${size}: ${sizes[size]} puzzles`);
});

console.log(`\nLarge grids (>15x15): ${largeGrids.length} puzzles`);
console.log('\nFirst 15 large grid puzzles:');
largeGrids.slice(0, 15).forEach(g => {
  console.log(`  ${g.file}: ${g.size}x${g.size} - ${g.title} (${g.wordCount} words)`);
});

console.log('\n\nTheme Distribution:');
Object.entries(themeCounts).sort((a,b) => b[1] - a[1]).forEach(([theme, count]) => {
  console.log(`  ${theme}: ${count} puzzles`);
});

// Find themes with lots of puzzles that could be split
console.log('\n\nThemes with many puzzles (candidates for splitting):');
Object.entries(themeCounts).filter(([t, c]) => c > 10).forEach(([theme, count]) => {
  console.log(`  ${theme}: ${count} puzzles`);
});
