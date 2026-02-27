import { useEffect, useMemo, useState } from 'react';
import Badge from '../components/common/Badge';
import { useCrowdContext } from '../context/CrowdContext';
import { getAlertsFromGates } from '../services/alertService';
import { connect, disconnect, subscribe } from '../services/socketService';

function priorityTone(priority) {
  if (priority === 'High') {
    return 'danger';
  }
  if (priority === 'Medium') {
    return 'warning';
  }
  return 'success';
}

function priorityCardClass(priority) {
  if (priority === 'High') {
    return 'border-danger-subtle';
  }
  if (priority === 'Medium') {
    return 'border-warning-subtle';
  }
  return 'border-success-subtle';
}

function Alerts() {
  const { gates } = useCrowdContext();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    connect();
    const unsubscribe = subscribe('gate:crowd:update', () => {
      setTick((value) => value + 1);
    });

    const timer = setInterval(() => {
      setTick((value) => value + 1);
    }, 12000);

    return () => {
      clearInterval(timer);
      unsubscribe();
      disconnect();
    };
  }, []);

  const alerts = useMemo(() => {
    if (!gates.length) {
      return [];
    }
    return getAlertsFromGates(gates);
  }, [gates, tick]);

  return (
    <div className="container page-pad">
      <section className="mb-4">
        <h1 className="h2">Live Alerts</h1>
        <p className="text-muted mb-0">Extreme crowd warnings, congestion notices, and best-visit recommendations.</p>
      </section>

      <div className="row g-4">
        {alerts.map((alert) => (
          <div className="col-md-6" key={alert.id}>
            <article className={`card border shadow-sm h-100 alert-card ${priorityCardClass(alert.priority)}`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h2 className="h5 mb-0">{alert.gateName}</h2>
                  <Badge text={alert.priority} tone={priorityTone(alert.priority)} />
                </div>
                <p className="mb-2">⚠️ {alert.message}</p>
                <p className="mb-0 text-muted">✅ {alert.recommendation}</p>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Alerts;
