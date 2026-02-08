const aramaicCourse = {
  id: 'aramaic',
  title: 'Biblical Aramaic',
  subtitle: 'Language Course | 6 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Alphabet and Script',
      icon: 'A',
      duration: '25 min',
      content: [
        {
          heading: 'Script Family',
          text: 'Biblical Aramaic uses a script closely related to square Hebrew. Learning letter shapes and names is foundational.'
        },
        {
          heading: 'Right-to-Left Reading',
          text: 'Aramaic is written right to left. Practice focuses on accurate letter recognition and direction.'
        },
        {
          heading: 'Final Forms',
          text: 'Like Hebrew, several letters have final forms used at word endings.'
        }
      ],
      keyTerms: [
        { term: 'Square Script', definition: 'The common Hebrew-Aramaic letter forms' },
        { term: 'Final Forms', definition: 'Letter forms used at word endings' },
        { term: 'Right-to-Left', definition: 'Direction of writing' }
      ],
      quiz: [
        { question: 'Biblical Aramaic is written:', options: ['Left to right', 'Right to left', 'Top to bottom', 'Mixed direction'], correct: 1, explanation: 'Aramaic is written right to left.' },
        { question: 'Aramaic script is closely related to:', options: ['Greek', 'Square Hebrew', 'Latin', 'Cuneiform'], correct: 1, explanation: 'It is closely related to square Hebrew.' },
        { question: 'Final forms are used:', options: ['At the start of words', 'At the end of words', 'Only in verbs', 'Only in poetry'], correct: 1, explanation: 'Final forms are used at word endings.' },
        { question: 'Learning letter shapes helps with:', options: ['Only translation', 'Reading recognition', 'Only syntax', 'Only vocabulary'], correct: 1, explanation: 'It helps reading recognition.' },
        { question: 'Aramaic uses an:', options: ['Alphabet', 'Syllabary', 'Pictographic system', 'Number system'], correct: 0, explanation: 'Aramaic uses an alphabet.' }
      ]
    },
    {
      id: '02',
      title: 'Vowels and Pronunciation',
      icon: 'A',
      duration: '20 min',
      content: [
        {
          heading: 'Vowel Points',
          text: 'Biblical Aramaic in the Hebrew Bible uses vowel points similar to Hebrew to indicate pronunciation.'
        },
        {
          heading: 'Syllables',
          text: 'Syllables are built around vowels. Recognizing open and closed syllables aids pronunciation.'
        },
        {
          heading: 'Reading Practice',
          text: 'Start with short words and syllables, then move to simple phrases.'
        }
      ],
      keyTerms: [
        { term: 'Vowel Points', definition: 'Diacritics marking vowel sounds' },
        { term: 'Syllable', definition: 'Unit of pronunciation with a vowel' },
        { term: 'Open/Closed', definition: 'Syllable types based on ending' }
      ],
      quiz: [
        { question: 'Vowels are shown by:', options: ['Vowel points', 'Extra letters only', 'No marking', 'Numbers'], correct: 0, explanation: 'Vowel points indicate vowels.' },
        { question: 'Syllables are built around:', options: ['Consonants', 'Vowels', 'Punctuation', 'Stress only'], correct: 1, explanation: 'Syllables are built around vowels.' },
        { question: 'Open and closed syllables help with:', options: ['Pronunciation', 'Only syntax', 'Only translation', 'Only vocabulary'], correct: 0, explanation: 'They help pronunciation.' },
        { question: 'Aramaic vowel points are similar to:', options: ['Greek accents', 'Hebrew vowel points', 'Latin letters', 'Cuneiform signs'], correct: 1, explanation: 'They are similar to Hebrew vowel points.' },
        { question: 'Reading practice should begin with:', options: ['Long passages', 'Short words and phrases', 'Only poetry', 'Only legal texts'], correct: 1, explanation: 'Begin with short words and phrases.' }
      ]
    },
    {
      id: '03',
      title: 'Nouns and Pronouns',
      icon: 'A',
      duration: '25 min',
      content: [
        {
          heading: 'Gender and Number',
          text: 'Aramaic nouns mark gender and number. Common endings signal masculine and feminine forms.'
        },
        {
          heading: 'Pronouns',
          text: 'Independent and suffix pronouns appear frequently. Recognizing suffix pronouns is essential for reading.'
        },
        {
          heading: 'Construct Relationships',
          text: 'Noun relationships are often expressed in construct-like structures similar to Hebrew.'
        }
      ],
      keyTerms: [
        { term: 'Suffix Pronoun', definition: 'Pronoun attached to a word' },
        { term: 'Independent Pronoun', definition: 'Standalone pronoun form' },
        { term: 'Gender', definition: 'Masculine or feminine noun class' }
      ],
      quiz: [
        { question: 'Aramaic nouns mark:', options: ['Only tense', 'Gender and number', 'Only case', 'Only aspect'], correct: 1, explanation: 'Nouns mark gender and number.' },
        { question: 'Suffix pronouns are:', options: ['Standalone', 'Attached to words', 'Only in poetry', 'Only in verbs'], correct: 1, explanation: 'Suffix pronouns attach to words.' },
        { question: 'Independent pronouns are:', options: ['Standalone forms', 'Always attached', 'Only plural', 'Only feminine'], correct: 0, explanation: 'Independent pronouns are standalone.' },
        { question: 'Construct relationships express:', options: ['Possession', 'Verb tense', 'Only number', 'Only gender'], correct: 0, explanation: 'They express possession.' },
        { question: 'Recognizing suffix pronouns helps with:', options: ['Word meaning', 'Only spelling', 'Only punctuation', 'Only syntax'], correct: 0, explanation: 'They affect word meaning.' }
      ]
    },
    {
      id: '04',
      title: 'Verbs: Peal and Stems',
      icon: 'A',
      duration: '25 min',
      content: [
        {
          heading: 'Root System',
          text: 'Like Hebrew, Aramaic verbs are based on consonantal roots that combine with patterns.'
        },
        {
          heading: 'Peal Stem',
          text: 'Peal is the basic stem in Aramaic, similar to Hebrew Qal.'
        },
        {
          heading: 'Derived Stems',
          text: 'Other stems modify meaning, including passive and causative forms.'
        }
      ],
      keyTerms: [
        { term: 'Peal', definition: 'Basic Aramaic verbal stem' },
        { term: 'Root', definition: 'Core consonants of a verb' },
        { term: 'Derived Stem', definition: 'Pattern modifying verb meaning' }
      ],
      quiz: [
        { question: 'Aramaic verbs are built from:', options: ['Vowels only', 'Consonantal roots', 'Numbers', 'Articles'], correct: 1, explanation: 'They are built from consonantal roots.' },
        { question: 'Peal is:', options: ['A derived stem', 'The basic stem', 'Only passive', 'Only imperative'], correct: 1, explanation: 'Peal is the basic stem.' },
        { question: 'Derived stems:', options: ['Never change meaning', 'Modify meaning', 'Only affect spelling', 'Only affect vowels'], correct: 1, explanation: 'Derived stems modify meaning.' },
        { question: 'Peal is similar to:', options: ['Greek aorist', 'Hebrew Qal', 'Latin passive', 'English gerund'], correct: 1, explanation: 'Peal is similar to Hebrew Qal.' },
        { question: 'Roots are typically:', options: ['Two consonants', 'Three consonants', 'Four vowels', 'Single letters'], correct: 1, explanation: 'Most roots are three consonants.' }
      ]
    },
    {
      id: '05',
      title: 'Syntax and Particles',
      icon: 'A',
      duration: '20 min',
      content: [
        {
          heading: 'Clause Order',
          text: 'Aramaic word order is flexible, often verb-initial, but can vary for emphasis.'
        },
        {
          heading: 'Particles',
          text: 'Small particles and conjunctions structure clauses and indicate relationships.'
        },
        {
          heading: 'Prepositions',
          text: 'Prepositions mark relationships between words, often attaching as prefixes.'
        }
      ],
      keyTerms: [
        { term: 'Particle', definition: 'Small word with grammatical function' },
        { term: 'Preposition', definition: 'Word showing relationship between terms' },
        { term: 'Clause', definition: 'Unit with a verb and its complements' }
      ],
      quiz: [
        { question: 'Aramaic word order is:', options: ['Rigid', 'Flexible', 'Alphabetical', 'Random'], correct: 1, explanation: 'Aramaic word order is flexible.' },
        { question: 'Particles help with:', options: ['Clause relationships', 'Only spelling', 'Only pronunciation', 'Only vocabulary'], correct: 0, explanation: 'Particles structure relationships.' },
        { question: 'Prepositions indicate:', options: ['Word relationships', 'Only tense', 'Only gender', 'Only number'], correct: 0, explanation: 'Prepositions indicate relationships.' },
        { question: 'Verb-initial clauses are:', options: ['Impossible', 'Common', 'Only poetic', 'Only modern'], correct: 1, explanation: 'Verb-initial clauses are common.' },
        { question: 'Clause structure helps:', options: ['Parsing and translation', 'Only spelling', 'Only history', 'Only vocabulary'], correct: 0, explanation: 'Clause structure helps parsing.' }
      ]
    },
    {
      id: '06',
      title: 'Biblical Aramaic Texts',
      icon: 'A',
      duration: '25 min',
      content: [
        {
          heading: 'Core Passages',
          text: 'Biblical Aramaic appears in parts of Ezra (4:8–6:18; 7:12–26) and Daniel (2:4b–7:28).'
        },
        {
          heading: 'Reading Strategy',
          text: 'Identify key forms, then translate clause by clause. Repetition across narratives aids vocabulary learning.'
        },
        {
          heading: 'Textual Awareness',
          text: 'Manuscript traditions and translation notes may mark variants in Aramaic sections.'
        }
      ],
      keyTerms: [
        { term: 'Ezra', definition: 'Biblical book containing Aramaic sections' },
        { term: 'Daniel', definition: 'Biblical book containing Aramaic sections' },
        { term: 'Variant', definition: 'Difference among manuscripts' }
      ],
      quiz: [
        { question: 'Biblical Aramaic appears in:', options: ['Ezra and Daniel', 'Genesis and Exodus', 'Psalms and Proverbs', 'Isaiah only'], correct: 0, explanation: 'It appears in Ezra and Daniel.' },
        { question: 'A reading strategy is to:', options: ['Ignore forms', 'Translate clause by clause', 'Skip repetition', 'Avoid parsing'], correct: 1, explanation: 'Translate clause by clause.' },
        { question: 'Repetition helps with:', options: ['Vocabulary retention', 'Only syntax', 'Only pronunciation', 'Only spelling'], correct: 0, explanation: 'Repetition supports vocabulary retention.' },
        { question: 'Aramaic sections in Ezra include:', options: ['4:8–6:18 and 7:12–26', '1:1–2:1', '9:1–10:1', 'Only chapter 1'], correct: 0, explanation: 'Those sections are Aramaic.' },
        { question: 'A variant is:', options: ['Manuscript difference', 'A translation error only', 'A punctuation mark', 'A loanword'], correct: 0, explanation: 'Variants are manuscript differences.' }
      ]
    }
  ],
  finalExam: [
    { question: 'Biblical Aramaic is written:', options: ['Right to left', 'Left to right', 'Top to bottom', 'Mixed direction'], correct: 0, explanation: 'It is written right to left.' },
    { question: 'Aramaic script is related to:', options: ['Square Hebrew', 'Greek', 'Latin', 'Cuneiform'], correct: 0, explanation: 'It is related to square Hebrew.' },
    { question: 'Peal is:', options: ['The basic stem', 'Only passive', 'A noun', 'A particle'], correct: 0, explanation: 'Peal is the basic stem.' },
    { question: 'Aramaic nouns mark:', options: ['Gender and number', 'Only tense', 'Only case', 'Only aspect'], correct: 0, explanation: 'They mark gender and number.' },
    { question: 'Suffix pronouns are:', options: ['Attached to words', 'Standalone', 'Only plural', 'Only feminine'], correct: 0, explanation: 'Suffix pronouns attach to words.' },
    { question: 'Aramaic word order is:', options: ['Flexible', 'Rigid', 'Alphabetical', 'Random'], correct: 0, explanation: 'It is flexible.' },
    { question: 'Biblical Aramaic appears in:', options: ['Ezra and Daniel', 'Genesis and Exodus', 'Psalms and Proverbs', 'Isaiah only'], correct: 0, explanation: 'It appears in Ezra and Daniel.' },
    { question: 'Vowel points are:', options: ['Diacritics marking vowels', 'Extra letters only', 'Numbers', 'Punctuation'], correct: 0, explanation: 'They mark vowels.' },
    { question: 'Construct-like structures express:', options: ['Possession', 'Verb tense', 'Only gender', 'Only number'], correct: 0, explanation: 'They express possession.' },
    { question: 'A textual variant is:', options: ['A manuscript difference', 'A translation error only', 'A punctuation mark', 'A loanword'], correct: 0, explanation: 'Variants are manuscript differences.' }
  ],
  about: {
    level: 'Language Course',
    description: 'A focused course in Biblical Aramaic covering script, morphology, syntax, and reading in Ezra and Daniel with a text-driven, non-denominational approach.',
    credits: '2 credits',
    prerequisites: 'Basic Hebrew helpful'
  }
};

export default aramaicCourse;
