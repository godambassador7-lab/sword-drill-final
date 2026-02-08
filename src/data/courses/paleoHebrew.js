const paleoHebrewCourse = {
  id: 'paleoHebrew',
  title: 'Paleo-Hebrew',
  subtitle: 'Language Course | 6 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Script History',
      icon: 'PH',
      duration: '25 min',
      content: [
        {
          heading: 'Origins and Development',
          text: 'Paleo-Hebrew refers to early Hebrew script forms used in ancient inscriptions before the widespread adoption of the square script.'
        },
        {
          heading: 'Historical Context',
          text: 'Paleo-Hebrew appears in inscriptions, seals, and coins, providing archaeological context for ancient Israelite writing.'
        }
      ],
      keyTerms: [
        { term: 'Paleo-Hebrew', definition: 'Early Hebrew script used in ancient inscriptions' },
        { term: 'Inscriptions', definition: 'Text carved or written on durable materials' },
        { term: 'Square Script', definition: 'Later Hebrew script standard in manuscripts' }
      ],
      quiz: [
        { question: 'Paleo-Hebrew refers to:', options: ['Modern Hebrew', 'Early Hebrew script forms', 'Greek script', 'Latin script'], correct: 1, explanation: 'It refers to early Hebrew script forms.' },
        { question: 'Paleo-Hebrew is found in:', options: ['Modern newspapers', 'Inscriptions and coins', 'Digital fonts only', 'Printed Bibles only'], correct: 1, explanation: 'It appears in inscriptions and coins.' },
        { question: 'Square script became common:', options: ['After Paleo-Hebrew usage', 'Before Paleo-Hebrew', 'Only in the modern era', 'Never'], correct: 0, explanation: 'Square script became common later.' },
        { question: 'Inscriptions provide:', options: ['Archaeological context', 'Only grammar tables', 'Only vocabulary lists', 'Only pronunciation'], correct: 0, explanation: 'They provide archaeological context.' },
        { question: 'Paleo-Hebrew is primarily a:', options: ['Script', 'Spoken dialect', 'Translation method', 'Grammar system'], correct: 0, explanation: 'It is a script.' }
      ]
    },
    {
      id: '02',
      title: 'Letter Forms',
      icon: 'PH',
      duration: '30 min',
      content: [
        {
          heading: 'Alphabet Overview',
          text: 'Paleo-Hebrew uses a 22-letter consonantal alphabet with distinct letter shapes from square Hebrew.'
        },
        {
          heading: 'Comparative Recognition',
          text: 'Comparing Paleo-Hebrew letters with later Hebrew forms helps recognition and transliteration.'
        }
      ],
      keyTerms: [
        { term: 'Alphabet', definition: 'Set of letters used to write the language' },
        { term: 'Transliteration', definition: 'Representing letters in another script' },
        { term: 'Consonantal', definition: 'Primarily consonant letters' }
      ],
      quiz: [
        { question: 'Paleo-Hebrew has how many letters?', options: ['20', '22', '24', '26'], correct: 1, explanation: 'It has 22 letters.' },
        { question: 'The script is primarily:', options: ['Consonantal', 'Vowel-only', 'Syllabic', 'Pictographic only'], correct: 0, explanation: 'It is primarily consonantal.' },
        { question: 'Comparing forms helps with:', options: ['Recognition and transliteration', 'Only pronunciation', 'Only syntax', 'Only vocabulary'], correct: 0, explanation: 'It helps recognition/transliteration.' },
        { question: 'Transliteration means:', options: ['Translation', 'Representing letters in another script', 'Pronouncing silently', 'Ignoring vowels'], correct: 1, explanation: 'It represents letters in another script.' },
        { question: 'Paleo-Hebrew letters are:', options: ['Identical to square Hebrew', 'Distinct from square Hebrew', 'Greek letters', 'Latin letters'], correct: 1, explanation: 'They are distinct from square Hebrew.' }
      ]
    },
    {
      id: '03',
      title: 'Reading Inscriptions',
      icon: 'PH',
      duration: '25 min',
      content: [
        {
          heading: 'Common Inscriptions',
          text: 'Inscriptions include seal impressions, ostraca, and monumental texts. These provide real-world examples of the script.'
        },
        {
          heading: 'Letter-by-Letter Reading',
          text: 'Practice reading by identifying letters, then grouping into words. Context aids interpretation.'
        }
      ],
      keyTerms: [
        { term: 'Ostraca', definition: 'Pottery shards used for writing' },
        { term: 'Seal', definition: 'Stamped inscription used for identification' },
        { term: 'Context', definition: 'Historical or textual setting for interpretation' }
      ],
      quiz: [
        { question: 'Ostraca are:', options: ['Stone tablets', 'Pottery shards used for writing', 'Metal coins only', 'Paper manuscripts'], correct: 1, explanation: 'Ostraca are pottery shards used for writing.' },
        { question: 'Seals were used for:', options: ['Identification', 'Pronunciation', 'Translation only', 'Vowel marking'], correct: 0, explanation: 'Seals were used for identification.' },
        { question: 'Reading inscriptions begins with:', options: ['Letter identification', 'Translation only', 'Grammar tables', 'Skipping unknown letters'], correct: 0, explanation: 'Start with letter identification.' },
        { question: 'Context helps with:', options: ['Interpretation', 'Only spelling', 'Only punctuation', 'Only vocabulary'], correct: 0, explanation: 'Context helps interpretation.' },
        { question: 'Inscriptions provide:', options: ['Archaeological evidence', 'Only poetry', 'Only modern usage', 'Only dictionaries'], correct: 0, explanation: 'They provide archaeological evidence.' }
      ]
    },
    {
      id: '04',
      title: 'Nouns and Word Patterns',
      icon: 'PH',
      duration: '25 min',
      content: [
        {
          heading: 'Noun Recognition',
          text: 'Paleo-Hebrew inscriptions often contain names, titles, and short phrases. Recognizing common noun patterns aids reading.'
        },
        {
          heading: 'Consonantal Patterns',
          text: 'Without vowel points, meaning relies on consonantal patterns and context.'
        }
      ],
      keyTerms: [
        { term: 'Consonantal Pattern', definition: 'Word shape based on consonant sequence' },
        { term: 'Proper Name', definition: 'Personal or place name' },
        { term: 'Pattern Recognition', definition: 'Identifying common word shapes' }
      ],
      quiz: [
        { question: 'Paleo-Hebrew texts often include:', options: ['Names and titles', 'Long vowels only', 'Modern slang', 'Only poetry'], correct: 0, explanation: 'Names and titles are common.' },
        { question: 'Without vowel points, meaning relies on:', options: ['Context and consonantal patterns', 'Random guessing', 'Only punctuation', 'Only word order'], correct: 0, explanation: 'Context and consonantal patterns are key.' },
        { question: 'Proper names are:', options: ['Personal or place names', 'Verb forms', 'Particles', 'Prepositions'], correct: 0, explanation: 'They are personal or place names.' },
        { question: 'Pattern recognition helps with:', options: ['Word identification', 'Only pronunciation', 'Only syntax', 'Only history'], correct: 0, explanation: 'It helps identify words.' },
        { question: 'Consonantal patterns are:', options: ['Vowel marks', 'Sequences of consonants', 'Accent marks', 'Numbers'], correct: 1, explanation: 'They are sequences of consonants.' }
      ]
    },
    {
      id: '05',
      title: 'Verbs and Roots',
      icon: 'PH',
      duration: '20 min',
      content: [
        {
          heading: 'Root Awareness',
          text: 'Even in inscriptions, recognizing common Hebrew roots helps interpret short verbal forms.'
        },
        {
          heading: 'Contextual Reading',
          text: 'Short inscriptions require careful contextual reading to identify likely verbs and meanings.'
        }
      ],
      keyTerms: [
        { term: 'Root', definition: 'Core consonants of a Hebrew word' },
        { term: 'Context', definition: 'Surrounding information guiding interpretation' },
        { term: 'Short Form', definition: 'Brief verbal or nominal form in inscriptions' }
      ],
      quiz: [
        { question: 'Recognizing roots helps:', options: ['Interpret short forms', 'Only pronunciation', 'Only syntax', 'Only punctuation'], correct: 0, explanation: 'Roots help interpret short forms.' },
        { question: 'Inscriptions are often:', options: ['Long narratives', 'Short and fragmentary', 'Only poetry', 'Only legal codes'], correct: 1, explanation: 'Inscriptions are often short.' },
        { question: 'Context is important because it:', options: ['Guides meaning', 'Eliminates meaning', 'Replaces grammar', 'Removes vocabulary'], correct: 0, explanation: 'Context guides meaning.' },
        { question: 'Roots are:', options: ['Core consonants', 'Vowels', 'Punctuation marks', 'Numbers'], correct: 0, explanation: 'Roots are core consonants.' },
        { question: 'Short forms require:', options: ['Careful analysis', 'No analysis', 'Only guessing', 'Only translation notes'], correct: 0, explanation: 'They require careful analysis.' }
      ]
    },
    {
      id: '06',
      title: 'Transliteration and Practice',
      icon: 'PH',
      duration: '20 min',
      content: [
        {
          heading: 'Transliteration Skills',
          text: 'Transliteration converts Paleo-Hebrew letters into square Hebrew or Latin letters for study.'
        },
        {
          heading: 'Practice Sets',
          text: 'Practice with short inscriptional phrases improves recognition and confidence.'
        }
      ],
      keyTerms: [
        { term: 'Transliteration', definition: 'Representing letters in another script' },
        { term: 'Practice Set', definition: 'Collection of sample readings' },
        { term: 'Recognition', definition: 'Ability to identify letters quickly' }
      ],
      quiz: [
        { question: 'Transliteration is:', options: ['Translation of meaning', 'Representation of letters in another script', 'Pronunciation only', 'Grammar only'], correct: 1, explanation: 'It represents letters in another script.' },
        { question: 'Practice sets improve:', options: ['Recognition', 'Only pronunciation', 'Only syntax', 'Only history'], correct: 0, explanation: 'They improve recognition.' },
        { question: 'Transliteration helps with:', options: ['Comparative study', 'Only spelling', 'Only punctuation', 'Only vocabulary'], correct: 0, explanation: 'It helps comparative study.' },
        { question: 'Reading practice should use:', options: ['Short phrases', 'Long narratives only', 'Only poetry', 'Only grammar tables'], correct: 0, explanation: 'Short phrases are best for practice.' },
        { question: 'Recognition refers to:', options: ['Identifying letters', 'Only translating', 'Only interpreting', 'Only memorizing'], correct: 0, explanation: 'Recognition is identifying letters.' }
      ]
    }
  ],
  finalExam: [
    { question: 'Paleo-Hebrew refers to:', options: ['Early Hebrew script forms', 'Modern Hebrew', 'Greek script', 'Latin script'], correct: 0, explanation: 'It refers to early Hebrew script forms.' },
    { question: 'Paleo-Hebrew has:', options: ['22 letters', '24 letters', '26 letters', '28 letters'], correct: 0, explanation: 'It has 22 letters.' },
    { question: 'Inscriptions include:', options: ['Seals and ostraca', 'Only printed books', 'Only digital texts', 'Only poetry'], correct: 0, explanation: 'Seals and ostraca are common.' },
    { question: 'Without vowels, meaning relies on:', options: ['Consonantal patterns and context', 'Random guessing', 'Only punctuation', 'Only word order'], correct: 0, explanation: 'Consonantal patterns and context are key.' },
    { question: 'Transliteration means:', options: ['Representing letters in another script', 'Translating meaning', 'Pronunciation only', 'Grammar only'], correct: 0, explanation: 'It represents letters in another script.' },
    { question: 'Ostraca are:', options: ['Pottery shards used for writing', 'Stone tablets only', 'Metal coins only', 'Paper manuscripts'], correct: 0, explanation: 'Ostraca are pottery shards.' },
    { question: 'Paleo-Hebrew is primarily a:', options: ['Script', 'Spoken dialect', 'Translation method', 'Grammar system'], correct: 0, explanation: 'It is a script.' },
    { question: 'Pattern recognition helps with:', options: ['Word identification', 'Only pronunciation', 'Only syntax', 'Only history'], correct: 0, explanation: 'It helps word identification.' },
    { question: 'Roots are:', options: ['Core consonants', 'Vowels', 'Punctuation marks', 'Numbers'], correct: 0, explanation: 'Roots are core consonants.' },
    { question: 'Context is important because it:', options: ['Guides meaning', 'Eliminates meaning', 'Replaces grammar', 'Removes vocabulary'], correct: 0, explanation: 'Context guides meaning.' }
  ],
  about: {
    level: 'Language Course',
    description: 'An introductory course in Paleo-Hebrew script and inscriptional reading, focused on archaeological and historical usage without denominational bias.',
    credits: '2 credits',
    prerequisites: 'None'
  }
};

export default paleoHebrewCourse;
