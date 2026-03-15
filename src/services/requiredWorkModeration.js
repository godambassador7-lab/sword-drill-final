import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { auth, db } from './firebase';

const REQUIRED_WORK_QUEUE_KEY = 'requiredWorkModerationQueue';
const REQUIRED_WORK_COLLECTION = 'requiredWorkModeration';

const safeJsonParse = (raw) => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
};

const normalizeUnitId = (value) => {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  if (/^\d+$/.test(raw)) return raw.padStart(2, '0');
  return raw;
};

const normalizeQueueItems = (items) => (
  Array.isArray(items) ? items.filter((item) => item && typeof item === 'object') : []
);

const makeSubmissionId = ({ userId, progressKey, unitId, taskIndex }) => {
  return [
    String(userId || 'anonymous').trim() || 'anonymous',
    String(progressKey || 'unknownProgress').trim() || 'unknownProgress',
    normalizeUnitId(unitId) || 'unknownUnit',
    Number.isInteger(Number(taskIndex)) ? Number(taskIndex) : 0
  ].join('::');
};

const getLocalQueue = () => {
  const parsed = safeJsonParse(localStorage.getItem(REQUIRED_WORK_QUEUE_KEY));
  return normalizeQueueItems(parsed);
};

const saveLocalQueue = (items) => {
  localStorage.setItem(REQUIRED_WORK_QUEUE_KEY, JSON.stringify(normalizeQueueItems(items)));
};

const upsertLocalQueueItem = (nextItem) => {
  const queue = getLocalQueue();
  const existingIndex = queue.findIndex((item) => item.submissionId === nextItem.submissionId);
  if (existingIndex >= 0) {
    queue[existingIndex] = { ...queue[existingIndex], ...nextItem };
  } else {
    queue.unshift(nextItem);
  }
  saveLocalQueue(queue);
  return nextItem;
};

const firestoreDocToModerationItem = (snapshot) => {
  const data = snapshot.data() || {};
  return {
    submissionId: snapshot.id,
    userId: data.userId || '',
    progressKey: data.progressKey || '',
    courseId: data.courseId || '',
    courseTitle: data.courseTitle || '',
    unitId: normalizeUnitId(data.unitId),
    unitTitle: data.unitTitle || '',
    taskIndex: Number(data.taskIndex) || 0,
    taskTitle: data.taskTitle || '',
    submissionText: String(data.submissionText || ''),
    autoRubric: data.autoRubric || null,
    autoFeedback: Array.isArray(data.autoFeedback) ? data.autoFeedback.filter(Boolean) : [],
    submittedAt: data.submittedAt || null,
    updatedAt: data.updatedAt || null,
    status: data.status || 'pending_instructor_review',
    instructorReview: data.instructorReview || null
  };
};

const toModerationItem = (payload = {}) => {
  const now = new Date().toISOString();
  return {
    submissionId: makeSubmissionId(payload),
    userId: payload.userId || '',
    progressKey: payload.progressKey || '',
    courseId: payload.courseId || '',
    courseTitle: payload.courseTitle || '',
    unitId: normalizeUnitId(payload.unitId),
    unitTitle: payload.unitTitle || '',
    taskIndex: Number(payload.taskIndex) || 0,
    taskTitle: payload.taskTitle || '',
    submissionText: String(payload.submissionText || '').trim(),
    autoRubric: payload.autoRubric || null,
    autoFeedback: Array.isArray(payload.autoFeedback) ? payload.autoFeedback.filter(Boolean) : [],
    submittedAt: payload.submittedAt || now,
    updatedAt: now,
    status: payload.status || 'pending_instructor_review',
    instructorReview: payload.instructorReview || null
  };
};

const saveModerationItemToFirestore = async (item) => {
  const now = new Date().toISOString();
  const ref = doc(db, REQUIRED_WORK_COLLECTION, item.submissionId);
  await setDoc(ref, {
    ...item,
    updatedAt: now,
    updatedAtServer: serverTimestamp()
  }, { merge: true });
  return { ...item, updatedAt: now };
};

export const getRequiredWorkModerationQueue = () => getLocalQueue();

export const fetchRequiredWorkModerationQueue = async () => {
  try {
    const q = query(collection(db, REQUIRED_WORK_COLLECTION), orderBy('updatedAtServer', 'desc'));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(firestoreDocToModerationItem);
    saveLocalQueue(items);
    return items;
  } catch (err) {
    console.error('Failed to fetch moderation queue from Firestore, using local cache:', err);
    return getLocalQueue();
  }
};

export const isCurrentUserAdmin = async () => {
  try {
    const user = auth.currentUser;
    if (!user?.uid) return false;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const roleData = userDoc.data() || {};
    return roleData.role === 'admin' || roleData.isAdmin === true;
  } catch (err) {
    console.error('Failed to check admin role:', err);
    return false;
  }
};

export const enqueueRequiredWorkSubmission = (payload = {}) => {
  const nextItem = toModerationItem(payload);
  upsertLocalQueueItem(nextItem);

  if (auth.currentUser?.uid) {
    saveModerationItemToFirestore(nextItem).catch((err) => {
      console.error('Failed to persist required-work submission to Firestore:', err);
    });
  }
  return nextItem;
};

export const findRequiredWorkReview = ({ userId, progressKey, unitId, taskIndex }) => {
  const submissionId = makeSubmissionId({ userId, progressKey, unitId, taskIndex });
  const queue = getLocalQueue();
  return queue.find((item) => item.submissionId === submissionId) || null;
};

export const applyRequiredWorkInstructorReview = (submissionId, reviewPayload = {}) => {
  const queue = getLocalQueue();
  const index = queue.findIndex((item) => item.submissionId === submissionId);
  if (index < 0) return null;

  const current = queue[index];
  const reviewedAt = new Date().toISOString();
  const rubric = reviewPayload?.rubric || {};
  const total = Number(rubric.total || 0);
  const passed = Boolean(rubric.passed);
  const status = passed ? 'instructor_passed' : 'instructor_revision_required';

  const next = {
    ...current,
    instructorReview: {
      reviewer: reviewPayload.reviewer || 'Instructor',
      reviewedAt,
      rubric: {
        textualEvidence: Number(rubric.textualEvidence || 0),
        keyTermIntegration: Number(rubric.keyTermIntegration || 0),
        argumentation: Number(rubric.argumentation || 0),
        depthAndCompleteness: Number(rubric.depthAndCompleteness || 0),
        total,
        passed
      },
      feedback: Array.isArray(reviewPayload.feedback) ? reviewPayload.feedback.filter(Boolean) : [],
      notes: String(reviewPayload.notes || '').trim(),
      plagiarismCheck: String(reviewPayload.plagiarismCheck || 'not-reviewed')
    },
    status,
    updatedAt: reviewedAt
  };

  upsertLocalQueueItem(next);
  return next;
};

export const submitInstructorReview = async (submissionId, reviewPayload = {}) => {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) throw new Error('Admin role required for instructor review.');

  const moderated = applyRequiredWorkInstructorReview(submissionId, reviewPayload);
  if (!moderated) throw new Error('Submission not found.');

  await saveModerationItemToFirestore(moderated);
  return moderated;
};

const requiredWorkModeration = {
  getRequiredWorkModerationQueue,
  fetchRequiredWorkModerationQueue,
  enqueueRequiredWorkSubmission,
  findRequiredWorkReview,
  applyRequiredWorkInstructorReview,
  submitInstructorReview,
  isCurrentUserAdmin
};

export default requiredWorkModeration;
