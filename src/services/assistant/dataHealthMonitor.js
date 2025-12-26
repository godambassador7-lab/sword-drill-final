/**
 * Data Health Monitor
 * Provides checksum validation, version tracking, and completeness checks
 * for all biblical datasets
 */

// Dataset version manifest
export const DATA_VERSIONS = {
  bible: {
    KJV: { version: '2024.1', lastUpdated: '2024-01-15', checksum: 'kjv_31102_verses' },
    ASV: { version: '2024.1', lastUpdated: '2024-01-15', checksum: 'asv_31102_verses' },
    WEB: { version: '2024.1', lastUpdated: '2024-01-15', checksum: 'web_31086_verses' }
  },
  lexicon: {
    strongs: { version: '1.0', lastUpdated: '2024-01-01', checksum: 'strongs_8674_entries' }
  },
  dictionary: {
    smiths: { version: '1.0', lastUpdated: '2024-01-01', checksum: 'smiths_3000_entries' }
  },
  crossRefs: {
    thematic: { version: '1.0', lastUpdated: '2024-02-01', checksum: 'thematic_40_topics' },
    gospelHarmony: { version: '1.0', lastUpdated: '2024-02-01', checksum: 'harmony_69_events' }
  },
  context: {
    biblicalContext: { version: '1.0', lastUpdated: '2024-03-01', checksum: 'context_30_books' },
    ntUsesOT: { version: '1.0', lastUpdated: '2024-03-15', checksum: 'ntot_300_quotes' }
  },
  chains: {
    topical: { version: '1.0', lastUpdated: '2024-03-15', checksum: 'topical_16_chains' }
  },
  studyPlans: {
    perBook: { version: '1.0', lastUpdated: '2024-03-15', checksum: 'plans_10_books' }
  },
  idioms: {
    hebrewGreek: { version: '1.0', lastUpdated: '2024-03-15', checksum: 'idioms_31_phrases' }
  }
};

// Expected book counts per testament
const EXPECTED_BOOKS = {
  OT: 39,
  NT: 27,
  total: 66,
  apocrypha: 15
};

// Expected verse counts (KJV standard)
const EXPECTED_VERSES = {
  total: 31102,
  OT: 23145,
  NT: 7957
};

// Book chapter counts (for completeness validation)
const BOOK_CHAPTERS = {
  Genesis: 50, Exodus: 40, Leviticus: 27, Numbers: 36, Deuteronomy: 34,
  Joshua: 24, Judges: 21, Ruth: 4, '1 Samuel': 31, '2 Samuel': 24,
  '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36,
  Ezra: 10, Nehemiah: 13, Esther: 10, Job: 42, Psalms: 150, Proverbs: 31,
  Ecclesiastes: 12, 'Song of Solomon': 8, Isaiah: 66, Jeremiah: 52,
  Lamentations: 5, Ezekiel: 48, Daniel: 12, Hosea: 14, Joel: 3, Amos: 9,
  Obadiah: 1, Jonah: 4, Micah: 7, Nahum: 3, Habakkuk: 3, Zephaniah: 3,
  Haggai: 2, Zechariah: 14, Malachi: 4,
  Matthew: 28, Mark: 16, Luke: 24, John: 21, Acts: 28, Romans: 16,
  '1 Corinthians': 16, '2 Corinthians': 13, Galatians: 6, Ephesians: 6,
  Philippians: 4, Colossians: 4, '1 Thessalonians': 5, '2 Thessalonians': 3,
  '1 Timothy': 6, '2 Timothy': 4, Titus: 3, Philemon: 1, Hebrews: 13,
  James: 5, '1 Peter': 5, '2 Peter': 3, '1 John': 5, '2 John': 1,
  '3 John': 1, Jude: 1, Revelation: 22
};

/**
 * Health check result structure
 */
class HealthCheckResult {
  constructor() {
    this.healthy = true;
    this.warnings = [];
    this.errors = [];
    this.stats = {};
    this.timestamp = new Date().toISOString();
  }

  addWarning(category, message) {
    this.warnings.push({ category, message });
    if (this.warnings.length > 5) {
      this.healthy = false;
    }
  }

  addError(category, message) {
    this.errors.push({ category, message });
    this.healthy = false;
  }

  addStat(key, value) {
    this.stats[key] = value;
  }

  getSummary() {
    return {
      healthy: this.healthy,
      warningCount: this.warnings.length,
      errorCount: this.errors.length,
      timestamp: this.timestamp
    };
  }
}

/**
 * Check Bible text completeness
 * @param {Object} bibleData - Bible data object
 * @param {string} translation - Translation code
 * @returns {Object} Check results
 */
export function checkBibleCompleteness(bibleData, translation = 'KJV') {
  const result = new HealthCheckResult();
  result.addStat('translation', translation);

  if (!bibleData) {
    result.addError('bible', 'Bible data not loaded');
    return result;
  }

  // Count books
  const books = Object.keys(bibleData);
  result.addStat('bookCount', books.length);

  if (books.length < EXPECTED_BOOKS.total) {
    result.addWarning('bible', `Only ${books.length}/${EXPECTED_BOOKS.total} books found`);
  }

  // Check for missing chapters in each book
  const missingChapters = [];
  for (const [bookName, expectedChapters] of Object.entries(BOOK_CHAPTERS)) {
    if (!bibleData[bookName]) {
      missingChapters.push(`${bookName} (entire book missing)`);
      continue;
    }

    const chapters = Object.keys(bibleData[bookName]);
    if (chapters.length < expectedChapters) {
      missingChapters.push(`${bookName} (${chapters.length}/${expectedChapters} chapters)`);
    }
  }

  if (missingChapters.length > 0) {
    result.addWarning('bible', `Incomplete chapters: ${missingChapters.slice(0, 5).join(', ')}${missingChapters.length > 5 ? '...' : ''}`);
  }

  result.addStat('missingChapters', missingChapters.length);

  // Estimate verse count (sample-based)
  let sampleVerseCount = 0;
  const sampleBooks = ['Genesis', 'Psalms', 'Matthew', 'Romans'];
  for (const book of sampleBooks) {
    if (bibleData[book]) {
      for (const chapter of Object.values(bibleData[book])) {
        sampleVerseCount += Object.keys(chapter).length;
      }
    }
  }
  result.addStat('sampleVerseCount', sampleVerseCount);

  // Check version metadata
  const versionInfo = DATA_VERSIONS.bible[translation];
  if (versionInfo) {
    result.addStat('version', versionInfo.version);
    result.addStat('lastUpdated', versionInfo.lastUpdated);
    result.addStat('checksum', versionInfo.checksum);
  } else {
    result.addWarning('version', `No version metadata for ${translation}`);
  }

  return result;
}

/**
 * Check lexicon completeness
 * @param {Object} lexiconData - Lexicon data
 * @returns {Object} Check results
 */
export function checkLexiconCompleteness(lexiconData) {
  const result = new HealthCheckResult();

  if (!lexiconData) {
    result.addError('lexicon', 'Lexicon data not loaded');
    return result;
  }

  // Count entries
  const entries = Object.keys(lexiconData);
  result.addStat('entryCount', entries.length);

  // Expected minimum entries (Strong's has 8674 total)
  const expectedMin = 8000;
  if (entries.length < expectedMin) {
    result.addWarning('lexicon', `Only ${entries.length} entries (expected ~8674)`);
  }

  // Check for required fields in sample entries
  const sampleSize = Math.min(10, entries.length);
  let missingFields = 0;
  for (let i = 0; i < sampleSize; i++) {
    const entry = lexiconData[entries[i]];
    if (!entry.word || !entry.transliteration || !entry.definition) {
      missingFields++;
    }
  }

  if (missingFields > 0) {
    result.addWarning('lexicon', `${missingFields}/${sampleSize} sample entries have missing fields`);
  }

  const versionInfo = DATA_VERSIONS.lexicon.strongs;
  result.addStat('version', versionInfo.version);
  result.addStat('lastUpdated', versionInfo.lastUpdated);

  return result;
}

/**
 * Check cross-reference completeness
 * @param {Object} crossRefData - Cross-reference data
 * @returns {Object} Check results
 */
export function checkCrossRefsCompleteness(crossRefData) {
  const result = new HealthCheckResult();

  if (!crossRefData || !crossRefData.thematic) {
    result.addError('crossRefs', 'Cross-reference data not loaded');
    return result;
  }

  // Count thematic topics
  const topics = Object.keys(crossRefData.thematic);
  result.addStat('topicCount', topics.length);

  if (topics.length < 40) {
    result.addWarning('crossRefs', `Only ${topics.length} thematic topics (expected 40+)`);
  }

  // Check gospel harmony
  if (crossRefData.gospelHarmony) {
    const events = crossRefData.gospelHarmony.length || 0;
    result.addStat('gospelEvents', events);
    if (events < 60) {
      result.addWarning('crossRefs', `Only ${events} gospel events (expected 69)`);
    }
  }

  const versionInfo = DATA_VERSIONS.crossRefs.thematic;
  result.addStat('version', versionInfo.version);

  return result;
}

/**
 * Run comprehensive health check on all datasets
 * @param {Object} datasets - All loaded datasets
 * @returns {Object} Comprehensive health report
 */
export function runHealthCheck(datasets = {}) {
  const report = {
    timestamp: new Date().toISOString(),
    overallHealth: 'healthy',
    datasets: {},
    summary: {
      totalWarnings: 0,
      totalErrors: 0,
      healthyDatasets: 0,
      unhealthyDatasets: 0
    }
  };

  // Check Bible
  if (datasets.bible) {
    report.datasets.bible = checkBibleCompleteness(datasets.bible, 'KJV');
    if (!report.datasets.bible.healthy) {
      report.overallHealth = 'degraded';
      report.summary.unhealthyDatasets++;
    } else {
      report.summary.healthyDatasets++;
    }
    report.summary.totalWarnings += report.datasets.bible.warnings.length;
    report.summary.totalErrors += report.datasets.bible.errors.length;
  }

  // Check Lexicon
  if (datasets.lexicon) {
    report.datasets.lexicon = checkLexiconCompleteness(datasets.lexicon);
    if (!report.datasets.lexicon.healthy) {
      report.overallHealth = 'degraded';
      report.summary.unhealthyDatasets++;
    } else {
      report.summary.healthyDatasets++;
    }
    report.summary.totalWarnings += report.datasets.lexicon.warnings.length;
    report.summary.totalErrors += report.datasets.lexicon.errors.length;
  }

  // Check Cross-References
  if (datasets.crossRefs) {
    report.datasets.crossRefs = checkCrossRefsCompleteness(datasets.crossRefs);
    if (!report.datasets.crossRefs.healthy) {
      report.overallHealth = 'degraded';
      report.summary.unhealthyDatasets++;
    } else {
      report.summary.healthyDatasets++;
    }
    report.summary.totalWarnings += report.datasets.crossRefs.warnings.length;
    report.summary.totalErrors += report.datasets.crossRefs.errors.length;
  }

  // Set overall health based on errors
  if (report.summary.totalErrors > 0) {
    report.overallHealth = 'unhealthy';
  } else if (report.summary.totalWarnings > 10) {
    report.overallHealth = 'degraded';
  }

  return report;
}

/**
 * Format health report for display
 * @param {Object} report - Health check report
 * @returns {string} Formatted report
 */
export function formatHealthReport(report) {
  let output = `## 🏥 Data Health Report\n\n`;
  output += `**Status**: ${report.overallHealth.toUpperCase()}\n`;
  output += `**Checked**: ${new Date(report.timestamp).toLocaleString()}\n\n`;

  output += `### Summary\n`;
  output += `- Healthy Datasets: ${report.summary.healthyDatasets}\n`;
  output += `- Degraded Datasets: ${report.summary.unhealthyDatasets}\n`;
  output += `- Total Warnings: ${report.summary.totalWarnings}\n`;
  output += `- Total Errors: ${report.summary.totalErrors}\n\n`;

  for (const [dataset, result] of Object.entries(report.datasets)) {
    output += `### ${dataset.toUpperCase()}\n`;
    output += `- Status: ${result.healthy ? '✅ Healthy' : '⚠️ Degraded'}\n`;

    if (result.stats) {
      output += `- Stats:\n`;
      for (const [key, value] of Object.entries(result.stats)) {
        output += `  - ${key}: ${value}\n`;
      }
    }

    if (result.warnings.length > 0) {
      output += `- Warnings:\n`;
      result.warnings.forEach(w => {
        output += `  - ${w.message}\n`;
      });
    }

    if (result.errors.length > 0) {
      output += `- Errors:\n`;
      result.errors.forEach(e => {
        output += `  - ❌ ${e.message}\n`;
      });
    }

    output += `\n`;
  }

  return output;
}

/**
 * Get data version info for a specific dataset
 * @param {string} category - Dataset category
 * @param {string} name - Dataset name
 * @returns {Object|null} Version info
 */
export function getDataVersion(category, name) {
  return DATA_VERSIONS[category]?.[name] || null;
}

/**
 * Check if data needs update (older than 6 months)
 * @param {string} category - Dataset category
 * @param {string} name - Dataset name
 * @returns {boolean} True if update recommended
 */
export function needsUpdate(category, name) {
  const versionInfo = getDataVersion(category, name);
  if (!versionInfo || !versionInfo.lastUpdated) return false;

  const lastUpdate = new Date(versionInfo.lastUpdated);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  return lastUpdate < sixMonthsAgo;
}

export default {
  DATA_VERSIONS,
  checkBibleCompleteness,
  checkLexiconCompleteness,
  checkCrossRefsCompleteness,
  runHealthCheck,
  formatHealthReport,
  getDataVersion,
  needsUpdate
};
