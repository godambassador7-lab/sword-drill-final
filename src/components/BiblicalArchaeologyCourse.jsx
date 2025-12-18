import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, MapPin, Scroll, Award, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

const BiblicalArchaeologyCourse = ({ onComplete, onCancel, userId, userData, setUserData }) => {
  const [currentModule, setCurrentModule] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [completedLessons, setCompletedLessons] = useState({});

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`archaeology_progress_${userId}`);
    if (saved) {
      const progress = JSON.parse(saved);
      setCompletedLessons(progress.completedLessons || {});
    }
  }, [userId]);

  // Save progress
  const saveProgress = (lessonId) => {
    const updated = { ...completedLessons, [lessonId]: true };
    setCompletedLessons(updated);
    localStorage.setItem(`archaeology_progress_${userId}`, JSON.stringify({
      completedLessons: updated
    }));
  };

  const courseModules = [
    {
      id: 'foundations',
      title: 'Foundations of Biblical Archaeology',
      icon: '🏛️',
      description: 'Introduction to archaeological methods and biblical sites',
      lessons: [
        {
          id: 'intro',
          title: 'Introduction to Biblical Archaeology',
          content: `
# Introduction to Biblical Archaeology

## What is Biblical Archaeology?

Biblical archaeology is the archaeological study of peoples, cultures, and civilizations mentioned in or related to the Bible. It seeks to illuminate the historical context of biblical narratives through material evidence.

### Key Objectives:
- **Historical Verification**: Confirming or challenging biblical accounts through physical evidence
- **Cultural Context**: Understanding daily life, customs, and societies of biblical times
- **Textual Illumination**: Providing background that helps interpret biblical texts
- **Chronological Framework**: Establishing timelines for biblical events

## The Archaeological Process

### 1. Survey and Excavation
Archaeologists carefully excavate tells (settlement mounds) in layers, documenting artifacts, structures, and stratigraphy.

### 2. Dating Methods
- **Ceramic Typology**: Dating pottery styles by period
- **Carbon-14 Dating**: Radiocarbon dating of organic materials
- **Stratigraphy**: Analyzing layers of occupation
- **Comparative Analysis**: Relating finds to known historical periods

### 3. Interpretation
Integrating physical evidence with historical texts, including the Bible, ancient Near Eastern records, and classical sources.

## Major Archaeological Periods

- **Early Bronze Age** (3300-2000 BCE): Emergence of cities
- **Middle Bronze Age** (2000-1550 BCE): Patriarchal period
- **Late Bronze Age** (1550-1200 BCE): Egyptian dominance, Exodus era
- **Iron Age I** (1200-1000 BCE): Settlement period, Judges
- **Iron Age II** (1000-586 BCE): United and Divided Monarchy
- **Persian Period** (539-332 BCE): Return from Exile
- **Hellenistic Period** (332-63 BCE): Greek influence
- **Roman Period** (63 BCE-324 CE): New Testament era

## Key Archaeological Sites

Major biblical sites under excavation include Jerusalem, Jericho, Megiddo, Hazor, Dan, Gezer, Lachish, and many others throughout Israel, Jordan, Syria, Egypt, Iraq, and Turkey.

---

**Citation**: Mazar, Amiha. *Archaeology of the Land of the Bible: 10,000-586 B.C.E.* New York: Doubleday, 1990.
          `,
        },
        {
          id: 'methods',
          title: 'Archaeological Methods and Dating',
          content: `
# Archaeological Methods and Dating

## Excavation Techniques

### Stratigraphic Excavation
The Wheeler-Kenyon method involves excavating in squares with baulks (unexcavated walls) to reveal stratigraphy. Each layer (stratum) represents a period of occupation.

### Recording and Documentation
- **Field notebooks**: Detailed daily records
- **Photography**: Documenting finds in situ
- **Drawing**: Scale drawings of walls, floors, pottery
- **Digital mapping**: GPS and GIS technology

## Dating Methods

### Relative Dating

**Ceramic Typology**
Pottery styles changed over time, allowing archaeologists to date layers by comparing pottery assemblages. William F. Albright pioneered ceramic chronology for Palestine.

**Stratigraphy**
Later deposits overlay earlier ones (Law of Superposition). Intrusions like pits can disturb the sequence.

### Absolute Dating

**Radiocarbon Dating (C-14)**
Measures decay of carbon-14 in organic materials. Useful for materials up to ~50,000 years old. Calibration curves adjust for atmospheric variations.

**Dendrochronology**
Tree-ring dating, limited use in the Levant due to climate.

**Thermoluminescence**
Measures trapped electrons in pottery, heated materials.

## Material Culture Analysis

### Pottery
Most common artifact. Used for:
- Dating archaeological layers
- Determining trade connections
- Understanding daily life and economy

### Architecture
Building techniques, urban planning reveal:
- Societal organization
- Economic capacity
- Cultural influences
- Defensive strategies

### Inscriptions
Written materials (ostraca, seals, monumental inscriptions) provide:
- Historical names and events
- Administrative systems
- Religious practices
- Language development

---

**Citations**:
- Wright, G. Ernest. *Biblical Archaeology*. Philadelphia: Westminster Press, 1957.
- Dever, William G. *What Did the Biblical Writers Know and When Did They Know It?* Grand Rapids: Eerdmans, 2001.
          `,
        },
      ],
    },
    {
      id: 'patriarchal',
      title: 'The Patriarchal Period',
      icon: '👴',
      description: 'Abraham, Isaac, and Jacob in archaeological context',
      lessons: [
        {
          id: 'abraham-era',
          title: 'The World of Abraham',
          content: `
# The World of Abraham

## Historical Context: Middle Bronze Age (2000-1550 BCE)

The biblical patriarchal narratives (Genesis 12-50) describe Abraham, Isaac, and Jacob during what archaeologists identify as the Middle Bronze Age.

## Archaeological Evidence

### Urbanization in Canaan
During MB IIA-B (2000-1750 BCE), Canaan experienced significant urbanization:
- Fortified cities with massive ramparts
- Sophisticated water systems
- Evidence of trade networks
- Multi-room houses

**Major Sites**: Hazor, Megiddo, Shechem, Gezer

### Mesopotamian Context

**Ur of the Chaldees**
Abraham's birthplace (Genesis 11:31). Excavations by Leonard Woolley (1922-1934) revealed:
- Magnificent ziggurat of Nanna (moon god)
- Royal cemetery with elaborate burials
- Cuneiform tablets documenting daily life
- Evidence of sophisticated urban culture

**Mari Archives**
Discovered in 1933, ~25,000 cuneiform tablets from Mari (18th century BCE) mention:
- Personal names similar to biblical patriarchs
- Tribal customs resembling Genesis accounts
- Cities like Haran (Genesis 11:31-32)
- Semi-nomadic groups called *Habiru* (possibly related to "Hebrew")

### Amorite Culture
The patriarchs lived during the Amorite period. Amorite names and customs in Mari texts parallel biblical narratives:
- Covenant-making ceremonies
- Adoption customs
- Inheritance practices
- Sister-wife designations

## The Negev and Pastoral Nomadism

Archaeological surveys reveal seasonal settlements in the Negev during MB I, consistent with patriarchal wanderings:
- Circular encampments
- Limited pottery
- Evidence of flocks
- Trade route stations

## Hebron and Burial Sites

**Cave of Machpelah**
Abraham purchased this burial cave (Genesis 23). While the current structure is Byzantine/Crusader, the tradition of its location is ancient. Bronze Age tombs in the Hebron area show burial customs consistent with Genesis accounts.

---

**Citations**:
- Woolley, C. Leonard. *Ur of the Chaldees*. London: Ernest Benn, 1929.
- Kitchen, K.A. *On the Reliability of the Old Testament*. Grand Rapids: Eerdmans, 2003.
- Bimson, John J. "Archaeological Data and the Dating of the Patriarchs." In *Essays on the Patriarchal Narratives*, edited by A.R. Millard and D.J. Wiseman, 59-92. Leicester: IVP, 1980.
          `,
        },
        {
          id: 'egypt-connection',
          title: 'Egypt and the Patriarchs',
          content: `
# Egypt and the Patriarchs

## Joseph in Egypt

The Joseph narrative (Genesis 37-50) contains numerous Egyptian elements that archaeological and textual evidence can illuminate.

### Historical Plausibility

**Hyksos Period** (c. 1650-1550 BCE)
Many scholars place Joseph during or near the Hyksos period when Semitic peoples ruled Egypt:
- Hyksos were Asiatic rulers of Egypt
- They had Semitic names
- They favored other Semites, explaining Joseph's rise
- Capital at Avaris (Tell el-Daba) in the Delta

### Egyptian Details in Genesis

The Joseph narrative contains accurate Egyptian details:

**Administrative Titles**
- "Over all the land of Egypt" (Genesis 41:40) - parallels Egyptian vizier
- Storage cities and granaries - well-attested in Egyptian records

**Names**
- Zaphenath-paneah (Genesis 41:45) - recognizable Egyptian form
- Asenath - means "belonging to (goddess) Neith"
- Potiphera - "he whom Ra has given"

**Customs**
- Shaving before Pharaoh (Genesis 41:14) - Egyptian practice
- Linen garments and gold chain (Genesis 41:42) - symbols of office
- Embalming (Genesis 50:2-3) - Egyptian practice
- 70 days of mourning (Genesis 50:3) - Egyptian royal custom

**Social Details**
- Shepherds as "abomination" to Egyptians (Genesis 46:34) - Egyptian texts confirm prejudice against nomads
- Separate eating (Genesis 43:32) - Egyptian ritual purity laws
- Dreams and interpretation - major in Egyptian culture

### Archaeological Evidence

**Beni Hasan Tomb Painting** (c. 1900 BCE)
Depicts Asiatic Semites entering Egypt, showing:
- Multi-colored coats like Joseph's
- Trade caravans
- Integration of Semites into Egyptian society

**Brooklyn Papyrus** (c. 1800 BCE)
Lists household servants with Semitic names, confirming Semitic slaves/servants in Egypt.

**Avaris Excavations** (Tell el-Daba)
Manfred Bietak's excavations reveal:
- Asiatic settlement in Egyptian Delta
- Semitic cultural elements
- Possible context for Jacob's family in Goshen

---

**Citations**:
- Hoffmeier, James K. *Israel in Egypt: The Evidence for the Authenticity of the Exodus Tradition*. Oxford: Oxford University Press, 1997.
- Kitchen, K.A. "Genesis 12-50 in the Near Eastern World." In *He Swore an Oath*, edited by R.S. Hess, et al., 67-92. Cambridge: Tyndale House, 1993.
- Bietak, Manfred. *Avaris: The Capital of the Hyksos*. London: British Museum Press, 1996.
          `,
        },
      ],
    },
    {
      id: 'exodus',
      title: 'Exodus and Conquest',
      icon: '🌊',
      description: 'Israel\'s exodus from Egypt and entry into Canaan',
      lessons: [
        {
          id: 'exodus-evidence',
          title: 'Evidence for the Exodus',
          content: `
# Evidence for the Exodus

## The Exodus Question

The Exodus is central to Israelite faith but debated in archaeology. Direct evidence is challenging due to:
- Nomadic populations leave minimal remains
- Egyptian records rarely recorded defeats
- Wilderness conditions don't preserve materials
- Exact route and date debated

## Dating Debates

### Early Date (c. 1446 BCE)
Based on 1 Kings 6:1 (480 years before Solomon's temple, c. 966 BCE)
- Corresponds to Late Bronze Age I
- Pharaoh: Thutmose III or Amenhotep II
- Conquest in Late Bronze I (1400s BCE)

### Late Date (c. 1250 BCE)
Based on archaeological evidence and Egyptian history
- Pharaoh: Ramesses II (1279-1213 BCE)
- Exodus during 19th Dynasty
- Conquest in Iron Age I (1200s BCE)

## Egyptian Evidence

### Pithom and Rameses
Exodus 1:11 mentions store cities Pithom and Rameses:
- **Rameses**: Likely Pi-Ramesses, Ramesses II's Delta capital (Qantir)
- **Pithom**: Possibly Tell el-Retaba or Tell el-Maskhuta
- Evidence of Semitic laborers at these sites

### Merneptah Stele (c. 1208 BCE)
Earliest mention of "Israel" outside the Bible:
- Victory monument of Pharaoh Merneptah
- States: "Israel is laid waste, his seed is not"
- Indicates Israel was in Canaan by 1200 BCE
- Described as a people (not city-state), suggesting semi-nomadic

### Ipuwer Papyrus
Describes Egyptian calamities similar to plagues (controversial dating):
- "The river is blood"
- "Plague throughout the land"
- Possibly refers to different events

## Wilderness Period

### Mount Sinai Location
Traditional site: Jebel Musa in southern Sinai
- Byzantine tradition
- Monastery of St. Catherine
Alternative theories: sites in northwest Arabia or Midian

### Kadesh-Barnea
Identified with Ein el-Qudeirat:
- Fortresses from Iron Age II (later than Exodus)
- Limited Late Bronze Age remains
- Consistent with brief nomadic presence

### Transjordan Evidence

**Edom, Moab, Ammon**
Numbers 20-21 describes encounters with these kingdoms. Archaeological evidence:
- Settlement intensified in Iron Age I (1200s BCE)
- Supports late date chronology
- Earlier presence possible but limited

**King's Highway**
Ancient trade route mentioned in Numbers 20:17
- Archaeological evidence confirms Bronze Age use
- Fortifications and settlements along route

---

**Citations**:
- Hoffmeier, James K. *Ancient Israel in Sinai: The Evidence for the Authenticity of the Wilderness Tradition*. Oxford: Oxford University Press, 2005.
- Kitchen, K.A. *On the Reliability of the Old Testament*, 241-312. Grand Rapids: Eerdmans, 2003.
- Rainey, Anson F., and R. Steven Notley. *The Sacred Bridge: Carta's Atlas of the Biblical World*. Jerusalem: Carta, 2006.
          `,
        },
        {
          id: 'conquest-canaan',
          title: 'The Conquest of Canaan',
          content: `
# The Conquest of Canaan

## Archaeological Models

### Conquest Model (Joshua 1-12)
Sudden military conquest led by Joshua, destroying Canaanite cities.

### Peaceful Infiltration
Gradual settlement of nomadic Israelites without major conflict.

### Peasant Revolt
Indigenous Canaanites rebelling against city-state overlords.

### Mixed Model
Combination of conquest, settlement, and assimilation over time.

## Key Archaeological Sites

### Jericho (Tell es-Sultan)

**Biblical Account**: First Canaanite city conquered (Joshua 6)
- Walls fell after Israelites marched around city
- City destroyed by fire
- Rahab's house preserved

**Archaeological Evidence** (Kathleen Kenyon, 1950s):
- City Wall: Erosion destroyed much Late Bronze Age evidence
- Destruction Layer: Limited Late Bronze remains found
- Dating Issues: Major destruction in Early Bronze Age (c. 2300 BCE)

**Recent Reassessment** (Bryant Wood):
- Reanalysis suggests Late Bronze I destruction (c. 1400 BCE)
- Evidence of burned grain (hasty abandonment)
- Collapsed walls
- Debate continues on dating

### Ai (et-Tell)

**Biblical Account**: Second conquest target (Joshua 7-8)

**Archaeological Problem**:
- Major Early Bronze Age city (3000-2400 BCE)
- Abandoned during Late Bronze Age (conquest period)
- Reoccupied in Iron Age I

**Proposed Solutions**:
- Wrong site identification (Ai means "ruin")
- Alternate sites: Khirbet el-Maqatir, Khirbet Nisya
- Theological/literary account rather than historical
- Conquest memory of earlier destruction

### Hazor (Tell el-Qedah)

**Biblical Account**: Largest Canaanite city, burned by Joshua (Joshua 11:10-13)

**Archaeological Evidence** (Yigael Yadin, 1950s-1970s):
- Massive Canaanite city in Late Bronze Age
- Lower city: 200 acres, largest in Canaan
- Violent destruction in 13th century BCE
- Temples destroyed, Canaanite cult objects defaced
- Fire layer matches biblical account
- One of strongest archaeological correlations

### Lachish (Tell ed-Duweir)

**Biblical Account**: Conquered by Joshua (Joshua 10:31-32)

**Archaeological Evidence**:
- Major Canaanite city-state
- Destruction level in late 13th century BCE
- Fosse Temple destroyed
- Possible correlation with conquest
- Later destructions by Assyrians (701 BCE), Babylonians (586 BCE)

## Settlement Pattern Analysis

### Survey Evidence (Israel Finkelstein)
Hundreds of new small settlements in hill country during Iron Age I (1200-1000 BCE):
- Simple four-room houses (Israelite style)
- Absence of pig bones (dietary law observance?)
- Collar-rim jars (distinctive pottery)
- Terraced farming
- Cisterns for water storage

This pattern suggests:
- Population increase in highlands
- New ethnic group or cultural shift
- Gradual settlement process

## The Conquest Debate

### Maximalist View
Joshua describes essentially accurate historical conquest (c. 1400 or 1250 BCE), though some details are stylized.

### Minimalist View
Joshua is late theological composition with minimal historical basis; Israel emerged from within Canaan.

### Middle Position
Core historical memory of some military conflicts, combined with gradual settlement and assimilation. Not all cities conquered simultaneously.

---

**Citations**:
- Wood, Bryant G. "Did the Israelites Conquer Jericho? A New Look at the Archaeological Evidence." *Biblical Archaeology Review* 16.2 (1990): 44-58.
- Yadin, Yigael. *Hazor: The Rediscovery of a Great Citadel of the Bible*. New York: Random House, 1975.
- Finkelstein, Israel, and Neil Asher Silberman. *The Bible Unearthed: Archaeology's New Vision of Ancient Israel*. New York: Free Press, 2001.
- Kitchen, K.A. *On the Reliability of the Old Testament*, 159-186. Grand Rapids: Eerdmans, 2003.
          `,
        },
      ],
    },
    {
      id: 'monarchy',
      title: 'United and Divided Monarchy',
      icon: '👑',
      description: 'David, Solomon, and the kingdoms of Israel and Judah',
      lessons: [
        {
          id: 'david-solomon',
          title: 'David and Solomon',
          content: `
# David and Solomon: Archaeological Evidence

## The United Monarchy (c. 1000-930 BCE)

The reigns of David and Solomon mark Israel's political zenith. Archaeological evidence provides mixed but growing support.

## David (c. 1010-970 BCE)

### Tel Dan Stele (1993)
Discovered by Avraham Biran, this 9th century BCE Aramaic inscription is revolutionary:
- Mentions "House of David" (bytdwd)
- First extrabiblical reference to David
- Confirms David as historical figure and dynasty founder
- Part of victory monument by Aramean king

**Significance**: Ended scholarly debate over David's historicity

### Mesha Stele (Moabite Stone, c. 840 BCE)
- Possible reference to "House of David" (disputed reading)
- Describes conflicts between Moab and Israel
- Mentions King Omri of Israel

### City of David Excavations (Jerusalem)

**Stepped Stone Structure**
- Massive supporting structure in City of David
- Dated to 10th century BCE (debated)
- Possibly supported David's palace or fortress
- Shows significant 10th century building activity

**Ketef Hinnom Silver Scrolls** (late 7th century BCE)
- Contain Priestly Blessing (Numbers 6:24-26)
- Oldest known biblical text
- Shows continuity of Jerusalem traditions

### Khirbet Qeiyafa (Elah Fortress)
Discovered by Yosef Garfinkel (2007-2013):
- Fortified city from early 10th century BCE
- Hebrew ostracon (pottery shard with writing)
- Strategic location in Elah Valley (David vs. Goliath region)
- Suggests significant Judahite kingdom in David's time
- Lacks pig bones (Israelite dietary laws?)

**Debates**: Some scholars date it later or question ethnic identification

## Solomon (c. 970-931 BCE)

### Temple of Solomon
No archaeological remains of Solomon's Temple have been found:
- Site occupied by Dome of the Rock and Al-Aqsa Mosque
- Later temples (Zerubbabel, Herod) built over it
- Biblical description (1 Kings 6-7) matches Phoenician temple architecture
- Parallel: Temple at Ain Dara, Syria (similar floor plan, dimensions)

### Solomonic Gates
Y. Yadin identified six-chambered gates at three cities mentioned in 1 Kings 9:15:
- **Hazor**
- **Megiddo**
- **Gezer**

All three have similar gate designs, suggesting:
- Unified building program
- Royal administrative architecture
- 10th century BCE construction

**Debates**:
- I. Finkelstein argues these are 9th century (Omride dynasty)
- Ongoing debate over 10th vs. 9th century dating (Low Chronology debate)

### Megiddo Stables
Long identified as "Solomon's stables" (1 Kings 4:26):
- Large pillared buildings
- Capacity for many horses
- Now generally dated to 9th century (Ahab's time)
- Shows sophisticated administration, even if not Solomonic

### Trade and Wealth

**Ezion-Geber** (Tell el-Kheleifeh)
- Port city on Red Sea (1 Kings 9:26)
- Excavated by Nelson Glueck (1930s-1940s)
- Originally identified as copper smelting center
- Reanalysis: Probably fort and trading post
- Evidence of Red Sea trade routes

**Timna Copper Mines**
- Major copper production in Arabah Valley
- Dated to various periods including 10th century BCE
- Possibly related to Solomon's wealth
- Egyptian and local operation

### Queen of Sheba
Solomon receives Queen of Sheba (1 Kings 10):
- Sheba likely in Yemen or Ethiopia (Saba)
- Sabean inscriptions confirm sophisticated kingdom
- Arabian frankincense and spice trade well-documented
- No direct archaeological confirmation of visit

## Challenges to United Monarchy

### Minimalist Position (Finkelstein, Silberman)
- Jerusalem was small village in 10th century
- David and Solomon ruled minor chiefdom, not empire
- Biblical account is 7th century Josian propaganda
- Monumental building is 9th century (Omride)

### Maximalist Response (Mazar, Kitchen, Garfinkel)
- Growing evidence of 10th century state formation
- Khirbet Qeiyafa shows fortified cities
- Tel Dan Stele confirms Davidic dynasty
- Biblical account has historical core

### Current Consensus
Most scholars accept:
- David and Solomon were historical kings
- Extent of their kingdom debated
- Some monumental building in 10th century
- Biblical account contains historical memory with theological interpretation

---

**Citations**:
- Biran, Avraham, and Joseph Naveh. "An Aramaic Stele Fragment from Tel Dan." *Israel Exploration Journal* 43 (1993): 81-98.
- Garfinkel, Yosef. *Khirbet Qeiyafa Vol. 1: Excavation Report 2007-2008*. Jerusalem: Israel Exploration Society, 2012.
- Mazar, Amihai. "Archaeology and the Biblical Narrative: The Case of the United Monarchy." In *One God - One Cult - One Nation*, edited by R. G. Kratz and H. Spieckermann, 29-58. Berlin: De Gruyter, 2010.
- Finkelstein, Israel. *The Forgotten Kingdom: The Archaeology and History of Northern Israel*. Atlanta: SBL Press, 2013.
          `,
        },
        {
          id: 'divided-kingdoms',
          title: 'Israel and Judah Divided',
          content: `
# The Divided Kingdoms: Israel and Judah

## Historical Overview (931-586 BCE)

After Solomon's death, the kingdom split:
- **Northern Kingdom (Israel)**: 10 tribes, capital Samaria
- **Southern Kingdom (Judah)**: 2 tribes, capital Jerusalem

## Northern Kingdom (Israel, 931-722 BCE)

### Omride Dynasty (c. 885-841 BCE)

**Samaria**
Capital city built by Omri (1 Kings 16:24):
- Excavations by Reisner and Fisher (1908-1910), Crowfoot (1931-1935)
- Impressive architecture and fortifications
- Ivory palace decorations (Amos 3:15, 6:4)
- Ostraca (pottery sherds) with Hebrew inscriptions
- Administrative records showing wine and oil distribution
- Evidence of wealth and sophisticated government

**Mesha Stele** (Moabite Stone, c. 840 BCE)
Found in 1868, describes rebellion of Mesha king of Moab:
- Confirms biblical King Omri (2 Kings 3:4-5)
- States: "Omri, king of Israel, oppressed Moab many days"
- Describes Moabite recapture of cities
- Mentions Israelite god "Yahweh"
- Parallel to 2 Kings 3

**Black Obelisk of Shalmaneser III** (841 BCE)
Assyrian monument depicts:
- "Jehu son of Omri" paying tribute
- Only contemporary image of Israelite king
- Confirms 2 Kings 9-10 timeframe
- Shows Assyrian pressure on Israel

### Jeroboam II (c. 786-746 BCE)

**Prosperity and Expansion**
2 Kings 14:25 describes territorial expansion:
- Archaeological surveys show settlement growth
- Tel Rehov: major administrative center
- Economic prosperity reflected in Amos's critique of luxury

### Fall of Samaria (722 BCE)

**Assyrian Conquest**
2 Kings 17 describes destruction by Shalmaneser V and Sargon II:
- Sargon's annals: "I besieged and conquered Samaria...27,290 people I carried away"
- Archaeological destruction layer at Samaria
- Deportation policy confirmed in Assyrian records
- End of Northern Kingdom

## Southern Kingdom (Judah, 931-586 BCE)

### Hezekiah (c. 715-686 BCE)

**Religious Reforms** (2 Kings 18:4)
Archaeological evidence:
- Destruction of high places
- Centralization of worship in Jerusalem
- Arad temple dismantled (possibly by Hezekiah)
- LMLK seal impressions (royal storage jars) show administrative reorganization

**Hezekiah's Tunnel**
2 Kings 20:20; 2 Chronicles 32:30:
- Discovered in 1880
- 533-meter tunnel through bedrock
- Brought water from Gihon Spring into Jerusalem
- **Siloam Inscription** (c. 700 BCE): Hebrew inscription describing tunnel construction
- One of longest ancient water tunnels
- Preparation for Assyrian siege

**Siege of Lachish** (701 BCE)
2 Kings 18:13-14; Isaiah 36:
- **Lachish Reliefs**: Sennacherib's palace reliefs show siege in detail
  - Assyrian army attacking with siege ramps
  - Deportation of civilians
  - Torture and execution of defenders
- **Archaeological Evidence**:
  - Massive destruction layer
  - Assyrian siege ramp still visible
  - Hundreds of arrowheads
  - Mass grave with ~1,500 bodies
- Most detailed correlation between Bible, archaeology, and Assyrian records

**Taylor Prism** (Sennacherib's Annals, 701 BCE)
Assyrian account of campaign:
- "Hezekiah of Judah, I shut up like a caged bird in Jerusalem"
- Confirms biblical account (2 Kings 18-19)
- No claim of capturing Jerusalem (matches Bible)
- List of tribute matches 2 Kings 18:14-16

### Josiah (640-609 BCE)

**Religious Reform** (2 Kings 22-23)
- Discovery of "Book of the Law" (621 BCE)
- Centralization of worship, destruction of high places
- Some scholars see this as key period for biblical compilation

**Archaeological Evidence**:
- Continued LMLK jar stamps
- Administrative expansion
- Possible brief expansion into former northern territory

### Fall of Jerusalem (586 BCE)

**Babylonian Conquest** (2 Kings 25)
Archaeological evidence:
- **Destruction layer** in Jerusalem and throughout Judah
- **Lachish Letters**: Hebrew ostraca describing desperate military situation
  - "We are watching for signals of Lachish...for we cannot see Azekah"
  - Confirms 2 Kings 25:1-2
- **City of David**: Arrowheads, destruction debris
- **Burnt room** with bullae (seal impressions) of officials mentioned in Jeremiah
  - Gemaryahu ben Shaphan (Jeremiah 36:10)
  - Probably Yerahme'el son of the king (Jeremiah 36:26)

**Babylonian Records**
- Babylonian Chronicles describe capture of Jerusalem (597 BCE)
- Ration tablets from Babylon mention "Yaukin king of Judah" (Jehoiachin)
- Confirms 2 Kings 24:10-17

---

**Citations**:
- Ussishkin, David. *The Conquest of Lachish by Sennacherib*. Tel Aviv: Tel Aviv University, 1982.
- Cogan, Mordechai. "Sennacherib's Siege of Jerusalem: Once or Twice?" *Biblical Archaeology Review* 27.1 (2001): 40-45.
- Reich, Ronny, and Eli Shukron. "The Date of the Siloam Tunnel Reconsidered." *Tel Aviv* 38 (2011): 147-157.
- Avigad, Nahman. "Baruch the Scribe and Jerahmeel the King's Son." *Biblical Archaeologist* 42.2 (1979): 114-118.
          `,
        },
      ],
    },
    {
      id: 'exile-return',
      title: 'Exile and Return',
      icon: '🏛️',
      description: 'Babylonian exile and Persian period restoration',
      lessons: [
        {
          id: 'babylonian-exile',
          title: 'The Babylonian Exile',
          content: `
# The Babylonian Exile (586-539 BCE)

## Historical Context

After destroying Jerusalem in 586 BCE, Nebuchadnezzar II deported Judah's elite to Babylon (2 Kings 25; Jeremiah 52).

## Archaeological Evidence for the Exile

### Babylon

**The City**
Excavations by Robert Koldewey (1899-1917):
- Ishtar Gate (reconstructed in Berlin Museum)
- Processional Way
- Hanging Gardens site (debated)
- Palace of Nebuchadnezzar
- Massive walls and fortifications

**Ration Tablets**
Administrative texts from Babylon (c. 592 BCE):
- List provisions for captives
- Mention "Yaukin (Jehoiachin) king of Judah"
- His five sons also listed
- Confirms biblical account (2 Kings 24:12-15)

**Al-Yahudu Archive**
Cuneiform tablets published by Pearce and Wunsch (2014):
- Jewish settlement in Babylon called "City of Judah" (Al-Yahudu)
- Jewish names combining Yahweh with Babylonian elements
- Shows cultural interaction and economic activity
- Dates from Nebuchadnezzar to Darius I

### Judah During Exile

**Demographic Collapse**
Archaeological surveys show:
- Massive population decline (85-90% reduction)
- Most cities destroyed or abandoned
- Settlement shifted to Benjamin region (north of Jerusalem)
- Poverty and subsistence economy

**Tell en-Nasbeh (Mizpah)**
Probable administrative center:
- Survived destruction
- Possible seat of Gedaliah (2 Kings 25:22-24)
- Stamp impressions reading "Mizpah"

**Babylonian Administration**
- Few Babylonian fortresses
- Light occupation by Babylonians
- Land given to "people of the land" (2 Kings 25:12)

## Life in Exile

### Integration and Preservation

Based on Ezekiel, Daniel, Esther, and archaeological evidence:
- **Economic Participation**: Al-Yahudu texts show Jews farming, trading
- **Social Organization**: Maintained tribal/family groupings
- **Religious Development**: Synagogue origins (uncertain)
- **Cultural Exchange**: Adopted Aramaic, some Babylonian names
- **Identity Preservation**: Maintained Yahweh worship, dietary laws

### Ezekiel and Tel Abib
Ezekiel prophesied "among the exiles at Tel Abib by the Kebar River" (Ezekiel 1:1, 3:15):
- Kebar River: Likely canal near Nippur (naru kabari in Babylonian texts)
- Tel Abib: Possibly til abubi ("mound of the flood/storm")
- Setting reflects real Babylonian geography

---

**Citations**:
- Pearce, Laurie E., and Cornelia Wunsch. *Documents of Judean Exiles and West Semites in Babylonia in the Collection of David Sofer*. Bethesda: CDL Press, 2014.
- Lipschits, Oded. *The Fall and Rise of Jerusalem*. Winona Lake: Eisenbrauns, 2005.
- Weidner, E.F. "Jojachin, König von Juda, in babylonischen Keilschrifttexten." In *Mélanges Syriens offerts à Monsieur René Dussaud*, 2:923-935. Paris: Geuthner, 1939.
          `,
        },
        {
          id: 'persian-return',
          title: 'The Persian Period and Return',
          content: `
# The Persian Period and Return (539-332 BCE)

## Cyrus the Great and the Edict (539 BCE)

### Historical Context

In 539 BCE, Cyrus II of Persia conquered Babylon, ending the Neo-Babylonian Empire and beginning Persian rule.

### The Cyrus Cylinder (539 BCE)

Discovered in 1879, this clay cylinder records Cyrus's conquest:
- Claims Marduk (Babylonian god) chose him
- States he restored temples and returned cult images
- Describes policy of religious tolerance
- Parallel to biblical account of return (Ezra 1:1-4)

**Biblical Significance**:
- Ezra 1:1-4; 6:3-5 describe Cyrus's decree allowing Jewish return
- 2 Chronicles 36:22-23
- Isaiah 44:28-45:1 prophesies Cyrus by name (written before or after conquest debated)

**Note**: The cylinder doesn't mention Jews specifically, but confirms Cyrus's general policy of allowing captive peoples to return and rebuild temples.

## The Return and Rebuilding

### Zerubbabel and the Second Temple

**Ezra 3-6** describes return under Zerubbabel and temple rebuilding (520-515 BCE)

**Archaeological Evidence**:
- Few Persian period remains in Jerusalem
- City walls rebuilt by Nehemiah (445 BCE)
- Yehud seal impressions (provincial stamps)
- Limited but growing evidence of settlement

**Elephantine Papyri** (5th century BCE)
Jewish military colony in Egypt:
- Letters in Aramaic
- Mention rebuilding of temple
- Request help from Jerusalem
- Mention Sanballat of Samaria (Nehemiah 2:10, 19)
- Confirm Jewish diaspora and Persian administration

### Nehemiah and the Walls

**Nehemiah 1-6** describes rebuilding Jerusalem's walls (445 BCE)

**Archaeological Evidence**:
- Kathleen Kenyon found wall segments dated to Persian period
- Eilat Mazar: possible Nehemiah's wall sections
- Tower remains in City of David
- Limited city size in Persian period

**Wadi Daliyeh Papyri**
4th century BCE papyri from Samaria:
- Mention Sanballat (III) - same family name as Nehemiah's opponent
- Show Samaritan administration
- Confirm biblical names and structure

### Ezra and Religious Reform

**Ezra 7-10; Nehemiah 8-10** describe Ezra's mission (458 or 398 BCE, debated)

**Cultural Evidence**:
- Transition to Aramaic as common language
- Development of Torah as central text
- Formation of religious community around law
- Origins of later Judaism

## Persian Period Judah (Yehud)

### Administrative Evidence

**Yehud Stamps**
Jar handle impressions reading "Yehud" (Persian province name):
- Shows Judah as official Persian province
- Administrative continuity
- Economic activity (taxation, storage)

**Coinage**
Small silver coins inscribed "Yehud":
- Earliest Jewish coins
- Some with priestly imagery
- Some with divine name (Yhw)
- Shows semi-autonomous status

### Demographics and Settlement

Archaeological surveys reveal:
- Small population (estimated 30,000-50,000)
- Concentrated in Jerusalem and Benjamin region
- Gradual growth through Persian period
- Fortresses at strategic points

### Cultural Developments

**Biblical Literature**:
Many scholars date final editing of Torah, prophets, and historical books to Persian period:
- Priestly source (P) in Pentateuch
- Deuteronomistic History final edition
- Prophetic collections
- Ongoing scholarly debate

**Samaritan Schism**:
- Division between Jews and Samaritans solidified
- Separate temple on Mount Gerizim (archaeological remains found)
- Both groups claimed Israelite heritage

## Transition to Hellenistic Period

Persian rule ended with Alexander the Great's conquest (332 BCE), beginning Hellenistic period and new cultural challenges for Jews.

---

**Citations**:
- Berquist, Jon L. *Judaism in Persia's Shadow: A Social and Historical Approach*. Minneapolis: Fortress Press, 1995.
- Carter, Charles E. *The Emergence of Yehud in the Persian Period*. Sheffield: Sheffield Academic Press, 1999.
- Mazar, Eilat. *The Palace of King David: Excavations at the Summit of the City of David*. Jerusalem: Shoham Academic Research and Publication, 2009.
- Porten, Bezalel. *Archives from Elephantine: The Life of an Ancient Jewish Military Colony*. Berkeley: University of California Press, 1968.
          `,
        },
      ],
    },
    {
      id: 'nt-period',
      title: 'New Testament Archaeology',
      icon: '✝️',
      description: 'Archaeological context of Jesus and early Christianity',
      lessons: [
        {
          id: 'jesus-galilee',
          title: 'Jesus and Galilee',
          content: `
# Jesus and Galilee: Archaeological Context

## First-Century Galilee

The Gospels are set in the Galilee and Judea of the early 1st century CE, during Roman occupation.

## Cities and Villages of Jesus's Ministry

### Nazareth

**Biblical References**: Jesus's hometown (Matthew 2:23; Luke 1:26-27)

**Archaeological Evidence**:
- Farm village with ~400 inhabitants in 1st century
- Limestone vessels (ritual purity)
- Terraced hillsides for agriculture
- Recently discovered "Nazareth Village" remains under modern city
- **Church of the Annunciation**: Byzantine tradition on earlier structures
- Evidence of Jewish village before 70 CE

**Nazareth Inscription**
Marble fragment (3rd-4th century) with synagogue donation text mentioning Nazareth, confirming name.

### Capernaum (Kfar Nahum)

**Biblical References**: Jesus's ministry base (Matthew 4:13; Mark 2:1)

**Archaeological Evidence**:
Excavations by Franciscans (1968-1986):
- **1st century synagogue remains** under later 4th century white limestone synagogue
- **Peter's House**: 1st century house with Christian graffiti
  - Converted to house-church in 1st century
  - Octagonal church built over it (5th century)
  - Graffiti mentions "Peter" and "Christ"
- Fishing implements, anchors, hooks
- Basalt millstones
- Evidence of fishing village economy

### Bethsaida

**Biblical References**: Home of Peter, Andrew, Philip (John 1:44; 12:21)

**Identification**: et-Tell (most accepted)
**Archaeological Evidence**:
- Iron Age and Hellenistic remains
- Fisherman's house with fishing equipment
- Possible Roman temple
- Debate continues on exact identification

### Chorazin

**Biblical References**: Condemned by Jesus for unbelief (Matthew 11:21)

**Archaeological Evidence**:
- 3rd-4th century synagogue (basalt stone)
- Earlier 1st century village beneath
- Remains of houses, olive presses
- Limited 1st century material

### Magdala (Migdal)

**Biblical References**: Home of Mary Magdalene

**Recent Discovery** (2009):
- **First-century synagogue** discovered (Migdal Synagogue)
- Stone with carved menorah (oldest found in Galilee synagogue)
- Ritual baths (mikvaot)
- Harbor installations
- Dramatic evidence of 1st century Jewish life

## Sea of Galilee

### The Boat

**Discovery**: 1986, during drought
- **First-century fishing boat** (radiocarbon dated)
- Length: 8.2 meters (27 feet)
- Width: 2.3 meters (7.5 feet)
- Type used in Jesus's time
- Could hold ~15 people
- Mortise-and-tenon construction
- "Jesus Boat" (popular name, no proven connection)

**Biblical Context**: Illuminates Gospel boat scenes (Mark 4:35-41; Luke 5:1-11)

### Fishing Industry

Archaeological evidence shows thriving first-century fishing economy:
- Fish processing facilities
- Salted fish trade
- Anchors and fishing weights
- Fish imagery in art and coins

## Religious Life

### Synagogues

No certain 1st century Galilean synagogues found until recent Magdala discovery (though Capernaum, Gamla have 1st century phases).

**Herodium, Masada, Gamla**: Have 1st century structures identified as synagogues/assembly halls

### Ritual Purity

Common finds showing Jewish observance:
- **Stone vessels**: Resistant to ritual impurity (Mark 7:4; John 2:6)
- **Mikvaot** (ritual baths): Found throughout Jewish settlements
- Absence of pig bones in Jewish sites
- Dietary law observance

## Pilate and Roman Rule

### Pilate Inscription (1961)

Found at Caesarea Maritima:
- Limestone block with Latin inscription
- "[...] Tiberieum [...] Pontius Pilate [...] Prefect of Judea [...]"
- Only archaeological mention of Pontius Pilate
- Confirms title "Prefect" (Gospels call him "governor")
- Confirms existence and role

### Herodian Architecture

**Herod the Great** (37-4 BCE) built extensively:
- **Masada**: Fortress palace
- **Herodium**: Palace fortress, Herod's tomb found
- **Caesarea Maritima**: Port city, theater, aqueduct
- **Jerusalem Temple**: Expanded Second Temple (no remains; platform survives)

These show the grandeur of Herodian kingdom context for Jesus's ministry.

---

**Citations**:
- Rousseau, John J., and Rami Arav. *Jesus and His World: An Archaeological and Cultural Dictionary*. Minneapolis: Fortress Press, 1995.
- Charlesworth, James H., ed. *Jesus and Archaeology*. Grand Rapids: Eerdmans, 2006.
- Reed, Jonathan L. *Archaeology and the Galilean Jesus*. Harrisburg: Trinity Press International, 2000.
- Avni, Gideon, et al. "Unearthing Nazareth." *Biblical Archaeology Review* 32.6 (2006): 40-50.
          `,
        },
        {
          id: 'jerusalem-crucifixion',
          title: 'Jerusalem and the Crucifixion',
          content: `
# Jerusalem and the Crucifixion

## Jerusalem in Jesus's Time

### Herod's Temple

**Biblical References**: Central to Jesus's ministry (Matthew 21:12-17; John 2:13-22)

**Archaeological Evidence**:
The temple itself was destroyed in 70 CE, but the platform (Temple Mount/Haram al-Sharif) survives:
- **Western Wall**: Herodian masonry, some stones over 500 tons
- **Robinson's Arch**: Supported stairway to Temple Mount
- **Southern Steps**: Pilgrims' entrance to Temple
- **Warning Inscription**: Greek inscription warning Gentiles not to enter inner courts (found 1871)

**Scale**:
Temple platform: 144,000 sq meters (35 acres), massive engineering feat

**Finds**:
- Stone vessels (ritual purity)
- Coins from period
- Ossuary inscriptions mentioning priests

### The Upper City

Excavations in Jewish Quarter (1970s, Nahman Avigad):
- Wealthy houses ("Herodian Mansions")
- Mosaic floors, frescoes
- **Burnt House**: Destroyed in 70 CE, coins dated to 69 CE
- Stone tables, ritual baths
- Wealth disparity in Jerusalem

## The Passion Sites

### Gethsemane

**Biblical References**: Jesus's prayer before arrest (Matthew 26:36-46)

**Traditional Site**: Church of All Nations
- Ancient olive trees (very old, but not 2,000 years)
- Cave identified as prayer site (uncertain)
- Location on Mount of Olives consistent with Gospels

### Trial Locations

**Caiaphas's House**
- Traditional site: Church of St. Peter in Gallicantu
- Archaeological remains of wealthy 1st century house
- Dungeons/cisterns (possible holding cells)
- Inscription "Caiaphas" found on ossuary in 1990 (see below)

**Praetorium** (Pilate's Judgment Hall)
Two possible locations:
1. **Antonia Fortress**: Northwest of Temple Mount
   - Traditional Via Dolorosa starts here
   - Limited archaeological remains
2. **Herod's Palace**: Western hill (more likely)
   - Pilate probably stayed in palace when in Jerusalem
   - Philo, Josephus support this location

### Via Dolorosa

Traditional route:
- Byzantine tradition (4th century and later)
- Actual 1st century street level meters below current level
- Route may not match historical path
- Devotional significance regardless of exact route

### Golgotha and Crucifixion

**Biblical References**: Place of crucifixion (Matthew 27:33; John 19:17-18)

**Church of the Holy Sepulchre**:
Built by Constantine (326 CE) over site identified by early Christians:
- Outside city walls in 1st century (Josephus, archaeology confirm)
- Rock-cut tombs from period found in church
- Quarry area (Golgotha means "skull," possibly referring to rock formation)
- **Credibility**:
  - Early Christian memory of location (pre-Constantine)
  - Archaeological evidence consistent with 1st century burial area
  - Most scholars accept as plausible site

**Garden Tomb**:
Alternative site (19eh century Protestant tradition):
- Rock-cut tomb
- Skull-shaped hill nearby
- "Protestant" alternative to Orthodox/Catholic Holy Sepulchre
- Most scholars reject as actual site (tomb too early or late, depending on analysis)

### The Tomb

**Archaeological Context**:
First-century Jewish tombs in Jerusalem:
- Kokhim (shaft tombs) or arcosolia (arched niches)
- Rolling stones seal tombs (large disc-shaped stones)
- Family tombs, reused
- Ossuaries for bone collection after flesh decomposed

**Crucified Man** (1968 discovery):
- Ossuary inscribed "Yehohanan son of HGQWL"
- Heel bone pierced by crucifixion nail (still attached)
- Only known archaeological evidence of crucifixion
- Shows method: nailed through heels, probably wrists (not palms)
- Victim's legs broken (matches John 19:31-32)

### Inscriptions and Evidence

**Pilate Inscription**: See previous lesson

**Caiaphas Ossuary** (1990):
Found in family tomb:
- Beautifully decorated ossuary
- Inscription: "Joseph son of Caiaphas" (Yehosef bar Qafa)
- Likely the high priest who tried Jesus (Matthew 26:57)
- Shows name, existence, family

**Theodotos Inscription** (found 1913-1914):
Greek inscription from Jerusalem synagogue:
- Pre-70 CE synagogue
- Founded by "Theodotos, son of Vettenus, priest and archisynagogos"
- Evidence of synagogues in Jerusalem
- "Vettenus" is Latin name, showing Roman presence/interaction

## The Destruction of Jerusalem (70 CE)

### Historical Event

Romans under Titus destroyed Jerusalem and the Temple (Matthew 24:1-2; Luke 19:41-44)

### Archaeological Evidence

**Massive Destruction Layer**:
Throughout Jerusalem, thick layer of ash and destruction:
- Burnt House in Jewish Quarter
- Robinson's Arch area: stones toppled from Temple Mount
- Coins ending in 69-70 CE
- No gap in occupation until Bar Kokhba Revolt (132-135 CE)

**Josephus's Account**:
Jewish historian Josephus Flavius (*Jewish War*) describes siege in detail:
- Matches archaeological destruction
- Describes temple treasures taken to Rome (depicted on Arch of Titus)

**Arch of Titus** (Rome, c. 81 CE):
Relief sculptures show:
- Menorah and temple vessels carried in triumph
- Roman victory in Jewish War
- Confirms destruction and looting of temple

---

**Citations**:
- Murphy-O'Connor, Jerome. *The Holy Land: An Oxford Archaeological Guide*. 5th ed. Oxford: Oxford University Press, 2008.
- Charlesworth, James H. *Jesus and Archaeology*. Grand Rapids: Eerdmans, 2006.
- Reich, Ronny. "Caiaphas Name Inscribed on Bone Boxes." *Biblical Archaeology Review* 18.5 (1992): 38-44.
- Tzaferis, Vassilios. "Crucifixion: The Archaeological Evidence." *Biblical Archaeology Review* 11.1 (1985): 44-53.
          `,
        },
        {
          id: 'early-church',
          title: 'The Early Church',
          content: `
# The Early Church: Archaeological Evidence

## Spread of Christianity

The book of Acts and Paul's letters describe Christianity spreading rapidly through the Roman Empire in the 1st century.

## Key Cities of Early Christianity

### Jerusalem

**Early Community** (Acts 2-7):
- Centered in Jerusalem after Pentecost
- Met in temple courts and homes
- Archaeological evidence limited due to 70 CE destruction

**James Ossuary** (announced 2002, controversial):
- Limestone box with Aramaic inscription: "James, son of Joseph, brother of Jesus"
- If authentic, earliest physical evidence of Jesus
- **Controversy**: Authenticity debated, possible forgery charge
- Inscription's second part questioned
- Ongoing scholarly debate

### Antioch (Antakya, Turkey)

**Biblical Importance** (Acts 11:19-26; 13:1-3):
- First called "Christians" here
- Paul's missionary base
- Third largest city in Roman Empire

**Archaeological Evidence**:
- Ancient city largely under modern Antakya
- Roman mosaics, city walls
- Limited 1st century Christian remains
- Cave church tradition (possibly later)

### Ephesus (Turkey)

**Paul's Ministry** (Acts 19; 1 Corinthians):
- Paul spent 2-3 years in Ephesus
- Center of early Christian activity
- Also center of Artemis worship (Acts 19:23-41)

**Archaeological Evidence**:
- **Temple of Artemis**: One of Seven Wonders (foundations remain)
- **Theater**: Where riot occurred (Acts 19:29), seats 25,000
- **Library of Celsus**: Shows city's wealth and culture
- **Commercial Agora**: Paul possibly preached here
- **Terrace Houses**: Wealthy residences, context for Ephesian Christians
- Inscriptions mentioning Artemis cult
- No certain 1st century church, but early Christian presence attested

### Corinth (Greece)

**Paul's Ministry** (Acts 18; 1-2 Corinthians):
- Paul spent 18 months in Corinth
- Wrote letters to Corinthian church

**Archaeological Evidence**:
- **Bema (Judgment Seat)**: Platform where Paul was tried (Acts 18:12-17)
- **Gallio Inscription** (Delphi): Mentions proconsul Gallio, dates Paul's visit to ~50-51 CE
- **Erastus Inscription**: "Erastus, commissioner of public works, laid this pavement at his own expense"
  - Possibly the Erastus of Romans 16:23
  - Shows Christians in public office
- **Meat Market**: Context for 1 Corinthians 10:25
- **Temple of Apollo**: Backdrop for idol meat controversy (1 Corinthians 8-10)
- **Corinth Canal area**: Major port city, cosmopolitan culture

### Philippi (Greece)

**Paul's Ministry** (Acts 16; Philippians):
- First European city Paul visited
- Lydia's conversion, prison, earthquake (Acts 16)

**Archaeological Evidence**:
- **Roman city remains**: Forum, theater
- **Traditional prison**: Rock-cut chamber (uncertain authenticity)
- **Baptistry site**: Traditional location of Lydia's baptism
- **Via Egnatia**: Major Roman road through city
- Inscriptions showing Roman colony status

### Rome

**Paul's Destination** (Acts 28; Romans):
- Paul arrived as prisoner (c. 60 CE)
- House arrest, continued preaching
- Early Christian community already present (Romans 1:8)

**Archaeological Evidence**:
- **Catacombs**: Underground burial chambers with Christian symbols
  - Earliest: mid-2nd century, possibly some 1st century
  - Fish symbol (ichthys), cross, anchor
  - Inscriptions, frescoes
- **Mamertine Prison**: Traditional site of Paul's imprisonment (uncertain)
- **Roman Forum**: Paul possibly appeared before Nero here
- **House Churches**: No remains, but literary evidence (Romans 16:5; Philemon 2)

## Early Christian Symbols and Inscriptions

### Symbols (mostly 2nd century onward)

**Fish (Ichthys)**:
- Greek acronym: "Jesus Christ, God's Son, Savior"
- Found in catacombs, graffiti

**Chi-Rho (☧)**:
- First two letters of "Christ" in Greek
- Became prominent after Constantine

**Anchor**:
- Hope symbol (Hebrews 6:19)
- Disguised cross symbol

**Good Shepherd**:
- Jesus as shepherd (John 10:11)
- Common in catacomb art

### Inscriptions

**Nazareth Inscription** (Edict of Caesar):
- Marble tablet (possibly 1st century, debated)
- Decree against tomb robbery, death penalty
- **Controversial theory**: Response to resurrection claims
- More likely general anti-tomb-robbery decree
- Dating and provenance uncertain

## Manuscript Evidence

### New Testament Papyri

**P52 (John Rylands Papyrus)**:
- Fragment of John 18:31-33, 37-38
- Dated c. 125-150 CE
- Earliest known NT manuscript
- Shows early circulation of John's Gospel

**P46 (Chester Beatty Papyrus II)**:
- Paul's letters, c. 200 CE
- Shows early collection of Pauline epistles

**P66, P75**:
- Early Gospel manuscripts, c. 200 CE

### Dead Sea Scrolls (Qumran)

Not Christian, but crucial context:
- 1st century and earlier Jewish texts
- Biblical manuscripts
- Sectarian documents (Essenes?)
- Background for understanding NT Judaism

## Summary

While direct 1st century Christian archaeological remains are scarce (early Christians met in homes, left little physical trace), the broader archaeological context of NT cities, Roman-period inscriptions, and early manuscripts provide significant illumination of the NT world.

---

**Citations**:
- Finegan, Jack. *The Archaeology of the New Testament: The Life of Jesus and the Beginning of the Early Church*. Rev. ed. Princeton: Princeton University Press, 1992.
- McRay, John. *Archaeology and the New Testament*. Grand Rapids: Baker Academic, 1991.
- Murphy-O'Connor, Jerome. *Paul: His Story*. Oxford: Oxford University Press, 2004.
- Snyder, Graydon F. *Ante Pacem: Archaeological Evidence of Church Life Before Constantine*. Rev. ed. Macon: Mercer University Press, 2003.
          `,
        },
      ],
    },
  ];

  const handleLessonComplete = (moduleId, lessonId) => {
    const lessonKey = `${moduleId}_${lessonId}`;
    saveProgress(lessonKey);

    if (onComplete) {
      onComplete({
        type: 'lesson',
        moduleId,
        lessonId,
        lessonTitle: currentLesson.title
      });
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const getLessonProgress = (moduleId) => {
    const module = courseModules.find(m => m.id === moduleId);
    if (!module) return { completed: 0, total: 0 };

    const total = module.lessons.length;
    const completed = module.lessons.filter(lesson =>
      completedLessons[`${moduleId}_${lesson.id}`]
    ).length;

    return { completed, total };
  };

  if (currentLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Lesson Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-6 mb-6 shadow-2xl">
            <button
              onClick={() => {
                setCurrentLesson(null);
                setCurrentModule(null);
              }}
              className="flex items-center gap-2 text-white hover:text-amber-100 mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Modules
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">{currentLesson.title}</h1>
            <p className="text-amber-100">
              {courseModules.find(m => m.id === currentModule)?.title}
            </p>
          </div>

          {/* Lesson Content */}
          <div className="bg-slate-800/50 rounded-xl p-6 md:p-8 border border-slate-700 prose prose-invert prose-amber max-w-none">
            <div
              className="lesson-content"
              dangerouslySetInnerHTML={{
                __html: currentLesson.content
                  .split('\n')
                  .map((line, index, array) => {
                    // Check if we're in citations section
                    const prevLine = index > 0 ? array[index - 1] : '';
                    const inCitations = prevLine.includes('**Citation') || prevLine.includes('---');

                    if (line.startsWith('# ')) return `<h1 class="text-3xl font-bold text-amber-400 mb-4">${line.slice(2)}</h1>`;
                    if (line.startsWith('## ')) return `<h2 class="text-2xl font-bold text-amber-300 mt-6 mb-3">${line.slice(3)}</h2>`;
                    if (line.startsWith('### ')) return `<h3 class="text-xl font-bold text-slate-200 mt-4 mb-2">${line.slice(4)}</h3>`;
                    if (line.startsWith('**Citation')) return `<div class="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-lg p-4 mt-6 border border-emerald-500/30"><h4 class="text-lg font-bold text-emerald-300 mb-3 flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>${line.slice(2)}</h4><p class="text-sm text-emerald-200 italic mb-2">📚 Research these sources for deeper study. Links to scholarly databases may be accessed through university libraries.</p>`;
                    if (line.startsWith('- ') && inCitations) return `<div class="bg-slate-700/30 rounded p-2 mb-2 text-sm text-slate-200 hover:bg-slate-700/50 transition-colors cursor-pointer"><span class="text-emerald-400 mr-2">📖</span>${line.slice(2)}</div>`;
                    if (line.startsWith('- ')) return `<li class="text-slate-300 ml-4">${line.slice(2)}</li>`;
                    if (line.startsWith('---')) return '<hr class="my-6 border-slate-600" />';
                    if (line.trim() === '' && inCitations) return '</div><br />';
                    if (line.trim() === '') return '<br />';
                    return `<p class="text-slate-300 mb-3 leading-relaxed">${line}</p>`;
                  })
                  .join('')
              }}
            />
          </div>

          {/* Complete Lesson Button */}
          <div className="mt-6">
            <button
              onClick={() => handleLessonComplete(currentModule, currentLesson.id)}
              disabled={completedLessons[`${currentModule}_${currentLesson.id}`]}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                completedLessons[`${currentModule}_${currentLesson.id}`]
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
              }`}
            >
              {completedLessons[`${currentModule}_${currentLesson.id}`] ? (
                <>✓ Lesson Completed</>
              ) : (
                <>Complete Lesson</>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Course Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-8 mb-8 shadow-2xl">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-white hover:text-amber-100 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Academy
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 rounded-lg p-3">
              <MapPin size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Biblical Archaeology</h1>
          </div>
          <p className="text-amber-100 text-lg">
            Comprehensive course on biblical antiquity with archaeological evidence and scholarly citations
          </p>
        </div>

        {/* Course Modules */}
        <div className="space-y-4">
          {courseModules.map((module) => {
            const progress = getLessonProgress(module.id);
            const isExpanded = expandedModules[module.id];

            return (
              <div key={module.id} className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{module.icon}</div>
                    <div className="text-left">
                      <h2 className="text-2xl font-bold text-amber-400">{module.title}</h2>
                      <p className="text-slate-400 text-sm mt-1">{module.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="text-sm text-emerald-400">
                          {progress.completed} / {progress.total} lessons completed
                        </div>
                      </div>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </button>

                {/* Module Lessons */}
                {isExpanded && (
                  <div className="border-t border-slate-700 p-4 space-y-2">
                    {module.lessons.map((lesson) => {
                      const lessonKey = `${module.id}_${lesson.id}`;
                      const isCompleted = completedLessons[lessonKey];

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            setCurrentModule(module.id);
                            setCurrentLesson(lesson);
                          }}
                          className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {isCompleted ? (
                              <Award size={20} className="text-emerald-400" />
                            ) : (
                              <BookOpen size={20} className="text-slate-400" />
                            )}
                            <span className={`font-semibold ${isCompleted ? 'text-emerald-400' : 'text-slate-200'}`}>
                              {lesson.title}
                            </span>
                          </div>
                          <ChevronRight size={20} className="text-slate-400" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Course Progress */}
        <div className="mt-8 bg-gradient-to-br from-emerald-900/50 to-teal-900/50 rounded-xl p-6 border-2 border-emerald-500/50">
          <h3 className="text-2xl font-bold text-emerald-300 mb-4">Your Progress</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold text-emerald-400">
                {Object.keys(completedLessons).length} / {courseModules.reduce((sum, m) => sum + m.lessons.length, 0)}
              </div>
              <div className="text-emerald-200 mt-1">Lessons Completed</div>
            </div>
            <Scroll size={48} className="text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiblicalArchaeologyCourse;
