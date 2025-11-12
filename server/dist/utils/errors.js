export class APIError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export class UnauthorizedError extends APIError {
    constructor(message) {
        super(message, 401);
    }
}
export class ForbiddenError extends APIError {
    constructor(message) {
        super(message, 403);
    }
}
export class NotFoundError extends APIError {
    constructor(message) {
        super(message, 404);
    }
}
