import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, ArrowLeft, Sparkles, Book, Info } from 'lucide-react';

const SharpAssistant = ({ onBack, userData, bibleData }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m SHARP, your Scripture Helper and Research Partner. I can help you with biblical questions, explain passages, find verses, discuss theology, and more. What would you like to know?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userQuestion) => {
    // Build context about the app's biblical content
    const context = {
      userProgress: {
        versesMemorized: userData.versesMemorized || 0,
        quizzesCompleted: userData.quizzesCompleted || 0,
        currentStreak: userData.currentStreak || 0,
        currentLevel: userData.currentLevel || 'Beginner'
      },
      availableFeatures: [
        'KJV, ASV, WEB, YLT Bible translations',
        'Strong\'s Concordance with Hebrew and Greek definitions',
        'Biblical courses (Greek, Hebrew, Hermeneutics, Apologetics, etc.)',
        'Study plans and memory verses',
        'Biblical dictionaries and lexicons',
        'Biblical Archaeology information',
        'Church History',
        'Biblical Canon history',
        'Textual Criticism'
      ]
    };

    // Analyze the question type
    const questionLower = userQuestion.toLowerCase();

    // Verse lookup pattern
    const versePattern = /\b([1-3]?\s*[a-z]+)\s+(\d+):(\d+)/i;
    const verseMatch = userQuestion.match(versePattern);

    if (verseMatch) {
      return generateVerseResponse(verseMatch[1].trim(), verseMatch[2], verseMatch[3]);
    }

    // Question type detection
    const questionTypes = {
      who: /^(who|whose)\b/i,
      what: /^(what|what's|whats)\b/i,
      when: /^when\b/i,
      where: /^where\b/i,
      why: /^why\b/i,
      how: /^how\b/i,
      define: /define|meaning|mean|definition/i,
      compare: /compare|difference|versus|vs\b/i,
      list: /list|name|tell me about/i,
      explain: /explain|describe|elaborate/i
    };

    // Detect question type
    let questionType = 'general';
    for (const [type, pattern] of Object.entries(questionTypes)) {
      if (pattern.test(questionLower)) {
        questionType = type;
        break;
      }
    }

    // Generate contextual response based on question type and content
    return generateContextualResponse(userQuestion, questionType, context);
  };

  const generateVerseResponse = (book, chapter, verse) => {
    return `**${book} ${chapter}:${verse}**

I can help you with this verse! Here's what I can tell you:

📖 **Finding the verse**: You can look up ${book} ${chapter}:${verse} in the Bible Reader section of Sword Drill. We have multiple translations available including KJV, ASV, and WEB.

🔍 **Studying deeper**: If you want to study the original languages, check out the Strong's Concordance feature to see the Hebrew (Old Testament) or Greek (New Testament) meanings of key words.

💡 **Context matters**: For better understanding, I recommend reading the surrounding verses and chapters. Would you like me to explain the context of ${book} chapter ${chapter}?

📚 **Related courses**: You might find the Hermeneutics course helpful for learning proper biblical interpretation methods.

What specific aspect of this verse would you like to explore?`;
  };

  const generateContextualResponse = (question, questionType, context) => {
    const questionLower = question.toLowerCase();

    // Biblical topics and common questions
    const topicResponses = {
      // Creation
      creation: () => `**Creation in the Bible**

The Bible presents creation in primarily two accounts:

📖 **Genesis 1-2**: The foundational creation narrative
- Genesis 1: Seven-day creation account (structured, poetic)
- Genesis 2: More detailed account focusing on humanity

🔑 **Key themes**:
- God as the sole Creator (ex nihilo - from nothing)
- Humanity created in God's image (imago Dei)
- Creation declared "very good"
- Sabbath rest established

📚 **Study resources in Sword Drill**:
- Biblical Canon course covers creation texts
- Hermeneutics course helps interpret Genesis
- Hebrew course to study original language

Would you like me to explain a specific aspect of creation?`,

      // Salvation
      salvation: () => `**Salvation in Scripture**

Salvation is a central biblical theme spanning both testaments.

📖 **Old Testament foundation**:
- Deliverance from Egypt (Exodus)
- Prophetic promises of a Messiah
- Faith and obedience emphasized

✝️ **New Testament fulfillment**:
- Jesus as the promised Savior
- Salvation by grace through faith (Ephesians 2:8-9)
- Justification, sanctification, glorification

🔑 **Key passages**:
- John 3:16 - God's love and gift
- Romans 3:23-24 - All have sinned
- Romans 10:9-10 - Confession and belief
- Ephesians 2:8-9 - Grace through faith

📚 **Recommended study**:
- Apologetics course covers salvation doctrine
- New Testament courses in Greek

What aspect of salvation would you like to explore further?`,

      // Prayer
      prayer: () => `**Biblical Teaching on Prayer**

Prayer is communion with God, found throughout Scripture.

📖 **Jesus' teaching**:
- The Lord's Prayer (Matthew 6:9-13, Luke 11:2-4)
- Private prayer emphasized (Matthew 6:6)
- Persistence in prayer (Luke 18:1-8)

🙏 **Types of prayer in Scripture**:
- Adoration - praising God's attributes
- Confession - acknowledging sin
- Thanksgiving - expressing gratitude
- Supplication - making requests

🔑 **Key prayer passages**:
- Philippians 4:6-7 - Prayer and peace
- 1 Thessalonians 5:17 - Pray continually
- James 5:16 - Righteous prayer is powerful
- Psalm 145:18 - God is near to those who call

📚 **Study tools**:
- Search "prayer" in Bible Reader
- Greek word studies (προσευχή - proseuche)

How can I help you understand prayer better?`,

      // Faith
      faith: () => `**Biblical Concept of Faith**

Faith is central to the biblical narrative and Christian life.

📖 **Definition**:
- Hebrews 11:1 - "Faith is confidence in what we hope for and assurance about what we do not see"

🔑 **Old Testament examples** (Hebrews 11):
- Abel's worship (v4)
- Enoch's walk with God (v5)
- Noah's obedience (v7)
- Abraham's journey (v8-19)
- Moses' leadership (v23-29)

✝️ **New Testament teaching**:
- Faith and works (James 2:14-26)
- Living by faith (Habakkuk 2:4, Romans 1:17)
- Faith as a gift (Ephesians 2:8)
- Shield of faith (Ephesians 6:16)

📚 **Study recommendations**:
- Apologetics course for faith defenses
- Hermeneutics for interpreting faith passages

What specific question about faith do you have?`,

      // Bible translations
      translations: () => `**Bible Translations in Sword Drill**

We offer several translations for your study:

📖 **Available translations**:
1. **KJV** (King James Version, 1611) - Traditional, poetic
2. **ASV** (American Standard Version, 1901) - Literal
3. **WEB** (World English Bible) - Modern, public domain
4. **YLT** (Young's Literal Translation) - Very literal
5. **KJV with Strong's** - Includes Hebrew/Greek reference numbers

🔍 **Using translations**:
- Compare verses across translations
- KJV for traditional language
- WEB for contemporary English
- Strong's for original language study

💡 **Translation philosophy**:
- Formal equivalence (word-for-word): ASV, YLT
- Dynamic equivalence (thought-for-thought): WEB
- Traditional approach: KJV

📚 **Learn more**:
- Textual Criticism course explains translation process
- Biblical Canon course covers Bible formation

Which translation would you like to know more about?`,

      // Default help
      default: () => `I can help you with many biblical topics! Here are some things you can ask me:

📖 **Bible Content**:
- Look up specific verses (e.g., "John 3:16")
- Explain biblical passages or concepts
- Find verses on specific topics
- Compare different Bible versions

🎓 **Learning & Study**:
- Information about biblical languages (Greek, Hebrew, Aramaic)
- Church history and biblical archaeology
- Doctrine and theology questions
- Biblical interpretation methods

💡 **App Features**:
- How to use different features in Sword Drill
- Recommendations for study courses
- Tips for Bible memorization
- Understanding your progress

🔍 **Examples of questions**:
- "What does John 3:16 mean?"
- "Who wrote the book of Romans?"
- "What is justification?"
- "Tell me about the Dead Sea Scrolls"
- "How do I study biblical Greek?"

What would you like to know?`
    };

    // Topic matching
    if (questionLower.includes('creation') || questionLower.includes('genesis 1')) {
      return topicResponses.creation();
    }
    if (questionLower.includes('salvation') || questionLower.includes('saved') || questionLower.includes('born again')) {
      return topicResponses.salvation();
    }
    if (questionLower.includes('prayer') || questionLower.includes('pray')) {
      return topicResponses.prayer();
    }
    if (questionLower.includes('faith') || questionLower.includes('believe') || questionLower.includes('trust god')) {
      return topicResponses.faith();
    }
    if (questionLower.includes('translation') || questionLower.includes('kjv') || questionLower.includes('version')) {
      return topicResponses.translations();
    }

    // Handle specific question types
    if (questionType === 'who' && questionLower.includes('jesus')) {
      return `**Who is Jesus?**

Jesus Christ is the central figure of Christianity and the New Testament.

✝️ **Biblical identity**:
- Son of God (Matthew 16:16, John 1:1-14)
- Second person of the Trinity
- Born of the virgin Mary (Luke 1-2)
- Fully God and fully human

📖 **Names and titles**:
- Christ/Messiah (Anointed One)
- Son of Man (Daniel 7:13-14)
- Lamb of God (John 1:29)
- King of Kings (Revelation 19:16)

🔑 **His work**:
- Perfect life and teaching
- Substitutionary death for sin
- Resurrection on the third day
- Ascension and future return

📚 **Study more**:
- Read the Gospels (Matthew, Mark, Luke, John)
- Apologetics course on Jesus' deity
- Greek course to study original texts

What specific aspect of Jesus would you like to understand better?`;
    }

    if (questionType === 'what' && questionLower.includes('gospel')) {
      return `**What is the Gospel?**

The Gospel means "good news" and is the core Christian message.

✝️ **The Gospel in brief**:
1. **God** - Holy, loving, and just Creator
2. **Man** - Created in God's image but fallen into sin (Romans 3:23)
3. **Christ** - God became man to save humanity
   - Lived a perfect life
   - Died for our sins (1 Corinthians 15:3-4)
   - Rose from the dead (Romans 6:4-5)
4. **Response** - Repent and believe (Mark 1:15, Acts 2:38)

📖 **Key Gospel passages**:
- John 3:16-17 - God's love and purpose
- Romans 5:8 - Christ died for us while sinners
- 1 Corinthians 15:1-4 - Gospel definition by Paul
- Ephesians 2:8-9 - Salvation by grace through faith

🔑 **Gospel elements**:
- Sin separates us from God
- Jesus bridges the gap
- Faith, not works, saves us
- New life in Christ

📚 **Learn more**:
- Apologetics course covers gospel presentation
- Study the book of Romans

Would you like me to explain a specific aspect of the gospel?`;
    }

    // Course-related questions
    if (questionLower.includes('course') || questionLower.includes('learn') || questionLower.includes('study')) {
      return `**Learning Opportunities in Sword Drill Academy**

We offer 13 comprehensive courses:

🗣️ **Languages** (6 courses):
- Koine Greek - New Testament language
- Ancient Hebrew - Old Testament language
- Paleo Hebrew - Ancient script
- Aramaic - Language Jesus spoke
- Ge'ez - Ethiopian Biblical language
- Amharic - Modern Ethiopian

📚 **Biblical Studies** (5 courses):
- Hermeneutics - Biblical interpretation
- Textual Criticism - Manuscript analysis
- Biblical Canon - How we got the Bible
- Apologetics - Defending the faith
- Biblical Archaeology - Ancient evidence

📜 **Historical Studies** (2 courses):
- Church History - Christianity's story
- Kings of Israel - OT rulers and prophets

🎓 **Benefits**:
- Focus Covenant system ensures quality study
- Earn course completion badges
- Graduate with Biblical Studies Certificate
- Scholarly citations and resources

Your current level: **${context.userProgress.currentLevel}**
Courses completed: Check your profile for progress

Which course interests you most?`;
    }

    // Default response with personalized info
    return topicResponses.default() + `

📊 **Your current progress**:
- Verses memorized: ${context.userProgress.versesMemorized}
- Quizzes completed: ${context.userProgress.quizzesCompleted}
- Current streak: ${context.userProgress.currentStreak} days
- Level: ${context.userProgress.currentLevel}

Feel free to ask me anything about the Bible or using Sword Drill!`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate thinking time for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      const response = await generateResponse(input);

      const assistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your question. Please try rephrasing your question or ask something else.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (content) => {
    // Convert markdown-like formatting to HTML
    let formatted = content
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Headers
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      // Line breaks
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');

    return formatted;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/30 to-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-b-2 border-indigo-500/50 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-indigo-300 hover:text-indigo-200 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SHARP Assistant</h1>
              <p className="text-xs text-indigo-300">Scripture Helper & Research Partner</p>
            </div>
          </div>
          <div className="w-16" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-indigo-900/30 border-b border-indigo-500/30 py-2 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-indigo-200">
          <Info size={16} />
          <span>Ask me anything about the Bible, theology, or how to use Sword Drill features!</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                    : 'bg-slate-800/50 border border-indigo-500/30 text-slate-200'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-indigo-500/30">
                    <Sparkles size={16} className="text-indigo-400" />
                    <span className="text-xs font-semibold text-indigo-400">SHARP</span>
                  </div>
                )}
                <div
                  className="prose prose-invert prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                />
                <div className="text-xs opacity-50 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/50 border border-indigo-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-indigo-400 animate-pulse" />
                  <span className="text-indigo-300">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-slate-900/50 border-t-2 border-indigo-500/50 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Scripture, theology, courses, or features..."
            className="flex-1 bg-slate-800 border-2 border-indigo-500/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2"
          >
            <Send size={20} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SharpAssistant;
