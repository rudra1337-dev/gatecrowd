import { useEffect, useMemo, useState } from 'react';
import { getLastFeedbackTimestamp, submitFeedback } from '../../services/feedbackService';

// Cooldown set to 1 minute
const WAIT_TIME_MS = 60 * 1000;

const options = [
  { value: 'LOW', label: 'LOW (0-30)', tone: 'success' },
  { value: 'MODERATE', label: 'MODERATE (31-60)', tone: 'info' },
  { value: 'HIGH', label: 'HIGH (61-90)', tone: 'warning' },
  { value: 'VERY_HIGH', label: 'VERY HIGH (91-120)', tone: 'danger' },
  { value: 'EXTREME', label: 'EXTREME (120+)', tone: 'dark' }
];

function FeedbackPanel({ gateId }) {
  const [selected, setSelected] = useState('');
  const [lastSubmittedAt, setLastSubmittedAt] = useState(() => getLastFeedbackTimestamp(gateId));
  const [now, setNow] = useState(Date.now());
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setLastSubmittedAt(getLastFeedbackTimestamp(gateId));
    setStatusMessage('');
    setErrorMessage('');
  }, [gateId]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const remainingMs = Math.max(0, WAIT_TIME_MS - (now - lastSubmittedAt));
  const canSubmit = remainingMs === 0;

  const countdown = useMemo(() => {
    if (WAIT_TIME_MS === 0) return 'Cooldown is off for testing.';
    if (remainingMs === 0) return 'You can submit feedback now.';
    const mins = Math.floor(remainingMs / 60000);
    const secs = Math.floor((remainingMs % 60000) / 1000);
    return `Please wait ${mins}m ${secs}s before next feedback.`;
  }, [remainingMs]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    if (!selected) {
      setStatusMessage('Feedback skipped. You can share anytime.');
      setErrorMessage('');
      return;
    }

    setErrorMessage('');

    try {
      await submitFeedback({ gateId, levelLabel: selected });
      const timestamp = Date.now();
      setLastSubmittedAt(timestamp);
      setStatusMessage('Thank you for sharing your crowd feedback.');
    } catch (error) {
      setStatusMessage('');
      setErrorMessage(error.message || 'Unable to submit feedback right now.');
    }
  };

  return (
    <section className="glass-panel rounded-4 p-4" aria-label="Crowd feedback panel">
      <h2 className="h5 mb-3">Share Current Crowd Observation</h2>
      <form onSubmit={handleSubmit} className="d-grid gap-3">
        <p className="mb-1">Select Crowd Level (Optional)</p>
        <div className="d-flex flex-wrap gap-2">
          {options.map((option) => (
            <label key={option.value} className={`feedback-pill feedback-pill-${option.tone}`}>
              <input
                type="radio"
                name="feedback-level"
                value={option.value}
                checked={selected === option.value}
                onChange={(event) => setSelected(event.target.value)}
                disabled={!canSubmit}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        <button type="submit" className="btn btn-warning" disabled={!canSubmit}>
          Submit Feedback
        </button>
        <small className="text-muted">{countdown}</small>
        {statusMessage && (
          <p className="mb-0 text-success" aria-live="polite">
            {statusMessage}
          </p>
        )}
        {errorMessage && (
          <p className="mb-0 text-danger" aria-live="assertive">
            {errorMessage}
          </p>
        )}
      </form>
    </section>
  );
}

export default FeedbackPanel;
