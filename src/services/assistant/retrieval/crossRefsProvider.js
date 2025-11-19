const CROSS_REFS = {
  'John 3:16': ['Romans 5:8', '1 John 4:9-10', 'John 3:17'],
  'Genesis 1:1': ['John 1:1-3', 'Hebrews 11:3', 'Psalm 33:6'],
  'Psalm 23:1': ['John 10:11', 'Ezekiel 34:11-12'],
  'Romans 8:28': ['Genesis 50:20', 'Jeremiah 29:11'],
  'Proverbs 3:5': ['Jeremiah 17:7', 'Psalm 37:5'],
  'John 1:1': ['Genesis 1:1-3', 'Colossians 1:16-17', 'Hebrews 1:2-3'],
  'John 14:6': ['Acts 4:12', '1 Timothy 2:5'],
  'Romans 3:23': ['Psalm 14:3', 'Ecclesiastes 7:20'],
  'Romans 6:23': ['John 3:36', 'Ephesians 2:8-9'],
  '1 Corinthians 13:4': ['Galatians 5:22-23', '1 Peter 4:8'],
  'Ephesians 2:8': ['Romans 3:24', 'Titus 3:5', '2 Timothy 1:9'],
  '1 John 4:8': ['1 John 4:16', 'John 3:16', 'Romans 5:8'],
  'Philippians 4:13': ['2 Corinthians 12:9', 'Colossians 1:11'],
};

export function getCrossReferences(reference) {
  return CROSS_REFS[reference] || [];
}

export default { getCrossReferences };
