const greekIICourse = {
  id: 'greekII',
  title: 'Biblical Greek II',
  subtitle: 'Language Course | 6 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Aorist and Future',
      icon: 'G2',
      duration: '35 min',
      content: [
        {
          heading: 'Aorist Basics',
          text: 'The aorist often presents action as a whole. Learn common aorist markers and endings.'
        },
        {
          heading: 'Future Forms',
          text: 'Future tense expresses expectation or intention. Recognize sigma markers and contract patterns.'
        },
        {
          heading: 'Reading Sequence',
          text: 'Mark 1:11 (selected phrases):\n\nσυ ει — su ei — you are\nο υιος μου — ho huios mou — my son'
        },
        {
          heading: 'Canonical Short Reading',
          text: 'Mark 1:11 (short): su ei ho huios mou — you are my Son'
        }
      ],
      keyTerms: [
        { term: 'Aorist', definition: 'Aspect viewing action as a whole' },
        { term: 'Future', definition: 'Form expressing future expectation' },
        { term: 'Sigma Marker', definition: 'Common future/aorist marker' }
      ],
      quiz: [
        { question: 'Aorist often views action as:', options: ['A whole', 'Ongoing', 'Repeated only', 'Only future'], correct: 0, explanation: 'Aorist views action as a whole.' },
        { question: 'Future tense often uses:', options: ['Sigma markers', 'No markers', 'Only augment', 'Only reduplication'], correct: 0, explanation: 'Sigma markers are common.' },
        { question: 'Aorist is primarily about:', options: ['Aspect', 'Only time', 'Only number', 'Only case'], correct: 0, explanation: 'Aorist is aspect-focused.' },
        { question: 'Recognizing aorist forms helps with:', options: ['Translation', 'Only spelling', 'Only pronunciation', 'Only history'], correct: 0, explanation: 'It helps translation.' },
        { question: 'Future expresses:', options: ['Expectation or intention', 'Only past', 'Only present', 'Only commands'], correct: 0, explanation: 'Future expresses expectation/intention.' }
      ]
    },
    {
      id: '02',
      title: 'Perfect and Pluperfect',
      icon: 'G2',
      duration: '30 min',
      content: [
        {
          heading: 'Perfect Tense',
          text: 'Perfect tense emphasizes a completed action with ongoing results.'
        },
        {
          heading: 'Pluperfect',
          text: 'Pluperfect indicates a completed action prior to another past action.'
        },
        {
          heading: 'Reading Sequence',
          text: 'John 19:30 (selected phrase):\n\nτετελεσται — tetelestai — it is finished'
        },
        {
          heading: 'Canonical Short Reading',
          text: 'John 19:30 (short): tetelestai — it is finished'
        }
      ],
      keyTerms: [
        { term: 'Perfect', definition: 'Completed action with ongoing result' },
        { term: 'Pluperfect', definition: 'Completed action prior to another past action' },
        { term: 'Reduplication', definition: 'Common perfect tense marker' }
      ],
      quiz: [
        { question: 'Perfect tense emphasizes:', options: ['Completed action with ongoing result', 'Only future', 'Only present', 'Only imperative'], correct: 0, explanation: 'Perfect emphasizes completed action with results.' },
        { question: 'Pluperfect indicates:', options: ['Completed action before past action', 'Only future', 'Only present', 'Only command'], correct: 0, explanation: 'Pluperfect is prior past.' },
        { question: 'Perfect often uses:', options: ['Reduplication', 'No markers', 'Only augment', 'Only sigma'], correct: 0, explanation: 'Reduplication is common.' },
        { question: 'Recognizing perfect forms helps with:', options: ['Translation', 'Only spelling', 'Only pronunciation', 'Only history'], correct: 0, explanation: 'It helps translation.' },
        { question: 'Pluperfect is typically:', options: ['Less common', 'Most common', 'Only imperative', 'Only subjunctive'], correct: 0, explanation: 'Pluperfect is less common.' }
      ]
    },
    {
      id: '03',
      title: 'Participles in Context',
      icon: 'G2',
      duration: '35 min',
      content: [
        {
          heading: 'Participle Functions',
          text: 'Participles can be adjectival, adverbial, or substantival. Identify how they function in context.'
        },
        {
          heading: 'Temporal/Logical Relations',
          text: 'Participles can express time, cause, condition, or concession.'
        },
        {
          heading: 'Reading Sequence',
          text: 'Eph 2:4-5 (selected phrase):\n\nοντες νεκροι — ontes nekroi — being dead\nσυνεζωοποιησεν — sunezoopoiesen — he made alive together'
        },
        {
          heading: 'Canonical Graded Reading',
          text: 'Eph 2:4-5 (graded): ontes nekroi — sunezoopoiesen to christo — being dead — he made alive with Christ'
        }
      ],
      keyTerms: [
        { term: 'Adjectival', definition: 'Participle describing a noun' },
        { term: 'Adverbial', definition: 'Participle modifying a clause' },
        { term: 'Substantival', definition: 'Participle functioning as a noun' }
      ],
      quiz: [
        { question: 'Participles can be:', options: ['Adjectival, adverbial, substantival', 'Only adjectival', 'Only adverbial', 'Only substantival'], correct: 0, explanation: 'Participles have multiple functions.' },
        { question: 'Participles may express:', options: ['Time or cause', 'Only number', 'Only gender', 'Only punctuation'], correct: 0, explanation: 'They can express time/cause.' },
        { question: 'Substantival participles function as:', options: ['Nouns', 'Only verbs', 'Only particles', 'Only prepositions'], correct: 0, explanation: 'They function as nouns.' },
        { question: 'Adverbial participles modify:', options: ['Clauses', 'Only nouns', 'Only adjectives', 'Only punctuation'], correct: 0, explanation: 'They modify clauses.' },
        { question: 'Adjectival participles modify:', options: ['Nouns', 'Only verbs', 'Only clauses', 'Only prepositions'], correct: 0, explanation: 'They modify nouns.' }
      ]
    },
    {
      id: '04',
      title: 'Infinitives and Subjunctive',
      icon: 'G2',
      duration: '35 min',
      content: [
        {
          heading: 'Infinitive Uses',
          text: 'Infinitives can express purpose, result, or complementary action.'
        },
        {
          heading: 'Subjunctive Mood',
          text: 'The subjunctive expresses potentiality, purpose, or exhortation.'
        },
        {
          heading: 'Reading Sequence',
          text: 'John 3:16 (selected phrases):\n\nπιστευων — pisteuon — believing\nεχη ζωην — eche zoen — may have life'
        },
        {
          heading: 'Canonical Graded Reading',
          text: 'John 3:16 (graded): hina pas ho pisteuon — eche zoen aionion — that everyone believing may have eternal life'
        }
      ],
      keyTerms: [
        { term: 'Infinitive', definition: 'Verbal noun' },
        { term: 'Subjunctive', definition: 'Mood expressing potentiality' },
        { term: 'Purpose', definition: 'Common infinitive/subjunctive use' }
      ],
      quiz: [
        { question: 'Infinitives often express:', options: ['Purpose or result', 'Only number', 'Only gender', 'Only punctuation'], correct: 0, explanation: 'Infinitives often express purpose/result.' },
        { question: 'Subjunctive expresses:', options: ['Potentiality', 'Only past', 'Only present', 'Only command'], correct: 0, explanation: 'Subjunctive expresses potentiality.' },
        { question: 'Complementary infinitives:', options: ['Complete the sense of another verb', 'Only modify nouns', 'Only act as particles', 'Only show case'], correct: 0, explanation: 'They complete another verb.' },
        { question: 'Purpose clauses often use:', options: ['Subjunctive', 'Only indicative', 'Only imperative', 'Only optative'], correct: 0, explanation: 'Subjunctive is common.' },
        { question: 'Infinitives function as:', options: ['Verbal nouns', 'Only adjectives', 'Only particles', 'Only prepositions'], correct: 0, explanation: 'Infinitives are verbal nouns.' }
      ]
    },
    {
      id: '05',
      title: 'Pronouns and Case Usage',
      icon: 'G2',
      duration: '30 min',
      content: [
        {
          heading: 'Pronoun System',
          text: 'Review personal, demonstrative, and relative pronouns with case forms.'
        },
        {
          heading: 'Genitive and Dative',
          text: 'Genitive often indicates possession or source. Dative indicates indirect object or means.'
        },
        {
          heading: 'Reading Sequence',
          text: 'Rom 1:16 (selected phrases):\n\nδυναμις θεου — dynamis theou — power of God\nεις σωτηριαν — eis soterian — unto salvation'
        },
        {
          heading: 'Canonical Short Reading',
          text: 'Rom 1:16 (short): dynamis theou — power of God'
        }
      ],
      keyTerms: [
        { term: 'Genitive', definition: 'Case often indicating possession' },
        { term: 'Dative', definition: 'Case often indicating indirect object/means' },
        { term: 'Relative Pronoun', definition: 'Pronoun introducing a clause' }
      ],
      quiz: [
        { question: 'Genitive often indicates:', options: ['Possession or source', 'Only time', 'Only place', 'Only manner'], correct: 0, explanation: 'Genitive often indicates possession/source.' },
        { question: 'Dative often indicates:', options: ['Indirect object or means', 'Only possession', 'Only subject', 'Only direct object'], correct: 0, explanation: 'Dative often indicates indirect object/means.' },
        { question: 'Relative pronouns:', options: ['Introduce clauses', 'Only indicate tense', 'Only show number', 'Only show gender'], correct: 0, explanation: 'They introduce clauses.' },
        { question: 'Pronouns decline by:', options: ['Case, gender, number', 'Only case', 'Only number', 'Only gender'], correct: 0, explanation: 'Pronouns decline by case/gender/number.' },
        { question: 'Case usage helps with:', options: ['Syntax and translation', 'Only spelling', 'Only pronunciation', 'Only history'], correct: 0, explanation: 'It aids syntax/translation.' }
      ]
    },
    {
      id: '06',
      title: 'Reading the New Testament',
      icon: 'G2',
      duration: '35 min',
      content: [
        {
          heading: 'Narrative Reading',
          text: 'Practice reading narrative with aorist and imperfect forms.'
        },
        {
          heading: 'Discourse Reading',
          text: 'Identify clause structure and discourse markers.'
        },
        {
          heading: 'Reading Sequence',
          text: 'John 1:1-3 (selected phrases):\n\nεν αρχη — en arche — in the beginning\nκαι ο λογος — kai ho logos — and the word\nπαντα δι αυτου — panta di autou — all things through him'
        },
        {
          heading: 'Canonical Graded Reading',
          text: 'John 1:1-3 (graded): en arche en ho logos — panta di autou egeneto — in the beginning was the Word — all things came through him'
        }
      ],
      keyTerms: [
        { term: 'Discourse Marker', definition: 'Word or phrase indicating structure' },
        { term: 'Narrative', definition: 'Story sequence with verbs' },
        { term: 'Clause', definition: 'Unit with verb and complements' }
      ],
      quiz: [
        { question: 'Narrative reading focuses on:', options: ['Sequence of events', 'Only vocabulary lists', 'Only syntax tables', 'Only history'], correct: 0, explanation: 'Narrative focuses on sequence.' },
        { question: 'Discourse markers help with:', options: ['Structure', 'Only spelling', 'Only pronunciation', 'Only punctuation'], correct: 0, explanation: 'They mark structure.' },
        { question: 'Clause structure helps with:', options: ['Parsing and translation', 'Only spelling', 'Only history', 'Only vocabulary'], correct: 0, explanation: 'It helps parsing.' },
        { question: 'Aorist often views action as:', options: ['A whole', 'Ongoing only', 'Only future', 'Only command'], correct: 0, explanation: 'Aorist views action as a whole.' },
        { question: 'Reading sequences should be:', options: ['Short and graded', 'Only long', 'Only ungraded', 'Only paraphrased'], correct: 0, explanation: 'Short and graded is best.' }
      ]
    }
  ],
  finalExam: [
    { question: 'Aorist often views action as:', options: ['A whole', 'Ongoing', 'Repeated only', 'Only future'], correct: 0, explanation: 'Aorist views action as a whole.' },
    { question: 'Perfect tense emphasizes:', options: ['Completed action with ongoing result', 'Only future', 'Only present', 'Only imperative'], correct: 0, explanation: 'Perfect emphasizes completed action with results.' },
    { question: 'Participles can be:', options: ['Adjectival, adverbial, substantival', 'Only adjectival', 'Only adverbial', 'Only substantival'], correct: 0, explanation: 'Participles have multiple functions.' },
    { question: 'Subjunctive expresses:', options: ['Potentiality', 'Only past', 'Only present', 'Only command'], correct: 0, explanation: 'Subjunctive expresses potentiality.' },
    { question: 'Genitive often indicates:', options: ['Possession or source', 'Only time', 'Only place', 'Only manner'], correct: 0, explanation: 'Genitive indicates possession/source.' },
    { question: 'Dative often indicates:', options: ['Indirect object or means', 'Only possession', 'Only subject', 'Only direct object'], correct: 0, explanation: 'Dative indicates indirect object/means.' },
    { question: 'Infinitives function as:', options: ['Verbal nouns', 'Only adjectives', 'Only particles', 'Only prepositions'], correct: 0, explanation: 'Infinitives are verbal nouns.' },
    { question: 'Aorist is primarily about:', options: ['Aspect', 'Only time', 'Only number', 'Only case'], correct: 0, explanation: 'Aorist is aspect-focused.' },
    { question: 'Discourse markers help with:', options: ['Structure', 'Only spelling', 'Only pronunciation', 'Only punctuation'], correct: 0, explanation: 'They mark structure.' },
    { question: 'Reading sequences should be:', options: ['Short and graded', 'Only long', 'Only ungraded', 'Only paraphrased'], correct: 0, explanation: 'Short and graded is best.' }
  ],
  about: {
    level: 'Language Course',
    description: 'A second-semester Biblical Greek course covering aorist, perfect, participles, subjunctive, and graded NT readings.',
    credits: '3 credits',
    prerequisites: 'Biblical Greek I'
  }
};

export default greekIICourse;
