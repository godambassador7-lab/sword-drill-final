/**
 * Neutrality Guard - Expanded Edition
 * Ensures denominational neutrality on contested theological issues
 * Presents major Christian traditions fairly without implied default
 */

// Hot topics requiring neutrality and multiple perspectives
export const HOT_TOPICS = {
  baptism: {
    keywords: ['baptism', 'baptize', 'christening', 'infant baptism', 'believer baptism'],
    title: 'Baptism: Mode and Recipients',
    traditions: [
      {
        name: 'Baptist/Evangelical',
        view: 'Believer\'s baptism by immersion only',
        basis: 'Baptism follows conscious faith decision',
        keyVerses: ['Acts 2:38', 'Romans 6:3-4', 'Acts 8:12'],
        note: 'Emphasizes personal profession of faith'
      },
      {
        name: 'Presbyterian/Reformed',
        view: 'Infant baptism (paedobaptism) by sprinkling/pouring',
        basis: 'Children of believers included in covenant',
        keyVerses: ['Acts 2:39', 'Acts 16:15', 'Colossians 2:11-12'],
        note: 'Sees baptism as covenant sign like circumcision'
      },
      {
        name: 'Catholic/Orthodox',
        view: 'Infant baptism necessary for salvation, confers grace',
        basis: 'Baptism regenerates and removes original sin',
        keyVerses: ['John 3:5', 'Acts 2:38', 'Titus 3:5'],
        note: 'Sacramental view with ex opere operato efficacy'
      },
      {
        name: 'Lutheran',
        view: 'Infant baptism works forgiveness, creates faith',
        basis: 'Baptism is God\'s work, not human work',
        keyVerses: ['Mark 10:13-16', 'Acts 2:38-39', '1 Peter 3:21'],
        note: 'Word + water creates saving faith even in infants'
      }
    ],
    neutralStatement: 'Christians hold different views on baptism based on their understanding of covenant, faith, and sacraments.'
  },

  spiritual_gifts: {
    keywords: ['tongues', 'speaking in tongues', 'gifts of the spirit', 'cessationism', 'continuationism', 'prophecy today'],
    title: 'Spiritual Gifts: Continuation or Cessation',
    traditions: [
      {
        name: 'Pentecostal/Charismatic',
        view: 'All spiritual gifts continue today, tongues as evidence',
        basis: 'No biblical indication gifts have ceased',
        keyVerses: ['1 Corinthians 12-14', 'Acts 2:1-4', 'Joel 2:28'],
        note: 'Emphasizes experiential dimension and empowerment'
      },
      {
        name: 'Continuationist (Non-Pentecostal)',
        view: 'All gifts available but not tongues as evidence',
        basis: 'Gifts given as Spirit wills for edification',
        keyVerses: ['1 Corinthians 12:11', 'Romans 12:6-8', 'Ephesians 4:11'],
        note: 'Affirms gifts without Pentecostal distinctives'
      },
      {
        name: 'Cessationist',
        view: 'Miraculous gifts ceased with apostolic age',
        basis: 'Gifts authenticated apostles, canon now complete',
        keyVerses: ['1 Corinthians 13:8-10', 'Hebrews 2:3-4', '2 Corinthians 12:12'],
        note: 'Scripture alone sufficient, no new revelation needed'
      }
    ],
    neutralStatement: 'Christians disagree on whether miraculous spiritual gifts continue today or ceased with the apostles.'
  },

  predestination: {
    keywords: ['predestination', 'election', 'free will', 'calvinism', 'arminianism', 'tulip', 'chosen'],
    title: 'Salvation: Divine Sovereignty and Human Responsibility',
    traditions: [
      {
        name: 'Calvinist/Reformed',
        view: 'Unconditional election, irresistible grace, perseverance',
        basis: 'God sovereignly chooses who will be saved',
        keyVerses: ['Romans 9:16', 'Ephesians 1:4-5', 'John 6:37'],
        note: 'TULIP: Total depravity, Unconditional election, Limited atonement, Irresistible grace, Perseverance'
      },
      {
        name: 'Arminian',
        view: 'Conditional election based on foreseen faith',
        basis: 'God desires all to be saved, human choice matters',
        keyVerses: ['1 Timothy 2:4', 'John 3:16', '2 Peter 3:9'],
        note: 'Emphasizes prevenient grace enabling free response'
      },
      {
        name: 'Molinist (Middle Knowledge)',
        view: 'God actualizes world where elect freely choose',
        basis: 'God knows what free creatures would do',
        keyVerses: ['Acts 2:23', '1 Samuel 23:10-13'],
        note: 'Reconciles sovereignty and freedom via middle knowledge'
      },
      {
        name: 'Corporate Election',
        view: 'God elects Christ and His body, individuals join',
        basis: 'Election primarily of Christ, derivatively of Church',
        keyVerses: ['Ephesians 1:4', '1 Peter 1:1-2', 'Romans 8:29'],
        note: 'Emphasizes being "in Christ" as key to election'
      }
    ],
    neutralStatement: 'Christians hold diverse views on how God\'s sovereignty and human free will relate in salvation.'
  },

  end_times: {
    keywords: ['rapture', 'tribulation', 'millennium', 'second coming', 'eschatology', 'pre-trib', 'post-trib', 'amillennial'],
    title: 'End Times: Eschatological Positions',
    traditions: [
      {
        name: 'Premillennial Dispensational',
        view: 'Pre-tribulation rapture, literal 1000-year reign',
        basis: 'Israel and Church distinct, progressive revelation',
        keyVerses: ['1 Thessalonians 4:16-17', 'Revelation 20:1-6', 'Daniel 9:24-27'],
        note: 'Expects rapture before 7-year tribulation'
      },
      {
        name: 'Historic Premillennial',
        view: 'Post-tribulation rapture, literal millennium',
        basis: 'Church goes through tribulation, then millennium',
        keyVerses: ['Matthew 24:29-31', 'Revelation 20:4-6'],
        note: 'Single return of Christ after tribulation'
      },
      {
        name: 'Amillennial',
        view: 'Millennium is current age, symbolic interpretation',
        basis: 'Church age is millennium, Revelation largely symbolic',
        keyVerses: ['Revelation 20:1-6', 'Colossians 1:13', 'Luke 10:18'],
        note: 'Satan bound at Christ\'s first coming, progressive victory'
      },
      {
        name: 'Postmillennial',
        view: 'Gospel triumph brings millennium, then Christ returns',
        basis: 'Kingdom grows until earth is Christianized',
        keyVerses: ['Matthew 13:31-33', 'Isaiah 2:2-4', '1 Corinthians 15:25'],
        note: 'Optimistic view of gospel\'s transforming power'
      }
    ],
    neutralStatement: 'Christians hold various eschatological views regarding the millennium, rapture, and tribulation.'
  },

  lords_supper: {
    keywords: ['communion', 'eucharist', 'lords supper', 'real presence', 'transubstantiation', 'consubstantiation'],
    title: 'Lord\'s Supper/Eucharist: Presence of Christ',
    traditions: [
      {
        name: 'Catholic',
        view: 'Transubstantiation: bread/wine become Christ\'s body/blood',
        basis: 'Literal interpretation of "This is my body"',
        keyVerses: ['John 6:53-56', 'Matthew 26:26-28', '1 Corinthians 11:27'],
        note: 'Substance changes, accidents remain'
      },
      {
        name: 'Lutheran',
        view: 'Real presence: body/blood "in, with, and under" elements',
        basis: 'Sacramental union, not transubstantiation',
        keyVerses: ['Matthew 26:26', '1 Corinthians 10:16'],
        note: 'Consubstantiation-like view, though Luther rejected term'
      },
      {
        name: 'Reformed',
        view: 'Spiritual presence: Christ spiritually present by faith',
        basis: 'Sign and thing signified distinct but connected',
        keyVerses: ['1 Corinthians 10:16-17', 'John 6:63'],
        note: 'Real spiritual feeding, not physical presence'
      },
      {
        name: 'Memorial/Symbolic',
        view: 'Ordinance: memorial of Christ\'s death, symbolic only',
        basis: 'Remembrance, not sacramental presence',
        keyVerses: ['Luke 22:19', '1 Corinthians 11:24-25'],
        note: 'Emphasizes obedience and remembrance'
      }
    ],
    neutralStatement: 'Christians understand Christ\'s presence in the Lord\'s Supper in different ways, from symbolic to sacramentally real.'
  },

  womens_roles: {
    keywords: ['women pastors', 'women elders', 'women in ministry', 'complementarian', 'egalitarian', 'ordination of women'],
    title: 'Women in Ministry: Offices and Roles',
    traditions: [
      {
        name: 'Complementarian',
        view: 'Men and women equal but distinct roles, male eldership',
        basis: 'Creation order and apostolic teaching',
        keyVerses: ['1 Timothy 2:11-14', '1 Corinthians 11:3', '1 Timothy 3:1-7'],
        note: 'Women serve in many ministries except elder/pastor'
      },
      {
        name: 'Egalitarian',
        view: 'No gender restrictions on ministry roles',
        basis: 'In Christ no male/female, Paul\'s instructions cultural',
        keyVerses: ['Galatians 3:28', 'Acts 2:17-18', 'Romans 16:1-7'],
        note: 'All gifts available to all believers regardless of gender'
      },
      {
        name: 'Hierarchical Complementarian',
        view: 'Women submit to male authority in home and church',
        basis: 'Male headship reflects trinitarian order',
        keyVerses: ['Ephesians 5:22-24', '1 Corinthians 11:3', 'Colossians 3:18'],
        note: 'Strong emphasis on authority structures'
      },
      {
        name: 'Moderate/Soft Complementarian',
        view: 'Women in most ministries but not senior pastor',
        basis: 'Elder office distinct from other ministry gifts',
        keyVerses: ['1 Timothy 3:1-7', 'Titus 1:5-9', 'Romans 16:1'],
        note: 'Women may teach, lead ministries, serve as deacons'
      }
    ],
    neutralStatement: 'Christians interpret Scripture differently regarding women\'s roles in church leadership and teaching.'
  },

  eternal_security: {
    keywords: ['once saved always saved', 'perseverance', 'lose salvation', 'falling away', 'apostasy'],
    title: 'Eternal Security: Can Believers Lose Salvation?',
    traditions: [
      {
        name: 'Eternal Security (Calvinist)',
        view: 'True believers cannot lose salvation, preserved by God',
        basis: 'Perseverance of the saints, God completes His work',
        keyVerses: ['John 10:28-29', 'Romans 8:38-39', 'Philippians 1:6'],
        note: 'Those who fall away were never truly saved'
      },
      {
        name: 'Conditional Security (Arminian)',
        view: 'Believers can forfeit salvation through unbelief',
        basis: 'Faith must be maintained, warnings are real',
        keyVerses: ['Hebrews 6:4-6', 'Hebrews 10:26-27', '2 Peter 2:20-22'],
        note: 'Apostasy is real possibility requiring vigilance'
      },
      {
        name: 'Reformed Perseverance',
        view: 'God preserves elect but uses means (warnings, discipline)',
        basis: 'God\'s sovereignty includes sustaining faith',
        keyVerses: ['1 Corinthians 1:8-9', 'Jude 24-25', '1 Peter 1:5'],
        note: 'Warnings are means God uses to keep His elect'
      }
    ],
    neutralStatement: 'Christians disagree on whether true believers can lose their salvation or are eternally secure.'
  },

  sabbath: {
    keywords: ['sabbath', 'sunday worship', 'lords day', 'saturday worship', 'seventh day'],
    title: 'Sabbath Observance: Day and Practice',
    traditions: [
      {
        name: 'Sabbatarian (Seventh-day)',
        view: 'Saturday Sabbath still binding, fourth commandment',
        basis: 'Sabbath command unchanged, creation ordinance',
        keyVerses: ['Exodus 20:8-11', 'Isaiah 66:22-23', 'Mark 2:27'],
        note: 'Seventh-day Adventists, Seventh Day Baptists'
      },
      {
        name: 'Christian Sabbath (Sunday)',
        view: 'Lord\'s Day (Sunday) is Christian Sabbath',
        basis: 'Resurrection day, apostolic practice',
        keyVerses: ['Acts 20:7', '1 Corinthians 16:2', 'Revelation 1:10'],
        note: 'Traditional Reformed and Presbyterian view'
      },
      {
        name: 'No Sabbath Requirement',
        view: 'Sabbath fulfilled in Christ, no required day',
        basis: 'Ceremonial law abolished, every day is Lord\'s',
        keyVerses: ['Romans 14:5-6', 'Colossians 2:16-17', 'Hebrews 4:9-10'],
        note: 'Believers gather for worship but not as law'
      }
    ],
    neutralStatement: 'Christians hold different views on Sabbath observance and whether it applies to believers today.'
  }
};

/**
 * Detect if query touches on hot topic
 * @param {string} query - User query
 * @returns {Object|null} Hot topic info or null
 */
export function detectHotTopic(query) {
  const lowerQuery = query.toLowerCase();

  for (const [topicId, topic] of Object.entries(HOT_TOPICS)) {
    for (const keyword of topic.keywords) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        return {
          topicId,
          ...topic
        };
      }
    }
  }

  return null;
}

/**
 * Format neutral response for hot topic
 * @param {Object} hotTopic - Hot topic from detectHotTopic
 * @returns {string} Formatted neutral response
 */
export function formatNeutralResponse(hotTopic) {
  if (!hotTopic) return '';

  let output = `## ⚖️ ${hotTopic.title}\n\n`;
  output += `*${hotTopic.neutralStatement}*\n\n`;

  output += `### Major Christian Views\n\n`;

  hotTopic.traditions.forEach((tradition, idx) => {
    output += `**${idx + 1}. ${tradition.name}**\n`;
    output += `- **View**: ${tradition.view}\n`;
    output += `- **Basis**: ${tradition.basis}\n`;
    output += `- **Key Verses**: ${tradition.keyVerses.join(', ')}\n`;
    if (tradition.note) {
      output += `- *Note*: ${tradition.note}\n`;
    }
    output += `\n`;
  });

  output += `---\n\n`;
  output += `📚 **Study Recommendation**: Examine Scripture carefully, consult trusted teachers from your tradition, and approach differences with humility and grace.\n\n`;
  output += `💬 **Remember**: Christians who love Jesus and trust Scripture may reach different conclusions on this matter.\n`;

  return output;
}

/**
 * Get neutrality disclaimer for topic
 * @param {string} topicId - Topic identifier
 * @returns {string} Brief disclaimer
 */
export function getNeutralityDisclaimer(topicId) {
  const topic = HOT_TOPICS[topicId];
  if (!topic) return '';

  return `\n\n⚖️ *Note: ${topic.neutralStatement} See multiple perspectives above.*\n`;
}

/**
 * Check if response needs neutrality guard
 * @param {string} responseText - Generated response
 * @param {Object} hotTopic - Detected hot topic
 * @returns {boolean} True if guard needed
 */
export function needsNeutralityGuard(responseText, hotTopic) {
  if (!hotTopic) return false;

  // Check if response already presents multiple views
  const viewKeywords = ['view', 'perspective', 'tradition', 'position', 'christians hold', 'some believe'];
  const hasMultiplePerspectives = viewKeywords.some(kw => responseText.toLowerCase().includes(kw));

  // If already neutral, no guard needed
  if (hasMultiplePerspectives) {
    const mentionedTraditions = hotTopic.traditions.filter(t =>
      responseText.toLowerCase().includes(t.name.toLowerCase())
    );
    if (mentionedTraditions.length >= 2) {
      return false;
    }
  }

  return true;
}

/**
 * Apply neutrality guard to response
 * @param {string} response - Original response
 * @param {Object} hotTopic - Hot topic detected
 * @returns {string} Response with neutrality guard applied
 */
export function applyNeutralityGuard(response, hotTopic) {
  if (!hotTopic || !needsNeutralityGuard(response, hotTopic)) {
    return response;
  }

  // Prepend neutral multi-perspective response
  return formatNeutralResponse(hotTopic) + '\n\n' + response;
}

/**
 * Backwards-compatible helper used by pipeline.js.
 * Auto-detects hot-topic content and applies neutrality formatting when needed.
 * @param {string} response - Generated response
 * @param {string} query - Optional user query for topic detection
 * @returns {string}
 */
export function applyNeutrality(response, query = '') {
  const hotTopic = detectHotTopic(query || response);
  return applyNeutralityGuard(response, hotTopic);
}

export default {
  HOT_TOPICS,
  detectHotTopic,
  formatNeutralResponse,
  getNeutralityDisclaimer,
  needsNeutralityGuard,
  applyNeutrality,
  applyNeutralityGuard
};
