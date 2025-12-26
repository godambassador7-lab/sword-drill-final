/**
 * Topical Chains for RAG System
 * Curated ordered sequences of verses showing biblical teaching progression
 * Each chain tells a coherent theological story
 */

export const TOPICAL_CHAINS = {
  // SALVATION
  salvation: {
    title: 'The Way of Salvation',
    description: 'Biblical progression from sin to redemption',
    verses: [
      { ref: 'Romans 3:23', connector: 'All have sinned', theme: 'universal_sin' },
      { ref: 'Romans 6:23', connector: 'Sin\'s wages vs God\'s gift', theme: 'consequence_and_grace' },
      { ref: 'Romans 5:8', connector: 'God\'s love demonstrated', theme: 'divine_love' },
      { ref: 'John 3:16', connector: 'Belief brings eternal life', theme: 'faith_requirement' },
      { ref: 'Ephesians 2:8-9', connector: 'Saved by grace through faith', theme: 'grace_not_works' },
      { ref: 'Romans 10:9-10', connector: 'Confession and belief', theme: 'response' },
      { ref: '2 Corinthians 5:17', connector: 'New creation in Christ', theme: 'transformation' },
      { ref: '1 John 5:13', connector: 'Assurance of eternal life', theme: 'assurance' }
    ]
  },

  // FAITH
  faith: {
    title: 'The Life of Faith',
    description: 'From justification to sanctification by faith',
    verses: [
      { ref: 'Hebrews 11:1', connector: 'Definition of faith', theme: 'foundation' },
      { ref: 'Hebrews 11:6', connector: 'Faith pleases God', theme: 'necessity' },
      { ref: 'Romans 1:17', connector: 'Righteous live by faith', theme: 'justification' },
      { ref: 'Galatians 2:20', connector: 'Living by faith in Christ', theme: 'daily_life' },
      { ref: 'James 2:17', connector: 'Faith without works is dead', theme: 'faith_and_works' },
      { ref: 'Romans 4:3', connector: 'Abraham\'s faith credited as righteousness', theme: 'example' },
      { ref: 'Hebrews 12:2', connector: 'Jesus, author and perfecter', theme: 'source' },
      { ref: '2 Corinthians 5:7', connector: 'Walk by faith not sight', theme: 'perseverance' }
    ]
  },

  // COVENANT
  covenant: {
    title: 'God\'s Covenant Promises',
    description: 'Progressive revelation of covenant relationship',
    verses: [
      { ref: 'Genesis 12:1-3', connector: 'Abrahamic covenant begins', theme: 'promise_to_abraham' },
      { ref: 'Genesis 15:6', connector: 'Abraham believes', theme: 'faith_response' },
      { ref: 'Genesis 17:7', connector: 'Everlasting covenant', theme: 'permanence' },
      { ref: 'Exodus 19:5-6', connector: 'Mosaic covenant at Sinai', theme: 'law_covenant' },
      { ref: 'Jeremiah 31:31-33', connector: 'Promise of new covenant', theme: 'new_covenant_promised' },
      { ref: 'Luke 22:20', connector: 'Jesus establishes new covenant', theme: 'fulfillment' },
      { ref: 'Hebrews 8:6', connector: 'Better covenant, better promises', theme: 'superiority' },
      { ref: 'Hebrews 9:15', connector: 'Mediator of new covenant', theme: 'christ_as_mediator' }
    ]
  },

  // KINGDOM
  kingdom: {
    title: 'The Kingdom of God',
    description: 'From prophecy to fulfillment to consummation',
    verses: [
      { ref: 'Daniel 2:44', connector: 'Kingdom that will never be destroyed', theme: 'prophecy' },
      { ref: 'Matthew 3:2', connector: 'Kingdom of heaven is at hand', theme: 'announcement' },
      { ref: 'Matthew 6:33', connector: 'Seek first the kingdom', theme: 'priority' },
      { ref: 'Mark 1:15', connector: 'Kingdom has come near', theme: 'inauguration' },
      { ref: 'Luke 17:20-21', connector: 'Kingdom is within you', theme: 'present_reality' },
      { ref: 'John 18:36', connector: 'My kingdom is not of this world', theme: 'nature' },
      { ref: 'Colossians 1:13', connector: 'Transferred to kingdom of Son', theme: 'citizenship' },
      { ref: 'Revelation 11:15', connector: 'Kingdom of our Lord forever', theme: 'consummation' }
    ]
  },

  // SUFFERING
  suffering: {
    title: 'Purpose in Suffering',
    description: 'Biblical perspective on trials and perseverance',
    verses: [
      { ref: 'Job 1:21', connector: 'The Lord gives and takes away', theme: 'sovereignty' },
      { ref: 'Psalm 34:19', connector: 'Many afflictions, but delivered', theme: 'promise' },
      { ref: 'Romans 5:3-5', connector: 'Suffering produces perseverance', theme: 'character_building' },
      { ref: 'Romans 8:28', connector: 'All things work for good', theme: 'providence' },
      { ref: '2 Corinthians 1:3-4', connector: 'Comforted to comfort others', theme: 'ministry' },
      { ref: 'James 1:2-4', connector: 'Consider it joy', theme: 'perspective' },
      { ref: '1 Peter 4:12-13', connector: 'Share in Christ\'s sufferings', theme: 'fellowship' },
      { ref: 'Revelation 21:4', connector: 'No more tears or pain', theme: 'future_hope' }
    ]
  },

  // LOVE
  love: {
    title: 'The Nature of Love',
    description: 'From God\'s love to loving others',
    verses: [
      { ref: '1 John 4:8', connector: 'God is love', theme: 'divine_nature' },
      { ref: '1 John 4:19', connector: 'We love because He first loved us', theme: 'source' },
      { ref: 'John 13:34-35', connector: 'New commandment to love', theme: 'command' },
      { ref: '1 Corinthians 13:4-7', connector: 'Love is patient and kind', theme: 'description' },
      { ref: 'Romans 13:10', connector: 'Love fulfills the law', theme: 'fulfillment' },
      { ref: 'Matthew 22:37-39', connector: 'Love God and neighbor', theme: 'great_commandment' },
      { ref: '1 John 3:18', connector: 'Love in deed and truth', theme: 'action' },
      { ref: '1 Corinthians 13:13', connector: 'Greatest of these is love', theme: 'supremacy' }
    ]
  },

  // PRAYER
  prayer: {
    title: 'The Practice of Prayer',
    description: 'Teaching on communion with God',
    verses: [
      { ref: 'Matthew 6:6', connector: 'Pray in secret', theme: 'intimacy' },
      { ref: 'Matthew 6:9-13', connector: 'The Lord\'s Prayer model', theme: 'pattern' },
      { ref: 'Philippians 4:6', connector: 'Present requests with thanksgiving', theme: 'method' },
      { ref: '1 Thessalonians 5:17', connector: 'Pray without ceasing', theme: 'frequency' },
      { ref: 'James 5:16', connector: 'Prayer of righteous is powerful', theme: 'effectiveness' },
      { ref: 'John 14:13-14', connector: 'Ask in Jesus\' name', theme: 'authority' },
      { ref: '1 John 5:14-15', connector: 'Confidence according to His will', theme: 'assurance' },
      { ref: 'Luke 18:1', connector: 'Always pray and not lose heart', theme: 'perseverance' }
    ]
  },

  // HOLY SPIRIT
  holy_spirit: {
    title: 'The Person and Work of the Holy Spirit',
    description: 'From promise to indwelling to empowerment',
    verses: [
      { ref: 'John 14:16-17', connector: 'Promise of the Helper', theme: 'promise' },
      { ref: 'John 16:13', connector: 'Spirit guides into truth', theme: 'teaching' },
      { ref: 'Acts 1:8', connector: 'Power when Spirit comes', theme: 'empowerment' },
      { ref: 'Acts 2:38', connector: 'Receive gift of Holy Spirit', theme: 'reception' },
      { ref: 'Romans 8:9', connector: 'Spirit dwells in you', theme: 'indwelling' },
      { ref: 'Romans 8:26', connector: 'Spirit intercedes for us', theme: 'intercession' },
      { ref: 'Galatians 5:22-23', connector: 'Fruit of the Spirit', theme: 'fruit' },
      { ref: 'Ephesians 5:18', connector: 'Be filled with the Spirit', theme: 'filling' }
    ]
  },

  // SPIRITUAL WARFARE
  spiritual_warfare: {
    title: 'Standing Firm in Spiritual Battle',
    description: 'Understanding and engaging spiritual conflict',
    verses: [
      { ref: 'Ephesians 6:12', connector: 'Not against flesh and blood', theme: 'enemy_identified' },
      { ref: 'James 4:7', connector: 'Resist devil, he will flee', theme: 'resistance' },
      { ref: '1 Peter 5:8', connector: 'Be alert, enemy prowls', theme: 'vigilance' },
      { ref: 'Ephesians 6:13-17', connector: 'Put on full armor of God', theme: 'armor' },
      { ref: '2 Corinthians 10:4-5', connector: 'Weapons demolish strongholds', theme: 'weapons' },
      { ref: 'Romans 16:20', connector: 'God will crush Satan', theme: 'victory_promised' },
      { ref: '1 John 4:4', connector: 'Greater is He in you', theme: 'confidence' },
      { ref: 'Revelation 12:11', connector: 'Overcome by the blood', theme: 'triumph' }
    ]
  },

  // WISDOM
  wisdom: {
    title: 'The Path of Wisdom',
    description: 'From fear of the Lord to skillful living',
    verses: [
      { ref: 'Proverbs 1:7', connector: 'Fear of Lord is beginning', theme: 'foundation' },
      { ref: 'Proverbs 3:5-6', connector: 'Trust with all your heart', theme: 'trust' },
      { ref: 'James 1:5', connector: 'Ask God for wisdom', theme: 'source' },
      { ref: 'Proverbs 4:7', connector: 'Wisdom is supreme', theme: 'priority' },
      { ref: 'Colossians 2:3', connector: 'Treasures hidden in Christ', theme: 'christ_centered' },
      { ref: 'James 3:17', connector: 'Wisdom from above is pure', theme: 'characteristics' },
      { ref: 'Proverbs 9:10', connector: 'Knowledge of Holy One is understanding', theme: 'relationship' },
      { ref: 'Ecclesiastes 12:13', connector: 'Fear God and keep commands', theme: 'conclusion' }
    ]
  },

  // RESURRECTION
  resurrection: {
    title: 'The Hope of Resurrection',
    description: 'From Christ\'s resurrection to ours',
    verses: [
      { ref: '1 Corinthians 15:3-4', connector: 'Christ died and rose', theme: 'gospel_core' },
      { ref: 'Romans 6:4', connector: 'Raised to walk in newness', theme: 'spiritual_resurrection' },
      { ref: '1 Corinthians 15:20', connector: 'Christ firstfruits of resurrection', theme: 'firstfruits' },
      { ref: 'John 11:25', connector: 'I am the resurrection and life', theme: 'christ_as_resurrection' },
      { ref: '1 Thessalonians 4:16', connector: 'Dead in Christ will rise first', theme: 'rapture' },
      { ref: '1 Corinthians 15:51-52', connector: 'We shall all be changed', theme: 'transformation' },
      { ref: 'Philippians 3:21', connector: 'Bodies transformed to glory', theme: 'glorification' },
      { ref: 'Revelation 20:6', connector: 'Blessed in first resurrection', theme: 'eternal_life' }
    ]
  },

  // STEWARDSHIP
  stewardship: {
    title: 'Biblical Stewardship',
    description: 'Managing God\'s resources faithfully',
    verses: [
      { ref: 'Genesis 1:28', connector: 'Subdue earth, have dominion', theme: 'original_mandate' },
      { ref: 'Psalm 24:1', connector: 'Earth is the Lord\'s', theme: 'ownership' },
      { ref: '1 Corinthians 4:2', connector: 'Stewards must be faithful', theme: 'requirement' },
      { ref: 'Matthew 25:14-30', connector: 'Parable of talents', theme: 'accountability' },
      { ref: 'Luke 12:48', connector: 'Much given, much required', theme: 'responsibility' },
      { ref: 'Malachi 3:10', connector: 'Bring whole tithe', theme: 'giving' },
      { ref: '2 Corinthians 9:6-7', connector: 'Cheerful giver', theme: 'generosity' },
      { ref: 'Matthew 6:19-21', connector: 'Treasures in heaven', theme: 'eternal_perspective' }
    ]
  },

  // DISCIPLESHIP
  discipleship: {
    title: 'Following Jesus as Disciples',
    description: 'The call and cost of discipleship',
    verses: [
      { ref: 'Matthew 28:19-20', connector: 'Make disciples of all nations', theme: 'great_commission' },
      { ref: 'Luke 9:23', connector: 'Deny self, take up cross', theme: 'cost' },
      { ref: 'John 8:31', connector: 'Continue in my word', theme: 'commitment' },
      { ref: 'John 13:35', connector: 'Love one another', theme: 'mark_of_discipleship' },
      { ref: 'John 15:8', connector: 'Bear much fruit', theme: 'fruitfulness' },
      { ref: 'Matthew 10:38', connector: 'Take cross and follow', theme: 'sacrifice' },
      { ref: '2 Timothy 2:2', connector: 'Entrust to faithful people', theme: 'multiplication' },
      { ref: 'Colossians 1:28', connector: 'Present everyone mature', theme: 'goal' }
    ]
  },

  // FORGIVENESS
  forgiveness: {
    title: 'The Ministry of Forgiveness',
    description: 'From receiving to extending forgiveness',
    verses: [
      { ref: 'Psalm 103:12', connector: 'Removed our transgressions', theme: 'divine_forgiveness' },
      { ref: 'Ephesians 1:7', connector: 'Redemption through His blood', theme: 'basis' },
      { ref: '1 John 1:9', connector: 'Confess and be forgiven', theme: 'condition' },
      { ref: 'Matthew 6:14-15', connector: 'Forgive to be forgiven', theme: 'requirement' },
      { ref: 'Colossians 3:13', connector: 'Forgive as Lord forgave', theme: 'pattern' },
      { ref: 'Matthew 18:21-22', connector: 'Seventy times seven', theme: 'unlimited' },
      { ref: 'Luke 23:34', connector: 'Father, forgive them', theme: 'example' },
      { ref: 'Ephesians 4:32', connector: 'Be kind and forgiving', theme: 'application' }
    ]
  },

  // WORSHIP
  worship: {
    title: 'True Worship',
    description: 'The heart and practice of worship',
    verses: [
      { ref: 'Psalm 95:6', connector: 'Come let us worship', theme: 'invitation' },
      { ref: 'John 4:23-24', connector: 'Worship in spirit and truth', theme: 'nature' },
      { ref: 'Psalm 100:4', connector: 'Enter with thanksgiving', theme: 'approach' },
      { ref: 'Romans 12:1', connector: 'Living sacrifice', theme: 'whole_life' },
      { ref: 'Hebrews 13:15', connector: 'Sacrifice of praise', theme: 'verbal_praise' },
      { ref: 'Revelation 4:11', connector: 'Worthy to receive glory', theme: 'heavenly_worship' },
      { ref: 'Psalm 29:2', connector: 'Worship in splendor of holiness', theme: 'holiness' },
      { ref: '1 Chronicles 16:29', connector: 'Bring offering and worship', theme: 'giving' }
    ]
  },

  // UNITY
  unity: {
    title: 'Christian Unity',
    description: 'One body, one Spirit, one Lord',
    verses: [
      { ref: 'John 17:21', connector: 'That they may be one', theme: 'jesus_prayer' },
      { ref: 'Ephesians 4:3', connector: 'Keep unity of Spirit', theme: 'command' },
      { ref: 'Ephesians 4:4-6', connector: 'One body, Spirit, Lord', theme: 'foundation' },
      { ref: '1 Corinthians 1:10', connector: 'No divisions among you', theme: 'appeal' },
      { ref: 'Philippians 2:2', connector: 'Same mind and love', theme: 'attitude' },
      { ref: 'Colossians 3:14', connector: 'Love binds in perfect unity', theme: 'bond' },
      { ref: 'Romans 15:5-6', connector: 'One voice glorify God', theme: 'purpose' },
      { ref: 'Psalm 133:1', connector: 'How good to dwell in unity', theme: 'blessing' }
    ]
  }
};

/**
 * Get chain by topic ID
 * @param {string} topicId - Topic identifier
 * @returns {Object|null} Chain object
 */
export function getTopicalChain(topicId) {
  return TOPICAL_CHAINS[topicId] || null;
}

/**
 * Get all available topic IDs
 * @returns {Array} List of topic IDs
 */
export function getAvailableTopics() {
  return Object.keys(TOPICAL_CHAINS);
}

/**
 * Search chains by keyword
 * @param {string} keyword - Search term
 * @returns {Array} Matching chains
 */
export function searchTopicalChains(keyword) {
  const results = [];
  const normalizedKeyword = keyword.toLowerCase();

  for (const [topicId, chain] of Object.entries(TOPICAL_CHAINS)) {
    if (
      topicId.includes(normalizedKeyword) ||
      chain.title.toLowerCase().includes(normalizedKeyword) ||
      chain.description.toLowerCase().includes(normalizedKeyword)
    ) {
      results.push({
        topicId,
        title: chain.title,
        description: chain.description,
        verseCount: chain.verses.length
      });
    }
  }

  return results;
}

/**
 * Format a topical chain for display
 * @param {string} topicId - Topic identifier
 * @returns {string|null} Formatted chain
 */
export function formatTopicalChain(topicId) {
  const chain = getTopicalChain(topicId);
  if (!chain) return null;

  let output = `## 🔗 ${chain.title}\n\n`;
  output += `*${chain.description}*\n\n`;

  chain.verses.forEach((verse, idx) => {
    output += `**${idx + 1}. ${verse.ref}** - ${verse.connector}\n`;
  });

  output += `\n---\n`;
  output += `📚 This chain follows ${chain.verses.length} verses showing progressive biblical teaching.\n`;

  return output;
}

/**
 * Find chains containing a specific reference
 * @param {string} reference - Bible reference
 * @returns {Array} Chains containing this verse
 */
export function findChainsWithReference(reference) {
  const results = [];

  for (const [topicId, chain] of Object.entries(TOPICAL_CHAINS)) {
    const found = chain.verses.find(v => v.ref === reference || v.ref.startsWith(reference));
    if (found) {
      results.push({
        topicId,
        title: chain.title,
        connector: found.connector,
        theme: found.theme,
        position: chain.verses.indexOf(found) + 1,
        totalVerses: chain.verses.length
      });
    }
  }

  return results;
}

export default {
  TOPICAL_CHAINS,
  getTopicalChain,
  getAvailableTopics,
  searchTopicalChains,
  formatTopicalChain,
  findChainsWithReference
};
