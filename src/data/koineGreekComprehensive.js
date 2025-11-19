/**
 * Comprehensive Koine Greek Course Data
 * Based on 3-Level Complete Course (Beginner → Intermediate → Advanced)
 * Includes lessons, vocabulary, grammar, quizzes, and exams
 */

import { expandedKoineVocabulary } from './koineVocabularyExpanded';

// ============================================================================
// ALPHABET DATA
// ============================================================================
export const greekAlphabet = [
  { letter: 'Α', lowercase: 'α', name: 'Alpha', pronunciation: 'a', phonetic: '/a/' },
  { letter: 'Β', lowercase: 'β', name: 'Beta', pronunciation: 'b', phonetic: '/b/' },
  { letter: 'Γ', lowercase: 'γ', name: 'Gamma', pronunciation: 'g/ng', phonetic: '/g/ or /ŋ/' },
  { letter: 'Δ', lowercase: 'δ', name: 'Delta', pronunciation: 'd', phonetic: '/d/' },
  { letter: 'Ε', lowercase: 'ε', name: 'Epsilon', pronunciation: 'e', phonetic: '/e/' },
  { letter: 'Ζ', lowercase: 'ζ', name: 'Zeta', pronunciation: 'z', phonetic: '/z/' },
  { letter: 'Η', lowercase: 'η', name: 'Eta', pronunciation: 'ey', phonetic: '/ɛː/' },
  { letter: 'Θ', lowercase: 'θ', name: 'Theta', pronunciation: 'th', phonetic: '/θ/' },
  { letter: 'Ι', lowercase: 'ι', name: 'Iota', pronunciation: 'i', phonetic: '/i/' },
  { letter: 'Κ', lowercase: 'κ', name: 'Kappa', pronunciation: 'k', phonetic: '/k/' },
  { letter: 'Λ', lowercase: 'λ', name: 'Lambda', pronunciation: 'l', phonetic: '/l/' },
  { letter: 'Μ', lowercase: 'μ', name: 'Mu', pronunciation: 'm', phonetic: '/m/' },
  { letter: 'Ν', lowercase: 'ν', name: 'Nu', pronunciation: 'n', phonetic: '/n/' },
  { letter: 'Ξ', lowercase: 'ξ', name: 'Xi', pronunciation: 'ks', phonetic: '/ks/' },
  { letter: 'Ο', lowercase: 'ο', name: 'Omicron', pronunciation: 'o', phonetic: '/o/' },
  { letter: 'Π', lowercase: 'π', name: 'Pi', pronunciation: 'p', phonetic: '/p/' },
  { letter: 'Ρ', lowercase: 'ρ', name: 'Rho', pronunciation: 'r', phonetic: '/r/' },
  { letter: 'Σ', lowercase: 'σ/ς', name: 'Sigma', pronunciation: 's', phonetic: '/s/' },
  { letter: 'Τ', lowercase: 'τ', name: 'Tau', pronunciation: 't', phonetic: '/t/' },
  { letter: 'Υ', lowercase: 'υ', name: 'Upsilon', pronunciation: 'u/ü', phonetic: '/y/' },
  { letter: 'Φ', lowercase: 'φ', name: 'Phi', pronunciation: 'ph/f', phonetic: '/pʰ/' },
  { letter: 'Χ', lowercase: 'χ', name: 'Chi', pronunciation: 'kh', phonetic: '/kʰ/' },
  { letter: 'Ψ', lowercase: 'ψ', name: 'Psi', pronunciation: 'ps', phonetic: '/ps/' },
  { letter: 'Ω', lowercase: 'ω', name: 'Omega', pronunciation: 'oh', phonetic: '/ɔː/' },
];

// ============================================================================
// COMPREHENSIVE VOCABULARY (1000+ words organized by level)
// Import from expanded vocabulary file for easier maintenance
// ============================================================================
export const koineVocabulary = expandedKoineVocabulary;

// ============================================================================
// GRAMMAR DATA - Articles, Declensions, Conjugations
// ============================================================================

// Definite Articles - All forms across cases, genders, numbers
export const greekArticles = {
  singular: {
    masculine: {
      nominative: { greek: 'ὁ', transliteration: 'ho', english: 'the' },
      genitive: { greek: 'τοῦ', transliteration: 'tou', english: 'of the' },
      dative: { greek: 'τῷ', transliteration: 'tō', english: 'to/for the' },
      accusative: { greek: 'τόν', transliteration: 'ton', english: 'the' }
    },
    feminine: {
      nominative: { greek: 'ἡ', transliteration: 'hē', english: 'the' },
      genitive: { greek: 'τῆς', transliteration: 'tēs', english: 'of the' },
      dative: { greek: 'τῇ', transliteration: 'tē', english: 'to/for the' },
      accusative: { greek: 'τήν', transliteration: 'tēn', english: 'the' }
    },
    neuter: {
      nominative: { greek: 'τό', transliteration: 'to', english: 'the' },
      genitive: { greek: 'τοῦ', transliteration: 'tou', english: 'of the' },
      dative: { greek: 'τῷ', transliteration: 'tō', english: 'to/for the' },
      accusative: { greek: 'τό', transliteration: 'to', english: 'the' }
    }
  },
  plural: {
    masculine: {
      nominative: { greek: 'οἱ', transliteration: 'hoi', english: 'the' },
      genitive: { greek: 'τῶν', transliteration: 'tōn', english: 'of the' },
      dative: { greek: 'τοῖς', transliteration: 'tois', english: 'to/for the' },
      accusative: { greek: 'τούς', transliteration: 'tous', english: 'the' }
    },
    feminine: {
      nominative: { greek: 'αἱ', transliteration: 'hai', english: 'the' },
      genitive: { greek: 'τῶν', transliteration: 'tōn', english: 'of the' },
      dative: { greek: 'ταῖς', transliteration: 'tais', english: 'to/for the' },
      accusative: { greek: 'τάς', transliteration: 'tas', english: 'the' }
    },
    neuter: {
      nominative: { greek: 'τά', transliteration: 'ta', english: 'the' },
      genitive: { greek: 'τῶν', transliteration: 'tōn', english: 'of the' },
      dative: { greek: 'τοῖς', transliteration: 'tois', english: 'to/for the' },
      accusative: { greek: 'τά', transliteration: 'ta', english: 'the' }
    }
  }
};

// Second Declension Nouns (masculine -ος pattern)
export const nounDeclensions = {
  second_masculine: {
    name: '2nd Declension Masculine',
    example: 'λόγος (word)',
    pattern: {
      singular: {
        nominative: { ending: 'ος', example: 'λόγος', function: 'subject' },
        genitive: { ending: 'ου', example: 'λόγου', function: 'possession' },
        dative: { ending: 'ῳ', example: 'λόγῳ', function: 'indirect object' },
        accusative: { ending: 'ον', example: 'λόγον', function: 'direct object' },
        vocative: { ending: 'ε', example: 'λόγε', function: 'address' }
      },
      plural: {
        nominative: { ending: 'οι', example: 'λόγοι', function: 'subject' },
        genitive: { ending: 'ων', example: 'λόγων', function: 'possession' },
        dative: { ending: 'οις', example: 'λόγοις', function: 'indirect object' },
        accusative: { ending: 'ους', example: 'λόγους', function: 'direct object' },
        vocative: { ending: 'οι', example: 'λόγοι', function: 'address' }
      }
    }
  },
  first_feminine: {
    name: '1st Declension Feminine',
    example: 'ἀγάπη (love)',
    pattern: {
      singular: {
        nominative: { ending: 'η', example: 'ἀγάπη', function: 'subject' },
        genitive: { ending: 'ης', example: 'ἀγάπης', function: 'possession' },
        dative: { ending: 'ῃ', example: 'ἀγάπῃ', function: 'indirect object' },
        accusative: { ending: 'ην', example: 'ἀγάπην', function: 'direct object' },
        vocative: { ending: 'η', example: 'ἀγάπη', function: 'address' }
      },
      plural: {
        nominative: { ending: 'αι', example: 'ἀγάπαι', function: 'subject' },
        genitive: { ending: 'ων', example: 'ἀγαπῶν', function: 'possession' },
        dative: { ending: 'αις', example: 'ἀγάπαις', function: 'indirect object' },
        accusative: { ending: 'ας', example: 'ἀγάπας', function: 'direct object' },
        vocative: { ending: 'αι', example: 'ἀγάπαι', function: 'address' }
      }
    }
  }
};

// Present Active Indicative - εἰμί (to be)
export const verbConjugations = {
  eimi: {
    verb: 'εἰμί',
    meaning: 'I am',
    type: 'irregular',
    tense: 'present',
    voice: 'active',
    mood: 'indicative',
    forms: {
      singular: {
        first: { greek: 'εἰμί', transliteration: 'eimi', english: 'I am' },
        second: { greek: 'εἶ', transliteration: 'ei', english: 'you are' },
        third: { greek: 'ἐστί(ν)', transliteration: 'esti(n)', english: 'he/she/it is' }
      },
      plural: {
        first: { greek: 'ἐσμέν', transliteration: 'esmen', english: 'we are' },
        second: { greek: 'ἐστέ', transliteration: 'este', english: 'you are' },
        third: { greek: 'εἰσί(ν)', transliteration: 'eisi(n)', english: 'they are' }
      }
    }
  },
  omega_verb: {
    verb: 'λύω',
    meaning: 'I loose/destroy',
    type: 'ω-verb',
    tense: 'present',
    voice: 'active',
    mood: 'indicative',
    forms: {
      singular: {
        first: { greek: 'λύω', transliteration: 'lyō', english: 'I loose' },
        second: { greek: 'λύεις', transliteration: 'lyeis', english: 'you loose' },
        third: { greek: 'λύει', transliteration: 'lyei', english: 'he/she/it looses' }
      },
      plural: {
        first: { greek: 'λύομεν', transliteration: 'lyomen', english: 'we loose' },
        second: { greek: 'λύετε', transliteration: 'lyete', english: 'you loose' },
        third: { greek: 'λύουσι(ν)', transliteration: 'lyousi(n)', english: 'they loose' }
      }
    }
  }
};

// Case Functions - What each case does
export const caseFunctions = {
  nominative: {
    name: 'Nominative',
    primaryFunction: 'Subject',
    description: 'The subject of the sentence or predicate nominative',
    examples: [
      { greek: 'ὁ θεὸς ἀγάπη ἐστίν', english: 'God is love', explanation: 'θεός and ἀγάπη are both nominative' }
    ]
  },
  genitive: {
    name: 'Genitive',
    primaryFunction: 'Possession',
    description: 'Shows possession, source, or relationship (of/from)',
    examples: [
      { greek: 'ὁ λόγος τοῦ θεοῦ', english: 'the word of God', explanation: 'θεοῦ shows possession' }
    ]
  },
  dative: {
    name: 'Dative',
    primaryFunction: 'Indirect Object',
    description: 'Indirect object, instrument, or location (to/for/in/by)',
    examples: [
      { greek: 'δίδωμι αὐτῷ ἄρτον', english: 'I give bread to him', explanation: 'αὐτῷ is the indirect object' }
    ]
  },
  accusative: {
    name: 'Accusative',
    primaryFunction: 'Direct Object',
    description: 'Direct object or extent (whom/what)',
    examples: [
      { greek: 'ἀγαπῶ τὸν θεόν', english: 'I love God', explanation: 'θεόν is the direct object' }
    ]
  },
  vocative: {
    name: 'Vocative',
    primaryFunction: 'Direct Address',
    description: 'Used when directly addressing someone',
    examples: [
      { greek: 'κύριε, σῶσον ἡμᾶς', english: 'Lord, save us', explanation: 'κύριε is direct address' }
    ]
  }
};

// ============================================================================
// COURSE STRUCTURE
// ============================================================================
export const koineGreekCourse = {
  beginner: {
    id: 'beginner',
    title: 'Koine Greek Beginner Course',
    description: 'Master the alphabet, basic grammar, and foundational vocabulary',
    totalLessons: 12,
    lessons: [
      {
        id: 1,
        title: 'Understanding Koine Greek',
        description: 'Learn about Koine Greek as the language of the NT',
        content: 'Koine Greek (κοινὴ ἑλληνική) was the everyday language of the Eastern Mediterranean from 300 BC to AD 300. It is the language of the Septuagint and Codex Sinaiticus.',
        topics: ['History', 'Importance', 'Scope'],
        hasQuiz: false
      },
      {
        id: 2,
        title: 'The Greek Alphabet',
        description: 'Learn all 24 letters with pronunciation',
        content: 'Full alphabet chart with uppercase, lowercase, names, and pronunciation',
        topics: ['24 Letters', 'Upper/Lowercase', 'Pronunciation'],
        hasQuiz: true,
        quizTypes: ['alphabet-matching', 'pronunciation']
      },
      {
        id: 3,
        title: 'Pronunciation Guide',
        description: 'Vowels, diphthongs, and practice',
        content: 'Learn proper Koine pronunciation including vowels and diphthongs',
        topics: ['Vowels', 'Diphthongs', 'Practice'],
        hasQuiz: true,
        quizTypes: ['pronunciation', 'reading']
      },
      {
        id: 4,
        title: 'Writing Practice',
        description: 'Practice writing Greek words',
        content: 'Sample words: θεός, λόγος, ἀγάπη, etc.',
        topics: ['Basic Words', 'Writing', 'Recognition'],
        hasQuiz: false
      },
      {
        id: 5,
        title: 'Greek Articles',
        description: 'Learn the definite article in all forms',
        content: 'ὁ, ἡ, τό, τόν, τήν - the definite article',
        topics: ['Masculine', 'Feminine', 'Neuter'],
        hasQuiz: true,
        quizTypes: ['article-identification']
      },
      {
        id: 6,
        title: 'Basic Nouns',
        description: 'First and second declension nouns',
        content: '1st + 2nd declension samples',
        topics: ['First Declension', 'Second Declension', 'Cases'],
        hasQuiz: true,
        quizTypes: ['noun-declension']
      },
      {
        id: 7,
        title: 'Basic Verbs',
        description: 'The verb εἰμί (to be) and basic conjugation',
        content: 'εἰμί (I am) full chart',
        topics: ['Present Tense', 'Conjugation', 'Person/Number'],
        hasQuiz: true,
        quizTypes: ['verb-conjugation']
      },
      {
        id: 8,
        title: 'Beginner Vocabulary',
        description: '100 essential Greek words',
        content: '100 beginner words from the NT',
        topics: ['Nouns', 'Verbs', 'Adjectives'],
        hasQuiz: true,
        quizTypes: ['vocabulary-translation', 'flashcards']
      },
      {
        id: 9,
        title: 'Practice Sentences',
        description: 'Read and translate simple sentences',
        content: 'ὁ θεὸς ἀγάπη ἐστίν. ὁ λόγος τοῦ θεοῦ.',
        topics: ['Word Order', 'Translation', 'Grammar'],
        hasQuiz: true,
        quizTypes: ['translation']
      },
      {
        id: 10,
        title: 'Manuscript Reading',
        description: 'Read from John 1:1',
        content: 'ἐν ἀρχῇ ἦν ὁ λόγος — breakdown',
        topics: ['Reading', 'Analysis', 'Vocabulary'],
        hasQuiz: false
      },
      {
        id: 11,
        title: 'Review Quizzes',
        description: 'Comprehensive review of all topics',
        content: 'Alphabet, vocabulary, transliteration, sentence practice',
        topics: ['Alphabet', 'Vocabulary', 'Grammar'],
        hasQuiz: true,
        quizTypes: ['comprehensive-review']
      },
      {
        id: 12,
        title: 'Final Exam',
        description: 'Beginner level final exam',
        content: 'Alphabet, pronunciation, 50 words, article forms, translations',
        topics: ['All Topics'],
        hasQuiz: false,
        hasExam: true
      }
    ]
  },

  intermediate: {
    id: 'intermediate',
    title: 'Koine Greek Intermediate Course',
    description: 'Master grammar, syntax, verbs, and expand vocabulary',
    totalLessons: 17,
    lessons: [
      {
        id: 1,
        title: 'Review & Expansion',
        description: 'Full pronunciation, breathing marks, accents',
        topics: ['Alphabet Review', 'Accents', 'Breathing Marks'],
        hasQuiz: true
      },
      {
        id: 2,
        title: 'Eight Case Functions',
        description: 'Master all Greek cases and their uses',
        topics: ['Nominative', 'Genitive', 'Dative', 'Accusative', 'Vocative'],
        hasQuiz: true,
        quizTypes: ['case-identification', 'case-function']
      },
      // ... Add remaining intermediate lessons
    ]
  },

  advanced: {
    id: 'advanced',
    title: 'Koine Greek Advanced Course',
    description: 'Master syntax, discourse analysis, and manuscript reading',
    totalLessons: 17,
    lessons: [
      {
        id: 1,
        title: 'Verbal Aspect Theory',
        description: 'Understand perfective, imperfective, and stative aspects',
        topics: ['Aspect Theory', 'Aktionsart', 'Pragmatics'],
        hasQuiz: true
      },
      // ... Add remaining advanced lessons
    ]
  }
};

// Export consolidated structure
export default {
  alphabet: greekAlphabet,
  vocabulary: koineVocabulary,
  course: koineGreekCourse
};
