const greekICourse = {
  id: 'greekI',
  title: 'Biblical Greek I',
  subtitle: 'Language Course | 6 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Alphabet and Pronunciation',
      icon: 'G1',
      duration: '25 min',
      content: [
        {
          heading: 'Alphabet Basics',
          text: 'Greek uses a 24-letter alphabet. Mastering letter shapes and names is essential for reading.'
        },
        {
          heading: 'Pronunciation',
          text: 'Koine pronunciation is reconstructed for study. Practice reading short syllables and words.'
        }
      ],
      keyTerms: [
        { term: 'Alphabet', definition: 'Set of letters used to write Greek' },
        { term: 'Syllable', definition: 'Unit of pronunciation with a vowel' },
        { term: 'Koine', definition: 'Common Greek of the NT era' }
      ],
      quiz: [
        { question: 'Greek has how many letters?', options: ['22', '24', '26', '28'], correct: 1, explanation: 'Greek has 24 letters.' },
        { question: 'Pronunciation practice starts with:', options: ['Long passages', 'Short syllables and words', 'Only grammar tables', 'Only translation'], correct: 1, explanation: 'Start with short syllables and words.' },
        { question: 'Koine Greek refers to:', options: ['Classical Latin', 'Common Greek of the NT era', 'Modern English', 'Aramaic'], correct: 1, explanation: 'Koine Greek is common Greek of the NT era.' },
        { question: 'Alphabet mastery helps with:', options: ['Reading recognition', 'Only syntax', 'Only translation', 'Only vocabulary'], correct: 0, explanation: 'It helps reading recognition.' },
        { question: 'A syllable contains:', options: ['A vowel sound', 'Only consonants', 'Only punctuation', 'Only stress'], correct: 0, explanation: 'Syllables are built around vowels.' }
      ]
    },
    {
      id: '02',
      title: 'Nouns and Articles',
      icon: 'G1',
      duration: '25 min',
      content: [
        {
          heading: 'Cases and Endings',
          text: 'Greek nouns use case endings to show grammatical role. Learning common endings is foundational.'
        },
        {
          heading: 'The Article',
          text: 'Greek uses a definite article that agrees in case, gender, and number with the noun.'
        }
      ],
      keyTerms: [
        { term: 'Case', definition: 'Form indicating grammatical role' },
        { term: 'Article', definition: 'Definite article agreeing with a noun' },
        { term: 'Gender', definition: 'Masculine, feminine, or neuter' }
      ],
      quiz: [
        { question: 'Greek cases indicate:', options: ['Grammatical role', 'Only pronunciation', 'Only vocabulary', 'Only genre'], correct: 0, explanation: 'Cases indicate grammatical role.' },
        { question: 'The article agrees with the noun in:', options: ['Case, gender, number', 'Only case', 'Only gender', 'Only number'], correct: 0, explanation: 'It agrees in case, gender, and number.' },
        { question: 'Noun endings help identify:', options: ['Case and number', 'Only pronunciation', 'Only syntax', 'Only vocabulary'], correct: 0, explanation: 'Endings help identify case and number.' },
        { question: 'Greek genders include:', options: ['Masculine, feminine, neuter', 'Only masculine', 'Only feminine', 'Only neuter'], correct: 0, explanation: 'Greek has three genders.' },
        { question: 'The article is:', options: ['Only indefinite', 'Definite', 'Only plural', 'Only in poetry'], correct: 1, explanation: 'Greek uses a definite article.' }
      ]
    },
    {
      id: '03',
      title: 'Present Tense Verbs',
      icon: 'G1',
      duration: '25 min',
      content: [
        {
          heading: 'Verb Basics',
          text: 'Greek verbs mark person, number, tense-aspect, voice, and mood. The present tense is a good entry point.'
        },
        {
          heading: 'Present Aspect',
          text: 'The present tense often conveys ongoing or repeated action.'
        }
      ],
      keyTerms: [
        { term: 'Tense-Aspect', definition: 'How action is viewed' },
        { term: 'Voice', definition: 'Relation of subject to action' },
        { term: 'Mood', definition: 'Type of statement (indicative, etc.)' }
      ],
      quiz: [
        { question: 'Greek verbs mark:', options: ['Person, number, tense-aspect, voice, mood', 'Only tense', 'Only person', 'Only number'], correct: 0, explanation: 'Greek verbs mark multiple features.' },
        { question: 'Present tense often conveys:', options: ['Ongoing action', 'Completed action', 'No action', 'Only future'], correct: 0, explanation: 'Present often conveys ongoing action.' },
        { question: 'Voice indicates:', options: ['Subject relation to action', 'Only time', 'Only number', 'Only spelling'], correct: 0, explanation: 'Voice indicates subject relation to action.' },
        { question: 'Mood indicates:', options: ['Type of statement', 'Only vocabulary', 'Only pronunciation', 'Only gender'], correct: 0, explanation: 'Mood indicates statement type.' },
        { question: 'Verb endings show:', options: ['Person and number', 'Only case', 'Only gender', 'Only article'], correct: 0, explanation: 'Endings show person and number.' }
      ]
    },
    {
      id: '04',
      title: 'Basic Syntax',
      icon: 'G1',
      duration: '20 min',
      content: [
        {
          heading: 'Word Order',
          text: 'Greek word order is flexible due to case endings. Identify subject and object by form, not position.'
        },
        {
          heading: 'Particles and Conjunctions',
          text: 'Particles and conjunctions connect clauses and show relationships.'
        }
      ],
      keyTerms: [
        { term: 'Word Order', definition: 'Arrangement of words in a clause' },
        { term: 'Particle', definition: 'Small word with grammatical function' },
        { term: 'Clause', definition: 'Unit with a verb and complements' }
      ],
      quiz: [
        { question: 'Greek word order is:', options: ['Flexible', 'Rigid', 'Alphabetical', 'Random'], correct: 0, explanation: 'Greek word order is flexible.' },
        { question: 'Case endings help identify:', options: ['Subject and object', 'Only pronunciation', 'Only vocabulary', 'Only genre'], correct: 0, explanation: 'Endings help identify roles.' },
        { question: 'Particles help with:', options: ['Clause relationships', 'Only spelling', 'Only pronunciation', 'Only vocabulary'], correct: 0, explanation: 'Particles show relationships.' },
        { question: 'A clause contains:', options: ['A verb and complements', 'Only nouns', 'Only adjectives', 'Only adverbs'], correct: 0, explanation: 'A clause includes a verb and complements.' },
        { question: 'Word order can indicate:', options: ['Emphasis', 'Only tense', 'Only number', 'Only case'], correct: 0, explanation: 'Word order can indicate emphasis.' }
      ]
    },
    {
      id: '05',
      title: 'Vocabulary and Reading',
      icon: 'G1',
      duration: '25 min',
      content: [
        {
          heading: 'High-Frequency Words',
          text: 'Learning high-frequency words accelerates reading and comprehension in the New Testament.'
        },
        {
          heading: 'Reading Strategy',
          text: 'Identify known forms first, then use context to interpret unfamiliar words.'
        }
      ],
      keyTerms: [
        { term: 'Lexicon', definition: 'Dictionary of word meanings' },
        { term: 'Frequency', definition: 'How often a word appears' },
        { term: 'Context', definition: 'Surrounding text shaping meaning' }
      ],
      quiz: [
        { question: 'High-frequency words help with:', options: ['Reading fluency', 'Only pronunciation', 'Only syntax', 'Only spelling'], correct: 0, explanation: 'They improve reading fluency.' },
        { question: 'A lexicon provides:', options: ['Word meanings', 'Only punctuation', 'Only genre', 'Only history'], correct: 0, explanation: 'A lexicon provides word meanings.' },
        { question: 'Reading strategy should begin with:', options: ['Known forms', 'Guessing only', 'Ignoring context', 'Skipping verbs'], correct: 0, explanation: 'Begin with known forms.' },
        { question: 'Context helps with:', options: ['Meaning selection', 'Only spelling', 'Only pronunciation', 'Only grammar'], correct: 0, explanation: 'Context helps select meaning.' },
        { question: 'Frequency refers to:', options: ['Word length', 'How often a word appears', 'Sentence order', 'Pronunciation'], correct: 1, explanation: 'Frequency is how often a word appears.' }
      ]
    },
    {
      id: '06',
      title: 'Intro Translation',
      icon: 'G1',
      duration: '25 min',
      content: [
        {
          heading: 'Translation Steps',
          text: 'Parse verbs and nouns, determine basic syntax, and then translate into clear English.'
        },
        {
          heading: 'Textual Awareness',
          text: 'Notes about textual variants may appear in study editions. Awareness helps careful reading.'
        }
      ],
      keyTerms: [
        { term: 'Parsing', definition: 'Identifying grammatical form' },
        { term: 'Variant', definition: 'Difference among manuscripts' },
        { term: 'Translation', definition: 'Rendering text into another language' }
      ],
      quiz: [
        { question: 'Translation should start with:', options: ['Parsing forms', 'Guessing meaning', 'Ignoring syntax', 'Only vocabulary'], correct: 0, explanation: 'Parsing forms is the first step.' },
        { question: 'A variant is:', options: ['A manuscript difference', 'A translation error', 'A punctuation mark', 'A loanword'], correct: 0, explanation: 'Variants are manuscript differences.' },
        { question: 'Syntax helps with:', options: ['Sentence structure', 'Only spelling', 'Only history', 'Only pronunciation'], correct: 0, explanation: 'Syntax clarifies structure.' },
        { question: 'Translation aims for:', options: ['Clear meaning', 'Only literal word order', 'Only paraphrase', 'Only commentary'], correct: 0, explanation: 'Translation aims for clear meaning.' },
        { question: 'Parsing identifies:', options: ['Grammatical form', 'Only punctuation', 'Only genre', 'Only history'], correct: 0, explanation: 'Parsing identifies grammatical form.' }
      ]
    }
  ],
  finalExam: [
    { question: 'Greek has how many letters?', options: ['22', '24', '26', '28'], correct: 1, explanation: 'Greek has 24 letters.' },
    { question: 'Greek cases indicate:', options: ['Grammatical role', 'Only pronunciation', 'Only vocabulary', 'Only genre'], correct: 0, explanation: 'Cases indicate grammatical role.' },
    { question: 'The article agrees in:', options: ['Case, gender, number', 'Only case', 'Only gender', 'Only number'], correct: 0, explanation: 'It agrees in case, gender, number.' },
    { question: 'Present tense often conveys:', options: ['Ongoing action', 'Completed action', 'No action', 'Only future'], correct: 0, explanation: 'Present often conveys ongoing action.' },
    { question: 'Greek word order is:', options: ['Flexible', 'Rigid', 'Alphabetical', 'Random'], correct: 0, explanation: 'Greek word order is flexible.' },
    { question: 'Particles help with:', options: ['Clause relationships', 'Only spelling', 'Only pronunciation', 'Only vocabulary'], correct: 0, explanation: 'Particles show relationships.' },
    { question: 'High-frequency vocabulary improves:', options: ['Reading fluency', 'Only pronunciation', 'Only syntax', 'Only spelling'], correct: 0, explanation: 'It improves fluency.' },
    { question: 'A variant is:', options: ['A manuscript difference', 'A translation error', 'A punctuation mark', 'A loanword'], correct: 0, explanation: 'Variants are manuscript differences.' },
    { question: 'Parsing identifies:', options: ['Grammatical forms', 'Only punctuation', 'Only genre', 'Only history'], correct: 0, explanation: 'Parsing identifies forms.' },
    { question: 'Context helps select:', options: ['Meaning', 'Only spelling', 'Only pronunciation', 'Only grammar'], correct: 0, explanation: 'Context helps select meaning.' }
  ],
  about: {
    level: 'Language Course',
    description: 'An introductory Biblical Greek course covering alphabet, basic grammar, and translation skills in a text-driven, non-denominational approach.',
    credits: '3 credits',
    prerequisites: 'None'
  }
};

export default greekICourse;
