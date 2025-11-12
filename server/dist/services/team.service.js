import prisma from "../config/prisma";
class TeamServices {
    create = async (teamName, description, workspaceId) => {
        const newTeam = await prisma.team.create({
            data: {
                name: teamName,
                desc: description,
                workspaceId,
            }
        });
        return newTeam;
    };
    getAllTeams = async (workspaceId) => {
        const teams = await prisma.team.findMany({
            where: {
                workspaceId,
            },
            include: {
                _count: {
                    select: { members: true },
                },
            },
        });
        const teamWithMemberCount = teams.map(team => ({
            id: team.id,
            name: team.name,
            description: team.desc,
            memberCount: team._count.members
        }));
        return teamWithMemberCount;
    };
    getTeam = async (workspaceId, teamId) => {
        const team = await prisma.team.findFirst({
            where: {
                id: teamId,
                workspaceId,
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                createdAt: true
                            }
                        },
                    }
                },
                folders: true
            },
        });
        return team;
    };
    addMember = async (userId, teamId, role) => {
        const newMember = await prisma.teamMember.create({
            data: {
                userId,
                teamId,
                role
            }
        });
        return newMember;
    };
    listMembers = async (teamId) => {
        const members = await prisma.teamMember.findMany({
            where: {
                teamId: teamId
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            }
        });
        return members.map(m => ({
            id: m.userId,
            name: m.user.name,
            email: m.user.email,
            role: m.role
        }));
    };
}
;
export default TeamServices;
