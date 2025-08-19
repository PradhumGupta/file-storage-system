import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

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
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET as string) as { id: string };
        
        req.user = decoded;
        next();

    } catch (error) {
        // will be defined.
    }
}