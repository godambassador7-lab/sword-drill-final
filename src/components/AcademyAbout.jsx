import React, { useState } from 'react';
import { GraduationCap, Award, Scroll, BookOpen, Trophy, Coins, Shield, CheckCircle, Star, MapPin, ChevronRight, ArrowLeft, X, ChevronDown, ChevronUp } from 'lucide-react';

const AcademyAbout = ({ onBack }) => {
  const [catalogView, setCatalogView] = useState('main'); // 'main', 'associate', 'diploma'
  const [expandedCourse, setExpandedCourse] = useState(null);

  const toggleCourse = (key) => setExpandedCourse(prev => prev === key ? null : key);

  const associateCourseCategories = [
    {
      title: 'Biblical Languages - Required (Choose ONE)',
      icon: BookOpen,
      color: 'from-indigo-600 to-purple-600',
      courses: [
        {
          courseNumber: 'GREK 101', name: 'Biblical Greek I', credits: '3',
          description: 'Introduction to Biblical Greek (Choose Greek I OR Hebrew I)',
          summary: 'A foundational course in Koine Greek covering the alphabet, pronunciation, basic vocabulary, and essential grammar. Students will read and parse New Testament passages, developing the tools needed to engage the original Greek text in exegesis and personal study.'
        },
        {
          courseNumber: 'HEBR 101', name: 'Biblical Hebrew I', credits: '3',
          description: 'Introduction to Ancient Hebrew (Choose Greek I OR Hebrew I)',
          summary: 'An introduction to Biblical Hebrew covering the aleph-bet, vowel pointing, basic morphology, and foundational vocabulary. Students will practice reading from the Hebrew Bible (Torah and Psalms) and gain the ability to trace word meanings to their roots.'
        }
      ]
    },
    {
      title: 'Biblical Languages - Electives',
      icon: BookOpen,
      color: 'from-violet-600 to-fuchsia-600',
      courses: [
        {
          courseNumber: 'GREK 102', name: 'Biblical Greek II', level: 'Elective',
          description: 'Advanced Greek studies (optional continuation)',
          summary: 'Builds on Greek I with advanced grammar: aorist systems, participles, infinitives, and subjunctive mood. Students will work through extended NT passages and develop the ability to produce basic grammatical analysis for sermon and teaching preparation.'
        },
        {
          courseNumber: 'GREK 201', name: 'Biblical Greek III', level: 'Elective',
          description: 'Guided Reading & Exegesis',
          summary: 'Advanced guided reading in the Greek New Testament with focus on exegetical method. Students read selected epistles and Gospel texts, apply syntactical analysis, and produce a short exegetical paper integrating Greek grammar with theological interpretation.'
        },
        {
          courseNumber: 'HEBR 102', name: 'Biblical Hebrew II', level: 'Elective',
          description: 'Advanced Hebrew studies (optional continuation)',
          summary: 'Advances into weak verbs, derived stems (niphal, piel, hiphil), and poetic texts. Students will work through Psalms and prophetic passages, learning to identify verb stems and trace their theological significance for interpretation.'
        },
        {
          courseNumber: 'HEBR 201', name: 'Biblical Hebrew III', level: 'Elective',
          description: 'Guided Reading & Syntax',
          summary: 'Advanced Hebrew reading in prose and poetry with attention to Hebrew syntax, discourse analysis, and comparative Semitic linguistics. Students produce guided translation notes for an OT passage of their choosing with syntactical commentary.'
        },
        {
          name: 'Paleo Hebrew', level: 'Elective',
          description: 'Study the ancient script form of Hebrew',
          summary: 'Explores the ancient Phoenician-derived script used in early Israelite inscriptions and found in some Dead Sea Scrolls. Students will read the Siloam Inscription, Gezer Calendar, and other ancient texts, placing them in their historical and archaeological context.'
        },
        {
          name: 'Aramaic', level: 'Elective',
          description: 'Explore the language Jesus spoke',
          summary: 'An introduction to Biblical Aramaic, the language of portions of Daniel and Ezra and the everyday vernacular of 1st-century Judea. Students will read the Aramaic sections of Daniel, examine Targum traditions, and explore Aramaic loan-words in the Greek New Testament.'
        },
        {
          name: 'Amharic', level: 'Elective',
          description: 'Learn the modern Ethiopian language',
          summary: 'An introduction to Amharic, the Semitic language of Ethiopia and liturgical language of the Ethiopian Orthodox Church. Students will learn the Ge\'ez script (fidel), basic vocabulary, and read portions of the Amharic New Testament, exploring the deep biblical heritage of Ethiopian Christianity.'
        }
      ]
    },
    {
      title: 'Core Interpretation & Method (Required)',
      icon: Scroll,
      color: 'from-purple-600 to-indigo-600',
      courses: [
        {
          courseNumber: 'BIB 101', name: 'Biblical Hermeneutics', credits: '3',
          description: 'Principles of biblical interpretation',
          summary: 'A rigorous study of the principles governing biblical interpretation, including grammatical-historical method, genre recognition, literary context, canonical reading, and application theory. Students will apply hermeneutical principles to Old and New Testament texts through structured exercises.'
        },
        {
          courseNumber: 'BIB 102', name: 'Exegetical Methods', credits: '3',
          description: 'Methods of biblical exegesis',
          summary: 'Practical training in the exegetical process from original-language observation to theological synthesis. Topics include textual criticism basics, structural analysis, word studies, literary forms, and the production of a full exegetical outline for a selected biblical pericope.'
        },
        {
          courseNumber: 'BIB 299', name: 'Capstone Seminar', credits: '3',
          description: 'Integrative research paper & final project',
          summary: 'The culminating academic experience of the Associate program. Students produce a 2,500-word integrative research paper on a biblical-theological topic of their choosing, synthesizing skills from across the curriculum: hermeneutics, exegesis, original languages, and theological application.'
        }
      ]
    },
    {
      title: 'Biblical Surveys (Required)',
      icon: BookOpen,
      color: 'from-blue-600 to-cyan-600',
      courses: [
        {
          courseNumber: 'BIB 110', name: 'Old Testament Survey', credits: '3',
          description: 'Overview of OT books and themes',
          summary: 'A comprehensive survey of the Hebrew Bible from Genesis to Malachi. Students will trace major themes (covenant, creation, redemption, kingship, prophecy), understand the literary genres of the OT, and develop a canonical framework for interpreting Old Testament texts in light of the New.'
        },
        {
          courseNumber: 'BIB 120', name: 'New Testament Survey', credits: '3',
          description: 'Overview of NT books and themes',
          summary: 'An overview of all 27 books of the New Testament with attention to authorship, historical background, theological themes, and canonical placement. Special emphasis on the Gospels\' portrait of Jesus, Paul\'s letter-writing theology, and the apocalyptic vision of Revelation.'
        }
      ]
    },
    {
      title: 'Historical & Contextual Studies',
      icon: MapPin,
      color: 'from-amber-600 to-yellow-600',
      courses: [
        {
          courseNumber: 'BIB 210', name: 'Second Temple Judaism', credits: '3',
          description: 'Judaism from Babylonian exile to AD 70',
          summary: 'Studies the Jewish world between the testaments and into the 1st century — the period that forms the immediate context of the New Testament. Topics include the Maccabean revolt, Pharisees and Sadducees, the Dead Sea Scrolls, Jewish apocalypticism, and the synagogue system Jesus and Paul inhabited.'
        },
        {
          courseNumber: 'BIB 220', name: 'Biblical Archaeology', credits: '3',
          description: 'Archaeological evidence and biblical history',
          summary: 'Examines major archaeological discoveries that illuminate the biblical world: the Dead Sea Scrolls, Tel Dan Inscription, Hezekiah\'s Tunnel, Lachish Letters, and more. Students evaluate how archaeology confirms, clarifies, and occasionally challenges biblical texts, developing a nuanced approach to faith and evidence.'
        },
        {
          courseNumber: 'BIB 230', name: 'Textual Transmission & Manuscripts', credits: '3',
          description: 'Study of biblical manuscripts and transmission',
          summary: 'Traces the journey of the biblical text from original autographs to modern translations: scribal practices, manuscript families, the Septuagint, Masoretic Text, Dead Sea Scrolls, Greek NT manuscript traditions, and the principles of textual criticism used to establish the biblical text.'
        },
        {
          courseNumber: 'BIB 215', name: 'Biblical Feast Days', level: 'Elective',
          description: 'Sacred times and appointed feasts in Scripture',
          summary: 'A study of the seven appointed feasts of Leviticus 23 (Passover, Unleavened Bread, Firstfruits, Pentecost, Trumpets, Day of Atonement, Tabernacles) in their Old Testament context, their historical observance in Israel, and their typological fulfilment in Christ and the church.'
        }
      ]
    },
    {
      title: 'Law, Theology, & Ethics',
      icon: Scroll,
      color: 'from-red-600 to-orange-600',
      courses: [
        {
          courseNumber: 'BIB 240', name: 'Mosaic Law', credits: '3',
          description: 'Torah: covenant, commandments, and theology',
          summary: 'A theological and exegetical study of the Mosaic Law in its ancient Near Eastern context, covenant structure, and redemptive-historical function. Topics include the three categories of law (moral, civil, ceremonial), the Ten Commandments, the law\'s role in Israel\'s life, and its relationship to New Testament believers.'
        },
        {
          courseNumber: 'BIB 250', name: 'Christology', credits: '3',
          description: 'Doctrine of Christ and His nature',
          summary: 'A comprehensive study of the person and work of Jesus Christ from Old Testament anticipation through New Testament fulfilment. Topics include the incarnation, divine and human natures (hypostatic union), titles of Christ, atonement theories, resurrection, and ascension — all grounded in biblical exegesis.'
        },
        {
          courseNumber: 'BIB 260', name: 'Pneumatology', credits: '3',
          description: 'Doctrine of the Holy Spirit',
          summary: 'A biblical study of the Holy Spirit\'s person, attributes, and ministry. Students explore the Spirit\'s work in the Old Testament, the Pentecost event, spiritual gifts, the fruit of the Spirit, the Spirit\'s role in regeneration and sanctification, and key theological debates about continuationism and cessationism.'
        },
        {
          courseNumber: 'BIB 270', name: 'Demonology', credits: '3',
          description: 'NT demonology with Greek analysis and exegesis',
          summary: 'A rigorous exegetical study of demonic activity in the New Testament with Greek textual analysis. Topics include the origin of evil, Satan\'s nature and strategies, the demonic, exorcism accounts in the Gospels and Acts, spiritual warfare theology (Ephesians 6), and the ultimate defeat of evil at the cross and consummation.'
        },
        {
          courseNumber: 'BIB 280', name: 'Biblical Ethics', credits: '3',
          description: 'Moral principles and Christian living',
          summary: 'Explores the foundations of Christian moral reasoning grounded in Scripture, covenant, and the character of God. Topics include the relationship between law and gospel, virtue ethics in the NT, sexual ethics, social justice, bioethics, and the application of biblical principles to contemporary moral dilemmas.'
        },
        {
          courseNumber: 'PHIL 290', name: 'Biblical Philosophy', credits: '3',
          description: 'Faith, reason, metaphysics, and ethics',
          summary: 'Examines fundamental philosophical questions through a biblical-theological lens: the existence of God, the nature of reality, epistemology (how we know what we know), human nature and free will, and the relationship between faith and reason. Students engage classical and contemporary philosophical arguments in dialogue with Scripture.'
        },
        {
          courseNumber: 'PHIL 291', name: 'Christian Argumentation & Logic', credits: '3',
          description: 'Logic, fallacies, and apologetics application',
          summary: 'Trains students in the principles of valid reasoning: deductive and inductive logic, recognizing and responding to logical fallacies, the rhetorical forms used in Scripture, and the construction of well-formed arguments for Christian truth claims. Special focus on apologetics application: the cosmological, teleological, and moral arguments, and historical case for the resurrection.'
        },
        {
          courseNumber: 'THEO 290', name: 'Biblical Eschatology', credits: '3',
          description: 'Last things: kingdom, resurrection, and new creation',
          summary: 'A comprehensive study of biblical teaching on last things: the kingdom of God (already/not yet), death and the intermediate state, the Second Coming of Christ, bodily resurrection, final judgment, the millennium (surveying premillennial, amillennial, and postmillennial views), and the eternal state of new heavens and new earth. Includes interpretation of Daniel and Revelation.'
        }
      ]
    },
  ];

  const diplomaCourseCategories = [
    {
      title: 'Biblical Studies - Diploma Level',
      icon: Scroll,
      color: 'from-amber-600 to-orange-600',
      courses: [
        {
          name: 'Hermeneutics', level: 'Intermediate to Advanced',
          description: 'Master the principles of biblical interpretation',
          summary: 'An advanced treatment of hermeneutical theory, moving beyond foundational principles into hermeneutical philosophy, reader-response theory, canonical approaches, and the relationship between exegesis and systematic theology. Students produce a full-length interpretive essay.'
        },
        {
          name: 'Textual Criticism', level: 'Advanced',
          description: 'Study manuscript evidence and textual variants',
          summary: 'Advanced study of the textual tradition of the Old and New Testaments. Students evaluate major manuscript families, learn the principles of lower criticism, examine significant textual variants and their doctrinal implications, and engage primary manuscript evidence including Codex Sinaiticus and the Dead Sea Scrolls.'
        },
        {
          name: 'Biblical Canon', level: 'Intermediate',
          description: 'Understand how the Bible was formed and preserved',
          summary: 'Examines the historical process by which the biblical canon was recognized — including criteria for inclusion, the role of the early church councils, the deuterocanonical/apocryphal books debate, and the canonical traditions of Protestant, Catholic, and Eastern Orthodox Christianity.'
        },
        {
          name: 'Apologetics', level: 'Intermediate',
          description: 'Learn to defend the Christian faith',
          summary: 'A survey of classical, evidential, and presuppositional apologetics methodologies. Students engage the major objections to Christianity (problem of evil, religious pluralism, science vs. faith), study the historical case for the resurrection, and develop practical skills for gracious intellectual engagement with skeptics and seekers.'
        },
        {
          name: 'Biblical Archaeology', level: 'Intermediate to Advanced',
          description: 'Explore archaeological evidence for biblical events and locations',
          summary: 'Advanced study of the archaeology of Israel and the ancient Near East at the diploma level, with focus on major excavations, the relationship between archaeology and biblical history, methodological debates, and the use of inscriptional evidence (Mesha Stele, Tel Dan, Lachish Letters, Siloam Inscription) for Old Testament historical reconstruction.'
        },
        {
          name: 'World Religions', level: 'Upper-Level',
          description: 'Origins, claims, and biblical evaluation of major religions',
          summary: 'An upper-level comparative study of the world\'s major religions (Judaism, Islam, Hinduism, Buddhism, and new religious movements) examining their origins, sacred texts, core doctrines, and truth claims. Students develop a biblically grounded, respectful, and intellectually rigorous approach to interfaith dialogue and evangelism.'
        }
      ]
    },
    {
      title: 'Historical Studies',
      icon: Trophy,
      color: 'from-emerald-600 to-teal-600',
      courses: [
        {
          name: 'Church History', level: 'Intermediate',
          description: 'Trace the development of Christianity through the ages',
          summary: 'A survey of Christian history from Pentecost to the present: the early church and persecution, the ecumenical councils, the medieval church, the Protestant Reformation (Luther, Calvin, Zwingli), the Great Awakenings, and the global expansion of Christianity. Students trace how historical forces have shaped doctrine and practice.'
        },
        {
          name: 'Kings of Israel', level: 'Beginner to Intermediate',
          description: 'Study the monarchs of ancient Israel and Judah',
          summary: 'An exegetical and historical study of the monarchy period in Israel and Judah from Saul through the Exile. Students study key reigns (David, Solomon, Hezekiah, Josiah), the Deuteronomistic evaluation of kings, the role of prophets in confronting royal power, and the theological lessons of Israel\'s rise and fall.'
        }
      ]
    }
  ];

  const learningOutcomes = [
    {
      icon: BookOpen,
      title: 'Deep Biblical Knowledge',
      description: 'Gain comprehensive understanding of Scripture in its original languages and historical context'
    },
    {
      icon: Shield,
      title: 'Theological Foundation',
      description: 'Build a solid foundation in biblical interpretation, doctrine, and apologetics'
    },
    {
      icon: Star,
      title: 'Academic Excellence',
      description: 'Achieve seminary-level knowledge through structured, progressive learning'
    },
    {
      icon: Award,
      title: 'Recognized Achievement',
      description: 'Earn a virtual Certificate of Completion in Biblical Studies upon graduation'
    }
  ];

  const associateRequirements = [
    'Complete Greek I OR Hebrew I (choose one - required)',
    'Complete all 12 Associate-level biblical studies core courses',
    'Complete the Associate Capstone research paper with passing grade (70%+)',
    'Maintain focus integrity throughout your studies',
    'Pass all course assessments'
  ];

  const diplomaRequirements = [
    'Must have completed Associate Level program first',
    'Complete all 5 Diploma-level biblical studies courses',
    'Complete both historical studies courses',
    'Complete the Diploma Capstone research paper with passing grade (75%+)',
    'Maintain focus integrity throughout your studies',
    'Pass all advanced course assessments and exams'
  ];

  const crestLogo = `${process.env.PUBLIC_URL || ''}/imageedit_1_3946066529.png`;

  // Reusable course card with click-to-expand summary
  const CourseCard = ({ course, categoryIndex, courseIndex }) => {
    const key = `${categoryIndex}-${courseIndex}`;
    const isExpanded = expandedCourse === key;
    return (
      <div className="bg-slate-700/50 rounded-lg border border-slate-600 overflow-hidden">
        <button
          onClick={() => toggleCourse(key)}
          className="w-full text-left p-4 hover:bg-slate-600/40 transition-all"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              {course.courseNumber && (
                <div className="text-xs font-mono text-amber-400 mb-1">{course.courseNumber}</div>
              )}
              <h4 className="font-bold text-slate-200">{course.name}</h4>
              <p className="text-sm text-slate-400 mt-1">{course.description}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              {course.credits && (
                <span className="text-xs bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded whitespace-nowrap">
                  {course.credits} credits
                </span>
              )}
              {course.level && !course.credits && (
                <span className="text-xs bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded">
                  {course.level}
                </span>
              )}
              {isExpanded
                ? <ChevronUp size={16} className="text-slate-400 mt-1" />
                : <ChevronDown size={16} className="text-slate-400 mt-1" />
              }
            </div>
          </div>
        </button>
        {isExpanded && course.summary && (
          <div className="px-4 pb-4 border-t border-slate-600/50 pt-3">
            <p className="text-sm text-slate-300 leading-relaxed">{course.summary}</p>
          </div>
        )}
      </div>
    );
  };

  // Show Associate Level Catalog
  if (catalogView === 'associate') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900 text-slate-200 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 mb-8 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCatalogView('main')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-white"
              >
                <ArrowLeft size={20} />
                Back
              </button>
              <div className="bg-indigo-900/50 rounded-full p-3">
                <GraduationCap size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white text-center mb-2">Associate Level Courses</h1>
            <p className="text-center text-indigo-100 text-lg">
              Foundational Biblical Studies • Original Languages • Core Theology
            </p>
            <div className="mt-4 text-center">
              <span className="inline-block px-4 py-2 bg-emerald-600/30 border border-emerald-400/50 rounded-lg text-emerald-300 font-semibold">
                Total: 45 Credits
              </span>
            </div>
            <p className="text-center text-indigo-200 text-sm mt-3">Tap any course to read its full description</p>
          </div>

          {/* Course Categories */}
          <div className="space-y-6 mb-8">
            {associateCourseCategories.map((category, index) => (
              <div key={index} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${category.color} rounded-lg px-4 py-2 mb-4`}>
                  <category.icon size={24} className="text-white" />
                  <h3 className="text-xl font-bold text-white">{category.title}</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {category.courses.map((course, courseIndex) => (
                    <CourseCard key={courseIndex} course={course} categoryIndex={index} courseIndex={courseIndex} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Associate Requirements */}
          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl p-6 md:p-8 border-2 border-indigo-500/50 mb-8">
            <h2 className="text-3xl font-bold text-indigo-300 mb-6 flex items-center gap-3">
              <Award size={32} />
              Graduation Requirements
            </h2>
            <div className="space-y-3">
              {associateRequirements.map((requirement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-200">{requirement}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show Diploma Level Catalog
  if (catalogView === 'diploma') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 text-slate-200 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-8 mb-8 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCatalogView('main')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-white"
              >
                <ArrowLeft size={20} />
                Back
              </button>
              <div className="bg-amber-900/50 rounded-full p-3">
                <Award size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white text-center mb-2">Diploma Level Courses</h1>
            <p className="text-center text-amber-100 text-lg">
              Advanced Theological Studies • Historical Analysis • Research Excellence
            </p>
            <div className="mt-4 text-center">
              <span className="inline-block px-4 py-2 bg-amber-600/30 border border-amber-400/50 rounded-lg text-amber-300 font-semibold">
                Prerequisite: Complete Associate Level First
              </span>
            </div>
            <p className="text-center text-amber-200 text-sm mt-3">Tap any course to read its full description</p>
          </div>

          {/* Course Categories */}
          <div className="space-y-6 mb-8">
            {diplomaCourseCategories.map((category, index) => (
              <div key={index} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${category.color} rounded-lg px-4 py-2 mb-4`}>
                  <category.icon size={24} className="text-white" />
                  <h3 className="text-xl font-bold text-white">{category.title}</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {category.courses.map((course, courseIndex) => (
                    <CourseCard
                      key={courseIndex}
                      course={course}
                      categoryIndex={index + 100}
                      courseIndex={courseIndex}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Diploma Requirements */}
          <div className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 rounded-xl p-6 md:p-8 border-2 border-amber-500/50 mb-8">
            <h2 className="text-3xl font-bold text-amber-300 mb-6 flex items-center gap-3">
              <Award size={32} />
              Graduation Requirements
            </h2>
            <div className="space-y-3">
              {diplomaRequirements.map((requirement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-200">{requirement}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-center mb-4">
            <img
              src={crestLogo}
              alt="Sword Drill Academy crest"
              className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-lg"
            />
          </div>
          <p className="text-center text-amber-100 text-lg max-w-3xl mx-auto">
            A comprehensive Biblical studies program designed to equip you with deep knowledge of Scripture,
            original languages, theology, and church history
          </p>
        </div>

        {/* What You'll Learn */}
        <div className="bg-slate-800/50 rounded-xl p-6 md:p-8 mb-8 border border-slate-700">
          <h2 className="text-3xl font-bold text-amber-400 mb-6 flex items-center gap-3">
            <Star size={32} />
            What You'll Learn
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {learningOutcomes.map((outcome, index) => (
              <div key={index} className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg p-3">
                    <outcome.icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-200 mb-2">{outcome.title}</h3>
                    <p className="text-slate-400 text-sm">{outcome.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Catalog Navigation */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-amber-400 mb-6 flex items-center gap-3">
            <BookOpen size={32} />
            Course Catalog
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Associate Level Button */}
            <button
              onClick={() => setCatalogView('associate')}
              className="group bg-gradient-to-br from-indigo-900/50 to-purple-900/50 hover:from-indigo-900/70 hover:to-purple-900/70 rounded-xl p-8 border-2 border-indigo-500/50 hover:border-indigo-400 transition-all shadow-xl"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full p-6">
                  <GraduationCap size={48} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-indigo-300 mb-2">Associate Level</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Foundational biblical studies, original languages, and theology
                  </p>
                  <div className="inline-flex items-center gap-2 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    <span className="font-semibold">View Courses</span>
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </button>

            {/* Diploma Level Button */}
            <button
              onClick={() => setCatalogView('diploma')}
              className="group bg-gradient-to-br from-amber-900/50 to-orange-900/50 hover:from-amber-900/70 hover:to-orange-900/70 rounded-xl p-8 border-2 border-amber-500/50 hover:border-amber-400 transition-all shadow-xl"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-full p-6">
                  <Award size={48} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-amber-300 mb-2">Diploma Level</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Advanced theological studies and historical analysis
                  </p>
                  <div className="inline-flex items-center gap-2 text-amber-400 group-hover:text-amber-300 transition-colors">
                    <span className="font-semibold">View Courses</span>
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Graduation Requirements */}
        <div className="space-y-6 mb-8">
          {/* Associate Level Requirements */}
          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl p-6 md:p-8 border-2 border-indigo-500/50">
            <h2 className="text-3xl font-bold text-indigo-300 mb-6 flex items-center gap-3">
              <Award size={32} />
              Associate Level Graduation Requirements
            </h2>
            <div className="space-y-3">
              {associateRequirements.map((requirement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-200">{requirement}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Diploma Level Requirements */}
          <div className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 rounded-xl p-6 md:p-8 border-2 border-amber-500/50">
            <h2 className="text-3xl font-bold text-amber-300 mb-6 flex items-center gap-3">
              <Award size={32} />
              Diploma Level Graduation Requirements
            </h2>
            <div className="space-y-3">
              {diplomaRequirements.map((requirement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-200">{requirement}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Graduation Rewards */}
        <div className="bg-gradient-to-br from-amber-900/50 to-yellow-900/50 rounded-xl p-6 md:p-8 mb-8 border-2 border-amber-500/50 shadow-xl">
          <h2 className="text-3xl font-bold text-amber-300 mb-6 flex items-center gap-3">
            <Trophy size={32} className="text-amber-400" />
            Graduation Rewards
          </h2>

          <div className="space-y-6">
            {/* Certificate */}
            <div className="bg-slate-800/50 rounded-lg p-4 md:p-6 border-2 border-amber-500/30">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg p-3 md:p-4 mx-auto md:mx-0">
                  <Scroll size={28} className="text-white md:w-8 md:h-8" />
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-xl md:text-2xl font-bold text-amber-400 mb-2">
                    Certificate of Completion
                  </h3>
                  <p className="text-slate-300 mb-3 text-sm md:text-base">
                    Receive a beautifully designed virtual certificate recognizing your achievement in completing
                    the Sword Drill Academy Biblical Studies program. This certificate demonstrates your commitment
                    to excellence in biblical scholarship and theological education.
                  </p>
                  <div className="bg-amber-600/20 border border-amber-500/30 rounded-lg p-3 inline-block">
                    <p className="text-amber-300 text-xs md:text-sm font-semibold">
                      🎓 Certificate in Biblical Studies
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Points Reward */}
            <div className="bg-slate-800/50 rounded-lg p-4 md:p-6 border-2 border-emerald-500/30">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg p-3 md:p-4 mx-auto md:mx-0">
                  <Coins size={28} className="text-white md:w-8 md:h-8" />
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-xl md:text-2xl font-bold text-emerald-400 mb-2">
                    Graduation Gift: 5,000 Points
                  </h3>
                  <p className="text-slate-300 mb-3 text-sm md:text-base">
                    Celebrate your graduation with a special one-time bonus of 5,000 points! Use these points
                    to unlock advanced features, purchase power-ups, or invest in your continued learning journey.
                  </p>
                  <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-lg p-3 md:p-4 inline-block">
                    <p className="text-emerald-300 text-2xl md:text-3xl font-bold">
                      +5,000 💰
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Elite Status */}
            <div className="bg-slate-800/50 rounded-lg p-4 md:p-6 border-2 border-blue-500/30">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg p-3 md:p-4 mx-auto md:mx-0">
                  <GraduationCap size={28} className="text-white md:w-8 md:h-8" />
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-xl md:text-2xl font-bold text-blue-400 mb-2">
                    Academy Graduate Status
                  </h3>
                  <p className="text-slate-300 text-sm md:text-base">
                    Join the elite ranks of Sword Drill Academy graduates. Your profile will display a special
                    graduation badge, and you'll unlock exclusive content and advanced study materials available
                    only to academy graduates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center shadow-2xl mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Enroll in your first course today and take the first step toward mastering biblical languages,
            theology, and history. Your academic adventure awaits!
          </p>
          <button
            onClick={onBack}
            className="bg-white text-blue-600 font-bold px-8 py-4 rounded-lg hover:bg-blue-50 transition-all shadow-lg text-lg"
          >
            View Available Courses
          </button>
        </div>

        {/* Licenses & Credits */}
        <div className="bg-slate-800/50 rounded-xl p-6 md:p-8 mb-8 border border-slate-700">
          <h2 className="text-3xl font-bold text-emerald-300 mb-4 flex items-center gap-3">
            <Scroll size={28} />
            Licenses & Credits
          </h2>
          <div className="text-slate-300 text-sm leading-relaxed space-y-2">
            <p className="text-emerald-200 font-semibold">
              Amharic New Testament (Revised Amharic Bible in XML, 2003)
            </p>
            <p>Copyright (c) 2003 Bible Society of Ethiopia. All rights reserved.</p>
            <p>Non-commercial use only.</p>
            <p>Any non-commercial work MUST fully include this copyright statement in any and all copies.</p>
            <p>Used with kind permission of the Bible Society of Ethiopia (author of the revised amharic Bible).</p>
            <p>(c) 2026 New Christian Bible Study Corporation. All rights reserved. Printed from newchristianbiblestudy.org.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-400 text-sm mb-4">
          <p>Sword Drill Academy • Biblical Excellence Through Focused Study</p>
        </div>

      </div>
    </div>
  );
};

export default AcademyAbout;
