"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAccess = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const permissions_1 = require("../config/permissions");
const checkAccess = (resource, action) => {
    return async (req, res, next) => {
        const userId = req.user.id;
        let resourceData = null;
        let userRole;
        switch (resource) {
            case "workspace":
                const workspaceMembers = await prisma_1.default.membership.findMany({
                    where: { workspaceId: req.params.workspaceId }
                });
                userRole = workspaceMembers.find(m => m.userId === userId)?.role;
                break;
            case "team":
                const teamMembers = await prisma_1.default.teamMember.findMany({
                    where: { id: req.params.teamId },
                });
                userRole = teamMembers.find(m => m.userId === userId)?.role || req.membership.role;
                ;
                break;
            case "folder":
                resourceData = await prisma_1.default.folder.findFirst({
                    where: { id: req.params.folderId },
                    include: {
                        workspace: { include: { memberships: true } },
                        team: { include: { members: true } },
                    },
                });
                const workspaceMember = resourceData?.workspace?.memberships.find((m) => m.userId === userId);
                const teamMember = resourceData?.team?.members.find((m) => m.userId === userId);
                userRole = teamMember?.role || workspaceMember?.role;
                // if(resourceData?.teamId && !teamMember) return res.status(403).json({ error: "Access denied" });
                break;
            case "file":
                resourceData = await prisma_1.default.file.findFirst({
                    where: { id: req.params.fileId },
                    include: {
                        folder: {
                            include: {
                                team: { include: { members: true } },
                                workspace: { include: { memberships: true } },
                            },
                        },
                    },
                });
                const wm = resourceData?.folder?.workspace?.memberships.find((m) => m.userId === userId);
                const tm = resourceData?.folder?.team?.members.find((m) => m.userId === userId);
                // if(resourceData?.folder?.teamId && !tm) return res.status(403).json({ error: "Access denied" });
                userRole = tm?.role || wm?.role;
                break;
            default:
                return res.status(400).json({ error: "Invalid resource type" });
        }
        if (!userRole) {
            return res.status(403).json({ error: "Not a member of this resource" });
        }
        const allowedRoles = permissions_1.permissions[resource][action];
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ error: "Access denied" });
        }
        req.user.role = userRole;
        next();
    };
};
exports.checkAccess = checkAccess;
