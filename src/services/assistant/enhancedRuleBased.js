/**
 * Enhanced Rule-Based SHARP Assistant
 * Provides comprehensive biblical question answering without external AI APIs
 * Uses RAG (Retrieval-Augmented Generation) with rule-based response templates
 */

import { analyzeQuestion } from './questionAnalyzer';
import { classifyQuestion } from './questionClassifier';
import { orchestrateRetrieval } from './ragOrchestrator';
import { lookupDefinition } from './dictionaryProvider';
import { getUsageExamples, getFrequency, getBookDistribution } from './retrieval/lexiconProvider';
import { formatMorphology } from './retrieval/morphologyProvider';
import { compareTranslations, parseReference } from './retrieval/translationProvider';
import { getInterlinearByReference, formatInterlinear } from './interlinearProvider';
import { getBookContext, formatBookContext, getPassageSection, getBooksByAuthor } from './retrieval/historicalContextProvider';
import { searchCrossRefsByTopic, getGospelParallels, getSynopticParallels } from './retrieval/crossRefsProvider';
import { isApocryphaBook } from './retrieval/apocryphaProvider';
import { getOTQuotesForNT, getNTQuotesOfOT } from '../data/ntUsesOT';
import { searchTopicalChains, formatTopicalChain, findChainsWithReference } from '../data/topicalChains';
import { createCitation, enforceCitationDiscipline } from './citationEnforcer';

/**
 * Main entry point for answering queries
 * @param {string} userMessage - User's question
 * @param {Object} context - Context including conversation history, preferences, etc.
 * @returns {Promise<Object>} Response with answer and citations
 */
export async function answerQuery(userMessage, context = {}) {
  // Step 1: Analyze and classify the question
  const analysis = analyzeQuestion(userMessage);
  const classification = classifyQuestion(userMessage);

  console.log('Question analysis:', analysis);
  console.log('Question classification:', classification);

  // Handle questions that need clarification
  if (classification.needsClarification || !analysis.canAnswer) {
    return {
      answer: classification.suggestion || "I'd be happy to help! Could you rephrase your question or provide more details?",
      citations: [],
      metadata: { needsClarification: true, classification }
    };
  }

  // Step 2: Check for follow-up questions
  const isFollowUp = detectFollowUp(userMessage, context.conversationHistory);
  if (isFollowUp) {
    return await handleFollowUp(userMessage, context);
  }

  // Step 3: Retrieve relevant references using RAG
  const retrievedContext = await orchestrateRetrieval(userMessage, classification, context);

  console.log('Retrieved context:', {
    verses: retrievedContext.verses?.length || 0,
    definitions: retrievedContext.definitions?.length || 0,
    lexicon: retrievedContext.lexicon?.length || 0,
    crossRefs: retrievedContext.crossRefs?.length || 0
  });

  // Step 4: Generate response based on question type and retrieved context
  const response = await generateResponse(
    userMessage,
    classification,
    retrievedContext,
    context
  );

  // Step 5: Enforce citation discipline
  const enforcedResponse = enforceCitationDiscipline(response, {
    validateCitationsEnabled: true,
    appendCitationsSection: false, // Don't append to avoid duplication with UI display
    showRationale: false,
    throwOnValidationFailure: false // Log warnings but don't fail
  });

  // Log citation validation for monitoring
  if (enforcedResponse.citationValidation) {
    const { valid, issues, warnings, stats } = enforcedResponse.citationValidation;
    if (!valid || warnings.length > 0) {
      console.warn('[Citation Discipline]', {
        valid,
        issues,
        warnings,
        stats,
        query: userMessage.substring(0, 50)
      });
    }
  }

  return enforcedResponse;
}

/**
 * Detect if this is a follow-up question
 */
function detectFollowUp(message, history) {
  if (!history || history.length === 0) return false;

  const followUpIndicators = [
    /^(tell me more|more|continue|explain|elaborate|what about|how about)/i,
    /^(and|also|additionally|furthermore)/i,
    /\b(that|this|it|they|them)\b/i
  ];

  return followUpIndicators.some(pattern => pattern.test(message));
}

/**
 * Handle follow-up questions by referencing conversation history
 */
async function handleFollowUp(message, context) {
  const lastExchange = context.conversationHistory?.slice(-2);

  if (!lastExchange || lastExchange.length < 2) {
    return {
      answer: "I'd be happy to elaborate! Could you specify what you'd like to know more about?",
      citations: []
    };
  }

  const previousTopic = extractTopic(lastExchange[0].content);

  return {
    answer: `Regarding ${previousTopic}, here's more information:\n\n${await getExpandedInfo(previousTopic, context)}`,
    citations: []
  };
}

function extractTopic(text) {
  // Extract key nouns/topics from previous question
  const cleaned = text.replace(/\b(who|what|when|where|why|how|is|are|was|were|the|a|an)\b/gi, '');
  const words = cleaned.split(/\s+/).filter(w => w.length > 3);
  return words[0] || 'that topic';
}

async function getExpandedInfo(topic, context) {
  // Provide expanded information on the topic
  return `Let me provide more context about ${topic}. You can explore this further using the Bible Reader, courses, and reference materials in Sword Drill.`;
}

/**
 * Generate response based on question type and retrieved context
 */
async function generateResponse(message, classification, retrievedContext, context) {
  const { category, subcategory } = classification;

  // Route to appropriate response generator
  if (subcategory === 'who') {
    return await generateWhoResponse(message, retrievedContext, context);
  }

  if (subcategory === 'what_definition' || subcategory === 'define') {
    return await generateDefinitionResponse(message, retrievedContext, context);
  }

  if (subcategory === 'language' || message.match(/greek|hebrew|original|word/i)) {
    // Check if interlinear display is requested
    if (message.match(/interlinear|word[- ]by[- ]word|original.*text/i)) {
      return await generateInterlinearResponse(message, retrievedContext, context);
    }
    return await generateLanguageResponse(message, retrievedContext, context);
  }

  if (subcategory === 'compare_translations') {
    return await generateCompareTranslationsResponse(message, retrievedContext, context);
  }

  if (subcategory === 'cross_reference') {
    return await generateCrossReferenceResponse(message, retrievedContext, context);
  }

  if (category === 'theology') {
    return await generateTheologyResponse(message, retrievedContext, context);
  }

  if (subcategory === 'where') {
    return await generateWhereResponse(message, retrievedContext, context);
  }

  if (subcategory === 'when') {
    return await generateWhenResponse(message, retrievedContext, context);
  }

  if (subcategory === 'why') {
    return await generateWhyResponse(message, retrievedContext, context);
  }

  if (subcategory === 'how') {
    return await generateHowResponse(message, retrievedContext, context);
  }

  // Check if message contains a verse reference pattern (e.g., "John 3:16")
  if (message.match(/\b([1-3]?\s?[A-Za-z]+)\s+\d+:\d+/)) {
    return await generateVerseResponse(message, retrievedContext, context);
  }

  // Default: general biblical question
  return await generateGeneralResponse(message, retrievedContext, context);
}

/**
 * Generate response for "Who" questions
 */
async function generateWhoResponse(message, retrieved, context) {
  const citations = [];
  let answer = '';

  // Extract the person's name from the question
  const personMatch = message.match(/who\s+(?:is|was|wrote|authored)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  const person = personMatch ? personMatch[1] : null;

  // Check if asking about authorship (e.g., "Who wrote Romans?")
  const authorshipMatch = message.match(/who\s+(?:wrote|authored|penned)\s+([1-3]?\s?[A-Za-z]+)/i);
  if (authorshipMatch) {
    const bookName = authorshipMatch[1].trim();
    const bookContext = getBookContext(bookName);

    if (bookContext) {
      answer += `## ✍️ ${bookName} - Authorship\n\n`;
      answer += `**Author**: ${bookContext.author}\n`;
      answer += `**Date Written**: ${bookContext.date}\n`;
      answer += `**Original Audience**: ${bookContext.audience}\n\n`;
      answer += `**Purpose**: ${bookContext.purpose}\n\n`;

      // Get other books by same author
      const otherBooks = getBooksByAuthor(bookContext.author)
        .filter(b => b.book !== bookName)
        .map(b => b.book);

      if (otherBooks.length > 0) {
        answer += `**Other Works by ${bookContext.author}**: ${otherBooks.join(', ')}\n\n`;
      }

      citations.push({ type: 'book_context', book: bookName, author: bookContext.author });

      return { answer, citations, metadata: { category: 'who', person: bookContext.author, book: bookName } };
    }
  }

  if (person && retrieved.definitions && retrieved.definitions.length > 0) {
    const def = retrieved.definitions[0];

    // Synthesize a concise summary from the definition
    const summary = summarizeDefinition(def.definition, 2); // 2 sentences

    answer += `**${def.headword}**\n\n`;
    answer += `${summary}\n\n`;
    citations.push({ type: 'dictionary', source: def.source, entry: def.headword });
  }

  // ALWAYS show Key Passages section
  answer += `## 📖 Key Passages\n\n`;

  if (retrieved.verses && retrieved.verses.length > 0) {
    // Show top 3-5 most relevant verses mentioning this person/entity
    retrieved.verses.slice(0, 5).forEach(verse => {
      const snippet = truncateText(verse.text, 100);
      answer += `**${verse.reference}**: ${snippet}\n\n`;
      citations.push({ type: 'verse', ref: verse.reference, book: verse.book, chapter: verse.chapter, verse: verse.verse });
    });
  } else if (person) {
    // If no verses found in limited pool, provide book reference and search tip
    answer += `For comprehensive study of ${person}, explore the Book of ${person} in Bible Reader.\n\n`;
    answer += `💡 Use Bible Reader's search feature to find all mentions of "${person}" throughout Scripture.\n\n`;
  }

  if (!answer) {
    answer = `I'd be happy to help you learn about ${person || 'this biblical figure'}! `;
    answer += `You can explore more using the Bible Reader and Smith's Bible Dictionary in Sword Drill.`;
  } else {
    answer += `💡 **Dig Deeper**: Use Bible Reader for full passages and related courses for comprehensive study.`;
  }

  return { answer, citations, metadata: { category: 'who', person } };
}

/**
 * Generate response for definition questions
 */
async function generateDefinitionResponse(message, retrieved, context) {
  const citations = [];
  let answer = '';

  // Extract term being defined
  const termMatch = message.match(/(?:what\s+is|define|meaning\s+of)\s+([a-z]+(?:\s+[a-z]+)?)/i);
  const term = termMatch ? termMatch[1] : null;

  if (retrieved.definitions && retrieved.definitions.length > 0) {
    const def = retrieved.definitions[0]; // Use primary definition
    const summary = summarizeDefinition(def.definition, 2);

    answer += `**${def.headword}**`;
    if (def.pos) answer += ` *(${def.pos})*`;
    answer += `\n\n${summary}\n\n`;
    citations.push({ type: 'dictionary', source: def.source, entry: def.headword });
  }

  if (retrieved.lexicon && retrieved.lexicon.length > 0) {
    const lex = retrieved.lexicon[0]; // Use primary lexicon entry
    answer += `## 🔤 Original Language\n\n`;

    if (lex.word && lex.transliteration) {
      answer += `${lex.language}: **${lex.word}** (${lex.transliteration})`;
      if (lex.strongs) {
        answer += ` - Strong's ${lex.strongs}`;
        citations.push({ type: 'lexicon', strongsNumber: lex.strongs });
      }
      answer += `\n\n`;
    }
    if (lex.definition) {
      const lexSummary = summarizeDefinition(lex.definition, 1);
      answer += `${lexSummary}\n\n`;
    }
  }

  // ALWAYS show verses for biblical terms/concepts
  if (retrieved.verses && retrieved.verses.length > 0) {
    answer += `## 📖 Biblical Usage\n\n`;
    // Show 3-4 verses where this term/concept appears
    retrieved.verses.slice(0, 4).forEach(verse => {
      const snippet = truncateText(verse.text, 100);
      answer += `**${verse.reference}**: ${snippet}\n\n`;
      citations.push({ type: 'verse', ref: verse.reference });
    });
  } else if (term) {
    // If no verses found, provide helpful message
    answer += `## 📖 Biblical Usage\n\n`;
    answer += `Search for "${term}" in Bible Reader to find examples in Scripture.\n\n`;
  }

  if (!answer) {
    answer = `**${term || 'This term'}**\n\nLet me help you understand this concept. `;
    answer += `You can find detailed definitions in Smith's Bible Dictionary and Webster's 1913 Dictionary.`;
  } else {
    answer += `💡 **Explore**: Use the dictionary and lexicon tools for complete definitions and word studies.`;
  }

  return { answer, citations, metadata: { category: 'definition', term } };
}

/**
 * Generate response for language questions (Greek/Hebrew)
 */
async function generateLanguageResponse(message, retrieved, context) {
  const citations = [];
  let answer = '';

  if (retrieved.lexicon && retrieved.lexicon.length > 0) {
    const lex = retrieved.lexicon[0]; // Use primary entry

    answer += `## 🔤 ${lex.language || 'Original'} Word Study\n\n`;

    // Word heading with transliteration and Strong's number
    if (lex.word && lex.transliteration) {
      answer += `**${lex.word}** (${lex.transliteration})`;
      if (lex.pronunciation) {
        answer += ` [${lex.pronunciation}]`;
      }
      if (lex.strongs) {
        answer += ` — Strong's ${lex.strongs}`;
        citations.push({ type: 'lexicon', strongsNumber: lex.strongs });
      }
      answer += `\n\n`;
    }

    // Full definition from Strong's
    if (lex.definition) {
      answer += `**Definition**: ${lex.definition}\n\n`;
    }

    // KJV usage examples
    if (lex.kjvUsage) {
      answer += `**KJV Translation**: ${lex.kjvUsage}\n\n`;
    }

    // Derivation/etymology
    if (lex.derivation) {
      answer += `**Etymology**: ${lex.derivation}\n\n`;
    }

    // Get frequency and distribution data
    if (lex.strongs) {
      try {
        const frequency = await getFrequency(lex.strongs);
        if (frequency > 0) {
          answer += `**Frequency**: ${frequency} occurrence${frequency !== 1 ? 's' : ''} in Scripture\n\n`;

          // Get book distribution
          const books = await getBookDistribution(lex.strongs);
          if (books && books.length > 0) {
            answer += `**Books**: Found in ${books.length} book${books.length !== 1 ? 's' : ''}`;
            if (books.length <= 5) {
              answer += ` (${books.join(', ')})`;
            }
            answer += `\n\n`;
          }
        }
      } catch (error) {
        console.error('Error fetching frequency data:', error);
      }
    }

    // Morphological analysis if available
    if (retrieved.morphology && retrieved.morphology.analysis) {
      answer += `## 📝 Grammatical Analysis\n\n`;
      answer += formatMorphology(retrieved.morphology);
      answer += `\n\n`;
    }

    // Get usage examples from concordance
    if (lex.strongs) {
      try {
        const examples = await getUsageExamples(lex.strongs, 6);
        if (examples && examples.length > 0) {
          answer += `## 📖 Usage Examples\n\n`;
          examples.slice(0, 6).forEach(ex => {
            answer += `• **${ex.reference}**\n`;
            citations.push({ type: 'concordance', ref: ex.reference });
          });
          answer += `\n`;
        }
      } catch (error) {
        console.error('Error fetching usage examples:', error);
      }
    }
  } else if (retrieved.verses && retrieved.verses.length > 0) {
    // Fallback: show verses if no lexicon entry found
    answer += `## 📖 Biblical References\n\n`;
    retrieved.verses.slice(0, 3).forEach(verse => {
      const snippet = truncateText(verse.text, 80);
      answer += `**${verse.reference}**: ${snippet}\n\n`;
      citations.push({ type: 'verse', ref: verse.reference });
    });
  }

  if (!answer) {
    answer = `## 🔤 Original Languages\n\nExplore Koine Greek and Ancient Hebrew courses for in-depth language study with Strong's Concordance integration.`;
  } else {
    answer += `\n💡 **Learn More**: Explore Greek and Hebrew courses for comprehensive language learning.`;
  }

  return { answer, citations, metadata: { category: 'language' } };
}

/**
 * Generate response for theology questions
 */
async function generateTheologyResponse(message, retrieved, context) {
  const citations = [];
  let answer = '';

  // Extract topic keywords to search for relevant topical chains
  const topicKeywords = message.toLowerCase()
    .replace(/\b(what|is|the|about|biblical|view|on|of|tell|me|does|bible|say)\b/gi, '')
    .trim()
    .split(/\s+/)
    .filter(w => w.length > 3);

  // Search for relevant topical chains
  let relevantChain = null;
  for (const keyword of topicKeywords) {
    const chains = searchTopicalChains(keyword);
    if (chains.length > 0) {
      relevantChain = chains[0]; // Use first match
      break;
    }
  }

  // Create concise theological summary
  if (retrieved.definitions && retrieved.definitions.length > 0) {
    const def = retrieved.definitions[0];
    const summary = summarizeDefinition(def.definition, 2);

    answer += `## ✝️ ${def.headword}\n\n`;
    answer += `${summary}\n\n`;
    citations.push({ type: 'dictionary', source: def.source, entry: def.headword });
  }

  // Show topical chain if found (before verses section)
  if (relevantChain) {
    const chainFormatted = formatTopicalChain(relevantChain.topicId);
    if (chainFormatted) {
      answer += chainFormatted;
      answer += `\n`;
      citations.push({ type: 'topical_chain', topicId: relevantChain.topicId, title: relevantChain.title });
    }
  }

  // Show top 3 foundational verses concisely
  if (retrieved.verses && retrieved.verses.length > 0) {
    answer += `## 📖 Key Scriptures\n\n`;

    retrieved.verses.slice(0, 3).forEach(verse => {
      const snippet = truncateText(verse.text, 90);
      answer += `**${verse.reference}**: ${snippet}\n\n`;
      citations.push({ type: 'verse', ref: verse.reference });
    });
  }

  // Related passages as brief list
  if (retrieved.crossRefs && retrieved.crossRefs.length > 0) {
    const refs = retrieved.crossRefs.slice(0, 3).map(r => r.reference).join(', ');
    answer += `**Related**: ${refs}\n\n`;
    retrieved.crossRefs.slice(0, 3).forEach(ref => {
      citations.push({ type: 'verse', ref: ref.reference });
    });
  }

  if (!answer) {
    answer = `## ✝️ Theological Perspective\n\nThis question touches on important theological themes. `;
  }

  answer += `\n📚 **Note**: Christians hold varying views on some theological matters. I encourage studying Scripture, consulting church leaders, and seeking wisdom through prayer.\n\n`;
  answer += `💡 Explore Apologetics and Hermeneutics courses for deeper understanding.`;

  return { answer, citations, metadata: { category: 'theology', topicalChain: relevantChain?.topicId } };
}

/**
 * Generate response for "Where" questions
 */
async function generateWhereResponse(message, retrieved, context) {
  const citations = [];
  let answer = '';

  // Extract the place name from the question
  const placeMatch = message.match(/where\s+(?:is|was)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  const place = placeMatch ? placeMatch[1] : null;

  if (retrieved.definitions && retrieved.definitions.length > 0) {
    const def = retrieved.definitions[0];
    const summary = summarizeDefinition(def.definition, 2);

    answer += `## 📍 ${def.headword}\n\n`;
    answer += `${summary}\n\n`;
    citations.push({ type: 'dictionary', source: def.source, entry: def.headword });
  }

  // ALWAYS show verses for "where" questions about places
  if (retrieved.verses && retrieved.verses.length > 0) {
    answer += `## 📖 Biblical Mentions\n\n`;
    retrieved.verses.slice(0, 5).forEach(verse => {
      const snippet = truncateText(verse.text, 100);
      answer += `**${verse.reference}**: ${snippet}\n\n`;
      citations.push({ type: 'verse', ref: verse.reference });
    });
  } else if (place) {
    // If no verses found, provide helpful message
    answer += `## 📖 Biblical Mentions\n\n`;
    answer += `Search for "${place}" in Bible Reader to find all references in Scripture.\n\n`;
  }

  if (!answer) {
    answer = `## 📍 Biblical Geography\n\n`;
  }

  answer += `🗺️ **Explore**: Biblical Archaeology course covers historical places and geographical context.`;

  return { answer, citations, metadata: { category: 'where', place } };
}

/**
 * Generate response for "When" questions
 */
async function generateWhenResponse(message, retrieved, context) {
  const citations = [];
  let answer = '';

  if (retrieved.definitions && retrieved.definitions.length > 0) {
    const summary = summarizeDefinition(retrieved.definitions[0].definition, 2);
    answer += `## 📅 ${retrieved.definitions[0].headword}\n\n${summary}\n\n`;
    citations.push({ type: 'dictionary', source: retrieved.definitions[0].source, entry: retrieved.definitions[0].headword });
  }

  if (retrieved.verses && retrieved.verses.length > 0) {
    answer += `## 📖 Biblical Context\n\n`;
    retrieved.verses.slice(0, 2).forEach(verse => {
      const snippet = truncateText(verse.text, 80);
      answer += `**${verse.reference}**: ${snippet}\n\n`;
      citations.push({ type: 'verse', ref: verse.reference });
    });
  }

  if (!answer) answer = `## 📅 Timeline\n\n`;
  answer += `📜 **Learn More**: Church History and Biblical Canon courses provide historical timeline context.`;

  return { answer, citations, metadata: { category: 'when' } };
}

/**
 * Generate response for "Why" questions
 */
async function generateWhyResponse(message, retrieved, context) {
  const citations = [];
  let answer = `## 💡 Biblical Insight\n\n`;

  if (retrieved.verses && retrieved.verses.length > 0) {
    answer += `Scripture addresses this:\n\n`;
    retrieved.verses.slice(0, 3).forEach(verse => {
      const snippet = truncateText(verse.text, 90);
      answer += `**${verse.reference}**: ${snippet}\n\n`;
      citations.push({ type: 'verse', ref: verse.reference });
    });
  }

  if (retrieved.definitions && retrieved.definitions.length > 0) {
    const summary = summarizeDefinition(retrieved.definitions[0].definition, 1);
    answer += `**Context**: ${summary}\n\n`;
    citations.push({ type: 'dictionary', source: retrieved.definitions[0].source, entry: retrieved.definitions[0].headword });
  }

  answer += `✝️ **Explore**: Apologetics and Hermeneutics courses address many "why" questions in depth.`;

  return { answer, citations, metadata: { category: 'why' } };
}

/**
 * Generate response for "How" questions
 */
async function generateHowResponse(message, retrieved, context) {
  const citations = [];
  let answer = `## 🔍 Biblical Guidance\n\n`;

  if (retrieved.verses && retrieved.verses.length > 0) {
    answer += `Scripture teaches:\n\n`;
    retrieved.verses.slice(0, 3).forEach(verse => {
      const snippet = truncateText(verse.text, 90);
      answer += `**${verse.reference}**: ${snippet}\n\n`;
      citations.push({ type: 'verse', ref: verse.reference });
    });
  }

  answer += `📖 **Apply**: Use Bible Reader and study plans to apply biblical principles practically.`;

  return { answer, citations, metadata: { category: 'how' } };
}

/**
 * Generate response for verse reference questions
 */
async function generateVerseResponse(message, retrieved, context) {
  const citations = [];
  let answer = '';

  if (retrieved.verses && retrieved.verses.length > 0) {
    const verse = retrieved.verses[0];
    const isApocrypha = isApocryphaBook(verse.book);

    // Label apocrypha clearly
    if (isApocrypha) {
      answer += `## 📖 ${verse.reference} (${verse.translation || 'KJV'}) ⚠️ Deuterocanonical/Apocrypha\n\n`;
      answer += `> ${verse.text}\n\n`;
      answer += `**Note**: This passage is from the Deuterocanonical books (Apocrypha), included in Catholic and Orthodox canons but not in Protestant Bibles.\n\n`;
    } else {
      answer += `## 📖 ${verse.reference} (${verse.translation || 'KJV'})\n\n`;
      answer += `> ${verse.text}\n\n`;
    }

    citations.push(createCitation({
      type: 'verse',
      ref: verse.reference,
      book: verse.book,
      chapter: verse.chapter,
      verse: verse.verse,
      isApocrypha,
      rationale: isApocrypha
        ? `Deuterocanonical text from ${verse.book}`
        : `Primary biblical text citation`
    }));

    // Add book context and section information (only for canonical books)
    if (!isApocrypha) {
      const bookContext = getBookContext(verse.book);
      if (bookContext) {
        const section = getPassageSection(verse.book, verse.chapter);
        if (section) {
          answer += `\n**Context**: This verse is in the "${section.section}" section (${section.verses})\n`;
          answer += `${section.description}\n\n`;
          citations.push(createCitation({
            type: 'book_section',
            book: verse.book,
            section: section.section,
            rationale: `Structural outline showing ${verse.reference} falls within ${section.section}`
          }));
        }
      }
    }

    // Check for OT quotations/allusions (NT passages only)
    const otQuotes = getOTQuotesForNT(verse.reference);
    if (otQuotes && otQuotes.length > 0) {
      answer += `**OT Echoes** (${otQuotes[0].type}):\n`;
      otQuotes.slice(0, 3).forEach(q => {
        answer += `• **${q.ot}** - ${q.context}\n`;
        citations.push(createCitation({
          type: 'ot_quote',
          ntRef: q.nt,
          otRef: q.ot,
          quoteType: q.type,
          rationale: `${q.nt} ${q.type === 'quote' ? 'directly quotes' : 'alludes to'} ${q.ot}: "${q.context}"`
        }));
      });
      answer += `\n`;
    }

    // Check for Gospel parallels (synoptic accounts)
    const parallels = getGospelParallels(verse.reference);
    if (parallels && parallels.length > 0) {
      answer += `**Gospel Parallels**:\n`;
      parallels.forEach(p => {
        answer += `• **${p.gospel}**: ${p.reference}`;
        if (p.notes) answer += ` (${p.notes})`;
        answer += `\n`;
        citations.push(createCitation({
          type: 'gospel_parallel',
          ref: p.reference,
          event: p.event,
          rationale: `Parallel account of "${p.event}" in ${p.gospel}`
        }));
      });
      answer += `\n`;
    }

    // Check if verse is part of any topical chains
    const topicalChains = findChainsWithReference(verse.reference);
    if (topicalChains && topicalChains.length > 0) {
      answer += `**Appears in Teaching Chains**:\n`;
      topicalChains.slice(0, 2).forEach(chain => {
        answer += `• **${chain.title}** (#${chain.position}/${chain.totalVerses}): ${chain.connector}\n`;
        citations.push(createCitation({
          type: 'topical_chain',
          topicId: chain.topicId,
          title: chain.title,
          position: chain.position,
          rationale: `Part of "${chain.title}" teaching sequence (step ${chain.position} of ${chain.totalVerses})`
        }));
      });
      answer += `\n`;
    }

    // Show related passages concisely
    if (retrieved.crossRefs && retrieved.crossRefs.length > 0) {
      const relatedRefs = retrieved.crossRefs.slice(0, 4).map(r => r.reference).join(', ');
      answer += `**Related**: ${relatedRefs}\n\n`;
      retrieved.crossRefs.slice(0, 4).forEach(ref => {
        citations.push(createCitation({
          type: 'verse',
          ref: ref.reference,
          rationale: 'Thematically related passage'
        }));
      });
    }

    answer += `💡 **Study**: Use Strong's Concordance for word study, read context in Bible Reader, explore Hermeneutics for interpretation.`;
  }

  return { answer, citations, metadata: { category: 'verse', book: retrieved.verses[0]?.book } };
}

/**
 * Generate general biblical response
 */
async function generateGeneralResponse(message, retrieved, context) {
  const citations = [];
  let answer = '';

  if (retrieved.verses && retrieved.verses.length > 0) {
    answer += `## 📖 Scripture\n\n`;
    // Show 3 verses, concisely
    retrieved.verses.slice(0, 3).forEach(verse => {
      const snippet = truncateText(verse.text, 90);
      answer += `**${verse.reference}**: ${snippet}\n\n`;
      citations.push({ type: 'verse', ref: verse.reference });
    });
  }

  if (retrieved.definitions && retrieved.definitions.length > 0) {
    answer += `## 📚 Context\n\n`;
    // Show 1-2 definitions, summarized
    retrieved.definitions.slice(0, 2).forEach(def => {
      const summary = summarizeDefinition(def.definition, 1);
      answer += `**${def.headword}**: ${summary}\n\n`;
      citations.push({ type: 'dictionary', source: def.source, entry: def.headword });
    });
  }

  if (!retrieved.verses?.length && !retrieved.definitions?.length) {
    answer = `I'd be happy to help with your biblical question!\n\n`;
    answer += `**I can assist with**:\n`;
    answer += `📖 Verses & passages • 🎓 Theology & doctrine • 🔤 Greek/Hebrew words • 📍 Biblical places & people\n\n`;
    answer += `**Try asking**:\n`;
    answer += `"Who is Paul?" • "What is grace?" • "What does agape mean?" • "Explain John 3:16"`;
  } else {
    answer += `🔍 **Explore**: Bible Reader, courses, and reference tools for comprehensive study.`;
  }

  return { answer, citations, metadata: { category: 'general' } };
}

/**
 * Helper: Summarize long definitions to N sentences
 */
function summarizeDefinition(text, maxSentences = 2) {
  if (!text) return '';

  // Split into sentences (basic sentence detection)
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  // Take first N sentences
  const summary = sentences.slice(0, maxSentences).join(' ').trim();

  // If we truncated, add ellipsis
  if (sentences.length > maxSentences) {
    return summary.replace(/[.!?]+$/, '') + '...';
  }

  return summary;
}

/**
 * Helper: Truncate text to maxLength characters at word boundary
 */
function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;

  // Find last space before maxLength
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

/**
 * Generate response for translation comparison questions
 */
async function generateCompareTranslationsResponse(message, retrieved, context) {
  const citations = [];
  let answer = '';

  // Extract verse reference from the question
  const refMatch = message.match(/\b([1-3]?\s?[A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?/);
  let reference = null;

  if (refMatch) {
    const [, book, chapter, verseStart, verseEnd] = refMatch;
    reference = `${book.trim()} ${chapter}:${verseStart}`;
    if (verseEnd) {
      reference += `-${verseEnd}`;
    }
  } else if (retrieved.verses && retrieved.verses.length > 0) {
    // Try to use first verse from retrieval
    reference = retrieved.verses[0].reference;
  }

  if (!reference) {
    return {
      answer: "Please specify a verse reference to compare translations (e.g., 'Compare John 3:16 in different translations').",
      citations: [],
      metadata: { category: 'compare_translations', needsClarification: true }
    };
  }

  // Get verse in all available translations
  const comparison = await compareTranslations(reference);

  if (!comparison || comparison.translations.length === 0) {
    return {
      answer: `I couldn't find ${reference} in the available translations. Please check the reference and try again.`,
      citations: [],
      metadata: { category: 'compare_translations', reference }
    };
  }

  // Build response
  answer += `## 📖 ${reference} - Translation Comparison\n\n`;
  answer += `Comparing ${comparison.availableCount} translation${comparison.availableCount !== 1 ? 's' : ''}:\n\n`;

  // Group translations by philosophy
  const literal = [];
  const dynamic = [];

  comparison.translations.forEach(verse => {
    const transCode = verse.translation;

    if (['KJV', 'ASV', 'WEB', 'YLT', 'ESV'].includes(transCode)) {
      literal.push(verse);
    } else {
      dynamic.push(verse);
    }
  });

  // Display literal translations first
  if (literal.length > 0) {
    answer += `### Literal Translations\n\n`;
    literal.forEach(verse => {
      answer += `**${verse.translation}**: "${verse.text}"\n\n`;
      citations.push({ type: 'verse', ref: verse.reference, translation: verse.translation });
    });
  }

  // Then dynamic equivalence
  if (dynamic.length > 0) {
    answer += `### Dynamic Equivalence / Thought-for-Thought\n\n`;
    dynamic.forEach(verse => {
      answer += `**${verse.translation}**: "${verse.text}"\n\n`;
      citations.push({ type: 'verse', ref: verse.reference, translation: verse.translation });
    });
  }

  // Add translation philosophy note
  answer += `---\n\n`;
  answer += `**Translation Philosophies**:\n`;
  answer += `• **Literal** (KJV, ASV, WEB, YLT, ESV): Word-for-word translation preserving original structure\n`;
  answer += `• **Dynamic Equivalence** (NIV, NLT): Thought-for-thought translation prioritizing readability\n\n`;
  answer += `💡 Different translations help reveal nuances in the original Greek and Hebrew texts.`;

  return { answer, citations, metadata: { category: 'compare_translations', reference } };
}

/**
 * Generate response for interlinear display questions
 */
async function generateInterlinearResponse(message, retrieved, context) {
  const citations = [];
  let answer = '';

  // Extract verse reference from the question
  const refMatch = message.match(/\b([1-3]?\s?[A-Za-z]+)\s+(\d+):(\d+)/);
  let reference = null;

  if (refMatch) {
    const [, book, chapter, verse] = refMatch;
    reference = `${book.trim()} ${chapter}:${verse}`;
  } else if (retrieved.verses && retrieved.verses.length > 0) {
    // Try to use first verse from retrieval
    reference = retrieved.verses[0].reference;
  }

  if (!reference) {
    return {
      answer: "Please specify a verse reference for interlinear display (e.g., 'Show me John 3:16 interlinear').",
      citations: [],
      metadata: { category: 'interlinear', needsClarification: true }
    };
  }

  // Get interlinear data
  const interlinear = await getInterlinearByReference(reference);

  if (!interlinear) {
    return {
      answer: `Interlinear data for ${reference} is not currently available. Interlinear text is available for most books of the Bible.`,
      citations: [],
      metadata: { category: 'interlinear', reference }
    };
  }

  // Build response using formatted interlinear
  answer = formatInterlinear(interlinear);

  // Add helpful context
  answer += `\n\n---\n\n`;
  answer += `**Legend**:\n`;
  answer += `• **Top row**: Original ${interlinear.language} text\n`;
  answer += `• **Middle row**: English translation\n`;
  answer += `• **Bottom row**: Strong's concordance numbers\n\n`;
  answer += `💡 Use Strong's numbers to look up detailed word studies and see every occurrence in Scripture.`;

  // Add citations for each word with Strong's number
  interlinear.words.forEach(word => {
    if (word.strongs) {
      citations.push({
        type: 'interlinear',
        ref: reference,
        strongsNumber: word.strongs,
        original: word.original,
        english: word.english
      });
    }
  });

  return { answer, citations, metadata: { category: 'interlinear', reference, language: interlinear.language } };
}

/**
 * Generate response for cross-reference and topical searches
 */
async function generateCrossReferenceResponse(message, retrieved, context) {
  const citations = [];
  let answer = '';

  // Check if asking about a topic (e.g., "verses about salvation", "show me verses on faith")
  const topicMatch = message.match(/(?:verses? (?:about|on|regarding)|show.*verses?.*(?:about|on))\s+([a-z]+(?:\s+[a-z]+)?)/i);

  if (topicMatch) {
    const topic = topicMatch[1].trim();
    const thematicRefs = await searchCrossRefsByTopic(topic);

    if (thematicRefs && thematicRefs.verses) {
      answer += `## 📚 Verses About: ${thematicRefs.topic.charAt(0).toUpperCase() + thematicRefs.topic.slice(1)}\n\n`;
      answer += `${thematicRefs.description}\n\n`;
      answer += `**Key Passages**:\n`;

      thematicRefs.verses.slice(0, 8).forEach(ref => {
        answer += `• ${ref}\n`;
        citations.push({ type: 'thematic_cross_ref', ref, topic: thematicRefs.topic });
      });

      if (thematicRefs.verses.length > 8) {
        answer += `\n*...and ${thematicRefs.verses.length - 8} more passages*\n`;
      }

      answer += `\n💡 Use Bible Reader to read these passages in full context.`;

      return { answer, citations, metadata: { category: 'cross_reference', topic: thematicRefs.topic } };
    }
  }

  // Fallback: Show cross-references from retrieved context
  if (retrieved.crossRefs && retrieved.crossRefs.length > 0) {
    answer += `## 🔗 Cross-References\n\n`;

    retrieved.crossRefs.slice(0, 8).forEach(ref => {
      answer += `• **${ref.reference}**`;
      if (ref.note) answer += `: ${ref.note}`;
      answer += `\n`;
      citations.push({ type: 'cross_ref', ref: ref.reference });
    });

    answer += `\n💡 These passages are thematically or contextually related.`;
  } else {
    answer += `No cross-references found. Try searching for a specific topic like "salvation", "faith", "love", or "grace".`;
  }

  return { answer, citations, metadata: { category: 'cross_reference' } };
}

/**
 * Helper: Extract key insights from multiple verses
 */
function synthesizeVerseInsights(verses, maxVerses = 3) {
  if (!verses || verses.length === 0) return '';

  let synthesis = '';

  verses.slice(0, maxVerses).forEach((verse, idx) => {
    const snippet = truncateText(verse.text, 80);
    synthesis += `**${verse.reference}**: ${snippet}`;
    if (idx < Math.min(verses.length, maxVerses) - 1) {
      synthesis += '\n\n';
    }
  });

  return synthesis;
}

/**
 * Helper: Create a concise theological summary from multiple sources
 */
function synthesizeTheologicalResponse(definitions, verses, maxLength = 200) {
  let summary = '';

  // Start with definition if available
  if (definitions && definitions.length > 0) {
    const defSummary = summarizeDefinition(definitions[0].definition, 1);
    summary += defSummary + ' ';
  }

  // Add key scriptural support
  if (verses && verses.length > 0) {
    const keyVerse = verses[0];
    summary += `Scripture teaches this in ${keyVerse.reference}`;
    if (verses.length > 1) {
      summary += ` and ${verses.length - 1} other passage${verses.length > 2 ? 's' : ''}`;
    }
    summary += '.';
  }

  return truncateText(summary, maxLength);
}

export default { answerQuery };
