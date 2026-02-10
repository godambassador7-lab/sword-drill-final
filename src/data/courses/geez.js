const geezCourse = {
  id: 'geez',
  title: 'GeEez',
  subtitle: 'Language Course | 6 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Fidel and Script',
      icon: 'GZ',
      duration: '30 min',
      content: [
        {
          heading: 'Script Overview',
          text: 'GeEez uses the fidel script, an abugida where consonant bases are modified to indicate vowels.'
        },
        {
          heading: 'Letter Series',
          text: 'Each consonant has a series of vowel forms. Learning the series is essential for reading.'
        },
        {
          heading: 'Series Order (Romanized)',
          text: 'Series order is consistent: 1=ae, 2=u, 3=i, 4=ah, 5=e, 6=uh (schwa), 7=o. Mastering the order helps you read any consonant family.'
        },
        {
          heading: 'Sample Series (Romanized)',
          text: 'h: hae, hu, hi, ha, he, huh, ho. l: lae, lu, li, la, le, luh, lo. m: mae, mu, mi, ma, me, muh, mo.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) GeEez is written: A) Left to right B) Right to left C) Top to bottom D) Mixed\n\n2) The fidel is an: A) Abugida B) Alphabet only C) Syllabary only D) Pictographic system\n\n3) Series order #4 is: A) ah B) ae C) i D) o\n\n4) Series order #7 is: A) o B) u C) e D) ae\n\nAnswers: 1-A, 2-A, 3-A, 4-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match series order to vowel label:\n\n1) 1 2) 2 3) 3 4) 4 5) 5\n\nA) i B) ae C) u D) ah E) e\n\nAnswers: 1-B, 2-C, 3-A, 4-D, 5-E'
        },
        {
          heading: 'Reading Snippets',
          text: 'Romanized words:\n\nselam — peace\nbet — house\namen — truly/so be it'
        },
        {
          heading: 'Reading Orientation',
          text: 'GeEez is written left to right. Practice emphasizes consistent recognition of base and modified forms.'
        },
        {
          heading: 'Reading Sequence',
          text: 'Genesis 1:1 (romanized practice):\n\nselam - peace\nbet - house\namen - truly'
        },\r\n        {\r\n          heading: 'Canonical Graded Reading (Reference)',\r\n          text: 'John 1:1 (Ge\'ez text) � read a graded excerpt aloud'\r\n        },\r\n        {\r\n          heading: 'Canonical Short Reading (Reference)',\r\n          text: 'Ruth 1:16 (Ge\'ez text) � read a short excerpt aloud'\r\n        },\r\n        {\r\n          heading: 'Canonical Graded Reading (Reference)',\r\n          text: 'Isaiah 6:3 (Ge\'ez text) � read a graded excerpt aloud'\r\n        },\r\n        {\r\n          heading: 'Canonical Short Reading (Reference)',\r\n          text: 'Exodus 3:14 (Ge\'ez text) � read a short excerpt aloud'\r\n        },\r\n        {\r\n          heading: 'Canonical Graded Reading (Reference)',\r\n          text: 'Psalm 23:1 (Ge\'ez text) � read a 5-10 word excerpt aloud'\r\n        },\r\n        {\r\n          heading: 'Canonical Short Reading (Reference)',\r\n          text: 'Genesis 1:1 (Ge\'ez text) � read a 3-5 word excerpt aloud'\r\n        },
      ],
      keyTerms: [
        { term: 'Fidel', definition: 'GeEez script with vowel-modified consonants' },
        { term: 'Abugida', definition: 'Script with consonant bases and vowel modifications' },
        { term: 'Series', definition: 'Vowel variations of a consonant' }
      ],
      quiz: [
        { question: 'GeEez uses:', options: ['An abugida', 'A consonantal alphabet only', 'A syllabary only', 'A pictographic system'], correct: 0, explanation: 'GeEez uses an abugida (fidel).' },
        { question: 'Each consonant has:', options: ['One form', 'A series of vowel forms', 'Only two forms', 'No vowel forms'], correct: 1, explanation: 'Each consonant has a vowel series.' },
        { question: 'GeEez is written:', options: ['Left to right', 'Right to left', 'Top to bottom', 'Mixed direction'], correct: 0, explanation: 'GeEez is written left to right.' },
        { question: 'Fidel refers to:', options: ['A grammar term', 'The GeEez script', 'A verb tense', 'A punctuation mark'], correct: 1, explanation: 'Fidel refers to the script.' },
        { question: 'Reading practice should focus on:', options: ['Series recognition', 'Only vocabulary lists', 'Only translation', 'Only syntax'], correct: 0, explanation: 'Series recognition is key.' }
      ]
    },
    {
      id: '02',
      title: 'Phonology and Syllables',
      icon: 'GZ',
      duration: '25 min',
      content: [
        {
          heading: 'Sound System',
          text: 'GeEez includes consonants and vowels represented through the fidel. Accurate pronunciation requires steady practice with syllable forms.'
        },
        {
          heading: 'Syllable Reading',
          text: 'Each fidel character represents a syllable. Fluency builds by reading syllables as units.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Each fidel character represents: A) A syllable B) A word C) A phrase D) A sentence\n\n2) Phonology refers to: A) Sound system B) Word meaning C) Sentence order D) Writing style\n\n3) Fluency builds by: A) Reading syllables as units B) Skipping syllables C) Ignoring vowels D) Only memorizing grammar\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Phonology 2) Syllable 3) Series\n\nA) Sound system B) Unit of pronunciation represented by a character C) Vowel-modified consonant forms\n\nAnswers: 1-A, 2-B, 3-C'
        },
        {
          heading: 'Reading Snippets',
          text: 'Romanized syllable strings:\n\nhae-hu-hi-ha-he-huh-ho\nlae-lu-li-la-le-luh-lo'
        },
      ],
      keyTerms: [
        { term: 'Phonology', definition: 'Sound system of a language' },
        { term: 'Syllable', definition: 'Unit of pronunciation represented by a character' },
        {
          heading: 'Reading Sequence',
          text: 'Syllable chain (romanized):\n\nhae-hu-hi-ha-he-huh-ho\nlae-lu-li-la-le-luh-lo'
        },
        { term: 'Series', definition: 'Vowel-modified consonant forms' }
      ],
      quiz: [
        { question: 'Each fidel character represents:', options: ['A syllable', 'A word', 'A phrase', 'A sentence'], correct: 0, explanation: 'Fidel characters are syllabic.' },
        { question: 'Phonology refers to:', options: ['Sound system', 'Word meaning', 'Sentence order', 'Writing style'], correct: 0, explanation: 'Phonology is the sound system.' },
        { question: 'Fluency builds by:', options: ['Reading syllables as units', 'Skipping syllables', 'Ignoring vowels', 'Only memorizing grammar'], correct: 0, explanation: 'Read syllables as units.' },
        { question: 'Pronunciation practice should focus on:', options: ['Series and syllables', 'Only vocabulary', 'Only syntax', 'Only translation'], correct: 0, explanation: 'Series and syllables are key.' },
        { question: 'GeEez includes:', options: ['Only consonants', 'Consonants and vowels', 'Only vowels', 'Only numbers'], correct: 1, explanation: 'It includes consonants and vowels.' }
      ]
    },
    {
      id: '03',
      title: 'Nouns and Number',
      icon: 'GZ',
      duration: '25 min',
      content: [
        {
          heading: 'Noun Patterns',
          text: 'GeEez nouns show gender and number. Plural formation may involve suffixes or internal patterns.'
        },
        {
          heading: 'Definiteness',
          text: 'Definiteness and construct-like relationships appear in noun phrases, often guided by context.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) GeEez nouns mark: A) Gender and number B) Only tense C) Only case D) Only aspect\n\n2) Plural formation may involve: A) Suffixes or patterns B) Only prefixes C) Only vowel change D) No change\n\n3) Definiteness is determined by: A) Context and markers B) Random choice C) Only punctuation D) Only length\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Gender 2) Plural 3) Definiteness\n\nA) More than one B) Masculine/feminine noun classes C) Indication of specificity\n\nAnswers: 1-B, 2-A, 3-C'
        },
        {
          heading: 'Reading Snippets',
          text: 'Romanized words:\n\nselam — peace\nmesk — witness\nnagast — kings (title)'
        },
      ],
      keyTerms: [
        { term: 'Gender', definition: 'Masculine/feminine noun classes' },
        { term: 'Plural', definition: 'Noun form indicating more than one' },
        { term: 'Definiteness', definition: 'Indication of specificity in context' }
      ],
      quiz: [
        { question: 'GeEez nouns mark:', options: ['Gender and number', 'Only tense', 'Only case', 'Only aspect'], correct: 0, explanation: 'Nouns mark gender and number.' },
        {
          heading: 'Reading Sequence',
          text: 'Noun practice (romanized):\n\nselam - peace\nmesk - witness\nnagast - kings'
        },
        { question: 'Plural formation may involve:', options: ['Suffixes or patterns', 'Only prefixes', 'Only vowel change', 'No change'], correct: 0, explanation: 'Plurals use suffixes or patterns.' },
        { question: 'Definiteness is determined by:', options: ['Context and markers', 'Random choice', 'Only punctuation', 'Only length'], correct: 0, explanation: 'Context and markers indicate definiteness.' },
        { question: 'Gender in GeEez includes:', options: ['Masculine and feminine', 'Only neuter', 'Only masculine', 'Only feminine'], correct: 0, explanation: 'Masculine and feminine are used.' },
        { question: 'Noun patterns help with:', options: ['Word identification', 'Only pronunciation', 'Only spelling', 'Only syntax'], correct: 0, explanation: 'Patterns aid identification.' }
      ]
    },
    {
      id: '04',
      title: 'Verbs and Conjugation',
      icon: 'GZ',
      duration: '30 min',
      content: [
        {
          heading: 'Root System',
          text: 'GeEez verbs are commonly built from consonantal roots combined with patterns and affixes.'
        },
        {
          heading: 'Aspect and Tense',
          text: 'Verb forms signal aspect and time, often with distinct patterns for perfective and imperfective action.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) GeEez verbs are built from: A) Roots and patterns B) Only vowels C) Only suffixes D) Only prefixes\n\n2) Perfective aspect views action as: A) Complete B) Ongoing C) Hypothetical D) Unknown\n\n3) Imperfective aspect views action as: A) Ongoing B) Complete C) Only future D) Only past\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Root 2) Perfective 3) Imperfective\n\nA) Action viewed as ongoing B) Core consonants of a verb C) Action viewed as complete\n\nAnswers: 1-B, 2-C, 3-A'
        },
        {
          heading: 'Reading Snippets',
          text: 'Romanized verb roots:\n\nktb — write\nmlk — reign\namr — say'
        },
      ],
      keyTerms: [
        { term: 'Root', definition: 'Core consonants of a verb' },
        { term: 'Perfective', definition: 'Aspect viewing action as complete' },
        { term: 'Imperfective', definition: 'Aspect viewing action as ongoing' }
      ],
      quiz: [
        { question: 'GeEez verbs are built from:', options: ['Roots and patterns', 'Only vowels', 'Only suffixes', 'Only prefixes'], correct: 0, explanation: 'They are built from roots and patterns.' },
        { question: 'Perfective aspect views action as:', options: ['Complete', 'Ongoing', 'Hypothetical', 'Unknown'], correct: 0, explanation: 'Perfective views action as complete.' },
        { question: 'Imperfective aspect views action as:', options: ['Ongoing', 'Complete', 'Only future', 'Only past'], correct: 0, explanation: 'Imperfective views action as ongoing.' },
        { question: 'Verb forms indicate:', options: ['Time and aspect', 'Only number', 'Only gender', 'Only punctuation'], correct: 0, explanation: 'Verb forms indicate time/aspect.' },
        { question: 'Roots are typically:', options: ['Three consonants', 'Only vowels', 'Numbers', 'Articles'], correct: 0, explanation: 'Roots are often three consonants.' }
        {
          heading: 'Reading Sequence',
          text: 'Verb roots (romanized):\n\nktb - write\nmlk - reign\namr - say'
        },
      ]
    },
    {
      id: '05',
      title: 'Syntax and Word Order',
      icon: 'GZ',
      duration: '20 min',
      content: [
        {
          heading: 'Clause Structure',
          text: 'GeEez word order can vary. Identifying subject, verb, and object remains essential for translation.'
        },
        {
          heading: 'Particles and Prepositions',
          text: 'Particles and prepositions show relationships between clauses and phrases.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) GeEez word order is: A) Flexible B) Rigid C) Alphabetical D) Random\n\n2) Particles help with: A) Relationships between clauses B) Only pronunciation C) Only spelling D) Only vocabulary\n\n3) A clause includes: A) A verb and complements B) Only nouns C) Only adjectives D) Only adverbs\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Clause 2) Particle 3) Preposition\n\nA) Small word with grammatical function B) Word showing relationships between terms C) Unit with a verb and complements\n\nAnswers: 1-C, 2-A, 3-B'
        },
        {
          heading: 'Reading Snippets',
          text: 'Short phrase fragments:\n\nnagast amr — the king said\nbe bet — in the house'
        },
      ],
      keyTerms: [
        { term: 'Clause', definition: 'Unit with a verb and complements' },
        { term: 'Particle', definition: 'Small word with grammatical function' },
        { term: 'Preposition', definition: 'Word showing relationships between terms' }
      ],
      quiz: [
        { question: 'GeEez word order is:', options: ['Flexible', 'Rigid', 'Alphabetical', 'Random'], correct: 0, explanation: 'Word order is flexible.' },
        { question: 'Particles help with:', options: ['Relationships between clauses', 'Only pronunciation', 'Only spelling', 'Only vocabulary'], correct: 0, explanation: 'Particles show relationships.' },
        { question: 'A clause includes:', options: ['A verb and complements', 'Only nouns', 'Only adjectives', 'Only adverbs'], correct: 0, explanation: 'A clause includes a verb and complements.' },
        { question: 'Prepositions indicate:', options: ['Word relationships', 'Only tense', 'Only gender', 'Only number'], correct: 0, explanation: 'Prepositions indicate relationships.' },
        { question: 'Syntax awareness helps with:', options: ['Parsing and translation', 'Only spelling', 'Only history', 'Only vocabulary'], correct: 0, explanation: 'Syntax helps parsing and translation.' }
      ]
    },
    {
      id: '06',
        {
          heading: 'Reading Sequence',
          text: 'Clause practice (romanized):\n\nnagast amr - the king said\nbe bet - in the house'
        },
      title: 'Reading and Translation',
      icon: 'GZ',
      duration: '25 min',
      content: [
        {
          heading: 'Reading Strategy',
          text: 'Start with short phrases and high-frequency words. Identify verb forms and noun patterns before translating.'
        },
        {
          heading: 'Translation Practice',
          text: 'Use grammar and context to select the best translation. Multiple renderings may be possible.'
        },
        {
          heading: 'Practice: Multiple Choice',
          text: '1) Reading practice should begin with: A) Short phrases B) Long paragraphs C) Only poetry D) Only grammar tables\n\n2) Parsing helps identify: A) Forms B) Only punctuation C) Only genre D) Only history\n\n3) Vocabulary growth improves: A) Reading fluency B) Only writing C) Only pronunciation D) Only spelling\n\nAnswers: 1-A, 2-A, 3-A'
        },
        {
          heading: 'Practice: Matching',
          text: 'Match term to meaning:\n\n1) Parsing 2) Context 3) Vocabulary\n\nA) Common words for reading B) Identifying grammatical forms C) Surrounding text shaping meaning\n\nAnswers: 1-B, 2-C, 3-A'
        },
        {
          heading: 'Reading Snippets',
          text: 'Romanized phrases:\n\namen — truly/so be it\nselam lenna — peace to us'
        },
      ],
      keyTerms: [
        { term: 'Parsing', definition: 'Identifying grammatical forms' },
        { term: 'Context', definition: 'Surrounding text shaping meaning' },
        { term: 'Vocabulary', definition: 'Common words for reading' }
      ],
      quiz: [
        { question: 'Reading practice should begin with:', options: ['Short phrases', 'Long paragraphs', 'Only poetry', 'Only grammar tables'], correct: 0, explanation: 'Begin with short phrases.' },
        { question: 'Parsing helps identify:', options: ['Forms', 'Only punctuation', 'Only genre', 'Only history'], correct: 0, explanation: 'Parsing identifies forms.' },
        { question: 'Translation should consider:', options: ['Grammar and context', 'Only word order', 'Only vocabulary', 'Only punctuation'], correct: 0, explanation: 'Grammar and context are key.' },
        { question: 'Multiple translations can exist because:', options: ['Language has nuance', 'Text has no meaning', 'Grammar is useless', 'Context is irrelevant'], correct: 0, explanation: 'Language has nuance.' },
        { question: 'Vocabulary growth improves:', options: ['Reading fluency', 'Only writing', 'Only pronunciation', 'Only spelling'], correct: 0, explanation: 'Vocabulary improves reading fluency.' }
      ]
    }
  ],
  finalExam: [
    { question: 'GeEez uses:', options: ['An abugida', 'A consonantal alphabet only', 'A syllabary only', 'A pictographic system'], correct: 0, explanation: 'GeEez uses an abugida.' },
    { question: 'Each fidel character represents:', options: ['A syllable', 'A word', 'A phrase', 'A sentence'], correct: 0, explanation: 'It represents a syllable.' },
    { question: 'GeEez is written:', options: ['Left to right', 'Right to left', 'Top to bottom', 'Mixed direction'], correct: 0, explanation: 'GeEez is left to right.' },
    { question: 'Nouns mark:', options: ['Gender and number', 'Only tense', 'Only case', 'Only aspect'], correct: 0, explanation: 'Nouns mark gender and number.' },
        {
          heading: 'Reading Sequence',
          text: 'Short reading (romanized):\n\nselam lenna - peace to us\namen - truly'
        },
    { question: 'Verbs are built from:', options: ['Roots and patterns', 'Only vowels', 'Only suffixes', 'Only prefixes'], correct: 0, explanation: 'They are built from roots and patterns.' },
    { question: 'Perfective aspect views action as:', options: ['Complete', 'Ongoing', 'Hypothetical', 'Unknown'], correct: 0, explanation: 'Perfective views action as complete.' },
    { question: 'Word order is:', options: ['Flexible', 'Rigid', 'Alphabetical', 'Random'], correct: 0, explanation: 'Word order is flexible.' },
    { question: 'Particles help with:', options: ['Relationships between clauses', 'Only pronunciation', 'Only spelling', 'Only vocabulary'], correct: 0, explanation: 'Particles show relationships.' },
    { question: 'Parsing identifies:', options: ['Grammatical forms', 'Only punctuation', 'Only genre', 'Only history'], correct: 0, explanation: 'Parsing identifies forms.' },
    { question: 'Context is important because it:', options: ['Shapes meaning', 'Eliminates meaning', 'Replaces grammar', 'Removes vocabulary'], correct: 0, explanation: 'Context shapes meaning.' }
  ],
  about: {
    level: 'Language Course',
    description: 'A foundational GeEez course covering fidel, grammar, and reading skills with a text-driven, non-denominational approach.',
    credits: '2 credits',
    prerequisites: 'None'
  }
};

export default geezCourse;

