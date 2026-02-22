const capstoneCourse = {
  id: 'capstone',
  title: 'Capstone Seminar',
  subtitle: 'Associate-Level Course | 5 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Research Question and Scope',
      icon: '🧭',
      duration: '25 min',
      content: [
        {
          heading: 'Defining a Question',
          text: 'A strong capstone begins with a clear, focused research question that is answerable using biblical texts and historical evidence.'
        },
        {
          heading: 'Scope Control',
          text: 'Narrowing scope prevents superficial analysis. Identify specific texts, time frames, and themes.'
        }
      ],
      keyTerms: [
        { term: 'Research Question', definition: 'Focused question guiding a project' },
        { term: 'Scope', definition: 'Boundaries of the study' },
        { term: 'Theme', definition: 'Central idea traced in texts' }
      ],
      quiz: [
        { question: 'A strong research question is:', options: ['Focused and answerable', 'Vague and broad', 'Only devotional', 'Only speculative'], correct: 0, explanation: 'It should be focused and answerable.' },
        { question: 'Scope control prevents:', options: ['Superficial analysis', 'Evidence use', 'Context', 'Clarity'], correct: 0, explanation: 'It prevents superficial analysis.' },
        { question: 'A theme is:', options: ['A central idea', 'A random detail', 'Only a quote', 'Only a footnote'], correct: 0, explanation: 'A theme is a central idea.' },
        { question: 'Capstone work should use:', options: ['Textual and historical evidence', 'Only opinion', 'Only tradition', 'Only speculation'], correct: 0, explanation: 'It should use evidence.' },
        { question: 'Narrowing scope helps:', options: ['Depth and clarity', 'Confusion', 'Avoiding texts', 'Avoiding evidence'], correct: 0, explanation: 'It helps depth and clarity.' }
      ]
    },
    {
      id: '02',
      title: 'Method and Sources',
      icon: '📚',
      duration: '25 min',
      content: [
        {
          heading: 'Primary Sources',
          text: 'Primary sources include biblical texts and ancient historical documents relevant to the topic.'
        },
        {
          heading: 'Secondary Sources',
          text: 'Secondary sources provide scholarly analysis. Use them to support, not replace, primary evidence.'
        }
      ],
      keyTerms: [
        { term: 'Primary Source', definition: 'Original text or document' },
        { term: 'Secondary Source', definition: 'Scholarly analysis of primary sources' },
        { term: 'Method', definition: 'Approach for gathering and analyzing data' }
      ],
      quiz: [
        { question: 'Primary sources include:', options: ['Biblical texts and ancient documents', 'Only modern summaries', 'Only sermons', 'Only opinions'], correct: 0, explanation: 'Primary sources are original texts.' },
        { question: 'Secondary sources are used to:', options: ['Support analysis', 'Replace primary sources', 'Avoid texts', 'Only speculate'], correct: 0, explanation: 'They support analysis.' },
        { question: 'Method refers to:', options: ['Approach to analysis', 'Only results', 'Only opinions', 'Only tradition'], correct: 0, explanation: 'Method is the approach.' },
        { question: 'A capstone should prioritize:', options: ['Primary evidence', 'Only secondary claims', 'Only anecdotes', 'Only opinions'], correct: 0, explanation: 'It should prioritize primary evidence.' },
        { question: 'Scholarly sources should be:', options: ['Evaluated critically', 'Accepted uncritically', 'Ignored', 'Only quoted'], correct: 0, explanation: 'They should be evaluated critically.' }
      ]
    },
    {
      id: '03',
      title: 'Analysis and Argument',
      icon: '🧠',
      duration: '25 min',
      content: [
        {
          heading: 'Building an Argument',
          text: 'An argument links evidence to a conclusion through clear reasoning. Each claim should be supported by data.'
        },
        {
          heading: 'Structure',
          text: 'Use logical structure: thesis, supporting points, and conclusion.'
        }
      ],
      keyTerms: [
        { term: 'Thesis', definition: 'Central claim of the project' },
        { term: 'Evidence', definition: 'Support for a claim' },
        { term: 'Conclusion', definition: 'Reasoned outcome of analysis' }
      ],
      quiz: [
        { question: 'A thesis is:', options: ['Central claim', 'Only a quote', 'Only a question', 'Only a footnote'], correct: 0, explanation: 'A thesis is the central claim.' },
        { question: 'Evidence should:', options: ['Support claims', 'Replace reasoning', 'Be ignored', 'Be speculative'], correct: 0, explanation: 'Evidence supports claims.' },
        { question: 'A strong argument links:', options: ['Evidence and conclusion', 'Only emotion', 'Only tradition', 'Only opinions'], correct: 0, explanation: 'It links evidence and conclusion.' },
        { question: 'Structure includes:', options: ['Thesis, points, conclusion', 'Only introduction', 'Only bibliography', 'Only summary'], correct: 0, explanation: 'Structure includes thesis, points, conclusion.' },
        { question: 'Reasoning should be:', options: ['Clear and logical', 'Random', 'Only rhetorical', 'Only speculative'], correct: 0, explanation: 'Reasoning should be clear and logical.' }
      ]
    },
    {
      id: '04',
      title: 'Writing and Citation',
      icon: '✍️',
      duration: '20 min',
      content: [
        {
          heading: 'Academic Writing',
          text: 'Write clearly with defined terms and logical flow. Avoid unsupported claims.'
        },
        {
          heading: 'Citations',
          text: 'Citations document sources and allow readers to verify claims.'
        }
      ],
      keyTerms: [
        { term: 'Citation', definition: 'Reference to a source' },
        { term: 'Clarity', definition: 'Clear, precise writing' },
        { term: 'Verification', definition: 'Ability to check claims' }
      ],
      quiz: [
        { question: 'Citations are used to:', options: ['Document sources', 'Avoid evidence', 'Replace analysis', 'Only decorate'], correct: 0, explanation: 'Citations document sources.' },
        { question: 'Clear writing should be:', options: ['Logical and precise', 'Vague', 'Only poetic', 'Only rhetorical'], correct: 0, explanation: 'It should be logical and precise.' },
        { question: 'Unsupported claims should be:', options: ['Avoided', 'Emphasized', 'Ignored', 'Celebrated'], correct: 0, explanation: 'They should be avoided.' },
        { question: 'Verification means:', options: ['Checking claims', 'Only trusting opinions', 'Only tradition', 'Only authority'], correct: 0, explanation: 'Verification is checking claims.' },
        { question: 'Academic writing includes:', options: ['Defined terms', 'Only anecdotes', 'Only emotion', 'Only speculation'], correct: 0, explanation: 'It includes defined terms.' }
      ]
    },
    {
      id: '05',
      title: 'Presentation and Defense',
      icon: '🎓',
      duration: '20 min',
      content: [
        {
          heading: 'Presentation',
          text: 'Summarize key findings clearly and concisely, highlighting evidence and conclusions.'
        },
        {
          heading: 'Defense',
          text: 'Be prepared to explain reasoning, respond to questions, and revise where needed.'
        }
      ],
      keyTerms: [
        { term: 'Presentation', definition: 'Clear summary of findings' },
        { term: 'Defense', definition: 'Explaining and supporting conclusions' },
        { term: 'Revision', definition: 'Improving work based on feedback' }
      ],
      quiz: [
        { question: 'Presentation should:', options: ['Summarize findings clearly', 'Only restate sources', 'Avoid evidence', 'Avoid conclusions'], correct: 0, explanation: 'It should summarize findings clearly.' },
        { question: 'Defense involves:', options: ['Explaining reasoning', 'Ignoring questions', 'Only quoting', 'Only tradition'], correct: 0, explanation: 'Defense involves explaining reasoning.' },
        { question: 'Revision is:', options: ['Improving work', 'Only rewriting the title', 'Ignoring feedback', 'Avoiding change'], correct: 0, explanation: 'Revision improves work.' },
        { question: 'A defense should be:', options: ['Evidence-based', 'Only emotional', 'Only speculative', 'Only traditional'], correct: 0, explanation: 'It should be evidence-based.' },
        { question: 'Conclusions should be:', options: ['Supported by evidence', 'Random', 'Only opinion', 'Only tradition'], correct: 0, explanation: 'Conclusions should be supported by evidence.' }
      ]
    }
  ],
  finalExam: [
    { question: 'A research question should be:', options: ['Focused and answerable', 'Vague and broad', 'Only devotional', 'Only speculative'], correct: 0, explanation: 'It should be focused and answerable.' },
    { question: 'Primary sources include:', options: ['Original texts', 'Only summaries', 'Only sermons', 'Only opinions'], correct: 0, explanation: 'Primary sources are original texts.' },
    { question: 'A thesis is:', options: ['Central claim', 'Only a quote', 'Only a question', 'Only a footnote'], correct: 0, explanation: 'It is the central claim.' },
    { question: 'Evidence should:', options: ['Support claims', 'Replace reasoning', 'Be ignored', 'Be speculative'], correct: 0, explanation: 'Evidence supports claims.' },
    { question: 'Citations are used to:', options: ['Document sources', 'Avoid evidence', 'Replace analysis', 'Only decorate'], correct: 0, explanation: 'Citations document sources.' },
    { question: 'Presentation should:', options: ['Summarize findings clearly', 'Only restate sources', 'Avoid evidence', 'Avoid conclusions'], correct: 0, explanation: 'It should summarize findings clearly.' },
    { question: 'Defense involves:', options: ['Explaining reasoning', 'Ignoring questions', 'Only quoting', 'Only tradition'], correct: 0, explanation: 'Defense involves explaining reasoning.' },
    { question: 'Revision is:', options: ['Improving work', 'Only rewriting the title', 'Ignoring feedback', 'Avoiding change'], correct: 0, explanation: 'Revision improves work.' },
    { question: 'Scope control prevents:', options: ['Superficial analysis', 'Evidence use', 'Context', 'Clarity'], correct: 0, explanation: 'It prevents superficial analysis.' },
    { question: 'Method refers to:', options: ['Approach to analysis', 'Only results', 'Only opinions', 'Only tradition'], correct: 0, explanation: 'Method is the approach.' }
  ],
  about: {
    level: 'Associate-Level Course',
    description: 'A capstone seminar guiding students through a text-driven research project with evidence-based argumentation and clear presentation.',
    credits: '3 credits',
    prerequisites: 'Completion of core associate courses'
  }
};

export default capstoneCourse;
