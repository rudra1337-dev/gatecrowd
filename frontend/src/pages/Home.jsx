import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/common/Badge';
import CrowdHeatIndicator from '../components/common/CrowdHeatIndicator';
import SkeletonCard from '../components/common/SkeletonCard';
import { useCrowdContext } from '../context/CrowdContext';
import SeoHead from '../seo/SeoHead';
import { buildBreadcrumbSchema, buildProjectSchema } from '../seo/schema';
import styles from '../styles/pages/Home.module.css';

function Home() {
  const navigate = useNavigate();
  const { gates, loading, error, bestGate } = useCrowdContext();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    }
    if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    }
    if (hour >= 17 && hour < 22) {
      return 'Good Evening';
    }
    return 'Good Night';
  }, []);

  const gateOverview = useMemo(() => gates.slice(0, 4), [gates]);
  const breadcrumbSchema = useMemo(() => buildBreadcrumbSchema([{ name: 'Home', path: '/home' }]), []);

  return (
    <div className={`${styles.page} container`}>
      <SeoHead
        title="Live Crowd Monitoring for Puri Jagannath Temple"
        path="/home"
        description="Track live gate crowd conditions, get fastest entry suggestions, and plan a smoother darshan experience with GateCrowd."
        keywords="GateCrowd home, Jagannath Temple live crowd, temple gate queue status, darshan planning app"
        structuredData={[breadcrumbSchema, buildProjectSchema()]}
      />
      <section className={`${styles.panel} rounded-4 p-4 p-md-5 mb-5`}>
        <h1 className="display-6 fw-bold mb-3">{greeting}, Welcome to GateCrowd 🛕</h1>
        <p className="lead mb-0">
          Real-time crowd awareness for smarter, calmer temple visits at Puri Jagannath Temple.
        </p>
      </section>

      <section className="row g-4 align-items-center mb-5" aria-label="Temple introduction">
        <div className="col-lg-6">
          <img
            src="https://us.images.westend61.de/0001996439pw/aerial-view-of-jagannatha-temple-puri-odisha-india-AAEF33211.jpg"
            alt="Temple area in Puri"
            className="img-fluid rounded-4 shadow-sm"
            loading="lazy"
          />
        </div>
        <div className="col-lg-6">
          <h2 className="h3 mb-3">About Puri Jagannath Temple</h2>
          <p>
            One of India&apos;s most revered pilgrimage centers, the temple draws thousands of devotees daily. Crowd
            density shifts through rituals, festivals, and darshan slots.
          </p>
          <p className="mb-0">
            GateCrowd transforms these dynamic patterns into actionable guidance so visitors can choose safer, faster
            entry points.
          </p>
        </div>
      </section>

      <section aria-label="Gate overview" id="overview" className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h3 mb-0">Gate Overview</h2>
          {bestGate && <Badge text={`Best Gate: ${bestGate.name}`} tone="success" />}
        </div>

        {loading && (
          <div className="row g-4">
            {[1, 2, 3, 4].map((item) => (
              <div className="col-sm-6 col-lg-3" key={item}>
                <SkeletonCard />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="row g-4">
            {gateOverview.map((gate) => (
              <div className="col-sm-6 col-lg-3" key={gate.id}>
                <article className={`${styles.card} card h-100 border-0 shadow-sm`}>
                  <img src={gate.image} className={`${styles.gateImage} card-img-top`} alt={`${gate.name} view`} loading="lazy" />
                  <div className="card-body">
                    <h3 className="h5">{gate.name}</h3>
                    <p>{gate.description}</p>
                    <div className="mb-3">
                      <CrowdHeatIndicator value={gate.crowdLevel} peopleRange={gate.peopleRange} />
                    </div>
                    <button
                      type="button"
                      className={`${styles.button3d} btn btn-warning btn-sm`}
                      onClick={() => {
                        navigate('/gates');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Explore Gate
                    </button>
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
