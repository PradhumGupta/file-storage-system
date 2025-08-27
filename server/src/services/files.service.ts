import path from "path";
import prisma from "../config/prisma"
import fs from "fs";

export class FileServices {
    public addFile = async (fileData: Express.Multer.File, workspaceId: string, folderId: string, userId: string) => {
        const file = await prisma.file.create({
            data: {
                filename: fileData.originalname,
                type: fileData.mimetype,
                path: fileData.path || "",
                workspaceId,
                folderId,
                uploadedBy: userId
            }
        });

        return file;
    }

    public getFiles = async (workspaceId: string) => {
        const files = await prisma.file.findMany({
            where: { workspaceId }
        });

        return files;
    }

    public searchFileToDownload = async (fileId: string) => {
        const file = await prisma.file.findUnique({
            where: { id: fileId },
            // include: { Folder: { include: { owner: true } }, uploader: true }
        });

        if(!file) {
            throw new Error("File not found");
        }

        const filePath = path.join(__dirname, "../../uploads", file.path);

        if(!fs.existsSync(filePath)) {
            throw new Error("File missing in storage");
        }

        return { filePath, ...file }
    }

    public createNewFolder = async (folderName: string, parentFolderId: string, userId: string, workspaceId: string) => {
        const folder = await prisma.folder.create({
            data: {
                name: folderName,
                parentId: parentFolderId,
                ownerId: userId,
                workspaceId
            }
        });
        return folder;
    }

    public listFolder = async (folderId: string, workspaceId: string) => {
        const folder = await prisma.folder.findFirst({
            where: { id: folderId },
            include: {
                subFolders: true,
                files: true
            }
        });

        if (!folder) {
            throw new Error("Folder not found");
        }

        return folder;
    }
}