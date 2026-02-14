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
          heading: 'Alphabet (1-11)',
          text: 'Aleph א (silent/stop), Bet ב (b/v), Gimel ג (g), Dalet ד (d), He ה (h), Vav ו (v/w), Zayin ז (z), Het ח (kh), Tet ט (t), Yod י (y), Kaf כ/ך (k/kh).'
        },
        {
          heading: 'Alphabet (12-22)',
          text: 'Lamed ל (l), Mem מ/ם (m), Nun נ/ן (n), Samekh ס (s), Ayin ע (silent/`), Pe פ/ף (p/f), Tsadi צ/ץ (ts), Qof ק (q), Resh ר (r), Shin ש (sh/s), Tav ת (t).'
        },
        {
          heading: 'Right-to-Left Reading',
          text: 'Aramaic is written right to left. Practice focuses on accurate letter recognition and direction.'
        },
        {
          heading: 'Final Forms',
          text: 'Like Hebrew, several letters have final forms used at word endings. Final forms: ך, ם, ן, ף, ץ.'
        },
        {
          heading: 'Practice Strings',
          text: 'Read right-to-left: בר, מלך, כתב, אמר, רוח. Focus on letter shapes and direction.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Which letter is Lamed? A) ל B) מ C) נ D) ס\n\n2) Which letter is Pe? A) פ B) צ C) ק D) ר\n\n3) Which is a final form? A) ף B) פ C) ב D) ד\n\n4) Which letter is Yod? A) י B) ו C) ה D) ת\n\nAnswers: 1-A, 2-A, 3-A, 4-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match letter to name:\n\n1) ר 2) ס 3) צ 4) כ 5) ת\n\nA) Kaf B) Samekh C) Resh D) Tsadi E) Tav\n\nAnswers: 1-C, 2-B, 3-D, 4-A, 5-E'
        },
        {
          heading: 'Reading Snippets',
          text: 'Read right-to-left (word — transliteration — gloss):\n\nבר — bar — son\nמלכא — malka — king\nאלהא — elaha — God'
        },
        {
          heading: 'Reading Sequence',
          text: 'Daniel 2:20 (selected words):\n\nbarikh - blessed\nshemeh - name\nelaha - God'
        },
        {
          heading: 'Canonical Short Reading',
          text: 'Daniel 2:20 (short): barikh shemeh elaha — blessed be the name of God'
        },
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
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Vowels are shown by: A) Vowel points B) Extra letters only C) No marking D) Numbers\n\n2) Syllables are built around: A) Vowels B) Consonants C) Punctuation D) Stress only\n\n3) Reading practice should begin with: A) Short words and phrases B) Long passages C) Only poetry D) Only legal texts\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Vowel points 2) Syllable 3) Open/Closed\n\nA) Unit of pronunciation with a vowel B) Diacritics marking vowels C) Syllable types based on ending\n\nAnswers: 1-B, 2-A, 3-C'
        },
        {
          heading: 'Reading Snippets',
          text: 'Read right-to-left (word — transliteration — gloss):\n\nבר — bar — son\nמלכא — malka — king\nאלהא — elaha — God'
        },
      ],
      keyTerms: [
        { term: 'Vowel Points', definition: 'Diacritics marking vowel sounds' },
        { term: 'Syllable', definition: 'Unit of pronunciation with a vowel' },
        {
          heading: 'Reading Sequence',
          text: 'Ezra 4:24 (selected words):\n\nbeit - house\nelaha - God\nyerushalem - Jerusalem'
        },
        {
          heading: 'Canonical Graded Reading',
          text: 'Ezra 4:24 (graded): beit elaha di-yerushalem — house of God in Jerusalem'
        },
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
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Suffix pronouns are: A) Attached to words B) Standalone C) Only in poetry D) Only in verbs\n\n2) Independent pronouns are: A) Standalone forms B) Always attached C) Only plural D) Only feminine\n\n3) Construct relationships express: A) Possession B) Verb tense C) Only number D) Only gender\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Suffix pronoun 2) Independent pronoun 3) Gender\n\nA) Standalone pronoun form B) Pronoun attached to a word C) Masculine or feminine noun class\n\nAnswers: 1-B, 2-A, 3-C'
        },
        {
          heading: 'Reading Snippets',
          text: 'Noun fragments:\n\nמלכא — malka — king\nמַלְכִין — malkin — kings\nסְפַר — sefar — book'
        },
      ],
      keyTerms: [
        { term: 'Suffix Pronoun', definition: 'Pronoun attached to a word' },
        { term: 'Independent Pronoun', definition: 'Standalone pronoun form' },
        { term: 'Gender', definition: 'Masculine or feminine noun class' }
      ],
      quiz: [
        { question: 'Aramaic nouns mark:', options: ['Only tense', 'Gender and number', 'Only case', 'Only aspect'], correct: 1, explanation: 'Nouns mark gender and number.' },
        {
          heading: 'Reading Sequence',
          text: 'Daniel 2:47 (selected words):\n\nelaha - God\nmelek - king\nmalkaya - kings'
        },
        {
          heading: 'Canonical Short Reading',
          text: 'Daniel 2:47 (short): elaha elahin — God of gods'
        },
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
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Peal is: A) The basic stem B) Only passive C) A noun D) A particle\n\n2) Derived stems: A) Modify meaning B) Never change meaning C) Only affect spelling D) Only affect vowels\n\n3) Roots are typically: A) Three consonants B) Two consonants C) Four vowels D) Single letters\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Root 2) Peal 3) Derived stem\n\nA) Pattern modifying meaning B) Basic stem C) Core consonants\n\nAnswers: 1-C, 2-B, 3-A'
        },
        {
          heading: 'Reading Snippets',
          text: 'Root awareness:\n\nכתב — ktb — write\nאמר — amr — say\nהלך — hlk — walk'
        },
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
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Aramaic word order is: A) Flexible B) Rigid C) Alphabetical D) Random\n\n2) Particles help with: A) Clause relationships B) Only spelling C) Only pronunciation D) Only vocabulary\n\n3) Verb-initial clauses are: A) Common B) Impossible C) Only poetic D) Only modern\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Particle 2) Preposition 3) Clause\n\nA) Unit with a verb and complements B) Word showing relationship between terms C) Small word with grammatical function\n\nAnswers: 1-C, 2-B, 3-A'
        },
        {
          heading: 'Reading Snippets',
          text: 'Clause fragments:\n\nואמר מלכא — ve-amar malka — and the king said\nבֵּיתָא — beita — house'
        },
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
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Biblical Aramaic appears in: A) Ezra and Daniel B) Genesis and Exodus C) Psalms and Proverbs D) Isaiah only\n\n2) A variant is: A) Manuscript difference B) A translation error only C) A punctuation mark D) A loanword\n\n3) Reading strategy is to: A) Translate clause by clause B) Ignore forms C) Skip repetition D) Avoid parsing\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Variant 2) Repetition 3) Clause\n\nA) Unit with a verb and complements B) Helps vocabulary retention C) Manuscript difference\n\nAnswers: 1-C, 2-B, 3-A'
        },
        {
          heading: 'Reading Snippets',
          text: 'Short phrases:\n\nשְׁמַע — shema — hear\nאמן — amen — truly/so be it'
        },
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
        {
          heading: 'Reading Sequence',
          text: 'Daniel 7:13 (selected words):\n\nhaza - I saw\nananei - clouds\nshemaya - heaven'
        },
        {
          heading: 'Canonical Graded Reading',
          text: 'Daniel 7:13 (graded): im ananei shemaya — with the clouds of heaven'
        },
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


