import { NextFunction, Response } from "express";
import TeamServices from "../services/team.service";
import { FileServices } from "../services/files.service";
import { AuthRequest } from "../middleware/auth.middleware";

const teamServices = new TeamServices();
const fileServices = new FileServices();

class TeamController {
    public static createTeam = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { name, desc } = req.body;
            const { workspaceId } = req.params;

            const newTeam = await teamServices.create(name, desc, workspaceId);

            res.status(201).json({ team: newTeam })
            
        } catch (error) {
            console.error("Error in creating team", error);
            next(error)
        }
    }

    public static getTeams = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { workspaceId } = req.params;

            const teams = await teamServices.getAllTeams(workspaceId);

            res.status(201).json({ teams })
            
        } catch (error) {
            console.error("Error in creating team", error);
            next(error)
        }
    }

    public static createMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { userId, role } = req.body;
            const { teamId } = req.params;

            const newMember = await teamServices.addMember(userId, teamId, role);

            res.status(201).json({ member: newMember });
        } catch (error) {
            console.error("Error in adding member in team", error);
            next(error)
        }
    }

    public static getMembers = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { teamId } = req.params;

            const members = await teamServices.listMembers(teamId);

            res.status(200).json({ members });
        } catch (error) {
            console.error("Error in getting team members", error);
            next(error)
        }
    }

    public static assignFolder = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { teamId, workspaceId } = req.params;
            const { folderIds } = req.body;

            const folder = await fileServices.assignFolderToTeam(folderIds, teamId, workspaceId);

            res.status(203).json({ folder });
        } catch (error) {
            console.error("Error in assigning folder to team", error);
            next(error)
        }
    }

    public static createFolder = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { teamId, workspaceId } = req.params;
            const { name } = req.body;
            const userId = req.user!.id;

            const folder = await fileServices.createTeamFolder(name, teamId, userId, workspaceId);

            res.status(203).json({ folder });
        } catch (error) {
            console.error("Error in creating folder for team", error);
            next(error)
        }
    }

    public static getFolders = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { teamId, workspaceId } = req.params;

            const folders = await fileServices.teamFolders(teamId);

            res.status(203).json({ folders });
        } catch (error) {
            console.error("Error in getting team folders", error);
            next(error)
        }
    }
};

export default TeamController;