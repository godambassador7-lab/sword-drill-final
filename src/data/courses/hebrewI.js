const hebrewICourse = {
  id: 'hebrewI',
  title: 'Biblical Hebrew I',
  subtitle: 'Language Course | 6 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Alphabet and Direction',
      icon: 'H1',
      duration: '25 min',
      content: [
        {
          heading: 'Alphabet Basics',
          text: 'Biblical Hebrew (ancient, not modern Israeli Hebrew) uses a 22-letter consonantal alphabet written right to left. Letter recognition is the first step.'
        },
        {
          heading: 'Alphabet (1-11)',
          text: 'Aleph א (silent/stop), Bet ב (b/v), Gimel ג (g), Dalet ד (d), He ה (h), Vav ו (v/w), Zayin ז (z), Het ח (kh), Tet ט (t), Yod י (y), Kaf כ/ך (k/kh).'
        },
        {
          heading: 'Alphabet (12-22)',
          text: 'Lamed ל (l), Mem מ/ם (m), Nun נ/ן (n), Samekh ס (s), Ayin ע (silent/`), Pe פ/ף (p/f), Tsadi צ/ץ (ts), Qof ק (q), Resh ר (r), Shin ש (sh/s), Tav ת (t).'
        },
        {
          heading: 'Final Forms',
          text: 'Several letters have final forms used at word endings. Final forms: ך, ם, ן, ף, ץ.'
        },
        {
          heading: 'Practice Strings',
          text: 'Read right-to-left: אב, בד, גד, יד, לב, מלך, ספר. Focus on letter shapes and direction.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Which letter is Aleph? A) א B) מ C) ר D) ת\n\n2) Which letter is Shin? A) ש B) ס C) צ D) ק\n\n3) Which is a final form? A) ם B) מ C) נ D) ל\n\n4) Which pair is Bet/Final Kaf? A) ב/ך B) כ/ב C) ג/ך D) ד/ך\n\nAnswers: 1-A, 2-A, 3-A, 4-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match letter to name:\n\n1) א 2) ב 3) ג 4) ד 5) ה\n\nA) He B) Bet C) Aleph D) Gimel E) Dalet\n\nAnswers: 1-C, 2-B, 3-D, 4-E, 5-A'
        },
        {
          heading: 'Reading Snippets',
          text: 'Read right-to-left (word — transliteration — gloss):\n\nאב — av — father\nמלך — melek — king\nספר — sefer — book'
        },
        {
          heading: 'Reading Sequence',
          text: 'Genesis 1:1 (selected words):\n\nבראשית — bereshit — in the beginning\nברא — bara — created\nאלהים — elohim — God'
        },
        {
          heading: 'Canonical Short Reading',
          text: 'Genesis 1:1 (short): bereshit bara — in the beginning created'
        }
      ],
      keyTerms: [
        { term: 'Consonantal Alphabet', definition: 'Alphabet primarily of consonants' },
        { term: 'Final Forms', definition: 'Letter forms used at word endings' },
        { term: 'Right-to-Left', definition: 'Direction of Hebrew writing' }
      ],
      quiz: [
        { question: 'Hebrew has how many letters?', options: ['20', '22', '24', '26'], correct: 1, explanation: 'Hebrew has 22 letters.' },
        { question: 'Hebrew is written:', options: ['Right to left', 'Left to right', 'Top to bottom', 'Mixed direction'], correct: 0, explanation: 'Hebrew is written right to left.' },
        { question: 'Final forms appear:', options: ['At word endings', 'At word beginnings', 'Only in verbs', 'Only in poetry'], correct: 0, explanation: 'Final forms appear at word endings.' },
        { question: 'Hebrew alphabet is primarily:', options: ['Consonantal', 'Vowel-only', 'Syllabic', 'Pictographic only'], correct: 0, explanation: 'It is consonantal.' },
        { question: 'Letter recognition helps with:', options: ['Reading', 'Only syntax', 'Only translation', 'Only vocabulary'], correct: 0, explanation: 'It helps reading.' }
      ]
    },
    {
      id: '02',
      title: 'Vowels and Pointing',
      icon: 'H1',
      duration: '25 min',
      content: [
        {
          heading: 'Vowel Points',
          text: 'Vowels in biblical texts are indicated by vowel points added to the consonantal text.'
        },
        {
          heading: 'Syllables',
          text: 'Syllables are built around vowels. Recognizing open and closed syllables supports pronunciation.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Vowel points were standardized by: A) Masoretes B) Romans C) Greeks D) Modern printers\n\n2) Syllables are built around: A) Vowels B) Consonants C) Punctuation D) Stress only\n\n3) Open syllables end with: A) A vowel B) A consonant C) A dot D) A prefix\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Vowel points 2) Open syllable 3) Closed syllable\n\nA) Ends with consonant B) Ends with vowel C) Marks indicating vowels\n\nAnswers: 1-C, 2-B, 3-A'
        },
        {
          heading: 'Reading Snippets',
          text: 'Short syllable drills (sound out): ba, be, bi, bo\n\nConsonant+vowel examples: בָּ, בֶּ, בִּ, בֹ (practice direction and spacing)'
        },
        {
          heading: 'Reading Sequence',
          text: 'Genesis 1:3 (selected words):\n\nיהי — yehi — let there be\nאור — or — light'
        },
        {
          heading: 'Canonical Graded Reading',
          text: 'Genesis 1:3 (graded): yehi or — vayehi or — let there be light — and there was light'
        }
      ],
      keyTerms: [
        { term: 'Vowel Points', definition: 'Marks indicating vowels' },
        { term: 'Syllable', definition: 'Unit of pronunciation with a vowel' },
        { term: 'Open/Closed', definition: 'Syllable types based on ending' }
      ],
      quiz: [
        { question: 'Vowels are shown by:', options: ['Vowel points', 'Extra letters only', 'No marking', 'Numbers'], correct: 0, explanation: 'Vowel points indicate vowels.' },
        { question: 'Syllables are built around:', options: ['Vowels', 'Consonants', 'Punctuation', 'Stress only'], correct: 0, explanation: 'Syllables are built around vowels.' },
        { question: 'Open/closed syllables help with:', options: ['Pronunciation', 'Only syntax', 'Only translation', 'Only vocabulary'], correct: 0, explanation: 'They help pronunciation.' },
        { question: 'Hebrew texts are originally:', options: ['Consonantal', 'Fully vowelled', 'Pictographic', 'Numeric'], correct: 0, explanation: 'They are originally consonantal.' },
        { question: 'Vowel points were standardized by:', options: ['Masoretes', 'Romans', 'Greeks', 'Modern printers'], correct: 0, explanation: 'Masoretes standardized vowel points.' }
      ]
    },
    {
      id: '03',
      title: 'Nouns and Gender',
      icon: 'H1',
      duration: '25 min',
      content: [
        {
          heading: 'Gender and Number',
          text: 'Hebrew nouns mark gender and number. Plurals often use common suffixes.'
        },
        {
          heading: 'Definiteness',
          text: 'The definite article marks known or specific nouns.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Hebrew nouns mark: A) Gender and number B) Tense only C) Case only D) Aspect only\n\n2) Plural forms often use: A) Common suffixes B) Only prefixes C) Only vowel change D) No change\n\n3) The definite article marks: A) Specific nouns B) Only verbs C) Only prepositions D) Only particles\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Gender 2) Plural 3) Definite article\n\nA) More than one B) Masculine or feminine C) Marks specificity\n\nAnswers: 1-B, 2-A, 3-C'
        },
        {
          heading: 'Reading Snippets',
          text: 'Noun patterns (consonantal):\n\nמלך — melek — king\nמַלְכִים — melakhim — kings\nספר — sefer — book'
        },
        {
          heading: 'Reading Sequence',
          text: 'Exodus 3:14 (selected words):\n\nאהיה — ehyeh — I AM\nאשר — asher — that/which'
        },
        {
          heading: 'Canonical Short Reading',
          text: 'Exodus 3:14 (short): ehyeh asher ehyeh — I AM WHO I AM'
        }
      ],
      keyTerms: [
        { term: 'Gender', definition: 'Masculine or feminine noun class' },
        { term: 'Plural', definition: 'Noun form indicating more than one' },
        { term: 'Definite Article', definition: 'Marker of specificity' }
      ],
      quiz: [
        { question: 'Hebrew nouns mark:', options: ['Gender and number', 'Only tense', 'Only case', 'Only aspect'], correct: 0, explanation: 'Nouns mark gender and number.' },
        { question: 'Plural forms often use:', options: ['Common suffixes', 'Only prefixes', 'Only vowel change', 'No change'], correct: 0, explanation: 'Plurals often use suffixes.' },
        { question: 'The definite article marks:', options: ['Specific nouns', 'Only verbs', 'Only prepositions', 'Only particles'], correct: 0, explanation: 'It marks specificity.' },
        { question: 'Gender includes:', options: ['Masculine and feminine', 'Only neuter', 'Only masculine', 'Only feminine'], correct: 0, explanation: 'Hebrew uses masculine and feminine.' },
        { question: 'Noun patterns help with:', options: ['Word identification', 'Only pronunciation', 'Only spelling', 'Only syntax'], correct: 0, explanation: 'Patterns aid identification.' }
      ]
    },
    {
      id: '04',
      title: 'Verbs: Qal Basics',
      icon: 'H1',
      duration: '25 min',
      content: [
        {
          heading: 'Root System',
          text: 'Hebrew verbs are based on three-consonant roots with patterns that create meanings.'
        },
        {
          heading: 'Qal Stem',
          text: 'Qal is the basic stem and a starting point for verb study.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Hebrew verbs are based on: A) Three-consonant roots B) Two vowels C) Numbers D) Articles\n\n2) Qal is: A) The basic stem B) Only passive C) A noun D) A particle\n\n3) A stem indicates: A) Meaning pattern B) Only spelling C) Only number D) Only gender\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Root 2) Stem 3) Qal\n\nA) Basic verbal stem B) Pattern modifying meaning C) Core consonants\n\nAnswers: 1-C, 2-B, 3-A'
        },
        {
          heading: 'Reading Snippets',
          text: 'Root recognition (three consonants):\n\nכתב — ktb — write\nמלך — mlk — reign/king\nאמר — amr — say'
        },
        {
          heading: 'Reading Sequence',
          text: 'Psalm 23:1 (selected words):\n\nיהוה — YHWH — the LORD\nרעי — ro‘i — my shepherd'
        },
        {
          heading: 'Canonical Graded Reading',
          text: 'Psalm 23:1 (graded): YHWH ro‘i — lo ehsar — the LORD is my shepherd — I shall not lack'
        }
      ],
      keyTerms: [
        { term: 'Root', definition: 'Core consonants of a verb' },
        { term: 'Qal', definition: 'Basic verbal stem' },
        { term: 'Stem', definition: 'Pattern modifying meaning' }
      ],
      quiz: [
        { question: 'Hebrew verbs are built from:', options: ['Three-consonant roots', 'Two vowels', 'Numbers', 'Articles'], correct: 0, explanation: 'They are built from three-consonant roots.' },
        { question: 'Qal is:', options: ['The basic stem', 'Only passive', 'A noun', 'A particle'], correct: 0, explanation: 'Qal is the basic stem.' },
        { question: 'A stem indicates:', options: ['Meaning pattern', 'Only spelling', 'Only number', 'Only gender'], correct: 0, explanation: 'Stems indicate meaning patterns.' },
        { question: 'Roots are typically:', options: ['Three consonants', 'Only vowels', 'Numbers', 'Articles'], correct: 0, explanation: 'Roots are often three consonants.' },
        { question: 'Verb study begins with:', options: ['Root recognition', 'Only translation', 'Only pronunciation', 'Only syntax'], correct: 0, explanation: 'Root recognition is foundational.' }
      ]
    },
    {
      id: '05',
      title: 'Basic Syntax',
      icon: 'H1',
      duration: '20 min',
      content: [
        {
          heading: 'Word Order',
          text: 'Hebrew often uses verb-initial clauses, but word order can vary for emphasis.'
        },
        {
          heading: 'Particles',
          text: 'Particles and prepositions show relationships between words and clauses.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Hebrew narrative often uses: A) Verb-initial clauses B) Noun-initial only C) Adjective-initial only D) Passive only\n\n2) Word order can vary for: A) Emphasis B) Randomness C) Vowels only D) Punctuation only\n\n3) Particles show: A) Relationships B) Only spelling C) Only pronunciation D) Only vocabulary\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Verb-initial 2) Particle 3) Clause\n\nA) Small word with grammatical function B) Unit with verb and complements C) Verb first in clause\n\nAnswers: 1-C, 2-A, 3-B'
        },
        {
          heading: 'Reading Snippets',
          text: 'Clause fragments (right-to-left):\n\nויאמר המלך — vayeʼmer ha-melek — and the king said\nבראשית ברא — bereshit bara — in the beginning created'
        },
        {
          heading: 'Reading Sequence',
          text: 'Ruth 1:16 (selected words):\n\nעמך — amekh — your people\nעמי — ami — my people'
        },
        {
          heading: 'Canonical Short Reading',
          text: 'Ruth 1:16 (short): amekh ami — your people (are) my people'
        }
      ],
      keyTerms: [
        { term: 'Verb-Initial', definition: 'Clause with verb first' },
        { term: 'Particle', definition: 'Small word with grammatical function' },
        { term: 'Clause', definition: 'Unit with a verb and complements' }
      ],
      quiz: [
        { question: 'Hebrew narrative often uses:', options: ['Verb-initial clauses', 'Only noun-initial clauses', 'Only adjective-initial clauses', 'Only passive clauses'], correct: 0, explanation: 'Verb-initial clauses are common.' },
        { question: 'Word order can vary for:', options: ['Emphasis', 'Randomness', 'Only vowels', 'Only punctuation'], correct: 0, explanation: 'Word order can vary for emphasis.' },
        { question: 'Particles help show:', options: ['Relationships', 'Only spelling', 'Only pronunciation', 'Only vocabulary'], correct: 0, explanation: 'Particles show relationships.' },
        { question: 'A clause includes:', options: ['A verb and complements', 'Only nouns', 'Only adjectives', 'Only adverbs'], correct: 0, explanation: 'A clause includes a verb and complements.' },
        { question: 'Syntax awareness helps with:', options: ['Parsing and translation', 'Only spelling', 'Only history', 'Only vocabulary'], correct: 0, explanation: 'Syntax helps parsing and translation.' }
      ]
    },
    {
      id: '06',
      title: 'Reading and Translation',
      icon: 'H1',
      duration: '25 min',
      content: [
        {
          heading: 'Reading Strategy',
          text: 'Start with short phrases. Identify roots, forms, and basic syntax before translating.'
        },
        {
          heading: 'Translation Practice',
          text: 'Use context and grammar to select the best translation. Be attentive to textual variants.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Parsing identifies: A) Grammatical form B) Punctuation only C) Genre only D) History only\n\n2) A variant is: A) Manuscript difference B) Translation error only C) A vowel point D) A suffix\n\n3) Translation should consider: A) Context and grammar B) Word order only C) Vocabulary only D) Punctuation only\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Parsing 2) Variant 3) Context\n\nA) Surrounding text shaping meaning B) Difference among manuscripts C) Identifying grammatical form\n\nAnswers: 1-C, 2-B, 3-A'
        },
        {
          heading: 'Reading Snippets',
          text: 'Short phrases for parsing:\n\nשׁמע ישראל — shema yisrael — hear, Israel\nאמן — amen — truly/so be it'
        },
        {
          heading: 'Reading Sequence',
          text: 'Deuteronomy 6:4 (selected words):\n\nשמע — shema — hear\nישראל — yisrael — Israel\nיהוה — YHWH — the LORD'
        },
        {
          heading: 'Canonical Graded Reading',
          text: 'Deuteronomy 6:4 (graded): shema yisrael YHWH eloheinu YHWH echad — Hear, Israel: the LORD our God, the LORD is one'
        }
      ],
      keyTerms: [
        { term: 'Parsing', definition: 'Identifying grammatical form' },
        { term: 'Variant', definition: 'Difference among manuscripts' },
        { term: 'Context', definition: 'Surrounding text shaping meaning' }
      ],
      quiz: [
        { question: 'Reading should begin with:', options: ['Short phrases', 'Long paragraphs', 'Only poetry', 'Only grammar tables'], correct: 0, explanation: 'Begin with short phrases.' },
        { question: 'Parsing identifies:', options: ['Grammatical form', 'Only punctuation', 'Only genre', 'Only history'], correct: 0, explanation: 'Parsing identifies form.' },
        { question: 'Translation should consider:', options: ['Context and grammar', 'Only word order', 'Only vocabulary', 'Only punctuation'], correct: 0, explanation: 'Context and grammar are key.' },
        { question: 'A variant is:', options: ['Manuscript difference', 'Translation error only', 'A vowel point', 'A suffix'], correct: 0, explanation: 'Variants are manuscript differences.' },
        { question: 'Context helps with:', options: ['Meaning selection', 'Only spelling', 'Only pronunciation', 'Only grammar'], correct: 0, explanation: 'Context helps select meaning.' }
      ]
    }
  ],
  finalExam: [
    { question: 'Hebrew has how many letters?', options: ['20', '22', '24', '26'], correct: 1, explanation: 'Hebrew has 22 letters.' },
    { question: 'Hebrew is written:', options: ['Right to left', 'Left to right', 'Top to bottom', 'Mixed direction'], correct: 0, explanation: 'It is written right to left.' },
    { question: 'Vowels are shown by:', options: ['Vowel points', 'Extra letters only', 'No marking', 'Numbers'], correct: 0, explanation: 'Vowel points indicate vowels.' },
    { question: 'Nouns mark:', options: ['Gender and number', 'Only tense', 'Only case', 'Only aspect'], correct: 0, explanation: 'Nouns mark gender and number.' },
    { question: 'Qal is:', options: ['The basic stem', 'Only passive', 'A noun', 'A particle'], correct: 0, explanation: 'Qal is the basic stem.' },
    { question: 'Hebrew verbs are built from:', options: ['Three-consonant roots', 'Two vowels', 'Numbers', 'Articles'], correct: 0, explanation: 'They are built from three-consonant roots.' },
    { question: 'Verb-initial clauses are:', options: ['Common', 'Impossible', 'Only poetic', 'Only modern'], correct: 0, explanation: 'They are common.' },
    { question: 'Particles help with:', options: ['Relationships', 'Only pronunciation', 'Only spelling', 'Only vocabulary'], correct: 0, explanation: 'Particles show relationships.' },
    { question: 'Parsing identifies:', options: ['Grammatical form', 'Only punctuation', 'Only genre', 'Only history'], correct: 0, explanation: 'Parsing identifies form.' },
    { question: 'A variant is:', options: ['A manuscript difference', 'A translation error', 'A vowel point', 'A suffix'], correct: 0, explanation: 'Variants are manuscript differences.' }
  ],
  about: {
    level: 'Language Course',
    description: 'An introductory Biblical Hebrew course covering script, vowels, basic grammar, and translation skills with a text-driven, non-denominational approach.',
    credits: '3 credits',
    prerequisites: 'None'
  }
};

export default hebrewICourse;
