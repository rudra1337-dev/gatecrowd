import { API_BASE_URL } from './gateService';

const STORAGE_KEY = 'gatecrowd_feedback_submissions';

const labelToPayload = {
  LOW: { crowdLevel: 'LOW', peopleRange: '0-30' },
  MODERATE: { crowdLevel: 'MODERATE', peopleRange: '31-60' },
  HIGH: { crowdLevel: 'HIGH', peopleRange: '61-90' },
  VERY_HIGH: { crowdLevel: 'VERY_HIGH', peopleRange: '91-120' },
  EXTREME: { crowdLevel: 'EXTREME', peopleRange: '120+' }
};

function readFeedback() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeFeedback(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore localStorage write errors.
  }
}

export function getLastFeedbackTimestamp(gateId) {
  const allFeedback = readFeedback();
  return allFeedback[gateId]?.timestamp || 0;
}

export async function submitFeedback({ gateId, levelLabel }) {
  const mapped = labelToPayload[levelLabel] || labelToPayload.MODERATE;

  const response = await fetch(`${API_BASE_URL}/api/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      gateId,
      crowdLevel: mapped.crowdLevel,
      peopleRange: mapped.peopleRange
    })
  });

  if (!response.ok) {
    let message = `Failed to submit feedback (${response.status})`;
    try {
      const data = await response.json();
      if (data?.message) {
        message = data.message;
      }
    } catch {
      // Keep fallback message.
    }
    throw new Error(message);
  }

  const allFeedback = readFeedback();
  allFeedback[gateId] = {
    levelLabel,
    timestamp: Date.now()
  };
  writeFeedback(allFeedback);

  return response.json();
}
