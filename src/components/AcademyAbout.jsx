import React, { useState } from 'react';
import { GraduationCap, Award, Scroll, BookOpen, Trophy, Coins, Shield, CheckCircle, Star, Lock, MapPin } from 'lucide-react';
import AdminLogin from './AdminLogin';
import AdminGrading from './AdminGrading';

const AcademyAbout = ({ onBack }) => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const courseCategories = [
    {
      title: 'Biblical Languages - Required (Choose ONE)',
      icon: BookOpen,
      color: 'from-indigo-600 to-purple-600',
      courses: [
        { courseNumber: 'GREK 101', name: 'Biblical Greek I', credits: '3', description: 'Introduction to Biblical Greek (Choose Greek I OR Hebrew I)' },
        { courseNumber: 'HEBR 101', name: 'Biblical Hebrew I', credits: '3', description: 'Introduction to Ancient Hebrew (Choose Greek I OR Hebrew I)' }
      ]
    },
    {
      title: 'Biblical Languages - Electives',
      icon: BookOpen,
      color: 'from-purple-600 to-pink-600',
      courses: [
        { courseNumber: 'GREK 102', name: 'Biblical Greek II', level: 'Elective', description: 'Advanced Greek studies (optional continuation)' },
        { courseNumber: 'GREK 201', name: 'Biblical Greek III', level: 'Elective', description: 'Guided Reading & Exegesis' },
        { courseNumber: 'HEBR 102', name: 'Biblical Hebrew II', level: 'Elective', description: 'Advanced Hebrew studies (optional continuation)' },
        { courseNumber: 'HEBR 201', name: 'Biblical Hebrew III', level: 'Elective', description: 'Guided Reading & Syntax' },
        { name: 'Paleo Hebrew', level: 'Elective', description: 'Study the ancient script form of Hebrew' },
        { name: 'Aramaic', level: 'Elective', description: 'Explore the language Jesus spoke' },
        { name: 'Ge\'ez', level: 'Elective', description: 'Study the ancient Ethiopian liturgical language' },
        { name: 'Amharic', level: 'Elective', description: 'Learn the modern Ethiopian language' }
      ]
    },
    {
      title: 'Core Interpretation & Method (Required)',
      icon: Scroll,
      color: 'from-purple-600 to-indigo-600',
      courses: [
        { courseNumber: 'BIB 101', name: 'Biblical Hermeneutics', credits: '3', description: 'Principles of biblical interpretation' },
        { courseNumber: 'BIB 102', name: 'Exegetical Methods', credits: '3', description: 'Methods of biblical exegesis' },
        { courseNumber: 'BIB 299', name: 'Capstone Seminar', credits: '3', description: 'Integrative research paper & final project' }
      ]
    },
    {
      title: 'Biblical Surveys (Required)',
      icon: BookOpen,
      color: 'from-blue-600 to-cyan-600',
      courses: [
        { courseNumber: 'BIB 110', name: 'Old Testament Survey', credits: '3', description: 'Overview of OT books and themes' },
        { courseNumber: 'BIB 120', name: 'New Testament Survey', credits: '3', description: 'Overview of NT books and themes' }
      ]
    },
    {
      title: 'Historical & Contextual Studies',
      icon: MapPin,
      color: 'from-amber-600 to-yellow-600',
      courses: [
        { courseNumber: 'BIB 210', name: 'Second Temple Judaism', credits: '3', description: 'Judaism from Babylonian exile to AD 70' },
        { courseNumber: 'BIB 220', name: 'Biblical Archaeology', credits: '3', description: 'Archaeological evidence and biblical history' },
        { courseNumber: 'BIB 230', name: 'Textual Transmission & Manuscripts', credits: '3', description: 'Study of biblical manuscripts and transmission' }
      ]
    },
    {
      title: 'Law, Theology, & Ethics',
      icon: Scroll,
      color: 'from-rose-600 to-pink-600',
      courses: [
        { courseNumber: 'BIB 240', name: 'Mosaic Law', credits: '3', description: 'Torah: covenant, commandments, and theology' },
        { courseNumber: 'BIB 250', name: 'Christology', credits: '3', description: 'Doctrine of Christ and His nature' },
        { courseNumber: 'BIB 260', name: 'Pneumatology', credits: '3', description: 'Doctrine of the Holy Spirit' },
        { courseNumber: 'BIB 270', name: 'Demonology', credits: '3', description: 'NT demonology with Greek analysis and exegesis' },
        { courseNumber: 'BIB 280', name: 'Biblical Ethics', credits: '3', description: 'Moral principles and Christian living' }
      ]
    },
    {
      title: 'Biblical Studies - Diploma Level',
      icon: Scroll,
      color: 'from-amber-600 to-orange-600',
      courses: [
        { name: 'Hermeneutics', level: 'Intermediate to Advanced', description: 'Master the principles of biblical interpretation' },
        { name: 'Textual Criticism', level: 'Advanced', description: 'Study manuscript evidence and textual variants' },
        { name: 'Biblical Canon', level: 'Intermediate', description: 'Understand how the Bible was formed and preserved' },
        { name: 'Apologetics', level: 'Intermediate', description: 'Learn to defend the Christian faith' },
        { name: 'Biblical Archaeology', level: 'Intermediate to Advanced', description: 'Explore archaeological evidence for biblical events and locations' }
      ]
    },
    {
      title: 'Historical Studies',
      icon: Trophy,
      color: 'from-emerald-600 to-teal-600',
      courses: [
        { name: 'Church History', level: 'Intermediate', description: 'Trace the development of Christianity through the ages' },
        { name: 'Kings of Israel', level: 'Beginner to Intermediate', description: 'Study the monarchs of ancient Israel and Judah' }
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

  // Show Admin Login if requested
  if (showAdminLogin && !isAdminAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          setIsAdminAuthenticated(true);
          setShowAdminLogin(false);
        }}
        onCancel={() => setShowAdminLogin(false)}
      />
    );
  }

  // Show Admin Grading Dashboard if authenticated
  if (isAdminAuthenticated) {
    return (
      <AdminGrading
        onBack={() => setIsAdminAuthenticated(false)}
        onLogout={() => {
          setIsAdminAuthenticated(false);
          setShowAdminLogin(false);
        }}
      />
    );
  }

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

        {/* Course Categories */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-amber-400 mb-6 flex items-center gap-3">
            <BookOpen size={32} />
            Course Catalog
          </h2>
          <div className="space-y-6">
            {courseCategories.map((category, index) => (
              <div key={index} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${category.color} rounded-lg px-4 py-2 mb-4`}>
                  <category.icon size={24} className="text-white" />
                  <h3 className="text-xl font-bold text-white">{category.title}</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {category.courses.map((course, courseIndex) => (
                    <div key={courseIndex} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          {course.courseNumber && (
                            <div className="text-xs font-mono text-amber-400 mb-1">{course.courseNumber}</div>
                          )}
                          <h4 className="font-bold text-slate-200">{course.name}</h4>
                        </div>
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
                      </div>
                      <p className="text-sm text-slate-400">{course.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
            <div className="bg-slate-800/50 rounded-lg p-4 md:p-6 border-2 border-purple-500/30">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-3 md:p-4 mx-auto md:mx-0">
                  <GraduationCap size={28} className="text-white md:w-8 md:h-8" />
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-xl md:text-2xl font-bold text-purple-400 mb-2">
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
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-center shadow-2xl mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Enroll in your first course today and take the first step toward mastering biblical languages,
            theology, and history. Your academic adventure awaits!
          </p>
          <button
            onClick={onBack}
            className="bg-white text-indigo-600 font-bold px-8 py-4 rounded-lg hover:bg-indigo-50 transition-all shadow-lg text-lg"
          >
            View Available Courses
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-400 text-sm mb-4">
          <p>Sword Drill Academy • Biblical Excellence Through Focused Study</p>
        </div>

        {/* Admin Access Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowAdminLogin(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-red-500/50 rounded-lg text-slate-400 hover:text-red-400 transition-all text-sm"
          >
            <Lock size={14} />
            Admin Access
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcademyAbout;
