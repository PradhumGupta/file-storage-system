import { NextFunction, Response } from "express";
import TeamServices from "../services/team.service";
import { FileServices } from "../services/files.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { z } from "zod";
import { TeamRole } from "@prisma/client";

const workspaceIdSchema = z.object({
    workspaceId: z.string().min(5, "workspaceId is required"),
});

const teamAndWorkspaceSchema = z.object({
    workspaceId: z.string().min(5, "workspaceId is required"),
    teamId: z.string().min(5, "teamId is required"),
});

const teamIdSchema = z.object({
    teamId: z.string().min(5, "teamId is required"),
});

const createTeamSchema = z.object({
    name: z.string().trim().min(1, "Team name is required"),
    desc: z.string().trim().min(1, "Team description is required"),
});

const createMemberSchema = z.object({
    userId: z.string().min(5, "userId is required"),
    role: z.nativeEnum(TeamRole),
});

const assignFolderSchema = z.object({
    folderIds: z.array(z.string().min(5, "Folder ID must be valid")).min(1, "At least one folder ID is required"),
});

const createFolderSchema = z.object({
    name: z.string().trim().min(1, "Folder name is required"),
});

const teamServices = new TeamServices();
const fileServices = new FileServices();

class TeamController {
    public static createTeam = async (req: AuthRequest, res: Response, next: NextFunction) => {
        const { workspaceId } = workspaceIdSchema.parse(req.params);
        const { name, desc } = createTeamSchema.parse(req.body);

        const newTeam = await teamServices.create(name, desc, workspaceId);

        res.status(201).json({ team: newTeam });
    }

    public static getTeams = async (req: AuthRequest, res: Response, next: NextFunction) => {
        const { workspaceId } = workspaceIdSchema.parse(req.params);

        const teams = await teamServices.getAllTeams(workspaceId);

        res.status(200).json({ teams });
    }

    public static getTeam = async (req: AuthRequest, res: Response, next: NextFunction) => {
        const { workspaceId, teamId } = teamAndWorkspaceSchema.parse(req.params);

        const team = await teamServices.getTeam(workspaceId, teamId);

        res.status(200).json({ team });
    }

    public static createMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
        const { teamId } = teamIdSchema.parse(req.params);
        const { userId, role } = createMemberSchema.parse(req.body);

        const newMember = await teamServices.addMember(userId, teamId, role);

        res.status(201).json({ member: newMember });
    }

    public static getMembers = async (req: AuthRequest, res: Response, next: NextFunction) => {
        const { teamId } = teamIdSchema.parse(req.params);

        const members = await teamServices.listMembers(teamId);

        res.status(200).json({ members });
    }

    public static assignFolder = async (req: AuthRequest, res: Response, next: NextFunction) => {
        const { teamId, workspaceId } = teamAndWorkspaceSchema.parse(req.params);
        const { folderIds } = assignFolderSchema.parse(req.body);

        const folder = await fileServices.assignFolderToTeam(folderIds, teamId, workspaceId);

        res.status(203).json({ folder });
    }

    public static createFolder = async (req: AuthRequest, res: Response, next: NextFunction) => {
        const { teamId, workspaceId } = teamAndWorkspaceSchema.parse(req.params);
        const { name } = createFolderSchema.parse(req.body);
        const userId = req.user!.id;

        const folder = await fileServices.createTeamFolder(name, teamId, userId, workspaceId);

        res.status(203).json({ folder });
    }

    public static getFolders = async (req: AuthRequest, res: Response, next: NextFunction) => {
        const { teamId, workspaceId } = teamAndWorkspaceSchema.parse(req.params);

        const folders = await fileServices.teamFolders(teamId);

        res.status(203).json({ folders });
    }
};

export default TeamController;