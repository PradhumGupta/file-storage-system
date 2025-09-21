import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyAccessToken } from "../config/jwt";

const { ACCESS_TOKEN_SECRET } = process.env;

export interface AuthRequest extends Request {
    user?: { id: string }
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];

        if(!authHeader?.startsWith('Bearer')) {
            throw new Error("Missing Token");
        }

        const token = authHeader.split(" ")[1];
        const decoded: any = verifyAccessToken(token);

        if(!decoded.id) {
            throw new Error("Invalid token");
        }
        
        req.user = decoded;
        console.log("user verified. from auth auth middleware");
        next();

    } catch (error: any) {
        res.status(401).json({ error: error.message })
    }
}