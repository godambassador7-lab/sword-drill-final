import json
import os

# Remaining short plans
short_plans = {
    "life_in_the_spirit.json": {
        "title": "Life in the Spirit",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: Romans 8:5-11",
                "overview": "Paul contrasts life in the flesh with life in the Spirit. Those who set their minds on the Spirit have life and peace, while the mind set on the flesh is death. The Spirit gives life to mortal bodies.",
                "reflection": "What does it mean to set your mind on the Spirit versus the flesh? How does the Spirit give life to your mortal body? What areas of your thinking need to be reoriented?",
                "prayer": "Ask God to help you set your mind on the things of the Spirit and experience His life and peace."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Galatians 5:16-18",
                "overview": "Paul commands believers to walk by the Spirit, promising they will not gratify the desires of the flesh. The flesh and Spirit are in conflict, but those led by the Spirit are not under law.",
                "reflection": "What does it mean to walk by the Spirit? How do you experience the conflict between flesh and Spirit? What desires of the flesh are you struggling against?",
                "prayer": "Pray for the power to walk by the Spirit consistently and overcome fleshly desires."
            },
            {
                "day": 3,
                "passage": "{{translation}}: Galatians 5:22-23",
                "overview": "Paul lists the fruit of the Spirit: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control. These qualities are evidence of the Spirit's transforming work in believers' lives.",
                "reflection": "Which fruit of the Spirit is most evident in your life? Which needs more cultivation? How does the Spirit produce this fruit in you?",
                "prayer": "Ask the Holy Spirit to produce His fruit abundantly in your life, making you more like Christ."
            },
            {
                "day": 4,
                "passage": "{{translation}}: Romans 8:13-14",
                "overview": "Paul teaches that by the Spirit believers must put to death the deeds of the body to truly live. Those led by God's Spirit are His children, revealing their identity through Spirit-led living.",
                "reflection": "What deeds of the body do you need to put to death? How does the Spirit lead you? What does it mean to be a child of God?",
                "prayer": "Pray for the Spirit's power to put sin to death and for sensitivity to His leading in your life."
            }
        ]
    },

    "light_in_darkness.json": {
        "title": "Light in Darkness",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: John 8:12",
                "overview": "Jesus declares Himself the light of the world, promising that whoever follows Him will not walk in darkness but have the light of life. Christ is the source of all spiritual illumination and guidance.",
                "reflection": "What does it mean that Jesus is the light of the world? How do you follow Him? What darkness has Christ's light dispelled in your life?",
                "prayer": "Thank Jesus for being your light and ask Him to illuminate your path and dispel all darkness."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Matthew 5:14-16",
                "overview": "Jesus calls His followers the light of the world, commanding them to let their light shine so others may see their good works and glorify God. Believers are to be visible witnesses of God's transforming power.",
                "reflection": "How are you being light in the world? What good works reveal God's character through you? Where might you be hiding your light?",
                "prayer": "Ask God to help you shine brightly for Him, that others would see Christ in you and glorify Him."
            },
            {
                "day": 3,
                "passage": "{{translation}}: Ephesians 5:8-11",
                "overview": "Paul reminds believers they were once darkness but now are light in the Lord. They should walk as children of light, producing good fruit and exposing the unfruitful works of darkness.",
                "reflection": "How has God brought you from darkness to light? What does it mean to walk as a child of light? What works of darkness need to be exposed?",
                "prayer": "Thank God for rescuing you from darkness and pray for boldness to walk as a child of light."
            },
            {
                "day": 4,
                "passage": "{{translation}}: 1 John 1:5-7",
                "overview": "John declares that God is light with no darkness at all. If believers walk in the light as He is in the light, they have fellowship with one another and Christ's blood cleanses them from all sin.",
                "reflection": "What does it mean that God is light with no darkness? How do you walk in the light? How does walking in light connect to fellowship and cleansing?",
                "prayer": "Confess any hidden darkness and ask God to help you walk fully in His light with transparency."
            }
        ]
    },

    "living_by_faith.json": {
        "title": "Living by Faith",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: Hebrews 11:1-3",
                "overview": "The author defines faith as the assurance of things hoped for and the conviction of things not seen. By faith we understand that God created the universe by His word—faith perceives spiritual realities.",
                "reflection": "How would you define faith in your own words? What unseen realities are you confident about? How does faith connect to understanding God's creative work?",
                "prayer": "Ask God to strengthen your faith and help you perceive spiritual realities beyond what is visible."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Hebrews 11:6",
                "overview": "Without faith it is impossible to please God, for whoever would draw near must believe that He exists and rewards those who seek Him. Faith is foundational to any relationship with God.",
                "reflection": "Why is faith essential to pleasing God? How do you seek God diligently? What does it mean that God rewards those who seek Him?",
                "prayer": "Pray for deeper faith that truly believes God exists and earnestly seeks Him."
            },
            {
                "day": 3,
                "passage": "{{translation}}: Romans 1:17",
                "overview": "Paul proclaims that in the gospel the righteousness of God is revealed from faith for faith. As it is written, 'The righteous shall live by faith'—faith is both the means and the manner of Christian living.",
                "reflection": "How is God's righteousness revealed from faith for faith? What does it mean to live by faith daily? How does the gospel strengthen your faith?",
                "prayer": "Thank God for revealing His righteousness through the gospel and ask for grace to live by faith."
            },
            {
                "day": 4,
                "passage": "{{translation}}: 2 Corinthians 5:7",
                "overview": "Paul states that believers walk by faith, not by sight. Living by faith means trusting God's promises and character even when circumstances seem contrary to them.",
                "reflection": "In what areas are you tempted to walk by sight rather than faith? How can you trust God more fully? What promises do you need to believe despite what you see?",
                "prayer": "Ask God to help you walk by faith even when sight suggests otherwise, trusting His promises."
            },
            {
                "day": 5,
                "passage": "{{translation}}: James 2:14-17",
                "overview": "James challenges empty profession, arguing that faith without works is dead. Genuine faith produces action—belief and behavior must align. Faith that doesn't transform life is not saving faith.",
                "reflection": "How does your faith show itself in actions? What works demonstrate the reality of your faith? Where might your faith be inactive?",
                "prayer": "Pray that your faith would be alive and active, producing works that honor God."
            }
        ]
    },

    "overcoming_temptation.json": {
        "title": "Overcoming Temptation",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: 1 Corinthians 10:13",
                "overview": "Paul assures believers that no temptation has overtaken them that is not common to man. God is faithful and will provide a way of escape so they can endure it.",
                "reflection": "How does knowing temptation is common to humanity help you? What does God's faithfulness in temptation look like? What ways of escape has God provided?",
                "prayer": "Thank God for His faithfulness in temptation and ask Him to help you recognize and take the way of escape."
            },
            {
                "day": 2,
                "passage": "{{translation}}: James 1:13-15",
                "overview": "James clarifies that God does not tempt anyone. Rather, each person is tempted by their own desire, which when it conceives gives birth to sin, and sin when fully grown brings death.",
                "reflection": "What desires make you vulnerable to temptation? How does understanding sin's progression help you resist earlier? What 'death' results from giving in to temptation?",
                "prayer": "Ask God to reveal and transform the desires that lead you into temptation."
            },
            {
                "day": 3,
                "passage": "{{translation}}: Matthew 26:41",
                "overview": "Jesus instructs His disciples to watch and pray so they won't enter into temptation. Though the spirit is willing, the flesh is weak—vigilance and prayer are essential defenses against temptation.",
                "reflection": "How does prayerfulness protect against temptation? Where do you need to be more watchful? When has your willing spirit been undermined by weak flesh?",
                "prayer": "Pray for vigilance and spiritual alertness to recognize and resist temptation before falling."
            },
            {
                "day": 4,
                "passage": "{{translation}}: Hebrews 4:15-16",
                "overview": "Jesus our High Priest has been tempted in every way as we are, yet without sin. Because He understands our weakness, we can confidently approach God's throne to receive mercy and grace for help in time of need.",
                "reflection": "How does Jesus' experience of temptation encourage you? What does it mean to approach God's throne with confidence? When do you need to seek grace for help?",
                "prayer": "Thank Jesus for understanding your temptations and ask for grace to overcome in your time of need."
            }
        ]
    },

    "peace_in_trials.json": {
        "title": "Peace in Trials",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: John 14:27",
                "overview": "Jesus promises to give His peace—not as the world gives, but a supernatural peace. He commands disciples not to let their hearts be troubled or afraid, even facing His departure and future trials.",
                "reflection": "How is Jesus' peace different from the world's peace? What troubles your heart? How can you receive and maintain Christ's peace?",
                "prayer": "Ask Jesus to fill you with His peace that transcends circumstances and guards your heart from fear."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Philippians 4:6-7",
                "overview": "Paul instructs believers not to be anxious but to bring everything to God in prayer with thanksgiving. The result is God's peace guarding their hearts and minds in Christ Jesus.",
                "reflection": "What anxieties do you need to bring to God in prayer? How does thanksgiving combat anxiety? How have you experienced God's peace guarding your heart?",
                "prayer": "Bring your specific anxieties to God with thanksgiving and ask for His peace to guard your heart."
            },
            {
                "day": 3,
                "passage": "{{translation}}: Isaiah 26:3",
                "overview": "Isaiah promises that God will keep in perfect peace those whose minds are stayed on Him, because they trust in Him. Peace comes from fixing our thoughts on God's character and trusting His control.",
                "reflection": "Where is your mind fixed right now? What does it mean to keep your mind stayed on God? How does trust produce peace?",
                "prayer": "Pray for help to keep your mind fixed on God and to trust Him completely, experiencing His perfect peace."
            },
            {
                "day": 4,
                "passage": "{{translation}}: Romans 5:1",
                "overview": "Paul declares that since believers are justified by faith, they have peace with God through Jesus Christ. This is not peace as a feeling but peace as a status—reconciliation with God.",
                "reflection": "What does peace with God mean? How does justification produce peace? How should peace with God affect your daily life?",
                "prayer": "Thank God for justifying you through faith and giving you peace with Him through Jesus Christ."
            }
        ]
    },

    "pursuing_righteousness.json": {
        "title": "Pursuing Righteousness",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: 1 Timothy 6:11",
                "overview": "Paul commands Timothy, as a man of God, to flee from certain sins and pursue righteousness, godliness, faith, love, steadfastness, and gentleness. The Christian life involves both fleeing evil and pursuing good.",
                "reflection": "What sins do you need to flee from? How do you actively pursue righteousness? Which of these virtues needs more attention in your life?",
                "prayer": "Ask God for strength to flee temptation and diligently pursue righteousness and godliness."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Matthew 5:6",
                "overview": "Jesus pronounces blessing on those who hunger and thirst for righteousness, promising they will be satisfied. True righteousness comes from an intense spiritual desire that God promises to fulfill.",
                "reflection": "How strong is your hunger for righteousness? What would it look like to thirst for righteousness? How has God satisfied your spiritual hunger?",
                "prayer": "Pray for a deeper hunger and thirst for righteousness, trusting God to satisfy that longing."
            },
            {
                "day": 3,
                "passage": "{{translation}}: Romans 6:12-13",
                "overview": "Paul commands believers not to let sin reign in their bodies or present their members to sin as instruments for unrighteousness. Instead, they should present themselves to God as instruments for righteousness.",
                "reflection": "What does it mean to not let sin reign? How can you present your body's members as instruments for righteousness? What would this look like practically?",
                "prayer": "Commit your whole being to God as an instrument for His righteous purposes."
            },
            {
                "day": 4,
                "passage": "{{translation}}: 2 Timothy 2:22",
                "overview": "Paul instructs Timothy to flee youthful passions and pursue righteousness, faith, love, and peace along with those who call on the Lord from a pure heart. Righteousness is pursued in community.",
                "reflection": "What youthful passions need to be fled? How does pursuing righteousness alongside other believers help? What does calling on the Lord from a pure heart mean?",
                "prayer": "Ask God to help you flee sinful desires and pursue righteousness together with fellow believers."
            }
        ]
    },

    "renewing_the_mind.json": {
        "title": "Renewing the Mind",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: Romans 12:2",
                "overview": "Paul commands believers not to be conformed to this world but transformed by the renewal of their minds. Mental transformation enables discernment of God's will—what is good, acceptable, and perfect.",
                "reflection": "How are you being conformed to the world? What does mental renewal look like? How does a renewed mind help you discern God's will?",
                "prayer": "Ask God to transform you by renewing your mind and help you discern His perfect will."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Colossians 3:1-2",
                "overview": "Paul instructs believers who have been raised with Christ to seek and set their minds on things above, not on earthly things. Mental focus determines spiritual direction.",
                "reflection": "What does it mean to seek things above? What earthly things consume your thoughts? How can you reorient your mind toward heavenly realities?",
                "prayer": "Pray for help to set your mind on things above and loosen your attachment to earthly concerns."
            },
            {
                "day": 3,
                "passage": "{{translation}}: Philippians 4:8",
                "overview": "Paul provides criteria for thought life: whatever is true, honorable, just, pure, lovely, commendable, excellent, and praiseworthy. Believers are to intentionally direct their thoughts toward these things.",
                "reflection": "What do you allow into your mind that fails this test? How can you be more selective about your mental input? What excellent things should occupy your thoughts?",
                "prayer": "Ask God to help you discipline your thought life according to these biblical standards."
            },
            {
                "day": 4,
                "passage": "{{translation}}: 2 Corinthians 10:5",
                "overview": "Paul describes spiritual warfare involving taking every thought captive to obey Christ. Mental discipline requires actively capturing thoughts and submitting them to Christ's lordship.",
                "reflection": "What thoughts need to be taken captive? How do you make thoughts obey Christ? What strongholds exist in your thinking?",
                "prayer": "Pray for God's power to demolish mental strongholds and bring every thought into obedience to Christ."
            }
        ]
    },

    "sharpening_discernment.json": {
        "title": "Sharpening Discernment",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: 1 John 4:1",
                "overview": "John warns believers not to believe every spirit but to test the spirits to see whether they are from God, because many false prophets have gone out into the world. Discernment requires active testing.",
                "reflection": "What teachings or messages do you need to test? How do you test whether something is from God? What false teachings are prevalent today?",
                "prayer": "Ask God for wisdom to discern truth from error and test all teachings against Scripture."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Hebrews 5:14",
                "overview": "The mature have their powers of discernment trained by constant practice to distinguish good from evil. Discernment is a skill developed through regular exercise, not an instant gift.",
                "reflection": "How are you training your discernment? What practices help you distinguish good from evil? Where do you need greater spiritual maturity?",
                "prayer": "Pray for maturity and disciplined practice in developing your spiritual discernment."
            },
            {
                "day": 3,
                "passage": "{{translation}}: Philippians 1:9-10",
                "overview": "Paul prays that the Philippians' love would abound more and more in knowledge and depth of insight, enabling them to discern what is best and be pure and blameless. Love combined with knowledge produces discernment.",
                "reflection": "How do love and knowledge work together in discernment? What is the connection between discernment and purity? How can you approve what is excellent?",
                "prayer": "Ask God to increase your love with knowledge and depth of insight for better discernment."
            },
            {
                "day": 4,
                "passage": "{{translation}}: Proverbs 2:1-6",
                "overview": "Solomon teaches that discernment comes from crying out for insight, searching for it like treasure, and recognizing that the Lord gives wisdom. Understanding requires both diligent pursuit and God's gift.",
                "reflection": "How diligently are you seeking wisdom and discernment? What would it mean to search for understanding like hidden treasure? How does fear of the Lord connect to discernment?",
                "prayer": "Cry out to God for wisdom and discernment, committing to search for it diligently."
            }
        ]
    },

    "steadfast_love.json": {
        "title": "Steadfast Love",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: Psalm 136:1-3",
                "overview": "The psalmist repeatedly declares that God's steadfast love endures forever. This refrain emphasizes the unchanging, reliable, covenant-keeping nature of God's love.",
                "reflection": "What does steadfast love mean? How is God's love different from human love? How have you experienced God's enduring love?",
                "prayer": "Thank God for His steadfast love that endures forever and never fails you."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Lamentations 3:22-23",
                "overview": "Jeremiah declares that God's steadfast love never ceases and His mercies never end—they are new every morning. Great is His faithfulness even in the midst of suffering.",
                "reflection": "How do you see God's mercies renewed each morning? What does God's faithfulness mean to you? How does this truth sustain you in difficulty?",
                "prayer": "Praise God for His never-ceasing love and mercies that are fresh each new day."
            },
            {
                "day": 3,
                "passage": "{{translation}}: Romans 8:38-39",
                "overview": "Paul triumphantly declares that nothing in all creation can separate believers from God's love in Christ Jesus. God's love is absolutely secure and cannot be broken by any force.",
                "reflection": "What circumstances make you doubt God's love? How does Christ's work guarantee God's love? What comfort do you find in love's inseparability?",
                "prayer": "Thank God that absolutely nothing can separate you from His love in Christ Jesus."
            },
            {
                "day": 4,
                "passage": "{{translation}}: 1 John 4:9-10",
                "overview": "John reveals that God's love was made manifest by sending His only Son so that we might live through Him. This is love—not that we loved God, but that He loved us and sent His Son as propitiation for sins.",
                "reflection": "How did God demonstrate His love? What does it mean that God loved you first? How should God's love for you affect your love for others?",
                "prayer": "Marvel at God's love shown in sending Jesus and thank Him for loving you first."
            }
        ]
    },

    "strength_in_weakness.json": {
        "title": "Strength in Weakness",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: 2 Corinthians 12:9-10",
                "overview": "Paul shares God's response to his plea for relief: 'My grace is sufficient for you, for my power is made perfect in weakness.' Paul learns to boast in weaknesses so Christ's power may rest upon him.",
                "reflection": "How is God's power made perfect in weakness? What weaknesses do you need to accept? How can you boast in weakness rather than resent it?",
                "prayer": "Ask God to show His power through your weaknesses and help you trust His sufficient grace."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Isaiah 40:29-31",
                "overview": "Isaiah promises that God gives power to the faint and strength to the powerless. Those who wait on the Lord renew their strength, mounting up with wings like eagles, running without weariness.",
                "reflection": "What does it mean to wait on the Lord? When have you experienced renewed strength from God? How does weakness position you to receive God's power?",
                "prayer": "Bring your weariness to God and ask Him to renew your strength as you wait on Him."
            },
            {
                "day": 3,
                "passage": "{{translation}}: Philippians 4:13",
                "overview": "Paul declares that he can do all things through Christ who strengthens him. This follows his discussion of being content in all circumstances—Christ provides strength for whatever God calls us to.",
                "reflection": "What impossible task is God calling you to? How have you experienced Christ's strengthening? What's the connection between contentment and strength?",
                "prayer": "Thank Christ for being your strength and ask Him to empower you for all He calls you to do."
            },
            {
                "day": 4,
                "passage": "{{translation}}: 2 Corinthians 4:7",
                "overview": "Paul describes believers as jars of clay holding a treasure—the surpassing power belongs to God, not to us. Our weakness showcases that the power is divine, not human.",
                "reflection": "Why does God use weak vessels? How does your weakness highlight God's power? What treasure do you carry in your earthen vessel?",
                "prayer": "Thank God for choosing to display His power through your weakness and making His strength evident."
            }
        ]
    },

    "the_call_to_obedience.json": {
        "title": "The Call to Obedience",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: John 14:15",
                "overview": "Jesus states simply: 'If you love me, you will keep my commandments.' Obedience is the natural expression of genuine love for Christ—not a burden but a joyful response to His love.",
                "reflection": "How does your obedience reflect your love for Jesus? What commandments are you struggling to keep? Is obedience a burden or delight to you?",
                "prayer": "Ask Jesus to deepen your love for Him so that obedience flows naturally from your heart."
            },
            {
                "day": 2,
                "passage": "{{translation}}: 1 Samuel 15:22",
                "overview": "Samuel rebukes Saul: 'Has the Lord as great delight in burnt offerings and sacrifices, as in obeying the voice of the Lord? Behold, to obey is better than sacrifice.' God values obedience over religious activity.",
                "reflection": "What religious activities might you use to substitute for obedience? Where is God calling you to simple obedience? How is obedience better than sacrifice?",
                "prayer": "Confess any partial obedience and commit to obeying God fully, not just performing religious duties."
            },
            {
                "day": 3,
                "passage": "{{translation}}: James 1:22",
                "overview": "James warns against being hearers of the word only, deceiving ourselves. We must be doers of the word. Knowing truth without obeying it is self-deception.",
                "reflection": "What truth do you know but aren't obeying? How can you become a better doer of the word? Where are you deceiving yourself?",
                "prayer": "Ask God to reveal any areas where you hear but don't obey, and give you grace to act on His word."
            },
            {
                "day": 4,
                "passage": "{{translation}}: Luke 6:46",
                "overview": "Jesus questions: 'Why do you call me 'Lord, Lord,' and not do what I tell you?' Calling Jesus Lord is meaningless without corresponding obedience to His commands.",
                "reflection": "In what ways do you call Jesus 'Lord' without obeying? What specific commands is Jesus speaking to you? How can you make your profession match your practice?",
                "prayer": "Commit to making Jesus truly Lord by obeying what He commands, not just calling Him Lord."
            }
        ]
    },

    "the_fear_of_the_lord.json": {
        "title": "The Fear of the Lord",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: Proverbs 9:10",
                "overview": "Solomon declares that the fear of the Lord is the beginning of wisdom, and knowledge of the Holy One is insight. True wisdom starts with proper reverence and awe of God.",
                "reflection": "What does it mean to fear the Lord? How is fear of God the foundation of wisdom? What does knowledge of the Holy One look like?",
                "prayer": "Ask God to give you a healthy fear of Him that leads to wisdom and understanding."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Psalm 111:10",
                "overview": "The psalmist echoes that the fear of the Lord is the beginning of wisdom, and all who practice it have good understanding. Fearing God produces both wisdom and practical discernment.",
                "reflection": "How do you practice the fear of the Lord? What understanding has come from fearing God? How does fearing God affect your daily decisions?",
                "prayer": "Pray for a deeper reverence for God that shapes all your thoughts and actions."
            },
            {
                "day": 3,
                "passage": "{{translation}}: Deuteronomy 10:12-13",
                "overview": "Moses asks what the Lord requires: to fear Him, walk in His ways, love Him, serve Him with all your heart and soul, and keep His commandments. Fear of God encompasses the whole relationship.",
                "reflection": "How does fearing God connect to loving and serving Him? What ways of God do you need to walk in? How do you serve God with all your heart?",
                "prayer": "Commit to fearing, loving, and serving God wholeheartedly, walking in His ways."
            },
            {
                "day": 4,
                "passage": "{{translation}}: Ecclesiastes 12:13",
                "overview": "After exploring life's meaning, Solomon concludes: Fear God and keep His commandments, for this is the whole duty of man. Fearing God and obeying Him is the purpose of human existence.",
                "reflection": "How does this summarize the meaning of life? What would change if you truly saw this as your whole duty? How are you fulfilling this purpose?",
                "prayer": "Recommit yourself to your fundamental purpose: fearing God and keeping His commandments."
            }
        ]
    },

    "the_way_of_humility.json": {
        "title": "The Way of Humility",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: Philippians 2:3-4",
                "overview": "Paul commands believers to do nothing from selfish ambition or conceit, but in humility count others more significant than themselves, looking to others' interests, not just their own.",
                "reflection": "Where do selfish ambition or conceit show up in your life? How can you count others more significant? Whose interests are you neglecting?",
                "prayer": "Ask God to root out selfish ambition and give you genuine humility toward others."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Philippians 2:5-8",
                "overview": "Paul points to Christ's supreme example of humility: though in the form of God, He emptied Himself, took the form of a servant, and humbled Himself to death on a cross.",
                "reflection": "What did Christ's humility cost Him? How does Jesus' example challenge you? What would it mean to have the same mind as Christ?",
                "prayer": "Thank Jesus for His humble sacrifice and ask for His mindset of humble service."
            },
            {
                "day": 3,
                "passage": "{{translation}}: James 4:6",
                "overview": "James quotes Scripture: God opposes the proud but gives grace to the humble. Pride puts us in opposition to God, while humility positions us to receive His grace.",
                "reflection": "Where is pride showing up in your life? How have you experienced God's opposition or grace? What does it mean to humble yourself before God?",
                "prayer": "Confess any pride and ask God to humble you and shower you with His grace."
            },
            {
                "day": 4,
                "passage": "{{translation}}: Matthew 23:12",
                "overview": "Jesus teaches that whoever exalts himself will be humbled, and whoever humbles himself will be exalted. God reverses human values—greatness comes through humble service.",
                "reflection": "How are you tempted to exalt yourself? What does it mean to humble yourself? How does God's promise of future exaltation encourage humility now?",
                "prayer": "Pray for grace to humble yourself, trusting God to exalt you in His time and way."
            },
            {
                "day": 5,
                "passage": "{{translation}}: 1 Peter 5:5-6",
                "overview": "Peter instructs younger believers to be subject to elders, and all to clothe themselves with humility toward one another. God opposes the proud but gives grace to the humble, so humble yourselves under God's mighty hand.",
                "reflection": "How do you show humility toward others? What does it mean to humble yourself under God's hand? How does humility relate to submission?",
                "prayer": "Ask God to clothe you with humility and help you submit to His mighty hand."
            }
        ]
    },

    "trusting_god's_timing.json": {
        "title": "Trusting God's Timing",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: Ecclesiastes 3:1",
                "overview": "Solomon declares there is a time for everything and a season for every activity under heaven. God orders events according to His perfect timing, not ours.",
                "reflection": "What are you impatient about? How does trusting God's timing change your perspective? What season are you in right now?",
                "prayer": "Ask God to help you trust His perfect timing and find peace in your current season."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Habakkuk 2:3",
                "overview": "God tells Habakkuk that the vision awaits its appointed time and will surely come, not delay. Though it seems slow, wait for it—God's timing is always perfect, never late.",
                "reflection": "What promises are you waiting for? How can you wait patiently when God seems slow? What does it mean that the vision will surely come?",
                "prayer": "Pray for patience to wait on God's timing, trusting that He will fulfill His promises."
            },
            {
                "day": 3,
                "passage": "{{translation}}: Psalm 27:14",
                "overview": "David exhorts: Wait for the Lord; be strong, and let your heart take courage; wait for the Lord! Waiting requires strength and courage, not passive resignation.",
                "reflection": "What makes waiting on God difficult? How can waiting be an act of strength? Where do you need courage to wait?",
                "prayer": "Ask God for strength and courage to actively wait on His perfect timing."
            },
            {
                "day": 4,
                "passage": "{{translation}}: Isaiah 40:31",
                "overview": "Isaiah promises that those who wait for the Lord shall renew their strength, mount up with wings like eagles, run without weariness, and walk without fainting.",
                "reflection": "How does waiting on God renew your strength? What does it mean to soar like eagles? When have you experienced this renewed strength?",
                "prayer": "Wait on the Lord and ask Him to renew your strength for whatever lies ahead."
            }
        ]
    },

    "walking_in_wisdom.json": {
        "title": "Walking in Wisdom",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: James 1:5",
                "overview": "James promises that if anyone lacks wisdom, they should ask God, who gives generously to all without reproach. Wisdom is available to those who ask in faith.",
                "reflection": "What decisions require wisdom? How do you ask God for wisdom? What does it mean that God gives without reproach?",
                "prayer": "Ask God for wisdom in specific situations you're facing, trusting He will give generously."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Proverbs 3:5-6",
                "overview": "Solomon instructs: Trust in the Lord with all your heart, lean not on your own understanding; in all your ways acknowledge Him, and He will make straight your paths.",
                "reflection": "Where are you relying on your own understanding? What does it mean to trust God with all your heart? How do you acknowledge God in all your ways?",
                "prayer": "Commit to trusting God fully and acknowledging Him in every area of your life."
            },
            {
                "day": 3,
                "passage": "{{translation}}: Colossians 2:3",
                "overview": "Paul reveals that in Christ are hidden all the treasures of wisdom and knowledge. True wisdom is found in relationship with Jesus, not apart from Him.",
                "reflection": "How is Christ the source of wisdom? What treasures of wisdom have you found in Him? Where are you seeking wisdom apart from Christ?",
                "prayer": "Thank Jesus for being your wisdom and ask Him to reveal His treasures to you."
            },
            {
                "day": 4,
                "passage": "{{translation}}: Proverbs 4:7",
                "overview": "Solomon declares that wisdom is supreme—therefore get wisdom. Though it cost all you have, get understanding. Wisdom is worth any price.",
                "reflection": "What would you sacrifice to gain wisdom? How are you actively pursuing wisdom? What does it mean that wisdom is supreme?",
                "prayer": "Commit to pursuing wisdom above all else, whatever the cost."
            }
        ]
    }
}

# Create files
short_dir = r"c:\Users\Demetrius\Documents\sword-drill\public\bible_study_plans\short"
for filename, content in short_plans.items():
    filepath = os.path.join(short_dir, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(content, f, indent=2, ensure_ascii=False)
    print(f"Created {filename}")

print(f"\nCompleted {len(short_plans)} more short Bible study plans")
print(f"Total: {10 + len(short_plans)} plans created")
