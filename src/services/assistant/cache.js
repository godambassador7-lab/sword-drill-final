/**
 * Response Cache for SHARP Assistant
 * Caches Claude API responses to reduce API calls and improve performance
 */

class ResponseCache {
  constructor(maxSize = 100, ttl = 30 * 60 * 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl; // Time to live in milliseconds (default: 30 minutes)
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Generate cache key from query and context
   * @param {string} query - User's question
   * @param {Object} context - Request context
   * @returns {string} Cache key
   */
  generateKey(query, context = {}) {
    // Normalize query
    const normalizedQuery = query.toLowerCase().trim();

    // Include relevant context in key
    const contextKey = JSON.stringify({
      translation: context.selectedTranslation || 'ESV'
      // Don't include conversation history in cache key
      // Each unique question should be cacheable regardless of history
    });

    return `${normalizedQuery}|${contextKey}`;
  }

  /**
   * Get cached response
   * @param {string} query - User's question
   * @param {Object} context - Request context
   * @returns {Object|null} Cached response or null
   */
  get(query, context = {}) {
    const key = this.generateKey(query, context);
    const cached = this.cache.get(key);

    if (!cached) {
      this.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return cached.value;
  }

  /**
   * Set cache entry
   * @param {string} query - User's question
   * @param {Object} context - Request context
   * @param {Object} value - Response to cache
   */
  set(query, context = {}, value) {
    const key = this.generateKey(query, context);

    // LRU eviction if cache is full
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry (first in Map)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value: value,
      timestamp: Date.now()
    });
  }

  /**
   * Clear entire cache
   */
  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getStats() {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? (this.hits / total * 100).toFixed(2) : 0;

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: `${hitRate}%`,
      ttl: this.ttl
    };
  }

  /**
   * Remove expired entries
   */
  cleanup() {
    const now = Date.now();
    const keysToDelete = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));

    return keysToDelete.length;
  }
}

// Singleton instance for response caching
export const responseCache = new ResponseCache(100, 30 * 60 * 1000); // 100 entries, 30 min TTL

// Periodic cleanup (every 5 minutes)
if (typeof window !== 'undefined') {
  setInterval(() => {
    const removed = responseCache.cleanup();
    if (removed > 0) {
      console.log(`Cache cleanup: removed ${removed} expired entries`);
    }
  }, 5 * 60 * 1000);
}

/**
 * Context Cache for retrieved reference materials
 * Shorter TTL since context is cheaper to retrieve
 */
class ContextCache extends ResponseCache {
  constructor() {
    super(50, 5 * 60 * 1000); // 50 entries, 5 min TTL
  }

  generateKey(query, classification) {
    const normalizedQuery = query.toLowerCase().trim();
    const classificationKey = JSON.stringify({
      category: classification?.category,
      subcategory: classification?.subcategory
    });

    return `${normalizedQuery}|${classificationKey}`;
  }
}

export const contextCache = new ContextCache();

/**
 * Simple in-memory cache for dictionary/lexicon data
 * Persists for session lifetime
 */
class ReferenceCache {
  constructor() {
    this.cache = new Map();
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value) {
    this.cache.set(key, value);
  }

  has(key) {
    return this.cache.has(key);
  }

  clear() {
    this.cache.clear();
  }
}

export const referenceCache = new ReferenceCache();
