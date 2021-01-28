import { Server } from "socket.io";

import ISocketController from "../../interfaces/ISocketConroller";

class ShoppingListController implements ISocketController {
  public socketServer: Server;
  private clients: string[];

  constructor(socketServer: Server) {
    this.socketServer = socketServer;
    this.clients = [];

    this.initSocketActions();
  }

  public initSocketActions() {
    this.socketServer.on("connect", (socket) => {

    });
  }
}

export default ShoppingListController;