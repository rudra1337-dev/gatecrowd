import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import CrowdChart from '../components/gates/CrowdChart';
import FeedbackPanel from '../components/gates/FeedbackPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CrowdHeatIndicator from '../components/common/CrowdHeatIndicator';
import useCrowdSimulation from '../hooks/useCrowdSimulation';
import { useCrowdContext } from '../context/CrowdContext';
import { connect, disconnect, emit } from '../services/socketService';

function GateDetails() {
  const { id } = useParams();
  const { gates, loading } = useCrowdContext();

  const gate = useMemo(() => gates.find((item) => item.id === id), [gates, id]);
  const initialCrowd = gate?.crowdLevel || 45;
  const initialRange = gate?.peopleRange || '31-60';
  const { crowdLevel, crowdRange, history } = useCrowdSimulation(gate?.id, initialCrowd, initialRange, 10000);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  useEffect(() => {
    emit('gate:crowd:update', { gateId: id, crowdLevel });
  }, [id, crowdLevel]);

  if (loading) {
    return <LoadingSpinner message="Loading gate details..." />;
  }

  if (!gate) {
    return (
      <div className="container page-pad">
        <div className="alert alert-warning">Gate not found. Please return to the gates list.</div>
        <Link to="/gates" className="btn btn-warning">
          Back to Gates
        </Link>
      </div>
    );
  }

  return (
    <div className="container page-pad">
      <section className="mb-4">
        <img src={gate.image} alt={`${gate.name} detailed view`} className="img-fluid rounded-4 shadow-sm w-100 details-hero" />
      </section>

      <section className="row g-4 mb-4">
        <div className="col-lg-7">
          <div className="glass-panel rounded-4 p-4 h-100">
            <h1 className="h2 mb-3">{gate.name}</h1>
            <p>{gate.detail}</p>
            <ul className="list-group list-group-flush">
              <li className="list-group-item px-0">Direction: {gate.direction}</li>
              <li className="list-group-item px-0">Historical Importance: {gate.importance}</li>
              <li className="list-group-item px-0">Typical Busy Hours: {gate.busyHours}</li>
              <li className="list-group-item px-0">
                Current Crowd: <CrowdHeatIndicator value={crowdLevel} peopleRange={crowdRange} />
              </li>
            </ul>
          </div>
        </div>
        <div className="col-lg-5">
          <CrowdChart history={history} />
        </div>
      </section>

      <FeedbackPanel gateId={gate.id} />
    </div>
  );
}

export default GateDetails;
