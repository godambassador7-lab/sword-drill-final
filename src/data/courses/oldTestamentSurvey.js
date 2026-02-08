const oldTestamentSurveyCourse = {
  id: 'oldTestamentSurvey',
  title: 'Old Testament Survey',
  subtitle: 'Associate-Level Course | 12 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Introduction and Canon',
      icon: '📜',
      duration: '30 min',
      content: [
        {
          heading: 'Scope and Structure',
          text: 'The Old Testament (Hebrew Bible) contains law, narrative, poetry, and prophecy. It is commonly organized into the Pentateuch, Historical Books, Wisdom/Poetry, and Prophets. The Hebrew arrangement is Torah, Prophets (Neviim), and Writings (Ketuvim).'
        },
        {
          heading: 'Historical Frame',
          text: 'The Old Testament spans from creation narratives and early patriarchal traditions through the monarchic period, exile, and post-exilic restoration. These texts reflect Israel’s history in the ancient Near East.'
        },
        {
          heading: 'Purpose of the Survey',
          text: 'A survey provides the storyline, major themes, and theological vocabulary needed to read individual books in context. It prioritizes textual evidence and historical setting without denominational bias.'
        }
      ],
      keyTerms: [
        { term: 'Torah', definition: 'The first five books, also called the Pentateuch' },
        { term: 'Neviim', definition: 'The Prophets section of the Hebrew Bible' },
        { term: 'Ketuvim', definition: 'The Writings section of the Hebrew Bible' },
        { term: 'Canon', definition: 'The recognized collection of sacred texts' }
      ],
      quiz: [
        { question: 'The Hebrew Bible is organized as:', options: ['Law, Gospels, Epistles', 'Torah, Prophets, Writings', 'Poetry, Gospels, Prophets', 'Narrative, Letters, Apocalyptic'], correct: 1, explanation: 'The Hebrew arrangement is Torah, Prophets, and Writings.' },
        { question: 'The Pentateuch refers to:', options: ['The Prophets', 'The first five books', 'The Wisdom books', 'The Minor Prophets'], correct: 1, explanation: 'Pentateuch means the first five books.' },
        { question: 'A survey course primarily provides:', options: ['Detailed verse-by-verse commentary', 'The broad storyline and themes', 'Only archaeological data', 'Only devotional reflections'], correct: 1, explanation: 'Surveys focus on storyline and themes.' },
        { question: 'The Old Testament spans:', options: ['Only the monarchy', 'Creation through post-exilic periods', 'Only the exile', 'Only the prophets'], correct: 1, explanation: 'It spans from creation to post-exile.' },
        { question: 'Canon means:', options: ['Translation style', 'Recognized collection of texts', 'A poetic form', 'A historical event'], correct: 1, explanation: 'Canon is the recognized collection of sacred texts.' }
      ]
    },
    {
      id: '02',
      title: 'Genesis',
      icon: '🌍',
      duration: '30 min',
      content: [
        {
          heading: 'Primeval History (Genesis 1–11)',
          text: 'Genesis opens with creation, humanity, the fall, the flood, and the dispersion at Babel. These chapters set the theological framework for God, humanity, sin, and covenant.'
        },
        {
          heading: 'Patriarchal Narratives (Genesis 12–50)',
          text: 'The focus shifts to Abraham, Isaac, Jacob, and Joseph. God’s covenant promises of land, descendants, and blessing shape Israel’s identity.'
        },
        {
          heading: 'Literary Features',
          text: 'Genesis combines narrative cycles, genealogies, and covenant scenes. Repeated motifs include blessing, promise, and God’s providential guidance.'
        }
      ],
      keyTerms: [
        { term: 'Covenant', definition: 'A binding relationship with promises and obligations' },
        { term: 'Patriarchs', definition: 'Abraham, Isaac, and Jacob' },
        { term: 'Primeval History', definition: 'Genesis 1–11' }
      ],
      quiz: [
        { question: 'Genesis 1–11 is often called:', options: ['Patriarchal History', 'Primeval History', 'Monarchic History', 'Exilic History'], correct: 1, explanation: 'Genesis 1–11 is primeval history.' },
        { question: 'The patriarchal narratives begin with:', options: ['Moses', 'Abraham', 'David', 'Solomon'], correct: 1, explanation: 'They begin with Abraham in Genesis 12.' },
        { question: 'Key covenant promises in Genesis include:', options: ['Temple rituals only', 'Land, descendants, blessing', 'Kingship only', 'Exile only'], correct: 1, explanation: 'Land, descendants, and blessing are central.' },
        { question: 'Joseph’s story primarily emphasizes:', options: ['Temple worship', 'Providence in hardship', 'Conquest of Canaan', 'The monarchy'], correct: 1, explanation: 'Joseph’s narrative highlights providence.' },
        { question: 'A major theme in Genesis is:', options: ['Exile and return', 'Blessing and promise', 'Priestly regulations only', 'Prophetic oracles only'], correct: 1, explanation: 'Blessing and promise recur throughout Genesis.' }
      ]
    },
    {
      id: '03',
      title: 'Exodus',
      icon: '🧭',
      duration: '30 min',
      content: [
        {
          heading: 'Deliverance from Egypt',
          text: 'Exodus centers on Israel’s liberation from Egypt under Moses. The plagues, Passover, and Red Sea crossing establish God as deliverer and covenant Lord.'
        },
        {
          heading: 'Covenant at Sinai',
          text: 'At Sinai, Israel receives the law and enters a covenant relationship. The Ten Commandments and covenant code outline Israel’s identity and ethics.'
        },
        {
          heading: 'Tabernacle and Presence',
          text: 'The tabernacle instructions show God’s desire to dwell among His people. Worship and holiness become central themes.'
        }
      ],
      keyTerms: [
        { term: 'Passover', definition: 'Festival commemorating deliverance from Egypt' },
        { term: 'Sinai Covenant', definition: 'Covenant given through Moses at Mount Sinai' },
        { term: 'Tabernacle', definition: 'Portable sanctuary for worship' }
      ],
      quiz: [
        { question: 'Exodus focuses on:', options: ['Conquest of Canaan', 'Deliverance from Egypt', 'Babylonian exile', 'Return from exile'], correct: 1, explanation: 'Exodus is about deliverance from Egypt.' },
        { question: 'The Passover commemorates:', options: ['Temple dedication', 'Deliverance from Egypt', 'David’s kingship', 'Return from exile'], correct: 1, explanation: 'Passover commemorates deliverance.' },
        { question: 'The Sinai covenant includes:', options: ['Only narratives', 'Law and covenant code', 'Only poetry', 'Only prophecy'], correct: 1, explanation: 'Sinai includes law and covenant code.' },
        { question: 'The tabernacle represents:', options: ['Exile', 'God’s presence among His people', 'Kingship', 'Military conquest'], correct: 1, explanation: 'Tabernacle symbolizes God’s presence.' },
        { question: 'Moses is primarily associated with:', options: ['Prophetic oracles in exile', 'Deliverance and covenant law', 'Royal psalms', 'Wisdom sayings'], correct: 1, explanation: 'Moses leads deliverance and receives law.' }
      ]
    },
    {
      id: '04',
      title: 'Leviticus',
      icon: '🕯️',
      duration: '30 min',
      content: [
        {
          heading: 'Holiness and Worship',
          text: 'Leviticus focuses on holiness in worship and daily life. Sacrifices, priestly duties, and ritual purity define how Israel approaches God.'
        },
        {
          heading: 'Sacrificial System',
          text: 'Burnt, grain, peace, sin, and guilt offerings outline different aspects of worship and atonement. These rituals structured Israel’s communal life.'
        },
        {
          heading: 'Ethics and Community',
          text: 'Leviticus also contains ethical instruction, including care for the poor and justice in community life (e.g., Leviticus 19).'
        }
      ],
      keyTerms: [
        { term: 'Holiness', definition: 'Being set apart for God' },
        { term: 'Atonement', definition: 'Ritual means of dealing with sin' },
        { term: 'Priesthood', definition: 'Mediators of worship in Israel' }
      ],
      quiz: [
        { question: 'Leviticus primarily emphasizes:', options: ['Military conquest', 'Holiness and worship', 'Royal history', 'Exile narratives'], correct: 1, explanation: 'Leviticus focuses on holiness and worship.' },
        { question: 'The sacrificial system includes:', options: ['Only burnt offerings', 'Multiple types of offerings', 'Only prayer', 'Only prophecy'], correct: 1, explanation: 'There are multiple offerings.' },
        { question: 'Leviticus 19 includes:', options: ['Genealogies', 'Ethical instructions', 'Royal annals', 'Apocalyptic visions'], correct: 1, explanation: 'It includes ethical instructions.' },
        { question: 'Atonement refers to:', options: ['Temple architecture', 'Dealing with sin through ritual', 'Military victory', 'Exile'], correct: 1, explanation: 'Atonement deals with sin through ritual.' },
        { question: 'The priesthood’s role is to:', options: ['Collect taxes', 'Mediate worship and sacrifices', 'Lead armies', 'Write histories'], correct: 1, explanation: 'Priests mediate worship.' }
      ]
    },
    {
      id: '05',
      title: 'Numbers',
      icon: '🏕️',
      duration: '30 min',
      content: [
        {
          heading: 'Wilderness Journey',
          text: 'Numbers recounts Israel’s journey from Sinai toward Canaan. It includes censuses, camp organization, and travel narratives.'
        },
        {
          heading: 'Rebellion and Judgment',
          text: 'The book records repeated rebellion, including the spies episode and Korah’s revolt. These events result in judgment and a delayed entry into the land.'
        },
        {
          heading: 'Leadership and Order',
          text: 'Numbers addresses leadership roles, priestly duties, and maintaining order in a mobile community.'
        }
      ],
      keyTerms: [
        { term: 'Census', definition: 'A counting of Israel’s tribes' },
        { term: 'Wilderness', definition: 'The period of wandering before entering Canaan' },
        { term: 'Korah’s Revolt', definition: 'A challenge to Moses and Aaron’s authority' }
      ],
      quiz: [
        { question: 'Numbers is set primarily in:', options: ['Egypt', 'The wilderness', 'Babylon', 'Jerusalem'], correct: 1, explanation: 'Numbers focuses on the wilderness period.' },
        { question: 'A key theme in Numbers is:', options: ['Royal succession', 'Rebellion and judgment', 'Temple dedication', 'Exile return'], correct: 1, explanation: 'Rebellion and judgment recur.' },
        { question: 'The spies episode results in:', options: ['Immediate conquest', 'Delayed entry into Canaan', 'Temple building', 'Babylonian exile'], correct: 1, explanation: 'Israel’s entry is delayed.' },
        { question: 'Korah’s revolt is about:', options: ['Land division', 'Leadership challenge', 'Temple purity', 'Foreign alliances'], correct: 1, explanation: 'It challenges Moses and Aaron.' },
        { question: 'Numbers includes:', options: ['Only poetry', 'Censuses and travel narratives', 'Only prophecy', 'Only wisdom'], correct: 1, explanation: 'It includes censuses and travel narratives.' }
      ]
    },
    {
      id: '06',
      title: 'Deuteronomy',
      icon: '📘',
      duration: '30 min',
      content: [
        {
          heading: 'Covenant Renewal',
          text: 'Deuteronomy presents Moses’ final speeches, renewing the covenant for a new generation before entering Canaan.'
        },
        {
          heading: 'Shema and Love of God',
          text: 'The Shema (Deuteronomy 6:4–5) calls Israel to love the LORD with heart, soul, and strength. Loyalty to God is central.'
        },
        {
          heading: 'Law and Life in the Land',
          text: 'The book rearticulates laws for life in the land, emphasizing justice, worship centralization, and covenant faithfulness.'
        }
      ],
      keyTerms: [
        { term: 'Shema', definition: 'Confession of Israel’s faith in one God' },
        { term: 'Covenant Renewal', definition: 'Reaffirming covenant obligations' },
        { term: 'Centralization', definition: 'Worship focused at a central sanctuary' }
      ],
      quiz: [
        { question: 'Deuteronomy is primarily:', options: ['A prophetic vision', 'Moses’ covenant renewal speeches', 'A royal chronicle', 'A wisdom anthology'], correct: 1, explanation: 'It is Moses’ covenant renewal.' },
        { question: 'The Shema emphasizes:', options: ['Multiple gods', 'Love and loyalty to the LORD', 'Temple architecture', 'Exile narratives'], correct: 1, explanation: 'The Shema emphasizes love of God.' },
        { question: 'Deuteronomy rearticulates:', options: ['Only narratives', 'Law and covenant obligations', 'Only poetry', 'Only prophecy'], correct: 1, explanation: 'It rearticulates law.' },
        { question: 'A major theme is:', options: ['Covenant faithfulness', 'Royal succession', 'Foreign alliances', 'Apocalyptic judgment'], correct: 0, explanation: 'Covenant faithfulness is central.' },
        { question: 'Deuteronomy prepares Israel for:', options: ['Exile', 'Entry into Canaan', 'Babylonian captivity', 'Return from exile'], correct: 1, explanation: 'It prepares Israel to enter the land.' }
      ]
    },
    {
      id: '07',
      title: 'Historical Books',
      icon: '🏛️',
      duration: '35 min',
      content: [
        {
          heading: 'Conquest to Monarchy',
          text: 'Joshua, Judges, Ruth, 1–2 Samuel, and 1–2 Kings trace Israel from conquest and settlement to the monarchy and the divided kingdom.'
        },
        {
          heading: 'Covenant and Kingship',
          text: 'The narratives present kingship as accountable to covenant law. David’s covenant promises shape expectations for future leadership.'
        },
        {
          heading: 'Exile and Loss',
          text: 'The story culminates in exile due to persistent covenant unfaithfulness, highlighting the consequences of disobedience.'
        }
      ],
      keyTerms: [
        { term: 'Conquest', definition: 'Israel’s entry into Canaan under Joshua' },
        { term: 'Monarchy', definition: 'Israel’s kingship period' },
        { term: 'Exile', definition: 'Removal from the land due to judgment' }
      ],
      quiz: [
        { question: 'The Historical Books begin with:', options: ['Genesis', 'Joshua', 'Isaiah', 'Psalms'], correct: 1, explanation: 'Joshua begins the historical narrative sequence.' },
        { question: 'A central theme is:', options: ['Covenant accountability', 'Only ritual law', 'Only wisdom sayings', 'Only prophecy'], correct: 0, explanation: 'Kings are accountable to covenant law.' },
        { question: 'The monarchy includes:', options: ['David and Solomon', 'Only Moses', 'Only prophets', 'Only priests'], correct: 0, explanation: 'David and Solomon are central monarchs.' },
        { question: 'The historical narrative ends with:', options: ['Temple dedication', 'Exile', 'Return from exile', 'Creation'], correct: 1, explanation: 'It ends with exile in 2 Kings.' },
        { question: 'Judges is characterized by:', options: ['Stable leadership', 'Cycles of rebellion and deliverance', 'No conflict', 'Exile return'], correct: 1, explanation: 'Judges shows cycles of rebellion and deliverance.' }
      ]
    },
    {
      id: '08',
      title: 'Wisdom and Poetry',
      icon: '💡',
      duration: '30 min',
      content: [
        {
          heading: 'Books and Genres',
          text: 'Job, Psalms, Proverbs, Ecclesiastes, and Song of Songs comprise Israel’s wisdom and poetic literature. They explore worship, suffering, morality, and human experience.'
        },
        {
          heading: 'Wisdom Themes',
          text: 'Wisdom literature emphasizes the fear of the LORD, moral order, and the complexity of life. It often presents general principles rather than case laws.'
        },
        {
          heading: 'Poetic Expression',
          text: 'Hebrew poetry uses parallelism, imagery, and metaphor. It is designed for reflection and worship rather than chronological narration.'
        }
      ],
      keyTerms: [
        { term: 'Wisdom', definition: 'Skillful living grounded in reverence for God' },
        { term: 'Parallelism', definition: 'Poetic structure with corresponding lines' },
        { term: 'Lament', definition: 'Poetic expression of grief or complaint' }
      ],
      quiz: [
        { question: 'Wisdom literature includes:', options: ['Joshua', 'Job and Proverbs', 'Isaiah', 'Exodus'], correct: 1, explanation: 'Job and Proverbs are wisdom books.' },
        { question: 'A hallmark of Hebrew poetry is:', options: ['Rhyme scheme', 'Parallelism', 'Narrative chronology', 'Legal code'], correct: 1, explanation: 'Parallelism is a hallmark of Hebrew poetry.' },
        { question: 'The fear of the LORD is:', options: ['A minor theme', 'A foundational wisdom theme', 'Only in prophecy', 'Only in law'], correct: 1, explanation: 'It is foundational to wisdom literature.' },
        { question: 'Psalms are primarily:', options: ['Historical annals', 'Poetic songs and prayers', 'Legal codes', 'Apocalyptic visions'], correct: 1, explanation: 'Psalms are songs and prayers.' },
        { question: 'Job addresses:', options: ['Conquest', 'Suffering and righteousness', 'Exile return', 'Temple rituals only'], correct: 1, explanation: 'Job addresses suffering and righteousness.' }
      ]
    },
    {
      id: '09',
      title: 'Major Prophets',
      icon: '📣',
      duration: '35 min',
      content: [
        {
          heading: 'Isaiah, Jeremiah, Lamentations, Ezekiel, Daniel',
          text: 'Major Prophets are longer prophetic books addressing judgment, hope, exile, and restoration. They combine oracles, narratives, and visions.'
        },
        {
          heading: 'Historical Setting',
          text: 'These books span the Assyrian threat, Babylonian exile, and post-exilic hopes. They speak to both immediate crises and future expectations.'
        },
        {
          heading: 'Themes',
          text: 'Key themes include covenant accountability, holiness of God, restoration, and future hope. Prophetic imagery is often symbolic and rooted in earlier Scripture.'
        }
      ],
      keyTerms: [
        { term: 'Oracle', definition: 'A prophetic message or pronouncement' },
        { term: 'Exile', definition: 'Displacement to Babylon and beyond' },
        { term: 'Restoration', definition: 'Hope for return and renewal' }
      ],
      quiz: [
        { question: 'Major Prophets are called “major” because:', options: ['They are more important', 'They are longer in length', 'They are older', 'They are only about kings'], correct: 1, explanation: 'They are longer in length.' },
        { question: 'Jeremiah’s ministry relates to:', options: ['Exile and its aftermath', 'The conquest of Canaan', 'The monarchy’s beginning', 'The wilderness'], correct: 0, explanation: 'Jeremiah addresses the exile period.' },
        { question: 'Ezekiel contains:', options: ['Only poetry', 'Symbolic visions', 'Only legal codes', 'Only genealogies'], correct: 1, explanation: 'Ezekiel includes symbolic visions.' },
        { question: 'A common theme is:', options: ['Covenant accountability', 'No judgment', 'Only ritual law', 'Only wisdom'], correct: 0, explanation: 'Covenant accountability is central.' },
        { question: 'Daniel is known for:', options: ['Wisdom sayings only', 'Narratives and apocalyptic visions', 'Temple rituals', 'Only laments'], correct: 1, explanation: 'Daniel contains narratives and apocalyptic visions.' }
      ]
    },
    {
      id: '10',
      title: 'Minor Prophets',
      icon: '📯',
      duration: '30 min',
      content: [
        {
          heading: 'The Twelve',
          text: 'The Minor Prophets are shorter books from Hosea to Malachi. They address diverse historical contexts but are often read as a unified collection.'
        },
        {
          heading: 'Historical Diversity',
          text: 'Some prophets speak before exile (e.g., Amos, Hosea), others during (e.g., Habakkuk), and others after (e.g., Haggai, Zechariah, Malachi).'
        },
        {
          heading: 'Core Messages',
          text: 'Themes include covenant faithfulness, social justice, true worship, and hope for restoration.'
        }
      ],
      keyTerms: [
        { term: 'The Twelve', definition: 'The Minor Prophets as a collection' },
        { term: 'Social Justice', definition: 'Ethical responsibility toward the vulnerable' },
        { term: 'Covenant Faithfulness', definition: 'Loyalty to God’s covenant demands' }
      ],
      quiz: [
        { question: 'The Minor Prophets are:', options: ['Less important', 'Shorter books', 'Only poetic', 'Only post-exilic'], correct: 1, explanation: 'They are shorter in length.' },
        { question: 'Haggai and Zechariah are:', options: ['Pre-exilic', 'Post-exilic', 'Primeval', 'Monarchic only'], correct: 1, explanation: 'They are post-exilic prophets.' },
        { question: 'A common theme is:', options: ['Temple architecture only', 'Covenant faithfulness', 'Only genealogy', 'Only military conquest'], correct: 1, explanation: 'Covenant faithfulness is common.' },
        { question: 'The Twelve are often read as:', options: ['Unrelated oracles only', 'A unified collection', 'Only narratives', 'Only laws'], correct: 1, explanation: 'They are read as a collection.' },
        { question: 'Amos emphasizes:', options: ['Royal succession', 'Justice and righteousness', 'Only ritual detail', 'Creation narratives'], correct: 1, explanation: 'Amos emphasizes justice and righteousness.' }
      ]
    },
    {
      id: '11',
      title: 'Themes and Theology',
      icon: '⭐',
      duration: '25 min',
      content: [
        {
          heading: 'Covenant and Kingdom',
          text: 'Covenant structures Israel’s relationship with God, while kingdom language develops through the monarchy and prophetic hope.'
        },
        {
          heading: 'Worship and Holiness',
          text: 'Worship, sacrifice, and ethical holiness are inseparable in the Old Testament. True worship includes justice and obedience.'
        },
        {
          heading: 'Promise and Hope',
          text: 'Despite judgment, the texts repeatedly emphasize hope, restoration, and God’s faithfulness to promises.'
        }
      ],
      keyTerms: [
        { term: 'Kingdom', definition: 'God’s rule expressed through His people and leaders' },
        { term: 'Holiness', definition: 'Set apartness in worship and ethics' },
        { term: 'Restoration', definition: 'Hope for renewal after judgment' }
      ],
      quiz: [
        { question: 'Covenant is central because it:', options: ['Explains language only', 'Defines Israel’s relationship with God', 'Replaces narrative', 'Eliminates law'], correct: 1, explanation: 'Covenant defines the relationship.' },
        { question: 'Old Testament worship is linked to:', options: ['Only ritual', 'Ethics and obedience', 'Only kingship', 'Only prophecy'], correct: 1, explanation: 'Worship is linked to ethics and obedience.' },
        { question: 'A repeated theme is:', options: ['Despair only', 'Promise and hope', 'Only exile', 'Only conquest'], correct: 1, explanation: 'Promise and hope recur.' },
        { question: 'Holiness includes:', options: ['Only priestly rituals', 'Ethical and worship dimensions', 'Only laws about food', 'Only prophecy'], correct: 1, explanation: 'Holiness is ethical and worshipful.' },
        { question: 'Kingdom language develops through:', options: ['Wisdom only', 'Monarchy and prophetic hope', 'Only exile', 'Only creation'], correct: 1, explanation: 'It develops through monarchy and hope.' }
      ]
    },
    {
      id: '12',
      title: 'Old Testament and the New',
      icon: '🔗',
      duration: '25 min',
      content: [
        {
          heading: 'Continuity and Fulfillment',
          text: 'The New Testament frequently quotes and alludes to Old Testament texts. Themes of covenant, sacrifice, kingship, and promise provide continuity.'
        },
        {
          heading: 'Typology and Patterns',
          text: 'Patterns such as exodus, covenant, and temple imagery are re-used and re-applied. These patterns are rooted in the Old Testament itself.'
        },
        {
          heading: 'Reading in Context',
          text: 'Responsible interpretation respects the Old Testament context and avoids reading later meanings back into earlier texts without textual support.'
        }
      ],
      keyTerms: [
        { term: 'Allusion', definition: 'A reference to another text without direct quotation' },
        { term: 'Typology', definition: 'Text-based patterns of fulfillment' },
        { term: 'Continuity', definition: 'Thematic connections across Testaments' }
      ],
      quiz: [
        { question: 'The New Testament frequently:', options: ['Ignores the Old Testament', 'Quotes and alludes to the Old Testament', 'Replaces the Old Testament entirely', 'Rejects its themes'], correct: 1, explanation: 'It quotes and alludes to the Old Testament.' },
        { question: 'Typology refers to:', options: ['Random symbolism', 'Text-based patterns of fulfillment', 'Only historical data', 'Only poetry'], correct: 1, explanation: 'Typology is text-based patterning.' },
        { question: 'Continuity includes:', options: ['No thematic overlap', 'Covenant and promise themes', 'Only genealogies', 'Only apocalyptic imagery'], correct: 1, explanation: 'Covenant and promise themes continue.' },
        { question: 'Responsible reading avoids:', options: ['Context', 'Reading later meanings into earlier texts without support', 'Historical setting', 'Grammar'], correct: 1, explanation: 'It avoids unsupported retrojection.' },
        { question: 'Allusion means:', options: ['Direct quotation only', 'Indirect textual reference', 'Translation style', 'Historical error'], correct: 1, explanation: 'Allusion is an indirect reference.' }
      ]
    }
  ],
  finalExam: [
    { question: 'The Hebrew Bible is organized as:', options: ['Torah, Prophets, Writings', 'Law, Gospels, Epistles', 'Poetry, Gospels, Prophets', 'Narrative, Letters, Apocalyptic'], correct: 0, explanation: 'The Hebrew arrangement is Torah, Prophets, Writings.' },
    { question: 'Primeval history refers to:', options: ['Genesis 1–11', 'Exodus', 'Joshua', 'Ruth'], correct: 0, explanation: 'Genesis 1–11 is primeval history.' },
    { question: 'The patriarchs are:', options: ['Moses, Aaron, Miriam', 'Abraham, Isaac, Jacob', 'Saul, David, Solomon', 'Isaiah, Jeremiah, Ezekiel'], correct: 1, explanation: 'The patriarchs are Abraham, Isaac, Jacob.' },
    { question: 'The Exodus includes:', options: ['Return from exile', 'Deliverance from Egypt', 'Temple rebuilding', 'Babylonian captivity'], correct: 1, explanation: 'Exodus is deliverance from Egypt.' },
    { question: 'The Sinai covenant includes:', options: ['Law and covenant code', 'Only poetry', 'Only prophecy', 'Only narratives'], correct: 0, explanation: 'Sinai includes law and covenant code.' },
    { question: 'Leviticus emphasizes:', options: ['Kingship', 'Holiness and worship', 'Exile return', 'Conquest'], correct: 1, explanation: 'Leviticus focuses on holiness and worship.' },
    { question: 'Numbers is set in:', options: ['Egypt', 'The wilderness', 'Babylon', 'Jerusalem'], correct: 1, explanation: 'Numbers focuses on wilderness wandering.' },
    { question: 'Deuteronomy is:', options: ['A prophetic vision', 'Covenant renewal speeches', 'Royal annals', 'Wisdom anthology'], correct: 1, explanation: 'Deuteronomy renews the covenant.' },
    { question: 'Historical books trace:', options: ['Creation to Babel', 'Conquest to exile', 'Only exile', 'Only post-exile'], correct: 1, explanation: 'They trace conquest to exile.' },
    { question: 'Wisdom literature includes:', options: ['Job and Proverbs', 'Joshua and Judges', 'Isaiah and Jeremiah', 'Exodus and Leviticus'], correct: 0, explanation: 'Job and Proverbs are wisdom books.' },
    { question: 'Hebrew poetry commonly uses:', options: ['Parallelism', 'Rhyme', 'Chronology', 'Genealogies'], correct: 0, explanation: 'Parallelism is common.' },
    { question: 'Major Prophets are “major” because:', options: ['They are more authoritative', 'They are longer', 'They are older', 'They are only about kings'], correct: 1, explanation: 'They are longer.' },
    { question: 'Minor Prophets are:', options: ['Less important', 'Shorter books', 'Only poetic', 'Only post-exilic'], correct: 1, explanation: 'They are shorter.' },
    { question: 'A common prophetic theme is:', options: ['Covenant accountability', 'Only ritual law', 'Only wisdom sayings', 'No judgment'], correct: 0, explanation: 'Covenant accountability is common.' },
    { question: 'A central Old Testament theme is:', options: ['Covenant and kingdom', 'No worship', 'Only exile', 'Only conquest'], correct: 0, explanation: 'Covenant and kingdom are central.' },
    { question: 'Worship and ethics are:', options: ['Separate', 'Linked in Old Testament teaching', 'Opposed', 'Irrelevant'], correct: 1, explanation: 'Worship and ethics are linked.' },
    { question: 'The New Testament often:', options: ['Ignores the Old Testament', 'Quotes and alludes to it', 'Rejects its themes', 'Replaces it completely'], correct: 1, explanation: 'It often quotes and alludes to the OT.' },
    { question: 'Typology refers to:', options: ['Random symbolism', 'Text-based patterns of fulfillment', 'Only historical data', 'Only poetry'], correct: 1, explanation: 'Typology is text-based patterning.' },
    { question: 'Allusion means:', options: ['Direct quotation only', 'Indirect textual reference', 'Translation style', 'Historical error'], correct: 1, explanation: 'Allusion is an indirect reference.' },
    { question: 'A survey course aims to provide:', options: ['Only verse-by-verse commentary', 'Broad storyline and themes', 'Only archaeology', 'Only devotional notes'], correct: 1, explanation: 'Surveys focus on storyline and themes.' }
  ],
  about: {
    level: 'Associate-Level Course',
    description: 'A comprehensive, text-driven survey of the Old Testament, emphasizing historical setting, literary structure, and major theological themes without denominational bias.',
    credits: '3 credits',
    prerequisites: 'Basic biblical literacy'
  }
};

export default oldTestamentSurveyCourse;
