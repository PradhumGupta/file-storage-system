"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const { ACCESS_TOKEN_SECRET } = process.env;
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const accessToken = req.cookies.access_token;
        if (!accessToken && !authHeader?.startsWith("Bearer")) {
            throw new Error("Missing Token");
        }
        const token = accessToken ? accessToken : authHeader?.split(" ")[1];
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        if (!decoded.id) {
            throw new Error("Invalid token");
        }
        req.user = decoded;
        // console.log("user verified. from auth auth middleware");
        next();
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
};
exports.authenticate = authenticate;
