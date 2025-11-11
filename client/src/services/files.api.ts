import api from "../lib/axios"

class FileServices {
    public static showFolder = async (workspaceId: string, folderId: string) => {
        const response = await api.get(`/workspaces/${workspaceId}/folders/${folderId}`);
        return response.data.folder;
    }
    public static getPath = async (workspaceId: string, folderId: string) => { 
        const response = await api.get(`/workspaces/${workspaceId}/folders/${folderId}/path`);
        return response.data.path
    }
    public static upload = async (workspaceId: string, folderId: string, file: File, onProgress?: (percent: number) => void, signal?: AbortSignal) => {
        const formData = new FormData();
        formData.append("folderId", folderId);
        formData.append("file", file)
        
        const response = await api.post(`/workspaces/${workspaceId}/files/upload`, formData, {
            onUploadProgress: (progressEvent) => {
                if(progressEvent.total) {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    if (onProgress) onProgress(percent);
                }
            },
            signal
        });
        return response.data.status;
    }
    public static downloadFile = async (workspaceId: string, fileId: string) => {
        const response = await api.get(`/workspaces/${workspaceId}/files/${fileId}/download`, { responseType: 'blob' });
        return response.data;
    }
    public static createFolder = async (workspaceId: string, name: string, parentId: string|undefined) => {
        const response = await api.post(`/workspaces/${workspaceId}/folders`, { name, parentId });
        return response.data.folder;
    }
    public static deleteFolder = async (workspaceId: string, folderId: string) => {
        const response = await api.delete(`/workspaces/${workspaceId}/folders/${folderId}`);
        return response.data.message;
    }
    public static getPublicFolders = async (workspaceId: string) => {
        const response = await api.get(`/workspaces/${workspaceId}/folders`);
        return response.data.folders;
    }
};

export default FileServices;