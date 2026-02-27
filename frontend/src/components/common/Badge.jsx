function Badge({ text, tone = 'neutral' }) {
  return <span className={`gc-badge gc-badge-${tone}`}>{text}</span>;
}

export default Badge;
