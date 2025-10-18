import path from "path";
import prisma from "../config/prisma";
import fs from "fs";
import { fileQueue } from "../queues/file.queue";
import { NotFoundError } from "../utils/errors";

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

    // enqueue background job
    await fileQueue.add("processFile", { fileId: file.id, path: file.path }, { attempts: 2 });

    return file;
  };

  public getFiles = async (workspaceId: string, folderId: string) => {
    const files = await prisma.file.findMany({
      where: { workspaceId, folderId },
      include: { uploader: true },
    });

    return files;
  };

  public searchFileToDownload = async (workspaceId: string, folderId: string|undefined, fileId: string) => {
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
      throw new NotFoundError("Folder not found");
    }

    return folder;
  };

  public deleteFolder = async (folderId: string, workspaceId: string) => {
    await prisma.folder.delete({
      where: {
        id: folderId,
        workspaceId
      }
    })
  }

  public getFolderPath = async (folderId: string, workspaceId: string) => {
    let folder = await prisma.folder.findFirst({
      where: { workspaceId, id: folderId }
    })

    // if(!folder) throw new NotFoundError("Folder not found");

    const path = [];

    while(folder) {
      path.unshift({ id: folder.id, name: folder.name });
      if(!folder.parentId) {
        break;
      }
      folder = await prisma.folder.findFirst({
        where: { workspaceId, id: folder.parentId }
      })
    }

    return path
  }

  public assignFolderToTeam = async (folderId: string, teamId: string, workspaceId: string) => {
    const folder = await prisma.folder.update({
      where: {
        id: folderId,
        workspaceId
      },
      data: {
        teamId
      }
    })

    return folder;
  }

  public createTeamFolder = async (folderName: string, teamId: string, userId: string, workspaceId: string) => {
        const folder = await prisma.folder.create({
            data: {
                name: folderName,
                ownerId: userId,
                teamId: teamId,
                workspaceId
            }
        })

        return folder;
    }

  public teamFolders = async (teamId: string) => {
        const folders = await prisma.folder.findMany({
            where: {
                teamId
            }
        })
        return folders;
    }
}
