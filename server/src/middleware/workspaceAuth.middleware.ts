import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";
import prisma from "../config/prisma";
import { WorkspaceRole } from "@prisma/client";


export const requireWorkspaceMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const workspaceId = req.params.workspaceId;
        const userId = req.user!.id;

        const membership = await prisma.membership.findFirst({
            where: { workspaceId, userId }
        });

        if(!membership) return res.status(403).json({ error: "Unidentified member" });

        (req as any).membership = membership;
        console.log("Membership found for user", userId)
        next();

    } catch (error) {
        res.status(500).json({ error: "Workspace membership check failed" });
    }
};


export const requireWorkspaceRole = (allowed: WorkspaceRole[]) => (req: AuthRequest, res: Response, next: NextFunction) => {
    const membership = (req as any).membership as { role: WorkspaceRole } | undefined;

    if(!membership) return res.status(500).json({ error: "Membership context missing" });

    if(!allowed.includes(membership.role)) return res.status(403).json({ error: "Insufficient role" });

    console.log("role checked for user", req.user!.id)
    next();
}