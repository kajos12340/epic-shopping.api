import { Server } from "socket.io";

import ISocketController from "../../interfaces/ISocketConroller";

class AuthController implements ISocketController {
  public socketServer: Server;
  private clients: string[];

  constructor(socketServer: Server) {
    this.socketServer = socketServer;
    this.clients = [];

    this.initSocketActions();
  }

  public initSocketActions() {
    console.log('initSocketActions');
    const getApiAndEmit = socket => {
      const response = new Date();
      // Emitting a new message. Will be consumed by the client
      socket.emit("FromAPI", response);
    };

    let interval;

    this.socketServer.on("connect", (socket) => {
      socket.on('joinRoom', (user) => {
        this.clients.push(user.name);

        this.socketServer.emit('addedUser', { message: `user: ${user.name} has joined the room!!!`, currentUsers: this.clients });
      });
      console.log("New client connected");
      if (interval) {
        clearInterval(interval);
      }
      interval = setInterval(() => getApiAndEmit(socket), 1000);
      socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
      });
    });
  }


}

export default AuthController;