const demonologyCourse = {
  id: 'demonology',
  title: 'Demonology (New Testament)',
  subtitle: 'Associate-Level Course | 8 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Vocabulary and Categories',
      icon: '🛡️',
      duration: '25 min',
      content: [
        {
          heading: 'Key Terms',
          text: 'New Testament texts use terms such as “daimōnion” (demon) and “pneuma akatharton” (unclean spirit). These terms appear across the Gospels and Acts.'
        },
        {
          heading: 'Categories in the Text',
          text: 'The New Testament distinguishes between physical illness and demonic possession in some narratives, while in others the relationship is debated by interpreters. The focus here is on explicit textual claims.'
        }
      ],
      keyTerms: [
        { term: 'Daimōnion', definition: 'Greek term commonly translated “demon”' },
        { term: 'Unclean Spirit', definition: 'Phrase used in the Gospels for demonic beings' },
        { term: 'Exorcism', definition: 'Expulsion of a demon from a person' }
      ],
      quiz: [
        { question: 'The Greek term “daimōnion” means:', options: ['Angel', 'Demon', 'Teacher', 'Prophet'], correct: 1, explanation: 'Daimōnion is commonly translated “demon.”' },
        { question: '“Unclean spirit” is a phrase used in:', options: ['The Gospels', 'Only Paul’s letters', 'Only Revelation', 'Only Hebrews'], correct: 0, explanation: 'It appears frequently in the Gospels.' },
        { question: 'Exorcism refers to:', options: ['Healing by medicine', 'Expelling a demon', 'Teaching in a synagogue', 'Baptism'], correct: 1, explanation: 'Exorcism is expelling a demon.' },
        { question: 'This course emphasizes:', options: ['Speculation', 'Explicit textual claims', 'Denominational doctrine', 'Only later traditions'], correct: 1, explanation: 'The focus is on explicit textual claims.' },
        { question: 'NT vocabulary for demons appears in:', options: ['Gospels and Acts', 'Only Genesis', 'Only Psalms', 'Only Proverbs'], correct: 0, explanation: 'Vocabulary appears in the Gospels and Acts.' }
      ]
    },
    {
      id: '02',
      title: 'Mark: Demonology Dataset',
      icon: '📖',
      duration: '30 min',
      content: [
        {
          heading: 'Mark’s Emphasis',
          text: 'Mark contains several exorcism accounts (e.g., Mark 1:23–26; 5:1–20). These narratives highlight Jesus’ authority over unclean spirits.'
        },
        {
          heading: 'Authority and Reaction',
          text: 'Demons recognize Jesus’ identity and respond to his commands. The narratives underscore authority and public response.'
        }
      ],
      keyTerms: [
        { term: 'Authority', definition: 'Jesus’ command over spirits' },
        { term: 'Recognition', definition: 'Demons identifying Jesus’ status' },
        { term: 'Gerasa', definition: 'Region of the Gerasene demoniac (Mark 5)' }
      ],
      quiz: [
        { question: 'Mark includes:', options: ['Multiple exorcism accounts', 'No exorcisms', 'Only parables', 'Only genealogies'], correct: 0, explanation: 'Mark includes multiple exorcisms.' },
        { question: 'Demons in Mark often:', options: ['Ignore Jesus', 'Recognize Jesus’ identity', 'Only speak to crowds', 'Only appear in parables'], correct: 1, explanation: 'They recognize his identity.' },
        { question: 'The Gerasene account is in:', options: ['Mark 5', 'Mark 12', 'Mark 14', 'Mark 16'], correct: 0, explanation: 'The Gerasene account is in Mark 5.' },
        { question: 'Mark’s exorcisms emphasize:', options: ['Jesus’ authority', 'Only ritual law', 'Only genealogy', 'Only politics'], correct: 0, explanation: 'They emphasize authority.' },
        { question: 'Public response includes:', options: ['Amazement and fear', 'No reaction', 'Only celebration', 'Only rejection'], correct: 0, explanation: 'Responses include amazement and fear.' }
      ]
    },
    {
      id: '03',
      title: 'Matthew: Demonology',
      icon: '📖',
      duration: '25 min',
      content: [
        {
          heading: 'Matthew’s Accounts',
          text: 'Matthew includes exorcisms and references to demons (e.g., Matthew 8:28–34; 12:22–28).'
        },
        {
          heading: 'Kingdom Context',
          text: 'Matthew frames exorcisms within the arrival of God’s kingdom (Matthew 12:28).'
        }
      ],
      keyTerms: [
        { term: 'Kingdom', definition: 'God’s rule as emphasized in Matthew' },
        { term: 'Exorcism', definition: 'Expulsion of a demon' },
        { term: 'Opposition', definition: 'Debates about Jesus’ authority' }
      ],
      quiz: [
        { question: 'Matthew 12:28 links exorcism to:', options: ['God’s kingdom', 'Only law codes', 'Only genealogy', 'Only ritual'], correct: 0, explanation: 'It links exorcism to God’s kingdom.' },
        { question: 'Matthew includes exorcisms such as:', options: ['Matthew 8:28–34', 'Matthew 1:1–5', 'Matthew 5:1–12', 'Matthew 26:1–5'], correct: 0, explanation: 'Matthew 8:28–34 is an exorcism account.' },
        { question: 'Opposition in Matthew involves:', options: ['Debates about authority', 'Only geography', 'Only rituals', 'Only poetry'], correct: 0, explanation: 'Opposition involves authority debates.' },
        { question: 'Matthew frames exorcism within:', options: ['Kingdom arrival', 'Only exile', 'Only temple law', 'Only prophecy'], correct: 0, explanation: 'It is framed within kingdom arrival.' },
        { question: 'Matthew’s demonology appears in:', options: ['Narrative sections', 'Only genealogy', 'Only parables', 'Only epistles'], correct: 0, explanation: 'It appears in narrative sections.' }
      ]
    },
    {
      id: '04',
      title: 'Luke: Demonology',
      icon: '📖',
      duration: '25 min',
      content: [
        {
          heading: 'Luke’s Emphasis',
          text: 'Luke records multiple exorcisms and highlights Jesus’ authority and compassion (e.g., Luke 4:33–36; 8:26–39).'
        },
        {
          heading: 'Healing and Liberation',
          text: 'Luke often frames exorcisms as acts of liberation within his broader theme of salvation.'
        }
      ],
      keyTerms: [
        { term: 'Liberation', definition: 'Release from oppression or bondage' },
        { term: 'Authority', definition: 'Command over spirits' },
        { term: 'Compassion', definition: 'Concern for the afflicted' }
      ],
      quiz: [
        { question: 'Luke includes exorcisms such as:', options: ['Luke 4:33–36', 'Luke 1:1–4', 'Luke 2:1–7', 'Luke 24:1–7'], correct: 0, explanation: 'Luke 4:33–36 is an exorcism account.' },
        { question: 'Luke frames exorcism as:', options: ['Liberation', 'Only ritual law', 'Only politics', 'Only genealogy'], correct: 0, explanation: 'He frames it as liberation.' },
        { question: 'Luke emphasizes:', options: ['Authority and compassion', 'Only ritual law', 'Only prophecy', 'Only poetry'], correct: 0, explanation: 'He emphasizes authority and compassion.' },
        { question: 'Luke’s demonology appears in:', options: ['Narrative accounts', 'Only parables', 'Only genealogy', 'Only epistles'], correct: 0, explanation: 'It appears in narrative accounts.' },
        { question: 'The Gerasene account is also in Luke:', options: ['Yes', 'No', 'Only in Matthew', 'Only in John'], correct: 0, explanation: 'Luke 8:26–39 contains the account.' }
      ]
    },
    {
      id: '05',
      title: 'Acts: Deliverance',
      icon: '🔥',
      duration: '25 min',
      content: [
        {
          heading: 'Apostolic Ministry',
          text: 'Acts records deliverance episodes associated with apostolic ministry, indicating continuity of authority in the early church.'
        },
        {
          heading: 'Public Impact',
          text: 'Deliverance stories often impact communities and lead to public response (e.g., Acts 16:16–18).'
        }
      ],
      keyTerms: [
        { term: 'Deliverance', definition: 'Release from demonic oppression' },
        { term: 'Authority', definition: 'Apostolic authority in ministry' },
        { term: 'Response', definition: 'Public reactions in Acts narratives' }
      ],
      quiz: [
        { question: 'Acts includes deliverance accounts such as:', options: ['Acts 16:16–18', 'Acts 1:1–5', 'Acts 2:1–4 only', 'Acts 28:1–3 only'], correct: 0, explanation: 'Acts 16:16–18 is a deliverance account.' },
        { question: 'Acts shows continuity of:', options: ['Authority in ministry', 'Only ritual law', 'Only genealogy', 'Only prophecy'], correct: 0, explanation: 'It shows continuity of authority.' },
        { question: 'Deliverance stories often lead to:', options: ['Public response', 'No reaction', 'Only private devotion', 'Only silence'], correct: 0, explanation: 'They lead to public response.' },
        { question: 'Acts portrays deliverance as:', options: ['Part of apostolic ministry', 'Only in the Gospels', 'Only in letters', 'Only symbolic'], correct: 0, explanation: 'It is part of apostolic ministry.' },
        { question: 'The focus of Acts is:', options: ['Early church mission', 'Only genealogy', 'Only ritual', 'Only poetry'], correct: 0, explanation: 'Acts focuses on early church mission.' }
      ]
    },
    {
      id: '06',
      title: 'Doctrinal Texts',
      icon: '📜',
      duration: '25 min',
      content: [
        {
          heading: 'Epistles and Warnings',
          text: 'Epistles reference spiritual opposition and deception (e.g., Ephesians 6:12, 1 John 4:1).'
        },
        {
          heading: 'Spiritual Conflict',
          text: 'Texts describe conflict in moral and spiritual terms, emphasizing vigilance and discernment.'
        }
      ],
      keyTerms: [
        { term: 'Spiritual Conflict', definition: 'Opposition described in moral/spiritual terms' },
        { term: 'Discernment', definition: 'Testing teaching and spirits' },
        { term: 'Deception', definition: 'Misleading spiritual claims' }
      ],
      quiz: [
        { question: 'Ephesians 6:12 emphasizes:', options: ['Spiritual conflict', 'Only ritual law', 'Only genealogy', 'Only poetry'], correct: 0, explanation: 'It emphasizes spiritual conflict.' },
        { question: '1 John 4:1 instructs:', options: ['Test the spirits', 'Ignore teaching', 'Only follow leaders', 'Only accept signs'], correct: 0, explanation: 'It instructs to test the spirits.' },
        { question: 'Epistles emphasize:', options: ['Vigilance and discernment', 'Only miracles', 'Only politics', 'Only rituals'], correct: 0, explanation: 'They emphasize vigilance and discernment.' },
        { question: 'Spiritual conflict is described as:', options: ['Moral/spiritual opposition', 'Only physical illness', 'Only politics', 'Only geography'], correct: 0, explanation: 'It is described as moral/spiritual opposition.' },
        { question: 'Deception refers to:', options: ['Misleading spiritual claims', 'Only grammar errors', 'Only translation issues', 'Only geography'], correct: 0, explanation: 'It refers to misleading spiritual claims.' }
      ]
    },
    {
      id: '07',
      title: 'Discernment and Safeguards',
      icon: '🧭',
      duration: '20 min',
      content: [
        {
          heading: 'Testing and Accountability',
          text: 'New Testament teaching stresses testing claims, communal accountability, and alignment with Scripture.'
        },
        {
          heading: 'Ethical Fruit',
          text: 'Teachings are evaluated by their ethical outcomes and consistency with biblical instruction.'
        }
      ],
      keyTerms: [
        { term: 'Accountability', definition: 'Communal evaluation of claims' },
        { term: 'Fruit', definition: 'Ethical outcomes of teaching' },
        { term: 'Testing', definition: 'Evaluation against Scripture' }
      ],
      quiz: [
        { question: 'Testing claims should use:', options: ['Scripture and accountability', 'Only emotion', 'Only tradition', 'Only speculation'], correct: 0, explanation: 'Scripture and accountability are key.' },
        { question: 'Ethical fruit refers to:', options: ['Outcomes of teaching', 'Only rituals', 'Only genealogy', 'Only politics'], correct: 0, explanation: 'It refers to outcomes of teaching.' },
        { question: 'Safeguards include:', options: ['Communal accountability', 'Isolation', 'Avoiding Scripture', 'Ignoring context'], correct: 0, explanation: 'Accountability is a safeguard.' },
        { question: 'Discernment aims to:', options: ['Protect truth and integrity', 'Promote confusion', 'Reject Scripture', 'Avoid evaluation'], correct: 0, explanation: 'It aims to protect truth and integrity.' },
        { question: 'Testing is a:', options: ['Biblical instruction', 'Modern invention only', 'Optional practice', 'Denied in the NT'], correct: 0, explanation: 'Testing is a biblical instruction.' }
      ]
    },
    {
      id: '08',
      title: 'Synthesis',
      icon: '📚',
      duration: '20 min',
      content: [
        {
          heading: 'Text-Driven Summary',
          text: 'New Testament demonology emphasizes Jesus’ authority, the reality of spiritual opposition, and the need for discernment.'
        },
        {
          heading: 'Historical Context',
          text: 'Accounts should be read in their historical and literary contexts, respecting genre and authorial intent.'
        }
      ],
      keyTerms: [
        { term: 'Authority', definition: 'Power over unclean spirits' },
        { term: 'Discernment', definition: 'Testing teaching and claims' },
        { term: 'Context', definition: 'Historical and literary setting' }
      ],
      quiz: [
        { question: 'A text-driven synthesis should:', options: ['Follow the textual evidence', 'Impose later systems', 'Ignore context', 'Avoid Scripture'], correct: 0, explanation: 'It should follow textual evidence.' },
        { question: 'NT demonology emphasizes:', options: ['Jesus’ authority', 'Only ritual law', 'Only genealogy', 'Only politics'], correct: 0, explanation: 'It emphasizes Jesus’ authority.' },
        { question: 'Discernment is:', options: ['Central to NT teaching', 'Absent', 'Only cultural', 'Only philosophical'], correct: 0, explanation: 'It is central.' },
        { question: 'Context includes:', options: ['Historical and literary setting', 'Only modern application', 'Only tradition', 'Only speculation'], correct: 0, explanation: 'Context includes historical and literary setting.' },
        { question: 'Synthesis aims for:', options: ['Coherent summary', 'Random notes', 'Only quotations', 'Only opinions'], correct: 0, explanation: 'It aims for coherent summary.' }
      ]
    }
  ],
  finalExam: [
    { question: '“Daimōnion” means:', options: ['Demon', 'Angel', 'Teacher', 'Prophet'], correct: 0, explanation: 'It means demon.' },
    { question: 'Mark contains:', options: ['Multiple exorcisms', 'No exorcisms', 'Only parables', 'Only genealogy'], correct: 0, explanation: 'Mark contains multiple exorcisms.' },
    { question: 'Matthew 12:28 links exorcism to:', options: ['God’s kingdom', 'Only law codes', 'Only ritual', 'Only genealogy'], correct: 0, explanation: 'It links exorcism to God’s kingdom.' },
    { question: 'Luke frames exorcism as:', options: ['Liberation', 'Only ritual law', 'Only politics', 'Only genealogy'], correct: 0, explanation: 'He frames it as liberation.' },
    { question: 'Acts 16:16–18 is a:', options: ['Deliverance account', 'Genealogy', 'Law code', 'Parable'], correct: 0, explanation: 'It is a deliverance account.' },
    { question: 'Ephesians 6:12 emphasizes:', options: ['Spiritual conflict', 'Only ritual law', 'Only genealogy', 'Only poetry'], correct: 0, explanation: 'It emphasizes spiritual conflict.' },
    { question: '1 John 4:1 instructs:', options: ['Test the spirits', 'Ignore teaching', 'Only follow leaders', 'Only accept signs'], correct: 0, explanation: 'It instructs to test the spirits.' },
    { question: 'Discernment involves:', options: ['Testing by Scripture', 'Only emotion', 'Only tradition', 'Only speculation'], correct: 0, explanation: 'It involves testing by Scripture.' },
    { question: 'NT demonology emphasizes:', options: ['Jesus’ authority', 'Only ritual law', 'Only genealogy', 'Only politics'], correct: 0, explanation: 'It emphasizes Jesus’ authority.' },
    { question: 'Context refers to:', options: ['Historical and literary setting', 'Only modern application', 'Only tradition', 'Only speculation'], correct: 0, explanation: 'Context is historical and literary setting.' }
  ],
  about: {
    level: 'Associate-Level Course',
    description: 'A text-driven survey of New Testament demonology focused on explicit passages, historical context, and discernment without denominational bias.',
    credits: '3 credits',
    prerequisites: 'New Testament Survey recommended'
  }
};

export default demonologyCourse;
