import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getGates } from '../services/gateService';

const CrowdContext = createContext(null);

export function CrowdProvider({ children }) {
  const [gates, setGates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGates = useCallback(async (withLoader = true, forceRefresh = false) => {
    try {
      if (withLoader) {
        setLoading(true);
      }
      setError('');
      const data = await getGates(forceRefresh);
      setGates(data);
    } catch (err) {
      setError(err.message || 'Failed to load gates.');
    } finally {
      if (withLoader) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchGates(true);
  }, [fetchGates]);

  useEffect(() => {
    const timer = setInterval(() => {
      fetchGates(false, true);
    }, 30000);

    return () => clearInterval(timer);
  }, [fetchGates]);

  const value = useMemo(() => {
    const bestGate = gates.length
      ? gates.reduce((acc, gate) => (gate.crowdLevel < acc.crowdLevel ? gate : acc), gates[0])
      : null;

    return {
      gates,
      loading,
      error,
      refreshGates: () => fetchGates(true, true),
      bestGate
    };
  }, [gates, loading, error, fetchGates]);

  return createElement(CrowdContext.Provider, { value }, children);
}

export function useCrowdContext() {
  const context = useContext(CrowdContext);
  if (!context) {
    throw new Error('useCrowdContext must be used within CrowdProvider');
  }
  return context;
}
