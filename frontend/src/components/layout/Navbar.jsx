import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import useTheme from '../../hooks/useTheme';
import styles from '../../styles/components/layout/Navbar.module.css';

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`${styles.navbar} navbar fixed-top shadow-sm`} aria-label="Main navigation">
      <div className="container">
        <NavLink className={`${styles.brand} navbar-brand fw-bold`} to="/home" aria-label="GateCrowd home">
          GateCrowd
        </NavLink>

        <button
          className="navbar-toggler d-lg-none"
          type="button"
          aria-controls="mobileNavDrawer"
          aria-expanded={isDrawerOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsDrawerOpen((open) => !open)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="d-none d-lg-flex align-items-center gap-3 ms-auto">
          <NavLink className={`${styles.navLink} nav-link`} to="/home">
            Home
          </NavLink>
          <NavLink className={`${styles.navLink} nav-link`} to="/gates">
            Gates
          </NavLink>
          <NavLink className={`${styles.navLink} nav-link`} to="/alerts">
            Alerts
          </NavLink>
          <NavLink className={`${styles.navLink} nav-link`} to="/about">
            About
          </NavLink>
          <button
            type="button"
            className="btn btn-outline-warning btn-sm"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
      </div>

      <div
        className={`${styles.drawerBackdrop} d-lg-none ${isDrawerOpen ? styles.drawerBackdropOpen : ''}`}
        onClick={() => setIsDrawerOpen(false)}
      />
      <aside
        id="mobileNavDrawer"
        className={`${styles.drawer} d-lg-none ${isDrawerOpen ? styles.drawerOpen : ''}`}
        aria-hidden={!isDrawerOpen}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h6 mb-0">Navigation</h2>
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setIsDrawerOpen(false)} />
        </div>
        <div className="d-grid gap-2">
          <NavLink className={`${styles.navLink} nav-link`} to="/home">
            Home
          </NavLink>
          <NavLink className={`${styles.navLink} nav-link`} to="/gates">
            Gates
          </NavLink>
          <NavLink className={`${styles.navLink} nav-link`} to="/alerts">
            Alerts
          </NavLink>
          <NavLink className={`${styles.navLink} nav-link`} to="/about">
            About
          </NavLink>
          <button
            type="button"
            className="btn btn-outline-warning btn-sm mt-2"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
      </aside>
    </nav>
  );
}

export default Navbar;
