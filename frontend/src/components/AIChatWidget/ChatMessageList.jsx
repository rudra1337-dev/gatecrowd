import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import styles from '../../styles/components/AIChatWidget/ChatMessageList.module.css';

function ChatMessageList({ messages, isTyping }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className={styles.messageList} aria-live="polite">
      <div className="d-flex flex-column gap-2">
        {messages.length === 0 && <div className={styles.emptyState}>No messages yet.</div>}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={endRef} />
      </div>
    </div>
  );
}

export default ChatMessageList;
