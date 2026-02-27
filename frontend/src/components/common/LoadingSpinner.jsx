function LoadingSpinner({ message = 'Loading GateCrowd insights...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5" role="status" aria-live="polite">
      <div className="spinner-border text-warning" aria-hidden="true" />
      <p className="mt-3 mb-0">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
