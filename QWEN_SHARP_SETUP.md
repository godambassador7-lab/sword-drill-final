# SHARP AI setup

SHARP uses one grounded request contract with three interchangeable Qwen
providers:

1. Cloudflare Workers AI for production users (recommended)
2. Ollama for local development
3. Alibaba Cloud Model Studio as an optional fallback

The public app calls `api/qwen.js`; provider credentials never enter the
browser. SHARP first builds an answer and verified citations from its local
Bible/research pipeline, retrieves relevant Sword Drill knowledge-base chunks,
and then asks Qwen to synthesize that evidence. If AI is disabled, unavailable,
rate-limited, or fails reference validation, the existing local answer is used.

## Cloudflare production setup

1. Create or open a Cloudflare account.
2. In the Cloudflare dashboard, open **Workers AI** and choose **Use REST API**.
3. Create a Workers AI API token and copy the Account ID.
4. In Vercel Project Settings → Environment Variables, add:

```dotenv
REACT_APP_ENABLE_QWEN=true
SHARP_AI_PROVIDER=cloudflare
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_AI_TOKEN=your-workers-ai-token
CLOUDFLARE_AI_MODEL=@cf/qwen/qwen3-30b-a3b-fp8
```

Redeploy after saving the variables. Configure Cloudflare usage notifications
and a spending limit before opening SHARP to unrestricted public traffic.

## Local Ollama setup

Ollama and `qwen3:4b-instruct` are installed on this development computer. Add
the following to `.env.local`:

```dotenv
REACT_APP_ENABLE_QWEN=true
SHARP_AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen3:4b-instruct
OLLAMA_MAX_TOKENS=600
```

Run the app with `vercel dev` so the React app and `api/qwen.js` share the same
local environment. `npm start` alone does not serve Vercel API functions.

Never configure a production Vercel deployment with a localhost Ollama URL;
localhost inside Vercel is not this development computer.

## Alibaba alternative

```dotenv
REACT_APP_ENABLE_QWEN=true
SHARP_AI_PROVIDER=dashscope
DASHSCOPE_API_KEY=your-key
QWEN_MODEL=qwen-plus
QWEN_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
```

For a Singapore trial, enable **Free Quota Only** in Model Studio to prevent
usage from becoming billable after the trial allocation is exhausted.

## Grounding and safety behavior

- The API key is server-side only.
- Request bodies and conversation history are size-limited.
- A best-effort per-IP burst limit allows 20 requests per minute.
- Knowledge-base text is explicitly treated as untrusted data, not instructions.
- Exact Bible references introduced by the model must already occur in SHARP's
  verified draft, evidence, or citation metadata; otherwise SHARP falls back.
- The model is instructed to distinguish Scripture, interpretation, tradition,
  and historical reconstruction.
- App-feature answers are grounded in Sword Drill context and app documents.

For durable per-user daily quotas, add server-verified authentication and a
shared rate-limit store before a large public launch. The in-memory burst limit
is useful defense-in-depth but does not coordinate across serverless instances.
