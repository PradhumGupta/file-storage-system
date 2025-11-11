import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { WorkspaceServices } from "../services/workspace.service";
import { WorkspaceRole } from "@prisma/client";
import { AuthService } from "../services/auth.service";

const workspaceServices = new WorkspaceServices();
const authService = new AuthService();
export class WorkspaceController {
    public static getUserWorkspaces = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const myWorkspaces = await workspaceServices.listUserWorkspaces(userId);
            res.status(200).json(myWorkspaces);
        } catch (error: any) {
            console.error("Error in getUserWorkspaces controller", error);
            res.status(500).json({ message: error.message ?? "Server Error" });
        }
    }

    public static createOrg = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.id;
            const workspace = await workspaceServices.createOrgWorkspace(userId, req.body.name);
            res.status(201).json(workspace);
        } catch (error: any) {
            console.error("Error in createOrg controller", error);
            throw error;
        }
    }

    public static fetchWorkspace = async (req: AuthRequest, res: Response) => {
        try {
            const { workspaceId } = req.params;
            const workspace = await workspaceServices.fetchWorkspace(workspaceId);

            res.status(200).json({ message: "Fetched files and folders in the workspace successfully", workspace });
        } catch (error: any) {
            console.log("Error in listFoldersFiles controller", error);
            throw error;
        }
    }

    public static invite = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.id;
            const { workspaceId } = req.params;

            const { newMemberIds, role } = req.body;

            const memberships = await workspaceServices.inviteMember(workspaceId, userId, newMemberIds as string[], role as WorkspaceRole);

            res.status(201).json({ message: "membership of the given user added with role", membership: memberships })
        } catch (error: any) {
            console.log("Error in invite controller", error?.message);
            throw error;
        }
    }

    public static remove = async (req: AuthRequest, res: Response) => {
        try {
            const { workspaceId, memberId } = req.params;
            const userRole = req.user?.role as WorkspaceRole;

            await workspaceServices.removeMember(workspaceId, userRole, memberId);

            res.json({ message: "target membership removed" });

        } catch (error: any) {
            console.log("Error in remove member controller", error?.message);
            throw error
        }
    }

    public static members = async (req: AuthRequest, res: Response) => {
        try {
            const { workspaceId } = req.params;
            const { query } = req.query;
            const members = await workspaceServices.getMembers(workspaceId);

            res.json({ members });

        } catch (error: any) {
            console.error("Error in remove member controller", error);
            throw error;
        }
    }

    
  public static getUsers = async (req: AuthRequest, res: Response) => {
    try {
      const { workspaceId } = req.params;
      const { query } = req.query;
      
      const allUsers = await authService.getAllUsers();
      const workspaceUsers = await workspaceServices.getMembers(workspaceId);

      const otherUsers = allUsers.filter(user => !
        workspaceUsers.some(workspaceUser => workspaceUser.id === user.id))

      res.json({ message: "User Profile retrieved", users: otherUsers });
    } catch (error: any) {
      console.error("Error in profile auth controller", error);
      throw error    
    }
  }

  public static changeRole = async (req: AuthRequest, res: Response) => {
        try {
            const { workspaceId } = req.params;
            const { memberUserId, newRole } = req.body;
            const userRole = req.user?.role as WorkspaceRole;

            await workspaceServices.roleChange(workspaceId, userRole, memberUserId, newRole)

            res.json({ message: "target membership changed" });

        } catch (error: any) {
            console.log("Error in remove member controller", error?.message);
            throw error;
        }
    }
}