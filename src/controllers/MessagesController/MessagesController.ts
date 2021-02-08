import mongoose from 'mongoose';
import { Server } from 'socket.io';
import moment from 'moment';

import ISocketController from '../../interfaces/ISocketConroller';
import Message from '../../models/Message/Message';
import SocketUtils from '../../utils/SocketUtils';
import authorizedSocketMiddleware from '../../middlewares/AuthorizedSocketMiddleware';

class MessagesController implements ISocketController {
  public socketServer: Server;

  constructor(socketServer: Server) {
    this.socketServer = socketServer;

    this.initSocketActions();
  }

  public initSocketActions() {
    this.socketServer.use(authorizedSocketMiddleware);
    this.socketServer.on('connection', async (socket) => {
      await Message.removeAllFromBeforeToday();

      socket.on('getMessages', async () => {
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
        this.socketServer.emit('newMessage', true);
      });
    });
  }
}

export default MessagesController;
