import { HttpException } from "./http.exception";

export class NotAuthorizedException extends HttpException {
  constructor() {
    super(403, "You're not authorized");
  }
}
