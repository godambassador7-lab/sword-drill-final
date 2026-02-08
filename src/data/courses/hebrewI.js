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
          text: 'Biblical Hebrew uses a 22-letter consonantal alphabet written right to left. Letter recognition is the first step.'
        },
        {
          heading: 'Final Forms',
          text: 'Several letters have final forms used at word endings. These must be memorized for reading.'
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
