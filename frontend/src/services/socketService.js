import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const SOCKET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

let socket;

function ensureSocket() {
  if (socket) {
    return socket;
  }

  socket = io(SOCKET_BASE_URL, {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5
  });

  return socket;
}

export function connect() {
  const instance = ensureSocket();
  if (!instance.connected && !instance.active) {
    instance.connect();
  }
  return instance;
}

export function subscribe(event, callback) {
  const instance = connect();
  instance.on(event, callback);
  return () => instance.off(event, callback);
}

export function emit(event, payload) {
  const instance = connect();
  if (instance.connected) {
    instance.emit(event, payload);
  }
}

export function disconnect() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

export function isConnected() {
  return Boolean(socket?.connected);
}
