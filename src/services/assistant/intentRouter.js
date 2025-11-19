// Simple intent router to reduce brittle regex use in component
// Returns { type, query }

const REF_RE = /\b(\d?\s?[A-Za-z]+)\s+(\d{1,3})(?::(\d{1,3})(?:[-–]\d{1,3})?)?\b/;

export function routeIntent(raw) {
  const text = (raw || '').trim();
  if (!text) return { type: 'unknown', query: '' };

  // Obvious reference pattern
  if (REF_RE.test(text)) {
    return { type: 'reference', query: text };
  }

  const lower = text.toLowerCase();
  if (/(word study|greek for|hebrew for|original (word|language)|strong['’]s)/.test(lower)) {
    return { type: 'word_study', query: text };
  }
  if (/(context|show context|surrounding|nearby verses|passage context)/.test(lower)) {
    return { type: 'context', query: text };
  }
  // Feast days and Hebrew calendar intent
  if (/(feast|holiday|passover|pentecost|tabernacles|sukkot|yom kippur|atonement|trumpets|purim|hanukkah|shabbat|sabbath|rosh chodesh|new moon|hebrew calendar|biblical calendar|appointed time|moedim)/.test(lower)) {
    return { type: 'feast_day', query: text };
  }
  // World religions / apologetics intent
  if (/(religion|world religions|apologetics|compare (?:christianity|christian faith) to|what does (?:islam|hinduism|buddhism|judaism|sikhism|bahai) teach|is (?:islam|hinduism|buddhism|sikhism|judaism) biblical)/.test(lower)) {
    return { type: 'religion', query: text };
  }
  if (/(compare translations|compare versions|side by side)/.test(lower)) {
    return { type: 'compare_translations', query: text };
  }
  if (/(cross refs?|related passages|where else|parallel passages)/.test(lower)) {
    return { type: 'cross_refs', query: text };
  }
  if (/(verses?|passages?|scripture|what does .* say|where .* talk)/.test(lower)) {
    return { type: 'topic', query: text };
  }

  // Definition lookups
  if (/^(what is|define|definition of|meaning of|who is|explain)\b/.test(lower)) {
    return { type: 'define', query: text };
  }

  if (/(meaning|interpret|explain|doctrine|theology|view|perspective)/.test(lower)) {
    return { type: 'theology', query: text };
  }

  return { type: 'general', query: text };
}

export default routeIntent;
