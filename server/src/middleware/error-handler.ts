import { APIError } from "../utils/errors";
import { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: APIError,
  _: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!err) {
    next();
  } // If there is no error, call next.

  const status = err.statusCode || 500;
  console.error(err)
  res.status(status).json({ status: status, message: err.message });
}