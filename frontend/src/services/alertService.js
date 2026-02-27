function priorityFromCrowd(level) {
  if (level > 105) {
    return 'High';
  }
  if (level > 70) {
    return 'Medium';
  }
  return 'Low';
}

export function getAlertsFromGates(gates) {
  const alerts = gates.map((gate) => {
    const priority = priorityFromCrowd(gate.crowdLevel);
    let message = 'Steady movement. Entry is manageable.';

    if (priority === 'High') {
      message = 'Extreme queue buildup detected. Consider alternate gate.';
    } else if (priority === 'Medium') {
      message = 'Moderate congestion. Expect short waiting period.';
    }

    return {
      id: gate.id,
      gateName: gate.name,
      priority,
      message,
      recommendation:
        priority === 'High' ? 'Delay entry for 20-30 minutes.' : 'Proceed with normal caution and hydration.'
    };
  });

  const bestGate = gates.reduce((acc, gate) => (gate.crowdLevel < acc.crowdLevel ? gate : acc), gates[0]);

  return [
    {
      id: 'best-gate',
      gateName: 'Visitor Guidance',
      priority: 'Low',
      message: `Best gate currently: ${bestGate.name}.`,
      recommendation: 'Use this gate for faster darshan entry.'
    },
    ...alerts
  ];
}
