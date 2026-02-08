const koineGreekCourse = {
  id: 'koineGreek',
  title: 'Koine Greek',
  subtitle: 'Language Course | 8 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Alphabet and Script',
      icon: 'G',
      duration: '30 min',
      content: [
        {
          heading: 'Alphabet Overview',
          text: 'Koine Greek uses a 24-letter alphabet. Learning letter shapes and names is the first step to reading and pronunciation.'
        },
        {
          heading: 'Uppercase and Lowercase',
          text: 'Greek manuscripts and printed texts use both uppercase and lowercase forms. Many letters resemble Latin forms, while others are unique.'
        },
        {
          heading: 'Reading Practice',
          text: 'Early practice focuses on recognizing letter shapes, distinguishing similar letters, and reading short syllables.'
        }
      ],
      keyTerms: [
        { term: 'Alphabet', definition: 'Set of letters used to write Greek' },
        { term: 'Uppercase', definition: 'Capital letter form' },
        { term: 'Lowercase', definition: 'Small letter form' }
      ],
      quiz: [
        { question: 'Koine Greek uses how many letters?', options: ['22', '24', '26', '28'], correct: 1, explanation: 'The Greek alphabet has 24 letters.' },
        { question: 'Greek letters appear in:', options: ['Uppercase and lowercase forms', 'Only uppercase', 'Only lowercase', 'Only cursive'], correct: 0, explanation: 'Greek uses both uppercase and lowercase forms.' },
        { question: 'The first step in Greek reading is:', options: ['Memorizing grammar tables', 'Learning letter shapes', 'Reading long passages', 'Translating sentences'], correct: 1, explanation: 'Learning letter shapes is foundational.' },
        { question: 'Alphabet recognition helps with:', options: ['Word order only', 'Reading and pronunciation', 'Only syntax', 'Only translation'], correct: 1, explanation: 'Recognizing letters helps reading and pronunciation.' },
        { question: 'Greek script is written with:', options: ['A syllabary', 'An alphabet', 'A pictographic system', 'Only symbols'], correct: 1, explanation: 'Greek uses an alphabet.' }
      ]
    },
    {
      id: '02',
      title: 'Pronunciation and Syllables',
      icon: 'G',
      duration: '25 min',
      content: [
        {
          heading: 'Vowels and Consonants',
          text: 'Greek has seven vowel letters and a set of consonants. Pronunciation in Koine is reconstructed for study and classroom use.'
        },
        {
          heading: 'Diphthongs',
          text: 'Common vowel combinations form diphthongs. Recognizing them helps with syllable division and pronunciation.'
        },
        {
          heading: 'Syllable Division',
          text: 'Greek syllables are divided by vowel sounds. Consonant clusters typically follow standard rules for splitting between syllables.'
        }
      ],
      keyTerms: [
        { term: 'Vowel', definition: 'A letter representing a vowel sound' },
        { term: 'Diphthong', definition: 'Two vowels forming one sound' },
        { term: 'Syllable', definition: 'A unit of pronunciation containing a vowel' }
      ],
      quiz: [
        { question: 'Greek has how many vowel letters?', options: ['5', '6', '7', '8'], correct: 2, explanation: 'Greek has seven vowel letters.' },
        { question: 'A diphthong is:', options: ['A consonant cluster', 'Two vowels forming one sound', 'A punctuation mark', 'A stress mark'], correct: 1, explanation: 'A diphthong is two vowels forming one sound.' },
        { question: 'Syllables are divided around:', options: ['Consonants', 'Vowels', 'Punctuation', 'Stress only'], correct: 1, explanation: 'Syllables are built around vowels.' },
        { question: 'Pronunciation systems are:', options: ['Identical across all traditions', 'Reconstructed for study', 'Irrelevant', 'Only modern Greek'], correct: 1, explanation: 'Koine pronunciation is reconstructed for study.' },
        { question: 'Recognizing diphthongs helps with:', options: ['Only syntax', 'Syllable division', 'Only translation', 'Only vocabulary'], correct: 1, explanation: 'Diphthongs help with syllable division.' }
      ]
    },
    {
      id: '03',
      title: 'Nouns and Cases',
      icon: 'G',
      duration: '30 min',
      content: [
        {
          heading: 'Case System',
          text: 'Greek uses cases to mark grammatical function. The major cases are nominative, genitive, dative, and accusative.'
        },
        {
          heading: 'Gender and Number',
          text: 'Nouns are marked for gender (masculine, feminine, neuter) and number (singular, plural).'
        },
        {
          heading: 'Declensions',
          text: 'Most nouns follow declension patterns. Learning common endings is essential for identifying case and function.'
        }
      ],
      keyTerms: [
        { term: 'Case', definition: 'Grammatical form indicating a noun’s role' },
        { term: 'Declension', definition: 'Pattern of noun endings' },
        { term: 'Gender', definition: 'Masculine, feminine, or neuter' }
      ],
      quiz: [
        { question: 'Greek cases include:', options: ['Nominative, genitive, dative, accusative', 'Only nominative and accusative', 'Only genitive', 'No cases'], correct: 0, explanation: 'Greek commonly uses four cases.' },
        { question: 'Gender in Greek nouns includes:', options: ['Only masculine and feminine', 'Masculine, feminine, neuter', 'Only neuter', 'Only plural'], correct: 1, explanation: 'Greek has three genders.' },
        { question: 'Declensions are:', options: ['Verb patterns', 'Noun ending patterns', 'Sentence types', 'Pronunciation systems'], correct: 1, explanation: 'Declensions are noun ending patterns.' },
        { question: 'Cases primarily indicate:', options: ['Pronunciation', 'Grammatical function', 'Text genre', 'Manuscript type'], correct: 1, explanation: 'Cases indicate grammatical function.' },
        { question: 'Number in Greek nouns refers to:', options: ['Syllable count', 'Singular and plural forms', 'Verb tenses', 'Stress patterns'], correct: 1, explanation: 'Number indicates singular or plural.' }
      ]
    },
    {
      id: '04',
      title: 'Verbs and Tense-Aspect',
      icon: 'G',
      duration: '30 min',
      content: [
        {
          heading: 'Verb System',
          text: 'Greek verbs mark person, number, tense-aspect, voice, and mood. This provides dense grammatical information.'
        },
        {
          heading: 'Tense and Aspect',
          text: 'Koine Greek tense forms often communicate aspect (how an action is viewed) rather than simple time.'
        },
        {
          heading: 'Voice and Mood',
          text: 'Active, middle, and passive voice indicate how the subject relates to the action. Moods include indicative, imperative, subjunctive, and optative.'
        }
      ],
      keyTerms: [
        { term: 'Aspect', definition: 'How an action is viewed (complete, ongoing, etc.)' },
        { term: 'Voice', definition: 'Relation of subject to the action' },
        { term: 'Mood', definition: 'Form expressing kind of statement' }
      ],
      quiz: [
        { question: 'Greek verbs mark:', options: ['Only tense', 'Person, number, tense-aspect, voice, mood', 'Only person', 'Only mood'], correct: 1, explanation: 'Greek verbs mark multiple grammatical features.' },
        { question: 'Aspect describes:', options: ['Spelling', 'How an action is viewed', 'Only time', 'Only person'], correct: 1, explanation: 'Aspect is how the action is viewed.' },
        { question: 'Voice indicates:', options: ['Sentence length', 'Subject’s relation to action', 'Only tense', 'Only number'], correct: 1, explanation: 'Voice indicates subject relation to action.' },
        { question: 'Indicative mood is used for:', options: ['Commands only', 'Statements of fact', 'Questions only', 'Wishes only'], correct: 1, explanation: 'Indicative is used for statements.' },
        { question: 'Imperative mood expresses:', options: ['Commands', 'Narrative only', 'Questions', 'Conditions'], correct: 0, explanation: 'Imperative expresses commands.' }
      ]
    },
    {
      id: '05',
      title: 'Participles and Infinitives',
      icon: 'G',
      duration: '25 min',
      content: [
        {
          heading: 'Participles',
          text: 'Participles are verbal adjectives. They can describe a noun and also express time, cause, or condition.'
        },
        {
          heading: 'Infinitives',
          text: 'Infinitives are verbal nouns, often translated with “to” plus a verb. They can function in many syntactic roles.'
        },
        {
          heading: 'Translation Strategy',
          text: 'Identifying participles and infinitives is essential for accurate translation and sentence flow.'
        }
      ],
      keyTerms: [
        { term: 'Participle', definition: 'Verbal adjective' },
        { term: 'Infinitive', definition: 'Verbal noun' },
        { term: 'Syntax', definition: 'Arrangement of words and phrases' }
      ],
      quiz: [
        { question: 'Participles function as:', options: ['Verbal adjectives', 'Only nouns', 'Only pronouns', 'Only particles'], correct: 0, explanation: 'Participles are verbal adjectives.' },
        { question: 'Infinitives function as:', options: ['Verbal nouns', 'Only adjectives', 'Only prepositions', 'Only pronouns'], correct: 0, explanation: 'Infinitives are verbal nouns.' },
        { question: 'Participles can express:', options: ['Time or cause', 'Only gender', 'Only number', 'Only punctuation'], correct: 0, explanation: 'Participles can express time or cause.' },
        { question: 'Recognizing participles helps with:', options: ['Pronunciation only', 'Translation accuracy', 'Only spelling', 'Only vocabulary'], correct: 1, explanation: 'It helps translation accuracy.' },
        { question: 'Infinitives often translate with:', options: ['A preposition', 'To + verb', 'A noun only', 'A suffix only'], correct: 1, explanation: 'Infinitives often translate with “to + verb.”' }
      ]
    },
    {
      id: '06',
      title: 'Syntax and Word Order',
      icon: 'G',
      duration: '25 min',
      content: [
        {
          heading: 'Flexible Word Order',
          text: 'Greek word order is more flexible than English because grammatical relationships are shown by endings rather than position.'
        },
        {
          heading: 'Clause Structure',
          text: 'Identifying subjects, verbs, and objects is essential for parsing. Particles and conjunctions signal relationships.'
        },
        {
          heading: 'Emphasis',
          text: 'Word order can highlight emphasis. Elements placed first may be foregrounded.'
        }
      ],
      keyTerms: [
        { term: 'Word Order', definition: 'Arrangement of words in a clause' },
        { term: 'Clause', definition: 'A unit with a verb and its complements' },
        { term: 'Emphasis', definition: 'Highlighting a word or phrase' }
      ],
      quiz: [
        { question: 'Greek word order is:', options: ['Rigid like English', 'Relatively flexible', 'Never meaningful', 'Always alphabetical'], correct: 1, explanation: 'Greek word order is flexible.' },
        { question: 'Endings indicate:', options: ['Genre', 'Grammatical relationships', 'Only vocabulary', 'Only pronunciation'], correct: 1, explanation: 'Endings show grammatical relationships.' },
        { question: 'A clause contains:', options: ['Only nouns', 'A verb and its complements', 'Only adjectives', 'Only adverbs'], correct: 1, explanation: 'A clause contains a verb and its complements.' },
        { question: 'Particles and conjunctions signal:', options: ['No meaning', 'Relationships between clauses', 'Only punctuation', 'Only spelling'], correct: 1, explanation: 'They signal relationships.' },
        { question: 'Word order can indicate:', options: ['Emphasis', 'Only tense', 'Only number', 'Only case'], correct: 0, explanation: 'Word order can show emphasis.' }
      ]
    },
    {
      id: '07',
      title: 'Vocabulary and Reading',
      icon: 'G',
      duration: '30 min',
      content: [
        {
          heading: 'High-Frequency Vocabulary',
          text: 'Learning high-frequency words accelerates reading. Many common words appear throughout the New Testament.'
        },
        {
          heading: 'Reading Strategy',
          text: 'Begin with short phrases, then expand to sentences. Identify known forms before attempting full translation.'
        },
        {
          heading: 'Lexical Tools',
          text: 'Lexicons and glossaries assist with meaning, but context determines usage.'
        }
      ],
      keyTerms: [
        { term: 'Lexicon', definition: 'A dictionary of word meanings' },
        { term: 'Gloss', definition: 'A short meaning or translation' },
        { term: 'Frequency', definition: 'How often a word appears' }
      ],
      quiz: [
        { question: 'High-frequency vocabulary helps:', options: ['Pronunciation only', 'Reading fluency', 'Only grammar', 'Only syntax'], correct: 1, explanation: 'It improves reading fluency.' },
        { question: 'Lexicons should be used with:', options: ['No context', 'Context awareness', 'Only rote memorization', 'Only grammar'], correct: 1, explanation: 'Context determines usage.' },
        { question: 'A reading strategy is to:', options: ['Translate without parsing', 'Identify known forms first', 'Ignore endings', 'Skip unknown words'], correct: 1, explanation: 'Identify known forms first.' },
        { question: 'A gloss is:', options: ['A paragraph', 'A short meaning', 'A verb form', 'A suffix'], correct: 1, explanation: 'A gloss is a short meaning.' },
        { question: 'Frequency refers to:', options: ['Word length', 'How often a word appears', 'Sentence structure', 'Pronunciation'], correct: 1, explanation: 'Frequency is how often a word appears.' }
      ]
    },
    {
      id: '08',
      title: 'Translation and Textual Awareness',
      icon: 'G',
      duration: '25 min',
      content: [
        {
          heading: 'Translation Choices',
          text: 'Translation involves balancing grammar, context, and meaning. Multiple valid renderings may exist.'
        },
        {
          heading: 'Textual Variants',
          text: 'Manuscript differences exist. Awareness of variants helps readers understand translation notes.'
        },
        {
          heading: 'Responsible Reading',
          text: 'Language study supports responsible reading by grounding interpretation in the text itself.'
        }
      ],
      keyTerms: [
        { term: 'Variant', definition: 'A difference among manuscripts' },
        { term: 'Translation', definition: 'Rendering text into another language' },
        { term: 'Context', definition: 'Surrounding text that shapes meaning' }
      ],
      quiz: [
        { question: 'Translation is shaped by:', options: ['Grammar, context, and meaning', 'Only word order', 'Only pronunciation', 'Only punctuation'], correct: 0, explanation: 'Translation balances grammar, context, and meaning.' },
        { question: 'A textual variant is:', options: ['A translation error', 'A manuscript difference', 'A punctuation mark', 'A loanword'], correct: 1, explanation: 'Variants are manuscript differences.' },
        { question: 'Language study supports:', options: ['Speculation', 'Text-driven interpretation', 'Only tradition', 'Only devotion'], correct: 1, explanation: 'It supports text-driven interpretation.' },
        { question: 'Context is important because it:', options: ['Limits meaning', 'Determines intended meaning', 'Eliminates grammar', 'Replaces vocabulary'], correct: 1, explanation: 'Context determines intended meaning.' },
        { question: 'Multiple valid translations can exist because:', options: ['Greek is random', 'Language has nuance', 'Grammar is useless', 'Text has no meaning'], correct: 1, explanation: 'Language has nuance.' }
      ]
    }
  ],
  finalExam: [
    { question: 'Koine Greek uses how many letters?', options: ['22', '24', '26', '28'], correct: 1, explanation: 'It has 24 letters.' },
    { question: 'A diphthong is:', options: ['A consonant cluster', 'Two vowels forming one sound', 'A punctuation mark', 'A stress mark'], correct: 1, explanation: 'A diphthong is two vowels forming one sound.' },
    { question: 'Greek cases include:', options: ['Nominative, genitive, dative, accusative', 'Only nominative', 'Only genitive', 'No cases'], correct: 0, explanation: 'Greek commonly uses four cases.' },
    { question: 'Aspect describes:', options: ['Spelling', 'How an action is viewed', 'Only time', 'Only person'], correct: 1, explanation: 'Aspect is how the action is viewed.' },
    { question: 'Voice indicates:', options: ['Sentence length', 'Subject’s relation to action', 'Only tense', 'Only number'], correct: 1, explanation: 'Voice indicates subject relation to action.' },
    { question: 'Participles are:', options: ['Verbal adjectives', 'Only nouns', 'Only pronouns', 'Only particles'], correct: 0, explanation: 'Participles are verbal adjectives.' },
    { question: 'Infinitives are:', options: ['Verbal nouns', 'Only adjectives', 'Only prepositions', 'Only pronouns'], correct: 0, explanation: 'Infinitives are verbal nouns.' },
    { question: 'Greek word order is:', options: ['Rigid', 'Relatively flexible', 'Never meaningful', 'Always alphabetical'], correct: 1, explanation: 'Greek word order is flexible.' },
    { question: 'Lexicons should be used with:', options: ['No context', 'Context awareness', 'Only memorization', 'Only grammar'], correct: 1, explanation: 'Context determines usage.' },
    { question: 'A textual variant is:', options: ['A manuscript difference', 'A translation error', 'A punctuation mark', 'A loanword'], correct: 0, explanation: 'Variants are manuscript differences.' }
  ],
  about: {
    level: 'Language Course',
    description: 'A foundational course in Koine Greek covering script, grammar, syntax, and reading for New Testament texts in a text-driven, non-denominational approach.',
    credits: '3 credits',
    prerequisites: 'None'
  }
};

export default koineGreekCourse;
