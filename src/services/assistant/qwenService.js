const QWEN_ENABLED = process.env.REACT_APP_ENABLE_QWEN === 'true';

export function isQwenEnabled() {
  return QWEN_ENABLED;
}

export async function enhanceWithQwen({
  question,
  localAnswer,
  citations,
  evidence,
  appContext,
  conversationHistory
}) {
  if (!QWEN_ENABLED) return null;
  const response = await fetch('/api/qwen', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
      localAnswer,
      citations,
      evidence,
      appContext,
      conversationHistory: (conversationHistory || []).slice(-8).map((message) => ({
        role: message.role || message.type,
        content: message.content
      }))
    })
  });
  if (!response.ok) throw new Error(`Qwen request failed (${response.status})`);
  return response.json();
}

export default { enhanceWithQwen, isQwenEnabled };
