/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CASES_PATH = path.join(ROOT, 'src', 'data', 'evals', 'sharp-ai-cases.json');
const DEFAULT_REPORT_PATH = path.join(ROOT, 'reports', 'sharp-ai-eval-report.json');

function parseArgs(argv) {
  const args = {};
  for (const raw of argv) {
    if (!raw.startsWith('--')) continue;
    const [key, ...valueParts] = raw.slice(2).split('=');
    args[key] = valueParts.length ? valueParts.join('=') : true;
  }
  return args;
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}

function validateCases(cases) {
  const errors = [];
  const ids = new Set();
  if (!Array.isArray(cases) || cases.length === 0) return ['Evaluation set must be a non-empty array.'];

  for (const [index, item] of cases.entries()) {
    const label = item?.id || `index ${index}`;
    if (!item?.id) errors.push(`${label}: missing id`);
    if (ids.has(item?.id)) errors.push(`${label}: duplicate id`);
    ids.add(item?.id);
    if (!item?.category) errors.push(`${label}: missing category`);
    if (!item?.question) errors.push(`${label}: missing question`);
    if (!item?.localAnswer) errors.push(`${label}: missing localAnswer`);
    if (!Array.isArray(item?.evidence) || item.evidence.length === 0) errors.push(`${label}: missing evidence`);
    if (!Array.isArray(item?.requiredConcepts) || item.requiredConcepts.length === 0) {
      errors.push(`${label}: requiredConcepts must contain at least one concept group`);
    } else if (item.requiredConcepts.some((group) => !Array.isArray(group) || group.length === 0)) {
      errors.push(`${label}: every requiredConcepts entry must be a non-empty string array`);
    }
    if (!Number.isInteger(item?.maxWords) || item.maxWords < 50) errors.push(`${label}: maxWords must be an integer >= 50`);
  }
  return errors;
}

function includesAny(text, terms) {
  return terms.some((term) => text.includes(String(term).toLowerCase()));
}

function scoreAnswer(item, status, body) {
  const answer = String(body?.content || '').trim();
  const normalized = answer.toLowerCase();
  const wordCount = answer ? answer.split(/\s+/).length : 0;
  const conceptChecks = item.requiredConcepts.map((terms) => ({
    terms,
    passed: includesAny(normalized, terms)
  }));
  const forbiddenChecks = (item.mustNotInclude || []).map((term) => ({
    term,
    passed: !normalized.includes(String(term).toLowerCase())
  }));
  const conceptPassCount = conceptChecks.filter((check) => check.passed).length;
  const conceptCoverage = conceptChecks.length ? conceptPassCount / conceptChecks.length : 0;
  const statusPassed = status === 200 && Boolean(answer);
  const forbiddenPassed = forbiddenChecks.every((check) => check.passed);
  const lengthPassed = wordCount > 0 && wordCount <= item.maxWords;
  const score = Math.round(
    (statusPassed ? 40 : 0) +
    (conceptCoverage * 45) +
    (forbiddenPassed ? 10 : 0) +
    (lengthPassed ? 5 : 0)
  );

  return {
    passed: statusPassed && conceptCoverage === 1 && forbiddenPassed && lengthPassed,
    score,
    statusPassed,
    conceptCoverage: Number((conceptCoverage * 100).toFixed(1)),
    conceptChecks,
    forbiddenPassed,
    forbiddenChecks,
    lengthPassed,
    wordCount,
    answer
  };
}

function createResponse() {
  return {
    code: 200,
    body: null,
    headers: {},
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; }
  };
}

function summarizeByCategory(results) {
  const categories = {};
  for (const result of results) {
    const current = categories[result.category] || { total: 0, passed: 0, scoreSum: 0 };
    current.total += 1;
    current.passed += result.passed ? 1 : 0;
    current.scoreSum += result.score;
    categories[result.category] = current;
  }
  for (const value of Object.values(categories)) {
    value.passRate = Number(((value.passed / value.total) * 100).toFixed(1));
    value.averageScore = Number((value.scoreSum / value.total).toFixed(1));
    delete value.scoreSum;
  }
  return categories;
}

async function main() {
  loadEnvFile(path.join(ROOT, '.env'));
  loadEnvFile(path.join(ROOT, '.env.local'));

  const args = parseArgs(process.argv.slice(2));
  const cases = JSON.parse(fs.readFileSync(CASES_PATH, 'utf8'));
  const validationErrors = validateCases(cases);
  if (validationErrors.length) {
    console.error(`Evaluation data has ${validationErrors.length} error(s):`);
    validationErrors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  let selected = cases;
  if (args.category) selected = selected.filter((item) => item.category === args.category);
  if (args.case) selected = selected.filter((item) => item.id === args.case);
  if (args.limit) selected = selected.slice(0, Math.max(1, Number(args.limit) || 1));

  const provider = args.provider || process.env.SHARP_AI_PROVIDER;
  const validateOnly = args['validate-only'] || !provider;
  if (validateOnly) {
    const categories = [...new Set(cases.map((item) => item.category))];
    console.log(`SHARP AI evaluation data valid: ${cases.length} cases across ${categories.length} categories.`);
    console.log(`Categories: ${categories.join(', ')}`);
    console.log('Pass --provider=ollama, --provider=cloudflare, or --provider=dashscope to run model evaluation.');
    return;
  }

  process.env.SHARP_AI_PROVIDER = String(provider).toLowerCase();
  if (args['max-tokens']) process.env.OLLAMA_MAX_TOKENS = String(args['max-tokens']);
  const handler = require('../api/qwen');
  const reportPath = args.output ? path.resolve(ROOT, String(args.output)) : DEFAULT_REPORT_PATH;
  if (!reportPath.startsWith(`${ROOT}${path.sep}`)) {
    throw new Error('Evaluation output must stay inside the project workspace.');
  }
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  const results = [];
  const startedAt = Date.now();

  console.log(`Running ${selected.length} SHARP AI case(s) with provider=${process.env.SHARP_AI_PROVIDER}...`);
  for (const [index, item] of selected.entries()) {
    const response = createResponse();
    const caseStartedAt = Date.now();
    await handler({
      method: 'POST',
      headers: { 'x-forwarded-for': `sharp-eval-${index + 1}` },
      body: {
        question: item.question,
        localAnswer: item.localAnswer,
        citations: item.citations || [],
        evidence: item.evidence,
        appContext: item.appContext || {
          selectedTranslation: 'ESV',
          capabilities: ['Bible reader', 'Study plans', 'Courses', "Strong's word study", 'Quizzes and progress tracking']
        },
        conversationHistory: []
      }
    }, response);

    const scored = scoreAnswer(item, response.code, response.body);
    const result = {
      id: item.id,
      category: item.category,
      provider: response.body?.provider || process.env.SHARP_AI_PROVIDER,
      model: response.body?.model || null,
      status: response.code,
      durationMs: Date.now() - caseStartedAt,
      usage: response.body?.usage || null,
      error: response.body?.error || null,
      ...scored
    };
    results.push(result);
    console.log(`${result.passed ? 'PASS' : 'FAIL'} ${item.id} (${result.score}, ${result.durationMs}ms)`);
  }

  const passed = results.filter((result) => result.passed).length;
  const report = {
    generatedAt: new Date().toISOString(),
    provider: process.env.SHARP_AI_PROVIDER,
    filters: { category: args.category || null, case: args.case || null, limit: args.limit || null },
    totals: {
      total: results.length,
      passed,
      failed: results.length - passed,
      passRate: results.length ? Number(((passed / results.length) * 100).toFixed(1)) : 0,
      averageScore: results.length ? Number((results.reduce((sum, item) => sum + item.score, 0) / results.length).toFixed(1)) : 0,
      durationMs: Date.now() - startedAt
    },
    categories: summarizeByCategory(results),
    results
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Result: ${passed}/${results.length} (${report.totals.passRate}%), average score ${report.totals.averageScore}`);
  console.log(`Saved: ${path.relative(ROOT, reportPath)}`);
  if (passed !== results.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});
