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
          text: 'Biblical Hebrew uses a 22-letter consonantal alphabet. Learning letter shapes and names is foundational for reading.'
        },
        {
          heading: 'Final Forms',
          text: 'Five letters have final forms used at the end of words. Recognizing these forms is essential for word identification.'
        },
        {
          heading: 'Direction of Writing',
          text: 'Hebrew is written from right to left. Early practice focuses on correct orientation and letter recognition.'
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
