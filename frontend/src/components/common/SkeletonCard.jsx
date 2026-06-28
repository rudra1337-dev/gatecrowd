import styles from '../../styles/components/common/SkeletonCard.module.css';

function SkeletonCard() {
  return (
    <div className={`${styles.card} card border-0 shadow-sm`} aria-hidden="true">
      <div className={styles.image} />
      <div className="card-body">
        <div className={`${styles.line} w-50 mb-2`} />
        <div className={`${styles.line} w-100 mb-2`} />
        <div className={`${styles.line} w-75`} />
      </div>
    </div>
  );
}

export default SkeletonCard;
