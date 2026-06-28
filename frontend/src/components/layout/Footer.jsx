import styles from '../../styles/components/layout/Footer.module.css';

function Footer() {
  return (
    <footer className={`${styles.footer} mt-auto py-4`}>
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h2 className="h5">GateCrowd</h2>
            <p className="mb-0">
              Real-time crowd guidance platform to help visitors choose the best entry route for Puri Jagannath
              Temple.
            </p>
          </div>
          <div className="col-md-4">
            <h2 className="h6">Contact</h2>
            <p className="mb-1">Email: rudra1337.dev@gmail.com</p>
            {/* <p className="mb-1">Phone: +91 98765 43210</p>*/}
            <p className="mb-0">Puri, Odisha, India</p>
          </div>
          <div className="col-md-4">
            <h2 className="h6">Credits & Links</h2>
            <ul className="list-unstyled mb-0">
              <li>Built with React + Bootstrap 5</li>
              <li>Crowd data currently simulated</li>
              <li>Realtime-ready Socket architecture placeholder</li>
              <li>
                <a href="/about" className="link-secondary">
                  Read Architecture Notes
                </a>
              </li>
              <li>
                <a href="/alerts" className="link-secondary">
                  Check Live Alerts
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
