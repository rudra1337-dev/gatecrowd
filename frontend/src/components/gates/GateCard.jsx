import { useNavigate } from 'react-router-dom';
import Badge from '../common/Badge';
import CrowdHeatIndicator from '../common/CrowdHeatIndicator';

function GateCard({ gate, isBestGate = false }) {
  const navigate = useNavigate();
  const openDetails = () => navigate(`/gates/${gate.id}`);

  return (
    <article
      className="card gate-card border-0 shadow-sm h-100"
      onClick={openDetails}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          openDetails();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${gate.name}`}
    >
      <img src={gate.image} className="card-img-top gate-img" alt={`${gate.name} entrance view`} loading="lazy" />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <h2 className="h5 mb-0">{gate.name}</h2>
          {isBestGate && <Badge text="Best Gate to Enter Now" tone="success" />}
        </div>
        <p className="text-muted">ID: {gate.id.toUpperCase()}</p>
        <p className="flex-grow-1">{gate.description}</p>
        <CrowdHeatIndicator value={gate.crowdLevel} peopleRange={gate.peopleRange} />
      </div>
    </article>
  );
}

export default GateCard;
