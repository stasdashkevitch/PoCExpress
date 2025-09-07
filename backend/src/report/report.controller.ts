import { NextFunction, Request, Response, Router } from "express";
import { Controller } from "../interface/controller.interface";
import { userModel } from "../user/user.model";

export class ReportController implements Controller {
  path = "report";
  router = Router();
  private user = userModel;

  constructor() {
    this.inizializeRoutes();
  }

  private inizializeRoutes() {
    this.router.get(`/${this.path}`, this.generateReposrt);
  }

  private generateReposrt = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const userByCountires = await this.user.aggregate([
      {
        $match: {
          "address.country": {
            $exists: true,
          },
        },
      },
      {
        $group: {
          _id: {
            country: "$address.country",
          },
          users: {
            $push: {
              name: "$name",
              _id: "$_id",
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "users._id",
          foreignField: "author",
          as: "articles",
        },
      },
      {
        $addFields: {
          amountOfArticles: {
            $size: "$articles",
          },
        },
      },
      {
        $sort: {
          count: 1,
        },
      },
    ]);

    res.send({
      userByCountires,
    });
  };
}
