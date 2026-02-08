const biblicalArchaeologyCourse = {
  id: 'biblicalArchaeology',
  title: 'Biblical Archaeology',
  subtitle: 'Associate-Level Course | 8 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Introduction and Method',
      icon: '🏺',
      duration: '25 min',
      content: [
        {
          heading: 'What Archaeology Is',
          text: 'Archaeology studies material remains to understand past societies. Biblical archaeology examines the historical contexts of the Bible.'
        },
        {
          heading: 'Method and Caution',
          text: 'Archaeological evidence must be interpreted carefully. It can illuminate contexts but should not be forced to “prove” texts.'
        }
      ],
      keyTerms: [
        { term: 'Stratigraphy', definition: 'Layered deposits used to date sites' },
        { term: 'Artifact', definition: 'Object made or used by humans' },
        { term: 'Context', definition: 'Location and associations of finds' }
      ],
      quiz: [
        { question: 'Archaeology studies:', options: ['Material remains', 'Only written texts', 'Only theology', 'Only art'], correct: 0, explanation: 'It studies material remains.' },
        { question: 'Stratigraphy refers to:', options: ['Layered deposits', 'Only inscriptions', 'Only coins', 'Only architecture'], correct: 0, explanation: 'Stratigraphy is layered deposits.' },
        { question: 'Archaeological evidence should be:', options: ['Interpreted carefully', 'Forced to prove texts', 'Ignored', 'Used without context'], correct: 0, explanation: 'It should be interpreted carefully.' },
        { question: 'An artifact is:', options: ['A human-made object', 'A natural rock', 'A modern rumor', 'A myth'], correct: 0, explanation: 'Artifacts are human-made objects.' },
        { question: 'Context means:', options: ['Location and associations', 'Only dating', 'Only texts', 'Only translation'], correct: 0, explanation: 'Context is location and associations.' }
      ]
    },
    {
      id: '02',
      title: 'Archaeological Methods',
      icon: '🧱',
      duration: '25 min',
      content: [
        {
          heading: 'Survey and Excavation',
          text: 'Surveys locate sites; excavations uncover layers and artifacts. Proper recording is essential for interpretation.'
        },
        {
          heading: 'Dating Techniques',
          text: 'Relative dating (stratigraphy, pottery typology) and absolute dating (radiocarbon) help establish chronology.'
        }
      ],
      keyTerms: [
        { term: 'Survey', definition: 'Systematic search for sites' },
        { term: 'Excavation', definition: 'Careful removal of layers' },
        { term: 'Typology', definition: 'Classification of artifacts by form' }
      ],
      quiz: [
        { question: 'Surveys are used to:', options: ['Locate sites', 'Translate texts', 'Only date manuscripts', 'Only interpret theology'], correct: 0, explanation: 'Surveys locate sites.' },
        { question: 'Excavation involves:', options: ['Careful removal of layers', 'Random digging', 'Only surface collection', 'Only photography'], correct: 0, explanation: 'Excavation removes layers carefully.' },
        { question: 'Typology helps with:', options: ['Classifying artifacts', 'Only translation', 'Only theology', 'Only grammar'], correct: 0, explanation: 'Typology classifies artifacts.' },
        { question: 'Radiocarbon is:', options: ['Absolute dating method', 'Only relative dating', 'Only typology', 'Only legend'], correct: 0, explanation: 'Radiocarbon is absolute dating.' },
        { question: 'Stratigraphy provides:', options: ['Relative dating', 'Only translation', 'Only theology', 'Only vocabulary'], correct: 0, explanation: 'Stratigraphy provides relative dating.' }
      ]
    },
    {
      id: '03',
      title: 'Old Testament Archaeology',
      icon: '🏛️',
      duration: '30 min',
      content: [
        {
          heading: 'Key Sites',
          text: 'Sites such as Jericho, Hazor, and Lachish provide data on settlement patterns and historical periods.'
        },
        {
          heading: 'Material Culture',
          text: 'Pottery, inscriptions, and architecture illuminate daily life and political changes.'
        }
      ],
      keyTerms: [
        { term: 'Tell', definition: 'Mound formed by repeated settlement' },
        { term: 'Inscription', definition: 'Written text on durable material' },
        { term: 'Settlement', definition: 'Pattern of habitation over time' }
      ],
      quiz: [
        { question: 'A tell is:', options: ['A settlement mound', 'A scroll', 'A temple only', 'A coin'], correct: 0, explanation: 'A tell is a settlement mound.' },
        { question: 'Old Testament archaeology studies:', options: ['Sites and material culture', 'Only theology', 'Only language', 'Only manuscripts'], correct: 0, explanation: 'It studies sites and material culture.' },
        { question: 'Inscriptions provide:', options: ['Written evidence', 'Only pottery', 'Only architecture', 'Only oral tradition'], correct: 0, explanation: 'Inscriptions provide written evidence.' },
        { question: 'Material culture includes:', options: ['Pottery and architecture', 'Only texts', 'Only theology', 'Only music'], correct: 0, explanation: 'It includes pottery and architecture.' },
        { question: 'Settlement patterns show:', options: ['Habitation changes', 'Only language shifts', 'Only theology', 'Only genealogy'], correct: 0, explanation: 'They show habitation changes.' }
      ]
    },
    {
      id: '04',
      title: 'New Testament Archaeology',
      icon: '⛪',
      duration: '30 min',
      content: [
        {
          heading: 'Cities and Travel',
          text: 'Archaeology of cities like Jerusalem, Capernaum, Corinth, and Ephesus provides context for NT narratives.'
        },
        {
          heading: 'Roman Context',
          text: 'Roads, inscriptions, and civic architecture illuminate the Roman environment of the NT.'
        }
      ],
      keyTerms: [
        { term: 'Roman Roads', definition: 'Infrastructure enabling travel' },
        { term: 'Synagogue', definition: 'Jewish gathering place' },
        { term: 'Civic Architecture', definition: 'Public buildings in Greco-Roman cities' }
      ],
      quiz: [
        { question: 'NT archaeology examines:', options: ['Cities and Roman context', 'Only prophecy', 'Only theology', 'Only manuscripts'], correct: 0, explanation: 'It examines cities and Roman context.' },
        { question: 'Roman roads help explain:', options: ['Travel and mission routes', 'Only ritual law', 'Only genealogy', 'Only poetry'], correct: 0, explanation: 'They explain travel routes.' },
        { question: 'Civic architecture includes:', options: ['Forums and theaters', 'Only temples', 'Only farms', 'Only caves'], correct: 0, explanation: 'It includes forums and theaters.' },
        { question: 'Synagogues are:', options: ['Jewish gathering places', 'Only Roman courts', 'Only markets', 'Only homes'], correct: 0, explanation: 'Synagogues are gathering places.' },
        { question: 'Archaeology provides:', options: ['Historical context', 'Only doctrine', 'Only translation', 'Only grammar'], correct: 0, explanation: 'It provides historical context.' }
      ]
    },
    {
      id: '05',
      title: 'Dead Sea Scrolls',
      icon: '📜',
      duration: '25 min',
      content: [
        {
          heading: 'Discovery and Significance',
          text: 'The Dead Sea Scrolls (Qumran) include biblical manuscripts and sectarian writings from the Second Temple period.'
        },
        {
          heading: 'Textual Value',
          text: 'Scrolls provide evidence for the transmission of biblical texts and variant readings.'
        }
      ],
      keyTerms: [
        { term: 'Qumran', definition: 'Site associated with the scrolls' },
        { term: 'Manuscript', definition: 'Handwritten text' },
        { term: 'Variant', definition: 'Difference among textual witnesses' }
      ],
      quiz: [
        { question: 'The Dead Sea Scrolls were found at:', options: ['Qumran', 'Rome', 'Alexandria', 'Athens'], correct: 0, explanation: 'They were found at Qumran.' },
        { question: 'The scrolls include:', options: ['Biblical manuscripts', 'Only modern texts', 'Only Greek poetry', 'Only Roman law'], correct: 0, explanation: 'They include biblical manuscripts.' },
        { question: 'Their significance includes:', options: ['Textual transmission evidence', 'Only archaeology', 'Only theology', 'Only language'], correct: 0, explanation: 'They provide textual transmission evidence.' },
        { question: 'A variant is:', options: ['A textual difference', 'A punctuation mark', 'A translation error only', 'A loanword'], correct: 0, explanation: 'Variants are textual differences.' },
        { question: 'Second Temple period is:', options: ['Context for the scrolls', 'Only modern era', 'Only medieval era', 'Only Roman empire'], correct: 0, explanation: 'It is the context for the scrolls.' }
      ]
    },
    {
      id: '06',
      title: 'Jerusalem and the Temple',
      icon: '🏟️',
      duration: '25 min',
      content: [
        {
          heading: 'Temple Complex',
          text: 'Archaeology of the Temple Mount and surrounding areas provides context for worship and pilgrimage.'
        },
        {
          heading: 'Urban Development',
          text: 'Jerusalem’s growth and destruction layers provide a timeline for key historical periods.'
        }
      ],
      keyTerms: [
        { term: 'Temple Mount', definition: 'Area of the Jerusalem temple complex' },
        { term: 'Pilgrimage', definition: 'Journey for worship festivals' },
        { term: 'Destruction Layer', definition: 'Archaeological evidence of destruction' }
      ],
      quiz: [
        { question: 'The Temple Mount is:', options: ['Area of the temple complex', 'A Roman road', 'A Greek library', 'A desert cave'], correct: 0, explanation: 'It is the temple complex area.' },
        { question: 'Archaeology of Jerusalem shows:', options: ['Layers of destruction and rebuilding', 'Only modern structures', 'Only natural rock', 'Only legend'], correct: 0, explanation: 'It shows destruction layers.' },
        { question: 'Pilgrimage refers to:', options: ['Journeys for worship', 'Only military travel', 'Only trade routes', 'Only exile'], correct: 0, explanation: 'Pilgrimage is journey for worship.' },
        { question: 'Temple archaeology helps with:', options: ['Worship context', 'Only grammar', 'Only translation', 'Only poetry'], correct: 0, explanation: 'It helps with worship context.' },
        { question: 'Destruction layers indicate:', options: ['Historical events', 'Only rituals', 'Only prophecy', 'Only genealogy'], correct: 0, explanation: 'They indicate historical events.' }
      ]
    },
    {
      id: '07',
      title: 'Archaeology and Scripture',
      icon: '🧭',
      duration: '20 min',
      content: [
        {
          heading: 'Illumination, Not Proof-Texting',
          text: 'Archaeology can illuminate cultural practices, geography, and historical settings, but should not be used to force conclusions.'
        },
        {
          heading: 'Responsible Integration',
          text: 'Interpretation should respect the limits of material evidence and avoid overstated claims.'
        }
      ],
      keyTerms: [
        { term: 'Illumination', definition: 'Providing context and clarity' },
        { term: 'Evidence', definition: 'Material data from sites' },
        { term: 'Interpretation', definition: 'Drawing conclusions from data' }
      ],
      quiz: [
        { question: 'Archaeology should be used to:', options: ['Illuminate context', 'Force conclusions', 'Replace texts', 'Ignore evidence'], correct: 0, explanation: 'It should illuminate context.' },
        { question: 'Responsible integration means:', options: ['Respecting evidence limits', 'Overstating claims', 'Ignoring context', 'Avoiding texts'], correct: 0, explanation: 'It respects evidence limits.' },
        { question: 'Evidence refers to:', options: ['Material data', 'Only opinions', 'Only doctrines', 'Only translations'], correct: 0, explanation: 'Evidence is material data.' },
        { question: 'Interpretation should be:', options: ['Careful and contextual', 'Random', 'Only speculative', 'Only doctrinal'], correct: 0, explanation: 'It should be careful and contextual.' },
        { question: 'Archaeology can clarify:', options: ['Geography and culture', 'Only grammar', 'Only theology', 'Only poetry'], correct: 0, explanation: 'It clarifies geography and culture.' }
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
          text: 'Biblical archaeology provides material context for biblical texts and history, supporting informed and responsible interpretation.'
        },
        {
          heading: 'Balanced Approach',
          text: 'A balanced approach values archaeological data without overstating its implications.'
        }
      ],
      keyTerms: [
        { term: 'Context', definition: 'Historical and material setting' },
        { term: 'Balance', definition: 'Avoiding overstatement' },
        { term: 'Synthesis', definition: 'Coherent summary of findings' }
      ],
      quiz: [
        { question: 'A balanced approach means:', options: ['Valuing data without overstatement', 'Ignoring data', 'Forcing conclusions', 'Avoiding history'], correct: 0, explanation: 'It values data without overstatement.' },
        { question: 'Archaeology provides:', options: ['Material context', 'Only doctrine', 'Only translation', 'Only grammar'], correct: 0, explanation: 'It provides material context.' },
        { question: 'Synthesis is:', options: ['Coherent summary', 'Random notes', 'Only quotes', 'Only opinions'], correct: 0, explanation: 'It is a coherent summary.' },
        { question: 'Context includes:', options: ['Historical and material setting', 'Only modern application', 'Only tradition', 'Only speculation'], correct: 0, explanation: 'It includes historical and material setting.' },
        { question: 'Overstatement should be:', options: ['Avoided', 'Encouraged', 'Required', 'Ignored'], correct: 0, explanation: 'Overstatement should be avoided.' }
      ]
    }
  ],
  finalExam: [
    { question: 'Archaeology studies:', options: ['Material remains', 'Only written texts', 'Only theology', 'Only art'], correct: 0, explanation: 'It studies material remains.' },
    { question: 'Stratigraphy refers to:', options: ['Layered deposits', 'Only inscriptions', 'Only coins', 'Only architecture'], correct: 0, explanation: 'Stratigraphy is layered deposits.' },
    { question: 'Radiocarbon is:', options: ['Absolute dating method', 'Only relative dating', 'Only typology', 'Only legend'], correct: 0, explanation: 'Radiocarbon is absolute dating.' },
    { question: 'A tell is:', options: ['A settlement mound', 'A scroll', 'A temple only', 'A coin'], correct: 0, explanation: 'A tell is a settlement mound.' },
    { question: 'NT archaeology examines:', options: ['Cities and Roman context', 'Only prophecy', 'Only theology', 'Only manuscripts'], correct: 0, explanation: 'It examines cities and Roman context.' },
    { question: 'Dead Sea Scrolls were found at:', options: ['Qumran', 'Rome', 'Alexandria', 'Athens'], correct: 0, explanation: 'They were found at Qumran.' },
    { question: 'Temple Mount refers to:', options: ['Area of the temple complex', 'A Roman road', 'A Greek library', 'A desert cave'], correct: 0, explanation: 'It refers to the temple complex area.' },
    { question: 'Archaeology should be used to:', options: ['Illuminate context', 'Force conclusions', 'Replace texts', 'Ignore evidence'], correct: 0, explanation: 'It should illuminate context.' },
    { question: 'Evidence refers to:', options: ['Material data', 'Only opinions', 'Only doctrines', 'Only translations'], correct: 0, explanation: 'Evidence is material data.' },
    { question: 'A balanced approach means:', options: ['Valuing data without overstatement', 'Ignoring data', 'Forcing conclusions', 'Avoiding history'], correct: 0, explanation: 'It values data without overstatement.' }
  ],
  about: {
    level: 'Associate-Level Course',
    description: 'A text-driven introduction to biblical archaeology, focusing on methods, key sites, and responsible integration of material evidence without denominational bias.',
    credits: '3 credits',
    prerequisites: 'Old Testament and New Testament Survey recommended'
  }
};

export default biblicalArchaeologyCourse;
