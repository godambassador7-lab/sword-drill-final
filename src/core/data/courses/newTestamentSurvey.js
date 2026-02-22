const newTestamentSurveyCourse = {
  id: 'newTestamentSurvey',
  title: 'New Testament Survey',
  subtitle: 'Associate-Level Course | 12 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Introduction and Context',
      icon: '✝️',
      duration: '30 min',
      content: [
        {
          heading: 'Historical Setting',
          text: 'The New Testament emerges in the Roman imperial period, within Second Temple Judaism. Key contexts include Roman governance, Hellenistic culture, and Jewish expectations of restoration.'
        },
        {
          heading: 'Languages and Transmission',
          text: 'Most New Testament writings were composed in Koine Greek. The texts circulated as manuscripts, copied and transmitted across communities.'
        },
        {
          heading: 'Purpose of the Survey',
          text: 'This survey traces the storyline from Jesus’ ministry through the early church and apostolic writings, focusing on historical setting and textual evidence.'
        }
      ],
      keyTerms: [
        { term: 'Second Temple Period', definition: 'Jewish history from the return from exile to AD 70' },
        { term: 'Koine Greek', definition: 'Common Greek used in the first-century Mediterranean world' },
        { term: 'Manuscripts', definition: 'Hand-copied textual witnesses' }
      ],
      quiz: [
        { question: 'The New Testament was written primarily in:', options: ['Hebrew', 'Koine Greek', 'Latin', 'Aramaic only'], correct: 1, explanation: 'The NT was primarily written in Koine Greek.' },
        { question: 'The NT historical setting includes:', options: ['Roman rule and Second Temple Judaism', 'Only Babylonian exile', 'Only Persian rule', 'Only medieval Europe'], correct: 0, explanation: 'Roman rule and Second Temple Judaism shaped the setting.' },
        { question: 'A survey course focuses on:', options: ['Only verse-by-verse commentary', 'Historical setting and major themes', 'Only archaeology', 'Only devotional reflections'], correct: 1, explanation: 'Surveys focus on setting and themes.' },
        { question: 'NT texts were transmitted as:', options: ['Printed books', 'Manuscripts', 'Stone inscriptions only', 'Audio recordings'], correct: 1, explanation: 'They were transmitted as manuscripts.' },
        { question: 'Second Temple Judaism refers to:', options: ['Only the exile', 'Jewish history from return to AD 70', 'Only the monarchy', 'Only the prophets'], correct: 1, explanation: 'It refers to the period from return to AD 70.' }
      ]
    },
    {
      id: '02',
      title: 'The Gospels',
      icon: '📖',
      duration: '35 min',
      content: [
        {
          heading: 'Fourfold Witness',
          text: 'Matthew, Mark, Luke, and John present four accounts of Jesus’ life, teaching, death, and resurrection. Each Gospel shapes its narrative to address specific audiences and themes.'
        },
        {
          heading: 'Kingdom and Messiah',
          text: 'The Gospels emphasize Jesus’ proclamation of the kingdom of God, His identity as Messiah, and His fulfillment of Scripture.'
        },
        {
          heading: 'Historical and Literary Features',
          text: 'Gospels combine narrative, teaching, parables, and miracle accounts. They are theological histories rooted in real events.'
        }
      ],
      keyTerms: [
        { term: 'Gospel', definition: 'Good news about Jesus’ life, death, and resurrection' },
        { term: 'Messiah', definition: 'Anointed leader promised in Scripture' },
        { term: 'Kingdom of God', definition: 'God’s rule breaking into history' }
      ],
      quiz: [
        { question: 'The Gospels are:', options: ['Letters', 'Four narrative accounts of Jesus', 'Prophetic oracles only', 'Wisdom collections'], correct: 1, explanation: 'The Gospels are four narrative accounts.' },
        { question: 'A central Gospel theme is:', options: ['Only exile', 'Kingdom of God', 'Only ritual law', 'Only genealogy'], correct: 1, explanation: 'The kingdom of God is central.' },
        { question: 'The Gospels are best described as:', options: ['Fictional myths', 'Theological histories', 'Only poetry', 'Only legal codes'], correct: 1, explanation: 'They are theological histories of real events.' },
        { question: '“Messiah” means:', options: ['Teacher', 'Anointed one', 'Priest only', 'Prophet only'], correct: 1, explanation: 'Messiah means anointed one.' },
        { question: 'Each Gospel has:', options: ['The same emphases', 'Distinct emphases and audiences', 'No historical content', 'Only genealogies'], correct: 1, explanation: 'Each Gospel has distinct emphases.' }
      ]
    },
    {
      id: '03',
      title: 'The Synoptic Problem',
      icon: '🧩',
      duration: '25 min',
      content: [
        {
          heading: 'Definition',
          text: 'The Synoptic Problem concerns the literary relationships among Matthew, Mark, and Luke, which share significant overlap in content and wording.'
        },
        {
          heading: 'Shared Material',
          text: 'These Gospels contain common pericopes, often arranged in similar sequences. This suggests literary dependence or shared sources.'
        },
        {
          heading: 'Interpretive Impact',
          text: 'Understanding the synoptic relationships helps interpreters compare perspectives and recognize distinct emphases.'
        }
      ],
      keyTerms: [
        { term: 'Synoptic', definition: '“Seen together,” referring to Matthew, Mark, and Luke' },
        { term: 'Pericope', definition: 'A discrete unit of Gospel narrative' },
        { term: 'Literary Dependence', definition: 'Use of one text in composing another' }
      ],
      quiz: [
        { question: 'The Synoptic Gospels are:', options: ['Matthew, Mark, Luke', 'Matthew, Mark, John', 'Luke, John, Acts', 'Romans, Corinthians, Galatians'], correct: 0, explanation: 'Matthew, Mark, and Luke are synoptic.' },
        { question: 'The Synoptic Problem addresses:', options: ['Historical accuracy only', 'Literary relationships among the Synoptics', 'Only theological themes', 'Only manuscript variation'], correct: 1, explanation: 'It addresses literary relationships.' },
        { question: '“Pericope” means:', options: ['A manuscript', 'A unit of narrative', 'A Greek verb form', 'A prophecy'], correct: 1, explanation: 'A pericope is a discrete narrative unit.' },
        { question: 'Synoptic comparison helps identify:', options: ['Distinct emphases', 'No differences', 'Only errors', 'Only geography'], correct: 0, explanation: 'It helps identify distinct emphases.' },
        { question: 'Shared material in the Synoptics suggests:', options: ['No relationship', 'Some form of literary relationship or shared sources', 'Only oral tradition', 'Only later editing'], correct: 1, explanation: 'Shared material suggests a relationship.' }
      ]
    },
    {
      id: '04',
      title: 'Gospel of John',
      icon: '🕊️',
      duration: '25 min',
      content: [
        {
          heading: 'Distinctive Profile',
          text: 'John’s Gospel has a distinct structure and vocabulary, emphasizing signs, discourses, and the identity of Jesus.'
        },
        {
          heading: 'The Word and Incarnation',
          text: 'John opens with the Logos prologue, presenting Jesus as the Word made flesh. The Gospel highlights belief and eternal life.'
        },
        {
          heading: 'Signs and Belief',
          text: 'John organizes his narrative around signs that reveal Jesus’ identity and invite belief.'
        }
      ],
      keyTerms: [
        { term: 'Logos', definition: '“Word,” a key term in John 1' },
        { term: 'Signs', definition: 'Miracles that reveal Jesus’ identity' },
        { term: 'Belief', definition: 'Trust in Jesus as central response' }
      ],
      quiz: [
        { question: 'John’s Gospel is distinctive for its:', options: ['Parables only', 'Signs and discourses', 'Genealogies only', 'Shortest length'], correct: 1, explanation: 'John emphasizes signs and discourses.' },
        { question: 'The prologue of John presents Jesus as:', options: ['A prophet only', 'The Word (Logos)', 'A priest only', 'A king only'], correct: 1, explanation: 'John presents Jesus as the Logos.' },
        { question: 'John’s signs are meant to:', options: ['Distract readers', 'Reveal identity and invite belief', 'Replace narrative', 'Cancel history'], correct: 1, explanation: 'Signs reveal identity and invite belief.' },
        { question: 'A key theme in John is:', options: ['Belief and eternal life', 'Only exile', 'Only law', 'Only wisdom'], correct: 0, explanation: 'Belief and eternal life are key themes.' },
        { question: 'John’s Gospel is:', options: ['One of the Synoptics', 'Distinct from the Synoptics', 'Only poetic', 'Only apocalyptic'], correct: 1, explanation: 'John is distinct from the Synoptics.' }
      ]
    },
    {
      id: '05',
      title: 'Acts of the Apostles',
      icon: '🔥',
      duration: '30 min',
      content: [
        {
          heading: 'Continuation of Luke',
          text: 'Acts continues the narrative begun in Luke, tracing the early church from Jerusalem to the wider Mediterranean.'
        },
        {
          heading: 'Spirit and Mission',
          text: 'The Holy Spirit empowers the apostles for witness. The book emphasizes mission to both Jews and Gentiles.'
        },
        {
          heading: 'Key Events',
          text: 'Pentecost, the Jerusalem council, and Paul’s missionary journeys are central milestones.'
        }
      ],
      keyTerms: [
        { term: 'Pentecost', definition: 'Outpouring of the Spirit in Acts 2' },
        { term: 'Mission', definition: 'The spread of the message of Jesus' },
        { term: 'Jerusalem Council', definition: 'Decision on Gentile inclusion in Acts 15' }
      ],
      quiz: [
        { question: 'Acts continues the narrative of:', options: ['Matthew', 'Mark', 'Luke', 'John'], correct: 2, explanation: 'Acts continues Luke’s narrative.' },
        { question: 'A major theme of Acts is:', options: ['Temple architecture', 'Spirit-empowered mission', 'Exile return', 'Wisdom sayings'], correct: 1, explanation: 'Acts emphasizes Spirit-empowered mission.' },
        { question: 'Pentecost occurs in:', options: ['Acts 2', 'Acts 15', 'Acts 28', 'Acts 9'], correct: 0, explanation: 'Pentecost is in Acts 2.' },
        { question: 'The Jerusalem Council addresses:', options: ['Roman taxation', 'Gentile inclusion', 'Temple rebuilding', 'Exile'], correct: 1, explanation: 'Acts 15 addresses Gentile inclusion.' },
        { question: 'Acts traces the movement from:', options: ['Babylon to Jerusalem', 'Jerusalem to the nations', 'Rome to Jerusalem', 'Egypt to Sinai'], correct: 1, explanation: 'Acts traces from Jerusalem to the nations.' }
      ]
    },
    {
      id: '06',
      title: 'Pauline Epistles',
      icon: '✉️',
      duration: '35 min',
      content: [
        {
          heading: 'Letters to Churches',
          text: 'Paul’s letters address specific communities (e.g., Romans, Corinthians, Galatians) and respond to theological and ethical issues.'
        },
        {
          heading: 'Core Themes',
          text: 'Key themes include the gospel, faith, grace, unity in Christ, and ethical living in community.'
        },
        {
          heading: 'Occasional Nature',
          text: 'Paul’s letters are occasional, meaning they respond to real situations. Interpretation must consider these contexts.'
        }
      ],
      keyTerms: [
        { term: 'Epistle', definition: 'A letter written to a community or individual' },
        { term: 'Justification', definition: 'Right standing with God, a theme in Paul' },
        { term: 'Sanctification', definition: 'Moral transformation and holiness' }
      ],
      quiz: [
        { question: 'Pauline epistles are:', options: ['Narratives', 'Letters', 'Prophecies only', 'Poetry'], correct: 1, explanation: 'They are letters.' },
        { question: 'Paul’s letters are “occasional” because:', options: ['They are rare', 'They respond to specific situations', 'They are anonymous', 'They are poetic'], correct: 1, explanation: 'They respond to real situations.' },
        { question: 'A major Pauline theme is:', options: ['Exile return', 'Faith and grace', 'Only rituals', 'Only genealogy'], correct: 1, explanation: 'Faith and grace are major themes.' },
        { question: 'Romans is addressed to:', options: ['A specific church in Rome', 'Only individuals', 'Only Israel', 'No audience'], correct: 0, explanation: 'Romans is addressed to the church in Rome.' },
        { question: 'Interpretation of epistles should consider:', options: ['Context and audience', 'Only word studies', 'Only modern application', 'Only historical archaeology'], correct: 0, explanation: 'Context and audience matter.' }
      ]
    },
    {
      id: '07',
      title: 'Prison and Pastoral Epistles',
      icon: '🔒',
      duration: '30 min',
      content: [
        {
          heading: 'Prison Epistles',
          text: 'Ephesians, Philippians, Colossians, and Philemon are often called prison epistles, emphasizing unity, joy, and Christ’s supremacy.'
        },
        {
          heading: 'Pastoral Epistles',
          text: '1–2 Timothy and Titus address leadership, doctrine, and community order in the early church.'
        },
        {
          heading: 'Historical Setting',
          text: 'These letters reflect challenges of sustaining faithful communities across diverse contexts.'
        }
      ],
      keyTerms: [
        { term: 'Prison Epistles', definition: 'Letters associated with Paul’s imprisonment' },
        { term: 'Pastoral Epistles', definition: 'Letters focused on leadership and church order' },
        { term: 'Christology', definition: 'Teachings about the identity and work of Jesus' }
      ],
      quiz: [
        { question: 'The prison epistles include:', options: ['Romans and Galatians', 'Ephesians, Philippians, Colossians, Philemon', 'Hebrews and James', 'Matthew and Mark'], correct: 1, explanation: 'Those four are commonly called prison epistles.' },
        { question: 'The pastoral epistles are:', options: ['1–2 Timothy and Titus', 'Romans and Corinthians', 'James and Peter', 'Matthew and Luke'], correct: 0, explanation: 'The pastoral epistles are 1–2 Timothy and Titus.' },
        { question: 'Pastoral epistles focus on:', options: ['Temple rituals', 'Leadership and doctrine', 'Only apocalyptic visions', 'Only poetry'], correct: 1, explanation: 'They focus on leadership and doctrine.' },
        { question: 'Colossians emphasizes:', options: ['Christ’s supremacy', 'Exile return', 'Temple rituals only', 'Genealogy'], correct: 0, explanation: 'Colossians emphasizes Christ’s supremacy.' },
        { question: 'Philemon is addressed to:', options: ['A church council', 'An individual about reconciliation', 'A royal court', 'No one in particular'], correct: 1, explanation: 'Philemon addresses reconciliation with an individual.' }
      ]
    },
    {
      id: '08',
      title: 'General Epistles',
      icon: '📜',
      duration: '30 min',
      content: [
        {
          heading: 'Scope',
          text: 'The General Epistles include Hebrews, James, 1–2 Peter, 1–3 John, and Jude. They address broader audiences and themes.'
        },
        {
          heading: 'Key Themes',
          text: 'Themes include perseverance, practical faith, holiness, and discernment against false teaching.'
        },
        {
          heading: 'Distinctive Voices',
          text: 'Each letter has a distinct profile: James emphasizes faith and works, Hebrews emphasizes priesthood, and John emphasizes love and truth.'
        }
      ],
      keyTerms: [
        { term: 'General Epistles', definition: 'Letters addressed broadly to churches or believers' },
        { term: 'Perseverance', definition: 'Steadfast endurance in faith' },
        { term: 'Discernment', definition: 'Testing teaching and practice for truth' }
      ],
      quiz: [
        { question: 'The General Epistles include:', options: ['Romans and Galatians', 'Hebrews, James, 1–2 Peter, 1–3 John, Jude', 'Matthew and Luke', 'Acts and Revelation'], correct: 1, explanation: 'Those books comprise the General Epistles.' },
        { question: 'James emphasizes:', options: ['Apocalyptic visions', 'Faith that works in practice', 'Only temple rituals', 'Only genealogy'], correct: 1, explanation: 'James emphasizes practical faith.' },
        { question: 'Hebrews emphasizes:', options: ['Priesthood and covenant', 'Only kingship', 'Only prophecy', 'Only law codes'], correct: 0, explanation: 'Hebrews emphasizes priesthood and covenant.' },
        { question: '1 John emphasizes:', options: ['Love and truth', 'Temple rituals', 'Exile', 'Genealogies'], correct: 0, explanation: '1 John emphasizes love and truth.' },
        { question: 'General Epistles are called “general” because:', options: ['They are less important', 'They address broader audiences', 'They are only short', 'They are only legal'], correct: 1, explanation: 'They address broader audiences.' }
      ]
    },
    {
      id: '09',
      title: 'Revelation',
      icon: '👁️',
      duration: '30 min',
      content: [
        {
          heading: 'Apocalyptic Genre',
          text: 'Revelation uses apocalyptic imagery, visions, and symbols to communicate hope and warning. It draws heavily on Old Testament imagery.'
        },
        {
          heading: 'Seven Churches',
          text: 'The book begins with messages to seven churches in Asia Minor, addressing faithfulness, compromise, and endurance.'
        },
        {
          heading: 'Hope and Judgment',
          text: 'Revelation presents a final vision of God’s victory, judgment, and the renewal of creation.'
        }
      ],
      keyTerms: [
        { term: 'Apocalyptic', definition: 'Symbolic visionary literature' },
        { term: 'Seven Churches', definition: 'Congregations addressed in Revelation 2–3' },
        { term: 'New Creation', definition: 'The renewed world in Revelation 21–22' }
      ],
      quiz: [
        { question: 'Revelation is an example of:', options: ['Wisdom literature', 'Apocalyptic literature', 'Historical narrative only', 'Legal code'], correct: 1, explanation: 'Revelation is apocalyptic.' },
        { question: 'Revelation begins with messages to:', options: ['Twelve tribes', 'Seven churches', 'Only Israel', 'Only Rome'], correct: 1, explanation: 'It begins with seven churches.' },
        { question: 'Revelation draws imagery from:', options: ['Only Greek myths', 'Old Testament texts', 'Modern sources', 'No other sources'], correct: 1, explanation: 'It draws heavily on the Old Testament.' },
        { question: 'A major theme is:', options: ['God’s final victory and renewal', 'Only genealogy', 'Only ritual law', 'Only exile'], correct: 0, explanation: 'It emphasizes God’s victory and renewal.' },
        { question: 'The final vision includes:', options: ['A new creation', 'Only exile', 'Only conquest', 'Only temple rituals'], correct: 0, explanation: 'It includes a new creation.' }
      ]
    },
    {
      id: '10',
      title: 'Theological Themes',
      icon: '⭐',
      duration: '25 min',
      content: [
        {
          heading: 'Christ and Salvation',
          text: 'The New Testament presents Jesus as Messiah and Lord, emphasizing His death and resurrection as central to salvation.'
        },
        {
          heading: 'Church and Mission',
          text: 'The church is portrayed as a community of faith, called to witness and live in unity across cultural boundaries.'
        },
        {
          heading: 'Ethics and New Life',
          text: 'Ethical instruction emphasizes transformed life, love, and holiness rooted in the gospel.'
        }
      ],
      keyTerms: [
        { term: 'Gospel', definition: 'Good news centered on Jesus’ life, death, and resurrection' },
        { term: 'Church', definition: 'The community of believers in Christ' },
        { term: 'Discipleship', definition: 'Learning and following Jesus’ teaching' }
      ],
      quiz: [
        { question: 'A central NT theme is:', options: ['Only exile', 'Christ’s death and resurrection', 'Only temple rituals', 'Only genealogy'], correct: 1, explanation: 'Christ’s death and resurrection are central.' },
        { question: 'The church is described as:', options: ['A political state', 'A community of faith', 'Only a building', 'A monarchy'], correct: 1, explanation: 'The church is a community of faith.' },
        { question: 'NT ethics emphasize:', options: ['External ritual only', 'Transformed life and love', 'Only law codes', 'Only prophecy'], correct: 1, explanation: 'Ethics emphasize transformed life and love.' },
        { question: 'Mission in the NT involves:', options: ['Only Israel', 'Witness to all nations', 'Only priests', 'Only kings'], correct: 1, explanation: 'Mission involves witness to all nations.' },
        { question: 'The gospel centers on:', options: ['Political power', 'Jesus’ life, death, resurrection', 'Only morality', 'Only tradition'], correct: 1, explanation: 'The gospel centers on Jesus’ life, death, resurrection.' }
      ]
    },
    {
      id: '11',
      title: 'OT Continuity',
      icon: '🔗',
      duration: '25 min',
      content: [
        {
          heading: 'Quotation and Allusion',
          text: 'New Testament writers quote and allude to the Old Testament to show continuity of God’s purposes.'
        },
        {
          heading: 'Covenant and Promise',
          text: 'Themes of covenant, promise, and fulfillment remain central, connecting the two testaments.'
        },
        {
          heading: 'Reading Responsibly',
          text: 'Interpretation should respect Old Testament context and avoid imposing meanings without textual support.'
        }
      ],
      keyTerms: [
        { term: 'Quotation', definition: 'Direct citation of a text' },
        { term: 'Allusion', definition: 'Indirect reference to a text' },
        { term: 'Fulfillment', definition: 'Completion or realization of a promise' }
      ],
      quiz: [
        { question: 'The NT often uses the OT through:', options: ['Quotations and allusions', 'Rejection only', 'Silence only', 'Mythology'], correct: 0, explanation: 'It often quotes and alludes.' },
        { question: 'Continuity is seen in:', options: ['Covenant and promise themes', 'Only political power', 'Only exile', 'Only ritual law'], correct: 0, explanation: 'Covenant and promise connect the Testaments.' },
        { question: 'Responsible reading should:', options: ['Ignore OT context', 'Respect OT context', 'Replace OT with NT', 'Avoid interpretation'], correct: 1, explanation: 'It should respect OT context.' },
        { question: 'Allusion means:', options: ['Direct citation only', 'Indirect reference', 'Translation style', 'Historical error'], correct: 1, explanation: 'Allusion is an indirect reference.' },
        { question: 'Fulfillment refers to:', options: ['Cancellation of OT', 'Realization of promise', 'Only ritual law', 'Only history'], correct: 1, explanation: 'Fulfillment is realization of promise.' }
      ]
    },
    {
      id: '12',
      title: 'The New Testament as a Whole',
      icon: '📚',
      duration: '25 min',
      content: [
        {
          heading: 'Unified Storyline',
          text: 'The New Testament moves from Jesus’ ministry to the spread of the church and apostolic teaching. It presents a coherent narrative and theological vision.'
        },
        {
          heading: 'Diversity and Unity',
          text: 'The texts are diverse in genre and audience but united around the identity of Jesus and the gospel.'
        },
        {
          heading: 'Reading in Canon',
          text: 'Reading each book in light of the whole canon clarifies meaning while preserving each author’s distinct voice.'
        }
      ],
      keyTerms: [
        { term: 'Canon', definition: 'The recognized collection of NT books' },
        { term: 'Unity', definition: 'Coherence in message across diverse writings' },
        { term: 'Genre', definition: 'Literary form that shapes interpretation' }
      ],
      quiz: [
        { question: 'The NT storyline moves from:', options: ['Exile to return', 'Jesus’ ministry to the early church', 'Creation to flood', 'Kingship to exile'], correct: 1, explanation: 'It moves from Jesus to the early church.' },
        { question: 'NT diversity includes:', options: ['Only narrative', 'Multiple genres and audiences', 'Only poetry', 'Only law codes'], correct: 1, explanation: 'It includes multiple genres and audiences.' },
        { question: 'Unity in the NT is centered on:', options: ['Temple rituals', 'Jesus and the gospel', 'Only genealogy', 'Only Roman politics'], correct: 1, explanation: 'Unity centers on Jesus and the gospel.' },
        { question: 'Reading in canon helps:', options: ['Erase author voices', 'Clarify meaning while respecting each text', 'Ignore context', 'Avoid interpretation'], correct: 1, explanation: 'Canon reading clarifies meaning while respecting texts.' },
        { question: 'Genre is important because it:', options: ['Eliminates context', 'Shapes interpretation', 'Replaces history', 'Avoids meaning'], correct: 1, explanation: 'Genre shapes interpretation.' }
      ]
    }
  ],
  finalExam: [
    { question: 'The NT was written primarily in:', options: ['Hebrew', 'Koine Greek', 'Latin', 'Aramaic only'], correct: 1, explanation: 'It was written primarily in Koine Greek.' },
    { question: 'The NT historical setting includes:', options: ['Roman rule and Second Temple Judaism', 'Only Babylonian exile', 'Only Persian rule', 'Only medieval Europe'], correct: 0, explanation: 'Roman rule and Second Temple Judaism shaped the setting.' },
    { question: 'The Gospels are:', options: ['Letters', 'Four narrative accounts of Jesus', 'Prophecies only', 'Wisdom collections'], correct: 1, explanation: 'They are four narrative accounts.' },
    { question: 'A key Gospel theme is:', options: ['Only exile', 'Kingdom of God', 'Only ritual law', 'Only genealogy'], correct: 1, explanation: 'The kingdom of God is central.' },
    { question: 'The Synoptic Gospels are:', options: ['Matthew, Mark, Luke', 'Matthew, Mark, John', 'Luke, John, Acts', 'Romans, Corinthians, Galatians'], correct: 0, explanation: 'Matthew, Mark, Luke are synoptic.' },
    { question: 'The Synoptic Problem concerns:', options: ['Manuscript copying only', 'Literary relationships among the Synoptics', 'Only theology', 'Only archaeology'], correct: 1, explanation: 'It concerns literary relationships.' },
    { question: 'John’s Gospel emphasizes:', options: ['Only parables', 'Signs and discourses', 'Only genealogy', 'Only apocalyptic visions'], correct: 1, explanation: 'John emphasizes signs and discourses.' },
    { question: 'Acts continues the narrative of:', options: ['Matthew', 'Mark', 'Luke', 'John'], correct: 2, explanation: 'Acts continues Luke.' },
    { question: 'A major theme of Acts is:', options: ['Temple architecture', 'Spirit-empowered mission', 'Exile return', 'Wisdom sayings'], correct: 1, explanation: 'Acts emphasizes Spirit-empowered mission.' },
    { question: 'Pauline epistles are:', options: ['Narratives', 'Letters', 'Poetry', 'Apocalyptic visions'], correct: 1, explanation: 'They are letters.' },
    { question: 'Paul’s letters are “occasional” because:', options: ['They are rare', 'They address specific situations', 'They are anonymous', 'They are poetic'], correct: 1, explanation: 'They respond to specific situations.' },
    { question: 'Prison epistles include:', options: ['Ephesians, Philippians, Colossians, Philemon', 'Romans and Galatians', 'Hebrews and James', 'Matthew and Mark'], correct: 0, explanation: 'Those four are commonly called prison epistles.' },
    { question: 'Pastoral epistles are:', options: ['1–2 Timothy and Titus', 'Romans and Corinthians', 'James and Peter', 'Matthew and Luke'], correct: 0, explanation: 'They are 1–2 Timothy and Titus.' },
    { question: 'General Epistles include:', options: ['Hebrews, James, 1–2 Peter, 1–3 John, Jude', 'Romans and Galatians', 'Matthew and Luke', 'Acts and Revelation'], correct: 0, explanation: 'These books are the General Epistles.' },
    { question: 'Revelation is:', options: ['Wisdom literature', 'Apocalyptic literature', 'Historical narrative only', 'Legal code'], correct: 1, explanation: 'Revelation is apocalyptic.' },
    { question: 'A central NT theme is:', options: ['Only exile', 'Christ’s death and resurrection', 'Only ritual law', 'Only genealogy'], correct: 1, explanation: 'Christ’s death and resurrection are central.' },
    { question: 'The church is presented as:', options: ['A political state', 'A community of faith', 'Only a building', 'A monarchy'], correct: 1, explanation: 'The church is a community of faith.' },
    { question: 'The NT often uses the OT through:', options: ['Quotations and allusions', 'Rejection only', 'Silence only', 'Mythology'], correct: 0, explanation: 'It uses OT quotations and allusions.' },
    { question: 'Allusion means:', options: ['Direct citation only', 'Indirect reference', 'Translation style', 'Historical error'], correct: 1, explanation: 'Allusion is an indirect reference.' },
    { question: 'The NT storyline moves from:', options: ['Creation to flood', 'Jesus’ ministry to the early church', 'Kingship to exile', 'Exile to return'], correct: 1, explanation: 'It moves from Jesus to the early church.' }
  ],
  about: {
    level: 'Associate-Level Course',
    description: 'A comprehensive, text-driven survey of the New Testament emphasizing historical context, literary structure, and core themes without denominational bias.',
    credits: '3 credits',
    prerequisites: 'Basic biblical literacy'
  }
};

export default newTestamentSurveyCourse;
