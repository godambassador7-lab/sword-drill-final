import React, { useState, useEffect } from 'react';
import { Wind, CheckCircle, ArrowLeft, Download, History, RotateCcw, BookOpen } from 'lucide-react';
import { updateUserProgress } from '../services/dbService';
import { openReferenceInBibleReader } from '../services/referenceNavigation';
import { buildStudyLens, extractScriptureReferences } from '../services/quizEvidence';

const SpiritualGiftsExam = ({ onBack, userId, userData, setUserData }) => {
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [previousResults, setPreviousResults] = useState(null);
  const [showPreviousResults, setShowPreviousResults] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const openRef = (ref) => openReferenceInBibleReader(ref, onBack);

  // Background music effect
  useEffect(() => {
    const audio = new Audio(`${process.env.PUBLIC_URL || ''}/ytmp3free.cc_holy-spirit-and-i-10-minute-praying-time-music-meditation-music-youtubemp3free.org.mp3`);
    audio.loop = true;
    audio.volume = 0.3; // Set to 30% volume for background ambiance

    // Play the audio
    audio.play().catch(err => {
      console.log('Audio autoplay prevented:', err);
      // Autoplay might be blocked by browser, user will need to interact first
    });

    // Cleanup: stop and remove audio when component unmounts
    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
    };
  }, []);

  // Load exam data once on mount
  useEffect(() => {
    const dataUrl = `${process.env.PUBLIC_URL || ''}/spiritual_gifts_exam_sword_drill/spiritual_gifts_exam.json`;

    fetch(dataUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch exam data (${res.status})`);
        }
        return res.json();
      })
      .then(data => {
        setExamData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading spiritual gifts exam:', err);
        setLoading(false);
      });
  }, []);

  // Load previous results - runs on mount and when userData changes
  useEffect(() => {
    console.log('=== Spiritual Gifts Exam - Loading Previous Results ===');
    console.log('userData:', userData);
    console.log('userId:', userId);
    console.log('userData?.spiritualGiftsResults:', userData?.spiritualGiftsResults);

    let loadedResults = null;

    // ALWAYS check localStorage first for immediate display
    const savedResults = localStorage.getItem('spiritualGiftsResults');
    console.log('localStorage spiritualGiftsResults:', savedResults ? 'EXISTS' : 'NONE');

    if (savedResults) {
      try {
        const parsed = JSON.parse(savedResults);
        console.log('localStorage results parsed:', parsed);

        if (parsed.gifts && Array.isArray(parsed.gifts) && parsed.gifts.length > 0) {
          loadedResults = parsed;
          console.log('✓ Valid results from localStorage - Gifts count:', parsed.gifts.length);
        } else if (Array.isArray(parsed) && parsed.length > 0) {
          loadedResults = {
            gifts: parsed,
            timestamp: new Date().toISOString()
          };
          console.log('✓ Converted old format localStorage results');
        }
      } catch (err) {
        console.error('Error parsing localStorage results:', err);
      }
    }

    // Then check Firebase if available (will override localStorage if newer)
    if (userData?.spiritualGiftsResults) {
      console.log('Firebase results found:', userData.spiritualGiftsResults);
      const results = userData.spiritualGiftsResults;

      if (results.gifts && Array.isArray(results.gifts) && results.gifts.length > 0) {
        // Only override localStorage if Firebase has a timestamp and it's newer
        if (!loadedResults || !results.timestamp ||
            new Date(results.timestamp) >= new Date(loadedResults.timestamp || 0)) {
          loadedResults = results;
          console.log('✓ Using Firebase results - Gifts count:', results.gifts.length);
        } else {
          console.log('ℹ️ localStorage is newer, keeping localStorage results');
        }
      } else if (Array.isArray(results) && results.length > 0) {
        loadedResults = {
          gifts: results,
          timestamp: new Date().toISOString()
        };
        console.log('✓ Converted old format Firebase results');
      } else {
        console.warn('⚠️ Firebase results exist but invalid structure:', results);
      }
    } else {
      console.log('No Firebase results available');
    }

    // Set the results if we found any
    if (loadedResults) {
      setPreviousResults(loadedResults);
      console.log('✓✓✓ Previous results SET successfully ✓✓✓');
      console.log('Top 3 gifts:', loadedResults.gifts.slice(0, 3).map(g => g.name));
    } else {
      console.log('❌ No previous results found anywhere');
      setPreviousResults(null);
    }

    setDataLoaded(true);
    console.log('=== End Loading Previous Results ===');

    // AUTO-SYNC: If we have localStorage results but NOT Firebase results, sync to Firebase
    if (loadedResults && userId && setUserData && updateUserProgress && !userData?.spiritualGiftsResults) {
      console.log('🔄 AUTO-SYNC: Found localStorage results but missing in Firebase. Syncing...');

      // Update React state
      setUserData(prev => ({
        ...prev,
        spiritualGiftsResults: loadedResults
      }));

      // Save to Firebase
      updateUserProgress(userId, {
        spiritualGiftsResults: loadedResults
      })
        .then(() => {
          console.log('✓ AUTO-SYNC: Successfully synced results to Firebase');
        })
        .catch(err => {
          console.error('❌ AUTO-SYNC: Error syncing results to Firebase:', err);
        });
    }
  }, [userData, userId, setUserData, updateUserProgress]);

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

    // Save to localStorage
    try {
      localStorage.setItem('spiritualGiftsResults', JSON.stringify(resultsToSave));
      console.log('✓ Saved to localStorage successfully');
      setPreviousResults(resultsToSave);
    } catch (err) {
      console.error('❌ Error saving to localStorage:', err);
    }

    // Sync to Firebase
    if (userId && setUserData && updateUserProgress) {
      console.log('🔄 Syncing results to Firebase for userId:', userId);

      setUserData(prev => ({
        ...prev,
        spiritualGiftsResults: resultsToSave
      }));

      updateUserProgress(userId, {
        spiritualGiftsResults: resultsToSave
      })
        .then(() => {
          console.log('✓ Successfully saved to Firebase');
        })
        .catch(err => {
          console.error('❌ Error saving spiritual gifts results to Firebase:', err);
        });
    } else {
      console.warn('⚠️ Cannot sync to Firebase - Missing:', {
        userId: !!userId,
        setUserData: !!setUserData,
        updateUserProgress: !!updateUserProgress
      });
    }

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading Spiritual Gifts Exam...</p>
        </div>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Error loading exam data</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Welcome screen - shows before exam starts
  if (showWelcome && !showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900 text-white p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Menu
          </button>

          <div className="bg-slate-800/80 backdrop-blur rounded-xl p-8 border border-blue-500/30 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Wind size={40} className="text-blue-400" />
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  Spiritual Gifts Exam
                </h1>
              </div>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed">
              Discover your spiritual gifts through this comprehensive biblical assessment.
              Answer thoughtfully and prayerfully to identify how the Holy Spirit has gifted you to serve the Body of Christ.
            </p>
          </div>

          {/* Previous Results Section */}
          {previousResults && previousResults.gifts && previousResults.gifts.length > 0 && (
            <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur rounded-xl p-4 sm:p-6 border border-blue-500/50 mb-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <History size={24} className="text-blue-400 flex-shrink-0" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-300">Your Previous Results</h2>
              </div>
              {previousResults.timestamp && (
                <p className="text-slate-300 text-sm sm:text-base mb-3 sm:mb-4">
                  You completed this exam on {new Date(previousResults.timestamp).toLocaleDateString()} at {new Date(previousResults.timestamp).toLocaleTimeString()}
                </p>
              )}

              {previousResults.gifts && previousResults.gifts.length > 0 && (
                <div className="bg-slate-900/50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-blue-200 mb-2 sm:mb-3">Your Top 3 Gifts:</h3>
                  <div className="space-y-2">
                    {previousResults.gifts.slice(0, 3).map((gift, index) => (
                      <div key={gift.id || index} className="flex items-center justify-between bg-slate-800/50 rounded-lg p-2 sm:p-3 gap-2">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className={`
                            w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0
                            ${index === 0 ? 'bg-yellow-500/20 text-yellow-300 border-2 border-yellow-400' : ''}
                            ${index === 1 ? 'bg-slate-400/20 text-slate-300 border-2 border-slate-400' : ''}
                            ${index === 2 ? 'bg-amber-600/20 text-amber-400 border-2 border-amber-500' : ''}
                          `}>
                            {index + 1}
                          </div>
                          <span className="text-white font-semibold text-sm sm:text-base truncate">{gift.name || 'Unknown'}</span>
                        </div>
                        <span className="text-blue-300 font-bold text-sm sm:text-base whitespace-nowrap">Score: {gift.score || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  loadPreviousResults();
                  setShowWelcome(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-sm sm:text-base transition-colors"
              >
                <History size={18} className="sm:w-5 sm:h-5" />
                View Full Previous Results
              </button>
            </div>
          )}

          {/* Start Exam Button */}
          <div className="space-y-4">
            <button
              onClick={() => setShowWelcome(false)}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/50"
            >
              {previousResults ? 'Retake Exam' : 'Begin Exam'}
            </button>

            {previousResults && (
              <p className="text-center text-sm text-slate-400">
                Taking the exam again will save new results and keep your previous results for comparison.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    const topThreeGifts = results.slice(0, 3);
    const maxScore = Math.max(...results.map(r => r.score));

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900 text-white p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Menu
          </button>

          <div className="bg-slate-800/80 backdrop-blur rounded-xl p-8 border border-blue-500/30 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Wind size={32} className="text-blue-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
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
            <h2 className="text-2xl font-bold mb-4 text-blue-300">Your Top Three Gifts</h2>
            <div className="space-y-4">
              {topThreeGifts.map((gift, index) => (
                (() => {
                  const studyLens = buildStudyLens({
                    question: gift.name,
                    explanation: `${gift.summary || ''} ${gift.how_to_use_today || ''} ${gift.cultivation_tips || ''}`,
                    scriptureRefs: gift.scripture_refs || []
                  }, 'general');
                  const exampleRefs = (gift.biblical_examples || [])
                    .flatMap((example) => extractScriptureReferences({ question: example }))
                    .slice(0, 8);

                  return (
                <div
                  key={gift.id}
                  className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur rounded-xl p-6 border border-blue-500/30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className={`
                        w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl flex-shrink-0
                        ${index === 0 ? 'bg-yellow-500/20 text-yellow-300 border-2 border-yellow-400' : ''}
                        ${index === 1 ? 'bg-slate-400/20 text-slate-300 border-2 border-slate-400' : ''}
                        ${index === 2 ? 'bg-amber-600/20 text-amber-400 border-2 border-amber-500' : ''}
                      `}>
                        {index + 1}
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-blue-200 truncate">{gift.name}</h3>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="text-xs sm:text-sm text-slate-400">Score</div>
                      <div className="text-xl sm:text-2xl font-bold text-blue-300">{gift.score}</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4 bg-slate-700/50 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000"
                      style={{ width: `${(gift.score / maxScore) * 100}%` }}
                    ></div>
                  </div>

                  <p className="text-slate-300 mb-3">{gift.summary}</p>

                  <div className="mb-3">
                    <h4 className="font-semibold text-blue-300 mb-1">How to use this gift today:</h4>
                    <p className="text-sm text-slate-300">{gift.how_to_use_today}</p>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-semibold text-blue-300 mb-1">Cultivation tips:</h4>
                    <p className="text-sm text-slate-300">{gift.cultivation_tips}</p>
                  </div>

                  {gift.scripture_refs && gift.scripture_refs.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-semibold text-blue-300 mb-1">Scripture references:</h4>
                      <div className="flex flex-wrap gap-2">
                        {gift.scripture_refs.map((ref, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => openRef(ref)}
                            className="text-xs bg-blue-900/30 px-2 py-1 rounded border border-blue-500/30 hover:bg-blue-800/40 transition-colors"
                            title="Open in Bible Reader"
                          >
                            {ref}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {gift.biblical_examples && gift.biblical_examples.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-blue-300 mb-1">Biblical examples:</h4>
                      <ul className="text-sm text-slate-300 list-disc list-inside">
                        {gift.biblical_examples.map((example, idx) => (
                          <li key={idx}>{example}</li>
                        ))}
                      </ul>
                      {exampleRefs.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {exampleRefs.map((ref) => (
                            <button
                              key={`${gift.id}-${ref}`}
                              type="button"
                              onClick={() => openRef(ref)}
                              className="text-xs bg-blue-900/30 px-2 py-1 rounded border border-blue-500/30 hover:bg-blue-800/40 transition-colors font-mono"
                              title="Open in Bible Reader"
                            >
                              {ref}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-slate-700 text-sm space-y-2">
                    <p className="text-blue-200 font-semibold flex items-center gap-1">
                      <BookOpen size={14} />
                      Study Method (Scholarly Lens)
                    </p>
                    <p className="text-slate-200"><span className="text-slate-400">Claim Type:</span> {studyLens.claimType}</p>
                    <p className="text-slate-200"><span className="text-slate-400">Evidence Basis:</span> {studyLens.evidenceBasis}</p>
                    <p className="text-slate-200"><span className="text-slate-400">Verification Step:</span> {studyLens.verification}</p>
                    <p className="text-slate-200"><span className="text-slate-400">Interpretive Caution:</span> {studyLens.caution}</p>
                  </div>
                </div>
                  );
                })()
              ))}
            </div>
          </div>

          {/* All Results Table */}
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-300">Complete Results</h2>
            <div className="bg-slate-800/80 backdrop-blur rounded-xl overflow-hidden border border-blue-500/30">
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead className="bg-slate-900/80">
                    <tr>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-blue-300 w-12 sm:w-16">Rank</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-blue-300">Gift</th>
                      <th className="px-2 sm:px-4 py-3 text-right text-xs sm:text-sm font-semibold text-blue-300 w-16 sm:w-20">Score</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-blue-300 w-24 sm:w-32">Strength</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {results.map((gift, index) => (
                      <tr key={gift.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{index + 1}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium truncate max-w-[120px] sm:max-w-none">{gift.name}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right font-semibold text-blue-300">{gift.score}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3">
                          <div className="w-full bg-slate-700/50 rounded-full h-2">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
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
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900 text-white p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors"
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
        <div className="bg-slate-800/80 backdrop-blur rounded-xl p-6 border border-blue-500/30 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Wind size={32} className="text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
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
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur rounded-xl p-8 border border-blue-500/30 mb-6">
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
                    ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/50'
                    : 'bg-slate-700/50 border-slate-600 hover:border-blue-500/50 hover:bg-slate-700'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{scaleLabels[value]}</span>
                  {currentResponse === value && (
                    <CheckCircle size={20} className="text-blue-200" />
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
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
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
