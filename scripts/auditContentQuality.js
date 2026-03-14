/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TARGET_DIRS = ['src/data', 'public'];
const REPORT_DIR = path.join(ROOT, 'reports');
const REPORT_JSON = path.join(REPORT_DIR, 'content-audit.json');
const REPORT_MD = path.join(REPORT_DIR, 'content-audit.md');

const SKIP_DIR_FRAGMENTS = [
  'noto-emoji',
  'strongs-master',
  'detailed_world_map_package',
  'biblical-feast-days-repo'
];

const REF_RE = /\b(?:[1-3]\s)?[A-Za-z][A-Za-z.'-]*(?:\s+[A-Za-z][A-Za-z.'-]*){0,3}\s\d{1,3}(?::\d{1,3}(?:[-–—]\d{1,3})?)?\b/g;

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

function extractRefsFromObject(item) {
  const refs = new Set();
  const capture = (value) => {
    if (typeof value !== 'string') return;
    const matches = value.match(REF_RE) || [];
    for (const m of matches) refs.add(m.trim());
  };

  capture(item.reference);
  capture(item.question);
  capture(item.text);
  capture(item.explanation);

  if (Array.isArray(item.scriptureRefs)) {
    item.scriptureRefs.forEach((r) => capture(String(r)));
  }

  return Array.from(refs);
}

function hasUsableSourceRefs(item) {
  return Array.isArray(item.sourceRefs) && item.sourceRefs.some((ref) => String(ref || '').trim().length >= 8);
}

function scoreItem(item) {
  const explanation = typeof item.explanation === 'string' ? item.explanation.trim() : '';
  const referenceText = typeof item.reference === 'string' ? item.reference.trim() : '';
  const hasPlaceholderReference = referenceText.toLowerCase().includes('citation needed');
  const refs = extractRefsFromObject(item);
  const hasSourceRefs = hasUsableSourceRefs(item);
  const hasMethodTag = Boolean(
    item.truthType || item.method || item.claimType || item.category || item.domain || item.topicTag
  );
  const options = Array.isArray(item.options) ? item.options : Array.isArray(item.choices) ? item.choices : [];
  const hasKeyedAnswer = Object.prototype.hasOwnProperty.call(item, 'correct') || Object.prototype.hasOwnProperty.call(item, 'answer');

  let points = 0;
  if (refs.length >= 1 || hasSourceRefs) points += 4;
  else if (referenceText.length > 0 && !hasPlaceholderReference) points += 2;
  if (explanation.length >= 24) points += 3;
  if (hasMethodTag) points += 2;
  if (options.length >= 2 || hasKeyedAnswer) points += 1;

  const score = Math.min(10, points);
  const issues = [];
  if (refs.length === 0 && !hasSourceRefs && (referenceText.length === 0 || hasPlaceholderReference)) {
    issues.push('missing_reference');
  }
  if (explanation.length < 24) issues.push('missing_or_short_explanation');
  if (!hasMethodTag) issues.push('missing_method_tag');
  if (hasPlaceholderReference) issues.push('placeholder_reference');

  return {
    score,
    refsCount: refs.length,
    hasReferenceText: referenceText.length > 0,
    hasSourceRefs,
    hasExplanation: explanation.length >= 24,
    hasMethodTag,
    issues
  };
}

function findQuestionItems(node, collector = [], trail = '') {
  if (Array.isArray(node)) {
    node.forEach((child, idx) => findQuestionItems(child, collector, `${trail}[${idx}]`));
    return collector;
  }
  if (!node || typeof node !== 'object') return collector;

  if (isQuestionLike(node)) {
    collector.push({ node, trail });
  }

  for (const [key, value] of Object.entries(node)) {
    findQuestionItems(value, collector, trail ? `${trail}.${key}` : key);
  }
  return collector;
}

function toPercent(value) {
  return `${Math.round(value * 100)}%`;
}

function ensureReportDir() {
  if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });
}

function main() {
  const files = TARGET_DIRS.flatMap((dir) => walkJsonFiles(path.join(ROOT, dir)));
  const fileReports = [];
  let totalItems = 0;
  let totalScore = 0;
  let refsPresent = 0;
  let sourceRefsPresent = 0;
  let explanationsPresent = 0;
  let methodTagsPresent = 0;
  const issueCounts = {
    missing_reference: 0,
    missing_or_short_explanation: 0,
    missing_method_tag: 0,
    placeholder_reference: 0
  };

  for (const filePath of files) {
    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      continue;
    }

    const questions = findQuestionItems(parsed);
    if (questions.length === 0) continue;

    let fileScoreSum = 0;
    let fileRefs = 0;
    let fileSourceRefs = 0;
    let fileExpl = 0;
    let fileMethod = 0;
    const fileIssueCounts = {
      missing_reference: 0,
      missing_or_short_explanation: 0,
      missing_method_tag: 0,
      placeholder_reference: 0
    };

    questions.forEach(({ node }) => {
      const evalResult = scoreItem(node);
      fileScoreSum += evalResult.score;
      if (evalResult.refsCount > 0 || evalResult.hasReferenceText || evalResult.hasSourceRefs) fileRefs += 1;
      if (evalResult.hasSourceRefs) fileSourceRefs += 1;
      if (evalResult.hasExplanation) fileExpl += 1;
      if (evalResult.hasMethodTag) fileMethod += 1;
      evalResult.issues.forEach((issue) => {
        fileIssueCounts[issue] += 1;
        issueCounts[issue] += 1;
      });
    });

    totalItems += questions.length;
    totalScore += fileScoreSum;
    refsPresent += fileRefs;
    sourceRefsPresent += fileSourceRefs;
    explanationsPresent += fileExpl;
    methodTagsPresent += fileMethod;

    fileReports.push({
      file: path.relative(ROOT, filePath).replace(/\\/g, '/'),
      items: questions.length,
      avgScore: Number((fileScoreSum / questions.length).toFixed(2)),
      referenceCoverage: Number((fileRefs / questions.length).toFixed(3)),
      sourceReferenceCoverage: Number((fileSourceRefs / questions.length).toFixed(3)),
      explanationCoverage: Number((fileExpl / questions.length).toFixed(3)),
      methodTagCoverage: Number((fileMethod / questions.length).toFixed(3)),
      issues: fileIssueCounts
    });
  }

  fileReports.sort((a, b) => a.avgScore - b.avgScore);
  const overall = {
    totalFiles: fileReports.length,
    totalItems,
    avgScore: totalItems ? Number((totalScore / totalItems).toFixed(2)) : 0,
    referenceCoverage: totalItems ? Number((refsPresent / totalItems).toFixed(3)) : 0,
    sourceReferenceCoverage: totalItems ? Number((sourceRefsPresent / totalItems).toFixed(3)) : 0,
    explanationCoverage: totalItems ? Number((explanationsPresent / totalItems).toFixed(3)) : 0,
    methodTagCoverage: totalItems ? Number((methodTagsPresent / totalItems).toFixed(3)) : 0,
    issues: issueCounts
  };

  ensureReportDir();
  fs.writeFileSync(
    REPORT_JSON,
    JSON.stringify({ generatedAt: new Date().toISOString(), overall, files: fileReports }, null, 2),
    'utf8'
  );

  const worst = fileReports.slice(0, 20);
  const lines = [];
  lines.push('# Content Audit Report');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## Overall');
  lines.push('');
  lines.push(`- Files audited: ${overall.totalFiles}`);
  lines.push(`- Question-like items audited: ${overall.totalItems}`);
  lines.push(`- Average quality score: ${overall.avgScore}/10`);
  lines.push(`- Reference coverage: ${toPercent(overall.referenceCoverage)}`);
  lines.push(`- Source-reference coverage: ${toPercent(overall.sourceReferenceCoverage)}`);
  lines.push(`- Explanation coverage: ${toPercent(overall.explanationCoverage)}`);
  lines.push(`- Method-tag coverage: ${toPercent(overall.methodTagCoverage)}`);
  lines.push('');
  lines.push('## Open Gaps');
  lines.push('');
  lines.push(`- Missing reference: ${overall.issues.missing_reference}`);
  lines.push(`- Placeholder reference (manual review): ${overall.issues.placeholder_reference}`);
  lines.push(`- Missing/short explanation: ${overall.issues.missing_or_short_explanation}`);
  lines.push(`- Missing method tag: ${overall.issues.missing_method_tag}`);
  lines.push('');
  lines.push('## Lowest Scoring Files (Top 20)');
  lines.push('');
  lines.push('| File | Items | Avg Score | Ref Cov | Source Cov | Expl Cov | Method Cov |');
  lines.push('|---|---:|---:|---:|---:|---:|---:|');
  worst.forEach((f) => {
    lines.push(`| ${f.file} | ${f.items} | ${f.avgScore} | ${toPercent(f.referenceCoverage)} | ${toPercent(f.sourceReferenceCoverage)} | ${toPercent(f.explanationCoverage)} | ${toPercent(f.methodTagCoverage)} |`);
  });
  lines.push('');
  lines.push('## Next Actions');
  lines.push('');
  lines.push('1. Replace any remaining placeholder references with specific canonical or primary sources.');
  lines.push('2. For non-scripture factual items, attach at least one `sourceRefs` citation per question.');
  lines.push('3. Keep explanations concise but specific (what makes the keyed answer correct).');

  fs.writeFileSync(REPORT_MD, `${lines.join('\n')}\n`, 'utf8');

  console.log('Content audit complete.');
  console.log(`Report JSON: ${path.relative(ROOT, REPORT_JSON)}`);
  console.log(`Report MD: ${path.relative(ROOT, REPORT_MD)}`);
  console.log(`Audited files: ${overall.totalFiles}`);
  console.log(`Audited items: ${overall.totalItems}`);
  console.log(`Average score: ${overall.avgScore}/10`);
}

main();

