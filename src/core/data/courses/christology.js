const christologyCourse = {
  id: 'christology',
  title: 'Christology',
  subtitle: 'Associate-Level Course | 12 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Messianic Expectation',
      icon: '⭐',
      duration: '30 min',
      content: [
        {
          heading: 'Hope in the Hebrew Scriptures',
          text: 'Messianic expectation develops through promises of kingship, deliverance, and restoration. Texts such as 2 Samuel 7, Isaiah 9, and Micah 5 contribute to this expectation.'
        },
        {
          heading: 'Second Temple Context',
          text: 'By the first century, Jewish expectations varied: some emphasized a Davidic king, others anticipated priestly or prophetic deliverers. This diversity shapes the Gospel narratives.'
        },
        {
          heading: 'Historical Framing',
          text: 'A historical approach traces how these expectations are expressed in Scripture without imposing later doctrinal frameworks.'
        }
      ],
      keyTerms: [
        { term: 'Messiah', definition: 'Anointed leader expected in Israel’s hope' },
        { term: 'Davidic Covenant', definition: 'Promise of an enduring Davidic line (2 Samuel 7)' },
        { term: 'Second Temple Judaism', definition: 'Jewish context from the return to AD 70' }
      ],
      quiz: [
        { question: 'Messianic expectation is rooted in:', options: ['Only the Gospels', 'Hebrew Scriptures', 'Greek philosophy', 'Roman law'], correct: 1, explanation: 'Messianic expectation develops in the Hebrew Scriptures.' },
        { question: 'The Davidic covenant is found in:', options: ['Genesis 1', '2 Samuel 7', 'Exodus 20', 'Psalm 1'], correct: 1, explanation: '2 Samuel 7 contains the Davidic covenant.' },
        { question: 'Second Temple expectations were:', options: ['Uniform', 'Diverse', 'Nonexistent', 'Only priestly'], correct: 1, explanation: 'Expectations varied in the Second Temple period.' },
        { question: 'Historical framing means:', options: ['Imposing later doctrines', 'Tracing expectations within textual context', 'Ignoring context', 'Avoiding Scripture'], correct: 1, explanation: 'It traces expectations within the text’s context.' },
        { question: 'A messiah is an:', options: ['Anointed leader', 'Roman governor', 'Greek philosopher', 'Temple guard'], correct: 0, explanation: 'Messiah means anointed leader.' }
      ]
    },
    {
      id: '02',
      title: 'Titles of Jesus',
      icon: '👑',
      duration: '25 min',
      content: [
        {
          heading: 'Key Titles',
          text: 'The New Testament applies titles such as Messiah/Christ, Son of David, Son of Man, Lord, and Son of God. Each carries distinct biblical background and meaning.'
        },
        {
          heading: 'Son of Man',
          text: '“Son of Man” echoes Daniel 7 and is used frequently by Jesus in the Gospels, linking authority and eschatological expectation.'
        },
        {
          heading: 'Lord',
          text: '“Lord” functions as a title of authority; in Greek usage it can mean master, while in biblical usage it also echoes divine references in the Septuagint.'
        }
      ],
      keyTerms: [
        { term: 'Christ', definition: 'Greek for “anointed,” equivalent to Messiah' },
        { term: 'Son of Man', definition: 'Title linked to Daniel 7 imagery' },
        { term: 'Lord', definition: 'Title of authority with rich biblical usage' }
      ],
      quiz: [
        { question: '“Christ” means:', options: ['Prophet', 'Anointed', 'Priest only', 'Teacher only'], correct: 1, explanation: 'Christ means anointed.' },
        { question: '“Son of Man” is connected to:', options: ['Daniel 7', 'Leviticus 1', 'Proverbs 1', 'Ruth 1'], correct: 0, explanation: 'It echoes Daniel 7.' },
        { question: 'The title “Lord” can denote:', options: ['Only a village', 'Authority and mastery', 'Only genealogies', 'Only ritual law'], correct: 1, explanation: 'It denotes authority/mastery.' },
        { question: 'Titles help clarify:', options: ['Only geography', 'Identity and mission', 'Only laws', 'Only poetry'], correct: 1, explanation: 'Titles clarify identity and mission.' },
        { question: '“Messiah” is:', options: ['A Roman title', 'Anointed leader', 'A Greek deity', 'A legal term'], correct: 1, explanation: 'Messiah means anointed leader.' }
      ]
    },
    {
      id: '03',
      title: 'Incarnation',
      icon: '🕊️',
      duration: '25 min',
      content: [
        {
          heading: 'The Word Made Flesh',
          text: 'John 1 presents Jesus as the Word (Logos) who became flesh. This frames Jesus’ identity as both divine and human within the Gospel’s narrative.'
        },
        {
          heading: 'Birth Narratives',
          text: 'Matthew and Luke provide birth narratives that situate Jesus within Israel’s story, including Davidic lineage and prophetic fulfillment.'
        },
        {
          heading: 'Historical Context',
          text: 'Incarnation is a theological claim grounded in historical narrative. Interpretation must respect both theological statements and historical framing.'
        }
      ],
      keyTerms: [
        { term: 'Incarnation', definition: 'The Word becoming flesh (John 1)' },
        { term: 'Logos', definition: '“Word,” a title for Jesus in John 1' },
        { term: 'Genealogy', definition: 'Lineage lists in Matthew and Luke' }
      ],
      quiz: [
        { question: 'John 1 describes Jesus as:', options: ['Only a prophet', 'The Word made flesh', 'A temple priest', 'A Roman leader'], correct: 1, explanation: 'John 1 presents Jesus as the Word made flesh.' },
        { question: 'Birth narratives are found in:', options: ['Matthew and Luke', 'Mark and John', 'Acts and Romans', 'Hebrews and James'], correct: 0, explanation: 'Matthew and Luke contain birth narratives.' },
        { question: '“Logos” means:', options: ['Temple', 'Word', 'Wisdom only', 'Law'], correct: 1, explanation: 'Logos means Word.' },
        { question: 'Incarnation refers to:', options: ['A miracle only', 'The Word becoming flesh', 'Only resurrection', 'Only ascension'], correct: 1, explanation: 'It refers to the Word becoming flesh.' },
        { question: 'Genealogies emphasize:', options: ['Random lists', 'Connection to Israel’s story', 'Only geography', 'Only rituals'], correct: 1, explanation: 'They connect Jesus to Israel’s story.' }
      ]
    },
    {
      id: '04',
      title: 'Jesus and Torah',
      icon: '📜',
      duration: '25 min',
      content: [
        {
          heading: 'Teaching on the Law',
          text: 'Jesus engages Torah interpretation in passages like Matthew 5–7. He emphasizes the law’s intent and challenges superficial compliance.'
        },
        {
          heading: 'Great Commandments',
          text: 'Jesus summarizes the law as love for God and neighbor, drawing from Deuteronomy 6 and Leviticus 19.'
        },
        {
          heading: 'Historical Debate',
          text: 'His teaching occurs within Second Temple debates about Torah, highlighting interpretive diversity among Jewish groups.'
        }
      ],
      keyTerms: [
        { term: 'Torah', definition: 'Instruction/law of Israel’s covenant' },
        { term: 'Great Commandment', definition: 'Love for God and neighbor' },
        { term: 'Second Temple Debate', definition: 'Interpretive debates about Torah' }
      ],
      quiz: [
        { question: 'Jesus’ teaching on the law is prominent in:', options: ['Matthew 5–7', 'Leviticus 1', 'Nehemiah 1', 'Malachi 1'], correct: 0, explanation: 'Matthew 5–7 contains key teaching.' },
        { question: 'Jesus summarizes the law with:', options: ['Love God and neighbor', 'Temple rituals only', 'Kingship only', 'Genealogy'], correct: 0, explanation: 'He summarizes the law with love for God and neighbor.' },
        { question: 'Jesus’ teaching occurs within:', options: ['Medieval Europe', 'Second Temple Judaism', 'Babylonian exile', 'Persian empire'], correct: 1, explanation: 'It occurs within Second Temple Judaism.' },
        { question: 'Torah refers to:', options: ['Prophecy only', 'Instruction/law', 'Wisdom only', 'Apocalyptic'], correct: 1, explanation: 'Torah means instruction/law.' },
        { question: 'Jesus critiques:', options: ['Heartless compliance', 'All law', 'All worship', 'All obedience'], correct: 0, explanation: 'He critiques heartless compliance.' }
      ]
    },
    {
      id: '05',
      title: 'Miracles and Authority',
      icon: '✨',
      duration: '25 min',
      content: [
        {
          heading: 'Miracles in the Gospels',
          text: 'Miracles include healings, exorcisms, and nature miracles. They function as signs of authority and kingdom presence.'
        },
        {
          heading: 'Authority in Teaching',
          text: 'The Gospels repeatedly note that Jesus teaches with authority, distinguishing his teaching from other teachers.'
        },
        {
          heading: 'Public Response',
          text: 'Miracles provoke varied responses: faith, opposition, and curiosity. These responses shape the narrative tension.'
        }
      ],
      keyTerms: [
        { term: 'Signs', definition: 'Miracles that reveal authority and identity' },
        { term: 'Authority', definition: 'Power to teach and act with divine backing' },
        { term: 'Kingdom', definition: 'God’s rule breaking into history' }
      ],
      quiz: [
        { question: 'Miracles in the Gospels function as:', options: ['Only entertainment', 'Signs of authority and kingdom', 'Errors', 'Only parables'], correct: 1, explanation: 'They function as signs.' },
        { question: 'The Gospels describe Jesus’ teaching as:', options: ['Confused', 'With authority', 'Only traditional', 'Only poetic'], correct: 1, explanation: 'He teaches with authority.' },
        { question: 'Miracles include:', options: ['Only healings', 'Healings, exorcisms, nature miracles', 'Only prophecy', 'Only ritual acts'], correct: 1, explanation: 'They include multiple types.' },
        { question: 'Public responses to miracles include:', options: ['Only support', 'Faith, opposition, curiosity', 'No reaction', 'Only rejection'], correct: 1, explanation: 'Responses vary.' },
        { question: '“Signs” indicate:', options: ['Random events', 'Revelation of identity and authority', 'Only geography', 'Only rituals'], correct: 1, explanation: 'Signs reveal identity and authority.' }
      ]
    },
    {
      id: '06',
      title: 'Suffering Servant',
      icon: '🕊️',
      duration: '20 min',
      content: [
        {
          heading: 'Isaiah’s Servant Songs',
          text: 'Isaiah 42, 49, 50, and 52–53 describe a servant who suffers and brings justice. These texts influence New Testament presentations of Jesus’ suffering.'
        },
        {
          heading: 'Narrative Fulfillment',
          text: 'The passion narratives emphasize suffering, rejection, and innocence. This aligns with servant imagery without imposing later frameworks.'
        },
        {
          heading: 'Historical Reading',
          text: 'A historical reading observes how the New Testament interprets these texts within its own narrative context.'
        }
      ],
      keyTerms: [
        { term: 'Servant Songs', definition: 'Isaiah passages about the servant (Isaiah 42–53)' },
        { term: 'Passion Narratives', definition: 'Accounts of Jesus’ suffering and death' },
        { term: 'Innocence', definition: 'Suffering without guilt in the narratives' }
      ],
      quiz: [
        { question: 'The Servant Songs are in:', options: ['Isaiah 42–53', 'Exodus 12', 'Psalms 1–2', 'Daniel 1'], correct: 0, explanation: 'They are in Isaiah 42–53.' },
        { question: 'Servant imagery emphasizes:', options: ['Power only', 'Suffering and justice', 'Only kingship', 'Only ritual'], correct: 1, explanation: 'It emphasizes suffering and justice.' },
        { question: 'Passion narratives focus on:', options: ['Temple rituals', 'Suffering and death', 'Genealogy', 'Exile return'], correct: 1, explanation: 'They focus on suffering and death.' },
        { question: 'A historical reading should:', options: ['Ignore context', 'Observe NT use of Isaiah within narrative', 'Avoid texts', 'Impose later frameworks'], correct: 1, explanation: 'It should observe NT use in context.' },
        { question: 'Innocence in the servant imagery highlights:', options: ['Political power', 'Suffering without guilt', 'Military strength', 'Economic policy'], correct: 1, explanation: 'It highlights suffering without guilt.' }
      ]
    },
    {
      id: '07',
      title: 'Death and Atonement Texts',
      icon: '🩸',
      duration: '25 min',
      content: [
        {
          heading: 'Passion in the Gospels',
          text: 'The Gospels present Jesus’ death as a central event, framed by Passover imagery and covenant language.'
        },
        {
          heading: 'Atonement Language',
          text: 'New Testament texts use sacrificial and covenant language to interpret the meaning of Jesus’ death (e.g., Mark 10:45, Romans 3).'
        },
        {
          heading: 'Historical Emphasis',
          text: 'Interpretation should focus on textual evidence and historical context rather than later doctrinal systems.'
        }
      ],
      keyTerms: [
        { term: 'Passover', definition: 'Festival associated with deliverance, linked to Jesus’ death in the Gospels' },
        { term: 'Atonement', definition: 'Language of reconciliation and dealing with sin' },
        { term: 'Covenant', definition: 'Relational framework often used in passion contexts' }
      ],
      quiz: [
        { question: 'Jesus’ death is linked to:', options: ['Passover imagery', 'Only genealogy', 'Only prophecy', 'Only geography'], correct: 0, explanation: 'The Gospels link his death to Passover.' },
        { question: 'Atonement language uses:', options: ['Sacrificial and covenant terms', 'Only political terms', 'Only economic terms', 'Only poetic terms'], correct: 0, explanation: 'It uses sacrificial and covenant terms.' },
        { question: 'A historical approach should:', options: ['Ignore texts', 'Focus on textual evidence and context', 'Replace Scripture', 'Only use later systems'], correct: 1, explanation: 'It should focus on textual evidence and context.' },
        { question: 'Mark 10:45 is often cited for:', options: ['Kingship only', 'Ransom language', 'Temple architecture', 'Genealogy'], correct: 1, explanation: 'It uses ransom language.' },
        { question: 'Covenant language appears in:', options: ['Last Supper accounts', 'Only Psalms', 'Only Proverbs', 'Only Judges'], correct: 0, explanation: 'Covenant language appears in Last Supper accounts.' }
      ]
    },
    {
      id: '08',
      title: 'Resurrection',
      icon: '🌅',
      duration: '25 min',
      content: [
        {
          heading: 'Resurrection Narratives',
          text: 'All four Gospels include resurrection accounts. These narratives present the empty tomb and post-resurrection appearances.'
        },
        {
          heading: 'Historical Claims',
          text: 'The resurrection is presented as a historical claim with named witnesses and locations.'
        },
        {
          heading: 'Theological Significance',
          text: 'New Testament writers connect resurrection to Jesus’ identity and the hope of future resurrection.'
        }
      ],
      keyTerms: [
        { term: 'Resurrection', definition: 'Rising from the dead' },
        { term: 'Witness', definition: 'Those who report post-resurrection appearances' },
        { term: 'Hope', definition: 'Future expectation grounded in resurrection' }
      ],
      quiz: [
        { question: 'Resurrection narratives appear in:', options: ['All four Gospels', 'Only John', 'Only Mark', 'Only Luke'], correct: 0, explanation: 'All four include resurrection accounts.' },
        { question: 'Resurrection is presented as:', options: ['A myth only', 'A historical claim', 'A metaphor only', 'A legal code'], correct: 1, explanation: 'It is presented as historical.' },
        { question: 'Post-resurrection appearances serve as:', options: ['Witness accounts', 'Only poetry', 'Only prophecy', 'Only law'], correct: 0, explanation: 'They function as witness accounts.' },
        { question: 'The resurrection is linked to:', options: ['Only ethics', 'Jesus’ identity and future hope', 'Only temple rituals', 'Only genealogy'], correct: 1, explanation: 'It is linked to identity and hope.' },
        { question: 'The empty tomb is part of:', options: ['Resurrection narratives', 'Only parables', 'Only prophecy', 'Only wisdom'], correct: 0, explanation: 'It is part of resurrection narratives.' }
      ]
    },
    {
      id: '09',
      title: 'Exaltation and Reign',
      icon: '🏛️',
      duration: '20 min',
      content: [
        {
          heading: 'Ascension and Exaltation',
          text: 'Texts such as Acts 1 and Philippians 2 describe Jesus’ exaltation and authority. These passages frame his reign in the New Testament.'
        },
        {
          heading: 'Seated at the Right Hand',
          text: 'Psalm 110 is frequently cited to describe Jesus’ exalted status. This indicates authority and ongoing reign.'
        },
        {
          heading: 'Kingdom Vision',
          text: 'The New Testament links Jesus’ reign with the advance of God’s kingdom and final consummation.'
        }
      ],
      keyTerms: [
        { term: 'Ascension', definition: 'Jesus’ departure and exaltation (Acts 1)' },
        { term: 'Exaltation', definition: 'Raising to a position of honor and authority' },
        { term: 'Psalm 110', definition: 'Text cited in relation to Jesus’ reign' }
      ],
      quiz: [
        { question: 'Acts 1 describes:', options: ['Exile return', 'Ascension', 'Creation', 'Law giving'], correct: 1, explanation: 'Acts 1 describes the ascension.' },
        { question: 'Psalm 110 is used to describe:', options: ['Temple rituals', 'Jesus’ exalted reign', 'Only genealogy', 'Only prophecy'], correct: 1, explanation: 'It describes exalted reign.' },
        { question: 'Exaltation implies:', options: ['Loss of authority', 'Honor and authority', 'Only suffering', 'Only ritual'], correct: 1, explanation: 'Exaltation implies honor and authority.' },
        { question: 'The NT links Jesus’ reign with:', options: ['God’s kingdom', 'Only politics', 'Only law codes', 'Only genealogy'], correct: 0, explanation: 'It links to the kingdom of God.' },
        { question: 'A common phrase is:', options: ['Seated at the right hand', 'Hidden in the wilderness', 'Only in the temple', 'Only in exile'], correct: 0, explanation: 'The phrase is “seated at the right hand.”' }
      ]
    },
    {
      id: '10',
      title: 'Christ and Salvation',
      icon: '🧭',
      duration: '25 min',
      content: [
        {
          heading: 'Gospel Summary',
          text: 'The New Testament presents salvation as centered on Jesus’ life, death, and resurrection. This is summarized in passages like 1 Corinthians 15.'
        },
        {
          heading: 'Faith and Response',
          text: 'Responses include repentance, faith, and allegiance. These are described across the Gospels and epistles.'
        },
        {
          heading: 'Community Formation',
          text: 'Salvation is linked to the formation of a community characterized by reconciliation, holiness, and mission.'
        }
      ],
      keyTerms: [
        { term: 'Gospel', definition: 'Good news about Jesus’ saving work' },
        { term: 'Repentance', definition: 'Turning toward God' },
        { term: 'Faith', definition: 'Trust and allegiance to Jesus' }
      ],
      quiz: [
        { question: '1 Corinthians 15 summarizes:', options: ['Temple rituals', 'The gospel of Jesus’ death and resurrection', 'Only genealogy', 'Only prophecy'], correct: 1, explanation: 'It summarizes the gospel.' },
        { question: 'Responses to the gospel include:', options: ['Repentance and faith', 'Only ritual', 'Only law', 'Only prophecy'], correct: 0, explanation: 'Repentance and faith are key responses.' },
        { question: 'Salvation is linked to:', options: ['Community formation', 'Only individual ethics', 'Only politics', 'Only law codes'], correct: 0, explanation: 'It includes community formation.' },
        { question: 'The gospel centers on:', options: ['Jesus’ saving work', 'Only genealogy', 'Only rituals', 'Only politics'], correct: 0, explanation: 'It centers on Jesus’ saving work.' },
        { question: 'Faith in the NT implies:', options: ['Trust and allegiance', 'Only knowledge', 'Only ritual', 'Only works'], correct: 0, explanation: 'Faith implies trust and allegiance.' }
      ]
    },
    {
      id: '11',
      title: 'Christ in the Epistles',
      icon: '✉️',
      duration: '25 min',
      content: [
        {
          heading: 'Pauline Christology',
          text: 'Paul’s letters emphasize Jesus’ lordship, resurrection, and role in creation and redemption (e.g., Philippians 2, Colossians 1).'
        },
        {
          heading: 'General Epistles',
          text: 'Hebrews emphasizes priesthood and covenant, while 1 Peter and 1 John highlight suffering and love. These texts contribute to a broader NT portrayal.'
        },
        {
          heading: 'Unity and Diversity',
          text: 'The epistles present a unified focus on Jesus while reflecting diverse contexts and emphases.'
        }
      ],
      keyTerms: [
        { term: 'Pauline Epistles', definition: 'Letters attributed to Paul' },
        { term: 'Priesthood', definition: 'Hebrews’ emphasis on Jesus’ mediating role' },
        { term: 'Lordship', definition: 'Jesus’ authority emphasized in epistles' }
      ],
      quiz: [
        { question: 'Philippians 2 highlights:', options: ['Only genealogy', 'Jesus’ humility and exaltation', 'Only rituals', 'Only prophecy'], correct: 1, explanation: 'Philippians 2 emphasizes humility and exaltation.' },
        { question: 'Hebrews emphasizes:', options: ['Only kingship', 'Priesthood and covenant', 'Only law codes', 'Only parables'], correct: 1, explanation: 'Hebrews emphasizes priesthood and covenant.' },
        { question: 'Paul’s letters emphasize:', options: ['Jesus’ lordship and resurrection', 'Only history', 'Only genealogy', 'Only ritual'], correct: 0, explanation: 'Paul emphasizes lordship and resurrection.' },
        { question: 'General epistles contribute to:', options: ['No portrait of Jesus', 'A broader NT portrayal', 'Only law', 'Only prophecy'], correct: 1, explanation: 'They contribute to the NT portrayal.' },
        { question: 'Epistles reflect:', options: ['Uniform contexts only', 'Diverse contexts and emphases', 'Only one context', 'No context'], correct: 1, explanation: 'They reflect diverse contexts.' }
      ]
    },
    {
      id: '12',
      title: 'Synthesis',
      icon: '📚',
      duration: '20 min',
      content: [
        {
          heading: 'Historical and Textual Summary',
          text: 'Christology in the New Testament is grounded in historical narrative, teaching, and apostolic interpretation. A synthesis must follow the texts rather than impose external systems.'
        },
        {
          heading: 'Key Themes',
          text: 'Messianic identity, authority, suffering, resurrection, and reign are central themes across the New Testament.'
        },
        {
          heading: 'Responsible Interpretation',
          text: 'Interpretation should remain text-driven, respecting historical context and avoiding denominational bias.'
        }
      ],
      keyTerms: [
        { term: 'Synthesis', definition: 'Bringing together themes into a coherent summary' },
        { term: 'Text-Driven', definition: 'Grounded in scriptural evidence' },
        { term: 'Historical Context', definition: 'Time, place, and cultural setting of the texts' }
      ],
      quiz: [
        { question: 'A Christology synthesis should be:', options: ['Text-driven', 'Denominationally prescriptive', 'Context-free', 'Only speculative'], correct: 0, explanation: 'It should be text-driven.' },
        { question: 'Central themes include:', options: ['Messianic identity and resurrection', 'Only exile', 'Only ritual law', 'Only genealogy'], correct: 0, explanation: 'These are central themes.' },
        { question: 'Responsible interpretation respects:', options: ['Historical context', 'No context', 'Only tradition', 'Only modern opinion'], correct: 0, explanation: 'It respects historical context.' },
        { question: 'Synthesis means:', options: ['Ignoring details', 'Bringing themes together coherently', 'Avoiding Scripture', 'Only listing verses'], correct: 1, explanation: 'Synthesis brings themes together coherently.' },
        { question: 'Christology should avoid:', options: ['Textual evidence', 'Denominational bias', 'Historical context', 'Scripture'], correct: 1, explanation: 'It should avoid denominational bias.' }
      ]
    }
  ],
  finalExam: [
    { question: 'Messianic expectation is rooted in:', options: ['Hebrew Scriptures', 'Greek philosophy', 'Roman law', 'Modern theology'], correct: 0, explanation: 'It is rooted in Hebrew Scriptures.' },
    { question: 'The Davidic covenant is found in:', options: ['2 Samuel 7', 'Genesis 1', 'Exodus 20', 'Psalm 1'], correct: 0, explanation: 'It appears in 2 Samuel 7.' },
    { question: '“Christ” means:', options: ['Anointed', 'Teacher', 'Priest only', 'Prophet only'], correct: 0, explanation: 'Christ means anointed.' },
    { question: '“Son of Man” echoes:', options: ['Daniel 7', 'Leviticus 1', 'Ruth 1', 'Proverbs 1'], correct: 0, explanation: 'It echoes Daniel 7.' },
    { question: 'John 1 presents Jesus as:', options: ['The Word made flesh', 'A temple priest', 'A Roman leader', 'Only a prophet'], correct: 0, explanation: 'John 1 presents Jesus as the Word.' },
    { question: 'Birth narratives are found in:', options: ['Matthew and Luke', 'Mark and John', 'Acts and Romans', 'Hebrews and James'], correct: 0, explanation: 'Matthew and Luke contain birth narratives.' },
    { question: 'Jesus summarizes the law with:', options: ['Love God and neighbor', 'Temple rituals only', 'Kingship only', 'Genealogy'], correct: 0, explanation: 'Love God and neighbor summarizes the law.' },
    { question: 'Miracles in the Gospels function as:', options: ['Signs of authority and kingdom', 'Only entertainment', 'Errors', 'Only parables'], correct: 0, explanation: 'They function as signs.' },
    { question: 'The Servant Songs are in:', options: ['Isaiah 42–53', 'Exodus 12', 'Psalms 1–2', 'Daniel 1'], correct: 0, explanation: 'They are in Isaiah 42–53.' },
    { question: 'Atonement language uses:', options: ['Sacrificial and covenant terms', 'Only political terms', 'Only economic terms', 'Only poetic terms'], correct: 0, explanation: 'It uses sacrificial and covenant terms.' },
    { question: 'Resurrection narratives appear in:', options: ['All four Gospels', 'Only John', 'Only Mark', 'Only Luke'], correct: 0, explanation: 'All four include resurrection accounts.' },
    { question: 'Acts 1 describes:', options: ['Ascension', 'Exile return', 'Creation', 'Law giving'], correct: 0, explanation: 'Acts 1 describes the ascension.' },
    { question: 'Psalm 110 is used to describe:', options: ['Jesus’ exalted reign', 'Temple rituals', 'Only genealogy', 'Only prophecy'], correct: 0, explanation: 'It describes exalted reign.' },
    { question: '1 Corinthians 15 summarizes:', options: ['The gospel of Jesus’ death and resurrection', 'Temple rituals', 'Only genealogy', 'Only prophecy'], correct: 0, explanation: 'It summarizes the gospel.' },
    { question: 'Paul’s letters emphasize:', options: ['Jesus’ lordship and resurrection', 'Only history', 'Only genealogy', 'Only ritual'], correct: 0, explanation: 'Paul emphasizes lordship and resurrection.' },
    { question: 'Hebrews emphasizes:', options: ['Priesthood and covenant', 'Only kingship', 'Only law codes', 'Only parables'], correct: 0, explanation: 'Hebrews emphasizes priesthood and covenant.' },
    { question: 'Christology synthesis should be:', options: ['Text-driven', 'Context-free', 'Only denominational', 'Only speculative'], correct: 0, explanation: 'It should be text-driven.' },
    { question: 'A key Christology theme is:', options: ['Resurrection', 'Only exile', 'Only ritual law', 'Only genealogy'], correct: 0, explanation: 'Resurrection is a key theme.' },
    { question: '“Lord” functions as:', options: ['Title of authority', 'Only geography', 'Only ritual', 'Only genealogy'], correct: 0, explanation: 'It functions as a title of authority.' },
    { question: 'Second Temple Judaism refers to:', options: ['Jewish context from return to AD 70', 'Only the monarchy', 'Only the exile', 'Medieval Europe'], correct: 0, explanation: 'It refers to the period from return to AD 70.' }
  ],
  about: {
    level: 'Associate-Level Course',
    description: 'A historical and text-driven study of Jesus’ identity and mission in the New Testament, grounded in biblical narrative and Second Temple context without denominational bias.',
    credits: '3 credits',
    prerequisites: 'New Testament Survey recommended'
  }
};

export default christologyCourse;
