import api from "../lib/axios"

class TeamServices {
    public static createTeam = async (workspaceId: string, name: string, desc: string) => {
        const response = await api.post(`/workspaces/${workspaceId}/team`, { name, desc });
        return response.data.team;
    }

    public static getTeams = async (workspaceId: string) => {
        const response = await api.get(`/workspaces/${workspaceId}/team`);
        return response.data.teams;
    }

    public static createMember = async (workspaceId: string, teamId: string, userId: string, role: string) => {
        const response = await api.post(`/workspaces/${workspaceId}/team/${teamId}/add`, { userId, role });
        return response.data.team;
    }

    public static getMembers = async (workspaceId: string, teamId: string) => {
        const response = await api.get(`/workspaces/${workspaceId}/team/${teamId}`);
        return response.data.members;
    }

    public static assignFolder = async (workspaceId: string, teamId: string, folderIds: string[]) => {
        const response = await api.put(`/workspaces/${workspaceId}/team/${teamId}/folder`, { folderIds });
        return response.data;
    }

    public static createFolder = async (workspaceId: string, teamId: string, name: string) => {
        const response = await api.post(`/workspaces/${workspaceId}/team/${teamId}/folder`, { name });
        return response.data.folder;
    }

    public static getFolders = async (workspaceId: string, teamId: string) => {
        const response = await api.get(`/workspaces/${workspaceId}/team/${teamId}/folders`);
        return response.data.folders;
    }

};

export default TeamServices;