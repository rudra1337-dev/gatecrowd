function CrowdChart({ history }) {
  const yTicks = [
    { label: 'EXTREME', score: 5 },
    { label: 'VERY HIGH', score: 4 },
    { label: 'HIGH', score: 3 },
    { label: 'MODERATE', score: 2 },
    { label: 'LOW', score: 1 }
  ];

  const points = history.map((point, index) => {
    const x = history.length > 1 ? (index / (history.length - 1)) * 100 : 0;
    const y = ((5 - point.score) / 4) * 100;
    return { x, y, ...point };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ');

  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x.toFixed(2)} 100 L ${points[0].x.toFixed(2)} 100 Z`
    : '';

  const latest = points[points.length - 1];

  return (
    <section className="crowd-chart-wrapper glass-panel p-3 rounded-4" aria-label="Live crowd range over time chart">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h5 mb-0">People Range vs Time</h2>
        <small className="text-muted">Trading-style live graph</small>
      </div>

      <div className="trade-graph-wrap">
        <svg viewBox="0 0 100 100" className="trade-graph" role="img" aria-label="Crowd range trading graph">
          <defs>
            <linearGradient id="tradeLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#20b06f" />
              <stop offset="50%" stopColor="#f3b644" />
              <stop offset="100%" stopColor="#d23838" />
            </linearGradient>
            <linearGradient id="tradeAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f3b644" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#f3b644" stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => {
            const y = ((5 - tick.score) / 4) * 100;
            return <line key={tick.label} x1="0" y1={y} x2="100" y2={y} className="trade-grid-line" />;
          })}

          {[20, 40, 60, 80].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="100" className="trade-grid-line vertical" />
          ))}

          {areaPath && <path d={areaPath} className="trade-area" />}
          <path d={linePath} className="trade-line" />

          {latest && (
            <>
              <line x1={latest.x} y1="0" x2={latest.x} y2="100" className="trade-crosshair" />
              <circle cx={latest.x} cy={latest.y} r="2" className="trade-point" />
            </>
          )}
        </svg>

        {latest && (
          <div className="trade-price-tag" style={{ top: `${latest.y}%` }}>
            {latest.peopleRange}
          </div>
        )}
      </div>

      <div className="d-flex justify-content-between mt-3 small text-muted">
        <span>{points[0]?.time || '--:--'}</span>
        <span>{points[Math.floor(points.length / 2)]?.time || '--:--'}</span>
        <span>{points[points.length - 1]?.time || '--:--'}</span>
      </div>
    </section>
  );
}

export default CrowdChart;
