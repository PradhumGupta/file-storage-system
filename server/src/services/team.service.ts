import { TeamRole } from "@prisma/client";
import prisma from "../config/prisma"

class TeamServices {
    public create = async (teamName: string, description: string, workspaceId: string) => {
        const newTeam = await prisma.team.create({
            data: {
                name: teamName,
                desc: description,
                workspaceId,
            }
        });

        return newTeam
    }

    public getAllTeams = async (workspaceId: string) => {
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
    }

    public addMember = async (userId: string, teamId: string, role: TeamRole) => {
        const newMember = await prisma.teamMember.create({
            data: {
                userId,
                teamId,
                role
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
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            }
        })

        return members.map(m => ({ 
            id: m.userId,
            name: m.user.name,
            email: m.user.email,
            role: m.role
        }));
    }

};

export default TeamServices;