import TeamServices from "../services/team.service";
import { FileServices } from "../services/files.service";
const teamServices = new TeamServices();
const fileServices = new FileServices();
class TeamController {
    static createTeam = async (req, res, next) => {
        try {
            const { name, desc } = req.body;
            const { workspaceId } = req.params;
            const newTeam = await teamServices.create(name, desc, workspaceId);
            res.status(201).json({ team: newTeam });
        }
        catch (error) {
            console.error("Error in creating team", error);
            next(error);
        }
    };
    static getTeams = async (req, res, next) => {
        try {
            const { workspaceId } = req.params;
            const teams = await teamServices.getAllTeams(workspaceId);
            res.status(200).json({ teams });
        }
        catch (error) {
            console.error("Error in creating team", error);
            next(error);
        }
    };
    static getTeam = async (req, res, next) => {
        try {
            const { workspaceId, teamId } = req.params;
            const team = await teamServices.getTeam(workspaceId, teamId);
            // need to use members + folders instead of this also in frontend
            res.status(200).json({ team });
        }
        catch (error) {
            console.error("Error in getting team", error);
            next(error);
        }
    };
    static createMember = async (req, res, next) => {
        try {
            const { userId, role } = req.body;
            const { teamId } = req.params;
            const newMember = await teamServices.addMember(userId, teamId, role);
            res.status(201).json({ member: newMember });
        }
        catch (error) {
            console.error("Error in adding member in team", error);
            next(error);
        }
    };
    static getMembers = async (req, res, next) => {
        try {
            const { teamId } = req.params;
            const members = await teamServices.listMembers(teamId);
            res.status(200).json({ members });
        }
        catch (error) {
            console.error("Error in getting team members", error);
            next(error);
        }
    };
    static assignFolder = async (req, res, next) => {
        try {
            const { teamId, workspaceId } = req.params;
            const { folderIds } = req.body;
            const folder = await fileServices.assignFolderToTeam(folderIds, teamId, workspaceId);
            res.status(203).json({ folder });
        }
        catch (error) {
            console.error("Error in assigning folder to team", error);
            next(error);
        }
    };
    static createFolder = async (req, res, next) => {
        try {
            const { teamId, workspaceId } = req.params;
            const { name } = req.body;
            const userId = req.user.id;
            const folder = await fileServices.createTeamFolder(name, teamId, userId, workspaceId);
            res.status(203).json({ folder });
        }
        catch (error) {
            console.error("Error in creating folder for team", error);
            next(error);
        }
    };
    static getFolders = async (req, res, next) => {
        try {
            const { teamId, workspaceId } = req.params;
            const folders = await fileServices.teamFolders(teamId);
            res.status(203).json({ folders });
        }
        catch (error) {
            console.error("Error in getting team folders", error);
            next(error);
        }
    };
}
;
export default TeamController;
