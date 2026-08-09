# SHARP AI evaluation

The answer-quality suite is separate from the existing retrieval-only golden
tests. It evaluates the complete `api/qwen.js` behavior against curated local
drafts, citations, evidence, app context, and adversarial content.

## Coverage

The initial suite contains cases for:

- Scripture explanation and biblical people
- Theology and fair presentation of disputed doctrines
- Greek and Hebrew word studies
- Church history and canon
- Sword Drill study plans, courses, tools, progress, and troubleshooting
- Prompt injection, historical uncertainty, and pastoral boundaries

Each case defines required concept groups, prohibited claims, and a maximum
answer length. The production endpoint independently rejects unsupported exact
Bible references and attempts one constrained repair before falling back.

## Commands

Validate all case data without calling a model:

```powershell
npm run sharp:ai-eval
```

Run a short local Ollama smoke test:

```powershell
npm run sharp:ai-eval -- --provider=ollama --limit=3 --max-tokens=256
```

Run one category:

```powershell
npm run sharp:ai-eval -- --provider=ollama --category=app --max-tokens=400
```

Run one case:

```powershell
npm run sharp:ai-eval -- --provider=ollama --case=theology-trinity
```

Preserve a named smoke report:

```powershell
npm run sharp:ai-eval -- --provider=ollama --case=app-study-plans --output=reports/sharp-ai-eval-app-smoke.json
```

Run the complete production-provider suite after Cloudflare credentials are in
the environment:

```powershell
npm run sharp:ai-eval -- --provider=cloudflare
```

The generated report is written to `reports/sharp-ai-eval-report.json`. A
non-zero exit code means at least one executed case failed, making the command
suitable for CI once provider credentials and a deliberate evaluation budget
are configured.

## Scoring

- 40 points: endpoint returned a non-empty grounded answer
- 45 points: required concepts covered
- 10 points: prohibited claims avoided
- 5 points: answer stayed within the case's length target

A case passes only when all four requirements pass. Keyword scoring is a stable
regression signal, not a substitute for periodic human theological review.

## Local baseline (August 9, 2026)

The local `qwen3:4b-instruct` Ollama model passed the first three Scripture
cases (3/3), the adversarial prompt-injection case (1/1), and the stricter
study-plan grounding case (1/1). All five scored 100 under the deterministic
rubric.

Local CPU inference averaged roughly 78 seconds per case, so Ollama is useful
for development and offline testing but is not the recommended shared backend.
Run the complete 25-case suite against Cloudflare Workers AI before enabling
the production feature flag for all users.
