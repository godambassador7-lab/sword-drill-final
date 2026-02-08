const diplomaCapstoneCourse = {
  id: 'diplomaCapstone',
  title: 'Diploma Capstone',
  subtitle: 'Diploma-Level Course | 6 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Advanced Research Design',
      icon: '🎓',
      duration: '30 min',
      content: [
        {
          heading: 'Research Design',
          text: 'The diploma capstone requires a stronger research design, including a thesis, methods, and evaluation criteria.'
        },
        {
          heading: 'Feasibility',
          text: 'Define scope, sources, and timelines to ensure the project is achievable.'
        }
      ],
      keyTerms: [
        { term: 'Research Design', definition: 'Structured plan for the project' },
        { term: 'Feasibility', definition: 'Practical achievability of the project' },
        { term: 'Criteria', definition: 'Standards for evaluation' }
      ],
      quiz: [
        { question: 'Research design provides:', options: ['A structured plan', 'Only a summary', 'Only a bibliography', 'Only a question'], correct: 0, explanation: 'It provides a structured plan.' },
        { question: 'Feasibility means:', options: ['Project is achievable', 'Project is endless', 'Only theoretical', 'Only speculative'], correct: 0, explanation: 'It means achievable.' },
        { question: 'Criteria are:', options: ['Standards for evaluation', 'Only opinions', 'Only sources', 'Only results'], correct: 0, explanation: 'They are standards for evaluation.' },
        { question: 'A diploma capstone requires:', options: ['Stronger research design', 'No design', 'Only narrative', 'Only opinion'], correct: 0, explanation: 'It requires stronger design.' },
        { question: 'Scope control supports:', options: ['Feasibility', 'Confusion', 'Avoiding evidence', 'Avoiding context'], correct: 0, explanation: 'It supports feasibility.' }
      ]
    },
    {
      id: '02',
      title: 'Advanced Source Analysis',
      icon: '📚',
      duration: '30 min',
      content: [
        {
          heading: 'Primary and Secondary Sources',
          text: 'Advanced work requires careful evaluation of primary sources and critical engagement with secondary scholarship.'
        },
        {
          heading: 'Source Critique',
          text: 'Assess reliability, bias, and relevance, and document reasoning clearly.'
        }
      ],
      keyTerms: [
        { term: 'Source Critique', definition: 'Evaluation of reliability and relevance' },
        { term: 'Reliability', definition: 'Trustworthiness of evidence' },
        { term: 'Bias', definition: 'Perspective that can shape interpretation' }
      ],
      quiz: [
        { question: 'Advanced analysis includes:', options: ['Critical evaluation of sources', 'Only summaries', 'Only opinions', 'Only tradition'], correct: 0, explanation: 'It includes critical evaluation.' },
        { question: 'Source critique evaluates:', options: ['Reliability and relevance', 'Only length', 'Only age', 'Only popularity'], correct: 0, explanation: 'It evaluates reliability and relevance.' },
        { question: 'Bias refers to:', options: ['Perspective shaping interpretation', 'Only errors', 'Only grammar', 'Only translation'], correct: 0, explanation: 'Bias shapes interpretation.' },
        { question: 'Primary sources should be:', options: ['Carefully analyzed', 'Ignored', 'Only quoted', 'Only summarized'], correct: 0, explanation: 'They should be carefully analyzed.' },
        { question: 'Secondary sources should:', options: ['Support, not replace primary evidence', 'Replace primary evidence', 'Be ignored', 'Be accepted uncritically'], correct: 0, explanation: 'They should support, not replace.' }
      ]
    },
    {
      id: '03',
      title: 'Argumentation and Synthesis',
      icon: '🧠',
      duration: '25 min',
      content: [
        {
          heading: 'Complex Argumentation',
          text: 'Advanced projects require multi-step arguments that integrate several lines of evidence.'
        },
        {
          heading: 'Synthesis',
          text: 'Synthesis combines textual, historical, and scholarly data into a coherent whole.'
        }
      ],
      keyTerms: [
        { term: 'Argumentation', definition: 'Logical progression from evidence to conclusion' },
        { term: 'Synthesis', definition: 'Integration of evidence into a coherent whole' },
        { term: 'Coherence', definition: 'Consistency across claims' }
      ],
      quiz: [
        { question: 'Advanced argumentation requires:', options: ['Multi-step reasoning', 'Only single claims', 'Only opinions', 'Only quotations'], correct: 0, explanation: 'It requires multi-step reasoning.' },
        { question: 'Synthesis combines:', options: ['Textual, historical, and scholarly data', 'Only opinions', 'Only tradition', 'Only anecdotes'], correct: 0, explanation: 'It combines multiple data types.' },
        { question: 'Coherence means:', options: ['Consistency across claims', 'Only amount of data', 'Only emotion', 'Only tradition'], correct: 0, explanation: 'Coherence is consistency.' },
        { question: 'Arguments should be:', options: ['Evidence-based', 'Speculative', 'Only rhetorical', 'Only traditional'], correct: 0, explanation: 'They should be evidence-based.' },
        { question: 'Complex arguments benefit from:', options: ['Clear structure', 'Random order', 'No organization', 'Only summaries'], correct: 0, explanation: 'They benefit from clear structure.' }
      ]
    },
    {
      id: '04',
      title: 'Writing and Publication Standards',
      icon: '✍️',
      duration: '25 min',
      content: [
        {
          heading: 'Academic Standards',
          text: 'Diploma-level work must meet higher standards of clarity, documentation, and formatting.'
        },
        {
          heading: 'Citation Integrity',
          text: 'Accurate citation ensures transparency and allows verification.'
        }
      ],
      keyTerms: [
        { term: 'Standards', definition: 'Expected level of academic quality' },
        { term: 'Citation Integrity', definition: 'Accurate and consistent citation' },
        { term: 'Formatting', definition: 'Consistent presentation of material' }
      ],
      quiz: [
        { question: 'Diploma-level work requires:', options: ['Higher academic standards', 'Only summary notes', 'Only opinions', 'Only tradition'], correct: 0, explanation: 'It requires higher standards.' },
        { question: 'Citation integrity means:', options: ['Accurate citation', 'Only minimal references', 'Only paraphrase', 'Only quotation'], correct: 0, explanation: 'It means accurate citation.' },
        { question: 'Formatting provides:', options: ['Consistency and clarity', 'Confusion', 'Only style', 'Only aesthetics'], correct: 0, explanation: 'It provides consistency and clarity.' },
        { question: 'Academic standards include:', options: ['Clarity and documentation', 'Only opinions', 'Only rhetoric', 'Only tradition'], correct: 0, explanation: 'They include clarity and documentation.' },
        { question: 'Verification depends on:', options: ['Proper citation', 'Only authority', 'Only tradition', 'Only speculation'], correct: 0, explanation: 'It depends on proper citation.' }
      ]
    },
    {
      id: '05',
      title: 'Defense and Review',
      icon: '🧭',
      duration: '20 min',
      content: [
        {
          heading: 'Defense',
          text: 'A diploma capstone includes a formal defense where reasoning and evidence are presented and questioned.'
        },
        {
          heading: 'Review Process',
          text: 'Review involves critique, revision, and improvement based on feedback.'
        }
      ],
      keyTerms: [
        { term: 'Defense', definition: 'Formal presentation of reasoning' },
        { term: 'Review', definition: 'Critical evaluation by others' },
        { term: 'Revision', definition: 'Improving work based on feedback' }
      ],
      quiz: [
        { question: 'Defense involves:', options: ['Presenting reasoning and evidence', 'Avoiding questions', 'Only quoting', 'Only tradition'], correct: 0, explanation: 'It involves presenting reasoning and evidence.' },
        { question: 'Review includes:', options: ['Critique and revision', 'Only praise', 'Only rejection', 'Only summary'], correct: 0, explanation: 'It includes critique and revision.' },
        { question: 'Revision is:', options: ['Improving work', 'Ignoring feedback', 'Only rewriting the title', 'Only changing fonts'], correct: 0, explanation: 'Revision improves work.' },
        { question: 'Formal defense should be:', options: ['Evidence-based', 'Only emotional', 'Only speculative', 'Only traditional'], correct: 0, explanation: 'It should be evidence-based.' },
        { question: 'Review helps with:', options: ['Quality improvement', 'Avoiding evidence', 'Avoiding context', 'Avoiding clarity'], correct: 0, explanation: 'Review improves quality.' }
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
          text: 'The diploma capstone integrates advanced research design, source analysis, and argumentation into a coherent thesis.'
        },
        {
          heading: 'Balanced Judgment',
          text: 'Conclusions must be proportional to evidence and presented with humility.'
        }
      ],
      keyTerms: [
        { term: 'Integration', definition: 'Combining components into a coherent whole' },
        { term: 'Proportionality', definition: 'Conclusions match evidence strength' },
        { term: 'Humility', definition: 'Acknowledging limits of evidence' }
      ],
      quiz: [
        { question: 'Synthesis integrates:', options: ['Design, sources, and argumentation', 'Only opinions', 'Only tradition', 'Only anecdotes'], correct: 0, explanation: 'It integrates design, sources, argumentation.' },
        { question: 'Conclusions should be:', options: ['Proportional to evidence', 'Overstated', 'Speculative', 'Context-free'], correct: 0, explanation: 'They should be proportional to evidence.' },
        { question: 'Humility means:', options: ['Acknowledging limits', 'Ignoring evidence', 'Only certainty', 'Only authority'], correct: 0, explanation: 'It means acknowledging limits.' },
        { question: 'Integration means:', options: ['Combining components', 'Isolating components', 'Ignoring components', 'Avoiding structure'], correct: 0, explanation: 'It means combining components.' },
        { question: 'A balanced judgment avoids:', options: ['Overstatement', 'Evidence', 'Context', 'Logic'], correct: 0, explanation: 'It avoids overstatement.' }
      ]
    }
  ],
  finalExam: [
    { question: 'Research design provides:', options: ['A structured plan', 'Only a summary', 'Only a bibliography', 'Only a question'], correct: 0, explanation: 'It provides a structured plan.' },
    { question: 'Feasibility means:', options: ['Project is achievable', 'Project is endless', 'Only theoretical', 'Only speculative'], correct: 0, explanation: 'It means achievable.' },
    { question: 'Source critique evaluates:', options: ['Reliability and relevance', 'Only length', 'Only age', 'Only popularity'], correct: 0, explanation: 'It evaluates reliability and relevance.' },
    { question: 'Argumentation requires:', options: ['Multi-step reasoning', 'Only single claims', 'Only opinions', 'Only quotations'], correct: 0, explanation: 'It requires multi-step reasoning.' },
    { question: 'Citation integrity means:', options: ['Accurate citation', 'Only minimal references', 'Only paraphrase', 'Only quotation'], correct: 0, explanation: 'It means accurate citation.' },
    { question: 'Defense involves:', options: ['Presenting reasoning and evidence', 'Avoiding questions', 'Only quoting', 'Only tradition'], correct: 0, explanation: 'It involves presenting reasoning and evidence.' },
    { question: 'Review includes:', options: ['Critique and revision', 'Only praise', 'Only rejection', 'Only summary'], correct: 0, explanation: 'It includes critique and revision.' },
    { question: 'Conclusions should be:', options: ['Proportional to evidence', 'Overstated', 'Speculative', 'Context-free'], correct: 0, explanation: 'They should be proportional.' },
    { question: 'Humility recognizes:', options: ['Limits of evidence', 'No limits', 'Only certainty', 'Only authority'], correct: 0, explanation: 'It recognizes limits.' },
    { question: 'Integration means:', options: ['Combining components', 'Isolating components', 'Ignoring components', 'Avoiding structure'], correct: 0, explanation: 'It means combining components.' }
  ],
  about: {
    level: 'Diploma-Level Course',
    description: 'An advanced capstone emphasizing rigorous research design, evidence evaluation, and formal defense without denominational bias.',
    credits: '4 credits',
    prerequisites: 'Completion of diploma track requirements'
  }
};

export default diplomaCapstoneCourse;
