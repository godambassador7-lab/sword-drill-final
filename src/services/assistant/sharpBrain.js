import { answerQuery as pipelineAnswerQuery } from './pipeline';
import { searchSharpKnowledge } from '../sharpKnowledgeBase';
import { isClaudeAvailable, sendMessage as sendClaudeMessage } from './claudeService';
import { getBriefSystemPrompt } from './systemPrompts';

const LIMITATIONS_NOTE =
  "I can answer from Sword Drill's built-in study library and Bible datasets. If you want, ask for a narrower verse/topic and I can go deeper within that scope.";
const ENABLE_LLM_FALLBACK = process.env.REACT_APP_SHARP_ENABLE_LLM_FALLBACK === 'true';

function normalizeCitation(citation) {
  if (!citation || typeof citation !== 'object') return null;
  if (citation.type) return citation;
  if (citation.ref) return { ...citation, type: 'verse' };
  if (citation.entry) return { ...citation, type: 'dictionary' };
  if (citation.strongsNumber) return { ...citation, type: 'lexicon' };
  return { ...citation, type: 'other' };
}

function normalizeCitations(citations) {
  const seen = new Set();
  const out = [];
  for (const raw of citations || []) {
    const c = normalizeCitation(raw);
    if (!c) continue;
    const key = `${c.type}:${c.ref || c.entry || c.strongsNumber || JSON.stringify(c)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }
  return out;
}

export async function answerWithSharpBrain(userMessage, context = {}) {
  const [result, kbHits] = await Promise.all([
    pipelineAnswerQuery(userMessage, context),
    searchSharpKnowledge(userMessage, 3)
  ]);

  let answer = typeof result?.answer === 'string' ? result.answer.trim() : '';
  const citations = normalizeCitations(result?.citations || []);
  const metadata = {
    ...(result?.metadata || result?.meta || {}),
    brain: 'sharp-limited-rag-v1',
    localOnly: true,
    kbHits: kbHits.length
  };

  if (kbHits.length > 0) {
    const kbSection = kbHits
      .map((hit, idx) => `${idx + 1}. ${hit.title} (${hit.source_path})\n   ${hit.preview}`)
      .join('\n');
    answer = `${answer}\n\nLibrary Notes:\n${kbSection}`.trim();
  }

  const canUseLlmFallback = ENABLE_LLM_FALLBACK && isClaudeAvailable();
  const shouldUseLlmFallback = canUseLlmFallback && (
    citations.length < 2 ||
    !answer ||
    answer.length < 250
  );

  if (shouldUseLlmFallback) {
    try {
      const kbContext = kbHits
        .map((hit, idx) => `${idx + 1}. ${hit.title} (${hit.source_path})\n${hit.preview}`)
        .join('\n\n');
      const localAnswer = answer || LIMITATIONS_NOTE;
      const prompt = [
        `User question: ${userMessage}`,
        '',
        'Local draft answer:',
        localAnswer,
        '',
        'Knowledge snippets:',
        kbContext || 'No additional KB snippets available.',
        '',
        'Task:',
        '- Improve clarity and theological precision.',
        '- Keep answer grounded in provided content.',
        '- Do not invent sources.',
        '- End with a short "Sources" section that references only cited passages/items.'
      ].join('\n');

      const llmResponse = await sendClaudeMessage(
        [{ role: 'user', content: prompt }],
        getBriefSystemPrompt(),
        { temperature: 0.2, max_tokens: 1200 }
      );

      if (llmResponse?.content) {
        answer = llmResponse.content.trim();
        metadata.usedClaude = true;
      }
    } catch {
      metadata.usedClaude = false;
    }
  }

  if (!answer) {
    return {
      answer: LIMITATIONS_NOTE,
      citations,
      metadata: { ...metadata, fallback: true }
    };
  }

  if (citations.length === 0) {
    return {
      answer: `${answer}\n\n${LIMITATIONS_NOTE}`,
      citations,
      metadata
    };
  }

  return {
    answer,
    citations,
    metadata
  };
}

export default { answerWithSharpBrain };
