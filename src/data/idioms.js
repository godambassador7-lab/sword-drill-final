/**
 * Biblical Idioms and Phrases
 * Common Hebrew and Greek expressions with contextual meanings
 */

export const HEBREW_IDIOMS = {
  // Body parts (anthropomorphic expressions)
  'hand of the Lord': {
    hebrew: 'יַד־יְהוָה (yad-YHWH)',
    meaning: 'God\'s power, judgment, or blessing',
    examples: ['Exodus 9:3', '1 Samuel 5:6', 'Ezra 7:9'],
    note: 'Often indicates divine intervention or empowerment'
  },
  'face of the Lord': {
    hebrew: 'פְּנֵי יְהוָה (pene YHWH)',
    meaning: 'God\'s presence, favor, or judgment',
    examples: ['Numbers 6:25', 'Psalm 27:8', 'Jeremiah 21:10'],
    note: 'Seeking God\'s face = seeking His presence and favor'
  },
  'eyes of the Lord': {
    hebrew: 'עֵינֵי יְהוָה (einei YHWH)',
    meaning: 'God\'s knowledge, watchfulness, or attention',
    examples: ['2 Chronicles 16:9', 'Proverbs 15:3', 'Zechariah 4:10'],
    note: 'Indicates God\'s omniscience and providence'
  },

  // Covenant language
  'cut a covenant': {
    hebrew: 'כָּרַת בְּרִית (karat berit)',
    meaning: 'Make a formal covenant or treaty',
    examples: ['Genesis 15:18', 'Exodus 24:8', '1 Samuel 18:3'],
    note: 'Literally "cut" - refers to cutting animals in covenant ceremony'
  },
  'steadfast love': {
    hebrew: 'חֶסֶד (chesed)',
    meaning: 'Covenant loyalty, faithful love, lovingkindness',
    examples: ['Psalm 136:1', 'Lamentations 3:22', 'Hosea 2:19'],
    note: 'Central covenant term expressing God\'s loyal love'
  },

  // Emotional/spiritual states
  'hardened heart': {
    hebrew: 'קָשָׁה לֵב (qashah lev)',
    meaning: 'Stubborn, resistant to God, unrepentant',
    examples: ['Exodus 7:13', 'Deuteronomy 2:30', '2 Chronicles 36:13'],
    note: 'Not merely emotional but volitional resistance'
  },
  'circumcised heart': {
    hebrew: 'מוּל לֵבָב (mul levav)',
    meaning: 'Spiritually receptive, obedient to God',
    examples: ['Deuteronomy 10:16', 'Deuteronomy 30:6', 'Jeremiah 4:4'],
    note: 'Internal spiritual renewal, not just external ritual'
  },
  'broken and contrite heart': {
    hebrew: 'לֵב־נִשְׁבָּר וְנִדְכֶּה (lev-nishbar venidkeh)',
    meaning: 'Humble, repentant spirit',
    examples: ['Psalm 51:17', 'Isaiah 57:15', 'Isaiah 66:2'],
    note: 'God values humility over ritual sacrifice'
  },

  // Time expressions
  'from everlasting to everlasting': {
    hebrew: 'מֵעוֹלָם וְעַד־עוֹלָם (me\'olam ve\'ad-olam)',
    meaning: 'Eternal, without beginning or end',
    examples: ['Psalm 90:2', 'Psalm 103:17', 'Psalm 106:48'],
    note: 'Expresses God\'s eternal nature'
  },
  'in that day': {
    hebrew: 'בַּיּוֹם הַהוּא (bayom hahu)',
    meaning: 'Eschatological time, day of the Lord',
    examples: ['Isaiah 2:11', 'Zechariah 14:4', 'Joel 3:18'],
    note: 'Often refers to future divine judgment or restoration'
  },

  // Directional/moral
  'right in his own eyes': {
    hebrew: 'הַיָּשָׁר בְּעֵינָיו (hayashar be\'einav)',
    meaning: 'Moral relativism, doing as one pleases',
    examples: ['Judges 17:6', 'Judges 21:25', 'Proverbs 21:2'],
    note: 'Indicates absence of divine or communal authority'
  },
  'walked in the ways of': {
    hebrew: 'הָלַךְ בְּדֶרֶךְ (halak bederek)',
    meaning: 'Followed the example or lifestyle of',
    examples: ['1 Kings 15:26', '2 Chronicles 21:6', '2 Kings 8:18'],
    note: 'Walking = manner of life, not just physical movement'
  },

  // Judgment
  'blood on your head': {
    hebrew: 'דָּמְךָ בְרֹאשְׁךָ (damcha beroshe\'cha)',
    meaning: 'You are responsible for your own death/judgment',
    examples: ['2 Samuel 1:16', 'Ezekiel 33:4', 'Acts 18:6'],
    note: 'Legal formula declaring personal responsibility'
  },
  'stiff-necked': {
    hebrew: 'קְשֵׁה־עֹרֶף (qesheh-oref)',
    meaning: 'Stubborn, resistant to correction',
    examples: ['Exodus 32:9', 'Deuteronomy 9:6', 'Acts 7:51'],
    note: 'Like an ox that won\'t turn its neck to the yoke'
  }
};

export const GREEK_IDIOMS = {
  // Faith and salvation
  'in Christ': {
    greek: 'ἐν Χριστῷ (en Christō)',
    meaning: 'United with Christ, in relationship with Christ',
    examples: ['Romans 8:1', '2 Corinthians 5:17', 'Ephesians 1:3'],
    note: 'Paul\'s signature phrase (150+ times) expressing union with Christ'
  },
  'believe into': {
    greek: 'πιστεύω εἰς (pisteuō eis)',
    meaning: 'Trust in, commit to (not just intellectual assent)',
    examples: ['John 3:16', 'John 14:1', 'Acts 10:43'],
    note: 'Preposition eis emphasizes personal commitment, not mere belief'
  },
  'sons of light': {
    greek: 'υἱοὶ φωτός (huioi phōtos)',
    meaning: 'Those characterized by righteousness and truth',
    examples: ['Luke 16:8', 'John 12:36', '1 Thessalonians 5:5'],
    note: 'Semitic idiom: "son of X" = characterized by X'
  },

  // Time and eschatology
  'the last days': {
    greek: 'ἐν ταῖς ἐσχάταις ἡμέραις (en tais eschatais hēmerais)',
    meaning: 'The Messianic age, church age, end times',
    examples: ['Acts 2:17', '2 Timothy 3:1', 'Hebrews 1:2'],
    note: 'Can refer to church age or final judgment period'
  },
  'fullness of time': {
    greek: 'πλήρωμα τοῦ χρόνου (plērōma tou chronou)',
    meaning: 'Appointed time, when God\'s plan is ready',
    examples: ['Galatians 4:4', 'Ephesians 1:10'],
    note: 'God\'s perfect timing in salvation history'
  },

  // Spiritual warfare
  'flesh and blood': {
    greek: 'σὰρξ καὶ αἷμα (sarx kai haima)',
    meaning: 'Human beings, mortal nature',
    examples: ['Matthew 16:17', '1 Corinthians 15:50', 'Ephesians 6:12'],
    note: 'Contrasts physical/human with spiritual/divine'
  },
  'principalities and powers': {
    greek: 'ἀρχαὶ καὶ ἐξουσίαι (archai kai exousiai)',
    meaning: 'Spiritual authorities, angelic/demonic forces',
    examples: ['Ephesians 3:10', 'Ephesians 6:12', 'Colossians 2:15'],
    note: 'Cosmic spiritual hierarchy, both good and evil'
  },

  // Grace and works
  'works of the law': {
    greek: 'ἔργα νόμου (erga nomou)',
    meaning: 'Obedience to Torah, human effort to earn salvation',
    examples: ['Romans 3:20', 'Galatians 2:16', 'Galatians 3:10'],
    note: 'Paul contrasts with justification by faith'
  },
  'under law': {
    greek: 'ὑπὸ νόμον (hupo nomon)',
    meaning: 'Under law\'s authority/condemnation, pre-Christ state',
    examples: ['Romans 6:14-15', 'Galatians 3:23', 'Galatians 5:18'],
    note: 'Contrasts with being "under grace"'
  },

  // Love and unity
  'one another': {
    greek: 'ἀλλήλους (allēlous)',
    meaning: 'Mutual, reciprocal relationships',
    examples: ['John 13:34', 'Romans 12:10', 'Ephesians 4:32'],
    note: 'Reciprocal pronoun emphasizing community responsibility'
  },
  'bowels of compassion': {
    greek: 'σπλάγχνα (splanchna)',
    meaning: 'Deep compassion, visceral mercy',
    examples: ['Philippians 1:8', 'Colossians 3:12', '1 John 3:17'],
    note: 'Literally "intestines" - seat of emotions in ancient thought'
  },

  // Ministry
  'laying on of hands': {
    greek: 'ἐπίθεσις χειρῶν (epithesis cheirōn)',
    meaning: 'Blessing, commissioning, imparting the Spirit',
    examples: ['Acts 8:17', '1 Timothy 4:14', 'Hebrews 6:2'],
    note: 'Ritual act conferring blessing or authority'
  },
  'steward of the mysteries': {
    greek: 'οἰκονόμος μυστηρίων (oikonomos mystēriōn)',
    meaning: 'One entrusted with God\'s revealed truth',
    examples: ['1 Corinthians 4:1', 'Titus 1:7', '1 Peter 4:10'],
    note: 'Steward = household manager with delegated authority'
  },

  // Resurrection
  'firstfruits': {
    greek: 'ἀπαρχή (aparchē)',
    meaning: 'First installment guaranteeing full harvest',
    examples: ['Romans 8:23', '1 Corinthians 15:20', 'James 1:18'],
    note: 'Agricultural metaphor: first portion pledges the rest'
  },
  'putting on': {
    greek: 'ἐνδύω (enduō)',
    meaning: 'Clothing oneself with (virtues, Christ, immortality)',
    examples: ['Romans 13:14', 'Galatians 3:27', '1 Corinthians 15:53'],
    note: 'Metaphor of changing character like changing clothes'
  }
};

/**
 * Find idioms in a text string
 * @param {string} text - Text to search
 * @param {string} language - 'hebrew' or 'greek'
 * @returns {Array} Matching idioms
 */
export function findIdiomsInText(text, language = 'both') {
  const results = [];
  const normalized = text.toLowerCase();

  if (language === 'hebrew' || language === 'both') {
    for (const [phrase, data] of Object.entries(HEBREW_IDIOMS)) {
      if (normalized.includes(phrase.toLowerCase())) {
        results.push({
          language: 'Hebrew',
          phrase,
          ...data
        });
      }
    }
  }

  if (language === 'greek' || language === 'both') {
    for (const [phrase, data] of Object.entries(GREEK_IDIOMS)) {
      if (normalized.includes(phrase.toLowerCase())) {
        results.push({
          language: 'Greek',
          phrase,
          ...data
        });
      }
    }
  }

  return results;
}

/**
 * Get idiom by exact phrase
 * @param {string} phrase - Idiom phrase
 * @returns {Object|null} Idiom data
 */
export function getIdiom(phrase) {
  const normalized = phrase.toLowerCase();

  for (const [key, data] of Object.entries(HEBREW_IDIOMS)) {
    if (key.toLowerCase() === normalized) {
      return { language: 'Hebrew', phrase: key, ...data };
    }
  }

  for (const [key, data] of Object.entries(GREEK_IDIOMS)) {
    if (key.toLowerCase() === normalized) {
      return { language: 'Greek', phrase: key, ...data };
    }
  }

  return null;
}

/**
 * Format idiom for display
 * @param {Object} idiom - Idiom object
 * @returns {string} Formatted display
 */
export function formatIdiom(idiom) {
  if (!idiom) return '';

  let output = `## 📜 Biblical Idiom: "${idiom.phrase}"\n\n`;
  output += `**Language**: ${idiom.language}\n`;
  output += `**Original**: ${idiom.hebrew || idiom.greek}\n\n`;
  output += `**Meaning**: ${idiom.meaning}\n\n`;

  if (idiom.note) {
    output += `**Note**: ${idiom.note}\n\n`;
  }

  if (idiom.examples && idiom.examples.length > 0) {
    output += `**Examples**: ${idiom.examples.join(', ')}\n`;
  }

  return output;
}

export default {
  HEBREW_IDIOMS,
  GREEK_IDIOMS,
  findIdiomsInText,
  getIdiom,
  formatIdiom
};
