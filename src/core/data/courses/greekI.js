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
          heading: 'Alphabet (1-12)',
          text: 'Alpha Α α (a), Beta Β β (b), Gamma Γ γ (g), Delta Δ δ (d), Epsilon Ε ε (e), Zeta Ζ ζ (z), Eta Η η (e), Theta Θ θ (th), Iota Ι ι (i), Kappa Κ κ (k), Lambda Λ λ (l), Mu Μ μ (m).'
        },
        {
          heading: 'Alphabet (13-24)',
          text: 'Nu Ν ν (n), Xi Ξ ξ (x), Omicron Ο ο (o), Pi Π π (p), Rho Ρ ρ (r), Sigma Σ σ/ς (s), Tau Τ τ (t), Upsilon Υ υ (u/y), Phi Φ φ (ph), Chi Χ χ (ch), Psi Ψ ψ (ps), Omega Ω ω (o).'
        },
        {
          heading: 'Pronunciation',
          text: 'Koine (Biblical/NT) pronunciation is reconstructed for study and is not the same as Modern Greek. Practice reading short syllables and words.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Which letter is Alpha? A) Α B) Μ C) Ρ D) Τ\n\n2) Which letter is Theta? A) Θ B) Ο C) Π D) Λ\n\n3) Which letter is Xi? A) Ξ B) Σ C) Ψ D) Χ\n\n4) Which is the final form of Sigma? A) ς B) σ C) Σ D) ζ\n\nAnswers: 1-A, 2-A, 3-A, 4-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match uppercase to lowercase:\n\n1) Δ 2) Λ 3) Ω 4) Φ 5) Ψ\n\nA) ω B) φ C) δ D) ψ E) λ\n\nAnswers: 1-C, 2-E, 3-A, 4-B, 5-D'
        },
        {
          heading: 'Reading Snippets',
          text: 'Greek words:\n\nθεος — theos — God\nλογος — logos — word\nφως — phos — light'
        },
        {
          heading: 'Reading Sequence',
          text: 'John 1:1 (selected words):\n\nεν — en — in\nαρχη — arche — beginning\nλογος — logos — word'
        },
        {
          heading: 'Canonical Short Reading',
          text: 'John 1:1 (short): en arche — in the beginning'
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
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Greek cases indicate: A) Grammatical role B) Only pronunciation C) Only vocabulary D) Only genre\n\n2) The article agrees in: A) Case, gender, number B) Only case C) Only gender D) Only number\n\n3) Greek genders include: A) Masculine, feminine, neuter B) Only masculine C) Only feminine D) Only neuter\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Case 2) Article 3) Gender\n\nA) Definite article agreeing with noun B) Masculine/feminine/neuter C) Form indicating grammatical role\n\nAnswers: 1-C, 2-A, 3-B'
        },
        {
          heading: 'Reading Snippets',
          text: 'Greek words (word — transliteration — gloss):\n\nλογος — logos — word\nθεος — theos — God\nανθρωπος — anthropos — man'
        },
        {
          heading: 'Reading Sequence',
          text: 'John 1:1 (selected phrase):\n\nο λογος — ho logos — the word\nο θεος — ho theos — the God'
        },
        {
          heading: 'Canonical Graded Reading',
          text: 'John 1:1 (graded): ho logos en pros ton theon — the Word was with God'
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
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Greek verbs mark: A) Person, number, tense-aspect, voice, mood B) Only tense C) Only person D) Only number\n\n2) Present tense often conveys: A) Ongoing action B) Completed action C) No action D) Only future\n\n3) Voice indicates: A) Subject relation to action B) Only time C) Only number D) Only spelling\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Tense-aspect 2) Voice 3) Mood\n\nA) Relation of subject to action B) How action is viewed C) Type of statement\n\nAnswers: 1-B, 2-A, 3-C'
        },
        {
          heading: 'Reading Snippets',
          text: 'Verb forms to sound out:\n\nλυω — luo — I release\nγραφω — grapho — I write\nλεγω — lego — I say'
        },
        {
          heading: 'Reading Sequence',
          text: 'Mark 1:11 (selected words):\n\nσυ — su — you\nει — ei — are'
        },
        {
          heading: 'Canonical Short Reading',
          text: 'Mark 1:11 (short): su ei — you are'
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
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Greek word order is: A) Flexible B) Rigid C) Alphabetical D) Random\n\n2) Case endings help identify: A) Subject and object B) Only pronunciation C) Only vocabulary D) Only genre\n\n3) Particles help with: A) Clause relationships B) Only spelling C) Only pronunciation D) Only vocabulary\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Word order 2) Clause 3) Particle\n\nA) Small word with grammatical function B) Arrangement of words in clause C) Unit with a verb and complements\n\nAnswers: 1-B, 2-C, 3-A'
        },
        {
          heading: 'Reading Snippets',
          text: 'Short clauses:\n\nο θεος αγαπα — ho theos agapa — God loves\nο λογος εστιν — ho logos estin — the word is'
        },
        {
          heading: 'Reading Sequence',
          text: 'John 1:3 (selected words):\n\nπαντα — panta — all things\nδι — di — through'
        },
        {
          heading: 'Canonical Graded Reading',
          text: 'John 1:3 (graded): panta di autou egeneto — all things came into being through him'
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
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) High-frequency words help with: A) Reading fluency B) Only pronunciation C) Only syntax D) Only spelling\n\n2) A lexicon provides: A) Word meanings B) Only punctuation C) Only genre D) Only history\n\n3) Context helps with: A) Meaning selection B) Only spelling C) Only pronunciation D) Only grammar\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Lexicon 2) Frequency 3) Context\n\nA) Surrounding text shaping meaning B) Dictionary of word meanings C) How often a word appears\n\nAnswers: 1-B, 2-C, 3-A'
        },
        {
          heading: 'Reading Snippets',
          text: 'High-frequency words:\n\nκαι — kai — and\nδε — de — but/and\nεν — en — in'
        },
        {
          heading: 'Reading Sequence',
          text: 'Romans 1:16 (selected words):\n\nευαγγελιον — euangelion — gospel\nθεου — theou — of God'
        },
        {
          heading: 'Canonical Short Reading',
          text: 'Romans 1:16 (short): euangelion theou — gospel of God'
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
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Translation should start with: A) Parsing forms B) Guessing meaning C) Ignoring syntax D) Only vocabulary\n\n2) A variant is: A) Manuscript difference B) Translation error C) Punctuation mark D) Loanword\n\n3) Parsing identifies: A) Grammatical form B) Only punctuation C) Only genre D) Only history\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Parsing 2) Variant 3) Translation\n\nA) Rendering text into another language B) Identifying grammatical form C) Difference among manuscripts\n\nAnswers: 1-B, 2-C, 3-A'
        },
        {
          heading: 'Reading Snippets',
          text: 'Short phrases:\n\nεν αρχη — en arche — in the beginning\nαμην — amen — truly/so be it'
        },
        {
          heading: 'Reading Sequence',
          text: 'John 1:2 (selected words):\n\nουτος — houtos — this (one)\nεν — en — in'
        },
        {
          heading: 'Canonical Graded Reading',
          text: 'John 1:2 (graded): houtos en en arche — this one was in the beginning'
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
