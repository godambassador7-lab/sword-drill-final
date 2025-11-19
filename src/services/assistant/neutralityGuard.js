// Adds neutral framing and perspective hints

export function applyNeutrality(answer) {
  const footer = `\n\nNeutrality note: Interpretations can vary across Christian traditions.\nI can present mainstream perspectives without endorsing any single doctrine.`;
  if (!answer.includes('Neutrality note')) return answer + footer;
  return answer;
}

export default { applyNeutrality };

