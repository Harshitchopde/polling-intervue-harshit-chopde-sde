import { io } from "socket.io-client";

class SocketService {
  static instance = null;

  constructor() {
    this.socket = null;
  }

  static getInstance() {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:4000", {
        autoConnect: false,
      });
    }
    if (!this.socket.connected) {
      this.socket.connect();
    }
    return this.socket;
  }

  getSocket() {
    return this.socket;
  }
}

export default SocketService;
