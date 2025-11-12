"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const zod_1 = require("zod");
const auth_service_1 = require("../services/auth.service");
const jwt_1 = require("../utils/jwt");
const set_token_cookies_1 = require("../utils/set-token-cookies");
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().trim(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const authService = new auth_service_1.AuthService();
class AuthController {
    static SignUp = async (req, res, next) => {
        try {
            const { name, email, password } = registerSchema.parse(req.body);
            const user = await authService.register(name, email, password);
            res.json({ message: "User registered", user });
        }
        catch (error) {
            console.log("Error occured in signup controller", error.message);
            throw error;
        }
    };
    static Login = async (req, res, next) => {
        try {
            const { email, password } = loginSchema.parse(req.body);
            const { accessToken, refreshToken, user } = await authService.login(email, password);
            (0, set_token_cookies_1.setCookies)(res, accessToken, refreshToken);
            res.json({ message: "User logged in", accessToken, refreshToken, user });
        }
        catch (error) {
            console.log("Error occured in login controller", error.message);
            throw error;
        }
    };
    static refresh = async (req, res) => {
        const token = req.cookies.refresh_token || req.body.token;
        try {
            const decoded = (0, jwt_1.verifyRefreshToken)(token);
            const accessToken = await authService.refresh(decoded.id, token);
            (0, set_token_cookies_1.setCookies)(res, accessToken, token);
            res.status(201).json({ message: "Token refreshed", accessToken });
        }
        catch (error) {
            console.log("Error in refresh auth controller", error.message);
            throw error;
        }
    };
    static logout = async (req, res) => {
        try {
            await authService.logoutSession(req.user?.id);
            res.clearCookie("access_token");
            res.clearCookie("refresh_token");
            res.json({ message: "Logged out successfully" });
        }
        catch (error) {
            console.log("Error in logout auth controller", error.message);
            throw error;
        }
    };
    static isUserExists = async (req, res) => {
        try {
            const found = await authService.checkUser(req.body?.email);
            res.status(200).json({ found });
        }
        catch (err) {
            console.log("Error in checking user status", err.message);
            throw err;
        }
    };
    static profile = async (req, res) => {
        try {
            const userProfile = await authService.getProfile(req.user.id);
            res.json({ message: "User Profile retrieved", user: userProfile });
        }
        catch (error) {
            console.log("Error in profile auth controller", error.message);
            throw error;
        }
    };
}
exports.AuthController = AuthController;
