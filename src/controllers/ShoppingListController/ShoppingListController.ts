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
    this.socketServer.on("connect", (socket) => {
      socket.on('joinRoom', (user) => {
        this.clients.push(user.name);

        socket.join(user.roomName);

        this.socketServer.in(user.roomName).emit('addedUser', { message: `user: ${user.name} has joined the room!!!`, currentUsers: this.clients });
      });
      console.log("New client connected");
    });
  }
}

export default AuthController;