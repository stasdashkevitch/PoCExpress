import { HttpException } from "./http.exception";

export class AuthenticatorMissingTokenException extends HttpException {
  constructor() {
    super(401, "Authenticator missing token");
  }
}
