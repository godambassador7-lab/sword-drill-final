const biblicalCanonCourse = {
  id: 'biblicalCanon',
  title: 'Biblical Canon',
  subtitle: 'Associate-Level Course | 7 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'What Is Canon?',
      icon: '📚',
      duration: '25 min',
      content: [
        {
          heading: 'Definition',
          text: 'Canon refers to the recognized collection of Scripture. It addresses which books were received as authoritative.'
        },
        {
          heading: 'Text-Driven Approach',
          text: 'This course focuses on historical and textual evidence rather than denominational claims.'
        }
      ],
      keyTerms: [
        { term: 'Canon', definition: 'Recognized collection of Scripture books' },
        { term: 'Authority', definition: 'Status of being recognized as Scripture' },
        { term: 'Recognition', definition: 'Community reception of texts' }
      ],
      quiz: [
        { question: 'Canon means:', options: ['Recognized collection of Scripture', 'A translation style', 'A poetic form', 'A historical event'], correct: 0, explanation: 'Canon is the recognized collection of Scripture.' },
        { question: 'Canon formation involves:', options: ['Recognition of texts', 'Only authorship', 'Only translation', 'Only archaeology'], correct: 0, explanation: 'It involves recognition of texts.' },
        { question: 'A text-driven approach emphasizes:', options: ['Historical evidence', 'Only tradition', 'Only opinion', 'Only speculation'], correct: 0, explanation: 'It emphasizes historical evidence.' },
        { question: 'Authority refers to:', options: ['Recognized status', 'Only popularity', 'Only age', 'Only size'], correct: 0, explanation: 'Authority is recognized status.' },
        { question: 'Canon concerns:', options: ['Which books are Scripture', 'Only how to read', 'Only translations', 'Only genres'], correct: 0, explanation: 'Canon concerns which books are Scripture.' }
      ]
    },
    {
      id: '02',
      title: 'Hebrew Bible Canon',
      icon: '📜',
      duration: '25 min',
      content: [
        {
          heading: 'Torah, Prophets, Writings',
          text: 'The Hebrew Bible is organized as Torah, Prophets (Neviim), and Writings (Ketuvim).'
        },
        {
          heading: 'Historical Development',
          text: 'Evidence suggests a gradual process of recognition, with the Torah recognized earliest.'
        }
      ],
      keyTerms: [
        { term: 'Torah', definition: 'First five books of the Hebrew Bible' },
        { term: 'Neviim', definition: 'Prophets section' },
        { term: 'Ketuvim', definition: 'Writings section' }
      ],
      quiz: [
        { question: 'The Hebrew Bible is organized as:', options: ['Torah, Prophets, Writings', 'Law, Gospels, Epistles', 'Poetry, Prophets, Gospels', 'Narrative, Letters, Apocalyptic'], correct: 0, explanation: 'It is Torah, Prophets, Writings.' },
        { question: 'Torah refers to:', options: ['First five books', 'Prophets only', 'Writings only', 'New Testament'], correct: 0, explanation: 'Torah is the first five books.' },
        { question: 'Recognition of the Hebrew canon was:', options: ['Gradual', 'Instant', 'Modern only', 'Unknown'], correct: 0, explanation: 'It was gradual.' },
        { question: 'Neviim means:', options: ['Prophets', 'Writings', 'Law', 'Gospels'], correct: 0, explanation: 'Neviim means Prophets.' },
        { question: 'Ketuvim means:', options: ['Writings', 'Prophets', 'Law', 'Gospels'], correct: 0, explanation: 'Ketuvim means Writings.' }
      ]
    },
    {
      id: '03',
      title: 'Second Temple Context',
      icon: '🏺',
      duration: '25 min',
      content: [
        {
          heading: 'Textual Diversity',
          text: 'Second Temple Judaism shows textual diversity with different manuscript traditions and collections.'
        },
        {
          heading: 'Qumran Evidence',
          text: 'The Dead Sea Scrolls show multiple textual forms and provide evidence for early scriptural collections.'
        }
      ],
      keyTerms: [
        { term: 'Second Temple Period', definition: 'Jewish period from return to AD 70' },
        { term: 'Qumran', definition: 'Site of the Dead Sea Scrolls' },
        { term: 'Textual Diversity', definition: 'Multiple textual forms in circulation' }
      ],
      quiz: [
        { question: 'Second Temple Judaism shows:', options: ['Textual diversity', 'Uniform manuscripts only', 'No Scripture use', 'Only oral tradition'], correct: 0, explanation: 'It shows textual diversity.' },
        { question: 'Qumran is associated with:', options: ['Dead Sea Scrolls', 'Roman law', 'Greek poetry', 'Medieval texts'], correct: 0, explanation: 'Qumran is associated with the scrolls.' },
        { question: 'Textual diversity means:', options: ['Multiple textual forms', 'No differences', 'Only modern variations', 'Only translation choices'], correct: 0, explanation: 'It means multiple textual forms.' },
        { question: 'The Second Temple period ends in:', options: ['AD 70', 'AD 30', '586 BC', '332 BC'], correct: 0, explanation: 'It ends in AD 70.' },
        { question: 'Scroll evidence helps with:', options: ['Understanding early collections', 'Only modern translation', 'Only doctrine', 'Only grammar'], correct: 0, explanation: 'It helps with early collections.' }
      ]
    },
    {
      id: '04',
      title: 'New Testament Canon',
      icon: '📖',
      duration: '25 min',
      content: [
        {
          heading: 'Early Use and Circulation',
          text: 'New Testament writings circulated among communities and were read in worship settings.'
        },
        {
          heading: 'Recognition',
          text: 'Recognition of the NT canon involved usage, apostolic connection, and widespread reception.'
        }
      ],
      keyTerms: [
        { term: 'Apostolic', definition: 'Linked to apostles or their close associates' },
        { term: 'Reception', definition: 'Widespread acceptance and use' },
        { term: 'Circulation', definition: 'Distribution of texts across communities' }
      ],
      quiz: [
        { question: 'NT writings circulated among:', options: ['Early communities', 'Only later churches', 'Only private readers', 'Only scholars'], correct: 0, explanation: 'They circulated among early communities.' },
        { question: 'Recognition involved:', options: ['Usage and reception', 'Only politics', 'Only archaeology', 'Only later councils'], correct: 0, explanation: 'Usage and reception were key.' },
        { question: 'Apostolic connection means:', options: ['Linked to apostles', 'Only geographic location', 'Only language', 'Only genre'], correct: 0, explanation: 'It means linked to apostles.' },
        { question: 'Reception refers to:', options: ['Widespread acceptance', 'Only private use', 'Only translation', 'Only copying'], correct: 0, explanation: 'It refers to widespread acceptance.' },
        { question: 'Circulation means:', options: ['Distribution of texts', 'Only preservation', 'Only translation', 'Only editing'], correct: 0, explanation: 'It means distribution of texts.' }
      ]
    },
    {
      id: '05',
      title: 'Canonical Lists and Evidence',
      icon: '🧾',
      duration: '20 min',
      content: [
        {
          heading: 'Lists and Witnesses',
          text: 'Early lists and references provide evidence of which books were recognized in different communities.'
        },
        {
          heading: 'Caution in Use',
          text: 'Lists should be interpreted in context and not treated as definitive for all regions at all times.'
        }
      ],
      keyTerms: [
        { term: 'List', definition: 'Recorded catalog of books' },
        { term: 'Witness', definition: 'Source referencing canonical status' },
        { term: 'Context', definition: 'Historical setting for lists' }
      ],
      quiz: [
        { question: 'Canonical lists provide:', options: ['Evidence of recognition', 'Only doctrine', 'Only grammar', 'Only translation'], correct: 0, explanation: 'They provide evidence of recognition.' },
        { question: 'Lists should be interpreted with:', options: ['Context', 'Only certainty', 'Only tradition', 'Only speculation'], correct: 0, explanation: 'Context is necessary.' },
        { question: 'Witness refers to:', options: ['Source referencing books', 'Only a person', 'Only a manuscript', 'Only a tradition'], correct: 0, explanation: 'Witness is a source reference.' },
        { question: 'Lists can vary by:', options: ['Region and time', 'Only language', 'Only genre', 'Only length'], correct: 0, explanation: 'Lists can vary by region and time.' },
        { question: 'Evidence should be:', options: ['Evaluated carefully', 'Ignored', 'Overstated', 'Speculative only'], correct: 0, explanation: 'It should be evaluated carefully.' }
      ]
    },
    {
      id: '06',
      title: 'Apocrypha and Deuterocanon',
      icon: '📘',
      duration: '20 min',
      content: [
        {
          heading: 'Definitions',
          text: '“Apocrypha” and “Deuterocanon” refer to books included in some traditions but not others.'
        },
        {
          heading: 'Historical Awareness',
          text: 'Understanding these categories requires awareness of textual history and community reception.'
        }
      ],
      keyTerms: [
        { term: 'Apocrypha', definition: 'Books outside the Hebrew canon in some traditions' },
        { term: 'Deuterocanon', definition: 'Books received in some traditions as canonical' },
        { term: 'Reception', definition: 'Community acceptance of texts' }
      ],
      quiz: [
        { question: 'Apocrypha refers to:', options: ['Books outside the Hebrew canon in some traditions', 'Only the Torah', 'Only the Gospels', 'Only prophets'], correct: 0, explanation: 'Apocrypha are outside the Hebrew canon in some traditions.' },
        { question: 'Deuterocanon refers to:', options: ['Books received in some traditions', 'Only modern books', 'Only NT letters', 'Only Psalms'], correct: 0, explanation: 'Deuterocanon are received in some traditions.' },
        { question: 'These categories require:', options: ['Historical awareness', 'Only doctrine', 'Only grammar', 'Only speculation'], correct: 0, explanation: 'They require historical awareness.' },
        { question: 'Reception means:', options: ['Community acceptance', 'Only copying', 'Only translation', 'Only editing'], correct: 0, explanation: 'Reception means community acceptance.' },
        { question: 'These books vary by:', options: ['Tradition', 'Only language', 'Only genre', 'Only size'], correct: 0, explanation: 'They vary by tradition.' }
      ]
    },
    {
      id: '07',
      title: 'Synthesis',
      icon: '📚',
      duration: '20 min',
      content: [
        {
          heading: 'Summary',
          text: 'Canon formation is best understood as a historical process of recognition and reception, supported by textual evidence.'
        },
        {
          heading: 'Balanced Approach',
          text: 'A balanced approach avoids overstating certainty where evidence is limited.'
        }
      ],
      keyTerms: [
        { term: 'Recognition', definition: 'Community reception of authoritative texts' },
        { term: 'Process', definition: 'Gradual historical development' },
        { term: 'Balance', definition: 'Avoiding overstatement' }
      ],
      quiz: [
        { question: 'Canon formation is:', options: ['A historical process', 'Instant and uniform', 'Only modern', 'Only speculative'], correct: 0, explanation: 'It is a historical process.' },
        { question: 'Recognition refers to:', options: ['Community reception', 'Only authorship', 'Only translation', 'Only editing'], correct: 0, explanation: 'It refers to community reception.' },
        { question: 'Balanced approach means:', options: ['Avoiding overstatement', 'Ignoring evidence', 'Forcing conclusions', 'Only tradition'], correct: 0, explanation: 'It avoids overstatement.' },
        { question: 'Evidence includes:', options: ['Lists and usage', 'Only feelings', 'Only modern claims', 'Only doctrine'], correct: 0, explanation: 'Evidence includes lists and usage.' },
        { question: 'Context helps interpret:', options: ['Canonical evidence', 'Only grammar', 'Only translation', 'Only poetry'], correct: 0, explanation: 'Context helps interpret evidence.' }
      ]
    }
  ],
  finalExam: [
    { question: 'Canon refers to:', options: ['Recognized collection of Scripture', 'Translation style', 'Poetic form', 'Historical event'], correct: 0, explanation: 'Canon is the recognized collection of Scripture.' },
    { question: 'The Hebrew Bible is organized as:', options: ['Torah, Prophets, Writings', 'Law, Gospels, Epistles', 'Poetry, Prophets, Gospels', 'Narrative, Letters, Apocalyptic'], correct: 0, explanation: 'It is Torah, Prophets, Writings.' },
    { question: 'Second Temple Judaism shows:', options: ['Textual diversity', 'Uniform manuscripts only', 'No Scripture use', 'Only oral tradition'], correct: 0, explanation: 'It shows textual diversity.' },
    { question: 'NT recognition involved:', options: ['Usage and reception', 'Only politics', 'Only archaeology', 'Only later councils'], correct: 0, explanation: 'Usage and reception were key.' },
    { question: 'Canonical lists provide:', options: ['Evidence of recognition', 'Only doctrine', 'Only grammar', 'Only translation'], correct: 0, explanation: 'They provide evidence.' },
    { question: 'Apocrypha refers to:', options: ['Books outside the Hebrew canon in some traditions', 'Only the Torah', 'Only the Gospels', 'Only prophets'], correct: 0, explanation: 'Apocrypha are outside the Hebrew canon in some traditions.' },
    { question: 'Deuterocanon refers to:', options: ['Books received in some traditions', 'Only modern books', 'Only NT letters', 'Only Psalms'], correct: 0, explanation: 'It refers to books received in some traditions.' },
    { question: 'Recognition refers to:', options: ['Community reception', 'Only authorship', 'Only translation', 'Only editing'], correct: 0, explanation: 'It refers to community reception.' },
    { question: 'A balanced approach avoids:', options: ['Overstatement', 'Evidence', 'Context', 'Logic'], correct: 0, explanation: 'It avoids overstatement.' },
    { question: 'Canon formation is:', options: ['A historical process', 'Instant and uniform', 'Only modern', 'Only speculative'], correct: 0, explanation: 'It is a historical process.' }
  ],
  about: {
    level: 'Associate-Level Course',
    description: 'A historical and text-driven study of how biblical books were recognized as Scripture, avoiding denominational bias.',
    credits: '3 credits',
    prerequisites: 'Old Testament and New Testament Survey recommended'
  }
};

export default biblicalCanonCourse;
