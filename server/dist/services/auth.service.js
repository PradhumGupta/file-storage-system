import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import { WorkspaceServices } from "./workspace.service";
// import { emailQueue } from "../queues/email.queue";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
export class AuthService {
    register = async (name, email, password) => {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing)
            throw new Error("User already exists");
        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashed },
        });
        // create personal workspace
        const personal = await WorkspaceServices.createPersonalWorkspace(name, user.id);
        // enqueue background job
        // await emailQueue.add("sendWelcomeEmail", { userId: user.id, email });
        return user;
    };
    login = async (email, password) => {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new Error("No User found");
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid)
            throw new Error("Invalid credentials");
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        }); // user object not updated before returning but correctly updated on db
        return { accessToken, refreshToken, user };
    };
    refresh = async (userId, token) => {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.refreshToken !== token)
            throw new Error("Invalid RT");
        const newAccessToken = generateAccessToken(user.id);
        return newAccessToken;
    };
    logoutSession = async (userId) => {
        await prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null }
        });
    };
    checkUser = async (email) => {
        const user = await prisma.user.findUnique({ where: { email } });
        return user ? true : false;
    };
    getProfile = async (userId) => {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        return user;
    };
    getAllUsers = async () => {
        const users = await prisma.user.findMany();
        return users;
    };
}
