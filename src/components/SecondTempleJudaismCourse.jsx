import React, { useState, useEffect } from 'react';
import {
  BookOpen, ChevronRight, CheckCircle, ArrowLeft, Book, Scroll, Trophy, Award, RotateCcw, X
} from 'lucide-react';
import { updateUserProgress } from '../services/dbService';

const UNITS = [
  {
    id: '01', title: 'Historical Framework (539 BC - AD 70)', icon: '\u{1F3DB}', duration: '25 min',
    content: [
      { heading: 'The Persian Period (539-332 BC)', text: 'The Second Temple period begins with the decree of Cyrus the Great in 539 BC (Ezra 1:1-4), permitting the Jewish exiles in Babylon to return to Judah and rebuild the Jerusalem temple. This decree marked the end of the Babylonian Exile and inaugurated a new phase in Israelite religion. Under Zerubbabel and the high priest Joshua (Jeshua), the returned exiles laid the foundation of the Second Temple around 516 BC, though it was modest compared to Solomon\'s original structure (Haggai 2:3).\n\nDuring the Persian period, Judah (Yehud) functioned as a small province within the vast Achaemenid Empire. The community struggled with economic hardship, intermarriage controversies, and the challenge of reconstituting its identity without a monarchy. The reforms of Ezra and Nehemiah (mid-fifth century BC) were pivotal: Ezra promoted strict Torah observance and the public reading of Scripture (Nehemiah 8), while Nehemiah rebuilt Jerusalem\'s walls and instituted social reforms. These efforts established the Torah as the central authority for Jewish communal life, a development with lasting consequences.' },
      { heading: 'The Hellenistic Period (332-167 BC)', text: 'Alexander the Great\'s conquest of the Persian Empire in 332 BC brought Judea under Greek influence. After Alexander\'s death in 323 BC, his empire fragmented. Judea initially fell under the Ptolemaic dynasty of Egypt (301-198 BC), then passed to the Seleucid dynasty of Syria after the Battle of Panium in 198 BC. Hellenization, the spread of Greek language, culture, and philosophy, profoundly affected Jewish society.\n\nThe crisis reached its peak under Antiochus IV Epiphanes (175-164 BC), who attempted to suppress Jewish religious practices. He desecrated the Jerusalem temple by erecting an altar to Zeus Olympios on the altar of burnt offering in 167 BC, an event described in Daniel 11:31 as the "abomination of desolation." He also prohibited circumcision, Sabbath observance, and Torah study under penalty of death (1 Maccabees 1:41-64). This provoked the Maccabean revolt.' },
      { heading: 'Hasmonean Dynasty (167-63 BC)', text: 'The Maccabean revolt, led by the priest Mattathias and his sons (especially Judas Maccabeus), successfully recaptured and rededicated the temple in 164 BC, an event commemorated by Hanukkah. The Hasmonean dynasty that followed combined the offices of high priest and king, a controversial arrangement since the Hasmoneans were not of the Davidic royal line.\n\nThe Hasmonean period saw territorial expansion, forced conversions (such as the Idumeans), and increasing internal conflict between rival factions. Civil war between Hyrcanus II and Aristobulus II eventually invited Roman intervention.' },
      { heading: 'The Roman Period (63 BC - AD 70)', text: 'The Roman general Pompey captured Jerusalem in 63 BC, ending Hasmonean independence. Rome installed client kings, most notably Herod the Great (37-4 BC), who undertook a massive expansion of the Second Temple. After Herod\'s death, his kingdom was divided among his sons, and Judea eventually came under direct Roman rule through prefects and procurators (such as Pontius Pilate).\n\nRoman taxation, cultural insensitivity, and political oppression fueled growing Jewish resentment. The Great Jewish Revolt began in AD 66, culminating in the Roman siege and destruction of Jerusalem and the Second Temple in AD 70 under Titus. This catastrophic event fundamentally transformed Judaism, ending the sacrificial system and temple-centered worship.' }
    ],
    keyTerms: [
      { term: 'Yehud', definition: 'The Persian province of Judah, centered on Jerusalem' },
      { term: 'Hellenization', definition: 'The spread of Greek language, culture, philosophy, and customs throughout the conquered territories' },
      { term: 'Hasmoneans', definition: 'The dynasty of Jewish priest-kings descended from the Maccabees who ruled Judea from 167-63 BC' },
      { term: 'Abomination of Desolation', definition: 'The desecration of the temple by Antiochus IV in 167 BC, referenced in Daniel and by Jesus (Matt 24:15)' }
    ],
    quiz: [
      { question: 'Who issued the decree allowing Jews to return from Babylonian exile and rebuild the temple?', options: ['Nebuchadnezzar', 'Cyrus the Great', 'Alexander the Great', 'Pompey'], correct: 1, explanation: 'Cyrus the Great of Persia issued the decree in 539 BC (Ezra 1:1-4), permitting the exiled Jews to return to Judah.' },
      { question: 'What event does Hanukkah commemorate?', options: ['The Exodus from Egypt', 'The giving of the Torah at Sinai', 'The rededication of the temple after the Maccabean revolt', 'The return from Babylonian exile'], correct: 2, explanation: 'Hanukkah celebrates the rededication of the Jerusalem temple in 164 BC after Judas Maccabeus recaptured it from the Seleucids.' },
      { question: 'Which ruler desecrated the temple by setting up an altar to Zeus?', options: ['Herod the Great', 'Pontius Pilate', 'Antiochus IV Epiphanes', 'Alexander the Great'], correct: 2, explanation: 'Antiochus IV Epiphanes erected an altar to Zeus Olympios in the temple in 167 BC, provoking the Maccabean revolt.' },
      { question: 'Which Roman general captured Jerusalem in 63 BC, ending Hasmonean independence?', options: ['Julius Caesar', 'Pompey', 'Augustus', 'Titus'], correct: 1, explanation: 'Pompey captured Jerusalem in 63 BC and entered the Holy of Holies, bringing Judea under Roman control.' },
      { question: 'In what year was the Second Temple destroyed by Rome?', options: ['586 BC', '167 BC', 'AD 33', 'AD 70'], correct: 3, explanation: 'The Roman general Titus destroyed the Second Temple in AD 70, ending the Jewish revolt that began in AD 66.' }
    ]
  },
  {
    id: '02', title: 'The Second Temple', icon: '\u26EA', duration: '25 min',
    content: [
      { heading: 'From Zerubbabel to Herod', text: 'The Second Temple was originally built under Zerubbabel around 516 BC. This modest structure served as the center of Jewish worship for nearly five centuries. Those who had seen Solomon\'s temple wept at its diminished glory (Ezra 3:12; Haggai 2:3). The temple was renovated under the Hellenistic period, but its most dramatic transformation came under Herod the Great, who began a massive rebuilding project around 20 BC.\n\nHerod\'s temple was one of the largest religious complexes in the ancient world. He doubled the size of the Temple Mount platform by constructing enormous retaining walls (including today\'s Western Wall), creating a grand esplanade that could hold thousands of pilgrims. The project employed 10,000 workers and 1,000 specially trained priests for the sacred areas. Though the main structure was completed in about 18 months, finishing work continued until AD 63, just seven years before its destruction.' },
      { heading: 'Temple Courts and Access', text: 'The temple complex was organized into progressively restricted courts reflecting degrees of holiness. The outermost Court of the Gentiles was open to all peoples and served as a marketplace (the area Jesus "cleansed" in Mark 11:15-17). Beyond a low barrier wall (the soreg) with warning inscriptions threatening death to any Gentile who entered, lay the Court of Women, the farthest point women could approach. The Court of Israel was reserved for ritually pure Jewish men, and the Court of the Priests surrounded the altar of burnt offering.\n\nAt the center stood the temple building itself (the hekal), divided into the Holy Place (containing the menorah, showbread table, and incense altar) and the Holy of Holies (debir), which was empty in the Second Temple (the Ark of the Covenant had been lost). Only the High Priest entered the Holy of Holies, and only on the Day of Atonement (Yom Kippur).' },
      { heading: 'Daily Sacrifices and Temple Economy', text: 'The daily temple service (tamid) included morning and evening burnt offerings of a yearling lamb, grain offerings, drink offerings, and the burning of incense. The priestly courses (mishmarot) rotated on a weekly basis, with 24 divisions serving two weeks per year plus the three pilgrimage festivals. Zechariah, father of John the Baptist, was serving in his priestly course when the angel appeared (Luke 1:8-9).\n\nThe temple economy was substantial. The annual half-shekel temple tax (Exodus 30:13) funded operations. Pilgrims purchased sacrificial animals from temple vendors, and currency had to be exchanged for the Tyrian shekel (the only coinage accepted, despite its pagan imagery, because of its high silver content). Jesus\' confrontation with the money changers challenged this commercial system (Matt 21:12-13).' },
      { heading: 'The Priesthood', text: 'The priesthood was hereditary, restricted to descendants of Aaron through the tribe of Levi. At the apex stood the High Priest (kohen gadol), who served as both the supreme religious authority and, during certain periods, a political leader. During the Hasmonean period, the Hasmonean kings controversially claimed both the royal and high priestly offices. Under Roman rule, the high priesthood became a political appointment.\n\nBeneath the High Priest were the chief priests (archiereis), who managed temple administration, treasury, and security. The captain of the temple (sagan) was second in authority. Ordinary priests numbered in the thousands and served in rotating courses. The Levites served as temple musicians, gatekeepers, and assistants.' }
    ],
    keyTerms: [
      { term: 'Tamid', definition: 'The daily sacrificial service in the temple, consisting of morning and evening offerings' },
      { term: 'Soreg', definition: 'The low barrier wall around the inner temple courts with warnings prohibiting Gentile entry' },
      { term: 'Kohen Gadol', definition: 'The High Priest, the supreme religious authority who alone entered the Holy of Holies on Yom Kippur' },
      { term: 'Mishmarot', definition: 'The 24 priestly courses that rotated weekly service in the temple' }
    ],
    quiz: [
      { question: 'Who undertook the massive expansion of the Second Temple?', options: ['Zerubbabel', 'Ezra', 'Herod the Great', 'Alexander the Great'], correct: 2, explanation: 'Herod the Great began his massive temple rebuilding project around 20 BC, making it one of the largest religious complexes in the ancient world.' },
      { question: 'What was in the Holy of Holies of the Second Temple?', options: ['The Ark of the Covenant', 'The menorah', 'A statue of Zeus', 'Nothing - it was empty'], correct: 3, explanation: 'The Holy of Holies was empty in the Second Temple period because the Ark of the Covenant had been lost, likely during the Babylonian destruction in 586 BC.' },
      { question: 'What was the soreg?', options: ['The altar of burnt offering', 'A barrier wall with warnings prohibiting Gentile entry', 'The veil separating Holy Place from Holy of Holies', 'The gate to the Court of Women'], correct: 1, explanation: 'The soreg was the low barrier wall with inscriptions warning Gentiles that entry beyond it was punishable by death.' },
      { question: 'How many priestly courses rotated service in the temple?', options: ['12', '24', '7', '70'], correct: 1, explanation: 'There were 24 priestly courses (mishmarot) that rotated weekly service, with each serving approximately two weeks per year plus festivals.' },
      { question: 'True or False: The temple tax could be paid in any currency.', options: ['True', 'False'], correct: 1, explanation: 'False. The temple tax had to be paid in Tyrian shekels because of their high silver purity, requiring currency exchange from other coins.' }
    ]
  },
  {
    id: '03', title: 'Torah & Interpretation', icon: '\u{1F4DC}', duration: '25 min',
    content: [
      { heading: 'The Centrality of Torah', text: 'During the Second Temple period, the Torah (the five books of Moses) became the supreme authority governing all aspects of Jewish life. The public reading of Torah by Ezra (Nehemiah 8) is often cited as a foundational moment. The Torah was understood not merely as a historical or literary document, but as God\'s revealed will, a comprehensive guide for worship, ethics, community governance, and personal conduct.\n\nBy the Hellenistic period, the concept of a broader "Scripture" was emerging, eventually encompassing the Prophets (Nevi\'im) and Writings (Ketuvim), though the precise boundaries of the canon remained fluid until well into the rabbinic period. The Torah, however, held undisputed primacy. The Sadducees accepted only the Torah as authoritative, while the Pharisees embraced a wider body of Scripture along with oral traditions.' },
      { heading: 'The Oral Torah', text: 'One of the most significant theological developments of this period was the Pharisaic concept of the "Oral Torah" (Torah she-be\'al peh). According to this tradition, God gave Moses both a Written Torah and an Oral Torah at Sinai. The Oral Torah contained interpretive principles, legal rulings, and applications that were transmitted from generation to generation through a chain of authorized teachers.\n\nThis concept provided a mechanism for adapting Torah to new circumstances without altering the written text. It also provided the basis for rabbinic authority: the rabbis were the custodians and interpreters of this living tradition. Jesus engaged with this system, sometimes affirming oral traditions and sometimes criticizing them as "traditions of men" that nullified God\'s commands (Mark 7:8-13).' },
      { heading: 'Hermeneutical Methods', text: 'Jewish interpreters developed sophisticated methods for deriving meaning from Scripture. Rabbi Hillel (active around 30 BC - AD 10) is traditionally credited with formulating seven hermeneutical rules (middot), which were later expanded to thirteen by Rabbi Ishmael and thirty-two by Rabbi Eliezer ben Jose ha-Gelili.\n\nThese rules included: qal va-chomer (arguing from lesser to greater, similar to Jesus\'s argument in Matt 12:11-12); gezerah shavah (analogy based on identical words in different passages); binyan av (building a general rule from one or two verses); and others. These methods were not arbitrary but followed agreed-upon logical principles for extracting legal and theological meaning from the sacred text. Paul uses several of these techniques in his letters (e.g., Galatians 3:16, arguing from the singular "seed").' },
      { heading: 'Targumim and Translation', text: 'As Aramaic replaced Hebrew as the daily language of most Jews, the need for translation arose. The Targumim were Aramaic translations/paraphrases of the Hebrew Scriptures, read alongside the Hebrew text in synagogue worship. They ranged from fairly literal (Targum Onkelos on the Torah) to highly expansive and interpretive (Targum Jonathan on the Prophets, Targum Pseudo-Jonathan on the Torah).\n\nThe Septuagint (LXX), the Greek translation of the Hebrew Scriptures produced in Alexandria beginning in the third century BC, was enormously influential. It became the Bible of the early church and is the version quoted most frequently in the New Testament. The LXX sometimes reflects different Hebrew source texts or interpretive traditions that differ from the Masoretic Text.' }
    ],
    keyTerms: [
      { term: 'Torah she-be\'al peh', definition: 'The "Oral Torah" - the body of interpretive traditions believed to have been given to Moses at Sinai alongside the Written Torah' },
      { term: 'Middot', definition: 'Hermeneutical rules for interpreting Scripture, attributed to rabbis Hillel, Ishmael, and others' },
      { term: 'Targum', definition: 'An Aramaic translation/paraphrase of the Hebrew Scriptures used in synagogue worship' },
      { term: 'Septuagint (LXX)', definition: 'The Greek translation of the Hebrew Bible, produced in Alexandria beginning in the 3rd century BC' }
    ],
    quiz: [
      { question: 'What is the "Oral Torah" (Torah she-be\'al peh)?', options: ['A separate book found at Qumran', 'Interpretive traditions believed given to Moses alongside the Written Torah', 'The Aramaic translation of the Bible', 'The Greek Septuagint'], correct: 1, explanation: 'The Oral Torah refers to the body of interpretive traditions that Pharisees believed were given to Moses at Sinai alongside the Written Torah and transmitted through authorized teachers.' },
      { question: 'Which rabbi is traditionally credited with formulating seven hermeneutical rules?', options: ['Shammai', 'Gamaliel', 'Hillel', 'Akiva'], correct: 2, explanation: 'Rabbi Hillel (active around 30 BC - AD 10) is traditionally credited with formulating the seven middot (hermeneutical rules) for interpreting Scripture.' },
      { question: 'What is the Septuagint?', options: ['An Aramaic Bible translation', 'A collection of Dead Sea Scrolls', 'The Greek translation of the Hebrew Bible', 'A commentary on the Torah'], correct: 2, explanation: 'The Septuagint (LXX) is the Greek translation of the Hebrew Scriptures, produced in Alexandria beginning in the 3rd century BC. It was the Bible of the early church.' },
      { question: 'What is "qal va-chomer"?', options: ['A type of sacrifice', 'Arguing from lesser to greater', 'A priestly blessing', 'A synagogue prayer'], correct: 1, explanation: 'Qal va-chomer is a hermeneutical rule meaning "light and heavy" (lesser to greater), used to derive conclusions by arguing that what applies in a lesser case certainly applies in a greater one.' },
      { question: 'Which group accepted ONLY the Torah as authoritative Scripture?', options: ['Pharisees', 'Essenes', 'Sadducees', 'Zealots'], correct: 2, explanation: 'The Sadducees accepted only the five books of Moses (Torah) as binding Scripture, rejecting the Pharisaic oral traditions and the broader prophetic writings as authoritative.' }
    ]
  },
  {
    id: '04', title: 'Jewish Sects & Groups', icon: '\u{1F465}', duration: '30 min',
    content: [
      { heading: 'The Pharisees', text: 'The Pharisees (perushim, "separated ones") emerged as a distinct group during the Hasmonean period, likely growing out of the Hasidim who supported the Maccabean revolt. They were the most influential sect among the common people. The Jewish historian Josephus estimates their number at about 6,000 in Herod\'s time.\n\nPharisaic theology was characterized by belief in the Oral Torah, the resurrection of the dead, the existence of angels and spirits, divine providence balanced with human free will, and the authority of the broader scriptural canon. They promoted synagogue-based piety, Torah study, prayer, and personal holiness as accessible to all Jews, not just priests. Jesus had the most interaction with the Pharisees, agreeing with many of their theological positions (resurrection, angels) while criticizing their casuistry and hypocrisy (Matt 23). Paul identified himself as a Pharisee (Phil 3:5; Acts 23:6).' },
      { heading: 'The Sadducees', text: 'The Sadducees (tsedukim, possibly derived from Zadok, Solomon\'s high priest) were the aristocratic, priestly party closely associated with the temple establishment. They wielded significant political power, controlling the high priesthood and dominating the Sanhedrin during much of the Second Temple period.\n\nTheologically, the Sadducees were conservative: they accepted only the written Torah as authoritative, denied the resurrection of the dead, rejected belief in angels and spirits, and emphasized human free will over divine providence (Acts 23:8). Their power base was the temple, and when it was destroyed in AD 70, the Sadducean party effectively ceased to exist. Jesus confronted their denial of resurrection in Mark 12:18-27.' },
      { heading: 'The Essenes and Qumran', text: 'The Essenes are widely (though not universally) identified with the community that produced the Dead Sea Scrolls at Qumran. They withdrew from Jerusalem\'s temple worship, which they considered corrupt under illegitimate high priests. The community practiced strict ritual purity, communal property, celibacy (at least for some members), and followed a solar calendar rather than the lunar calendar used in the temple.\n\nThe Dead Sea Scrolls, discovered beginning in 1947, include biblical manuscripts, sectarian documents (such as the Community Rule, War Scroll, and Temple Scroll), and biblical commentaries (pesharim). These texts reveal a community intensely focused on eschatological expectation, viewing themselves as the true remnant of Israel living in the "last days." Their biblical manuscripts have proven invaluable for textual criticism, confirming the general reliability of the Masoretic Text while also revealing textual diversity.' },
      { heading: 'Other Groups', text: 'The Zealots emerged as a distinct political-religious movement advocating armed resistance against Rome, intensifying in the decades before the Jewish revolt of AD 66-70. They held that paying tribute to Caesar was tantamount to idolatry and that God alone was Israel\'s ruler. Simon the Zealot was among Jesus\' twelve disciples (Luke 6:15).\n\nThe Samaritans, though not a "sect" of Judaism per se, were a significant related group. Descended from the northern Israelite tribes mixed with foreign settlers (2 Kings 17), they maintained their own temple on Mount Gerizim (destroyed by the Hasmonean John Hyrcanus in 128 BC), accepted only the Pentateuch, and awaited a messianic figure called the Taheb ("Restorer"). The deep hostility between Jews and Samaritans forms the backdrop for Jesus\' parable of the Good Samaritan (Luke 10:25-37) and his encounter with the Samaritan woman (John 4).\n\nThe am ha-aretz ("people of the land") were the common people who did not strictly observe Pharisaic purity regulations. They were sometimes looked down upon by the religious elite. Jesus\' ministry was largely among these common people, and the Pharisees criticized him for eating with "sinners and tax collectors" (Mark 2:16).' }
    ],
    keyTerms: [
      { term: 'Pharisees', definition: 'Jewish sect emphasizing Oral Torah, resurrection, synagogue piety, and Torah observance accessible to all' },
      { term: 'Sadducees', definition: 'Aristocratic priestly party accepting only written Torah, denying resurrection and angels' },
      { term: 'Essenes', definition: 'Ascetic community likely associated with the Dead Sea Scrolls, practicing strict purity and communal living' },
      { term: 'Pesharim', definition: 'Dead Sea Scrolls commentaries interpreting biblical texts as referring to the community\'s own situation' },
      { term: 'Am ha-aretz', definition: '"People of the land" - common Jews who did not strictly follow Pharisaic purity regulations' }
    ],
    quiz: [
      { question: 'Which group denied the resurrection of the dead?', options: ['Pharisees', 'Sadducees', 'Essenes', 'Zealots'], correct: 1, explanation: 'The Sadducees denied the resurrection, belief in angels and spirits, and accepted only the written Torah as authoritative (Acts 23:8).' },
      { question: 'What community is most closely associated with the Dead Sea Scrolls?', options: ['Pharisees', 'Sadducees', 'Essenes', 'Zealots'], correct: 2, explanation: 'The Essenes are widely identified with the Qumran community that produced and preserved the Dead Sea Scrolls.' },
      { question: 'What was the Samaritan messianic figure called?', options: ['Messiah', 'Son of David', 'Taheb (Restorer)', 'Son of Man'], correct: 2, explanation: 'The Samaritans awaited the Taheb ("Restorer"), a messianic figure based on the prophet-like-Moses promise in Deuteronomy 18:15-18.' },
      { question: 'Paul identified himself as belonging to which group?', options: ['Sadducees', 'Essenes', 'Pharisees', 'Zealots'], correct: 2, explanation: 'Paul identified himself as "a Pharisee, the son of a Pharisee" (Acts 23:6; Philippians 3:5).' },
      { question: 'True or False: The Zealots believed paying tribute to Caesar was acceptable.', options: ['True', 'False'], correct: 1, explanation: 'False. The Zealots held that paying tribute to Caesar was tantamount to idolatry and that God alone was Israel\'s ruler.' }
    ]
  },
  {
    id: '05', title: 'Synagogue & Daily Life', icon: '\u{1F54D}', duration: '25 min',
    content: [
      { heading: 'Origins of the Synagogue', text: 'The synagogue (from Greek synagoge, "assembly"; Hebrew bet knesset, "house of assembly") likely originated during the Babylonian exile when Jews, deprived of the temple, gathered for prayer and Scripture reading. By the first century AD, synagogues were found throughout the Jewish Diaspora and in virtually every town in Judea and Galilee.\n\nUnlike the temple, which was the exclusive domain of the priesthood, the synagogue was a lay institution. Any qualified male could read Scripture, lead prayers, or offer commentary. This democratization of religious life was a profound development. Jesus regularly taught in synagogues (Luke 4:16-21), and Paul\'s missionary strategy involved first visiting the local synagogue in each city (Acts 17:1-2).' },
      { heading: 'Synagogue Worship', text: 'First-century synagogue worship typically included: the recitation of the Shema (Deut 6:4-9; 11:13-21; Num 15:37-41), the "Hear, O Israel" confession of God\'s unity; the Amidah (or Shemoneh Esreh, "Eighteen Benedictions"), a series of standing prayers; a Torah reading following a lectionary cycle; a reading from the Prophets (haftarah); and a sermon or homily expounding the readings.\n\nThe synagogue also served as a community center, school, court, and hostel for traveling Jews. It was governed by a council of elders led by a "ruler of the synagogue" (archisynagogos, as in Mark 5:22). An attendant (hazzan) cared for the Scripture scrolls and maintained the building. Archaeological remains of first-century synagogues have been found at Gamla, Masada, Herodium, and Magdala.' },
      { heading: 'Education and Torah Study', text: 'Jewish education in the Second Temple period followed a structured system. The bet sefer ("house of the book") provided elementary education from approximately ages 5-12, focusing on reading the Torah. The bet midrash ("house of study") offered advanced study for promising students from age 12 onward, studying the Oral Torah and interpretive traditions under a recognized rabbi.\n\nThe most gifted students might be invited to "follow" a rabbi, becoming his talmidim (disciples). This involved not merely learning information but imitating the rabbi\'s entire way of life, his interpretation of Torah, his rulings, and his character. Jesus\' call to his disciples ("Follow me") echoes this rabbinic model, though with the notable difference that Jesus called his disciples rather than waiting to be chosen (Mark 1:17).' },
      { heading: 'Sabbath, Purity, and Daily Observance', text: 'Sabbath observance was a defining marker of Jewish identity. From Friday evening to Saturday evening, Jews abstained from 39 categories of prohibited work (later codified in the Mishnah, Shabbat 7:2). Sabbath was a day of rest, synagogue worship, festive meals, and Torah study. The Pharisees developed detailed regulations to "fence" the Sabbath commandment, which sometimes brought them into conflict with Jesus (Mark 2:23-28; 3:1-6).\n\nRitual purity laws governed many aspects of daily life: immersion in mikva\'ot (ritual baths) was required after various forms of impurity, dietary laws (kashrut) determined what could be eaten and how food was prepared, and family purity laws regulated marital relations. These practices reinforced Jewish distinctiveness in a pagan world and expressed the holiness called for in Leviticus 19:2: "Be holy, for I the LORD your God am holy."' }
    ],
    keyTerms: [
      { term: 'Shema', definition: 'The central confession of Judaism: "Hear, O Israel, the LORD our God, the LORD is one" (Deut 6:4)' },
      { term: 'Amidah', definition: 'The "Standing Prayer" of Eighteen Benedictions, a central element of Jewish liturgy' },
      { term: 'Bet Midrash', definition: '"House of study" - advanced school for Torah and oral tradition study under a rabbi' },
      { term: 'Mikveh', definition: 'A ritual immersion bath used for purification' }
    ],
    quiz: [
      { question: 'Where did the synagogue likely originate?', options: ['At Mount Sinai', 'During the Babylonian exile', 'In Herod\'s temple', 'In the Roman period'], correct: 1, explanation: 'The synagogue likely originated during the Babylonian exile when Jews, deprived of the temple, gathered for prayer and Scripture reading.' },
      { question: 'What is the Shema?', options: ['A type of sacrifice', 'The central confession: "Hear, O Israel, the LORD our God, the LORD is one"', 'A priestly blessing', 'A festival prayer'], correct: 1, explanation: 'The Shema (Deut 6:4-9) is Judaism\'s central confession of faith declaring God\'s unity, recited twice daily.' },
      { question: 'What was the bet midrash?', options: ['The temple treasury', 'An advanced school for Torah study under a rabbi', 'A ritual bath', 'A synagogue courtyard'], correct: 1, explanation: 'The bet midrash ("house of study") was the advanced-level school where promising students studied Oral Torah and interpretive traditions under a rabbi.' },
      { question: 'How many categories of prohibited work were defined for the Sabbath?', options: ['7', '10', '39', '70'], correct: 2, explanation: 'The Mishnah (Shabbat 7:2) codified 39 categories of work prohibited on the Sabbath, derived from the types of work involved in building the tabernacle.' },
      { question: 'What was a mikveh used for?', options: ['Storing Torah scrolls', 'Ritual purification through immersion', 'Grinding grain for offerings', 'Housing traveling rabbis'], correct: 1, explanation: 'A mikveh was a ritual immersion bath used for purification from various forms of ritual impurity.' }
    ]
  },
  {
    id: '06', title: 'Messianic Expectations', icon: '\u{1F451}', duration: '25 min',
    content: [
      { heading: 'Diverse Messianic Hopes', text: 'Contrary to the popular assumption of a single, uniform messianic expectation, Second Temple Judaism harbored a rich diversity of hopes for God\'s future intervention. The term "messiah" (mashiach, "anointed one") could refer to kings, priests, or prophets who were anointed for their office. By the first century, messianic expectation had intensified but remained varied in its specific contours.\n\nSome Jews expected no individual messiah at all, but rather God\'s direct intervention. Others expected one messianic figure, while the Qumran community anticipated two messiahs: a royal "Messiah of Israel" (from David\'s line) and a priestly "Messiah of Aaron." This diversity of expectation helps explain why Jesus\' messianic identity was debated, and why his suffering and death were so unexpected to his followers.' },
      { heading: 'The Royal Davidic Messiah', text: 'The most prominent messianic expectation was the hope for a descendant of David who would restore Israel\'s kingdom. This hope was rooted in God\'s covenant with David (2 Sam 7:12-16) and the prophetic promises of a future righteous king (Isa 9:6-7; 11:1-9; Jer 23:5-6; Ezek 37:24-25). The Psalms of Solomon (first century BC) provide a vivid picture of this expectation: a warrior-king who would drive out the Romans, purge Jerusalem, and establish a righteous kingdom.\n\nThis royal messiah would be empowered by the Spirit of God, judge with wisdom and righteousness, and reign over a restored and purified Israel. The nations would either submit to his rule or be conquered. It is this expectation that lies behind the question of the disciples in Acts 1:6: "Lord, are you at this time going to restore the kingdom to Israel?"' },
      { heading: 'The Son of Man and Heavenly Figures', text: 'Daniel 7:13-14 describes "one like a son of man" coming on the clouds of heaven, receiving dominion, glory, and an everlasting kingdom from the Ancient of Days. In the Similitudes of Enoch (1 Enoch 37-71, probably first century BC/AD), this figure is identified as a pre-existent, heavenly being who will judge the wicked and vindicate the righteous.\n\nJesus\' preferred self-designation was "Son of Man," a title that evoked Daniel\'s heavenly figure while also echoing Ezekiel\'s use of the term for a human being. This ambiguity may have been intentional, allowing Jesus to fill the title with new meaning that combined divine authority with human suffering (Mark 8:31; 14:62).' },
      { heading: 'The Suffering Servant', text: 'Isaiah\'s "Servant Songs" (Isa 42:1-9; 49:1-7; 50:4-9; 52:13-53:12) describe a figure who suffers vicariously for the sins of others. In pre-Christian Judaism, these passages were not consistently interpreted as referring to the messiah. Some saw the servant as Israel collectively, others as a prophetic figure, and some later rabbinic texts applied Isaiah 53 to the messiah (though this may reflect post-Christian polemic).\n\nThe earliest Christians, however, saw Jesus\' death and resurrection as the fulfillment of Isaiah 53. The Ethiopian eunuch\'s question in Acts 8:34, "Who is the prophet talking about?" reflects the interpretive ambiguity of the passage. Jesus himself appears to have combined the Suffering Servant with the Son of Man and Davidic messiah traditions to articulate a messianic vocation that included suffering and death before glorification (Mark 10:45; Luke 24:25-27).' }
    ],
    keyTerms: [
      { term: 'Mashiach', definition: '"Anointed one" (Messiah) - could refer to any anointed figure (king, priest, prophet) or the awaited eschatological deliverer' },
      { term: 'Son of Man', definition: 'A title from Daniel 7:13-14 describing a heavenly figure receiving eternal dominion; Jesus\' preferred self-designation' },
      { term: 'Psalms of Solomon', definition: 'First-century BC Jewish writings expressing hope for a Davidic warrior-king who would liberate Israel' },
      { term: 'Suffering Servant', definition: 'The figure in Isaiah 52:13-53:12 who suffers vicariously for the sins of others' }
    ],
    quiz: [
      { question: 'How many messiahs did the Qumran community expect?', options: ['One - a Davidic king', 'Two - a royal and a priestly messiah', 'Three - king, priest, and prophet', 'None - they expected God to act directly'], correct: 1, explanation: 'The Qumran community expected two messiahs: a royal "Messiah of Israel" from David\'s line and a priestly "Messiah of Aaron."' },
      { question: 'What was Jesus\' preferred self-designation?', options: ['Messiah', 'Son of David', 'Son of Man', 'Son of God'], correct: 2, explanation: 'Jesus most frequently referred to himself as the "Son of Man," a title evoking Daniel 7:13-14\'s heavenly figure while maintaining ambiguity.' },
      { question: 'What did the Psalms of Solomon envision the messiah doing?', options: ['Suffering and dying for sins', 'Driving out the Romans and establishing a righteous kingdom', 'Teaching Torah in the temple', 'Building a new temple'], correct: 1, explanation: 'The Psalms of Solomon (first century BC) envision a Davidic warrior-king who would drive out the Romans, purge Jerusalem, and establish a righteous kingdom.' },
      { question: 'Which Old Testament passage describes a figure who suffers vicariously for others\' sins?', options: ['Daniel 7:13-14', 'Isaiah 52:13-53:12', '2 Samuel 7:12-16', 'Psalm 110:1'], correct: 1, explanation: 'Isaiah 52:13-53:12 (the fourth Servant Song) describes a figure who suffers and dies vicariously for the sins of others.' },
      { question: 'True or False: In pre-Christian Judaism, Isaiah 53 was universally understood as referring to the messiah.', options: ['True', 'False'], correct: 1, explanation: 'False. In pre-Christian Judaism, Isaiah 53 was interpreted in various ways - as referring to Israel collectively, a prophetic figure, or (less commonly) the messiah.' }
    ]
  },
  {
    id: '07', title: 'Apocalyptic Literature & Worldview', icon: '\u{1F31F}', duration: '25 min',
    content: [
      { heading: 'What Is Apocalypticism?', text: 'Apocalypticism is a worldview and literary genre that flourished in Second Temple Judaism. The term derives from the Greek apokalypsis ("revelation" or "unveiling"). Apocalyptic literature claims to reveal hidden divine knowledge about the structure of the heavens, the course of history, and especially the end of the present age and the dawn of a new one.\n\nKey features include: a sharp dualism between the present evil age and the coming age of righteousness; cosmic conflict between God (with angelic forces) and Satan (with demonic forces); the belief that God has predetermined the course of history and will intervene decisively to judge the wicked and vindicate the righteous; the expectation of resurrection and final judgment; and communication through dreams, visions, and angelic interpreters. This worldview profoundly shaped the New Testament, particularly the teachings of Jesus and Paul.' },
      { heading: 'Key Apocalyptic Texts', text: 'The book of Daniel (especially chapters 7-12) is the primary biblical apocalypse, written during the crisis of Antiochus IV\'s persecution. Daniel\'s vision of four successive world empires followed by God\'s eternal kingdom (Dan 2, 7) established a framework for understanding history as moving toward a divinely appointed climax.\n\n1 Enoch is a composite work containing visions of heavenly journeys, angelology, the origin of evil through fallen angels (the "Watchers"), and vivid descriptions of final judgment. The Similitudes (1 Enoch 37-71) develop the "Son of Man" concept. 4 Ezra (2 Esdras) and 2 Baruch, written after AD 70, wrestle with the theological crisis of the temple\'s destruction. The Assumption of Moses, Jubilees, and the Testament of the Twelve Patriarchs also contain significant apocalyptic material.' },
      { heading: 'Two Ages and Resurrection', text: 'A fundamental apocalyptic concept is the division of time into "this age" (olam hazeh) and "the age to come" (olam haba). This age is characterized by sin, suffering, injustice, and the dominion of evil powers. The age to come will be inaugurated by God\'s dramatic intervention, bringing judgment on the wicked and salvation for the righteous.\n\nClosely tied to this framework is the expectation of bodily resurrection. Daniel 12:2 states: "Many of those who sleep in the dust of the earth shall awake, some to everlasting life and some to shame and everlasting contempt." This belief was embraced by the Pharisees and most Jews (with the notable exception of the Sadducees) and became foundational for Christian theology. Jesus and Paul both operate within this two-age framework (Mark 10:30; Gal 1:4; Eph 1:21), proclaiming that in Jesus the age to come has already begun to break into the present age.' },
      { heading: 'Angels, Demons, and Cosmic Warfare', text: 'Second Temple apocalyptic literature developed an elaborate angelology and demonology far beyond what is found in the Hebrew Bible. Angels were organized into hierarchies with named archangels (Michael, Gabriel, Raphael, Uriel). Satan evolved from the "accuser" of Job into the cosmic adversary of God and leader of fallen angels/demons.\n\nThis cosmic warfare framework deeply influenced the New Testament. Jesus\' exorcisms are understood as battles in this cosmic conflict (Matt 12:28: "If I cast out demons by the Spirit of God, then the kingdom of God has come upon you"). Paul speaks of spiritual warfare against "principalities and powers" (Eph 6:12). The book of Revelation is thoroughly apocalyptic, depicting the final defeat of Satan and the establishment of God\'s eternal kingdom.' }
    ],
    keyTerms: [
      { term: 'Apocalypsis', definition: '"Revelation/unveiling" - a genre claiming to reveal divine secrets about history\'s climax and the heavenly realm' },
      { term: 'Olam Hazeh / Olam Haba', definition: '"This age" and "the age to come" - the apocalyptic two-age framework dividing history' },
      { term: '1 Enoch', definition: 'A composite Jewish apocalyptic work including heavenly journeys, angelology, and the "Son of Man" figure' },
      { term: 'Watchers', definition: 'In 1 Enoch, fallen angels who descended to earth, taught forbidden knowledge, and fathered the Nephilim' }
    ],
    quiz: [
      { question: 'What does "apocalypsis" mean?', options: ['Destruction', 'Revelation/unveiling', 'Judgment', 'Prophecy'], correct: 1, explanation: 'Apocalypsis is Greek for "revelation" or "unveiling," referring to the disclosure of hidden divine knowledge about the end of history.' },
      { question: 'Which biblical book is the primary Old Testament apocalypse?', options: ['Isaiah', 'Ezekiel', 'Daniel', 'Zechariah'], correct: 2, explanation: 'Daniel (especially chapters 7-12) is the primary biblical apocalypse, establishing the framework of successive world empires followed by God\'s eternal kingdom.' },
      { question: 'What are the two ages in apocalyptic thought?', options: ['Old Testament and New Testament', 'This age (olam hazeh) and the age to come (olam haba)', 'Heaven and earth', 'Creation and redemption'], correct: 1, explanation: 'Apocalyptic thought divides time into "this age" (olam hazeh), characterized by evil, and "the age to come" (olam haba), when God will establish righteousness.' },
      { question: 'Which group denied the resurrection of the dead?', options: ['Pharisees', 'Essenes', 'Early Christians', 'Sadducees'], correct: 3, explanation: 'The Sadducees denied the resurrection, while Pharisees, Essenes, and early Christians all affirmed belief in bodily resurrection.' },
      { question: 'What are the "Watchers" in 1 Enoch?', options: ['Guardian angels', 'Human prophets', 'Fallen angels who descended to earth', 'The heavenly council'], correct: 2, explanation: 'In 1 Enoch, the Watchers are fallen angels who descended to earth, taught humans forbidden knowledge, and fathered the Nephilim.' }
    ]
  },
  {
    id: '08', title: 'Roman Occupation', icon: '\u2694\uFE0F', duration: '25 min',
    content: [
      { heading: 'Roman Administration of Judea', text: 'After Pompey\'s conquest in 63 BC, Rome administered Judea through various arrangements. Initially, Rome worked through local client rulers. Herod the Great (37-4 BC) was Rome\'s most significant client king, ruling with ruthless efficiency while undertaking massive building projects including the temple expansion, Caesarea Maritima, and fortress palaces like Masada and Herodium.\n\nAfter Herod\'s death, his kingdom was divided among three sons: Archelaus received Judea (removed by Rome in AD 6), Antipas received Galilee and Perea (the "Herod" of Jesus\' ministry), and Philip received territories to the northeast. When Archelaus was deposed, Judea came under direct Roman administration through prefects (later procurators), of whom Pontius Pilate (AD 26-36) is the most well-known due to his role in Jesus\' crucifixion.' },
      { heading: 'Taxation and Economic Pressures', text: 'Roman taxation was a source of deep resentment. Jews paid multiple taxes: the tributum soli (land tax), tributum capitis (poll/head tax), customs duties, and the ongoing Jewish temple tax. Tax collection was outsourced to local agents (publicani/tax collectors) who profited by collecting more than required, making them despised collaborators with the occupying power.\n\nJesus\' association with tax collectors (Matt 9:10-11) was socially scandalous. The question about paying taxes to Caesar (Mark 12:13-17) was a politically charged trap: affirming the tax would alienate nationalists, while denying it would invite charges of sedition. Jesus\' response ("Give to Caesar what is Caesar\'s, and to God what is God\'s") navigated this tension while implicitly asserting God\'s ultimate sovereignty.' },
      { heading: 'Cultural and Religious Tensions', text: 'Roman rule created constant friction with Jewish religious sensibilities. The display of military standards bearing images was viewed as idolatrous. Pilate provoked outrage by bringing standards with Caesar\'s image into Jerusalem and later by using temple funds to build an aqueduct. Caligula\'s attempt to place his own statue in the Jerusalem temple (AD 40) nearly provoked a revolt.\n\nDespite these tensions, Rome generally granted Judaism a privileged status as a religio licita (permitted religion). Jews were exempt from emperor worship, allowed to observe the Sabbath and dietary laws, and permitted to collect the temple tax throughout the empire. This status would later become a point of contention for Christians, who initially enjoyed protection under Judaism\'s umbrella but eventually lost it.' },
      { heading: 'The Jewish Revolt and Destruction of Jerusalem', text: 'Growing tensions erupted into open revolt in AD 66, sparked by the Roman procurator Florus\'s seizure of temple treasury funds. The revolt achieved initial military successes but was crushed by Roman legions under Vespasian and then his son Titus. After a brutal siege, Jerusalem fell in AD 70, and the temple was destroyed.\n\nThe destruction of the temple was catastrophic for Judaism. The sacrificial system, the priesthood, the Sanhedrin, and the Sadducean party all effectively ended. The Pharisaic movement, under the leadership of Rabban Yohanan ben Zakkai (who escaped Jerusalem during the siege), regrouped at Yavneh (Jamnia) and began the process of reconstituting Judaism around Torah study, prayer, and righteous living, laying the foundation for rabbinic Judaism. For Christians, the temple\'s destruction was interpreted as divine judgment and vindication of Jesus\' prophecy (Mark 13:2).' }
    ],
    keyTerms: [
      { term: 'Client King', definition: 'A local ruler who governed on behalf of Rome, maintaining order in exchange for Roman support (e.g., Herod the Great)' },
      { term: 'Publicani', definition: 'Tax collectors who purchased the right to collect taxes, profiting by extracting more than required' },
      { term: 'Religio Licita', definition: '"Permitted religion" - the privileged legal status Rome granted to Judaism' },
      { term: 'Yavneh (Jamnia)', definition: 'The coastal town where Pharisaic leaders regrouped after AD 70 to reconstitute Judaism' }
    ],
    quiz: [
      { question: 'Which Herod was the "Herod" during Jesus\' public ministry?', options: ['Herod the Great', 'Herod Archelaus', 'Herod Antipas', 'Herod Agrippa'], correct: 2, explanation: 'Herod Antipas ruled Galilee and Perea during Jesus\' ministry. He was the Herod who executed John the Baptist and whom Jesus called "that fox" (Luke 13:32).' },
      { question: 'What was the tributum capitis?', options: ['A land tax', 'A poll/head tax', 'A temple tax', 'A customs duty'], correct: 1, explanation: 'The tributum capitis was a poll or head tax levied on individuals under Roman rule, distinct from the land tax and customs duties.' },
      { question: 'Where did Pharisaic leaders regroup after the temple\'s destruction in AD 70?', options: ['Alexandria', 'Babylon', 'Yavneh (Jamnia)', 'Antioch'], correct: 2, explanation: 'Under Rabban Yohanan ben Zakkai, Pharisaic leaders regrouped at Yavneh (Jamnia) to reconstitute Judaism around Torah study and prayer.' },
      { question: 'What sparked the Jewish revolt in AD 66?', options: ['The crucifixion of Jesus', 'Caligula\'s statue in the temple', 'Florus\'s seizure of temple treasury funds', 'The assassination of a high priest'], correct: 2, explanation: 'The revolt was triggered by the Roman procurator Florus seizing funds from the temple treasury, though tensions had been building for decades.' },
      { question: 'True or False: Rome required Jews to worship the emperor.', options: ['True', 'False'], correct: 1, explanation: 'False. Judaism had the status of religio licita (permitted religion), and Jews were exempt from emperor worship, Sabbath-breaking, and other requirements that conflicted with their faith.' }
    ]
  },
  {
    id: '09', title: 'Jesus within Second Temple Judaism', icon: '\u271D\uFE0F', duration: '30 min',
    content: [
      { heading: 'Jesus as a Jewish Teacher', text: 'Jesus of Nazareth must be understood first and foremost as a Jew operating within the context of Second Temple Judaism. He was circumcised on the eighth day (Luke 2:21), presented at the temple (Luke 2:22-24), attended festivals as a pilgrim (John 2:13), worshipped in synagogues (Luke 4:16), observed the Sabbath (though with distinctive interpretations), and taught using characteristically Jewish methods: parables (mashalim), debates with other teachers, and exposition of Scripture.\n\nJesus\' teaching method paralleled rabbinic practice in many ways. He gathered disciples (talmidim), taught with authority ("You have heard it said... but I say to you"), and used hermeneutical techniques recognized in Jewish tradition (such as qal va-chomer arguments). However, he also departed from rabbinic conventions by calling his own disciples rather than being sought out, and by claiming an authority that transcended the Torah itself.' },
      { heading: 'Jesus and the Jewish Sects', text: 'Jesus\' relationship with the various Jewish groups was complex. He agreed with the Pharisees on key theological points: resurrection, angels, the authority of the broader Scriptures, and the importance of personal piety. Yet he criticized Pharisaic casuistry, their expansion of purity laws to the point of burdening the common people, and what he perceived as hypocrisy (Matt 23). Many scholars note that Jesus\' criticisms of the Pharisees are an "in-house" dispute rather than a rejection of Judaism itself.\n\nJesus appears to have had less engagement with the Sadducees, but he directly challenged their denial of resurrection (Mark 12:18-27). He shared the Essenes\' eschatological urgency but rejected their separatism, choosing instead to engage with sinners, tax collectors, and the marginalized. He may have had Zealot sympathizers among his followers (Simon the Zealot), but he rejected violent revolution as a path to God\'s kingdom.' },
      { heading: 'The Temple Cleansing', text: 'Jesus\' "cleansing" of the temple (Mark 11:15-17 and parallels) was a prophetic symbolic action with profound implications within the Second Temple context. By overturning the tables of money changers and those selling sacrificial animals, Jesus was not merely protesting commercial corruption but enacting a prophetic judgment on the temple system itself.\n\nQuoting Isaiah 56:7 ("My house shall be called a house of prayer for all nations") and Jeremiah 7:11 ("den of robbers"), Jesus critiqued the exclusion of Gentiles from meaningful access to God and evoked Jeremiah\'s earlier prophecy of the First Temple\'s destruction. This action was likely the proximate cause of the decision by the temple authorities to seek Jesus\' death (Mark 11:18), as it threatened both their theological legitimacy and their economic interests.' },
      { heading: 'Trial and Crucifixion in Context', text: 'Jesus\' arrest, trial before the Sanhedrin, and crucifixion under Roman authority must be understood within the political and religious dynamics of first-century Judea. The charge of blasphemy before the Sanhedrin (Mark 14:61-64) and the charge of claiming to be "King of the Jews" before Pilate (Mark 15:2) reflect both religious and political dimensions of Jesus\' messianic claims.\n\nCrucifixion was a Roman punishment reserved for slaves, rebels, and the lowest classes. Its public, humiliating nature served as a deterrent. For Jews, Deuteronomy 21:23 ("cursed is anyone who hangs on a tree") added theological scandal to the physical horror. The early Christian proclamation of a crucified messiah was, as Paul acknowledged, "a stumbling block to Jews and foolishness to Gentiles" (1 Cor 1:23). Understanding why required a radical re-reading of Scripture in light of the resurrection.' }
    ],
    keyTerms: [
      { term: 'Talmidim', definition: 'Disciples or students of a rabbi who learned by imitating their teacher\'s entire way of life' },
      { term: 'Mashal', definition: 'Parable or proverb - a primary Jewish teaching method used extensively by Jesus' },
      { term: 'Temple Cleansing', definition: 'Jesus\' prophetic action in the temple, overturning tables and challenging the commercial/sacrificial system' },
      { term: 'Sanhedrin', definition: 'The Jewish supreme court and council, composed of 71 members including the high priest' }
    ],
    quiz: [
      { question: 'On which theological points did Jesus agree with the Pharisees?', options: ['Only the written Torah is authoritative', 'Resurrection, angels, and broader Scripture', 'The temple should be destroyed', 'Armed revolt against Rome'], correct: 1, explanation: 'Jesus agreed with the Pharisees on resurrection, the existence of angels, and the authority of the broader Scriptures, while differing on interpretation and application.' },
      { question: 'What Old Testament passages did Jesus quote during the temple cleansing?', options: ['Genesis 1 and Psalm 23', 'Isaiah 56 and Jeremiah 7', 'Exodus 20 and Deuteronomy 6', 'Daniel 7 and Isaiah 53'], correct: 1, explanation: 'Jesus quoted Isaiah 56:7 ("house of prayer for all nations") and Jeremiah 7:11 ("den of robbers") during the temple cleansing.' },
      { question: 'Why was the proclamation of a crucified messiah scandalous to Jews?', options: ['Crucifixion was an honorable death', 'Deuteronomy 21:23 says "cursed is anyone who hangs on a tree"', 'The messiah was expected to be a priest', 'Jews did not believe in the messiah'], correct: 1, explanation: 'Deuteronomy 21:23 declared "cursed is anyone who hangs on a tree," making a crucified messiah theologically scandalous in Jewish understanding.' },
      { question: 'What was unique about how Jesus called his disciples?', options: ['He required a formal education', 'He only chose priests', 'He called them rather than waiting to be sought out', 'He only accepted Pharisees'], correct: 2, explanation: 'Unlike typical rabbis who were sought out by students, Jesus took the initiative in calling his disciples ("Follow me"), reversing the normal pattern.' },
      { question: 'What was the likely proximate cause of the decision to seek Jesus\' death?', options: ['His healing on the Sabbath', 'His temple cleansing', 'His association with tax collectors', 'His feeding of the 5,000'], correct: 1, explanation: 'The temple cleansing was likely the proximate cause, as it threatened both the theological legitimacy and economic interests of the temple authorities (Mark 11:18).' }
    ]
  },
  {
    id: '10', title: 'Early Christianity & Judaism', icon: '\u2709\uFE0F', duration: '25 min',
    content: [
      { heading: 'The Jerusalem Church', text: 'The earliest Christian community in Jerusalem was thoroughly Jewish. Led by James the brother of Jesus ("James the Just"), the Jerusalem church continued to worship in the temple (Acts 2:46; 3:1), observe the Torah, practice circumcision, and keep the Jewish festivals. They understood Jesus as the Jewish Messiah who had been raised from the dead and would soon return to establish God\'s kingdom.\n\nThe Jerusalem council (Acts 15) addressed the crucial question of whether Gentile converts needed to observe the full Torah, including circumcision. The decision to exempt Gentiles from most Torah requirements (while asking them to abstain from idolatry, sexual immorality, and certain foods) was a landmark moment in the separation of Christianity from Judaism. Yet James and the Jerusalem church continued their Torah-observant lifestyle (Acts 21:20).' },
      { heading: 'Paul\'s Mission and the Law', text: 'Paul, a Pharisee-turned-apostle, was the primary architect of the Gentile mission. His theology of justification by faith apart from "works of the law" (Rom 3:28; Gal 2:16) was not a rejection of Judaism per se, but an argument that the Torah\'s purpose had been fulfilled in Christ and that Gentiles could be included in God\'s people without becoming Jews.\n\nPaul\'s letters reveal ongoing tension with Jewish-Christian opponents who insisted on Torah observance for Gentile converts. His arguments in Galatians and Romans engage deeply with Second Temple Jewish theology: the covenant with Abraham, the purpose of the Sinai law, the inclusion of Gentiles in God\'s promises, and the relationship between Israel and the church. Paul never abandoned his Jewish identity (Rom 11:1) and continued to visit synagogues and observe Jewish customs (Acts 18:18; 21:26).' },
      { heading: 'The Parting of the Ways', text: 'The "parting of the ways" between Judaism and Christianity was a gradual process spanning several centuries, not a single definitive break. Key factors included: the destruction of the temple in AD 70, which eliminated the temple-centered common ground; the increasing Gentile majority in the church; the development of distinctly Christian theology (divinity of Christ, Trinity); and institutional separation.\n\nThe Birkat ha-Minim ("blessing against heretics"), a prayer added to the synagogue liturgy around AD 85-90, is sometimes cited as a formal exclusion of Christians from the synagogue, though its exact purpose and scope are debated. By the second century, figures like Justin Martyr (Dialogue with Trypho) and Ignatius of Antioch show a clear sense of Christianity and Judaism as distinct religions, though Jewish-Christian groups persisted for centuries.' },
      { heading: 'The Rise of Rabbinic Judaism', text: 'After AD 70, the Pharisaic movement, now led by the rabbis, reshaped Judaism for survival without the temple. At Yavneh, Rabban Yohanan ben Zakkai and his successors established that prayer, Torah study, and acts of lovingkindness (gemilut chasadim) could substitute for sacrifices. The development of the Mishnah (codified around AD 200 by Rabbi Judah ha-Nasi) and later the Talmud (Palestinian, c. AD 400; Babylonian, c. AD 500) created a comprehensive system of Jewish law and theology.\n\nRabbinic Judaism and Christianity thus emerged as "sibling religions" from the matrix of Second Temple Judaism. Both claimed to be the true heirs of biblical Israel, both reinterpreted the Scriptures in light of their foundational events, and both developed sophisticated theological systems. Understanding their common origin in Second Temple Judaism is essential for meaningful Jewish-Christian dialogue today.' }
    ],
    keyTerms: [
      { term: 'Jerusalem Council', definition: 'The meeting described in Acts 15 that decided Gentile converts did not need to observe the full Torah' },
      { term: 'Birkat ha-Minim', definition: '"Blessing against heretics" - a synagogue prayer that may have been directed against Jewish Christians' },
      { term: 'Mishnah', definition: 'The codification of Jewish oral law compiled by Rabbi Judah ha-Nasi around AD 200' },
      { term: 'Parting of the Ways', definition: 'The gradual process by which Christianity and Judaism became distinct religions over several centuries' }
    ],
    quiz: [
      { question: 'Who led the early Jerusalem church?', options: ['Peter', 'Paul', 'James the brother of Jesus', 'John'], correct: 2, explanation: 'James the brother of Jesus ("James the Just") led the Jerusalem church, which remained Torah-observant (Acts 15; 21:18-20).' },
      { question: 'What was decided at the Jerusalem Council (Acts 15)?', options: ['All Christians must be circumcised', 'The temple should be abandoned', 'Gentile converts do not need to observe the full Torah', 'Christianity should separate from Judaism'], correct: 2, explanation: 'The Jerusalem Council decided that Gentile converts were exempt from most Torah requirements, particularly circumcision, while observing minimal guidelines.' },
      { question: 'What is the Mishnah?', options: ['A Greek translation of the Bible', 'The codification of Jewish oral law (c. AD 200)', 'A Dead Sea Scroll', 'A collection of psalms'], correct: 1, explanation: 'The Mishnah is the codification of Jewish oral law compiled by Rabbi Judah ha-Nasi around AD 200, forming the foundation of the Talmud.' },
      { question: 'What catastrophic event accelerated the separation of Christianity and Judaism?', options: ['The death of Paul', 'The destruction of the temple in AD 70', 'The conversion of Constantine', 'The fall of Rome'], correct: 1, explanation: 'The destruction of the temple in AD 70 eliminated the temple-centered common ground between Jews and Jewish Christians, accelerating institutional separation.' },
      { question: 'What did Rabban Yohanan ben Zakkai teach could substitute for sacrifices?', options: ['Military conquest', 'Prayer, Torah study, and acts of lovingkindness', 'Pilgrimages to Rome', 'Animal sacrifices at local altars'], correct: 1, explanation: 'After the temple\'s destruction, Yohanan ben Zakkai established that prayer, Torah study, and acts of lovingkindness (gemilut chasadim) could replace the sacrificial system.' }
    ]
  },
  {
    id: '11', title: 'Theological Synthesis', icon: '\u{1F393}', duration: '25 min',
    content: [
      { heading: 'Continuity and Discontinuity', text: 'Understanding the Second Temple period reveals both profound continuity and significant discontinuity between the Old and New Testaments. The New Testament is not a Greek intrusion into a Hebrew world but the product of a thoroughly Jewish milieu shaped by centuries of theological development. Concepts central to the NT (resurrection, angels, demons, messiah, kingdom of God, final judgment) were all developed during the Second Temple period.\n\nAt the same time, Jesus and the early Christians introduced distinctive elements: the identification of the messiah with a crucified and risen individual, the inclusion of Gentiles without Torah observance, the reconception of the temple as the body of Christ and the community of believers, and the already/not yet tension of inaugurated eschatology. These innovations built upon Second Temple foundations while transforming them.' },
      { heading: 'Reading the New Testament in Context', text: 'Many NT passages gain depth when read against their Second Temple background. Jesus\' debates with the Pharisees over Sabbath, purity, and divorce are intra-Jewish halakhic disputes, not attacks on Judaism itself. Paul\'s arguments about law and grace engage directly with Pharisaic theology. The book of Hebrews\' comparison of Jesus with the Levitical priesthood presupposes detailed knowledge of temple worship. Revelation draws heavily on Jewish apocalyptic imagery and conventions.\n\nRecognizing this context corrects common misreadings: the Pharisees were not simply "legalists" but deeply devoted to making Torah accessible; "works of the law" in Paul does not mean "trying to earn salvation" but refers to specific Torah observances (circumcision, dietary laws, Sabbath) that marked Jewish identity; and the "Jews" in John\'s Gospel often refers specifically to the Judean authorities, not the Jewish people as a whole.' },
      { heading: 'The Legacy of Second Temple Judaism', text: 'Second Temple Judaism bequeathed to both Christianity and rabbinic Judaism: monotheism, Scripture, ethical monotheism, synagogue worship, the concept of canon, resurrection hope, and eschatological expectation. Both religions are "children" of Second Temple Judaism, interpreting the same Scriptures through different lenses, one centered on Jesus Christ and the other on the Torah as interpreted by the rabbis.\n\nFor modern students of the Bible, knowledge of the Second Temple period is indispensable. It bridges the gap between the Old and New Testaments, provides the historical and theological context for Jesus\' ministry, illuminates the social world of the early church, and enables more informed dialogue between Jews and Christians. The more thoroughly we understand the world that produced both the New Testament and rabbinic Judaism, the more faithfully we can interpret Scripture and engage with its ongoing relevance.' },
      { heading: 'Implications for Biblical Interpretation', text: 'Second Temple studies have practical implications for how we read, teach, and apply Scripture today. First, they remind us that the Bible was written in specific historical contexts that must be understood for faithful interpretation. Second, they challenge anachronistic readings that project later theological categories onto first-century texts. Third, they recover the essential Jewishness of Jesus and the early church, countering supersessionist tendencies that have caused great harm.\n\nFinally, studying the Second Temple period cultivates intellectual humility. The diversity of Judaism in this period, with its multiple sects, competing interpretations, and varied expectations, reminds us that Scripture is rich enough to sustain multiple readings and that theological certainty must be balanced with faithful inquiry. As Paul wrote, "For now we see in a mirror, dimly, but then face to face" (1 Cor 13:12).' }
    ],
    keyTerms: [
      { term: 'Inaugurated Eschatology', definition: 'The "already/not yet" framework: God\'s kingdom has been inaugurated in Jesus but awaits final consummation' },
      { term: 'Halakhah', definition: 'Jewish legal rulings governing daily conduct, derived from Torah interpretation' },
      { term: 'Supersessionism', definition: 'The theological view that the church has replaced Israel in God\'s plan (also called "replacement theology")' },
      { term: 'Intertestamental Period', definition: 'The time between the Old and New Testaments (roughly 400 BC - AD 30), largely coextensive with the Second Temple period' }
    ],
    quiz: [
      { question: 'Which concept central to the NT was developed during the Second Temple period?', options: ['The Trinity', 'Bodily resurrection', 'Papal authority', 'Purgatory'], correct: 1, explanation: 'The concept of bodily resurrection was developed during the Second Temple period (Daniel 12:2) and became central to Jewish and Christian theology.' },
      { question: 'What does "inaugurated eschatology" mean?', options: ['The world has already ended', 'God\'s kingdom has begun in Jesus but awaits final consummation', 'The temple will be rebuilt', 'The messiah has not yet come'], correct: 1, explanation: 'Inaugurated eschatology is the "already/not yet" framework: God\'s kingdom has been inaugurated in Jesus\' ministry, death, and resurrection, but awaits its final consummation at his return.' },
      { question: 'What does "works of the law" in Paul most likely refer to?', options: ['Trying to earn salvation through good deeds', 'Specific Torah observances marking Jewish identity', 'Roman legal requirements', 'Temple sacrifices'], correct: 1, explanation: 'Scholarship increasingly recognizes that "works of the law" refers to specific Torah observances (circumcision, dietary laws, Sabbath) that served as Jewish identity markers, not generic "trying to earn salvation."' },
      { question: 'What is supersessionism?', options: ['The belief that Judaism is superior to Christianity', 'The view that the church has replaced Israel in God\'s plan', 'The idea that the Old Testament is no longer relevant', 'The Essene doctrine of cosmic warfare'], correct: 1, explanation: 'Supersessionism (replacement theology) is the view that the church has replaced Israel in God\'s plan, a view challenged by Romans 9-11 and modern scholarship.' },
      { question: 'True or False: Both Christianity and rabbinic Judaism emerged from Second Temple Judaism.', options: ['True', 'False'], correct: 0, explanation: 'True. Both Christianity and rabbinic Judaism are "children" of Second Temple Judaism, each interpreting the shared Scriptures through their distinctive lens.' }
    ]
  }
];

const FINAL_EXAM = [
  { question: 'In what year did Cyrus the Great issue his decree allowing Jews to return from exile?', options: ['586 BC', '539 BC', '332 BC', '167 BC'], correct: 1, explanation: 'Cyrus issued his decree in 539 BC (Ezra 1:1-4), permitting Jews to return to Judah.' },
  { question: 'Who expanded the Second Temple into one of the largest religious complexes in the ancient world?', options: ['Zerubbabel', 'Ezra', 'Herod the Great', 'Pontius Pilate'], correct: 2, explanation: 'Herod the Great began his massive temple rebuilding project around 20 BC.' },
  { question: 'What was the Oral Torah?', options: ['The Septuagint', 'Interpretive traditions believed given at Sinai alongside the Written Torah', 'The Dead Sea Scrolls', 'The Targumim'], correct: 1, explanation: 'The Oral Torah was the body of interpretive traditions that Pharisees believed were given to Moses at Sinai alongside the Written Torah.' },
  { question: 'Which group denied resurrection, angels, and spirits?', options: ['Pharisees', 'Sadducees', 'Essenes', 'Zealots'], correct: 1, explanation: 'The Sadducees denied the resurrection, belief in angels and spirits (Acts 23:8).' },
  { question: 'What is the Shema?', options: ['A sacrificial offering', 'The central Jewish confession of God\'s unity (Deut 6:4)', 'A type of apocalyptic literature', 'A priestly garment'], correct: 1, explanation: 'The Shema (Deut 6:4) is Judaism\'s central confession: "Hear, O Israel, the LORD our God, the LORD is one."' },
  { question: 'How many messiahs did the Qumran community expect?', options: ['None', 'One', 'Two', 'Four'], correct: 2, explanation: 'The Qumran community expected two messiahs: a royal Messiah of Israel and a priestly Messiah of Aaron.' },
  { question: 'What does "apocalypsis" mean?', options: ['Destruction', 'Revelation/unveiling', 'Judgment', 'Kingdom'], correct: 1, explanation: 'Apocalypsis means "revelation" or "unveiling" in Greek.' },
  { question: 'Which Roman general destroyed the temple in AD 70?', options: ['Pompey', 'Pilate', 'Titus', 'Augustus'], correct: 2, explanation: 'Titus, son of Emperor Vespasian, destroyed the Jerusalem temple in AD 70.' },
  { question: 'True or False: Jesus\' debates with the Pharisees represent attacks on Judaism itself.', options: ['True', 'False'], correct: 1, explanation: 'False. They are intra-Jewish halakhic disputes within the framework of Second Temple Judaism.' },
  { question: 'What did the Jerusalem Council (Acts 15) decide about Gentile converts?', options: ['They must be circumcised', 'They are exempt from most Torah requirements', 'They cannot be Christians', 'They must become Essenes'], correct: 1, explanation: 'The Jerusalem Council decided Gentile converts did not need to observe the full Torah, particularly circumcision.' },
  { question: 'What event does Hanukkah commemorate?', options: ['The Exodus', 'The rededication of the temple after the Maccabean revolt', 'The destruction of Jerusalem', 'Pentecost'], correct: 1, explanation: 'Hanukkah celebrates the rededication of the temple in 164 BC after Judas Maccabeus recaptured it.' },
  { question: 'What was the soreg in the temple complex?', options: ['The altar', 'A barrier wall with warning inscriptions against Gentile entry', 'The veil before the Holy of Holies', 'The treasury'], correct: 1, explanation: 'The soreg was the low barrier wall with inscriptions warning Gentiles that entry was punishable by death.' },
  { question: 'Which hermeneutical rule argues from lesser to greater?', options: ['Gezerah shavah', 'Qal va-chomer', 'Binyan av', 'Kal v\'khomer'], correct: 1, explanation: 'Qal va-chomer ("light and heavy") argues from a lesser case to a greater one.' },
  { question: 'What is a mikveh?', options: ['A scroll storage jar', 'A ritual immersion bath', 'A synagogue hall', 'A temple court'], correct: 1, explanation: 'A mikveh is a ritual immersion bath used for purification.' },
  { question: 'Where did Pharisaic leaders regroup after AD 70?', options: ['Rome', 'Alexandria', 'Yavneh (Jamnia)', 'Babylon'], correct: 2, explanation: 'Under Rabban Yohanan ben Zakkai, leaders regrouped at Yavneh to reconstitute Judaism.' },
  { question: 'What is the Mishnah?', options: ['A Greek Bible translation', 'The codification of Jewish oral law (c. AD 200)', 'An apocalyptic text', 'A temple manual'], correct: 1, explanation: 'The Mishnah is the codification of Jewish oral law compiled by Rabbi Judah ha-Nasi around AD 200.' },
  { question: 'Which title from Daniel 7:13-14 did Jesus most frequently use for himself?', options: ['Messiah', 'Son of David', 'Son of Man', 'Lord'], correct: 2, explanation: 'Jesus most frequently referred to himself as the "Son of Man," evoking Daniel 7:13-14.' },
  { question: 'What was the likely proximate cause of the authorities\' decision to seek Jesus\' death?', options: ['Healing on the Sabbath', 'The temple cleansing', 'Raising Lazarus', 'The Sermon on the Mount'], correct: 1, explanation: 'The temple cleansing threatened both the theological legitimacy and economic interests of the temple authorities.' },
  { question: 'What does "inaugurated eschatology" mean?', options: ['History has ended', 'God\'s kingdom has begun but awaits consummation', 'The temple must be rebuilt', 'Salvation is complete'], correct: 1, explanation: 'Inaugurated eschatology is the "already/not yet" framework of the kingdom.' },
  { question: 'True or False: Both Christianity and rabbinic Judaism emerged from Second Temple Judaism.', options: ['True', 'False'], correct: 0, explanation: 'True. Both are "children" of Second Temple Judaism, interpreting shared Scriptures through distinctive lenses.' }
];

const SECOND_TEMPLE_PROGRESS_KEY = 'secondTempleJudaismProgress';

const normalizeCourseProgress = (progress) => {
  const completedLessons = Array.isArray(progress?.completedLessons)
    ? Array.from(new Set(progress.completedLessons))
    : [];
  const completedQuizzes = Array.isArray(progress?.completedQuizzes)
    ? Array.from(new Set(progress.completedQuizzes))
    : [];
  const examCompleted = Boolean(progress?.examCompleted);

  return { completedLessons, completedQuizzes, examCompleted };
};

const getInitialSecondTempleProgress = (userData) => {
  if (userData?.secondTempleJudaismProgress) {
    return normalizeCourseProgress(userData.secondTempleJudaismProgress);
  }

  try {
    const raw = localStorage.getItem(SECOND_TEMPLE_PROGRESS_KEY);
    if (raw) return normalizeCourseProgress(JSON.parse(raw));
  } catch (error) {
    console.error('Error loading local Second Temple progress:', error);
  }

  return normalizeCourseProgress({});
};

const SecondTempleJudaismCourse = ({ onComplete, onCancel, userId, userData, setUserData }) => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [examAnswers, setExamAnswers] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState(0);
  const [examPassed, setExamPassed] = useState(false);
  const initialProgress = getInitialSecondTempleProgress(userData);
  const [completedLessons, setCompletedLessons] = useState(initialProgress.completedLessons);
  const [completedQuizzes, setCompletedQuizzes] = useState(initialProgress.completedQuizzes);
  const [examCompleted, setExamCompleted] = useState(initialProgress.examCompleted);

  useEffect(() => {
    if (!userData?.secondTempleJudaismProgress) return;
    const p = normalizeCourseProgress(userData.secondTempleJudaismProgress);
    setCompletedLessons(p.completedLessons);
    setCompletedQuizzes(p.completedQuizzes);
    setExamCompleted(p.examCompleted);
  }, [userData?.secondTempleJudaismProgress]);

  useEffect(() => {
    const progressPayload = normalizeCourseProgress({ completedLessons, completedQuizzes, examCompleted });
    localStorage.setItem(SECOND_TEMPLE_PROGRESS_KEY, JSON.stringify(progressPayload));
    if (setUserData) setUserData(prev => ({ ...prev, secondTempleJudaismProgress: progressPayload }));
    if (userId) updateUserProgress(userId, { secondTempleJudaismProgress: progressPayload }).catch(err => console.error('Error saving STJ progress:', err));
  }, [completedLessons, completedQuizzes, examCompleted, userId, setUserData]);

  const totalSteps = UNITS.length * 2 + 1;
  const completedSteps = completedLessons.length + completedQuizzes.length + (examCompleted ? 1 : 0);
  const progress = Math.round((completedSteps / totalSteps) * 100);

  const markLessonComplete = (unitId) => { if (!completedLessons.includes(unitId)) setCompletedLessons(prev => [...prev, unitId]); };

  const submitQuiz = () => {
    const unit = UNITS[selectedUnit];
    let correct = 0;
    unit.quiz.forEach((q, i) => { if (quizAnswers[i] === q.correct) correct++; });
    setQuizScore(correct);
    setQuizSubmitted(true);
    if (!completedLessons.includes(unit.id)) {
      setCompletedLessons(prev => [...prev, unit.id]);
    }
    if (correct >= 4 && !completedQuizzes.includes(unit.id)) {
      setCompletedQuizzes(prev => [...prev, unit.id]);
      if (onComplete) onComplete({ type: 'quiz', unitId: unit.id });
    }
  };

  const submitExam = () => {
    let correct = 0;
    FINAL_EXAM.forEach((q, i) => { if (examAnswers[i] === q.correct) correct++; });
    setExamScore(correct);
    setExamSubmitted(true);
    const passed = correct >= 14;
    setExamPassed(passed);
    if (passed && !examCompleted) {
      setExamCompleted(true);
      if (onComplete) onComplete({ type: 'course', courseId: 'secondTempleJudaism' });
    }
  };

  const startQuiz = () => {
    if (selectedUnit !== null) {
      const unit = UNITS[selectedUnit];
      if (unit && !completedLessons.includes(unit.id)) {
        setCompletedLessons(prev => [...prev, unit.id]);
      }
    }
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setCurrentView('quiz');
  };
  const startExam = () => { setExamAnswers({}); setExamSubmitted(false); setExamScore(0); setExamPassed(false); setCurrentView('exam'); };

  // QUIZ VIEW
  if (currentView === 'quiz' && selectedUnit !== null) {
    const unit = UNITS[selectedUnit];
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentView('lesson')} className="flex items-center gap-2 text-blue-400 hover:text-blue-300"><ArrowLeft size={20} /> Back to Lesson</button>
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
                      className={`w-full text-left p-3 rounded-lg border transition-all ${quizSubmitted ? (oi === q.correct ? 'bg-emerald-900/40 border-emerald-500 text-emerald-300' : quizAnswers[qi] === oi ? 'bg-red-900/40 border-red-500 text-red-300' : 'bg-slate-700/30 border-slate-600 text-slate-400') : quizAnswers[qi] === oi ? 'bg-blue-900/40 border-blue-400 text-white' : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-blue-400'}`}>
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
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-all">
              Submit Quiz
            </button>
          ) : (
            <div className={`mt-6 p-6 rounded-xl border-2 text-center ${quizScore >= 4 ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-red-900/30 border-red-500/50'}`}>
              <div className="text-4xl mb-2">{quizScore >= 4 ? '🎉' : '📚'}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{quizScore}/{unit.quiz.length} Correct</h3>
              <p className="text-slate-300 mb-4">{quizScore >= 4 ? 'You passed! Great understanding of the material.' : 'You need 4/5 to pass. Review the lesson and try again.'}</p>
              <div className="flex gap-3 justify-center">
                {quizScore < 4 && <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg"><RotateCcw size={18} /> Retry</button>}
                <button onClick={() => setCurrentView('list')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">Back to Course</button>
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
            <button onClick={() => setCurrentView('list')} className="flex items-center gap-2 text-blue-400 hover:text-blue-300"><ArrowLeft size={20} /> Back to Course</button>
            <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2"><Trophy size={24} /> Final Exam</h2>
          </div>
          {!examSubmitted && <div className="bg-amber-900/30 border border-amber-500/40 rounded-xl p-4 mb-6 text-amber-300 text-sm">20 questions covering all units. You need 70% (14/20) to pass and earn your certificate.</div>}
          <div className="space-y-6">
            {FINAL_EXAM.map((q, qi) => (
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
            <button onClick={submitExam} disabled={Object.keys(examAnswers).length < FINAL_EXAM.length}
              className="w-full mt-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-all">
              Submit Final Exam
            </button>
          ) : (
            <div className={`mt-6 p-6 rounded-xl border-2 text-center ${examPassed ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-red-900/30 border-red-500/50'}`}>
              <div className="text-5xl mb-3">{examPassed ? '🏆' : '📚'}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{examScore}/{FINAL_EXAM.length} Correct ({Math.round((examScore / FINAL_EXAM.length) * 100)}%)</h3>
              <p className="text-slate-300 mb-4">{examPassed ? 'Congratulations! You have completed the Second Temple Judaism course!' : 'You need 70% (14/20) to pass. Review the units and try again.'}</p>
              <div className="flex gap-3 justify-center">
                {!examPassed && <button onClick={() => { setExamAnswers({}); setExamSubmitted(false); }} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg"><RotateCcw size={18} /> Retry</button>}
                <button onClick={() => setCurrentView('list')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">Back to Course</button>
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
            <button onClick={() => setCurrentView('list')} className="flex items-center gap-2 text-blue-400 hover:text-blue-300"><ArrowLeft size={20} /> Back to Course</button>
            <div className="flex items-center gap-2">
              {lessonDone && <span className="text-emerald-400 text-sm flex items-center gap-1"><CheckCircle size={16} /> Read</span>}
              {quizDone && <span className="text-amber-400 text-sm flex items-center gap-1"><Award size={16} /> Quiz Passed</span>}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-xl p-6 border-2 border-blue-500/50 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{unit.icon}</span>
              <div>
                <p className="text-blue-300 text-sm font-mono">Unit {unit.id}</p>
                <h1 className="text-2xl font-bold text-white">{unit.title}</h1>
                <p className="text-blue-300 text-sm">{unit.duration}</p>
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
            {!lessonDone && <button onClick={() => markLessonComplete(unit.id)} className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"><CheckCircle size={18} /> Mark as Read</button>}
            <button onClick={startQuiz} className={`flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 ${quizDone ? 'opacity-70' : ''}`}>
              <Scroll size={18} /> {quizDone ? 'Retake Quiz' : 'Take Quiz'}
            </button>
          </div>
          <div className="flex justify-between mt-4">
            <button onClick={() => { setSelectedUnit(Math.max(0, selectedUnit - 1)); window.scrollTo(0, 0); }} disabled={selectedUnit === 0}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold py-2 px-4 rounded-lg"><ArrowLeft size={18} /> Previous</button>
            <button onClick={() => { setSelectedUnit(Math.min(UNITS.length - 1, selectedUnit + 1)); window.scrollTo(0, 0); }} disabled={selectedUnit === UNITS.length - 1}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold py-2 px-4 rounded-lg">Next <ChevronRight size={18} /></button>
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
            <BookOpen size={32} className="text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Second Temple Judaism</h1>
              <p className="text-slate-400">Associate-Level Course | 11 Units + Final Exam</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-blue-500/30 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold">Course Progress</span>
            <span className="text-blue-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-slate-400 text-sm mt-2">{completedLessons.length} lessons read | {completedQuizzes.length} quizzes passed | {examCompleted ? 'Exam passed' : 'Exam pending'}</div>
        </div>
        <div className="space-y-3 mb-6">
          {UNITS.map((unit, idx) => {
            const lessonDone = completedLessons.includes(unit.id);
            const quizDone = completedQuizzes.includes(unit.id);
            return (
              <button key={unit.id} onClick={() => { setSelectedUnit(idx); setCurrentView('lesson'); window.scrollTo(0, 0); }}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${lessonDone && quizDone ? 'bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border-emerald-500/50 hover:border-emerald-400' : 'bg-slate-800/50 border-blue-500/30 hover:border-blue-400 hover:bg-slate-800/70'}`}>
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
                      <p className="text-blue-300 text-sm">{unit.duration}</p>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-blue-400" />
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
            {examCompleted ? 'Retake Exam' : 'Start Final Exam'}
          </button>
        </div>
        <div className="mt-6 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl p-6 border border-blue-500/30">
          <h2 className="text-xl font-bold text-blue-300 mb-3 flex items-center gap-2"><Scroll size={24} /> About This Course</h2>
          <p className="text-slate-300 mb-3"><strong className="text-blue-300">Associate-Level Course</strong> - A rigorous, text-driven study of Judaism from the return from Babylonian exile to the destruction of the Second Temple (AD 70). Covers Persian, Hellenistic, Hasmonean, and Roman periods, including temple worship, Torah interpretation, Jewish sects, messianic expectations, apocalyptic worldview, and the historical context of Jesus and early Christianity.</p>
          <p className="text-slate-300"><strong className="text-blue-300">Credit Equivalent:</strong> 6 credits | <strong className="text-blue-300">Prerequisites:</strong> Basic biblical and historical knowledge recommended</p>
        </div>
      </div>
    </div>
  );
};

export default SecondTempleJudaismCourse;
