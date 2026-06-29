import { http } from './httpClient';

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

  const response = await http.post('/feedback', {
    gateId,
    crowdLevel: mapped.crowdLevel,
    peopleRange: mapped.peopleRange
  });

  const allFeedback = readFeedback();
  allFeedback[gateId] = {
    levelLabel,
    timestamp: Date.now()
  };
  writeFeedback(allFeedback);

  return response.data;
}
