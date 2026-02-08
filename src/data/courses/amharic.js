const amharicCourse = {
  id: 'amharic',
  title: 'Amharic',
  subtitle: 'Language Course | 6 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Fidel and Script',
      icon: 'A',
      duration: '30 min',
      content: [
        {
          heading: 'Abugida Structure',
          text: 'Amharic is written with the GeEez-derived fidel, an abugida where each base consonant has vowel-modified forms.'
        },
        {
          heading: 'Letter Series',
          text: 'Each consonant has a series of forms that represent different vowels. Learning the series is central to reading.'
        },
        {
          heading: 'Reading Practice',
          text: 'Start by recognizing base characters, then practice full series to build fluency.'
        }
      ],
      keyTerms: [
        { term: 'Fidel', definition: 'The GeEez-derived script used for Amharic' },
        { term: 'Abugida', definition: 'Script with consonant bases modified by vowels' },
        { term: 'Series', definition: 'Vowel-modified forms of a consonant' }
      ],
      quiz: [
        { question: 'Amharic uses:', options: ['An alphabet', 'An abugida (fidel)', 'A syllabary only', 'A pictographic system'], correct: 1, explanation: 'Amharic uses the fidel abugida.' },
        { question: 'In an abugida, vowels are:', options: ['Separate letters only', 'Shown by modifying consonants', 'Not written', 'Only optional'], correct: 1, explanation: 'Vowels modify consonant bases.' },
        { question: 'A letter series represents:', options: ['Different consonants only', 'Vowel variants of a consonant', 'Only numbers', 'Only punctuation'], correct: 1, explanation: 'Series are vowel variants.' },
        { question: 'Reading practice should start with:', options: ['Long texts', 'Base characters and series', 'Only grammar tables', 'Only vocabulary lists'], correct: 1, explanation: 'Start with base characters and series.' },
        { question: 'Fidel is derived from:', options: ['Greek', 'GeEez', 'Latin', 'Arabic'], correct: 1, explanation: 'Fidel is derived from GeEez.' }
      ]
    },
    {
      id: '02',
      title: 'Pronunciation and Syllables',
      icon: 'A',
      duration: '25 min',
      content: [
        {
          heading: 'Sound System',
          text: 'Amharic includes consonants and vowels not found in English. Accurate pronunciation requires practice with the fidel series.'
        },
        {
          heading: 'Syllable-Based Reading',
          text: 'Each fidel character represents a syllable. Reading fluency builds by recognizing syllable units.'
        }
      ],
      keyTerms: [
        { term: 'Syllable', definition: 'Unit of pronunciation represented by a fidel character' },
        { term: 'Phonology', definition: 'Sound system of a language' },
        { term: 'Series', definition: 'Vowel variations within a consonant set' }
      ],
      quiz: [
        { question: 'Each fidel character represents:', options: ['A syllable', 'A word', 'A phrase', 'A sentence'], correct: 0, explanation: 'Fidel characters are syllabic.' },
        { question: 'Pronunciation improves by:', options: ['Ignoring series', 'Practicing series and syllables', 'Only memorizing words', 'Only writing'], correct: 1, explanation: 'Practice series and syllables.' },
        { question: 'Phonology refers to:', options: ['Word meaning', 'Sound system', 'Sentence order', 'Writing style'], correct: 1, explanation: 'Phonology is the sound system.' },
        { question: 'Reading fluency builds by:', options: ['Recognizing syllable units', 'Skipping syllables', 'Ignoring vowels', 'Only memorizing grammar'], correct: 0, explanation: 'Recognizing syllable units builds fluency.' },
        { question: 'Amharic includes sounds that are:', options: ['Identical to English only', 'Not all found in English', 'Only vowels', 'Only consonants'], correct: 1, explanation: 'Amharic has sounds not all in English.' }
      ]
    },
    {
      id: '03',
      title: 'Nouns and Gender',
      icon: 'A',
      duration: '25 min',
      content: [
        {
          heading: 'Gender and Number',
          text: 'Amharic nouns have gender and number. Plurals are often formed with suffixes or patterns.'
        },
        {
          heading: 'Definiteness',
          text: 'Definite articles and markers indicate known or specific nouns in context.'
        }
      ],
      keyTerms: [
        { term: 'Gender', definition: 'Masculine/feminine noun classes' },
        { term: 'Plural', definition: 'Noun form indicating more than one' },
        { term: 'Definite', definition: 'Marked for specificity' }
      ],
      quiz: [
        { question: 'Amharic nouns mark:', options: ['Only tense', 'Gender and number', 'Only aspect', 'Only case'], correct: 1, explanation: 'Nouns mark gender and number.' },
        { question: 'Plurals are often formed with:', options: ['Suffixes or patterns', 'Only prefixes', 'Only vowel change', 'No change'], correct: 0, explanation: 'Plurals use suffixes or patterns.' },
        { question: 'Definiteness indicates:', options: ['A specific noun', 'Only a verb', 'Only a preposition', 'Only a particle'], correct: 0, explanation: 'Definiteness marks specificity.' },
        { question: 'Gender in Amharic includes:', options: ['Masculine and feminine', 'Only neuter', 'Only masculine', 'Only feminine'], correct: 0, explanation: 'Amharic uses masculine and feminine.' },
        { question: 'Noun markers are influenced by:', options: ['Context', 'Random choice', 'Only punctuation', 'Only length'], correct: 0, explanation: 'Context influences noun marking.' }
      ]
    },
    {
      id: '04',
      title: 'Verbs and Conjugation',
      icon: 'A',
      duration: '30 min',
      content: [
        {
          heading: 'Root System',
          text: 'Amharic verbs are built from roots, often triconsonantal, combined with patterns and affixes.'
        },
        {
          heading: 'Aspect and Tense',
          text: 'Common verb forms include perfective and imperfective patterns. Understanding these helps with time and aspect.'
        }
      ],
      keyTerms: [
        { term: 'Root', definition: 'Core consonants of a verb' },
        { term: 'Perfective', definition: 'Aspect viewing action as complete' },
        { term: 'Imperfective', definition: 'Aspect viewing action as ongoing' }
      ],
      quiz: [
        { question: 'Amharic verbs are built from:', options: ['Roots and patterns', 'Only vowels', 'Only suffixes', 'Only prefixes'], correct: 0, explanation: 'They are built from roots and patterns.' },
        { question: 'Perfective aspect views action as:', options: ['Complete', 'Ongoing', 'Hypothetical', 'Unknown'], correct: 0, explanation: 'Perfective views action as complete.' },
        { question: 'Imperfective aspect views action as:', options: ['Complete', 'Ongoing', 'Only future', 'Only past'], correct: 1, explanation: 'Imperfective views action as ongoing.' },
        { question: 'Verb forms help indicate:', options: ['Time and aspect', 'Only number', 'Only gender', 'Only punctuation'], correct: 0, explanation: 'Verb forms indicate time/aspect.' },
        { question: 'Roots are typically:', options: ['Three consonants', 'Only vowels', 'Numbers', 'Articles'], correct: 0, explanation: 'Roots are often three consonants.' }
      ]
    },
    {
      id: '05',
      title: 'Sentence Structure',
      icon: 'A',
      duration: '20 min',
      content: [
        {
          heading: 'Word Order',
          text: 'Amharic commonly uses subject-object-verb order, though variation occurs for emphasis.'
        },
        {
          heading: 'Particles and Prepositions',
          text: 'Particles and prepositions help mark relationships between words and clauses.'
        }
      ],
      keyTerms: [
        { term: 'SOV', definition: 'Subject-Object-Verb word order' },
        { term: 'Particle', definition: 'Small word with grammatical function' },
        { term: 'Clause', definition: 'Unit with a verb and complements' }
      ],
      quiz: [
        { question: 'Amharic commonly uses:', options: ['SOV word order', 'SVO word order only', 'VSO word order only', 'No word order'], correct: 0, explanation: 'Amharic commonly uses SOV.' },
        { question: 'Particles help with:', options: ['Word relationships', 'Only pronunciation', 'Only spelling', 'Only vocabulary'], correct: 0, explanation: 'Particles help mark relationships.' },
        { question: 'Word order can vary for:', options: ['Emphasis', 'Randomness', 'Only vowels', 'Only punctuation'], correct: 0, explanation: 'Word order can vary for emphasis.' },
        { question: 'A clause includes:', options: ['A verb and its complements', 'Only nouns', 'Only adjectives', 'Only adverbs'], correct: 0, explanation: 'A clause includes a verb and complements.' },
        { question: 'Prepositions mark:', options: ['Relationships between words', 'Only tense', 'Only gender', 'Only number'], correct: 0, explanation: 'Prepositions mark relationships.' }
      ]
    },
    {
      id: '06',
      title: 'Reading and Translation',
      icon: 'A',
      duration: '25 min',
      content: [
        {
          heading: 'Reading Practice',
          text: 'Begin with short sentences and common vocabulary. Identify verb forms and noun markers before translating.'
        },
        {
          heading: 'Translation Strategy',
          text: 'Use context and grammar to select the best translation. Multiple renderings may be possible.'
        }
      ],
      keyTerms: [
        { term: 'Vocabulary', definition: 'Common word stock for reading' },
        { term: 'Parsing', definition: 'Identifying grammatical forms' },
        { term: 'Context', definition: 'Surrounding text shaping meaning' }
      ],
      quiz: [
        { question: 'Reading practice should start with:', options: ['Short sentences', 'Long paragraphs', 'Only poetry', 'Only grammar tables'], correct: 0, explanation: 'Start with short sentences.' },
        { question: 'Parsing helps with:', options: ['Identifying forms', 'Only pronunciation', 'Only spelling', 'Only history'], correct: 0, explanation: 'Parsing identifies forms.' },
        { question: 'Translation should consider:', options: ['Context and grammar', 'Only word order', 'Only vocabulary', 'Only punctuation'], correct: 0, explanation: 'Context and grammar are key.' },
        { question: 'Multiple translations can exist because:', options: ['Language has nuance', 'Text has no meaning', 'Grammar is useless', 'Context is irrelevant'], correct: 0, explanation: 'Language has nuance.' },
        { question: 'Vocabulary growth improves:', options: ['Reading fluency', 'Only writing', 'Only pronunciation', 'Only spelling'], correct: 0, explanation: 'Vocabulary improves reading fluency.' }
      ]
    }
  ],
  finalExam: [
    { question: 'Amharic uses:', options: ['An abugida (fidel)', 'An alphabet only', 'A pictographic system', 'Cuneiform'], correct: 0, explanation: 'Amharic uses the fidel abugida.' },
    { question: 'Each fidel character represents:', options: ['A syllable', 'A word', 'A phrase', 'A sentence'], correct: 0, explanation: 'Each character is a syllable.' },
    { question: 'Plurals are often formed with:', options: ['Suffixes or patterns', 'Only prefixes', 'Only vowel change', 'No change'], correct: 0, explanation: 'Plurals use suffixes or patterns.' },
    { question: 'Amharic word order is commonly:', options: ['SOV', 'SVO only', 'VSO only', 'No order'], correct: 0, explanation: 'Amharic commonly uses SOV.' },
    { question: 'Verbs are built from:', options: ['Roots and patterns', 'Only vowels', 'Only suffixes', 'Only prefixes'], correct: 0, explanation: 'They are built from roots and patterns.' },
    { question: 'Perfective aspect views action as:', options: ['Complete', 'Ongoing', 'Hypothetical', 'Unknown'], correct: 0, explanation: 'Perfective views action as complete.' },
    { question: 'Imperfective aspect views action as:', options: ['Ongoing', 'Complete', 'Only future', 'Only past'], correct: 0, explanation: 'Imperfective views action as ongoing.' },
    { question: 'Particles help mark:', options: ['Relationships', 'Only pronunciation', 'Only spelling', 'Only vocabulary'], correct: 0, explanation: 'Particles mark relationships.' },
    { question: 'Parsing identifies:', options: ['Grammatical forms', 'Only punctuation', 'Only genre', 'Only history'], correct: 0, explanation: 'Parsing identifies forms.' },
    { question: 'Context is important because it:', options: ['Shapes meaning', 'Eliminates meaning', 'Replaces grammar', 'Removes vocabulary'], correct: 0, explanation: 'Context shapes meaning.' }
  ],
  about: {
    level: 'Language Course',
    description: 'A foundational Amharic course covering fidel, pronunciation, grammar, and reading skills in a text-driven, non-denominational approach.',
    credits: '2 credits',
    prerequisites: 'None'
  }
};

export default amharicCourse;
