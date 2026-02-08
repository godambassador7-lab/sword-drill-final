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
          heading: 'Reading Orientation',
          text: 'GeEez is written left to right. Practice emphasizes consistent recognition of base and modified forms.'
        }
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
        }
      ],
      keyTerms: [
        { term: 'Phonology', definition: 'Sound system of a language' },
        { term: 'Syllable', definition: 'Unit of pronunciation represented by a character' },
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
        }
      ],
      keyTerms: [
        { term: 'Gender', definition: 'Masculine/feminine noun classes' },
        { term: 'Plural', definition: 'Noun form indicating more than one' },
        { term: 'Definiteness', definition: 'Indication of specificity in context' }
      ],
      quiz: [
        { question: 'GeEez nouns mark:', options: ['Gender and number', 'Only tense', 'Only case', 'Only aspect'], correct: 0, explanation: 'Nouns mark gender and number.' },
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
        }
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
        }
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
        }
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
