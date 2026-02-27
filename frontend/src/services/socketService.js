const subscribers = new Map();
let connected = false;

export function connect() {
  connected = true;
  return { connected, mode: 'simulation-placeholder' };
}

export function subscribe(event, callback) {
  if (!subscribers.has(event)) {
    subscribers.set(event, new Set());
  }
  subscribers.get(event).add(callback);

  return () => {
    subscribers.get(event)?.delete(callback);
  };
}

export function emit(event, payload) {
  const listeners = subscribers.get(event);
  if (!listeners) {
    return;
  }
  listeners.forEach((listener) => listener(payload));
}

export function disconnect() {
  connected = false;
  subscribers.clear();
}
