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

export class BadRequestError extends APIError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class ConflictError extends APIError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class InternalServerError extends APIError {
  constructor(message: string = "Internal Server Error") {
    super(message, 500);
  }
}
