const ancientHebrewCourse = {
  id: 'ancientHebrew',
  title: 'Ancient Hebrew',
  subtitle: 'Language Course | 8 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Alphabet and Script',
      icon: 'H',
      duration: '30 min',
      content: [
        {
          heading: 'Alphabet Overview',
          text: 'Biblical Hebrew (ancient, not modern Israeli Hebrew) uses a 22-letter consonantal alphabet. Learning letter shapes and names is foundational for reading.'
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
          text: 'Five letters have final forms used at the end of words. Final forms: ך, ם, ן, ף, ץ.'
        },
        {
          heading: 'Direction of Writing',
          text: 'Hebrew is written from right to left. Early practice focuses on correct orientation and letter recognition.'
        },
        {
          heading: 'Practice Strings',
          text: 'Read right-to-left: אב, בד, גד, יד, לב, מלך, ספר. Focus on letter shapes and direction.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Which letter is Qof? A) ק B) כ C) ג D) פ\n\n2) Which letter is Tsadi? A) צ B) ס C) ש D) ת\n\n3) Which is a final form? A) ן B) נ C) י D) ו\n\n4) Which letter is Ayin? A) ע B) א C) ה D) ח\n\nAnswers: 1-A, 2-A, 3-A, 4-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match letter to sound:\n\n1) ח 2) ט 3) ש 4) צ 5) ק\n\nA) ts B) q C) kh D) t E) sh\n\nAnswers: 1-C, 2-D, 3-E, 4-A, 5-B'
        },
        {
          heading: 'Reading Snippets',
          text: 'Read right-to-left (word — transliteration — gloss):\n\nאב — av — father\nמלך — melek — king\nספר — sefer — book'
        }
      ],
      keyTerms: [
        { term: 'Consonantal Alphabet', definition: 'Alphabet primarily of consonants' },
        { term: 'Final Forms', definition: 'Letter forms used at word endings' },
        { term: 'Right-to-Left', definition: 'Direction of Hebrew writing' }
      ],
      quiz: [
        { question: 'Biblical Hebrew has how many letters?', options: ['20', '22', '24', '26'], correct: 1, explanation: 'Hebrew has 22 letters.' },
        { question: 'Hebrew is written:', options: ['Left to right', 'Right to left', 'Top to bottom', 'Mixed direction'], correct: 1, explanation: 'Hebrew is written right to left.' },
        { question: 'Final forms are used:', options: ['At the start of words', 'At the end of words', 'Only in verbs', 'Only in poetry'], correct: 1, explanation: 'Final forms are used at word endings.' },
        { question: 'The Hebrew alphabet is primarily:', options: ['Vowels', 'Consonants', 'Numbers', 'Symbols only'], correct: 1, explanation: 'It is primarily consonantal.' },
        { question: 'Learning letter shapes helps with:', options: ['Only translation', 'Reading recognition', 'Only syntax', 'Only vocabulary'], correct: 1, explanation: 'It helps reading recognition.' }
      ]
    },
    {
      id: '02',
      title: 'Vowels and Pointing',
      icon: 'H',
      duration: '25 min',
      content: [
        {
          heading: 'Vowel System',
          text: 'Hebrew vowels are indicated by vowel points added to the consonantal text. These points were standardized by the Masoretes.'
        },
        {
          heading: 'Common Vowel Signs',
          text: 'Short and long vowel signs indicate pronunciation and often influence syllable structure.'
        },
        {
          heading: 'Syllables',
          text: 'Hebrew syllables are typically open or closed. Vowel length and syllable type affect pronunciation.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Vowel points were standardized by: A) Masoretes B) Romans C) Greeks D) Modern printers\n\n2) A syllable is: A) A unit with a vowel B) Only consonants C) Only punctuation D) Only stress\n\n3) Hebrew syllables are often: A) Open or closed B) Only closed C) Only open D) Always long\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Vowel points 2) Open syllable 3) Closed syllable\n\nA) Ends with consonant B) Ends with vowel C) Marks indicating vowels\n\nAnswers: 1-C, 2-B, 3-A'
        },
        {
          heading: 'Reading Snippets',
          text: 'Sound drills (read right-to-left):\n\nba, be, bi, bo\n\nConsonant+vowel examples: בָּ, בֶּ, בִּ, בֹ (practice spacing)'
        }
      ],
      keyTerms: [
        { term: 'Vowel Points', definition: 'Diacritical marks indicating vowels' },
        { term: 'Masoretes', definition: 'Scribes who standardized vowel pointing' },
        { term: 'Syllable', definition: 'A unit of pronunciation with a vowel' }
      ],
      quiz: [
        { question: 'Vowels in Hebrew are shown by:', options: ['New letters', 'Vowel points', 'Accent marks only', 'Numbers'], correct: 1, explanation: 'Vowel points indicate vowels.' },
        { question: 'Vowel pointing was standardized by:', options: ['Romans', 'Masoretes', 'Hellenists', 'Modern printers'], correct: 1, explanation: 'Masoretes standardized vowel points.' },
        { question: 'Hebrew syllables are commonly:', options: ['Open or closed', 'Only closed', 'Only open', 'Always long'], correct: 0, explanation: 'Syllables are open or closed.' },
        { question: 'Vowel signs help with:', options: ['Pronunciation', 'Only syntax', 'Only translation', 'Only history'], correct: 0, explanation: 'Vowel signs help pronunciation.' },
        { question: 'The Hebrew text is originally:', options: ['Fully vowelled', 'Consonantal', 'Alphabetic with accents only', 'Pictographic'], correct: 1, explanation: 'It is originally consonantal.' }
      ]
    },
    {
      id: '03',
      title: 'Nouns and Construct',
      icon: 'H',
      duration: '30 min',
      content: [
        {
          heading: 'Gender and Number',
          text: 'Hebrew nouns have gender (masculine/feminine) and number (singular/plural). Many plural forms use common suffixes.'
        },
        {
          heading: 'Construct State',
          text: 'The construct state links two nouns in a possession relationship (e.g., “word of God”).'
        },
        {
          heading: 'Definiteness',
          text: 'Definiteness is often marked by the article. In construct chains, definiteness can be carried from the second noun.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Construct state indicates: A) Possession B) Verb tense C) Only gender D) Only number\n\n2) Plural forms often use: A) Common suffixes B) Only prefixes C) Only vowel change D) No change\n\n3) Definiteness is often shown by: A) A prefix article B) A suffix only C) Word order only D) No marking\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Construct state 2) Definiteness 3) Plural suffix\n\nA) Ending indicating plural number B) Marked by article C) Possession relationship\n\nAnswers: 1-C, 2-B, 3-A'
        },
        {
          heading: 'Reading Snippets',
          text: 'Construct-style phrases:\n\nמלך ישראל — melek yisrael — king of Israel\nדבר יהוה — devar YHWH — word of the LORD'
        }
      ],
      keyTerms: [
        { term: 'Construct State', definition: 'Noun form indicating possession relationship' },
        { term: 'Definiteness', definition: 'Marked by the article' },
        { term: 'Plural Suffix', definition: 'Ending indicating plural number' }
      ],
      quiz: [
        { question: 'Hebrew nouns mark:', options: ['Only gender', 'Gender and number', 'Only tense', 'Only case'], correct: 1, explanation: 'Nouns mark gender and number.' },
        { question: 'Construct state is used for:', options: ['Verb tense', 'Possession relationship', 'Pronunciation only', 'Only poetry'], correct: 1, explanation: 'Construct state marks possession.' },
        { question: 'Definiteness is often shown by:', options: ['A prefix article', 'A suffix only', 'Word order only', 'No marking'], correct: 0, explanation: 'Definiteness is often marked by the article.' },
        { question: 'Plural forms often use:', options: ['No suffixes', 'Common suffixes', 'Only prefixes', 'Only vowels'], correct: 1, explanation: 'Plural forms often use suffixes.' },
        { question: 'In a construct chain, definiteness can be:', options: ['Ignored', 'Carried from the second noun', 'Always absent', 'Always from the first noun'], correct: 1, explanation: 'It can be carried from the second noun.' }
      ]
    },
    {
      id: '04',
      title: 'Verbs: Qal and Basics',
      icon: 'H',
      duration: '30 min',
      content: [
        {
          heading: 'Root System',
          text: 'Most Hebrew verbs are built from three-consonant roots. These roots combine with patterns to form stems and tenses.'
        },
        {
          heading: 'Qal Stem',
          text: 'Qal is the basic or simple stem. It conveys straightforward action.'
        },
        {
          heading: 'Perfect and Imperfect',
          text: 'Hebrew verbal forms often indicate aspect. The perfect typically views action as complete; the imperfect views action as incomplete or ongoing.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Hebrew verbs are built from: A) Three-consonant roots B) Two vowels C) Numbers D) Articles\n\n2) Qal is: A) The basic stem B) Only passive C) A noun D) A particle\n\n3) The imperfect form often views action as: A) Incomplete/ongoing B) Complete C) Only past D) Only future\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Root 2) Stem 3) Perfect\n\nA) Basic consonants B) Pattern indicating meaning C) Views action as complete\n\nAnswers: 1-A, 2-B, 3-C'
        },
        {
          heading: 'Reading Snippets',
          text: 'Root recognition:\n\nכתב — ktb — write\nאמר — amr — say\nהלך — hlk — walk'
        }
      ],
      keyTerms: [
        { term: 'Root', definition: 'Core consonants of a Hebrew verb' },
        { term: 'Stem', definition: 'Pattern indicating verbal meaning' },
        { term: 'Qal', definition: 'Basic verbal stem' }
      ],
      quiz: [
        { question: 'Hebrew verbs are built from:', options: ['Two vowels', 'Three consonant roots', 'Numbers', 'Articles'], correct: 1, explanation: 'Most Hebrew verbs use three-consonant roots.' },
        { question: 'Qal is:', options: ['A complex stem', 'The basic stem', 'Only passive', 'Only imperative'], correct: 1, explanation: 'Qal is the basic stem.' },
        { question: 'The perfect form often views action as:', options: ['Incomplete', 'Complete', 'Hypothetical', 'Unknown'], correct: 1, explanation: 'Perfect often views action as complete.' },
        { question: 'The imperfect form often views action as:', options: ['Complete', 'Incomplete/ongoing', 'Only past', 'Only future'], correct: 1, explanation: 'Imperfect often views action as incomplete.' },
        { question: 'A verbal stem indicates:', options: ['Only spelling', 'Meaning and voice patterns', 'Only number', 'Only gender'], correct: 1, explanation: 'Stems indicate meaning/voice patterns.' }
      ]
    },
    {
      id: '05',
      title: 'Other Stems and Weak Verbs',
      icon: 'H',
      duration: '30 min',
      content: [
        {
          heading: 'Derived Stems',
          text: 'Common derived stems include Niphal, Piel, Pual, Hiphil, Hophal, and Hithpael. These modify the basic meaning of the root.'
        },
        {
          heading: 'Weak Verbs',
          text: 'Weak verbs have irregular patterns due to certain consonants (e.g., gutturals). Recognizing them is essential for parsing.'
        },
        {
          heading: 'Parsing Strategy',
          text: 'Identify root, stem, and form to determine meaning and function.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Derived stems include: A) Niphal and Hiphil B) Only Qal C) Only passive D) Only imperatives\n\n2) Weak verbs are: A) Irregular due to certain consonants B) Always regular C) Only in poetry D) Only in modern Hebrew\n\n3) Gutturals affect: A) Vowel patterns B) Only word order C) Only number D) Only case\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Derived stem 2) Weak verb 3) Guttural\n\nA) Irregular verb pattern B) Consonant affecting vowels C) Stem modifying meaning\n\nAnswers: 1-C, 2-A, 3-B'
        }
      ],
      keyTerms: [
        { term: 'Derived Stem', definition: 'Stem modifying the root meaning' },
        { term: 'Weak Verb', definition: 'Verb with irregular patterns' },
        { term: 'Guttural', definition: 'Consonants that affect vowel patterns' }
      ],
      quiz: [
        { question: 'Derived stems include:', options: ['Niphal and Hiphil', 'Only Qal', 'Only passive', 'Only imperatives'], correct: 0, explanation: 'Derived stems include Niphal and Hiphil.' },
        { question: 'Weak verbs are:', options: ['Always regular', 'Irregular due to certain consonants', 'Only in poetry', 'Only in modern Hebrew'], correct: 1, explanation: 'Weak verbs are irregular.' },
        { question: 'Parsing a verb requires:', options: ['Root, stem, form', 'Only translation', 'Only pronunciation', 'Only context'], correct: 0, explanation: 'Parsing uses root, stem, form.' },
        { question: 'Gutturals affect:', options: ['Vowel patterns', 'Only word order', 'Only number', 'Only case'], correct: 0, explanation: 'Gutturals affect vowel patterns.' },
        { question: 'Hithpael is a:', options: ['Derived stem', 'Noun suffix', 'Pronoun', 'Particle'], correct: 0, explanation: 'Hithpael is a derived stem.' }
      ]
    },
    {
      id: '06',
      title: 'Syntax and Word Order',
      icon: 'H',
      duration: '25 min',
      content: [
        {
          heading: 'Clause Structure',
          text: 'Hebrew frequently uses verb-initial clauses, especially in narrative. Word order can vary for emphasis.'
        },
        {
          heading: 'Waw-Consecutive',
          text: 'The waw-consecutive construction is a key feature in narrative sequencing, often advancing the storyline.'
        },
        {
          heading: 'Particles and Prepositions',
          text: 'Particles and prepositions shape relationships between clauses and phrases.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Waw-consecutive is used for: A) Narrative sequencing B) Poetic rhyme C) Only questions D) Only commands\n\n2) Word order can indicate: A) Emphasis B) Only tense C) Only gender D) Only number\n\n3) Particles help show: A) Relationships between clauses B) Only vocabulary C) Only spelling D) Only vowels\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Verb-initial 2) Waw-consecutive 3) Particle\n\nA) Narrative sequencing construction B) Small word with grammatical function C) Verb first in clause\n\nAnswers: 1-C, 2-A, 3-B'
        },
        {
          heading: 'Reading Snippets',
          text: 'Narrative fragments:\n\nוַיֹּאמֶר — vayyomer — and he said\nוַיְהִי — vayehi — and it happened'
        }
      ],
      keyTerms: [
        { term: 'Verb-Initial', definition: 'Clause order with verb first' },
        { term: 'Waw-Consecutive', definition: 'Narrative sequencing construction' },
        { term: 'Particle', definition: 'Small word with grammatical function' }
      ],
      quiz: [
        { question: 'Hebrew narrative often uses:', options: ['Verb-initial clauses', 'Only noun-initial clauses', 'Only adjective-initial clauses', 'Only passive clauses'], correct: 0, explanation: 'Verb-initial clauses are common.' },
        { question: 'Waw-consecutive is used for:', options: ['Poetic parallelism', 'Narrative sequencing', 'Only questions', 'Only commands'], correct: 1, explanation: 'It advances narrative sequence.' },
        { question: 'Word order can indicate:', options: ['Emphasis', 'Only tense', 'Only gender', 'Only number'], correct: 0, explanation: 'Word order can indicate emphasis.' },
        { question: 'Particles help show:', options: ['Relationships between clauses', 'Only vocabulary', 'Only spelling', 'Only vowels'], correct: 0, explanation: 'Particles show relationships.' },
        { question: 'Prepositions relate:', options: ['Words and phrases', 'Only verbs', 'Only nouns', 'Only adjectives'], correct: 0, explanation: 'Prepositions relate words and phrases.' }
      ]
    },
    {
      id: '07',
      title: 'Poetry and Parallelism',
      icon: 'H',
      duration: '25 min',
      content: [
        {
          heading: 'Poetic Structure',
          text: 'Hebrew poetry relies on parallelism rather than rhyme. Lines echo or contrast one another.'
        },
        {
          heading: 'Imagery and Metaphor',
          text: 'Poetic language is rich in imagery. Interpreters must respect figurative language while grounding meaning in context.'
        },
        {
          heading: 'Reading Strategy',
          text: 'Identify parallel lines and key repeated terms to follow the poetic logic.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Hebrew poetry relies on: A) Parallelism B) End rhyme only C) Alphabetical order D) No structure\n\n2) Metaphor is: A) Figurative comparison B) A verb form C) A suffix D) A particle\n\n3) Reading strategy includes: A) Noting repeated terms B) Ignoring repetition C) Skipping context D) Avoiding imagery\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Parallelism 2) Imagery 3) Metaphor\n\nA) Language evoking pictures B) Corresponding poetic lines C) Figurative comparison\n\nAnswers: 1-B, 2-A, 3-C'
        },
        {
          heading: 'Reading Snippets',
          text: 'Poetic mini-lines:\n\nיהוה רֹעי — YHWH ro‘i — the LORD is my shepherd\nאור — or — light'
        }
      ],
      keyTerms: [
        { term: 'Parallelism', definition: 'Corresponding poetic lines' },
        { term: 'Metaphor', definition: 'Figurative comparison' },
        { term: 'Imagery', definition: 'Language that evokes mental pictures' }
      ],
      quiz: [
        { question: 'Hebrew poetry uses:', options: ['Parallelism', 'End rhyme only', 'Alphabetical order', 'No structure'], correct: 0, explanation: 'Parallelism is central.' },
        { question: 'Parallelism involves:', options: ['Corresponding lines', 'Only verbs', 'Only vowels', 'Only questions'], correct: 0, explanation: 'It uses corresponding lines.' },
        { question: 'Poetic imagery should be read as:', options: ['Literal only', 'Figurative in context', 'Meaningless', 'Only historical'], correct: 1, explanation: 'It is figurative in context.' },
        { question: 'A reading strategy is to:', options: ['Ignore repetition', 'Note repeated terms', 'Skip difficult lines', 'Avoid context'], correct: 1, explanation: 'Repeated terms help interpretation.' },
        { question: 'Metaphor is:', options: ['A verb form', 'A figurative comparison', 'A suffix', 'A particle'], correct: 1, explanation: 'Metaphor is a figurative comparison.' }
      ]
    },
    {
      id: '08',
      title: 'Reading and Translation',
      icon: 'H',
      duration: '25 min',
      content: [
        {
          heading: 'Reading Practice',
          text: 'Begin with short phrases and verses. Identify roots, stems, and syntax before translating.'
        },
        {
          heading: 'Lexical Tools',
          text: 'Lexicons and grammars assist with meaning and parsing. Context remains decisive for translation choices.'
        },
        {
          heading: 'Textual Awareness',
          text: 'Manuscript traditions and textual variants can influence translation notes, especially in poetic texts.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Lexicons help with: A) Word meanings B) Only punctuation C) Only genre D) Only history\n\n2) Parsing identifies: A) Grammar form B) Only vowels C) Only word order D) Only genre\n\n3) Variants are: A) Manuscript differences B) Translation errors only C) Accent marks D) Loanwords\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Lexicon 2) Parsing 3) Variant\n\nA) Identifying grammatical form B) Dictionary of Hebrew words C) Difference among manuscripts\n\nAnswers: 1-B, 2-A, 3-C'
        },
        {
          heading: 'Reading Snippets',
          text: 'Short phrases:\n\nשׁלום — shalom — peace\nאמן — amen — truly/so be it'
        }
      ],
      keyTerms: [
        { term: 'Lexicon', definition: 'Dictionary of Hebrew words' },
        { term: 'Parsing', definition: 'Identifying grammatical form' },
        { term: 'Variant', definition: 'Difference among manuscripts' }
      ],
      quiz: [
        { question: 'A good translation practice is to:', options: ['Translate before parsing', 'Identify roots and syntax first', 'Ignore context', 'Avoid lexicons'], correct: 1, explanation: 'Identify roots and syntax first.' },
        { question: 'Lexicons help with:', options: ['Word meanings', 'Only punctuation', 'Only genre', 'Only history'], correct: 0, explanation: 'Lexicons help with word meanings.' },
        { question: 'Parsing identifies:', options: ['Grammar form', 'Only vowels', 'Only word order', 'Only genre'], correct: 0, explanation: 'Parsing identifies grammatical form.' },
        { question: 'Context is important because it:', options: ['Determines intended meaning', 'Removes meaning', 'Replaces grammar', 'Eliminates vocabulary'], correct: 0, explanation: 'Context determines intended meaning.' },
        { question: 'Variants are:', options: ['Manuscript differences', 'Translation errors only', 'Accent marks', 'Loanwords'], correct: 0, explanation: 'Variants are manuscript differences.' }
      ]
    }
  ],
  finalExam: [
    { question: 'Biblical Hebrew has how many letters?', options: ['20', '22', '24', '26'], correct: 1, explanation: 'Hebrew has 22 letters.' },
    { question: 'Hebrew is written:', options: ['Right to left', 'Left to right', 'Top to bottom', 'Mixed direction'], correct: 0, explanation: 'Hebrew is written right to left.' },
    { question: 'Vowels are shown by:', options: ['Vowel points', 'Extra letters only', 'No marking', 'Numbers'], correct: 0, explanation: 'Vowel points show vowels.' },
    { question: 'Construct state indicates:', options: ['Possession', 'Verb tense', 'Only gender', 'Only number'], correct: 0, explanation: 'Construct indicates possession.' },
    { question: 'Hebrew verbs are built from:', options: ['Three-consonant roots', 'Two vowels', 'Numbers', 'Articles'], correct: 0, explanation: 'Most use three-consonant roots.' },
    { question: 'Qal is:', options: ['The basic stem', 'Only passive', 'A noun', 'A particle'], correct: 0, explanation: 'Qal is the basic stem.' },
    { question: 'The perfect form often views action as:', options: ['Complete', 'Incomplete', 'Only future', 'Only present'], correct: 0, explanation: 'Perfect often views action as complete.' },
    { question: 'Waw-consecutive is used for:', options: ['Narrative sequencing', 'Poetic rhyme', 'Only questions', 'Only commands'], correct: 0, explanation: 'It advances narrative sequence.' },
    { question: 'Parallelism is a feature of:', options: ['Hebrew poetry', 'Only prose', 'Only law', 'Only genealogy'], correct: 0, explanation: 'Parallelism is a feature of poetry.' },
    { question: 'A textual variant is:', options: ['A manuscript difference', 'A translation error', 'A vowel point', 'A suffix'], correct: 0, explanation: 'Variants are manuscript differences.' }
  ],
  about: {
    level: 'Language Course',
    description: 'A foundational course in Biblical Hebrew covering script, morphology, syntax, and reading for text-driven study without denominational bias.',
    credits: '3 credits',
    prerequisites: 'None'
  }
};

export default ancientHebrewCourse;
