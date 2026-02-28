import { useMemo } from 'react';
import { useCrowdContext } from '../context/CrowdContext';
import GateCard from '../components/gates/GateCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SkeletonCard from '../components/common/SkeletonCard';
import SeoHead from '../seo/SeoHead';
import { buildBreadcrumbSchema } from '../seo/schema';

function Gates() {
  const { gates, loading, error, refreshGates, bestGate } = useCrowdContext();
  const breadcrumbSchema = useMemo(
    () =>
      buildBreadcrumbSchema([
        { name: 'Home', path: '/home' },
        { name: 'Gates', path: '/gates' }
      ]),
    []
  );
  const gatesSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'GateCrowd Temple Gates',
      itemListElement: gates.map((gate, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: gate.name,
        url: `https://gatecrowd.vercel.app/gates/${gate.id}`
      }))
    }),
    [gates]
  );

  return (
    <div className="container page-pad">
      <SeoHead
        title="Temple Gates Live Status"
        path="/gates"
        description="Compare all Jagannath Temple gates with live crowd ranges, identify the best gate, and avoid congestion."
        keywords="Jagannath Temple gates, live crowd gates, best gate to enter, gate queue comparison"
        structuredData={[breadcrumbSchema, gatesSchema]}
      />
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
