import json
import os

# Define all short plans with their content
short_plans = {
    "beatitudes.json": {
        "title": "Beatitudes",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: Matthew 5:3-5",
                "overview": "The Beatitudes begin with Jesus teaching about true blessedness. Today we explore the first three beatitudes: being poor in spirit, mourning, and meekness. These virtues reflect humility before God and a heart that recognizes its spiritual poverty.",
                "reflection": "What does it mean to be 'poor in spirit'? How does spiritual poverty lead to receiving the kingdom of heaven? In what ways can mourning and meekness be considered blessed?",
                "prayer": "Ask God to reveal areas where you need greater humility and spiritual dependence on Him."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Matthew 5:6-9",
                "overview": "Jesus continues with beatitudes about hungering for righteousness, showing mercy, purity of heart, and peacemaking. These characteristics reveal a heart transformed by God's grace, actively pursuing holiness and reconciliation.",
                "reflection": "What does it mean to hunger and thirst for righteousness? How can you be a peacemaker in your current relationships? What does purity of heart look like in daily life?",
                "prayer": "Pray for a deeper hunger for God's righteousness and the courage to be a peacemaker."
            },
            {
                "day": 3,
                "passage": "{{translation}}: Matthew 5:10-12",
                "overview": "The final beatitudes address persecution for righteousness' sake. Jesus teaches that suffering for His name brings great reward and connects believers to the prophets who suffered before them.",
                "reflection": "How should believers respond to persecution? What does it mean to rejoice in suffering for Christ's sake? How does the promise of heavenly reward sustain you?",
                "prayer": "Ask God for strength to stand firm in faith even when facing opposition or persecution."
            }
        ]
    },

    "enduring_hardship.json": {
        "title": "Enduring Hardship",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: James 1:2-4",
                "overview": "James teaches that trials test and strengthen our faith, producing perseverance and maturity. Rather than avoiding hardship, believers are called to find joy in it, knowing God is working through it.",
                "reflection": "How does viewing trials as opportunities change your perspective? What does it mean that testing produces steadfastness? How can you count it 'all joy' when facing difficulties?",
                "prayer": "Ask God to help you trust His purpose in the midst of current trials and hardships."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Romans 5:3-5",
                "overview": "Paul reveals the progression from suffering to hope. Through suffering we gain endurance, character, and ultimately hope that does not disappoint because of God's love poured into our hearts.",
                "reflection": "What character qualities have developed in you through past hardships? How does suffering produce hope? How have you experienced God's love during difficult times?",
                "prayer": "Pray for endurance and the ability to see God's character-building work in your struggles."
            },
            {
                "day": 3,
                "passage": "{{translation}}: 2 Corinthians 4:16-18",
                "overview": "Paul contrasts our temporary light afflictions with the eternal weight of glory being prepared. While outward circumstances may deteriorate, our inner being is renewed daily as we focus on eternal realities.",
                "reflection": "How can you shift your focus from visible troubles to unseen eternal things? What does daily inner renewal look like? How does the promise of eternal glory help you endure present hardship?",
                "prayer": "Ask God to renew your inner being daily and help you maintain an eternal perspective."
            },
            {
                "day": 4,
                "passage": "{{translation}}: 1 Peter 4:12-13",
                "overview": "Peter reminds believers not to be surprised by fiery trials, as they share in Christ's sufferings. These sufferings are opportunities to glorify God and will result in joy when Christ's glory is revealed.",
                "reflection": "Why should suffering for Christ not surprise believers? How do you share in Christ's sufferings? What does it mean to rejoice in suffering?",
                "prayer": "Pray for joy and steadfastness when facing trials for your faith in Christ."
            }
        ]
    },

    "fighting_battles.json": {
        "title": "Fighting Battles",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: Ephesians 6:10-13",
                "overview": "Paul reveals that our true battle is not against flesh and blood but against spiritual forces. Believers must be strong in the Lord and put on the full armor of God to stand firm against spiritual schemes.",
                "reflection": "What does it mean that our struggle is not against flesh and blood? How do you strengthen yourself in the Lord? What spiritual battles are you currently facing?",
                "prayer": "Ask God to open your eyes to the spiritual nature of your struggles and to strengthen you in Him."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Ephesians 6:14-17",
                "overview": "Paul describes each piece of spiritual armor: truth, righteousness, the gospel of peace, faith, salvation, and the Word of God. Each piece protects believers in spiritual warfare and enables them to stand firm.",
                "reflection": "Which pieces of armor do you need to put on more intentionally? How does God's Word function as a sword? What does it mean to have your feet fitted with readiness from the gospel?",
                "prayer": "Pray for God's help in daily putting on each piece of spiritual armor."
            },
            {
                "day": 3,
                "passage": "{{translation}}: 2 Corinthians 10:3-5",
                "overview": "Paul explains that though we live in the world, we don't wage war as the world does. Our weapons have divine power to demolish strongholds and take every thought captive to obey Christ.",
                "reflection": "What are the divine weapons available to believers? What mental strongholds need to be demolished in your life? How can you take thoughts captive to obey Christ?",
                "prayer": "Ask God to demolish spiritual strongholds and help you bring every thought into obedience to Christ."
            },
            {
                "day": 4,
                "passage": "{{translation}}: James 4:7",
                "overview": "James provides a simple but powerful strategy: submit to God, resist the devil, and he will flee. Victory comes through surrender to God and active resistance against evil.",
                "reflection": "What does submission to God look like in your daily life? How do you actively resist the devil? What areas need greater submission?",
                "prayer": "Pray for the grace to fully submit to God and the strength to resist temptation and spiritual attack."
            }
        ]
    },

    "forgiveness_and_mercy.json": {
        "title": "Forgiveness and Mercy",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: Matthew 6:14-15",
                "overview": "Jesus directly connects our forgiveness of others with God's forgiveness of us. This is not about earning salvation but about the evidence of a forgiven heart—those who have received mercy extend mercy to others.",
                "reflection": "Why is forgiving others essential to the Christian life? Who in your life needs your forgiveness? What does this passage reveal about the heart of God?",
                "prayer": "Ask God to reveal any unforgiveness in your heart and give you grace to forgive others as you have been forgiven."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Matthew 18:21-35",
                "overview": "Through the parable of the unforgiving servant, Jesus teaches that forgiveness should be unlimited and reflects the massive debt God has cancelled for us. Refusing to forgive reveals a failure to grasp God's mercy.",
                "reflection": "How much have you been forgiven by God? How does understanding your own forgiveness motivate you to forgive others? What does the king's response to the unmerciful servant teach about God?",
                "prayer": "Thank God for His immeasurable mercy toward you and ask for a heart that freely forgives others."
            },
            {
                "day": 3,
                "passage": "{{translation}}: Colossians 3:12-13",
                "overview": "Paul instructs believers to clothe themselves with compassion, kindness, humility, meekness, and patience, bearing with one another and forgiving as the Lord forgave them. These qualities should characterize God's chosen people.",
                "reflection": "Which of these qualities do you need to 'put on' more intentionally? How does forgiving as the Lord forgave set the standard? What does it mean to bear with one another?",
                "prayer": "Pray that God would clothe you with His character and enable you to forgive freely and fully."
            },
            {
                "day": 4,
                "passage": "{{translation}}: Ephesians 4:31-32",
                "overview": "Paul contrasts bitterness, anger, and malice with kindness, tenderheartedness, and forgiveness. Believers are to forgive one another as God in Christ forgave them—completely and at great cost.",
                "reflection": "What bitterness, anger, or malice do you need to put away? How does Christ's forgiveness of you serve as the model? What would it look like to be tenderhearted toward those who have wronged you?",
                "prayer": "Ask God to remove all bitterness from your heart and replace it with Christlike compassion and forgiveness."
            }
        ]
    },

    "gratitude_lifestyle.json": {
        "title": "Gratitude Lifestyle",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: 1 Thessalonians 5:16-18",
                "overview": "Paul commands believers to rejoice always, pray continually, and give thanks in all circumstances. This is God's will for those in Christ Jesus—a life marked by constant gratitude regardless of external conditions.",
                "reflection": "How can you rejoice always when circumstances are difficult? What does it mean to give thanks in all circumstances versus for all circumstances? How does prayer connect to gratitude?",
                "prayer": "Ask God to cultivate a heart of constant thankfulness and help you see His goodness in every situation."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Psalm 100:1-5",
                "overview": "This psalm calls all people to worship the Lord with gladness, recognizing Him as Creator and Shepherd. Gratitude flows from understanding God's character—His goodness, steadfast love, and faithfulness endure forever.",
                "reflection": "What aspects of God's character inspire your gratitude? How does knowing God as your Shepherd affect your thankfulness? What does it mean to enter His gates with thanksgiving?",
                "prayer": "Praise God for His goodness, steadfast love, and faithfulness that endure forever."
            },
            {
                "day": 3,
                "passage": "{{translation}}: Colossians 3:15-17",
                "overview": "Paul instructs believers to let peace rule in their hearts and be thankful. Everything done in word or deed should be done in Jesus' name, giving thanks to God the Father through Him.",
                "reflection": "How does thankfulness connect to peace in your heart? What would change if you did everything in Jesus' name with thanksgiving? How can you let the word of Christ dwell richly in you?",
                "prayer": "Pray for a thankful heart that permeates all your words and actions, bringing glory to God."
            },
            {
                "day": 4,
                "passage": "{{translation}}: Philippians 4:4-7",
                "overview": "Paul repeats his command to rejoice in the Lord and presents an alternative to anxiety—prayer with thanksgiving. When we bring our requests to God with grateful hearts, His peace guards our hearts and minds.",
                "reflection": "How does thanksgiving drive out anxiety? What requests do you need to bring to God with a thankful heart? How have you experienced God's peace that surpasses understanding?",
                "prayer": "Thank God for specific blessings and bring your anxieties to Him, trusting His peace to guard your heart."
            }
        ]
    },

    "guarding_your_heart.json": {
        "title": "Guarding Your Heart",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: Proverbs 4:23",
                "overview": "Solomon warns that above all else, we must guard our hearts because everything we do flows from it. The heart is the wellspring of life—our thoughts, attitudes, and actions all stem from our inner being.",
                "reflection": "What does it mean to guard your heart? What are the greatest threats to your heart's purity? How do your actions reflect the condition of your heart?",
                "prayer": "Ask God to help you vigilantly guard your heart and reveal any areas of compromise."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Matthew 15:18-20",
                "overview": "Jesus teaches that what comes out of the mouth proceeds from the heart, and this is what defiles a person. Evil thoughts, murder, adultery, and other sins originate in the heart, not from external circumstances.",
                "reflection": "What does this passage reveal about the source of sin? How can you address sin at the heart level rather than just managing behavior? What comes from your heart in your words and actions?",
                "prayer": "Pray for God to cleanse your heart and transform you from the inside out."
            },
            {
                "day": 3,
                "passage": "{{translation}}: Philippians 4:8",
                "overview": "Paul provides a filter for what believers should allow into their minds: whatever is true, honorable, just, pure, lovely, commendable, excellent, and praiseworthy. Guarding the heart begins with controlling our thought life.",
                "reflection": "What media, conversations, or thoughts fail this test? How can you be more intentional about what you allow into your mind? What excellent and praiseworthy things can you dwell on?",
                "prayer": "Ask God to help you discipline your mind and focus on things that honor Him."
            },
            {
                "day": 4,
                "passage": "{{translation}}: Psalm 51:10",
                "overview": "David's prayer after his sin with Bathsheba reveals his recognition that only God can create a clean heart and renew a right spirit within him. True heart transformation requires God's intervention.",
                "reflection": "What does a clean heart look like? In what areas do you need God to renew a right spirit? How does confession lead to restoration?",
                "prayer": "Pray David's prayer—ask God to create a clean heart in you and renew a steadfast spirit within you."
            }
        ]
    },

    "hearing_god's_word.json": {
        "title": "Hearing God's Word",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: James 1:22-25",
                "overview": "James warns against merely hearing the Word without doing what it says. True disciples look intently into God's Word and act on it, experiencing blessing in their obedience.",
                "reflection": "Are you a hearer only or also a doer of the Word? What is one truth from Scripture you need to obey more fully? How does the Word serve as a mirror for your soul?",
                "prayer": "Ask God to help you not just hear His Word but actively obey it in all areas of life."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Matthew 7:24-27",
                "overview": "Jesus compares those who hear and obey His words to a wise builder on rock, while those who hear but don't obey are like a fool building on sand. When storms come, only the obedient stand firm.",
                "reflection": "What foundation is your life built on? What storms have revealed the strength or weakness of your spiritual foundation? How can you build more firmly on Christ's words?",
                "prayer": "Pray for wisdom to build your life on the solid foundation of obedience to God's Word."
            },
            {
                "day": 3,
                "passage": "{{translation}}: Luke 8:15",
                "overview": "In explaining the parable of the sower, Jesus describes good soil as those who hear the word with an honest and good heart, hold it fast, and bear fruit with patience. The condition of our hearts determines fruitfulness.",
                "reflection": "What kind of soil is your heart? What prevents the Word from bearing fruit in your life? How can you cultivate a heart that receives and retains God's Word?",
                "prayer": "Ask God to prepare your heart as good soil that receives His Word and bears lasting fruit."
            },
            {
                "day": 4,
                "passage": "{{translation}}: Romans 10:17",
                "overview": "Paul explains that faith comes from hearing, and hearing through the word of Christ. The Word is the means by which God builds our faith and draws people to salvation.",
                "reflection": "How has hearing God's Word strengthened your faith? Who needs to hear the word of Christ from you? How can you prioritize hearing and meditating on Scripture?",
                "prayer": "Thank God for His Word and pray for opportunities to share it with others who need to hear."
            }
        ]
    },

    "honoring_god_daily.json": {
        "title": "Honoring God Daily",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: 1 Corinthians 10:31",
                "overview": "Paul teaches that whether we eat or drink or whatever we do, everything should be done for God's glory. No action is too mundane or ordinary to be an act of worship when done for God's honor.",
                "reflection": "How can everyday activities like eating and drinking bring glory to God? What would change if you did everything consciously for God's glory? What areas of life need to be reoriented toward honoring God?",
                "prayer": "Ask God to help you live every moment for His glory, making all of life an act of worship."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Colossians 3:23-24",
                "overview": "Paul instructs believers to work heartily as for the Lord rather than for men, knowing they will receive an inheritance as reward. Even ordinary work becomes sacred service when done for Christ.",
                "reflection": "How does working for the Lord change your attitude toward your daily tasks? What would change if you truly saw your work as service to Christ? How does the promise of eternal reward motivate you?",
                "prayer": "Pray for a heart that serves the Lord wholeheartedly in all work, not merely pleasing people."
            },
            {
                "day": 3,
                "passage": "{{translation}}: Romans 12:1-2",
                "overview": "Paul urges believers to present their bodies as living sacrifices, holy and acceptable to God—this is their spiritual worship. Rather than conforming to the world, they should be transformed by renewing their minds.",
                "reflection": "What does it mean to be a living sacrifice? In what ways are you tempted to conform to the world's patterns? How is your mind being renewed?",
                "prayer": "Offer yourself completely to God as a living sacrifice and ask Him to transform your thinking."
            },
            {
                "day": 4,
                "passage": "{{translation}}: Psalm 19:14",
                "overview": "David prays that the words of his mouth and the meditation of his heart would be acceptable in God's sight. This reflects a heart concerned with honoring God in both speech and inward thoughts.",
                "reflection": "Are your words and thoughts pleasing to God? What changes when you view God as your Rock and Redeemer? How can you be more mindful of honoring God in your speech and thoughts?",
                "prayer": "Pray that all your words and inward thoughts would be acceptable to the Lord."
            }
        ]
    },

    "hope_renewed.json": {
        "title": "Hope Renewed",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: Romans 15:13",
                "overview": "Paul prays that the God of hope would fill believers with all joy and peace in believing, so that by the power of the Holy Spirit they may abound in hope. Hope is a gift from God that overflows through the Spirit.",
                "reflection": "How is God specifically called 'the God of hope'? What role does the Holy Spirit play in hope? How do joy and peace connect to hope?",
                "prayer": "Ask the God of hope to fill you with joy and peace, causing you to overflow with hope by His Spirit."
            },
            {
                "day": 2,
                "passage": "{{translation}}: Lamentations 3:21-24",
                "overview": "Amid deep suffering, Jeremiah finds hope by remembering God's steadfast love and mercies that are new every morning. God's faithfulness is the ground of renewed hope even in darkness.",
                "reflection": "How does remembering God's character renew hope? What does it mean that His mercies are new every morning? How is the Lord your portion?",
                "prayer": "Thank God for His unfailing mercies and faithfulness, and ask Him to renew your hope today."
            },
            {
                "day": 3,
                "passage": "{{translation}}: 1 Peter 1:3-5",
                "overview": "Peter blesses God for His great mercy in giving believers a living hope through Christ's resurrection. This hope is anchored in an imperishable inheritance kept in heaven, guarded by God's power through faith.",
                "reflection": "Why is this called a 'living hope'? How does Christ's resurrection secure your hope? What comfort do you find in knowing your inheritance is kept safely in heaven?",
                "prayer": "Praise God for the living hope you have through Jesus' resurrection and for securing your eternal inheritance."
            },
            {
                "day": 4,
                "passage": "{{translation}}: Hebrews 6:19-20",
                "overview": "The author describes hope as a sure and steadfast anchor of the soul, entering behind the curtain where Jesus has gone as our forerunner. Our hope is secured by Christ's work on our behalf.",
                "reflection": "How is hope like an anchor? What makes this hope sure and steadfast? How does Jesus as your forerunner give you confidence?",
                "prayer": "Thank Jesus for entering God's presence on your behalf and anchoring your soul with certain hope."
            }
        ]
    },

    "letting_go_of_anger.json": {
        "title": "Letting Go of Anger",
        "default_translation": "ESV",
        "days": [
            {
                "day": 1,
                "passage": "{{translation}}: Ephesians 4:26-27",
                "overview": "Paul acknowledges that anger itself isn't always sinful but warns not to let the sun go down on anger, as this gives the devil a foothold. Unresolved anger becomes destructive and provides opportunity for evil.",
                "reflection": "What is the difference between righteous anger and sinful anger? Why is it important to resolve anger quickly? How has unresolved anger given the enemy a foothold in your life?",
                "prayer": "Ask God to help you process anger in healthy ways and resolve conflicts before they fester."
            },
            {
                "day": 2,
                "passage": "{{translation}}: James 1:19-20",
                "overview": "James instructs believers to be quick to hear, slow to speak, and slow to anger, for human anger does not produce the righteousness that God requires. Patient listening prevents many angry outbursts.",
                "reflection": "How can you become quicker to listen and slower to speak? Why doesn't human anger produce God's righteousness? What triggers your anger most easily?",
                "prayer": "Pray for patience in listening, wisdom in speaking, and self-control in managing anger."
            },
            {
                "day": 3,
                "passage": "{{translation}}: Proverbs 15:1",
                "overview": "Solomon reveals that a soft answer turns away wrath, but a harsh word stirs up anger. How we respond to provocation determines whether conflict escalates or de-escalates.",
                "reflection": "When has a soft answer defused a tense situation? How can you respond gently when provoked? What harsh words do you need to avoid?",
                "prayer": "Ask God for grace to respond with gentleness rather than harshness, even when provoked."
            },
            {
                "day": 4,
                "passage": "{{translation}}: Colossians 3:8",
                "overview": "Paul commands believers to put away anger, wrath, malice, slander, and obscene talk. These are remnants of the old self that must be discarded, replaced by the character of Christ.",
                "reflection": "Which of these sins most characterizes your old self? What does it mean to 'put away' anger? How does your new identity in Christ motivate this change?",
                "prayer": "Confess any anger, wrath, or malice and ask God to complete His transforming work in you."
            }
        ]
    }
}

# Create short plans directory and write files
short_dir = r"c:\Users\Demetrius\Documents\sword-drill\public\bible_study_plans\short"
for filename, content in short_plans.items():
    filepath = os.path.join(short_dir, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(content, f, indent=2, ensure_ascii=False)
    print(f"Created {filename}")

print(f"\nCompleted {len(short_plans)} short Bible study plans")
