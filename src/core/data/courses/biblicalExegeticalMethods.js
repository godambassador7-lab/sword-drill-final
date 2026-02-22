const biblicalExegeticalMethodsCourse = {
  id: 'biblicalExegeticalMethods',
  title: 'Biblical Exegetical Methods',
  subtitle: 'Associate-Level Course | 7 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Exegetical Workflow',
      icon: '🧭',
      duration: '25 min',
      content: [
        {
          heading: 'What Exegesis Is',
          text: 'Exegesis is a disciplined process of discovering what a text meant to its original audience by careful observation, analysis, and synthesis. It is not guesswork; it is methodical and evidence-based.'
        },
        {
          heading: 'The Exegetical Spiral',
          text: 'Interpreters often move in a spiral: read, observe, analyze, and then return to the text with deeper understanding. Each pass refines conclusions and reduces error.'
        },
        {
          heading: 'From Text to Meaning',
          text: 'The exegetical process begins with the text itself, not with secondary sources. Observations are gathered first, then analyzed, and finally synthesized into meaning.'
        }
      ],
      keyTerms: [
        { term: 'Exegesis', definition: 'Drawing meaning out of a text through careful analysis' },
        { term: 'Observation', definition: 'Noticing details in the text before interpreting' },
        { term: 'Synthesis', definition: 'Bringing observations together into coherent meaning' }
      ],
      quiz: [
        { question: 'Exegesis primarily seeks to:', options: ['Create new meanings', 'Discover the text’s intended meaning', 'Summarize opinions', 'Replace context'], correct: 1, explanation: 'Exegesis discovers intended meaning.' },
        { question: 'The exegetical spiral emphasizes:', options: ['One-time reading', 'Repeated reading and refinement', 'Ignoring details', 'Only secondary sources'], correct: 1, explanation: 'Exegesis improves through repeated, careful reading.' },
        { question: 'In exegesis, observations should come:', options: ['After conclusions', 'Before analysis and synthesis', 'Only from commentaries', 'Only from applications'], correct: 1, explanation: 'Observation comes first.' },
        { question: 'Which is NOT part of exegesis?', options: ['Observation', 'Analysis', 'Synthesis', 'Guesswork'], correct: 3, explanation: 'Exegesis is methodical, not guesswork.' },
        { question: 'Exegesis begins with:', options: ['Doctrine', 'The text itself', 'Application', 'Tradition'], correct: 1, explanation: 'The text is the starting point.' }
      ]
    },
    {
      id: '02',
      title: 'Observation and Textual Features',
      icon: '🔍',
      duration: '30 min',
      content: [
        {
          heading: 'Close Reading',
          text: 'Observation involves close reading: noting repeated words, key terms, contrasts, and structure. These details often signal the author’s main points.'
        },
        {
          heading: 'Key Questions',
          text: 'Ask who, what, when, where, why, and how. These questions anchor interpretation in textual evidence rather than assumptions.'
        },
        {
          heading: 'Textual Boundaries',
          text: 'Identifying where a passage begins and ends is essential. Paragraphing, shifts in speaker, or changes in topic often mark boundaries.'
        }
      ],
      keyTerms: [
        { term: 'Close Reading', definition: 'Careful attention to details within the text' },
        { term: 'Textual Boundaries', definition: 'The start and end of a passage or unit of thought' },
        { term: 'Repeated Terms', definition: 'Words or phrases emphasized by repetition' }
      ],
      quiz: [
        { question: 'Close reading focuses on:', options: ['Only background sources', 'Details within the text', 'Modern application', 'The translator’s opinion'], correct: 1, explanation: 'Close reading focuses on textual details.' },
        { question: 'Repeated words often signal:', options: ['Random choice', 'Authorial emphasis', 'Translation errors', 'Genre change'], correct: 1, explanation: 'Repetition emphasizes key ideas.' },
        { question: 'Identifying textual boundaries helps:', options: ['Ignore context', 'Define the unit of thought', 'Avoid interpretation', 'Replace grammar'], correct: 1, explanation: 'Boundaries identify the unit of thought.' },
        { question: 'Observation questions include:', options: ['Who, what, when, where, why, how', 'Only “why”', 'Only “where”', 'Only “when”'], correct: 0, explanation: 'Observation uses broad questions.' },
        { question: 'Observation should be:', options: ['Conclusion-driven', 'Evidence-driven', 'Opinion-driven', 'Tradition-driven'], correct: 1, explanation: 'Observation is evidence-driven.' }
      ]
    },
    {
      id: '03',
      title: 'Historical and Cultural Analysis',
      icon: '🏛️',
      duration: '30 min',
      content: [
        {
          heading: 'Historical Setting',
          text: 'Understanding the historical setting helps explain references that were obvious to the original audience. This includes political powers, geography, and social conditions.'
        },
        {
          heading: 'Cultural Practices',
          text: 'Cultural practices such as covenant rituals, marriage customs, and economic systems often shape how a text should be understood.'
        },
        {
          heading: 'Limits of Background',
          text: 'Background helps illuminate the text but does not control it. Historical data should serve the text, not override it.'
        }
      ],
      keyTerms: [
        { term: 'Historical Setting', definition: 'The time, place, and circumstances of a text’s origin' },
        { term: 'Cultural Context', definition: 'Customs and social practices of the original audience' },
        { term: 'Background Data', definition: 'External information that illuminates a passage' }
      ],
      quiz: [
        { question: 'Historical setting helps explain:', options: ['Modern opinions', 'Original audience references', 'Only grammar', 'Only translation'], correct: 1, explanation: 'Historical setting explains original references.' },
        { question: 'Cultural practices are useful because:', options: ['They replace the text', 'They illuminate how the audience understood the text', 'They eliminate meaning', 'They erase context'], correct: 1, explanation: 'Cultural practices illuminate the text.' },
        { question: 'Background data should:', options: ['Override the text', 'Serve the text', 'Replace Scripture', 'Ignore context'], correct: 1, explanation: 'Background should serve the text.' },
        { question: 'Which is an example of cultural context?', options: ['Modern church traditions', 'Ancient covenant rituals', 'Translation notes', 'Personal opinions'], correct: 1, explanation: 'Ancient covenant rituals are cultural context.' },
        { question: 'Historical context includes:', options: ['Author, audience, setting', 'Only word meanings', 'Only genre', 'Only application'], correct: 0, explanation: 'Historical context includes author, audience, and setting.' }
      ]
    },
    {
      id: '04',
      title: 'Structural and Grammatical Analysis',
      icon: '🧱',
      duration: '30 min',
      content: [
        {
          heading: 'Paragraph and Discourse Structure',
          text: 'Biblical texts are organized into paragraphs and larger discourse units. Identifying these structures helps interpreters trace argument and emphasis.'
        },
        {
          heading: 'Grammar and Syntax',
          text: 'Grammar clarifies relationships between words. Syntax reveals emphasis and flow. Small words like “therefore,” “because,” and “so that” often signal logic.'
        },
        {
          heading: 'Outlining the Passage',
          text: 'Creating a passage outline forces the interpreter to organize the author’s points and observe how each part contributes to the whole.'
        }
      ],
      keyTerms: [
        { term: 'Discourse Structure', definition: 'The organization of ideas across a passage or section' },
        { term: 'Syntax', definition: 'Arrangement of words and phrases in sentences' },
        { term: 'Outline', definition: 'A structured summary of a passage’s argument' }
      ],
      quiz: [
        { question: 'Structural analysis helps interpreters:', options: ['Ignore argument flow', 'Trace the author’s emphasis', 'Avoid outlining', 'Reject grammar'], correct: 1, explanation: 'Structure reveals emphasis and flow.' },
        { question: 'Connectives like “therefore” indicate:', options: ['Random transitions', 'Logical relationships', 'Only narrative details', 'Translation errors'], correct: 1, explanation: 'Connectives show logical flow.' },
        { question: 'Syntax primarily concerns:', options: ['Word origins', 'Word arrangement and relationships', 'Historical setting', 'Genre'], correct: 1, explanation: 'Syntax concerns arrangement and relationships.' },
        { question: 'Outlining a passage helps:', options: ['Create new meanings', 'Organize the author’s argument', 'Ignore context', 'Avoid grammar'], correct: 1, explanation: 'Outlining organizes the author’s argument.' },
        { question: 'Paragraph boundaries help identify:', options: ['Only manuscripts', 'Units of thought', 'Only translation choices', 'Only historical data'], correct: 1, explanation: 'Boundaries identify units of thought.' }
      ]
    },
    {
      id: '05',
      title: 'Theological Synthesis',
      icon: '🏺',
      duration: '25 min',
      content: [
        {
          heading: 'From Exegesis to Theology',
          text: 'Theological synthesis asks how a passage contributes to the Bible’s larger teaching on a topic. It connects the passage to the wider canonical context without forcing conclusions.'
        },
        {
          heading: 'Tracing Themes',
          text: 'Key themes like covenant, kingdom, holiness, and redemption develop across Scripture. Exegetical conclusions should be integrated with these broader themes.'
        },
        {
          heading: 'Guardrails',
          text: 'Synthesis should not ignore the passage’s meaning. It must be grounded in textual evidence and avoid overgeneralization.'
        }
      ],
      keyTerms: [
        { term: 'Theological Synthesis', definition: 'Integrating passage meaning with broader biblical teaching' },
        { term: 'Biblical Theme', definition: 'A recurring idea developed across Scripture' },
        { term: 'Canonical Context', definition: 'How a passage fits within the whole Bible' }
      ],
      quiz: [
        { question: 'Theological synthesis asks:', options: ['How the passage fits broader biblical teaching', 'How to ignore the passage', 'How to avoid themes', 'How to replace context'], correct: 0, explanation: 'Synthesis integrates passage meaning with broader teaching.' },
        { question: 'A biblical theme is:', options: ['A random idea', 'A recurring idea across Scripture', 'A translation note', 'A historical detail'], correct: 1, explanation: 'Themes recur across Scripture.' },
        { question: 'Synthesis should be grounded in:', options: ['Opinion', 'Textual evidence', 'Personal preference', 'Cultural trends'], correct: 1, explanation: 'Synthesis must be grounded in the text.' },
        { question: 'Canonical context means:', options: ['Only the immediate verse', 'The whole Bible’s context', 'Only one book', 'Only tradition'], correct: 1, explanation: 'Canonical context is the whole Bible’s context.' },
        { question: 'Which is a guardrail for synthesis?', options: ['Ignoring passage meaning', 'Avoiding overgeneralization', 'Creating new doctrines', 'Rejecting context'], correct: 1, explanation: 'Synthesis should avoid overgeneralization.' }
      ]
    },
    {
      id: '06',
      title: 'Application and Communication',
      icon: '🗣️',
      duration: '25 min',
      content: [
        {
          heading: 'From Meaning to Principle',
          text: 'Application begins by identifying the meaning of the text, then deriving principles that are consistent with that meaning. This prevents misuse of Scripture.'
        },
        {
          heading: 'Audience and Setting',
          text: 'Effective communication considers the audience’s needs and context without distorting the text. Application should be faithful, clear, and relevant.'
        },
        {
          heading: 'Integrity in Teaching',
          text: 'Teaching and preaching should transparently reflect the text’s argument and logic. Integrity requires that application flows from exegesis.'
        }
      ],
      keyTerms: [
        { term: 'Principle', definition: 'A timeless truth derived from a passage' },
        { term: 'Application', definition: 'Applying a passage’s meaning to contemporary life' },
        { term: 'Communication', definition: 'Conveying the text’s meaning clearly and faithfully' }
      ],
      quiz: [
        { question: 'Application should be based on:', options: ['Modern opinion', 'The text’s meaning', 'Cultural preference', 'Tradition alone'], correct: 1, explanation: 'Application must flow from meaning.' },
        { question: 'A principle is:', options: ['A private feeling', 'A timeless truth from the text', 'A translation choice', 'A historical detail'], correct: 1, explanation: 'A principle is a timeless truth derived from the text.' },
        { question: 'Effective communication considers:', options: ['Only the speaker', 'Audience and context while staying faithful to the text', 'Only tradition', 'Only modern trends'], correct: 1, explanation: 'Communication considers the audience while staying faithful.' },
        { question: 'Integrity in teaching requires:', options: ['Ignoring the text', 'Application flowing from exegesis', 'Replacing context', 'Avoiding clarity'], correct: 1, explanation: 'Integrity requires application that flows from exegesis.' },
        { question: 'Which is a faithful application step?', options: ['Skip exegesis', 'Derive principle from meaning', 'Replace context', 'Use proof-texting'], correct: 1, explanation: 'Faithful application derives principle from meaning.' }
      ]
    },
    {
      id: '07',
      title: 'Quality Control and Review',
      icon: '✅',
      duration: '20 min',
      content: [
        {
          heading: 'Cross-Check Conclusions',
          text: 'Check conclusions against the immediate context, the flow of argument, and other relevant Scripture. This reduces errors and prevents isolated interpretations.'
        },
        {
          heading: 'Peer Review and Humility',
          text: 'Consulting reliable sources and engaging with other interpreters can reveal blind spots. Humility is essential in interpretation.'
        },
        {
          heading: 'Documenting the Work',
          text: 'A sound exegetical study should be documented: notes, outlines, word studies, and sources. Clear documentation strengthens clarity and accountability.'
        }
      ],
      keyTerms: [
        { term: 'Cross-Check', definition: 'Testing conclusions against context and Scripture' },
        { term: 'Peer Review', definition: 'Evaluating conclusions with input from other interpreters' },
        { term: 'Documentation', definition: 'Recording observations, analysis, and sources' }
      ],
      quiz: [
        { question: 'Cross-checking conclusions helps:', options: ['Ignore context', 'Reduce interpretive error', 'Replace the text', 'Avoid analysis'], correct: 1, explanation: 'Cross-checking reduces error.' },
        { question: 'Peer review is valuable because:', options: ['It replaces Scripture', 'It can reveal blind spots', 'It eliminates study', 'It avoids interpretation'], correct: 1, explanation: 'Peer review can reveal blind spots.' },
        { question: 'Documentation in exegesis provides:', options: ['Confusion', 'Accountability and clarity', 'Only opinions', 'Only applications'], correct: 1, explanation: 'Documentation provides accountability and clarity.' },
        { question: 'Humility in interpretation means:', options: ['Rejecting evidence', 'Being open to correction', 'Ignoring context', 'Avoiding study'], correct: 1, explanation: 'Humility is openness to correction.' },
        { question: 'A strong exegetical conclusion should be:', options: ['Isolated', 'Evidence-based', 'Opinion-based', 'Tradition-only'], correct: 1, explanation: 'Conclusions should be evidence-based.' }
      ]
    }
  ],
  finalExam: [
    { question: 'Exegesis is primarily about:', options: ['Creating new meanings', 'Discovering intended meaning', 'Ignoring context', 'Replacing the text'], correct: 1, explanation: 'Exegesis discovers intended meaning.' },
    { question: 'The exegetical spiral emphasizes:', options: ['One reading', 'Repeated reading and refinement', 'Avoiding observation', 'Only commentaries'], correct: 1, explanation: 'Repeated reading refines interpretation.' },
    { question: 'Observation should come:', options: ['After conclusions', 'Before analysis and synthesis', 'Only after application', 'Only with commentaries'], correct: 1, explanation: 'Observation comes first.' },
    { question: 'Historical context includes:', options: ['Author, audience, and setting', 'Only word meanings', 'Only genre', 'Only application'], correct: 0, explanation: 'Historical context includes author, audience, and setting.' },
    { question: 'Close reading focuses on:', options: ['Textual details', 'Only background sources', 'Only application', 'Only translation notes'], correct: 0, explanation: 'Close reading focuses on textual details.' },
    { question: 'Textual boundaries identify:', options: ['Units of thought', 'Only verse numbers', 'Only manuscript families', 'Only translation options'], correct: 0, explanation: 'Boundaries identify units of thought.' },
    { question: 'Cultural context helps by:', options: ['Replacing the text', 'Illuminating how the audience understood the text', 'Ignoring history', 'Avoiding analysis'], correct: 1, explanation: 'Cultural context illuminates the text.' },
    { question: 'Background data should:', options: ['Override the text', 'Serve the text', 'Replace Scripture', 'Ignore context'], correct: 1, explanation: 'Background should serve the text.' },
    { question: 'Connectives like “therefore” show:', options: ['Poetic imagery', 'Logical relationships', 'Historical setting', 'Genre change'], correct: 1, explanation: 'Connectives show logical flow.' },
    { question: 'Syntax is:', options: ['Word origins', 'Arrangement of words in sentences', 'Historical setting', 'Genre'], correct: 1, explanation: 'Syntax is word arrangement.' },
    { question: 'Outlining a passage helps:', options: ['Organize the author’s argument', 'Ignore context', 'Replace grammar', 'Avoid analysis'], correct: 0, explanation: 'Outlining organizes the argument.' },
    { question: 'Theological synthesis should:', options: ['Ignore the text', 'Integrate passage meaning with broader teaching', 'Replace context', 'Avoid themes'], correct: 1, explanation: 'Synthesis integrates meaning with broader teaching.' },
    { question: 'A biblical theme is:', options: ['Random', 'Recurring across Scripture', 'Only historical', 'Only grammatical'], correct: 1, explanation: 'Themes recur across Scripture.' },
    { question: 'Application should be based on:', options: ['Personal preference', 'The text’s meaning', 'Modern opinion only', 'Tradition alone'], correct: 1, explanation: 'Application flows from meaning.' },
    { question: 'A principle is:', options: ['A timeless truth from the text', 'A private feeling', 'A translation note', 'A historical error'], correct: 0, explanation: 'Principles are timeless truths.' },
    { question: 'Integrity in teaching requires:', options: ['Ignoring exegesis', 'Application that flows from exegesis', 'Replacing context', 'Avoiding clarity'], correct: 1, explanation: 'Integrity requires application from exegesis.' },
    { question: 'Cross-checking conclusions helps:', options: ['Increase error', 'Reduce error', 'Avoid context', 'Ignore Scripture'], correct: 1, explanation: 'Cross-checking reduces error.' },
    { question: 'Peer review is valuable because:', options: ['It replaces Scripture', 'It reveals blind spots', 'It ends interpretation', 'It avoids study'], correct: 1, explanation: 'Peer review reveals blind spots.' },
    { question: 'Documentation provides:', options: ['Accountability and clarity', 'Confusion', 'Only opinions', 'Only application'], correct: 0, explanation: 'Documentation gives accountability.' },
    { question: 'A strong exegetical conclusion should be:', options: ['Opinion-based', 'Evidence-based', 'Isolated', 'Tradition-only'], correct: 1, explanation: 'Conclusions should be evidence-based.' }
  ],
  about: {
    level: 'Associate-Level Course',
    description: 'A disciplined, step-by-step approach to biblical exegesis. Students learn to observe, analyze, synthesize, and apply Scripture with historical and literary rigor.',
    credits: '3 credits',
    prerequisites: 'Biblical Hermeneutics recommended'
  }
};

export default biblicalExegeticalMethodsCourse;
