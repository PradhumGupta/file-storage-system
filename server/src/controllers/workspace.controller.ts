import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { WorkspaceServices } from "../services/workspace.service";

const workspaceServices = new WorkspaceServices();

export class WorkspaceController {
    public static getUserWorkspaces = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id as string;
            const myWorkspaces = await workspaceServices.listUserWorkspaces(userId);
            res.status(200).json(myWorkspaces);
        } catch (error: any) {
            console.error("Error in getUserWorkspaces controller", error);
            res.status(500).json({ message: error.message ?? "Server Error" });
        }
    }
}