// Dictionary provider: loads optional Webster 1913 index and provides
// curated advanced theological/philosophical definitions as fallback.

let WEBSTER_INDEX = null;
let WEBSTER_LOADING = null;
let WEBSTER_KEYS = null;

let SMITHS_INDEX = null;
let SMITHS_LOADING = null;
let SMITHS_KEYS = null;

let COMBINED_INDEX = null;
let COMBINED_KEYS = null;

async function loadWebsterIndex() {
  if (WEBSTER_INDEX) return WEBSTER_INDEX;
  if (WEBSTER_LOADING) return WEBSTER_LOADING;
  WEBSTER_LOADING = (async () => {
    try {
      // Expect optional index at /dictionaries/webster1913_index.json
      const base = process.env.PUBLIC_URL || '';
      const res = await fetch(`${base}/dictionaries/webster1913_index.json`);
      if (res.ok) {
        const idx = await res.json();
        // Tag source if not present
        Object.keys(idx).forEach(k => { if (idx[k] && !idx[k].src) idx[k].src = 'WEBSTER'; });
        WEBSTER_INDEX = idx;
        try { WEBSTER_KEYS = Object.keys(idx); } catch (_) { WEBSTER_KEYS = null; }
        return idx;
      }
    } catch (_) {}
    WEBSTER_INDEX = {};
    WEBSTER_KEYS = [];
    return WEBSTER_INDEX;
  })();
  return WEBSTER_LOADING;
}

async function loadSmithsIndex() {
  if (SMITHS_INDEX) return SMITHS_INDEX;
  if (SMITHS_LOADING) return SMITHS_LOADING;
  SMITHS_LOADING = (async () => {
    try {
      const base = process.env.PUBLIC_URL || '';
      const res = await fetch(`${base}/dictionaries/smiths.json`);
      if (res.ok) {
        const data = await res.json();
        // data is key->entry object
        let idx = {};
        if (data && typeof data === 'object') {
          Object.keys(data).forEach(k => {
            const key = normalizeKey(k);
            const val = data[k];
            if (key) idx[key] = { headword: val?.headword || k, pos: val?.pos || null, def: val?.def || val?.definition || String(val), src: 'SMITHS' };
          });
        }
        SMITHS_INDEX = idx;
        SMITHS_KEYS = Object.keys(idx);
        return idx;
      }
    } catch (_) {}
    SMITHS_INDEX = {};
    SMITHS_KEYS = [];
    return SMITHS_INDEX;
  })();
  return SMITHS_LOADING;
}

async function ensureCombined() {
  if (COMBINED_INDEX) return { idx: COMBINED_INDEX, keys: COMBINED_KEYS };
  const [w, s] = await Promise.all([loadWebsterIndex(), loadSmithsIndex()]);
  const idx = { ...(s || {}), ...(w || {}) }; // Prefer Smith's where overlapping
  const keys = Object.keys(idx);
  COMBINED_INDEX = idx; COMBINED_KEYS = keys;
  return { idx, keys };
}

// Minimal curated advanced terms (fallback if no full index is available)
const ADVANCED = {
  atonement: {
    headword: 'atonement',
    pos: 'n.',
    def: 'The reconciliatory work by which estranged parties are brought into unity; in Christian theology, the redemptive act of Christ restoring communion between God and humanity.'
  },
  justification: {
    headword: 'justification', pos: 'n.',
    def: 'Forensic declaration of righteousness; divine acquittal grounded not in inherent merit but in imputed righteousness.'
  },
  sanctification: {
    headword: 'sanctification', pos: 'n.',
    def: 'Consecration unto holiness; the transformative work whereby a person is progressively conformed to a sacred standard.'
  },
  trinity: {
    headword: 'Trinity', pos: 'n.',
    def: 'The one divine essence subsisting in three hypostases—Father, Son, and Holy Spirit—coequal, coeternal, consubstantial.'
  },
  kenosis: { headword: 'kenosis', pos: 'n.', def: 'Self-emptying; the incarnational condescension whereby the Son assumes servile form without relinquishing divine nature.' },
  eschatology: { headword: 'eschatology', pos: 'n.', def: 'Doctrine of last things; consummation of history and final destiny of creation.' },
  soteriology: { headword: 'soteriology', pos: 'n.', def: 'Doctrine of salvation; modes and means of deliverance and restoration.' },
  ecclesiology: { headword: 'ecclesiology', pos: 'n.', def: 'Doctrine of the Church; nature, marks, polity, and sacramental life of the ecclesia.' },
  christology: { headword: 'Christology', pos: 'n.', def: 'Doctrine concerning the person and work of Christ; union of natures and mediatorial office.' },
  pneumatology: { headword: 'pneumatology', pos: 'n.', def: 'Doctrine of the Spirit; procession, gifts, sanctifying agency.' },
  hamartiology: { headword: 'hamartiology', pos: 'n.', def: 'Doctrine of sin; privation, guilt, corruption, and their effects.' },
  theodicy: { headword: 'theodicy', pos: 'n.', def: 'Vindication of divine goodness and justice amid the presence of evil.' },
  hermeneutics: { headword: 'hermeneutics', pos: 'n.', def: 'Art and theory of interpretation; principles governing textual meaning and application.' },
  exegesis: { headword: 'exegesis', pos: 'n.', def: 'Critical explanation of a text; drawing meaning out from linguistic, literary, and historical data.' },
  eisegesis: { headword: 'eisegesis', pos: 'n.', def: 'Reading meaning into a text from prior assumptions rather than drawing it out from the text itself.' },
  ontology: { headword: 'ontology', pos: 'n.', def: 'Philosophical account of being; categories and modes of existence.' },
  epistemology: { headword: 'epistemology', pos: 'n.', def: 'Theory of knowledge; sources, scope, and justification of belief.' },
  teleology: { headword: 'teleology', pos: 'n.', def: 'Explanation by ends or purposes; purposive structure of reality.' },
  hypostasis: { headword: 'hypostasis', pos: 'n.', def: 'Underlying reality or person; in Trinitarian discourse, a distinct subsistence within the one essence.' },
  ousia: { headword: 'ousia', pos: 'n.', def: 'Essence or being; that which makes a thing what it is.' },
  perichoresis: { headword: 'perichoresis', pos: 'n.', def: 'Mutual indwelling and interpenetration without confusion; circumincession of the divine persons.' },
  homoousios: { headword: 'homoousios', pos: 'adj.', def: 'Of the same essence; consubstantial.' },
  hypostaticunion: { headword: 'hypostatic union', pos: 'n.', def: 'Personal union of divine and human natures in the one person of Christ without confusion, change, division, or separation.' }
};

function normalizeKey(t) {
  return (t || '').toString().toLowerCase().replace(/[^a-z]/g, '');
}

export async function lookupDefinition(term) {
  if (!term) return null;
  const key = normalizeKey(term);
  // Try curated advanced terms first
  if (ADVANCED[key]) return ADVANCED[key];
  // Try Easton/Webster combined index
  const { idx, keys } = await ensureCombined();
  if (idx && typeof idx === 'object') {
    // direct
    if (idx[key]) return idx[key];
    // fallback: simple stem variants
    const alt = keys.find(k => k.startsWith(key) || key.startsWith(k));
    if (alt) return idx[alt];
  }
  return null;
}

export async function searchDefinitionsPrefix(term, limit = 5) {
  const key = normalizeKey(term);
  if (!key) return [];
  const { idx, keys } = await ensureCombined();
  if (!idx || typeof idx !== 'object') return [];
  const matches = [];
  for (let i = 0; i < keys.length && matches.length < limit; i++) {
    const k = keys[i];
    if (k.startsWith(key) || key.startsWith(k)) {
      matches.push(idx[k]);
    }
  }
  return matches;
}

// Simple Levenshtein distance (two-row DP)
function lev(a, b) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = new Array(n + 1);
  let curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    const ca = a.charCodeAt(i - 1);
    for (let j = 1; j <= n; j++) {
      const cost = ca === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1,      // insert
        prev[j] + 1,          // delete
        prev[j - 1] + cost    // substitute
      );
    }
    const tmp = prev; prev = curr; curr = tmp;
  }
  return prev[n];
}

export async function searchDefinitionsFuzzy(term, limit = 5) {
  const key = normalizeKey(term);
  if (!key) return [];
  const { idx, keys } = await ensureCombined();
  if (!idx || typeof idx !== 'object') return [];
  // Filter candidates by first letter to keep it fast
  const first = key[0];
  const candidates = keys.filter(k => k[0] === first);
  const scored = [];
  // Dynamic threshold: allow up to 2 or 30% of length, whichever larger
  const maxDist = Math.max(2, Math.floor(key.length * 0.3));
  for (let i = 0; i < candidates.length; i++) {
    const k = candidates[i];
    const d = lev(key, k);
    if (d <= maxDist) scored.push({ k, d });
  }
  scored.sort((a, b) => a.d - b.d || a.k.localeCompare(b.k));
  const out = [];
  for (let i = 0; i < scored.length && out.length < limit; i++) {
    out.push(idx[scored[i].k]);
  }
  return out;
}

export default { lookupDefinition };
