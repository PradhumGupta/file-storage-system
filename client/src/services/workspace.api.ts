import api from "../lib/axios"

class WorkspaceServices {
    public static fetchWorkspaces = async () => {
        const response = await api.get('/workspaces');
        return response.data;
    }

    public static fetchData = async (workspaceId: string) => {
        const response = await api.get(`/workspaces/${workspaceId}/list`);
        return response.data;
    }
    
    public static getMembers = async (workspaceId: string, query: string) => {
        const response = await api.get(`/workspaces/${workspaceId}/members?query=${query}`);
        return response.data.members;
    }
    public static getInviteUsers = async (workspaceId: string, query: string) => {
        const response = await api.get(`/workspaces/${workspaceId}/other-users?query=${query}`);
        return response.data.users;
    }

    public static inviteMembers = async (workspaceId: string, newMemberIds: string[], role: string) => {
        const response = await api.post(`/workspaces/${workspaceId}/members`, { newMemberIds, role });
        return response.data;
    }

    public static changeRole = async (workspaceId: string, memberUserId: string, newRole: string) => {
        const response = await api.patch(`/workspaces/${workspaceId}/members`, { memberUserId, newRole });
        return response.data;
    }

    public static removeMember = async (workspaceId: string, memberId: string) => {
        const response = await api.delete(`/workspaces/${workspaceId}/members/${memberId}`);
        return response.data;
    }
};

export default WorkspaceServices;