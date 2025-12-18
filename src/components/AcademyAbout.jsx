import React from 'react';
import { GraduationCap, Award, Scroll, BookOpen, Trophy, Coins, Shield, CheckCircle, Star } from 'lucide-react';

const AcademyAbout = ({ onBack }) => {
  const courseCategories = [
    {
      title: 'Biblical Languages',
      icon: BookOpen,
      color: 'from-indigo-600 to-purple-600',
      courses: [
        { name: 'Koine Greek', level: 'Beginner to Intermediate', description: 'Master the language of the New Testament' },
        { name: 'Ancient Hebrew', level: 'Beginner to Intermediate', description: 'Learn the language of the Old Testament' },
        { name: 'Paleo Hebrew', level: 'Intermediate', description: 'Study the ancient script form of Hebrew' },
        { name: 'Aramaic', level: 'Beginner', description: 'Explore the language Jesus spoke' },
        { name: 'Ge\'ez', level: 'Beginner', description: 'Study the ancient Ethiopian liturgical language' },
        { name: 'Amharic', level: 'Beginner', description: 'Learn the modern Ethiopian language' }
      ]
    },
    {
      title: 'Biblical Studies',
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

  const graduationRequirements = [
    'Complete all language courses (6 courses)',
    'Complete all biblical studies courses (5 courses)',
    'Complete all historical studies courses (2 courses)',
    'Maintain focus integrity throughout your studies',
    'Pass all course assessments and final exams'
  ];

  const crestLogo = `${process.env.PUBLIC_URL || ''}/imageedit_1_3946066529.png`;

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
                        <h4 className="font-bold text-slate-200">{course.name}</h4>
                        <span className="text-xs bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded">
                          {course.level}
                        </span>
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
        <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl p-6 md:p-8 mb-8 border-2 border-purple-500/50">
          <h2 className="text-3xl font-bold text-purple-300 mb-6 flex items-center gap-3">
            <Award size={32} />
            Graduation Requirements
          </h2>
          <div className="space-y-3">
            {graduationRequirements.map((requirement, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle size={20} className="text-purple-400 mt-0.5 flex-shrink-0" />
                <p className="text-slate-200">{requirement}</p>
              </div>
            ))}
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
        <div className="text-center text-slate-400 text-sm">
          <p>Sword Drill Academy • Biblical Excellence Through Focused Study</p>
        </div>
      </div>
    </div>
  );
};

export default AcademyAbout;
