const hebrewIICourse = {
  id: 'hebrewII',
  title: 'Biblical Hebrew II',
  subtitle: 'Language Course | 6 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Weak Verbs and Gutturals',
      icon: 'H2',
      duration: '35 min',
      content: [
        {
          heading: 'Weak Verb Families',
          text: 'Weak verbs include I-nun, I-yod, II-weak, and III-weak patterns. These often show vowel changes and dropped consonants.'
        },
        {
          heading: 'Gutturals',
          text: 'Gutturals (א ה ח ע) affect vowel choices and can resist dagesh. Recognizing them helps parsing.'
        },
        {
          heading: 'Reading Sequence',
          text: 'Genesis 1:1-3 (selected phrases):\n\nברא אלהים — bara elohim — created God\nויהי אור — vayehi or — and there was light'
        },
        {
          heading: 'Canonical Short Reading',
          text: 'Genesis 1:2 (short): ruach elohim — Spirit of God'
        }
      ],
      keyTerms: [
        { term: 'Weak Verb', definition: 'Verb with irregular patterns due to weak consonants' },
        { term: 'Gutturals', definition: 'א ה ח ע consonants affecting vowel patterns' },
        { term: 'Dagesh', definition: 'Dot indicating doubling or hardening' }
      ],
      quiz: [
        { question: 'Weak verbs are irregular because of:', options: ['Weak consonants', 'Only prefixes', 'Only suffixes', 'Only vowels'], correct: 0, explanation: 'Weak consonants cause irregular patterns.' },
        { question: 'Gutturals include:', options: ['א ה ח ע', 'ב ג ד כ', 'מ נ ל ר', 'פ צ ט ס'], correct: 0, explanation: 'Gutturals are א ה ח ע.' },
        { question: 'Gutturals often affect:', options: ['Vowel choices', 'Only word order', 'Only number', 'Only syntax'], correct: 0, explanation: 'They influence vowel patterns.' },
        { question: 'A weak verb may:', options: ['Drop a consonant', 'Always add consonants', 'Ignore vowels', 'Use only prefixes'], correct: 0, explanation: 'Consonants can drop.' },
        { question: 'Recognizing weak verbs helps with:', options: ['Parsing', 'Only pronunciation', 'Only spelling', 'Only history'], correct: 0, explanation: 'It helps parsing.' }
      ]
    },
    {
      id: '02',
      title: 'Derived Stems in Depth',
      icon: 'H2',
      duration: '35 min',
      content: [
        {
          heading: 'Stem Review',
          text: 'Niphal, Piel, Pual, Hiphil, Hophal, and Hithpael modify meaning and voice.'
        },
        {
          heading: 'Stem Recognition',
          text: 'Identify stem patterns by prefixes, vowel patterns, and doubled middle radicals.'
        },
        {
          heading: 'Reading Sequence',
          text: 'Exodus 3:2 (selected phrases):\n\nויאר — vayar — and he saw\nאיננו אכל — einenu ukkal — it was not consumed'
        },
        {
          heading: 'Canonical Graded Reading',
          text: 'Exodus 3:2 (graded): vayar — hineh haseneh boer — and he saw — behold, the bush was burning'
        }
      ],
      keyTerms: [
        { term: 'Niphal', definition: 'Passive/reflexive stem' },
        { term: 'Piel', definition: 'Intensive/causative stem' },
        { term: 'Hiphil', definition: 'Causative stem' }
      ],
      quiz: [
        { question: 'Hiphil is typically:', options: ['Causative', 'Passive only', 'Only reflexive', 'Only imperative'], correct: 0, explanation: 'Hiphil is causative.' },
        { question: 'Piel often indicates:', options: ['Intensive action', 'Only passive', 'Only nouns', 'Only particles'], correct: 0, explanation: 'Piel is intensive.' },
        { question: 'Niphal is commonly:', options: ['Passive/reflexive', 'Only active', 'Only imperative', 'Only future'], correct: 0, explanation: 'Niphal is passive/reflexive.' },
        { question: 'Stem recognition depends on:', options: ['Prefixes and vowel patterns', 'Only word order', 'Only suffixes', 'Only context'], correct: 0, explanation: 'Patterns identify stems.' },
        { question: 'Derived stems modify:', options: ['Meaning and voice', 'Only spelling', 'Only number', 'Only gender'], correct: 0, explanation: 'They modify meaning/voice.' }
      ]
    },
    {
      id: '03',
      title: 'Pronouns and Suffixes',
      icon: 'H2',
      duration: '30 min',
      content: [
        {
          heading: 'Independent Pronouns',
          text: 'Independent pronouns appear for emphasis or clarity.'
        },
        {
          heading: 'Pronominal Suffixes',
          text: 'Suffixes attach to nouns, prepositions, and verbs to indicate possession or object.'
        },
        {
          heading: 'Reading Sequence',
          text: 'Psalm 23:1 (selected phrases):\n\nיהוה רעי — YHWH ro‘i — the LORD is my shepherd\nלא אחסר — lo ehsar — I shall not lack'
        },
        {
          heading: 'Canonical Short Reading',
          text: 'Psalm 23:1 (short): lo ehsar — I shall not lack'
        }
      ],
      keyTerms: [
        { term: 'Independent Pronoun', definition: 'Standalone pronoun form' },
        { term: 'Suffix Pronoun', definition: 'Pronoun attached to a word' },
        { term: 'Possession', definition: 'Relationship expressed by suffixes' }
      ],
      quiz: [
        { question: 'Suffix pronouns attach to:', options: ['Nouns, prepositions, verbs', 'Only nouns', 'Only verbs', 'Only particles'], correct: 0, explanation: 'They attach to multiple word types.' },
        { question: 'Independent pronouns are:', options: ['Standalone forms', 'Always attached', 'Only plural', 'Only feminine'], correct: 0, explanation: 'They stand alone.' },
        { question: 'Suffixes often mark:', options: ['Possession', 'Only tense', 'Only case', 'Only aspect'], correct: 0, explanation: 'They often mark possession.' },
        { question: 'Pronouns are used for:', options: ['Reference to persons', 'Only verbs', 'Only particles', 'Only vowels'], correct: 0, explanation: 'They refer to persons.' },
        { question: 'Recognizing suffixes helps with:', options: ['Parsing', 'Only spelling', 'Only punctuation', 'Only history'], correct: 0, explanation: 'It aids parsing.' }
      ]
    },
    {
      id: '04',
      title: 'Participles and Infinitives',
      icon: 'H2',
      duration: '30 min',
      content: [
        {
          heading: 'Participles',
          text: 'Participles are verbal adjectives used for ongoing action or description.'
        },
        {
          heading: 'Infinitives',
          text: 'Infinitives can express purpose, result, or sequence.'
        },
        {
          heading: 'Reading Sequence',
          text: 'Isaiah 6:3 (selected phrases):\n\nקדוש קדוש — qadosh qadosh — holy, holy\nמלא כל־הארץ — male kol-haaretz — the whole earth is full'
        },
        {
          heading: 'Canonical Graded Reading',
          text: 'Isaiah 6:3 (graded): qadosh qadosh qadosh YHWH tsevaot — Holy, holy, holy is the LORD of hosts'
        }
      ],
      keyTerms: [
        { term: 'Participle', definition: 'Verbal adjective' },
        { term: 'Infinitive', definition: 'Verbal noun' },
        { term: 'Purpose', definition: 'Function often expressed by infinitives' }
      ],
      quiz: [
        { question: 'Participles function as:', options: ['Verbal adjectives', 'Only nouns', 'Only pronouns', 'Only particles'], correct: 0, explanation: 'Participles are verbal adjectives.' },
        { question: 'Infinitives function as:', options: ['Verbal nouns', 'Only adjectives', 'Only prepositions', 'Only particles'], correct: 0, explanation: 'Infinitives are verbal nouns.' },
        { question: 'Infinitives can express:', options: ['Purpose', 'Only number', 'Only gender', 'Only punctuation'], correct: 0, explanation: 'They can express purpose.' },
        { question: 'Participles often indicate:', options: ['Ongoing action', 'Only past action', 'Only future', 'Only imperative'], correct: 0, explanation: 'They often indicate ongoing action.' },
        { question: 'Recognizing participles helps with:', options: ['Translation', 'Only spelling', 'Only pronunciation', 'Only history'], correct: 0, explanation: 'It helps translation.' }
      ]
    },
    {
      id: '05',
      title: 'Clause Structure and Discourse',
      icon: 'H2',
      duration: '30 min',
      content: [
        {
          heading: 'Clause Types',
          text: 'Recognize main, subordinate, and relative clauses in Hebrew narratives and poetry.'
        },
        {
          heading: 'Waw-Consecutive',
          text: 'Waw-consecutive advances narrative sequence and is a key discourse marker.'
        },
        {
          heading: 'Reading Sequence',
          text: 'Ruth 1:16 (selected phrases):\n\nעמך עמי — amekh ami — your people are my people\nאלהיך אלהי — elohayikh elohai — your God is my God'
        },
        {
          heading: 'Canonical Short Reading',
          text: 'Ruth 1:16 (short): elohayikh elohai — your God is my God'
        }
      ],
      keyTerms: [
        { term: 'Clause', definition: 'Unit with a verb and complements' },
        { term: 'Discourse', definition: 'Larger flow of narrative or poetry' },
        { term: 'Waw-Consecutive', definition: 'Narrative sequencing marker' }
      ],
      quiz: [
        { question: 'Waw-consecutive is used for:', options: ['Narrative sequencing', 'Poetic rhyme', 'Only questions', 'Only commands'], correct: 0, explanation: 'It advances narrative sequence.' },
        { question: 'A clause includes:', options: ['A verb and complements', 'Only nouns', 'Only adjectives', 'Only adverbs'], correct: 0, explanation: 'A clause includes a verb and complements.' },
        { question: 'Discourse refers to:', options: ['Larger flow of text', 'Only spelling', 'Only punctuation', 'Only vocabulary'], correct: 0, explanation: 'Discourse is larger flow.' },
        { question: 'Clause types include:', options: ['Main and subordinate', 'Only main', 'Only subordinate', 'Only relative'], correct: 0, explanation: 'Main/subordinate are common.' },
        { question: 'Recognizing discourse helps with:', options: ['Interpretation', 'Only pronunciation', 'Only spelling', 'Only history'], correct: 0, explanation: 'It helps interpretation.' }
      ]
    },
    {
      id: '06',
      title: 'Reading in Narrative and Poetry',
      icon: 'H2',
      duration: '35 min',
      content: [
        {
          heading: 'Narrative Reading',
          text: 'Practice narrative sequences with repeated waw-consecutive forms.'
        },
        {
          heading: 'Poetic Reading',
          text: 'Identify parallelism and key thematic words in poetry.'
        },
        {
          heading: 'Reading Sequence',
          text: 'Genesis 22:1-2; Psalm 23:1-2 (selected phrases):\n\nקח נא את־בנך — qah na et-binkha — take, please, your son\nבנאות דשא — binot deshe — in green pastures'
        },
        {
          heading: 'Canonical Graded Reading',
          text: 'Psalm 23:2 (graded): binot deshe yarbitseni — al mei menuhot yenahaleini — he makes me lie down in green pastures; he leads me beside still waters'
        }
      ],
      keyTerms: [
        { term: 'Parallelism', definition: 'Corresponding poetic lines' },
        { term: 'Theme', definition: 'Key idea repeated in a passage' },
        { term: 'Narrative', definition: 'Story sequence with verbs' }
      ],
      quiz: [
        { question: 'Narrative Hebrew often uses:', options: ['Waw-consecutive', 'Only noun clauses', 'Only passive', 'Only imperatives'], correct: 0, explanation: 'Waw-consecutive advances narrative.' },
        { question: 'Hebrew poetry relies on:', options: ['Parallelism', 'End rhyme only', 'Alphabetical order', 'No structure'], correct: 0, explanation: 'Parallelism is central.' },
        { question: 'Themes are:', options: ['Repeated key ideas', 'Only verb tenses', 'Only suffixes', 'Only vowels'], correct: 0, explanation: 'Themes are repeated ideas.' },
        { question: 'Narrative reading focuses on:', options: ['Sequence of events', 'Only vocabulary lists', 'Only syntax tables', 'Only history'], correct: 0, explanation: 'Narrative focuses on sequence.' },
        { question: 'Poetic reading focuses on:', options: ['Parallel lines', 'Only word order', 'Only pronunciation', 'Only morphology'], correct: 0, explanation: 'Poetry focuses on parallelism.' }
      ]
    }
  ],
  finalExam: [
    { question: 'Weak verbs are irregular because of:', options: ['Weak consonants', 'Only prefixes', 'Only suffixes', 'Only vowels'], correct: 0, explanation: 'Weak consonants cause irregular patterns.' },
    { question: 'Gutturals include:', options: ['א ה ח ע', 'ב ג ד כ', 'מ נ ל ר', 'פ צ ט ס'], correct: 0, explanation: 'Gutturals are א ה ח ע.' },
    { question: 'Hiphil is typically:', options: ['Causative', 'Passive only', 'Only reflexive', 'Only imperative'], correct: 0, explanation: 'Hiphil is causative.' },
    { question: 'Suffix pronouns attach to:', options: ['Nouns, prepositions, verbs', 'Only nouns', 'Only verbs', 'Only particles'], correct: 0, explanation: 'They attach to multiple word types.' },
    { question: 'Participles function as:', options: ['Verbal adjectives', 'Only nouns', 'Only pronouns', 'Only particles'], correct: 0, explanation: 'Participles are verbal adjectives.' },
    { question: 'Infinitives function as:', options: ['Verbal nouns', 'Only adjectives', 'Only prepositions', 'Only particles'], correct: 0, explanation: 'Infinitives are verbal nouns.' },
    { question: 'Waw-consecutive is used for:', options: ['Narrative sequencing', 'Poetic rhyme', 'Only questions', 'Only commands'], correct: 0, explanation: 'It advances narrative sequence.' },
    { question: 'Hebrew poetry relies on:', options: ['Parallelism', 'End rhyme only', 'Alphabetical order', 'No structure'], correct: 0, explanation: 'Parallelism is central.' },
    { question: 'Discourse refers to:', options: ['Larger flow of text', 'Only spelling', 'Only punctuation', 'Only vocabulary'], correct: 0, explanation: 'Discourse is larger flow.' },
    { question: 'Recognizing stems helps with:', options: ['Meaning and voice', 'Only spelling', 'Only number', 'Only gender'], correct: 0, explanation: 'Stems modify meaning and voice.' }
  ],
  about: {
    level: 'Language Course',
    description: 'A second-semester Biblical Hebrew course covering weak verbs, derived stems, pronouns, and reading sequences in narrative and poetry.',
    credits: '3 credits',
    prerequisites: 'Biblical Hebrew I'
  }
};

export default hebrewIICourse;
