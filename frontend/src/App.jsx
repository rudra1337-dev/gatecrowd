import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ThreeBackground from './components/common/ThreeBackground';
import Home from './pages/Home';
import Gates from './pages/Gates';
import GateDetails from './pages/GateDetails';
import Alerts from './pages/Alerts';
import About from './pages/About';

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
      <ThreeBackground />
      <Navbar />
      {!isOnline && (
        <div className="offline-banner text-center py-2" role="alert" aria-live="assertive">
          You are offline. Showing cached data and simulated updates.
        </div>
      )}
      <main key={location.pathname} className="page-fade flex-grow-1" aria-live="polite">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/gates" element={<Gates />} />
          <Route path="/gates/:id" element={<GateDetails />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
