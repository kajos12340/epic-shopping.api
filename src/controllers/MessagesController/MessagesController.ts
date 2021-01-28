import mongoose from 'mongoose';
import { Server } from "socket.io";
import moment from 'moment';

import ISocketController from "../../interfaces/ISocketConroller";
import Message from "../../models/Message/Message";
import JwtUtils from "../../utils/JwtUtils";
import SocketUtils from "../../utils/SocketUtils";

class MessagesController implements ISocketController {
  public socketServer: Server;
  private clients: string[];

  constructor(socketServer: Server) {
    this.socketServer = socketServer;
    this.clients = [];

    this.initSocketActions();
  }

  public initSocketActions() {
    this.socketServer.use((socket, next) => {
      const { token } = socket.handshake.auth as { token: string };
      if (!JwtUtils.verifyToken(token)) {
        return;
      }
      next();
    });
    this.socketServer.on("connection", async (socket) => {
      await Message.removeAllFromBeforeToday();

      socket.on("getMessages", async () => {
        const userId = SocketUtils.getUserId(socket);
        const messages = await Message.getMessagesWithAuthors(userId);
        this.socketServer.emit('messagesList', messages);
      });

      socket.on('newMessage', async (text) => {
        const userId = SocketUtils.getUserId(socket);

        const newMessage = new Message({
          author: new mongoose.Types.ObjectId(userId),
          date: moment().toDate(),
          text,
        });
        await newMessage.save();

        const messages = await Message.getMessagesWithAuthors(userId);
        this.socketServer.emit('messagesList', messages);
      });
    });
  }
}

export default MessagesController;