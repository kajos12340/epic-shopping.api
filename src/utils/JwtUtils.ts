import jwt from 'jsonwebtoken';

class JwtUtils {
  public static createToken(login: string, id: string) {
    return jwt.sign({
      login,
      id,
    },
      process.env.JWT_SECRET,
      {
      expiresIn: '1d',
    });
  }

  public static verifyToken(token: string): boolean {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  public static getUserId(token: string): string {
    return jwt.decode(token.split(' ')[1])?.id;
  }
}

export default JwtUtils;