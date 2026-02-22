/**
 * Biblical Geography Knowledge Base
 * Maps biblical locations to modern coordinates and countries
 * Used by SHARP to answer geographical biblical questions
 */

export const BIBLICAL_LOCATIONS = {
  // ==================== REGIONS & LANDS ====================
  'Canaan': {
    biblicalName: 'Canaan',
    modernCountries: ['Israel', 'Palestine', 'Lebanon', 'parts of Syria and Jordan'],
    coordinates: { lat: 31.7683, lon: 35.2137 }, // Approximate center
    description: 'The Promised Land, roughly corresponding to modern Israel/Palestine, extending from the Mediterranean coast to the Jordan River Valley',
    biblicalPeriod: 'Bronze Age through Iron Age',
    keyVerses: ['Genesis 12:5', 'Numbers 34:2', 'Joshua 5:12'],
    aliases: ['Promised Land', 'Land of Israel', 'Palestine']
  },
  'Mesopotamia': {
    biblicalName: 'Mesopotamia',
    modernCountries: ['Iraq', 'parts of Syria', 'parts of Turkey', 'parts of Iran'],
    coordinates: { lat: 33.0, lon: 44.0 },
    description: 'Land between the Tigris and Euphrates rivers, cradle of civilization',
    biblicalPeriod: 'Genesis through Exile',
    keyVerses: ['Genesis 24:10', 'Acts 7:2'],
    aliases: ['Aram-naharaim', 'Land between the rivers']
  },
  'Egypt': {
    biblicalName: 'Egypt',
    modernCountries: ['Egypt'],
    coordinates: { lat: 26.8206, lon: 30.8025 },
    description: 'Ancient civilization along the Nile River',
    biblicalPeriod: 'Genesis through New Testament',
    keyVerses: ['Exodus 1:8', 'Matthew 2:13-15'],
    aliases: ['Mizraim', 'Land of Ham']
  },
  'Assyria': {
    biblicalName: 'Assyria',
    modernCountries: ['Northern Iraq', 'parts of Syria', 'parts of Turkey'],
    coordinates: { lat: 36.0, lon: 43.0 },
    description: 'Ancient empire centered in northern Mesopotamia',
    biblicalPeriod: 'Kings through Prophets',
    keyVerses: ['2 Kings 17:6', 'Isaiah 10:5'],
    aliases: ['Ashur']
  },
  'Babylonia': {
    biblicalName: 'Babylonia',
    modernCountries: ['Southern Iraq'],
    coordinates: { lat: 32.5, lon: 44.4 },
    description: 'Ancient empire in southern Mesopotamia',
    biblicalPeriod: 'Exile and Post-Exile',
    keyVerses: ['2 Kings 24:10', 'Daniel 1:1'],
    aliases: ['Chaldea', 'Shinar']
  },
  'Persia': {
    biblicalName: 'Persia',
    modernCountries: ['Iran', 'parts of Afghanistan', 'parts of Pakistan'],
    coordinates: { lat: 32.0, lon: 53.0 },
    description: 'Vast empire that conquered Babylon',
    biblicalPeriod: 'Exile through Restoration',
    keyVerses: ['Ezra 1:1', 'Esther 1:1', 'Daniel 6:28'],
    aliases: ['Elam', 'Media-Persia']
  },
  'Judea': {
    biblicalName: 'Judea',
    modernCountries: ['Israel', 'West Bank'],
    coordinates: { lat: 31.7, lon: 35.0 },
    description: 'Southern kingdom and later Roman province, centered on Jerusalem',
    biblicalPeriod: 'Kingdom Period through New Testament',
    keyVerses: ['Matthew 2:1', 'Luke 1:5', 'Acts 1:8'],
    aliases: ['Judah', 'Land of Judah']
  },
  'Galilee': {
    biblicalName: 'Galilee',
    modernCountries: ['Israel'],
    coordinates: { lat: 32.8, lon: 35.5 },
    description: 'Northern region of ancient Israel, Jesus\' home region',
    biblicalPeriod: 'Old Testament through New Testament',
    keyVerses: ['Matthew 4:15', 'Luke 1:26', 'John 7:41'],
    aliases: ['Galil']
  },
  'Samaria': {
    biblicalName: 'Samaria',
    modernCountries: ['West Bank'],
    coordinates: { lat: 32.2, lon: 35.2 },
    description: 'Central region between Judea and Galilee',
    biblicalPeriod: 'Kingdom Period through New Testament',
    keyVerses: ['1 Kings 16:24', 'John 4:4', 'Acts 8:1'],
    aliases: ['Shomron']
  },
  'Edom': {
    biblicalName: 'Edom',
    modernCountries: ['Southern Jordan', 'Southern Israel'],
    coordinates: { lat: 30.3, lon: 35.4 },
    description: 'Land of Esau\'s descendants, southeast of the Dead Sea',
    biblicalPeriod: 'Genesis through Prophets',
    keyVerses: ['Genesis 36:8', 'Obadiah 1:1'],
    aliases: ['Seir', 'Land of Esau']
  },
  'Moab': {
    biblicalName: 'Moab',
    modernCountries: ['Jordan'],
    coordinates: { lat: 31.3, lon: 35.7 },
    description: 'East of the Dead Sea, descendants of Lot',
    biblicalPeriod: 'Genesis through Prophets',
    keyVerses: ['Ruth 1:1', 'Numbers 22:1', 'Isaiah 15:1'],
    aliases: []
  },
  'Ammon': {
    biblicalName: 'Ammon',
    modernCountries: ['Jordan (Amman region)'],
    coordinates: { lat: 31.95, lon: 35.93 },
    description: 'Northeast of the Dead Sea, descendants of Lot',
    biblicalPeriod: 'Genesis through Prophets',
    keyVerses: ['Deuteronomy 2:19', 'Judges 11:4'],
    aliases: ['Rabbah', 'Philadelphia']
  },

  // ==================== CITIES ====================
  'Jerusalem': {
    biblicalName: 'Jerusalem',
    modernCountries: ['Israel'],
    coordinates: { lat: 31.7683, lon: 35.2137 },
    description: 'Holy city, capital of ancient Israel and Judah',
    biblicalPeriod: 'All periods',
    keyVerses: ['Psalm 122:6', '2 Samuel 5:7', 'Luke 2:41'],
    aliases: ['Zion', 'City of David', 'Salem', 'Jebus']
  },
  'Bethlehem': {
    biblicalName: 'Bethlehem',
    modernCountries: ['West Bank'],
    coordinates: { lat: 31.7054, lon: 35.2024 },
    description: 'Birthplace of King David and Jesus Christ',
    biblicalPeriod: 'All periods',
    keyVerses: ['Micah 5:2', 'Matthew 2:1', 'Luke 2:4'],
    aliases: ['Ephrathah', 'City of David']
  },
  'Nazareth': {
    biblicalName: 'Nazareth',
    modernCountries: ['Israel'],
    coordinates: { lat: 32.7006, lon: 35.2978 },
    description: 'Jesus\' childhood home in Galilee',
    biblicalPeriod: 'New Testament',
    keyVerses: ['Luke 1:26', 'Matthew 2:23', 'John 1:45-46'],
    aliases: []
  },
  'Capernaum': {
    biblicalName: 'Capernaum',
    modernCountries: ['Israel'],
    coordinates: { lat: 32.8807, lon: 35.5753 },
    description: 'Jesus\' ministry headquarters on the Sea of Galilee',
    biblicalPeriod: 'New Testament',
    keyVerses: ['Matthew 4:13', 'Mark 2:1', 'Luke 4:31'],
    aliases: ['Kfar Nahum']
  },
  'Babylon': {
    biblicalName: 'Babylon',
    modernCountries: ['Iraq'],
    coordinates: { lat: 32.5355, lon: 44.4275 },
    description: 'Capital of the Babylonian Empire',
    biblicalPeriod: 'Genesis through Revelation',
    keyVerses: ['Genesis 11:9', 'Daniel 4:30', 'Revelation 18:2'],
    aliases: ['Babel', 'Great City']
  },
  'Nineveh': {
    biblicalName: 'Nineveh',
    modernCountries: ['Iraq (near Mosul)'],
    coordinates: { lat: 36.3489, lon: 43.1522 },
    description: 'Capital of the Assyrian Empire',
    biblicalPeriod: 'Kings through Prophets',
    keyVerses: ['Jonah 1:2', 'Nahum 1:1', 'Genesis 10:11'],
    aliases: []
  },
  'Damascus': {
    biblicalName: 'Damascus',
    modernCountries: ['Syria'],
    coordinates: { lat: 33.5138, lon: 36.2765 },
    description: 'Ancient city, still inhabited today',
    biblicalPeriod: 'All periods',
    keyVerses: ['Genesis 14:15', 'Acts 9:2', 'Isaiah 17:1'],
    aliases: []
  },
  'Jericho': {
    biblicalName: 'Jericho',
    modernCountries: ['West Bank'],
    coordinates: { lat: 31.8557, lon: 35.4611 },
    description: 'Ancient city conquered by Joshua, one of the oldest cities',
    biblicalPeriod: 'All periods',
    keyVerses: ['Joshua 6:1', 'Luke 10:30', 'Luke 19:1'],
    aliases: ['City of Palms']
  },
  'Tyre': {
    biblicalName: 'Tyre',
    modernCountries: ['Lebanon'],
    coordinates: { lat: 33.2704, lon: 35.1937 },
    description: 'Phoenician coastal city, major trading port',
    biblicalPeriod: 'Old Testament through New Testament',
    keyVerses: ['Ezekiel 27:2', 'Matthew 15:21', 'Acts 21:3'],
    aliases: ['Tyrus']
  },
  'Sidon': {
    biblicalName: 'Sidon',
    modernCountries: ['Lebanon'],
    coordinates: { lat: 33.5631, lon: 35.3714 },
    description: 'Ancient Phoenician city north of Tyre',
    biblicalPeriod: 'Old Testament through New Testament',
    keyVerses: ['Genesis 10:19', 'Luke 6:17', 'Acts 27:3'],
    aliases: ['Zidon']
  },

  // ==================== GEOGRAPHICAL FEATURES ====================
  'Jordan River': {
    biblicalName: 'Jordan River',
    modernCountries: ['Israel', 'Jordan', 'West Bank'],
    coordinates: { lat: 32.0, lon: 35.6 },
    description: 'River flowing from Mount Hermon to the Dead Sea',
    biblicalPeriod: 'All periods',
    keyVerses: ['Joshua 3:17', 'Matthew 3:13', '2 Kings 5:10'],
    aliases: ['River Jordan']
  },
  'Dead Sea': {
    biblicalName: 'Dead Sea',
    modernCountries: ['Israel', 'Jordan', 'West Bank'],
    coordinates: { lat: 31.5, lon: 35.5 },
    description: 'Lowest point on Earth, salt lake at end of Jordan River',
    biblicalPeriod: 'All periods',
    keyVerses: ['Genesis 14:3', 'Numbers 34:3', 'Joshua 15:5'],
    aliases: ['Salt Sea', 'Sea of the Arabah']
  },
  'Sea of Galilee': {
    biblicalName: 'Sea of Galilee',
    modernCountries: ['Israel'],
    coordinates: { lat: 32.8, lon: 35.6 },
    description: 'Freshwater lake in northern Israel, site of Jesus\' ministry',
    biblicalPeriod: 'Old Testament through New Testament',
    keyVerses: ['Matthew 4:18', 'John 6:1', 'Luke 5:1'],
    aliases: ['Sea of Tiberias', 'Lake of Gennesaret', 'Sea of Chinnereth']
  },
  'Mount Sinai': {
    biblicalName: 'Mount Sinai',
    modernCountries: ['Egypt (Sinai Peninsula)'],
    coordinates: { lat: 28.5, lon: 33.9 },
    description: 'Mountain where Moses received the Ten Commandments',
    biblicalPeriod: 'Exodus',
    keyVerses: ['Exodus 19:20', 'Deuteronomy 33:2', 'Galatians 4:24-25'],
    aliases: ['Mount Horeb', 'Mountain of God']
  },
  'Mount Zion': {
    biblicalName: 'Mount Zion',
    modernCountries: ['Israel'],
    coordinates: { lat: 31.7729, lon: 35.2294 },
    description: 'Hill in Jerusalem, site of David\'s palace and Temple',
    biblicalPeriod: 'Kingdom Period onward',
    keyVerses: ['Psalm 48:2', '2 Samuel 5:7', 'Hebrews 12:22'],
    aliases: ['City of David']
  },
  'Mount of Olives': {
    biblicalName: 'Mount of Olives',
    modernCountries: ['Israel'],
    coordinates: { lat: 31.7784, lon: 35.2429 },
    description: 'Ridge east of Jerusalem',
    biblicalPeriod: 'Old Testament through New Testament',
    keyVerses: ['Zechariah 14:4', 'Matthew 24:3', 'Acts 1:12'],
    aliases: ['Olivet']
  },
  'Mediterranean Sea': {
    biblicalName: 'Great Sea',
    modernCountries: ['Multiple coastal nations'],
    coordinates: { lat: 34.0, lon: 18.0 },
    description: 'The western boundary of ancient Israel',
    biblicalPeriod: 'All periods',
    keyVerses: ['Numbers 34:6', 'Joshua 1:4', 'Acts 27:5'],
    aliases: ['Great Sea', 'Western Sea']
  },
  'Red Sea': {
    biblicalName: 'Red Sea',
    modernCountries: ['Egypt', 'Saudi Arabia', 'Sudan', 'Eritrea'],
    coordinates: { lat: 20.0, lon: 38.0 },
    description: 'Sea crossed by Israelites during the Exodus',
    biblicalPeriod: 'Exodus onward',
    keyVerses: ['Exodus 14:21', '1 Kings 9:26', 'Acts 7:36'],
    aliases: ['Sea of Reeds']
  },
  'Mount Ararat': {
    biblicalName: 'Mountains of Ararat',
    modernCountries: ['Turkey', 'Armenia'],
    coordinates: { lat: 39.7, lon: 44.3 },
    description: 'Traditional landing place of Noah\'s Ark',
    biblicalPeriod: 'Genesis',
    keyVerses: ['Genesis 8:4'],
    aliases: ['Ararat']
  }
};

/**
 * Search for a biblical location
 * @param {string} query - Location name to search for
 * @returns {Array} Matching locations
 */
export function searchBiblicalLocation(query) {
  const lowerQuery = query.toLowerCase();
  const results = [];

  for (const [key, location] of Object.entries(BIBLICAL_LOCATIONS)) {
    // Check main name
    if (location.biblicalName.toLowerCase().includes(lowerQuery)) {
      results.push({ key, ...location, matchType: 'name' });
      continue;
    }

    // Check aliases
    if (location.aliases.some(alias => alias.toLowerCase().includes(lowerQuery))) {
      results.push({ key, ...location, matchType: 'alias' });
      continue;
    }

    // Check modern countries
    if (location.modernCountries.some(country => country.toLowerCase().includes(lowerQuery))) {
      results.push({ key, ...location, matchType: 'modern' });
    }
  }

  return results;
}

/**
 * Get detailed information about a biblical location
 * @param {string} locationKey - The key of the location
 * @returns {Object} Location details
 */
export function getBiblicalLocationDetails(locationKey) {
  return BIBLICAL_LOCATIONS[locationKey];
}

/**
 * Generate a response for geographical questions
 * @param {string} query - The user's question
 * @returns {string} Formatted response
 */
export function answerGeographicalQuestion(query) {
  const results = searchBiblicalLocation(query);

  if (results.length === 0) {
    return "I couldn't find specific information about that biblical location in my geographical database. Could you rephrase your question or ask about a different location?";
  }

  const location = results[0];
  let response = `**${location.biblicalName}**\n\n`;
  response += `📍 **Modern Location**: ${location.modernCountries.join(', ')}\n\n`;
  response += `📖 **Description**: ${location.description}\n\n`;
  response += `📅 **Biblical Period**: ${location.biblicalPeriod}\n\n`;

  if (location.aliases.length > 0) {
    response += `**Also known as**: ${location.aliases.join(', ')}\n\n`;
  }

  response += `**Key Scripture References**:\n`;
  location.keyVerses.forEach(verse => {
    response += `• ${verse}\n`;
  });

  return response;
}

export default {
  BIBLICAL_LOCATIONS,
  searchBiblicalLocation,
  getBiblicalLocationDetails,
  answerGeographicalQuestion
};
