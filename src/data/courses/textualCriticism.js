const textualCriticismCourse = {
  id: 'textualCriticism',
  title: 'Textual Criticism',
  subtitle: 'Associate-Level Course | 6 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Purpose and Scope',
      icon: '🔬',
      duration: '25 min',
      content: [
        {
          heading: 'What Textual Criticism Is',
          text: 'Textual criticism evaluates manuscript evidence to reconstruct the earliest attainable text.'
        },
        {
          heading: 'Why It Matters',
          text: 'Understanding variants helps readers interpret texts responsibly and handle translation notes with clarity.'
        }
      ],
      keyTerms: [
        { term: 'Textual Criticism', definition: 'Study of manuscript evidence to assess readings' },
        { term: 'Variant', definition: 'Difference among manuscripts' },
        { term: 'Reconstruction', definition: 'Evaluating readings to approximate earliest text' }
      ],
      quiz: [
        { question: 'Textual criticism focuses on:', options: ['Manuscript evidence', 'Only translation', 'Only interpretation', 'Only preaching'], correct: 0, explanation: 'It focuses on manuscript evidence.' },
        { question: 'A variant is:', options: ['A manuscript difference', 'A translation error', 'A punctuation mark', 'A loanword'], correct: 0, explanation: 'Variants are manuscript differences.' },
        { question: 'Reconstruction aims to:', options: ['Approximate earliest text', 'Create new text', 'Ignore evidence', 'Avoid variants'], correct: 0, explanation: 'It aims to approximate the earliest text.' },
        { question: 'Textual criticism helps with:', options: ['Responsible interpretation', 'Only grammar', 'Only doctrine', 'Only tradition'], correct: 0, explanation: 'It helps responsible interpretation.' },
        { question: 'The scope includes:', options: ['Comparing manuscripts', 'Only translations', 'Only archaeology', 'Only sermons'], correct: 0, explanation: 'It includes comparing manuscripts.' }
      ]
    },
    {
      id: '02',
      title: 'Types of Variants',
      icon: '🧩',
      duration: '20 min',
      content: [
        {
          heading: 'Common Types',
          text: 'Variants include spelling differences, word order changes, omissions, and additions.'
        },
        {
          heading: 'Significance',
          text: 'Most variants are minor, though some involve longer readings or notable differences.'
        }
      ],
      keyTerms: [
        { term: 'Omission', definition: 'Missing word or phrase' },
        { term: 'Addition', definition: 'Extra word or phrase' },
        { term: 'Word Order', definition: 'Arrangement of words in a sentence' }
      ],
      quiz: [
        { question: 'Common variants include:', options: ['Spelling and word order', 'Only doctrine', 'Only genre', 'Only history'], correct: 0, explanation: 'Spelling and word order are common.' },
        { question: 'Omission means:', options: ['Missing material', 'Only added material', 'Only spelling', 'Only punctuation'], correct: 0, explanation: 'Omission is missing material.' },
        { question: 'Addition means:', options: ['Extra material', 'Only missing material', 'Only spelling', 'Only punctuation'], correct: 0, explanation: 'Addition is extra material.' },
        { question: 'Most variants are:', options: ['Minor', 'Major and disruptive', 'Unknown', 'Only doctrinal'], correct: 0, explanation: 'Most variants are minor.' },
        { question: 'Word order changes are:', options: ['A type of variant', 'Not a variant', 'Only modern editing', 'Only translation'], correct: 0, explanation: 'Word order changes are variants.' }
      ]
    },
    {
      id: '03',
      title: 'Internal and External Evidence',
      icon: '⚖️',
      duration: '25 min',
      content: [
        {
          heading: 'External Evidence',
          text: 'External evidence considers manuscript age, distribution, and text type.'
        },
        {
          heading: 'Internal Evidence',
          text: 'Internal evidence evaluates which reading best explains the origin of others, considering author style and context.'
        }
      ],
      keyTerms: [
        { term: 'External Evidence', definition: 'Manuscript-based factors' },
        { term: 'Internal Evidence', definition: 'Reading-based factors and context' },
        { term: 'Text Type', definition: 'Family of shared readings' }
      ],
      quiz: [
        { question: 'External evidence considers:', options: ['Manuscript age and distribution', 'Only translation', 'Only doctrine', 'Only grammar'], correct: 0, explanation: 'It considers manuscript age and distribution.' },
        { question: 'Internal evidence considers:', options: ['Author style and context', 'Only manuscript age', 'Only geography', 'Only tradition'], correct: 0, explanation: 'It considers author style and context.' },
        { question: 'Text types refer to:', options: ['Families of shared readings', 'Only translations', 'Only doctrine', 'Only grammar'], correct: 0, explanation: 'Text types are families of shared readings.' },
        { question: 'External evidence is:', options: ['Manuscript-based', 'Only interpretive', 'Only theological', 'Only speculative'], correct: 0, explanation: 'It is manuscript-based.' },
        { question: 'Internal evidence helps determine:', options: ['Best explanation of variants', 'Only spelling', 'Only punctuation', 'Only translation'], correct: 0, explanation: 'It helps determine the best explanation.' }
      ]
    },
    {
      id: '04',
      title: 'Critical Editions and Apparatus',
      icon: '🧾',
      duration: '20 min',
      content: [
        {
          heading: 'Critical Editions',
          text: 'Critical editions present a main text with a critical apparatus showing significant variants.'
        },
        {
          heading: 'Using the Apparatus',
          text: 'The apparatus uses symbols and abbreviations to report manuscript evidence.'
        }
      ],
      keyTerms: [
        { term: 'Critical Edition', definition: 'Scholarly text with apparatus' },
        { term: 'Apparatus', definition: 'Notes reporting textual variants' },
        { term: 'Sigla', definition: 'Symbols for manuscripts and versions' }
      ],
      quiz: [
        { question: 'A critical edition includes:', options: ['Main text and apparatus', 'Only commentary', 'Only translation', 'Only grammar'], correct: 0, explanation: 'It includes main text and apparatus.' },
        { question: 'The apparatus reports:', options: ['Textual variants', 'Only footnotes', 'Only translation notes', 'Only sermons'], correct: 0, explanation: 'It reports variants.' },
        { question: 'Sigla are:', options: ['Symbols for manuscripts', 'Only punctuation', 'Only grammar', 'Only translation'], correct: 0, explanation: 'Sigla are symbols for manuscripts.' },
        { question: 'Critical editions are:', options: ['Scholarly tools', 'Only devotional texts', 'Only modern paraphrases', 'Only sermons'], correct: 0, explanation: 'They are scholarly tools.' },
        { question: 'Using the apparatus helps:', options: ['Evaluate readings', 'Ignore evidence', 'Avoid context', 'Replace texts'], correct: 0, explanation: 'It helps evaluate readings.' }
      ]
    },
    {
      id: '05',
      title: 'Case Studies',
      icon: '🧪',
      duration: '20 min',
      content: [
        {
          heading: 'Examining Examples',
          text: 'Case studies show how internal and external evidence are weighed in specific passages.'
        },
        {
          heading: 'Balanced Conclusions',
          text: 'Conclusions should be proportional to evidence and avoid overstated claims.'
        }
      ],
      keyTerms: [
        { term: 'Case Study', definition: 'Focused analysis of a specific passage' },
        { term: 'Weighting', definition: 'Evaluating evidence strength' },
        { term: 'Proportionality', definition: 'Conclusions proportional to evidence' }
      ],
      quiz: [
        { question: 'Case studies help:', options: ['Apply evidence methods', 'Avoid evidence', 'Only translate', 'Only preach'], correct: 0, explanation: 'They help apply evidence methods.' },
        { question: 'Weighting evidence means:', options: ['Evaluating evidence strength', 'Ignoring evidence', 'Only counting manuscripts', 'Only choosing longest reading'], correct: 0, explanation: 'It evaluates evidence strength.' },
        { question: 'Balanced conclusions are:', options: ['Proportional to evidence', 'Overstated', 'Speculative only', 'Context-free'], correct: 0, explanation: 'They are proportional to evidence.' },
        { question: 'Case studies focus on:', options: ['Specific passages', 'Only general theory', 'Only history', 'Only doctrine'], correct: 0, explanation: 'They focus on specific passages.' },
        { question: 'Evidence should be:', options: ['Weighed carefully', 'Ignored', 'Overstated', 'Assumed'], correct: 0, explanation: 'It should be weighed carefully.' }
      ]
    },
    {
      id: '06',
      title: 'Synthesis',
      icon: '📚',
      duration: '20 min',
      content: [
        {
          heading: 'Summary',
          text: 'Textual criticism applies evidence-based methods to evaluate variants and approximate the earliest text.'
        },
        {
          heading: 'Balanced View',
          text: 'A balanced approach recognizes both the existence of variants and the overall stability of the text.'
        }
      ],
      keyTerms: [
        { term: 'Stability', definition: 'Overall consistency of the text' },
        { term: 'Variation', definition: 'Differences among manuscripts' },
        { term: 'Method', definition: 'Evidence-based evaluation' }
      ],
      quiz: [
        { question: 'Textual criticism is:', options: ['Evidence-based evaluation', 'Only tradition', 'Only doctrine', 'Only speculation'], correct: 0, explanation: 'It is evidence-based evaluation.' },
        { question: 'A balanced approach recognizes:', options: ['Variation and stability', 'Only variation', 'Only stability', 'Neither'], correct: 0, explanation: 'It recognizes variation and stability.' },
        { question: 'Method refers to:', options: ['Evidence-based evaluation', 'Only opinion', 'Only tradition', 'Only speculation'], correct: 0, explanation: 'Method is evidence-based evaluation.' },
        { question: 'Stability means:', options: ['Overall consistency', 'No differences at all', 'Only modern agreement', 'Only doctrine'], correct: 0, explanation: 'Stability is overall consistency.' },
        { question: 'Variation refers to:', options: ['Differences among manuscripts', 'Only punctuation', 'Only pronunciation', 'Only grammar'], correct: 0, explanation: 'Variation is differences among manuscripts.' }
      ]
    }
  ],
  finalExam: [
    { question: 'Textual criticism focuses on:', options: ['Manuscript evidence', 'Only translation', 'Only interpretation', 'Only preaching'], correct: 0, explanation: 'It focuses on manuscript evidence.' },
    { question: 'A variant is:', options: ['A manuscript difference', 'A translation error', 'A punctuation mark', 'A loanword'], correct: 0, explanation: 'Variants are manuscript differences.' },
    { question: 'External evidence considers:', options: ['Manuscript age and distribution', 'Only doctrine', 'Only grammar', 'Only tradition'], correct: 0, explanation: 'It considers manuscript age and distribution.' },
    { question: 'Internal evidence considers:', options: ['Author style and context', 'Only manuscript age', 'Only geography', 'Only tradition'], correct: 0, explanation: 'It considers author style and context.' },
    { question: 'Critical editions include:', options: ['Main text and apparatus', 'Only commentary', 'Only translation', 'Only grammar'], correct: 0, explanation: 'They include main text and apparatus.' },
    { question: 'Apparatus reports:', options: ['Textual variants', 'Only footnotes', 'Only translation notes', 'Only sermons'], correct: 0, explanation: 'It reports variants.' },
    { question: 'Case studies help:', options: ['Apply evidence methods', 'Avoid evidence', 'Only translate', 'Only preach'], correct: 0, explanation: 'They help apply evidence methods.' },
    { question: 'Balanced conclusions are:', options: ['Proportional to evidence', 'Overstated', 'Speculative only', 'Context-free'], correct: 0, explanation: 'They are proportional to evidence.' },
    { question: 'Text types are:', options: ['Families of shared readings', 'Only translations', 'Only doctrines', 'Only genres'], correct: 0, explanation: 'They are families of shared readings.' },
    { question: 'A balanced view recognizes:', options: ['Variation and stability', 'Only variation', 'Only stability', 'Neither'], correct: 0, explanation: 'It recognizes variation and stability.' }
  ],
  about: {
    level: 'Associate-Level Course',
    description: 'A text-driven course on evaluating manuscript evidence and understanding textual variants without denominational bias.',
    credits: '3 credits',
    prerequisites: 'Textual Transmission recommended'
  }
};

export default textualCriticismCourse;
