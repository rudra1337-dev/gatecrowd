import { Suspense, lazy, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import GlobalSeo from './seo/GlobalSeo';

const ThreeBackground = lazy(() => import('./components/common/ThreeBackground'));
const Home = lazy(() => import('./pages/Home'));
const Gates = lazy(() => import('./pages/Gates'));
const GateDetails = lazy(() => import('./pages/GateDetails'));
const Alerts = lazy(() => import('./pages/Alerts'));
const About = lazy(() => import('./pages/About'));

function App() {
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="app-shell d-flex flex-column min-vh-100">
      <GlobalSeo />
      <Suspense fallback={null}>
        <ThreeBackground />
      </Suspense>
      <Navbar />
      {!isOnline && (
        <div className="offline-banner text-center py-2" role="alert" aria-live="assertive">
          You are offline. Showing cached data and simulated updates.
        </div>
      )}
      <main key={location.pathname} className="page-fade flex-grow-1" aria-live="polite">
        <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/gates" element={<Gates />} />
            <Route path="/gates/:id" element={<GateDetails />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
