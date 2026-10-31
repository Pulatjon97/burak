import Errors, { HttpCode, Message } from "../libs/utils/Errors";
// import { resolve } from "dns";
import { Member } from "../libs/types/member";
import jwt from "jsonwebtoken";
import { AUTH_TIMER } from "../libs/utils/config";

class AuthService {
  public async createToken(payload: Member): Promise<string> {
    const duration = `${AUTH_TIMER}h`;

    return new Promise<string>((resolve, reject) => {
      const secret = process.env.SECRET_TOKEN;
      if (!secret) {
        reject(
          new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED),
        );
        return;
      }

      jwt.sign(payload, secret, { expiresIn: duration }, (err, token) => {
        if (err) {
          reject(
            new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED),
          );
        } else {
          resolve(token as string);
        }
      });
    });
  }
}
export default AuthService;
