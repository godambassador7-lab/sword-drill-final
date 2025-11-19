// Minimal word-study entries (Strong's glosses)
const LEXICON = {
  love: {
    strong: 'G26', lemma: 'agapē', language: 'Greek',
    gloss: 'self-giving love; benevolent goodwill',
    notes: 'Often denotes covenantal, volitional love; cf. 1 John 4:8; John 3:16.'
  },
  faith: { strong: 'G4102', lemma: 'pistis', language: 'Greek', gloss: 'faith, trust, fidelity', notes: 'Relational trust in God; assurance.' },
  grace: { strong: 'G5485', lemma: 'charis', language: 'Greek', gloss: 'grace, favor, gift', notes: 'God’s unmerited favor; Ephesians 2:8.' },
  peace: { strong: 'G1515', lemma: 'eirēnē', language: 'Greek', gloss: 'peace, wholeness', notes: 'Harmony with God; cf. John 14:27.' },
  righteousness: { strong: 'G1343', lemma: 'dikaiosynē', language: 'Greek', gloss: 'righteousness, justice', notes: 'Right standing/justice; Romans themes.' },
  sin: { strong: 'G266', lemma: 'hamartia', language: 'Greek', gloss: 'sin, missing the mark', notes: 'Failure to meet God’s standard.' },
  spirit: { strong: 'G4151', lemma: 'pneuma', language: 'Greek', gloss: 'spirit, wind, breath', notes: 'Used of the Holy Spirit and human spirit.' },
  truth: { strong: 'G225', lemma: 'alētheia', language: 'Greek', gloss: 'truth, reality', notes: 'Faithfulness/verity; John 14:6.' },
  word: { strong: 'G3056', lemma: 'logos', language: 'Greek', gloss: 'word, message, account', notes: 'Divine Word in John 1:1.' },
  lovingkindness: { strong: 'H2617', lemma: 'ḥesed', language: 'Hebrew', gloss: 'steadfast love, loyal kindness', notes: 'Covenant loyalty; Psalm 136.' }
};

export function lookupWordStudy(query) {
  if (!query) return null;
  const lower = query.toLowerCase();
  // Try "word study on X", "greek for X", etc.
  const m = lower.match(/(?:word study on|greek for|hebrew for|original (?:word|language) for)\s+([a-z\-']+)/);
  const key = m ? m[1] : lower.replace(/[^a-z]/g, '');
  return LEXICON[key] || null;
}

export default { lookupWordStudy };

