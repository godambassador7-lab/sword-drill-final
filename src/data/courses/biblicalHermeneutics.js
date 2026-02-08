const biblicalHermeneuticsCourse = {
  id: 'biblicalHermeneutics',
  title: 'Biblical Hermeneutics',
  subtitle: 'Associate-Level Course | 8 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'What Is Hermeneutics?',
      icon: '📖',
      duration: '25 min',
      content: [
        {
          heading: 'Definition and Scope',
          text: 'Hermeneutics is the study of how meaning is communicated and understood in texts. In biblical studies, it focuses on responsible interpretation of Scripture by asking: What did the text mean to its original audience, and how should it be applied today? Hermeneutics is not about making a text say what we want; it is about listening carefully to what the text actually says.'
        },
        {
          heading: 'Exegesis vs. Eisegesis',
          text: 'Exegesis draws meaning out of the text by attending to context, grammar, and historical setting. Eisegesis reads meaning into the text from outside assumptions. Good interpretation is disciplined, evidence-based, and grounded in the words of Scripture itself.'
        },
        {
          heading: 'Why It Matters',
          text: 'Every reader interprets. The goal is not to eliminate interpretation but to practice it faithfully. Sound hermeneutics guards against distortion, helps readers follow the flow of biblical argument, and anchors application in the intended meaning of the text.'
        }
      ],
      keyTerms: [
        { term: 'Hermeneutics', definition: 'The study of principles and methods of interpretation' },
        { term: 'Exegesis', definition: 'Drawing meaning out of the text by careful analysis' },
        { term: 'Eisegesis', definition: 'Reading meaning into the text from external assumptions' },
        { term: 'Authorial Intent', definition: 'What the original author intended to communicate' }
      ],
      quiz: [
        {
          question: 'What is the primary goal of biblical hermeneutics?',
          options: ['To prove a doctrine', 'To determine the intended meaning of the text', 'To create new interpretations', 'To modernize Scripture'],
          correct: 1,
          explanation: 'Hermeneutics focuses on the intended meaning of the biblical text for its original audience.'
        },
        {
          question: 'Exegesis is best described as:',
          options: ['Reading meaning into a text', 'Ignoring context for application', 'Drawing meaning out of a text through analysis', 'Summarizing a text in modern terms'],
          correct: 2,
          explanation: 'Exegesis is the disciplined process of drawing meaning out of the text based on context and language.'
        },
        {
          question: 'Eisegesis is a problem because it:',
          options: ['Relies on original languages', 'Uses historical context', 'Imposes external ideas onto the text', 'Focuses on authorial intent'],
          correct: 2,
          explanation: 'Eisegesis imposes meanings that are not grounded in the text itself.'
        },
        {
          question: 'Hermeneutics is necessary because:',
          options: ['All readers interpret texts', 'The Bible is irrelevant to modern life', 'Only scholars should read Scripture', 'Interpretation replaces faith'],
          correct: 0,
          explanation: 'Everyone interprets; the goal is to interpret responsibly and faithfully.'
        },
        {
          question: 'Which phrase best summarizes hermeneutics?',
          options: ['Make the text agree with us', 'Let the text speak on its own terms', 'Ignore historical context', 'Prioritize tradition over text'],
          correct: 1,
          explanation: 'Hermeneutics seeks to hear the text on its own terms.'
        }
      ]
    },
    {
      id: '02',
      title: 'Inspiration and Authority of Scripture',
      icon: '🕊️',
      duration: '30 min',
      content: [
        {
          heading: 'Scripture’s Self-Claims',
          text: 'The biblical writings present themselves as God’s word mediated through human authors. Passages such as 2 Timothy 3:16 and 2 Peter 1:20–21 describe Scripture as God-breathed and Spirit-guided. These claims establish why careful interpretation matters: the text is presented as authoritative for faith and life.'
        },
        {
          heading: 'Human Authors in Real History',
          text: 'The Bible was written by real people in real historical contexts. These authors used human language, grammar, literary styles, and historical references. Interpreters must take these human elements seriously if they want to understand the message accurately.'
        },
        {
          heading: 'Authority and Accountability',
          text: 'If Scripture is authoritative, interpreters are accountable to its meaning. Interpretation should not be driven by convenience or preference but by textual evidence, context, and coherent reading.'
        }
      ],
      keyTerms: [
        { term: 'Inspiration', definition: 'The belief that Scripture is given by God through human authors' },
        { term: 'Authority', definition: 'The binding weight and trustworthiness of Scripture’s message' },
        { term: 'Canonical Text', definition: 'The books recognized as Scripture' }
      ],
      quiz: [
        {
          question: 'Which passage explicitly describes Scripture as God-breathed?',
          options: ['Psalm 23', '2 Timothy 3:16', 'Matthew 5:1', 'Acts 2:1'],
          correct: 1,
          explanation: '2 Timothy 3:16 states that all Scripture is God-breathed.'
        },
        {
          question: 'Why does the human authorship of Scripture matter for interpretation?',
          options: ['It makes Scripture less reliable', 'It means genre and context must be considered', 'It removes the need for interpretation', 'It eliminates historical setting'],
          correct: 1,
          explanation: 'Human authors wrote in specific contexts and genres, which must be considered.'
        },
        {
          question: 'Biblical authority implies that:',
          options: ['Interpretation is optional', 'Scripture’s meaning sets boundaries for application', 'Tradition replaces text', 'History is irrelevant'],
          correct: 1,
          explanation: 'Authority means interpreters are accountable to what the text actually says.'
        },
        {
          question: 'Which concept best summarizes 2 Peter 1:20–21?',
          options: ['Prophecy is private opinion', 'Scripture is Spirit-guided', 'Authors wrote without context', 'Texts are purely symbolic'],
          correct: 1,
          explanation: '2 Peter 1:20–21 emphasizes the Spirit’s role in guiding prophetic Scripture.'
        },
        {
          question: 'A responsible interpreter should treat Scripture as:',
          options: ['A text without historical context', 'Purely mythological', 'Authoritative and historically situated', 'Only devotional poetry'],
          correct: 2,
          explanation: 'Scripture is both authoritative and written in historical contexts.'
        }
      ]
    },
    {
      id: '03',
      title: 'Context: Historical and Literary',
      icon: '🧭',
      duration: '30 min',
      content: [
        {
          heading: 'Historical Context',
          text: 'Historical context asks who wrote a text, to whom, when, and under what circumstances. Understanding geography, politics, and culture helps clarify references that would have been obvious to original audiences.'
        },
        {
          heading: 'Literary Context',
          text: 'Meaning is shaped by literary context: sentences sit inside paragraphs, paragraphs inside books, and books inside the whole canon. Pulling a verse out of context can distort its meaning.'
        },
        {
          heading: 'The Flow of Argument',
          text: 'Biblical authors often build arguments step by step. Paying attention to connectors, transitions, and repeated themes helps interpreters follow the author’s reasoning.'
        }
      ],
      keyTerms: [
        { term: 'Historical Context', definition: 'The original time, place, culture, and situation of a text' },
        { term: 'Literary Context', definition: 'The surrounding material that shapes meaning' },
        { term: 'Flow of Argument', definition: 'The logical progression of ideas within a text' }
      ],
      quiz: [
        {
          question: 'Historical context primarily helps interpreters understand:',
          options: ['Modern application', 'Original audience circumstances', 'Only grammar', 'Only prophecy'],
          correct: 1,
          explanation: 'Historical context focuses on the original audience and setting.'
        },
        {
          question: 'Literary context includes:',
          options: ['Only word definitions', 'Surrounding paragraphs and the book’s structure', 'Only archaeological data', 'Only sermons'],
          correct: 1,
          explanation: 'Literary context includes how a passage fits in its paragraph, section, and book.'
        },
        {
          question: 'Why is “verse snatching” dangerous?',
          options: ['It adds too much context', 'It can distort the author’s intended meaning', 'It makes texts too long', 'It focuses on grammar'],
          correct: 1,
          explanation: 'Isolating a verse can alter or reverse its intended meaning.'
        },
        {
          question: 'Following the flow of argument helps with:',
          options: ['Guessing meaning', 'Understanding the author’s reasoning', 'Ignoring context', 'Avoiding interpretation'],
          correct: 1,
          explanation: 'Tracking the argument reveals why the author says what he says.'
        },
        {
          question: 'Which is an example of historical context?',
          options: ['Paul writing to a church in Corinth', 'A chapter heading', 'A modern study Bible note', 'A personal application'],
          correct: 0,
          explanation: 'Historical context includes the author, audience, and setting.'
        }
      ]
    },
    {
      id: '04',
      title: 'Genre and Literary Forms',
      icon: '🧩',
      duration: '30 min',
      content: [
        {
          heading: 'Why Genre Matters',
          text: 'The Bible includes narrative, poetry, law, prophecy, wisdom literature, Gospels, epistles, and apocalyptic. Each genre communicates differently. Poetry uses imagery; narrative tells events; epistles argue and instruct. Genre guides how we interpret language.'
        },
        {
          heading: 'Literal and Figurative Language',
          text: 'Literal meaning is not the same as “wooden” reading. Figurative language can still convey literal truths. For example, “The Lord is my shepherd” (Psalm 23) is metaphorical but communicates real care and guidance.'
        },
        {
          heading: 'Apocalyptic and Symbolism',
          text: 'Apocalyptic texts like Daniel and Revelation use symbols, visions, and numbers. Interpreters should look for how these symbols function in the text and how they connect to earlier Scripture.'
        }
      ],
      keyTerms: [
        { term: 'Genre', definition: 'A literary category that shapes how a text communicates' },
        { term: 'Figurative Language', definition: 'Metaphor, simile, and imagery used to convey meaning' },
        { term: 'Apocalyptic', definition: 'Symbolic visionary literature often about divine judgment and hope' }
      ],
      quiz: [
        {
          question: 'Why is identifying genre important?',
          options: ['It replaces context', 'It controls how language should be read', 'It removes the need for study', 'It makes all texts symbolic'],
          correct: 1,
          explanation: 'Genre sets expectations for how to interpret a passage.'
        },
        {
          question: 'Psalm 23 is an example of:',
          options: ['Law', 'Apocalyptic vision', 'Poetry using metaphor', 'Historical narrative'],
          correct: 2,
          explanation: 'Psalm 23 is poetic and uses metaphorical language.'
        },
        {
          question: 'Apocalyptic literature often includes:',
          options: ['Genealogies only', 'Symbols and visions', 'Legal codes', 'Travel narratives'],
          correct: 1,
          explanation: 'Apocalyptic texts use symbols, visions, and imagery.'
        },
        {
          question: 'Literal interpretation means:',
          options: ['Ignoring figurative language', 'Reading according to the genre and context', 'Assuming symbolism everywhere', 'Rejecting narrative'],
          correct: 1,
          explanation: 'Literal interpretation respects genre and context, including figurative language.'
        },
        {
          question: 'Which genre is primarily instructional?',
          options: ['Epistle', 'Genealogy', 'Apocalyptic', 'Poetry'],
          correct: 0,
          explanation: 'Epistles are instructional and argumentative letters.'
        }
      ]
    },
    {
      id: '05',
      title: 'Word Studies and Semantics',
      icon: '🔍',
      duration: '25 min',
      content: [
        {
          heading: 'Meaning in Context',
          text: 'Words have ranges of meaning, and context determines which meaning is intended. A word study must consider how a word is used in the immediate passage and broader biblical usage.'
        },
        {
          heading: 'Avoiding Common Errors',
          text: 'Two common mistakes are the “root fallacy” (assuming a word’s meaning is determined by its etymology) and “illegitimate totality transfer” (assuming all possible meanings apply at once).'
        },
        {
          heading: 'Using Original Languages Wisely',
          text: 'Greek and Hebrew can clarify nuances, but they do not override context or grammar. The goal is not to sound technical but to read accurately.'
        }
      ],
      keyTerms: [
        { term: 'Semantic Range', definition: 'The set of possible meanings a word can have' },
        { term: 'Root Fallacy', definition: 'Assuming a word’s origin fixes its meaning in every use' },
        { term: 'Illegitimate Totality Transfer', definition: 'Reading all possible meanings into one occurrence' }
      ],
      quiz: [
        {
          question: 'Why is context crucial in word studies?',
          options: ['It removes ambiguity', 'It identifies the intended meaning in a specific passage', 'It eliminates grammar', 'It replaces the text'],
          correct: 1,
          explanation: 'Context determines which meaning a word carries in a passage.'
        },
        {
          question: 'The root fallacy is:',
          options: ['Using context to define words', 'Assuming a word’s origin dictates its meaning', 'Comparing translations', 'Studying grammar'],
          correct: 1,
          explanation: 'Root fallacy assumes etymology fixes meaning in every use.'
        },
        {
          question: 'Illegitimate totality transfer occurs when:',
          options: ['Only one meaning is chosen', 'All possible meanings are applied at once', 'Grammar is ignored', 'Historical context is used'],
          correct: 1,
          explanation: 'It wrongly applies all meanings of a word to a single occurrence.'
        },
        {
          question: 'Original languages are most helpful when:',
          options: ['Used to override context', 'Used to confirm contextual meaning', 'Used to avoid interpretation', 'Used only for scholars'],
          correct: 1,
          explanation: 'They clarify meaning when used in context.'
        },
        {
          question: 'A word’s semantic range refers to:',
          options: ['Its spelling variations', 'Its possible meanings', 'Its historical authors', 'Its manuscript count'],
          correct: 1,
          explanation: 'Semantic range is the set of possible meanings.'
        }
      ]
    },
    {
      id: '06',
      title: 'Grammar and Syntax',
      icon: '🧱',
      duration: '25 min',
      content: [
        {
          heading: 'Why Grammar Matters',
          text: 'Grammar shows how words relate to each other and helps clarify meaning. In biblical interpretation, attention to verbs, subjects, objects, and modifiers can resolve ambiguities.'
        },
        {
          heading: 'Key Grammatical Features',
          text: 'In Hebrew and Greek, verb tense, aspect, and voice carry important nuance. Connectives (therefore, because, so that) reveal logical relationships. Small words often carry big meaning.'
        },
        {
          heading: 'Syntax and Emphasis',
          text: 'Syntax—the arrangement of words—can highlight emphasis. For example, placing a word at the beginning of a sentence can draw attention. Syntax helps interpreters follow the author’s argument and identify key points.'
        }
      ],
      keyTerms: [
        { term: 'Grammar', definition: 'Rules governing how words relate in sentences' },
        { term: 'Syntax', definition: 'The arrangement of words and phrases in a sentence' },
        { term: 'Connectives', definition: 'Words that show logical relationships (therefore, because, so that)' }
      ],
      quiz: [
        {
          question: 'Grammar helps interpreters by:',
          options: ['Replacing context', 'Clarifying relationships between words', 'Avoiding translation', 'Adding new meaning'],
          correct: 1,
          explanation: 'Grammar shows how words relate in a sentence.'
        },
        {
          question: 'Connectives like “therefore” or “because” indicate:',
          options: ['Historical background', 'Logical relationships', 'Poetic imagery', 'Genre changes'],
          correct: 1,
          explanation: 'Connectives reveal logical flow in the argument.'
        },
        {
          question: 'Syntax refers to:',
          options: ['Word etymology', 'Sentence structure and arrangement', 'Manuscript families', 'Historical setting'],
          correct: 1,
          explanation: 'Syntax is the arrangement of words in sentences.'
        },
        {
          question: 'Why are small words important in interpretation?',
          options: ['They are optional', 'They often signal logic and emphasis', 'They only appear in poetry', 'They replace context'],
          correct: 1,
          explanation: 'Small words often carry logical or emphatic force.'
        },
        {
          question: 'Verb features like tense and voice can:',
          options: ['Change the passage’s genre', 'Add nuance to meaning', 'Remove historical context', 'Make interpretation unnecessary'],
          correct: 1,
          explanation: 'Verb features provide nuance to meaning.'
        }
      ]
    },
    {
      id: '07',
      title: 'Canon and Intertext',
      icon: '📜',
      duration: '30 min',
      content: [
        {
          heading: 'Canonical Context',
          text: 'Each passage sits within a book, and each book sits within the canon. Canonical context helps interpreters see themes that develop over time, such as covenant, kingdom, and temple.'
        },
        {
          heading: 'Scripture Interprets Scripture',
          text: 'Biblical writers often interpret earlier Scripture. The New Testament quotes or alludes to the Old Testament extensively. Observing these connections helps interpreters see how biblical themes and promises are fulfilled.'
        },
        {
          heading: 'Typology and Promise-Fulfillment',
          text: 'Typology recognizes patterns where earlier persons, events, or institutions prefigure later realities. This is not arbitrary symbolism but a textual pattern grounded in Scripture’s own use (e.g., Adam–Christ in Romans 5).'
        }
      ],
      keyTerms: [
        { term: 'Canon', definition: 'The recognized collection of Scripture books' },
        { term: 'Intertext', definition: 'Connections between biblical texts through quotation or allusion' },
        { term: 'Typology', definition: 'Patterns where earlier realities prefigure later fulfillment' }
      ],
      quiz: [
        {
          question: 'Canonical context refers to:',
          options: ['Only a single verse', 'A passage’s place within the whole Bible', 'Modern church tradition', 'Archaeology alone'],
          correct: 1,
          explanation: 'Canonical context includes how a passage fits within the entire canon.'
        },
        {
          question: 'The New Testament’s use of the Old Testament is best described as:',
          options: ['Ignoring it', 'Quoting and alluding to it frequently', 'Replacing it entirely', 'Treating it as irrelevant'],
          correct: 1,
          explanation: 'The New Testament frequently quotes and alludes to the Old Testament.'
        },
        {
          question: 'Typology is:',
          options: ['Random symbolism', 'Text-based patterns that prefigure later realities', 'Adenominational tradition', 'Only allegory'],
          correct: 1,
          explanation: 'Typology recognizes text-based patterns leading to later fulfillment.'
        },
        {
          question: '“Scripture interprets Scripture” means:',
          options: ['Ignore context', 'Use clearer texts to help interpret related texts', 'Reject the Old Testament', 'Only read commentaries'],
          correct: 1,
          explanation: 'Related texts can illuminate each other when read in context.'
        },
        {
          question: 'Which is an example of intertext?',
          options: ['A modern sermon', 'A New Testament quotation of Isaiah', 'A study Bible note', 'A dictionary definition'],
          correct: 1,
          explanation: 'Intertext includes quotations and allusions between biblical texts.'
        }
      ]
    },
    {
      id: '08',
      title: 'From Meaning to Application',
      icon: '🧠',
      duration: '25 min',
      content: [
        {
          heading: 'Meaning Before Application',
          text: 'Faithful application begins with faithful interpretation. The interpreter must first ask what the text meant in its original setting before asking how it applies today.'
        },
        {
          heading: 'Principles and Transfer',
          text: 'Application involves identifying timeless theological or moral principles grounded in the text and then applying those principles to contemporary situations. The goal is to honor the text rather than manipulate it.'
        },
        {
          heading: 'Consistency and Accountability',
          text: 'Application should be consistent with the text’s message, the broader biblical teaching, and the character of God as revealed in Scripture.'
        }
      ],
      keyTerms: [
        { term: 'Meaning', definition: 'What the text communicated to its original audience' },
        { term: 'Application', definition: 'How the text’s meaning addresses contemporary life' },
        { term: 'Principle', definition: 'A timeless truth derived from the text' }
      ],
      quiz: [
        {
          question: 'Faithful application must begin with:',
          options: ['A modern opinion', 'The text’s original meaning', 'A popular sermon', 'Cultural preferences'],
          correct: 1,
          explanation: 'Application is built on the text’s original meaning.'
        },
        {
          question: 'A principle is:',
          options: ['A private feeling', 'A timeless truth grounded in the text', 'A translation note', 'A historical error'],
          correct: 1,
          explanation: 'Principles are timeless truths derived from the text.'
        },
        {
          question: 'Which is a responsible application?',
          options: ['Using any verse to support any idea', 'Applying a text without context', 'Applying the text consistent with its meaning', 'Ignoring the text’s message'],
          correct: 2,
          explanation: 'Responsible application stays consistent with the text’s message.'
        },
        {
          question: 'Why is meaning-before-application important?',
          options: ['It makes the text irrelevant', 'It prevents distortion', 'It removes interpretation', 'It avoids theology'],
          correct: 1,
          explanation: 'It prevents distortion and keeps application faithful to the text.'
        },
        {
          question: 'Application should be consistent with:',
          options: ['Personal preferences', 'Broader biblical teaching', 'Cultural trends only', 'Random associations'],
          correct: 1,
          explanation: 'Application should align with broader biblical teaching.'
        }
      ]
    }
  ],
  finalExam: [
    { question: 'Hermeneutics is the study of:', options: ['Archaeology', 'Interpretation', 'Translation only', 'Church history'], correct: 1, explanation: 'Hermeneutics focuses on principles of interpretation.' },
    { question: 'Exegesis means:', options: ['Reading meaning into the text', 'Drawing meaning out of the text', 'Ignoring context', 'Summarizing opinions'], correct: 1, explanation: 'Exegesis draws meaning from the text.' },
    { question: 'Eisegesis is:', options: ['Contextual reading', 'Applying historical setting', 'Imposing outside ideas on the text', 'Comparing manuscripts'], correct: 2, explanation: 'Eisegesis imposes meaning not grounded in the text.' },
    { question: 'Historical context includes:', options: ['Author, audience, and setting', 'Only modern application', 'Only word studies', 'Only genre'], correct: 0, explanation: 'Historical context is author, audience, time, and situation.' },
    { question: 'Literary context refers to:', options: ['Text surrounding a passage', 'Only archaeological data', 'Only theology', 'Only translation notes'], correct: 0, explanation: 'Literary context includes the surrounding text.' },
    { question: 'Genre helps interpret because it:', options: ['Eliminates context', 'Guides how language functions', 'Replaces grammar', 'Makes all texts symbolic'], correct: 1, explanation: 'Genre guides how language should be read.' },
    { question: 'Poetry often uses:', options: ['Legal codes', 'Imagery and metaphor', 'Genealogies only', 'Prose arguments'], correct: 1, explanation: 'Poetry uses imagery and metaphor.' },
    { question: 'Apocalyptic literature frequently uses:', options: ['Symbols and visions', 'Legal statutes', 'Genealogies', 'Travel logs'], correct: 0, explanation: 'Apocalyptic texts use symbols and visions.' },
    { question: 'The root fallacy is:', options: ['Assuming word origin fixes meaning', 'Using context to determine meaning', 'Comparing translations', 'Studying grammar'], correct: 0, explanation: 'Root fallacy assumes etymology fixes meaning.' },
    { question: 'Illegitimate totality transfer is:', options: ['Choosing one meaning from context', 'Applying all meanings at once', 'Using grammar', 'Using context'], correct: 1, explanation: 'It wrongly applies all meanings at once.' },
    { question: 'Grammar helps by:', options: ['Replacing context', 'Clarifying word relationships', 'Avoiding translation', 'Adding meanings'], correct: 1, explanation: 'Grammar clarifies word relationships.' },
    { question: 'Connectives like “therefore” show:', options: ['Historical setting', 'Logical flow', 'Poetic imagery', 'Genre changes'], correct: 1, explanation: 'Connectives indicate logical flow.' },
    { question: 'Canon refers to:', options: ['A translation', 'A collection of Scripture books', 'A sermon series', 'A dictionary'], correct: 1, explanation: 'Canon is the recognized collection of Scripture books.' },
    { question: 'Intertext includes:', options: ['A modern sermon', 'Quotations/allusions between biblical texts', 'Only archaeology', 'Only tradition'], correct: 1, explanation: 'Intertext is connections between texts.' },
    { question: 'Typology is:', options: ['Random symbolism', 'Text-based patterns of fulfillment', 'Ignoring history', 'Only allegory'], correct: 1, explanation: 'Typology recognizes text-based patterns.' },
    { question: 'Meaning-before-application means:', options: ['Apply first, interpret later', 'Interpret original meaning before applying', 'Ignore context', 'Reject principles'], correct: 1, explanation: 'Interpret first, then apply.' },
    { question: 'A principle is:', options: ['A personal opinion', 'A timeless truth grounded in the text', 'A translation note', 'A historical error'], correct: 1, explanation: 'Principles are timeless truths derived from the text.' },
    { question: 'Scripture’s authority implies:', options: ['Interpretation is optional', 'Interpreters are accountable to meaning', 'Context is unnecessary', 'Genre is irrelevant'], correct: 1, explanation: 'Authority means interpreters are accountable to meaning.' },
    { question: 'Literal interpretation means:', options: ['Wooden reading', 'Reading according to genre and context', 'Symbolism everywhere', 'Ignoring context'], correct: 1, explanation: 'Literal interpretation respects genre and context.' },
    { question: 'Responsible application should be consistent with:', options: ['Personal preference', 'Broader biblical teaching', 'Cultural trends only', 'Random associations'], correct: 1, explanation: 'Application should align with the broader biblical message.' }
  ],
  about: {
    level: 'Associate-Level Course',
    description: 'A rigorous, text-driven course on how to interpret Scripture faithfully. Focuses on authorial intent, context, genre, grammar, and canonical synthesis with a disciplined approach to application.',
    credits: '3 credits',
    prerequisites: 'Basic biblical literacy'
  }
};

export default biblicalHermeneuticsCourse;
