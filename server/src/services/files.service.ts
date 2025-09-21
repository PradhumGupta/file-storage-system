import path from "path";
import prisma from "../config/prisma";
import fs from "fs";

const dirname = path.resolve(process.cwd());

export class FileServices {
  public addFile = async (
    fileData: Express.Multer.File,
    workspaceId: string,
    folderId: string | undefined,
    userId: string
  ) => {
    const file = await prisma.file.create({
      data: {
        filename: fileData.originalname,
        type: fileData.mimetype,
        path: fileData.path || "",
        workspaceId,
        folderId: folderId || null,
        uploadedBy: userId,
      },
    });

    return file;
  };

  public getFiles = async (workspaceId: string, folderId: string) => {
    const files = await prisma.file.findMany({
      where: { workspaceId, folderId },
      include: { uploader: true },
    });

    return files;
  };

  public searchFileToDownload = async (workspaceId: string, fileId: string) => {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      // include: { Folder: { include: { owner: true } }, uploader: true }
    });

    if (!file) {
      throw new Error("File not found");
    }

    const filePath = path.join(dirname, file.path);

    console.log(filePath)

    try {
      await fs.promises.access(filePath);
    } catch {
      throw new Error("File missing in storage");
    }

    return { filePath, ...file };
  };

  public createNewFolder = async (
    folderName: string,
    parentFolderId: string | undefined,
    userId: string,
    workspaceId: string
  ) => {
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

  public listFolder = async (folderId: string, workspaceId: string) => {
    const folder = await prisma.folder.findFirst({
      where: { id: folderId },
      include: {
        subFolders: true,
        files: true,
      },
    });

    if (!folder) {
      throw new Error("Folder not found");
    }

    return folder;
  };
}
