const mosaicLawCourse = {
  id: 'mosaicLaw',
  title: 'Mosaic Law',
  subtitle: 'Associate-Level Course | 11 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Foundation and Covenant',
      icon: '📜',
      duration: '30 min',
      content: [
        {
          heading: 'Covenant at Sinai',
          text: 'The Mosaic Law is given within the Sinai covenant (Exodus 19–24). It establishes Israel’s identity as a covenant people and provides the framework for worship, ethics, and community life.'
        },
        {
          heading: 'Law and Relationship',
          text: 'The law is not merely a legal code; it is covenant instruction. Its purpose is to shape Israel’s life in response to God’s deliverance from Egypt.'
        },
        {
          heading: 'Scope of the Law',
          text: 'The Mosaic Law includes moral commands, civil regulations, and ritual instructions, all rooted in Israel’s historical context.'
        }
      ],
      keyTerms: [
        { term: 'Sinai Covenant', definition: 'The covenant established between God and Israel at Mount Sinai' },
        { term: 'Torah', definition: 'Instruction or law, especially the first five books' },
        { term: 'Covenant', definition: 'A binding relationship with promises and obligations' }
      ],
      quiz: [
        { question: 'The Mosaic Law is given within:', options: ['The Davidic covenant', 'The Sinai covenant', 'The new covenant', 'The Abrahamic covenant only'], correct: 1, explanation: 'The Mosaic Law is given at Sinai.' },
        { question: 'The law’s purpose is primarily to:', options: ['Replace faith', 'Shape Israel’s covenant life', 'Serve as a secular code only', 'Eliminate worship'], correct: 1, explanation: 'It shapes covenant life.' },
        { question: 'Torah means:', options: ['Prophecy', 'Instruction/Law', 'Wisdom', 'Temple'], correct: 1, explanation: 'Torah means instruction or law.' },
        { question: 'The Mosaic Law includes:', options: ['Only ritual rules', 'Moral, civil, and ritual instructions', 'Only prophecy', 'Only wisdom'], correct: 1, explanation: 'It includes multiple categories of instruction.' },
        { question: 'The law is rooted in:', options: ['Greek philosophy', 'Israel’s historical deliverance', 'Roman politics', 'Modern ethics'], correct: 1, explanation: 'It is rooted in God’s deliverance of Israel.' }
      ]
    },
    {
      id: '02',
      title: 'Categories of Law',
      icon: '⚖️',
      duration: '25 min',
      content: [
        {
          heading: 'Moral, Civil, Ritual',
          text: 'While Scripture does not formally label categories, interpreters often describe moral commands, civil case laws, and ritual or ceremonial instructions. These categories help organize material but must be used carefully.'
        },
        {
          heading: 'Case Law',
          text: 'Many laws are case-based (“If…then…”). They apply principles to concrete situations rather than functioning as an exhaustive legal system.'
        },
        {
          heading: 'Purpose and Context',
          text: 'Each law serves a purpose within Israel’s covenant life, shaping worship, justice, and community order.'
        }
      ],
      keyTerms: [
        { term: 'Case Law', definition: 'Conditional laws applying principles to situations' },
        { term: 'Moral Law', definition: 'Commands related to ethical behavior' },
        { term: 'Ritual Law', definition: 'Instructions for worship and purity' }
      ],
      quiz: [
        { question: 'Many Mosaic laws are written as:', options: ['Parables', 'Case laws', 'Poems', 'Genealogies'], correct: 1, explanation: 'Many laws are conditional case laws.' },
        { question: 'Categories like moral, civil, and ritual are:', options: ['Explicit biblical labels', 'Interpretive tools', 'Unnecessary', 'Modern inventions only'], correct: 1, explanation: 'They are interpretive tools.' },
        { question: 'Case laws typically use:', options: ['If…then… structures', 'Only proverbs', 'Only hymns', 'Only allegory'], correct: 0, explanation: 'Case laws use conditional structures.' },
        { question: 'Ritual law focuses on:', options: ['Military strategy', 'Worship and purity', 'Trade policy', 'Genealogy'], correct: 1, explanation: 'Ritual law focuses on worship and purity.' },
        { question: 'The law’s purpose is to:', options: ['Remove community order', 'Shape covenant life', 'Eliminate justice', 'Replace worship'], correct: 1, explanation: 'It shapes covenant life.' }
      ]
    },
    {
      id: '03',
      title: 'The Ten Commandments',
      icon: '🪨',
      duration: '25 min',
      content: [
        {
          heading: 'Decalogue Overview',
          text: 'The Ten Commandments (Exodus 20; Deuteronomy 5) summarize covenant obligations. They address loyalty to God and ethical relationships with others.'
        },
        {
          heading: 'Two-Table Structure',
          text: 'Commands 1–4 focus on worship and allegiance to God; commands 5–10 focus on community ethics and justice.'
        },
        {
          heading: 'Foundational Role',
          text: 'The Decalogue provides foundational principles that shape the broader law code.'
        }
      ],
      keyTerms: [
        { term: 'Decalogue', definition: 'The Ten Commandments' },
        { term: 'Idolatry', definition: 'Worshiping other gods or images' },
        { term: 'Covenant Ethics', definition: 'Moral obligations within the covenant' }
      ],
      quiz: [
        { question: 'The Ten Commandments are found in:', options: ['Exodus 20 and Deuteronomy 5', 'Leviticus 1', 'Numbers 6', 'Joshua 1'], correct: 0, explanation: 'They appear in Exodus 20 and Deuteronomy 5.' },
        { question: 'Commands 1–4 focus on:', options: ['Civil courts', 'Worship and allegiance to God', 'Agriculture', 'Military policy'], correct: 1, explanation: 'They focus on worship and allegiance.' },
        { question: 'Commands 5–10 focus on:', options: ['Temple layout', 'Community ethics', 'Festival calendar', 'Prophetic visions'], correct: 1, explanation: 'They focus on community ethics.' },
        { question: 'The Decalogue provides:', options: ['Random rules', 'Foundational covenant principles', 'Only ritual laws', 'Only civil penalties'], correct: 1, explanation: 'It provides foundational principles.' },
        { question: 'Idolatry refers to:', options: ['Using parables', 'Worshiping other gods or images', 'Studying history', 'Practicing justice'], correct: 1, explanation: 'Idolatry is worshiping other gods or images.' }
      ]
    },
    {
      id: '04',
      title: 'Sacrificial System',
      icon: '🕯️',
      duration: '25 min',
      content: [
        {
          heading: 'Offerings and Purpose',
          text: 'The sacrificial system includes burnt, grain, peace, sin, and guilt offerings (Leviticus 1–7). These offerings express worship, gratitude, and atonement.'
        },
        {
          heading: 'Priestly Mediation',
          text: 'Priests oversee sacrifices and ensure proper ritual practice. The system structures Israel’s approach to God in worship.'
        },
        {
          heading: 'Atonement',
          text: 'Atonement in the Mosaic system addresses sin and ritual impurity within the covenant framework.'
        }
      ],
      keyTerms: [
        { term: 'Burnt Offering', definition: 'A sacrifice wholly consumed, expressing devotion' },
        { term: 'Sin Offering', definition: 'Sacrifice for unintentional sin' },
        { term: 'Atonement', definition: 'Ritual means of dealing with sin and impurity' }
      ],
      quiz: [
        { question: 'The sacrificial system is detailed in:', options: ['Leviticus 1–7', 'Genesis 1', 'Joshua 2', 'Ruth 1'], correct: 0, explanation: 'Leviticus 1–7 details offerings.' },
        { question: 'Sacrifices served to:', options: ['Eliminate prayer', 'Express worship and atonement', 'Replace covenant', 'End community order'], correct: 1, explanation: 'They express worship and atonement.' },
        { question: 'Priests functioned as:', options: ['Military leaders', 'Ritual mediators', 'Kings', 'Prophets only'], correct: 1, explanation: 'Priests mediate ritual worship.' },
        { question: 'A sin offering addressed:', options: ['Political disputes', 'Unintentional sin', 'Land distribution', 'Genealogy'], correct: 1, explanation: 'It addressed unintentional sin.' },
        { question: 'Atonement refers to:', options: ['Temple architecture', 'Dealing with sin and impurity', 'Military victory', 'Exile return'], correct: 1, explanation: 'Atonement deals with sin and impurity.' }
      ]
    },
    {
      id: '05',
      title: 'Purity and Holiness',
      icon: '🧼',
      duration: '25 min',
      content: [
        {
          heading: 'Ritual Purity',
          text: 'Purity laws regulate access to worship and community life. They address bodily conditions, food, and contact with death (Leviticus 11–15).'
        },
        {
          heading: 'Holiness Code',
          text: 'Leviticus 17–26 emphasizes holiness in both worship and ethics. The call “Be holy, for I am holy” summarizes its intent.'
        },
        {
          heading: 'Ethical Dimension',
          text: 'Holiness includes justice, integrity, and compassion. Ritual and ethical purity are not separated in the text.'
        }
      ],
      keyTerms: [
        { term: 'Purity', definition: 'Status required for worship access' },
        { term: 'Holiness Code', definition: 'Leviticus 17–26 teachings on holiness' },
        { term: 'Clean/Unclean', definition: 'Ritual categories in Israel’s law' }
      ],
      quiz: [
        { question: 'Purity laws are found primarily in:', options: ['Leviticus 11–15', 'Genesis 1', 'Judges 2', 'Isaiah 6'], correct: 0, explanation: 'Leviticus 11–15 focuses on purity.' },
        { question: 'The Holiness Code is:', options: ['Leviticus 17–26', 'Exodus 1–10', 'Numbers 1–4', 'Deuteronomy 1–5'], correct: 0, explanation: 'Leviticus 17–26 is the Holiness Code.' },
        { question: 'Holiness includes:', options: ['Only ritual rules', 'Ethical and ritual dimensions', 'Only sacrifices', 'Only prophecy'], correct: 1, explanation: 'Holiness includes ethical and ritual dimensions.' },
        { question: 'Purity laws regulate:', options: ['Military campaigns', 'Access to worship and community life', 'Temple architecture', 'Kingship'], correct: 1, explanation: 'They regulate access to worship and community life.' },
        { question: '“Be holy, for I am holy” emphasizes:', options: ['Political power', 'Covenant identity', 'Military strength', 'Economic policy'], correct: 1, explanation: 'It emphasizes covenant identity.' }
      ]
    },
    {
      id: '06',
      title: 'Social Justice and Ethics',
      icon: '🤝',
      duration: '25 min',
      content: [
        {
          heading: 'Justice and Compassion',
          text: 'The law includes protections for the poor, widows, orphans, and foreigners. These statutes reflect God’s concern for justice.'
        },
        {
          heading: 'Economic Practices',
          text: 'Laws on lending, gleaning, and debt release limit exploitation and promote community stability.'
        },
        {
          heading: 'Integrity in Community',
          text: 'Truthful testimony, fair weights and measures, and impartial judgments are required for community integrity.'
        }
      ],
      keyTerms: [
        { term: 'Gleaning', definition: 'Leaving harvest edges for the poor (Leviticus 19)' },
        { term: 'Impartiality', definition: 'Fair judgment without favoritism' },
        { term: 'Justice', definition: 'Right ordering of community life' }
      ],
      quiz: [
        { question: 'The law provides protections for:', options: ['Only kings', 'The vulnerable (poor, widows, foreigners)', 'Only priests', 'Only soldiers'], correct: 1, explanation: 'It protects the vulnerable.' },
        { question: 'Gleaning laws relate to:', options: ['Temple rituals', 'Care for the poor', 'Military strategy', 'Kingship'], correct: 1, explanation: 'Gleaning provides for the poor.' },
        { question: 'Impartiality means:', options: ['Favoring the rich', 'Fair judgment without favoritism', 'Ignoring evidence', 'Rejecting law'], correct: 1, explanation: 'Impartiality is fair judgment.' },
        { question: 'Economic laws limited:', options: ['Worship', 'Exploitation and debt abuse', 'Prophecy', 'Genealogy'], correct: 1, explanation: 'They limited exploitation.' },
        { question: 'Justice in the law includes:', options: ['Truthful testimony and fair measures', 'Only rituals', 'Only prophecy', 'Only kingship'], correct: 0, explanation: 'Justice includes fair testimony and measures.' }
      ]
    },
    {
      id: '07',
      title: 'Blessings, Curses, and Land',
      icon: '🌾',
      duration: '20 min',
      content: [
        {
          heading: 'Covenant Consequences',
          text: 'Deuteronomy 27–28 presents blessings for covenant faithfulness and curses for disobedience. These frame Israel’s life in the land.'
        },
        {
          heading: 'Land as Gift',
          text: 'The land is presented as a covenant gift, not simply a possession. Life in the land depends on covenant loyalty.'
        },
        {
          heading: 'Exile as Consequence',
          text: 'Disobedience results in judgment and ultimately exile, a theme realized in Israel’s later history.'
        }
      ],
      keyTerms: [
        { term: 'Blessings/Curses', definition: 'Covenant consequences for obedience or disobedience' },
        { term: 'Exile', definition: 'Removal from the land due to judgment' },
        { term: 'Covenant Loyalty', definition: 'Faithful obedience to covenant obligations' }
      ],
      quiz: [
        { question: 'Blessings and curses are detailed in:', options: ['Deuteronomy 27–28', 'Exodus 1', 'Leviticus 1', 'Numbers 1'], correct: 0, explanation: 'Deuteronomy 27–28 details blessings and curses.' },
        { question: 'The land is described as:', options: ['A mere political prize', 'A covenant gift', 'A temporary rental only', 'An irrelevant theme'], correct: 1, explanation: 'It is a covenant gift.' },
        { question: 'Covenant disobedience leads to:', options: ['Automatic prosperity', 'Judgment and exile', 'No consequences', 'Only ritual changes'], correct: 1, explanation: 'Disobedience leads to judgment and exile.' },
        { question: 'Covenant loyalty means:', options: ['Ignoring the law', 'Faithful obedience', 'Only ritual practice', 'Only sacrifice'], correct: 1, explanation: 'Covenant loyalty is faithful obedience.' },
        { question: 'Blessings and curses frame life in:', options: ['Egypt', 'The land of Israel', 'Babylon', 'Assyria'], correct: 1, explanation: 'They frame life in the land.' }
      ]
    },
    {
      id: '08',
      title: 'Law in the Prophets',
      icon: '📣',
      duration: '20 min',
      content: [
        {
          heading: 'Prophetic Critique',
          text: 'Prophets call Israel back to covenant faithfulness, often criticizing injustice, idolatry, and empty ritual.'
        },
        {
          heading: 'Ethics and Worship',
          text: 'Prophets stress that worship without justice is unacceptable (e.g., Amos 5, Isaiah 1).'
        },
        {
          heading: 'Hope and Renewal',
          text: 'Prophetic messages also offer hope for restoration and renewed covenant faithfulness.'
        }
      ],
      keyTerms: [
        { term: 'Prophetic Critique', definition: 'Calling Israel back to covenant standards' },
        { term: 'Injustice', definition: 'Violation of covenant ethics and social responsibility' },
        { term: 'Restoration', definition: 'Hope for covenant renewal' }
      ],
      quiz: [
        { question: 'Prophets often criticize:', options: ['Only foreign nations', 'Injustice and empty ritual', 'Only priests', 'Only kingship'], correct: 1, explanation: 'They criticize injustice and empty ritual.' },
        { question: 'Prophetic messages emphasize:', options: ['Justice and covenant loyalty', 'Only ritual purity', 'Only genealogy', 'Only military policy'], correct: 0, explanation: 'Justice and covenant loyalty are emphasized.' },
        { question: 'Prophets also offer:', options: ['No hope', 'Restoration and renewal', 'Only punishment', 'Only silence'], correct: 1, explanation: 'They offer restoration and renewal.' },
        { question: 'Amos and Isaiah critique:', options: ['Exile return', 'Worship without justice', 'Only temple architecture', 'Only foreign policy'], correct: 1, explanation: 'They critique empty worship without justice.' },
        { question: 'Prophetic critique is rooted in:', options: ['Covenant law', 'Greek philosophy', 'Roman politics', 'Modern ethics'], correct: 0, explanation: 'It is rooted in covenant law.' }
      ]
    },
    {
      id: '09',
      title: 'Law and Jesus',
      icon: '✝️',
      duration: '25 min',
      content: [
        {
          heading: 'Jesus and the Torah',
          text: 'The Gospels depict Jesus engaging the law through teaching, fulfillment, and interpretation (e.g., Matthew 5–7).'
        },
        {
          heading: 'Fulfillment and Ethics',
          text: 'Jesus emphasizes the heart of the law—love for God and neighbor—while challenging legalism and hypocrisy.'
        },
        {
          heading: 'Historical Context',
          text: 'His teaching occurs within Second Temple Judaism, where debates about Torah interpretation were common.'
        }
      ],
      keyTerms: [
        { term: 'Fulfillment', definition: 'Bringing to completion or full meaning' },
        { term: 'Great Commandment', definition: 'Love God and neighbor (Deuteronomy 6; Leviticus 19)' },
        { term: 'Second Temple Judaism', definition: 'Jewish context of Jesus’ ministry' }
      ],
      quiz: [
        { question: 'Jesus engages the law by:', options: ['Ignoring it', 'Teaching and interpreting it', 'Abolishing all ethics', 'Replacing it with philosophy'], correct: 1, explanation: 'He teaches and interprets the law.' },
        { question: 'A central summary of the law is:', options: ['Military strength', 'Love God and neighbor', 'Temple architecture', 'Genealogy'], correct: 1, explanation: 'Love God and neighbor summarizes the law.' },
        { question: 'Jesus critiques:', options: ['Justice and mercy', 'Legalism and hypocrisy', 'All worship', 'All obedience'], correct: 1, explanation: 'He critiques legalism and hypocrisy.' },
        { question: 'Jesus’ teaching occurs within:', options: ['Persian empire', 'Second Temple Judaism', 'Medieval Europe', 'Babylonian exile'], correct: 1, explanation: 'It occurs within Second Temple Judaism.' },
        { question: '“Fulfillment” in Matthew 5 suggests:', options: ['Discarding the law', 'Bringing it to full meaning', 'Ignoring ethics', 'Replacing Scripture'], correct: 1, explanation: 'Fulfillment means bringing to full meaning.' }
      ]
    },
    {
      id: '10',
      title: 'Law and the Apostles',
      icon: '🧭',
      duration: '25 min',
      content: [
        {
          heading: 'Early Church Debates',
          text: 'Acts and the epistles record debates about Gentile inclusion and the role of the law (e.g., Acts 15).'
        },
        {
          heading: 'Paul’s Letters',
          text: 'Paul addresses the law’s purpose and relationship to faith and community life, emphasizing the law’s role in revealing sin and guiding ethical conduct.'
        },
        {
          heading: 'Continuity and Discontinuity',
          text: 'The apostles affirm the law’s moral vision while addressing how covenant identity is shaped in light of Christ.'
        }
      ],
      keyTerms: [
        { term: 'Jerusalem Council', definition: 'Acts 15 decision on Gentile inclusion' },
        { term: 'Gentile Inclusion', definition: 'Non-Jews welcomed into the community of faith' },
        { term: 'Moral Vision', definition: 'Ethical framework rooted in Scripture' }
      ],
      quiz: [
        { question: 'Acts 15 focuses on:', options: ['Temple rebuilding', 'Gentile inclusion and the law', 'Exile return', 'Monarchy'], correct: 1, explanation: 'Acts 15 addresses Gentile inclusion.' },
        { question: 'Paul discusses the law’s role in:', options: ['Revealing sin and guiding conduct', 'Replacing faith', 'Eliminating ethics', 'Only rituals'], correct: 0, explanation: 'Paul discusses its role in revealing sin and guiding conduct.' },
        { question: 'The apostles affirm the law’s:', options: ['Moral vision', 'Irrelevance', 'Abolition of ethics', 'Only ritual aspects'], correct: 0, explanation: 'They affirm its moral vision.' },
        { question: 'Gentile inclusion refers to:', options: ['Only Israelites', 'Non-Jews welcomed into the community', 'Only priests', 'Only kings'], correct: 1, explanation: 'It refers to non-Jews welcomed into the community.' },
        { question: 'Early debates about law are recorded in:', options: ['Acts and epistles', 'Only Genesis', 'Only Psalms', 'Only Daniel'], correct: 0, explanation: 'Acts and epistles record these debates.' }
      ]
    },
    {
      id: '11',
      title: 'Theological Synthesis',
      icon: '⭐',
      duration: '20 min',
      content: [
        {
          heading: 'Law as Covenant Instruction',
          text: 'The Mosaic Law functions as covenant instruction for Israel, forming identity, worship, and ethics.'
        },
        {
          heading: 'Continuity in Scripture',
          text: 'The law’s themes of holiness, justice, and worship continue to shape biblical theology across both testaments.'
        },
        {
          heading: 'Interpretive Care',
          text: 'Responsible interpretation recognizes historical context and avoids forcing later meanings onto earlier texts without evidence.'
        }
      ],
      keyTerms: [
        { term: 'Covenant Instruction', definition: 'Guidance for covenant life' },
        { term: 'Holiness', definition: 'Set apartness in worship and ethics' },
        { term: 'Justice', definition: 'Right ordering of community life' }
      ],
      quiz: [
        { question: 'The law primarily functions as:', options: ['A random rule set', 'Covenant instruction', 'Only political policy', 'Only ritual symbolism'], correct: 1, explanation: 'It functions as covenant instruction.' },
        { question: 'Themes of the law include:', options: ['Holiness, justice, worship', 'Only kingship', 'Only exile', 'Only prophecy'], correct: 0, explanation: 'Holiness, justice, and worship are central.' },
        { question: 'Responsible interpretation should:', options: ['Ignore context', 'Respect historical context', 'Force later meanings', 'Avoid textual evidence'], correct: 1, explanation: 'It should respect historical context.' },
        { question: 'Continuity across Scripture includes:', options: ['The law’s moral vision', 'Only ritual details', 'Only foreign policy', 'Only genealogy'], correct: 0, explanation: 'The law’s moral vision continues.' },
        { question: 'Covenant instruction shapes:', options: ['Identity and ethics', 'Only kingship', 'Only prophecy', 'Only conquest'], correct: 0, explanation: 'It shapes identity and ethics.' }
      ]
    }
  ],
  finalExam: [
    { question: 'The Mosaic Law is given within:', options: ['The Sinai covenant', 'The Davidic covenant', 'The new covenant', 'The Abrahamic covenant only'], correct: 0, explanation: 'It is given at Sinai.' },
    { question: 'Torah means:', options: ['Instruction/Law', 'Prophecy', 'Wisdom', 'Temple'], correct: 0, explanation: 'Torah means instruction or law.' },
    { question: 'Many Mosaic laws are:', options: ['Case laws', 'Poems', 'Genealogies', 'Parables'], correct: 0, explanation: 'Many laws are case laws.' },
    { question: 'The Ten Commandments focus on:', options: ['Worship and ethics', 'Only ritual purity', 'Only foreign policy', 'Only kingship'], correct: 0, explanation: 'They focus on worship and ethics.' },
    { question: 'The sacrificial system is detailed in:', options: ['Leviticus 1–7', 'Genesis 1', 'Judges 1', 'Ruth 1'], correct: 0, explanation: 'Leviticus 1–7 details offerings.' },
    { question: 'Holiness includes:', options: ['Ethical and ritual dimensions', 'Only rituals', 'Only politics', 'Only prophecy'], correct: 0, explanation: 'Holiness includes ethical and ritual dimensions.' },
    { question: 'Gleaning laws emphasize:', options: ['Care for the poor', 'Temple building', 'Military strategy', 'Kingship'], correct: 0, explanation: 'Gleaning provides for the poor.' },
    { question: 'Blessings and curses are found in:', options: ['Deuteronomy 27–28', 'Exodus 1', 'Leviticus 1', 'Numbers 1'], correct: 0, explanation: 'They are in Deuteronomy 27–28.' },
    { question: 'Prophets often critique:', options: ['Injustice and empty ritual', 'Only foreign nations', 'Only priests', 'Only kingship'], correct: 0, explanation: 'They critique injustice and empty ritual.' },
    { question: 'Jesus summarizes the law with:', options: ['Love God and neighbor', 'Temple ritual', 'Royal lineage', 'Military strength'], correct: 0, explanation: 'Love God and neighbor summarizes the law.' },
    { question: 'Acts 15 addresses:', options: ['Gentile inclusion and the law', 'Temple rebuilding', 'Exile return', 'Monarchy'], correct: 0, explanation: 'Acts 15 addresses Gentile inclusion.' },
    { question: 'The law’s moral vision emphasizes:', options: ['Justice and holiness', 'Only rituals', 'Only conquest', 'Only prophecy'], correct: 0, explanation: 'Justice and holiness are central.' },
    { question: 'The law functions as:', options: ['Covenant instruction', 'Random rule set', 'Only political policy', 'Only ritual symbolism'], correct: 0, explanation: 'It is covenant instruction.' },
    { question: 'Case laws are typically:', options: ['If…then… statutes', 'Poems', 'Genealogies', 'Parables'], correct: 0, explanation: 'Case laws use conditional forms.' },
    { question: 'The land is described as:', options: ['A covenant gift', 'A political prize only', 'An irrelevant theme', 'A temporary rental only'], correct: 0, explanation: 'The land is a covenant gift.' },
    { question: 'Atonement refers to:', options: ['Dealing with sin and impurity', 'Temple architecture', 'Military victory', 'Exile return'], correct: 0, explanation: 'Atonement deals with sin and impurity.' },
    { question: 'The Holiness Code is:', options: ['Leviticus 17–26', 'Exodus 1–10', 'Numbers 1–4', 'Deuteronomy 1–5'], correct: 0, explanation: 'Leviticus 17–26 is the Holiness Code.' },
    { question: 'Covenant loyalty means:', options: ['Faithful obedience', 'Ignoring law', 'Only ritual practice', 'Only sacrifice'], correct: 0, explanation: 'Covenant loyalty is faithful obedience.' },
    { question: 'Prophetic critique is rooted in:', options: ['Covenant law', 'Greek philosophy', 'Roman politics', 'Modern ethics'], correct: 0, explanation: 'It is rooted in covenant law.' },
    { question: 'Responsible interpretation should:', options: ['Respect historical context', 'Ignore context', 'Force later meanings', 'Avoid evidence'], correct: 0, explanation: 'It should respect historical context.' }
  ],
  about: {
    level: 'Associate-Level Course',
    description: 'A text-driven study of the Mosaic Law in its historical covenant context, covering worship, ethics, and community life without denominational bias.',
    credits: '3 credits',
    prerequisites: 'Old Testament Survey recommended'
  }
};

export default mosaicLawCourse;
