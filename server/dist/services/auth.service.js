"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const workspace_service_1 = require("./workspace.service");
// import { emailQueue } from "../queues/email.queue";
const jwt_1 = require("../utils/jwt");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
class AuthService {
    register = async (name, email, password) => {
        const existing = await prisma_1.default.user.findUnique({ where: { email } });
        if (existing)
            throw new Error("User already exists");
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: { name, email, password: hashed },
        });
        // create personal workspace
        const personal = await workspace_service_1.WorkspaceServices.createPersonalWorkspace(name, user.id);
        // enqueue background job
        // await emailQueue.add("sendWelcomeEmail", { userId: user.id, email });
        return user;
    };
    login = async (email, password) => {
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user)
            throw new Error("No User found");
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid)
            throw new Error("Invalid credentials");
        const accessToken = (0, jwt_1.generateAccessToken)(user.id);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { refreshToken }
        }); // user object not updated before returning but correctly updated on db
        return { accessToken, refreshToken, user };
    };
    refresh = async (userId, token) => {
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user || user.refreshToken !== token)
            throw new Error("Invalid RT");
        const newAccessToken = (0, jwt_1.generateAccessToken)(user.id);
        return newAccessToken;
    };
    logoutSession = async (userId) => {
        await prisma_1.default.user.update({
            where: { id: userId },
            data: { refreshToken: null }
        });
    };
    checkUser = async (email) => {
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        return user ? true : false;
    };
    getProfile = async (userId) => {
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        return user;
    };
    getAllUsers = async () => {
        const users = await prisma_1.default.user.findMany();
        return users;
    };
}
exports.AuthService = AuthService;
