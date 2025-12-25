/**
 * Error Handler for SHARP Assistant
 * Handles Claude API errors with retry logic and fallback mechanisms
 */

export class ClaudeAPIError extends Error {
  constructor(message, code, isRetryable = false) {
    super(message);
    this.name = 'ClaudeAPIError';
    this.code = code;
    this.isRetryable = isRetryable;
  }
}

/**
 * Handle Claude API errors with retry and fallback logic
 * @param {Error} error - The error that occurred
 * @param {string} query - User's original query
 * @param {Object} context - Request context
 * @param {number} retryCount - Current retry attempt number
 * @returns {Promise<Object>} Decision object with shouldRetry or useFallback
 */
export async function handleClaudeError(error, query, context, retryCount = 0) {
  const maxRetries = 3;

  // Log the error for debugging
  logError(error, { query, context, retryCount });

  // Rate limit errors (429) - retry with exponential backoff
  if (error.status === 429 && retryCount < maxRetries) {
    const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
    console.warn(`Rate limited. Retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);

    await new Promise(resolve => setTimeout(resolve, delay));
    return {
      shouldRetry: true,
      retryCount: retryCount + 1,
      message: `Rate limit hit. Retrying... (${retryCount + 1}/${maxRetries})`
    };
  }

  // Server errors (5xx) - retry once
  if (error.status >= 500 && error.status < 600 && retryCount === 0) {
    console.warn('Server error. Retrying once...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      shouldRetry: true,
      retryCount: 1,
      message: 'Server error. Retrying...'
    };
  }

  // Network errors - retry once
  if ((error.message?.includes('network') || error.message?.includes('fetch')) && retryCount === 0) {
    console.warn('Network error. Retrying once...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      shouldRetry: true,
      retryCount: 1,
      message: 'Network error. Retrying...'
    };
  }

  // Authentication errors (401, 403) - don't retry, use fallback
  if (error.status === 401 || error.status === 403) {
    console.error('Authentication error with Claude API');
    return {
      shouldRetry: false,
      useFallback: true,
      fallbackMessage: 'API authentication issue. Using built-in knowledge to answer your question.',
      userMessage: 'There\'s an issue with the AI service configuration. I\'ve switched to my built-in knowledge base.'
    };
  }

  // Invalid request errors (400) - don't retry, use fallback
  if (error.status === 400) {
    console.error('Invalid request to Claude API:', error.message);
    return {
      shouldRetry: false,
      useFallback: true,
      fallbackMessage: 'Invalid request format. Using built-in knowledge.',
      userMessage: 'I encountered an issue processing that request. Let me use my standard knowledge base instead.'
    };
  }

  // Token limit errors - don't retry, use fallback with shortened context
  if (error.message?.includes('token') || error.message?.includes('length')) {
    console.error('Token limit exceeded');
    return {
      shouldRetry: false,
      useFallback: true,
      fallbackMessage: 'Context too large. Using built-in knowledge.',
      userMessage: 'That question requires more context than I can process. Let me provide a simpler answer.',
      shouldShortenContext: true
    };
  }

  // All other errors after max retries - fall back to rule-based system
  console.error('Claude API error after retries, using fallback:', error);
  return {
    shouldRetry: false,
    useFallback: true,
    fallbackMessage: 'AI service unavailable. Switched to built-in knowledge to answer your question.',
    userMessage: 'I encountered an issue with the AI system. I\'ve switched to my built-in knowledge base to help you.'
  };
}

/**
 * Log error for debugging and monitoring
 * @param {Error} error - The error to log
 * @param {Object} context - Additional context
 */
export function logError(error, context = {}) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    errorName: error.name,
    errorMessage: error.message,
    errorCode: error.code,
    errorStatus: error.status,
    errorType: error.type,
    context: {
      query: context.query?.substring(0, 100), // Truncate for privacy
      retryCount: context.retryCount,
      hasContext: !!context.context
    }
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('SHARP Error:', errorLog);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }

  // In production, you could send to error tracking service
  // e.g., Sentry, LogRocket, etc.
  // if (process.env.NODE_ENV === 'production') {
  //   sendToErrorTracking(errorLog);
  // }
}

/**
 * Check if error is retryable
 * @param {Error} error - The error to check
 * @returns {boolean}
 */
export function isRetryableError(error) {
  // Rate limits
  if (error.status === 429) return true;

  // Server errors
  if (error.status >= 500 && error.status < 600) return true;

  // Network errors
  if (error.message?.includes('network') || error.message?.includes('fetch')) return true;

  // Timeout errors
  if (error.message?.includes('timeout')) return true;

  return false;
}

/**
 * Get user-friendly error message
 * @param {Error} error - The error
 * @returns {string} User-friendly message
 */
export function getUserFriendlyErrorMessage(error) {
  if (error.status === 429) {
    return 'The AI service is busy right now. I\'ll use my standard knowledge to answer your question.';
  }

  if (error.status === 401 || error.status === 403) {
    return 'There\'s a configuration issue with the AI service. I\'ll use my built-in knowledge instead.';
  }

  if (error.status >= 500) {
    return 'The AI service is temporarily unavailable. I\'ll use my standard knowledge base.';
  }

  if (error.message?.includes('network')) {
    return 'I\'m having trouble connecting. Let me use my offline knowledge to help you.';
  }

  if (error.message?.includes('token') || error.message?.includes('length')) {
    return 'Your question is very complex. Let me provide a simplified answer using my standard knowledge.';
  }

  return 'I encountered an issue with the AI system. I\'ll use my built-in knowledge to help you instead.';
}

/**
 * Create a wrapped error with additional context
 * @param {Error} originalError - Original error
 * @param {string} context - Context description
 * @returns {ClaudeAPIError}
 */
export function wrapError(originalError, context) {
  const isRetryable = isRetryableError(originalError);
  const code = originalError.status || originalError.code || 'UNKNOWN';

  return new ClaudeAPIError(
    `${context}: ${originalError.message}`,
    code,
    isRetryable
  );
}
