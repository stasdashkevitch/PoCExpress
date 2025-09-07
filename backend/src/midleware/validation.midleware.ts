import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { HttpException } from "../exception/http.exception";
import * as express from "express";

export function validationMidleware<T>(
  type: any,
  skipMissingProperties = false,
): express.RequestHandler {
  return (req, res, next) => {
    validate(plainToClass(type, req.body), { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = extractMessages(errors).join(", ");
          next(new HttpException(400, message));
        } else {
          next();
        }
      },
    );
  };
}

function extractMessages(errors: ValidationError[]): string[] {
  return errors.flatMap((error) => {
    const messages = Object.values(error.constraints || {});
    const children = error.children?.length
      ? extractMessages(error.children)
      : [];

    return [...messages, ...children];
  });
}
