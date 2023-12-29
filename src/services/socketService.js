import { socket } from "../connection/Socket";

export default {
  connect() {
    if (!socket.connected) {
      socket.connect();
    }
  },
  disconnect() {
    if (socket.connected) {
      socket.disconnect();
    }
  },
  on(event, callback) {
    socket.on(event, callback);
  },
  off(event, callback) {
    socket.off(event, callback);
  },
  emit(event, data) {
    socket.emit(event, data);
  },
};
