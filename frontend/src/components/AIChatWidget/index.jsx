import { useEffect, useMemo, useRef, useState } from 'react';
import ChatCard from './ChatCard';
import styles from '../../styles/components/AIChatWidget/index.module.css';

const FAB_SIZE = 56;
const EDGE_GAP = 24;
const SNAP_GAP = 80;
const STORAGE_KEY = 'gatecrowd-ai-chat-position';

function getInitialPosition() {
  if (typeof window === 'undefined') {
    return { x: 24, y: 24 };
  }

  const fallback = {
    x: Math.max(EDGE_GAP, window.innerWidth - SNAP_GAP),
    y: Math.max(EDGE_GAP, window.innerHeight - SNAP_GAP),
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved?.edge) return fallback;

    const offset = Number.isFinite(saved.offset) ? saved.offset : EDGE_GAP;
    if (saved.edge === 'left') return { x: EDGE_GAP, y: offset };
    if (saved.edge === 'right') return { x: Math.max(EDGE_GAP, window.innerWidth - SNAP_GAP), y: offset };
    if (saved.edge === 'top') return { x: offset, y: EDGE_GAP };
    if (saved.edge === 'bottom') return { x: offset, y: Math.max(EDGE_GAP, window.innerHeight - SNAP_GAP) };
  } catch {
    return fallback;
  }

  return fallback;
}

function clampPosition(x, y) {
  return {
    x: Math.min(Math.max(EDGE_GAP, x), window.innerWidth - FAB_SIZE - EDGE_GAP),
    y: Math.min(Math.max(EDGE_GAP, y), window.innerHeight - FAB_SIZE - EDGE_GAP),
  };
}

function getPoint(event) {
  const point = event.touches?.[0] ?? event.changedTouches?.[0] ?? event;
  return { x: point.clientX, y: point.clientY };
}

function AIChatWidget() {
  const fabRef = useRef(null);
  const dragRef = useRef(null);
  const [position, setPosition] = useState(getInitialPosition);
  const positionRef = useRef(position);
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setHasUnread(false);
      return undefined;
    }

    const timer = setTimeout(() => setIsRendered(false), 210);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      setPosition((current) => clampPosition(current.x, current.y));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const snapToNearestEdge = (currentPosition) => {
    const distances = {
      left: currentPosition.x,
      right: window.innerWidth - currentPosition.x - FAB_SIZE,
      top: currentPosition.y,
      bottom: window.innerHeight - currentPosition.y - FAB_SIZE,
    };
    const edge = Object.entries(distances).sort((a, b) => a[1] - b[1])[0][0];
    const nextPosition = { ...currentPosition };
    let offset = EDGE_GAP;

    if (edge === 'left') {
      nextPosition.x = EDGE_GAP;
      offset = nextPosition.y;
    }
    if (edge === 'right') {
      nextPosition.x = Math.max(EDGE_GAP, window.innerWidth - SNAP_GAP);
      offset = nextPosition.y;
    }
    if (edge === 'top') {
      nextPosition.y = EDGE_GAP;
      offset = nextPosition.x;
    }
    if (edge === 'bottom') {
      nextPosition.y = Math.max(EDGE_GAP, window.innerHeight - SNAP_GAP);
      offset = nextPosition.x;
    }

    const clamped = clampPosition(nextPosition.x, nextPosition.y);
    setPosition(clamped);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ edge, offset }));
  };

  const handleDragStart = (event) => {
    const point = getPoint(event);
    dragRef.current = {
      originX: point.x,
      originY: point.y,
      startX: position.x,
      startY: position.y,
      moved: false,
    };
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return undefined;

    const handleDragMove = (event) => {
      if (!dragRef.current) return;
      event.preventDefault();

      const point = getPoint(event);
      const deltaX = point.x - dragRef.current.originX;
      const deltaY = point.y - dragRef.current.originY;
      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        dragRef.current.moved = true;
      }

      setPosition(clampPosition(dragRef.current.startX + deltaX, dragRef.current.startY + deltaY));
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      snapToNearestEdge(positionRef.current);
    };

    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleDragMove, { passive: false });
    window.addEventListener('touchend', handleDragEnd);

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  const fabClasses = useMemo(() => {
    const pulseClass = !isOpen && !isDragging ? styles.fabPulse : '';
    const draggingClass = isDragging ? styles.fabDragging : '';
    return `${styles.fab} ${pulseClass} ${draggingClass} d-flex align-items-center justify-content-center rounded-circle shadow`;
  }, [isDragging, isOpen]);

  const handleFabClick = () => {
    if (dragRef.current?.moved) {
      dragRef.current = null;
      return;
    }
    setIsOpen((current) => !current);
  };

  return (
    <>
      {isRendered && <ChatCard isOpen={isOpen} onClose={() => setIsOpen(false)} fabRef={fabRef} />}
      <button
        ref={fabRef}
        type="button"
        className={fabClasses}
        style={{ left: position.x, top: position.y }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onClick={handleFabClick}
        aria-label={isOpen ? 'Close GateCrowd AI Assistant' : 'Open GateCrowd AI Assistant'}
      >
        <span className={styles.fabIcon} aria-hidden="true">
          AI
        </span>
        {hasUnread && !isOpen && <span className={styles.badge} />}
      </button>
    </>
  );
}

export default AIChatWidget;
