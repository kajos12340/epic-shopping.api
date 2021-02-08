import { Socket } from 'socket.io';

import JwtUtils from './JwtUtils';

class SocketUtils {
  public static getUserId(socket: Socket) {
    const { token } = socket.handshake.auth as { token: string };
    return JwtUtils.getUserId(token);
  }
}

export default SocketUtils;
