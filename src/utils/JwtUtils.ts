import jwt from 'jsonwebtoken';

class JwtUtils {
  private readonly secretKey: string;

  public static createToken(login: string) {
    console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);
    return jwt.sign({
      login,
    },
      process.env.JWT_SECRET,
      {
      expiresIn: '1d',
    });
  }

  public static verifyToken(token: string): boolean {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

export default JwtUtils;