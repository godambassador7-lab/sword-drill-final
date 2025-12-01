// Maps provider: loads biblical locations and provides search functionality.
import { BIBLICAL_LOCATIONS as GEO_MAP } from '../../../data/biblicalGeography';

let BIBLICAL_LOCATIONS = null;
let LOCATIONS_LOADING = null;

async function loadBiblicalLocations() {
  if (BIBLICAL_LOCATIONS) return BIBLICAL_LOCATIONS;
  if (LOCATIONS_LOADING) return LOCATIONS_LOADING;
  LOCATIONS_LOADING = (async () => {
    try {
      const base = process.env.PUBLIC_URL || '';
      const res = await fetch(`${base}/biblical_locations.json`);
      if (res.ok) {
        const locations = await res.json();
        BIBLICAL_LOCATIONS = mergeWithGeoFallback(locations);
        return locations;
      }
    } catch (_) {
      // Continue to fallback below
    }
    BIBLICAL_LOCATIONS = mergeWithGeoFallback([]);
    return BIBLICAL_LOCATIONS;
  })();
  return LOCATIONS_LOADING;
}

function mergeWithGeoFallback(primary = []) {
  // Convert JS geography map into the same shape used by UI map answers.
  const geoArray = Object.values(GEO_MAP || {}).map(loc => ({
    id: (loc.biblicalName || '').toLowerCase().replace(/\s+/g, '_'),
    name: loc.biblicalName,
    type: loc.biblicalPeriod ? 'region' : 'city',
    region: loc.aliases && loc.aliases.length ? loc.aliases[0] : '',
    aliases: loc.aliases || [],
    modern_country: Array.isArray(loc.modernCountries) ? loc.modernCountries.join(', ') : loc.modernCountries,
    approximate_coordinates: loc.coordinates
      ? { lat: loc.coordinates.lat, lng: loc.coordinates.lon }
      : null,
    maps: [],
    events: [],
    primary_scriptures: loc.keyVerses || [],
    difficulty: 2,
    clues: {
      easy: loc.description ? [loc.description] : [],
      medium: loc.aliases || [],
      hard: []
    }
  }));

  const merged = [...primary];
  const existingNames = new Set(primary.map(l => (l.name || '').toLowerCase()));
  geoArray.forEach(loc => {
    if (loc.name && !existingNames.has(loc.name.toLowerCase())) {
      merged.push(loc);
    }
  });
  return merged;
}

function normalize(s) {
  return (s || '').toString().toLowerCase();
}

function scoreMatch(location, query) {
  if (!location || !query) return 0;
  const normalizedQuery = normalize(query);
  const name = normalize(location.name);
  const aliases = Array.isArray(location.aliases) ? location.aliases.map(normalize) : [];

  let score = 0;

  // Exact or partial name match gets highest score
  if (name === normalizedQuery) {
    score += 5;
  } else if (name.includes(normalizedQuery)) {
    score += 3;
  } else if (normalizedQuery.includes(name)) {
    // Query contains the location name (e.g., "present day edom")
    score += 3;
  }

  // Token-level match to catch phrases like "where is present day edom"
  const tokens = normalizedQuery.split(/[^a-z0-9]+/).filter(Boolean);
  if (tokens.includes(name)) {
    score += 2;
  }

  // Alias matches (e.g., "Judah" for "Judea")
  for (const alias of aliases) {
    if (!alias) continue;
    if (alias === normalizedQuery) {
      score += 4;
      break;
    }
    if (alias.includes(normalizedQuery) || normalizedQuery.includes(alias)) {
      score += 3;
      break;
    }
    if (tokens.includes(alias)) {
      score += 2;
      break;
    }
  }

  // Check description/clues
  const description = location.description || '';
  if (normalize(description).includes(normalizedQuery)) {
    score += 1;
  }

  // Check modern country for "present day" questions
  if (location.modern_country && normalize(location.modern_country).includes(normalizedQuery)) {
    score += 2;
  }

  // Check region
  if (location.region && normalize(location.region).includes(normalizedQuery)) {
    score += 1;
  }

  return score;
}

function buildDescription(location) {
  // Build a description from clues if no description exists
  if (location.clues && location.clues.easy && location.clues.easy.length > 0) {
    return location.clues.easy[0];
  }
  if (location.clues && location.clues.medium && location.clues.medium.length > 0) {
    return location.clues.medium[0];
  }
  return '';
}

export async function searchLocations(query) {
  await loadBiblicalLocations();
  if (!BIBLICAL_LOCATIONS) return [];

  const scored = BIBLICAL_LOCATIONS
    .map(location => ({
      ...location,
      description: location.description || buildDescription(location),
      score: scoreMatch(location, query)
    }))
    .filter(location => location.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return scored;
}

export async function getLocationByName(name) {
  await loadBiblicalLocations();
  if (!BIBLICAL_LOCATIONS) return null;
  const normalizedName = normalize(name);
  return BIBLICAL_LOCATIONS.find(location => normalize(location.name) === normalizedName) || null;
}

export default { searchLocations, getLocationByName };
