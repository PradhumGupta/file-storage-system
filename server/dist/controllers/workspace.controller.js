"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceController = void 0;
const workspace_service_1 = require("../services/workspace.service");
const auth_service_1 = require("../services/auth.service");
const workspaceServices = new workspace_service_1.WorkspaceServices();
const authService = new auth_service_1.AuthService();
class WorkspaceController {
    static getUserWorkspaces = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const myWorkspaces = await workspaceServices.listUserWorkspaces(userId);
            res.status(200).json(myWorkspaces);
        }
        catch (error) {
            console.error("Error in getUserWorkspaces controller", error);
            res.status(500).json({ message: error.message ?? "Server Error" });
        }
    };
    static createOrg = async (req, res) => {
        try {
            const userId = req.user.id;
            const workspace = await workspaceServices.createOrgWorkspace(userId, req.body.name);
            res.status(201).json(workspace);
        }
        catch (error) {
            console.error("Error in createOrg controller", error);
            throw error;
        }
    };
    static fetchWorkspace = async (req, res) => {
        try {
            const { workspaceId } = req.params;
            const workspace = await workspaceServices.fetchWorkspace(workspaceId);
            res.status(200).json({ message: "Fetched files and folders in the workspace successfully", workspace });
        }
        catch (error) {
            console.log("Error in listFoldersFiles controller", error);
            throw error;
        }
    };
    static invite = async (req, res) => {
        try {
            const userId = req.user.id;
            const { workspaceId } = req.params;
            const { newMemberIds, role } = req.body;
            const memberships = await workspaceServices.inviteMember(workspaceId, userId, newMemberIds, role);
            res.status(201).json({ message: "membership of the given user added with role", membership: memberships });
        }
        catch (error) {
            console.log("Error in invite controller", error?.message);
            throw error;
        }
    };
    static remove = async (req, res) => {
        try {
            const { workspaceId, memberId } = req.params;
            const userRole = req.user?.role;
            await workspaceServices.removeMember(workspaceId, userRole, memberId);
            res.json({ message: "target membership removed" });
        }
        catch (error) {
            console.log("Error in remove member controller", error?.message);
            throw error;
        }
    };
    static members = async (req, res) => {
        try {
            const { workspaceId } = req.params;
            const { query } = req.query;
            const members = await workspaceServices.getMembers(workspaceId);
            res.json({ members });
        }
        catch (error) {
            console.error("Error in remove member controller", error);
            throw error;
        }
    };
    static getUsers = async (req, res) => {
        try {
            const { workspaceId } = req.params;
            const { query } = req.query;
            const allUsers = await authService.getAllUsers();
            const workspaceUsers = await workspaceServices.getMembers(workspaceId);
            const otherUsers = allUsers.filter(user => !workspaceUsers.some(workspaceUser => workspaceUser.id === user.id));
            res.json({ message: "User Profile retrieved", users: otherUsers });
        }
        catch (error) {
            console.error("Error in profile auth controller", error);
            throw error;
        }
    };
    static changeRole = async (req, res) => {
        try {
            const { workspaceId } = req.params;
            const { memberUserId, newRole } = req.body;
            const userRole = req.user?.role;
            await workspaceServices.roleChange(workspaceId, userRole, memberUserId, newRole);
            res.json({ message: "target membership changed" });
        }
        catch (error) {
            console.log("Error in remove member controller", error?.message);
            throw error;
        }
    };
}
exports.WorkspaceController = WorkspaceController;
