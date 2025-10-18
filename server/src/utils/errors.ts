import { PrismaClientInitializationError } from "@prisma/client/runtime/library";

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnauthorizedError extends APIError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ForbiddenError extends APIError {
  constructor(message: string) {
    super(message, 403);
  }
}

export class NotFoundError extends APIError {
  constructor(message: string) {
    super(message, 404);
  }
}

