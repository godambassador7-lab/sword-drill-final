/**
 * Per-Book Study Plans with Pericope Boundaries
 * Provides structured reading tracks with natural section divisions
 * Each plan includes genre notes, memory verses, and reading order
 */

export const STUDY_PLANS = {
  // GOSPELS
  Matthew: {
    genre: 'Gospel - Jewish-Christian perspective',
    readingTime: '2-3 weeks',
    keyThemes: ['Messiah', 'Kingdom of Heaven', 'Fulfillment of Prophecy'],
    memoryVerses: ['Matthew 5:16', 'Matthew 6:33', 'Matthew 28:19-20'],
    pericopes: [
      { section: 'Birth and Early Life', verses: '1:1-2:23', summary: 'Genealogy, virgin birth, visit of Magi, flight to Egypt', days: 1 },
      { section: 'Preparation for Ministry', verses: '3:1-4:25', summary: 'John the Baptist, baptism, temptation, calling disciples', days: 1 },
      { section: 'Sermon on the Mount', verses: '5:1-7:29', summary: 'Beatitudes, salt and light, Lord\'s Prayer, Golden Rule', days: 2 },
      { section: 'Miracles and Authority', verses: '8:1-9:38', summary: 'Healing leper, centurion\'s faith, calming storm, raising dead', days: 2 },
      { section: 'Mission Discourse', verses: '10:1-42', summary: 'Sending the twelve, persecution, rewards', days: 1 },
      { section: 'Opposition Grows', verses: '11:1-12:50', summary: 'John\'s question, Sabbath controversies, blasphemy accusation', days: 2 },
      { section: 'Parables of the Kingdom', verses: '13:1-58', summary: 'Sower, wheat/tares, mustard seed, hidden treasure', days: 2 },
      { section: 'Miracles and Teachings', verses: '14:1-17:27', summary: 'Feeding 5000, walking on water, Peter\'s confession, transfiguration', days: 3 },
      { section: 'Community Discourse', verses: '18:1-35', summary: 'Greatness, discipline, forgiveness, unforgiving servant', days: 1 },
      { section: 'Journey to Jerusalem', verses: '19:1-20:34', summary: 'Divorce, rich young ruler, laborers in vineyard, blind men', days: 2 },
      { section: 'Confrontation in Jerusalem', verses: '21:1-23:39', summary: 'Triumphal entry, cleansing temple, woes to Pharisees', days: 3 },
      { section: 'Olivet Discourse', verses: '24:1-25:46', summary: 'End times signs, parables of readiness, final judgment', days: 2 },
      { section: 'Passion Week', verses: '26:1-27:66', summary: 'Last Supper, Gethsemane, trials, crucifixion, burial', days: 3 },
      { section: 'Resurrection', verses: '28:1-20', summary: 'Empty tomb, appearances, Great Commission', days: 1 }
    ]
  },

  Mark: {
    genre: 'Gospel - Fast-paced action narrative',
    readingTime: '1-2 weeks',
    keyThemes: ['Suffering Servant', 'Discipleship', 'Immediate Action'],
    memoryVerses: ['Mark 1:15', 'Mark 10:45', 'Mark 16:15'],
    pericopes: [
      { section: 'Rapid Beginning', verses: '1:1-45', summary: 'John, baptism, temptation, calling, early miracles', days: 1 },
      { section: 'Controversy Stories', verses: '2:1-3:35', summary: 'Paralytic, calling Levi, Sabbath, choosing twelve', days: 2 },
      { section: 'Parables by the Sea', verses: '4:1-41', summary: 'Sower, lamp, mustard seed, calming storm', days: 1 },
      { section: 'Power Over All', verses: '5:1-43', summary: 'Gerasene demoniac, Jairus\' daughter, bleeding woman', days: 1 },
      { section: 'Rejection and Mission', verses: '6:1-56', summary: 'Nazareth, twelve sent, Herod, feeding 5000, walking on water', days: 2 },
      { section: 'Tradition and Faith', verses: '7:1-8:26', summary: 'Clean/unclean, Syrophoenician woman, feeding 4000', days: 2 },
      { section: 'The Way of the Cross', verses: '8:27-9:50', summary: 'Peter\'s confession, transfiguration, casting out demon', days: 2 },
      { section: 'Journey to Jerusalem', verses: '10:1-52', summary: 'Divorce, children, rich man, blind Bartimaeus', days: 2 },
      { section: 'Jerusalem Ministry', verses: '11:1-13:37', summary: 'Entry, temple, controversies, apocalyptic discourse', days: 3 },
      { section: 'Passion Narrative', verses: '14:1-15:47', summary: 'Anointing, Last Supper, arrest, trial, crucifixion', days: 2 },
      { section: 'Resurrection', verses: '16:1-20', summary: 'Empty tomb, appearances, commission, ascension', days: 1 }
    ]
  },

  Luke: {
    genre: 'Gospel - Gentile-oriented orderly account',
    readingTime: '3-4 weeks',
    keyThemes: ['Compassion', 'Prayer', 'Holy Spirit', 'Universal Salvation'],
    memoryVerses: ['Luke 4:18-19', 'Luke 9:23', 'Luke 19:10'],
    pericopes: [
      { section: 'Births Foretold', verses: '1:1-80', summary: 'Prologue, John\'s birth announced, Mary\'s visit, births', days: 2 },
      { section: 'Birth and Childhood', verses: '2:1-52', summary: 'Census, nativity, shepherds, presentation, boy in temple', days: 1 },
      { section: 'Preparation', verses: '3:1-4:13', summary: 'John preaches, Jesus baptized, genealogy, temptation', days: 1 },
      { section: 'Galilean Ministry Begins', verses: '4:14-5:39', summary: 'Nazareth rejection, calling, healing, eating with sinners', days: 2 },
      { section: 'Sermon on the Plain', verses: '6:1-49', summary: 'Choosing twelve, beatitudes/woes, love enemies, good tree', days: 2 },
      { section: 'Ministry in Galilee', verses: '7:1-9:50', summary: 'Centurion, widow\'s son, sinful woman, parables, feeding 5000', days: 4 },
      { section: 'Journey Narrative Begins', verses: '9:51-11:54', summary: 'Samaritan village, 72 sent, Good Samaritan, Mary/Martha, prayer', days: 3 },
      { section: 'Teachings on the Way', verses: '12:1-14:35', summary: 'Warnings, parables, repentance, healing, counting cost', days: 3 },
      { section: 'Parables of Grace', verses: '15:1-17:10', summary: 'Lost sheep/coin/son, unjust steward, rich man/Lazarus', days: 2 },
      { section: 'Approaching Jerusalem', verses: '17:11-19:27', summary: 'Ten lepers, coming kingdom, persistent widow, Zacchaeus', days: 2 },
      { section: 'Jerusalem Ministry', verses: '19:28-21:38', summary: 'Entry, temple, controversies, widow\'s offering, end times', days: 3 },
      { section: 'Passion and Death', verses: '22:1-23:56', summary: 'Last Supper, arrest, trials, crucifixion, burial', days: 3 },
      { section: 'Resurrection Appearances', verses: '24:1-53', summary: 'Empty tomb, Emmaus road, upper room, ascension', days: 1 }
    ]
  },

  John: {
    genre: 'Gospel - Theological reflection',
    readingTime: '3 weeks',
    keyThemes: ['Deity of Christ', 'Belief', 'Eternal Life', 'I AM Statements'],
    memoryVerses: ['John 1:1', 'John 3:16', 'John 14:6', 'John 20:31'],
    pericopes: [
      { section: 'Prologue', verses: '1:1-18', summary: 'Word became flesh, witness of John', days: 1 },
      { section: 'First Week of Ministry', verses: '1:19-2:12', summary: 'John\'s testimony, calling disciples, wedding at Cana', days: 1 },
      { section: 'Early Jerusalem Ministry', verses: '2:13-3:36', summary: 'Temple cleansing, Nicodemus, John\'s final witness', days: 2 },
      { section: 'Samaria and Galilee', verses: '4:1-54', summary: 'Woman at well, official\'s son healed', days: 1 },
      { section: 'Sabbath Healing', verses: '5:1-47', summary: 'Pool of Bethesda, discourse on authority', days: 1 },
      { section: 'Bread of Life', verses: '6:1-71', summary: 'Feeding 5000, walking on water, bread discourse', days: 2 },
      { section: 'Feast of Tabernacles', verses: '7:1-8:59', summary: 'Brothers\' unbelief, living water, light of world, before Abraham', days: 3 },
      { section: 'Blind Man Healed', verses: '9:1-41', summary: 'Man born blind, Pharisees investigate', days: 1 },
      { section: 'Good Shepherd', verses: '10:1-42', summary: 'Shepherd discourse, Feast of Dedication, beyond Jordan', days: 1 },
      { section: 'Raising Lazarus', verses: '11:1-57', summary: 'Lazarus dies and raised, plot to kill Jesus', days: 2 },
      { section: 'Final Public Ministry', verses: '12:1-50', summary: 'Anointing, entry, Greeks seek, unbelief', days: 2 },
      { section: 'Upper Room Discourse', verses: '13:1-16:33', summary: 'Washing feet, new commandment, I AM the way, Holy Spirit, prayer', days: 4 },
      { section: 'High Priestly Prayer', verses: '17:1-26', summary: 'Jesus prays for himself, disciples, all believers', days: 1 },
      { section: 'Passion Narrative', verses: '18:1-19:42', summary: 'Arrest, trials, crucifixion, burial', days: 2 },
      { section: 'Resurrection', verses: '20:1-31', summary: 'Empty tomb, Mary, disciples, Thomas, purpose statement', days: 1 },
      { section: 'Epilogue', verses: '21:1-25', summary: 'Fishing, breakfast, Peter restored, beloved disciple', days: 1 }
    ]
  },

  Romans: {
    genre: 'Epistle - Systematic theology',
    readingTime: '2-3 weeks',
    keyThemes: ['Justification by Faith', 'Sin and Salvation', 'Law and Grace'],
    memoryVerses: ['Romans 1:16-17', 'Romans 3:23-24', 'Romans 6:23', 'Romans 8:28', 'Romans 12:1-2'],
    pericopes: [
      { section: 'Introduction', verses: '1:1-17', summary: 'Greeting, thanksgiving, theme: righteousness by faith', days: 1 },
      { section: 'Universal Sin', verses: '1:18-3:20', summary: 'God\'s wrath, Gentile/Jewish guilt, none righteous', days: 2 },
      { section: 'Justification', verses: '3:21-5:21', summary: 'Righteousness through faith, Abraham, peace with God, Adam/Christ', days: 3 },
      { section: 'Sanctification', verses: '6:1-8:39', summary: 'Dead to sin, struggle with sin, life in Spirit, assurance', days: 4 },
      { section: 'Israel\'s Rejection', verses: '9:1-11:36', summary: 'God\'s sovereignty, Israel\'s stumbling, future salvation', days: 3 },
      { section: 'Practical Living', verses: '12:1-15:13', summary: 'Living sacrifice, love, authorities, weak/strong, unity', days: 4 },
      { section: 'Conclusion', verses: '15:14-16:27', summary: 'Paul\'s ministry, travel plans, greetings, doxology', days: 1 }
    ]
  },

  Ephesians: {
    genre: 'Epistle - Church and Christian living',
    readingTime: '1 week',
    keyThemes: ['Unity in Christ', 'Spiritual Blessings', 'Church as Body'],
    memoryVerses: ['Ephesians 2:8-9', 'Ephesians 4:32', 'Ephesians 6:10-11'],
    pericopes: [
      { section: 'Spiritual Blessings', verses: '1:1-23', summary: 'Greeting, blessed in Christ, prayer for wisdom', days: 1 },
      { section: 'Salvation by Grace', verses: '2:1-22', summary: 'Dead in sin, saved by grace, one in Christ', days: 1 },
      { section: 'Mystery Revealed', verses: '3:1-21', summary: 'Paul\'s ministry, Gentiles included, prayer for strength', days: 1 },
      { section: 'Unity in the Body', verses: '4:1-16', summary: 'One body, gifts for building up', days: 1 },
      { section: 'New Life in Christ', verses: '4:17-5:21', summary: 'Put off old, put on new, walk in love/light, be filled', days: 2 },
      { section: 'Household Codes', verses: '5:22-6:9', summary: 'Wives/husbands, children/parents, slaves/masters', days: 1 },
      { section: 'Spiritual Warfare', verses: '6:10-24', summary: 'Armor of God, prayer, final greetings', days: 1 }
    ]
  },

  Philippians: {
    genre: 'Epistle - Joyful pastoral letter',
    readingTime: '4 days',
    keyThemes: ['Joy', 'Partnership', 'Christ\'s Example', 'Contentment'],
    memoryVerses: ['Philippians 1:6', 'Philippians 2:3-4', 'Philippians 4:6-7', 'Philippians 4:13'],
    pericopes: [
      { section: 'Joy in Suffering', verses: '1:1-30', summary: 'Thanksgiving, chains advance gospel, to live is Christ', days: 1 },
      { section: 'Christ\'s Example', verses: '2:1-30', summary: 'Humility, Christ\'s hymn, work out salvation, Timothy/Epaphroditus', days: 1 },
      { section: 'Warning and Goal', verses: '3:1-21', summary: 'Beware dogs, knowing Christ, press toward goal, citizenship', days: 1 },
      { section: 'Joy and Peace', verses: '4:1-23', summary: 'Rejoice, prayer, think on these, contentment, thanks', days: 1 }
    ]
  },

  Hebrews: {
    genre: 'Epistle - Sermon on Christ\'s superiority',
    readingTime: '2 weeks',
    keyThemes: ['Superiority of Christ', 'Faith', 'New Covenant', 'Perseverance'],
    memoryVerses: ['Hebrews 4:12', 'Hebrews 11:1', 'Hebrews 12:1-2', 'Hebrews 13:5'],
    pericopes: [
      { section: 'Superior to Angels', verses: '1:1-2:18', summary: 'Son reflects God\'s glory, crowned with glory, help in temptation', days: 2 },
      { section: 'Superior to Moses', verses: '3:1-4:13', summary: 'Builder of house, rest remains, word is living', days: 2 },
      { section: 'Superior High Priest', verses: '4:14-7:28', summary: 'Sympathetic priest, order of Melchizedek, better covenant', days: 3 },
      { section: 'Superior Covenant', verses: '8:1-10:18', summary: 'New covenant, heavenly sanctuary, one sacrifice forever', days: 3 },
      { section: 'Call to Persevere', verses: '10:19-12:29', summary: 'Draw near, hall of faith, discipline, unshakable kingdom', days: 4 },
      { section: 'Final Exhortations', verses: '13:1-25', summary: 'Love, purity, contentment, obey leaders, benediction', days: 1 }
    ]
  },

  James: {
    genre: 'Epistle - Practical wisdom',
    readingTime: '5 days',
    keyThemes: ['Faith and Works', 'Trials', 'Tongue', 'Wisdom'],
    memoryVerses: ['James 1:2-3', 'James 1:22', 'James 2:17', 'James 4:7'],
    pericopes: [
      { section: 'Trials and Wisdom', verses: '1:1-27', summary: 'Joy in trials, ask for wisdom, be doers', days: 1 },
      { section: 'Favoritism and Faith', verses: '2:1-26', summary: 'No partiality, faith without works dead', days: 1 },
      { section: 'Taming the Tongue', verses: '3:1-18', summary: 'Teachers judged, tongue controls, wisdom from above', days: 1 },
      { section: 'Worldliness and Pride', verses: '4:1-17', summary: 'Quarrels, submit to God, humble yourselves, boasting', days: 1 },
      { section: 'Patience and Prayer', verses: '5:1-20', summary: 'Rich warned, be patient, power of prayer, restore wanderer', days: 1 }
    ]
  },

  Revelation: {
    genre: 'Apocalyptic - Prophetic vision',
    readingTime: '3 weeks',
    keyThemes: ['Christ\'s Victory', 'Persecution', 'Judgment', 'New Creation'],
    memoryVerses: ['Revelation 1:8', 'Revelation 3:20', 'Revelation 21:4', 'Revelation 22:20'],
    pericopes: [
      { section: 'Vision of Christ', verses: '1:1-20', summary: 'Prologue, John on Patmos, Christ among lampstands', days: 1 },
      { section: 'Seven Churches', verses: '2:1-3:22', summary: 'Letters to Ephesus, Smyrna, Pergamum, Thyatira, Sardis, Philadelphia, Laodicea', days: 3 },
      { section: 'Throne Room Vision', verses: '4:1-5:14', summary: 'Throne, 24 elders, four creatures, Lamb takes scroll', days: 1 },
      { section: 'Seven Seals', verses: '6:1-8:5', summary: 'Four horsemen, martyrs, cosmic signs, silence', days: 2 },
      { section: 'Seven Trumpets', verses: '8:6-11:19', summary: 'Plagues, locusts, two witnesses, seventh trumpet', days: 2 },
      { section: 'War in Heaven', verses: '12:1-14:20', summary: 'Woman/dragon, beasts, 144000, angel messages, harvest', days: 2 },
      { section: 'Seven Bowls', verses: '15:1-16:21', summary: 'Wrath poured out, Armageddon', days: 1 },
      { section: 'Babylon Falls', verses: '17:1-19:10', summary: 'Great prostitute, kings lament, hallelujah chorus', days: 2 },
      { section: 'Final Victory', verses: '19:11-20:15', summary: 'Rider on white horse, millennium, final judgment', days: 2 },
      { section: 'New Creation', verses: '21:1-22:21', summary: 'New heaven/earth, new Jerusalem, tree of life, come Lord Jesus', days: 2 }
    ]
  }
};

/**
 * Get study plan for a book
 * @param {string} bookName - Book name
 * @returns {Object|null} Study plan
 */
export function getStudyPlan(bookName) {
  return STUDY_PLANS[bookName] || null;
}

/**
 * Get all books with study plans
 * @returns {Array} List of book names
 */
export function getAvailableStudyPlans() {
  return Object.keys(STUDY_PLANS);
}

/**
 * Format study plan for display
 * @param {string} bookName - Book name
 * @returns {string|null} Formatted plan
 */
export function formatStudyPlan(bookName) {
  const plan = getStudyPlan(bookName);
  if (!plan) return null;

  let output = `## 📚 Study Plan: ${bookName}\n\n`;
  output += `**Genre**: ${plan.genre}\n`;
  output += `**Suggested Time**: ${plan.readingTime}\n`;
  output += `**Key Themes**: ${plan.keyThemes.join(', ')}\n\n`;

  output += `**Memory Verses**: ${plan.memoryVerses.join(', ')}\n\n`;

  output += `### Reading Schedule\n\n`;

  let currentDay = 1;
  plan.pericopes.forEach((pericope, idx) => {
    output += `**Day ${currentDay}`;
    if (pericope.days > 1) {
      output += `-${currentDay + pericope.days - 1}`;
    }
    output += `**: ${pericope.section} (${pericope.verses})\n`;
    output += `   ${pericope.summary}\n\n`;
    currentDay += pericope.days;
  });

  output += `---\n`;
  output += `📖 This ${plan.pericopes.length}-section plan guides you through ${bookName} with natural reading breaks.\n`;

  return output;
}

/**
 * Find which pericope a passage falls into
 * @param {string} bookName - Book name
 * @param {number} chapter - Chapter number
 * @returns {Object|null} Pericope info
 */
export function getPericopeForPassage(bookName, chapter) {
  const plan = getStudyPlan(bookName);
  if (!plan) return null;

  for (const pericope of plan.pericopes) {
    // Parse verse range (e.g., "1:1-2:23" or "5:1-47")
    const match = pericope.verses.match(/(\d+):(\d+)-(\d+):?(\d+)?/);
    if (match) {
      const startChapter = parseInt(match[1]);
      const endChapter = match[4] ? parseInt(match[3]) : parseInt(match[1]);

      if (chapter >= startChapter && chapter <= endChapter) {
        return {
          section: pericope.section,
          verses: pericope.verses,
          summary: pericope.summary
        };
      }
    }
  }

  return null;
}

export default {
  STUDY_PLANS,
  getStudyPlan,
  getAvailableStudyPlans,
  formatStudyPlan,
  getPericopeForPassage
};
