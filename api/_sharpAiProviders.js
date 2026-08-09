const CLOUDFLARE_MODEL = '@cf/qwen/qwen3-30b-a3b-fp8';
const DASHSCOPE_BASE_URL = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1';
const OLLAMA_BASE_URL = 'http://127.0.0.1:11434';

function createTimeoutSignal(timeoutMs = 55000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return { signal: controller.signal, clear: () => clearTimeout(timeout) };
}

async function fetchJson(url, init, timeoutMs = 55000) {
  const timeout = createTimeoutSignal(timeoutMs);
  try {
    const response = await fetch(url, { ...init, signal: timeout.signal });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(`AI provider request failed (${response.status})`);
      error.status = response.status;
      error.payload = payload;
      throw error;
    }
    return payload;
  } finally {
    timeout.clear();
  }
}

function cloudflareConfigured() {
  return Boolean(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_AI_TOKEN);
}

async function callCloudflare(messages) {
  const accountId = String(process.env.CLOUDFLARE_ACCOUNT_ID).trim();
  const token = String(process.env.CLOUDFLARE_AI_TOKEN).trim();
  const model = String(process.env.CLOUDFLARE_AI_MODEL || CLOUDFLARE_MODEL).trim();
  const url = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${model}`;
  const payload = await fetchJson(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, temperature: 0.2, max_tokens: 1200 })
  });
  const content = payload?.result?.response || payload?.result?.choices?.[0]?.message?.content;
  if (!content) throw new Error('Cloudflare returned an empty response.');
  return { content, provider: 'cloudflare', model, usage: payload?.result?.usage || null };
}

function dashscopeConfigured() {
  return Boolean(process.env.DASHSCOPE_API_KEY);
}

async function callDashscope(messages) {
  const apiKey = String(process.env.DASHSCOPE_API_KEY).trim();
  const model = String(process.env.QWEN_MODEL || 'qwen-plus').trim();
  const baseUrl = String(process.env.QWEN_BASE_URL || DASHSCOPE_BASE_URL).replace(/\/$/, '');
  const payload = await fetchJson(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, temperature: 0.2, max_tokens: 1200 })
  });
  const content = payload?.choices?.[0]?.message?.content;
  if (!content) throw new Error('DashScope returned an empty response.');
  return { content, provider: 'dashscope', model: payload.model || model, usage: payload.usage || null };
}

function ollamaConfigured() {
  return process.env.SHARP_AI_PROVIDER === 'ollama' || Boolean(process.env.OLLAMA_BASE_URL);
}

async function callOllama(messages) {
  const baseUrl = String(process.env.OLLAMA_BASE_URL || OLLAMA_BASE_URL).replace(/\/$/, '');
  const model = String(process.env.OLLAMA_MODEL || 'qwen3:4b-instruct').trim();
  const numPredict = Math.max(128, Math.min(1200, Number(process.env.OLLAMA_MAX_TOKENS) || 600));
  const payload = await fetchJson(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      options: { temperature: 0.2, num_predict: numPredict }
    })
  }, 120000);
  const content = payload?.message?.content;
  if (!content) throw new Error('Ollama returned an empty response.');
  return {
    content,
    provider: 'ollama',
    model: payload.model || model,
    usage: {
      prompt_tokens: payload.prompt_eval_count || null,
      completion_tokens: payload.eval_count || null
    }
  };
}

const PROVIDERS = {
  cloudflare: { configured: cloudflareConfigured, call: callCloudflare },
  dashscope: { configured: dashscopeConfigured, call: callDashscope },
  ollama: { configured: ollamaConfigured, call: callOllama }
};

function providerOrder() {
  const selected = String(process.env.SHARP_AI_PROVIDER || 'auto').toLowerCase();
  if (selected !== 'auto' && PROVIDERS[selected]) return [selected];
  return ['cloudflare', 'dashscope', 'ollama'];
}

async function generateSharpAnswer(messages) {
  const attempted = [];
  for (const name of providerOrder()) {
    const provider = PROVIDERS[name];
    if (!provider.configured()) continue;
    attempted.push(name);
    try {
      return await provider.call(messages);
    } catch (error) {
      console.error(`[SHARP AI] ${name} failed:`, error.message);
    }
  }
  const error = new Error(attempted.length ? 'All configured AI providers failed.' : 'No AI provider is configured.');
  error.status = 503;
  throw error;
}

function getConfiguredProviders() {
  return providerOrder().filter((name) => PROVIDERS[name].configured());
}

module.exports = { generateSharpAnswer, getConfiguredProviders };
