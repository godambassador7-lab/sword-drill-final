const pneumatologyCourse = {
  id: 'pneumatology',
  title: 'Pneumatology',
  subtitle: 'Associate-Level Course | 10 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Ruach and Pneuma',
      icon: '🔥',
      duration: '25 min',
      content: [
        {
          heading: 'Key Terms',
          text: 'The Hebrew term “ruach” and the Greek term “pneuma” can mean spirit, breath, or wind depending on context.'
        },
        {
          heading: 'Textual Usage',
          text: 'Biblical usage shows a range of meanings: God’s Spirit, human spirit, and natural wind.'
        }
      ],
      keyTerms: [
        { term: 'Ruach', definition: 'Hebrew for spirit/breath/wind' },
        { term: 'Pneuma', definition: 'Greek for spirit/breath/wind' },
        { term: 'Semantic Range', definition: 'Range of possible meanings in context' }
      ],
      quiz: [
        { question: 'Ruach can mean:', options: ['Only spirit', 'Spirit, breath, or wind', 'Only breath', 'Only wind'], correct: 1, explanation: 'Ruach has a semantic range including spirit, breath, and wind.' },
        { question: 'Pneuma is the Greek term for:', options: ['Law', 'Spirit/breath/wind', 'Wisdom', 'Kingdom'], correct: 1, explanation: 'Pneuma means spirit/breath/wind.' },
        { question: 'Semantic range refers to:', options: ['Word spelling', 'Range of meanings', 'Only pronunciation', 'Only grammar'], correct: 1, explanation: 'Semantic range is the range of meanings.' },
        { question: 'Context determines:', options: ['Word meaning', 'Only punctuation', 'Only genre', 'Only syntax'], correct: 0, explanation: 'Context determines meaning.' },
        { question: 'Both terms appear in:', options: ['Hebrew and Greek texts', 'Only Latin texts', 'Only modern texts', 'Only poetry'], correct: 0, explanation: 'They appear in Hebrew and Greek texts.' }
      ]
    },
    {
      id: '02',
      title: 'Spirit in Creation',
      icon: '🌍',
      duration: '25 min',
      content: [
        {
          heading: 'Creation Texts',
          text: 'Genesis 1:2 references God’s Spirit (ruach) hovering over the waters. Other texts associate God’s Spirit with life and creation.'
        },
        {
          heading: 'Life and Breath',
          text: 'Breath imagery links God’s Spirit with life-giving power (e.g., Job 33:4).'
        }
      ],
      keyTerms: [
        { term: 'Creation', definition: 'God’s act of bringing the world into being' },
        { term: 'Life-Giving', definition: 'Role associated with God’s Spirit' },
        { term: 'Hovering', definition: 'Genesis 1:2 imagery of the Spirit' }
      ],
      quiz: [
        { question: 'Genesis 1:2 mentions:', options: ['Kingship', 'God’s Spirit', 'Only angels', 'Only law'], correct: 1, explanation: 'Genesis 1:2 mentions God’s Spirit.' },
        { question: 'Job 33:4 connects God’s Spirit with:', options: ['Life and breath', 'Only judgment', 'Only prophecy', 'Only law'], correct: 0, explanation: 'It connects Spirit with life and breath.' },
        { question: 'Creation texts portray the Spirit as:', options: ['Life-giving', 'Only destructive', 'Only silent', 'Only human'], correct: 0, explanation: 'They portray the Spirit as life-giving.' },
        { question: 'The Spirit “hovering” appears in:', options: ['Genesis 1:2', 'Exodus 20', 'Psalm 1', 'Daniel 7'], correct: 0, explanation: 'It appears in Genesis 1:2.' },
        { question: 'Breath imagery emphasizes:', options: ['Life', 'Only ritual', 'Only kingship', 'Only prophecy'], correct: 0, explanation: 'Breath imagery emphasizes life.' }
      ]
    },
    {
      id: '03',
      title: 'Spirit and the Prophets',
      icon: '📣',
      duration: '25 min',
      content: [
        {
          heading: 'Empowerment for Speech',
          text: 'The Spirit is associated with prophetic inspiration and empowerment for speech (e.g., Ezekiel 2:2).'
        },
        {
          heading: 'Guidance and Vision',
          text: 'Prophetic visions and guidance are often attributed to the Spirit’s activity.'
        }
      ],
      keyTerms: [
        { term: 'Prophecy', definition: 'Divine message delivered through a prophet' },
        { term: 'Inspiration', definition: 'Spirit-empowered communication' },
        { term: 'Vision', definition: 'Revelatory experience' }
      ],
      quiz: [
        { question: 'The Spirit empowers:', options: ['Prophetic speech', 'Only kingship', 'Only ritual', 'Only genealogy'], correct: 0, explanation: 'The Spirit empowers prophetic speech.' },
        { question: 'Ezekiel 2:2 describes:', options: ['The Spirit entering and empowering', 'Temple rituals', 'Military victory', 'Genealogy'], correct: 0, explanation: 'It describes Spirit empowerment.' },
        { question: 'Prophetic visions are linked to:', options: ['The Spirit’s activity', 'Only human effort', 'Only politics', 'Only poetry'], correct: 0, explanation: 'They are linked to the Spirit’s activity.' },
        { question: 'Inspiration refers to:', options: ['Spirit-empowered communication', 'Only grammar', 'Only history', 'Only law'], correct: 0, explanation: 'Inspiration is Spirit-empowered communication.' },
        { question: 'Prophecy is:', options: ['Divine message through a prophet', 'Only moral advice', 'Only ritual law', 'Only history'], correct: 0, explanation: 'Prophecy is divine message through a prophet.' }
      ]
    },
    {
      id: '04',
      title: 'Promises of the Spirit',
      icon: '🕊️',
      duration: '20 min',
      content: [
        {
          heading: 'Prophetic Promises',
          text: 'Texts like Joel 2 and Ezekiel 36–37 describe future outpouring of God’s Spirit.'
        },
        {
          heading: 'Covenant Renewal',
          text: 'These promises are linked to renewal, restoration, and transformed hearts.'
        }
      ],
      keyTerms: [
        { term: 'Outpouring', definition: 'Promise of Spirit given widely' },
        { term: 'Renewal', definition: 'Restoration and transformation' },
        { term: 'Covenant', definition: 'Relational framework for God’s people' }
      ],
      quiz: [
        { question: 'Joel 2 promises:', options: ['A Spirit outpouring', 'Only exile', 'Only kingship', 'Only ritual'], correct: 0, explanation: 'Joel 2 promises Spirit outpouring.' },
        { question: 'Ezekiel 36–37 links the Spirit with:', options: ['Renewal and restoration', 'Only law codes', 'Only politics', 'Only genealogy'], correct: 0, explanation: 'It links Spirit with renewal.' },
        { question: 'Outpouring refers to:', options: ['Spirit given widely', 'Only prophets', 'Only kings', 'Only priests'], correct: 0, explanation: 'Outpouring refers to wide giving of the Spirit.' },
        { question: 'These promises are tied to:', options: ['Covenant renewal', 'Only conquest', 'Only exile', 'Only ritual'], correct: 0, explanation: 'They are tied to covenant renewal.' },
        { question: 'Transformed hearts are part of:', options: ['Prophetic promises', 'Only legal codes', 'Only history', 'Only poetry'], correct: 0, explanation: 'They are part of prophetic promises.' }
      ]
    },
    {
      id: '05',
      title: 'Spirit and Jesus',
      icon: '✝️',
      duration: '25 min',
      content: [
        {
          heading: 'Baptism and Empowerment',
          text: 'The Gospels describe the Spirit’s descent at Jesus’ baptism, marking empowerment for ministry.'
        },
        {
          heading: 'Spirit-Led Ministry',
          text: 'Jesus’ ministry is portrayed as Spirit-empowered, including teaching, healing, and mission.'
        }
      ],
      keyTerms: [
        { term: 'Baptism', definition: 'Event marking the Spirit’s descent on Jesus' },
        { term: 'Empowerment', definition: 'Spirit’s enabling for ministry' },
        { term: 'Ministry', definition: 'Public work of teaching and healing' }
      ],
      quiz: [
        { question: 'The Spirit descends at Jesus’:', options: ['Birth', 'Baptism', 'Resurrection', 'Ascension'], correct: 1, explanation: 'The Spirit descends at his baptism.' },
        { question: 'Jesus’ ministry is described as:', options: ['Spirit-empowered', 'Only human effort', 'Only political', 'Only ritual'], correct: 0, explanation: 'It is Spirit-empowered.' },
        { question: 'Baptism marks:', options: ['Empowerment for ministry', 'End of ministry', 'Only genealogy', 'Only prophecy'], correct: 0, explanation: 'It marks empowerment.' },
        { question: 'Spirit-led ministry includes:', options: ['Teaching and healing', 'Only ritual law', 'Only poetry', 'Only politics'], correct: 0, explanation: 'It includes teaching and healing.' },
        { question: 'The Gospels present the Spirit’s role as:', options: ['Central to Jesus’ ministry', 'Absent', 'Only symbolic', 'Only in Acts'], correct: 0, explanation: 'It is central to Jesus’ ministry.' }
      ]
    },
    {
      id: '06',
      title: 'Spirit in the Gospels',
      icon: '📖',
      duration: '20 min',
      content: [
        {
          heading: 'Gospel Portraits',
          text: 'Each Gospel highlights aspects of the Spirit’s activity: empowerment, guidance, and promise.'
        },
        {
          heading: 'Teaching on the Spirit',
          text: 'Jesus teaches about the Spirit’s role in witness and guidance, especially in John.'
        }
      ],
      keyTerms: [
        { term: 'Paraclete', definition: 'John’s term for the Spirit as helper/advocate' },
        { term: 'Witness', definition: 'Testimony empowered by the Spirit' },
        { term: 'Guidance', definition: 'Spirit’s role in leading' }
      ],
      quiz: [
        { question: 'John’s Gospel uses the term:', options: ['Paraclete', 'Messiah only', 'Only Logos', 'Only Rabbi'], correct: 0, explanation: 'John uses Paraclete for the Spirit.' },
        { question: 'The Spirit empowers:', options: ['Witness', 'Only kingship', 'Only rituals', 'Only genealogy'], correct: 0, explanation: 'The Spirit empowers witness.' },
        { question: 'Gospel portrayals emphasize:', options: ['Spirit’s activity', 'Only law codes', 'Only politics', 'Only poetry'], correct: 0, explanation: 'They emphasize Spirit’s activity.' },
        { question: 'Guidance refers to:', options: ['Spirit leading', 'Only prophecy', 'Only history', 'Only grammar'], correct: 0, explanation: 'It refers to Spirit leading.' },
        { question: 'Jesus’ teaching on the Spirit is prominent in:', options: ['John', 'Ruth', 'Leviticus', 'Daniel'], correct: 0, explanation: 'It is prominent in John.' }
      ]
    },
    {
      id: '07',
      title: 'Spirit in Acts',
      icon: '🔥',
      duration: '25 min',
      content: [
        {
          heading: 'Pentecost',
          text: 'Acts 2 narrates the outpouring of the Spirit at Pentecost, empowering witness and forming the early church.'
        },
        {
          heading: 'Mission Expansion',
          text: 'The Spirit guides mission decisions and empowers outreach to diverse communities.'
        }
      ],
      keyTerms: [
        { term: 'Pentecost', definition: 'Outpouring of the Spirit in Acts 2' },
        { term: 'Mission', definition: 'Spread of the message across cultures' },
        { term: 'Empowerment', definition: 'Spirit-given ability for witness' }
      ],
      quiz: [
        { question: 'Pentecost occurs in:', options: ['Acts 2', 'Acts 9', 'Acts 15', 'Acts 28'], correct: 0, explanation: 'Pentecost is in Acts 2.' },
        { question: 'The Spirit in Acts empowers:', options: ['Witness and mission', 'Only ritual', 'Only politics', 'Only genealogy'], correct: 0, explanation: 'It empowers witness and mission.' },
        { question: 'The Spirit guides:', options: ['Mission expansion', 'Only temple rituals', 'Only kingship', 'Only law'], correct: 0, explanation: 'It guides mission expansion.' },
        { question: 'Acts portrays the Spirit as:', options: ['Active in the church’s formation', 'Absent', 'Only symbolic', 'Only in the past'], correct: 0, explanation: 'It portrays active role.' },
        { question: 'Pentecost is linked to:', options: ['Outpouring of Spirit', 'Only genealogy', 'Only exile', 'Only prophecy'], correct: 0, explanation: 'It is linked to the outpouring.' }
      ]
    },
    {
      id: '08',
      title: 'Spirit in Paul',
      icon: '✉️',
      duration: '25 min',
      content: [
        {
          heading: 'Life in the Spirit',
          text: 'Paul emphasizes life in the Spirit as central to ethical transformation (e.g., Romans 8; Galatians 5).'
        },
        {
          heading: 'Gifts and Community',
          text: 'The Spirit’s gifts are given for the building up of the community (e.g., 1 Corinthians 12).'
        }
      ],
      keyTerms: [
        { term: 'Life in the Spirit', definition: 'Paul’s framework for ethical transformation' },
        { term: 'Gifts', definition: 'Spirit-enabled abilities for service' },
        { term: 'Community', definition: 'The church as a unified body' }
      ],
      quiz: [
        { question: 'Paul emphasizes:', options: ['Life in the Spirit', 'Only ritual law', 'Only genealogy', 'Only politics'], correct: 0, explanation: 'Paul emphasizes life in the Spirit.' },
        { question: 'Romans 8 is a key text for:', options: ['Spirit-led life', 'Only kingship', 'Only exile', 'Only ritual'], correct: 0, explanation: 'Romans 8 highlights life in the Spirit.' },
        { question: 'Spiritual gifts are given for:', options: ['Community building', 'Only personal status', 'Only politics', 'Only ritual'], correct: 0, explanation: 'Gifts are for community building.' },
        { question: 'Galatians 5 contrasts:', options: ['Spirit and flesh', 'Only law codes', 'Only prophecy', 'Only history'], correct: 0, explanation: 'It contrasts Spirit and flesh.' },
        { question: '1 Corinthians 12 addresses:', options: ['Spiritual gifts', 'Only temple rituals', 'Only genealogy', 'Only exile'], correct: 0, explanation: 'It addresses spiritual gifts.' }
      ]
    },
    {
      id: '09',
      title: 'Discernment and Testing',
      icon: '🧭',
      duration: '20 min',
      content: [
        {
          heading: 'Testing Spirits',
          text: 'The New Testament instructs believers to test teachings and spirits (e.g., 1 John 4:1).'
        },
        {
          heading: 'Order and Discernment',
          text: 'Discernment includes evaluating claims by Scripture, community accountability, and ethical fruit.'
        }
      ],
      keyTerms: [
        { term: 'Discernment', definition: 'Testing teaching and claims' },
        { term: 'Fruit', definition: 'Ethical outcomes of teaching' },
        { term: 'Testing', definition: 'Evaluation against Scripture' }
      ],
      quiz: [
        { question: '1 John 4:1 instructs:', options: ['Test the spirits', 'Ignore teaching', 'Only follow leaders', 'Only accept signs'], correct: 0, explanation: 'It instructs to test the spirits.' },
        { question: 'Discernment involves:', options: ['Testing by Scripture', 'Only emotion', 'Only tradition', 'Only speculation'], correct: 0, explanation: 'It involves testing by Scripture.' },
        { question: 'Ethical fruit is:', options: ['A test of teaching', 'Irrelevant', 'Only ritual', 'Only prophecy'], correct: 0, explanation: 'Fruit tests teaching.' },
        { question: 'Testing includes:', options: ['Community accountability', 'Only private opinion', 'Only politics', 'Only ritual'], correct: 0, explanation: 'Accountability is part of testing.' },
        { question: 'Discernment aims to:', options: ['Protect truth and integrity', 'Promote confusion', 'Reject Scripture', 'Avoid evaluation'], correct: 0, explanation: 'It aims to protect truth.' }
      ]
    },
    {
      id: '10',
      title: 'Hope and Renewal',
      icon: '🌅',
      duration: '20 min',
      content: [
        {
          heading: 'Eschatological Hope',
          text: 'The Spirit is linked to future hope and renewal, including the resurrection and new creation.'
        },
        {
          heading: 'Present Foretaste',
          text: 'Texts describe the Spirit as a down payment or firstfruits of what is to come (e.g., Romans 8; Ephesians 1).'
        }
      ],
      keyTerms: [
        { term: 'Firstfruits', definition: 'Initial portion indicating what is to come' },
        { term: 'Renewal', definition: 'Transformation and new creation' },
        { term: 'Hope', definition: 'Future expectation grounded in God’s promises' }
      ],
      quiz: [
        { question: 'The Spirit is linked to:', options: ['Future hope and renewal', 'Only ritual law', 'Only genealogy', 'Only politics'], correct: 0, explanation: 'It is linked to future hope and renewal.' },
        { question: 'Firstfruits refers to:', options: ['Initial portion of a greater harvest', 'Only prophecy', 'Only law codes', 'Only history'], correct: 0, explanation: 'It refers to an initial portion.' },
        { question: 'Ephesians 1 describes the Spirit as:', options: ['A pledge/down payment', 'Only a symbol', 'Only a metaphor', 'Only a memory'], correct: 0, explanation: 'It describes the Spirit as a pledge.' },
        { question: 'Renewal includes:', options: ['New creation hope', 'Only ritual changes', 'Only politics', 'Only genealogy'], correct: 0, explanation: 'Renewal includes new creation hope.' },
        { question: 'Hope is grounded in:', options: ['God’s promises', 'Random chance', 'Only human effort', 'Only tradition'], correct: 0, explanation: 'Hope is grounded in God’s promises.' }
      ]
    }
  ],
  finalExam: [
    { question: 'Ruach can mean:', options: ['Spirit, breath, or wind', 'Only spirit', 'Only breath', 'Only wind'], correct: 0, explanation: 'Ruach has a range of meanings.' },
    { question: 'Genesis 1:2 mentions:', options: ['God’s Spirit', 'Only angels', 'Only law', 'Only kingship'], correct: 0, explanation: 'It mentions God’s Spirit.' },
    { question: 'Prophetic empowerment is linked to:', options: ['The Spirit', 'Only politics', 'Only ritual', 'Only genealogy'], correct: 0, explanation: 'It is linked to the Spirit.' },
    { question: 'Joel 2 promises:', options: ['Spirit outpouring', 'Only exile', 'Only kingship', 'Only ritual'], correct: 0, explanation: 'It promises Spirit outpouring.' },
    { question: 'The Spirit descends at Jesus’:', options: ['Baptism', 'Birth', 'Resurrection', 'Ascension'], correct: 0, explanation: 'It descends at his baptism.' },
    { question: 'John uses the term:', options: ['Paraclete', 'Only Logos', 'Only Messiah', 'Only Rabbi'], correct: 0, explanation: 'John uses Paraclete.' },
    { question: 'Pentecost occurs in:', options: ['Acts 2', 'Acts 9', 'Acts 15', 'Acts 28'], correct: 0, explanation: 'Pentecost is in Acts 2.' },
    { question: 'Paul emphasizes:', options: ['Life in the Spirit', 'Only ritual law', 'Only genealogy', 'Only politics'], correct: 0, explanation: 'Paul emphasizes life in the Spirit.' },
    { question: '1 John 4:1 instructs:', options: ['Test the spirits', 'Ignore teaching', 'Only follow leaders', 'Only accept signs'], correct: 0, explanation: 'It instructs to test the spirits.' },
    { question: 'The Spirit as firstfruits refers to:', options: ['Initial portion of what is to come', 'Only prophecy', 'Only law', 'Only history'], correct: 0, explanation: 'Firstfruits indicate what is to come.' }
  ],
  about: {
    level: 'Associate-Level Course',
    description: 'A text-driven study of the Holy Spirit across Scripture, focusing on biblical usage and historical context without denominational bias.',
    credits: '3 credits',
    prerequisites: 'New Testament Survey recommended'
  }
};

export default pneumatologyCourse;
