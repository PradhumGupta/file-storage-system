import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import { WorkspaceServices } from "./workspace.service";
import { generateAccessToken, generateRefreshToken } from "../config/jwt";

const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = process.env;

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
        });  // user object not updated before returning but correctly updated on db

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

    public getProfile = async (userId: string) => {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        
        return user;
    }
}