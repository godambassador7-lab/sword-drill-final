import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  GraduationCap,
  Mail,
  Search,
  ShieldCheck,
  User,
  XCircle
} from 'lucide-react';
import CertificateEditor from './CertificateEditor';
import { getUserData, updateUserProgress } from '../services/dbService';
import {
  fetchRequiredWorkModerationQueue,
  submitInstructorReview,
  isCurrentUserAdmin
} from '../services/requiredWorkModeration';

const normalizeUnitId = (value) => {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  if (/^\d+$/.test(raw)) return raw.padStart(2, '0');
  return raw;
};

const defaultCapstoneGrade = {
  contentScore: 0,
  researchScore: 0,
  writingScore: 0,
  formatScore: 0,
  feedback: ''
};

const defaultRequiredWorkGrade = {
  textualEvidence: 18,
  keyTermIntegration: 18,
  argumentation: 18,
  depthAndCompleteness: 18,
  feedback: '',
  notes: '',
  plagiarismCheck: 'not-reviewed'
};

const AdminGrading = ({ onBack, onLogout }) => {
  const [activeTab, setActiveTab] = useState('requiredWork');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCertificateEditor, setShowCertificateEditor] = useState(false);

  const [capstoneSubmissions, setCapstoneSubmissions] = useState([]);
  const [selectedCapstoneSubmission, setSelectedCapstoneSubmission] = useState(null);
  const [capstoneGradeData, setCapstoneGradeData] = useState(defaultCapstoneGrade);

  const [requiredWorkSubmissions, setRequiredWorkSubmissions] = useState([]);
  const [selectedRequiredWork, setSelectedRequiredWork] = useState(null);
  const [requiredWorkGradeData, setRequiredWorkGradeData] = useState(defaultRequiredWorkGrade);
  const [reviewerName, setReviewerName] = useState('Instructor');
  const [savingReview, setSavingReview] = useState(false);
  const [adminVerified, setAdminVerified] = useState(false);

  useEffect(() => {
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
    setCapstoneSubmissions(mockSubmissions);
    fetchRequiredWorkModerationQueue().then(setRequiredWorkSubmissions).catch(() => setRequiredWorkSubmissions([]));
    isCurrentUserAdmin().then(setAdminVerified).catch(() => setAdminVerified(false));
  }, []);

  const refreshRequiredWork = () => {
    fetchRequiredWorkModerationQueue().then(setRequiredWorkSubmissions).catch(() => setRequiredWorkSubmissions([]));
  };

  const capstoneTotal = capstoneGradeData.contentScore + capstoneGradeData.researchScore + capstoneGradeData.writingScore + capstoneGradeData.formatScore;
  const capstonePassing = capstoneTotal >= 70;

  const requiredWorkTotal = requiredWorkGradeData.textualEvidence
    + requiredWorkGradeData.keyTermIntegration
    + requiredWorkGradeData.argumentation
    + requiredWorkGradeData.depthAndCompleteness;
  const requiredWorkPassing = requiredWorkTotal >= 70;

  const filteredCapstoneSubmissions = useMemo(() => {
    return capstoneSubmissions.filter((sub) => {
      const matchesFilter = filterStatus === 'all' || sub.status === filterStatus;
      const q = searchQuery.toLowerCase();
      const matchesSearch = sub.userName.toLowerCase().includes(q)
        || sub.paperTitle.toLowerCase().includes(q)
        || sub.userEmail.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [capstoneSubmissions, filterStatus, searchQuery]);

  const filteredRequiredWorkSubmissions = useMemo(() => {
    return requiredWorkSubmissions.filter((sub) => {
      const normalizedStatus = sub.status || 'pending_instructor_review';
      const matchesFilter = filterStatus === 'all' || normalizedStatus === filterStatus;
      const q = searchQuery.toLowerCase();
      const matchesSearch = [
        sub.courseTitle,
        sub.unitTitle,
        sub.taskTitle,
        sub.userId,
        sub.progressKey
      ].some((value) => String(value || '').toLowerCase().includes(q));
      return matchesFilter && matchesSearch;
    });
  }, [requiredWorkSubmissions, filterStatus, searchQuery]);

  const getCapstoneStatusBadge = (status) => {
    if (status === 'pending') return <span className="px-3 py-1 bg-yellow-900/50 text-yellow-300 rounded-full text-sm font-semibold flex items-center gap-1"><Clock size={14} /> Pending</span>;
    if (status === 'passed') return <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 rounded-full text-sm font-semibold flex items-center gap-1"><CheckCircle size={14} /> Passed</span>;
    return <span className="px-3 py-1 bg-red-900/50 text-red-300 rounded-full text-sm font-semibold flex items-center gap-1"><XCircle size={14} /> Needs Revision</span>;
  };

  const getRequiredWorkStatusBadge = (status) => {
    if (status === 'instructor_passed') return <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 rounded-full text-sm font-semibold flex items-center gap-1"><CheckCircle size={14} /> Instructor Passed</span>;
    if (status === 'instructor_revision_required') return <span className="px-3 py-1 bg-red-900/50 text-red-300 rounded-full text-sm font-semibold flex items-center gap-1"><XCircle size={14} /> Revision Required</span>;
    return <span className="px-3 py-1 bg-amber-900/50 text-amber-300 rounded-full text-sm font-semibold flex items-center gap-1"><ShieldCheck size={14} /> Pending Instructor Review</span>;
  };

  const openRequiredWorkSubmission = (submission) => {
    const auto = submission.autoRubric || {};
    setSelectedRequiredWork(submission);
    setRequiredWorkGradeData({
      textualEvidence: Number(auto.textualEvidence || 18),
      keyTermIntegration: Number(auto.keyTermIntegration || 18),
      argumentation: Number(auto.argumentation || 18),
      depthAndCompleteness: Number(auto.depthAndCompleteness || 18),
      feedback: Array.isArray(submission?.instructorReview?.feedback) ? submission.instructorReview.feedback.join('\n') : '',
      notes: String(submission?.instructorReview?.notes || ''),
      plagiarismCheck: String(submission?.instructorReview?.plagiarismCheck || 'not-reviewed')
    });
  };

  const handleSubmitCapstoneGrade = (status) => {
    const gradeResult = {
      contentScore: capstoneGradeData.contentScore,
      researchScore: capstoneGradeData.researchScore,
      writingScore: capstoneGradeData.writingScore,
      formatScore: capstoneGradeData.formatScore,
      totalScore: capstoneTotal,
      feedback: capstoneGradeData.feedback,
      gradedDate: new Date().toISOString(),
      status: status === 'pass' ? 'passed' : 'failed'
    };

    setCapstoneSubmissions((prev) => prev.map((sub) => (
      sub.id === selectedCapstoneSubmission.id
        ? { ...sub, status: status === 'pass' ? 'passed' : 'failed', gradeResult }
        : sub
    )));

    if (status === 'pass') {
      setShowCertificateEditor(true);
      return;
    }
    alert(`Grade submitted successfully. Score: ${capstoneTotal}%`);
    setSelectedCapstoneSubmission(null);
    setCapstoneGradeData(defaultCapstoneGrade);
  };

  const syncRequiredWorkReviewToStudentProgress = async (moderatedSubmission) => {
    if (!moderatedSubmission?.userId || !moderatedSubmission?.progressKey || !moderatedSubmission?.instructorReview) return;

    const userResp = await getUserData(moderatedSubmission.userId);
    if (!userResp?.success || !userResp?.progress) return;

    const progressBlob = userResp.progress[moderatedSubmission.progressKey] || {};
    const requiredWorkRecords = progressBlob.requiredWorkRecords && typeof progressBlob.requiredWorkRecords === 'object'
      ? { ...progressBlob.requiredWorkRecords }
      : {};

    const unitId = normalizeUnitId(moderatedSubmission.unitId);
    const taskIndex = Number(moderatedSubmission.taskIndex) || 0;
    const unitRecords = requiredWorkRecords[unitId] && typeof requiredWorkRecords[unitId] === 'object'
      ? { ...requiredWorkRecords[unitId] }
      : {};

    const currentTask = unitRecords[taskIndex] && typeof unitRecords[taskIndex] === 'object'
      ? { ...unitRecords[taskIndex] }
      : { submissionText: moderatedSubmission.submissionText || '' };

    unitRecords[taskIndex] = {
      ...currentTask,
      instructorReview: moderatedSubmission.instructorReview,
      rubric: moderatedSubmission.instructorReview.rubric,
      feedback: moderatedSubmission.instructorReview.feedback || currentTask.feedback || [],
      evaluatedAt: moderatedSubmission.instructorReview.reviewedAt || currentTask.evaluatedAt || new Date().toISOString()
    };
    requiredWorkRecords[unitId] = unitRecords;

    const updatedProgress = {
      ...progressBlob,
      requiredWorkRecords
    };

    await updateUserProgress(moderatedSubmission.userId, {
      [moderatedSubmission.progressKey]: updatedProgress
    });
  };

  const handleSubmitRequiredWorkReview = async (forceStatus = null) => {
    if (!selectedRequiredWork) return;
    setSavingReview(true);
    try {
      const rubric = {
        textualEvidence: Number(requiredWorkGradeData.textualEvidence || 0),
        keyTermIntegration: Number(requiredWorkGradeData.keyTermIntegration || 0),
        argumentation: Number(requiredWorkGradeData.argumentation || 0),
        depthAndCompleteness: Number(requiredWorkGradeData.depthAndCompleteness || 0)
      };
      const total = rubric.textualEvidence + rubric.keyTermIntegration + rubric.argumentation + rubric.depthAndCompleteness;
      const passed = forceStatus === null ? total >= 70 : forceStatus === 'pass';
      rubric.total = total;
      rubric.passed = passed;

      const updated = await submitInstructorReview(selectedRequiredWork.submissionId, {
        reviewer: reviewerName || 'Instructor',
        rubric,
        feedback: String(requiredWorkGradeData.feedback || '').split('\n').map((line) => line.trim()).filter(Boolean),
        notes: requiredWorkGradeData.notes,
        plagiarismCheck: requiredWorkGradeData.plagiarismCheck
      });

      if (updated) {
        await syncRequiredWorkReviewToStudentProgress(updated);
      }
      refreshRequiredWork();
      setSelectedRequiredWork(null);
      setRequiredWorkGradeData(defaultRequiredWorkGrade);
      alert(`Required-work review saved. Final score: ${total}%.`);
    } catch (err) {
      console.error('Failed to save required-work review:', err);
      alert('Failed to save review. Check console for details.');
    } finally {
      setSavingReview(false);
    }
  };

  if (selectedCapstoneSubmission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setSelectedCapstoneSubmission(null)} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all">
              <ArrowLeft size={20} />
              Back
            </button>
            {getCapstoneStatusBadge(selectedCapstoneSubmission.status)}
          </div>
          <div className="bg-slate-800/90 rounded-xl p-6 mb-6 border border-indigo-500/30">
            <h2 className="text-2xl font-bold text-indigo-400 mb-4">{selectedCapstoneSubmission.paperTitle}</h2>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-slate-300">
              <p className="flex items-center gap-2"><User size={16} className="text-indigo-300" />{selectedCapstoneSubmission.userName}</p>
              <p className="flex items-center gap-2"><Mail size={16} className="text-indigo-300" />{selectedCapstoneSubmission.userEmail}</p>
              <p className="flex items-center gap-2"><Calendar size={16} className="text-indigo-300" />{new Date(selectedCapstoneSubmission.submittedDate).toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-slate-800/90 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-purple-300 mb-4">Capstone Rubric</h3>
            {[
              ['contentScore', 'Content', 40],
              ['researchScore', 'Research', 30],
              ['writingScore', 'Writing', 20],
              ['formatScore', 'Format', 10]
            ].map(([key, label, max]) => (
              <div key={key} className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm text-slate-200">{label}</label>
                  <span className="text-sm text-indigo-300">{capstoneGradeData[key]}/{max}</span>
                </div>
                <input type="range" min="0" max={max} value={capstoneGradeData[key]} onChange={(e) => setCapstoneGradeData((prev) => ({ ...prev, [key]: parseInt(e.target.value, 10) }))} className="w-full" />
              </div>
            ))}
            <textarea value={capstoneGradeData.feedback} onChange={(e) => setCapstoneGradeData((prev) => ({ ...prev, feedback: e.target.value }))} rows={4} placeholder="Feedback for student" className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-sm mb-4" />
            <p className={`text-sm mb-4 ${capstonePassing ? 'text-emerald-300' : 'text-red-300'}`}>Total: {capstoneTotal}% ({capstonePassing ? 'Pass' : 'Needs Revision'})</p>
            <div className="flex gap-3">
              <button disabled={!capstonePassing} onClick={() => handleSubmitCapstoneGrade('pass')} className="flex-1 px-4 py-3 rounded bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700">Pass</button>
              <button onClick={() => handleSubmitCapstoneGrade('fail')} className="flex-1 px-4 py-3 rounded bg-red-600 hover:bg-red-500">Needs Revision</button>
            </div>
          </div>
          {showCertificateEditor && (
            <CertificateEditor
              studentName={selectedCapstoneSubmission.userName}
              onClose={() => { setShowCertificateEditor(false); setSelectedCapstoneSubmission(null); setCapstoneGradeData(defaultCapstoneGrade); }}
              onSave={() => { setShowCertificateEditor(false); setSelectedCapstoneSubmission(null); setCapstoneGradeData(defaultCapstoneGrade); }}
            />
          )}
        </div>
      </div>
    );
  }

  if (selectedRequiredWork) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setSelectedRequiredWork(null)} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all">
              <ArrowLeft size={20} />
              Back
            </button>
            {getRequiredWorkStatusBadge(selectedRequiredWork.status)}
          </div>
          <div className="bg-slate-800/90 rounded-xl p-6 mb-6 border border-indigo-500/30">
            <h2 className="text-2xl font-bold text-indigo-300 mb-2">{selectedRequiredWork.courseTitle || 'Course'} | {selectedRequiredWork.unitTitle}</h2>
            <p className="text-slate-300 text-sm mb-3">Task {Number(selectedRequiredWork.taskIndex) + 1}: {selectedRequiredWork.taskTitle}</p>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-slate-300">
              <p className="flex items-center gap-2"><User size={16} className="text-indigo-300" />Student ID: {selectedRequiredWork.userId || 'unknown'}</p>
              <p className="flex items-center gap-2"><FileText size={16} className="text-indigo-300" />Progress Key: {selectedRequiredWork.progressKey}</p>
              <p className="flex items-center gap-2"><Calendar size={16} className="text-indigo-300" />Submitted: {selectedRequiredWork.submittedAt ? new Date(selectedRequiredWork.submittedAt).toLocaleString() : 'unknown'}</p>
            </div>
          </div>
          <div className="bg-slate-800/90 rounded-xl p-6 mb-6 border border-slate-600">
            <h3 className="text-lg font-bold text-slate-100 mb-2">Student Submission</h3>
            <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{selectedRequiredWork.submissionText || '(No submission text)'}</p>
          </div>
          <div className="bg-slate-800/90 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-purple-300 mb-4">Instructor Override Rubric</h3>
            {!adminVerified && (
              <div className="mb-4 rounded border border-red-500/40 bg-red-900/20 p-3 text-sm text-red-200">
                Admin role not verified. Instructor review actions are disabled until your account has `role: "admin"` (or `isAdmin: true`) in Firestore `users/{uid}`.
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {[
                ['textualEvidence', 'Textual Evidence'],
                ['keyTermIntegration', 'Key-Term Integration'],
                ['argumentation', 'Argumentation'],
                ['depthAndCompleteness', 'Depth And Completeness']
              ].map(([key, label]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-slate-200">{label}</label>
                    <span className="text-sm text-indigo-300">{requiredWorkGradeData[key]}/25</span>
                  </div>
                  <input type="range" min="0" max="25" value={requiredWorkGradeData[key]} onChange={(e) => setRequiredWorkGradeData((prev) => ({ ...prev, [key]: parseInt(e.target.value, 10) }))} className="w-full" />
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} placeholder="Reviewer name" className="px-3 py-2 bg-slate-900 border border-slate-600 rounded text-sm" />
              <select value={requiredWorkGradeData.plagiarismCheck} onChange={(e) => setRequiredWorkGradeData((prev) => ({ ...prev, plagiarismCheck: e.target.value }))} className="px-3 py-2 bg-slate-900 border border-slate-600 rounded text-sm">
                <option value="not-reviewed">Plagiarism: Not Reviewed</option>
                <option value="clear">Plagiarism: Clear</option>
                <option value="concern">Plagiarism: Concern</option>
              </select>
            </div>
            <textarea value={requiredWorkGradeData.feedback} onChange={(e) => setRequiredWorkGradeData((prev) => ({ ...prev, feedback: e.target.value }))} rows={4} placeholder="Feedback lines (one per line)" className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-sm mb-3" />
            <textarea value={requiredWorkGradeData.notes} onChange={(e) => setRequiredWorkGradeData((prev) => ({ ...prev, notes: e.target.value }))} rows={3} placeholder="Instructor notes" className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-sm mb-3" />
            <p className={`text-sm mb-4 ${requiredWorkPassing ? 'text-emerald-300' : 'text-red-300'}`}>Override Total: {requiredWorkTotal}% ({requiredWorkPassing ? 'Pass' : 'Needs Revision'})</p>
            <div className="flex gap-3">
              <button disabled={savingReview || !adminVerified} onClick={() => handleSubmitRequiredWorkReview('pass')} className="flex-1 px-4 py-3 rounded bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700">Submit Instructor Pass</button>
              <button disabled={savingReview || !adminVerified} onClick={() => handleSubmitRequiredWorkReview('fail')} className="flex-1 px-4 py-3 rounded bg-red-600 hover:bg-red-500 disabled:bg-slate-700">Submit Revision Required</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pendingRequired = requiredWorkSubmissions.filter((s) => s.status === 'pending_instructor_review').length;
  const reviewedRequired = requiredWorkSubmissions.filter((s) => s.status === 'instructor_passed' || s.status === 'instructor_revision_required').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-red-400 mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">Capstone and Required-Work Moderation {adminVerified ? '| Admin verified' : '| Admin not verified'}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"><ArrowLeft size={20} />Back</button>
            <button onClick={onLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all">Logout</button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-amber-900/30 border border-amber-500/50 rounded-xl p-5">
            <p className="text-amber-300 font-semibold">Required Work Pending</p>
            <p className="text-3xl font-bold text-amber-200">{pendingRequired}</p>
          </div>
          <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-xl p-5">
            <p className="text-emerald-300 font-semibold">Required Work Reviewed</p>
            <p className="text-3xl font-bold text-emerald-200">{reviewedRequired}</p>
          </div>
          <div className="bg-indigo-900/30 border border-indigo-500/50 rounded-xl p-5">
            <p className="text-indigo-300 font-semibold">Capstones</p>
            <p className="text-3xl font-bold text-indigo-200">{capstoneSubmissions.length}</p>
          </div>
        </div>

        <div className="bg-slate-800/90 rounded-xl p-4 mb-6 border border-slate-600">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search submissions..." className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-600 rounded text-sm" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setActiveTab('requiredWork')} className={`px-4 py-2 rounded text-sm ${activeTab === 'requiredWork' ? 'bg-indigo-600' : 'bg-slate-700 hover:bg-slate-600'}`}>Required Work</button>
              <button onClick={() => setActiveTab('capstone')} className={`px-4 py-2 rounded text-sm ${activeTab === 'capstone' ? 'bg-indigo-600' : 'bg-slate-700 hover:bg-slate-600'}`}>Capstone</button>
              <button onClick={() => setFilterStatus('all')} className={`px-3 py-2 rounded text-sm ${filterStatus === 'all' ? 'bg-slate-500' : 'bg-slate-700'}`}>All</button>
            </div>
          </div>
        </div>

        {activeTab === 'requiredWork' ? (
          <div className="space-y-4">
            {filteredRequiredWorkSubmissions.length === 0 ? (
              <div className="bg-slate-800/50 rounded-xl p-10 text-center border border-slate-700">
                <ShieldCheck size={48} className="mx-auto mb-2 text-slate-500" />
                <p className="text-slate-400">No required-work submissions found.</p>
              </div>
            ) : filteredRequiredWorkSubmissions.map((submission) => (
              <button key={submission.submissionId} onClick={() => openRequiredWorkSubmission(submission)} className="w-full text-left bg-slate-800/90 rounded-xl p-5 border border-slate-600 hover:border-indigo-500/50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">{submission.courseTitle || 'Course'} | {submission.unitTitle}</h3>
                  {getRequiredWorkStatusBadge(submission.status)}
                </div>
                <p className="text-sm text-slate-300 mb-2">Task {Number(submission.taskIndex) + 1}: {submission.taskTitle}</p>
                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  <span>User: {submission.userId || 'unknown'}</span>
                  <span>Progress Key: {submission.progressKey}</span>
                  <span>Submitted: {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'unknown'}</span>
                  {submission.autoRubric?.total !== undefined && <span>Auto Score: {submission.autoRubric.total}%</span>}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCapstoneSubmissions.length === 0 ? (
              <div className="bg-slate-800/50 rounded-xl p-10 text-center border border-slate-700">
                <FileText size={48} className="mx-auto mb-2 text-slate-500" />
                <p className="text-slate-400">No capstone submissions found.</p>
              </div>
            ) : filteredCapstoneSubmissions.map((submission) => (
              <button key={submission.id} onClick={() => setSelectedCapstoneSubmission(submission)} className="w-full text-left bg-slate-800/90 rounded-xl p-5 border border-slate-600 hover:border-indigo-500/50 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">{submission.paperTitle}</h3>
                  {getCapstoneStatusBadge(submission.status)}
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><User size={12} />{submission.userName}</span>
                  <span className="flex items-center gap-1"><Mail size={12} />{submission.userEmail}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} />{new Date(submission.submittedDate).toLocaleDateString()}</span>
                  {submission.gradeResult && <span>Score: {submission.gradeResult.totalScore}%</span>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGrading;
