import Anthropic from '@anthropic-ai/sdk';

/**
 * Claude API Service for SHARP Assistant
 * Handles all communication with Anthropic's Claude API
 */

class ClaudeService {
  constructor() {
    this.client = null;
    this.apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
    this.isEnabled = process.env.REACT_APP_ENABLE_CLAUDE === 'true';

    if (this.isEnabled && this.apiKey) {
      try {
        this.client = new Anthropic({
          apiKey: this.apiKey,
          dangerouslyAllowBrowser: true // Required for client-side usage
        });
      } catch (error) {
        console.error('Failed to initialize Claude client:', error);
        this.isEnabled = false;
      }
    }
  }

  /**
   * Send message to Claude API
   * @param {Array} messages - Conversation history in Claude format
   * @param {string} systemPrompt - System prompt defining SHARP personality
   * @param {Object} options - Additional options (model, max_tokens, temperature)
   * @returns {Promise<Object>} Response with content and usage stats
   */
  async sendMessage(messages, systemPrompt, options = {}) {
    if (!this.isEnabled || !this.client) {
      throw new Error('Claude API is not enabled or initialized');
    }

    try {
      const response = await this.client.messages.create({
        model: options.model || process.env.REACT_APP_CLAUDE_MODEL || 'claude-sonnet-4-5-20250929',
        max_tokens: options.max_tokens || parseInt(process.env.REACT_APP_CLAUDE_MAX_TOKENS || '4000'),
        temperature: options.temperature !== undefined ? options.temperature : 0.3,
        system: systemPrompt,
        messages: messages
      });

      return {
        content: response.content[0].text,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens,
          total_tokens: response.usage.input_tokens + response.usage.output_tokens
        },
        model: response.model,
        stopReason: response.stop_reason
      };
    } catch (error) {
      // Re-throw with enhanced error information
      const enhancedError = new Error(error.message);
      enhancedError.status = error.status;
      enhancedError.type = error.type;
      enhancedError.originalError = error;
      throw enhancedError;
    }
  }

  /**
   * Check if Claude API is available
   * @returns {boolean}
   */
  isAvailable() {
    return this.isEnabled && this.client !== null;
  }

  /**
   * Estimate token count for text
   * Rough estimation: ~4 characters per token for English text
   * @param {string} text - Text to estimate
   * @returns {number} Estimated token count
   */
  estimateTokens(text) {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
  }
}

// Singleton instance
export const claudeService = new ClaudeService();

/**
 * Convenience function to send message
 * @param {Array} messages - Conversation messages
 * @param {string} systemPrompt - System prompt
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response from Claude
 */
export async function sendMessage(messages, systemPrompt, options) {
  return claudeService.sendMessage(messages, systemPrompt, options);
}

/**
 * Check if Claude is enabled and available
 * @returns {boolean}
 */
export function isClaudeAvailable() {
  return claudeService.isAvailable();
}

/**
 * Estimate tokens for text
 * @param {string} text - Text to estimate
 * @returns {number} Token count
 */
export function estimateTokens(text) {
  return claudeService.estimateTokens(text);
}
