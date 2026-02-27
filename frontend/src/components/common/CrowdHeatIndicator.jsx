function deriveRange(value) {
  if (value <= 30) {
    return '0-30';
  }
  if (value <= 60) {
    return '31-60';
  }
  if (value <= 90) {
    return '61-90';
  }
  if (value <= 120) {
    return '91-120';
  }
  return '120+';
}

function CrowdHeatIndicator({ value, peopleRange }) {
  let label = 'LOW';
  let className = 'bg-success';

  if (value > 90) {
    label = 'VERY HIGH';
    className = 'bg-danger';
  } else if (value > 60) {
    label = 'HIGH';
    className = 'bg-warning text-dark';
  } else if (value > 30) {
    label = 'MODERATE';
    className = 'bg-info text-dark';
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <span className={`badge ${className}`}>{label}</span>
      <small>{peopleRange || deriveRange(value)} people range</small>
    </div>
  );
}

export default CrowdHeatIndicator;
