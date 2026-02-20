import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen, ChevronRight, CheckCircle, ArrowLeft, Book, Scroll, Trophy, Award, RotateCcw, X, Calendar
} from 'lucide-react';
import { updateUserProgress } from '../services/dbService';
import {
  FINAL_EXAM_NOVEL_RATIO,
  FINAL_EXAM_PASS_PERCENT,
  FINAL_EXAM_TOTAL_QUESTIONS,
  buildFinalExamFromUnitsAndFinal
} from '../services/finalExamBuilder';

const UNITS = [
  {
    id: '01', title: 'Foundations of Sacred Time', icon: '📜', duration: '25 min',
    content: [
      { heading: 'God\'s Appointed Times (Mo\'adim)', text: 'The biblical feast days are not mere cultural traditions or human inventions. Leviticus 23:2 introduces them with a striking declaration: "Speak to the Israelites and say to them: These are my appointed festivals, the appointed festivals of the LORD, which you are to proclaim as sacred assemblies." The Hebrew word mo\'adim (singular mo\'ed) means "appointed times" or "fixed meetings," conveying the idea that God Himself has set specific times on His calendar for encounters with His people.\n\nThis concept of sacred time is foundational to biblical theology. While pagan religions often viewed time as cyclical and meaningless, the biblical worldview presents time as linear, purposeful, and moving toward God\'s redemptive goals. The feasts are not random celebrations but divinely orchestrated rehearsals (miqra\'ei qodesh, "holy convocations" or literally "holy rehearsals") of God\'s great acts of salvation, past, present, and future.' },
      { heading: 'The Structure of Leviticus 23', text: 'Leviticus 23 is the central chapter for understanding the biblical feast system. It presents seven appointed times (plus the weekly Sabbath) organized into two seasonal clusters tied to the agricultural calendar of ancient Israel. The Spring Feasts (Passover, Unleavened Bread, Firstfruits, and Weeks/Pentecost) occur during the barley and wheat harvests from March to June. The Fall Feasts (Trumpets, Day of Atonement, and Tabernacles) occur during the fruit harvest in September and October.\n\nThis dual structure is theologically significant. The Spring Feasts have been understood by Christians as fulfilled in Christ\'s first coming (His death, burial, resurrection, and the sending of the Holy Spirit), while the Fall Feasts point to events associated with His second coming (the rapture/resurrection, judgment, and the establishment of God\'s kingdom). The gap between the two clusters corresponds to the present age of the church.' },
      { heading: 'Sacred Time vs. Sacred Space', text: 'A remarkable feature of biblical theology is that God sanctifies time before He sanctifies space. The first thing God declares "holy" in Scripture is not a place but a day: the seventh day, the Sabbath (Genesis 2:3). Only later does God designate holy places (the tabernacle, the temple). This priority of sacred time over sacred space means that the feasts travel with God\'s people wherever they go. Israel could observe the Sabbath in Egyptian slavery, in the wilderness, in the Promised Land, and even in Babylonian exile.\n\nThis principle has profound implications. When the temple was destroyed in AD 70, the sacrificial aspects of the feasts ceased, but the observance of sacred time continued. For Christians, the fulfillment of the feasts in Christ means that sacred time is now experienced "in Him" rather than through the temple system, though the prophetic patterns encoded in the feasts remain instructive.' },
      { heading: 'The Agricultural and Redemptive Dimensions', text: 'Each feast operates on at least three levels simultaneously: agricultural, historical/memorial, and prophetic/eschatological. Agriculturally, the feasts mark key moments in the farming year: planting, firstfruits, harvest. Historically, they commemorate God\'s acts of redemption, especially the Exodus from Egypt. Prophetically, they prefigure God\'s future acts of salvation through the Messiah.\n\nFor example, Passover is simultaneously a spring lamb sacrifice (agricultural), a memorial of deliverance from Egypt (historical), and a prophecy of the Lamb of God who takes away the sin of the world (prophetic). This multi-layered meaning is what makes the feasts inexhaustibly rich for study. Understanding all three dimensions is essential for grasping their full theological significance.' }
    ],
    keyTerms: [
      { term: 'Mo\'adim', definition: '"Appointed times" or "fixed meetings" — God\'s scheduled encounters with His people (Lev 23:2)' },
      { term: 'Miqra Qodesh', definition: '"Holy convocation" or "holy rehearsal" — a sacred assembly called by God' },
      { term: 'Leviticus 23', definition: 'The central biblical chapter listing all seven appointed feasts plus the weekly Sabbath' },
      { term: 'Three Pilgrimages', definition: 'Passover, Weeks, and Tabernacles — the three feasts requiring pilgrimage to Jerusalem (Deut 16:16)' }
    ],
    quiz: [
      { question: 'What does the Hebrew word "mo\'adim" mean?', options: ['Holy days', 'Appointed times/fixed meetings', 'Sacrificial offerings', 'Temple services'], correct: 1, explanation: 'Mo\'adim means "appointed times" or "fixed meetings," indicating that God Himself has scheduled specific times for encounters with His people.' },
      { question: 'Which chapter of Leviticus is the central text listing all the biblical feasts?', options: ['Leviticus 16', 'Leviticus 19', 'Leviticus 23', 'Leviticus 25'], correct: 2, explanation: 'Leviticus 23 is the primary chapter presenting all seven appointed feasts plus the weekly Sabbath in a single, organized passage.' },
      { question: 'What is the first thing God declares "holy" in Scripture?', options: ['The tabernacle', 'Mount Sinai', 'The seventh day (Sabbath)', 'The Ark of the Covenant'], correct: 2, explanation: 'God sanctifies time before space — the seventh day is the first thing declared holy in Scripture (Genesis 2:3).' },
      { question: 'The Spring Feasts are generally associated with which event in Christian theology?', options: ['Creation', 'Christ\'s first coming', 'The Second Coming', 'The Millennium'], correct: 1, explanation: 'The Spring Feasts (Passover, Unleavened Bread, Firstfruits, Weeks) are understood as fulfilled in Christ\'s first coming — His death, burial, resurrection, and the sending of the Spirit.' },
      { question: 'On how many levels does each feast operate simultaneously?', options: ['One — historical only', 'Two — agricultural and historical', 'Three — agricultural, historical, and prophetic', 'Four — agricultural, historical, prophetic, and mystical'], correct: 2, explanation: 'Each feast operates on three levels: agricultural (farming calendar), historical/memorial (God\'s past acts), and prophetic/eschatological (future fulfillment).' }
    ]
  },
  {
    id: '02', title: 'The Weekly Sabbath (Shabbat)', icon: '\u{1F54A}\uFE0F', duration: '25 min',
    content: [
      { heading: 'Institution at Creation', text: 'The Sabbath is the foundation of all biblical sacred time. Genesis 2:1-3 records: "By the seventh day God had finished the work he had been doing; so on the seventh day he rested from all his work. Then God blessed the seventh day and made it holy, because on it he rested from all the work of creating that he had done." The Hebrew verb shavat means "to cease" or "to stop," not merely "to rest" in the sense of recovering from fatigue. God\'s Sabbath rest is the rest of completion and satisfaction, not exhaustion.\n\nThe Sabbath is unique among the appointed times because it recurs weekly, establishing the fundamental rhythm of biblical time. It precedes the Mosaic covenant, being rooted in creation itself. When the Sabbath commandment appears in the Decalogue (Exodus 20:8-11), the reason given is creation: "For in six days the LORD made the heavens and the earth... but he rested on the seventh day." In Deuteronomy 5:12-15, a second reason is added: deliverance from Egypt. The Sabbath thus commemorates both God\'s creative and redemptive work.' },
      { heading: 'Sabbath in the Torah', text: 'The Sabbath commandment is the longest of the Ten Commandments and the only ceremonial observance included in the Decalogue, underscoring its supreme importance. Exodus 31:13-17 calls the Sabbath a "sign" (ot) between God and Israel forever, "so you may know that I am the LORD, who makes you holy." Violating the Sabbath carried the death penalty (Exodus 31:14-15; Numbers 15:32-36), indicating that it was not merely a social custom but a covenant obligation of the highest order.\n\nThe Sabbath extended beyond personal rest. Servants, animals, resident aliens, and even the land itself were to rest (Exodus 23:12; Leviticus 25:4). The manna provision in Exodus 16 established Sabbath observance even before Sinai: a double portion fell on the sixth day, and none appeared on the seventh. This required trust in God\'s provision, making the Sabbath a weekly exercise in faith. The showbread in the tabernacle was also renewed every Sabbath (Leviticus 24:8), connecting Sabbath to worship.' },
      { heading: 'Sabbath in Second Temple Judaism', text: 'By the Second Temple period, the Sabbath had become the most distinctive marker of Jewish identity. The Maccabean crisis demonstrated its importance: some Jews chose death rather than fight on the Sabbath (1 Maccabees 2:29-38), though this policy was later modified to allow defensive warfare. The Pharisees developed elaborate Sabbath regulations, eventually codified in the Mishnah tractate Shabbat, which identifies 39 categories of prohibited work (avot melakhah) derived from the types of labor used in building the tabernacle.\n\nThese 39 categories include sowing, plowing, reaping, binding sheaves, threshing, winnowing, baking, shearing wool, washing wool, dyeing, spinning, weaving, tying knots, writing, building, kindling a fire, and carrying objects in public space, among others. Each category was further subdivided into derivative prohibitions (toladot). This extensive legal development aimed to "build a fence around the Torah," preventing even accidental Sabbath violation, though critics (including Jesus) argued that it sometimes obscured the Sabbath\'s original purpose.' },
      { heading: 'Jesus and the Sabbath', text: 'Jesus\' Sabbath controversies are among the most significant episodes in the Gospels. He healed on the Sabbath (Mark 3:1-6; Luke 13:10-17; John 5:1-18; 9:1-41), and his disciples plucked grain on the Sabbath (Mark 2:23-28). In each case, Jesus did not abolish the Sabbath but challenged the Pharisaic interpretation that prioritized prohibition over compassion.\n\nJesus declared, "The Sabbath was made for man, not man for the Sabbath. So the Son of Man is Lord even of the Sabbath" (Mark 2:27-28). This revolutionary statement asserted both the Sabbath\'s human-centered purpose and Jesus\' authority over it. In the book of Hebrews, the Sabbath becomes a type of the eschatological rest awaiting God\'s people: "There remains, then, a Sabbath-rest for the people of God" (Hebrews 4:9). The Sabbath thus points beyond itself to the ultimate rest found in Christ and consummated in the age to come.' }
    ],
    keyTerms: [
      { term: 'Shabbat', definition: 'From the Hebrew shavat, "to cease" — the weekly day of rest on the seventh day (Saturday)' },
      { term: 'Ot (Sign)', definition: 'The Sabbath as a covenant sign between God and Israel (Exodus 31:13-17)' },
      { term: 'Avot Melakhah', definition: 'The 39 categories of prohibited work on the Sabbath, codified in the Mishnah' },
      { term: 'Sabbath Rest (Hebrews 4)', definition: 'The eschatological rest that the weekly Sabbath foreshadows, fulfilled in Christ' }
    ],
    quiz: [
      { question: 'What does the Hebrew verb "shavat" mean?', options: ['To worship', 'To sacrifice', 'To cease or stop', 'To celebrate'], correct: 2, explanation: 'Shavat means "to cease" or "to stop," conveying the idea of completion and satisfaction rather than recovery from exhaustion.' },
      { question: 'How many categories of prohibited work on the Sabbath are identified in the Mishnah?', options: ['7', '10', '39', '70'], correct: 2, explanation: 'The Mishnah tractate Shabbat identifies 39 categories of prohibited work (avot melakhah), derived from the types of labor used in building the tabernacle.' },
      { question: 'What did Jesus declare about the Sabbath in Mark 2:27-28?', options: ['The Sabbath should be abolished', 'The Sabbath was made for man, not man for the Sabbath', 'The Sabbath should be moved to Sunday', 'The Sabbath is only for priests'], correct: 1, explanation: 'Jesus declared, "The Sabbath was made for man, not man for the Sabbath. So the Son of Man is Lord even of the Sabbath" (Mark 2:27-28).' },
      { question: 'What does Exodus 31:13-17 call the Sabbath?', options: ['A blessing', 'A sign (ot) between God and Israel', 'A new moon festival', 'A harvest celebration'], correct: 1, explanation: 'Exodus 31:13-17 calls the Sabbath a "sign" (ot) between God and Israel forever, signifying that God is the one who makes them holy.' },
      { question: 'According to Hebrews 4:9, what does the Sabbath foreshadow?', options: ['The destruction of the temple', 'An eschatological rest for God\'s people', 'The founding of the church', 'The rebuilding of Jerusalem'], correct: 1, explanation: 'Hebrews 4:9 states "There remains a Sabbath-rest for the people of God," interpreting the Sabbath as a type of the ultimate rest found in Christ.' }
    ]
  },
  {
    id: '03', title: 'Passover (Pesach)', icon: '🩸', duration: '30 min',
    content: [
      { heading: 'The Passover Institution (Exodus 12)', text: 'The Passover (Pesach) is the foundational feast of biblical religion. Instituted on the night of Israel\'s deliverance from Egypt, it marks the birth of the nation of Israel and establishes the pattern of redemption through substitutionary sacrifice. Exodus 12:1-14 prescribes the ritual: on the tenth day of the first month (Nisan/Abib), each household was to select a lamb "without defect," a male, one year old. The lamb was kept until the fourteenth day, then slaughtered "at twilight" (Hebrew: ben ha-arbayim, "between the two evenings").\n\nThe blood of the lamb was to be applied to the doorposts and lintel of each Israelite house. When the LORD passed through Egypt to strike down the firstborn, He would "pass over" (pasach) the houses marked with blood. The lamb was roasted whole and eaten with unleavened bread (matzot) and bitter herbs (maror). Nothing was to remain until morning; any leftovers were to be burned. The participants ate in haste, with their sandals on and staffs in hand, ready for departure. This dramatic ritual enacted the theology of salvation: judgment falls on all, but God provides a substitute whose blood marks out and protects His people.' },
      { heading: 'Passover in Israel\'s History', text: 'The Passover was observed at key turning points in Israel\'s history, each time marking a moment of covenant renewal and national rededication. Joshua led the people in Passover at Gilgal after crossing the Jordan (Joshua 5:10-12), the first observance in the Promised Land. King Hezekiah celebrated a great Passover during his reforms, inviting even the northern tribes to participate (2 Chronicles 30). King Josiah\'s Passover (2 Chronicles 35:1-19) was the greatest since the days of Samuel, accompanying his dramatic religious reforms after the discovery of the Book of the Law.\n\nAfter the exile, the returned community under Ezra observed Passover (Ezra 6:19-22), marking the reconstitution of Israel as a worshipping community. By the first century AD, Passover had become the premier pilgrimage festival. Josephus estimates that as many as 256,000 lambs were sacrificed in a single Passover in Jerusalem. Pilgrims filled the city, increasing its normal population by several hundred thousand. The Romans kept extra troops on hand during Passover because of the heightened nationalist sentiment the festival aroused.' },
      { heading: 'The Seder and Its Elements', text: 'By the Second Temple period, the Passover observance had developed into the Seder (Hebrew: "order"), a structured meal with specific ritual elements. The Mishnah tractate Pesachim describes the first-century observance: four cups of wine were drunk at prescribed intervals, each associated with one of God\'s four promises of redemption in Exodus 6:6-7 ("I will bring you out... I will free you... I will redeem you... I will take you as my own people").\n\nThe meal included the recitation of the Haggadah ("telling"), in which the youngest child asks four questions about why this night is different. The head of the household then retells the Exodus story, fulfilling Exodus 13:8: "On that day tell your son, \'I do this because of what the LORD did for me when I came out of Egypt.\'" The unleavened bread (matzah), bitter herbs (maror), charoset (a sweet paste symbolizing the mortar of slavery), a roasted lamb bone, a roasted egg, and green herbs (karpas) all carry symbolic meaning. The Hallel psalms (Psalms 113-118) were sung, concluding with the great Hallel (Psalm 136).' },
      { heading: 'Christ Our Passover', text: 'The New Testament presents Jesus as the ultimate Passover lamb. Paul states explicitly: "Christ, our Passover lamb, has been sacrificed" (1 Corinthians 5:7). The Gospel of John is particularly careful to connect Jesus\' death with Passover symbolism. Jesus is crucified on the Day of Preparation for Passover (John 19:14), at approximately the same hour the Passover lambs were being slaughtered in the temple. John 19:36 notes that none of Jesus\' bones were broken, fulfilling the Passover requirement (Exodus 12:46).\n\nThe Last Supper was almost certainly a Passover meal (or closely associated with it). Jesus took the bread and wine of the Seder and invested them with new meaning: "This is my body... This is my blood of the covenant" (Mark 14:22-24). The third cup (the "cup of redemption") becomes the cup of the new covenant. The fourth cup (the "cup of consummation") may be the cup Jesus said He would not drink again "until that day when I drink it new in the kingdom of God" (Mark 14:25), pointing to the eschatological fulfillment at His return. Peter calls believers those "redeemed... with the precious blood of Christ, a lamb without blemish or defect" (1 Peter 1:18-19), echoing Exodus 12\'s requirement of a perfect lamb.' }
    ],
    keyTerms: [
      { term: 'Pesach', definition: '"Passover" — from the Hebrew meaning "to pass over" or "to spare," commemorating God\'s deliverance of Israel from the tenth plague' },
      { term: 'Ben Ha-Arbayim', definition: '"Between the two evenings" — the time prescribed for slaughtering the Passover lamb (approximately 3-5 PM)' },
      { term: 'Seder', definition: '"Order" — the structured Passover meal with ritual elements including four cups of wine, matzah, maror, and the Haggadah' },
      { term: 'Haggadah', definition: '"Telling" — the liturgical retelling of the Exodus story during the Passover Seder' }
    ],
    quiz: [
      { question: 'On what day of the month Nisan was the Passover lamb to be selected?', options: ['The first day', 'The tenth day', 'The fourteenth day', 'The fifteenth day'], correct: 1, explanation: 'According to Exodus 12:3, the lamb was selected on the tenth day of Nisan, then kept until the fourteenth day when it was slaughtered.' },
      { question: 'What was applied to the doorposts and lintel of Israelite houses?', options: ['Oil', 'Water', 'The blood of the lamb', 'Hyssop'], correct: 2, explanation: 'The blood of the Passover lamb was applied to the doorposts and lintel as a sign for God to "pass over" that house during the tenth plague (Exodus 12:7, 13).' },
      { question: 'How many cups of wine are part of the Passover Seder?', options: ['One', 'Two', 'Three', 'Four'], correct: 3, explanation: 'Four cups of wine are drunk at prescribed intervals during the Seder, each associated with one of God\'s four promises of redemption in Exodus 6:6-7.' },
      { question: 'What does Paul state in 1 Corinthians 5:7?', options: ['The Sabbath is fulfilled', 'Christ, our Passover lamb, has been sacrificed', 'The temple will be rebuilt', 'Circumcision is unnecessary'], correct: 1, explanation: 'Paul explicitly identifies Jesus as the Passover lamb: "Christ, our Passover lamb, has been sacrificed" (1 Corinthians 5:7).' },
      { question: 'Which psalms were sung during the Passover Seder?', options: ['Psalms 1-6', 'Psalms 23-28', 'Psalms 113-118 (the Hallel)', 'Psalms 146-150'], correct: 2, explanation: 'The Hallel psalms (Psalms 113-118) were sung during the Passover Seder, with Psalm 136 (the Great Hallel) often added.' }
    ]
  },
  {
    id: '04', title: 'Feast of Unleavened Bread (Chag HaMatzot)', icon: '🍞', duration: '25 min',
    content: [
      { heading: 'The Seven-Day Festival', text: 'Immediately following Passover, the Feast of Unleavened Bread begins on the fifteenth of Nisan and continues for seven days (Leviticus 23:6-8). The first and seventh days are special sabbaths with sacred assemblies and no regular work. Though Passover (14 Nisan) and Unleavened Bread (15-21 Nisan) are technically distinct festivals, they became so closely associated that the terms were used interchangeably by the first century (Luke 22:1: "the Festival of Unleavened Bread, called the Passover").\n\nDuring these seven days, all leaven (se\'or) and leavened bread (chametz) were to be completely removed from Israelite homes and not consumed. Exodus 12:15 warns: "whoever eats anything with yeast in it from the first day through the seventh must be cut off from Israel." The thoroughness of this removal was striking — even a small amount of leaven contaminated the whole batch (cf. 1 Corinthians 5:6). The unleavened bread (matzah) itself was to be eaten throughout the week as a reminder of the hasty departure from Egypt, when there was no time for dough to rise (Exodus 12:39).' },
      { heading: 'The Symbolism of Leaven', text: 'Leaven (se\'or/chametz) carries rich symbolic meaning in Scripture. In the context of the Exodus, it represents the old life of Egypt — slavery, idolatry, and corruption. Removing leaven symbolizes the radical break with the past that redemption requires. Just as the Israelites were to leave Egypt completely, with no lingering attachment to the old life, so the removal of leaven enacted the totality of their separation.\n\nIn the New Testament, Jesus warns against "the leaven of the Pharisees and Sadducees" (Matthew 16:6-12), identifying it as their teaching and hypocrisy. Paul develops the metaphor most fully in 1 Corinthians 5:6-8: "Don\'t you know that a little yeast leavens the whole batch of dough? Get rid of the old yeast, so that you may be a new unleavened batch — as you really are. For Christ, our Passover lamb, has been sacrificed. Therefore let us keep the Festival, not with the old bread leavened with malice and wickedness, but with the unleavened bread of sincerity and truth." Here Paul treats the Feast of Unleavened Bread as a present spiritual reality for believers, not merely a historical memorial.' },
      { heading: 'Observance in Israel\'s History', text: 'The seven-day observance of Unleavened Bread created a sustained period of reflection and consecration. Unlike Passover, which was a single evening event, Unleavened Bread extended the experience of deliverance across an entire week. Every meal during this period — eaten without leaven — served as a tangible reminder of God\'s redemptive act and the call to holiness.\n\nIn Second Temple practice, the preparation for the feast involved meticulous cleaning of the home to remove every trace of leaven. This practice, known as bedikat chametz ("the search for leaven"), involved a ceremonial search of the house by candlelight on the evening before Passover. Any leaven found was swept up, set aside, and burned the next morning (bi\'ur chametz, "the destruction of leaven"). This ritualized search became a powerful metaphor for self-examination and the purging of sin, a theme echoed in Paul\'s exhortation to "examine yourselves" (2 Corinthians 13:5).' },
      { heading: 'Theological Significance and Fulfillment', text: 'The Feast of Unleavened Bread corresponds theologically to sanctification — the ongoing process of removing sin from the believer\'s life after the initial act of redemption (Passover). If Passover represents justification (the moment of salvation through the blood of the Lamb), Unleavened Bread represents the daily walk of holiness that follows. The seven-day duration suggests completeness: sanctification is not a one-time event but a comprehensive, ongoing process.\n\nJesus was buried on the first day of Unleavened Bread (15 Nisan), His sinless body placed in the tomb. The traditional matzah itself bears physical marks that echo this: it is striped (by the baking process), pierced (to prevent rising), and without leaven (sinless). While these parallels should not be pressed beyond what Scripture explicitly states, they illustrate how deeply the feast patterns correspond to the events of Christ\'s passion. The burial of Jesus during Unleavened Bread enacts the principle that sin (leaven) must be put away through the sacrifice of the sinless one.' }
    ],
    keyTerms: [
      { term: 'Chametz', definition: 'Leavened bread or any food containing leaven, forbidden during the Feast of Unleavened Bread' },
      { term: 'Matzah', definition: 'Unleavened bread, flat bread made without yeast, eaten during the seven-day feast' },
      { term: 'Bedikat Chametz', definition: '"Search for leaven" — the ceremonial search of the house by candlelight to remove all traces of leaven' },
      { term: 'Bi\'ur Chametz', definition: '"Destruction of leaven" — the burning of any leaven found during the search' }
    ],
    quiz: [
      { question: 'How many days does the Feast of Unleavened Bread last?', options: ['One day', 'Three days', 'Seven days', 'Eight days'], correct: 2, explanation: 'The Feast of Unleavened Bread lasts seven days, from the 15th through the 21st of Nisan (Leviticus 23:6-8).' },
      { question: 'What does leaven symbolize in the New Testament?', options: ['Blessing and abundance', 'Malice, wickedness, and false teaching', 'The Holy Spirit', 'God\'s provision'], correct: 1, explanation: 'Jesus identifies leaven with false teaching (Matt 16:6-12), and Paul identifies it with malice and wickedness (1 Cor 5:6-8).' },
      { question: 'What is "bedikat chametz"?', options: ['The Passover meal', 'The ceremonial search for leaven in the house', 'The blessing over bread', 'The sacrifice of the lamb'], correct: 1, explanation: 'Bedikat chametz is the ceremonial search of the house by candlelight on the evening before Passover to remove all traces of leaven.' },
      { question: 'What Christian doctrine does the Feast of Unleavened Bread most closely correspond to?', options: ['Justification', 'Sanctification', 'Glorification', 'Election'], correct: 1, explanation: 'Unleavened Bread corresponds to sanctification — the ongoing process of removing sin from the believer\'s life after the initial act of redemption (Passover/justification).' },
      { question: 'What warning does Exodus 12:15 give about eating leaven during the feast?', options: ['A fine must be paid', 'The person must bring an extra offering', 'The person must be cut off from Israel', 'The person must fast for three days'], correct: 2, explanation: 'Exodus 12:15 states that "whoever eats anything with yeast in it from the first day through the seventh must be cut off from Israel."' }
    ]
  },
  {
    id: '05', title: 'Feast of Firstfruits (Yom HaBikkurim)', icon: '🌾', duration: '25 min',
    content: [
      { heading: 'The Wave Sheaf Offering', text: 'The Feast of Firstfruits is prescribed in Leviticus 23:9-14. On "the day after the Sabbath" during the Feast of Unleavened Bread, the priest was to wave a sheaf (omer) of the first grain harvested before the LORD. This wave offering consecrated the entire harvest: until the firstfruits were offered, the people were not to eat any bread or roasted grain from the new crop. The firstfruits belonged to God, and offering them first acknowledged His ownership of the whole harvest and expressed trust in His continued provision.\n\nThe specific timing — "the day after the Sabbath" — generated significant debate in Second Temple Judaism. The Sadducees understood "Sabbath" literally as the weekly Sabbath, placing Firstfruits always on a Sunday. The Pharisees interpreted "Sabbath" as the festival sabbath of Unleavened Bread (15 Nisan), placing Firstfruits always on 16 Nisan regardless of the day of the week. This interpretive difference had implications for the dating of Pentecost, which is counted from Firstfruits.' },
      { heading: 'The Theology of Firstfruits', text: 'The concept of firstfruits (bikkurim) pervades biblical theology. The firstborn son belonged to God and had to be redeemed (Exodus 13:2, 12-13). The first portion of harvest, flocks, and increase was set apart for the LORD. This principle expressed the conviction that God is the source of all blessing and that giving Him the first portion sanctifies the rest.\n\nDeuteronomy 26:1-11 prescribes a beautiful confession to accompany the firstfruits offering: the worshipper would recount Israel\'s history from Abraham\'s wandering through Egyptian slavery to divine deliverance, concluding with praise for the gift of the Promised Land. This confession situated each individual harvest within the grand narrative of redemption. The offering of firstfruits was thus not merely agricultural but deeply theological — an act of remembrance, gratitude, and faith.' },
      { heading: 'Christ the Firstfruits', text: 'The New Testament identifies Jesus\' resurrection as the fulfillment of the Feast of Firstfruits. Paul makes this connection explicit in 1 Corinthians 15:20-23: "But Christ has indeed been raised from the dead, the firstfruits of those who have fallen asleep. For since death came through a man, the resurrection of the dead comes also through a man. For as in Adam all die, so in Christ all will be made alive. But each in turn: Christ, the firstfruits; then, when he comes, those who belong to him."\n\nThe timing is remarkable. Jesus was crucified on Passover (14 Nisan), buried at the start of Unleavened Bread (15 Nisan), and rose from the dead on the day of Firstfruits — "the day after the Sabbath." His resurrection is the "wave sheaf" presented before the Father, consecrating the entire harvest of those who will be raised. Just as the Israelites could not partake of the new harvest until the firstfruits were offered, so the general resurrection awaits the prior resurrection of Christ, who is "the firstborn from among the dead" (Colossians 1:18).' },
      { heading: 'Matthew 27:52-53 and the Firstfruits Harvest', text: 'A striking but often overlooked passage connects Jesus\' resurrection to a broader firstfruits harvest. Matthew 27:52-53 records: "The tombs broke open. The bodies of many holy people who had died were raised to life. They came out of the tombs after Jesus\' resurrection and went into the holy city and appeared to many people." This mysterious event may represent a literal firstfruits offering — a small group of saints raised as a pledge and preview of the full resurrection harvest to come.\n\nThis passage, unique to Matthew, suggests that Jesus\' resurrection was not merely an individual event but the beginning of the general resurrection, a down payment on the final harvest. It illustrates the principle that the firstfruits consecrate and guarantee the whole: because Christ has been raised, those who belong to Him will certainly be raised as well. The Feast of Firstfruits thus encodes the entire Christian hope of resurrection in a single agricultural ritual.' }
    ],
    keyTerms: [
      { term: 'Bikkurim', definition: '"Firstfruits" — the first portion of the harvest, set apart for God as an act of consecration and faith' },
      { term: 'Omer', definition: 'A sheaf of grain waved before the LORD on the day of Firstfruits, consecrating the entire harvest' },
      { term: 'Firstfruits of the Resurrection', definition: 'Paul\'s term for Christ\'s resurrection as the guarantee and beginning of the general resurrection (1 Cor 15:20)' },
      { term: 'Wave Offering (Tenufah)', definition: 'The ritual of presenting the sheaf before the LORD by waving it, symbolizing dedication to God' }
    ],
    quiz: [
      { question: 'What was waved before the LORD on the Feast of Firstfruits?', options: ['A palm branch', 'A sheaf (omer) of grain', 'A lamb', 'Incense'], correct: 1, explanation: 'A sheaf (omer) of the first grain harvested was waved before the LORD on the Feast of Firstfruits (Leviticus 23:10-11).' },
      { question: 'What could the Israelites NOT do until the firstfruits were offered?', options: ['Drink wine', 'Enter the temple', 'Eat bread or grain from the new crop', 'Light fires'], correct: 2, explanation: 'Until the firstfruits were offered, the people were forbidden from eating any bread, roasted grain, or new grain from the harvest (Leviticus 23:14).' },
      { question: 'Who does Paul identify as "the firstfruits of those who have fallen asleep"?', options: ['Abraham', 'Moses', 'Christ', 'David'], correct: 2, explanation: 'Paul writes, "Christ has indeed been raised from the dead, the firstfruits of those who have fallen asleep" (1 Corinthians 15:20).' },
      { question: 'When was the Feast of Firstfruits observed?', options: ['The first day of Nisan', 'The day after the Sabbath during Unleavened Bread', 'Fifty days after Passover', 'The first day of the seventh month'], correct: 1, explanation: 'Firstfruits was observed on "the day after the Sabbath" during the Feast of Unleavened Bread (Leviticus 23:11).' },
      { question: 'What event in Matthew 27:52-53 may represent a firstfruits harvest?', options: ['The tearing of the temple veil', 'The earthquake', 'Holy people raised from the dead after Jesus\' resurrection', 'The darkening of the sky'], correct: 2, explanation: 'Matthew 27:52-53 records many holy people being raised and appearing in Jerusalem after Jesus\' resurrection, possibly representing a literal firstfruits offering of the resurrection harvest.' }
    ]
  },
  {
    id: '06', title: 'Feast of Weeks / Pentecost (Shavuot)', icon: '🔥', duration: '30 min',
    content: [
      { heading: 'Counting the Omer', text: 'The Feast of Weeks (Shavuot) is calculated by counting seven complete weeks (49 days) from the Feast of Firstfruits, with the festival falling on the fiftieth day (Leviticus 23:15-16). The Greek name "Pentecost" (pentekostos, "fiftieth") derives from this counting. This period of counting, called "Counting the Omer" (Sefirat HaOmer), links Firstfruits to Weeks as a continuous season of anticipation.\n\nShavuot is one of the three pilgrimage festivals (shalosh regalim) requiring all males to appear before the LORD in Jerusalem (Deuteronomy 16:16). Unlike the other feasts, Shavuot has no fixed calendar date — it is determined entirely by counting from Firstfruits. The offering on this day was distinctive: two loaves of bread baked WITH leaven (Leviticus 23:17), the only time leavened bread was offered at the altar. This unique requirement has generated much theological reflection, as leaven elsewhere symbolizes sin or corruption.' },
      { heading: 'Agricultural and Historical Significance', text: 'Agriculturally, Shavuot marked the end of the wheat harvest, the culmination of the grain season that began with the barley harvest at Firstfruits. The two leavened loaves represented the completed harvest presented to God. Additional offerings included seven yearling lambs, one young bull, and two rams as burnt offerings, along with grain offerings, drink offerings, a male goat for a sin offering, and two lambs for a fellowship offering (Leviticus 23:18-19).\n\nHistorically, Jewish tradition associated Shavuot with the giving of the Torah at Mount Sinai. Exodus 19:1 states that Israel arrived at Sinai "in the third month" after leaving Egypt, which corresponds approximately to the timing of Shavuot. By the rabbinic period, Shavuot was explicitly celebrated as Zman Matan Torateinu ("the time of the giving of our Torah"). The synagogue reading for Shavuot included the account of the Sinai theophany (Exodus 19-20) and the book of Ruth, set during the wheat harvest.' },
      { heading: 'Pentecost in Acts 2', text: 'The outpouring of the Holy Spirit on the day of Pentecost (Acts 2:1-41) is presented as the fulfillment of the Feast of Weeks. The parallels with Sinai are striking and intentional. At Sinai, God descended in fire, the mountain shook, and a loud sound was heard (Exodus 19:16-18). At Pentecost, "tongues of fire" appeared, the house was shaken, and a sound "like a violent wind" filled the place (Acts 2:2-3). At Sinai, the Torah was written on stone tablets by the finger of God. At Pentecost, the Spirit wrote God\'s law on human hearts, fulfilling Jeremiah 31:33 and Ezekiel 36:26-27.\n\nThe reversal of Babel (Genesis 11:1-9) is also echoed: at Babel, languages were confused and people scattered; at Pentecost, the Spirit enabled communication across language barriers, gathering people from "every nation under heaven" (Acts 2:5). The two leavened loaves may symbolize the inclusion of both Jews and Gentiles in the one body of Christ. Peter\'s sermon resulted in about 3,000 converts (Acts 2:41), perhaps contrasting with the 3,000 who died at Sinai after the golden calf incident (Exodus 32:28).' },
      { heading: 'Theological Fulfillment', text: 'The theological significance of Pentecost\'s fulfillment is profound. If Passover corresponds to justification and Unleavened Bread to sanctification, Pentecost corresponds to empowerment for mission. The Spirit is given not merely for personal edification but to empower the church as a witness "to the ends of the earth" (Acts 1:8). The harvest imagery is apt: the Spirit\'s coming initiates the great spiritual harvest of souls that the church has been gathering ever since.\n\nThe two leavened loaves, unique among the feast offerings, may indicate that the Spirit-filled community is not yet perfected. Unlike the unleavened matzah of sinless Christ, the church is a leavened offering — a redeemed but not yet glorified people. This tension between the "already" and "not yet" of salvation is central to New Testament theology. The Spirit is the "guarantee" (arrabon, down payment) of the full inheritance yet to come (Ephesians 1:13-14), and Pentecost marks the beginning of the harvest that will be completed at Christ\'s return.' }
    ],
    keyTerms: [
      { term: 'Shavuot', definition: '"Weeks" — the Hebrew name for the Feast of Weeks, celebrating the wheat harvest and traditionally the giving of the Torah' },
      { term: 'Pentecost', definition: 'From Greek pentekostos ("fiftieth") — the fiftieth day after Firstfruits, when the Holy Spirit was poured out (Acts 2)' },
      { term: 'Sefirat HaOmer', definition: '"Counting of the Omer" — the 49-day counting period from Firstfruits to the Feast of Weeks' },
      { term: 'Arrabon', definition: '"Guarantee/down payment" — Paul\'s term for the Holy Spirit as a pledge of the full inheritance (Eph 1:13-14)' }
    ],
    quiz: [
      { question: 'How many days after Firstfruits does the Feast of Weeks occur?', options: ['Seven days', 'Forty days', 'Fifty days', 'Seventy days'], correct: 2, explanation: 'The Feast of Weeks occurs on the fiftieth day after Firstfruits, hence the Greek name "Pentecost" (pentekostos, "fiftieth").' },
      { question: 'What was unique about the bread offering on Shavuot?', options: ['It was made of barley', 'Two loaves were baked WITH leaven', 'It was not bread but grain', 'It was offered at night'], correct: 1, explanation: 'The two loaves offered at Shavuot were uniquely baked with leaven (Leviticus 23:17), the only time leavened bread was offered at the altar.' },
      { question: 'What historical event did Jewish tradition associate with Shavuot?', options: ['The crossing of the Red Sea', 'The fall of Jericho', 'The giving of the Torah at Sinai', 'The dedication of Solomon\'s temple'], correct: 2, explanation: 'Jewish tradition associated Shavuot with the giving of the Torah at Sinai, celebrating it as Zman Matan Torateinu ("the time of the giving of our Torah").' },
      { question: 'How many converts resulted from Peter\'s sermon at Pentecost?', options: ['120', '500', '3,000', '5,000'], correct: 2, explanation: 'About 3,000 people were converted through Peter\'s Pentecost sermon (Acts 2:41), possibly contrasting with the 3,000 who died after the golden calf at Sinai.' },
      { question: 'What does Paul call the Holy Spirit in Ephesians 1:13-14?', options: ['A gift', 'A guarantee/down payment (arrabon)', 'A seal', 'A blessing'], correct: 1, explanation: 'Paul calls the Holy Spirit the arrabon ("guarantee" or "down payment") of the full inheritance, connecting to the harvest imagery of Pentecost as the beginning of a greater harvest.' }
    ]
  },
  {
    id: '07', title: 'Feast of Trumpets (Yom Teruah)', icon: '📯', duration: '25 min',
    content: [
      { heading: 'The Command to Sound the Trumpet', text: 'The Feast of Trumpets (Yom Teruah, "Day of Blowing/Shouting") occurs on the first day of the seventh month (Tishri), marking the beginning of the Fall Feast season. Leviticus 23:23-25 commands: "On the first day of the seventh month you are to have a day of sabbath rest, a sacred assembly commemorated with trumpet blasts. Do no regular work, but present a food offering to the LORD." Numbers 29:1-6 adds detailed sacrificial requirements, including burnt offerings of a young bull, a ram, and seven male lambs, plus grain and drink offerings.\n\nThe biblical description of this feast is remarkably brief compared to the others, leaving much unstated. The text does not explain what the trumpet blasts signify or what is being commemorated. This brevity has generated extensive theological reflection in both Jewish and Christian traditions. The Hebrew word teruah refers to a loud shout, alarm, or blast — it is the same word used for the battle cry, the alarm of war, and the joyful shout of worship. The instrument traditionally used is the shofar, a ram\'s horn, connecting the feast to the binding of Isaac (the Akedah, Genesis 22), where a ram was provided as a substitute.' },
      { heading: 'Rosh Hashanah in Jewish Tradition', text: 'In post-biblical Judaism, Yom Teruah became known as Rosh Hashanah ("Head of the Year"), the Jewish New Year. The Mishnah (Rosh Hashanah 1:1) identifies four "new years" in the Jewish calendar, with 1 Tishri being the new year for calculating sabbatical and jubilee years, and for the tithing of vegetables and grain. The association with the new year introduced themes of divine kingship and creation, with Jewish tradition holding that the world was created on this day.\n\nThe liturgy of Rosh Hashanah centers on three themes, each associated with specific shofar blasts: Malkhuyot (Sovereignty, declaring God as King), Zikhronot (Remembrance, God\'s remembering His covenant), and Shofarot (Shofar blasts, recalling Sinai and anticipating the messianic age). One hundred shofar blasts are sounded during the synagogue service. The ten days from Rosh Hashanah to Yom Kippur are called the Yamim Nora\'im ("Days of Awe") or Aseret Yemei Teshuvah ("Ten Days of Repentance"), a period of intense self-examination, repentance, and seeking reconciliation with God and neighbor.' },
      { heading: 'Trumpets in Biblical Theology', text: 'The trumpet (shofar or chatzotzrot) appears throughout Scripture at decisive moments. Trumpets accompanied the theophany at Sinai (Exodus 19:16, 19). Trumpets brought down Jericho\'s walls (Joshua 6). Trumpets announced the Year of Jubilee (Leviticus 25:9). Trumpets signaled the coronation of kings (2 Kings 9:13; 1 Kings 1:34, 39). Trumpets called the assembly to gather and mobilized the camps for marching (Numbers 10:1-10). In every case, the trumpet signals a momentous divine intervention or transition.\n\nThe prophets use trumpet imagery extensively for the Day of the LORD. Joel 2:1: "Blow the trumpet in Zion; sound the alarm on my holy hill. Let all who live in the land tremble, for the day of the LORD is coming." Zephaniah 1:14-16 describes the Day of the LORD as "a day of trumpet and battle cry." Isaiah 27:13: "In that day a great trumpet will sound. Those who were perishing in Assyria and those who were exiled in Egypt will come and worship the LORD on the holy mountain in Jerusalem." The trumpet thus signals both judgment and gathering, both warning and redemption.' },
      { heading: 'Prophetic Fulfillment: The Last Trumpet', text: 'Christians have connected the Feast of Trumpets with the return of Christ and the resurrection/rapture of believers. Paul writes: "For the Lord himself will come down from heaven, with a loud command, with the voice of the archangel and with the trumpet call of God, and the dead in Christ will rise first" (1 Thessalonians 4:16). In 1 Corinthians 15:51-52: "Listen, I tell you a mystery: We will not all sleep, but we will all be changed — in a flash, in the twinkling of an eye, at the last trumpet. For the trumpet will sound, the dead will be raised imperishable, and we will be changed."\n\nThe book of Revelation features seven trumpets (Revelation 8-11), with the seventh trumpet announcing: "The kingdom of the world has become the kingdom of our Lord and of his Messiah, and he will reign for ever and ever" (Revelation 11:15). If the Spring Feasts were fulfilled at Christ\'s first coming in precise chronological order (Passover = crucifixion, Unleavened Bread = burial, Firstfruits = resurrection, Pentecost = Spirit), many interpreters expect the Fall Feasts to be fulfilled at His second coming in similar order: Trumpets = the rapture/resurrection, Atonement = judgment, Tabernacles = the messianic kingdom.' }
    ],
    keyTerms: [
      { term: 'Yom Teruah', definition: '"Day of Blowing/Shouting" — the biblical name for the Feast of Trumpets on 1 Tishri' },
      { term: 'Shofar', definition: 'A ram\'s horn trumpet, the instrument traditionally sounded on the Feast of Trumpets' },
      { term: 'Rosh Hashanah', definition: '"Head of the Year" — the Jewish New Year, the post-biblical name for Yom Teruah' },
      { term: 'Yamim Nora\'im', definition: '"Days of Awe" — the ten days from Rosh Hashanah to Yom Kippur, devoted to repentance and self-examination' }
    ],
    quiz: [
      { question: 'On what day of which month is the Feast of Trumpets observed?', options: ['1st of Nisan', '14th of Nisan', '1st of Tishri (7th month)', '10th of Tishri'], correct: 2, explanation: 'The Feast of Trumpets falls on the first day of the seventh month, Tishri (Leviticus 23:23-25).' },
      { question: 'What instrument is traditionally sounded on this feast?', options: ['A silver trumpet (chatzotzrot)', 'A harp', 'A shofar (ram\'s horn)', 'A cymbal'], correct: 2, explanation: 'The shofar (ram\'s horn) is the instrument traditionally sounded, connecting to the ram provided as a substitute in the Akedah (Genesis 22).' },
      { question: 'What are the "Yamim Nora\'im"?', options: ['The three pilgrimage festivals', 'The ten Days of Awe from Rosh Hashanah to Yom Kippur', 'The seven days of Unleavened Bread', 'The 49 days of Counting the Omer'], correct: 1, explanation: 'The Yamim Nora\'im ("Days of Awe") are the ten days from Rosh Hashanah to Yom Kippur, devoted to repentance and self-examination.' },
      { question: 'What does Paul associate with "the last trumpet" in 1 Corinthians 15:51-52?', options: ['The destruction of the temple', 'The resurrection and transformation of believers', 'The giving of the Torah', 'The pouring out of the Spirit'], correct: 1, explanation: 'Paul writes that "at the last trumpet... the dead will be raised imperishable, and we will be changed" (1 Corinthians 15:52), associating the trumpet with resurrection.' },
      { question: 'How many shofar blasts are traditionally sounded during the Rosh Hashanah synagogue service?', options: ['7', '30', '70', '100'], correct: 3, explanation: 'One hundred shofar blasts are traditionally sounded during the Rosh Hashanah synagogue service, organized around three liturgical themes.' }
    ]
  },
  {
    id: '08', title: 'Day of Atonement (Yom Kippur)', icon: '⚖️', duration: '30 min',
    content: [
      { heading: 'The Most Sacred Day', text: 'The Day of Atonement (Yom Kippur, literally "Day of Coverings") falls on the tenth day of the seventh month (Tishri) and is the most solemn day in the biblical calendar. Leviticus 23:27-32 commands: "On the tenth day of this seventh month is the Day of Atonement. It shall be for you a time of holy convocation, and you shall afflict yourselves... It shall be to you a Sabbath of solemn rest, and you shall afflict yourselves." The "affliction" is understood as fasting and self-denial. This is the only mandated fast day in the Torah.\n\nThe gravity of Yom Kippur is underscored by its penalties: "Anyone who does not deny themselves on that day must be cut off from their people. I will destroy from among their people anyone who does any work on that day" (Leviticus 23:29-30). It was a complete Sabbath — no work of any kind was permitted. The day was dedicated entirely to dealing with the problem of sin that separated the holy God from His covenant people.' },
      { heading: 'The Leviticus 16 Ritual', text: 'The elaborate Day of Atonement ritual is detailed in Leviticus 16. It was the only day of the year when the High Priest (kohen gadol) entered the Holy of Holies (the debir), the innermost sanctum of the tabernacle/temple where God\'s presence dwelt above the mercy seat (kapporet) on the Ark of the Covenant. The High Priest first bathed and dressed in simple white linen garments (not his ornate vestments), symbolizing humility and purity.\n\nThe ritual involved multiple sacrifices: a bull as a sin offering for the High Priest and his household (even the mediator needed atonement); two goats chosen by lot — one "for the LORD" (sacrificed as a sin offering for the people) and one "for Azazel" (the scapegoat, sent into the wilderness bearing the sins of the people). The High Priest sprinkled the blood of the bull and the LORD\'s goat on the mercy seat and before it, purifying the Holy of Holies, the Holy Place, and the altar from the accumulated defilement of Israel\'s sins over the past year (Leviticus 16:16-19). The entire sanctuary was thus "reset" to a state of holiness.' },
      { heading: 'The Scapegoat (Azazel)', text: 'The scapegoat ritual (Leviticus 16:20-22) is one of the most dramatic and theologically rich ceremonies in Scripture. After the High Priest had completed the blood rituals, he laid both hands on the head of the live goat and confessed over it "all the wickedness and rebellion of the Israelites — all their sins." He then sent the goat away into the wilderness (midbar) in the care of an appointed man. The goat carried on itself "all their sins to a remote place" (literally "a land of cutting off").\n\nThe two goats together represent a complete picture of atonement: the slain goat demonstrates that sin requires death (the wages of sin), while the scapegoat demonstrates that sin is removed and carried away (as far as the east is from the west). In rabbinic practice (Mishnah Yoma 6:6), a scarlet thread was tied to the scapegoat\'s horns; tradition held that the thread would turn white when the goat reached the wilderness, confirming God\'s acceptance of the atonement (cf. Isaiah 1:18: "Though your sins are like scarlet, they shall be as white as snow"). The Talmud records that this sign ceased forty years before the temple\'s destruction — approximately AD 30.' },
      { heading: 'Fulfillment in Christ', text: 'The book of Hebrews devotes extensive attention to Christ as the fulfillment of Yom Kippur. Hebrews 9:11-14 declares: "When Christ came as high priest of the good things that are now already here, he went through the greater and more perfect tabernacle that is not made with human hands... He did not enter by means of the blood of goats and calves; but he entered the Most Holy Place once for all by his own blood, thus obtaining eternal redemption."\n\nJesus fulfills both the role of the High Priest who enters the Holy of Holies and the sacrifice whose blood makes atonement. He is simultaneously the one who offers and the offering itself. Unlike the earthly High Priest who entered yearly, Christ entered "once for all" (ephapax), indicating the finality and sufficiency of His sacrifice. Hebrews 10:1-4 explains why the annual repetition was necessary under the old covenant: "it is impossible for the blood of bulls and goats to take away sins." Christ\'s sacrifice achieves what the animal sacrifices could only foreshadow. The prophetic dimension points to a future national atonement for Israel: "They will look on me, the one they have pierced, and they will mourn" (Zechariah 12:10), an event many interpreters associate with the eschatological fulfillment of Yom Kippur.' }
    ],
    keyTerms: [
      { term: 'Yom Kippur', definition: '"Day of Coverings/Atonement" — the most solemn day of the biblical calendar, on 10 Tishri' },
      { term: 'Kapporet', definition: 'The "mercy seat" or atonement cover on the Ark of the Covenant, where blood was sprinkled on Yom Kippur' },
      { term: 'Azazel', definition: 'The "scapegoat" — the goat sent into the wilderness bearing the sins of the people (Lev 16:20-22)' },
      { term: 'Ephapax', definition: '"Once for all" — the Greek term in Hebrews for the finality of Christ\'s atoning sacrifice' }
    ],
    quiz: [
      { question: 'On what day of the seventh month is Yom Kippur observed?', options: ['The 1st', 'The 7th', 'The 10th', 'The 15th'], correct: 2, explanation: 'The Day of Atonement falls on the tenth day of the seventh month, Tishri (Leviticus 23:27).' },
      { question: 'Who was the only person permitted to enter the Holy of Holies, and only on this day?', options: ['The king', 'Any priest', 'The High Priest (kohen gadol)', 'The prophet'], correct: 2, explanation: 'Only the High Priest could enter the Holy of Holies, and only on the Day of Atonement (Leviticus 16:2, 34).' },
      { question: 'What happened to the scapegoat?', options: ['It was sacrificed on the altar', 'It was sent into the wilderness bearing the people\'s sins', 'It was released into the temple courts', 'It was given to the poor'], correct: 1, explanation: 'The scapegoat was sent into the wilderness carrying "all the wickedness and rebellion of the Israelites" (Leviticus 16:21-22).' },
      { question: 'According to Hebrews, how many times did Christ enter the Most Holy Place?', options: ['Once a year', 'Three times', 'Once for all (ephapax)', 'Seven times'], correct: 2, explanation: 'Christ entered the Most Holy Place "once for all" (ephapax) by His own blood, obtaining eternal redemption (Hebrews 9:12).' },
      { question: 'What does Hebrews 10:4 say about animal sacrifices?', options: ['They are sufficient for all time', 'It is impossible for the blood of bulls and goats to take away sins', 'They must continue until the temple is rebuilt', 'They are equivalent to Christ\'s sacrifice'], correct: 1, explanation: 'Hebrews 10:4 states, "It is impossible for the blood of bulls and goats to take away sins," explaining why Christ\'s superior sacrifice was necessary.' }
    ]
  },
  {
    id: '09', title: 'Feast of Tabernacles (Sukkot)', icon: '⛺', duration: '30 min',
    content: [
      { heading: 'The Festival of Joy', text: 'The Feast of Tabernacles (Sukkot, "Booths") is the last and greatest of the seven appointed feasts, running from the fifteenth to the twenty-first of Tishri, with an additional "eighth day" assembly (Shemini Atzeret) on the twenty-second. Leviticus 23:33-43 prescribes the observance: the Israelites were to live in temporary shelters (sukkot) for seven days and rejoice before the LORD with "branches of luxuriant trees" — traditionally identified as palm fronds (lulav), myrtle (hadas), willow (aravah), and citron fruit (etrog).\n\nSukkot is the preeminent festival of joy. Deuteronomy 16:14-15 commands: "Be joyful at your festival... For seven days celebrate the festival to the LORD your God at the place the LORD will choose. For the LORD your God will bless you in all your harvest and in all the work of your hands, and your joy will be complete." The Mishnah records: "He who has not seen the rejoicing at the water-drawing ceremony has never seen rejoicing in his life" (Sukkah 5:1). This was the final harvest festival of the year, celebrating the completion of the agricultural cycle and God\'s faithful provision.' },
      { heading: 'The Sukkah and Its Meaning', text: 'The sukkah (booth or tabernacle) was a temporary shelter with a roof of branches through which the stars could be seen. Living in these fragile structures for a week had multiple layers of meaning. Historically, it commemorated Israel\'s forty years of wilderness wandering, when God sheltered and provided for His people (Leviticus 23:43: "so your descendants will know that I had the Israelites live in temporary shelters when I brought them out of Egypt").\n\nTheologically, the sukkah embodies the tension between vulnerability and divine protection. The flimsy structure reminds the inhabitant that ultimate security lies not in permanent buildings but in God\'s presence. Psalm 27:5 declares: "For in the day of trouble he will keep me safe in his dwelling (sukkah); he will hide me in the shelter of his sacred tent." The sukkah also symbolizes the impermanence of earthly life and the hope for God\'s eternal dwelling with His people. Paul may allude to this when he writes: "For we know that if the earthly tent we live in is destroyed, we have a building from God, an eternal house in heaven" (2 Corinthians 5:1).' },
      { heading: 'The Water-Drawing Ceremony and Jesus', text: 'During the Second Temple period, Sukkot included a dramatic water-drawing ceremony (Simchat Bet HaShoevah) not prescribed in the Torah but deeply meaningful. Each morning during the seven days of Sukkot, a priest processed from the Pool of Siloam to the temple carrying a golden pitcher of water, which he poured out at the base of the altar while the Levitical choir sang the Hallel and Isaiah 12:3: "With joy you will draw water from the wells of salvation." This ceremony was associated with prayers for rain (essential for the coming planting season) and with the prophetic promise of the Spirit being poured out.\n\nIt is in this context that Jesus\' dramatic declaration in John 7:37-38 takes on its full significance: "On the last and greatest day of the festival, Jesus stood and said in a loud voice, \'Let anyone who is thirsty come to me and drink. Whoever believes in me, as Scripture has said, rivers of living water will flow from within them.\'" John explains: "By this he meant the Spirit" (John 7:39). Jesus claimed to be the true source of the living water that the ceremony symbolized — the one who pours out the Holy Spirit. His bold, public declaration at the climax of the water ceremony was a clear messianic claim.' },
      { heading: 'Prophetic and Eschatological Fulfillment', text: 'Sukkot has the most explicitly eschatological vision of any feast. Zechariah 14:16-19 prophesies that in the messianic age, all nations will come up to Jerusalem to celebrate the Feast of Tabernacles: "Then the survivors from all the nations that have attacked Jerusalem will go up year after year to worship the King, the LORD Almighty, and to celebrate the Festival of Tabernacles." Any nation that refuses will receive no rain. This passage envisions Sukkot as a universal festival uniting all nations in worship of Israel\'s God.\n\nThe book of Revelation echoes Sukkot imagery throughout. The great multitude "from every nation, tribe, people and language" standing before the throne with palm branches (Revelation 7:9-10) evokes the lulav procession of Sukkot. Revelation 7:15-17 promises: "He who sits on the throne will shelter them with his presence" (literally "tabernacle over them"). And the ultimate vision: "Look! God\'s dwelling place (skene, tabernacle) is now among the people, and he will dwell with them" (Revelation 21:3). The Feast of Tabernacles points to the final consummation when God will dwell permanently with His people — the eternal sukkah replacing the temporary one, as the glory of God\'s presence fills all creation.' }
    ],
    keyTerms: [
      { term: 'Sukkot', definition: '"Booths/Tabernacles" — the seven-day feast of dwelling in temporary shelters, 15-21 Tishri' },
      { term: 'Lulav', definition: 'Palm branch, bound with myrtle and willow, waved during Sukkot worship along with the etrog (citron)' },
      { term: 'Simchat Bet HaShoevah', definition: '"Joy of the Water-Drawing" — the festive water ceremony during Sukkot at the Second Temple' },
      { term: 'Shemini Atzeret', definition: '"Eighth Day Assembly" — the additional day following the seven days of Sukkot (22 Tishri)' }
    ],
    quiz: [
      { question: 'How many days does the Feast of Tabernacles last?', options: ['Three days', 'Seven days (plus an eighth day assembly)', 'Ten days', 'Fourteen days'], correct: 1, explanation: 'Sukkot lasts seven days (15-21 Tishri), with an additional "eighth day" assembly (Shemini Atzeret) on the 22nd (Leviticus 23:33-36).' },
      { question: 'What did the Israelites live in during Sukkot?', options: ['Stone houses', 'Tents made of animal skins', 'Temporary shelters/booths (sukkot)', 'The temple courts'], correct: 2, explanation: 'During Sukkot, Israelites lived in temporary shelters (sukkot/booths) made of branches, commemorating the wilderness wandering (Leviticus 23:42-43).' },
      { question: 'What did Jesus declare during the water-drawing ceremony at Sukkot (John 7:37-38)?', options: ['"I am the bread of life"', 'Let anyone who is thirsty come to me and drink', '"Destroy this temple and I will raise it in three days"', '"I am the light of the world"'], correct: 1, explanation: 'During the climactic moment of the Sukkot water ceremony, Jesus declared, "Let anyone who is thirsty come to me and drink. Whoever believes in me, rivers of living water will flow from within them" (John 7:37-38).' },
      { question: 'According to Zechariah 14, what will happen regarding Sukkot in the messianic age?', options: ['It will be abolished', 'Only Israel will observe it', 'All nations will come to Jerusalem to celebrate it', 'It will be replaced by a new feast'], correct: 2, explanation: 'Zechariah 14:16 prophesies that in the messianic age, "the survivors from all the nations will go up year after year to worship the King, the LORD Almighty, and to celebrate the Festival of Tabernacles."' },
      { question: 'What does Revelation 21:3 envision as the ultimate fulfillment of Sukkot?', options: ['A new temple in Jerusalem', 'God\'s dwelling place (tabernacle) among His people permanently', 'The restoration of animal sacrifices', 'A return to the wilderness'], correct: 1, explanation: 'Revelation 21:3 declares, "God\'s dwelling place (skene/tabernacle) is now among the people, and he will dwell with them" — the eternal tabernacle replacing the temporary sukkah.' }
    ]
  },
  {
    id: '10', title: 'Sabbatical Year, Jubilee & Prophetic Synthesis', icon: '🎓', duration: '30 min',
    content: [
      { heading: 'The Sabbatical Year (Shemitah)', text: 'The principle of Sabbath rest extends beyond the weekly cycle to the land itself. Leviticus 25:1-7 commands that every seventh year, the land of Israel was to lie fallow: "In the seventh year the land is to have a year of sabbath rest, a sabbath to the LORD. Do not sow your fields or prune your vineyards." Whatever grew on its own was available to all — landowners, servants, hired workers, resident aliens, livestock, and wild animals alike. This provision expressed the conviction that the land belongs to God (Leviticus 25:23: "The land must not be sold permanently, because the land is mine") and that He can be trusted to provide.\n\nThe Sabbatical Year also included the release of debts (Deuteronomy 15:1-3) and the public reading of the Torah (Deuteronomy 31:10-13), making it a year of economic justice, social renewal, and spiritual recommitment. Israel\'s failure to observe the Sabbatical Years was cited as a reason for the Babylonian exile. 2 Chronicles 36:21 states that the land "enjoyed its sabbath rests" during the seventy years of exile, "all the time of its desolation it rested, until the seventy years were completed in fulfillment of the word of the LORD spoken by Jeremiah."' },
      { heading: 'The Year of Jubilee (Yovel)', text: 'After seven cycles of seven years (49 years), the fiftieth year was proclaimed as the Year of Jubilee (Yovel). On the Day of Atonement in the fiftieth year, the shofar was sounded throughout the land (Leviticus 25:9-10): "Consecrate the fiftieth year and proclaim liberty throughout the land to all its inhabitants. It shall be a jubilee for you; each of you is to return to your family property and to your own clan." Three things happened in the Jubilee: all land reverted to its original family allocation, all Israelite slaves were freed, and the land observed a sabbath rest.\n\nThe Jubilee ensured that wealth inequality could never become permanent. It prevented the accumulation of land in the hands of a few and the creation of a permanent underclass. It was a radical economic reset, a structural guarantee of justice rooted in theology: because God owns the land, no human ownership is absolute. Whether Israel ever fully observed the Jubilee is debated, but its theological principles profoundly shaped biblical ethics and the prophetic critique of economic injustice (Isaiah 5:8: "Woe to you who add house to house and join field to field till no space is left").' },
      { heading: 'Jesus and the Jubilee', text: 'Jesus\' public ministry opens with a programmatic declaration drawn from Jubilee imagery. In Luke 4:16-21, Jesus reads from Isaiah 61:1-2 in the Nazareth synagogue: "The Spirit of the Lord is on me, because he has anointed me to proclaim good news to the poor. He has sent me to proclaim freedom for the prisoners and recovery of sight for the blind, to set the oppressed free, to proclaim the year of the Lord\'s favor." Then he declares: "Today this scripture is fulfilled in your hearing."\n\nIsaiah 61 is widely recognized as drawing on Jubilee language — liberty, release, the year of the LORD\'s favor. Jesus\' announcement constitutes a claim to inaugurate the eschatological Jubilee, the ultimate release and restoration that the historical Jubilee foreshadowed. Notably, Jesus stops reading in the middle of Isaiah 61:2, omitting "and the day of vengeance of our God." This deliberate omission suggests that the Jubilee of grace has arrived, while the day of judgment awaits His return. The entire structure of Jesus\' ministry — healing, forgiving debts, freeing the oppressed, restoring the marginalized — embodies Jubilee principles.' },
      { heading: 'The Prophetic Pattern: From Spring to Fall', text: 'Viewing the seven feasts as a unified prophetic calendar reveals a remarkable pattern. The Spring Feasts form a connected sequence fulfilled at Christ\'s first coming: Passover (14 Nisan) = the crucifixion; Unleavened Bread (15 Nisan) = the burial of the sinless Christ; Firstfruits ("the day after the Sabbath") = the resurrection; Pentecost (50 days later) = the outpouring of the Holy Spirit. Each was fulfilled on the precise calendar day of the feast.\n\nThe Fall Feasts await fulfillment at Christ\'s second coming: Trumpets (1 Tishri) = the resurrection/rapture at "the last trumpet"; Day of Atonement (10 Tishri) = the judgment and national repentance of Israel (Zechariah 12:10); Tabernacles (15-22 Tishri) = the establishment of God\'s kingdom and His dwelling with humanity forever (Revelation 21:3). The gap between the Spring and Fall Feasts corresponds to the present church age. The weekly Sabbath overarches all, pointing to the ultimate rest of the new creation. The Sabbatical Year and Jubilee cycle reminds us that God\'s redemptive plan operates on His appointed schedule — and that His timing is always perfect.' }
    ],
    keyTerms: [
      { term: 'Shemitah', definition: 'The Sabbatical Year — every seventh year when the land rests and debts are released (Lev 25:1-7)' },
      { term: 'Yovel (Jubilee)', definition: 'The fiftieth year — land returns to original owners, slaves are freed, liberty is proclaimed (Lev 25:8-12)' },
      { term: 'Year of the Lord\'s Favor', definition: 'Isaiah 61\'s Jubilee language that Jesus applied to His ministry in Luke 4:18-21' },
      { term: 'Prophetic Calendar', definition: 'The view of the seven feasts as a unified timeline of God\'s redemptive plan from first to second coming' }
    ],
    quiz: [
      { question: 'How often did the Sabbatical Year (Shemitah) occur?', options: ['Every third year', 'Every seventh year', 'Every tenth year', 'Every fiftieth year'], correct: 1, explanation: 'The Sabbatical Year occurred every seventh year, when the land was to lie fallow (Leviticus 25:1-7).' },
      { question: 'What three things happened during the Year of Jubilee?', options: ['Fasting, prayer, and sacrifice', 'Land reverted to original owners, slaves were freed, and the land rested', 'Temple cleansing, coronation, and pilgrimage', 'Census, taxation, and military service'], correct: 1, explanation: 'In the Jubilee, all land reverted to its original family allocation, all Israelite slaves were freed, and the land observed a sabbath rest (Leviticus 25:10-12).' },
      { question: 'What Scripture did Jesus read in the Nazareth synagogue (Luke 4:16-21)?', options: ['Psalm 22', 'Isaiah 61:1-2', 'Daniel 7:13-14', 'Micah 5:2'], correct: 1, explanation: 'Jesus read from Isaiah 61:1-2, which draws on Jubilee language of liberty, release, and the year of the LORD\'s favor.' },
      { question: 'Why was 2 Chronicles 36:21 significant regarding the Sabbatical Year?', options: ['It established the calendar', 'It shows the land "enjoyed its sabbath rests" during the 70-year exile', 'It prescribed new feast days', 'It abolished the Sabbatical Year'], correct: 1, explanation: '2 Chronicles 36:21 states that the exile fulfilled the land\'s missed Sabbath rests, indicating divine enforcement of the Sabbatical Year principle.' },
      { question: 'In the prophetic feast pattern, which feast corresponds to the resurrection of Christ?', options: ['Passover', 'Unleavened Bread', 'Firstfruits', 'Pentecost'], correct: 2, explanation: 'In the prophetic pattern, Firstfruits corresponds to the resurrection of Christ — He rose on the day of Firstfruits as "the firstfruits of those who have fallen asleep" (1 Corinthians 15:20).' }
    ]
  }
];

const FINAL_EXAM = [
  { question: 'What does the Hebrew word "mo\'adim" mean?', options: ['Holy days', 'Appointed times/fixed meetings', 'Sacrificial offerings', 'Sacred places'], correct: 1, explanation: 'Mo\'adim means "appointed times" or "fixed meetings," referring to God\'s scheduled encounters with His people (Leviticus 23:2).' },
  { question: 'What is the first thing declared "holy" in Scripture?', options: ['The tabernacle', 'Mount Sinai', 'The seventh day (Sabbath)', 'The Ark of the Covenant'], correct: 2, explanation: 'The seventh day is the first thing God declared holy (Genesis 2:3), establishing the priority of sacred time over sacred space.' },
  { question: 'How many categories of prohibited work on the Sabbath are identified in the Mishnah?', options: ['7', '12', '39', '70'], correct: 2, explanation: 'The Mishnah tractate Shabbat identifies 39 categories of prohibited work (avot melakhah) on the Sabbath.' },
  { question: 'On what day was the Passover lamb slaughtered?', options: ['10th of Nisan', '14th of Nisan', '15th of Nisan', '21st of Nisan'], correct: 1, explanation: 'The Passover lamb was slaughtered on the 14th of Nisan "at twilight" (Exodus 12:6).' },
  { question: 'How many cups of wine are part of the Passover Seder?', options: ['One', 'Two', 'Three', 'Four'], correct: 3, explanation: 'Four cups of wine are drunk during the Seder, each associated with one of God\'s four promises in Exodus 6:6-7.' },
  { question: 'What does leaven symbolize in Paul\'s use (1 Corinthians 5:6-8)?', options: ['The Holy Spirit', 'God\'s blessing', 'Malice and wickedness', 'Faith and hope'], correct: 2, explanation: 'Paul identifies leaven with "malice and wickedness," contrasting it with "the unleavened bread of sincerity and truth."' },
  { question: 'What was waved before the LORD on the Feast of Firstfruits?', options: ['A palm branch', 'A sheaf (omer) of grain', 'Two loaves of bread', 'A lamb'], correct: 1, explanation: 'A sheaf (omer) of the first grain was waved before the LORD on Firstfruits (Leviticus 23:10-11).' },
  { question: 'Who does Paul call "the firstfruits of those who have fallen asleep"?', options: ['Abraham', 'Moses', 'Christ', 'Adam'], correct: 2, explanation: 'Paul identifies Christ as "the firstfruits of those who have fallen asleep" (1 Corinthians 15:20).' },
  { question: 'How many days after Firstfruits does Pentecost occur?', options: ['7 days', '40 days', '50 days', '70 days'], correct: 2, explanation: 'Pentecost (Shavuot) falls on the 50th day after Firstfruits, hence its Greek name pentekostos ("fiftieth").' },
  { question: 'What was unique about the bread offering at Shavuot?', options: ['It was unleavened', 'Two loaves were baked WITH leaven', 'It was made of barley only', 'It was not bread at all'], correct: 1, explanation: 'The two loaves offered at Shavuot were uniquely baked with leaven (Leviticus 23:17).' },
  { question: 'What instrument is traditionally sounded on the Feast of Trumpets?', options: ['Silver trumpet', 'Harp', 'Shofar (ram\'s horn)', 'Cymbal'], correct: 2, explanation: 'The shofar (ram\'s horn) is traditionally sounded on Yom Teruah (the Feast of Trumpets).' },
  { question: 'Who was the only person permitted to enter the Holy of Holies on Yom Kippur?', options: ['The king', 'Any Levite', 'The High Priest', 'The prophet'], correct: 2, explanation: 'Only the High Priest (kohen gadol) could enter the Holy of Holies, and only on the Day of Atonement.' },
  { question: 'What happened to the scapegoat on Yom Kippur?', options: ['It was sacrificed', 'It was sent into the wilderness bearing the people\'s sins', 'It was set free in the temple', 'It was given to the High Priest'], correct: 1, explanation: 'The scapegoat was sent into the wilderness carrying "all the wickedness and rebellion of the Israelites" (Leviticus 16:21-22).' },
  { question: 'According to Hebrews, how many times did Christ enter the Most Holy Place?', options: ['Annually', 'Three times', 'Once for all (ephapax)', 'Seven times'], correct: 2, explanation: 'Christ entered "once for all" (ephapax) by His own blood, obtaining eternal redemption (Hebrews 9:12).' },
  { question: 'What did Jesus declare during the water-drawing ceremony at Sukkot?', options: ['"I am the bread of life"', '"Let anyone who is thirsty come to me and drink"', '"I am the good shepherd"', '"I am the way, the truth, and the life"'], correct: 1, explanation: 'Jesus declared, "Let anyone who is thirsty come to me and drink. Rivers of living water will flow from within them" (John 7:37-38).' },
  { question: 'According to Zechariah 14, who will celebrate Sukkot in the messianic age?', options: ['Only Israel', 'Only the priests', 'All nations', 'Only those in Jerusalem'], correct: 2, explanation: 'Zechariah 14:16 prophesies that all surviving nations will celebrate the Feast of Tabernacles in the messianic age.' },
  { question: 'How often does the Year of Jubilee occur?', options: ['Every 7th year', 'Every 25th year', 'Every 50th year', 'Every 70th year'], correct: 2, explanation: 'The Year of Jubilee occurs every 50th year, after seven cycles of seven years (Leviticus 25:8-10).' },
  { question: 'What Scripture did Jesus read in the Nazareth synagogue to announce His Jubilee ministry?', options: ['Psalm 22', 'Isaiah 61:1-2', 'Daniel 9:24-27', 'Leviticus 25:10'], correct: 1, explanation: 'Jesus read Isaiah 61:1-2, which uses Jubilee language of liberty, release, and "the year of the Lord\'s favor" (Luke 4:18-19).' },
  { question: 'In the prophetic feast calendar, which Spring Feast corresponds to Christ\'s burial?', options: ['Passover', 'Unleavened Bread', 'Firstfruits', 'Pentecost'], correct: 1, explanation: 'Unleavened Bread (15 Nisan) corresponds to the burial of the sinless Christ, with leaven (sin) being "put away."' },
  { question: 'True or False: Both the Spring and Fall Feasts have already been fulfilled in Christ.', options: ['True', 'False'], correct: 1, explanation: 'False. The Spring Feasts were fulfilled at Christ\'s first coming. The Fall Feasts are understood to await fulfillment at His second coming.' }
];

const FEAST_DAYS_STORAGE_KEY = 'feastDaysProgress';

const normalizeUnitId = (value) => {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  if (/^\d+$/.test(raw)) return raw.padStart(2, '0');
  return raw;
};

const normalizeCourseProgress = (progress) => {
  const completedLessons = Array.isArray(progress?.completedLessons)
    ? Array.from(new Set(progress.completedLessons.map(normalizeUnitId).filter(Boolean)))
    : [];
  const completedQuizzes = Array.isArray(progress?.completedQuizzes)
    ? Array.from(new Set(progress.completedQuizzes.map(normalizeUnitId).filter(Boolean)))
    : [];
  const examCompleted = Boolean(progress?.examCompleted);

  return { completedLessons, completedQuizzes, examCompleted };
};

const getInitialFeastDaysProgress = (userData) => {
  if (userData?.feastDaysProgress) {
    return normalizeCourseProgress(userData.feastDaysProgress);
  }

  try {
    const raw = localStorage.getItem(FEAST_DAYS_STORAGE_KEY);
    if (raw) return normalizeCourseProgress(JSON.parse(raw));
  } catch (error) {
    console.error('Error loading local Feast Days progress:', error);
  }

  return normalizeCourseProgress({});
};

const BiblicalFeastDaysCourse = ({ onComplete, onCancel, userId, userData, setUserData }) => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [examAnswers, setExamAnswers] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState(0);
  const [examPassed, setExamPassed] = useState(false);
  const [examQuestions, setExamQuestions] = useState(() => buildFinalExamFromUnitsAndFinal(UNITS, FINAL_EXAM));
  const initialProgress = getInitialFeastDaysProgress(userData);
  const [completedLessons, setCompletedLessons] = useState(initialProgress.completedLessons);
  const [completedQuizzes, setCompletedQuizzes] = useState(initialProgress.completedQuizzes);
  const [examCompleted, setExamCompleted] = useState(initialProgress.examCompleted);
  const persistProgress = useCallback((nextProgress) => {
    const progressPayload = normalizeCourseProgress(nextProgress);
    localStorage.setItem(FEAST_DAYS_STORAGE_KEY, JSON.stringify(progressPayload));
    if (setUserData) setUserData(prev => ({ ...prev, feastDaysProgress: progressPayload }));
    if (userId) {
      updateUserProgress(userId, { feastDaysProgress: progressPayload }).catch(err =>
        console.error('Error saving Feast Days progress:', err)
      );
    }
    return progressPayload;
  }, [setUserData, userId]);

  useEffect(() => {
    if (!userData?.feastDaysProgress) return;
    const p = normalizeCourseProgress(userData.feastDaysProgress);
    setCompletedLessons(p.completedLessons);
    setCompletedQuizzes(p.completedQuizzes);
    setExamCompleted(p.examCompleted);
  }, [userData?.feastDaysProgress]);

  useEffect(() => {
    persistProgress({ completedLessons, completedQuizzes, examCompleted });
  }, [completedLessons, completedQuizzes, examCompleted, persistProgress]);

  const totalSteps = UNITS.length * 2 + 1;
  const completedSteps = completedLessons.length + completedQuizzes.length + (examCompleted ? 1 : 0);
  const progress = Math.round((completedSteps / totalSteps) * 100);
  const examPassScore = Math.ceil((FINAL_EXAM_PASS_PERCENT / 100) * examQuestions.length);

  const submitQuiz = () => {
    const unit = UNITS[selectedUnit];
    const unitId = normalizeUnitId(unit?.id);
    if (!unit || !unitId) return;
    let correct = 0;
    unit.quiz.forEach((q, i) => { if (quizAnswers[i] === q.correct) correct++; });
    setQuizScore(correct);
    setQuizSubmitted(true);
    if (correct >= 4 && !completedQuizzes.includes(unitId)) {
      const nextQuizzes = [...completedQuizzes, unitId];
      setCompletedQuizzes(nextQuizzes);

      // Persist immediately so parent updates cannot lose this pass result.
      persistProgress({
        completedLessons,
        completedQuizzes: nextQuizzes,
        examCompleted
      });

      if (onComplete) onComplete({ type: 'quiz', unitId });
    }
  };

  const submitExam = () => {
    let correct = 0;
    examQuestions.forEach((q, i) => { if (examAnswers[i] === q.correct) correct++; });
    setExamScore(correct);
    setExamSubmitted(true);
    const passed = correct >= examPassScore;
    setExamPassed(passed);
    if (passed && !examCompleted) {
      setExamCompleted(true);
      persistProgress({
        completedLessons,
        completedQuizzes,
        examCompleted: true
      });
      if (onComplete) onComplete({ type: 'course', courseId: 'biblicalFeastDays' });
    }
  };

  const startQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setCurrentView('quiz');
  };

  const markCurrentLessonRead = () => {
    if (selectedUnit === null) return;
    const unit = UNITS[selectedUnit];
    const unitId = normalizeUnitId(unit?.id);
    if (!unitId || completedLessons.includes(unitId)) return;
    const nextLessons = [...completedLessons, unitId];
    setCompletedLessons(nextLessons);
    persistProgress({
      completedLessons: nextLessons,
      completedQuizzes,
      examCompleted
    });
  };
  const startExam = () => {
    setExamQuestions(buildFinalExamFromUnitsAndFinal(UNITS, FINAL_EXAM));
    setExamAnswers({});
    setExamSubmitted(false);
    setExamScore(0);
    setExamPassed(false);
    setCurrentView('exam');
  };

  // QUIZ VIEW
  if (currentView === 'quiz' && selectedUnit !== null) {
    const unit = UNITS[selectedUnit];
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentView('lesson')} className="flex items-center gap-2 text-purple-400 hover:text-purple-300"><ArrowLeft size={20} /> Back to Lesson</button>
            <h2 className="text-xl font-bold text-white">Unit {unit.id} Quiz</h2>
          </div>
          <div className="space-y-6">
            {unit.quiz.map((q, qi) => (
              <div key={qi} className={`bg-slate-800/50 rounded-xl p-5 border ${quizSubmitted ? (quizAnswers[qi] === q.correct ? 'border-emerald-500/50' : 'border-red-500/50') : 'border-slate-700'}`}>
                <p className="text-white font-semibold mb-3">{qi + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <button key={oi} disabled={quizSubmitted}
                      onClick={() => setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${quizSubmitted ? (oi === q.correct ? 'bg-emerald-900/40 border-emerald-500 text-emerald-300' : quizAnswers[qi] === oi ? 'bg-red-900/40 border-red-500 text-red-300' : 'bg-slate-700/30 border-slate-600 text-slate-400') : quizAnswers[qi] === oi ? 'bg-purple-900/40 border-purple-400 text-white' : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-purple-400'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
                {quizSubmitted && <p className="text-sm text-slate-400 mt-2 italic">{q.explanation}</p>}
              </div>
            ))}
          </div>
          {!quizSubmitted ? (
            <button onClick={submitQuiz} disabled={Object.keys(quizAnswers).length < unit.quiz.length}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-all">
              Submit Quiz
            </button>
          ) : (
            <div className={`mt-6 p-6 rounded-xl border-2 text-center ${quizScore >= 4 ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-red-900/30 border-red-500/50'}`}>
              <div className="text-4xl mb-2">{quizScore >= 4 ? '🎉' : '📚'}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{quizScore}/{unit.quiz.length} Correct</h3>
              <p className="text-slate-300 mb-4">{quizScore >= 4 ? 'You passed! Great understanding of the material.' : 'You need 4/5 to pass. Review the lesson and try again.'}</p>
              <div className="flex gap-3 justify-center">
                {quizScore < 4 && <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg"><RotateCcw size={18} /> Retry</button>}
                <button onClick={() => setCurrentView('list')} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg">Back to Course</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // EXAM VIEW
  if (currentView === 'exam') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentView('list')} className="flex items-center gap-2 text-purple-400 hover:text-purple-300"><ArrowLeft size={20} /> Back to Course</button>
            <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2"><Trophy size={24} /> Final Exam</h2>
          </div>
          {!examSubmitted && <div className="bg-amber-900/30 border border-amber-500/40 rounded-xl p-4 mb-6 text-amber-300 text-sm">{examQuestions.length} questions ({Math.round((1 - FINAL_EXAM_NOVEL_RATIO) * 100)}% quiz review, {Math.round(FINAL_EXAM_NOVEL_RATIO * 100)}% new lesson-based). You need {FINAL_EXAM_PASS_PERCENT}% ({examPassScore}/{examQuestions.length}) to pass and earn your certificate.</div>}
          <div className="space-y-6">
            {examQuestions.map((q, qi) => (
              <div key={qi} className={`bg-slate-800/50 rounded-xl p-5 border ${examSubmitted ? (examAnswers[qi] === q.correct ? 'border-emerald-500/50' : 'border-red-500/50') : 'border-slate-700'}`}>
                <p className="text-white font-semibold mb-3">{qi + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <button key={oi} disabled={examSubmitted}
                      onClick={() => setExamAnswers(prev => ({ ...prev, [qi]: oi }))}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${examSubmitted ? (oi === q.correct ? 'bg-emerald-900/40 border-emerald-500 text-emerald-300' : examAnswers[qi] === oi ? 'bg-red-900/40 border-red-500 text-red-300' : 'bg-slate-700/30 border-slate-600 text-slate-400') : examAnswers[qi] === oi ? 'bg-amber-900/40 border-amber-400 text-white' : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-amber-400'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
                {examSubmitted && <p className="text-sm text-slate-400 mt-2 italic">{q.explanation}</p>}
              </div>
            ))}
          </div>
          {!examSubmitted ? (
            <button onClick={submitExam} disabled={Object.keys(examAnswers).length < examQuestions.length}
              className="w-full mt-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-all">
              Submit Final Exam
            </button>
          ) : (
            <div className={`mt-6 p-6 rounded-xl border-2 text-center ${examPassed ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-red-900/30 border-red-500/50'}`}>
              <div className="text-5xl mb-3">{examPassed ? '🏆' : '📚'}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{examScore}/{examQuestions.length} Correct ({Math.round((examScore / examQuestions.length) * 100)}%)</h3>
              <p className="text-slate-300 mb-4">{examPassed ? 'Congratulations! You have completed the Biblical Feast Days course!' : `You need ${FINAL_EXAM_PASS_PERCENT}% (${examPassScore}/${examQuestions.length}) to pass. Review the units and try again.`}</p>
              <div className="flex gap-3 justify-center">
                {!examPassed && <button onClick={() => { setExamAnswers({}); setExamSubmitted(false); }} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg"><RotateCcw size={18} /> Retry</button>}
                <button onClick={() => setCurrentView('list')} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg">Back to Course</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // LESSON VIEW
  if (currentView === 'lesson' && selectedUnit !== null) {
    const unit = UNITS[selectedUnit];
    const lessonDone = completedLessons.includes(unit.id);
    const quizDone = completedQuizzes.includes(unit.id);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentView('list')} className="flex items-center gap-2 text-purple-400 hover:text-purple-300"><ArrowLeft size={20} /> Back to Course</button>
            <div className="flex items-center gap-2">
              {lessonDone && <span className="text-emerald-400 text-sm flex items-center gap-1"><CheckCircle size={16} /> Read</span>}
              {quizDone && <span className="text-amber-400 text-sm flex items-center gap-1"><Award size={16} /> Quiz Passed</span>}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-xl p-6 border-2 border-purple-500/50 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{unit.icon}</span>
              <div>
                <p className="text-purple-300 text-sm font-mono">Unit {unit.id}</p>
                <h1 className="text-2xl font-bold text-white">{unit.title}</h1>
                <p className="text-purple-300 text-sm">{unit.duration}</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {unit.content.map((section, si) => (
              <div key={si} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-bold text-amber-400 mb-3">{section.heading}</h2>
                {section.text.split('\n\n').map((para, pi) => <p key={pi} className="text-slate-300 leading-relaxed mb-3">{para}</p>)}
              </div>
            ))}
            {unit.keyTerms && (
              <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-6 border border-indigo-500/30">
                <h3 className="text-lg font-bold text-indigo-300 mb-3 flex items-center gap-2"><Book size={20} /> Key Terms</h3>
                <div className="space-y-2">
                  {unit.keyTerms.map((kt, ki) => (
                    <div key={ki}><span className="text-amber-300 font-semibold">{kt.term}:</span> <span className="text-slate-300">{kt.definition}</span></div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-6">
            {!lessonDone && (
              <button
                onClick={markCurrentLessonRead}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} /> Mark as Read
              </button>
            )}
            <button onClick={startQuiz} className={`flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 ${quizDone ? 'opacity-70' : ''}`}>
              <Scroll size={18} /> {quizDone ? 'Retake Quiz' : 'Take Quiz'}
            </button>
          </div>
          <div className="flex justify-between mt-4">
            <button onClick={() => { setSelectedUnit(Math.max(0, selectedUnit - 1)); window.scrollTo(0, 0); }} disabled={selectedUnit === 0}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold py-2 px-4 rounded-lg"><ArrowLeft size={18} /> Previous</button>
            <button onClick={() => { setSelectedUnit(Math.min(UNITS.length - 1, selectedUnit + 1)); window.scrollTo(0, 0); }} disabled={selectedUnit === UNITS.length - 1}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold py-2 px-4 rounded-lg">Next <ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    );
  }

  // LIST VIEW
  const allQuizzesDone = UNITS.every(u => completedQuizzes.includes(u.id));
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar size={32} className="text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Biblical Feast Days</h1>
              <p className="text-slate-400">Associate-Level Course | 10 Units + Final Exam</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/30 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold">Course Progress</span>
            <span className="text-purple-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-slate-400 text-sm mt-2">{completedLessons.length} lessons read | {completedQuizzes.length} quizzes passed | {examCompleted ? 'Exam passed' : 'Exam pending'}</div>
        </div>
        <div className="space-y-3 mb-6">
          {UNITS.map((unit, idx) => {
            const lessonDone = completedLessons.includes(unit.id);
            const quizDone = completedQuizzes.includes(unit.id);
            return (
              <button key={unit.id} onClick={() => { setSelectedUnit(idx); setCurrentView('lesson'); window.scrollTo(0, 0); }}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${lessonDone && quizDone ? 'bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border-emerald-500/50 hover:border-emerald-400' : 'bg-slate-800/50 border-purple-500/30 hover:border-purple-400 hover:bg-slate-800/70'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{unit.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm font-mono">Unit {unit.id}</span>
                        {lessonDone && <CheckCircle size={14} className="text-emerald-400" />}
                        {quizDone && <Award size={14} className="text-amber-400" />}
                      </div>
                      <h3 className="text-lg font-bold text-white">{unit.title}</h3>
                      <p className="text-purple-300 text-sm">{unit.duration}</p>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-purple-400" />
                </div>
              </button>
            );
          })}
        </div>
        <div className={`rounded-xl p-6 border-2 text-center ${allQuizzesDone ? 'bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-amber-500/50' : 'bg-slate-800/30 border-slate-700'}`}>
          <Trophy size={32} className={allQuizzesDone ? 'text-amber-400 mx-auto mb-3' : 'text-slate-600 mx-auto mb-3'} />
          <h3 className="text-xl font-bold text-white mb-2">Final Exam</h3>
          <p className="text-slate-400 text-sm mb-4">{allQuizzesDone ? 'All quizzes passed! You are ready for the final exam.' : `Pass all ${UNITS.length} unit quizzes to unlock the final exam. (${completedQuizzes.length}/${UNITS.length} complete)`}</p>
          {examCompleted && <p className="text-emerald-400 font-bold mb-3 flex items-center justify-center gap-2"><CheckCircle size={18} /> Exam Passed!</p>}
          <button onClick={startExam} disabled={!allQuizzesDone}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 text-white font-bold py-3 px-8 rounded-lg transition-all">
            {examCompleted ? `Retake ${FINAL_EXAM_TOTAL_QUESTIONS}-Question Exam` : `Start ${FINAL_EXAM_TOTAL_QUESTIONS}-Question Final`}
          </button>
        </div>
        <div className="mt-6 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/30">
          <h2 className="text-xl font-bold text-purple-300 mb-3 flex items-center gap-2"><Scroll size={24} /> About This Course</h2>
          <p className="text-slate-300 mb-3"><strong className="text-purple-300">Associate-Level Course</strong> — A comprehensive study of the biblical feast days commanded in Leviticus 23, covering the weekly Sabbath, the three Spring Feasts (Passover, Unleavened Bread, Firstfruits), Pentecost, and the three Fall Feasts (Trumpets, Day of Atonement, Tabernacles), plus the Sabbatical Year and Jubilee. Examines agricultural, historical, and prophetic dimensions with attention to Second Temple observance and New Testament fulfillment in Christ.</p>
          <p className="text-slate-300"><strong className="text-purple-300">Credit Equivalent:</strong> 6 credits | <strong className="text-purple-300">Prerequisites:</strong> Basic biblical knowledge recommended</p>
        </div>
      </div>
    </div>
  );
};

export default BiblicalFeastDaysCourse;
