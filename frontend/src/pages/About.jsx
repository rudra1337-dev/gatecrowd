import { useEffect, useMemo, useState } from 'react';
import { API_BASE_URL } from '../services/httpClient';
import { useCrowdContext } from '../context/CrowdContext';
import SeoHead from '../seo/SeoHead';
import { buildBreadcrumbSchema, buildProjectSchema } from '../seo/schema';
import styles from '../styles/pages/About.module.css';

const TOTAL_VISITORS_KEY = 'gatecrowd_total_visitors';
const FIRST_VISIT_KEY = 'gatecrowd_first_visit_registered';
const ACTIVE_VISITORS_KEY = 'gatecrowd_active_visitors';
const TAB_ID_KEY = 'gatecrowd_tab_id';
const PRESENCE_TTL_MS = 45000;
const HEARTBEAT_MS = 15000;

function safeReadNumber(key, fallback = 0) {
  const value = Number(localStorage.getItem(key));
  return Number.isFinite(value) ? value : fallback;
}

function parsePresence() {
  try {
    const raw = localStorage.getItem(ACTIVE_VISITORS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writePresence(data) {
  localStorage.setItem(ACTIVE_VISITORS_KEY, JSON.stringify(data));
}

function cleanupPresence(map) {
  const now = Date.now();
  return Object.fromEntries(Object.entries(map).filter(([, lastSeen]) => now - Number(lastSeen) < PRESENCE_TTL_MS));
}

function About() {
  const { gates } = useCrowdContext();
  const [totalVisitors, setTotalVisitors] = useState(() => safeReadNumber(TOTAL_VISITORS_KEY, 1));
  const [currentVisitors, setCurrentVisitors] = useState(1);

  const liveTempleVisitors = useMemo(
    () => gates.reduce((sum, gate) => sum + (Number(gate.crowdLevel) || 0), 0),
    [gates]
  );
  const breadcrumbSchema = useMemo(
    () =>
      buildBreadcrumbSchema([
        { name: 'Home', path: '/home' },
        { name: 'About', path: '/about' }
      ]),
    []
  );

  useEffect(() => {
    const alreadyRegistered = localStorage.getItem(FIRST_VISIT_KEY) === '1';
    if (!alreadyRegistered) {
      const next = safeReadNumber(TOTAL_VISITORS_KEY, 0) + 1;
      localStorage.setItem(TOTAL_VISITORS_KEY, String(next));
      localStorage.setItem(FIRST_VISIT_KEY, '1');
      setTotalVisitors(next);
      return;
    }

    setTotalVisitors(safeReadNumber(TOTAL_VISITORS_KEY, 1));
  }, []);

  useEffect(() => {
    let tabId = sessionStorage.getItem(TAB_ID_KEY);
    if (!tabId) {
      tabId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(TAB_ID_KEY, tabId);
    }

    const updatePresence = () => {
      const cleaned = cleanupPresence(parsePresence());
      cleaned[tabId] = Date.now();
      writePresence(cleaned);
      setCurrentVisitors(Object.keys(cleaned).length);
    };

    const removePresence = () => {
      const cleaned = cleanupPresence(parsePresence());
      delete cleaned[tabId];
      writePresence(cleaned);
      setCurrentVisitors(Math.max(1, Object.keys(cleaned).length));
    };

    const handleStorage = () => {
      const cleaned = cleanupPresence(parsePresence());
      setCurrentVisitors(Math.max(1, Object.keys(cleaned).length));
    };

    updatePresence();
    const heartbeat = setInterval(updatePresence, HEARTBEAT_MS);

    window.addEventListener('storage', handleStorage);
    window.addEventListener('beforeunload', removePresence);

    return () => {
      clearInterval(heartbeat);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('beforeunload', removePresence);
      removePresence();
    };
  }, []);

  return (
    <div className={`${styles.page} container`}>
      <SeoHead
        title="About GateCrowd Frontend Architecture"
        path="/about"
        description="Learn the GateCrowd frontend architecture, backend integration, visitor tracking, and scalability approach."
        keywords="GateCrowd architecture, react vite seo project, temple crowd monitoring system"
        structuredData={[breadcrumbSchema, buildProjectSchema()]}
      />
      <section className={`${styles.panel} rounded-4 p-4 p-md-5 mb-4`}>
        <h1 className="h2 mb-3">About GateCrowd</h1>
        <p>
          GateCrowd addresses a real operational challenge at high-footfall pilgrimage destinations: visitors often lack
          clear, timely guidance on entry congestion.
        </p>

        <h2 className="h4 mt-4">Problem Statement</h2>
        <p>
          During darshan peaks and festival windows, crowd movement can become unpredictable, increasing wait time and
          reducing visitor comfort.
        </p>

        <h2 className="h4 mt-4">Solution</h2>
        <p>
          GateCrowd provides gate-level crowd visibility, best-gate recommendations, and live alert signals through a
          real-time ready frontend architecture.
        </p>

        <h2 className="h4 mt-4">Architecture</h2>
        <p>
          The frontend uses modular React components, centralized context state, reusable services, and a socket
          placeholder layer for seamless backend upgrade.
        </p>

        <h2 className="h4 mt-4">Backend Details</h2>
        <p className="mb-2">Connected backend: {API_BASE_URL}</p>
        <ul className="mb-0">
          <li>Gates API: `/api/gates`</li>
          <li>Live Crowd API: `/api/crowd/:gateId`</li>
          <li>Feedback API: `POST /api/feedback`</li>
          <li>Socket-ready architecture in place for live push events</li>
        </ul>
      </section>

      <section className="row g-3" aria-label="Visitor tracking stats">
        <div className="col-md-4">
          <article className={`${styles.card} card border-0 shadow-sm h-100`}>
            <div className="card-body">
              <h2 className="h5">Current Site Visitors</h2>
              <p className="display-6 mb-0">{currentVisitors.toLocaleString()}</p>
              <small className="text-muted">Active visitors currently viewing this site.</small>
            </div>
          </article>
        </div>
        <div className="col-md-4">
          <article className={`${styles.card} card border-0 shadow-sm h-100`}>
            <div className="card-body">
              <h2 className="h5">Visitors Till Now</h2>
              <p className="display-6 mb-0">{totalVisitors.toLocaleString()}</p>
              <small className="text-muted">Increases only once for a first-time visit in this browser.</small>
            </div>
          </article>
        </div>
        <div className="col-md-4">
          <article className={`${styles.card} card border-0 shadow-sm h-100`}>
            <div className="card-body">
              <h2 className="h5">Live Temple Footfall</h2>
              <p className="display-6 mb-0">{liveTempleVisitors.toLocaleString()}</p>
              <small className="text-muted">Real-time total from backend crowd endpoint across all gates.</small>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

export default About;
