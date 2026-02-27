import { useEffect, useState } from 'react';
import { getGateCrowd } from '../services/gateService';

function clamp(value) {
  return Math.max(5, Math.min(140, value));
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function mapValueToRange(value) {
  if (value <= 30) {
    return { crowdLabel: 'LOW', peopleRange: '0-30', score: 1 };
  }
  if (value <= 60) {
    return { crowdLabel: 'MODERATE', peopleRange: '31-60', score: 2 };
  }
  if (value <= 90) {
    return { crowdLabel: 'HIGH', peopleRange: '61-90', score: 3 };
  }
  if (value <= 120) {
    return { crowdLabel: 'VERY_HIGH', peopleRange: '91-120', score: 4 };
  }
  return { crowdLabel: 'EXTREME', peopleRange: '120+', score: 5 };
}

function createPoint(level, crowdLabel, peopleRange) {
  const score = mapValueToRange(level).score;
  return {
    time: formatTime(new Date()),
    crowdLabel,
    peopleRange,
    score
  };
}

function useCrowdSimulation(gateId, initialValue = 45, initialRange = '31-60', intervalMs = 10000) {
  const mapped = mapValueToRange(initialValue);
  const [crowdLevel, setCrowdLevel] = useState(initialValue);
  const [crowdRange, setCrowdRange] = useState(initialRange);
  const [crowdLabel, setCrowdLabel] = useState(mapped.crowdLabel);
  const [history, setHistory] = useState([createPoint(initialValue, mapped.crowdLabel, initialRange)]);

  useEffect(() => {
    const initial = mapValueToRange(initialValue);
    setCrowdLevel(initialValue);
    setCrowdRange(initialRange);
    setCrowdLabel(initial.crowdLabel);
    setHistory([createPoint(initialValue, initial.crowdLabel, initialRange)]);
  }, [gateId, initialValue, initialRange]);

  useEffect(() => {
    if (!gateId) {
      return undefined;
    }

    let mounted = true;

    const pullLatest = async () => {
      try {
        const live = await getGateCrowd(gateId);
        if (!mounted) {
          return;
        }

        setCrowdLevel(live.crowdLevel);
        setCrowdRange(live.peopleRange);
        setCrowdLabel(live.crowdLabel);
        setHistory((old) => [...old.slice(-19), createPoint(live.crowdLevel, live.crowdLabel, live.peopleRange)]);
      } catch {
        if (!mounted) {
          return;
        }

        setCrowdLevel((prev) => {
          const fallback = clamp(prev + Math.floor((Math.random() - 0.5) * 10));
          const derived = mapValueToRange(fallback);
          setCrowdRange(derived.peopleRange);
          setCrowdLabel(derived.crowdLabel);
          setHistory((old) => [...old.slice(-19), createPoint(fallback, derived.crowdLabel, derived.peopleRange)]);
          return fallback;
        });
      }
    };

    pullLatest();
    const timer = setInterval(pullLatest, intervalMs);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [gateId, intervalMs]);

  return { crowdLevel, crowdRange, crowdLabel, history };
}

export default useCrowdSimulation;
