import styles from '../../styles/components/AIChatWidget/ChatHeader.module.css';

function ChatHeader({ onClose }) {
  return (
    <header className={`${styles.header} d-flex align-items-center justify-content-between px-3 text-white`}>
      <div className="d-flex align-items-center gap-2">
        <div className={`${styles.avatar} position-relative d-flex align-items-center justify-content-center`}>
          <span aria-hidden="true">GC</span>
          <span className={styles.onlineDot} />
        </div>
        <div>
          <div className={styles.title}>GateCrowd AI</div>
          <div className={styles.subtitle}>Online</div>
        </div>
      </div>
      <button type="button" className={`${styles.closeBtn} btn d-flex align-items-center justify-content-center`} onClick={onClose} aria-label="Close chat">
        <span aria-hidden="true">x</span>
      </button>
    </header>
  );
}

export default ChatHeader;
