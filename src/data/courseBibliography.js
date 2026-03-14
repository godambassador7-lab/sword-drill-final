const DEFAULT_BIBLIOGRAPHY = {
  primary: [
    'The Hebrew Bible / Old Testament (MT), Septuagint (LXX), and Greek New Testament critical texts (NA/UBS).',
    'Major English translations with textual notes (e.g., KJV, ASV, WEB, ESV/NIV where available).'
  ],
  secondary: [
    'Carson, D. A., and Douglas J. Moo. An Introduction to the New Testament.',
    'Tremper Longman III and Raymond B. Dillard. An Introduction to the Old Testament.',
    'Klein, Blomberg, and Hubbard. Introduction to Biblical Interpretation.'
  ],
  furtherReading: [
    'Use current peer-reviewed commentaries and journal literature for advanced work.'
  ]
};

const BIBLIOGRAPHY_BY_KEY = {
  biblicalHermeneutics: {
    primary: [
      '2 Timothy 3:16-17; 2 Peter 1:20-21; Luke 24:27.',
      'Representative biblical genres: narrative, poetry, prophecy, gospel, epistle, apocalyptic.'
    ],
    secondary: [
      'Grant R. Osborne. The Hermeneutical Spiral.',
      'Anthony C. Thiselton. Hermeneutics: An Introduction.',
      'Gordon Fee and Douglas Stuart. How to Read the Bible for All Its Worth.'
    ],
    furtherReading: [
      'Kevin J. Vanhoozer (ed.). Dictionary for Theological Interpretation of the Bible.'
    ]
  },
  biblicalExegeticalMethods: {
    primary: [
      'Close-reading passages across testaments (e.g., Psalms, Romans, Gospel pericopes).'
    ],
    secondary: [
      'Moises Silva. Biblical Words and Their Meaning.',
      'David Alan Black and David S. Dockery (eds.). Interpreting the New Testament.',
      'Kaiser and Silva. An Introduction to Biblical Hermeneutics.'
    ],
    furtherReading: [
      'Use major lexicons/grammars and critical commentaries for method practice.'
    ]
  },
  textualCriticism: {
    primary: [
      'Codex Sinaiticus, Codex Vaticanus, major papyri (P45, P46, P66, P75), and Dead Sea Scroll witnesses.'
    ],
    secondary: [
      'Bruce M. Metzger and Bart D. Ehrman. The Text of the New Testament.',
      'Peter J. Gurry and Elijah Hixson (eds.). Myths and Mistakes in New Testament Textual Criticism.',
      'Emanuel Tov. Textual Criticism of the Hebrew Bible.'
    ],
    furtherReading: [
      'David Parker. An Introduction to the New Testament Manuscripts and Their Texts.'
    ]
  },
  textualTransmission: {
    primary: [
      'Representative manuscript traditions (Hebrew, Greek, Latin, Syriac, Coptic).'
    ],
    secondary: [
      'Larry W. Hurtado. The Earliest Christian Artifacts.',
      'Philip Comfort. Encountering the Manuscripts.',
      'Timothy N. Lim. The Dead Sea Scrolls: A Very Short Introduction.'
    ],
    furtherReading: [
      'Consult current critical apparatus notes in NA/UBS and BHQ/BHS.'
    ]
  },
  biblicalCanon: {
    primary: [
      'Canonical lists, early patristic citations, and reception-history evidence.'
    ],
    secondary: [
      'F. F. Bruce. The Canon of Scripture.',
      'Lee Martin McDonald. The Biblical Canon.',
      'Michael J. Kruger. Canon Revisited.'
    ],
    furtherReading: [
      'Study regional canon reception (East/West, Jewish/Christian traditions).'
    ]
  },
  biblicalArchaeology: {
    primary: [
      'Excavation reports, inscriptions, and stratigraphic datasets where available.'
    ],
    secondary: [
      'Amihai Mazar. Archaeology of the Land of the Bible.',
      'K. A. Kitchen. On the Reliability of the Old Testament.',
      'James K. Hoffmeier. Ancient Israel in Sinai.'
    ],
    furtherReading: [
      'Track current debate through peer-reviewed archaeology journals.'
    ]
  },
  oldTestamentSurvey: {
    primary: [
      'Canonical OT book corpus with attention to historical and literary context.'
    ],
    secondary: [
      'Longman and Dillard. An Introduction to the Old Testament.',
      'John H. Walton. Ancient Near Eastern Thought and the Old Testament.'
    ],
    furtherReading: [
      'Use theological dictionaries and historical atlases for context.'
    ]
  },
  newTestamentSurvey: {
    primary: [
      'Canonical NT corpus with synoptic and epistolary context comparison.'
    ],
    secondary: [
      'Carson and Moo. An Introduction to the New Testament.',
      'Craig Blomberg. Jesus and the Gospels.'
    ],
    furtherReading: [
      'Use major NT introductions and commentaries for author/date/source debates.'
    ]
  },
  secondTempleJudaism: {
    primary: [
      'Josephus, Philo, Dead Sea Scrolls, and key intertestamental literature.'
    ],
    secondary: [
      'Shaye J. D. Cohen. From the Maccabees to the Mishnah.',
      'N. T. Wright. The New Testament and the People of God.'
    ],
    furtherReading: [
      'Explore sectarian literature and temple-period socio-political history.'
    ]
  },
  mosaicLaw: {
    primary: [
      'Exodus-Deuteronomy legal corpora and covenant passages.'
    ],
    secondary: [
      'Christopher J. H. Wright. Old Testament Ethics for the People of God.',
      'Gordon J. Wenham. Exploring the Old Testament: The Pentateuch.'
    ],
    furtherReading: [
      'Compare covenant-law structures with Ancient Near Eastern treaty forms.'
    ]
  },
  christology: {
    primary: [
      'Key Christological texts: John 1, Philippians 2, Colossians 1, Hebrews 1.'
    ],
    secondary: [
      'Richard Bauckham. Jesus and the God of Israel.',
      'Larry W. Hurtado. Lord Jesus Christ.'
    ],
    furtherReading: [
      'Use patristic sources for early doctrinal development.'
    ]
  },
  pneumatology: {
    primary: [
      'Acts, John 14-16, Romans 8, 1 Corinthians 12-14.'
    ],
    secondary: [
      'Gordon D. Fee. God\'s Empowering Presence.',
      'Sinclair B. Ferguson. The Holy Spirit.'
    ],
    furtherReading: [
      'Compare cessationist/continuationist arguments with exegetical controls.'
    ]
  },
  demonology: {
    primary: [
      'Synoptic exorcism narratives, Acts, and epistolary warfare texts.'
    ],
    secondary: [
      'Clinton E. Arnold. 3 Crucial Questions About Spiritual Warfare.',
      'Graham H. Twelftree. In the Name of Jesus.'
    ],
    furtherReading: [
      'Use Second Temple background sources for conceptual development.'
    ]
  },
  biblicalEthics: {
    primary: [
      'Torah ethics, prophetic critiques, Jesus\' kingdom ethics, and apostolic paraenesis.'
    ],
    secondary: [
      'Christopher J. H. Wright. Old Testament Ethics for the People of God.',
      'Glen H. Stassen and David P. Gushee. Kingdom Ethics.'
    ],
    furtherReading: [
      'Map moral reasoning by narrative, law, wisdom, and gospel genres.'
    ]
  },
  capstone: {
    primary: [
      'Defined thesis corpus: biblical text in original-language context and historical sources.'
    ],
    secondary: [
      'Kate L. Turabian. A Manual for Writers.',
      'Wayne C. Booth et al. The Craft of Research.'
    ],
    furtherReading: [
      'Require peer-reviewed sources and explicit methodological justification.'
    ]
  },
  diplomaCapstone: {
    primary: [
      'Advanced thesis corpus with explicit source-critical and historical controls.'
    ],
    secondary: [
      'Turabian. A Manual for Writers.',
      'Booth et al. The Craft of Research.'
    ],
    furtherReading: [
      'Require argument mapping, alternative-views engagement, and citation discipline.'
    ]
  }
};

const normalizeKey = (value) => String(value || '').replace(/[^a-z0-9]/gi, '').toLowerCase();

export const getCourseBibliography = (courseData = {}) => {
  const idKey = normalizeKey(courseData.id);
  const titleKey = normalizeKey(courseData.title);

  const matched =
    Object.entries(BIBLIOGRAPHY_BY_KEY).find(([k]) => normalizeKey(k) === idKey)?.[1] ||
    Object.entries(BIBLIOGRAPHY_BY_KEY).find(([k]) => titleKey.includes(normalizeKey(k)))?.[1] ||
    null;

  return matched || DEFAULT_BIBLIOGRAPHY;
};

export default getCourseBibliography;
