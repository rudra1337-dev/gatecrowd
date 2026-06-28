import { useMemo, useState } from 'react';
import { AgCharts } from 'ag-charts-react';
import 'ag-charts-enterprise';
import styles from '../../styles/components/gates/CrowdChart.module.css';

function rangeBounds(peopleRange = '31-60') {
  if (peopleRange.includes('+')) {
    const min = parseInt(peopleRange, 10);
    return { min: Number.isFinite(min) ? min : 120, max: (Number.isFinite(min) ? min : 120) + 20 };
  }
  const [minRaw, maxRaw] = peopleRange.split('-').map((v) => parseInt(v, 10));
  const min = Number.isFinite(minRaw) ? minRaw : 30;
  const max = Number.isFinite(maxRaw) ? maxRaw : min + 20;
  return { min, max };
}

function buildOHLC(history) {
  const now = Date.now();
  return history.map((point, index) => {
    const { min, max } = rangeBounds(point.peopleRange);
    const open = min;
    const close = max;
    const high = max + 2;
    const low = Math.max(0, min - 2);
    const timestamp = new Date(now - (history.length - 1 - index) * 60 * 1000);
    return {
      timestamp,
      open,
      close,
      high,
      low,
      rangeLabel: point.peopleRange || '31-60',
      timeLabel: point.time || timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  });
}

function rangeColor(rangeLabel = '') {
  if (rangeLabel.includes('0-30')) return '#22c55e'; // green
  if (rangeLabel.includes('31-60')) return '#38bdf8'; // sky blue
  if (rangeLabel.includes('61-90')) return '#fbbf24'; // light orange
  if (rangeLabel.includes('91-120')) return '#f97316'; // orange
  if (rangeLabel.includes('120')) return '#ef4444'; // red
  return '#38bdf8';
}

function CrowdChart({ history }) {
  const [dragAction, setDragAction] = useState('hover');

  const data = useMemo(() => buildOHLC(history), [history]);

  const options = useMemo(
    () => ({
      data,
      animation: { enabled: false },
      touch: { dragAction },
      zoom: {
        enabled: true,
        enableAxisDragging: false
      },
      series: [
        {
          type: 'candlestick',
          xKey: 'timestamp',
          xName: 'Time',
          lowKey: 'low',
          highKey: 'high',
          openKey: 'open',
          closeKey: 'close',
          itemStyler: ({ datum }) => {
            const color = rangeColor(datum.rangeLabel);
            return {
              stroke: color,
              fill: color,
              strokeWidth: 1.5
            };
          },
          tooltip: {
            renderer: ({ datum }) => ({
              title: datum.timeLabel,
              content: `${datum.rangeLabel} people`
            })
          }
        }
      ],
      axes: [
        {
          type: 'ordinal-time',
          position: 'bottom',
          title: { text: 'Time' }
        },
        {
          type: 'number',
          position: 'left',
          title: { text: 'People (range bounds)' }
        }
      ],
      legend: { enabled: false },
      background: {
        fill: 'linear-gradient(180deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'
      },
      padding: { top: 10, right: 10, bottom: 40, left: 60 },
      theme: {
        overrides: {
          cartesian: {
            axes: {
              number: {
                gridStyle: [{ stroke: '#2f3b4a', lineDash: [4, 4] }]
              },
              category: {
                gridStyle: [{ stroke: '#2f3b4a', lineDash: [4, 4] }]
              }
            }
          }
        }
      },
      interactions: { enabled: true }
    }),
    [data, dragAction]
  );

  return (
    <section className={`${styles.wrapper} p-3 rounded-4`} aria-label="Live crowd range over time chart">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h5 mb-0">People Range vs Time</h2>
        <div className="d-flex gap-2 align-items-center">
          <span className="small text-muted">Drag:</span>
          {['none', 'drag', 'hover'].map((mode) => (
            <button
              key={mode}
              type="button"
              className={`btn btn-sm ${dragAction === mode ? 'btn-success' : 'btn-outline-secondary'}`}
              onClick={() => setDragAction(mode)}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.chartFrame}>
        <AgCharts options={options} />
      </div>
    </section>
  );
}

export default CrowdChart;
