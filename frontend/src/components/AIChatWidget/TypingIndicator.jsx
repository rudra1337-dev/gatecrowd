import styles from '../../styles/components/AIChatWidget/TypingIndicator.module.css';

function TypingIndicator() {
  return (
    <div className={`${styles.wrapper} d-flex align-items-end gap-2`}>
      <div>
        <div className={styles.bubble}>
          <div className={`${styles.dots} d-flex gap-1 align-items-center`}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        </div>
        <div className={styles.thinkingText}>Thinking...</div>
      </div>
    </div>
  );
}

export default TypingIndicator;
