import { useCrowdContext } from '../context/CrowdContext';
import GateCard from '../components/gates/GateCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SkeletonCard from '../components/common/SkeletonCard';

function Gates() {
  const { gates, loading, error, refreshGates, bestGate } = useCrowdContext();

  return (
    <div className="container page-pad">
      <section className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-1">Temple Gates Live Status</h1>
          <p className="text-muted mb-0">Choose the best entry point based on live backend crowd intelligence.</p>
        </div>
        <button type="button" className="btn btn-outline-warning" onClick={refreshGates}>
          Refresh
        </button>
      </section>

      {loading && (
        <>
          <LoadingSpinner message="Fetching gate intelligence..." />
          <div className="row g-4">
            {[1, 2, 3, 4].map((item) => (
              <div className="col-md-6 col-xl-3" key={item}>
                <SkeletonCard />
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="row g-4">
          {gates.map((gate) => (
            <div className="col-md-6 col-xl-3" key={gate.id}>
              <GateCard gate={gate} isBestGate={bestGate?.id === gate.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Gates;
