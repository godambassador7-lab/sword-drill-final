import { buildApologeticResponse, findReligionsIn, listReligions } from './retrieval/religionsProvider';import { getOverallStats } from './retrieval/userStatsProvider';
import { routeIntent } from './intentRouter';
import { parseReference } from './referenceParser';
import { searchLocalVerses, getVerseByReference } from './retrieval/bibleProvider';
import { getKJVVerses } from './retrieval/kjvProvider';
import { getWEBVerses } from './retrieval/webProvider';
import { getESVVerses } from './retrieval/esvProvider';
import { getBishopsVerses } from './retrieval/bishopsProvider';
import { getGenevaVerses } from './retrieval/genevaProvider';
import { getASVVerses } from './retrieval/asvProvider';
import { getWlcVerseByReference } from './retrieval/wlcProvider';
import { getLxxVerseByReference } from './retrieval/lxxProvider';
import { getSinaiticusVerseByReference } from './retrieval/sinaiticusProvider';
import { isApocryphaBook, getApocryphaVerses } from './retrieval/apocryphaProvider';
import { synthesizeNeutral } from './synthesizer';
import { applyNeutrality } from './neutralityGuard';
import { getCrossReferences } from './retrieval/crossRefsProvider';
import { lookupWordStudy } from './lexiconProvider';
import { lookupDefinition, searchDefinitionsPrefix, searchDefinitionsFuzzy } from './dictionaryProvider';
import { classifyQuestion, getResponseStrategy } from './questionClassifier';
import {
  enhanceWithPersonality,
  detectAmbiguousQuestion,
  generateClarificationPrompt,
  addPaulContext
} from './sharpPersonality';
import { searchLocations } from './retrieval/mapsProvider';
import {
  answerFeastDayQuery,
  isFeastDayQuery,
  getCurrentFeastDayContext
} from './feastDayKnowledge';
import { analyzeQuestion, generateClarificationRequest } from './questionAnalyzer';

// Cache for verse lookups to avoid redundant fetches
const verseCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(book, chapter, verse, verseEnd, translation) {
  return `${translation}:${book}:${chapter}:${verse}${verseEnd ? `-${verseEnd}` : ''}`;
}

function formatVersesBlock(arr) {
  return arr.map(v => `"${v.text}"\nâ€" ${v.reference} (${v.translation})`).join('\n\n');
}

/**
 * Summarize a long dictionary definition into a concise overview
 * @param {string} definition - The full definition text
 * @param {string} headword - The term being defined
 * @returns {string} - A summarized version
 */
function summarizeDefinition(definition, headword) {
  if (!definition || definition.length < 300) return definition;

  // Extract first sentence or two as summary
  const sentences = definition.match(/[^.!?]+[.!?]+/g) || [];
  if (sentences.length === 0) return definition.slice(0, 200) + '...';

  // Get first 1-2 sentences that capture the essence
  let summary = sentences[0];
  if (sentences.length > 1 && summary.length < 150) {
    summary += ' ' + sentences[1];
  }

  // Clean up any incomplete references or orphaned markers
  summary = summary.replace(/\s+\(\d+\.\)\s*$/, '');
  summary = summary.replace(/\s+\[\w+\]\s*$/, '');

  return summary.trim();
}

/**
 * Check if user is asking for full/detailed information
 * @param {string} message - User's question
 * @returns {boolean}
 */
function wantsFullDefinition(message) {
  const fullRequestPatterns = /\b(full|complete|detailed|everything|all about|tell me more|entire|whole)\b/i;
  return fullRequestPatterns.test(message);
}

function mentionsMasoretic(q) {
  const s = (q || '').toLowerCase();
  return /\b(masoretic|wlc|hebrew\s+(?:text|mt)|original\s+hebrew)\b/.test(s);
}

function mentionsLxx(q) {
  const s = (q || '').toLowerCase();
  return /\b(lxx|septuagint|old\s+greek|rahlfs)\b/.test(s);
}

function mentionsSinaiticus(q) {
  const s = (q || '').toLowerCase();
  return /\b(sinaiticus|codex\s+sinaiticus|aleph|\b01\b)\b/.test(s);
}

async function getWlcRange(parsed, options = {}) {
  const out = [];
  const start = parsed.verse || 1;
  const end = parsed.verseEnd && parsed.verseEnd >= start ? parsed.verseEnd : start;
  for (let v = start; v <= end; v++) {
    const ref = `${parsed.book} ${parsed.chapter}:${v}`;
    const one = await getWlcVerseByReference(ref, options);
    if (one) out.push(one);
  }
  return out;
}

async function fetchPreferredVerses(parsed, preferred) {
  const pref = (preferred || 'KJV').toUpperCase();

  // Check cache first
  const cacheKey = getCacheKey(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd, pref);
  const cached = verseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  let arr = [];
  // Apocrypha quick path
  if (isApocryphaBook(parsed.book) && parsed.verse) {
    arr = await getApocryphaVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
    if (arr && arr.length) {
      verseCache.set(cacheKey, { data: arr, timestamp: Date.now() });
      return arr;
    }
  }
  if (pref === 'WEB') {
    arr = await getWEBVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
    if (!arr || arr.length === 0) arr = await getKJVVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
    if (!arr || arr.length === 0) arr = await getESVVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
    if (!arr || arr.length === 0) arr = await getASVVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
  } else if (pref === 'ESV') {
    arr = await getESVVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
    if (!arr || arr.length === 0) arr = await getWEBVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
    if (!arr || arr.length === 0) arr = await getKJVVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
    if (!arr || arr.length === 0) arr = await getASVVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
  } else if (pref === 'ASV') {
    arr = await getASVVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
    if (!arr || arr.length === 0) arr = await getWEBVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
    if (!arr || arr.length === 0) arr = await getKJVVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
    if (!arr || arr.length === 0) arr = await getESVVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
  } else if (pref === 'BISHOPS') {
    arr = await getBishopsVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
    if (!arr || arr.length === 0) arr = await getWEBVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
    if (!arr || arr.length === 0) arr = await getKJVVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
    if (!arr || arr.length === 0) arr = await getESVVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
  } else if (pref === 'GENEVA') {
    arr = await getGenevaVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
    if (!arr || arr.length === 0) arr = await getWEBVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
    if (!arr || arr.length === 0) arr = await getKJVVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
    if (!arr || arr.length === 0) arr = await getESVVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
  } else {
    arr = await getKJVVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
    if (!arr || arr.length === 0) arr = await getWEBVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
    if (!arr || arr.length === 0) arr = await getESVVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
    if (!arr || arr.length === 0) arr = await getASVVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd);
  }

  // Cache the result before returning
  if (arr && arr.length > 0) {
    verseCache.set(cacheKey, { data: arr, timestamp: Date.now() });
  }

  return arr || [];
}

/**
 * Resolve follow-up questions using conversation context
 * Handles pronouns like "it", "that", "he", "she" and references like "more about this"
 */
function resolveFollowUpContext(userMessage, conversationHistory) {
  if (!conversationHistory || conversationHistory.length === 0) {
    return userMessage;
  }

  const lowerMessage = userMessage.toLowerCase();

  // Check if this is a follow-up question
  const followUpPatterns = [
    /^(what about|tell me more|more about|explain|and|also|what else)/i,
    /\b(it|that|this|he|she|they|them|him|her)\b/i,
    /^(who|what|where|when|why|how)/i,
  ];

  const isFollowUp = followUpPatterns.some(pattern => pattern.test(lowerMessage));

  if (!isFollowUp) {
    return userMessage;
  }

  // Get the last assistant message
  const lastMessages = conversationHistory.slice().reverse();
  const lastAssistant = lastMessages.find(m => m.type === 'assistant');

  if (!lastAssistant || !lastAssistant.metadata) {
    return userMessage;
  }

  // Extract context from last response
  let contextualInfo = '';

  if (lastAssistant.metadata.type === 'map_location' && lastAssistant.metadata.location) {
    contextualInfo = lastAssistant.metadata.location;
  } else if (lastAssistant.metadata.personLookup || lastAssistant.metadata.definitionLookup) {
    // Extract the subject from the last answer
    const match = lastAssistant.content.match(/📖\s+([^\n]+)/);
    if (match) contextualInfo = match[1].trim();
  } else if (lastAssistant.citations && lastAssistant.citations.length > 0) {
    contextualInfo = lastAssistant.citations[0].ref;
  }

  // If we have context and the question is vague, add context
  if (contextualInfo) {
    const pronounPatterns = /^(it|that|this|he|she|they|tell me more|what about|more about|and|also)\b/i;
    if (pronounPatterns.test(lowerMessage)) {
      return `${contextualInfo} ${userMessage}`;
    }
  }

  return userMessage;
}

// Improved follow-up resolver that tolerates missing metadata and missing subjects
function resolveFollowUpContextV2(userMessage, conversationHistory) {
  if (!conversationHistory || conversationHistory.length === 0) return userMessage;
  const lowerMessage = (userMessage || '').toLowerCase();

  const followUpPatterns = [
    /^(what about|tell me more|more about|explain|and|also|what else|more details|give me more)/i,
    /\b(it|that|this|he|she|they|them|him|her)\b/i
  ];
  const isFollowUp = followUpPatterns.some(p => p.test(lowerMessage));
  if (!isFollowUp) return userMessage;

  const lastAssistant = [...conversationHistory].reverse().find(m => m.type === 'assistant');
  if (!lastAssistant) return userMessage;

  const meta = lastAssistant.meta || lastAssistant.metadata || {};
  let contextualInfo = '';

  if (meta.type === 'map_location' && meta.location) {
    contextualInfo = meta.location;
  } else if (meta.headword) {
    contextualInfo = meta.headword;
  } else if (meta.personLookup || meta.definitionLookup) {
    if (lastAssistant.content) {
      contextualInfo = String(lastAssistant.content).split('\n')[0] || '';
    }
  } else if (lastAssistant.citations && lastAssistant.citations.length > 0) {
    contextualInfo = lastAssistant.citations[0].ref;
  }

  if (contextualInfo) {
    const askMorePatterns = /(tell me more|give me more|more details|more info)/i;
    const pronounPatterns = /^(it|that|this|he|she|they|tell me more|give me more|more details|more info|what about|more about|and|also)\b/i;
    if (askMorePatterns.test(lowerMessage)) {
      return `Tell me more about ${contextualInfo}`;
    }
    if (pronounPatterns.test(lowerMessage)) {
      return `${contextualInfo} ${userMessage}`;
    }
  }

  return userMessage;
}
export async function answerQuery(userMessage, context = {}) {
  // Analyze question structure and quality first
  const questionAnalysis = analyzeQuestion(userMessage);
  const clarificationNeeded = generateClarificationRequest(userMessage);

  // Return helpful error message if question is unclear or poorly formed
  if (clarificationNeeded) {
    return {
      answer: clarificationNeeded.message,
      citations: [],
      metadata: {
        needsClarification: true,
        suggestion: clarificationNeeded.suggestion,
        questionAnalysis
      }
    };
  }

  // Resolve follow-up questions using conversation context
  const resolvedMessage = resolveFollowUpContextV2(userMessage, context.conversationHistory);

  // Explicit "tell me more about X" shortcut to detailed definition
  const moreMatch = /^tell me more about\s+(.+)/i.exec(resolvedMessage || '');
  if (moreMatch) {
    const term = moreMatch[1].trim();
    const defResult = await lookupDefinition(term) || (await searchDefinitionsPrefix(term))[0] || (await searchDefinitionsFuzzy(term, 1))[0];
    if (defResult) {
      const headword = defResult.headword || term;
      const definition = defResult.def || defResult.definition || '';
      const ans = `?? ${headword}\n\n${definition}`;
      return {
        answer: ans,
        citations: [],
        metadata: { definitionLookup: true, headword },
        meta: { definitionLookup: true, headword }
      };
    }
  }

  // Check for ambiguous questions first using S.H.A.R.P. personality system
  if (detectAmbiguousQuestion(resolvedMessage)) {
    return generateClarificationPrompt(resolvedMessage);
  }

  // Classify the question using comprehensive taxonomy
  const classification = classifyQuestion(resolvedMessage);

  // Handle ambiguous questions that need clarification
  if (classification.needsClarification) {
    return generateClarificationPrompt(resolvedMessage);
  }

  const routed = routeIntent(resolvedMessage);
  let query = routed.query;

  const parsed = parseReference(userMessage);
  if (parsed.valid) query = parsed.normalized;

  // Check for feast day queries
  if (isFeastDayQuery(userMessage)) {
    const feastAnswer = answerFeastDayQuery(userMessage);
    if (feastAnswer) {
      return {
        answer: enhanceWithPersonality(feastAnswer, 'mentor'),
        citations: [],
        metadata: {
          type: 'feast_day',
          classification
        }
      };
    }
  }

  // Check for map location queries
  if (routed.type === 'map_location') {
    const locations = await searchLocations(query);
    if (locations.length > 0) {
      const location = locations[0];

      // Build comprehensive location answer
      let ans = `📍 **${location.name}**`;

      // Add modern location info if available
      if (location.modern_country) {
        ans += `\n\n**Present Day Location:** ${location.modern_country}`;
      }

      // Add region/type info
      if (location.region) {
        ans += `\n**Biblical Region:** ${location.region}`;
      }

      // Add coordinates if available
      if (location.approximate_coordinates) {
        ans += `\n**Coordinates:** ${location.approximate_coordinates.lat}°N, ${location.approximate_coordinates.lng}°E`;
      }

      // Add description if available
      if (location.description) {
        ans += `\n\n${location.description}`;
      }

      // Add key events if available
      if (location.events && location.events.length > 0) {
        ans += `\n\n**Biblical Significance:**`;
        location.events.forEach(event => {
          ans += `\n• ${event}`;
        });
      }

      // Add scripture references if available
      if (location.primary_scriptures && location.primary_scriptures.length > 0) {
        ans += `\n\n**Key Passages:** ${location.primary_scriptures.join(', ')}`;
      }

      return {
        answer: enhanceWithPersonality(ans, 'mentor'),
        citations: [],
        metadata: {
          type: 'map_location',
          location: location.name,
          modern_country: location.modern_country,
        }
      };
    }
  }

  // Word study
  if (routed.type === 'word_study') {
    const entry = lookupWordStudy(query);
    if (entry) {
      const ans = `Word Study: ${entry.lemma} (${entry.language}) â€" Strong's ${entry.strong}\nMeaning: ${entry.gloss}\nNotes: ${entry.notes}\n\nHint: Ask for passages that use this term to see usage in context.`;
      return { answer: applyNeutrality(ans), citations: [] };
    }
  }

  // User stats
  if (routed.type === 'user_stats') {
    const stats = await getOverallStats(context.userId);
    if (stats.error) {
      return { answer: stats.error, citations: [] };
    }
    const { currentStreak, totalXP, totalQuizzes, accuracy } = stats;
    const ans = `Here are your current stats:\n\n` +
      `**Current Streak:** ${currentStreak} days\n` +
      `**Total XP:** ${totalXP}\n` +
      `**Total Quizzes Taken:** ${totalQuizzes}\n` +
      `**Overall Accuracy:** ${accuracy}%\n\n` +
      `Keep up the great work!`;
    return { answer: ans, citations: [] };
  }

  // Compare translations
  if (routed.type === 'compare_translations' && parsed.valid && parsed.verse) {
    // Apocrypha branch: include APOC source first when applicable
    const apoc = isApocryphaBook(parsed.book)
      ? (await getApocryphaVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd))[0]
      : null;

    // Modern translations
    const kjv = (await getKJVVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd))[0];
    const web = (await getWEBVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd))[0];
    const esv = (await getESVVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd))[0];
    const asv = (await getASVVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd))[0];
    const bishops = (await getBishopsVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd))[0];
    const geneva = (await getGenevaVerses(parsed.book, parsed.chapter, parsed.verse, parsed.verseEnd))[0];

    // Ancient manuscripts (Old Testament only)
    let wlc = null, lxx = null;
    const isOT = ['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1Samuel','2Samuel','1Kings','2Kings','1Chronicles','2Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi'].includes(parsed.book);

    if (isOT && parsed.verse) {
      try {
        const wlcResult = await getWlcVerseByReference(parsed.book, parsed.chapter, parsed.verse);
        if (wlcResult) wlc = { text: wlcResult, reference: parsed.normalized, translation: 'WLC' };
      } catch (e) { /* WLC not available for this verse */ }

      try {
        const lxxResult = await getLxxVerseByReference(parsed.book, parsed.chapter, parsed.verse);
        if (lxxResult) lxx = { text: lxxResult, reference: parsed.normalized, translation: 'LXX' };
      } catch (e) { /* LXX not available for this verse */ }
    }

    if (apoc || kjv || web || esv || asv || bishops || geneva || wlc || lxx) {
      let ans = `Compare translations for ${parsed.normalized}:`;

      // Ancient manuscripts first
      if (wlc) ans += `\n\n[WLC - Hebrew Masoretic] ${wlc.text}`;
      if (lxx) ans += `\n\n[LXX - Greek Septuagint] ${lxx.text}`;

      // Then modern translations
      if (apoc) ans += `\n\n[APOC] ${apoc.text}`;
      if (kjv) ans += `\n\n[KJV] ${kjv.text}`;
      if (web) ans += `\n\n[WEB] ${web.text}`;
      if (esv) ans += `\n\n[ESV] ${esv.text}`;
      if (asv) ans += `\n\n[ASV] ${asv.text}`;
      if (bishops) ans += `\n\n[BISHOPS] ${bishops.text}`;
      if (geneva) ans += `\n\n[GENEVA] ${geneva.text}`;

      ans += `\n\nTip: Ask "cross refs for ${parsed.normalized}" or "word study on <term>".`;
      const meta = { compare: { ref: parsed.normalized, wlc: wlc?.text || '', lxx: lxx?.text || '', apoc: apoc?.text || '', kjv: kjv?.text || '', web: web?.text || '', esv: esv?.text || '', asv: asv?.text || '', bishops: bishops?.text || '', geneva: geneva?.text || '' }, apoc: !!apoc, ancientStudy: !!(wlc || lxx) };
      const transList = ['WLC','LXX','APOC','KJV','WEB','ESV','ASV','BISHOPS','GENEVA'].filter((t, i) => [wlc, lxx, apoc, kjv, web, esv, asv, bishops, geneva][i]).join('/');
      return { answer: applyNeutrality(ans), citations: [{ ref: parsed.normalized, translation: transList }], meta };
    }
  }

  // Passage context
  if (routed.type === 'context' && parsed.valid) {
    const key = parsed.normalized;
    let primary = getVerseByReference(key);
    if (!primary && parsed.verse) {
      const prefArr = await fetchPreferredVerses(parsed, context.selectedTranslation);
      if (prefArr.length) primary = prefArr[0];
    }
    let ans = `Passage context for ${key} (concise):`;
    if (primary) ans += `\n\n"${primary.text}" â€” ${key}`;
    ans += `\n\nFor full literary context, read the surrounding paragraph in your preferred translation and consider crossâ€‘references.`;
    const related = getCrossReferences(key);
    if (related.length) ans += `\nRelated passages: ${related.join(', ')}.`;
    return { answer: applyNeutrality(ans), citations: [{ ref: key, translation: primary?.translation || 'Unknown' }] };
  }

  // Masoretic (WLC) explicit requests with token metadata (early return)
  if (parsed.valid && parsed.verse && mentionsMasoretic(userMessage)) {
    const verses = await getWlcRange(parsed, { stripDiacritics: true, addRtl: true });
    if (verses.length) {
      const header = 'WLC Masoretic';
      const body = verses.map(v => `"${v.text}"\n- ${v.reference} (WLC)`).join('\n\n');
      const ansBody = `[${header}]\n${body}`;
      const related = getCrossReferences(parsed.normalized);
      const ans = related.length ? `${ansBody}\n\nRelated passages: ${related.join(', ')}.` : ansBody;
      const wlcVerses = verses.map(v => ({ ref: v.reference, words: v.words || [] }));
      return { answer: applyNeutrality(ans), citations: verses.map(v => ({ ref: v.reference, translation: 'WLC' })), meta: { wlc: true, wlcVerses } };
    }
  }

  // Septuagint (LXX) explicit requests with token metadata (early return)
  if (parsed.valid && parsed.verse && mentionsLxx(userMessage)) {
    const start = parsed.verse || 1;
    const end = parsed.verseEnd && parsed.verseEnd >= start ? parsed.verseEnd : start;
    const verses = [];
    for (let v = start; v <= end; v++) {
      const ref = `${parsed.book} ${parsed.chapter}:${v}`;
      const one = await getLxxVerseByReference(ref);
      if (one) verses.push(one);
    }
    if (verses.length) {
      const header = 'LXX Septuagint';
      const body = verses.map(v => `"${v.text}"\n- ${v.reference} (LXX)`).join('\n\n');
      const ansBody = `[${header}]\n${body}`;
      const related = getCrossReferences(parsed.normalized);
      const ans = related.length ? `${ansBody}\n\nRelated passages: ${related.join(', ')}.` : ansBody;
      const lxxVerses = verses.map(v => ({ ref: v.reference, words: v.words || [] }));
      return { answer: applyNeutrality(ans), citations: verses.map(v => ({ ref: v.reference, translation: 'LXX' })), meta: { lxx: true, lxxVerses } };
    }
  }

  // Codex Sinaiticus explicit requests
  if (parsed.valid && parsed.verse && mentionsSinaiticus(userMessage)) {
    const start = parsed.verse || 1;
    const end = parsed.verseEnd && parsed.verseEnd >= start ? parsed.verseEnd : start;
    const verses = [];
    for (let v = start; v <= end; v++) {
      const ref = `${parsed.book} ${parsed.chapter}:${v}`;
      const one = await getSinaiticusVerseByReference(ref);
      if (one) verses.push(one);
    }
    if (verses.length) {
      const header = 'Codex Sinaiticus';
      const body = verses.map(v => `"${v.text}"\n- ${v.reference} (SINAITICUS)`).join('\n\n');
      const ansBody = `[${header}]\n${body}`;
      const related = getCrossReferences(parsed.normalized);
      const ans = related.length ? `${ansBody}\n\nRelated passages: ${related.join(', ')}.` : ansBody;
      const sinaiticusVerses = verses.map(v => ({ ref: v.reference, words: v.words || [] }));
      return { answer: applyNeutrality(ans), citations: verses.map(v => ({ ref: v.reference, translation: 'SINAITICUS' })), meta: { sinaiticus: true, sinaiticusVerses } };
    }
    // Fallback: not extant at requested verse in Sinaiticus; try LXX then preferred translations
    const lxx = [];
    for (let v = start; v <= end; v++) {
      const ref = `${parsed.book} ${parsed.chapter}:${v}`;
      const one = await getLxxVerseByReference(ref);
      if (one) lxx.push(one);
    }
    if (lxx.length) {
      const note = 'Note: requested verse is not extant in Codex Sinaiticus; showing Septuagint (LXX).';
      const body = lxx.map(v => `"${v.text}"\n- ${v.reference} (LXX)`).join('\n\n');
      const ansBody = `${note}\n\n${body}`;
      const related = getCrossReferences(parsed.normalized);
      const ans = related.length ? `${ansBody}\n\nRelated passages: ${related.join(', ')}.` : ansBody;
      const lxxVerses = lxx.map(v => ({ ref: v.reference, words: v.words || [] }));
      return { answer: applyNeutrality(ans), citations: lxx.map(v => ({ ref: v.reference, translation: 'LXX' })), meta: { lxx: true, lxxVerses, sinaiticusMissing: true } };
    }
    // Final fallback: preferred/KJV
    const prefArr = await fetchPreferredVerses(parsed, context.selectedTranslation);
    if (prefArr.length) {
      let ans = `Note: requested verse is not extant in Codex Sinaiticus; showing ${prefArr[0].translation}.`;
      ans += `\n\n${formatVersesBlock(prefArr)}`;
      const related = getCrossReferences(parsed.normalized);
      if (related.length) ans += `\n\nRelated passages: ${related.join(', ')}.`;
      return { answer: applyNeutrality(ans), citations: prefArr.map(v => ({ ref: v.reference, translation: v.translation })), meta: { sinaiticusMissing: true } };
    }
  }

  // Direct reference
  if (routed.type === 'reference' && parsed.valid && parsed.verse) {
    const arr = await fetchPreferredVerses(parsed, context.selectedTranslation);
    if (arr.length) {
      let ans = formatVersesBlock(arr);
      const related = getCrossReferences(parsed.normalized);
      if (related.length) ans += `\n\nRelated passages: ${related.join(', ')}.`;
      const hasApoc = arr.some(v => v.translation === 'APOC');
      return { answer: applyNeutrality(ans), citations: arr.map(v => ({ ref: v.reference, translation: v.translation })), meta: hasApoc ? { apoc: true } : undefined };
    }
  }

  // Enhanced handling for classified question types
  if (classification.category === 'scripture' && classification.subcategory === 'who') {
    // "Who is..." questions should prioritize dictionary definitions over verse search
    const personName = userMessage.replace(/^who\s+(?:is|was|were|are)\s+/i, '').replace(/\?/g, '').trim();

    // Try dictionary lookup first
    let defResult = await lookupDefinition(personName);
    if (!defResult && personName.length > 3) {
      // Try prefix search
      const prefixResults = await searchDefinitionsPrefix(personName);
      if (prefixResults && prefixResults.length > 0) defResult = prefixResults[0];
      // Fuzzy rescue for misspellings (e.g., Zipphorah -> Zipporah)
      if (!defResult) {
        const fuzzy = await searchDefinitionsFuzzy(personName, 3);
        if (fuzzy && fuzzy.length > 0) defResult = fuzzy[0];
        if (!defResult && fuzzy && fuzzy.length) {
          const suggestions = fuzzy.map(e => e.headword || e.def || '').filter(Boolean);
          if (suggestions.length) {
            const hint = `I couldn't find "${personName}", but did you mean: ${suggestions.join(', ')}?`;
            return { answer: applyNeutrality(hint), citations: [], meta: { classification, suggestions: suggestions.slice(0, 3) } };
          }
        }
      }
    }

    if (defResult) {
      const headword = defResult.headword || personName;
      let definition = defResult.def || defResult.definition || '';

      // Remove duplicate headword at start of definition if present
      const headwordPattern = new RegExp(`^${headword}\\s+${headword}\\s*[-—]?\\s*`, 'i');
      definition = definition.replace(headwordPattern, `${headword} — `);

      // Use summary unless user wants full details
      const useSummary = !wantsFullDefinition(userMessage);
      const displayText = useSummary ? summarizeDefinition(definition, headword) : definition;

      let ans = `📖 ${headword}\n\n${displayText}`;

      // Add hint about getting more details if showing summary
      if (useSummary && definition.length > 300) {
        ans += `\n\n💡 Want more details? Ask "Tell me more about ${headword}" for the complete entry.`;
      }

      // Add related verses only if they actually contain the person's name
      const hits = await searchLocalVerses(personName, { limit: 3, verseHistory: context.verseHistory, selectedTranslation: context.selectedTranslation });
      const relevantHits = hits.filter(v => v.text && v.text.toLowerCase().includes(personName.toLowerCase()));

      if (relevantHits && relevantHits.length > 0) {
        ans += `\n\n📜 Key passages mentioning ${personName}:\n`;
        relevantHits.slice(0, 3).forEach(v => {
          ans += `\n• "${v.text.slice(0, 100)}${v.text.length > 100 ? '...' : ''}"\n  — ${v.reference} (${v.translation})`;
        });
      }

      // Add personality enhancement with engagement invitation
      ans = enhanceWithPersonality(ans, classification, userMessage);

      // Add Paul-specific context if applicable
      ans = addPaulContext(ans, userMessage);

      // Don't apply neutrality to factual biographical information
      return {
        answer: ans,
        citations: relevantHits.map(v => ({ ref: v.reference, translation: v.translation })),
        meta: { classification, personLookup: true, headword },
        metadata: { classification, personLookup: true, headword }
      };
    }

    // Fallback to verse search but with better framing
    const hits = await searchLocalVerses(personName, { limit: 5, verseHistory: context.verseHistory, selectedTranslation: context.selectedTranslation });
    if (hits && hits.length > 0) {
      let ans = `📖 About ${personName}:\n\nI found these passages mentioning ${personName}:\n\n`;
      ans += hits.slice(0, 5).map(v => `"${v.text}"\n— ${v.reference} (${v.translation})`).join('\n\n');
      ans += `\n\nTip: Ask "show context for ${hits[0].reference}" for more details.`;
      // Don't apply neutrality to biographical verse searches
      return { answer: ans, citations: hits.map(v => ({ ref: v.reference, translation: v.translation })), meta: { classification } };
    }
  }

  // Enhanced handling for "What is..." definition questions
  if (classification.category === 'scripture' && classification.subcategory === 'what_definition') {
    const term = userMessage.replace(/^what\s+(?:is|was|are|were)\s+/i, '').replace(/\?/g, '').trim();

    // Try dictionary lookup first
    let defResult = await lookupDefinition(term);
    if (!defResult && term.length > 3) {
      const prefixResults = await searchDefinitionsPrefix(term);
      if (prefixResults && prefixResults.length > 0) defResult = prefixResults[0];
      // Fuzzy rescue for misspellings
      if (!defResult) {
        const fuzzy = await searchDefinitionsFuzzy(term, 3);
        if (fuzzy && fuzzy.length > 0) defResult = fuzzy[0];
        if (!defResult && fuzzy && fuzzy.length) {
          const suggestions = fuzzy.map(e => e.headword || e.def || '').filter(Boolean);
          if (suggestions.length) {
            const hint = `I couldn't find "${term}", but did you mean: ${suggestions.join(', ')}?`;
            return { answer: applyNeutrality(hint), citations: [], meta: { classification, suggestions: suggestions.slice(0, 3) } };
          }
        }
      }
    }

    if (defResult) {
      const headword = defResult.headword || term;
      let definition = defResult.def || defResult.definition || '';

      // Use summary unless user wants full details
      const useSummary = !wantsFullDefinition(userMessage);
      const displayText = useSummary ? summarizeDefinition(definition, headword) : definition;

      let ans = `📖 ${headword}`;
      if (defResult.pos) ans += ` (${defResult.pos})`;
      ans += `\n\n${displayText}`;

      // Add hint about getting more details if showing summary
      if (useSummary && definition.length > 300) {
        ans += `\n\n💡 Want more details? Ask "Tell me more about ${headword}" for the complete entry.`;
      }

      // Add related verses only if they actually contain the term
      const hits = await searchLocalVerses(term, { limit: 3, verseHistory: context.verseHistory, selectedTranslation: context.selectedTranslation });
      const relevantHits = hits.filter(v => v.text && v.text.toLowerCase().includes(term.toLowerCase()));

      if (relevantHits && relevantHits.length > 0) {
        ans += `\n\n📜 Biblical usage:\n`;
        relevantHits.slice(0, 3).forEach(v => {
          ans += `\n• "${v.text.slice(0, 100)}${v.text.length > 100 ? '...' : ''}"\n  — ${v.reference} (${v.translation})`;
        });
      }

      // Add personality enhancement with engagement invitation
      ans = enhanceWithPersonality(ans, classification, userMessage);

      // Don't apply neutrality to factual definitions
      return {
        answer: ans,
        citations: relevantHits.map(v => ({ ref: v.reference, translation: v.translation })),
        meta: { classification, definitionLookup: true, headword },
        metadata: { classification, definitionLookup: true, headword }
      };
    }
  }

  // Retrieval + synthesis fallback
  const hits = await searchLocalVerses(query, { verseHistory: context.verseHistory, selectedTranslation: context.selectedTranslation });
  let { answer, citations } = synthesizeNeutral({ query, hits });

  if (routed.type === 'theology') {
    // Lightly elevate the register for theological/philosophical prompts
    if (answer.includes('How to read these neutrally:')) {
      answer = answer.replace('How to read these neutrally:', 'Hermeneutical advisories:');
    } else {
      answer += '\n\nHermeneutical advisories:';
    }
    answer += '\nâ€¢ Situate the pericope within its literary horizon.';
    answer += '\nâ€¢ Compare renderings across traditions (translation families).';
    answer += '\nâ€¢ Correlate with canonical cross-references (Scripture interpreting Scripture).';

    // Append one advanced term definition if available
    const terms = (userMessage || '').split(/[^A-Za-z]+/).filter(w => w && w.length > 6);
    for (const t of terms.slice(0, 3)) {
      // eslint-disable-next-line no-await-in-loop
      const def = await lookupDefinition(t);
      if (def) {
        const head = def.headword || t;
        const pos = def.pos ? ` (${def.pos})` : '';
        const gloss = def.def || def.definition || '';
        answer += `\n\nTerminology â€” ${head}${pos}: ${gloss}`;
        break;
      }
    }
  }
  const primaryRef = hits[0]?.reference || (parseReference(query).normalized);
  if (primaryRef) {
    const related = getCrossReferences(primaryRef);
    if (related.length) answer += `\n\nRelated passages: ${related.join(', ')}.`;
  }
  return { answer: applyNeutrality(answer), citations };
}

export default { answerQuery };
