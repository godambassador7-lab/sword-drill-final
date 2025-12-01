import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Target, Flame, Trophy, Calendar, Zap, Brain, Award, Coins, Star, TrendingUp, Shield, Users, Clock, CheckCircle, AlertCircle, Info, Lightbulb } from 'lucide-react';

const TutorialHelp = ({ onBack }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      subsections: [
        {
          title: 'Welcome to Sword Drill!',
          content: 'Sword Drill is your ultimate Bible memorization companion. The name comes from the competitive Bible verse finding game, but this app goes far beyond that to help you master Scripture through spaced repetition, multiple quiz types, and gamified progression.',
          tips: [
            'Start with Memory Verse Practice to build your foundation',
            'Complete quizzes daily to maintain your streak',
            'Focus on mastering verses before moving to harder content'
          ]
        },
        {
          title: 'How to Navigate',
          content: 'Use the menu button (☰) in the top right to access all features. The home screen shows your current level, points, and available quiz modes. Your progress is automatically saved to the cloud when logged in.',
          tips: [
            'Check your Calendar & Plans daily for streak tracking',
            'Visit Settings to customize sound, difficulty, and preferences',
            'Review your achievements regularly to see your progress'
          ]
        }
      ]
    },
    {
      id: 'quiz-modes',
      title: 'All Quiz Modes Explained',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      subsections: [
        {
          title: 'Memory Verse Practice (Fill-in-the-Blank)',
          content: 'The core of Sword Drill! Practice memorizing verses through fill-in-the-blank exercises. Verses use spaced repetition - you\'ll see difficult verses more often until you master them.',
          tips: [
            'A verse is "mastered" after 3+ correct answers with 0 incorrect',
            'Mastered verses appear less frequently',
            'Use the Enhanced Review feature after wrong answers to reinforce learning',
            'Points earned: 10-40 based on your level'
          ]
        },
        {
          title: 'Reference Recall',
          content: 'Test your ability to identify where a verse is located in the Bible. You\'ll see a verse and need to type the correct book, chapter, and verse reference.',
          tips: [
            'Common variations are accepted (e.g., "Psalms" vs "Psalm")',
            'Include chapter and verse numbers (e.g., "John 3:16")',
            'Fuzzy matching helps with minor spelling variations',
            'Points earned: 15-60 based on your level'
          ]
        },
        {
          title: 'Verse Scramble',
          content: 'Unscramble jumbled words to reconstruct the original verse. Click words in the correct order to rebuild the verse. 3 incorrect placements will fail the quiz.',
          tips: [
            'Words turn green when placed correctly, red when incorrect',
            'Use the "Undo Last Word" button to fix mistakes',
            'Reset the quiz anytime if you get stuck',
            'Available in Practice Review for missed verses',
            'Points earned: 20-80 based on your level'
          ]
        },
        {
          title: 'Book Order Challenge',
          content: 'Arrange books of the Bible in the correct canonical order. Master all 66 books from Genesis to Revelation!',
          tips: [
            'Learn the major sections: Law, History, Poetry, Prophets, Gospels, Letters',
            'Start with familiar books, then learn the minor prophets',
            'Time-based scoring rewards quick completion',
            'Points earned: 25-100 based on your level'
          ]
        },
        {
          title: 'Sword Drill Ultimate',
          content: 'The ultimate challenge! Race against time to find and recall verses with epic background music and increasing difficulty. Your max streak and speed matter here.',
          tips: [
            'Cinematic background music plays only during this mode',
            'Build combos by answering multiple questions correctly',
            'Speed bonuses for answers under 5 seconds',
            'Perfect rounds earn massive bonus points',
            'Points earned: Variable based on performance'
          ]
        },
        {
          title: '🔍 Verse Detective',
          content: 'A detective-style investigation game where you uncover the mystery verse through progressive clues. Collect evidence, use your deduction skills, and solve the case before time runs out!',
          tips: [
            '60-second timer - Points based on time remaining when you submit',
            'Collect clues (evidence) to reveal hints about the verse',
            'Use fewer clues for higher point rewards',
            'WARNING: Wrong answers cost -50 points (regular) or -10 points (personal verses)!',
            'Purchase hints (50 pts) to reveal clues automatically',
            'Eliminate wrong options for 100 pts',
            'Regular mode: Up to 350 points per completion, -50 penalty for wrong answers',
            'Personal verses mode: 5 points max, -10 penalty, limited to 3 completions per day',
            'Advanced patterns: Gospel verses, NT-quotes-OT trick questions, and more'
          ]
        },
        {
          title: 'Biblical Spelling Bee',
          content: 'Test your knowledge of biblical names, places, and terms with this challenging spelling competition. Perfect for learning proper pronunciation and spelling of difficult biblical words.',
          tips: [
            'Pay attention to Hebrew and Greek origin words',
            'Listen carefully to pronunciation clues',
            'Learn common biblical name patterns',
            'Great for improving biblical literacy'
          ]
        },
        {
          title: 'Biblical GeoGuessr',
          content: 'Explore the geography of the Bible! Identify biblical locations, understand ancient maps, and discover where key events took place.',
          tips: [
            'Study ancient Middle East geography',
            'Connect locations to biblical events',
            'Learn modern vs. ancient place names',
            'Visualize journeys of key biblical figures'
          ]
        },
        {
          title: 'Bible Trivia',
          content: 'Test your general Bible knowledge with trivia questions covering people, events, books, and theology from both Old and New Testaments.',
          tips: [
            'Covers broad biblical knowledge',
            'Great for learning new facts',
            'Mix of easy, medium, and hard questions',
            'Earn points while expanding your understanding'
          ]
        },
        {
          title: 'Greek Language Quizzes',
          content: 'Master Biblical Greek through multiple quiz types: Alphabet (learning Greek letters), Vocabulary (memorizing Greek words), Articles (ὁ, ἡ, τό), Noun Declensions, Verb Conjugations, and Case identification.',
          tips: [
            'Start with Greek Alphabet Quiz to learn letters',
            'Progress to Vocabulary for common NT words',
            'Master Articles, Cases, and Declensions progressively',
            'Verb Conjugations cover tenses and moods',
            'Essential for reading the New Testament in Greek'
          ]
        }
      ]
    },
    {
      id: 'progression-system',
      title: 'Progression & Levels',
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-600',
      subsections: [
        {
          title: 'Understanding Levels',
          content: 'You progress through 4 difficulty levels: Beginner, Intermediate, Advanced, and Elite. Each level increases the challenge and rewards.',
          tips: [
            'Beginner: Earn 1.0x points, lose -10 points per mistake',
            'Intermediate: Earn 1.5x points, lose -20 points per mistake',
            'Advanced: Earn 2.0x points, lose -35 points per mistake',
            'Elite: Earn 3.0x points, lose -50 points per mistake'
          ]
        },
        {
          title: 'Leveling Up Requirements',
          content: 'To advance levels, you must meet ALL three requirements: verses mastered, quizzes completed, and streak days maintained.',
          tips: [
            'Beginner → Intermediate: 25 verses, 50 quizzes, 7-day streak',
            'Intermediate → Advanced: 75 verses, 150 quizzes, 21-day streak',
            'Advanced → Elite: 200 verses, 500 quizzes, 90-day streak',
            'Check your Progress Dashboard to see what you need next'
          ]
        },
        {
          title: 'Point System',
          content: 'Earn points for correct answers, maintaining streaks, and completing challenges. Lose points for mistakes. Higher levels earn more but also risk more!',
          tips: [
            'First quiz of the day: +20 bonus points',
            'Daily streak maintained: +5 points per day (max 10 days)',
            'Perfect quizzes earn +50 bonus points',
            'Speed bonuses: +25 for quick correct answers',
            'Inactivity penalty: -10 per day (max 7 days)'
          ]
        }
      ]
    },
    {
      id: 'streaks-calendar',
      title: 'Streaks & Calendar',
      icon: Flame,
      color: 'from-orange-500 to-red-600',
      subsections: [
        {
          title: 'How Streaks Work',
          content: 'Your streak counts consecutive days where you answered at least one quiz correctly. Maintaining streaks earns daily bonus points and is required for leveling up.',
          tips: [
            'Streak starts when you get your first correct answer of the day',
            'Grace period: You have until the end of the next day to continue',
            'Streaks earn +5 bonus points per day maintained (capped at 10 days)',
            'Visual indicators show streak status on your calendar',
            'Flame colors change at milestone streaks (7, 30, 100+ days)'
          ]
        },
        {
          title: 'Calendar Features',
          content: 'The Calendar view shows your daily activity, streak progress, and lets you create learning plans with specific goals.',
          tips: [
            'Orange flames indicate days with completed quizzes',
            'Click on days to see detailed quiz history',
            'Create learning plans with target dates and quiz types',
            'Track your consistency over weeks and months',
            'Use plans to stay motivated and accountable'
          ]
        },
        {
          title: 'Learning Plans',
          content: 'Set specific goals like "Master 50 verses in 30 days" with your preferred quiz type and target dates. Mark plans complete when achieved!',
          tips: [
            'Be realistic with your goals to avoid burnout',
            'Choose "Any Quiz Type" for maximum flexibility',
            'Set days per week targets (3-5 days is sustainable)',
            'Review and adjust plans monthly',
            'Celebrate completed plans as major milestones!'
          ]
        }
      ]
    },
    {
      id: 'achievements',
      title: 'Achievements & Rewards',
      icon: Trophy,
      color: 'from-yellow-500 to-amber-600',
      subsections: [
        {
          title: 'Achievement System',
          content: 'Unlock special achievements by reaching milestones in quizzes completed, streaks maintained, verses mastered, and points earned. Each achievement displays a unique badge.',
          tips: [
            'Achievements are permanent once unlocked',
            'Check locked achievements to see what to aim for next',
            'Some achievements unlock special features',
            'Achievement points contribute to your total score',
            'Rare achievements give bragging rights!'
          ]
        },
        {
          title: 'Unlockables',
          content: 'Earn special Bible translations and features as you progress: Masoretic Text, LXX (Septuagint), Codex Sinaiticus, and the Eli Challenge.',
          tips: [
            'Unlockables require specific point thresholds',
            'Ancient texts provide historical Bible study resources',
            'Eli Challenge is an advanced difficulty mode',
            'Use unlocked content to deepen your Bible knowledge',
            'More unlockables coming in future updates!'
          ]
        }
      ]
    },
    {
      id: 'courses-interactive',
      title: 'Courses & Interactive Features',
      icon: Users,
      color: 'from-teal-500 to-cyan-600',
      subsections: [
        {
          title: 'Κοινή Greek Course',
          content: 'A comprehensive multi-level course in Biblical (Koine) Greek! Learn to read and understand the New Testament in its original language through structured lessons covering alphabet, vocabulary, grammar, syntax, and translation.',
          tips: [
            'Progress through 3 levels: Basic, Intermediate, Advanced',
            'Covers Greek alphabet, pronunciation, and writing',
            'Learn 500+ essential New Testament vocabulary words',
            'Master noun declensions, verb conjugations, and cases',
            'Practice with real NT passages and translations',
            'Includes quizzes to test and reinforce learning'
          ]
        },
        {
          title: 'Ancient Hebrew Course',
          content: 'Dive deep into Biblical Hebrew with this comprehensive 3-level course! Master the ancient language of the Old Testament, learning alphabet, grammar, vocabulary, and textual analysis.',
          tips: [
            '3 difficulty levels from beginner to advanced',
            'Learn the Hebrew alphabet (Aleph to Tav)',
            'Study vowel points (Niqqud) and pronunciation',
            'Master Hebrew vocabulary and root systems',
            'Understand Hebrew grammar and sentence structure',
            'Read and analyze passages from the Hebrew Bible'
          ]
        },
        {
          title: 'Hermeneutics Course',
          content: 'Master the art and science of biblical interpretation! This course teaches you proper methods for understanding, interpreting, and applying Scripture through historical, grammatical, literary, and theological approaches.',
          tips: [
            'Learn principles of sound biblical interpretation',
            'Understand context: historical, cultural, and literary',
            'Study different genres: narrative, poetry, prophecy, epistles',
            'Avoid common interpretation errors and fallacies',
            'Apply hermeneutical principles to real passages',
            'Essential for teachers, preachers, and serious students'
          ]
        },
        {
          title: 'Church History Course',
          content: 'Journey through 2000 years of church history! Explore key events, figures, councils, movements, and developments from the early church through modern times.',
          tips: [
            'Covers Early Church, Medieval, Reformation, and Modern periods',
            'Learn about church fathers, councils, and creeds',
            'Understand major theological controversies and resolutions',
            'Trace the development of Christian doctrine',
            'Discover influential leaders and movements',
            'Connect historical events to contemporary Christianity'
          ]
        },
        {
          title: 'Kings of Israel Course',
          content: 'An in-depth study of the monarchs of Israel and Judah! Learn about each king\'s reign, accomplishments, failures, and spiritual legacy from Saul through the exile.',
          tips: [
            'Study all kings of united Israel, northern Israel, and Judah',
            'Understand the divided kingdom period',
            'Learn about godly kings (David, Josiah) and wicked ones (Ahab, Manasseh)',
            'See how leadership affects national spiritual condition',
            'Trace prophetic ministry during various reigns',
            'Understand the lead-up to exile and restoration'
          ]
        },
        {
          title: 'Spiritual Gifts Exam',
          content: 'Discover your spiritual gifts! This comprehensive assessment helps you identify your God-given gifts and calling through biblical questions about talents, passions, and ministry effectiveness.',
          tips: [
            'Based on biblical gifts: teaching, prophecy, service, mercy, etc.',
            'Answer honestly about your experiences and inclinations',
            'Results show your top spiritual gifts ranked',
            'Learn how to develop and use your gifts',
            'Understand how gifts work together in the Body of Christ',
            'Use results to guide ministry and service opportunities'
          ]
        },
        {
          title: 'Bible Reading Plans',
          content: 'Follow structured reading plans to read through the entire Bible systematically. Choose from multiple plans: chronological, canonical, thematic, or custom schedules.',
          tips: [
            'Select plans based on your goals and timeline',
            'Track daily progress with checkmarks',
            'See percentages and estimated completion dates',
            'Mix reading plans with quiz practice',
            'Stay consistent with daily reading habits',
            'Use plans to guide devotional time'
          ]
        },
        {
          title: 'Bible Reader & Lexicons',
          content: 'Read any passage with built-in tools! Access Greek and Hebrew lexicons, Strong\'s concordance, cross-references, and multiple translations side-by-side.',
          tips: [
            'Search any verse or passage instantly',
            'Compare translations side-by-side',
            'Click words for Greek/Hebrew definitions',
            'Access Strong\'s numbers and concordance',
            'See cross-references and related verses',
            'Perfect for in-depth Bible study'
          ]
        },
        {
          title: 'Personal Verse Bank',
          content: 'Build your personal collection of meaningful verses! Save, organize, tag, and review verses that are important to you for memorization or meditation.',
          tips: [
            'Save verses from any quiz or reading',
            'Add personal notes and reflections',
            'Organize with custom tags and categories',
            'Quick access for review and meditation',
            'Export or share your favorite verses',
            'Use for focused memorization practice'
          ]
        }
      ]
    },
    {
      id: 'advanced-features',
      title: 'Advanced Features',
      icon: Zap,
      color: 'from-indigo-500 to-purple-600',
      subsections: [
        {
          title: 'Spaced Repetition',
          content: 'The app uses proven spaced repetition algorithms to show you verses at optimal intervals. Verses you struggle with appear more often until mastered.',
          tips: [
            'Don\'t worry if you see the same verse multiple times',
            'This is scientifically proven to improve retention',
            'Review mode helps reinforce difficult verses',
            'Mastered verses still appear occasionally for maintenance'
          ]
        },
        {
          title: 'Enhanced Review Modal',
          content: 'After incorrect fill-in-the-blank answers, you enter an enhanced review session with the full verse, memory techniques, and bonus recovery points.',
          tips: [
            'Read the full verse carefully during review',
            'Use provided memory tips and mnemonic devices',
            'Complete the review to earn bonus recovery points',
            'Reviews help turn mistakes into learning opportunities'
          ]
        },
        {
          title: 'Memory Tips',
          content: 'Random memory tips appear after incorrect answers, teaching proven memorization techniques like visualization, chunking, and association.',
          tips: [
            'Apply tips to your next study session',
            'Experiment with different techniques',
            'Visual learners: use imagery and location methods',
            'Auditory learners: read verses aloud repeatedly'
          ]
        },
        {
          title: 'Personal Verse Bank',
          content: 'Save verses you want to focus on for quick access and targeted practice. Your personal collection grows as you discover meaningful passages. Practice with your verses using any verse-based quiz mode!',
          tips: [
            'Add verses from Bible Reader by clicking the bookmark icon',
            'Practice with Fill-in-the-Blank, Multiple Choice, Reference Recall, or Verse Scramble',
            '🔍 NEW: Verse Detective for Personal Verses!',
            'Personal Verse Detective awards 5 points maximum per completion',
            'Limited to 3 point-earning completions per day (can still practice after limit)',
            'Organize your collection by filtering by book',
            'Sort by date added or reference order'
          ]
        }
      ]
    },
    {
      id: 'sharp-assistant',
      title: 'Sharp Assistant - Your AI Bible Tutor',
      icon: Lightbulb,
      color: 'from-yellow-500 to-amber-600',
      subsections: [
        {
          title: 'What is Sharp Assistant?',
          content: 'Sharp Assistant is your intelligent AI-powered Bible study companion! Named after Hebrews 4:12 ("the word of God is living and active, sharper than any two-edged sword"), this advanced assistant helps you explore Scripture, answer questions, and deepen your understanding through natural conversation.',
          tips: [
            'Access Sharp Assistant from the home screen',
            'Ask questions in plain English',
            'Get instant answers with verse references',
            'Available 24/7 for all your Bible questions',
            'Powered by advanced language models and Bible databases'
          ]
        },
        {
          title: 'How to Use Sharp Assistant',
          content: 'Simply type or speak your Bible question, and Sharp Assistant will provide detailed, scripture-based answers. Ask about verse meanings, historical context, theological concepts, word studies, cross-references, or practical applications.',
          tips: [
            'Type questions like "What does John 3:16 mean?"',
            'Ask for context: "What was happening in Acts 2?"',
            'Request word studies: "What does agape mean in Greek?"',
            'Find cross-references: "Where else is faith mentioned?"',
            'Explore themes: "What does the Bible say about prayer?"',
            'Get practical help: "How do I apply Romans 12 to my life?"'
          ]
        },
        {
          title: 'Sharp Assistant Capabilities',
          content: 'Sharp Assistant can search your chosen translation, provide verse explanations with context, look up Greek and Hebrew word meanings using lexicons, find related passages, explain theological concepts, suggest memory techniques, and recommend relevant courses or quizzes.',
          tips: [
            'Searches across your entire Bible translation',
            'Access to Greek and Hebrew lexicons',
            'Provides historical and cultural context',
            'Explains difficult passages and theology',
            'Suggests related verses and themes',
            'Recommends study resources based on your questions',
            'Can help with memorization strategies'
          ]
        },
        {
          title: 'Example Questions to Ask',
          content: 'Try asking: "Explain Ephesians 2:8-9", "What is the context of Psalm 23?", "Define justification", "Show me verses about love", "What Greek word is used for love in 1 Corinthians 13?", "How do I memorize long passages?", "What course should I take to learn Greek?"',
          tips: [
            '"What does [verse reference] mean?"',
            '"Explain the parable of [name]"',
            '"What is the Greek/Hebrew word for [term]?"',
            '"Show me verses about [topic]"',
            '"What is the context of [passage]?"',
            '"How do I apply [verse] to my life?"',
            '"What courses cover [subject]?"',
            '"Help me understand [theological concept]"'
          ]
        },
        {
          title: 'Sharp Assistant Best Practices',
          content: 'For best results, be specific in your questions, mention verse references when relevant, ask follow-up questions to go deeper, use it alongside your Bible reading, verify answers with multiple sources, and share interesting findings with your study group.',
          tips: [
            'Be specific rather than vague',
            'Include verse references for context',
            'Ask follow-up questions to dig deeper',
            'Cross-reference answers with your Bible',
            'Use it as a study tool, not a replacement for Scripture',
            'Combine AI assistance with human teachers',
            'Save helpful answers for future reference'
          ]
        },
        {
          title: 'Privacy & Accuracy',
          content: 'Sharp Assistant respects your privacy - conversations are processed securely. While highly accurate, always verify important theological conclusions with Scripture, trusted teachers, and the Holy Spirit\'s guidance. The assistant is a tool to enhance, not replace, personal Bible study.',
          tips: [
            'Your conversations are secure and private',
            'AI is a helpful tool, not an authority',
            'Always verify with Scripture itself',
            'Consult pastors/teachers for major decisions',
            'Use discernment with all answers',
            'The Holy Spirit is your ultimate guide',
            'Sharp Assistant helps, but doesn\'t replace prayer and study'
          ]
        }
      ]
    },
    {
      id: 'settings-customization',
      title: 'Settings & Customization',
      icon: Shield,
      color: 'from-slate-500 to-slate-700',
      subsections: [
        {
          title: 'Sound Settings',
          content: 'Control audio feedback with separate toggles and volume controls for sound effects (correct/incorrect) and background music (Sword Drill Ultimate).',
          tips: [
            'Sound effects provide instant feedback on answers',
            'Background music only plays during Sword Drill Ultimate',
            'Adjust volumes independently for your preference',
            'Disable sounds for quiet study environments'
          ]
        },
        {
          title: 'Bible Translation',
          content: 'Choose your preferred Bible translation for all quizzes. Options include KJV, NKJV, NIV, ESV, and more as you unlock them.',
          tips: [
            'Use the translation you\'re most familiar with',
            'Switch translations to cross-reference verses',
            'Modern translations (NIV, ESV) are often easier to memorize',
            'Classic translations (KJV) are traditional and poetic'
          ]
        },
        {
          title: 'Difficulty & Preferences',
          content: 'Customize your experience with options for verse difficulty, quiz length, time limits, and accessibility features.',
          tips: [
            'Start with easier settings and gradually increase difficulty',
            'Adjust time limits if you\'re a slower reader',
            'Enable high contrast mode for better visibility',
            'Your settings sync across devices when logged in'
          ]
        }
      ]
    },
    {
      id: 'tips-tricks',
      title: 'Pro Tips & Strategies',
      icon: Brain,
      color: 'from-green-500 to-emerald-600',
      subsections: [
        {
          title: 'Daily Routine',
          content: 'Build a consistent daily habit for maximum retention and progress. Even 10 minutes per day is better than sporadic long sessions.',
          tips: [
            'Set a specific time each day (morning or evening works best)',
            'Start with 1-3 quizzes to maintain your streak',
            'Gradually increase volume as the habit solidifies',
            'Use reminders or alarms if needed',
            'Pair with existing habits (e.g., after breakfast)'
          ]
        },
        {
          title: 'Memorization Techniques',
          content: 'Leverage proven methods: visualization (picture the scene), chunking (break into phrases), repetition (review 3-7 times), and association (link to personal experiences).',
          tips: [
            'Write verses by hand to engage motor memory',
            'Create mental "memory palaces" for longer passages',
            'Use acronyms for lists (books of Bible, key points)',
            'Record yourself reciting and listen repeatedly',
            'Teach verses to others to reinforce retention'
          ]
        },
        {
          title: 'Maximizing Points',
          content: 'Strategic play earns more points: maintain daily streaks, aim for perfect quizzes, answer quickly for speed bonuses, and level up for multipliers.',
          tips: [
            'Never break your streak - set daily reminders',
            'Focus on accuracy first, then work on speed',
            'Perfect quizzes give 50+ bonus points',
            'Higher levels multiply your base points significantly',
            'Complete first quiz of day early for +20 bonus'
          ]
        },
        {
          title: 'Avoiding Burnout',
          content: 'Bible memorization is a marathon, not a sprint. Balance challenge with enjoyment, take rest days when needed, and celebrate small wins.',
          tips: [
            'It\'s okay to have easier days - maintain the streak',
            'Vary quiz types to keep things interesting',
            'Don\'t obsess over perfect scores every time',
            'Remember the spiritual purpose beyond the game',
            'Join community groups for encouragement'
          ]
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting & FAQ',
      icon: AlertCircle,
      color: 'from-red-500 to-pink-600',
      subsections: [
        {
          title: 'Common Issues',
          content: 'Solutions to frequent problems: data not saving, streak not updating, quiz not loading, or sounds not playing.',
          tips: [
            'Data not saving: Check internet connection and login status',
            'Streak not updating: Complete a quiz with correct answer',
            'Quiz not loading: Refresh the page or clear browser cache',
            'Sounds not playing: Check volume settings and browser permissions',
            'Performance issues: Close other tabs and apps'
          ]
        },
        {
          title: 'Frequently Asked Questions',
          content: 'Q: How is a verse "mastered"? A: 3+ correct answers with 0 incorrect in that quiz type. Q: Can I reset my progress? A: Yes, in Settings > Advanced. Q: Does streak count if I only do one quiz? A: Yes, any correct answer maintains the streak.',
          tips: [
            'Progress is per-quiz-type (mastering fill-blank ≠ mastering scramble)',
            'You can practice the same verse in different quiz modes',
            'Streak requires at least one correct answer per day',
            'Points can go negative but will stop at 0',
            'Cloud sync requires being logged in with Firebase'
          ]
        },
        {
          title: 'Getting Help',
          content: 'Need more assistance? Check the GitHub issues page, join the community Discord, or contact support through the feedback form.',
          tips: [
            'Include screenshots when reporting bugs',
            'Check if your issue is already reported',
            'Be specific about what you were doing when the issue occurred',
            'Provide your browser and device information',
            'Feature requests are welcome!'
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <button
            onClick={onBack}
            className="mb-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
          >
            ← Back to Menu
          </button>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Info className="text-blue-400 animate-pulse" size={48} />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Tutorial & Help Center
            </h1>
          </div>
          <p className="text-slate-300 text-lg">
            Your comprehensive guide to mastering Sword Drill
          </p>
        </div>

        {/* Animated Welcome Card */}
        <div className="mb-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50 rounded-2xl p-6 animate-pulse-slow">
          <div className="flex items-start gap-4">
            <BookOpen className="text-blue-400 flex-shrink-0 mt-1" size={32} />
            <div>
              <h2 className="text-2xl font-bold text-blue-400 mb-2">Welcome to Your Bible Mastery Journey!</h2>
              <p className="text-slate-300 leading-relaxed">
                This interactive guide will walk you through every feature of Sword Drill. Click on any section below to expand it and discover tips, strategies, and best practices. The arrows (→) indicate there's more to explore!
              </p>
            </div>
          </div>
        </div>

        {/* Tutorial Sections */}
        <div className="space-y-4">
          {sections.map((section, sectionIndex) => {
            const Icon = section.icon;
            const isExpanded = expandedSections[section.id];

            return (
              <div
                key={section.id}
                className="bg-slate-800/50 border-2 border-slate-700 rounded-xl overflow-hidden transition-all duration-300 hover:border-slate-600"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${sectionIndex * 0.1}s both`
                }}
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`w-full px-6 py-5 flex items-center justify-between transition-all duration-300 ${
                    isExpanded ? 'bg-gradient-to-r ' + section.color : 'hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Icon
                      className={`${isExpanded ? 'text-white' : 'text-slate-400'} transition-all`}
                      size={28}
                    />
                    <h2 className={`text-2xl font-bold ${isExpanded ? 'text-white' : 'text-slate-300'}`}>
                      {section.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isExpanded && (
                      <ChevronRight className="text-slate-400 animate-bounce-horizontal" size={24} />
                    )}
                    <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown className={isExpanded ? 'text-white' : 'text-slate-400'} size={28} />
                    </div>
                  </div>
                </button>

                {/* Section Content */}
                {isExpanded && (
                  <div className="px-6 py-4 space-y-6 animate-slideDown">
                    {section.subsections.map((subsection, subIndex) => (
                      <div
                        key={subIndex}
                        className="bg-slate-900/50 rounded-lg p-5 border border-slate-700"
                        style={{
                          animation: `fadeInUp 0.3s ease-out ${subIndex * 0.1}s both`
                        }}
                      >
                        <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                          <ChevronRight className="text-amber-400" size={20} />
                          {subsection.title}
                        </h3>
                        <p className="text-slate-300 leading-relaxed mb-4">
                          {subsection.content}
                        </p>
                        <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-green-500">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="text-green-400" size={20} />
                            <span className="text-green-400 font-bold">Pro Tips:</span>
                          </div>
                          <ul className="space-y-2">
                            {subsection.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="text-slate-300 text-sm flex items-start gap-2">
                                <Star className="text-amber-400 flex-shrink-0 mt-0.5" size={16} fill="currentColor" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Call to Action */}
        <div className="mt-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 rounded-2xl p-6">
          <div className="text-center">
            <Award className="mx-auto text-purple-400 mb-3" size={40} />
            <h3 className="text-2xl font-bold text-purple-400 mb-2">Ready to Begin Your Journey?</h3>
            <p className="text-slate-300 mb-4">
              You now have everything you need to master Scripture with Sword Drill. Remember: consistency beats intensity. Start small, build your streak, and watch your knowledge grow!
            </p>
            <button
              onClick={onBack}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Start Training Now! →
            </button>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 5000px;
          }
        }

        @keyframes bounce-horizontal {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(5px);
          }
        }

        .animate-bounce-horizontal {
          animation: bounce-horizontal 1s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TutorialHelp;
