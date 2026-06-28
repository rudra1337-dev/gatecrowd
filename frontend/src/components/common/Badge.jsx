import styles from '../../styles/components/common/Badge.module.css';

function Badge({ text, tone = 'neutral' }) {
  return <span className={`${styles.badge} ${styles[tone] || styles.neutral}`}>{text}</span>;
}

export default Badge;
