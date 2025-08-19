import prisma from "../config/prisma"

export class FileServices {
    public addFile = async (fileData: Express.Multer.File, workspaceId: string, userId: string) => {
        const file = await prisma.file.create({
            data: {
                filename: fileData.originalname,
                type: fileData.mimetype,
                path: fileData.path || "",
                workspaceId,
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
}