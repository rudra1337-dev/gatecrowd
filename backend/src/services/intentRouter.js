// backend/src/services/intentRouter.js

const INTENT_KEYWORD_MAP = {
  LIVE_CROWD: [
    'crowd', 'gate', 'busy', 'wait', 'entry', 'queue',
    'rush', 'capacity', 'congested', 'full', 'people',
    'which gate', 'best gate', 'recommend', 'least', 'most',
    'empty', 'free', 'enter', 'less crowded', 'shorter',
  ],
  CROWD_HISTORY: [
    'history', 'yesterday', 'trend', 'peak', 'last week',
    'pattern', 'usually', 'normally', 'typically', 'past',
    'average', 'when is it busy', 'when is it less',
  ],
  TEMPLE_SCHEDULE: [
    'darshan', 'timing', 'morning', 'evening',
    'when does', 'hours', 'schedule', 'puja time',
    'aarti', 'bhog', 'mangala', 'ritual', 'open', 'close',
  ],
  FESTIVAL_SCHEDULE: [
    'festival', 'rath yatra', 'puja', 'event', 'celebration',
    'holiday', 'snana', 'purnima', 'special day', 'upcoming',
    'yatra', 'utsav', 'chariot',
  ],
};

/**
 * Detects intents from a user message
 * @param {string} message - raw user message
 * @returns {string[]} - matched intent keys e.g. ["LIVE_CROWD", "FESTIVAL_SCHEDULE"]
 *                       empty array = general question → go straight to Gemini
 */
export function detectIntents(message) {
  const lower = message.toLowerCase().trim();
  const matched = [];

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORD_MAP)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      matched.push(intent);
    }
  }

  return matched;
}