
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
}