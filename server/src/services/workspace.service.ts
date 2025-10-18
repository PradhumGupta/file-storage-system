import { Role, WorkspaceType } from "@prisma/client";
import prisma from "../config/prisma"

export class WorkspaceServices {
    public static createPersonalWorkspace = async (name: string, userId: string) => {
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
    }

    public listUserWorkspaces = async (userId: string) => {
        const memberships = await prisma.membership.findMany({
            where: {userId},
            include: { workspace: true },
            orderBy: { createdAt: "asc" }
        });

        return memberships.map(m => ({
            workspace: m.workspace,
            role: m.role
        }))
    }

    public createOrgWorkspace = async (ownerUserId: string, workspaceName: string) => {
        const workspace = await prisma.workspace.create({
            data: {
                name: workspaceName,
                type: WorkspaceType.ORGANIZATION,
                memberships: {
                    create: {
                        userId: ownerUserId,
                        role: Role.OWNER
                    }
                }
            }
        });
        return workspace;
    }

    public fetchWorkspace = async (workspaceId: string) => {

        const workspace = await prisma.workspace.findUnique({
            where: {id: workspaceId},
            include: {
                folders: {
                    where: { parentId: null }
                },
                files: {
                    where: { folderId: null }
                }
            }
        })

        return workspace;
    }

    public inviteMember = async (workspaceId: string, actorUserId: string, userId: string, role: Role) => {
        const actor = await prisma.membership.findFirst({
            where: { userId: actorUserId, workspaceId }
        });

        // if(!)

        // prevent duplicate
        const existing = await prisma.membership.findFirst({
            where: { userId, workspaceId }
        });

        if(existing) throw new Error("User is already a member");

        const membership = await prisma.membership.create({
            data: {
                userId, workspaceId, role
            }
        });

        return membership;
    }

    public removeMember = async (workspaceId: string, actorRole: Role, userId: string) => {
        const target = await prisma.membership.findFirst({ where: { userId, workspaceId } });
        if(!target) throw new Error("target membership not found");

        if(target.role === Role.OWNER) {
            const owners = await prisma.membership.count({
                where: { workspaceId, role: Role.OWNER },
            });

            if(owners <= 1) throw new Error("Cannot remove only OWNER");

            if(actorRole !== Role.OWNER) throw new Error("Cannot remove the owner unless one is owner");
        }

        await prisma.membership.delete({ where: { id: target.id } });
    }
}