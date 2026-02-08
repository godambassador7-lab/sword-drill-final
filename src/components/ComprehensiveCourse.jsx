import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Book,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Scroll,
  Trophy,
  ArrowLeft,
  RotateCcw,
  X
} from 'lucide-react';
import { updateUserProgress } from '../services/dbService';

const DEFAULT_THEME = {
  accentText: 'text-blue-300',
  accentTextStrong: 'text-blue-400',
  accentBorder: 'border-blue-500/50',
  accentBorderSoft: 'border-blue-500/30',
  accentBgSoft: 'from-blue-900/40 to-indigo-900/40',
  accentBgSoftAlt: 'from-blue-900/30 to-indigo-900/30',
  accentBgSolid: 'from-blue-600 to-indigo-600',
  accentBgSolidHover: 'from-blue-500 to-indigo-500',
  quizAccentBg: 'from-blue-600 to-indigo-600',
  examAccentBg: 'from-amber-600 to-orange-600',
  examAccentBgHover: 'from-amber-500 to-orange-500',
  examBorder: 'border-amber-500/50',
  examText: 'text-amber-400',
  badgeLesson: 'text-emerald-400',
  badgeQuiz: 'text-amber-400'
};

const ComprehensiveCourse = ({
  courseData,
  progressKey,
  onCompleteCourseId,
  userId,
  userData,
  setUserData,
  onComplete,
  onCancel
}) => {
  const theme = courseData.theme || DEFAULT_THEME;
  const [currentView, setCurrentView] = useState('list');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [examAnswers, setExamAnswers] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState(0);
  const [examPassed, setExamPassed] = useState(false);

  const [completedLessons, setCompletedLessons] = useState(() => {
    return userData?.[progressKey]?.completedLessons || [];
  });
  const [completedQuizzes, setCompletedQuizzes] = useState(() => {
    return userData?.[progressKey]?.completedQuizzes || [];
  });
  const [examCompleted, setExamCompleted] = useState(() => {
    return userData?.[progressKey]?.examCompleted || false;
  });

  useEffect(() => {
    if (userData?.[progressKey]) {
      const p = userData[progressKey];
      if (p.completedLessons) setCompletedLessons(p.completedLessons);
      if (p.completedQuizzes) setCompletedQuizzes(p.completedQuizzes);
      if (typeof p.examCompleted === 'boolean') setExamCompleted(p.examCompleted);
    }
  }, [userData, progressKey]);

  useEffect(() => {
    const progressPayload = { completedLessons, completedQuizzes, examCompleted };
    localStorage.setItem(progressKey, JSON.stringify(progressPayload));
    if (setUserData) setUserData(prev => ({ ...prev, [progressKey]: progressPayload }));
    if (userId) updateUserProgress(userId, { [progressKey]: progressPayload }).catch(err =>
      console.error(`Error saving ${progressKey}:`, err)
    );
  }, [completedLessons, completedQuizzes, examCompleted, userId, setUserData, progressKey]);

  const totalSteps = courseData.units.length * 2 + 1;
  const completedSteps = completedLessons.length + completedQuizzes.length + (examCompleted ? 1 : 0);
  const progress = Math.round((completedSteps / totalSteps) * 100);

  const quizPassScore = courseData.quizPassScore ?? 4;
  const examPassScore = useMemo(() => {
    if (courseData.examPassScore) return courseData.examPassScore;
    const pct = courseData.examPassPercentage ?? 70;
    return Math.ceil((pct / 100) * courseData.finalExam.length);
  }, [courseData]);

  const markLessonComplete = (unitId) => {
    if (!completedLessons.includes(unitId)) {
      setCompletedLessons(prev => [...prev, unitId]);
    }
  };

  const submitQuiz = () => {
    const unit = courseData.units[selectedUnit];
    let correct = 0;
    unit.quiz.forEach((q, i) => { if (quizAnswers[i] === q.correct) correct++; });
    setQuizScore(correct);
    setQuizSubmitted(true);
    if (correct >= quizPassScore && !completedQuizzes.includes(unit.id)) {
      setCompletedQuizzes(prev => [...prev, unit.id]);
      if (onComplete) onComplete({ type: 'quiz', unitId: unit.id });
    }
  };

  const submitExam = () => {
    let correct = 0;
    courseData.finalExam.forEach((q, i) => { if (examAnswers[i] === q.correct) correct++; });
    setExamScore(correct);
    setExamSubmitted(true);
    const passed = correct >= examPassScore;
    setExamPassed(passed);
    if (passed && !examCompleted) {
      setExamCompleted(true);
      if (onComplete) onComplete({ type: 'course', courseId: onCompleteCourseId });
    }
  };

  const startQuiz = () => { setQuizAnswers({}); setQuizSubmitted(false); setQuizScore(0); setCurrentView('quiz'); };
  const startExam = () => { setExamAnswers({}); setExamSubmitted(false); setExamScore(0); setExamPassed(false); setCurrentView('exam'); };

  if (currentView === 'quiz' && selectedUnit !== null) {
    const unit = courseData.units[selectedUnit];
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentView('lesson')} className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
              <ArrowLeft size={20} /> Back to Lesson
            </button>
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
              className={`w-full mt-6 bg-gradient-to-r ${theme.quizAccentBg} hover:${theme.accentBgSolidHover} disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-all`}>
              Submit Quiz
            </button>
          ) : (
            <div className={`mt-6 p-6 rounded-xl border-2 text-center ${quizScore >= quizPassScore ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-red-900/30 border-red-500/50'}`}>
              <div className="text-4xl mb-2">{quizScore >= quizPassScore ? '🎉' : '📚'}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{quizScore}/{unit.quiz.length} Correct</h3>
              <p className="text-slate-300 mb-4">{quizScore >= quizPassScore ? 'You passed! Great understanding of the material.' : `You need ${quizPassScore}/${unit.quiz.length} to pass. Review the lesson and try again.`}</p>
              <div className="flex gap-3 justify-center">
                {quizScore < quizPassScore && <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg"><RotateCcw size={18} /> Retry</button>}
                <button onClick={() => setCurrentView('list')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">Back to Course</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentView === 'exam') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentView('list')} className="flex items-center gap-2 text-blue-400 hover:text-blue-300"><ArrowLeft size={20} /> Back to Course</button>
            <h2 className={`text-xl font-bold ${theme.examText} flex items-center gap-2`}><Trophy size={24} /> Final Exam</h2>
          </div>
          {!examSubmitted && (
            <div className={`bg-amber-900/30 border border-amber-500/40 rounded-xl p-4 mb-6 text-amber-300 text-sm`}>
              {courseData.finalExam.length} questions covering all units. You need {examPassScore}/{courseData.finalExam.length} to pass.
            </div>
          )}
          <div className="space-y-6">
            {courseData.finalExam.map((q, qi) => (
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
            <button onClick={submitExam} disabled={Object.keys(examAnswers).length < courseData.finalExam.length}
              className={`w-full mt-6 bg-gradient-to-r ${theme.examAccentBg} hover:${theme.examAccentBgHover} disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-all`}>
              Submit Final Exam
            </button>
          ) : (
            <div className={`mt-6 p-6 rounded-xl border-2 text-center ${examPassed ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-red-900/30 border-red-500/50'}`}>
              <div className="text-5xl mb-3">{examPassed ? '🏆' : '📚'}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{examScore}/{courseData.finalExam.length} Correct ({Math.round((examScore / courseData.finalExam.length) * 100)}%)</h3>
              <p className="text-slate-300 mb-4">{examPassed ? `Congratulations! You have completed the ${courseData.title} course!` : `You need ${examPassScore}/${courseData.finalExam.length} to pass. Review the units and try again.`}</p>
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

  if (currentView === 'lesson' && selectedUnit !== null) {
    const unit = courseData.units[selectedUnit];
    const lessonDone = completedLessons.includes(unit.id);
    const quizDone = completedQuizzes.includes(unit.id);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentView('list')} className="flex items-center gap-2 text-blue-400 hover:text-blue-300"><ArrowLeft size={20} /> Back to Course</button>
            <div className="flex items-center gap-2">
              {lessonDone && <span className={`text-sm flex items-center gap-1 ${theme.badgeLesson}`}><CheckCircle size={16} /> Read</span>}
              {quizDone && <span className={`text-sm flex items-center gap-1 ${theme.badgeQuiz}`}><Award size={16} /> Quiz Passed</span>}
            </div>
          </div>
          <div className={`bg-gradient-to-br ${theme.accentBgSoft} rounded-xl p-6 border-2 ${theme.accentBorder} mb-6`}>
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
                <h2 className={`text-xl font-bold ${theme.examText} mb-3`}>{section.heading}</h2>
                {section.text.split('\n\n').map((para, pi) => <p key={pi} className="text-slate-300 leading-relaxed mb-3">{para}</p>)}
              </div>
            ))}
            {unit.keyTerms && unit.keyTerms.length > 0 && (
              <div className={`bg-gradient-to-br ${theme.accentBgSoftAlt} rounded-xl p-6 border ${theme.accentBorderSoft}`}>
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
            <button onClick={startQuiz} className={`flex-1 bg-gradient-to-r ${theme.accentBgSolid} hover:${theme.accentBgSolidHover} text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 ${quizDone ? 'opacity-70' : ''}`}>
              <Scroll size={18} /> {quizDone ? 'Retake Quiz' : 'Take Quiz'}
            </button>
          </div>
          <div className="flex justify-between mt-4">
            <button onClick={() => { setSelectedUnit(Math.max(0, selectedUnit - 1)); window.scrollTo(0, 0); }} disabled={selectedUnit === 0}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold py-2 px-4 rounded-lg"><ArrowLeft size={18} /> Previous</button>
            <button onClick={() => { setSelectedUnit(Math.min(courseData.units.length - 1, selectedUnit + 1)); window.scrollTo(0, 0); }} disabled={selectedUnit === courseData.units.length - 1}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold py-2 px-4 rounded-lg">Next <ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    );
  }

  const allQuizzesDone = courseData.units.every(u => completedQuizzes.includes(u.id));
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookOpen size={32} className={theme.accentTextStrong} />
            <div>
              <h1 className="text-2xl font-bold text-white">{courseData.title}</h1>
              <p className="text-slate-400">{courseData.subtitle}</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>
        <div className={`bg-slate-800/50 rounded-xl p-4 border ${theme.accentBorderSoft} mb-6`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold">Course Progress</span>
            <span className={`${theme.accentTextStrong} font-bold`}>{progress}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
            <div className={`bg-gradient-to-r ${theme.accentBgSolid} h-full transition-all duration-500`} style={{ width: `${progress}%` }} />
          </div>
          <div className="text-slate-400 text-sm mt-2">{completedLessons.length} lessons read | {completedQuizzes.length} quizzes passed | {examCompleted ? 'Exam passed' : 'Exam pending'}</div>
        </div>
        <div className="space-y-3 mb-6">
          {courseData.units.map((unit, idx) => {
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
                      <p className={`${theme.accentText} text-sm`}>{unit.duration}</p>
                    </div>
                  </div>
                  <ChevronRight size={24} className={theme.accentTextStrong} />
                </div>
              </button>
            );
          })}
        </div>
        <div className={`rounded-xl p-6 border-2 text-center ${allQuizzesDone ? `bg-gradient-to-r from-amber-900/30 to-orange-900/30 ${theme.examBorder}` : 'bg-slate-800/30 border-slate-700'}`}>
          <Trophy size={32} className={allQuizzesDone ? 'text-amber-400 mx-auto mb-3' : 'text-slate-600 mx-auto mb-3'} />
          <h3 className="text-xl font-bold text-white mb-2">Final Exam</h3>
          <p className="text-slate-400 text-sm mb-4">{allQuizzesDone ? 'All quizzes passed! You are ready for the final exam.' : `Pass all ${courseData.units.length} unit quizzes to unlock the final exam. (${completedQuizzes.length}/${courseData.units.length} complete)`}</p>
          {examCompleted && <p className="text-emerald-400 font-bold mb-3 flex items-center justify-center gap-2"><CheckCircle size={18} /> Exam Passed!</p>}
          <button onClick={startExam} disabled={!allQuizzesDone}
            className={`bg-gradient-to-r ${theme.examAccentBg} hover:${theme.examAccentBgHover} disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 text-white font-bold py-3 px-8 rounded-lg transition-all`}>
            {examCompleted ? 'Retake Exam' : 'Start Final Exam'}
          </button>
        </div>
        <div className={`mt-6 bg-gradient-to-br ${theme.accentBgSoftAlt} rounded-xl p-6 border ${theme.accentBorderSoft}`}>
          <h2 className="text-xl font-bold text-blue-300 mb-3 flex items-center gap-2"><Scroll size={24} /> About This Course</h2>
          <p className="text-slate-300 mb-3"><strong className="text-blue-300">{courseData.about.level}</strong> - {courseData.about.description}</p>
          <p className="text-slate-300"><strong className="text-blue-300">Credit Equivalent:</strong> {courseData.about.credits} | <strong className="text-blue-300">Prerequisites:</strong> {courseData.about.prerequisites}</p>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveCourse;
