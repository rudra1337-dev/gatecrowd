function SkeletonCard() {
  return (
    <div className="card skeleton-card border-0 shadow-sm" aria-hidden="true">
      <div className="skeleton-image" />
      <div className="card-body">
        <div className="skeleton-line w-50 mb-2" />
        <div className="skeleton-line w-100 mb-2" />
        <div className="skeleton-line w-75" />
      </div>
    </div>
  );
}

export default SkeletonCard;
