import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { FileServices } from "../services/files.service";
import z, { file } from "zod";

const workspaceIdCheck = z.object({
    workspaceId: z.string().min(8, "WorkspaceId is required")
})

const folderIdCheck = z.object({
    folderId: z.string().min(8, "folderId is required")
})

const fileServices = new FileServices();

export class FileController {
    public static fileUpload = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { workspaceId } = req.params;
            const userId = req.user?.id;

            const {folderId} = req.body;

            workspaceIdCheck.parse({workspaceId});
            
            if(folderId) folderIdCheck.parse({folderId});

            if(!req.file) {
                console.log("No file upoloaded")
                return res.status(400).json({ message: "No file uploaded" });
            }

            const file = await fileServices.addFile(req.file as Express.Multer.File, workspaceId, folderId, userId as string);

            res.status(201).json({ status: "success", message: "File uploaded", file })
        } catch (error: any) {
            console.error("Error in file upload", error);
            res.json({ message: "file upload failed", error: error.message ?? "Server Error" });
        }
    }

    public static ListFiles = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const {workspaceId, folderId} = req.params;
            const userId = req.user?.id;

            workspaceIdCheck.parse({workspaceId});
            folderIdCheck.parse({folderId});

            const files = await fileServices.getFiles(workspaceId, folderId);

            res.json(files);
        } catch (error: any) {
            console.error("Error in fetching files", error);
            res.json({ message: "failed to fetch files", error: error.message ?? "Server Error" });
        }
    }

    public static fileDownload = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { workspaceId, fileId } = req.params;
            const { folderId } = req.query;
            const userId = req.user!.id;

            const parsed = workspaceIdCheck.parse({workspaceId});

            const file = await fileServices.searchFileToDownload(workspaceId, folderId as string|undefined, fileId);
            // res.download(file.path, file.filename)
            // res.download(file.downloadUrl)
            res.json({ message: "File downloaded", downloadUrl: file.downloadUrl })
        } catch (error: any) {
            console.error("Error in file download", error);
            res.json({ message: "file download failed", error: error.message ?? "Server Error" });
        }
    }

    public static createFolder = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { workspaceId } = req.params;
            const { name, parentId } = req.body;

            workspaceIdCheck.parse({workspaceId});

            const newFolder = await fileServices.createNewFolder(name, parentId, req.user?.id as string, workspaceId);

            res.json({ folder: newFolder});
        } catch (error: any) {
            console.error("Error in creating folder", error);
            res.json({ message: "failed to create folder", error: error.message ?? "Server Error" });
        }
    }

    public static deleteFolder = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { workspaceId, folderId } = req.params;
            await fileServices.deleteFolder(folderId, workspaceId);

            res.json({ message: "Folder deleted successfully" });
        } catch (error) {
            console.error("Error in deleting folder", error);
            next(error);
        }
    }

    public static showFolder = async (req: AuthRequest, res: Response) => {
        try {
            const { folderId, workspaceId } = req.params;
            const folderDetails = await fileServices.listFolder(folderId, workspaceId);
            res.json({ message: "Fetched folder successfully", folder: folderDetails });
        } catch (error: any) {
            console.error("Error in show folder controller", error);
            res.json({ message: "failed to show folder", error: error.message ?? "Server Error" });
        }
    }

    public static getPath = async (req: AuthRequest, res: Response) => {
        try {
            const { folderId, workspaceId } = req.params;
            const folderPath = await fileServices.getFolderPath(folderId, workspaceId);
            res.json({ message: "Fetched folder path successfully", path: folderPath });
        } catch (error: any) {
            console.error("Error in getPath controller", error);
            res.json({ message: "failed to getting path of folder", error: error.message ?? "Server Error" });
        }
    }
}