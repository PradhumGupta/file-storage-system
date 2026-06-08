import { main } from "../config/prisma";
import { APIError } from "../utils/errors";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export function errorHandler(
  err: any,
  _: Request,
  res: Response,
  next: NextFunction,
): any {
  if (!err) {
    return next();
  }

  console.error("Error Caught by Handler:", err);

  // If there's a database connection issue, attempt reconnect (legacy behavior)
  if (err.message && err.message.includes('database server')) {
    main().catch(console.error);
  }

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((e: any) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: formattedErrors,
    });
  }

  // Handle Prisma Known Request Errors (e.g., Unique constraint failed)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Conflict: Unique constraint failed. Record already exists.",
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Not Found: The requested record does not exist.",
      });
    }
    return res.status(400).json({
      success: false,
      message: `Database Error: ${err.message}`,
    });
  }

  // Handle Prisma Validation Errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: "Database Validation Error",
    });
  }

  // Handle JWT Errors
  if (err instanceof TokenExpiredError) {
    return res.status(401).json({
      success: false,
      message: "Token has expired",
    });
  }

  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  // Handle our custom APIErrors
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Fallback for unhandled errors
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}