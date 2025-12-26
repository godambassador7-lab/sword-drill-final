/**
 * Biblical Context Database
 * Provides authorship, dating, audience, purpose, and structure for Bible books
 * Also includes pericope boundaries and passage context
 */

export const BIBLICAL_CONTEXT = {
  books: {
    // PENTATEUCH
    'Genesis': {
      author: 'Moses',
      date: '1445-1405 BC',
      audience: 'Israel',
      purpose: 'To record God\'s creation of the world and His desire to have a people set apart to worship Him',
      genre: 'Narrative (Law, History)',
      themes: ['creation', 'fall', 'covenant', 'promise', 'providence'],
      outline: [
        { section: 'Primeval History', verses: '1:1-11:26', description: 'Creation, Fall, Flood, Babel' },
        { section: 'Abraham', verses: '11:27-25:11', description: 'Call and covenant with Abraham' },
        { section: 'Isaac and Jacob', verses: '25:12-36:43', description: 'Patriarchal promises continued' },
        { section: 'Joseph', verses: '37:1-50:26', description: 'God\'s providence through Joseph' }
      ],
      keyVerses: ['1:1', '3:15', '12:1-3', '15:6', '50:20']
    },
    'Exodus': {
      author: 'Moses',
      date: '1445-1405 BC',
      audience: 'Israel',
      purpose: 'To record the events of Israel\'s deliverance from Egypt and establishment of the Mosaic covenant',
      genre: 'Narrative (Law, History)',
      themes: ['redemption', 'law', 'covenant', 'worship', 'presence_of_god'],
      outline: [
        { section: 'Deliverance from Egypt', verses: '1:1-18:27', description: 'Slavery, plagues, exodus, Red Sea' },
        { section: 'Law at Sinai', verses: '19:1-24:18', description: 'Ten Commandments and covenant' },
        { section: 'Tabernacle Instructions', verses: '25:1-40:38', description: 'God\'s dwelling with His people' }
      ],
      keyVerses: ['3:14', '12:13', '19:5-6', '20:1-17', '33:14']
    },
    'Leviticus': {
      author: 'Moses',
      date: '1445-1405 BC',
      audience: 'Israel',
      purpose: 'To call Israel to holiness and teach the way to approach a holy God',
      genre: 'Law',
      themes: ['holiness', 'sacrifice', 'atonement', 'purity', 'priesthood'],
      outline: [
        { section: 'Sacrificial System', verses: '1:1-7:38', description: 'Five types of offerings' },
        { section: 'Priesthood', verses: '8:1-10:20', description: 'Ordination and duties' },
        { section: 'Purity Laws', verses: '11:1-16:34', description: 'Clean/unclean, Day of Atonement' },
        { section: 'Holiness Code', verses: '17:1-27:34', description: 'Practical holiness' }
      ],
      keyVerses: ['11:45', '16:30', '19:2', '20:26']
    },
    'Numbers': {
      author: 'Moses',
      date: '1445-1405 BC',
      audience: 'Israel',
      purpose: 'To teach that God is faithful and will fulfill His promises despite Israel\'s unfaithfulness',
      genre: 'Narrative (History)',
      themes: ['faithfulness', 'rebellion', 'wandering', 'discipline', 'promise'],
      outline: [
        { section: 'Preparation', verses: '1:1-10:10', description: 'Census and organization at Sinai' },
        { section: 'Journey to Kadesh', verses: '10:11-12:16', description: 'Complaints and Miriam\'s rebellion' },
        { section: 'Failure at Kadesh', verses: '13:1-20:13', description: 'Spies, rebellion, 40 years wandering' },
        { section: 'Journey to Moab', verses: '20:14-36:13', description: 'New generation prepared' }
      ],
      keyVerses: ['14:18', '23:19', '32:23']
    },
    'Deuteronomy': {
      author: 'Moses',
      date: '1405 BC',
      audience: 'Israel (second generation)',
      purpose: 'To remind Israel of God\'s covenant and call them to faithful obedience',
      genre: 'Law (Covenant renewal)',
      themes: ['covenant', 'obedience', 'love', 'land', 'blessing_and_curse'],
      outline: [
        { section: 'Historical Prologue', verses: '1:1-4:43', description: 'Review of wilderness wanderings' },
        { section: 'Law Restated', verses: '4:44-26:19', description: 'Ten Commandments and detailed laws' },
        { section: 'Covenant Blessings/Curses', verses: '27:1-30:20', description: 'Consequences of obedience/disobedience' },
        { section: 'Moses\' Final Words', verses: '31:1-34:12', description: 'Succession and death' }
      ],
      keyVerses: ['6:4-5', '7:9', '8:3', '30:19-20']
    },

    // GOSPELS
    'Matthew': {
      author: 'Matthew (Levi)',
      date: 'AD 50-70',
      audience: 'Jewish Christians',
      purpose: 'To present Jesus as the Messiah, the King of the Jews, fulfilling Old Testament prophecy',
      genre: 'Gospel',
      themes: ['messiah', 'kingdom_of_heaven', 'fulfillment', 'righteousness', 'judgment'],
      outline: [
        { section: 'Birth and Early Years', verses: '1:1-4:25', description: 'Genealogy, birth, baptism, temptation' },
        { section: 'Galilean Ministry', verses: '5:1-18:35', description: 'Sermon on Mount, miracles, parables' },
        { section: 'Journey to Jerusalem', verses: '19:1-20:34', description: 'Teaching on discipleship' },
        { section: 'Passion Week', verses: '21:1-27:66', description: 'Triumphal entry, crucifixion' },
        { section: 'Resurrection', verses: '28:1-20', description: 'Empty tomb, Great Commission' }
      ],
      keyVerses: ['5:17', '16:16', '28:18-20'],
      uniqueFeatures: 'Five major discourses, heavy use of OT quotations, "kingdom of heaven" emphasis'
    },
    'Mark': {
      author: 'John Mark',
      date: 'AD 55-65',
      audience: 'Roman/Gentile Christians',
      purpose: 'To present Jesus as the suffering Servant and Son of God who came to serve and give His life',
      genre: 'Gospel',
      themes: ['servanthood', 'suffering', 'discipleship', 'miracles', 'urgency'],
      outline: [
        { section: 'Servant Arrives', verses: '1:1-13', description: 'Baptism and temptation' },
        { section: 'Servant Ministers', verses: '1:14-8:26', description: 'Galilean ministry, miracles' },
        { section: 'Servant Teaches', verses: '8:27-10:52', description: 'Journey to Jerusalem' },
        { section: 'Servant Suffers', verses: '11:1-15:47', description: 'Passion week and crucifixion' },
        { section: 'Servant Triumphs', verses: '16:1-20', description: 'Resurrection' }
      ],
      keyVerses: ['10:45', '15:39'],
      uniqueFeatures: 'Fastest-paced, action-oriented, "immediately" used frequently'
    },
    'Luke': {
      author: 'Luke (physician)',
      date: 'AD 60-62',
      audience: 'Gentiles (Theophilus)',
      purpose: 'To provide an orderly account of Jesus\' life as the perfect Son of Man who came to seek and save the lost',
      genre: 'Gospel',
      themes: ['salvation', 'compassion', 'prayer', 'holy_spirit', 'outcasts'],
      outline: [
        { section: 'Preparation', verses: '1:1-4:13', description: 'Birth narratives, genealogy, temptation' },
        { section: 'Galilean Ministry', verses: '4:14-9:50', description: 'Teaching and miracles' },
        { section: 'Journey to Jerusalem', verses: '9:51-19:27', description: 'Unique parables and teaching' },
        { section: 'Passion Week', verses: '19:28-23:56', description: 'Crucifixion' },
        { section: 'Resurrection', verses: '24:1-53', description: 'Appearances and ascension' }
      ],
      keyVerses: ['19:10', '23:34'],
      uniqueFeatures: 'Emphasis on prayer, women, Gentiles, and the poor; companion to Acts'
    },
    'John': {
      author: 'John the Apostle',
      date: 'AD 85-95',
      audience: 'Universal (believers and seekers)',
      purpose: 'That you may believe that Jesus is the Christ, the Son of God, and have life in His name (20:31)',
      genre: 'Gospel',
      themes: ['deity_of_christ', 'eternal_life', 'belief', 'light_darkness', 'love'],
      outline: [
        { section: 'Prologue', verses: '1:1-18', description: 'The Word became flesh' },
        { section: 'Book of Signs', verses: '1:19-12:50', description: 'Seven signs revealing Jesus\' glory' },
        { section: 'Upper Room Discourse', verses: '13:1-17:26', description: 'Final teaching to disciples' },
        { section: 'Passion and Resurrection', verses: '18:1-20:31', description: 'Death and victory' },
        { section: 'Epilogue', verses: '21:1-25', description: 'Post-resurrection appearances' }
      ],
      keyVerses: ['1:1', '3:16', '14:6', '20:31'],
      uniqueFeatures: '90% unique material, "I am" statements, high Christology'
    },

    // PAULINE EPISTLES
    'Romans': {
      author: 'Paul',
      date: 'AD 57-58',
      audience: 'Christians in Rome',
      purpose: 'To present a systematic theology of the gospel and God\'s righteousness',
      genre: 'Epistle (theological treatise)',
      themes: ['justification', 'righteousness', 'faith', 'grace', 'sanctification'],
      outline: [
        { section: 'Sin and Condemnation', verses: '1:1-3:20', description: 'Universal need for righteousness' },
        { section: 'Justification', verses: '3:21-5:21', description: 'Righteousness through faith' },
        { section: 'Sanctification', verses: '6:1-8:39', description: 'Life in the Spirit' },
        { section: 'Israel\'s Role', verses: '9:1-11:36', description: 'God\'s faithfulness to Israel' },
        { section: 'Practical Application', verses: '12:1-16:27', description: 'Living out the gospel' }
      ],
      keyVerses: ['1:16-17', '3:23-24', '8:1', '8:28', '12:1-2']
    },
    '1 Corinthians': {
      author: 'Paul',
      date: 'AD 55',
      audience: 'Church in Corinth',
      purpose: 'To address divisions and moral issues in the church',
      genre: 'Epistle (pastoral instruction)',
      themes: ['unity', 'holiness', 'spiritual_gifts', 'love', 'resurrection'],
      outline: [
        { section: 'Divisions in Church', verses: '1:1-4:21', description: 'Wisdom vs. foolishness' },
        { section: 'Moral Problems', verses: '5:1-6:20', description: 'Immorality and lawsuits' },
        { section: 'Marriage and Freedom', verses: '7:1-11:1', description: 'Practical questions answered' },
        { section: 'Worship Issues', verses: '11:2-14:40', description: 'Lord\'s Supper, spiritual gifts' },
        { section: 'Resurrection', verses: '15:1-58', description: 'Defense of bodily resurrection' },
        { section: 'Closing', verses: '16:1-24', description: 'Collection and greetings' }
      ],
      keyVerses: ['1:18', '6:19-20', '10:31', '13:4-8', '15:3-4']
    },
    '2 Corinthians': {
      author: 'Paul',
      date: 'AD 56-57',
      audience: 'Church in Corinth',
      purpose: 'To defend Paul\'s apostleship and encourage generous giving',
      genre: 'Epistle (apologetic)',
      themes: ['apostolic_authority', 'suffering', 'reconciliation', 'generosity', 'weakness'],
      outline: [
        { section: 'Paul\'s Ministry', verses: '1:1-7:16', description: 'Comfort, sincerity, new covenant' },
        { section: 'Generosity', verses: '8:1-9:15', description: 'Collection for Jerusalem' },
        { section: 'Defense of Ministry', verses: '10:1-13:14', description: 'Apostolic authority' }
      ],
      keyVerses: ['4:7', '5:17', '5:21', '12:9-10']
    },
    'Galatians': {
      author: 'Paul',
      date: 'AD 49 (South Galatia) or AD 53-57 (North Galatia)',
      audience: 'Churches in Galatia',
      purpose: 'To defend justification by faith alone against Judaizers',
      genre: 'Epistle (polemic)',
      themes: ['justification', 'faith', 'law', 'freedom', 'spirit'],
      outline: [
        { section: 'Gospel Defended', verses: '1:1-2:21', description: 'Paul\'s authority and gospel' },
        { section: 'Gospel Explained', verses: '3:1-4:31', description: 'Faith vs. law' },
        { section: 'Gospel Applied', verses: '5:1-6:18', description: 'Freedom and Spirit-led living' }
      ],
      keyVerses: ['2:16', '2:20', '3:28', '5:1', '5:22-23']
    },
    'Ephesians': {
      author: 'Paul',
      date: 'AD 60-62',
      audience: 'Church in Ephesus (circular letter)',
      purpose: 'To explain the mystery of the church as the body of Christ',
      genre: 'Epistle (theological)',
      themes: ['church', 'unity', 'grace', 'spiritual_blessings', 'spiritual_warfare'],
      outline: [
        { section: 'Doctrinal (Seated)', verses: '1:1-3:21', description: 'Spiritual blessings in Christ' },
        { section: 'Practical (Walking)', verses: '4:1-6:24', description: 'Worthy walk and spiritual armor' }
      ],
      keyVerses: ['1:3', '2:8-10', '4:4-6', '6:10-18']
    },
    'Philippians': {
      author: 'Paul',
      date: 'AD 60-62',
      audience: 'Church in Philippi',
      purpose: 'To express gratitude and encourage joy and unity',
      genre: 'Epistle (personal)',
      themes: ['joy', 'partnership', 'humility', 'christology', 'contentment'],
      outline: [
        { section: 'Joy in Living', verses: '1:1-30', description: 'Advance of the gospel' },
        { section: 'Joy in Serving', verses: '2:1-30', description: 'Christ\'s humility as example' },
        { section: 'Joy in Knowing Christ', verses: '3:1-21', description: 'Righteousness through faith' },
        { section: 'Joy in Contentment', verses: '4:1-23', description: 'Peace and provision' }
      ],
      keyVerses: ['1:21', '2:5-11', '3:10', '4:4', '4:13']
    },
    'Colossians': {
      author: 'Paul',
      date: 'AD 60-62',
      audience: 'Church in Colossae',
      purpose: 'To refute false teaching and exalt the supremacy of Christ',
      genre: 'Epistle (polemic)',
      themes: ['supremacy_of_christ', 'fullness', 'false_teaching', 'new_life', 'mystery'],
      outline: [
        { section: 'Christ Supreme', verses: '1:1-2:23', description: 'Preeminence and sufficiency' },
        { section: 'Christ Lived Out', verses: '3:1-4:18', description: 'New life in Christ' }
      ],
      keyVerses: ['1:15-20', '2:9-10', '3:1-4']
    },
    '1 Thessalonians': {
      author: 'Paul',
      date: 'AD 50-51',
      audience: 'Church in Thessalonica',
      purpose: 'To encourage young believers and teach about Christ\'s return',
      genre: 'Epistle (pastoral)',
      themes: ['second_coming', 'sanctification', 'hope', 'encouragement', 'perseverance'],
      outline: [
        { section: 'Commendation', verses: '1:1-3:13', description: 'Faith, love, and hope' },
        { section: 'Exhortation', verses: '4:1-5:28', description: 'Holy living and Christ\'s return' }
      ],
      keyVerses: ['1:9-10', '4:13-18', '5:16-18']
    },
    '2 Thessalonians': {
      author: 'Paul',
      date: 'AD 51-52',
      audience: 'Church in Thessalonica',
      purpose: 'To clarify teaching about the Day of the Lord and encourage perseverance',
      genre: 'Epistle (eschatological)',
      themes: ['second_coming', 'persecution', 'lawlessness', 'work_ethic', 'judgment'],
      outline: [
        { section: 'Persecution and Judgment', verses: '1:1-12', description: 'God\'s righteous judgment' },
        { section: 'Day of the Lord', verses: '2:1-17', description: 'Man of lawlessness' },
        { section: 'Practical Living', verses: '3:1-18', description: 'Work and discipline' }
      ],
      keyVerses: ['1:7-10', '2:3-4', '3:10']
    },
    '1 Timothy': {
      author: 'Paul',
      date: 'AD 62-64',
      audience: 'Timothy (pastoral instruction)',
      purpose: 'To provide instructions for church order and combat false teaching',
      genre: 'Epistle (pastoral)',
      themes: ['church_leadership', 'sound_doctrine', 'godliness', 'pastoral_care', 'false_teaching'],
      outline: [
        { section: 'Charge to Timothy', verses: '1:1-20', description: 'Sound doctrine vs. false teaching' },
        { section: 'Church Order', verses: '2:1-3:16', description: 'Worship, qualifications for leaders' },
        { section: 'Ministry Duties', verses: '4:1-6:21', description: 'Personal conduct and church care' }
      ],
      keyVerses: ['1:15', '2:5-6', '3:16', '6:12']
    },
    '2 Timothy': {
      author: 'Paul',
      date: 'AD 66-67',
      audience: 'Timothy',
      purpose: 'Paul\'s final words: endure suffering and guard the gospel',
      genre: 'Epistle (personal testament)',
      themes: ['faithfulness', 'suffering', 'scripture', 'endurance', 'legacy'],
      outline: [
        { section: 'Stir Up the Gift', verses: '1:1-18', description: 'Fan into flame' },
        { section: 'Be Strong', verses: '2:1-26', description: 'Soldier, athlete, farmer' },
        { section: 'Continue in Truth', verses: '3:1-17', description: 'Scripture is God-breathed' },
        { section: 'Preach the Word', verses: '4:1-22', description: 'Paul\'s final charge' }
      ],
      keyVerses: ['1:7', '2:15', '3:16-17', '4:7-8']
    },
    'Titus': {
      author: 'Paul',
      date: 'AD 62-64',
      audience: 'Titus (church leader in Crete)',
      purpose: 'To provide instruction for organizing churches and promoting sound doctrine',
      genre: 'Epistle (pastoral)',
      themes: ['church_leadership', 'good_works', 'sound_doctrine', 'grace', 'godliness'],
      outline: [
        { section: 'Church Leadership', verses: '1:1-16', description: 'Elder qualifications' },
        { section: 'Sound Doctrine', verses: '2:1-15', description: 'Teaching for all groups' },
        { section: 'Good Works', verses: '3:1-15', description: 'Justified to do good' }
      ],
      keyVerses: ['2:11-14', '3:5-7']
    },
    'Philemon': {
      author: 'Paul',
      date: 'AD 60-62',
      audience: 'Philemon (slave owner)',
      purpose: 'To appeal for forgiveness and acceptance of Onesimus',
      genre: 'Epistle (personal)',
      themes: ['forgiveness', 'reconciliation', 'brotherhood', 'love', 'equality_in_christ'],
      outline: [
        { section: 'Greeting and Thanks', verses: '1-7', description: 'Philemon\'s love and faith' },
        { section: 'Appeal for Onesimus', verses: '8-21', description: 'Receive as brother' },
        { section: 'Closing', verses: '22-25', description: 'Hope to visit' }
      ],
      keyVerses: ['16-17']
    },
    'Hebrews': {
      author: 'Unknown (traditionally Paul, possibly Apollos, Barnabas, or Priscilla)',
      date: 'AD 64-69',
      audience: 'Jewish Christians',
      purpose: 'To show Christ\'s superiority and warn against apostasy',
      genre: 'Epistle (homily)',
      themes: ['superiority_of_christ', 'faith', 'perseverance', 'priesthood', 'covenant'],
      outline: [
        { section: 'Christ Superior to Prophets/Angels', verses: '1:1-2:18', description: 'Better revelation' },
        { section: 'Christ Superior to Moses', verses: '3:1-4:13', description: 'Greater rest' },
        { section: 'Christ Superior High Priest', verses: '4:14-10:18', description: 'Better covenant and sacrifice' },
        { section: 'Faith and Endurance', verses: '10:19-13:25', description: 'Hall of faith, discipline' }
      ],
      keyVerses: ['1:1-3', '4:12', '11:1', '12:1-2', '13:8']
    },
    'James': {
      author: 'James (brother of Jesus)',
      date: 'AD 45-50',
      audience: 'Jewish Christians scattered abroad',
      purpose: 'To teach practical Christian living and genuine faith',
      genre: 'Epistle (wisdom literature)',
      themes: ['genuine_faith', 'works', 'trials', 'wisdom', 'tongue'],
      outline: [
        { section: 'Trials and Wisdom', verses: '1:1-27', description: 'Pure religion' },
        { section: 'Faith and Works', verses: '2:1-26', description: 'Faith without works is dead' },
        { section: 'Tongue and Wisdom', verses: '3:1-18', description: 'Taming the tongue' },
        { section: 'Worldliness and Waiting', verses: '4:1-5:20', description: 'Patience until the Lord comes' }
      ],
      keyVerses: ['1:2-4', '1:22', '2:17', '3:5-6', '5:16']
    },
    '1 Peter': {
      author: 'Peter',
      date: 'AD 63-64',
      audience: 'Christians in Asia Minor',
      purpose: 'To encourage believers suffering persecution',
      genre: 'Epistle (encouragement)',
      themes: ['suffering', 'hope', 'holiness', 'submission', 'living_stones'],
      outline: [
        { section: 'Salvation and Holiness', verses: '1:1-2:12', description: 'Living hope' },
        { section: 'Submission in Suffering', verses: '2:13-4:19', description: 'Following Christ\'s example' },
        { section: 'Elders and Humility', verses: '5:1-14', description: 'Cast cares on God' }
      ],
      keyVerses: ['1:3-5', '2:9', '3:15', '4:12-13', '5:7']
    },
    '2 Peter': {
      author: 'Peter',
      date: 'AD 65-68',
      audience: 'Same as 1 Peter',
      purpose: 'To warn against false teachers and encourage spiritual growth',
      genre: 'Epistle (warning)',
      themes: ['knowledge', 'false_teaching', 'day_of_the_lord', 'divine_nature', 'scoffers'],
      outline: [
        { section: 'Grow in Grace', verses: '1:1-21', description: 'Add to your faith' },
        { section: 'Beware False Teachers', verses: '2:1-22', description: 'Destructive heresies' },
        { section: 'Day of the Lord', verses: '3:1-18', description: 'Scoffers and patience' }
      ],
      keyVerses: ['1:3-4', '1:20-21', '3:9', '3:18']
    },
    '1 John': {
      author: 'John the Apostle',
      date: 'AD 85-95',
      audience: 'Churches in Asia Minor',
      purpose: 'To combat Gnostic heresy and assure believers of eternal life',
      genre: 'Epistle (polemic/pastoral)',
      themes: ['love', 'fellowship', 'assurance', 'truth', 'light_darkness'],
      outline: [
        { section: 'Walking in Light', verses: '1:1-2:29', description: 'Fellowship and obedience' },
        { section: 'Children of God', verses: '3:1-24', description: 'Love one another' },
        { section: 'Testing the Spirits', verses: '4:1-21', description: 'God is love' },
        { section: 'Faith and Assurance', verses: '5:1-21', description: 'Overcoming the world' }
      ],
      keyVerses: ['1:9', '2:1-2', '3:16', '4:8', '5:13']
    },
    '2 John': {
      author: 'John the Apostle',
      date: 'AD 85-95',
      audience: 'The elect lady and her children',
      purpose: 'To warn against false teachers and emphasize truth and love',
      genre: 'Epistle (personal)',
      themes: ['truth', 'love', 'false_teaching', 'walking_in_truth'],
      keyVerses: ['4', '6', '9']
    },
    '3 John': {
      author: 'John the Apostle',
      date: 'AD 85-95',
      audience: 'Gaius',
      purpose: 'To commend Gaius for hospitality and warn about Diotrephes',
      genre: 'Epistle (personal)',
      themes: ['hospitality', 'truth', 'church_leadership', 'imitation'],
      keyVerses: ['4', '11']
    },
    'Jude': {
      author: 'Jude (brother of James and Jesus)',
      date: 'AD 65-80',
      audience: 'All believers',
      purpose: 'To contend for the faith against false teachers',
      genre: 'Epistle (polemic)',
      themes: ['false_teaching', 'judgment', 'perseverance', 'faith', 'apostasy'],
      outline: [
        { section: 'Contend for Faith', verses: '1-4', description: 'Reason for writing' },
        { section: 'Examples of Judgment', verses: '5-16', description: 'False teachers condemned' },
        { section: 'Keep Yourselves', verses: '17-25', description: 'Build up your faith' }
      ],
      keyVerses: ['3', '24-25']
    },
    'Revelation': {
      author: 'John the Apostle',
      date: 'AD 95-96',
      audience: 'Seven churches in Asia Minor',
      purpose: 'To reveal Jesus Christ and encourage persecuted believers with God\'s ultimate victory',
      genre: 'Apocalyptic (prophecy)',
      themes: ['sovereignty_of_god', 'judgment', 'victory', 'worship', 'second_coming'],
      outline: [
        { section: 'Things Seen', verses: '1:1-20', description: 'Vision of Christ' },
        { section: 'Things Which Are', verses: '2:1-3:22', description: 'Seven churches' },
        { section: 'Things to Come', verses: '4:1-22:21', description: 'Throne, seals, trumpets, bowls, new heaven/earth' }
      ],
      keyVerses: ['1:7-8', '4:11', '5:9-10', '21:1-4', '22:20']
    }
  }
};

export default BIBLICAL_CONTEXT;
