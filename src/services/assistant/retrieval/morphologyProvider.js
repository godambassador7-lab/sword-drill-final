/**
 * Morphology Provider for RAG System
 * Provides grammatical analysis for Greek and Hebrew words
 */

// Greek RMAC (Robinson's Morphological Analysis Codes) parser
const GREEK_MORPH_PARTS = {
  // Part of Speech
  'A': 'Adjective',
  'C': 'Conjunction',
  'D': 'Adverb',
  'I': 'Interjection',
  'N': 'Noun',
  'P': 'Preposition',
  'RA': 'Definite Article',
  'RD': 'Demonstrative Pronoun',
  'RI': 'Interrogative/Indefinite Pronoun',
  'RP': 'Personal Pronoun',
  'RR': 'Relative Pronoun',
  'V': 'Verb',
  'X': 'Particle',

  // Person
  '1': '1st person',
  '2': '2nd person',
  '3': '3rd person',

  // Tense
  'P': 'Present',
  'I': 'Imperfect',
  'F': 'Future',
  'A': 'Aorist',
  'X': 'Perfect',
  'Y': 'Pluperfect',

  // Voice
  'A': 'Active',
  'M': 'Middle',
  'P': 'Passive',

  // Mood
  'I': 'Indicative',
  'S': 'Subjunctive',
  'O': 'Optative',
  'M': 'Imperative',
  'N': 'Infinitive',
  'P': 'Participle',

  // Case
  'N': 'Nominative',
  'G': 'Genitive',
  'D': 'Dative',
  'A': 'Accusative',
  'V': 'Vocative',

  // Number
  'S': 'Singular',
  'P': 'Plural',

  // Gender
  'M': 'Masculine',
  'F': 'Feminine',
  'N': 'Neuter'
};

// Hebrew morphology parser
const HEBREW_MORPH_PARTS = {
  // Prefix (first character after H)
  'H': '',  // Hebrew marker
  'A': 'Aramaic marker',

  // Part of Speech
  'N': 'Noun',
  'V': 'Verb',
  'A': 'Adjective',
  'D': 'Adverb',
  'P': 'Pronoun',
  'R': 'Preposition',
  'C': 'Conjunction',
  'T': 'Particle',

  // Verb stems (binyanim)
  'q': 'Qal',
  'N': 'Niphal',
  'p': 'Piel',
  'P': 'Pual',
  'h': 'Hiphil',
  'H': 'Hophal',
  't': 'Hithpael',
  'o': 'Polel',
  'O': 'Polal',
  'r': 'Hithpolel',
  'm': 'Poel',
  'M': 'Poal',
  'k': 'Palel',
  'K': 'Pulal',
  'Q': 'Qal Passive',
  'l': 'Pilpel',
  'L': 'Polpal',
  'f': 'Hithpalpel',
  'D': 'Nithpael',
  'j': 'Pealal',
  'i': 'Pilel',
  'u': 'Hothpaal',
  'c': 'Tiphil',
  'v': 'Hishtaphel',
  'w': 'Nithpalel',
  'y': 'Nithpoel',
  'z': 'Hithpoel',

  // Tenses
  'p': 'Perfect',
  'q': 'Sequential Perfect',
  'i': 'Imperfect',
  'w': 'Sequential Imperfect',
  'h': 'Cohortative',
  'j': 'Jussive',
  'v': 'Imperative',
  'r': 'Participle Active',
  's': 'Participle Passive',
  'a': 'Infinitive Absolute',
  'c': 'Infinitive Construct',

  // Gender
  'b': 'both',
  'c': 'common',
  'f': 'feminine',
  'm': 'masculine',

  // Number
  's': 'singular',
  'd': 'dual',
  'p': 'plural',

  // Person
  '1': '1st person',
  '2': '2nd person',
  '3': '3rd person',

  // State
  'a': 'absolute',
  'c': 'construct',
  'd': 'determined'
};

/**
 * Parse Greek morphology code (RMAC format)
 * @param {string} code - Morphology code (e.g., "V-AAI-3S")
 * @returns {Object} Parsed morphology
 */
function parseGreekMorphology(code) {
  if (!code) return null;

  const parts = code.split('-');
  const result = {
    code,
    language: 'Greek',
    partOfSpeech: '',
    details: []
  };

  // Part of speech (first part)
  const pos = parts[0];
  if (pos.startsWith('R')) {
    result.partOfSpeech = GREEK_MORPH_PARTS[pos] || 'Pronoun';
  } else {
    result.partOfSpeech = GREEK_MORPH_PARTS[pos[0]] || pos[0];
  }

  // For verbs: Tense-Voice-Mood
  if (pos === 'V' && parts.length > 1) {
    const tense = parts[1][0];
    const voice = parts[1][1];
    const mood = parts[1][2];

    if (tense && GREEK_MORPH_PARTS[tense]) {
      result.tense = GREEK_MORPH_PARTS[tense];
      result.details.push(`Tense: ${result.tense}`);
    }
    if (voice && GREEK_MORPH_PARTS[voice]) {
      result.voice = GREEK_MORPH_PARTS[voice];
      result.details.push(`Voice: ${result.voice}`);
    }
    if (mood && GREEK_MORPH_PARTS[mood]) {
      result.mood = GREEK_MORPH_PARTS[mood];
      result.details.push(`Mood: ${result.mood}`);
    }

    // Person and number (third part for verbs)
    if (parts.length > 2) {
      const person = parts[2][0];
      const number = parts[2][1];

      if (person && GREEK_MORPH_PARTS[person]) {
        result.person = GREEK_MORPH_PARTS[person];
        result.details.push(`Person: ${result.person}`);
      }
      if (number && GREEK_MORPH_PARTS[number]) {
        result.number = GREEK_MORPH_PARTS[number];
        result.details.push(`Number: ${result.number}`);
      }
    }
  }

  // For nouns/adjectives/pronouns: Case-Number-Gender
  if (['A', 'N', 'R'].includes(pos[0]) && parts.length > 1) {
    const caseVal = parts[1][0];
    const number = parts[1][1];
    const gender = parts[1][2];

    if (caseVal && GREEK_MORPH_PARTS[caseVal]) {
      result.case = GREEK_MORPH_PARTS[caseVal];
      result.details.push(`Case: ${result.case}`);
    }
    if (number && GREEK_MORPH_PARTS[number]) {
      result.number = GREEK_MORPH_PARTS[number];
      result.details.push(`Number: ${result.number}`);
    }
    if (gender && GREEK_MORPH_PARTS[gender]) {
      result.gender = GREEK_MORPH_PARTS[gender];
      result.details.push(`Gender: ${result.gender}`);
    }
  }

  return result;
}

/**
 * Parse Hebrew morphology code (OSHM format)
 * @param {string} code - Morphology code (e.g., "HVqp3ms")
 * @returns {Object} Parsed morphology
 */
function parseHebrewMorphology(code) {
  if (!code || !code.startsWith('H')) return null;

  const result = {
    code,
    language: 'Hebrew',
    partOfSpeech: '',
    details: []
  };

  let idx = 1;  // Skip 'H'

  // Check for prefix markers (R, d, C, etc.)
  while (idx < code.length && ['R', 'd', 'C', 'T'].includes(code[idx])) {
    const prefix = code[idx];
    if (prefix === 'R') result.details.push('Has preposition prefix');
    if (prefix === 'd') result.details.push('Has definite article');
    if (prefix === 'C') result.details.push('Has conjunction prefix');
    if (prefix === 'T') result.details.push('Has particle prefix');
    idx++;
  }

  // Part of speech
  if (idx < code.length) {
    const pos = code[idx];
    result.partOfSpeech = HEBREW_MORPH_PARTS[pos] || pos;
    idx++;
  }

  // For verbs
  if (result.partOfSpeech === 'Verb' && idx < code.length) {
    // Stem
    const stem = code[idx];
    if (HEBREW_MORPH_PARTS[stem]) {
      result.stem = HEBREW_MORPH_PARTS[stem];
      result.details.push(`Stem: ${result.stem}`);
    }
    idx++;

    // Tense/aspect
    if (idx < code.length) {
      const tense = code[idx];
      if (HEBREW_MORPH_PARTS[tense]) {
        result.tense = HEBREW_MORPH_PARTS[tense];
        result.details.push(`Tense: ${result.tense}`);
      }
      idx++;
    }

    // Person
    if (idx < code.length && ['1', '2', '3'].includes(code[idx])) {
      result.person = HEBREW_MORPH_PARTS[code[idx]];
      result.details.push(`Person: ${result.person}`);
      idx++;
    }

    // Gender
    if (idx < code.length && ['m', 'f', 'c', 'b'].includes(code[idx])) {
      result.gender = HEBREW_MORPH_PARTS[code[idx]];
      result.details.push(`Gender: ${result.gender}`);
      idx++;
    }

    // Number
    if (idx < code.length && ['s', 'p', 'd'].includes(code[idx])) {
      result.number = HEBREW_MORPH_PARTS[code[idx]];
      result.details.push(`Number: ${result.number}`);
      idx++;
    }
  }

  // For nouns
  if (result.partOfSpeech === 'Noun' && idx < code.length) {
    // Gender
    if (idx < code.length && ['m', 'f', 'c', 'b'].includes(code[idx])) {
      result.gender = HEBREW_MORPH_PARTS[code[idx]];
      result.details.push(`Gender: ${result.gender}`);
      idx++;
    }

    // Number
    if (idx < code.length && ['s', 'p', 'd'].includes(code[idx])) {
      result.number = HEBREW_MORPH_PARTS[code[idx]];
      result.details.push(`Number: ${result.number}`);
      idx++;
    }

    // State
    if (idx < code.length && ['a', 'c', 'd'].includes(code[idx])) {
      result.state = HEBREW_MORPH_PARTS[code[idx]];
      result.details.push(`State: ${result.state}`);
      idx++;
    }
  }

  return result;
}

/**
 * Get morphological analysis for a word
 * @param {string} strongsNumber - Strong's number (e.g., "G26" or "H430")
 * @param {string} morphCode - Optional morphology code to parse
 * @returns {Promise<Object>} Morphological data
 */
export async function getMorphology(strongsNumber, morphCode = null) {
  if (!strongsNumber) return null;

  try {
    const type = strongsNumber[0].toUpperCase();
    let analysis = null;

    if (morphCode) {
      // Parse provided morphology code
      if (type === 'G') {
        analysis = parseGreekMorphology(morphCode);
      } else if (type === 'H') {
        analysis = parseHebrewMorphology(morphCode);
      }
    }

    return {
      strongs: strongsNumber,
      morphologyCode: morphCode,
      analysis: analysis || {
        language: type === 'G' ? 'Greek' : 'Hebrew',
        note: 'Morphological parsing requires verse context. Use concordance to see word in context.'
      }
    };
  } catch (error) {
    console.error(`Error getting morphology for ${strongsNumber}:`, error);
    return null;
  }
}

/**
 * Get participle explanation based on language and features
 * @param {Object} analysis - Morphological analysis
 * @returns {string|null} Participle explanation
 */
function getParticipleExplanation(analysis) {
  if (!analysis || analysis.mood !== 'Participle') return null;

  const explanations = {
    greek: {
      Present: {
        Active: 'Ongoing action, "while doing" (continuous)',
        Middle: 'Ongoing action affecting oneself, "while doing for oneself"',
        Passive: 'Ongoing action being received, "while being done to"'
      },
      Aorist: {
        Active: 'Completed action, "having done" (point in time)',
        Middle: 'Completed action for oneself, "having done for oneself"',
        Passive: 'Completed action received, "having been done to"'
      },
      Perfect: {
        Active: 'Completed with ongoing results, "having done and still affecting"',
        Middle: 'Completed for oneself with ongoing results',
        Passive: 'Completed state, "having been done to and remaining in that state"'
      }
    },
    hebrew: {
      Active: 'Describes ongoing or characteristic action (like an adjective)',
      Passive: 'Describes state of being acted upon'
    }
  };

  if (analysis.language === 'Greek' && analysis.tense && analysis.voice) {
    const explanation = explanations.greek[analysis.tense]?.[analysis.voice];
    if (explanation) {
      return `**Participle Function**: ${explanation}`;
    }
  }

  if (analysis.language === 'Hebrew' && analysis.tense) {
    const type = analysis.tense.includes('Active') ? 'Active' : 'Passive';
    return `**Participle Function**: ${explanations.hebrew[type]}`;
  }

  return '**Participle**: Functions as verbal adjective, describing action';
}

/**
 * Format morphology for display
 * @param {Object} morphology - Morphology object from getMorphology
 * @returns {string} Human-readable morphology description
 */
export function formatMorphology(morphology) {
  if (!morphology || !morphology.analysis) {
    return 'No morphological data available';
  }

  const { analysis } = morphology;
  const parts = [];

  parts.push(`**Part of Speech**: ${analysis.partOfSpeech}`);

  if (analysis.details && analysis.details.length > 0) {
    parts.push('');
    parts.push('**Grammatical Details**:');
    analysis.details.forEach(detail => {
      parts.push(`• ${detail}`);
    });
  }

  // Add participle explanation if applicable
  const participleExplanation = getParticipleExplanation(analysis);
  if (participleExplanation) {
    parts.push('');
    parts.push(participleExplanation);
  }

  // Add grammatical notes for complex constructions
  if (analysis.language === 'Greek') {
    if (analysis.mood === 'Subjunctive') {
      parts.push('');
      parts.push('**Note**: Subjunctive mood expresses possibility, purpose, or contingency');
    }
    if (analysis.mood === 'Imperative') {
      parts.push('');
      parts.push('**Note**: Imperative mood expresses command or exhortation');
    }
    if (analysis.tense === 'Perfect' && analysis.mood === 'Indicative') {
      parts.push('');
      parts.push('**Note**: Perfect tense emphasizes completed action with ongoing results');
    }
  }

  if (analysis.language === 'Hebrew') {
    if (analysis.stem && ['Piel', 'Hiphil'].includes(analysis.stem)) {
      parts.push('');
      if (analysis.stem === 'Piel') {
        parts.push('**Note**: Piel stem often intensifies or makes factitive (causing state)');
      }
      if (analysis.stem === 'Hiphil') {
        parts.push('**Note**: Hiphil stem indicates causative action (causing someone to do)');
      }
    }
  }

  if (analysis.note) {
    parts.push('');
    parts.push(`*${analysis.note}*`);
  }

  return parts.join('\n');
}

export default {
  getMorphology,
  parseGreekMorphology,
  parseHebrewMorphology,
  formatMorphology
};
