/**
 * Passage Outlines with Literary Structure
 * Provides intro, tension, resolution, and key motifs for major passages
 * Helps anchor verses within surrounding argument/narrative
 */

export const PASSAGE_OUTLINES = {
  // GENESIS
  'Genesis 1:1-2:3': {
    title: 'Creation Account',
    structure: {
      intro: 'God creates ordered cosmos from formless void in six days',
      tension: 'Progression from chaos to order, darkness to light, empty to full',
      resolution: 'God declares creation "very good" and rests on seventh day',
      climax: 'Creation of humanity in God\'s image (1:26-27)'
    },
    motifs: ['light/darkness', 'separation', 'order', 'blessing', 'image of God'],
    literaryType: 'Creation narrative with liturgical structure',
    keyVerses: ['Genesis 1:1', 'Genesis 1:26-27', 'Genesis 2:3']
  },

  'Genesis 3:1-24': {
    title: 'The Fall',
    structure: {
      intro: 'Serpent questions God\'s command in the garden',
      tension: 'Temptation, deception, and disobedience escalate',
      resolution: 'Judgment pronounced, but promise of redemption given',
      climax: 'Eating forbidden fruit and eyes opened (3:6-7)'
    },
    motifs: ['deception', 'shame', 'hiding', 'judgment', 'promise'],
    literaryType: 'Narrative with dialogue and cosmic consequences',
    keyVerses: ['Genesis 3:6', 'Genesis 3:15', 'Genesis 3:21']
  },

  // EXODUS
  'Exodus 3:1-4:17': {
    title: 'Burning Bush and Moses\' Call',
    structure: {
      intro: 'Moses tends flock, encounters burning bush',
      tension: 'Moses resists God\'s call with five objections',
      resolution: 'God provides signs and Aaron as spokesman',
      climax: 'God reveals His name: I AM WHO I AM (3:14)'
    },
    motifs: ['holy ground', 'divine name', 'reluctance', 'signs', 'commissioning'],
    literaryType: 'Call narrative with dialogue',
    keyVerses: ['Exodus 3:14', 'Exodus 4:12']
  },

  'Exodus 20:1-17': {
    title: 'The Ten Commandments',
    structure: {
      intro: 'God speaks directly to Israel at Sinai',
      tension: 'Commands establish covenant relationship boundaries',
      resolution: 'Complete moral and social framework given',
      climax: 'Foundational covenant law revealed'
    },
    motifs: ['covenant', 'holiness', 'relationship', 'boundaries', 'community'],
    literaryType: 'Legal code with preamble',
    keyVerses: ['Exodus 20:2-3', 'Exodus 20:12']
  },

  // PSALMS
  'Psalm 23': {
    title: 'The Lord is My Shepherd',
    structure: {
      intro: 'Declaration of trust: The LORD is my shepherd',
      tension: 'Journey through dark valley, enemies present',
      resolution: 'Confidence in God\'s protection and eternal dwelling',
      climax: 'Goodness and mercy follow all days (23:6)'
    },
    motifs: ['shepherd', 'provision', 'protection', 'presence', 'dwelling'],
    literaryType: 'Confidence psalm with pastoral imagery',
    keyVerses: ['Psalm 23:1', 'Psalm 23:4', 'Psalm 23:6']
  },

  'Psalm 51': {
    title: 'David\'s Repentance',
    structure: {
      intro: 'Cry for mercy based on God\'s steadfast love',
      tension: 'Deep confession of sin against God alone',
      resolution: 'Prayer for restoration and renewed spirit',
      climax: 'Create in me a clean heart (51:10)'
    },
    motifs: ['mercy', 'cleansing', 'broken heart', 'renewal', 'sacrifice'],
    literaryType: 'Penitential psalm',
    keyVerses: ['Psalm 51:10', 'Psalm 51:17']
  },

  // ISAIAH
  'Isaiah 53:1-12': {
    title: 'Suffering Servant',
    structure: {
      intro: 'Servant appears unremarkable, rejected by people',
      tension: 'Servant bears our griefs and is pierced for transgressions',
      resolution: 'Servant\'s suffering brings healing and justification',
      climax: 'He was wounded for our transgressions (53:5)'
    },
    motifs: ['suffering', 'substitution', 'rejection', 'healing', 'vindication'],
    literaryType: 'Prophetic poetry with vicarious atonement theme',
    keyVerses: ['Isaiah 53:5', 'Isaiah 53:6', 'Isaiah 53:12']
  },

  // MATTHEW
  'Matthew 5:1-12': {
    title: 'The Beatitudes',
    structure: {
      intro: 'Jesus teaches crowds and disciples on mountain',
      tension: 'Kingdom values reverse worldly expectations',
      resolution: 'Blessing promised for righteous persecution',
      climax: 'Complete reversal of values paradigm'
    },
    motifs: ['blessing', 'reversal', 'kingdom', 'righteousness', 'reward'],
    literaryType: 'Wisdom discourse with formulaic structure',
    keyVerses: ['Matthew 5:3', 'Matthew 5:10-12']
  },

  'Matthew 13:1-23': {
    title: 'Parable of the Sower',
    structure: {
      intro: 'Jesus teaches crowd from boat using parable',
      tension: 'Different soils produce different results',
      resolution: 'Only good soil produces abundant fruit',
      climax: 'Explanation reveals parable concerns reception of word'
    },
    motifs: ['sowing', 'soil', 'fruitfulness', 'hearing', 'understanding'],
    literaryType: 'Parable with interpretation',
    keyVerses: ['Matthew 13:23']
  },

  'Matthew 26:36-46': {
    title: 'Gethsemane',
    structure: {
      intro: 'Jesus takes disciples to garden to pray',
      tension: 'Jesus anguishes, disciples sleep repeatedly',
      resolution: 'Jesus submits to Father\'s will, betrayer arrives',
      climax: 'Not my will but yours be done (26:39)'
    },
    motifs: ['prayer', 'submission', 'anguish', 'weakness', 'betrayal'],
    literaryType: 'Narrative with dramatic tension',
    keyVerses: ['Matthew 26:39', 'Matthew 26:41']
  },

  // JOHN
  'John 3:1-21': {
    title: 'Nicodemus and New Birth',
    structure: {
      intro: 'Pharisee Nicodemus comes to Jesus at night',
      tension: 'Nicodemus struggles to understand spiritual rebirth',
      resolution: 'Gospel core: God so loved the world',
      climax: 'Must be born again (3:3), God so loved (3:16)'
    },
    motifs: ['birth', 'Spirit', 'belief', 'light/darkness', 'love'],
    literaryType: 'Discourse with metaphorical language',
    keyVerses: ['John 3:3', 'John 3:16']
  },

  'John 15:1-17': {
    title: 'Vine and Branches',
    structure: {
      intro: 'Jesus declares "I am the true vine"',
      tension: 'Branches must abide to bear fruit or be cut off',
      resolution: 'Abiding in love produces joy and fruitfulness',
      climax: 'Apart from me you can do nothing (15:5)'
    },
    motifs: ['vine', 'abiding', 'fruit', 'pruning', 'love'],
    literaryType: 'Allegory with application',
    keyVerses: ['John 15:5', 'John 15:9']
  },

  // ROMANS
  'Romans 3:21-31': {
    title: 'Justification by Faith',
    structure: {
      intro: 'Righteousness of God revealed apart from law',
      tension: 'All have sinned and fallen short',
      resolution: 'Justified freely by grace through redemption',
      climax: 'Justified by faith apart from works of law (3:28)'
    },
    motifs: ['righteousness', 'faith', 'grace', 'redemption', 'law'],
    literaryType: 'Theological argument',
    keyVerses: ['Romans 3:23-24', 'Romans 3:28']
  },

  'Romans 8:1-17': {
    title: 'Life in the Spirit',
    structure: {
      intro: 'No condemnation for those in Christ Jesus',
      tension: 'Flesh vs. Spirit, death vs. life contrasted',
      resolution: 'Led by Spirit, adopted as God\'s children',
      climax: 'Law of Spirit of life sets you free (8:2)'
    },
    motifs: ['Spirit', 'life', 'adoption', 'sonship', 'freedom'],
    literaryType: 'Theological exposition with contrast',
    keyVerses: ['Romans 8:1', 'Romans 8:14-15']
  },

  'Romans 12:1-21': {
    title: 'Living Sacrifice',
    structure: {
      intro: 'Present bodies as living sacrifice',
      tension: 'Be transformed, not conformed to world',
      resolution: 'Practical love in community and toward enemies',
      climax: 'Renewed mind discerns God\'s will (12:2)'
    },
    motifs: ['sacrifice', 'transformation', 'renewal', 'love', 'humility'],
    literaryType: 'Ethical exhortation',
    keyVerses: ['Romans 12:1-2', 'Romans 12:21']
  },

  // 1 CORINTHIANS
  '1 Corinthians 13:1-13': {
    title: 'Love Chapter',
    structure: {
      intro: 'Greatest gifts meaningless without love',
      tension: 'Love defined through patient, kind actions',
      resolution: 'Love outlasts all spiritual gifts',
      climax: 'Faith, hope, love remain; greatest is love (13:13)'
    },
    motifs: ['love', 'gifts', 'maturity', 'permanence', 'supremacy'],
    literaryType: 'Encomium (formal praise) with poetic elements',
    keyVerses: ['1 Corinthians 13:4-7', '1 Corinthians 13:13']
  },

  '1 Corinthians 15:1-28': {
    title: 'Resurrection Gospel',
    structure: {
      intro: 'Gospel reminder: Christ died, buried, raised',
      tension: 'If no resurrection, faith is futile',
      resolution: 'Christ firstfruits, believers to follow',
      climax: 'Christ has been raised from the dead (15:20)'
    },
    motifs: ['resurrection', 'gospel', 'witnesses', 'firstfruits', 'victory'],
    literaryType: 'Credal statement with argument',
    keyVerses: ['1 Corinthians 15:3-4', '1 Corinthians 15:20']
  },

  // EPHESIANS
  'Ephesians 2:1-10': {
    title: 'Saved by Grace',
    structure: {
      intro: 'Once dead in trespasses and sins',
      tension: 'Children of wrath by nature',
      resolution: 'Made alive together with Christ by grace',
      climax: 'Saved by grace through faith, not works (2:8-9)'
    },
    motifs: ['grace', 'faith', 'resurrection', 'works', 'gift'],
    literaryType: 'Theological exposition with before/after contrast',
    keyVerses: ['Ephesians 2:4-5', 'Ephesians 2:8-9']
  },

  // PHILIPPIANS
  'Philippians 2:5-11': {
    title: 'Christ Hymn',
    structure: {
      intro: 'Have this mind which was in Christ',
      tension: 'Christ emptied himself, humbled to death',
      resolution: 'God highly exalted, every knee will bow',
      climax: 'Death on cross, then exaltation (2:8-9)'
    },
    motifs: ['humility', 'exaltation', 'obedience', 'lordship', 'worship'],
    literaryType: 'Hymn/creed with descent-ascent pattern',
    keyVerses: ['Philippians 2:6-8', 'Philippians 2:9-11']
  },

  // HEBREWS
  'Hebrews 11:1-40': {
    title: 'Hall of Faith',
    structure: {
      intro: 'Faith defined as assurance and conviction',
      tension: 'Heroes endured by faith, yet didn\'t receive promise',
      resolution: 'They looked forward to better country',
      climax: 'All commended for faith, awaiting fulfillment (11:39-40)'
    },
    motifs: ['faith', 'endurance', 'promise', 'pilgrimage', 'witness'],
    literaryType: 'Encomium with repeated formula',
    keyVerses: ['Hebrews 11:1', 'Hebrews 11:6', 'Hebrews 11:39-40']
  },

  // REVELATION
  'Revelation 21:1-22:5': {
    title: 'New Heaven and New Earth',
    structure: {
      intro: 'Vision of new creation, no more sea',
      tension: 'Old order passed away, all things new',
      resolution: 'New Jerusalem descends, God dwells with people',
      climax: 'No more death, mourning, crying, pain (21:4)'
    },
    motifs: ['new creation', 'dwelling', 'bride', 'glory', 'tree of life'],
    literaryType: 'Apocalyptic vision with prophetic fulfillment',
    keyVerses: ['Revelation 21:1', 'Revelation 21:4', 'Revelation 22:3-5']
  }
};

/**
 * Get outline for a specific passage
 * @param {string} reference - Bible reference (e.g., "John 3:1-21")
 * @returns {Object|null} Passage outline
 */
export function getPassageOutline(reference) {
  return PASSAGE_OUTLINES[reference] || null;
}

/**
 * Find outline containing a specific verse
 * @param {string} book - Book name
 * @param {number} chapter - Chapter number
 * @param {number} verse - Verse number (optional)
 * @returns {Object|null} Matching outline
 */
export function findOutlineForVerse(book, chapter, verse = null) {
  for (const [ref, outline] of Object.entries(PASSAGE_OUTLINES)) {
    // Parse reference range
    const match = ref.match(/^([^0-9]+)\s+(\d+):(\d+)-(\d+):(\d+)$/);
    if (!match) continue;

    const [, outlineBook, startChapter, startVerse, endChapter, endVerse] = match;

    if (outlineBook === book) {
      const start = parseInt(startChapter);
      const end = parseInt(endChapter);

      if (chapter >= start && chapter <= end) {
        // If chapter matches, check verse if provided
        if (verse !== null) {
          const sVerse = parseInt(startVerse);
          const eVerse = parseInt(endVerse);

          if (chapter === start && verse < sVerse) continue;
          if (chapter === end && verse > eVerse) continue;
        }

        return {
          reference: ref,
          ...outline
        };
      }
    }
  }

  return null;
}

/**
 * Format passage outline for display
 * @param {Object} outline - Outline object
 * @returns {string} Formatted outline
 */
export function formatPassageOutline(outline) {
  if (!outline) return '';

  let output = `## 📋 Passage Structure: ${outline.title}\n\n`;

  if (outline.literaryType) {
    output += `**Literary Type**: ${outline.literaryType}\n\n`;
  }

  output += `### Narrative Flow\n\n`;
  output += `**Introduction**: ${outline.structure.intro}\n\n`;
  output += `**Tension**: ${outline.structure.tension}\n\n`;
  output += `**Climax**: ${outline.structure.climax}\n\n`;
  output += `**Resolution**: ${outline.structure.resolution}\n\n`;

  if (outline.motifs && outline.motifs.length > 0) {
    output += `**Key Motifs**: ${outline.motifs.join(', ')}\n\n`;
  }

  if (outline.keyVerses && outline.keyVerses.length > 0) {
    output += `**Key Verses**: ${outline.keyVerses.join(', ')}\n`;
  }

  return output;
}

/**
 * Get all available outlined passages
 * @returns {Array} List of passage references
 */
export function getAvailableOutlines() {
  return Object.keys(PASSAGE_OUTLINES);
}

export default {
  PASSAGE_OUTLINES,
  getPassageOutline,
  findOutlineForVerse,
  formatPassageOutline,
  getAvailableOutlines
};
