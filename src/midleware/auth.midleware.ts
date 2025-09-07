import { DataStoredInToken } from "authentication/data-stored-in-token.interface";
import { AuthenticatorMissingTokenException } from "../exception/authentication-missing-token.exception";
import { WrongAuthenticationTokenException } from "../exception/wrong-authentication-token.exception";
import { NextFunction, Response } from "express";
import { RequestWithUser } from "interface/request-with-user.interface";
import { verify } from "jsonwebtoken";
import { userModel } from "../user/user.model";

export async function authMidleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) {
  const cookies = req.cookies;

  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse: DataStoredInToken = verify(
        cookies.Authorization,
        secret,
      ) as DataStoredInToken;
      const id = verificationResponse._id;
      const user = await userModel.findById(id);

      if (user) {
        req.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticatorMissingTokenException());
  }
}
