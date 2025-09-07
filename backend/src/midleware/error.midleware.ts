import { HttpException } from "../exception/http.exception";
import { NextFunction, Request, Response } from "express";

export function errorMidleware(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const status = error.status || 500;
  const message = error.message || "Something wen wrong";

  res.status(status).send({
    status,
    message,
  });
}
