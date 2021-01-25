import { Server } from 'socket.io';

interface ISocketController {
  initSocketActions: Function,
  socketServer: Server,
}

export default ISocketController;
