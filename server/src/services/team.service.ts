import prisma from "../config/prisma"

class TeamServices {
    public create = async (teamName: string, workspaceId: string) => {
        const newTeam = await prisma.team.create({
            data: {
                name: teamName,
                workspaceId,
            }
        });

        return newTeam
    }

    public addMember = async (userId: string, teamId: string) => {
        const newMember = await prisma.teamMember.create({
            data: {
                userId,
                teamId
            }
        });

        return newMember;
    }

    public listMembers = async (teamId: string) => {
        const members = await prisma.teamMember.findMany({
            where: {
                teamId: teamId
            },
            include: {
                user: true
            }
        })

        return members.map(m => m.user);
    }

};

export default TeamServices;