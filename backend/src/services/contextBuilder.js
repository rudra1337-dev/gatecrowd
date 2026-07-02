// backend/src/services/contextBuilder.js
// Merges function results into a clean string injected into the Gemini prompt
// Returns null for general questions (no data fetched)

const INTENT_LABELS = {
  LIVE_CROWD:        'LIVE CROWD DATA',
  CROWD_HISTORY:     'CROWD HISTORY',
  TEMPLE_SCHEDULE:   'TEMPLE SCHEDULE',
  FESTIVAL_SCHEDULE: 'FESTIVAL SCHEDULE',
};

/**
 * Builds context string from function results
 * @param {Object} results - { LIVE_CROWD: {...}, FESTIVAL_SCHEDULE: {...} }
 * @returns {string|null}
 */
export function buildContext(results) {
  if (!results || Object.keys(results).length === 0) return null;

  const blocks = [];

  for (const [intent, data] of Object.entries(results)) {
    const label = INTENT_LABELS[intent] || intent;

    if (!data) {
      blocks.push(`[${label}]\nData temporarily unavailable.`);
      continue;
    }

    const timestamp = data.fetchedAt
      ? `(as of ${new Date(data.fetchedAt).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST)`
      : '';

    blocks.push(`[${label}] ${timestamp}\n${JSON.stringify(data, null, 2)}`);
  }

  if (blocks.length === 0) return null;

  return [
    '--- LIVE DATA FROM GATECROWD SYSTEM ---',
    ...blocks,
    '--- END OF LIVE DATA ---',
    "Use the above data to answer the user's question accurately.",
    "If any data is marked unavailable, say so honestly instead of guessing.",
  ].join('\n\n');
}