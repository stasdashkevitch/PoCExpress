import { HttpException } from "./http.exception";

export class UserWithThatExceptionAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(400, `User with email:${email} already exists`);
  }
}
