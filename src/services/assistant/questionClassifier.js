/**
 * S.H.A.R.P. Question Type Classifier
 *
 * Comprehensive taxonomy for classifying Scripture, theology, history, doctrine,
 * exegesis, apologetics, lifestyle, and pastoral questions.
 *
 * Returns { category, subcategory, confidence, keywords, needsClarification }
 */

import { parseReference } from './referenceParser';

// Question patterns organized by category
const PATTERNS = {
  // I. SCRIPTURE QUESTIONS
  scripture: {
    who: {
      patterns: [
        /^who (?:is|was|were|are)\b/i,
        /\bwho (?:wrote|authored|penned)\b/i,
        /^identify\b.*person/i
      ],
      examples: ['Who is Paul?', 'Who wrote Hebrews?', 'Who are the Pharisees?']
    },
    what_definition: {
      patterns: [
        /^what (?:is|was|are|were)\b/i,
        /^define\b/i,
        /^definition of\b/i,
        /^meaning of\b/i,
        /\bwhat does .* mean\b/i
      ],
      examples: ['What is justification?', 'What is the Kingdom of God?', 'What is the Septuagint?']
    },
    where: {
      patterns: [
        /^where (?:is|was|were|are)\b/i,
        /^locate\b/i,
        /\bgeography of\b/i,
        /\bwhere did .* happen\b/i
      ],
      examples: ['Where is Zion?', 'Where did Paul write Romans?']
    },
    when: {
      patterns: [
        /^when (?:did|was|were|is)\b/i,
        /\btimeline of\b/i,
        /\bdate of\b/i,
        /\bwhat year\b/i
      ],
      examples: ['When was Jesus crucified?', 'When did Israel enter Canaan?']
    },
    why: {
      patterns: [
        /^why (?:did|does|is|was)\b/i,
        /\breason (?:for|behind)\b/i,
        /\bwhat caused\b/i,
        /\bcausation\b/i
      ],
      examples: ['Why did God allow Job to suffer?', 'Why did Paul circumcise Timothy?']
    },
    interpretation: {
      patterns: [
        /\binterpret\b/i,
        /\bexplain\b.*(?:verse|passage|chapter|scripture)\b/i,
        /\bwhat does .* mean\?$/i,
        /\bexegesis of\b/i,
        /\bmeaning of .* verse\b/i,
        /\bbreak down\b/i
      ],
      examples: ['What does Romans 9 mean?', 'Explain 1 Corinthians 14', 'What does "sons of God" mean?']
    },
    language: {
      patterns: [
        /\b(?:greek|hebrew|aramaic|original language)\b/i,
        /\bwhat (?:is|does) the (?:greek|hebrew)\b/i,
        /\b(?:lxx|septuagint) (?:phrasing|wording|translation)\b/i,
        /\bstrong'?s\b/i,
        /\bmorphology\b/i,
        /\bword study\b/i
      ],
      examples: ['What is the Greek for love?', 'Show me the LXX phrasing', 'Hebrew word ruach']
    },
    cross_reference: {
      patterns: [
        /\bcross[- ]?ref(?:erence)?s?\b/i,
        /\brelated (?:verses|passages)\b/i,
        /\bshow (?:me )?(?:all )?verses (?:about|on)\b/i,
        /\bwhere (?:else|in scripture)\b/i,
        /\bparallel passages\b/i,
        /\bconnect(?:ed|ing) verses\b/i
      ],
      examples: ['What verses connect to John 3:16?', 'Show verses about repentance']
    },
    compare_translations: {
      patterns: [
        /\bcompare (?:translations|versions)\b/i,
        /\b(?:kjv|niv|esv|nasb|nlt|web|asv) vs (?:kjv|niv|esv|nasb|nlt|web|asv)\b/i,
        /\b(?:kjv|niv|esv|nasb|nlt) and (?:lxx|septuagint|masoretic|wlc)\b/i,
        /\bdifferences? between\b.*\b(?:translations?|versions?)\b/i,
        /\bside[- ]?by[- ]?side\b/i
      ],
      examples: ['Compare KJV vs LXX', 'Compare translations', 'NIV vs ESV']
    }
  },

  // II. THEOLOGY QUESTIONS
  theology: {
    doctrine: {
      patterns: [
        /\b(?:doctrine|doctrinal|systematic theology)\b/i,
        /\bwhat (?:is|does) (?:the bible|scripture) (?:say|teach) about\b/i,
        /\b(?:trinity|atonement|justification|sanctification|glorification)\b/i,
        /\b(?:election|predestination|free will)\b/i
      ],
      examples: ['What is the Trinity?', 'Explain justification', 'Biblical election']
    },
    christology: {
      patterns: [
        /\b(?:christology|nature of christ|deity of christ)\b/i,
        /\b(?:was|is) jesus (?:god|divine|human|man)\b/i,
        /\bhypostatic union\b/i,
        /\bfirstborn of (?:all )?creation\b/i
      ],
      examples: ['Was Jesus God or man?', 'Deity of Christ', 'Firstborn of creation']
    },
    pneumatology: {
      patterns: [
        /\bholy spirit\b/i,
        /\bpneumatology\b/i,
        /\bblasphemy (?:of|against) (?:the )?holy spirit\b/i,
        /\btongues\b/i,
        /\bgifts of the spirit\b/i
      ],
      examples: ['What is blasphemy of the Holy Spirit?', 'Are tongues for today?']
    },
    soteriology: {
      patterns: [
        /\bsalvation\b/i,
        /\bhow (?:do|does|can) (?:someone|people|one) (?:get|be) saved\b/i,
        /\blose salvation\b/i,
        /\beternal security\b/i,
        /\bonce saved always saved\b/i
      ],
      examples: ['How does someone get saved?', 'Can a believer lose salvation?']
    },
    ecclesiology: {
      patterns: [
        /\bchurch\b/i,
        /\becclesia\b/i,
        /\bwomen (?:pastors?|elders?|teachers?)\b/i,
        /\bpastor(?:al)?|elder(?:ship)?\b/i
      ],
      examples: ['What is the church?', 'Should women be pastors?']
    },
    eschatology: {
      patterns: [
        /\bend times\b/i,
        /\beschatology\b/i,
        /\b(?:rapture|tribulation|millennium|second coming)\b/i,
        /\b(?:pre|mid|post)[- ]?trib(?:ulation)?\b/i,
        /\bman of lawlessness\b/i,
        /\bantichrist\b/i
      ],
      examples: ['What is the millennium?', 'Who is the man of lawlessness?']
    }
  },

  // III. HISTORICAL QUESTIONS
  history: {
    early_church: {
      patterns: [
        /\bearly church\b/i,
        /\bapostolic fathers\b/i,
        /\bchurch fathers\b/i,
        /\bwhat did (?:the )?early (?:church|christians) believe\b/i,
        /\b(?:nicene|chalcedon|constantinople) (?:council|creed)\b/i
      ],
      examples: ['What did early church believe?', 'Apostolic Fathers']
    },
    jewish_background: {
      patterns: [
        /\bjewish (?:background|context|customs?|tradition)\b/i,
        /\bsynagogue\b/i,
        /\b(?:pharisees?|sadducees?|essenes?)\b/i,
        /\b(?:passover|tabernacles|pentecost)\b/i,
        /\bsecond temple\b/i
      ],
      examples: ['Jewish background', 'Synagogue customs', '1st century Judaism']
    },
    ancient_near_east: {
      patterns: [
        /\b(?:assyria|babylon|egypt|persia|rome)\b/i,
        /\bcanaanite\b/i,
        /\bancient near east\b/i,
        /\b(?:mesopotamia|levant)\b/i
      ],
      examples: ['Canaanite religions', 'Assyria relationship to Israel']
    },
    manuscript_history: {
      patterns: [
        /\b(?:manuscript|codex|papyri)\b/i,
        /\b(?:sinaiticus|vaticanus|alexandrinus)\b/i,
        /\btextual (?:criticism|variant|history)\b/i,
        /\blonger ending of mark\b/i
      ],
      examples: ['What is Codex Sinaiticus?', 'Manuscript support']
    }
  },

  // IV. APOLOGETICS QUESTIONS
  apologetics: {
    reliability: {
      patterns: [
        /\b(?:is|are) (?:the )?bible (?:reliable|trustworthy|accurate)\b/i,
        /\bcontradiction(?:s)?\b/i,
        /\berror(?:s)? in (?:the )?bible\b/i,
        /\bdid jesus (?:really )?rise\b/i,
        /\bresurrection (?:evidence|proof)\b/i
      ],
      examples: ['Is the Bible reliable?', 'Why are there contradictions?']
    },
    moral_objections: {
      patterns: [
        /\bwhy did god (?:allow|command|permit)\b/i,
        /\b(?:slavery|genocide|killing) in (?:the )?bible\b/i,
        /\bconquest of canaan\b/i,
        /\bold testament violence\b/i
      ],
      examples: ['Why did God allow slavery?', 'God command conquest of Canaan']
    },
    science: {
      patterns: [
        /\b(?:science|evolution|big bang|age of earth)\b/i,
        /\bcan (?:a )?christian believe in evolution\b/i,
        /\bdoes (?:the )?bible contradict science\b/i,
        /\bgenesis (?:creation|days)\b/i
      ],
      examples: ['Bible and science', 'Can Christians believe in evolution?']
    }
  },

  // V. PRACTICAL CHRISTIAN LIFE
  practical: {
    lifestyle: {
      patterns: [
        /\bshould (?:christians?|i|we)\b/i,
        /\b(?:is|are) .* (?:a )?sin\b/i,
        /\b(?:alcohol|drinking|gambling|smoking)\b/i,
        /\bchristian living\b/i
      ],
      examples: ['Should Christians drink alcohol?', 'Is gambling a sin?']
    },
    relationships: {
      patterns: [
        /\b(?:marriage|divorce|dating|singleness)\b/i,
        /\bhow (?:should|do) i (?:forgive|love)\b/i,
        /\brelationship(?:s)?\b/i
      ],
      examples: ['What does Bible say about marriage?', 'How should I forgive?']
    },
    spiritual_growth: {
      patterns: [
        /\bhow (?:do|can) i (?:overcome|grow|read|pray)\b/i,
        /\bspiritual (?:growth|discipline|formation)\b/i,
        /\btemptation\b/i,
        /\bhow (?:should|do) i read (?:the )?bible\b/i
      ],
      examples: ['How do I overcome temptation?', 'How should I read the Bible?']
    }
  },

  // VI. PASTORAL / COUNSELING
  pastoral: {
    emotional: {
      patterns: [
        /\b(?:depression|anxiety|fear|worry|grief|suffering)\b/i,
        /\bhow can i trust god\b/i,
        /\bwhy (?:does|did) god allow (?:this|suffering)\b/i
      ],
      examples: ['What does Bible say about depression?', 'Trust God in suffering']
    },
    guidance: {
      patterns: [
        /\bhow (?:do|can) i know god'?s will\b/i,
        /\b(?:calling|vocation|direction)\b/i,
        /\bwhat should i do\b/i
      ],
      examples: ['How do I know God\'s will?', 'What should I do if discouraged?']
    }
  },

  // VII. COMPARATIVE RELIGION
  comparative_religion: {
    other_religions: {
      patterns: [
        /\b(?:islam|muslim|judaism|hindu|buddhism|mormon|jehovah)\b/i,
        /\bwhat do(?:es)? .* teach\b/i,
        /\b(?:christianity|christian) vs\b/i,
        /\bcompare (?:christianity|christian faith) (?:to|with)\b/i
      ],
      examples: ['Islam vs Christianity', 'What do Mormons believe?']
    },
    cults: {
      patterns: [
        /\b(?:cult(?:s)?|heresy|heresies|gnosticism)\b/i,
        /\b(?:jehovah'?s witnesses?|mormon(?:s|ism)?|lds)\b/i
      ],
      examples: ['What do Jehovah\'s Witnesses believe?', 'What is Gnosticism?']
    }
  },

  // VIII. PAUL-SPECIFIC QUESTIONS
  paul: {
    general: {
      patterns: [
        /\bdid paul\b/i,
        /\bwhy did paul\b/i,
        /\bwas paul\b/i,
        /\bpaul'?s (?:journeys?|missions?|letters?|epistles?|ministry)\b/i,
        /\bthorn in (?:the )?flesh\b/i
      ],
      examples: ['Did Paul contradict Jesus?', 'Paul\'s thorn in flesh']
    }
  }
};

// Patterns that indicate need for clarification
const AMBIGUOUS_PATTERNS = [
  /^explain this$/i,
  /^what does this mean$/i,
  /^tell me about$/i,
  /^show me$/i,
  /^this verse$/i
];

// Keywords that should NOT trigger certain responses
const NEGATIVE_KEYWORDS = {
  salvation: ['paul', 'who is', 'biographical', 'history of'],
  verses: ['who is', 'when did', 'where is']
};

/**
 * Classify a question into category, subcategory, and confidence level
 */
export function classifyQuestion(query) {
  const text = (query || '').trim();
  if (!text) return { category: 'unknown', subcategory: null, confidence: 0 };

  // Check for ambiguous questions that need clarification
  const needsClarification = AMBIGUOUS_PATTERNS.some(p => p.test(text));
  if (needsClarification) {
    return {
      category: 'ambiguous',
      subcategory: null,
      confidence: 1.0,
      needsClarification: true,
      suggestion: 'Please provide more context. Do you want: historical background, linguistic analysis, doctrinal interpretation, or practical application?'
    };
  }

  // Check if it's a reference lookup
  const parsed = parseReference(text);
  if (parsed && parsed.valid) {
    return {
      category: 'scripture',
      subcategory: 'reference_lookup',
      confidence: 1.0,
      parsed,
      needsClarification: false
    };
  }

  const lower = text.toLowerCase();
  let bestMatch = { category: 'general', subcategory: null, confidence: 0 };

  // Iterate through all patterns
  for (const [category, subcategories] of Object.entries(PATTERNS)) {
    for (const [subcategory, config] of Object.entries(subcategories)) {
      for (const pattern of config.patterns) {
        if (pattern.test(text)) {
          // Check for negative keywords
          let hasNegative = false;
          if (NEGATIVE_KEYWORDS[subcategory]) {
            hasNegative = NEGATIVE_KEYWORDS[subcategory].some(neg => lower.includes(neg));
          }

          if (!hasNegative) {
            const confidence = calculateConfidence(text, pattern, category, subcategory);
            if (confidence > bestMatch.confidence) {
              bestMatch = {
                category,
                subcategory,
                confidence,
                needsClarification: false,
                examples: config.examples
              };
            }
          }
        }
      }
    }
  }

  // Extract keywords for better routing
  const keywords = extractKeywords(text);
  bestMatch.keywords = keywords;

  return bestMatch;
}

/**
 * Calculate confidence based on pattern match quality
 */
function calculateConfidence(text, pattern, category, subcategory) {
  let confidence = 0.7; // Base confidence for pattern match

  // Boost confidence for specific indicators
  const lower = text.toLowerCase();

  // Question marks increase confidence
  if (text.includes('?')) confidence += 0.1;

  // Starting with question words
  if (/^(?:who|what|where|when|why|how|is|are|was|were|did|does|can|should)\b/i.test(text)) {
    confidence += 0.1;
  }

  // Specific theological terms
  if (category === 'theology' && /\b(?:doctrine|biblical|scriptural|theological)\b/i.test(lower)) {
    confidence += 0.1;
  }

  // Cap at 1.0
  return Math.min(confidence, 1.0);
}

/**
 * Extract meaningful keywords from query
 */
function extractKeywords(text) {
  const stopWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'what', 'who', 'where', 'when', 'why', 'how', 'does', 'do', 'did', 'can', 'should', 'would', 'about', 'in', 'on', 'at', 'to', 'for', 'of'];

  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.includes(w));

  return [...new Set(words)]; // unique keywords
}

/**
 * Get suggested response strategy based on classification
 */
export function getResponseStrategy(classification) {
  const { category, subcategory, confidence } = classification;

  const strategies = {
    'scripture.who': {
      steps: ['identify_person', 'provide_biography', 'show_key_verses', 'historical_context'],
      format: 'biographical'
    },
    'scripture.what_definition': {
      steps: ['lookup_dictionary', 'provide_definition', 'show_biblical_usage', 'cross_references'],
      format: 'definition'
    },
    'scripture.interpretation': {
      steps: ['show_verse', 'historical_context', 'linguistic_analysis', 'cross_references', 'multiple_views'],
      format: 'exegetical'
    },
    'scripture.language': {
      steps: ['show_original', 'morphology', 'lexicon_entry', 'usage_examples'],
      format: 'linguistic'
    },
    'scripture.cross_reference': {
      steps: ['find_related_verses', 'group_by_theme', 'show_passages'],
      format: 'list'
    },
    'scripture.compare_translations': {
      steps: ['fetch_all_translations', 'show_side_by_side', 'explain_differences'],
      format: 'comparison_table'
    },
    'theology.doctrine': {
      steps: ['define_doctrine', 'show_key_passages', 'multiple_views', 'practical_application'],
      format: 'doctrinal'
    },
    'apologetics.reliability': {
      steps: ['acknowledge_concern', 'provide_evidence', 'show_scholarly_consensus', 'suggest_resources'],
      format: 'apologetic'
    },
    'practical.lifestyle': {
      steps: ['show_relevant_passages', 'biblical_principles', 'wisdom_and_nuance', 'practical_guidance'],
      format: 'practical'
    },
    'pastoral.emotional': {
      steps: ['acknowledge_struggle', 'show_comforting_passages', 'biblical_perspective', 'encourage_community'],
      format: 'pastoral'
    }
  };

  const key = `${category}.${subcategory}`;
  return strategies[key] || {
    steps: ['understand_question', 'search_relevant_content', 'synthesize_answer'],
    format: 'general'
  };
}

export default { classifyQuestion, getResponseStrategy };
