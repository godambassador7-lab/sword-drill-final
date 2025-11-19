/**
 * Feast Day Knowledge Module for S.H.A.R.P. Assistant
 *
 * Provides comprehensive information about Biblical feast days, holidays,
 * and the Hebrew calendar to enhance S.H.A.R.P.'s theological expertise
 */

import feastsData from '../../data/biblical-feast-days-repo/data/feasts.json';
import {
  gregorianToHebrew,
  getUpcomingFeastDays,
  isFeastDay,
  getFeastDetails,
  getNextRoshChodesh,
  formatHebrewDate
} from '../utils/hebrewCalendar';

/**
 * Get comprehensive feast day information for SHARP's responses
 */
export function getFeastDayKnowledge() {
  return {
    feasts: feastsData,
    categories: {
      spring: 'Spring feasts celebrating redemption and harvest (Passover, Unleavened Bread, Firstfruits, Shavuot)',
      fall: 'Fall feasts focused on repentance and ingathering (Trumpets, Atonement, Tabernacles)',
      weekly: 'Shabbat - the weekly day of rest, remembering creation and redemption',
      monthly: 'Rosh Chodesh - marking the new moon and beginning of each Hebrew month',
      'post-exilic': 'Purim - celebrating God\'s deliverance in the time of Esther',
      'second-temple': 'Hanukkah - commemorating the rededication of the Temple'
    },
    overview: `The Biblical feast days (moedim - "appointed times") are sacred calendar events
    established by God in Leviticus 23 and throughout the Torah. They serve as:

    1. Memorial markers of God's redemptive acts (especially the Exodus)
    2. Agricultural celebrations tied to the land of Israel
    3. Prophetic patterns pointing to Messiah's work
    4. Communal worship gatherings for God's people
    5. Teaching tools about covenant relationship with God

    The major feasts fall into two seasons:
    - Spring: Redemption and firstfruits (Nisan/Iyar)
    - Fall: Judgment and ingathering (Tishrei)

    Jesus and the apostles observed these feasts, and the New Testament shows their
    fulfillment in Christ's death, resurrection, and the giving of the Holy Spirit.`
  };
}

/**
 * Answer feast day related queries
 * @param {string} query - User's question about feast days
 * @returns {string} Detailed answer about the feast day
 */
export function answerFeastDayQuery(query) {
  const lowerQuery = query.toLowerCase();

  // Check if asking about today's feast
  if (lowerQuery.includes('today') && (lowerQuery.includes('feast') || lowerQuery.includes('holiday'))) {
    const todaysFeast = isFeastDay();
    if (todaysFeast) {
      const details = todaysFeast.details;
      return formatFeastDayResponse(todaysFeast.name, details);
    } else {
      const hebrewDate = formatHebrewDate();
      return `Today is ${hebrewDate} on the Hebrew calendar. There is no major feast day today, but every day is an opportunity to honor the Lord. Consider that today might be preparation for an upcoming feast, or simply a regular day to walk faithfully in God's Word.`;
    }
  }

  // Check if asking about upcoming feasts
  if (lowerQuery.includes('upcoming') || lowerQuery.includes('next') || lowerQuery.includes('soon')) {
    const upcoming = getUpcomingFeastDays(60);
    if (upcoming.length > 0) {
      const next = upcoming[0];
      const details = next.details;
      return `The next Biblical feast is ${next.name}, which occurs in ${next.daysUntil} day${next.daysUntil !== 1 ? 's' : ''} on ${new Date(next.gregorianDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} (${next.hebrewDate}).\n\n${details ? formatFeastDayResponse(next.name, details, false) : ''}`;
    }
  }

  // Check for specific feast mentions
  const feastMatches = {
    'passover': 'passover',
    'pesach': 'passover',
    'unleavened': 'unleavened_bread',
    'matzot': 'unleavened_bread',
    'firstfruits': 'firstfruits',
    'bikkurim': 'firstfruits',
    'pentecost': 'weeks',
    'shavuot': 'weeks',
    'weeks': 'weeks',
    'trumpets': 'trumpets',
    'yom teruah': 'trumpets',
    'rosh hashana': 'trumpets',
    'atonement': 'atonement',
    'yom kippur': 'atonement',
    'tabernacles': 'tabernacles',
    'sukkot': 'tabernacles',
    'booths': 'tabernacles',
    'purim': 'purim',
    'hanukkah': 'hanukkah',
    'chanukah': 'hanukkah',
    'dedication': 'hanukkah',
    'sabbath': 'sabbath',
    'shabbat': 'sabbath',
    'new moon': 'new_moons',
    'rosh chodesh': 'new_moons'
  };

  for (const [keyword, feastId] of Object.entries(feastMatches)) {
    if (lowerQuery.includes(keyword)) {
      const feast = feastsData.find(f => f.id === feastId);
      if (feast) {
        return formatFeastDayResponse(feast.englishName, feast);
      }
    }
  }

  // Check if asking about Hebrew calendar
  if (lowerQuery.includes('hebrew calendar') || lowerQuery.includes('hebrew date')) {
    const hebrewDate = gregorianToHebrew();
    const today = formatHebrewDate();
    return `Today's Hebrew date is ${today}. The Hebrew calendar is a lunisolar calendar used to determine Biblical feast days and holy times. It was established by God as a way to mark His appointed times (moedim) with His people. The calendar follows both lunar months (approximately 29.5 days) and solar years, with leap months added periodically to keep the festivals aligned with their agricultural seasons.`;
  }

  // General feast day information
  if (lowerQuery.includes('feast') || lowerQuery.includes('holiday') || lowerQuery.includes('appointed time')) {
    const knowledge = getFeastDayKnowledge();
    return `${knowledge.overview}\n\nThe major Biblical feasts include:\n\n` +
      feastsData.slice(0, 8).map(f =>
        `• **${f.englishName}** (${f.hebrewName}): ${f.themes.join(', ')}`
      ).join('\n') +
      '\n\nWould you like to know more about a specific feast day?';
  }

  return null; // No feast day match
}

/**
 * Format a detailed feast day response
 * @param {string} feastName - Name of the feast
 * @param {Object} details - Feast details object
 * @param {boolean} includeTitle - Whether to include the feast name as title
 * @returns {string} Formatted response
 */
function formatFeastDayResponse(feastName, details, includeTitle = true) {
  if (!details) return `${feastName} is a Biblical feast day.`;

  let response = includeTitle ? `**${feastName}** (${details.hebrewName || details.hebrewName})\n\n` : '';

  // Themes
  if (details.themes && details.themes.length > 0) {
    response += `**Themes:** ${details.themes.join(', ')}\n\n`;
  }

  // Participation summary
  if (details.participationSummary || details.tooltip) {
    response += `**Observance:** ${details.participationSummary || details.tooltip}\n\n`;
  }

  // Primary Scripture references
  if (details.primaryOTRefs && details.primaryOTRefs.length > 0) {
    response += `**Primary Scripture References:**\n${details.primaryOTRefs.map(ref => `• ${ref}`).join('\n')}\n\n`;
  }

  // New Testament references
  if (details.ntRefs && details.ntRefs.length > 0) {
    response += `**New Testament Fulfillment:**\n${details.ntRefs.map(ref => `• ${ref}`).join('\n')}\n\n`;
  }

  // Category information
  const knowledge = getFeastDayKnowledge();
  if (details.category && knowledge.categories[details.category]) {
    response += `**Category:** ${knowledge.categories[details.category]}\n\n`;
  }

  // Type
  if (details.type && details.type.length > 0) {
    const isPilgrimage = details.type.includes('pilgrimage');
    if (isPilgrimage) {
      response += `**Note:** This is one of the three pilgrimage festivals where Israelites were commanded to appear before the LORD in Jerusalem (see Deuteronomy 16).\n\n`;
    }
  }

  return response.trim();
}

/**
 * Get feast day context for any query
 * This enriches regular queries with feast day awareness
 * @returns {string} Current feast day context
 */
export function getCurrentFeastDayContext() {
  const todaysFeast = isFeastDay();
  const upcoming = getUpcomingFeastDays(14); // Next 2 weeks

  let context = '';

  if (todaysFeast) {
    context += `[Context: Today is ${todaysFeast.name}, a Biblical feast day.] `;
  }

  if (upcoming.length > 0 && !todaysFeast) {
    const next = upcoming[0];
    if (next.daysUntil <= 7) {
      context += `[Context: ${next.name} is coming up in ${next.daysUntil} day${next.daysUntil !== 1 ? 's' : ''}.] `;
    }
  }

  return context;
}

/**
 * Determine if a query is about feast days
 * @param {string} query - User's query
 * @returns {boolean} True if query is about feast days
 */
export function isFeastDayQuery(query) {
  const lowerQuery = query.toLowerCase();
  const keywords = [
    'feast', 'holiday', 'passover', 'pesach', 'unleavened', 'pentecost',
    'shavuot', 'trumpets', 'atonement', 'yom kippur', 'tabernacles', 'sukkot',
    'purim', 'hanukkah', 'sabbath', 'shabbat', 'rosh chodesh', 'new moon',
    'hebrew calendar', 'biblical calendar', 'appointed time', 'moedim'
  ];

  return keywords.some(keyword => lowerQuery.includes(keyword));
}

/**
 * Get a random feast day fact for enriching conversations
 * @returns {string} Interesting feast day fact
 */
export function getRandomFeastDayFact() {
  const facts = [
    'Did you know? Jesus celebrated Passover with His disciples at the Last Supper, transforming its meaning to point to His sacrifice as the Lamb of God.',
    'The Day of Atonement (Yom Kippur) is the only day when the High Priest could enter the Most Holy Place, foreshadowing Christ\'s once-for-all entry into the heavenly sanctuary (Hebrews 9).',
    'Pentecost (Shavuot) celebrates both the giving of the Torah at Sinai and the outpouring of the Holy Spirit in Acts 2, showing God writing His law on hearts.',
    'The Feast of Tabernacles (Sukkot) involves dwelling in temporary shelters, remembering Israel\'s wilderness journey and looking forward to God\'s eternal dwelling with His people.',
    'The three pilgrimage feasts (Passover, Pentecost, Tabernacles) brought all Israel to Jerusalem, creating powerful moments of unity and worship.',
    'The feast days follow an agricultural calendar tied to the land of Israel, showing God\'s concern for both spiritual and physical provision.',
    'Jesus likely celebrated Hanukkah, as John 10:22 mentions Him at the "Feast of Dedication" in Jerusalem during winter.',
    'The Spring feasts (Passover through Pentecost) were fulfilled in Christ\'s first coming, while many see the Fall feasts pointing to His return.'
  ];

  return facts[Math.floor(Math.random() * facts.length)];
}
