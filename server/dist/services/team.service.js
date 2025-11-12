"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../config/prisma"));
class TeamServices {
    create = async (teamName, description, workspaceId) => {
        const newTeam = await prisma_1.default.team.create({
            data: {
                name: teamName,
                desc: description,
                workspaceId,
            }
        });
        return newTeam;
    };
    getAllTeams = async (workspaceId) => {
        const teams = await prisma_1.default.team.findMany({
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
        const team = await prisma_1.default.team.findFirst({
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
        const newMember = await prisma_1.default.teamMember.create({
            data: {
                userId,
                teamId,
                role
            }
        });
        return newMember;
    };
    listMembers = async (teamId) => {
        const members = await prisma_1.default.teamMember.findMany({
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
exports.default = TeamServices;
