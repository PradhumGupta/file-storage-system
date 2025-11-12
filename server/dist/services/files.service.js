import path from "path";
import prisma from "../config/prisma";
// import { fileQueue } from "../queues/file.queue";
import { NotFoundError } from "../utils/errors";
import { supabase } from "../config/supabase";
const dirname = path.resolve(process.cwd());
export class FileServices {
    addFile = async (file, workspaceId, folderId, userId) => {
        const filePath = `workspace_${workspaceId}/${folderId || 'root'}/${Date.now()}_${file.originalname}`;
        const { data, error } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });
        if (error)
            throw error;
        const newFile = await prisma.file.create({
            data: {
                filename: file.originalname,
                type: file.mimetype,
                path: filePath,
                workspaceId,
                folderId: folderId || null,
                uploadedBy: userId,
            },
        });
        // enqueue background job
        // await fileQueue.add("processFile", { fileId: file.id, path: file.path }, { attempts: 2 });
        return newFile;
    };
    getFiles = async (workspaceId, folderId) => {
        const files = await prisma.file.findMany({
            where: { workspaceId, folderId },
            select: { uploader: { select: { id: true, name: true } } },
        });
        return files;
    };
    searchFileToDownload = async (workspaceId, folderId, fileId) => {
        const file = await prisma.file.findUnique({
            where: {
                folderId,
                id: fileId
            },
            // include: { Folder: { include: { owner: true } }, uploader: true }
        });
        if (!file) {
            throw new Error("File not found");
        }
        const { data, error } = await supabase.storage.from(process.env.SUPABASE_BUCKET).download(file.path);
        if (error) {
            console.error('Error downloading file:', error);
            throw error;
        }
        const buffer = Buffer.from(await data.arrayBuffer());
        // 3. Set the appropriate headers
        // For a real application, you'd get the correct mime-type.
        // Here, we guess based on extension for simplicity.
        const fileExtension = file.path.split('.').pop();
        const contentType = `application/${fileExtension}`; // Example: 'application/pdf' or 'image/jpeg'
        const fileName = file.path.split('/').pop();
        console.log("filename", fileName);
        return { buffer, contentType, fileName };
        /*
    
        // incase of multer local storage
    
        const filePath = path.join(dirname, file.path);
    
        console.log(filePath)
    
        try {
          await fs.promises.access(filePath);
        } catch {
          throw new Error("File missing in storage");
        }
    
        return { filePath, ...file };  */
    };
    createNewFolder = async (folderName, parentFolderId, userId, workspaceId) => {
        const folder = await prisma.folder.create({
            data: {
                name: folderName,
                parentId: parentFolderId || null,
                ownerId: userId,
                workspaceId,
            },
        });
        return folder;
    };
    listFolder = async (folderId, workspaceId) => {
        const folder = await prisma.folder.findFirst({
            where: { id: folderId },
            include: {
                subFolders: true,
                files: true,
            },
        });
        if (!folder) {
            throw new NotFoundError("Folder not found");
        }
        return folder;
    };
    deleteFolder = async (folderId, workspaceId) => {
        await prisma.folder.delete({
            where: {
                id: folderId,
                workspaceId
            }
        });
    };
    getFolderPath = async (folderId, workspaceId) => {
        let folder = await prisma.folder.findFirst({
            where: { workspaceId, id: folderId }
        });
        // if(!folder) throw new NotFoundError("Folder not found");
        const path = [];
        while (folder) {
            path.unshift({ id: folder.id, name: folder.name });
            if (!folder.parentId) {
                break;
            }
            folder = await prisma.folder.findFirst({
                where: { workspaceId, id: folder.parentId }
            });
        }
        return path;
    };
    assignFolderToTeam = async (folderIds, teamId, workspaceId) => {
        await prisma.folder.updateMany({
            where: {
                workspaceId,
                id: {
                    in: folderIds
                }
            },
            data: {
                teamId,
                access: "PRIVATE"
            }
        });
        return;
    };
    createTeamFolder = async (folderName, teamId, userId, workspaceId) => {
        const folder = await prisma.folder.create({
            data: {
                name: folderName,
                ownerId: userId,
                teamId: teamId,
                workspaceId
            }
        });
        return folder;
    };
    teamFolders = async (teamId) => {
        const folders = await prisma.folder.findMany({
            where: {
                teamId
            }
        });
        return folders;
    };
    getPublicFolders = async (workspaceId) => {
        const folders = await prisma.folder.findMany({
            where: {
                workspaceId: workspaceId,
                access: "PUBLIC"
            },
        });
        return folders;
    };
}
