import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { FileServices } from "../services/files.service";
import { z } from "zod";
import { BadRequestError } from "../utils/errors";

const workspaceIdSchema = z.object({
    workspaceId: z.string().min(5, "WorkspaceId is required")
});

const folderIdSchema = z.object({
    folderId: z.string().min(5, "folderId is required")
});

const folderAndWorkspaceIdSchema = z.object({
    workspaceId: z.string().min(5, "workspaceId is required"),
    folderId: z.string().min(5, "folderId is required")
});

const fileDownloadParamsSchema = z.object({
    workspaceId: z.string().min(5, "workspaceId is required"),
    fileId: z.string().min(5, "fileId is required")
});

const fileDownloadQuerySchema = z.object({
    folderId: z.string().optional()
});

const createFolderSchema = z.object({
    name: z.string().trim().min(1, "Folder name is required"),
    parentId: z.string().optional()
});

const optionalFolderIdBodySchema = z.object({
    folderId: z.string().optional()
});

const fileServices = new FileServices();

export class FileController {
    public static fileUpload = async (req: AuthRequest, res: Response, next: NextFunction) => {
        const { workspaceId } = workspaceIdSchema.parse(req.params);
        const { folderId } = optionalFolderIdBodySchema.parse(req.body);
        const userId = req.user?.id;

        if (!req.file) {
            throw new BadRequestError("No file uploaded");
        }

        const file = await fileServices.addFile(req.file as Express.Multer.File, workspaceId, folderId, userId as string);

        res.status(201).json({ status: "success", message: "File uploaded", file });
    }

    public static ListFiles = async (req: AuthRequest, res: Response, next: NextFunction) => {
        const { workspaceId, folderId } = folderAndWorkspaceIdSchema.parse(req.params);

        const files = await fileServices.getFiles(workspaceId, folderId);

        res.json(files);
    }

    public static fileDownload = async (req: AuthRequest, res: Response, next: NextFunction) => {
        const { workspaceId, fileId } = fileDownloadParamsSchema.parse(req.params);
        const { folderId } = fileDownloadQuerySchema.parse(req.query);

        const { buffer, contentType, fileName } =
            await fileServices.searchFileToDownload(
            workspaceId,
            folderId as string | undefined,
            fileId
            );

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

        res.send(buffer);
    }

    public static createFolder = async (req: AuthRequest, res: Response, next: NextFunction) => {
        const { workspaceId } = workspaceIdSchema.parse(req.params);
        const { name, parentId } = createFolderSchema.parse(req.body);

        const newFolder = await fileServices.createNewFolder(name, parentId, req.user?.id as string, workspaceId);

        res.json({ folder: newFolder });
    }

    public static deleteFolder = async (req: AuthRequest, res: Response, next: NextFunction) => {
        const { workspaceId, folderId } = folderAndWorkspaceIdSchema.parse(req.params);
        
        await fileServices.deleteFolder(folderId, workspaceId);

        res.json({ message: "Folder deleted successfully" });
    }

    public static showFolder = async (req: AuthRequest, res: Response) => {
        const { folderId, workspaceId } = folderAndWorkspaceIdSchema.parse(req.params);
        
        const folderDetails = await fileServices.listFolder(folderId, workspaceId);
        
        res.json({ message: "Fetched folder successfully", folder: folderDetails });
    }

    public static getPath = async (req: AuthRequest, res: Response) => {
        const { folderId, workspaceId } = folderAndWorkspaceIdSchema.parse(req.params);
        
        const folderPath = await fileServices.getFolderPath(folderId, workspaceId);
        
        res.json({ message: "Fetched folder path successfully", path: folderPath });
    }

    public static getFolders = async (req: AuthRequest, res: Response) => {
        const { workspaceId } = workspaceIdSchema.parse(req.params);
        
        const folders = await fileServices.getPublicFolders(workspaceId);
        
        res.json({ message: "Fetched folder path successfully", folders });
    }
}