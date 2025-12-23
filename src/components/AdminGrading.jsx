import React, { useState, useEffect } from 'react';
import {
  FileText, CheckCircle, XCircle, Clock, Award, Mail, Download,
  User, Calendar, ArrowLeft, Filter, Search, GraduationCap
} from 'lucide-react';
import CertificateEditor from './CertificateEditor';

const AdminGrading = ({ onBack, onLogout }) => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCertificateEditor, setShowCertificateEditor] = useState(false);
  const [gradeData, setGradeData] = useState({
    contentScore: 0,
    researchScore: 0,
    writingScore: 0,
    formatScore: 0,
    feedback: ''
  });

  // Mock submission data (in production, fetch from Firebase)
  useEffect(() => {
    // This would be replaced with actual Firebase query
    const mockSubmissions = [
      {
        id: '001',
        userId: 'user123',
        userName: 'John Doe',
        userEmail: 'john.doe@example.com',
        submittedDate: '2024-12-20T10:30:00',
        status: 'pending',
        paperTitle: 'The Theological Significance of the Davidic Covenant',
        gradeResult: null
      },
      {
        id: '002',
        userId: 'user456',
        userName: 'Jane Smith',
        userEmail: 'jane.smith@example.com',
        submittedDate: '2024-12-18T14:15:00',
        status: 'passed',
        paperTitle: 'Messianic Prophecies in Isaiah: A Comprehensive Analysis',
        gradeResult: {
          contentScore: 38,
          researchScore: 28,
          writingScore: 18,
          formatScore: 9,
          totalScore: 93,
          feedback: 'Excellent work! Your analysis shows deep understanding of the text.',
          gradedDate: '2024-12-19T09:00:00'
        }
      }
    ];
    setSubmissions(mockSubmissions);
  }, []);

  const calculateTotalScore = () => {
    return gradeData.contentScore + gradeData.researchScore +
           gradeData.writingScore + gradeData.formatScore;
  };

  const handleSubmitGrade = (status) => {
    const totalScore = calculateTotalScore();
    const isPassing = totalScore >= 70;

    const gradeResult = {
      contentScore: gradeData.contentScore,
      researchScore: gradeData.researchScore,
      writingScore: gradeData.writingScore,
      formatScore: gradeData.formatScore,
      totalScore: totalScore,
      feedback: gradeData.feedback,
      gradedDate: new Date().toISOString(),
      status: status === 'pass' ? 'passed' : 'failed'
    };

    // Update submission with grade
    setSubmissions(prev => prev.map(sub =>
      sub.id === selectedSubmission.id
        ? { ...sub, status: status === 'pass' ? 'passed' : 'failed', gradeResult }
        : sub
    ));

    // If passed, show certificate editor
    if (status === 'pass') {
      setShowCertificateEditor(true);
    } else {
      // For failed submissions, just show alert and reset
      alert(`Grade submitted successfully! Total Score: ${totalScore}%\n\nStudent will be notified via email.`);
      setSelectedSubmission(null);
      setGradeData({
        contentScore: 0,
        researchScore: 0,
        writingScore: 0,
        formatScore: 0,
        feedback: ''
      });
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesFilter = filterStatus === 'all' || sub.status === filterStatus;
    const matchesSearch = sub.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sub.paperTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sub.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-900/50 text-yellow-300 rounded-full text-sm font-semibold flex items-center gap-1">
            <Clock size={14} /> Pending Review
          </span>
        );
      case 'passed':
        return (
          <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 rounded-full text-sm font-semibold flex items-center gap-1">
            <CheckCircle size={14} /> Passed
          </span>
        );
      case 'failed':
        return (
          <span className="px-3 py-1 bg-red-900/50 text-red-300 rounded-full text-sm font-semibold flex items-center gap-1">
            <XCircle size={14} /> Needs Revision
          </span>
        );
      default:
        return null;
    }
  };

  if (selectedSubmission) {
    const totalScore = calculateTotalScore();
    const isPassing = totalScore >= 70;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedSubmission(null)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
            >
              <ArrowLeft size={20} />
              Back to Submissions
            </button>
            <div className="flex gap-2">
              {getStatusBadge(selectedSubmission.status)}
            </div>
          </div>

          {/* Student Info */}
          <div className="bg-slate-800/90 rounded-xl p-6 mb-6 border border-indigo-500/30">
            <h2 className="text-2xl font-bold text-indigo-400 mb-4">Student Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm mb-1">Student Name</p>
                <p className="text-white font-semibold flex items-center gap-2">
                  <User size={18} className="text-indigo-400" />
                  {selectedSubmission.userName}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Email</p>
                <p className="text-white font-semibold flex items-center gap-2">
                  <Mail size={18} className="text-indigo-400" />
                  {selectedSubmission.userEmail}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Submitted</p>
                <p className="text-white font-semibold flex items-center gap-2">
                  <Calendar size={18} className="text-indigo-400" />
                  {new Date(selectedSubmission.submittedDate).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Paper Title</p>
                <p className="text-white font-semibold flex items-center gap-2">
                  <FileText size={18} className="text-indigo-400" />
                  {selectedSubmission.paperTitle}
                </p>
              </div>
            </div>
          </div>

          {/* Grading Form */}
          <div className="bg-slate-800/90 rounded-xl p-6 mb-6 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-purple-400 mb-6">Grading Rubric</h2>

            {/* Content Score */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-slate-200">Content (40 points max)</label>
                <span className="text-2xl font-bold text-purple-400">{gradeData.contentScore}/40</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">Biblical accuracy, theological soundness, original insight</p>
              <input
                type="range"
                min="0"
                max="40"
                value={gradeData.contentScore}
                onChange={(e) => setGradeData({...gradeData, contentScore: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Research Score */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-slate-200">Research (30 points max)</label>
                <span className="text-2xl font-bold text-blue-400">{gradeData.researchScore}/30</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">Quality of sources, proper citations, scholarly engagement</p>
              <input
                type="range"
                min="0"
                max="30"
                value={gradeData.researchScore}
                onChange={(e) => setGradeData({...gradeData, researchScore: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Writing Score */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-slate-200">Writing (20 points max)</label>
                <span className="text-2xl font-bold text-emerald-400">{gradeData.writingScore}/20</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">Clarity, grammar, logical argumentation</p>
              <input
                type="range"
                min="0"
                max="20"
                value={gradeData.writingScore}
                onChange={(e) => setGradeData({...gradeData, writingScore: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Format Score */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-slate-200">Format (10 points max)</label>
                <span className="text-2xl font-bold text-amber-400">{gradeData.formatScore}/10</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">Structure, citation format, professional presentation</p>
              <input
                type="range"
                min="0"
                max="10"
                value={gradeData.formatScore}
                onChange={(e) => setGradeData({...gradeData, formatScore: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Total Score Display */}
            <div className={`p-6 rounded-xl border-2 mb-6 ${isPassing ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-red-900/30 border-red-500/50'}`}>
              <div className="text-center">
                <p className="text-slate-300 font-semibold mb-2">Total Score</p>
                <p className={`text-6xl font-bold ${isPassing ? 'text-emerald-400' : 'text-red-400'}`}>
                  {totalScore}%
                </p>
                <p className={`text-sm font-semibold mt-2 ${isPassing ? 'text-emerald-300' : 'text-red-300'}`}>
                  {isPassing ? '✓ Passing Grade (70% required)' : '✗ Below Passing (70% required)'}
                </p>
              </div>
            </div>

            {/* Feedback */}
            <div className="mb-6">
              <label className="block font-bold text-slate-200 mb-2">Feedback for Student</label>
              <textarea
                value={gradeData.feedback}
                onChange={(e) => setGradeData({...gradeData, feedback: e.target.value})}
                placeholder="Provide constructive feedback for the student..."
                rows={6}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleSubmitGrade('pass')}
                disabled={totalScore < 70}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-lg font-bold transition-all shadow-lg"
              >
                <GraduationCap size={20} className="inline mr-2" />
                Submit as PASSED & Generate Certificate
              </button>
              <button
                onClick={() => handleSubmitGrade('fail')}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-lg font-bold transition-all shadow-lg"
              >
                <XCircle size={20} className="inline mr-2" />
                Submit as NEEDS REVISION
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-red-400 mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">Capstone Submission Management</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 font-semibold mb-1">Pending Review</p>
                <p className="text-4xl font-bold text-yellow-400">
                  {submissions.filter(s => s.status === 'pending').length}
                </p>
              </div>
              <Clock size={48} className="text-yellow-400 opacity-50" />
            </div>
          </div>
          <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 font-semibold mb-1">Passed</p>
                <p className="text-4xl font-bold text-emerald-400">
                  {submissions.filter(s => s.status === 'passed').length}
                </p>
              </div>
              <CheckCircle size={48} className="text-emerald-400 opacity-50" />
            </div>
          </div>
          <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 font-semibold mb-1">Needs Revision</p>
                <p className="text-4xl font-bold text-red-400">
                  {submissions.filter(s => s.status === 'failed').length}
                </p>
              </div>
              <XCircle size={48} className="text-red-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/90 rounded-xl p-4 mb-6 border border-slate-600">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student name, email, or paper title..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${filterStatus === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
              >
                All ({submissions.length})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${filterStatus === 'pending' ? 'bg-yellow-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
              >
                Pending ({submissions.filter(s => s.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilterStatus('passed')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${filterStatus === 'passed' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
              >
                Passed ({submissions.filter(s => s.status === 'passed').length})
              </button>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="bg-slate-800/50 rounded-xl p-12 text-center border border-slate-700">
              <FileText size={64} className="mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400 text-lg">No submissions found</p>
            </div>
          ) : (
            filteredSubmissions.map(submission => (
              <div
                key={submission.id}
                className="bg-slate-800/90 rounded-xl p-6 border border-slate-600 hover:border-indigo-500/50 transition-all cursor-pointer"
                onClick={() => setSelectedSubmission(submission)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{submission.paperTitle}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <User size={14} /> {submission.userName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail size={14} /> {submission.userEmail}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {new Date(submission.submittedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(submission.status)}
                </div>

                {submission.gradeResult && (
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-sm">
                        <span className="text-slate-300">
                          Score: <span className="font-bold text-emerald-400">{submission.gradeResult.totalScore}%</span>
                        </span>
                        <span className="text-slate-300">
                          Graded: {new Date(submission.gradeResult.gradedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-semibold transition-all">
                        View Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Certificate Editor Modal */}
        {showCertificateEditor && selectedSubmission && (
          <CertificateEditor
            studentName={selectedSubmission.userName}
            onClose={() => {
              setShowCertificateEditor(false);
              setSelectedSubmission(null);
              setGradeData({
                contentScore: 0,
                researchScore: 0,
                writingScore: 0,
                formatScore: 0,
                feedback: ''
              });
            }}
            onSave={(certificateData) => {
              alert(`Certificate generated and saved for ${certificateData.name}!\n\nThe student has been notified via email.`);
              setShowCertificateEditor(false);
              setSelectedSubmission(null);
              setGradeData({
                contentScore: 0,
                researchScore: 0,
                writingScore: 0,
                formatScore: 0,
                feedback: ''
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminGrading;
