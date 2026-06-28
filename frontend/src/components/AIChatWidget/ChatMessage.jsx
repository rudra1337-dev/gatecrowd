import styles from '../../styles/components/AIChatWidget/ChatMessage.module.css';

function formatTime(timestamp) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(timestamp);
}

function ChatMessage({ message }) {
  return (
    <div className={`${styles.messageWrapper} ${styles[message.role]}`}>
      <div className={`${styles.bubble} ${styles[message.role]} ${message.isError ? styles.bubbleError : ''}`}>
        <div>{message.text}</div>
        <div className={styles.timestamp}>{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
}

export default ChatMessage;
