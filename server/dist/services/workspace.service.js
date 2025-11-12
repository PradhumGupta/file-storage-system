"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../config/prisma"));
class WorkspaceServices {
    static createPersonalWorkspace = async (name, userId) => {
        const personal = await prisma_1.default.workspace.create({
            data: {
                name: `${name}'s Workspace`,
                type: "PERSONAL",
                memberships: {
                    create: {
                        userId,
                        role: "OWNER"
                    }
                }
            }
        });
        return personal;
    };
    listUserWorkspaces = async (userId) => {
        const memberships = await prisma_1.default.membership.findMany({
            where: { userId },
            include: { workspace: true },
            orderBy: { createdAt: "asc" }
        });
        return memberships.map(m => ({
            workspace: m.workspace,
            role: m.role
        }));
    };
    createOrgWorkspace = async (ownerUserId, workspaceName) => {
        const workspace = await prisma_1.default.workspace.create({
            data: {
                name: workspaceName,
                type: client_1.WorkspaceType.ORGANIZATION,
                memberships: {
                    create: {
                        userId: ownerUserId,
                        role: client_1.WorkspaceRole.OWNER
                    }
                }
            }
        });
        return workspace;
    };
    fetchWorkspace = async (workspaceId) => {
        const workspace = await prisma_1.default.workspace.findUnique({
            where: { id: workspaceId },
            include: {
                folders: {
                    where: { parentId: null }
                },
                files: {
                    where: { folderId: null },
                    include: { uploader: {
                            select: { name: true }
                        } }
                }
            }
        });
        return workspace;
    };
    inviteMember = async (workspaceId, actorUserId, userIds, role) => {
        const actor = await prisma_1.default.membership.findFirst({
            where: { userId: actorUserId, workspaceId }
        });
        // prevent duplicate
        const existingMemberships = await prisma_1.default.membership.findMany({
            where: {
                workspaceId,
                userId: { in: userIds },
            },
        });
        const existingUserIds = existingMemberships.map((membership) => membership.userId);
        const newUserIds = userIds.filter((userId) => !existingUserIds.includes(userId));
        // Create new membership records for the invited users
        const newMemberships = newUserIds.map((userId) => ({
            workspaceId,
            userId,
            role,
        }));
        const memberships = await prisma_1.default.membership.createMany({
            data: newMemberships,
        });
        return memberships;
    };
    removeMember = async (workspaceId, actorRole, userId) => {
        const target = await prisma_1.default.membership.findFirst({ where: { userId, workspaceId } });
        if (!target)
            throw new Error("target membership not found");
        if (target.role === client_1.WorkspaceRole.OWNER) {
            const owners = await prisma_1.default.membership.count({
                where: { workspaceId, role: client_1.WorkspaceRole.OWNER },
            });
            if (owners <= 1)
                throw new Error("Cannot remove only OWNER");
            if (actorRole !== client_1.WorkspaceRole.OWNER)
                throw new Error("Cannot remove the owner unless one is owner");
        }
        await prisma_1.default.membership.delete({ where: { id: target.id } });
    };
    getMembers = async (workspaceId) => {
        const members = await prisma_1.default.membership.findMany({
            where: {
                workspaceId
            },
            include: {
                user: true
            }
        });
        return members.map(({ user, createdAt, role }) => ({ ...user, joinedAt: createdAt, role }));
    };
    roleChange = async (workspaceId, actorRole, userId, newRole) => {
        const target = await prisma_1.default.membership.findFirst({ where: { userId, workspaceId } });
        if (!target)
            throw new Error("target membership not found");
        if (target.role === client_1.WorkspaceRole.OWNER && actorRole !== client_1.WorkspaceRole.OWNER) {
            throw new Error("Cannot change the role of owner unless one is owner");
        }
        if (newRole === client_1.WorkspaceRole.OWNER && actorRole !== client_1.WorkspaceRole.OWNER) {
            throw new Error("Cannot make the owner unless one is owner");
        }
        await prisma_1.default.membership.update({
            where: { id: target.id },
            data: {
                role: newRole
            }
        });
    };
}
exports.WorkspaceServices = WorkspaceServices;
