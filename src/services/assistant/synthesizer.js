// Neutral synthesis of an answer from retrieved passages
import { formatCompact } from '../utils/format';

export function synthesizeNeutral({ query, hits }) {
  if (!hits || hits.length === 0) {
    return {
      answer: `I didn’t find a direct match locally for: "${query}". Try rephrasing or specifying a book (e.g., "in Romans").`,
      citations: []
    };
  }

  const top = hits.slice(0, 3);
  const versesBlock = top
    .map(h => `“${h.text}”\n— ${h.reference}${h.translation ? ` (${h.translation})` : ''}`)
    .join('\n\n');

  const answer = `Here are passages related to your query:\n\n${versesBlock}\n\nHow to read these neutrally:\n• Consider immediate literary context (preceding and following verses).\n• Compare translations to avoid relying on a single rendering.\n• Check cross‑references for how Scripture interprets Scripture.\n\nWould you like:\n• Passage context\n• Compare translations\n• Word study (original language term)?`;

  return { answer, citations: top.map(h => ({ ref: h.reference, translation: h.translation || 'Unknown' })) };
}

export default { synthesizeNeutral };

