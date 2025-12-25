/**
 * Enhanced Rule-Based SHARP Assistant
 * Provides comprehensive biblical question answering without external AI APIs
 * Uses RAG (Retrieval-Augmented Generation) with rule-based response templates
 */

import { analyzeQuestion } from './questionAnalyzer';
import { classifyQuestion } from './questionClassifier';
import { orchestrateRetrieval } from './ragOrchestrator';
import { lookupDefinition } from './dictionaryProvider';

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

  return response;
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
    return await generateLanguageResponse(message, retrievedContext, context);
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
  const personMatch = message.match(/who\s+(?:is|was)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  const person = personMatch ? personMatch[1] : null;

  if (person && retrieved.definitions && retrieved.definitions.length > 0) {
    const def = retrieved.definitions[0];

    // Synthesize a concise summary from the definition
    const summary = summarizeDefinition(def.definition, 2); // 2 sentences

    answer += `**${def.headword}**\n\n`;
    answer += `${summary}\n\n`;
    citations.push({ type: 'dictionary', source: def.source, entry: def.headword });
  }

  if (retrieved.verses && retrieved.verses.length > 0) {
    answer += `## 📖 Key Passages\n\n`;

    // Show only top 3 most relevant verses with brief context
    retrieved.verses.slice(0, 3).forEach(verse => {
      const snippet = truncateText(verse.text, 100); // Keep verses concise
      answer += `**${verse.reference}**: ${snippet}\n\n`;
      citations.push({ type: 'verse', ref: verse.reference, book: verse.book, chapter: verse.chapter, verse: verse.verse });
    });
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

  if (retrieved.verses && retrieved.verses.length > 0) {
    answer += `## 📖 Biblical Context\n\n`;
    // Show only 2 most relevant verses, truncated
    retrieved.verses.slice(0, 2).forEach(verse => {
      const snippet = truncateText(verse.text, 80);
      answer += `**${verse.reference}**: ${snippet}\n\n`;
      citations.push({ type: 'verse', ref: verse.reference });
    });
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

    // Concise one-line presentation
    if (lex.word && lex.transliteration) {
      answer += `**${lex.word}** (${lex.transliteration})`;
      if (lex.strongs) {
        answer += ` — Strong's ${lex.strongs}`;
        citations.push({ type: 'lexicon', strongsNumber: lex.strongs });
      }
      answer += `\n\n`;
    }

    // Concise definition
    if (lex.definition) {
      const defSummary = summarizeDefinition(lex.definition, 1);
      answer += `**Meaning**: ${defSummary}\n\n`;
    }

    // KJV usage if available
    if (lex.kjvUsage) {
      answer += `**Used as**: ${lex.kjvUsage}\n\n`;
    }
  }

  if (retrieved.verses && retrieved.verses.length > 0) {
    answer += `## 📖 Biblical Examples\n\n`;
    // Show 2 examples, truncated
    retrieved.verses.slice(0, 2).forEach(verse => {
      const snippet = truncateText(verse.text, 70);
      answer += `**${verse.reference}**: ${snippet}\n\n`;
      citations.push({ type: 'verse', ref: verse.reference });
    });
  }

  if (!answer) {
    answer = `## 🔤 Original Languages\n\nExplore Koine Greek and Ancient Hebrew courses for in-depth language study with Strong's Concordance integration.`;
  } else {
    answer += `💡 **Learn More**: Take Greek/Hebrew courses for comprehensive language learning.`;
  }

  return { answer, citations, metadata: { category: 'language' } };
}

/**
 * Generate response for theology questions
 */
async function generateTheologyResponse(message, retrieved, context) {
  const citations = [];
  let answer = '';

  // Create concise theological summary
  if (retrieved.definitions && retrieved.definitions.length > 0) {
    const def = retrieved.definitions[0];
    const summary = summarizeDefinition(def.definition, 2);

    answer += `## ✝️ ${def.headword}\n\n`;
    answer += `${summary}\n\n`;
    citations.push({ type: 'dictionary', source: def.source, entry: def.headword });
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

  return { answer, citations, metadata: { category: 'theology' } };
}

/**
 * Generate response for "Where" questions
 */
async function generateWhereResponse(message, retrieved, context) {
  const citations = [];
  let answer = '';

  if (retrieved.definitions && retrieved.definitions.length > 0) {
    const def = retrieved.definitions[0];
    const summary = summarizeDefinition(def.definition, 2);

    answer += `## 📍 ${def.headword}\n\n`;
    answer += `${summary}\n\n`;
    citations.push({ type: 'dictionary', source: def.source, entry: def.headword });
  }

  if (retrieved.verses && retrieved.verses.length > 0) {
    answer += `## 📖 Biblical Mentions\n\n`;
    retrieved.verses.slice(0, 3).forEach(verse => {
      const snippet = truncateText(verse.text, 80);
      answer += `**${verse.reference}**: ${snippet}\n\n`;
      citations.push({ type: 'verse', ref: verse.reference });
    });
  }

  if (!answer) {
    answer = `## 📍 Biblical Geography\n\n`;
  }

  answer += `🗺️ **Explore**: Biblical Archaeology course covers historical places and geographical context.`;

  return { answer, citations, metadata: { category: 'where' } };
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
    answer += `## 📖 ${verse.reference} (${verse.translation || 'KJV'})\n\n`;
    answer += `> ${verse.text}\n\n`;
    citations.push({ type: 'verse', ref: verse.reference });

    // Show related passages concisely
    if (retrieved.crossRefs && retrieved.crossRefs.length > 0) {
      const relatedRefs = retrieved.crossRefs.slice(0, 4).map(r => r.reference).join(', ');
      answer += `**Related**: ${relatedRefs}\n\n`;
      retrieved.crossRefs.slice(0, 4).forEach(ref => {
        citations.push({ type: 'verse', ref: ref.reference });
      });
    }

    answer += `💡 **Study**: Use Strong's Concordance for word study, read context in Bible Reader, explore Hermeneutics for interpretation.`;
  }

  return { answer, citations, metadata: { category: 'verse' } };
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
