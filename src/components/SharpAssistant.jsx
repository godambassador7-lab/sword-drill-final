import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, ArrowLeft, Sparkles, Book, Info } from 'lucide-react';
import { answerQuery } from '../services/assistant/enhancedRuleBased';
import { CitationsList } from './CitationBadge';

const SharpAssistant = ({ onBack, userData, bibleData }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingIntervalRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Cleanup typing interval on unmount
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

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

    // Enhanced biblical figure recognition for "Who" questions
    const biblicalFigures = {
      jesus: () => `**Who is Jesus?**

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

What specific aspect of Jesus would you like to understand better?`,

      moses: () => `**Who is Moses?**

Moses is one of the most important figures in the Old Testament.

📖 **His story**:
- Born during Hebrew slavery in Egypt (Exodus 2)
- Adopted by Pharaoh's daughter
- Called by God at the burning bush (Exodus 3)
- Led Israel out of Egyptian slavery (Exodus 12-14)
- Received the Ten Commandments on Mount Sinai (Exodus 19-20)

🔑 **His role**:
- Prophet and lawgiver
- Mediator between God and Israel
- Wrote the first five books (Torah/Pentateuch)
- Led Israel through wilderness for 40 years

📚 **Key passages**:
- Exodus 2-40 - His life and leadership
- Numbers - Wilderness wanderings
- Deuteronomy - Final speeches
- Hebrews 11:24-28 - Faith of Moses

What aspect of Moses' life interests you?`,

      abraham: () => `**Who is Abraham?**

Abraham (originally Abram) is the father of faith and the Hebrew nation.

📖 **His story**:
- Called by God from Ur (Genesis 12:1-3)
- Promised to be father of many nations
- Tested by God (offering Isaac - Genesis 22)
- Covenant sealed with circumcision

🔑 **Key promises** (Abrahamic Covenant):
- Land (Canaan to descendants)
- Seed (offspring as numerous as stars)
- Blessing (all nations blessed through him)

✝️ **New Testament significance**:
- Father of faith (Romans 4, Galatians 3)
- Justified by faith, not works (Romans 4:3)
- Example of trusting God (Hebrews 11:8-19)

📚 **Study more**:
- Genesis 12-25 - Abraham's life
- Romans 4 - Faith of Abraham
- Galatians 3 - Sons of Abraham

Would you like to know more about Abraham's covenant?`,

      david: () => `**Who is David?**

David was Israel's greatest king and "a man after God's own heart."

📖 **His story**:
- Youngest son of Jesse, shepherd boy
- Anointed by Samuel as future king (1 Samuel 16)
- Defeated Goliath (1 Samuel 17)
- Close friend of Jonathan
- Became king after Saul (2 Samuel 5)

🔑 **His reign**:
- United the twelve tribes
- Conquered Jerusalem (City of David)
- Brought the Ark to Jerusalem
- Given eternal covenant (2 Samuel 7)
- Ancestor of Jesus Christ (Matthew 1:1)

📖 **His writings**:
- Wrote approximately 73 Psalms
- Psalms express worship, lament, praise

✝️ **Messianic significance**:
- Jesus called "Son of David" (Matthew 21:9)
- Messiah from David's line (Isaiah 11:1)

📚 **Study more**:
- 1 Samuel 16 - 1 Kings 2 - David's life
- Psalms - His prayers and songs

What aspect of David's life would you like to explore?`,

      paul: () => `**Who is Paul?**

Paul (formerly Saul) was the apostle to the Gentiles and major NT writer.

📖 **His conversion**:
- Jewish Pharisee, persecuted Christians
- Encountered Jesus on Damascus road (Acts 9)
- Blinded, then healed by Ananias
- Called to preach to Gentiles

🔑 **His ministry**:
- Three missionary journeys
- Planted churches across Roman Empire
- Wrote 13 New Testament letters
- Imprisoned multiple times for the gospel

📚 **His writings** (epistles):
- Romans, 1-2 Corinthians, Galatians
- Ephesians, Philippians, Colossians
- 1-2 Thessalonians, 1-2 Timothy, Titus, Philemon

✝️ **His theology**:
- Justification by faith alone (Romans 3-5)
- Unity of Jew and Gentile in Christ (Ephesians 2-3)
- Living by the Spirit (Galatians 5)

📚 **Study more**:
- Acts 9, 13-28 - Paul's life and ministry
- Romans - His systematic theology

Would you like to know about a specific letter Paul wrote?`,

      peter: () => `**Who is Peter?**

Peter (Simon Peter) was one of Jesus' closest disciples and a leader of the early church.

📖 **His calling**:
- Fisherman from Galilee
- Called by Jesus (Luke 5:1-11)
- Given new name "Peter" (rock) by Jesus
- Part of Jesus' inner circle with James and John

🔑 **Key moments**:
- Confessed Jesus as Messiah (Matthew 16:16)
- Witnessed Transfiguration (Matthew 17:1-9)
- Denied Jesus three times (Matthew 26:69-75)
- Restored by Jesus (John 21:15-19)
- Preached at Pentecost (Acts 2)

📚 **His ministry**:
- Leader of Jerusalem church
- Opened gospel to Gentiles (Acts 10)
- Wrote 1 Peter and 2 Peter
- Tradition says martyred in Rome

✝️ **His writings**:
- 1 Peter - Suffering and hope
- 2 Peter - False teachers, end times

What would you like to know about Peter?`,

      john: () => `**Who is John?**

John was Jesus' beloved disciple and author of five NT books.

📖 **His identity**:
- Son of Zebedee, brother of James
- Fisherman from Galilee
- Part of Jesus' inner circle
- Called "the disciple whom Jesus loved"

🔑 **Key moments**:
- At the Transfiguration (Matthew 17)
- At Jesus' crucifixion (John 19:26-27)
- First to believe resurrection (John 20:8)
- Exiled to Patmos (Revelation 1:9)

📚 **His writings**:
- Gospel of John - Jesus as God incarnate
- 1, 2, 3 John - Love, truth, fellowship
- Revelation - Apocalyptic prophecy

✝️ **His themes**:
- Love (1 John 4:7-21)
- Light vs. darkness (John 1:1-14)
- Eternal life (John 3:16)
- Jesus' deity (John 1:1, 20:28)

Which of John's writings would you like to explore?`
    };

    // Check for biblical figures in "Who" questions
    if (questionType === 'who') {
      for (const [figure, response] of Object.entries(biblicalFigures)) {
        if (questionLower.includes(figure)) {
          return response();
        }
      }

      // General "who" question fallback
      return `**Biblical Figures**

I can help you learn about many biblical people! Some notable figures include:

📖 **Old Testament**:
- Abraham - Father of faith
- Moses - Lawgiver and deliverer
- David - Israel's greatest king
- Solomon - Wisest king
- Isaiah, Jeremiah, Ezekiel - Major prophets
- Daniel, Jonah, Elijah - Notable prophets

✝️ **New Testament**:
- Jesus Christ - Son of God, Savior
- Peter - Leader of apostles
- Paul - Apostle to Gentiles
- John - Beloved disciple
- Mary - Mother of Jesus
- Mary Magdalene - First resurrection witness

🔍 **To learn more**:
Please ask about a specific person, like:
- "Who is Moses?"
- "Who is Paul?"
- "Who is David?"

You can also search for them in the Bible Reader or study relevant courses.

Who would you like to know about?`;
    }

    // Enhanced "What is" questions
    const whatIsTopics = {
      gospel: () => `**What is the Gospel?**

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

Would you like me to explain a specific aspect of the gospel?`,

      sin: () => `**What is Sin?**

Sin is disobedience to God's will and falling short of His glory.

📖 **Biblical definition**:
- Missing the mark (hamartia in Greek)
- Transgression of God's law (1 John 3:4)
- Falling short of God's glory (Romans 3:23)

🔑 **Origin of sin**:
- Entered through Adam (Romans 5:12)
- All have sinned (Romans 3:23)
- Sin nature inherited
- Personal sins committed

✝️ **Consequences**:
- Separates from God (Isaiah 59:2)
- Death (Romans 6:23)
- Judgment (Hebrews 9:27)
- Spiritual bondage (John 8:34)

💡 **Solution**:
- Jesus paid sin's penalty (1 Peter 2:24)
- Forgiveness through faith (Ephesians 1:7)
- Freedom from sin's power (Romans 6:14)

📚 **Study more**:
- Romans 1-3 - Universal sinfulness
- Romans 6 - Freedom from sin
- 1 John 1:8-10 - Confession and forgiveness

What aspect of sin would you like to understand better?`,

      grace: () => `**What is Grace?**

Grace is God's unmerited favor and undeserved kindness toward humanity.

📖 **Biblical concept**:
- Charis (Greek) - undeserved favor
- Not earned or deserved
- Free gift from God
- Foundation of salvation

🔑 **Types of grace**:
- **Common grace** - God's goodness to all people
- **Saving grace** - Salvation through faith (Ephesians 2:8-9)
- **Sustaining grace** - Daily strength to live
- **Sufficient grace** - God's power in weakness (2 Corinthians 12:9)

✝️ **Grace vs. Works**:
- Not by works (Ephesians 2:8-9)
- Saved by grace alone
- Works are result, not cause (James 2:14-26)
- Grace enables obedience

📚 **Key passages**:
- Ephesians 2:4-10 - Saved by grace
- Titus 2:11-14 - Grace teaches us
- Romans 5:20-21 - Grace abounds
- 2 Corinthians 12:9 - Grace is sufficient

Want to explore how grace relates to salvation?`,

      baptism: () => `**What is Baptism?**

Baptism is a symbolic act of identification with Christ's death and resurrection.

📖 **Biblical meaning**:
- Baptizo (Greek) - to immerse, dip
- Public declaration of faith
- Symbol of spiritual reality
- Commanded by Jesus (Matthew 28:19)

🔑 **Symbolism**:
- **Death** - Buried with Christ (Romans 6:3-4)
- **Cleansing** - Washing away sin (Acts 22:16)
- **Resurrection** - Raised to new life (Colossians 2:12)
- **Union** - One with Christ

✝️ **New Testament practice**:
- Repentance first (Acts 2:38)
- Belief required (Acts 8:36-37)
- Immersion in water
- In name of Father, Son, Spirit (Matthew 28:19)

📚 **Key passages**:
- Matthew 28:19 - Great Commission
- Acts 2:38 - Peter's instruction
- Romans 6:3-4 - Baptism explained
- 1 Peter 3:21 - Baptism saves (appeal for clear conscience)

Would you like to know about different views on baptism?`,

      trinity: () => `**What is the Trinity?**

The Trinity is the biblical doctrine that God exists as three persons in one being.

📖 **The doctrine**:
- **One God** - Monotheism (Deuteronomy 6:4)
- **Three Persons** - Father, Son, Holy Spirit
- **Co-equal** - Each fully God
- **Co-eternal** - Always existed

🔑 **Biblical evidence**:
- **Father is God** - 1 Corinthians 8:6
- **Son is God** - John 1:1, 20:28, Colossians 2:9
- **Spirit is God** - Acts 5:3-4, 2 Corinthians 3:17
- **Three distinct persons** - Matthew 28:19, 2 Corinthians 13:14

✝️ **Illustrations** (imperfect):
- Water, ice, steam (states)
- Sun: light, heat, energy
- Egg: shell, white, yolk
- Human: body, soul, spirit

⚠️ **Not three gods** (heresy):
- Tritheism - three separate gods
- Modalism - one person in three modes
- Arianism - Jesus created, not eternal

📚 **Study more**:
- John 1:1-18 - Jesus' deity
- Matthew 28:19 - Trinitarian formula
- Apologetics course on Trinity

What aspect of the Trinity confuses you?`,

      heaven: () => `**What is Heaven?**

Heaven is God's dwelling place and the eternal home of believers.

📖 **Biblical description**:
- God's throne (Isaiah 66:1, Matthew 5:34)
- Place of perfect joy (Revelation 21:4)
- No more death, pain, sorrow
- New heavens and new earth (Revelation 21:1)

🔑 **Characteristics**:
- **New Jerusalem** - City of God (Revelation 21)
- **God's presence** - Face to face (Revelation 22:4)
- **No temple** - God is the temple (Revelation 21:22)
- **Perfect worship** - Continuous praise

✝️ **Who goes to heaven?**:
- Those in Christ (John 14:6)
- Believers saved by grace (Ephesians 2:8-9)
- Names in Book of Life (Revelation 21:27)
- Faith in Jesus (John 3:16)

📚 **Key passages**:
- John 14:1-3 - Jesus prepares a place
- Revelation 21-22 - New heaven and earth
- 1 Corinthians 2:9 - Eye has not seen
- Philippians 3:20 - Our citizenship

What would you like to know about heaven?`,

      hell: () => `**What is Hell?**

Hell is the place of eternal separation from God for those who reject Christ.

📖 **Biblical terms**:
- **Gehenna** - Lake of fire (Matthew 5:22)
- **Hades** - Place of the dead (Luke 16:23)
- **Sheol** - Hebrew: grave/death
- **Abyss** - Bottomless pit

🔑 **Descriptions**:
- Eternal fire (Matthew 25:41)
- Outer darkness (Matthew 22:13)
- Weeping and gnashing of teeth
- Separation from God (2 Thessalonians 1:9)
- Lake of fire (Revelation 20:14-15)

⚠️ **Who goes there?**:
- Those who reject Christ (John 3:36)
- Devil and fallen angels (Matthew 25:41)
- Those whose names not in Book of Life (Revelation 20:15)
- The unrighteous (Revelation 21:8)

✝️ **The warning**:
- Jesus spoke much about hell
- Escape through Christ alone (John 14:6)
- God desires all to be saved (2 Peter 3:9)
- Urgency of the gospel

📚 **Study more**:
- Matthew 25:31-46 - Final judgment
- Luke 16:19-31 - Rich man and Lazarus
- Revelation 20:11-15 - Great white throne

Would you like to know how to be saved from hell?`
    };

    // Check for "What is" questions
    if (questionType === 'what') {
      for (const [topic, response] of Object.entries(whatIsTopics)) {
        if (questionLower.includes(topic)) {
          return response();
        }
      }

      // Additional what checks
      if (questionLower.includes('justification')) {
        return `**What is Justification?**

Justification is God's act of declaring a sinner righteous through faith in Christ.

📖 **Legal term**:
- Forensic declaration - legal verdict
- God the judge declares "not guilty"
- Righteousness credited/imputed
- Once for all, instantaneous

🔑 **Key aspects**:
- **By faith alone** (sola fide) - Romans 3:28, 5:1
- **Through grace alone** - Ephesians 2:8-9
- **In Christ alone** - Acts 4:12
- **Not by works** - Romans 4:5, Galatians 2:16

✝️ **How it works**:
- Christ's righteousness credited to us (2 Corinthians 5:21)
- Our sin credited to Christ
- God sees us "in Christ"
- Perfect standing before God

📚 **Key passages**:
- Romans 3:21-26 - Justification explained
- Romans 4 - Abraham justified by faith
- Romans 5:1 - Therefore justified by faith
- Galatians 2:16 - Not by works

📚 **Related concepts**:
- Sanctification - being made holy (process)
- Redemption - bought back from sin
- Reconciliation - restored relationship with God

Want to explore the difference between justification and sanctification?`;
      }

      // General "what" fallback
      return `**Biblical Concepts**

I can explain many biblical topics! Here are some I can help with:

✝️ **Core Doctrines**:
- Gospel, Sin, Grace, Salvation
- Trinity, Jesus, Holy Spirit
- Baptism, Communion
- Justification, Sanctification

📖 **Biblical Themes**:
- Heaven and Hell
- Faith and Works
- Prayer and Worship
- Repentance and Forgiveness

🎓 **Study Tools**:
- Greek and Hebrew words
- Biblical interpretation (hermeneutics)
- Church history
- Biblical archaeology

🔍 **Ask me**:
- "What is the gospel?"
- "What is grace?"
- "What is baptism?"
- "What is justification?"

You can also use the Bible Reader, courses, and lexicons for deeper study.

What topic would you like to explore?`;
    }

    // Enhanced "Where is" questions
    const whereIsTopics = {
      jerusalem: () => `**Where is Jerusalem?**

Jerusalem is one of the most important cities in biblical and world history.

📍 **Location**:
- Central Israel/Palestine region
- Hill country of Judea
- Between Mediterranean Sea and Dead Sea
- About 2,500 feet above sea level

📖 **Biblical significance**:
- **City of David** - Captured by David (2 Samuel 5:6-9)
- **Temple location** - Solomon built temple (1 Kings 6)
- **Holy City** - Center of Jewish worship
- **Jesus' ministry** - Crucifixion, resurrection
- **Future prophecy** - New Jerusalem (Revelation 21)

🔑 **Historical periods**:
- Jebusite city (pre-David)
- United Kingdom capital (David, Solomon)
- Judean capital (after split)
- Destroyed 586 BC (Babylon)
- Rebuilt under Ezra/Nehemiah
- Second temple period (Jesus' time)
- Destroyed AD 70 (Rome)

📚 **Study more**:
- 2 Samuel 5-6 - David captures Jerusalem
- Nehemiah - Rebuilding walls
- Luke 19:41-44 - Jesus weeps over Jerusalem

Would you like to know about Jerusalem's future in prophecy?`,

      egypt: () => `**Where is Egypt?**

Egypt is a crucial nation throughout biblical history.

📍 **Location**:
- Northeast Africa
- Along the Nile River
- Borders Mediterranean Sea
- South of Canaan/Israel

📖 **Biblical significance**:
- **Joseph's rise** - Saved Egypt from famine (Genesis 41)
- **Israelite slavery** - 400 years bondage (Exodus 1)
- **The Exodus** - Moses led Israel out (Exodus 12-14)
- **Jesus' refuge** - Fled from Herod (Matthew 2:13-15)

🔑 **Key events**:
- Abram's visit (Genesis 12:10)
- Joseph sold to Egypt (Genesis 37)
- Israelites multiply (Exodus 1)
- Ten plagues (Exodus 7-12)
- Red Sea crossing (Exodus 14)

📚 **Prophecies**:
- Isaiah 19 - Burden of Egypt
- Ezekiel 29-32 - Judgment on Egypt
- Called "My people" (Isaiah 19:25)

Egypt appears over 600 times in Scripture!

What period of Egypt's biblical history interests you?`,

      bethlehem: () => `**Where is Bethlehem?**

Bethlehem is the birthplace of Jesus and city of David.

📍 **Location**:
- Judea, south of Jerusalem (6 miles)
- Hill country region
- Also called "Ephrath" (Genesis 35:19)
- "City of David" (Luke 2:4)

📖 **Biblical significance**:
- **Rachel's burial** - Died there (Genesis 35:19)
- **Ruth's story** - Married Boaz there (Ruth 1-4)
- **David's birthplace** - Born and anointed king (1 Samuel 16)
- **Prophecy fulfilled** - Messiah's birthplace (Micah 5:2)
- **Jesus' birth** - Born in manger (Luke 2:1-7)

🔑 **The name**:
- "Bethlehem" = "House of Bread" (Hebrew)
- Jesus is the "Bread of Life" (John 6:35)
- Significant symbolism!

📚 **Key passages**:
- Micah 5:2 - Prophecy of Messiah
- Matthew 2:1-6 - Wise men visit
- Luke 2:1-20 - Birth narrative

Want to know more about Jesus' birth in Bethlehem?`,

      calvary: () => `**Where is Calvary/Golgotha?**

Calvary (Golgotha) is where Jesus was crucified.

📍 **Location**:
- Just outside Jerusalem's walls
- Near a main road (public execution site)
- Exact location debated today
- "Place of a skull" (meaning of Golgotha)

📖 **Biblical names**:
- **Golgotha** - Aramaic: "skull" (Mark 15:22)
- **Calvary** - Latin: "skull" (Luke 23:33 KJV)
- Possibly resembled a skull

🔑 **The crucifixion**:
- Jesus died between two thieves (Luke 23:33)
- Darkness covered land (Matthew 27:45)
- Veil torn (Matthew 27:51)
- Earthquake occurred (Matthew 27:51)
- Near a garden with tomb (John 19:41)

✝️ **Significance**:
- Atonement for sin accomplished
- Prophecy fulfilled (Isaiah 53)
- "It is finished" (John 19:30)
- Price of redemption paid

📚 **Study passages**:
- Matthew 27:33-56 - Crucifixion account
- Isaiah 53 - Suffering Servant prophecy

The location matters less than what happened there!

What would you like to know about the crucifixion?`
    };

    // Check for "Where is" questions
    if (questionType === 'where') {
      for (const [place, response] of Object.entries(whereIsTopics)) {
        if (questionLower.includes(place)) {
          return response();
        }
      }

      // General "where" fallback
      return `**Biblical Places**

I can help you learn about important biblical locations!

📍 **Major cities**:
- Jerusalem - Holy City, Temple location
- Bethlehem - Jesus' birthplace
- Nazareth - Jesus' hometown
- Capernaum - Jesus' ministry base
- Rome - Paul's final destination

🗺️ **Regions**:
- Egypt - Exodus, Joseph's story
- Babylon - Exile, Daniel
- Canaan/Israel - Promised Land
- Galilee - Jesus' ministry
- Judea - Southern kingdom

⛰️ **Mountains**:
- Sinai - Ten Commandments
- Zion - Jerusalem location
- Ararat - Noah's ark landing
- Calvary/Golgotha - Crucifixion

🔍 **Ask me about**:
- "Where is Jerusalem?"
- "Where is Bethlehem?"
- "Where is Egypt?"
- "Where is Calvary?"

You can also use Biblical Archaeology course to learn about these places!

Which location interests you?`;
    }

    // Enhanced "Why is" questions
    if (questionType === 'why') {
      if (questionLower.includes('cross') || questionLower.includes('die') || questionLower.includes('crucif')) {
        return `**Why did Jesus die on the cross?**

Jesus' death was the centerpiece of God's redemption plan.

✝️ **Primary reasons**:
1. **To pay for sin** - Death is sin's penalty (Romans 6:23)
2. **To satisfy God's justice** - Holy God must punish sin
3. **To demonstrate God's love** - Greatest love (John 15:13, Romans 5:8)
4. **To reconcile humanity to God** - Bridge the gap (2 Corinthians 5:18-21)

📖 **Biblical explanation**:
- **Substitute** - He died in our place (Isaiah 53:5-6)
- **Propitiation** - Satisfied God's wrath (1 John 2:2)
- **Redemption** - Bought us back (1 Peter 1:18-19)
- **Ransom** - Price paid for freedom (Mark 10:45)

🔑 **What was accomplished**:
- Sin's penalty paid (Romans 6:23)
- Death defeated (1 Corinthians 15:54-57)
- Satan defeated (Hebrews 2:14)
- New covenant established (Luke 22:20)
- Way to God opened (Hebrews 10:19-20)

📚 **Key passages**:
- Isaiah 53 - Prophecy of suffering servant
- Romans 3:21-26 - Justification explained
- 2 Corinthians 5:21 - Became sin for us
- 1 Peter 2:24 - Bore our sins

It was planned from eternity (Revelation 13:8)!

What aspect of Jesus' sacrifice would you like to understand better?`;
      }

      if (questionLower.includes('suffer') || questionLower.includes('pain') || questionLower.includes('evil')) {
        return `**Why does God allow suffering?**

This is one of life's deepest questions. The Bible offers perspective:

📖 **Biblical perspective**:
- **Sin's consequence** - Suffering entered through sin (Genesis 3, Romans 5:12)
- **Broken world** - Creation groans (Romans 8:22)
- **Free will** - God gave humans choice
- **Mystery** - We don't see full picture (Isaiah 55:8-9)

🔑 **Purposes of suffering**:
- **Refining faith** - Like gold in fire (1 Peter 1:6-7)
- **Character building** - Produces perseverance (Romans 5:3-5)
- **Drawing near to God** - Comfort in trial (2 Corinthians 1:3-4)
- **Eternal perspective** - Light affliction (2 Corinthians 4:17)
- **Christ's example** - He suffered too (Hebrews 2:10)

✝️ **God's response**:
- Came to suffer with us (Isaiah 53, Hebrews 4:15)
- Promises to end all suffering (Revelation 21:4)
- Works all for good (Romans 8:28)
- Never leaves us (Hebrews 13:5)

📚 **Study more**:
- Job 1-42 - Wrestling with suffering
- Habakkuk - Questioning God
- 2 Corinthians 1:3-11 - Comfort in affliction
- James 1:2-4 - Joy in trials

Apologetics course addresses this deeply.

What specific aspect of suffering troubles you?`;
      }

      // General "why" fallback
      return `**Why Questions About Faith**

I can help answer many "why" questions! Common ones include:

✝️ **About Jesus**:
- Why did Jesus die on the cross?
- Why did Jesus come to earth?
- Why did Jesus perform miracles?

📖 **About God's ways**:
- Why does God allow suffering?
- Why does God require faith?
- Why do we pray?

🔑 **About salvation**:
- Why do we need to be saved?
- Why is faith necessary?
- Why can't works save us?

📚 **About the Bible**:
- Why trust the Bible?
- Why are there different translations?
- Why study the original languages?

🔍 **Ask me**:
- "Why did Jesus die on the cross?"
- "Why does God allow suffering?"
- "Why do we need salvation?"

The Apologetics course addresses many "why" questions!

What would you like to understand?`;
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

  const typeOutMessage = (fullContent, citations, metadata, messageId) => {
    let currentIndex = 0;
    const typingSpeed = 8; // milliseconds per character (faster, more like ChatGPT)
    const minChunkSize = 1; // Characters to type at once
    const maxChunkSize = 3; // Max characters for faster typing on longer words

    // Create initial empty message
    const initialMessage = {
      id: messageId,
      role: 'assistant',
      content: '',
      citations: citations || [],
      metadata: metadata || {},
      timestamp: Date.now(),
      isTyping: true
    };

    setMessages(prev => [...prev, initialMessage]);
    setIsTyping(true);
    setTypingMessageId(messageId);

    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < fullContent.length) {
        // Type faster for spaces and punctuation
        const currentChar = fullContent[currentIndex];
        const chunkSize = currentChar === ' ' || currentChar === '\n'
          ? maxChunkSize
          : Math.min(maxChunkSize, Math.ceil(Math.random() * 2) + 1);

        const endIndex = Math.min(currentIndex + chunkSize, fullContent.length);
        const nextChunk = fullContent.slice(0, endIndex);
        currentIndex = endIndex;

        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId
              ? { ...msg, content: nextChunk }
              : msg
          )
        );
      } else {
        // Typing complete
        clearInterval(typingIntervalRef.current);
        setIsTyping(false);
        setTypingMessageId(null);

        // Mark message as complete
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId
              ? { ...msg, isTyping: false }
              : msg
          )
        );
      }
    }, typingSpeed);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isTyping) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    const userQuestion = input; // Save before clearing
    setInput('');
    setIsLoading(true);

    try {
      // Call enhanced rule-based system with RAG
      const response = await answerQuery(userQuestion, {
        conversationHistory,
        selectedTranslation: 'KJV',
        userProgress: {
          versesMemorized: userData?.versesMemorized || 0,
          quizzesCompleted: userData?.quizzesCompleted || 0,
          currentStreak: userData?.currentStreak || 0,
          currentLevel: userData?.currentLevel || 'Beginner'
        }
      });

      // Update conversation history
      setConversationHistory([
        ...conversationHistory,
        { role: 'user', content: userQuestion },
        { role: 'assistant', content: response.answer }
      ]);

      // Type out the response
      const messageId = `assistant-${Date.now()}`;
      typeOutMessage(response.answer, response.citations, response.metadata, messageId);

    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = {
        id: `error-${Date.now()}`,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/30 to-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[80vh] bg-slate-800/90 rounded-xl shadow-2xl flex flex-col overflow-hidden border-2 border-indigo-500/50">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-b-2 border-indigo-500/50 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-indigo-300 hover:text-indigo-200 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg overflow-hidden flex items-center justify-center" style={{width: '48px', height: '48px'}}>
              <img src={`${process.env.PUBLIC_URL || ''}/sharp icon.png`} alt="SHARP" width="48" height="48" className="w-full h-full object-cover" />
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
        <div className="bg-indigo-900/30 border-b border-indigo-500/30 py-2 px-4 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-indigo-200">
            <Info size={16} />
            <span>Ask me anything about the Bible, theology, or how to use Sword Drill features!</span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
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
                {message.isTyping && (
                  <span className="inline-block w-1 h-4 ml-1 bg-indigo-400 animate-pulse"></span>
                )}
                {message.citations && message.citations.length > 0 && !message.isTyping && (
                  <CitationsList citations={message.citations} />
                )}
                <div className="text-xs opacity-50 mt-2 flex items-center gap-2">
                  <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                  {message.metadata?.usedClaude && (
                    <span className="text-indigo-400">• AI-powered</span>
                  )}
                  {message.metadata?.fromCache && (
                    <span className="text-amber-400">• Cached</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && !isTyping && (
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
      <div className="bg-slate-900/50 border-t-2 border-indigo-500/50 p-4 flex-shrink-0 sticky bottom-0 z-20">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Scripture, theology, courses, or features..."
            className="flex-1 bg-slate-800 border-2 border-indigo-500/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-colors"
            disabled={isLoading || isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || isTyping}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2"
          >
            <Send size={20} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default SharpAssistant;
