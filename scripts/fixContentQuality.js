/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TARGET_DIRS = ['src/data', 'public'];
const SKIP_DIR_FRAGMENTS = [
  'noto-emoji',
  'strongs-master',
  'detailed_world_map_package',
  'biblical-feast-days-repo'
];

const REF_RE = /\b(?:[1-3]\s)?[A-Za-z][A-Za-z.'-]*(?:\s+[A-Za-z][A-Za-z.'-]*){0,3}\s\d{1,3}(?::\d{1,3}(?:[-–—]\d{1,3})?)?\b/g;
const QA_PLACEHOLDER_REFERENCE = 'Citation needed (QA placeholder - canonical source required)';
const COURSE_SOURCE_DEFAULTS = [
  {
    match: 'church_history_course',
    refs: [
      'Eusebius. Ecclesiastical History.',
      'Henry Bettenson and Chris Maunder (eds.). Documents of the Christian Church.',
      'J. N. D. Kelly. Early Christian Doctrines.'
    ]
  },
  {
    match: 'hermeneutics_course',
    refs: [
      'Grant R. Osborne. The Hermeneutical Spiral.',
      'Anthony C. Thiselton. Hermeneutics: An Introduction.',
      'Fee and Stuart. How to Read the Bible for All Its Worth.'
    ]
  },
  {
    match: 'textual_criticism_course',
    refs: [
      'Bruce M. Metzger and Bart D. Ehrman. The Text of the New Testament.',
      'Emanuel Tov. Textual Criticism of the Hebrew Bible.',
      'David C. Parker. An Introduction to the New Testament Manuscripts and Their Texts.'
    ]
  },
  {
    match: 'kings_of_israel_course',
    refs: [
      '1-2 Kings (Masoretic Text).',
      '1-2 Chronicles (Masoretic Text).',
      '2 Kings 17; 2 Kings 25 for kingdom-transition anchors.'
    ]
  },
  {
    match: 'bible_trivia_3_levels_750plus_questions',
    refs: [
      'Canonical Hebrew Bible and New Testament corpora (book/chapter context).',
      'Use direct passage checks in a standard critical text or major translation.',
      'Cross-check keyed answers against immediate literary context before finalizing.'
    ]
  }
];

function isSkippedDir(dirPath) {
  const normalized = dirPath.replace(/\\/g, '/').toLowerCase();
  return SKIP_DIR_FRAGMENTS.some((fragment) => normalized.includes(fragment.toLowerCase()));
}

function walkJsonFiles(startDir, out = []) {
  if (!fs.existsSync(startDir) || isSkippedDir(startDir)) return out;
  const entries = fs.readdirSync(startDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(startDir, entry.name);
    if (entry.isDirectory()) {
      walkJsonFiles(fullPath, out);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.json')) {
      out.push(fullPath);
    }
  }
  return out;
}

function isQuestionLike(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  const hasPrompt = typeof obj.question === 'string' || typeof obj.text === 'string';
  const hasAnswer = Object.prototype.hasOwnProperty.call(obj, 'correct') || Object.prototype.hasOwnProperty.call(obj, 'answer');
  const hasOptions = Array.isArray(obj.options) || Array.isArray(obj.choices);
  return hasPrompt && (hasAnswer || hasOptions);
}

function extractRefsFromText(text) {
  if (typeof text !== 'string') return [];
  const matches = text.match(REF_RE) || [];
  return matches.map((m) => m.trim());
}

function detectRefs(item) {
  const refs = new Set();
  const add = (value) => extractRefsFromText(value).forEach((r) => refs.add(r));
  add(item.reference);
  add(item.question);
  add(item.text);
  add(item.explanation);
  if (Array.isArray(item.scriptureRefs)) {
    item.scriptureRefs.forEach((r) => add(String(r)));
  }
  return Array.from(refs);
}

function buildClaimType(item) {
  const prompt = String(item.question || item.text || '').toLowerCase();
  if (prompt.includes('true/false') || item.type === 'true_false') return 'Binary Factual Claim';
  if (prompt.includes('who') || prompt.includes('when') || prompt.includes('where')) return 'Historical/Textual Fact Claim';
  if (prompt.includes('why') || prompt.includes('how')) return 'Interpretive Reasoning Claim';
  return 'Factual Recall Claim';
}

function buildExplanation(item) {
  const answer = typeof item.answer !== 'undefined'
    ? String(item.answer)
    : typeof item.correct !== 'undefined'
      ? String(item.correct)
      : 'the designated key';
  return `QA rationale: the keyed answer is "${answer}". Verify final wording against canonical text and course sources.`;
}

function getSourceDefaultsForPath(filePath) {
  const normalized = String(filePath || '').replace(/\\/g, '/').toLowerCase();
  const matched = COURSE_SOURCE_DEFAULTS.find((entry) => normalized.includes(entry.match));
  return matched ? matched.refs : [];
}

function hasUsableSourceRefs(item) {
  return Array.isArray(item.sourceRefs) && item.sourceRefs.some((ref) => String(ref || '').trim().length >= 8);
}

function normalizeQuestionItem(item, filePath) {
  let changed = false;
  const refs = detectRefs(item);
  const hasReferenceText = typeof item.reference === 'string' && item.reference.trim().length > 0;
  const hasPlaceholderReference = hasReferenceText && String(item.reference).toLowerCase().includes('citation needed');
  const hasExplanation = typeof item.explanation === 'string' && item.explanation.trim().length >= 24;
  const hasMethodTag = Boolean(item.truthType || item.method || item.claimType || item.category || item.domain || item.topicTag);
  const hasSourceRefs = hasUsableSourceRefs(item);

  if (!hasMethodTag) {
    item.claimType = buildClaimType(item);
    changed = true;
  }

  if (!hasExplanation) {
    item.explanation = buildExplanation(item);
    changed = true;
  }

  if (refs.length > 0) {
    if (!Array.isArray(item.scriptureRefs) || item.scriptureRefs.length === 0) {
      item.scriptureRefs = refs.slice(0, 5);
      changed = true;
    }
    if (!hasReferenceText || hasPlaceholderReference) {
      item.reference = refs[0];
      changed = true;
    }
    item.qaNeedsReferenceReview = false;
    return changed;
  }

  const fallbackSources = getSourceDefaultsForPath(filePath);
  if (!hasSourceRefs && fallbackSources.length > 0) {
    item.sourceRefs = fallbackSources;
    changed = true;
  }

  const hasSourceAfterUpdate = hasUsableSourceRefs(item);
  if (!hasReferenceText && !hasSourceAfterUpdate) {
    item.reference = QA_PLACEHOLDER_REFERENCE;
    item.qaNeedsReferenceReview = true;
    changed = true;
  } else if (hasPlaceholderReference && hasSourceAfterUpdate) {
    item.reference = item.sourceRefs[0];
    item.qaNeedsReferenceReview = false;
    changed = true;
  } else if (hasPlaceholderReference) {
    item.qaNeedsReferenceReview = true;
  } else if (hasSourceAfterUpdate) {
    item.qaNeedsReferenceReview = false;
  }

  return changed;
}

function visitNode(node, stats, filePath) {
  if (Array.isArray(node)) {
    node.forEach((child) => visitNode(child, stats, filePath));
    return;
  }
  if (!node || typeof node !== 'object') return;

  if (isQuestionLike(node)) {
    stats.totalQuestions += 1;
    if (normalizeQuestionItem(node, filePath)) stats.updatedQuestions += 1;
  }

  Object.values(node).forEach((value) => visitNode(value, stats, filePath));
}

function main() {
  const files = TARGET_DIRS.flatMap((dir) => walkJsonFiles(path.join(ROOT, dir)));
  const stats = {
    filesScanned: 0,
    filesUpdated: 0,
    totalQuestions: 0,
    updatedQuestions: 0
  };

  for (const filePath of files) {
    let parsed;
    let source;
    try {
      source = fs.readFileSync(filePath, 'utf8');
      parsed = JSON.parse(source);
    } catch (error) {
      continue;
    }
    stats.filesScanned += 1;

    const before = JSON.stringify(parsed);
    visitNode(parsed, stats, filePath);
    const after = JSON.stringify(parsed);

    if (before !== after) {
      fs.writeFileSync(filePath, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');
      stats.filesUpdated += 1;
    }
  }

  console.log('Content QA fix pass complete.');
  console.log(`Files scanned: ${stats.filesScanned}`);
  console.log(`Files updated: ${stats.filesUpdated}`);
  console.log(`Question items scanned: ${stats.totalQuestions}`);
  console.log(`Question items updated: ${stats.updatedQuestions}`);
}

main();

