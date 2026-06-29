import { useEffect, useRef, useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import ChatInputBar from './ChatInputBar';
import { fetchAIResponse } from '../../services/chatService';
import styles from '../../styles/components/AIChatWidget/ChatCard.module.css';

const welcomeMessage = {
  id: 'welcome',
  role: 'ai',
  text: "Hi! 👋 I'm your GateCrowd AI Assistant.\nAsk me about crowd management, venue occupancy, or event safety.",
  timestamp: new Date(),
};

function ChatCard({ isOpen, onClose, fabRef }) {
  const cardRef = useRef(null);
  const [messages, setMessages] = useState([welcomeMessage]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!cardRef.current || !fabRef.current) return;
      if (!cardRef.current.contains(event.target) && !fabRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [fabRef, onClose]);

  const handleSend = async (text) => {
    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((current) => [...current, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetchAIResponse(text);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'ai',
          text: response,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'ai',
          text: '⚠️ Something went wrong. Please try again.',
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section
      ref={cardRef}
      className={`${styles.card} ${isOpen ? styles.cardOpen : styles.cardClose} overflow-hidden`}
      aria-label="GateCrowd AI Assistant"
    >
      <ChatHeader onClose={onClose} />
      <ChatMessageList messages={messages} isTyping={isTyping} />
      <ChatInputBar onSend={handleSend} disabled={isTyping} />
    </section>
  );
}

export default ChatCard;
