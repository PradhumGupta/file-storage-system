import { WorkspaceRole, WorkspaceType } from "@prisma/client";
import prisma from "../config/prisma";
export class WorkspaceServices {
    static createPersonalWorkspace = async (name, userId) => {
        const personal = await prisma.workspace.create({
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
        const memberships = await prisma.membership.findMany({
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
        const workspace = await prisma.workspace.create({
            data: {
                name: workspaceName,
                type: WorkspaceType.ORGANIZATION,
                memberships: {
                    create: {
                        userId: ownerUserId,
                        role: WorkspaceRole.OWNER
                    }
                }
            }
        });
        return workspace;
    };
    fetchWorkspace = async (workspaceId) => {
        const workspace = await prisma.workspace.findUnique({
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
        const actor = await prisma.membership.findFirst({
            where: { userId: actorUserId, workspaceId }
        });
        // prevent duplicate
        const existingMemberships = await prisma.membership.findMany({
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
        const memberships = await prisma.membership.createMany({
            data: newMemberships,
        });
        return memberships;
    };
    removeMember = async (workspaceId, actorRole, userId) => {
        const target = await prisma.membership.findFirst({ where: { userId, workspaceId } });
        if (!target)
            throw new Error("target membership not found");
        if (target.role === WorkspaceRole.OWNER) {
            const owners = await prisma.membership.count({
                where: { workspaceId, role: WorkspaceRole.OWNER },
            });
            if (owners <= 1)
                throw new Error("Cannot remove only OWNER");
            if (actorRole !== WorkspaceRole.OWNER)
                throw new Error("Cannot remove the owner unless one is owner");
        }
        await prisma.membership.delete({ where: { id: target.id } });
    };
    getMembers = async (workspaceId) => {
        const members = await prisma.membership.findMany({
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
        const target = await prisma.membership.findFirst({ where: { userId, workspaceId } });
        if (!target)
            throw new Error("target membership not found");
        if (target.role === WorkspaceRole.OWNER && actorRole !== WorkspaceRole.OWNER) {
            throw new Error("Cannot change the role of owner unless one is owner");
        }
        if (newRole === WorkspaceRole.OWNER && actorRole !== WorkspaceRole.OWNER) {
            throw new Error("Cannot make the owner unless one is owner");
        }
        await prisma.membership.update({
            where: { id: target.id },
            data: {
                role: newRole
            }
        });
    };
}
