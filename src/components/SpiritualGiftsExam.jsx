import React, { useState, useEffect } from 'react';
import { Heart, CheckCircle, ArrowLeft, Download, History, RotateCcw } from 'lucide-react';

const SpiritualGiftsExam = ({ onBack }) => {
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [previousResults, setPreviousResults] = useState(null);
  const [showPreviousResults, setShowPreviousResults] = useState(false);

  useEffect(() => {
    // Load the exam data
    fetch('/spiritual_gifts_exam_sword_drill/spiritual_gifts_exam.json')
      .then(res => res.json())
      .then(data => {
        setExamData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading spiritual gifts exam:', err);
        setLoading(false);
      });

    // Load previous results from localStorage
    const savedResults = localStorage.getItem('spiritualGiftsResults');
    if (savedResults) {
      try {
        setPreviousResults(JSON.parse(savedResults));
      } catch (err) {
        console.error('Error loading previous results:', err);
      }
    }
  }, []);

  const handleResponse = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateResults = () => {
    if (!examData) return;

    const giftScores = {};

    // Initialize all gift scores to 0
    examData.gifts.forEach(gift => {
      giftScores[gift.id] = 0;
    });

    // Calculate scores based on responses
    examData.questions.forEach(question => {
      const response = responses[question.id] || 0;
      Object.entries(question.gifts_weights).forEach(([giftId, weight]) => {
        giftScores[giftId] += response * weight;
      });
    });

    // Sort gifts by score
    const sortedGifts = Object.entries(giftScores)
      .map(([giftId, score]) => {
        const gift = examData.gifts.find(g => g.id === giftId);
        return { ...gift, score };
      })
      .sort((a, b) => b.score - a.score);

    // Save results with timestamp
    const resultsToSave = {
      gifts: sortedGifts,
      timestamp: new Date().toISOString(),
      responses: responses
    };

    localStorage.setItem('spiritualGiftsResults', JSON.stringify(resultsToSave));
    setPreviousResults(resultsToSave);

    setResults(sortedGifts);
    setShowResults(true);
  };

  const handleNext = () => {
    if (currentQuestion < examData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate and show results
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const resetExam = () => {
    setCurrentQuestion(0);
    setResponses({});
    setShowResults(false);
    setResults(null);
    setShowPreviousResults(false);
  };

  const loadPreviousResults = () => {
    if (previousResults && previousResults.gifts) {
      setResults(previousResults.gifts);
      setShowResults(true);
      setShowPreviousResults(true);
    }
  };

  const downloadResults = () => {
    const resultsData = showPreviousResults ? previousResults : { gifts: results, timestamp: new Date().toISOString() };
    if (!resultsData || !resultsData.gifts) return;

    const topThree = resultsData.gifts.slice(0, 3);
    const timestamp = new Date(resultsData.timestamp).toLocaleDateString();

    let textContent = `SPIRITUAL GIFTS EXAM RESULTS\n`;
    textContent += `Date: ${timestamp}\n`;
    textContent += `\n${'='.repeat(60)}\n\n`;

    textContent += `YOUR TOP THREE SPIRITUAL GIFTS:\n\n`;

    topThree.forEach((gift, index) => {
      textContent += `${index + 1}. ${gift.name.toUpperCase()} (Score: ${gift.score})\n`;
      textContent += `\nSummary: ${gift.summary}\n`;
      textContent += `\nHow to use this gift today:\n${gift.how_to_use_today}\n`;
      textContent += `\nCultivation tips:\n${gift.cultivation_tips}\n`;

      if (gift.scripture_refs && gift.scripture_refs.length > 0) {
        textContent += `\nScripture References:\n`;
        gift.scripture_refs.forEach(ref => {
          textContent += `  - ${ref}\n`;
        });
      }

      if (gift.biblical_examples && gift.biblical_examples.length > 0) {
        textContent += `\nBiblical Examples:\n`;
        gift.biblical_examples.forEach(example => {
          textContent += `  - ${example}\n`;
        });
      }

      textContent += `\n${'-'.repeat(60)}\n\n`;
    });

    textContent += `\nCOMPLETE RESULTS (All Gifts Ranked):\n\n`;
    resultsData.gifts.forEach((gift, index) => {
      textContent += `${index + 1}. ${gift.name} - Score: ${gift.score}\n`;
    });

    textContent += `\n${'='.repeat(60)}\n`;
    textContent += `\nRemember: This assessment is a tool for reflection and discussion.\n`;
    textContent += `Share these results with mature believers and church leaders for guidance.\n`;
    textContent += `\nGenerated by Sword Drill - Bible Memorization App\n`;

    // Create download
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Spiritual-Gifts-Results-${timestamp.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading Spiritual Gifts Exam...</p>
        </div>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Error loading exam data</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    const topThreeGifts = results.slice(0, 3);
    const maxScore = Math.max(...results.map(r => r.score));

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 text-white p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Menu
          </button>

          <div className="bg-slate-800/80 backdrop-blur rounded-xl p-8 border border-purple-500/30 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart size={32} className="text-purple-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Your Spiritual Gifts Profile
              </h1>
            </div>
            <p className="text-slate-300">
              Based on your responses, here are your top spiritual gifts. Remember, this is a tool for
              reflection—discuss these results with mature believers and church leaders.
            </p>
          </div>

          {/* Top Three Gifts */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">Your Top Three Gifts</h2>
            <div className="space-y-4">
              {topThreeGifts.map((gift, index) => (
                <div
                  key={gift.id}
                  className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur rounded-xl p-6 border border-purple-500/30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl
                        ${index === 0 ? 'bg-yellow-500/20 text-yellow-300 border-2 border-yellow-400' : ''}
                        ${index === 1 ? 'bg-slate-400/20 text-slate-300 border-2 border-slate-400' : ''}
                        ${index === 2 ? 'bg-amber-600/20 text-amber-400 border-2 border-amber-500' : ''}
                      `}>
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-bold text-purple-200">{gift.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">Score</div>
                      <div className="text-2xl font-bold text-purple-300">{gift.score}</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4 bg-slate-700/50 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                      style={{ width: `${(gift.score / maxScore) * 100}%` }}
                    ></div>
                  </div>

                  <p className="text-slate-300 mb-3">{gift.summary}</p>

                  <div className="mb-3">
                    <h4 className="font-semibold text-purple-300 mb-1">How to use this gift today:</h4>
                    <p className="text-sm text-slate-300">{gift.how_to_use_today}</p>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-semibold text-purple-300 mb-1">Cultivation tips:</h4>
                    <p className="text-sm text-slate-300">{gift.cultivation_tips}</p>
                  </div>

                  {gift.scripture_refs && gift.scripture_refs.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-semibold text-purple-300 mb-1">Scripture references:</h4>
                      <div className="flex flex-wrap gap-2">
                        {gift.scripture_refs.map((ref, idx) => (
                          <span key={idx} className="text-xs bg-purple-900/30 px-2 py-1 rounded border border-purple-500/30">
                            {ref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {gift.biblical_examples && gift.biblical_examples.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-purple-300 mb-1">Biblical examples:</h4>
                      <ul className="text-sm text-slate-300 list-disc list-inside">
                        {gift.biblical_examples.map((example, idx) => (
                          <li key={idx}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* All Results Table */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">Complete Results</h2>
            <div className="bg-slate-800/80 backdrop-blur rounded-xl overflow-hidden border border-purple-500/30">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/80">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">Rank</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">Gift</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-purple-300">Score</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">Strength</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {results.map((gift, index) => (
                      <tr key={gift.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3 text-sm">{index + 1}</td>
                        <td className="px-4 py-3 text-sm font-medium">{gift.name}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-purple-300">{gift.score}</td>
                        <td className="px-4 py-3">
                          <div className="w-full bg-slate-700/50 rounded-full h-2">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                              style={{ width: `${(gift.score / maxScore) * 100}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Results Info Banner */}
          {showPreviousResults && (
            <div className="mb-6 bg-blue-900/30 border border-blue-500/50 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <History size={20} className="text-blue-400" />
                <div>
                  <p className="text-blue-300 font-semibold">Viewing Previous Results</p>
                  <p className="text-blue-200 text-sm">
                    Completed on {new Date(previousResults.timestamp).toLocaleDateString()} at {new Date(previousResults.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              onClick={downloadResults}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold transition-colors"
            >
              <Download size={20} />
              Download Results
            </button>
            <button
              onClick={resetExam}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
            >
              <RotateCcw size={20} />
              Retake Exam
            </button>
          </div>

          <button
            onClick={onBack}
            className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const question = examData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / examData.questions.length) * 100;
  const scaleLabels = examData.metadata.scale.labels;
  const currentResponse = responses[question.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 text-white p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Menu
          </button>

          {previousResults && currentQuestion === 0 && Object.keys(responses).length === 0 && (
            <button
              onClick={loadPreviousResults}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              <History size={18} />
              Show Previous Results
            </button>
          )}
        </div>

        {/* Header */}
        <div className="bg-slate-800/80 backdrop-blur rounded-xl p-6 border border-purple-500/30 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart size={32} className="text-purple-400" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                {examData.metadata.title}
              </h1>
              <p className="text-sm text-slate-400">
                Question {currentQuestion + 1} of {examData.questions.length}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-slate-700/50 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur rounded-xl p-8 border border-purple-500/30 mb-6">
          <p className="text-xl mb-8 leading-relaxed">{question.text}</p>

          {/* Response options */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(value => (
              <button
                key={value}
                onClick={() => handleResponse(question.id, value)}
                className={`
                  w-full p-4 rounded-lg text-left transition-all border-2
                  ${currentResponse === value
                    ? 'bg-purple-600 border-purple-400 shadow-lg shadow-purple-500/50'
                    : 'bg-slate-700/50 border-slate-600 hover:border-purple-500/50 hover:bg-slate-700'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{scaleLabels[value]}</span>
                  {currentResponse === value && (
                    <CheckCircle size={20} className="text-purple-200" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!currentResponse}
            className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
          >
            {currentQuestion === examData.questions.length - 1 ? 'See Results' : 'Next'}
          </button>
        </div>

        {/* Skip info */}
        {!currentResponse && (
          <p className="text-center text-sm text-slate-400 mt-4">
            Please select a response to continue
          </p>
        )}
      </div>
    </div>
  );
};

export default SpiritualGiftsExam;
