const ESV_API_URL = 'https://api.esv.org/v3/passage/text/';

module.exports = async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const token = String(process.env.ESV_API_TOKEN || '').trim();
  if (!token) {
    return response.status(503).json({ error: 'ESV API access is not configured.' });
  }

  const reference = String(request.query.q || '').trim();
  if (!reference || reference.length > 100) {
    return response.status(400).json({ error: 'A valid passage reference is required.' });
  }

  const params = new URLSearchParams({
    q: reference,
    'include-passage-references': request.query.includePassageReferences === 'true' ? 'true' : 'false',
    'include-verse-numbers': 'true',
    'include-first-verse-numbers': 'true',
    'include-footnotes': 'false',
    'include-footnote-body': 'false',
    'include-headings': 'false',
    'include-short-copyright': 'true',
    'include-copyright': 'false'
  });

  try {
    const upstream = await fetch(`${ESV_API_URL}?${params.toString()}`, {
      headers: { Authorization: `Token ${token}` }
    });

    if (!upstream.ok) {
      return response.status(upstream.status).json({ error: 'The ESV API request failed.' });
    }

    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return response.status(200).json(await upstream.json());
  } catch (_) {
    return response.status(502).json({ error: 'The ESV API could not be reached.' });
  }
};
