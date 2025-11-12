import { verifyAccessToken } from "../utils/jwt";
const { ACCESS_TOKEN_SECRET } = process.env;
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const accessToken = req.cookies.access_token;
        if (!accessToken && !authHeader?.startsWith("Bearer")) {
            throw new Error("Missing Token");
        }
        const token = accessToken ? accessToken : authHeader?.split(" ")[1];
        const decoded = verifyAccessToken(token);
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
