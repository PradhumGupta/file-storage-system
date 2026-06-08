import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import { WorkspaceServices } from "./workspace.service";
// import { emailQueue } from "../queues/email.queue";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { OAuth2Client } from "google-auth-library";

const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = process.env;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export class AuthService {
    public register = async (name: string, email: string, password: string) => {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) throw new Error("User already exists");

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashed },
        });

        // create personal workspace
        const personal = await WorkspaceServices.createPersonalWorkspace(name, user.id)

        // enqueue background job
        // await emailQueue.add("sendWelcomeEmail", { userId: user.id, email });

        return user;
    }

    public login = async (email: string, password: string) => {
        const user = await prisma.user.findUnique({ where: {email} });
        if(!user) throw new Error("No User found");

        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid) throw new Error("Invalid credentials");

        const accessToken = generateAccessToken(user.id)
        const refreshToken = generateRefreshToken(user.id);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });

        return { accessToken, refreshToken, user };
    }

    public refresh = async (userId: string, token: string) => {
        const user = await prisma.user.findUnique({ where: {id: userId} });
        if(!user || user.refreshToken !== token) throw new Error("Invalid RT");

        const newAccessToken = generateAccessToken(user.id);

        return newAccessToken;
    }

    public logoutSession = async (userId: string) => {
        await prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null }
        })
    }

    public checkUser = async (email: string) => {
        const user = await prisma.user.findUnique({ where: {email} });
        
        return user ? true : false
    }

    public getProfile = async (userId: string) => {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        
        return user;
    }

    public getAllUsers = async () => {
        const users = await prisma.user.findMany();

        return users;
    }

    public verifyGoogleSubID = async (idToken: string) => {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload();
        if (!payload || !payload.email) throw new Error("Invalid Google token");

        const { email, name, sub } = payload;
        
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            const hashed = await bcrypt.hash(sub + process.env.ACCESS_TOKEN_SECRET, 10);
            user = await prisma.user.create({
                data: { name: name || "Google User", email, password: hashed },
            });
            await WorkspaceServices.createPersonalWorkspace(user.name, user.id);
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });

        return { accessToken, refreshToken, user };
    }
}