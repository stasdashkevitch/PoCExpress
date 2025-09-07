import { compare, hash } from "bcrypt";
import { UserWithThatExceptionAlreadyExistsException } from "../exception/user-with-that-email-already-exists.exception";
import { NextFunction, Request, Response, Router } from "express";
import { Controller } from "../interface/controller.interface";
import { CreateUserDto } from "../user/create-user.dto";
import { userModel } from "../user/user.model";
import { LogInDto } from "./log-in.dto";
import { WrongCredentialsException } from "../exception/wrong-credetials.exception";
import { validationMidleware } from "../midleware/validation.midleware";
import { User } from "../user/user.interface";
import { TokenData } from "./token-data.interface";
import { DataStoredInToken } from "./data-stored-in-token.interface";
import { sign } from "jsonwebtoken";

export class AuthenticationController implements Controller {
  public path = "/auth";
  public router = Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // REGISTRATION
    this.router.post(
      `${this.path}/register`,
      validationMidleware(CreateUserDto),
      this.registration,
    );
    // LOG IN
    this.router.post(
      `${this.path}/login`,
      validationMidleware(LogInDto),
      this.loggingIn,
    );
    // LOG OUT
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }

  private registration = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const userData: CreateUserDto = req.body;

    if (await this.user.findOne({ email: userData.email })) {
      next(new UserWithThatExceptionAlreadyExistsException(userData.email));
    } else {
      const hashedPassword = await hash(userData.password, 10);

      const user = await this.user.create({
        ...userData,
        password: hashedPassword,
      });
      user.password = undefined;
      const tokenData = this.createToken(user);
      res.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
      res.send(user);
    }
  };

  private loggingIn = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const logInData: LogInDto = req.body;

    const user = await this.user.findOne({ email: logInData.email });

    if (user) {
      const isPasswordMatching = await compare(
        logInData.password,
        user.password,
      );

      if (isPasswordMatching) {
        user.password = undefined;
        const tokenData = this.createToken(user);
        res.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
        res.send(user);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  };

  private loggingOut = (request: Request, response: Response) => {
    response.setHeader("Set-Cookie", ["Authorization=;Max-age=0"]);
    response.send(200);
  };

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60;
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
    };

    return {
      expiresIn,
      token: sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
}
