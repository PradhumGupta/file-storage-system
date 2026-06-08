import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { WorkspaceServices } from "../services/workspace.service";
import { WorkspaceRole } from "@prisma/client";
import { AuthService } from "../services/auth.service";
import { z } from "zod";

const workspaceIdSchema = z.object({
  workspaceId: z.string().min(5, "workspaceId is required"),
});

const createOrgSchema = z.object({
  name: z.string().trim().min(1, "Workspace name is required"),
});

const inviteSchema = z.object({
  newMemberIds: z.array(z.string().min(1, "Member ID cannot be empty")).min(1, "At least one member ID is required"),
  role: z.nativeEnum(WorkspaceRole),
});

const removeMemberSchema = z.object({
  workspaceId: z.string().min(5, "workspaceId is required"),
  memberId: z.string().min(5, "memberId is required"),
});

const changeRoleSchema = z.object({
  memberUserId: z.string().min(5, "memberUserId is required"),
  newRole: z.nativeEnum(WorkspaceRole),
});

const workspaceServices = new WorkspaceServices();
const authService = new AuthService();

export class WorkspaceController {
    public static getUserWorkspaces = async (req: AuthRequest, res: Response, next: NextFunction) => {
        const userId = req.user!.id;
        const myWorkspaces = await workspaceServices.listUserWorkspaces(userId);
        res.status(200).json(myWorkspaces);
    }

    public static createOrg = async (req: AuthRequest, res: Response) => {
        const userId = req.user!.id;
        const { name } = createOrgSchema.parse(req.body);
        const workspace = await workspaceServices.createOrgWorkspace(userId, name);
        res.status(201).json(workspace);
    }

    public static fetchWorkspace = async (req: AuthRequest, res: Response) => {
        const { workspaceId } = workspaceIdSchema.parse(req.params);
        const workspace = await workspaceServices.fetchWorkspace(workspaceId);

        res.status(200).json({ message: "Fetched files and folders in the workspace successfully", workspace });
    }

    public static invite = async (req: AuthRequest, res: Response) => {
        const userId = req.user!.id;
        const { workspaceId } = workspaceIdSchema.parse(req.params);
        const { newMemberIds, role } = inviteSchema.parse(req.body);

        const memberships = await workspaceServices.inviteMember(workspaceId, userId, newMemberIds, role);

        res.status(201).json({ message: "membership of the given user added with role", membership: memberships })
    }

    public static remove = async (req: AuthRequest, res: Response) => {
        const { workspaceId, memberId } = removeMemberSchema.parse(req.params);
        const userRole = req.user?.role as WorkspaceRole;

        await workspaceServices.removeMember(workspaceId, userRole, memberId);

        res.json({ message: "target membership removed" });
    }

    public static members = async (req: AuthRequest, res: Response) => {
        const { workspaceId } = workspaceIdSchema.parse(req.params);
        const members = await workspaceServices.getMembers(workspaceId);

        res.json({ members });
    }

    public static getUsers = async (req: AuthRequest, res: Response) => {
        const { workspaceId } = workspaceIdSchema.parse(req.params);
        
        const allUsers = await authService.getAllUsers();
        const workspaceUsers = await workspaceServices.getMembers(workspaceId);

        const otherUsers = allUsers.filter(user => !
            workspaceUsers.some(workspaceUser => workspaceUser.id === user.id))

        res.json({ message: "User Profile retrieved", users: otherUsers });
    }

    public static changeRole = async (req: AuthRequest, res: Response) => {
        const { workspaceId } = workspaceIdSchema.parse(req.params);
        const { memberUserId, newRole } = changeRoleSchema.parse(req.body);
        const userRole = req.user?.role as WorkspaceRole;

        await workspaceServices.roleChange(workspaceId, userRole, memberUserId, newRole);

        res.json({ message: "target membership changed" });
    }
}