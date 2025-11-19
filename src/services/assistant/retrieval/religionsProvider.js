// Loads summary datasets for major world religions and provides
// a simple Christian-apologetics oriented formatter.

// Static requires so bundlers include JSON
const ABRAHAMIC = require('../../../data/SwordDrill_Recommended_Religions/Abrahamic.json');
const DHARMIC = require('../../../data/SwordDrill_Recommended_Religions/Dharmic.json');
const EAST_ASIAN = require('../../../data/SwordDrill_Recommended_Religions/East_Asian.json');
const INDIGENOUS = require('../../../data/SwordDrill_Recommended_Religions/Indigenous_and_Nature.json');
const MODERN = require('../../../data/SwordDrill_Recommended_Religions/Modern_and_Philosophical.json');

const GROUPS = [
  { name: 'Abrahamic', data: ABRAHAMIC },
  { name: 'Dharmic', data: DHARMIC },
  { name: 'East Asian', data: EAST_ASIAN },
  { name: 'Indigenous', data: INDIGENOUS },
  { name: 'Modern', data: MODERN },
];

// Build a flat index of religion => { group, summary, key_concepts }
const INDEX = (() => {
  const idx = Object.create(null);
  for (const g of GROUPS) {
    const data = g.data || {};
    for (const key of Object.keys(data)) {
      idx[key.toLowerCase()] = { group: g.name, name: key, ...data[key] };
    }
  }
  return idx;
})();

export function listReligions() { return Object.keys(INDEX).map(k => INDEX[k].name); }

export function findReligionsIn(text) {
  const t = (text || '').toLowerCase();
  const hits = [];
  for (const k of Object.keys(INDEX)) {
    if (t.includes(k)) hits.push(INDEX[k]);
  }
  return hits;
}

export function getReligionInfo(name) {
  if (!name) return null;
  const hit = INDEX[(name || '').toLowerCase()];
  return hit || null;
}

// Very lightweight apologetics scaffold: summarizes target religion
// and outlines a gentle comparison to core Christian claims.
function formatValue(val, indent = '') {
  const next = indent + '  ';
  if (val == null) return `${indent}- (none)`;
  if (Array.isArray(val)) {
    if (val.length === 0) return `${indent}- (empty)`;
    return val.map(v => `${indent}- ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`).join('\n');
  }
  if (typeof val === 'object') {
    const entries = Object.entries(val);
    if (!entries.length) return `${indent}- (empty)`;
    return entries.map(([k, v]) => {
      const header = `${indent}- ${k}:`;
      const body = formatValue(v, next);
      return `${header}\n${body}`;
    }).join('\n');
  }
  return `${indent}- ${String(val)}`;
}

function buildUnabridgedBlock(rec) {
  // List every top-level field from the JSON for this religion.
  const lines = [];
  for (const key of Object.keys(rec)) {
    if (['name', 'group'].includes(key)) continue;
    const prettyKey = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    lines.push(`${prettyKey}:`);
    lines.push(formatValue(rec[key], '  '));
    lines.push('');
  }
  return lines.join('\n').trim();
}

export function buildApologeticResponse(query) {
  const found = findReligionsIn(query);
  if (!found.length) return null;

  const top = found[0];
  const coreChristian = [
    'Jesus Christ is the eternal Son of God, fully God and fully man (John 1:1, 14).',
    'Salvation is by grace through faith, not by works (Ephesians 2:8–9).',
    'Scripture is the authoritative Word of God (2 Timothy 3:16).'
  ];

  let answer = `Overview of ${top.name} (${top.group})\n\n` +
    `Summary: ${top.summary}\n` +
    (Array.isArray(top.key_concepts) && top.key_concepts.length
      ? `Key Concepts: ${top.key_concepts.join(', ')}\n\n`
      : '\n');

  answer += 'Christian Apologetics Perspective (concise)\n' +
    '- We seek truth with humility and respect (1 Peter 3:15).\n' +
    '- We compare every belief with the Gospel of Christ.\n\n' +
    'Core Christian Claims:\n' + coreChristian.map(s => `• ${s}`).join('\n') + '\n\n';

  answer += `Points of Contrast with ${top.name}:\n` +
    `• View of Jesus: Christianity confesses Jesus as Lord and God; ${top.name} holds a different view.\n` +
    '• Way of Salvation: Christianity teaches grace through faith in Christ; alternative systems often emphasize law, ritual, knowledge, or practice.\n' +
    '• Authority: Christianity roots truth in the Bible and the risen Christ; other sources vary by tradition.\n\n' +
    'Invitation: Explore the life, death, and resurrection of Jesus (John 3:16; Romans 10:9), and weigh every claim in light of Scripture and truth.';

  // Unabridged data from JSON (exhaustive)
  const unabridged = buildUnabridgedBlock(top);
  if (unabridged) {
    answer += `\n\nUnabridged Details (from dataset)\n${unabridged}`;
  }

  return { answer, religion: top.name, group: top.group };
}

export default { listReligions, findReligionsIn, getReligionInfo, buildApologeticResponse };
