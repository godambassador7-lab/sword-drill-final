import React, { useState, useCallback, useRef, useEffect } from 'react';
import { answerQuery } from './assistant/pipeline';

const SHARP_ASSISTANT_ENABLED = true;

// Typing animation component
const TypingText = ({ text, speed = 20, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete && currentIndex === text.length && currentIndex > 0) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return <span className="whitespace-pre-wrap text-sm">{displayedText}</span>;
};

const SharpAssistant = ({ userData, userId }) => {
  const [query, setQuery] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typingMessageIndex, setTypingMessageIndex] = useState(null);
  const conversationEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory]);

  const handleQuery = useCallback(async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = query.trim();
    setQuery('');
    setLoading(true);
    setError(null);

    // Add user message to history
    setConversationHistory(prev => [...prev, {
      type: 'user',
      content: userMessage,
      timestamp: Date.now()
    }]);

    try {
      const result = await answerQuery(userMessage, {
        userId: userId,
        selectedTranslation: userData.selectedTranslation || 'KJV',
        conversationHistory: conversationHistory,
      });

      setLoading(false);

      // Add assistant response to history with typing flag
      setConversationHistory(prev => {
        const newHistory = [...prev, {
          type: 'assistant',
          content: result.answer,
          citations: result.citations,
          metadata: result.metadata,
          timestamp: Date.now(),
          isTyping: true
        }];
        setTypingMessageIndex(newHistory.length - 1);
        return newHistory;
      });
    } catch (err) {
      console.error("Error fetching from SHARP Assistant:", err);
      setError("Sorry, an error occurred while fetching the answer.");

      // Remove the user message if there was an error
      setConversationHistory(prev => prev.slice(0, -1));
      setLoading(false);
    }
  }, [query, userData, userId, conversationHistory]);

  const handleClearHistory = useCallback(() => {
    setConversationHistory([]);
    setError(null);
    setTypingMessageIndex(null);
  }, []);

  const handleTypingComplete = useCallback((index) => {
    setConversationHistory(prev =>
      prev.map((msg, i) => i === index ? { ...msg, isTyping: false } : msg)
    );
    setTypingMessageIndex(null);
  }, []);

  if (!SHARP_ASSISTANT_ENABLED) return null;

  return (
    <div className="p-4 rounded-lg text-white border border-purple-500/50 max-w-2xl mx-auto mt-8 mb-24 relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900">
      {/* Nebula glimmer effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h2 className="text-2xl font-bold text-center flex-grow bg-gradient-to-r from-purple-300 via-blue-300 to-pink-300 bg-clip-text text-transparent">SHARP Assistant</h2>
        {conversationHistory.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="text-sm px-3 py-1 bg-slate-700/80 hover:bg-slate-600/80 rounded border border-slate-600 transition-colors"
            title="Clear conversation"
          >
            Clear
          </button>
        )}
      </div>

      {/* Conversation History */}
      {conversationHistory.length > 0 && (
        <div className="relative z-10 mb-4 max-h-96 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-slate-800">
          {conversationHistory.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-900/40 border border-blue-700/50 ml-8'
                  : 'bg-slate-900/80 border border-purple-700/50 mr-8'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-xs uppercase tracking-wide text-purple-300">
                  {message.type === 'user' ? 'You' : 'S.H.A.R.P.'}
                </span>
              </div>
              {message.type === 'assistant' && message.isTyping ? (
                <TypingText
                  text={message.content}
                  speed={20}
                  onComplete={() => handleTypingComplete(index)}
                />
              ) : (
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              )}
              {message.citations && message.citations.length > 0 && !message.isTyping && (
                <div className="mt-2 pt-2 border-t border-slate-700">
                  <h4 className="font-bold text-xs mb-1">Citations:</h4>
                  <ul className="list-disc list-inside text-xs">
                    {message.citations.map((c, cidx) => (
                      <li key={cidx}>{c.ref} ({c.translation})</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          <div ref={conversationEndRef} />
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleQuery} className="flex gap-2 mb-2 relative z-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={conversationHistory.length > 0 ? "Ask a follow-up question..." : "Ask a question (e.g., 'John 3:16', 'who is David?', 'my stats')"}
          className="flex-grow p-2 rounded bg-slate-700/80 backdrop-blur border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-500 disabled:cursor-not-allowed"
          disabled={loading || !query.trim()}
        >
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </form>

      {loading && (
        <div className="text-center p-2 relative z-10 text-sm text-purple-300">
          Thinking...
        </div>
      )}
      {error && (
        <div className="p-3 rounded bg-red-900/80 border border-red-700 text-white relative z-10 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default SharpAssistant;
