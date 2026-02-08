const worldReligionsCourse = {
  id: 'worldReligions',
  title: 'World Religions: Origins, Claims, and Biblical Evaluation',
  subtitle: 'Upper-Level Course | 7 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  theme: {
    accentText: 'text-amber-300',
    accentTextStrong: 'text-amber-400',
    accentBorder: 'border-amber-500/50',
    accentBorderSoft: 'border-amber-500/30',
    accentBgSoft: 'from-amber-900/40 to-orange-900/40',
    accentBgSoftAlt: 'from-amber-900/30 to-orange-900/30',
    accentBgSolid: 'from-amber-600 to-orange-600',
    accentBgSolidHover: 'from-amber-500 to-orange-500',
    quizAccentBg: 'from-amber-600 to-orange-600',
    examAccentBg: 'from-amber-600 to-orange-600',
    examAccentBgHover: 'from-amber-500 to-orange-500',
    examBorder: 'border-amber-500/50',
    examText: 'text-amber-300',
    badgeLesson: 'text-emerald-400',
    badgeQuiz: 'text-amber-300'
  },
  units: [
    {
      id: '01',
      title: 'What Is Religion?',
      icon: '📜',
      duration: '20 min',
      content: [
        {
          heading: 'Biblical Definition',
          text: 'In Scripture, religion is not merely belief but allegiance, worship, and obedience. It is covenantal, exclusive, and grounded in revelation (Deuteronomy 6:4-5; Exodus 20:1-3).'
        },
        {
          heading: 'Core Questions',
          text: 'Every religion answers: (1) Who or what is the object of worship? (2) What law or instruction governs life? (3) What is the means of restoration? (4) What is the final end?'
        },
        {
          heading: 'Biblical Boundary',
          text: 'Any system answering those questions apart from the LORD (YHWH) constitutes another religion. Scripture frames true religion as worship of the one Creator in covenant obedience (James 1:27).'
        }
      ],
      keyTerms: [
        { term: 'Covenant', definition: 'A binding relationship established by God with defined terms' },
        { term: 'Monotheism', definition: 'Worship of one true God' },
        { term: 'Revelation', definition: 'God making Himself and His will known' }
      ],
      quiz: [
        { question: 'In Scripture, religion is primarily:', options: ['Allegiance, worship, and obedience', 'Private opinion only', 'Cultural tradition only', 'Political loyalty only'], correct: 0, explanation: 'Biblical religion is covenantal allegiance, worship, and obedience.' },
        { question: 'Which text anchors exclusive worship of the LORD?', options: ['Deuteronomy 6:4-5', 'Proverbs 1:1', 'Song of Songs 2:1', 'Ecclesiastes 4:9'], correct: 0, explanation: 'Deuteronomy 6:4-5 commands exclusive love for the LORD.' },
        { question: 'One core question every religion answers is:', options: ['What is the object of worship?', 'Which city is largest?', 'How many languages exist?', 'What is the oldest manuscript?'], correct: 0, explanation: 'Religions define the object of worship.' },
        { question: 'Biblical religion is best described as:', options: ['Covenantal and revelatory', 'Purely speculative', 'Only ethical advice', 'Only ritual without doctrine'], correct: 0, explanation: 'Scripture presents religion as covenantal and revelatory.' },
        { question: 'James 1:27 emphasizes religion that is:', options: ['Pure and undefiled before God', 'Only ceremonial', 'Merely philosophical', 'Primarily economic'], correct: 0, explanation: 'James 1:27 defines pure religion before God.' }
      ]
    },
    {
      id: '02',
      title: 'Ancient Polytheism',
      icon: '🏺',
      duration: '20 min',
      content: [
        {
          heading: 'Historical Setting',
          text: 'Ancient religions were territorial, national, and hierarchical. Deities were viewed as limited and localized, often in conflict within pantheons (Mesopotamian, Egyptian, and Canaanite systems).'
        },
        {
          heading: 'Biblical Response',
          text: 'Scripture rejects polytheism and affirms the LORD as the only God (Isaiah 45:5-7). Deuteronomy 32 and Psalm 82 confront false worship and the emptiness of rival claims.'
        }
      ],
      keyTerms: [
        { term: 'Polytheism', definition: 'Worship of many gods' },
        { term: 'Pantheon', definition: 'A group of deities within a religious system' },
        { term: 'Idolatry', definition: 'Worship directed to anything other than God' }
      ],
      quiz: [
        { question: 'Ancient polytheism was often:', options: ['Territorial and national', 'Universal and monolithic', 'Non-ritualistic', 'Free of hierarchy'], correct: 0, explanation: 'Ancient religions were tied to territories and nations.' },
        { question: 'Which biblical text affirms the LORD as the only God?', options: ['Isaiah 45:5-7', 'Ruth 2:12', 'Nehemiah 3:1', 'Jonah 2:1'], correct: 0, explanation: 'Isaiah 45:5-7 affirms exclusive deity.' },
        { question: 'A pantheon refers to:', options: ['A group of deities', 'A single prophet', 'A temple building', 'A holy city'], correct: 0, explanation: 'Pantheon means a group of gods.' },
        { question: 'Deuteronomy 32 is relevant because it:', options: ['Rejects rival worship', 'Defines temple measurements', 'Lists genealogies', 'Describes creation only'], correct: 0, explanation: 'Deuteronomy 32 confronts idolatry and rival claims.' },
        { question: 'Idolatry is:', options: ['Worship of anything other than God', 'Only political rebellion', 'Only art appreciation', 'Only mythological storytelling'], correct: 0, explanation: 'Idolatry is worship directed away from the LORD.' }
      ]
    },
    {
      id: '03',
      title: 'Eastern Religions',
      icon: '☸️',
      duration: '20 min',
      content: [
        {
          heading: 'Cyclical Worldview',
          text: 'Many Eastern religions (Hinduism, Buddhism) view reality as cyclical. Salvation is often described as escape from the cycle rather than restoration of creation.'
        },
        {
          heading: 'Key Contrasts',
          text: 'Biblically, God is a personal Creator (Genesis 1). Scripture teaches resurrection and final judgment (Daniel 12:2; Hebrews 9:27), not endless cycles.'
        }
      ],
      keyTerms: [
        { term: 'Cyclical View', definition: 'History understood as repeating cycles' },
        { term: 'Resurrection', definition: 'Raising the dead to life in God’s final judgment' },
        { term: 'Creator', definition: 'Personal God who made all things' }
      ],
      quiz: [
        { question: 'Eastern systems commonly view reality as:', options: ['Cyclical', 'Linear to final judgment', 'Random and purposeless', 'Only material'], correct: 0, explanation: 'Many Eastern religions describe cyclical reality.' },
        { question: 'Genesis 1 teaches:', options: ['A personal Creator', 'An impersonal force only', 'Endless cycles', 'No creation'], correct: 0, explanation: 'Genesis 1 presents God as personal Creator.' },
        { question: 'Daniel 12:2 supports:', options: ['Resurrection', 'Reincarnation', 'No afterlife', 'Only symbolism'], correct: 0, explanation: 'Daniel 12:2 teaches resurrection.' },
        { question: 'Hebrews 9:27 emphasizes:', options: ['Judgment after death', 'Endless rebirth', 'No accountability', 'Only moral lessons'], correct: 0, explanation: 'Hebrews 9:27 teaches judgment after death.' },
        { question: 'Biblical salvation is described as:', options: ['Restoration through God’s covenant', 'Escape into non-existence', 'Endless cycles of return', 'Purely self-attained enlightenment'], correct: 0, explanation: 'Scripture frames restoration through God’s covenant.' }
      ]
    },
    {
      id: '04',
      title: 'Islam',
      icon: '🕌',
      duration: '20 min',
      content: [
        {
          heading: 'Claims and Differences',
          text: 'Islam claims continuity with Abrahamic faith but denies the Sonship of Christ and the crucifixion and resurrection (as affirmed in the New Testament).'
        },
        {
          heading: 'Biblical Evaluation',
          text: 'Scripture centers salvation on the death and resurrection of Jesus Christ (1 Corinthians 15:1-4) and affirms His divine identity (John 1:1, 14).'
        }
      ],
      keyTerms: [
        { term: 'Incarnation', definition: 'The Son of God taking on human nature in Jesus' },
        { term: 'Crucifixion', definition: 'The death of Jesus on the cross' },
        { term: 'Resurrection', definition: 'Jesus raised from the dead' }
      ],
      quiz: [
        { question: 'The New Testament affirms Jesus as:', options: ['The Word made flesh', 'Only a prophet', 'A created angel', 'A myth'], correct: 0, explanation: 'John 1:1, 14 affirms the Word made flesh.' },
        { question: '1 Corinthians 15:1-4 centers on:', options: ['Jesus’ death and resurrection', 'Temple measurements', 'Dietary laws only', 'Royal genealogies'], correct: 0, explanation: 'It summarizes the gospel: death, burial, resurrection.' },
        { question: 'A key difference highlighted in this unit is:', options: ['View of the crucifixion and resurrection', 'Use of parables', 'Number of prophets in Israel', 'Language of the Psalms'], correct: 0, explanation: 'The central contrast is Christ’s death and resurrection.' },
        { question: 'The term “incarnation” refers to:', options: ['God the Son taking human nature', 'A vision of angels', 'A ritual washing', 'A festival offering'], correct: 0, explanation: 'Incarnation is the Son taking human nature.' },
        { question: 'Biblical evaluation focuses on:', options: ['The person and work of Jesus', 'Only cultural practices', 'Only politics', 'Only architecture'], correct: 0, explanation: 'Scripture evaluates claims through Christ’s identity and work.' }
      ]
    },
    {
      id: '05',
      title: 'Judaism and Second Temple Sects',
      icon: '✡️',
      duration: '20 min',
      content: [
        {
          heading: 'Second Temple Context',
          text: 'Pharisees, Sadducees, and Essenes shaped Jewish life before the destruction of the Temple. After AD 70, Rabbinic Judaism developed with greater focus on oral law.'
        },
        {
          heading: 'Central Issues',
          text: 'Scripture presents the Messiah and His authority as the decisive issue (Matthew 23; Hebrews). Acts 15 reflects early Christian engagement with law and covenant identity.'
        }
      ],
      keyTerms: [
        { term: 'Second Temple Period', definition: 'Era from the rebuilt Temple (ca. 516 BC) to AD 70' },
        { term: 'Oral Law', definition: 'Traditions viewed as authoritative alongside Scripture' },
        { term: 'Messiah', definition: 'Anointed King promised in Scripture' }
      ],
      quiz: [
        { question: 'Second Temple sects included:', options: ['Pharisees, Sadducees, Essenes', 'Stoics, Epicureans, Cynics', 'Samaritans, Babylonians, Persians', 'Greeks, Romans, Egyptians'], correct: 0, explanation: 'These are the major Jewish sects of the period.' },
        { question: 'After AD 70, Judaism developed with a stronger emphasis on:', options: ['Oral law traditions', 'Temple sacrifices only', 'Polytheism', 'Gentile priesthood'], correct: 0, explanation: 'Rabbinic Judaism emphasized oral law.' },
        { question: 'Matthew 23 focuses on:', options: ['Jesus confronting religious leadership', 'Creation narratives', 'Temple architecture', 'Apocalyptic visions'], correct: 0, explanation: 'Matthew 23 records Jesus’ critique of religious leadership.' },
        { question: 'Acts 15 reflects:', options: ['Early church debates about law and covenant identity', 'The exile to Babylon', 'The ministry of Elijah', 'The fall of Jericho'], correct: 0, explanation: 'Acts 15 addresses law and Gentile inclusion.' },
        { question: 'The central issue highlighted is:', options: ['Messiah identity and authority', 'Agricultural calendars only', 'Roman taxation only', 'Temple geography only'], correct: 0, explanation: 'Scripture centers on Messiah identity and authority.' }
      ]
    },
    {
      id: '06',
      title: 'Christian Heresies',
      icon: '⚠️',
      duration: '20 min',
      content: [
        {
          heading: 'Common Errors',
          text: 'Groups claiming Christ while denying core truths include Gnosticism, Arianism, and Modalism. These distort the biblical witness about Christ’s nature and work.'
        },
        {
          heading: 'Biblical Tests',
          text: 'Scripture tests teaching by confession of Jesus Christ and alignment with apostolic doctrine (1 John; Colossians 1-2).'
        }
      ],
      keyTerms: [
        { term: 'Heresy', definition: 'Teaching that denies core biblical truth' },
        { term: 'Arianism', definition: 'Teaching that denies the full deity of Christ' },
        { term: 'Gnosticism', definition: 'Teaching that elevates secret knowledge over Scripture' }
      ],
      quiz: [
        { question: 'A key biblical test for doctrine is found in:', options: ['1 John', 'Obadiah', 'Esther', 'Haggai'], correct: 0, explanation: '1 John emphasizes confession of Christ.' },
        { question: 'Arianism denies:', options: ['The full deity of Christ', 'The existence of creation', 'The authority of Moses', 'The value of prayer'], correct: 0, explanation: 'Arianism denies Christ’s full deity.' },
        { question: 'Gnosticism emphasizes:', options: ['Secret knowledge over Scripture', 'Public confession of Christ', 'Temple sacrifices', 'Kingship of David'], correct: 0, explanation: 'Gnosticism elevates secret knowledge.' },
        { question: 'Colossians 1-2 emphasizes:', options: ['The supremacy of Christ', 'Polytheism', 'Ritual purity only', 'National boundaries'], correct: 0, explanation: 'Colossians presents Christ’s supremacy.' },
        { question: 'Heresy is best defined as:', options: ['Denial of core biblical truth', 'Any cultural difference', 'Any ritual practice', 'Any non-English translation'], correct: 0, explanation: 'Heresy denies core biblical truths.' }
      ]
    },
    {
      id: '07',
      title: 'Biblical Conclusion',
      icon: '🕊️',
      duration: '20 min',
      content: [
        {
          heading: 'Exclusivity of Salvation',
          text: 'Scripture does not teach religious pluralism. Salvation is through Christ alone (Acts 4:12).'
        },
        {
          heading: 'Final Restoration',
          text: 'God’s final plan is the restoration of creation under Christ’s reign (Revelation 21-22), grounded in the definitive revelation of the Son (Hebrews 1).'
        }
      ],
      keyTerms: [
        { term: 'Pluralism', definition: 'Claim that all religions are equally true' },
        { term: 'Salvation', definition: 'Deliverance through God’s covenant in Christ' },
        { term: 'Restoration', definition: 'God’s renewal of creation' }
      ],
      quiz: [
        { question: 'Acts 4:12 teaches:', options: ['Salvation is in Christ alone', 'All paths are equal', 'Salvation is self-attained', 'Salvation is by ancestry'], correct: 0, explanation: 'Acts 4:12 affirms salvation in Christ alone.' },
        { question: 'Hebrews 1 emphasizes:', options: ['God’s final revelation in the Son', 'The superiority of idols', 'The end of prophecy', 'Temple rebuilding plans'], correct: 0, explanation: 'Hebrews 1 presents the Son as God’s final revelation.' },
        { question: 'Revelation 21-22 describes:', options: ['Final restoration of creation', 'A return to exile', 'A new pantheon', 'The rise of ancient empires'], correct: 0, explanation: 'Revelation 21-22 describes final restoration.' },
        { question: 'Biblical pluralism is:', options: ['Rejected by Scripture', 'Required for faith', 'Taught in Acts', 'Necessary for covenant'], correct: 0, explanation: 'Scripture rejects pluralism.' },
        { question: 'Salvation is defined as:', options: ['Deliverance through God’s covenant in Christ', 'Cultural conformity', 'Political freedom only', 'Personal tradition only'], correct: 0, explanation: 'Biblical salvation is covenantal deliverance in Christ.' }
      ]
    }
  ],
  finalExam: [
    { question: 'Biblical religion is best defined as:', options: ['Covenantal allegiance to the LORD', 'Private opinion only', 'Political loyalty only', 'Cultural ritual only'], correct: 0, explanation: 'Scripture frames religion as covenantal allegiance.' },
    { question: 'A pantheon is:', options: ['A group of deities', 'A temple room', 'A prophet’s school', 'A festival calendar'], correct: 0, explanation: 'Pantheon refers to a group of gods.' },
    { question: 'Which text affirms the LORD as the only God?', options: ['Isaiah 45:5-7', 'Nehemiah 2:1', 'Ruth 1:16', 'Jonah 4:2'], correct: 0, explanation: 'Isaiah 45:5-7 affirms exclusive deity.' },
    { question: 'Daniel 12:2 and Hebrews 9:27 both teach:', options: ['Resurrection and judgment', 'Endless cycles', 'No afterlife', 'Only symbolic rebirth'], correct: 0, explanation: 'Both texts affirm resurrection and judgment.' },
    { question: 'The New Testament centers salvation on:', options: ['Jesus’ death and resurrection', 'National ancestry', 'Temple geography', 'Ritual purity alone'], correct: 0, explanation: 'The gospel centers on Jesus’ death and resurrection.' },
    { question: 'Second Temple sects included:', options: ['Pharisees, Sadducees, Essenes', 'Stoics, Epicureans, Cynics', 'Persians, Babylonians, Medes', 'Greeks, Romans, Egyptians'], correct: 0, explanation: 'These are the key Jewish sects in the period.' },
    { question: 'Acts 15 addresses:', options: ['Law and covenant identity in the early church', 'The exile to Babylon', 'The fall of Jericho', 'The division of Israel'], correct: 0, explanation: 'Acts 15 centers on law and Gentile inclusion.' },
    { question: 'Arianism denies:', options: ['The full deity of Christ', 'The existence of Scripture', 'The value of prayer', 'The need for repentance'], correct: 0, explanation: 'Arianism denies Christ’s full deity.' },
    { question: '1 John tests doctrine by:', options: ['Confession of Jesus Christ', 'Temple sacrifices', 'National borders', 'Genealogies'], correct: 0, explanation: '1 John tests by confession of Christ.' },
    { question: 'Acts 4:12 teaches that salvation is:', options: ['In Christ alone', 'In all religions equally', 'By ancestry', 'By ritual only'], correct: 0, explanation: 'Acts 4:12 teaches salvation in Christ alone.' },
    { question: 'Revelation 21-22 describes:', options: ['Final restoration under God’s reign', 'A return to exile', 'A new pantheon', 'The rise of ancient empires'], correct: 0, explanation: 'Revelation 21-22 describes final restoration.' },
    { question: 'Biblical religion answers restoration through:', options: ['God’s covenant fulfilled in Christ', 'Self-attained enlightenment', 'Cycles of rebirth', 'National power'], correct: 0, explanation: 'Scripture grounds restoration in God’s covenant fulfilled in Christ.' }
  ],
  about: {
    level: 'Upper-Level Course',
    description: 'A Scripture-anchored survey of major religious systems with historical context and biblical evaluation. Emphasizes careful description, primary biblical texts, and sober contrasts without denominational bias.',
    credits: '3 credits',
    prerequisites: 'Textual Criticism; Biblical Prophecy (survey-level)'
  }
};

export default worldReligionsCourse;
