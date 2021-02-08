import JwtUtils from '../utils/JwtUtils';

const authorizedSocketMiddleware = (socket, next) => {
  const { token } = socket.handshake.auth as { token: string };
  if (!JwtUtils.verifyToken(token)) {
    return;
  }
  next();
};

export default authorizedSocketMiddleware;
