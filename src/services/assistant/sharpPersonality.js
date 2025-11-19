/**
 * S.H.A.R.P. Personality & Response Enhancement System
 *
 * Scriptural Hermeneutics & Augmented Reasoning Program
 *
 * This module adds warmth, intelligence, and personalization to S.H.A.R.P. responses,
 * making the assistant feel like a personal biblical scholar rather than a robotic search tool.
 */

/**
 * S.H.A.R.P. System Identity
 */
export const SHARP_IDENTITY = {
  role: "Personal biblical scholar, theologian, historian, and spiritual guide",
  approach: "Historically biblical, context-rich explanations from Scripture, ancient languages, early church writings, and historical sources",
  principles: [
    "Does not preach",
    "Does not push denominational doctrine",
    "Provides neutral, scholarly analysis",
    "Warm, intelligent, and deeply attentive",
    "Becomes more personal over time"
  ]
};

/**
 * Dynamic greeting phrases for S.H.A.R.P. responses
 * Each category has multiple variations to prevent redundancy
 */
export const GREETING_PHRASES = {
  biographical: [
    "Let me walk with you through {topic}.",
    "Let's explore who {topic} was in the biblical narrative.",
    "Great question about {topic}—let's dive in.",
    "Here's the story of {topic}.",
    "Let me introduce you to {topic}.",
    "Time to meet {topic}.",
    "Let's get into {topic}'s story.",
    "Here's what you need to know about {topic}.",
    "Let me paint the picture of {topic} for you.",
    "Ready to discover {topic}? Let's go.",
    "Let's unpack {topic}'s role in Scripture.",
    "Here's the biblical account of {topic}."
  ],
  interpretation: [
    "Let me unpack {topic} for you.",
    "Let's break down {topic}.",
    "Here's what's happening with {topic}.",
    "Let's get into {topic}.",
    "Time to dig into {topic}.",
    "Let me explain {topic}.",
    "Here's the real meaning of {topic}.",
    "Let's make sense of {topic}.",
    "Ready to understand {topic}? Let's dive in.",
    "Let me walk you through {topic}.",
    "Here's what {topic} is really about.",
    "Let's explore the depths of {topic}."
  ],
  wordStudy: [
    "Let's dig into the original language of {topic}.",
    "Time to explore the Greek/Hebrew behind {topic}.",
    "Here's what {topic} means in the original.",
    "Let's get linguistic with {topic}.",
    "Ready for a word study on {topic}?",
    "Let me show you the original meaning of {topic}.",
    "Here's the fascinating etymology of {topic}.",
    "Let's unpack the language of {topic}.",
    "Time to go deep on {topic}.",
    "Let me reveal what {topic} really means.",
    "Here's the linguistic key to {topic}.",
    "Let's explore the original word for {topic}."
  ],
  historical: [
    "Let me set the historical scene for {topic}.",
    "Here's the backdrop to {topic}.",
    "Let's explore the culture around {topic}.",
    "Time to understand the history of {topic}.",
    "Let me paint the historical picture of {topic}.",
    "Here's what was happening when {topic} occurred.",
    "Let's dive into the context of {topic}.",
    "Ready to see {topic} in its world?",
    "Let me show you the setting for {topic}.",
    "Here's the cultural landscape of {topic}.",
    "Time to explore the historical backdrop of {topic}.",
    "Let's understand {topic} in its time."
  ],
  theological: [
    "Let's explore the theology of {topic}.",
    "Time to dig into {topic} theologically.",
    "Here's what Scripture teaches about {topic}.",
    "Let me unpack the doctrine of {topic}.",
    "Ready to understand {topic} biblically?",
    "Let's get theological about {topic}.",
    "Here's the biblical perspective on {topic}.",
    "Time to explore what God's Word says about {topic}.",
    "Let me walk you through the theology of {topic}.",
    "Here's how Scripture addresses {topic}.",
    "Let's examine {topic} through a biblical lens.",
    "Ready to dive into {topic}?"
  ],
  definition: [
    "Let me explain what {topic} means.",
    "Here's the definition of {topic}.",
    "Let's define {topic}.",
    "Time to clarify {topic}.",
    "Here's what {topic} is.",
    "Let me break down {topic} for you.",
    "Ready to understand {topic}?",
    "Here's the meaning of {topic}.",
    "Let's get clear on {topic}.",
    "Time to explain {topic}.",
    "Here's what you need to know about {topic}.",
    "Let me clarify {topic}."
  ],
  paul: [
    "Let's explore what Paul said about {topic}.",
    "Time to understand Paul's view on {topic}.",
    "Here's Paul's perspective on {topic}.",
    "Let me explain Paul's teaching on {topic}.",
    "Ready to hear what Paul said about {topic}?",
    "Let's dig into Paul's words on {topic}.",
    "Here's how Paul addressed {topic}.",
    "Time to explore Paul's message about {topic}.",
    "Let me walk you through Paul's teaching on {topic}.",
    "Here's what Paul meant by {topic}.",
    "Let's understand Paul on {topic}.",
    "Ready for Paul's perspective on {topic}?"
  ],
  general: [
    "Let's dive into {topic}.",
    "Here's what you need to know about {topic}.",
    "Time to explore {topic}.",
    "Let me help you understand {topic}.",
    "Ready to learn about {topic}?",
    "Let's get into {topic}.",
    "Here's the answer to your question about {topic}.",
    "Time to unpack {topic}.",
    "Let me shed some light on {topic}.",
    "Here's what Scripture says about {topic}.",
    "Let's explore {topic} together.",
    "Ready to discover {topic}?"
  ]
};

/**
 * Conversational tone templates for different response types
 */
export const TONE_TEMPLATES = {
  biographical: [
    "Let me walk with you through {name}'s story.",
    "Here's who {name} was in the biblical narrative.",
    "Good question about {name}—here's the historical backdrop."
  ],
  interpretation: [
    "Let me unpack what's happening in this passage.",
    "Here's what's actually going on here.",
    "This is a passage that trips up a lot of people—let's break it down."
  ],
  wordStudy: [
    "Let's dig into the original language on this one.",
    "The Greek/Hebrew here is fascinating—here's why.",
    "Understanding the original word unlocks this verse."
  ],
  historical: [
    "Here's the historical backdrop—it'll make the verse come alive.",
    "Let me set the scene for you.",
    "Understanding the culture changes everything here."
  ],
  paul: [
    "Paul is often misunderstood here—let's look at his world.",
    "Remember, Paul was a first-century Pharisee writing to Greco-Roman audiences.",
    "Here's what Paul meant in his cultural context."
  ]
};

/**
 * Engagement invitation templates
 */
export const ENGAGEMENT_INVITATIONS = {
  wordStudy: [
    "Want the Greek on that?",
    "Shall I show you the Hebrew?",
    "Would you like the original language breakdown?"
  ],
  historical: [
    "I can go deeper into the history if you want.",
    "Want more on the cultural context?",
    "Should I explain the Second Temple background?"
  ],
  crossRefs: [
    "Would you like cross-references from the LXX?",
    "Want to see where else this appears in Scripture?",
    "Should I show parallel passages?"
  ],
  earlyChurch: [
    "Want the early church commentary on this?",
    "Should I share what the Church Fathers said?",
    "Interested in the patristic interpretation?"
  ],
  deeper: [
    "I can go deeper if you want.",
    "Want the scholarly details?",
    "Should I unpack this further?"
  ]
};

/**
 * Track recently used greetings to prevent immediate repetition
 * Stores last 5 greetings per category
 */
const recentGreetings = {};

/**
 * Select a random greeting that hasn't been used recently
 */
function selectGreeting(category, topic) {
  // Map category to greeting category
  const greetingCategory = mapCategoryToGreeting(category);
  const phrases = GREETING_PHRASES[greetingCategory] || GREETING_PHRASES.general;

  // Initialize recent tracking for this category
  if (!recentGreetings[greetingCategory]) {
    recentGreetings[greetingCategory] = [];
  }

  // Filter out recently used phrases
  const recent = recentGreetings[greetingCategory];
  let availablePhrases = phrases.filter(p => !recent.includes(p));

  // If all have been used recently, reset the pool
  if (availablePhrases.length === 0) {
    availablePhrases = phrases;
    recentGreetings[greetingCategory] = [];
  }

  // Select random phrase
  const selectedPhrase = availablePhrases[Math.floor(Math.random() * availablePhrases.length)];

  // Track this selection
  recentGreetings[greetingCategory].push(selectedPhrase);
  if (recentGreetings[greetingCategory].length > 5) {
    recentGreetings[greetingCategory].shift(); // Keep only last 5
  }

  // Replace {topic} placeholder with actual topic
  return selectedPhrase.replace('{topic}', topic);
}

/**
 * Map classification category to greeting category
 */
function mapCategoryToGreeting(category) {
  const mapping = {
    'who': 'biographical',
    'what_definition': 'definition',
    'interpretation': 'interpretation',
    'language': 'wordStudy',
    'history': 'historical',
    'theology': 'theological',
    'paul': 'paul',
    'word_study': 'wordStudy'
  };

  return mapping[category] || 'general';
}

/**
 * Extract topic from query for personalized greetings
 */
function extractTopic(query, category) {
  // Remove common question words
  let topic = query
    .replace(/^(who is|what is|tell me about|explain|define|meaning of|who was|what was)\s+/i, '')
    .replace(/\?$/, '')
    .trim();

  // For biographical questions, extract the name
  if (category === 'who') {
    const match = topic.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
    if (match) {
      topic = match[1];
    }
  }

  // Capitalize first letter
  if (topic) {
    topic = topic.charAt(0).toUpperCase() + topic.slice(1);
  }

  return topic || 'this';
}

/**
 * Enhance response with S.H.A.R.P. personality
 */
export function enhanceWithPersonality(response, classification, query = '') {
  const { category, subcategory } = classification;

  // Add warm introduction with dynamic greeting
  let enhanced = addWarmIntro(response, category, subcategory, query);

  // Add engagement invitation at the end
  enhanced = addEngagementInvitation(enhanced, category, subcategory);

  return enhanced;
}

/**
 * Add warm, conversational introduction with dynamic greeting
 */
function addWarmIntro(response, category, subcategory, query) {
  // Extract topic from query
  const topic = extractTopic(query, category);

  // Select appropriate greeting
  const greeting = selectGreeting(category, topic);

  // Prepend greeting to response
  return `${greeting}\n\n${response}`;
}

/**
 * Add engagement invitation based on question type
 */
function addEngagementInvitation(response, category, subcategory) {
  // Don't add invitations if response already has one or if it's a simple reference lookup
  if (response.includes('Want ') || response.includes('Would you like') || response.includes('Should I')) {
    return response;
  }

  let invitation = '';

  if (category === 'scripture') {
    if (subcategory === 'who' || subcategory === 'what_definition') {
      invitation = '\n\n💡 Want the Greek or Hebrew on any of these references?';
    } else if (subcategory === 'interpretation') {
      invitation = '\n\n💡 I can go deeper into the historical context if you want.';
    } else if (subcategory === 'language') {
      invitation = '\n\n💡 Want more word usage examples from Scripture?';
    }
  } else if (category === 'theology') {
    invitation = '\n\n💡 Want to see what the early church fathers said about this?';
  } else if (category === 'history') {
    invitation = '\n\n💡 Should I unpack the cultural background further?';
  } else if (category === 'paul') {
    invitation = '\n\n💡 Want more on Paul\'s first-century context?';
  }

  return response + invitation;
}

/**
 * Detect if question is about Paul and needs special handling
 */
export function detectPaulQuestion(query) {
  const lower = query.toLowerCase();
  const paulPatterns = [
    /\bpaul\b/i,
    /\bsaul\b/i,
    /\bapostle to the gentiles\b/i,
    /\b(?:1|2|first|second)\s*(?:corinthians?|timothy|thessalonians?)\b/i,
    /\b(?:romans|galatians|ephesians|philippians|colossians|philemon|titus)\b/i
  ];

  return paulPatterns.some(p => p.test(lower));
}

/**
 * Add Paul-specific contextual framing
 */
export function addPaulContext(response, query) {
  const needsContext = detectPaulQuestion(query) && !response.includes('Paul was') && !response.includes('first-century');

  if (needsContext) {
    const contextNote = '\n\n📖 Context: Paul was a first-century Pharisee trained under Gamaliel, writing to mixed Jewish-Gentile audiences in Greco-Roman cities. Understanding his Jewish background and Greco-Roman cultural setting is key to interpreting his letters.';
    return response + contextNote;
  }

  return response;
}

/**
 * Detect ambiguous questions that need clarification
 */
export function detectAmbiguousQuestion(query) {
  const ambiguousPatterns = [
    /^explain this$/i,
    /^what does this mean\??$/i,
    /^tell me about this$/i,
    /^this verse$/i,
    /^what about$/i,
    /^how about$/i
  ];

  return ambiguousPatterns.some(p => p.test(query.trim()));
}

/**
 * Generate clarification prompt for ambiguous questions
 */
export function generateClarificationPrompt(query) {
  return {
    answer: `⚠️ I want to give you the best answer—could you be more specific?\n\nWould you like:\n• 📜 Historical background and cultural context\n• 🔤 Greek/Hebrew word study and linguistic analysis\n• ⛪ Early church interpretation and patristic commentary\n• 📖 Doctrinal/theological explanation\n• 💡 Practical application to daily life\n\nJust let me know which direction interests you most!`,
    citations: [],
    meta: { needsClarification: true }
  };
}

/**
 * Structure response with layered depth
 *
 * Organizes content as: Direct Answer → Context → Deeper Dive → Invitation
 */
export function structureLayeredResponse(content, options = {}) {
  const {
    directAnswer,
    scriptural,
    historical,
    linguistic,
    patristic,
    invitation
  } = options;

  let response = '';

  if (directAnswer) {
    response += `${directAnswer}\n\n`;
  }

  if (scriptural) {
    response += `📜 **Scriptural Foundation**\n${scriptural}\n\n`;
  }

  if (historical) {
    response += `🏛️ **Historical Context**\n${historical}\n\n`;
  }

  if (linguistic) {
    response += `🔤 **Language Analysis**\n${linguistic}\n\n`;
  }

  if (patristic) {
    response += `⛪ **Early Church Perspective**\n${patristic}\n\n`;
  }

  if (invitation) {
    response += `\n💡 ${invitation}`;
  }

  return response.trim();
}

export default {
  SHARP_IDENTITY,
  TONE_TEMPLATES,
  ENGAGEMENT_INVITATIONS,
  enhanceWithPersonality,
  detectPaulQuestion,
  addPaulContext,
  detectAmbiguousQuestion,
  generateClarificationPrompt,
  structureLayeredResponse
};
