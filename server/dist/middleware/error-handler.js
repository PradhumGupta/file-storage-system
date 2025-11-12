"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const prisma_1 = require("../config/prisma");
function errorHandler(err, _, res, next) {
    if (!err) {
        next();
    } // If there is no error, call next.
    const status = err.statusCode || 500;
    console.error(err);
    if (err.message.includes('database server'))
        (0, prisma_1.main)();
    res.status(status).json({ status: status, message: err.message });
}
