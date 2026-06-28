import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/components/AIChatWidget/ChatInputBar.module.css';

function ChatInputBar({ onSend, disabled }) {
  const textareaRef = useRef(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [value]);

  const submitMessage = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  };

  return (
    <div className={`${styles.inputBar} d-flex align-items-end gap-2`}>
      <textarea
        ref={textareaRef}
        className={`${styles.textarea} form-control`}
        rows="1"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask GateCrowd AI..."
        disabled={disabled}
        aria-label="Message GateCrowd AI"
      />
      <button
        type="button"
        className={`${styles.sendBtn} btn btn-primary d-flex align-items-center justify-content-center text-white`}
        onClick={submitMessage}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
      >
        <span aria-hidden="true">&gt;</span>
      </button>
    </div>
  );
}

export default ChatInputBar;
