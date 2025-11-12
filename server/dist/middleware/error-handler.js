import { main } from "../config/prisma";
export function errorHandler(err, _, res, next) {
    if (!err) {
        next();
    } // If there is no error, call next.
    const status = err.statusCode || 500;
    console.error(err);
    if (err.message.includes('database server'))
        main();
    res.status(status).json({ status: status, message: err.message });
}
