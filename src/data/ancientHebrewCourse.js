import ancientHebrewVocabulary from './ancient_hebrew_course/vocab.json';

export const ancientHebrewModules = [
  {
    id: 'basic',
    level: 'Basic',
    levelKey: 'basic',
    title: 'Hebrew Alphabet & Foundations',
    summary:
      'Learn aleph to tav, vowel markings, and syllable constructs so you can pronounce Hebrew text accurately.',
    highlights: [
      { label: 'Aleph-bet walkthrough with vowel pairings', lessonKey: 'alphabet' },
      { label: 'Vowels, dagesh, and syllable beats', lessonKey: 'vowels' },
      { label: 'Intro vocabulary for God, king, man, righteousness', lessonKey: 'vocab' }
    ],
    questions: [
      'Which consonant nearest to your tongue inspires the most awe when reading aloud?',
      'How do vowel markings change the feel of a familiar name like אֶלֹהִים?'
    ],
    reference: 'Psalm 119:105',
    resource: 'basic.md'
  },
  {
    id: 'intermediate',
    level: 'Intermediate',
    levelKey: 'intermediate',
    title: 'Binyanim & Conjugations',
    summary:
      'Master the verb structures (binyanim), conjugations, and vocabulary that bring narrative texts to life.',
    highlights: [
      { label: 'Five major binyanim and their meanings', lessonKey: 'binyanim' },
      { label: 'Basic conjugation across perfect and imperfect', lessonKey: 'conjugations' },
      { label: 'Construct-state vocabulary anchors', lessonKey: 'vocab' }
    ],
    questions: [
      'Which binyan reflects passive action, and where does it appear in Genesis?',
      'How does the construct state link the noun you just studied to its possessor?'
    ],
    reference: 'Genesis 1:1-5',
    resource: 'intermediate.md'
  },
  {
    id: 'advanced',
    level: 'Advanced',
    levelKey: 'advanced',
    title: 'Syntax, Poetry & Discourse',
    summary:
      'Push into Hebrew syntax, poetic structures, and discourse markers so prophecy and Psalms shimmer with new layers.',
    highlights: [
      { label: 'Parallelism & poetic structure in the Psalms', lessonKey: 'poetry' },
      { label: 'Syntax clues in prophetic speech', lessonKey: 'syntax' },
      { label: 'Advanced theological vocabulary', lessonKey: 'vocab' }
    ],
    questions: [
      'Where does Hebrew parallelism reinforce the promise of God’s covenant?',
      'Which discourse marker in Isaiah enforces the judgment and hope motif?'
    ],
    reference: 'Isaiah 40:1-8',
    resource: 'advanced.md'
  }
];

export const ancientHebrewPronunciationGuide = `Pronunciation highlights
- Hebrew uses guttural consonants like ח (chet) and ע (ayin); feel the throat vibration.
- Emphasize the distinction between short vowels (patach, segol, cholam) and their long counterparts.
- When a letter receives a dagesh (dot), it either strengthens the consonant or doubles it (e.g., בּ vs ב).

Vowels
- Patach (ַ) = short "a", as in "father".
- Chirik (ִ) = long "ee".
- Sheva (ְ) = reduced vowel (schwa-like) that often disappears in speech but shapes syllable counts.

Consonant tips
- Resh (ר) is lightly rolled.
- Tav (ת) without a dagesh is pronounced like "th" in some traditions but as "t" in Biblical Hebrew.
`;

export const ancientHebrewVocabularySets = ancientHebrewVocabulary;
