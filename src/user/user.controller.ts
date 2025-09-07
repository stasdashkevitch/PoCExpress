import { Controller } from "interface/controller.interface";
import { userModel } from "./user.model";
import { NextFunction, Response, Router } from "express";
import { RequestWithUser } from "interface/request-with-user.interface";
import { NotAuthorizedException } from "../exception/not-authorized.exception";

export class UserController implements Controller {
  path = "/user";
  router = Router();
  user = userModel;

  constructor() {}

  private initializeRoutes() {}

  private getAllPostsOfUser = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    const userId = req.params.id;

    if (userId == req.user._id) {
      const posts = await this.user.find({ author: userId });
      res.send(posts);
    }

    next(new NotAuthorizedException());
  };
}
