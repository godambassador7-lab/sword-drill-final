/**
 * Disambiguation System
 * Proactively handles overloaded names and places in biblical queries
 * Provides clarification prompts when ambiguity detected
 */

// Ambiguous biblical names with multiple referents
export const AMBIGUOUS_NAMES = {
  James: {
    options: [
      {
        id: 'james_apostle_son_zebedee',
        name: 'James, son of Zebedee',
        description: 'One of the Twelve Apostles, brother of John',
        keyFacts: 'Fisherman, part of inner circle with Peter and John',
        keyVerses: ['Matthew 4:21', 'Mark 3:17', 'Acts 12:2'],
        died: 'Martyred by Herod Agrippa I (44 AD)'
      },
      {
        id: 'james_lords_brother',
        name: 'James, the Lord\'s brother',
        description: 'Leader of Jerusalem church, author of James epistle',
        keyFacts: 'Initially skeptical, became believer after resurrection',
        keyVerses: ['Galatians 1:19', 'Acts 15:13', 'James 1:1'],
        died: 'Martyred in Jerusalem (62 AD)'
      },
      {
        id: 'james_son_alphaeus',
        name: 'James, son of Alphaeus',
        description: 'One of the Twelve Apostles (James the Less)',
        keyFacts: 'Less prominent in Gospel accounts',
        keyVerses: ['Matthew 10:3', 'Mark 3:18', 'Acts 1:13'],
        died: 'Unknown'
      }
    ],
    defaultPrompt: 'Which James are you asking about?',
    commonContext: {
      'epistle': 'james_lords_brother',
      'apostle': 'james_apostle_son_zebedee',
      'twelve': 'james_apostle_son_zebedee',
      'john': 'james_apostle_son_zebedee',
      'zebedee': 'james_apostle_son_zebedee',
      'jerusalem': 'james_lords_brother',
      'council': 'james_lords_brother'
    }
  },

  John: {
    options: [
      {
        id: 'john_apostle',
        name: 'John the Apostle',
        description: 'Son of Zebedee, beloved disciple, author of Gospel/Epistles/Revelation',
        keyFacts: 'Fisherman, brother of James, part of inner circle',
        keyVerses: ['John 13:23', 'John 21:20-24', 'Revelation 1:1'],
        works: 'Gospel of John, 1-3 John, Revelation'
      },
      {
        id: 'john_baptist',
        name: 'John the Baptist',
        description: 'Prophet who prepared way for Jesus, baptized in Jordan',
        keyFacts: 'Son of Zechariah and Elizabeth, cousin of Jesus',
        keyVerses: ['Matthew 3:1-17', 'Luke 1:5-25', 'John 1:19-34'],
        died: 'Beheaded by Herod Antipas'
      },
      {
        id: 'john_mark',
        name: 'John Mark',
        description: 'Author of Mark\'s Gospel, companion of Paul and Barnabas',
        keyFacts: 'Also called Mark, nephew of Barnabas',
        keyVerses: ['Acts 12:12', 'Acts 15:37-39', '2 Timothy 4:11'],
        works: 'Gospel of Mark'
      }
    ],
    defaultPrompt: 'Which John do you mean?',
    commonContext: {
      'baptist': 'john_baptist',
      'baptize': 'john_baptist',
      'gospel': 'john_apostle',
      'beloved': 'john_apostle',
      'revelation': 'john_apostle',
      'mark': 'john_mark',
      'barnabas': 'john_mark'
    }
  },

  Mary: {
    options: [
      {
        id: 'mary_mother_jesus',
        name: 'Mary, mother of Jesus',
        description: 'Virgin mother of Jesus, wife of Joseph',
        keyFacts: 'From Nazareth, present at crucifixion',
        keyVerses: ['Luke 1:26-38', 'John 2:1-12', 'John 19:25-27']
      },
      {
        id: 'mary_magdalene',
        name: 'Mary Magdalene',
        description: 'Follower of Jesus, first witness of resurrection',
        keyFacts: 'Delivered from seven demons, supported Jesus\' ministry',
        keyVerses: ['Luke 8:2', 'John 20:1-18', 'Mark 16:9']
      },
      {
        id: 'mary_martha_sister',
        name: 'Mary of Bethany',
        description: 'Sister of Martha and Lazarus, sat at Jesus\' feet',
        keyFacts: 'Anointed Jesus with expensive perfume',
        keyVerses: ['Luke 10:38-42', 'John 11:1-45', 'John 12:1-8']
      },
      {
        id: 'mary_mother_james_joses',
        name: 'Mary, mother of James and Joses',
        description: 'Follower of Jesus, witnessed crucifixion',
        keyFacts: 'Possibly wife of Clopas',
        keyVerses: ['Matthew 27:56', 'Mark 15:40', 'Luke 24:10']
      }
    ],
    defaultPrompt: 'There are several Marys in the Bible. Which one?',
    commonContext: {
      'mother': 'mary_mother_jesus',
      'virgin': 'mary_mother_jesus',
      'magdalene': 'mary_magdalene',
      'bethany': 'mary_martha_sister',
      'martha': 'mary_martha_sister',
      'lazarus': 'mary_martha_sister'
    }
  },

  Herod: {
    options: [
      {
        id: 'herod_great',
        name: 'Herod the Great',
        description: 'King of Judea, ordered slaughter of infants in Bethlehem',
        keyFacts: 'Rebuilt temple, paranoid ruler',
        keyVerses: ['Matthew 2:1-18', 'Luke 1:5'],
        reigned: '37-4 BC'
      },
      {
        id: 'herod_antipas',
        name: 'Herod Antipas',
        description: 'Tetrarch of Galilee, beheaded John the Baptist',
        keyFacts: 'Son of Herod the Great, married Herodias',
        keyVerses: ['Matthew 14:1-12', 'Luke 23:7-12', 'Mark 6:14-29'],
        reigned: '4 BC-39 AD'
      },
      {
        id: 'herod_agrippa_i',
        name: 'Herod Agrippa I',
        description: 'King who killed James and imprisoned Peter',
        keyFacts: 'Grandson of Herod the Great',
        keyVerses: ['Acts 12:1-23'],
        reigned: '37-44 AD'
      },
      {
        id: 'herod_agrippa_ii',
        name: 'Herod Agrippa II',
        description: 'King before whom Paul testified',
        keyFacts: 'Son of Herod Agrippa I',
        keyVerses: ['Acts 25:13-26:32'],
        reigned: '50-100 AD'
      }
    ],
    defaultPrompt: 'Which Herod? (Several ruled during biblical times)',
    commonContext: {
      'bethlehem': 'herod_great',
      'infant': 'herod_great',
      'baptist': 'herod_antipas',
      'herodias': 'herod_antipas',
      'james': 'herod_agrippa_i',
      'peter': 'herod_agrippa_i',
      'paul': 'herod_agrippa_ii',
      'festus': 'herod_agrippa_ii'
    }
  }
};

// Ambiguous places with similar names
export const AMBIGUOUS_PLACES = {
  Bethany: {
    options: [
      {
        id: 'bethany_judea',
        name: 'Bethany (near Jerusalem)',
        description: 'Village ~2 miles east of Jerusalem on Mount of Olives',
        keyFacts: 'Home of Mary, Martha, and Lazarus',
        keyVerses: ['John 11:1', 'John 12:1', 'Mark 11:1'],
        location: 'Judea'
      },
      {
        id: 'bethany_beyond_jordan',
        name: 'Bethany beyond the Jordan',
        description: 'Site where John the Baptist baptized',
        keyFacts: 'East of Jordan River, also called Bethabara',
        keyVerses: ['John 1:28', 'John 10:40'],
        location: 'Perea'
      }
    ],
    defaultPrompt: 'Which Bethany? (One near Jerusalem, one beyond Jordan)',
    commonContext: {
      'lazarus': 'bethany_judea',
      'martha': 'bethany_judea',
      'mary': 'bethany_judea',
      'jerusalem': 'bethany_judea',
      'baptist': 'bethany_beyond_jordan',
      'baptize': 'bethany_beyond_jordan',
      'jordan': 'bethany_beyond_jordan'
    }
  },

  Caesarea: {
    options: [
      {
        id: 'caesarea_maritima',
        name: 'Caesarea Maritima (on the sea)',
        description: 'Major port city built by Herod, Roman capital of Judea',
        keyFacts: 'Peter converted Cornelius here, Paul imprisoned here',
        keyVerses: ['Acts 10:1', 'Acts 23:23', 'Acts 25:1'],
        location: 'Mediterranean coast'
      },
      {
        id: 'caesarea_philippi',
        name: 'Caesarea Philippi',
        description: 'City at base of Mount Hermon, site of Peter\'s confession',
        keyFacts: 'Built by Philip the Tetrarch, formerly Paneas',
        keyVerses: ['Matthew 16:13', 'Mark 8:27'],
        location: 'Northern Israel, near Mount Hermon'
      }
    ],
    defaultPrompt: 'Which Caesarea? (Caesarea Maritima on coast, or Caesarea Philippi in north)',
    commonContext: {
      'peter_confession': 'caesarea_philippi',
      'cornelius': 'caesarea_maritima',
      'paul': 'caesarea_maritima',
      'philip': 'caesarea_philippi',
      'hermon': 'caesarea_philippi',
      'coast': 'caesarea_maritima',
      'sea': 'caesarea_maritima'
    }
  },

  Antioch: {
    options: [
      {
        id: 'antioch_syria',
        name: 'Antioch of Syria',
        description: 'Major city, base for Paul\'s missions, "Christians" first used here',
        keyFacts: 'Third largest city in Roman Empire',
        keyVerses: ['Acts 11:19-26', 'Acts 13:1', 'Galatians 2:11'],
        location: 'Syria (modern Turkey)'
      },
      {
        id: 'antioch_pisidia',
        name: 'Antioch of Pisidia',
        description: 'City in Asia Minor visited by Paul on first journey',
        keyFacts: 'Jews rejected gospel, Gentiles received it',
        keyVerses: ['Acts 13:14-52', 'Acts 14:19', '2 Timothy 3:11'],
        location: 'Pisidia (southern Turkey)'
      }
    ],
    defaultPrompt: 'Which Antioch? (Syrian Antioch or Pisidian Antioch)',
    commonContext: {
      'barnabas': 'antioch_syria',
      'christians': 'antioch_syria',
      'base': 'antioch_syria',
      'pisidia': 'antioch_pisidia',
      'first_journey': 'antioch_pisidia'
    }
  }
};

/**
 * Detect if query contains ambiguous name or place
 * @param {string} query - User query
 * @returns {Object|null} Ambiguity info or null
 */
export function detectAmbiguity(query) {
  const lowerQuery = query.toLowerCase();

  // Check for ambiguous names
  for (const [name, data] of Object.entries(AMBIGUOUS_NAMES)) {
    if (lowerQuery.includes(name.toLowerCase())) {
      // Check if context provides clarity
      for (const [keyword, targetId] of Object.entries(data.commonContext)) {
        if (lowerQuery.includes(keyword)) {
          return {
            type: 'name',
            term: name,
            ambiguous: false,
            resolved: targetId,
            option: data.options.find(o => o.id === targetId)
          };
        }
      }

      // No context found - ambiguous
      return {
        type: 'name',
        term: name,
        ambiguous: true,
        options: data.options,
        prompt: data.defaultPrompt
      };
    }
  }

  // Check for ambiguous places
  for (const [place, data] of Object.entries(AMBIGUOUS_PLACES)) {
    if (lowerQuery.includes(place.toLowerCase())) {
      // Check if context provides clarity
      for (const [keyword, targetId] of Object.entries(data.commonContext)) {
        if (lowerQuery.includes(keyword)) {
          return {
            type: 'place',
            term: place,
            ambiguous: false,
            resolved: targetId,
            option: data.options.find(o => o.id === targetId)
          };
        }
      }

      // No context found - ambiguous
      return {
        type: 'place',
        term: place,
        ambiguous: true,
        options: data.options,
        prompt: data.defaultPrompt
      };
    }
  }

  return null;
}

/**
 * Format disambiguation prompt for user
 * @param {Object} ambiguity - Ambiguity info from detectAmbiguity
 * @returns {string} Formatted prompt
 */
export function formatDisambiguationPrompt(ambiguity) {
  if (!ambiguity || !ambiguity.ambiguous) return '';

  let output = `## ❓ ${ambiguity.prompt}\n\n`;

  ambiguity.options.forEach((option, idx) => {
    output += `**${idx + 1}. ${option.name}**\n`;
    output += `   ${option.description}\n`;
    if (option.keyFacts) {
      output += `   *${option.keyFacts}*\n`;
    }
    if (option.keyVerses) {
      output += `   Key verses: ${option.keyVerses.join(', ')}\n`;
    }
    output += `\n`;
  });

  output += `Please specify which ${ambiguity.term} you're asking about, or provide more context.\n`;

  return output;
}

/**
 * Create disambiguation question for AskUserQuestion tool
 * @param {Object} ambiguity - Ambiguity info
 * @returns {Object} Question config for AskUserQuestion
 */
export function createDisambiguationQuestion(ambiguity) {
  if (!ambiguity || !ambiguity.ambiguous) return null;

  const options = ambiguity.options.map(option => ({
    label: option.name,
    description: option.description
  }));

  return {
    question: ambiguity.prompt,
    header: ambiguity.term,
    options,
    multiSelect: false
  };
}

/**
 * Get resolved option info
 * @param {Object} ambiguity - Ambiguity with resolved ID
 * @returns {string} Context note about resolved entity
 */
export function getResolvedNote(ambiguity) {
  if (!ambiguity || ambiguity.ambiguous || !ambiguity.option) return '';

  return `*Note: This answer refers to ${ambiguity.option.name} - ${ambiguity.option.description}*\n\n`;
}

export default {
  AMBIGUOUS_NAMES,
  AMBIGUOUS_PLACES,
  detectAmbiguity,
  formatDisambiguationPrompt,
  createDisambiguationQuestion,
  getResolvedNote
};
