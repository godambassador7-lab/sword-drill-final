/**
 * Enhanced Pipeline for SHARP Assistant
 * Integrates Claude API with RAG (Retrieval-Augmented Generation)
 * Main entry point for AI-powered biblical question answering
 */

import { analyzeQuestion } from './questionAnalyzer';
import { classifyQuestion } from './questionClassifier';
import { orchestrateRetrieval } from './ragOrchestrator';
import { buildContextForClaude, buildMinimalContext } from './contextBuilder';
import { sendMessage, isClaudeAvailable } from './claudeService';
import { buildSystemPrompt, getBriefSystemPrompt } from './systemPrompts';
import { extractCitations, validateCitations } from './citationExtractor';
import { handleClaudeError, getUserFriendlyErrorMessage } from './errorHandler';
import { responseCache } from './cache';
import { answerQuery as fallbackAnswerQuery } from './pipeline';

/**
 * Answer user query using Claude API with RAG
 * @param {string} userMessage - User's question
 * @param {Object} context - Context including conversation history, preferences, etc.
 * @returns {Promise<Object>} Response with answer, citations, and metadata
 */
export async function answerQueryWithClaude(userMessage, context = {}) {
  const enableClaude = process.env.REACT_APP_ENABLE_CLAUDE === 'true';

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
      metadata: {
        needsClarification: true,
        classification,
        usedClaude: false
      }
    };
  }

  // Check cache first
  const cachedResponse = responseCache.get(userMessage, context);
  if (cachedResponse) {
    console.log('Using cached response');
    return {
      ...cachedResponse,
      metadata: {
        ...cachedResponse.metadata,
        fromCache: true
      }
    };
  }

  // Attempt to use Claude API with RAG
  if (enableClaude && isClaudeAvailable()) {
    let retryCount = 0;
    let shouldRetry = true;

    while (shouldRetry && retryCount <= 3) {
      try {
        // Step 2: Retrieve relevant references using RAG
        console.log('Orchestrating retrieval...');
        const retrievedContext = await orchestrateRetrieval(userMessage, classification, context);

        console.log('Retrieved context:', {
          verses: retrievedContext.verses?.length || 0,
          definitions: retrievedContext.definitions?.length || 0,
          lexicon: retrievedContext.lexicon?.length || 0,
          crossRefs: retrievedContext.crossRefs?.length || 0
        });

        // Step 3: Build context string for Claude
        const contextString = buildContextForClaude(retrievedContext, userMessage);

        if (!contextString || contextString.trim().length === 0) {
          console.warn('No context retrieved, falling back to rule-based system');
          return fallbackAnswerQuery(userMessage, context);
        }

        // Step 4: Build system prompt based on question type
        const systemPrompt = buildSystemPrompt(classification, context);

        // Step 5: Prepare conversation history (last 10 exchanges max)
        const conversationHistory = formatConversationHistory(
          context.conversationHistory || [],
          10
        );

        // Step 6: Call Claude API
        console.log('Calling Claude API...');
        const messages = [
          ...conversationHistory,
          {
            role: 'user',
            content: `${contextString}\n\n---\n\n## User Question\n\n${userMessage}`
          }
        ];

        const response = await sendMessage(messages, systemPrompt, {
          model: process.env.REACT_APP_CLAUDE_MODEL,
          max_tokens: parseInt(process.env.REACT_APP_CLAUDE_MAX_TOKENS || '4000'),
          temperature: 0.3
        });

        console.log('Claude API response received:', {
          contentLength: response.content.length,
          tokensUsed: response.usage.total_tokens
        });

        // Step 7: Extract and validate citations
        const extractedCitations = extractCitations(response.content);
        const validatedCitations = validateCitations(extractedCitations, retrievedContext);

        console.log('Citations extracted:', {
          extracted: extractedCitations.length,
          validated: validatedCitations.length
        });

        // Step 8: Build response object
        const result = {
          answer: response.content,
          citations: validatedCitations,
          metadata: {
            classification,
            usedClaude: true,
            tokensUsed: response.usage,
            model: response.model,
            retrievedSources: {
              verses: retrievedContext.verses?.length || 0,
              definitions: retrievedContext.definitions?.length || 0,
              lexicon: retrievedContext.lexicon?.length || 0,
              crossRefs: retrievedContext.crossRefs?.length || 0
            }
          },
          conversationHistory: [
            ...(context.conversationHistory || []),
            { role: 'user', content: userMessage },
            { role: 'assistant', content: response.content }
          ]
        };

        // Cache the response
        responseCache.set(userMessage, context, result);

        return result;

      } catch (error) {
        console.error('Claude API error:', error);

        // Handle error with retry logic
        const errorResponse = await handleClaudeError(error, userMessage, context, retryCount);

        if (errorResponse.shouldRetry) {
          retryCount = errorResponse.retryCount;
          console.log(`Retrying (attempt ${retryCount})...`);
          continue;
        }

        if (errorResponse.useFallback) {
          console.log('Falling back to rule-based system');
          const fallbackResult = await fallbackAnswerQuery(userMessage, context);

          // Add fallback notice to answer
          return {
            ...fallbackResult,
            answer: `⚠️ ${errorResponse.fallbackMessage}\n\n${fallbackResult.answer}`,
            metadata: {
              ...fallbackResult.metadata,
              usedClaude: false,
              fallbackReason: getUserFriendlyErrorMessage(error)
            }
          };
        }

        // If we can't retry or fallback, throw error
        throw error;
      }

      shouldRetry = false;
    }
  }

  // Fallback to rule-based system if Claude is not enabled or available
  console.log('Using rule-based system (Claude not enabled/available)');
  return fallbackAnswerQuery(userMessage, context);
}

/**
 * Format conversation history for Claude API
 * @param {Array} history - Full conversation history
 * @param {number} maxExchanges - Maximum number of exchanges to include
 * @returns {Array} Formatted messages for Claude
 */
function formatConversationHistory(history, maxExchanges) {
  if (!history || history.length === 0) {
    return [];
  }

  // Take last N exchanges (each exchange = user + assistant message)
  const recentHistory = history.slice(-maxExchanges * 2);

  // Format for Claude API
  return recentHistory.map(msg => ({
    role: msg.role,
    content: typeof msg.content === 'string' ? msg.content : msg.content.text || ''
  }));
}

/**
 * Simple answer function for basic queries (optional optimization)
 * Uses minimal context for straightforward verse lookups
 * @param {string} userMessage - User's question
 * @param {Object} context - Context
 * @returns {Promise<Object>} Response
 */
export async function answerSimpleQuery(userMessage, context = {}) {
  const enableClaude = process.env.REACT_APP_ENABLE_CLAUDE === 'true';

  if (!enableClaude || !isClaudeAvailable()) {
    return fallbackAnswerQuery(userMessage, context);
  }

  try {
    const analysis = analyzeQuestion(userMessage);

    // Only use this for direct verse references
    if (!analysis.hasVerseReference) {
      return answerQueryWithClaude(userMessage, context);
    }

    // Quick verse retrieval
    const { searchBible } = await import('./retrieval/bibleProvider');
    const verses = await searchBible(userMessage, {
      translation: context.selectedTranslation || 'KJV',
      limit: 3
    });

    if (!verses || verses.length === 0) {
      return answerQueryWithClaude(userMessage, context);
    }

    // Build minimal context
    const contextString = buildMinimalContext(verses);

    // Use brief system prompt
    const systemPrompt = getBriefSystemPrompt();

    // Call Claude
    const messages = [{
      role: 'user',
      content: `${contextString}\n\n---\n\nUser Question: ${userMessage}`
    }];

    const response = await sendMessage(messages, systemPrompt, {
      max_tokens: 1500,
      temperature: 0.3
    });

    const citations = extractCitations(response.content);

    return {
      answer: response.content,
      citations,
      metadata: {
        usedClaude: true,
        simple: true,
        tokensUsed: response.usage
      }
    };

  } catch (error) {
    console.error('Simple query error:', error);
    return answerQueryWithClaude(userMessage, context);
  }
}

/**
 * Get assistant capabilities
 * @returns {Object} Capabilities object
 */
export function getAssistantCapabilities() {
  const claudeEnabled = process.env.REACT_APP_ENABLE_CLAUDE === 'true';
  const claudeAvailable = isClaudeAvailable();

  return {
    hasClaudeAPI: claudeEnabled && claudeAvailable,
    hasConversationMemory: true,
    hasRAG: true,
    hasCitations: true,
    supportedQuestions: [
      'Biblical questions (who, what, when, where, why)',
      'Theological questions',
      'Biblical language questions (Greek/Hebrew)',
      'Scripture interpretation',
      'Cross-references and context',
      'Bible dictionary lookups',
      'Follow-up questions'
    ]
  };
}

/**
 * Clear conversation history and cache
 */
export function clearAssistantMemory() {
  responseCache.clear();
  console.log('Assistant memory cleared');
}

/**
 * Get cache statistics
 * @returns {Object} Cache stats
 */
export function getAssistantStats() {
  return responseCache.getStats();
}
