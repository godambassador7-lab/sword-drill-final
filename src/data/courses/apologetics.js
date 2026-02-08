const apologeticsCourse = {
  id: 'apologetics',
  title: 'Apologetics',
  subtitle: 'Associate-Level Course | 8 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'What Is Apologetics?',
      icon: '🛡️',
      duration: '25 min',
      content: [
        {
          heading: 'Definition',
          text: 'Apologetics is the reasoned defense of a belief system. In biblical studies, it involves explaining and defending the faith using evidence, logic, and careful interpretation.'
        },
        {
          heading: 'Text-Driven Approach',
          text: 'This course emphasizes arguments grounded in Scripture, historical context, and public evidence rather than denominational polemics.'
        }
      ],
      keyTerms: [
        { term: 'Apologetics', definition: 'Reasoned defense of belief' },
        { term: 'Evidence', definition: 'Data supporting a claim' },
        { term: 'Context', definition: 'Historical and literary setting' }
      ],
      quiz: [
        { question: 'Apologetics is:', options: ['A reasoned defense of belief', 'Only emotional persuasion', 'Only tradition', 'Only polemics'], correct: 0, explanation: 'Apologetics is a reasoned defense.' },
        { question: 'A text-driven approach emphasizes:', options: ['Scripture and context', 'Only opinion', 'Only tradition', 'Only speculation'], correct: 0, explanation: 'It emphasizes Scripture and context.' },
        { question: 'Evidence refers to:', options: ['Supportive data', 'Only feelings', 'Only rumors', 'Only metaphors'], correct: 0, explanation: 'Evidence is supportive data.' },
        { question: 'Apologetics should avoid:', options: ['Denominational bias', 'Context', 'Logic', 'Evidence'], correct: 0, explanation: 'It should avoid denominational bias.' },
        { question: 'Context helps by:', options: ['Clarifying meaning', 'Eliminating meaning', 'Replacing Scripture', 'Avoiding evidence'], correct: 0, explanation: 'Context clarifies meaning.' }
      ]
    },
    {
      id: '02',
      title: 'Historical Foundations',
      icon: '🏛️',
      duration: '25 min',
      content: [
        {
          heading: 'History and Faith',
          text: 'Many biblical claims are historical in nature. Apologetics evaluates historical sources, genres, and context.'
        },
        {
          heading: 'Sources and Corroboration',
          text: 'Corroboration may include ancient writings, archaeology, and internal consistency within the biblical corpus.'
        }
      ],
      keyTerms: [
        { term: 'Corroboration', definition: 'Independent support for a claim' },
        { term: 'Genre', definition: 'Literary form affecting interpretation' },
        { term: 'Historical Claim', definition: 'Statement about past events' }
      ],
      quiz: [
        { question: 'Historical apologetics evaluates:', options: ['Sources and context', 'Only opinions', 'Only philosophy', 'Only tradition'], correct: 0, explanation: 'It evaluates sources and context.' },
        { question: 'Corroboration means:', options: ['Independent support', 'Contradiction', 'Speculation', 'Silence'], correct: 0, explanation: 'Corroboration is independent support.' },
        { question: 'Genre affects:', options: ['Interpretation', 'Only spelling', 'Only pronunciation', 'Only vocabulary'], correct: 0, explanation: 'Genre affects interpretation.' },
        { question: 'Archaeology can:', options: ['Provide context', 'Prove everything', 'Replace texts', 'Ignore history'], correct: 0, explanation: 'It provides context.' },
        { question: 'Historical claims are:', options: ['Statements about past events', 'Only moral principles', 'Only poetry', 'Only prophecy'], correct: 0, explanation: 'They are about past events.' }
      ]
    },
    {
      id: '03',
      title: 'Textual Reliability',
      icon: '📜',
      duration: '25 min',
      content: [
        {
          heading: 'Manuscript Evidence',
          text: 'The biblical texts were transmitted by manuscripts. Apologetics considers manuscript quantity, age, and textual variants.'
        },
        {
          heading: 'Variants and Meaning',
          text: 'Most textual variants are minor. Responsible discussion avoids overstatement and focuses on what is supported by evidence.'
        }
      ],
      keyTerms: [
        { term: 'Manuscript', definition: 'Handwritten copy of a text' },
        { term: 'Variant', definition: 'Difference among manuscripts' },
        { term: 'Transmission', definition: 'Process of copying texts' }
      ],
      quiz: [
        { question: 'Textual reliability considers:', options: ['Manuscripts and variants', 'Only tradition', 'Only doctrine', 'Only opinion'], correct: 0, explanation: 'It considers manuscripts and variants.' },
        { question: 'A variant is:', options: ['A manuscript difference', 'A translation error only', 'A punctuation mark', 'A loanword'], correct: 0, explanation: 'Variants are manuscript differences.' },
        { question: 'Most variants are:', options: ['Minor', 'Major and disruptive', 'Unknown', 'Only doctrinal'], correct: 0, explanation: 'Most are minor.' },
        { question: 'Transmission refers to:', options: ['Copying texts', 'Only translation', 'Only interpretation', 'Only preaching'], correct: 0, explanation: 'Transmission is copying texts.' },
        { question: 'Responsible discussion should:', options: ['Avoid overstatement', 'Ignore evidence', 'Dismiss variants', 'Speculate'], correct: 0, explanation: 'It should avoid overstatement.' }
      ]
    },
    {
      id: '04',
      title: 'Resurrection as a Historical Claim',
      icon: '🌅',
      duration: '25 min',
      content: [
        {
          heading: 'Claim and Sources',
          text: 'The resurrection is presented as a historical claim in the New Testament, with narratives and letters referencing witnesses.'
        },
        {
          heading: 'Historical Evaluation',
          text: 'Apologetics examines the nature of the claims, the sources, and the historical context without substituting speculation for evidence.'
        }
      ],
      keyTerms: [
        { term: 'Witness', definition: 'Reported observer of an event' },
        { term: 'Claim', definition: 'Statement to be evaluated' },
        { term: 'Source', definition: 'Textual or material evidence' }
      ],
      quiz: [
        { question: 'The resurrection is presented as:', options: ['A historical claim', 'Only metaphor', 'Only poetry', 'Only legend'], correct: 0, explanation: 'It is presented as a historical claim.' },
        { question: 'Historical evaluation focuses on:', options: ['Claims and sources', 'Only feelings', 'Only speculation', 'Only tradition'], correct: 0, explanation: 'It focuses on claims and sources.' },
        { question: 'Witness refers to:', options: ['Reported observer', 'Only translator', 'Only editor', 'Only critic'], correct: 0, explanation: 'Witness is a reported observer.' },
        { question: 'Sources include:', options: ['Narratives and letters', 'Only archaeology', 'Only oral tradition', 'Only later writings'], correct: 0, explanation: 'Sources include narratives and letters.' },
        { question: 'Responsible evaluation avoids:', options: ['Speculation without evidence', 'Context', 'Logic', 'Textual evidence'], correct: 0, explanation: 'It avoids unsupported speculation.' }
      ]
    },
    {
      id: '05',
      title: 'Worldview and Coherence',
      icon: '🧭',
      duration: '25 min',
      content: [
        {
          heading: 'Coherence',
          text: 'Apologetics examines whether a worldview coherently explains reality, human experience, and moral intuition.'
        },
        {
          heading: 'Consistency',
          text: 'Internal consistency is assessed by comparing claims with one another and with evidence.'
        }
      ],
      keyTerms: [
        { term: 'Worldview', definition: 'Comprehensive framework of beliefs' },
        { term: 'Coherence', definition: 'Consistency and explanatory power' },
        { term: 'Consistency', definition: 'Non-contradiction among claims' }
      ],
      quiz: [
        { question: 'Worldview refers to:', options: ['A framework of beliefs', 'Only a tradition', 'Only a ritual', 'Only a denomination'], correct: 0, explanation: 'Worldview is a framework of beliefs.' },
        { question: 'Coherence means:', options: ['Consistency and explanatory power', 'Only emotion', 'Only authority', 'Only custom'], correct: 0, explanation: 'Coherence is consistency and explanatory power.' },
        { question: 'Consistency checks for:', options: ['Non-contradiction', 'Only grammar', 'Only spelling', 'Only vocabulary'], correct: 0, explanation: 'Consistency checks for non-contradiction.' },
        { question: 'A coherent worldview should:', options: ['Explain reality and experience', 'Avoid evidence', 'Reject logic', 'Ignore context'], correct: 0, explanation: 'It should explain reality and experience.' },
        { question: 'Apologetics uses:', options: ['Logic and evidence', 'Only emotions', 'Only authority', 'Only tradition'], correct: 0, explanation: 'It uses logic and evidence.' }
      ]
    },
    {
      id: '06',
      title: 'Common Objections and Responses',
      icon: '🧩',
      duration: '25 min',
      content: [
        {
          heading: 'Clarifying Objections',
          text: 'Effective responses begin with clear understanding of the objection and its assumptions.'
        },
        {
          heading: 'Evidence and Context',
          text: 'Responses should use textual and historical evidence and avoid strawman arguments.'
        }
      ],
      keyTerms: [
        { term: 'Objection', definition: 'Challenge to a claim' },
        { term: 'Assumption', definition: 'Unstated premise' },
        { term: 'Strawman', definition: 'Misrepresenting an argument' }
      ],
      quiz: [
        { question: 'Effective responses begin with:', options: ['Understanding the objection', 'Ignoring the objection', 'Only counterattacking', 'Only quoting'], correct: 0, explanation: 'They begin with understanding.' },
        { question: 'Assumptions are:', options: ['Unstated premises', 'Only conclusions', 'Only evidence', 'Only traditions'], correct: 0, explanation: 'Assumptions are unstated premises.' },
        { question: 'A strawman is:', options: ['A misrepresentation', 'A strong argument', 'A historical source', 'A textual variant'], correct: 0, explanation: 'A strawman misrepresents an argument.' },
        { question: 'Responses should use:', options: ['Evidence and context', 'Only emotion', 'Only authority', 'Only tradition'], correct: 0, explanation: 'They should use evidence and context.' },
        { question: 'Apologetics should avoid:', options: ['Strawman arguments', 'Logic', 'Evidence', 'Context'], correct: 0, explanation: 'It should avoid strawman arguments.' }
      ]
    },
    {
      id: '07',
      title: 'Ethics and Public Engagement',
      icon: '🤝',
      duration: '20 min',
      content: [
        {
          heading: 'Tone and Integrity',
          text: 'Apologetics should be conducted with integrity, respect, and accurate representation of opposing views.'
        },
        {
          heading: 'Public Reasoning',
          text: 'Arguments should be accessible to public reason, using evidence and logic rather than insider language.'
        }
      ],
      keyTerms: [
        { term: 'Integrity', definition: 'Honesty and accuracy in argument' },
        { term: 'Public Reason', definition: 'Arguments accessible to a broad audience' },
        { term: 'Respect', definition: 'Fair treatment of others’ views' }
      ],
      quiz: [
        { question: 'Apologetics should be conducted with:', options: ['Integrity and respect', 'Only aggression', 'Only secrecy', 'Only authority'], correct: 0, explanation: 'It should be conducted with integrity and respect.' },
        { question: 'Public reasoning uses:', options: ['Evidence and logic', 'Only insider language', 'Only authority', 'Only tradition'], correct: 0, explanation: 'It uses evidence and logic.' },
        { question: 'Integrity requires:', options: ['Accurate representation', 'Misrepresentation', 'Ignoring evidence', 'Avoiding context'], correct: 0, explanation: 'Integrity requires accuracy.' },
        { question: 'Respect means:', options: ['Fair treatment of views', 'Only agreement', 'Only silence', 'Only debate'], correct: 0, explanation: 'Respect is fair treatment.' },
        { question: 'Arguments should be:', options: ['Accessible to broad audiences', 'Only technical', 'Only private', 'Only emotional'], correct: 0, explanation: 'They should be accessible.' }
      ]
    },
    {
      id: '08',
      title: 'Synthesis',
      icon: '📚',
      duration: '20 min',
      content: [
        {
          heading: 'Summary',
          text: 'Apologetics integrates textual evidence, historical context, and logical reasoning to present a coherent defense of faith.'
        },
        {
          heading: 'Balanced Approach',
          text: 'A balanced approach avoids overstatement and maintains humility in areas where evidence is limited.'
        }
      ],
      keyTerms: [
        { term: 'Balance', definition: 'Avoiding overstatement' },
        { term: 'Coherence', definition: 'Consistency of argument' },
        { term: 'Humility', definition: 'Acknowledging limits of knowledge' }
      ],
      quiz: [
        { question: 'A balanced approach avoids:', options: ['Overstatement', 'Evidence', 'Logic', 'Context'], correct: 0, explanation: 'It avoids overstatement.' },
        { question: 'Apologetics integrates:', options: ['Text, history, and reasoning', 'Only tradition', 'Only emotion', 'Only authority'], correct: 0, explanation: 'It integrates text, history, and reasoning.' },
        { question: 'Humility recognizes:', options: ['Limits of evidence', 'No limits', 'Only certainty', 'Only authority'], correct: 0, explanation: 'Humility recognizes limits.' },
        { question: 'Coherence means:', options: ['Consistency', 'Only quantity of data', 'Only emotions', 'Only tradition'], correct: 0, explanation: 'Coherence is consistency.' },
        { question: 'Synthesis aims for:', options: ['Coherent summary', 'Random notes', 'Only quotations', 'Only opinions'], correct: 0, explanation: 'Synthesis aims for coherence.' }
      ]
    }
  ],
  finalExam: [
    { question: 'Apologetics is:', options: ['A reasoned defense of belief', 'Only emotional persuasion', 'Only tradition', 'Only polemics'], correct: 0, explanation: 'It is a reasoned defense.' },
    { question: 'Corroboration means:', options: ['Independent support', 'Contradiction', 'Speculation', 'Silence'], correct: 0, explanation: 'It means independent support.' },
    { question: 'Textual reliability considers:', options: ['Manuscripts and variants', 'Only tradition', 'Only doctrine', 'Only opinion'], correct: 0, explanation: 'It considers manuscripts and variants.' },
    { question: 'The resurrection is presented as:', options: ['A historical claim', 'Only metaphor', 'Only poetry', 'Only legend'], correct: 0, explanation: 'It is presented as a historical claim.' },
    { question: 'Worldview coherence refers to:', options: ['Consistency and explanatory power', 'Only emotion', 'Only authority', 'Only custom'], correct: 0, explanation: 'It refers to consistency and explanatory power.' },
    { question: 'A strawman is:', options: ['A misrepresentation', 'A strong argument', 'A historical source', 'A textual variant'], correct: 0, explanation: 'It is a misrepresentation.' },
    { question: 'Public reasoning should use:', options: ['Evidence and logic', 'Only insider language', 'Only authority', 'Only tradition'], correct: 0, explanation: 'It should use evidence and logic.' },
    { question: 'Integrity in apologetics requires:', options: ['Accurate representation', 'Misrepresentation', 'Ignoring evidence', 'Avoiding context'], correct: 0, explanation: 'It requires accurate representation.' },
    { question: 'Balance in apologetics avoids:', options: ['Overstatement', 'Evidence', 'Logic', 'Context'], correct: 0, explanation: 'It avoids overstatement.' },
    { question: 'A text-driven approach emphasizes:', options: ['Scripture and context', 'Only opinion', 'Only tradition', 'Only speculation'], correct: 0, explanation: 'It emphasizes Scripture and context.' }
  ],
  about: {
    level: 'Associate-Level Course',
    description: 'A text-driven and historically grounded course in apologetics emphasizing evidence, logic, and context without denominational bias.',
    credits: '3 credits',
    prerequisites: 'Basic biblical literacy'
  }
};

export default apologeticsCourse;
