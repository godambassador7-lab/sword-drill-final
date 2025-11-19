import koineVocabulary from './koine_greek_course/vocab.json';

export const koineGreekModules = [
  {
    id: 'basic',
    level: 'Basic',
    levelKey: 'basic',
    title: 'Alphabet & Foundations',
    summary:
      'Master the Koine alphabet, syllable rules, and breathing marks so you can sound out and recognize every word before tackling grammar.',
    highlights: [
      { label: 'Alphabet walk with phonetic cues from alpha to omega', lessonKey: 'alphabet' },
      { label: 'Smooth and rough breathing marks, plus the hagios example', lessonKey: 'syllables' },
      { label: 'First 50 vocabulary words anchored in Gospel essentials', lessonKey: 'vocab' }
    ],
    questions: [
      'What new nuance from the alphabet or breathing marks helps you read the Word slower and more reverently?',
      'Which of the 50 starter words connects most naturally to your current devotion?'
    ],
    reference: 'John 1:1-5',
    resource: 'basic.md'
  },
  {
    id: 'intermediate',
    level: 'Intermediate',
    levelKey: 'intermediate',
    title: 'Cases, Tenses, & Moods',
    summary:
      'Survey the noun cases, verb system, moods, and intermediate vocabulary so that clauses in the Gospels and epistles start to feel alive.',
    highlights: [
      { label: 'Noun cases as windows into subjects, objects, and possession', lessonKey: 'cases' },
      { label: 'Verb tenses, voices, and moods mapped against real NT verbs', lessonKey: 'verbSystem' },
      { label: 'Paraded vocab for messengers, faith, and grace with contextual hooks', lessonKey: 'vocab' }
    ],
    questions: [
      'Which case best answers the question “who is doing the action” in today’s verse?',
      'How does the tense/voice of a verb deepen the character of Christ in your passage?'
    ],
    reference: 'Matthew 5:1-12',
    resource: 'intermediate.md'
  },
  {
    id: 'advanced',
    level: 'Advanced',
    levelKey: 'advanced',
    title: 'Syntax & Discursive Power',
    summary:
      'Zoom into clause structure, participles, aspect, and textual nuance so the Apostle Paul and the Johannine literature begin to reveal hidden patterns.',
    highlights: [
      { label: 'Hypotactic constructions, conditionals, purpose/result clauses, genitive absolutes', lessonKey: 'syntax' },
      { label: 'Clarity on aspect theory, participles as bridges, and periphrastic motion', lessonKey: 'aspect' },
      { label: 'Advanced glossaries for theological and rare NT vocabulary', lessonKey: 'vocab' }
    ],
    questions: [
      'What does the aspect of the main verb reveal about the action’s spiritual urgency?',
      'Where does the discourse feature (e.g., genitive absolute) highlight God’s sovereignty?'
    ],
    reference: 'Romans 8:28-39',
    resource: 'advanced.md'
  }
];

export const koinePronunciationGuide = `Erasmian vs Koine
- Koine favors smoother, less aspirated pronunciation than Erasmian.
- Example: vowels like αι, οι, υι glide toward /ee/ or /oee/ sounds.

Consonants
- Gamma before gamma/kappa/chi/x is nasal (e.g., γογγυλος “goggulos”).
- Rho at the beginning of a word carries a soft aspiration.

Diphthongs
- αι = /eye/ or /ee/ depending on era, often pronounced like “oeye” in modern Koine.
- ει = /ee/ or /ay/; ου = /oo/; οι = /oi/; υι = /wee/ or /ee/.
- ᾳ/ῃ denote long sounds; understanding their length sharpens reading cadence.
`;

export const koineVocabularySets = koineVocabulary;
